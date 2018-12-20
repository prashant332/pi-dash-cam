package com.prashant.projects.pidash.controller;

import com.prashant.projects.pidash.model.Video;
import com.prashant.projects.pidash.repo.VideosRepo;
import com.prashant.projects.pidash.util.FileOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class VideosController {


    @Autowired
    private FileOperations fileOperations;

    @Autowired
    private VideosRepo videosRepo;

    @GetMapping("/videos/{pageNum}")
    public String getVideos(@PathVariable("pageNum") int pageNum, Model model) {
        Page<Video> videos = videosRepo.findAll(PageRequest.of(pageNum, 5, Sort.by(Sort.Direction.DESC, "recordDate")));
        long total = videosRepo.count();
        model.addAttribute("videos", videos.get().collect(Collectors.toList()));
        model.addAttribute("currentPage", pageNum);
        model.addAttribute("pageSize", total/5);
        return "videos";
    }

    @GetMapping("/video/retain/{id}")
    public String retainVideo(@PathVariable("id") long id){
        Optional<Video> video = videosRepo.findById(id);
        if(video.isPresent()){
            Video video1 = video.get();
            video1.setDontRemove(!video1.isDontRemove());
            videosRepo.save(video1);
        }
        return "success";
    }

    @GetMapping("/video/delete/{id}/{currentPage}")
    public String deleteVideo(@PathVariable("id") long id, @PathVariable int currentPage){
        Optional<Video> video = videosRepo.findById(id);
        if(video.isPresent()){
            Video video1 = video.get();
            fileOperations.deleteFile(video1.getPath());
            videosRepo.delete(video1);
        }
        return "redirect:/videos/"+currentPage;
    }

    @GetMapping("/video/play")
    @ResponseBody
    public FileSystemResource videoSource(@RequestParam("id") long id) {
        Optional<Video> video = videosRepo.findById(id);
        if(video.isPresent()) {
            File videoFile = new File(video.get().getPath());
            return new FileSystemResource(videoFile);
        }
        return null;
    }
}
