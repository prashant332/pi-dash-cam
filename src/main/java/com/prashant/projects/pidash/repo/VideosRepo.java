package com.prashant.projects.pidash.repo;

import com.prashant.projects.pidash.model.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideosRepo extends PagingAndSortingRepository<Video, Long> {

    public Page<Video> findAllByDontRemoveFalse(Pageable pageable);
}
