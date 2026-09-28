package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.LearningItemRequest;
import com.raj.portfolio.dto.response.LearningItemResponse;

import java.util.List;

public interface LearningItemService {

    List<LearningItemResponse> getAllLearningItems();

    LearningItemResponse getLearningItemById(Long id);

    LearningItemResponse createLearningItem(LearningItemRequest request);

    LearningItemResponse updateLearningItem(
            Long id,
            LearningItemRequest request
    );

    void deleteLearningItem(Long id);
}