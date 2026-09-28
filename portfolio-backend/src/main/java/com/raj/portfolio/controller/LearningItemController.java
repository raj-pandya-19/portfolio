package com.raj.portfolio.controller;

import com.raj.portfolio.dto.request.LearningItemRequest;
import com.raj.portfolio.dto.response.LearningItemResponse;
import com.raj.portfolio.service.LearningItemService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning")
public class LearningItemController {

    private final LearningItemService learningItemService;

    public LearningItemController(
            LearningItemService learningItemService
    ) {
        this.learningItemService = learningItemService;
    }

    // =========================
    // PUBLIC GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<LearningItemResponse>> getAllLearningItems() {
        return ResponseEntity.ok(
                learningItemService.getAllLearningItems()
        );
    }

    // =========================
    // PUBLIC GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<LearningItemResponse> getLearningItemById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                learningItemService.getLearningItemById(id)
        );
    }

    // =========================
    // ADMIN-ONLY CREATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<LearningItemResponse> createLearningItem(
            @Valid @RequestBody LearningItemRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(learningItemService.createLearningItem(request));
    }

    // =========================
    // ADMIN-ONLY UPDATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<LearningItemResponse> updateLearningItem(
            @PathVariable Long id,
            @Valid @RequestBody LearningItemRequest request
    ) {
        return ResponseEntity.ok(
                learningItemService.updateLearningItem(id, request)
        );
    }

    // =========================
    // ADMIN-ONLY DELETE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningItem(
            @PathVariable Long id
    ) {
        learningItemService.deleteLearningItem(id);

        return ResponseEntity.noContent().build();
    }
}