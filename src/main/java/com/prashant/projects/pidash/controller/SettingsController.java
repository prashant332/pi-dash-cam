package com.prashant.projects.pidash.controller;

import com.prashant.projects.pidash.model.Settings;
import com.prashant.projects.pidash.repo.SettingsRepo;
import com.prashant.projects.pidash.util.FileOperations;
import com.prashant.projects.pidash.video.VideoArchiveScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class SettingsController {

    @Autowired
    private SettingsRepo settingsRepo;

    @Autowired
    private FileOperations fileOperations;

    @Autowired
    private VideoArchiveScheduler videoArchiveScheduler;

    @GetMapping("/setting")
    public String getSettings(Model model){
        List<Settings> settings = settingsRepo.findAll();
        if(settings != null && settings.size()>0){
            model.addAttribute("setting", settings.get(0));
        } else {
            model.addAttribute("setting", new Settings());
        }
        model.addAttribute("availableStorage", fileOperations.getAvailableStorage());
        return "edit-setting";
    }

    @GetMapping("/cleanup")
    public String deleteSomeVideo() {
      videoArchiveScheduler.removeVideos();
      return "redirect:setting";
    }

    @PostMapping("/updateSetting")
    public String updateSetting(@ModelAttribute Settings settings, Model model) {
        settingsRepo.save(settings);
        model.addAttribute("setting", settings);
        model.addAttribute("message", "Settings Saved! Will be effective from next video");
        return "redirect:setting";
    }

    @GetMapping("/reset")
    public String resetSettings(Model model){
        settingsRepo.deleteAll();
        model.addAttribute("setting", new Settings());
        model.addAttribute("message","Settings reset to Default");
        return "edit-setting";
    }
}
