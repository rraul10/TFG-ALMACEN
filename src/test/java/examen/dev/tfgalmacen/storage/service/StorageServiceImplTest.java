package examen.dev.tfgalmacen.storage.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.mockito.Mockito.*;

class StorageServiceImplTest {

    @InjectMocks
    private StorageServiceImpl storageService;

    @Mock
    private MultipartFile mockFile;

    private String storageLocation = "src/test/resources/uploads";

    @BeforeEach
    void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);

        Files.createDirectories(Paths.get(storageLocation));
    }

    @Test
    void store_ShouldReturnDefaultFileName_WhenFileIsEmpty() throws IOException {
        when(mockFile.isEmpty()).thenReturn(true);

        String storedFileName = storageService.store(mockFile);

        assertEquals("default.jpg", storedFileName);
    }

    @Test
    void store_ShouldThrowException_WhenFileIsNotValid() {
        String originalFilename = "invalidfile.txt";
        when(mockFile.getOriginalFilename()).thenReturn(originalFilename);
        when(mockFile.isEmpty()).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            storageService.store(mockFile);
        });

        assertEquals("El archivo debe ser una imagen válida.", exception.getMessage());
    }

}
