package com.raj.portfolio.repository;

import com.raj.portfolio.entity.Training;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingRepository extends JpaRepository<Training, Long> {
}