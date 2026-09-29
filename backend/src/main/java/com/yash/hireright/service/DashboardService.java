package com.yash.hireright.service;

import com.yash.hireright.dto.ApplicationResponse;
import com.yash.hireright.dto.CandidateDashboardResponse;
import com.yash.hireright.entity.Application;
import com.yash.hireright.entity.ApplicationStatus;
import com.yash.hireright.entity.Job;
import com.yash.hireright.mapper.JobMapper;
import com.yash.hireright.repository.ApplicationRepository;
import com.yash.hireright.repository.JobRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    public DashboardService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            JobMapper jobMapper
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.jobMapper = jobMapper;
    }

    public CandidateDashboardResponse getCandidateDashboard(Authentication authentication) {

        String email = authentication.getName();

        CandidateDashboardResponse response = new CandidateDashboardResponse();

        response.setApplicationsCount(
                applicationRepository.countByCandidate_Email(email)
        );

        response.setInterviewsCount(
                applicationRepository.countByCandidate_EmailAndStatus(
                        email, ApplicationStatus.INTERVIEW
                )
        );

        response.setHiredCount(
                applicationRepository.countByCandidate_EmailAndStatus(
                        email, ApplicationStatus.HIRED
                )
        );

        List<Application> recent =
                applicationRepository.findTop4ByCandidate_EmailOrderByAppliedAtDesc(email);

        response.setRecentApplications(
                recent.stream().map(this::mapApplication).toList()
        );

        List<Job> recommended = jobRepository.findTop4ByOrderByCreatedAtDesc();

        response.setRecommendedJobs(
                recommended.stream().map(jobMapper::toResponse).toList()
        );

        return response;
    }

    private ApplicationResponse mapApplication(Application application) {

        ApplicationResponse response = new ApplicationResponse();

        response.setId(application.getId());
        response.setJobId(application.getJob().getId());
        response.setJobTitle(application.getJob().getTitle());
        response.setCandidateId(application.getCandidate().getId());
        response.setCandidateName(application.getCandidate().getName());
        response.setCandidateEmail(application.getCandidate().getEmail());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());

        return response;
    }
}