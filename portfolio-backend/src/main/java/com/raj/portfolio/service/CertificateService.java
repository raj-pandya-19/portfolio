package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.CertificateRequest;
import com.raj.portfolio.dto.response.CertificateResponse;

import java.util.List;

public interface CertificateService {

    List<CertificateResponse> getAllCertificates();

    CertificateResponse createCertificate(CertificateRequest request);

    CertificateResponse getCertificateById(Long id);

    CertificateResponse updateCertificate(Long id, CertificateRequest request);

    void deleteCertificate(Long id);
}