package com.yash.hireright.controller;

import com.yash.hireright.dto.SavedJobResponse;
import com.yash.hireright.service.SavedJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-jobs")
public class SavedJobController {

    private final SavedJobService savedJobService;

    public SavedJobController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping
    public ResponseEntity<List<SavedJobResponse>> getSavedJobs(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                savedJobService.getSavedJobs(authentication)
        );
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/{jobId}")
    public ResponseEntity<Map<String, Boolean>> saveJob(
            @PathVariable Long jobId,
            Authentication authentication
    ) {
        boolean saved = savedJobService.saveJob(jobId, authentication);

        return ResponseEntity.ok(Map.of("saved", saved));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> unsaveJob(
            @PathVariable Long jobId,
            Authentication authentication
    ) {
        savedJobService.unsaveJob(jobId, authentication);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/{jobId}/status")
    public ResponseEntity<Map<String, Boolean>> isJobSaved(
            @PathVariable Long jobId,
            Authentication authentication
    ) {
        boolean saved = savedJobService.isJobSaved(jobId, authentication);

        return ResponseEntity.ok(Map.of("saved", saved));
    }
}