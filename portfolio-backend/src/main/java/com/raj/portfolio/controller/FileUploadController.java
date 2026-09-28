package com.raj.portfolio.controller;

import com.raj.portfolio.service.FileStorageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    // =========================
    // ADMIN-ONLY IMAGE UPLOAD
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) {

        String fileUrl = fileStorageService.storeImage(file);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Image uploaded successfully",
                        "url", fileUrl
                )
        );
    }

    // =========================
    // ADMIN-ONLY PDF UPLOAD
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(value = "/pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadPdf(
            @RequestParam("file") MultipartFile file) {

        String fileUrl = fileStorageService.storePdf(file);

        return ResponseEntity.ok(
                Map.of(
                        "message", "PDF uploaded successfully",
                        "url", fileUrl
                )
        );
    }

    // =========================
    // ADMIN-ONLY RESUME UPLOAD
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file) {

        String fileUrl = fileStorageService.storePdf(file);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Resume uploaded successfully",
                        "url", fileUrl
                )
        );
    }
}