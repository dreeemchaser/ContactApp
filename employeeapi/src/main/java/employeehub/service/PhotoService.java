package employeehub.service;

import employeehub.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import static employeehub.constant.Constant.PHOTO_DIRECTORY;

@Service
@Slf4j
public class PhotoService {

    public String save(MultipartFile file) {
        try {
            Path uploadDir = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            String filename = UUID.randomUUID() + getExtension(file.getOriginalFilename());
            Files.copy(file.getInputStream(), uploadDir.resolve(filename));
            return filename;
        } catch (IOException e) {
            log.error("Failed to save photo", e);
            throw new RuntimeException("Could not save photo: " + e.getMessage());
        }
    }

    public byte[] load(String filename) {
        try {
            Path uploadDir = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve(filename).normalize();
            if (!filePath.startsWith(uploadDir)) {
                throw new ResourceNotFoundException("Photo not found: " + filename);
            }
            if (!Files.exists(filePath)) {
                throw new ResourceNotFoundException("Photo not found: " + filename);
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not read photo: " + e.getMessage());
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
