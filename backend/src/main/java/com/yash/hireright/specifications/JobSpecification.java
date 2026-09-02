package com.yash.hireright.specifications;

import com.yash.hireright.entity.Job;
import org.springframework.data.jpa.domain.Specification;

public class JobSpecification {

    public static Specification<Job> hasLocation(String location) {
        return (root, query, cb) ->
                cb.equal(
                        cb.lower(root.get("location")),
                        location.toLowerCase()
                );
    }

    public static Specification<Job> hasEmploymentType(String employmentType) {
        return (root, query, cb) ->
                cb.equal(root.get("employmentType"), employmentType);
    }

    public static Specification<Job> hasExperienceLevel(String experienceLevel) {
        return (root, query, cb) ->
                cb.equal(root.get("experienceLevel"), experienceLevel);
    }

    public static Specification<Job> salaryGreaterThanOrEqual(Double minSalary) {
        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("salary"), minSalary);
    }

    public static Specification<Job> salaryLessThanOrEqual(Double maxSalary) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("salary"), maxSalary);
    }

    public static Specification<Job> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
            );
        };
    }
}