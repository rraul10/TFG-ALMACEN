package examen.dev.tfgalmacen.rest.users.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.cloudinary.service.CloudinaryService;
import examen.dev.tfgalmacen.rest.users.dto.UserRequest;
import examen.dev.tfgalmacen.rest.users.dto.UserResponse;
import examen.dev.tfgalmacen.rest.users.service.UserService;
import examen.dev.tfgalmacen.storage.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final StorageService storageService;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public UserController(UserService userService, StorageService storageService, CloudinaryService cloudinaryService) {
        this.userService = userService;
        this.storageService = storageService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createUser(
            @RequestPart("user") String userJson,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            UserRequest request = mapper.readValue(userJson, UserRequest.class);

            if (foto != null && !foto.isEmpty()) {
                String urlFoto = cloudinaryService.uploadFile(foto);
                request.setFoto(urlFoto);
            } else {
                request.setFoto("default.jpg");
            }

            UserResponse response = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el usuario: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestPart("user") String userJson,
            @RequestPart(value = "foto", required = false) MultipartFile foto
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            UserRequest request = mapper.readValue(userJson, UserRequest.class);

            if (foto != null && !foto.isEmpty()) {
                String urlFoto = cloudinaryService.uploadFile(foto);
                request.setFoto(urlFoto);
            }

            UserResponse response = userService.updateUser(id, request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar usuario: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

