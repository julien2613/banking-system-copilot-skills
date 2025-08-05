package com.banking.consumer;

import com.banking.events.TransactionEvent;
import com.banking.model.Transaction;
import com.banking.model.User;
import com.banking.model.enums.TransactionStatus;
import com.banking.repository.TransactionRepository;
import com.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class FraudDetectionConsumer {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    
    private static final BigDecimal SUSPICIOUS_AMOUNT = new BigDecimal("10000");
    private static final int MAX_ATTEMPTS = 5;
    
    @Async
    @KafkaListener(
            topics = "${app.kafka.topics.transactions}",
            groupId = "fraud-detection-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    @Transactional
    public void consumeTransaction(@Payload TransactionEvent event) {
        log.info("Received transaction event: {}", event);
        
        // Skip if not flagged as suspicious
        if (!event.isSuspicious()) {
            return;
        }
        
        Transaction transaction = transactionRepository.findById(event.getTransactionId())
                .orElseThrow(() -> new IllegalStateException("Transaction not found: " + event.getTransactionId()));
        
        // Check if transaction is already processed
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            return;
        }
        
        // Mark as flagged and notify admin
        transaction.setStatus(TransactionStatus.FLAGGED);
        transaction.setFlagged(true);
        transactionRepository.save(transaction);
        
        log.warn("Suspicious transaction detected: {}", transaction);
        // Here you would typically send a notification to admin
    }
    
    @KafkaListener(
            topics = "${app.kafka.topics.suspicious-transactions}",
            groupId = "fraud-alerts-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeSuspiciousTransaction(@Payload TransactionEvent event) {
        log.warn("ALERT: Suspicious transaction detected - {}", event);
        // Here you would typically send an email/SMS to admin
    }
    
    // Additional fraud detection logic can be added here
    private boolean isPotentialFraud(TransactionEvent event) {
        // Check for unusually large amount
        if (event.getAmount().compareTo(SUSPICIOUS_AMOUNT) > 0) {
            return true;
        }
        
        // Check for multiple transactions in short time
        User sender = userRepository.findById(event.getSenderId())
                .orElseThrow(() -> new IllegalStateException("Sender not found: " + event.getSenderId()));
        
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long recentTransactions = transactionRepository.countBySenderAndCreatedAtAfter(
                sender, oneHourAgo);
                
        return recentTransactions > MAX_ATTEMPTS;
    }
}
