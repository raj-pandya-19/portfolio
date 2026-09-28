package com.raj.portfolio.controller;

import com.raj.portfolio.dto.request.CertificateRequest;
import com.raj.portfolio.dto.response.CertificateResponse;
import com.raj.portfolio.service.CertificateService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // =========================
    // PUBLIC GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getAllCertificates() {
        return ResponseEntity.ok(
                certificateService.getAllCertificates()
        );
    }

    // =========================
    // ADMIN-ONLY CREATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<CertificateResponse> createCertificate(
            @Valid @RequestBody CertificateRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(certificateService.createCertificate(request));
    }

    // =========================
    // PUBLIC GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getCertificateById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                certificateService.getCertificateById(id)
        );
    }

    // =========================
    // ADMIN-ONLY UPDATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<CertificateResponse> updateCertificate(
            @PathVariable Long id,
            @Valid @RequestBody CertificateRequest request) {

        return ResponseEntity.ok(
                certificateService.updateCertificate(id, request)
        );
    }

    // =========================
    // ADMIN-ONLY DELETE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(
            @PathVariable Long id) {

        certificateService.deleteCertificate(id);

        return ResponseEntity.noContent().build();
    }
}
