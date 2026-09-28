package com.raj.portfolio.controller;

import com.raj.portfolio.dto.request.ExperienceRequest;
import com.raj.portfolio.dto.response.ExperienceResponse;
import com.raj.portfolio.service.ExperienceService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    // =========================
    // PUBLIC GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<ExperienceResponse>> getAllExperiences() {
        return ResponseEntity.ok(
                experienceService.getAllExperiences()
        );
    }

    // =========================
    // ADMIN-ONLY CREATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<ExperienceResponse> createExperience(
            @Valid @RequestBody ExperienceRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(experienceService.createExperience(request));
    }

    // =========================
    // PUBLIC GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<ExperienceResponse> getExperienceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                experienceService.getExperienceById(id)
        );
    }

    // =========================
    // ADMIN-ONLY UPDATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<ExperienceResponse> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceRequest request) {

        return ResponseEntity.ok(
                experienceService.updateExperience(id, request)
        );
    }

    // =========================
    // ADMIN-ONLY DELETE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(
            @PathVariable Long id) {

        experienceService.deleteExperience(id);

        return ResponseEntity.noContent().build();
    }
}