package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.TrainingRequest;
import com.raj.portfolio.dto.response.TrainingResponse;

import java.util.List;

public interface TrainingService {

    List<TrainingResponse> getAllTraining();

    TrainingResponse getTrainingById(Long id);

    TrainingResponse createTraining(TrainingRequest request);

    TrainingResponse updateTraining(Long id, TrainingRequest request);

    void deleteTraining(Long id);
}