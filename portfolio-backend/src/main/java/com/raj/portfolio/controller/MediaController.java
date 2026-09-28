package com.raj.portfolio.controller;

import com.raj.portfolio.entity.Media;
import com.raj.portfolio.service.MediaService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    // =========================
    // PUBLIC GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<Media>> getAllMedia() {
        return ResponseEntity.ok(
                mediaService.getAllMedia()
        );
    }

    // =========================
    // PUBLIC GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<Media> getMediaById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                mediaService.getMediaById(id)
        );
    }

    // =========================
    // ADMIN-ONLY DELETE
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable Long id) {

        mediaService.deleteMedia(id);

        return ResponseEntity.noContent().build();
    }
}
