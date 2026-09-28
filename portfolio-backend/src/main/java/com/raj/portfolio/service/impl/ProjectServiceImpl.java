package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.ProjectRequest;
import com.raj.portfolio.dto.response.ProjectResponse;
import com.raj.portfolio.entity.Project;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.ProjectRepository;
import com.raj.portfolio.service.ProjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public List<ProjectResponse> getAllProjects() {

        return projectRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public ProjectResponse createProject(ProjectRequest request) {

        Project project = new Project();

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechnologies(request.getTechnologies());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveUrl(request.getLiveUrl());
        project.setImageUrl(request.getImageUrl());
        project.setDisplayOrder(request.getDisplayOrder());
        project.setPublished(request.isPublished());

        Project savedProject = projectRepository.save(project);

        return convertToResponse(savedProject);
    }
    @Override
    public ProjectResponse getProjectById(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found with id: " + id));

        return convertToResponse(project);
    }

    @Override
    public ProjectResponse updateProject(Long id, ProjectRequest request) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found with id: " + id));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechnologies(request.getTechnologies());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveUrl(request.getLiveUrl());
        project.setImageUrl(request.getImageUrl());
        project.setDisplayOrder(request.getDisplayOrder());
        project.setPublished(request.isPublished());

        Project updatedProject = projectRepository.save(project);

        return convertToResponse(updatedProject);
    }

    @Override
    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.delete(project);
    }

    private ProjectResponse convertToResponse(Project project) {

        ProjectResponse response = new ProjectResponse();

        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setTechnologies(project.getTechnologies());
        response.setGithubUrl(project.getGithubUrl());
        response.setLiveUrl(project.getLiveUrl());
        response.setImageUrl(project.getImageUrl());
        response.setDisplayOrder(project.getDisplayOrder());
        response.setPublished(project.isPublished());

        return response;
    }
}