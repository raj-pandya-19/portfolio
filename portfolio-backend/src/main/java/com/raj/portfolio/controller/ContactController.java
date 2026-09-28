package com.raj.portfolio.controller;

import com.raj.portfolio.dto.request.ContactRequest;
import com.raj.portfolio.dto.response.ContactResponse;
import com.raj.portfolio.service.ContactService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // =========================
    // PUBLIC CONTACT SUBMISSION
    // =========================
    @PostMapping
    public ResponseEntity<ContactResponse> createContact(
            @Valid @RequestBody ContactRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(contactService.createContact(request));
    }

    // =========================
    // ADMIN-ONLY CONTACT ACCESS
    // =========================
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                contactService.getContactById(id)
        );
    }
}