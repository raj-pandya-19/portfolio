package com.raj.portfolio.repository;

import com.raj.portfolio.entity.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
}