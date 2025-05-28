package examen.dev.tfgalmacen.storage.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    @Value("${app.storage.location:uploads}")
    private String storageLocation;

    private Path rootLocation;

    @PostConstruct
    public void init() throws IOException {
        rootLocation = Paths.get(storageLocation);
        Files.createDirectories(rootLocation);
    }

    @Override
    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            return "default.jpg";
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            if (!extension.matches("(?i).*(jpg|jpeg|png|gif|bmp|webp)$")) {
                throw new RuntimeException("El archivo debe ser una imagen válida.");
            }

            String filename = UUID.randomUUID() + extension;
            Path filePath = rootLocation.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            System.out.println("Archivo guardado en: " + filePath.toString());
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }

    @Override
    public Resource loadAsResource(String filename) {
        Path file = rootLocation.resolve(filename);
        return new FileSystemResource(file.toFile());
    }
}

