package com.raj.portfolio.service.impl;

import com.raj.portfolio.config.SupabaseStorageConfig;
import com.raj.portfolio.entity.Media;
import com.raj.portfolio.service.FileStorageService;
import com.raj.portfolio.service.MediaService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    private static final long MAX_PDF_SIZE = 10 * 1024 * 1024;

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of(
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
    );

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final SupabaseStorageConfig supabaseStorageConfig;
    private final MediaService mediaService;
    private final RestClient restClient;

    public FileStorageServiceImpl(
            SupabaseStorageConfig supabaseStorageConfig,
            MediaService mediaService
    ) {
        this.supabaseStorageConfig = supabaseStorageConfig;
        this.mediaService = mediaService;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public String storeImage(MultipartFile file) {
        validateImage(file);

        return storeFile(file, "images", "IMAGE");
    }

    @Override
    public String storePdf(MultipartFile file) {
        validatePdf(file);

        return storeFile(file, "documents", "PDF");
    }

    private String storeFile(
            MultipartFile file,
            String folder,
            String category
    ) {

        try {
            String originalFilename = StringUtils.cleanPath(
                    file.getOriginalFilename() == null
                            ? ""
                            : file.getOriginalFilename()
            );

            String extension = getExtension(originalFilename);

            String generatedFilename =
                    UUID.randomUUID() + extension;

            String storagePath =
                    folder + "/" + generatedFilename;

            String uploadUrl =
                    supabaseStorageConfig.getUrl()
                            .replaceAll("/$", "")
                            + "/storage/v1/object/"
                            + supabaseStorageConfig.getBucket()
                            + "/"
                            + storagePath;

            restClient.post()
                    .uri(uploadUrl)
                    .header(
                            "Authorization",
                            "Bearer " + supabaseStorageConfig.getSecretKey()
                    )
                    .header(
                            "apikey",
                            supabaseStorageConfig.getSecretKey()
                    )
                    .header(
                            "Content-Type",
                            file.getContentType()
                    )
                    .header(
                            "x-upsert",
                            "false"
                    )
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();

            String publicUrl =
                    supabaseStorageConfig.getUrl()
                            .replaceAll("/$", "")
                            + "/storage/v1/object/public/"
                            + supabaseStorageConfig.getBucket()
                            + "/"
                            + storagePath;

            Media media = new Media();
            media.setOriginalName(originalFilename);
            media.setStoredName(generatedFilename);
            media.setFileType(file.getContentType());
            media.setFileSize(file.getSize());
            media.setUrl(publicUrl);
            media.setCategory(category);

            mediaService.saveMedia(media);

            return publicUrl;

        } catch (Exception exception) {
            throw new RuntimeException(
                    "Failed to store file in Supabase Storage",
                    exception
            );
        }
    }

    private void validateImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Image file is required"
            );
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException(
                    "Image size must not exceed 5 MB"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null
                || !ALLOWED_IMAGE_TYPES.contains(
                contentType.toLowerCase()
        )) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
            );
        }

        String extension = getExtension(
                file.getOriginalFilename()
        );

        if (!ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException(
                    "Invalid image file extension"
            );
        }
    }

    private void validatePdf(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "PDF file is required"
            );
        }

        if (file.getSize() > MAX_PDF_SIZE) {
            throw new IllegalArgumentException(
                    "PDF size must not exceed 10 MB"
            );
        }

        String contentType = file.getContentType();

        if (!"application/pdf".equalsIgnoreCase(contentType)) {
            throw new IllegalArgumentException(
                    "Only PDF files are allowed"
            );
        }

        String extension = getExtension(
                file.getOriginalFilename()
        );

        if (!".pdf".equals(extension)) {
            throw new IllegalArgumentException(
                    "PDF file must have a .pdf extension"
            );
        }
    }

    private String getExtension(String filename) {

        if (filename == null) {
            return "";
        }

        String cleanFilename = StringUtils.cleanPath(filename);

        int lastDot = cleanFilename.lastIndexOf('.');

        if (lastDot < 0) {
            return "";
        }

        return cleanFilename
                .substring(lastDot)
                .toLowerCase();
    }
}