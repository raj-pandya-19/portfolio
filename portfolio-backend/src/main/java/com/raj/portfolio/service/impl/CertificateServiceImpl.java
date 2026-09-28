package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.CertificateRequest;
import com.raj.portfolio.dto.response.CertificateResponse;
import com.raj.portfolio.entity.Certificate;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.CertificateRepository;
import com.raj.portfolio.service.CertificateService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;

    public CertificateServiceImpl(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    @Override
    public List<CertificateResponse> getAllCertificates() {
        return certificateRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public CertificateResponse createCertificate(CertificateRequest request) {
        Certificate certificate = new Certificate();

        certificate.setTitle(request.getTitle());
        certificate.setIssuingOrganization(request.getIssuingOrganization());
        certificate.setIssueDate(request.getIssueDate());
        certificate.setExpiryDate(request.getExpiryDate());
        certificate.setCredentialId(request.getCredentialId());
        certificate.setCredentialUrl(request.getCredentialUrl());
        certificate.setCertificateUrl(request.getCertificateUrl());
        certificate.setDescription(request.getDescription());
        certificate.setDisplayOrder(request.getDisplayOrder());

        Certificate savedCertificate = certificateRepository.save(certificate);

        return convertToResponse(savedCertificate);
    }

    @Override
    public CertificateResponse getCertificateById(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Certificate not found with id: " + id
                        ));

        return convertToResponse(certificate);
    }

    @Override
    public CertificateResponse updateCertificate(
            Long id,
            CertificateRequest request) {

        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Certificate not found with id: " + id
                        ));

        certificate.setTitle(request.getTitle());
        certificate.setIssuingOrganization(request.getIssuingOrganization());
        certificate.setIssueDate(request.getIssueDate());
        certificate.setExpiryDate(request.getExpiryDate());
        certificate.setCredentialId(request.getCredentialId());
        certificate.setCredentialUrl(request.getCredentialUrl());
        certificate.setCertificateUrl(request.getCertificateUrl());
        certificate.setDescription(request.getDescription());
        certificate.setDisplayOrder(request.getDisplayOrder());

        Certificate updatedCertificate =
                certificateRepository.save(certificate);

        return convertToResponse(updatedCertificate);
    }

    @Override
    public void deleteCertificate(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Certificate not found with id: " + id
                        ));

        certificateRepository.delete(certificate);
    }

    private CertificateResponse convertToResponse(Certificate certificate) {
        CertificateResponse response = new CertificateResponse();

        response.setId(certificate.getId());
        response.setTitle(certificate.getTitle());
        response.setIssuingOrganization(
                certificate.getIssuingOrganization()
        );
        response.setIssueDate(certificate.getIssueDate());
        response.setExpiryDate(certificate.getExpiryDate());
        response.setCredentialId(certificate.getCredentialId());
        response.setCredentialUrl(certificate.getCredentialUrl());
        response.setCertificateUrl(certificate.getCertificateUrl());
        response.setDescription(certificate.getDescription());
        response.setDisplayOrder(certificate.getDisplayOrder());

        return response;
    }
}