package com.raj.portfolio.integration;
import tools.jackson.databind.ObjectMapper;
import com.raj.portfolio.dto.request.ProjectRequest;
import com.raj.portfolio.entity.Project;
import com.raj.portfolio.repository.ProjectRepository;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProjectIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void createProject_shouldCreateProjectInDatabase() throws Exception {

        ProjectRequest request = new ProjectRequest();

        request.setTitle("Integration Test Project");
        request.setDescription("Project created through integration test");
        request.setTechnologies("Java, Spring Boot, PostgreSQL, React.js");
        request.setGithubUrl("https://github.com/example/project");
        request.setLiveUrl("https://example.com");
        request.setImageUrl("https://example.com/image.png");
        request.setDisplayOrder(1);
        request.setPublished(true);

        mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title")
                        .value("Integration Test Project"))
                .andExpect(jsonPath("$.technologies")
                        .value("Java, Spring Boot, PostgreSQL, React.js"));

        long count = projectRepository.count();

        org.junit.jupiter.api.Assertions.assertEquals(1, count);
    }

    @Test
    void getProjectById_shouldReturnProject() throws Exception {

        ProjectRequest request = new ProjectRequest();
        request.setTitle("GET Integration Test");
        request.setDescription("Testing GET endpoint with PostgreSQL");
        request.setTechnologies("Java, Spring Boot, PostgreSQL");
        request.setGithubUrl("https://github.com/example/get-test");
        request.setLiveUrl("https://example.com");
        request.setImageUrl("https://example.com/image.png");
        request.setDisplayOrder(1);
        request.setPublished(true);

        String response = mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long projectId = objectMapper
                .readTree(response)
                .get("id")
                .asLong();

        mockMvc.perform(
                        get("/api/projects/" + projectId)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId))
                .andExpect(jsonPath("$.title").value("GET Integration Test"))
                .andExpect(jsonPath("$.description")
                        .value("Testing GET endpoint with PostgreSQL"))
                .andExpect(jsonPath("$.technologies")
                        .value("Java, Spring Boot, PostgreSQL"));
    }

    @Test
    void updateProject_shouldUpdateProjectInDatabase() throws Exception {

        // Create project first
        ProjectRequest createRequest = new ProjectRequest();
        createRequest.setTitle("Original Project");
        createRequest.setDescription("Original description");
        createRequest.setTechnologies("Java, Spring Boot");
        createRequest.setGithubUrl("https://github.com/example/original");
        createRequest.setLiveUrl("https://example.com/original");
        createRequest.setImageUrl("https://example.com/original.png");
        createRequest.setDisplayOrder(1);
        createRequest.setPublished(true);

        String response = mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(createRequest))
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long projectId = objectMapper
                .readTree(response)
                .get("id")
                .asLong();

        // Update project
        ProjectRequest updateRequest = new ProjectRequest();
        updateRequest.setTitle("Updated Project");
        updateRequest.setDescription("Updated description");
        updateRequest.setTechnologies("Java, Spring Boot, PostgreSQL");
        updateRequest.setGithubUrl("https://github.com/example/updated");
        updateRequest.setLiveUrl("https://example.com/updated");
        updateRequest.setImageUrl("https://example.com/updated.png");
        updateRequest.setDisplayOrder(2);
        updateRequest.setPublished(false);

        mockMvc.perform(
                        put("/api/projects/" + projectId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(projectId))
                .andExpect(jsonPath("$.title").value("Updated Project"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.technologies")
                        .value("Java, Spring Boot, PostgreSQL"))
                .andExpect(jsonPath("$.displayOrder").value(2))
                .andExpect(jsonPath("$.published").value(false));

        // Verify the updated data in the database
        Project updatedProject = projectRepository.findById(projectId)
                .orElseThrow();

        org.junit.jupiter.api.Assertions.assertEquals(
                "Updated Project",
                updatedProject.getTitle()
        );

        org.junit.jupiter.api.Assertions.assertEquals(
                "Updated description",
                updatedProject.getDescription()
        );

        org.junit.jupiter.api.Assertions.assertEquals(
                2,
                updatedProject.getDisplayOrder()
        );

        org.junit.jupiter.api.Assertions.assertFalse(
                updatedProject.isPublished()
        );
    }
    @Test
    void deleteProject_shouldDeleteProjectFromDatabase() throws Exception {

        // Create project first
        ProjectRequest request = new ProjectRequest();
        request.setTitle("Delete Integration Test");
        request.setDescription("Project that will be deleted");
        request.setTechnologies("Java, Spring Boot, PostgreSQL");
        request.setGithubUrl("https://github.com/example/delete-test");
        request.setLiveUrl("https://example.com/delete-test");
        request.setImageUrl("https://example.com/delete-test.png");
        request.setDisplayOrder(1);
        request.setPublished(true);

        String response = mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long projectId = objectMapper
                .readTree(response)
                .get("id")
                .asLong();

        // Verify project exists before deletion
        org.junit.jupiter.api.Assertions.assertTrue(
                projectRepository.existsById(projectId)
        );

        // Delete project
        mockMvc.perform(
                        delete("/api/projects/" + projectId)
                )
                .andExpect(status().isOk());

        // Verify project was deleted from the database
        org.junit.jupiter.api.Assertions.assertFalse(
                projectRepository.existsById(projectId)
        );

        // Verify GET now returns 404
        mockMvc.perform(
                        get("/api/projects/" + projectId)
                )
                .andExpect(status().isNotFound());
    }
}