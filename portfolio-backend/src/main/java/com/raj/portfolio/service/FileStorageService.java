package com.raj.portfolio.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String storeImage(MultipartFile file);

    String storePdf(MultipartFile file);
}