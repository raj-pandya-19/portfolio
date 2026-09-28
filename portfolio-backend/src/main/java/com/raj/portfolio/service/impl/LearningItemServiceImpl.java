package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.LearningItemRequest;
import com.raj.portfolio.dto.response.LearningItemResponse;
import com.raj.portfolio.entity.LearningItem;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.LearningItemRepository;
import com.raj.portfolio.service.LearningItemService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningItemServiceImpl implements LearningItemService {

    private final LearningItemRepository learningItemRepository;

    public LearningItemServiceImpl(
            LearningItemRepository learningItemRepository
    ) {
        this.learningItemRepository = learningItemRepository;
    }

    @Override
    public List<LearningItemResponse> getAllLearningItems() {
        return learningItemRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public LearningItemResponse getLearningItemById(Long id) {
        LearningItem learningItem = learningItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Learning item not found with id: " + id
                        )
                );

        return mapToResponse(learningItem);
    }

    @Override
    public LearningItemResponse createLearningItem(
            LearningItemRequest request
    ) {
        LearningItem learningItem = new LearningItem();

        mapToEntity(request, learningItem);

        return mapToResponse(
                learningItemRepository.save(learningItem)
        );
    }

    @Override
    public LearningItemResponse updateLearningItem(
            Long id,
            LearningItemRequest request
    ) {
        LearningItem learningItem = learningItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Learning item not found with id: " + id
                        )
                );

        mapToEntity(request, learningItem);

        return mapToResponse(
                learningItemRepository.save(learningItem)
        );
    }

    @Override
    public void deleteLearningItem(Long id) {
        LearningItem learningItem = learningItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Learning item not found with id: " + id
                        )
                );

        learningItemRepository.delete(learningItem);
    }

    private void mapToEntity(
            LearningItemRequest request,
            LearningItem learningItem
    ) {
        learningItem.setTitle(request.getTitle());
        learningItem.setCategory(request.getCategory());
        learningItem.setDescription(request.getDescription());
        learningItem.setStatus(request.getStatus());
        learningItem.setStartDate(request.getStartDate());
        learningItem.setTargetDate(request.getTargetDate());
        learningItem.setDisplayOrder(request.getDisplayOrder());
        learningItem.setVisible(request.isVisible());
    }

    private LearningItemResponse mapToResponse(
            LearningItem learningItem
    ) {
        LearningItemResponse response = new LearningItemResponse();

        response.setId(learningItem.getId());
        response.setTitle(learningItem.getTitle());
        response.setCategory(learningItem.getCategory());
        response.setDescription(learningItem.getDescription());
        response.setStatus(learningItem.getStatus());
        response.setStartDate(learningItem.getStartDate());
        response.setTargetDate(learningItem.getTargetDate());
        response.setDisplayOrder(learningItem.getDisplayOrder());
        response.setVisible(learningItem.isVisible());

        return response;
    }
}