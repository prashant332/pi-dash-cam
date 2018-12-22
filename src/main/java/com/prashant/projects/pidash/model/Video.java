package com.prashant.projects.pidash.model;

import org.hibernate.annotations.ColumnDefault;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String title;

    private String path;

    private boolean dontRemove;

    private Date recordDate;

    private String thumbnailPath;

    public Video() {

    }
    public Video(String title, String path, Date recordDate, String thumbnailPath) {
        this.title = title;
        this.path = path;
        this.recordDate = recordDate;
        this.thumbnailPath = thumbnailPath;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public boolean isDontRemove() {
        return dontRemove;
    }

    public void setDontRemove(boolean dontRemove) {
        this.dontRemove = dontRemove;
    }

    public Date getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(Date recordDate) {
        this.recordDate = recordDate;
    }

    public String getThumbnailPath() {
        return thumbnailPath;
    }

    public void setThumbnailPath(String thumbnailPath) {
        this.thumbnailPath = thumbnailPath;
    }
}
