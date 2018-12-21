package com.prashant.projects.pidash.util;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.util.Iterator;

@Component
public class FileOperations {

    public void deleteFile(String filePath) {
        try {
            Files.delete(Paths.get(filePath));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getAvailableStorage() {
        Iterator<Path> rootDirectories = FileSystems.getDefault().getRootDirectories().iterator();
        Path path = rootDirectories.next();
        try {
            FileStore fileStore = Files.getFileStore(path);
            double usableSpace = fileStore.getUsableSpace();
            double totalSpace = fileStore.getTotalSpace();
            return (int) ((usableSpace/totalSpace)*100);
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return 0;
    }
}
