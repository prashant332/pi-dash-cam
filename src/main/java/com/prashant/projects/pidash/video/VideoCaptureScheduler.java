package com.prashant.projects.pidash.video;

import com.prashant.projects.pidash.model.Settings;
import com.prashant.projects.pidash.model.Video;
import com.prashant.projects.pidash.repo.SettingsRepo;
import com.prashant.projects.pidash.repo.VideosRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Component
public class VideoCaptureScheduler {

    @Autowired
    private VideoAttributesProvider videoAttributesProvider;

    @Autowired
    private VideosRepo videosRepo;

    @Autowired
    private VideoArchiveScheduler videoArchiveScheduler;

    @Autowired
    private SettingsRepo settingsRepo;

    @Scheduled(fixedRate = 180000)
    public void captureVideo(){
        if(!pauseRecording()) {
            Date date = new Date();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm");
            String dateStamp = dateFormat.format(date);
            String fileName = "vid-" + dateStamp + ".h264";
            String thumbName = "thumb-" + dateStamp + ".jpg";
            killRaspiVid();
            takeThumbnail(thumbName);
            startCapture(fileName);
            videoArchiveScheduler.archiveVideo();
            videosRepo.save(new Video(fileName, "/home/pi/capture/" + fileName, date, "/home/pi/capture/" + thumbName));
        } else {
            killRaspiVid();
        }
    }

    private boolean pauseRecording() {
        List<Settings> settings = settingsRepo.findAll();
        if(settings != null && settings.size()>0){
            return settings.get(0).isPauseRecording();
        }
        return false;
    }
    private void takeThumbnail(String thumbName) {
        String captureCommand = "raspistill -t 10 -n -w 640 -h 480 -ex sports -o /home/pi/capture/"+thumbName;
        executeCommand(captureCommand, true);
    }

    private void startCapture(String fileName) {
        String captureCommand = "raspivid -t 0 "+ videoAttributesProvider.getVideoAttributes()+" -o /home/pi/capture/"+fileName;
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
