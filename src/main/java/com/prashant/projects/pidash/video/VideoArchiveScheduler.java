package com.prashant.projects.pidash.video;

import com.prashant.projects.pidash.model.Video;
import com.prashant.projects.pidash.repo.VideosRepo;
import com.prashant.projects.pidash.util.FileOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


@Component
public class VideoArchiveScheduler {

    @Autowired
    private VideosRepo videosRepo;

    @Autowired
    private FileOperations fileOperations;

    @Async
    public void archiveVideo() {
        if(fileOperations.getAvailableStorage()<20) {
            removeVideos();
        }
    }

    public void removeVideos(){
        Page<Video> videosToRemove = videosRepo.findAllByDontRemoveFalse(PageRequest.of(0, 2, Sort.by(Sort.Direction.ASC, "recordDate")));
        videosToRemove.get().forEach(video -> {
            fileOperations.deleteFile(video.getPath());
            videosRepo.delete(video);
        });
    }
}
