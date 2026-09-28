package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.ContactRequest;
import com.raj.portfolio.dto.response.ContactResponse;

import java.util.List;

public interface ContactService {

    ContactResponse createContact(ContactRequest request);

    List<ContactResponse> getAllContacts();

    ContactResponse getContactById(Long id);
}