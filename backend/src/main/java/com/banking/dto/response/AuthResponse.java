package com.banking.dto.response;

import com.banking.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer ";
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private BigDecimal balance;
}
