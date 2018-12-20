package com.prashant.projects.pidash.video;

import com.prashant.projects.pidash.model.Video;
import com.prashant.projects.pidash.repo.VideosRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class VideoCaptureScheduler {

    @Autowired
    private VideoAttributesProvider videoAttributesProvider;

    @Autowired
    private VideosRepo videosRepo;

    @Autowired
    private VideoArchiveScheduler videoArchiveScheduler;

    @Scheduled(fixedRate = 300000)
    public void captureVideo(){
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm");
        String fileName = "vid-"+dateFormat.format(date)+".h264";
        killRaspiVid();
        startCapture(fileName);
        videoArchiveScheduler.archiveVideo();
        videosRepo.save(new Video(fileName, "/home/pi/capture/"+fileName, date));
    }

    private void startCapture(String fileName) {
        String captureCommand = "raspivid "+ videoAttributesProvider.getVideoAttributes()+" -o /home/pi/capture/"+fileName;
        executeCommand(captureCommand);
    }

    private void killRaspiVid(){
        executeCommand("killall raspivid");
    }

    private void executeCommand(String command) {
        Runtime runTime = Runtime.getRuntime();
        try {
            runTime.exec(command);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
