package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.TrainingRequest;
import com.raj.portfolio.dto.response.TrainingResponse;
import com.raj.portfolio.entity.Training;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.TrainingRepository;
import com.raj.portfolio.service.TrainingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingServiceImpl implements TrainingService {

    private final TrainingRepository trainingRepository;

    public TrainingServiceImpl(TrainingRepository trainingRepository) {
        this.trainingRepository = trainingRepository;
    }

    @Override
    public List<TrainingResponse> getAllTraining() {
        return trainingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TrainingResponse getTrainingById(Long id) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Training not found with id: " + id
                        )
                );

        return mapToResponse(training);
    }

    @Override
    public TrainingResponse createTraining(TrainingRequest request) {

        Training training = new Training();

        mapToEntity(request, training);

        return mapToResponse(
                trainingRepository.save(training)
        );
    }

    @Override
    public TrainingResponse updateTraining(
            Long id,
            TrainingRequest request
    ) {

        Training training = trainingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Training not found with id: " + id
                        )
                );

        mapToEntity(request, training);

        return mapToResponse(
                trainingRepository.save(training)
        );
    }

    @Override
    public void deleteTraining(Long id) {

        Training training = trainingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Training not found with id: " + id
                        )
                );

        trainingRepository.delete(training);
    }

    private void mapToEntity(
            TrainingRequest request,
            Training training
    ) {

        training.setTitle(request.getTitle());
        training.setOrganization(request.getOrganization());
        training.setStartDate(request.getStartDate());
        training.setEndDate(request.getEndDate());
        training.setLocation(request.getLocation());
        training.setDescription(request.getDescription());
        training.setCertificateUrl(request.getCertificateUrl());
        training.setDisplayOrder(request.getDisplayOrder());
        training.setCurrent(request.isCurrent());
    }

    private TrainingResponse mapToResponse(
            Training training
    ) {

        TrainingResponse response = new TrainingResponse();

        response.setId(training.getId());
        response.setTitle(training.getTitle());
        response.setOrganization(training.getOrganization());
        response.setStartDate(training.getStartDate());
        response.setEndDate(training.getEndDate());
        response.setLocation(training.getLocation());
        response.setDescription(training.getDescription());
        response.setCertificateUrl(training.getCertificateUrl());
        response.setDisplayOrder(training.getDisplayOrder());
        response.setCurrent(training.isCurrent());

        return response;
    }
}