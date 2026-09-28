package com.raj.portfolio.repository;

import com.raj.portfolio.entity.LearningItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningItemRepository extends JpaRepository<LearningItem, Long> {
}