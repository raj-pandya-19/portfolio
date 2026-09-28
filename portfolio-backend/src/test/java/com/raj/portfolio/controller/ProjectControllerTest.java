package com.raj.portfolio.controller;

import com.raj.portfolio.dto.request.ProjectRequest;
import com.raj.portfolio.dto.response.ProjectResponse;
import com.raj.portfolio.exception.GlobalExceptionHandler;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    private MockMvc mockMvc;


    private ProjectResponse projectResponse;

    private ProjectRequest projectRequest;

    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .standaloneSetup(projectController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();


        projectRequest = new ProjectRequest();

        projectRequest.setTitle("Portfolio Management System");
        projectRequest.setDescription("Dynamic portfolio application");
        projectRequest.setTechnologies(
                "Java, Spring Boot, PostgreSQL, React.js"
        );
        projectRequest.setGithubUrl(
                "https://github.com/example/portfolio"
        );
        projectRequest.setLiveUrl(
                "https://example.com"
        );
        projectRequest.setImageUrl(
                "https://example.com/image.png"
        );
        projectRequest.setDisplayOrder(1);
        projectRequest.setPublished(true);

        projectResponse = new ProjectResponse();

        projectResponse.setId(1L);
        projectResponse.setTitle("Portfolio Management System");
        projectResponse.setDescription("Dynamic portfolio application");
        projectResponse.setTechnologies(
                "Java, Spring Boot, PostgreSQL, React.js"
        );
        projectResponse.setGithubUrl(
                "https://github.com/example/portfolio"
        );
        projectResponse.setLiveUrl(
                "https://example.com"
        );
        projectResponse.setImageUrl(
                "https://example.com/image.png"
        );
        projectResponse.setDisplayOrder(1);
        projectResponse.setPublished(true);
    }

    @Test
    void getAllProjects_shouldReturnProjects() throws Exception {

        when(projectService.getAllProjects())
                .thenReturn(List.of(projectResponse));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title")
                        .value("Portfolio Management System"))
                .andExpect(jsonPath("$[0].published")
                        .value(true));

        verify(projectService, times(1))
                .getAllProjects();
    }

    @Test
    void createProject_shouldReturnCreatedProject() throws Exception {

        when(projectService.createProject(any(ProjectRequest.class)))
                .thenReturn(projectResponse);

        String json = """
            {
                "title": "Portfolio Management System",
                "description": "Dynamic portfolio application",
                "technologies": "Java, Spring Boot, PostgreSQL, React.js",
                "githubUrl": "https://github.com/example/portfolio",
                "liveUrl": "https://example.com",
                "imageUrl": "https://example.com/image.png",
                "displayOrder": 1,
                "published": true
            }
            """;

        mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title")
                        .value("Portfolio Management System"))
                .andExpect(jsonPath("$.technologies")
                        .value("Java, Spring Boot, PostgreSQL, React.js"));

        verify(projectService, times(1))
                .createProject(any(ProjectRequest.class));
    }

    @Test
    void getProjectById_shouldReturnProject() throws Exception {

        when(projectService.getProjectById(1L))
                .thenReturn(projectResponse);

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title")
                        .value("Portfolio Management System"));

        verify(projectService, times(1))
                .getProjectById(1L);
    }

    @Test
    void updateProject_shouldReturnUpdatedProject() throws Exception {

        when(projectService.updateProject(
                eq(1L),
                any(ProjectRequest.class)
        )).thenReturn(projectResponse);

        String json = """
            {
                "title": "Portfolio Management System",
                "description": "Dynamic portfolio application",
                "technologies": "Java, Spring Boot, PostgreSQL, React.js",
                "githubUrl": "https://github.com/example/portfolio",
                "liveUrl": "https://example.com",
                "imageUrl": "https://example.com/image.png",
                "displayOrder": 1,
                "published": true
            }
            """;

        mockMvc.perform(
                        put("/api/projects/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title")
                        .value("Portfolio Management System"));

        verify(projectService, times(1))
                .updateProject(eq(1L), any(ProjectRequest.class));
    }

    @Test
    void deleteProject_shouldReturnOk() throws Exception {

        doNothing()
                .when(projectService)
                .deleteProject(1L);

        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isOk());

        verify(projectService, times(1))
                .deleteProject(1L);
    }

    @Test
    void getProjectById_whenProjectDoesNotExist_shouldReturnNotFound()
            throws Exception {

        when(projectService.getProjectById(99L))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Project not found with id: 99"
                        )
                );

        mockMvc.perform(get("/api/projects/99"))
                .andExpect(status().isNotFound());

        verify(projectService, times(1))
                .getProjectById(99L);
    }
}