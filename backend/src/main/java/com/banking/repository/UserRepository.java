package com.banking.repository;

import com.banking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Modifying
    @Query("UPDATE User u SET u.failedAttempt = :failAttempts, u.lockTime = :lockTime WHERE u.email = :email")
    void updateFailedAttemptsAndLockTime(@Param("failAttempts") int failAttempts, 
                                        @Param("lockTime") LocalDateTime lockTime, 
                                        @Param("email") String email);
    
    @Modifying
    @Query("UPDATE User u SET u.accountNonLocked = :accountNonLocked, u.lockTime = :lockTime WHERE u.email = :email")
    void updateAccountLockStatus(@Param("accountNonLocked") boolean accountNonLocked,
                                @Param("lockTime") LocalDateTime lockTime,
                                @Param("email") String email);
}
