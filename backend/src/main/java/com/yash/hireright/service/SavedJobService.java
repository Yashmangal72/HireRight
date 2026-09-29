package com.yash.hireright.service;

import com.yash.hireright.dto.JobResponse;
import com.yash.hireright.dto.SavedJobResponse;
import com.yash.hireright.entity.Job;
import com.yash.hireright.entity.SavedJob;
import com.yash.hireright.entity.User;
import com.yash.hireright.exception.JobNotFoundException;
import com.yash.hireright.exception.UserNotFoundException;
import com.yash.hireright.mapper.JobMapper;
import com.yash.hireright.repository.JobRepository;
import com.yash.hireright.repository.SavedJobRepository;
import com.yash.hireright.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobMapper jobMapper;

    public SavedJobService(
            SavedJobRepository savedJobRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            JobMapper jobMapper
    ) {
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.jobMapper = jobMapper;
    }

    public boolean saveJob(Long jobId, Authentication authentication) {

        String email = authentication.getName();

        if (savedJobRepository.existsByCandidate_EmailAndJob_Id(email, jobId)) {
            return true;
        }

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new JobNotFoundException("Job not found with id: " + jobId)
                );

        SavedJob savedJob = new SavedJob();
        savedJob.setCandidate(candidate);
        savedJob.setJob(job);
        savedJob.setSavedAt(LocalDateTime.now());

        savedJobRepository.save(savedJob);

        return true;
    }

    public void unsaveJob(Long jobId, Authentication authentication) {

        String email = authentication.getName();

        savedJobRepository
                .findByCandidate_EmailAndJob_Id(email, jobId)
                .ifPresent(savedJobRepository::delete);
    }

    public boolean isJobSaved(Long jobId, Authentication authentication) {

        String email = authentication.getName();

        return savedJobRepository.existsByCandidate_EmailAndJob_Id(email, jobId);
    }

    public List<SavedJobResponse> getSavedJobs(Authentication authentication) {

        String email = authentication.getName();

        List<SavedJob> savedJobs =
                savedJobRepository.findByCandidate_EmailOrderBySavedAtDesc(email);

        return savedJobs.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private SavedJobResponse mapToResponse(SavedJob savedJob) {

        JobResponse jobResponse = jobMapper.toResponse(savedJob.getJob());

        return new SavedJobResponse(savedJob.getId(), jobResponse);
    }
}