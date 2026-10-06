package com.yash.hireright.repository;

import com.yash.hireright.entity.CandidateNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateNoteRepository extends JpaRepository<CandidateNote, Long> {

    List<CandidateNote> findByRecruiter_IdAndCandidate_IdOrderByCreatedAtDesc(
            Long recruiterId, Long candidateId
    );
}