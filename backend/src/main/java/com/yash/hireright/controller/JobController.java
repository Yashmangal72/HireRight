package com.yash.hireright.controller;

import com.yash.hireright.dto.JobRequest;
import com.yash.hireright.dto.JobResponse;
import com.yash.hireright.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;


@RestController
@RequestMapping("/api/jobs")
public class JobController {

    public final JobService jobService;

    public JobController(JobService jobService){
        this.jobService = jobService;
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication
    ) {
        JobResponse createdJob =
                jobService.createJob(request, authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdJob);
    }

    @GetMapping
    public Page<JobResponse> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Double maxSalary,
            @RequestParam(required = false) String keyword
    ) {
        return jobService.getAllJobs(
                page,
                size,
                sortBy,
                direction,
                location,
                employmentType,
                experienceLevel,
                minSalary,
                maxSalary,
                keyword
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id){
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {

        JobResponse updatedJob =
                jobService.updateJob(id, request, authentication);

        return ResponseEntity.ok(updatedJob);
    }


    @PreAuthorize("hasRole('RECRUITER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        jobService.deleteJob(id, authentication);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RECRUITER')")
    public List<JobResponse> getMyJobs(Authentication authentication) {
        return jobService.getMyJobs(authentication);
    }
}
