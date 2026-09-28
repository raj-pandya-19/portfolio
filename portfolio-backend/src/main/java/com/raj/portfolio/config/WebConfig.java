package com.raj.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${portfolio.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
                .allowedOrigins(
                        frontendUrl,
                        "http://localhost:3000"
                )
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
                .allowedHeaders(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                );
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String uploadLocation = "file:" + uploadDir + "/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation);
    }
}