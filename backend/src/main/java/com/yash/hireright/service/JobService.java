package com.yash.hireright.service;

import com.yash.hireright.dto.JobRequest;
import com.yash.hireright.dto.JobResponse;
import com.yash.hireright.entity.Job;
import com.yash.hireright.exception.*;
import com.yash.hireright.mapper.JobMapper;
import com.yash.hireright.repository.JobRepository;
import com.yash.hireright.specifications.JobSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.yash.hireright.entity.User;
import com.yash.hireright.repository.UserRepository;
import org.springframework.security.core.Authentication;
import java.time.LocalDateTime;
import java.util.List;
import com.yash.hireright.repository.ApplicationRepository;

@Service
public class JobService {

    public final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, JobMapper jobMapper, UserRepository userRepository, ApplicationRepository applicationRepository){
        this.jobRepository = jobRepository;
        this.jobMapper = jobMapper;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    public JobResponse createJob(
            JobRequest request,
            Authentication authentication
    ) {
        Job job = new Job();

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("Recruiter not found")
                );

        job.setRecruiter(recruiter);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setCreatedAt(LocalDateTime.now());

        Job savedJob = jobRepository.save(job);
        return jobMapper.toResponse(savedJob);
    }

    public Page<JobResponse> getAllJobs(
            int page,
            int size,
            String sortBy,
            String direction,
            String location,
            String employmentType,
            String experienceLevel,
            Double minSalary,
            Double maxSalary,
            String keyword
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Job> specification = (root, query, cb) -> null;

        if (location != null && !location.isBlank()) {
            specification = specification.and(
                    JobSpecification.hasLocation(location)
            );
        }
        if (employmentType != null && !employmentType.isBlank()) {
            specification = specification.and(
                    JobSpecification.hasEmploymentType(employmentType)
            );
        }
        if (experienceLevel != null && !experienceLevel.isBlank()) {
            specification = specification.and(
                    JobSpecification.hasExperienceLevel(experienceLevel)
            );
        }
        if (minSalary != null) {
            specification = specification.and(
                    JobSpecification.salaryGreaterThanOrEqual(minSalary)
            );
        }
        if (maxSalary != null) {
            specification = specification.and(
                    JobSpecification.salaryLessThanOrEqual(maxSalary)
            );
        }
        if (keyword != null && !keyword.isBlank()) {
            specification = specification.and(
                    JobSpecification.hasKeyword(keyword)
            );
        }
        return jobRepository.findAll(specification, pageable)
                .map(jobMapper::toResponse);
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new JobNotFoundException(
                                "Job not found with id: " + id
                        )
                );
        return jobMapper.toResponse(job);
    }

    public JobResponse updateJob(
            Long id,
            JobRequest request,
            Authentication authentication
    ) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new JobNotFoundException(
                                "Job not found with id: " + id
                        )
                );

        String email = authentication.getName();

        if (!job.getRecruiter().getEmail().equals(email)) {
            throw new UnauthorizedException(
                    "You are not allowed to update this job"
            );
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceLevel(request.getExperienceLevel());

        Job updatedJob = jobRepository.save(job);

        return jobMapper.toResponse(updatedJob);
    }

    public void deleteJob(Long jobId, Authentication authentication) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found"));

        String email = authentication.getName();

        if (!job.getRecruiter().getEmail().equals(email)) {
            throw new UnauthorizedException(
                    "You are not authorized to delete this job"
            );
        }

        if (applicationRepository.existsByJobId(jobId)) {
            throw new JobHasApplicationsException(
                    "Cannot delete job because candidates have already applied"
            );
        }

        jobRepository.delete(job);
    }

    public List<JobResponse> getMyJobs(Authentication authentication) {

        String email = authentication.getName();

        return jobRepository.findByRecruiterEmail(email)
                .stream()
                .map(jobMapper::toResponse)
                .toList();
    }


}
