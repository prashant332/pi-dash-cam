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

    @Scheduled(fixedRate = 180000)
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
        String captureCommand = "raspivid -t 0 "+ videoAttributesProvider.getVideoAttributes()+" -o /home/pi/capture/"+fileName;
        System.out.println(">>>>>>>"+captureCommand);
        executeCommand(captureCommand, false);
    }

    private void killRaspiVid(){
        executeCommand("killall raspivid", true);
    }

    private void executeCommand(String command, boolean wait) {
        System.out.println(">>>>>>>>>>Executing command "+command);
        Runtime runTime = Runtime.getRuntime();
        try {
            Process exec = runTime.exec(command);
            if(wait) {
                int exitCode = exec.waitFor();
                if(exitCode == 0 ){
                    System.out.println("Process exited successfully");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
