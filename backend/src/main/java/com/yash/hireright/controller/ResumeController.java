package com.yash.hireright.controller;

import com.yash.hireright.dto.ResumeInfoResponse;
import com.yash.hireright.entity.Application;
import com.yash.hireright.entity.User;
import com.yash.hireright.exception.ApplicationNotFoundException;
import com.yash.hireright.exception.UnauthorizedException;
import com.yash.hireright.exception.UserNotFoundException;
import com.yash.hireright.repository.ApplicationRepository;
import com.yash.hireright.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ResumeController {

    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024;

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public ResumeController(
            UserRepository userRepository,
            ApplicationRepository applicationRepository
    ) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/users/me/resume")
    public ResponseEntity<ResumeInfoResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new IllegalArgumentException("File exceeds 5MB limit");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("application/pdf")
                        || contentType.equals("application/msword")
                        || contentType.equals(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ))
        ) {
            throw new IllegalArgumentException(
                    "Only PDF or Word documents are allowed"
            );
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setResumeData(file.getBytes());
        user.setResumeFilename(file.getOriginalFilename());
        user.setResumeContentType(contentType);

        userRepository.save(user);

        return ResponseEntity.ok(
                new ResumeInfoResponse(true, file.getOriginalFilename())
        );
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/users/me/resume/info")
    public ResponseEntity<ResumeInfoResponse> getMyResumeInfo(
            Authentication authentication
    ) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        boolean hasResume = user.getResumeData() != null;

        return ResponseEntity.ok(
                new ResumeInfoResponse(hasResume, user.getResumeFilename())
        );
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/users/me/resume")
    public ResponseEntity<byte[]> downloadMyResume(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return buildFileResponse(
                user.getResumeData(),
                user.getResumeFilename(),
                user.getResumeContentType()
        );
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/applications/{id}/resume")
    public ResponseEntity<byte[]> downloadCandidateResume(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String recruiterEmail = authentication.getName();

        Application application = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ApplicationNotFoundException("Application not found")
                );

        String jobRecruiterEmail = application.getJob().getRecruiter().getEmail();

        if (!jobRecruiterEmail.equals(recruiterEmail)) {
            throw new UnauthorizedException(
                    "You are not authorized to view this resume"
            );
        }

        User candidate = application.getCandidate();

        return buildFileResponse(
                candidate.getResumeData(),
                candidate.getResumeFilename(),
                candidate.getResumeContentType()
        );
    }

    private ResponseEntity<byte[]> buildFileResponse(
            byte[] data,
            String filename,
            String contentType
    ) {
        if (data == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();

        headers.setContentDisposition(
                org.springframework.http.ContentDisposition
                        .attachment()
                        .filename(filename != null ? filename : "resume")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(
                        contentType != null
                                ? MediaType.parseMediaType(contentType)
                                : MediaType.APPLICATION_OCTET_STREAM
                )
                .body(data);
    }
}