package com.raj.portfolio.service.impl;

import com.raj.portfolio.config.FileStorageConfig;
import com.raj.portfolio.entity.Media;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.MediaRepository;
import com.raj.portfolio.service.MediaService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final Path uploadDirectory;

    public MediaServiceImpl(
            MediaRepository mediaRepository,
            FileStorageConfig config
    ) {
        this.mediaRepository = mediaRepository;

        this.uploadDirectory = Paths.get(config.getUploadDir())
                .toAbsolutePath()
                .normalize();
    }

    @Override
    public List<Media> getAllMedia() {
        return mediaRepository.findAll();
    }

    @Override
    public Media getMediaById(Long id) {
        return mediaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Media not found with id: " + id
                        )
                );
    }

    @Override
    public Media saveMedia(Media media) {
        return mediaRepository.save(media);
    }

    @Override
    public void deleteMedia(Long id) {

        Media media = getMediaById(id);

        deletePhysicalFile(media.getUrl());

        mediaRepository.delete(media);
    }

    private void deletePhysicalFile(String url) {

        if (url == null || url.isBlank()) {
            return;
        }

        try {
            String relativePath = url.startsWith("/")
                    ? url.substring(1)
                    : url;

            Path filePath = Paths.get(relativePath)
                    .toAbsolutePath()
                    .normalize();

            if (!filePath.startsWith(uploadDirectory)) {
                throw new IllegalArgumentException(
                        "Invalid media file path"
                );
            }

            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }

        } catch (IOException exception) {
            throw new RuntimeException(
                    "Failed to delete physical file",
                    exception
            );
        }
    }
}