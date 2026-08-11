package com.xebia.lms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Create uploads directory if it doesn't exist
        File uploadDir = new File("./uploads");
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Map /uploads/** to the physical directory ./uploads/
        // Since server.servlet.context-path=/api, the public URL will be /api/uploads/filename.pdf
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
    }
}
