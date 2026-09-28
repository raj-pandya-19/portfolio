package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.SocialLinkRequest;
import com.raj.portfolio.dto.response.SocialLinkResponse;

import java.util.List;

public interface SocialLinkService {

    List<SocialLinkResponse> getAllSocialLinks();

    SocialLinkResponse getSocialLinkById(Long id);

    SocialLinkResponse createSocialLink(SocialLinkRequest request);

    SocialLinkResponse updateSocialLink(Long id, SocialLinkRequest request);

    void deleteSocialLink(Long id);
}