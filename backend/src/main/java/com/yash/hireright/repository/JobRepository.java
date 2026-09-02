package com.yash.hireright.repository;

import com.yash.hireright.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    Page<Job> findByLocationIgnoreCase(
            String location,
            Pageable pageable
    );
    List<Job> findByRecruiterEmail(String email);
}
