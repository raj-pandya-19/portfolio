package com.raj.portfolio.service;

import com.raj.portfolio.entity.Media;

import java.util.List;

public interface MediaService {

    List<Media> getAllMedia();

    Media getMediaById(Long id);

    Media saveMedia(Media media);

    void deleteMedia(Long id);
}