package com.raj.portfolio.service.impl;

import com.raj.portfolio.dto.request.SocialLinkRequest;
import com.raj.portfolio.dto.response.SocialLinkResponse;
import com.raj.portfolio.entity.SocialLink;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.SocialLinkRepository;
import com.raj.portfolio.service.SocialLinkService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialLinkServiceImpl implements SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;

    public SocialLinkServiceImpl(SocialLinkRepository socialLinkRepository) {
        this.socialLinkRepository = socialLinkRepository;
    }

    @Override
    public List<SocialLinkResponse> getAllSocialLinks() {
        return socialLinkRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public SocialLinkResponse getSocialLinkById(Long id) {
        SocialLink socialLink = socialLinkRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Social link not found with id: " + id));

        return mapToResponse(socialLink);
    }

    @Override
    public SocialLinkResponse createSocialLink(SocialLinkRequest request) {

        SocialLink socialLink = new SocialLink();

        socialLink.setPlatform(request.getPlatform());
        socialLink.setUrl(request.getUrl());
        socialLink.setDisplayOrder(request.getDisplayOrder());
        socialLink.setVisible(request.isVisible());

        return mapToResponse(socialLinkRepository.save(socialLink));
    }

    @Override
    public SocialLinkResponse updateSocialLink(Long id, SocialLinkRequest request) {

        SocialLink socialLink = socialLinkRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Social link not found with id: " + id));

        socialLink.setPlatform(request.getPlatform());
        socialLink.setUrl(request.getUrl());
        socialLink.setDisplayOrder(request.getDisplayOrder());
        socialLink.setVisible(request.isVisible());

        return mapToResponse(socialLinkRepository.save(socialLink));
    }

    @Override
    public void deleteSocialLink(Long id) {

        SocialLink socialLink = socialLinkRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Social link not found with id: " + id));

        socialLinkRepository.delete(socialLink);
    }

    private SocialLinkResponse mapToResponse(SocialLink socialLink) {

        SocialLinkResponse response = new SocialLinkResponse();

        response.setId(socialLink.getId());
        response.setPlatform(socialLink.getPlatform());
        response.setUrl(socialLink.getUrl());
        response.setDisplayOrder(socialLink.getDisplayOrder());
        response.setVisible(socialLink.isVisible());

        return response;
    }
}