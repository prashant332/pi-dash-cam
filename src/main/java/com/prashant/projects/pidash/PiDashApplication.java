package com.prashant.projects.pidash;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class PiDashApplication {

    public static void main(String[] args) {
        SpringApplication.run(PiDashApplication.class, args);
    }
}

