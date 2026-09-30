package com.yash.hireright.repository;

import com.yash.hireright.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Optional<Interview> findByApplication_Id(Long applicationId);

    boolean existsByApplication_Id(Long applicationId);
}