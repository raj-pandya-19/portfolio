package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.SkillRequest;
import com.raj.portfolio.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {

    List<SkillResponse> getAllSkills();

    SkillResponse createSkill(SkillRequest request);

    SkillResponse getSkillById(Long id);

    SkillResponse updateSkill(Long id, SkillRequest request);

    void deleteSkill(Long id);
}