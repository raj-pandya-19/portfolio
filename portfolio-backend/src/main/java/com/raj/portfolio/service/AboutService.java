package com.raj.portfolio.service;

import com.raj.portfolio.dto.request.AboutRequest;
import com.raj.portfolio.dto.response.AboutResponse;

import java.util.List;

public interface AboutService {

    List<AboutResponse> getAllAbout();

    AboutResponse getAboutById(Long id);

    AboutResponse createAbout(AboutRequest request);

    AboutResponse updateAbout(Long id, AboutRequest request);

    void deleteAbout(Long id);
}