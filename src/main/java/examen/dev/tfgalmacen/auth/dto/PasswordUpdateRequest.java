package examen.dev.tfgalmacen.auth.dto;

import lombok.Data;

@Data
public class PasswordUpdateRequest {
    private String token;
    private String newPassword;
}

