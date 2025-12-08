package examen.dev.tfgalmacen.cloudinary.controlller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import examen.dev.tfgalmacen.cloudinary.service.CloudinaryService;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import static org.mockito.Mockito.*;

class UploadControllerTest {

    @Mock
    private CloudinaryService cloudinaryService;

    @InjectMocks
    private UploadController uploadController;

    public UploadControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void uploadImage_ok() throws Exception {
        MockMultipartFile file =
                new MockMultipartFile("file", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "data".getBytes());

        when(cloudinaryService.uploadFile(file)).thenReturn("http://url.com/test.jpg");

        ResponseEntity<?> response = uploadController.upload(file);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(((Map<String, String>) response.getBody()).containsKey("url"));
        assertEquals("http://url.com/test.jpg", ((Map<String, String>) response.getBody()).get("url"));

        verify(cloudinaryService, times(1)).uploadFile(file);
    }

    @Test
    void uploadImage_error() throws Exception {
        MockMultipartFile file =
                new MockMultipartFile("file", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "data".getBytes());

        when(cloudinaryService.uploadFile(file)).thenThrow(new RuntimeException("Error subiendo archivo"));

        ResponseEntity<?> response = uploadController.upload(file);

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Error al subir imagen"));
    }
}
