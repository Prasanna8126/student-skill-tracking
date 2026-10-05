package com.rtps.platform.controller;

import com.rtps.platform.dto.response.ApiResponse;
import com.rtps.platform.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/api/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUri = fileStorageService.storeFile(file);
        Map<String, String> response = new HashMap<>();
        response.put("fileUrl", fileUri);
        response.put("fileName", file.getOriginalFilename());
        return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully", response));
    }
}
