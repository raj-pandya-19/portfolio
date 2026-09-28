package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.SkillRequest;
import com.raj.portfolio.dto.response.SkillResponse;
import com.raj.portfolio.entity.Skill;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.SkillRepository;
import com.raj.portfolio.service.SkillService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    public SkillServiceImpl(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public SkillResponse createSkill(SkillRequest request) {
        Skill skill = new Skill();

        skill.setName(request.getName());
        skill.setCategory(request.getCategory());
        skill.setProficiency(request.getProficiency());
        skill.setIconUrl(request.getIconUrl());
        skill.setDisplayOrder(request.getDisplayOrder());
        skill.setFeatured(request.isFeatured());

        Skill savedSkill = skillRepository.save(skill);

        return convertToResponse(savedSkill);
    }

    @Override
    public SkillResponse getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Skill not found with id: " + id
                        ));

        return convertToResponse(skill);
    }

    @Override
    public SkillResponse updateSkill(Long id, SkillRequest request) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Skill not found with id: " + id
                        ));

        skill.setName(request.getName());
        skill.setCategory(request.getCategory());
        skill.setProficiency(request.getProficiency());
        skill.setIconUrl(request.getIconUrl());
        skill.setDisplayOrder(request.getDisplayOrder());
        skill.setFeatured(request.isFeatured());

        Skill updatedSkill = skillRepository.save(skill);

        return convertToResponse(updatedSkill);
    }

    @Override
    public void deleteSkill(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Skill not found with id: " + id
                        ));

        skillRepository.delete(skill);
    }

    private SkillResponse convertToResponse(Skill skill) {
        SkillResponse response = new SkillResponse();

        response.setId(skill.getId());
        response.setName(skill.getName());
        response.setCategory(skill.getCategory());
        response.setProficiency(skill.getProficiency());
        response.setIconUrl(skill.getIconUrl());
        response.setDisplayOrder(skill.getDisplayOrder());
        response.setFeatured(skill.isFeatured());

        return response;
    }
}