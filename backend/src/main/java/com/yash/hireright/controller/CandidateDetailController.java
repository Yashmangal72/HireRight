package com.yash.hireright.controller;

import com.yash.hireright.dto.CandidateDetailResponse;
import com.yash.hireright.dto.CandidateNoteRequest;
import com.yash.hireright.dto.CandidateNoteResponse;
import com.yash.hireright.service.CandidateDetailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/candidates/{candidateId}")
public class CandidateDetailController {

    private final CandidateDetailService candidateDetailService;

    public CandidateDetailController(CandidateDetailService candidateDetailService) {
        this.candidateDetailService = candidateDetailService;
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping
    public ResponseEntity<CandidateDetailResponse> getCandidateDetail(
            @PathVariable Long candidateId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                candidateDetailService.getCandidateDetail(candidateId, authentication)
        );
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/notes")
    public ResponseEntity<List<CandidateNoteResponse>> getNotes(
            @PathVariable Long candidateId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                candidateDetailService.getNotes(candidateId, authentication)
        );
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping("/notes")
    public ResponseEntity<CandidateNoteResponse> addNote(
            @PathVariable Long candidateId,
            @Valid @RequestBody CandidateNoteRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                candidateDetailService.addNote(candidateId, request, authentication)
        );
    }
}