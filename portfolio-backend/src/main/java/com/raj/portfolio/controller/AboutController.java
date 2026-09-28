package com.raj.portfolio.controller;

import com.raj.portfolio.dto.request.AboutRequest;
import com.raj.portfolio.dto.response.AboutResponse;
import com.raj.portfolio.service.AboutService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/about")
public class AboutController {

    private final AboutService aboutService;

    public AboutController(AboutService aboutService) {
        this.aboutService = aboutService;
    }

    // =========================
    // PUBLIC GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<AboutResponse>> getAllAbout() {
        return ResponseEntity.ok(
                aboutService.getAllAbout()
        );
    }

    // =========================
    // PUBLIC GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<AboutResponse> getAboutById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                aboutService.getAboutById(id)
        );
    }

    // =========================
    // ADMIN-ONLY CREATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<AboutResponse> createAbout(
            @Valid @RequestBody AboutRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(aboutService.createAbout(request));
    }

    // =========================
    // ADMIN-ONLY UPDATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<AboutResponse> updateAbout(
            @PathVariable Long id,
            @Valid @RequestBody AboutRequest request) {

        return ResponseEntity.ok(
                aboutService.updateAbout(id, request)
        );
    }

    // =========================
    // ADMIN-ONLY DELETE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAbout(
            @PathVariable Long id) {

        aboutService.deleteAbout(id);

        return ResponseEntity.noContent().build();
    }
}