package com.yash.hireright.service;

import com.yash.hireright.dto.ApplicationRequest;
import com.yash.hireright.dto.ApplicationResponse;
import com.yash.hireright.entity.Application;
import com.yash.hireright.entity.ApplicationStatus;
import com.yash.hireright.entity.Job;
import com.yash.hireright.entity.User;
import com.yash.hireright.exception.DuplicateApplicationException;
import com.yash.hireright.exception.JobNotFoundException;
import com.yash.hireright.repository.ApplicationRepository;
import com.yash.hireright.repository.JobRepository;
import com.yash.hireright.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.yash.hireright.exception.ApplicationNotFoundException;
import com.yash.hireright.exception.UnauthorizedException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public ApplicationResponse applyForJob(
            ApplicationRequest request,
            Authentication authentication
    ) {

        // Get logged-in user's email from JWT
        String email = authentication.getName();

        // Find candidate
        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ApplicationNotFoundException("Candidate not found")
                );

        // Find job
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() ->
                        new JobNotFoundException(
                                "Job not found with id: " + request.getJobId()
                        )
                );

        // Prevent duplicate application
        if (applicationRepository.existsByCandidateIdAndJobId(
                candidate.getId(),
                job.getId()
        )) {
            throw new DuplicateApplicationException(
                    "You have already applied for this job"
            );
        }

        // Create application
        Application application = new Application();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now());

        Application savedApplication =
                applicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    public List<ApplicationResponse> getAllApplications(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return applicationRepository.findAll()
                .stream()
                .filter(application ->
                        application.getJob()
                                .getRecruiter()
                                .getEmail()
                                .equals(email)
                )
                .map(this::mapToResponse)
                .toList();
    }

    public List<ApplicationResponse> getMyApplications(
            Authentication authentication) {

        String email = authentication.getName();

        return applicationRepository.findAll()
                .stream()
                .filter(application ->
                        application.getCandidate()
                                .getEmail()
                                .equals(email)
                )
                .map(this::mapToResponse)
                .toList();
    }

    public ApplicationResponse updateStatus(
            Long applicationId,
            ApplicationStatus newStatus,
            Authentication authentication
    ) {

        String recruiterEmail = authentication.getName();

        // Find application
        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new ApplicationNotFoundException("Application not found")
                );

        // Check that this application's job belongs to the logged-in recruiter
        String jobRecruiterEmail = application
                .getJob()
                .getRecruiter()
                .getEmail();

        if (!jobRecruiterEmail.equals(recruiterEmail)) {
            throw new UnauthorizedException(
                    "You are not authorized to update this application"
            );
        }

        // Update status
        application.setStatus(newStatus);

        Application updatedApplication =
                applicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }


    private ApplicationResponse mapToResponse(Application application) {

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

    public ApplicationResponse getApplication(
            Long id,
            Authentication authentication) {

        String email = authentication.getName();

        Application application = applicationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ApplicationNotFoundException("Application not found"));

        // Candidate can view only their own application
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CANDIDATE"))) {

            if (!application.getCandidate().getEmail().equals(email)) {
                throw new UnauthorizedException(
                        "You are not authorized to view this application"
                );
            }
        }

        // Recruiter can view only applications for their jobs
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_RECRUITER"))) {

            if (!application.getJob().getRecruiter().getEmail().equals(email)) {
                throw new UnauthorizedException(
                        "You are not authorized to view this application"
                );
            }
        }
        return mapToResponse(application);
    }
}