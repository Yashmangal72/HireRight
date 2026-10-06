package com.yash.hireright.service;

import com.yash.hireright.dto.InterviewRequest;
import com.yash.hireright.dto.InterviewResponse;
import com.yash.hireright.entity.Application;
import com.yash.hireright.entity.Interview;
import com.yash.hireright.exception.ApplicationNotFoundException;
import com.yash.hireright.exception.ResourceNotFoundException;
import com.yash.hireright.exception.UnauthorizedException;
import com.yash.hireright.repository.ApplicationRepository;
import com.yash.hireright.repository.InterviewRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewService(
            InterviewRepository interviewRepository,
            ApplicationRepository applicationRepository
    ) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    public InterviewResponse scheduleInterview(
            Long applicationId,
            InterviewRequest request,
            Authentication authentication
    ) {
        String recruiterEmail = authentication.getName();

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new ApplicationNotFoundException("Application not found")
                );

        String jobRecruiterEmail = application.getJob().getRecruiter().getEmail();

        if (!jobRecruiterEmail.equals(recruiterEmail)) {
            throw new UnauthorizedException(
                    "You are not authorized to schedule an interview for this application"
            );
        }

        Interview interview = interviewRepository
                .findByApplication_Id(applicationId)
                .orElseGet(Interview::new);

        interview.setApplication(application);
        interview.setScheduledAt(request.getScheduledAt());
        interview.setInterviewType(request.getInterviewType());
        interview.setDurationMinutes(request.getDurationMinutes());
        interview.setMeetingLink(request.getMeetingLink());
        interview.setNotes(request.getNotes());

        if (interview.getCreatedAt() == null) {
            interview.setCreatedAt(LocalDateTime.now());
        }

        Interview saved = interviewRepository.save(interview);

        return mapToResponse(saved);
    }

    public InterviewResponse getInterviewForApplication(
            Long applicationId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new ApplicationNotFoundException("Application not found")
                );

        boolean isCandidate = application.getCandidate().getEmail().equals(email);
        boolean isRecruiter = application.getJob().getRecruiter().getEmail().equals(email);

        if (!isCandidate && !isRecruiter) {
            throw new UnauthorizedException(
                    "You are not authorized to view this interview"
            );
        }

        Interview interview = interviewRepository
                .findByApplication_Id(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("No interview scheduled yet")
                );

        return mapToResponse(interview);
    }

    private InterviewResponse mapToResponse(Interview interview) {

        InterviewResponse response = new InterviewResponse();

        response.setId(interview.getId());
        response.setApplicationId(interview.getApplication().getId());
        response.setJobTitle(interview.getApplication().getJob().getTitle());
        response.setCandidateName(interview.getApplication().getCandidate().getName());
        response.setScheduledAt(interview.getScheduledAt());
        response.setInterviewType(interview.getInterviewType());
        response.setDurationMinutes(interview.getDurationMinutes());
        response.setMeetingLink(interview.getMeetingLink());
        response.setNotes(interview.getNotes());

        return response;
    }

    public List<InterviewResponse> getMyScheduledInterviews(Authentication authentication) {

        String email = authentication.getName();

        return interviewRepository
                .findByApplication_Job_Recruiter_EmailOrderByScheduledAtAsc(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}