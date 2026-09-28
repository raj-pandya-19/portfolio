package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.ExperienceRequest;
import com.raj.portfolio.dto.response.ExperienceResponse;
import com.raj.portfolio.entity.Experience;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.ExperienceRepository;
import com.raj.portfolio.service.ExperienceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceServiceImpl(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    @Override
    public List<ExperienceResponse> getAllExperiences() {
        return experienceRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public ExperienceResponse createExperience(ExperienceRequest request) {
        Experience experience = new Experience();

        experience.setCompany(request.getCompany());
        experience.setRole(request.getRole());
        experience.setStartDate(request.getStartDate());
        experience.setEndDate(request.getEndDate());
        experience.setLocation(request.getLocation());
        experience.setDescription(request.getDescription());
        experience.setTechnologies(request.getTechnologies());
        experience.setCurrent(request.isCurrent());
        experience.setDisplayOrder(request.getDisplayOrder());

        Experience savedExperience = experienceRepository.save(experience);

        return convertToResponse(savedExperience);
    }

    @Override
    public ExperienceResponse getExperienceById(Long id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Experience not found with id: " + id
                        ));

        return convertToResponse(experience);
    }

    @Override
    public ExperienceResponse updateExperience(
            Long id,
            ExperienceRequest request) {

        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Experience not found with id: " + id
                        ));

        experience.setCompany(request.getCompany());
        experience.setRole(request.getRole());
        experience.setStartDate(request.getStartDate());
        experience.setEndDate(request.getEndDate());
        experience.setLocation(request.getLocation());
        experience.setDescription(request.getDescription());
        experience.setTechnologies(request.getTechnologies());
        experience.setCurrent(request.isCurrent());
        experience.setDisplayOrder(request.getDisplayOrder());

        Experience updatedExperience =
                experienceRepository.save(experience);

        return convertToResponse(updatedExperience);
    }

    @Override
    public void deleteExperience(Long id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Experience not found with id: " + id
                        ));

        experienceRepository.delete(experience);
    }

    private ExperienceResponse convertToResponse(
            Experience experience) {

        ExperienceResponse response = new ExperienceResponse();

        response.setId(experience.getId());
        response.setCompany(experience.getCompany());
        response.setRole(experience.getRole());
        response.setStartDate(experience.getStartDate());
        response.setEndDate(experience.getEndDate());
        response.setLocation(experience.getLocation());
        response.setDescription(experience.getDescription());
        response.setTechnologies(experience.getTechnologies());
        response.setCurrent(experience.isCurrent());
        response.setDisplayOrder(experience.getDisplayOrder());

        return response;
    }
}