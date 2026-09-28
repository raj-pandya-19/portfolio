package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.AboutRequest;
import com.raj.portfolio.dto.response.AboutResponse;
import com.raj.portfolio.entity.About;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.AboutRepository;
import com.raj.portfolio.service.AboutService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AboutServiceImpl implements AboutService {

    private final AboutRepository aboutRepository;

    public AboutServiceImpl(AboutRepository aboutRepository) {
        this.aboutRepository = aboutRepository;
    }

    @Override
    public List<AboutResponse> getAllAbout() {
        return aboutRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AboutResponse getAboutById(Long id) {
        About about = aboutRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("About information not found with id: " + id));

        return mapToResponse(about);
    }

    @Override
    public AboutResponse createAbout(AboutRequest request) {
        About about = new About();

        mapToEntity(request, about);

        About savedAbout = aboutRepository.save(about);

        return mapToResponse(savedAbout);
    }

    @Override
    public AboutResponse updateAbout(Long id, AboutRequest request) {
        About about = aboutRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("About information not found with id: " + id));

        mapToEntity(request, about);

        About updatedAbout = aboutRepository.save(about);

        return mapToResponse(updatedAbout);
    }

    @Override
    public void deleteAbout(Long id) {
        About about = aboutRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("About information not found with id: " + id));

        aboutRepository.delete(about);
    }

    private void mapToEntity(AboutRequest request, About about) {
        about.setTitle(request.getTitle());
        about.setShortDescription(request.getShortDescription());
        about.setFullDescription(request.getFullDescription());
        about.setProfileImageUrl(request.getProfileImageUrl());
        about.setLocation(request.getLocation());
        about.setEmail(request.getEmail());
        about.setPhone(request.getPhone());
        about.setGithubUrl(request.getGithubUrl());
        about.setLinkedinUrl(request.getLinkedinUrl());
        about.setResumeUrl(request.getResumeUrl());
    }

    private AboutResponse mapToResponse(About about) {
        AboutResponse response = new AboutResponse();

        response.setId(about.getId());
        response.setTitle(about.getTitle());
        response.setShortDescription(about.getShortDescription());
        response.setFullDescription(about.getFullDescription());
        response.setProfileImageUrl(about.getProfileImageUrl());
        response.setLocation(about.getLocation());
        response.setEmail(about.getEmail());
        response.setPhone(about.getPhone());
        response.setGithubUrl(about.getGithubUrl());
        response.setLinkedinUrl(about.getLinkedinUrl());
        response.setResumeUrl(about.getResumeUrl());

        return response;
    }
}