package examen.dev.tfgalmacen.rest.productos.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    public ResponseEntity<ProductoResponse> create(
            @RequestPart("producto") String productoJson,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        ProductoRequest request = mapper.readValue(productoJson, ProductoRequest.class);

        String nombreImagen = (imagen != null && !imagen.isEmpty())
                ? storageService.store(imagen)
                : "default.jpg";

        request.setImagen(nombreImagen);

        ProductoResponse response = productoService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<ProductoResponse> update(@PathVariable Long id, @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRABAJADOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}

