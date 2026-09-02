package com.yash.hireright.repository;

import com.yash.hireright.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    Optional<Application> findByIdAndCandidate_Email(Long id, String email);

    boolean existsByJobId(Long jobId);
}