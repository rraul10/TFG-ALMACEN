package examen.dev.tfgalmacen.auth.dto;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String correo;
    private String password;
}