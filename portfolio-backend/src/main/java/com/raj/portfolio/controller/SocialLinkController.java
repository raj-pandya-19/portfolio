package com.raj.portfolio.controller;

import com.raj.portfolio.dto.request.SocialLinkRequest;
import com.raj.portfolio.dto.response.SocialLinkResponse;
import com.raj.portfolio.service.SocialLinkService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social-links")
public class SocialLinkController {

    private final SocialLinkService socialLinkService;

    public SocialLinkController(SocialLinkService socialLinkService) {
        this.socialLinkService = socialLinkService;
    }

    // =========================
    // PUBLIC GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<SocialLinkResponse>> getAllSocialLinks() {
        return ResponseEntity.ok(
                socialLinkService.getAllSocialLinks()
        );
    }

    // =========================
    // PUBLIC GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<SocialLinkResponse> getSocialLinkById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                socialLinkService.getSocialLinkById(id)
        );
    }

    // =========================
    // ADMIN-ONLY CREATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<SocialLinkResponse> createSocialLink(
            @Valid @RequestBody SocialLinkRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(socialLinkService.createSocialLink(request));
    }

    // =========================
    // ADMIN-ONLY UPDATE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<SocialLinkResponse> updateSocialLink(
            @PathVariable Long id,
            @Valid @RequestBody SocialLinkRequest request) {

        return ResponseEntity.ok(
                socialLinkService.updateSocialLink(id, request)
        );
    }

    // =========================
    // ADMIN-ONLY DELETE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSocialLink(
            @PathVariable Long id) {

        socialLinkService.deleteSocialLink(id);

        return ResponseEntity.noContent().build();
    }
}