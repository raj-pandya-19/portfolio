package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.ContactRequest;
import com.raj.portfolio.dto.response.ContactResponse;
import com.raj.portfolio.entity.Contact;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.ContactRepository;
import com.raj.portfolio.service.ContactService;
import com.raj.portfolio.service.EmailNotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final EmailNotificationService emailNotificationService;

    public ContactServiceImpl(
            ContactRepository contactRepository,
            EmailNotificationService emailNotificationService
    ) {
        this.contactRepository = contactRepository;
        this.emailNotificationService = emailNotificationService;
    }

    @Override
    public ContactResponse createContact(ContactRequest request) {

        Contact contact = new Contact();

        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setSubject(request.getSubject());
        contact.setMessage(request.getMessage());

        Contact savedContact = contactRepository.save(contact);

        // Send email notification after the contact is successfully saved.
        emailNotificationService.sendContactNotification(savedContact);

        return convertToResponse(savedContact);
    }

    @Override
    public List<ContactResponse> getAllContacts() {

        return contactRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public ContactResponse getContactById(Long id) {

        Contact contact = contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found with id: " + id
                        )
                );

        return convertToResponse(contact);
    }

    private ContactResponse convertToResponse(Contact contact) {

        ContactResponse response = new ContactResponse();

        response.setId(contact.getId());
        response.setName(contact.getName());
        response.setEmail(contact.getEmail());
        response.setSubject(contact.getSubject());
        response.setMessage(contact.getMessage());

        return response;
    }
}