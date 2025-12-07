package examen.dev.tfgalmacen.cloudinary.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.mock.web.MockMultipartFile;
import java.lang.reflect.Field;
import java.util.Map;
import static org.mockito.Mockito.*;

class CloudinaryServiceTest {

    private CloudinaryService cloudinaryService;
    private Cloudinary cloudinaryMock;
    private Uploader uploaderMock;

    @BeforeEach
    void setUp() throws Exception {
        cloudinaryService = new CloudinaryService();

        cloudinaryMock = mock(Cloudinary.class);
        uploaderMock = mock(Uploader.class);

       Field cloudinaryField = CloudinaryService.class.getDeclaredField("cloudinary");
        cloudinaryField.setAccessible(true);
        cloudinaryField.set(cloudinaryService, cloudinaryMock);

        when(cloudinaryMock.uploader()).thenReturn(uploaderMock);
    }

    @Test
    void uploadFile_ok() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "data".getBytes()
        );

        when(uploaderMock.upload(
                any(byte[].class),
                anyMap()
        )).thenReturn(Map.of("secure_url", "http://cloudinary.com/image.jpg"));

        String result = cloudinaryService.uploadFile(file);

        assertEquals("http://cloudinary.com/image.jpg", result);
    }

    @Test
    void uploadFile_error() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "data".getBytes()
        );

        when(uploaderMock.upload(any(), any())).thenThrow(new RuntimeException("Cloudinary error"));

        assertThrows(RuntimeException.class, () -> cloudinaryService.uploadFile(file));
    }
}
