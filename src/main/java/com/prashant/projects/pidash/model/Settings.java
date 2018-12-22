package com.prashant.projects.pidash.model;

import org.hibernate.annotations.ColumnDefault;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private int quality;

    private int rotation;

    private String metering;

    private String whitebalance;

    private String exposure;

    private boolean stabilization;

    private int evCompansation;

    private String dynamicRange;

    private String videoOptions;

    @ColumnDefault(value = "false")
    private boolean showPreview;

    @ColumnDefault(value = "false")
    private boolean pauseRecording;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuality() {
        return quality;
    }

    public void setQuality(int quality) {
        this.quality = quality;
    }

    public int getRotation() {
        return rotation;
    }

    public void setRotation(int rotation) {
        this.rotation = rotation;
    }

    public String getMetering() {
        return metering;
    }

    public void setMetering(String metering) {
        this.metering = metering;
    }

    public String getWhitebalance() {
        return whitebalance;
    }

    public void setWhitebalance(String whitebalance) {
        this.whitebalance = whitebalance;
    }

    public String getExposure() {
        return exposure;
    }

    public void setExposure(String exposure) {
        this.exposure = exposure;
    }

    public boolean getStabilization() {
        return stabilization;
    }

    public void setStabilization(boolean stabilization) {
        this.stabilization = stabilization;
    }

    public int getEvCompansation() {
        return evCompansation;
    }

    public void setEvCompansation(int evCompansation) {
        this.evCompansation = evCompansation;
    }

    public String getDynamicRange() {
        return dynamicRange;
    }

    public void setDynamicRange(String dynamicRange) {
        this.dynamicRange = dynamicRange;
    }

    public boolean isStabilization() {
        return stabilization;
    }

    public String getVideoOptions() {
        return videoOptions;
    }

    public void setVideoOptions(String videoOptions) {
        this.videoOptions = videoOptions;
    }

    public boolean isShowPreview() {
        return showPreview;
    }

    public void setShowPreview(boolean showPreview) {
        this.showPreview = showPreview;
    }

    public boolean isPauseRecording() {
        return pauseRecording;
    }

    public void setPauseRecording(boolean pauseRecording) {
        this.pauseRecording = pauseRecording;
    }
}
