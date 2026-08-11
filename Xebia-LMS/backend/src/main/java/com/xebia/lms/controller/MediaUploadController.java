package com.xebia.lms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/media")
public class MediaUploadController {

    private static final String UPLOAD_DIR = "./uploads";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Please select a file to upload");
            return ResponseEntity.badRequest().body(err);
        }

        try {
            // Create upload folder if missing
            File folder = new File(UPLOAD_DIR);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            // Sanitize file name
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null) {
                originalFileName = "uploaded_file.pdf";
            }
            String sanitizedName = originalFileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            String fileName = System.currentTimeMillis() + "_" + sanitizedName;

            Path path = Paths.get(UPLOAD_DIR, fileName);
            Files.write(path, file.getBytes());

            // Build relative URL to return
            // Since servlet context is /api, mapping is /api/uploads/filename
            String fileUrl = "/api/uploads/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("fileName", fileName);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }
}
