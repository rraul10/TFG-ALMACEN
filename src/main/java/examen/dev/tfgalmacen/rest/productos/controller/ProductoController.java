package examen.dev.tfgalmacen.rest.productos.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.cloudinary.service.CloudinaryService;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoResponse;
import examen.dev.tfgalmacen.rest.productos.service.ProductoService;
import examen.dev.tfgalmacen.storage.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;
    private final StorageService storageService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> getAll() {
        return ResponseEntity.ok(productoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.getById(id));
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<?> create(
            @RequestPart("producto") String productoJson,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            ProductoRequest request = mapper.readValue(productoJson, ProductoRequest.class);

            if (imagen != null && !imagen.isEmpty()) {
                String urlImagen = cloudinaryService.uploadFile(imagen);
                request.setImagen(urlImagen);
            } else {
                request.setImagen("default.jpg");
            }

            ProductoResponse response = productoService.create(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el producto: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("producto") String productoJson,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            ProductoRequest productoRequest = mapper.readValue(productoJson, ProductoRequest.class);

            if (imagen != null && !imagen.isEmpty()) {
                String urlImagen = cloudinaryService.uploadFile(imagen);
                productoRequest.setImagen(urlImagen);
            }

            ProductoResponse productoActualizado = productoService.update(id, productoRequest);

            return ResponseEntity.ok(productoActualizado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el producto: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}

