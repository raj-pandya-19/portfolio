package com.raj.portfolio.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PortfolioController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Welcome to Raj Pandya Portfolio";
    }
}