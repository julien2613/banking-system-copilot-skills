package com.banking.security;

import com.banking.model.User;
import com.banking.model.enums.UserRole;
import com.banking.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class JwtAuthenticationTest {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @BeforeEach
    public void cleanup() {
        userRepository.deleteAll();
    }
    
    @Test
    public void whenValidToken_thenAuthenticationSucceeds() {
        // Create a test user
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setBalance(new BigDecimal("1000.00"));
        user.setRole(UserRole.USER);
        user = userRepository.save(user);
        
        // Generate token for the user
        String token = jwtService.generateToken(user.getEmail());
        
        // Verify the token
        assertThat(jwtService.isTokenValid(token, null)).isTrue();
        assertThat(jwtService.extractUsername(token)).isEqualTo(user.getEmail());
        
        // Create authentication
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            user.getEmail(), 
            null,
            user.getAuthorities()
        );
        
        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Verify the authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertThat(auth).isNotNull();
        assertThat(auth.getName()).isEqualTo(user.getEmail());
    }
}
