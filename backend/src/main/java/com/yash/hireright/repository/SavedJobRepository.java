package com.yash.hireright.repository;

import com.yash.hireright.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    boolean existsByCandidate_EmailAndJob_Id(String email, Long jobId);

    Optional<SavedJob> findByCandidate_EmailAndJob_Id(String email, Long jobId);

    List<SavedJob> findByCandidate_EmailOrderBySavedAtDesc(String email);

    long countByCandidate_Email(String email);
}