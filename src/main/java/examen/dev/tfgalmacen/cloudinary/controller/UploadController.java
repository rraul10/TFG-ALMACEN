package examen.dev.tfgalmacen.cloudinary.controller;

import examen.dev.tfgalmacen.cloudinary.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "https://tfg-almacen-front.onrender.com")
public class UploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/image")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Archivo recibido: " + file.getOriginalFilename());
            System.out.println("Tamaño: " + file.getSize() + " bytes");

            String url = cloudinaryService.uploadFile(file);
            return ResponseEntity.ok(Map.of("url", url));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al subir imagen: " + e.getMessage());
        }
    }

}
