package com.yash.hireright.service;

import com.yash.hireright.dto.*;
import com.yash.hireright.entity.Application;
import com.yash.hireright.entity.CandidateNote;
import com.yash.hireright.entity.User;
import com.yash.hireright.exception.UnauthorizedException;
import com.yash.hireright.exception.UserNotFoundException;
import com.yash.hireright.repository.ApplicationRepository;
import com.yash.hireright.repository.CandidateNoteRepository;
import com.yash.hireright.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CandidateDetailService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final CandidateNoteRepository candidateNoteRepository;

    public CandidateDetailService(
            UserRepository userRepository,
            ApplicationRepository applicationRepository,
            CandidateNoteRepository candidateNoteRepository
    ) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.candidateNoteRepository = candidateNoteRepository;
    }

    public CandidateDetailResponse getCandidateDetail(
            Long candidateId,
            Authentication authentication
    ) {
        String recruiterEmail = authentication.getName();

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new UserNotFoundException("Candidate not found"));

        List<Application> allApplications = applicationRepository.findAll();

        List<ApplicationResponse> applications = allApplications.stream()
                .filter(application ->
                        application.getCandidate().getId().equals(candidateId) &&
                                application.getJob().getRecruiter().getEmail().equals(recruiterEmail)
                )
                .map(this::mapApplication)
                .toList();

        if (applications.isEmpty()) {
            throw new UnauthorizedException(
                    "This candidate has not applied to any of your jobs"
            );
        }

        CandidateDetailResponse response = new CandidateDetailResponse();

        response.setCandidateId(candidate.getId());
        response.setName(candidate.getName());
        response.setEmail(candidate.getEmail());
        response.setPhone(candidate.getPhone());
        response.setBio(candidate.getBio());
        response.setLocation(candidate.getLocation());
        response.setSkills(candidate.getSkills());
        response.setHasResume(candidate.getResumeData() != null);
        response.setResumeFilename(candidate.getResumeFilename());
        response.setApplications(applications);

        return response;
    }

    public List<CandidateNoteResponse> getNotes(
            Long candidateId,
            Authentication authentication
    ) {
        User recruiter = getRecruiter(authentication);

        return candidateNoteRepository
                .findByRecruiter_IdAndCandidate_IdOrderByCreatedAtDesc(
                        recruiter.getId(), candidateId
                )
                .stream()
                .map(this::mapNote)
                .toList();
    }

    public CandidateNoteResponse addNote(
            Long candidateId,
            CandidateNoteRequest request,
            Authentication authentication
    ) {
        User recruiter = getRecruiter(authentication);

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new UserNotFoundException("Candidate not found"));

        CandidateNote note = new CandidateNote();
        note.setRecruiter(recruiter);
        note.setCandidate(candidate);
        note.setContent(request.getContent());
        note.setCreatedAt(LocalDateTime.now());

        CandidateNote saved = candidateNoteRepository.save(note);

        return mapNote(saved);
    }

    private User getRecruiter(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Recruiter not found"));
    }

    private CandidateNoteResponse mapNote(CandidateNote note) {
        CandidateNoteResponse response = new CandidateNoteResponse();

        response.setId(note.getId());
        response.setContent(note.getContent());
        response.setCreatedAt(note.getCreatedAt());

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
        response.setCoverLetter(application.getCoverLetter());

        return response;
    }
}