package com.banking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class JpaConfig {
    // JPA configuration is now handled by Spring Boot auto-configuration
    // via application.yml properties
}
