package com.banking.repository;

import com.banking.model.Transaction;
import com.banking.model.User;
import com.banking.model.enums.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Count transactions by sender and created after a specific date
    long countBySenderAndCreatedAtAfter(User sender, LocalDateTime date);
    
    // Find transactions by status
    List<Transaction> findByStatus(TransactionStatus status);
    
    
    @Query("SELECT t FROM Transaction t WHERE (t.sender = :user OR t.receiver = :user) " +
           "AND (:startDate IS NULL OR t.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR t.createdAt <= :endDate) " +
           "AND (:status IS NULL OR t.status = :status) ")
    Page<Transaction> findUserTransactions(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") TransactionStatus status,
            Pageable pageable);

    @Query("SELECT SUM(t.amount) FROM Transaction t " +
           "WHERE t.sender = :user " +
           "AND t.status = 'COMPLETED' " +
           "AND t.createdAt >= :startDate " +
           "AND t.createdAt < :endDate")
    Double getTotalSentAmountByUserAndDateRange(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    boolean existsBySenderAndCreatedAtAfter(User sender, LocalDateTime dateTime);
}
