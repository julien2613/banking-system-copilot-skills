package com.banking.controller;

import com.banking.dto.request.TransferRequest;
import com.banking.dto.response.TransactionResponse;
import com.banking.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transferMoney(@Valid @RequestBody TransferRequest transferRequest) {
        return ResponseEntity.ok(transactionService.transferMoney(transferRequest));
    }

    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getTransactionHistory(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(transactionService.getTransactionHistory(pageable));
    }
}
