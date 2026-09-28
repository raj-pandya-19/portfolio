package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.ProjectRequest;
import com.raj.portfolio.dto.response.ProjectResponse;
import com.raj.portfolio.entity.Project;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.ProjectRepository;
import com.raj.portfolio.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project project;
    private ProjectRequest request;

    @BeforeEach
    void setUp() {

        request = new ProjectRequest();

        request.setTitle("Portfolio Management System");
        request.setDescription("Dynamic portfolio application");
        request.setTechnologies("Java, Spring Boot, PostgreSQL, React.js");
        request.setGithubUrl("https://github.com/example/portfolio");
        request.setLiveUrl("https://example.com");
        request.setImageUrl("https://example.com/image.png");
        request.setDisplayOrder(1);
        request.setPublished(true);

        project = new Project();

        project.setId(1L);
        project.setTitle("Portfolio Management System");
        project.setDescription("Dynamic portfolio application");
        project.setTechnologies("Java, Spring Boot, PostgreSQL, React.js");
        project.setGithubUrl("https://github.com/example/portfolio");
        project.setLiveUrl("https://example.com");
        project.setImageUrl("https://example.com/image.png");
        project.setDisplayOrder(1);
        project.setPublished(true);
    }

    @Test
    void getAllProjects_shouldReturnProjects() {

        when(projectRepository.findAll())
                .thenReturn(List.of(project));

        List<ProjectResponse> result =
                projectService.getAllProjects();

        assertNotNull(result);
        assertEquals(1, result.size());

        assertEquals(
                "Portfolio Management System",
                result.get(0).getTitle()
        );

        assertEquals(
                "Dynamic portfolio application",
                result.get(0).getDescription()
        );

        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void getAllProjects_whenNoProjects_shouldReturnEmptyList() {

        when(projectRepository.findAll())
                .thenReturn(List.of());

        List<ProjectResponse> result =
                projectService.getAllProjects();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void createProject_shouldCreateProject() {

        when(projectRepository.save(any(Project.class)))
                .thenReturn(project);

        ProjectResponse result =
                projectService.createProject(request);

        assertNotNull(result);

        assertEquals(1L, result.getId());
        assertEquals(
                "Portfolio Management System",
                result.getTitle()
        );
        assertEquals(
                "Dynamic portfolio application",
                result.getDescription()
        );
        assertEquals(
                "Java, Spring Boot, PostgreSQL, React.js",
                result.getTechnologies()
        );
        assertTrue(result.isPublished());

        verify(projectRepository, times(1))
                .save(any(Project.class));
    }

    @Test
    void getProjectById_shouldReturnProject() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        ProjectResponse result =
                projectService.getProjectById(1L);

        assertNotNull(result);

        assertEquals(1L, result.getId());
        assertEquals(
                "Portfolio Management System",
                result.getTitle()
        );

        verify(projectRepository, times(1))
                .findById(1L);
    }

    @Test
    void getProjectById_whenProjectDoesNotExist_shouldThrowException() {

        when(projectRepository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> projectService.getProjectById(99L)
                );

        assertEquals(
                "Project not found with id: 99",
                exception.getMessage()
        );

        verify(projectRepository, times(1))
                .findById(99L);
    }

    @Test
    void updateProject_shouldUpdateProject() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(projectRepository.save(any(Project.class)))
                .thenReturn(project);

        request.setTitle("Updated Portfolio System");
        request.setDescription("Updated description");

        ProjectResponse result =
                projectService.updateProject(1L, request);

        assertNotNull(result);

        assertEquals(
                "Updated Portfolio System",
                result.getTitle()
        );

        assertEquals(
                "Updated description",
                result.getDescription()
        );

        verify(projectRepository, times(1))
                .findById(1L);

        verify(projectRepository, times(1))
                .save(any(Project.class));
    }

    @Test
    void updateProject_whenProjectDoesNotExist_shouldThrowException() {

        when(projectRepository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> projectService.updateProject(99L, request)
                );

        assertEquals(
                "Project not found with id: 99",
                exception.getMessage()
        );

        verify(projectRepository, times(1))
                .findById(99L);

        verify(projectRepository, never())
                .save(any(Project.class));
    }

    @Test
    void deleteProject_shouldDeleteProject() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        projectService.deleteProject(1L);

        verify(projectRepository, times(1))
                .findById(1L);

        verify(projectRepository, times(1))
                .delete(project);
    }

    @Test
    void deleteProject_whenProjectDoesNotExist_shouldThrowException() {

        when(projectRepository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> projectService.deleteProject(99L)
                );

        assertEquals(
                "Project not found with id: 99",
                exception.getMessage()
        );

        verify(projectRepository, times(1))
                .findById(99L);

        verify(projectRepository, never())
                .delete(any(Project.class));
    }
}