package com.raj.portfolio.controller;

import com.raj.portfolio.dto.request.TrainingRequest;
import com.raj.portfolio.dto.response.TrainingResponse;
import com.raj.portfolio.service.TrainingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    // =========================
    // PUBLIC GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<TrainingResponse>> getAllTraining() {
        return ResponseEntity.ok(
                trainingService.getAllTraining()
        );
    }

    // =========================
    // PUBLIC GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<TrainingResponse> getTrainingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                trainingService.getTrainingById(id)
        );
    }

    // =========================
    // ADMIN-ONLY CREATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<TrainingResponse> createTraining(
            @Valid @RequestBody TrainingRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(trainingService.createTraining(request));
    }

    // =========================
    // ADMIN-ONLY UPDATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<TrainingResponse> updateTraining(
            @PathVariable Long id,
            @Valid @RequestBody TrainingRequest request) {

        return ResponseEntity.ok(
                trainingService.updateTraining(id, request)
        );
    }

    // =========================
    // ADMIN-ONLY DELETE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(
            @PathVariable Long id) {

        trainingService.deleteTraining(id);

        return ResponseEntity.noContent().build();
    }
}