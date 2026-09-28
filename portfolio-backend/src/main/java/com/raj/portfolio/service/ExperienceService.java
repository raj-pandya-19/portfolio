package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.ExperienceRequest;
import com.raj.portfolio.dto.response.ExperienceResponse;

import java.util.List;

public interface ExperienceService {

    List<ExperienceResponse> getAllExperiences();

    ExperienceResponse createExperience(ExperienceRequest request);

    ExperienceResponse getExperienceById(Long id);

    ExperienceResponse updateExperience(Long id, ExperienceRequest request);

    void deleteExperience(Long id);
}