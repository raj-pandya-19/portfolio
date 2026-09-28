package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.EducationRequest;
import com.raj.portfolio.dto.response.EducationResponse;

import java.util.List;

public interface EducationService {

    List<EducationResponse> getAllEducations();

    EducationResponse createEducation(EducationRequest request);

    EducationResponse getEducationById(Long id);

    EducationResponse updateEducation(Long id, EducationRequest request);

    void deleteEducation(Long id);
}