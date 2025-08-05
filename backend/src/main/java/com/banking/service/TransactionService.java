package com.banking.service;

import com.banking.dto.request.TransferRequest;
import com.banking.dto.response.TransactionResponse;
import com.banking.events.TransactionEvent;
import com.banking.exception.BadRequestException;
import com.banking.exception.InsufficientBalanceException;
import com.banking.model.Transaction;
import com.banking.model.User;
import com.banking.model.enums.TransactionStatus;
import com.banking.repository.TransactionRepository;
import com.banking.repository.UserRepository;
import com.banking.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, TransactionEvent> kafkaTemplate;
    
    private static final BigDecimal SUSPICIOUS_AMOUNT = new BigDecimal("10000");
    private static final int TRANSACTIONS_THRESHOLD = 5;
    private static final int TIME_WINDOW_MINUTES = 10;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public TransactionResponse transferMoney(TransferRequest transferRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // Cannot transfer to self
        if (userDetails.getId().equals(transferRequest.getReceiverId())) {
            throw new BadRequestException("Cannot transfer money to yourself");
        }

        User sender = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("Sender not found"));
        
        User receiver = userRepository.findById(transferRequest.getReceiverId())
                .orElseThrow(() -> new BadRequestException("Receiver not found"));
        
        BigDecimal amount = transferRequest.getAmount();
        
        // Check if sender has sufficient balance
        if (sender.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }
        
        // Check for suspicious activity
        boolean isSuspicious = amount.compareTo(SUSPICIOUS_AMOUNT) > 0 || 
                checkForSuspiciousActivity(sender, amount);
        
        // Create and save transaction
        Transaction transaction = Transaction.builder()
                .sender(sender)
                .receiver(receiver)
                .amount(amount)
                .status(TransactionStatus.PENDING)
                .isFlagged(isSuspicious)
                .build();
        
        transaction = transactionRepository.save(transaction);
        
        // Process the transaction
        if (!isSuspicious) {
            completeTransaction(transaction);
        } else {
            // Notify admin about suspicious transaction
            notifySuspiciousTransaction(transaction);
        }
        
        return mapToTransactionResponse(transaction);
    }
    
    private boolean checkForSuspiciousActivity(User sender, BigDecimal amount) {
        // Check for multiple transactions in a short time
        LocalDateTime tenMinutesAgo = LocalDateTime.now().minusMinutes(TIME_WINDOW_MINUTES);
        long recentTransactions = transactionRepository.countBySenderAndCreatedAtAfter(sender, tenMinutesAgo);
        
        return recentTransactions >= TRANSACTIONS_THRESHOLD;
    }
    
    @Transactional
    public void completeTransaction(Transaction transaction) {
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            return;
        }
        
        try {
            // Perform the transfer
            User sender = transaction.getSender();
            User receiver = transaction.getReceiver();
            BigDecimal amount = transaction.getAmount();
            
            sender.setBalance(sender.getBalance().subtract(amount));
            receiver.setBalance(receiver.getBalance().add(amount));
            
            userRepository.save(sender);
            userRepository.save(receiver);
            
            transaction.setStatus(TransactionStatus.COMPLETED);
            transactionRepository.save(transaction);
            
            // Publish transaction event
            publishTransactionEvent(transaction, "COMPLETED");
            
        } catch (Exception e) {
            log.error("Error processing transaction: {}", e.getMessage());
            transaction.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(transaction);
            
            // Publish failed event
            publishTransactionEvent(transaction, "FAILED");
        }
    }
    
    private void notifySuspiciousTransaction(Transaction transaction) {
        transaction.setStatus(TransactionStatus.FLAGGED);
        transactionRepository.save(transaction);
        
        // Publish suspicious transaction event
        publishTransactionEvent(transaction, "FLAGGED");
    }
    
    private void publishTransactionEvent(Transaction transaction, String status) {
        TransactionEvent event = TransactionEvent.builder()
                .transactionId(transaction.getId())
                .senderId(transaction.getSender().getId())
                .receiverId(transaction.getReceiver().getId())
                .amount(transaction.getAmount())
                .status(status)
                .timestamp(LocalDateTime.now())
                .isSuspicious(transaction.isFlagged())
                .build();
        
        kafkaTemplate.send("banking.transactions", event);
    }
    
    public Page<TransactionResponse> getTransactionHistory(Pageable pageable) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        return transactionRepository.findUserTransactions(
                user, null, null, null, pageable)
                .map(this::mapToTransactionResponse);
    }
    
    @Scheduled(fixedRate = 60000) // Run every minute
    public void processPendingTransactions() {
        List<Transaction> pendingTransactions = transactionRepository
                .findByStatus(TransactionStatus.PENDING);
        
        pendingTransactions.forEach(this::completeTransaction);
    }
    
    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .senderId(transaction.getSender().getId())
                .senderName(transaction.getSender().getName())
                .receiverId(transaction.getReceiver().getId())
                .receiverName(transaction.getReceiver().getName())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .isFlagged(transaction.isFlagged())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
