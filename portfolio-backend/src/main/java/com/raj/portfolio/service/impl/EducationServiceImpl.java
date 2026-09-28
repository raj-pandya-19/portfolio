package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.EducationRequest;
import com.raj.portfolio.dto.response.EducationResponse;
import com.raj.portfolio.entity.Education;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.EducationRepository;
import com.raj.portfolio.service.EducationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;

    public EducationServiceImpl(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    @Override
    public List<EducationResponse> getAllEducations() {
        return educationRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public EducationResponse createEducation(EducationRequest request) {
        Education education = new Education();

        education.setInstitution(request.getInstitution());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setStartDate(request.getStartDate());
        education.setEndDate(request.getEndDate());
        education.setLocation(request.getLocation());
        education.setGrade(request.getGrade());
        education.setDescription(request.getDescription());
        education.setDisplayOrder(request.getDisplayOrder());

        Education savedEducation = educationRepository.save(education);

        return convertToResponse(savedEducation);
    }

    @Override
    public EducationResponse getEducationById(Long id) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Education not found with id: " + id
                        ));

        return convertToResponse(education);
    }

    @Override
    public EducationResponse updateEducation(
            Long id,
            EducationRequest request) {

        Education education = educationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Education not found with id: " + id
                        ));

        education.setInstitution(request.getInstitution());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setStartDate(request.getStartDate());
        education.setEndDate(request.getEndDate());
        education.setLocation(request.getLocation());
        education.setGrade(request.getGrade());
        education.setDescription(request.getDescription());
        education.setDisplayOrder(request.getDisplayOrder());

        Education updatedEducation =
                educationRepository.save(education);

        return convertToResponse(updatedEducation);
    }

    @Override
    public void deleteEducation(Long id) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Education not found with id: " + id
                        ));

        educationRepository.delete(education);
    }

    private EducationResponse convertToResponse(Education education) {
        EducationResponse response = new EducationResponse();

        response.setId(education.getId());
        response.setInstitution(education.getInstitution());
        response.setDegree(education.getDegree());
        response.setFieldOfStudy(education.getFieldOfStudy());
        response.setStartDate(education.getStartDate());
        response.setEndDate(education.getEndDate());
        response.setLocation(education.getLocation());
        response.setGrade(education.getGrade());
        response.setDescription(education.getDescription());
        response.setDisplayOrder(education.getDisplayOrder());

        return response;
    }
}