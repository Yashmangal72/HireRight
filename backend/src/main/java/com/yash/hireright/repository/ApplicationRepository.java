package com.yash.hireright.repository;

import com.yash.hireright.entity.Application;
import com.yash.hireright.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    Optional<Application> findByIdAndCandidate_Email(Long id, String email);

    boolean existsByJobId(Long jobId);

    long countByCandidate_Email(String email);

    long countByCandidate_EmailAndStatus(String email, ApplicationStatus status);

    List<Application> findTop4ByCandidate_EmailOrderByAppliedAtDesc(String email);

    long countByJob_Recruiter_Email(String email);

    long countByJob_Recruiter_EmailAndStatus(String email, ApplicationStatus status);

    List<Application> findTop4ByJob_Recruiter_EmailOrderByAppliedAtDesc(String email);

    List<Application> findByJob_Recruiter_EmailOrderByAppliedAtDesc(String email);
}