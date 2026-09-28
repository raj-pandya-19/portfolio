package com.raj.portfolio.service.impl;

import com.raj.portfolio.config.SupabaseStorageConfig;
import com.raj.portfolio.entity.Media;
import com.raj.portfolio.exception.ResourceNotFoundException;
import com.raj.portfolio.repository.MediaRepository;
import com.raj.portfolio.service.MediaService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final SupabaseStorageConfig supabaseStorageConfig;
    private final RestClient restClient;

    public MediaServiceImpl(
            MediaRepository mediaRepository,
            SupabaseStorageConfig supabaseStorageConfig
    ) {
        this.mediaRepository = mediaRepository;
        this.supabaseStorageConfig = supabaseStorageConfig;
        this.restClient = RestClient.builder().build();
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

        String bucket = supabaseStorageConfig.getBucket();

        String marker =
                "/storage/v1/object/public/"
                        + bucket
                        + "/";

        int markerIndex = url.indexOf(marker);

        if (markerIndex < 0) {
            throw new IllegalArgumentException(
                    "Invalid Supabase Storage URL"
            );
        }

        String storagePath =
                url.substring(markerIndex + marker.length());

        String deleteUrl =
                supabaseStorageConfig.getUrl()
                        .replaceAll("/$", "")
                        + "/storage/v1/object/"
                        + bucket
                        + "/"
                        + storagePath;

        try {

            restClient.delete()
                    .uri(deleteUrl)
                    .header(
                            "Authorization",
                            "Bearer " + supabaseStorageConfig.getSecretKey()
                    )
                    .header(
                            "apikey",
                            supabaseStorageConfig.getSecretKey()
                    )
                    .retrieve()
                    .toBodilessEntity();

        } catch (Exception exception) {
            throw new RuntimeException(
                    "Failed to delete file from Supabase Storage",
                    exception
            );
        }
    }
}