package examen.dev.tfgalmacen.rest.users.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import examen.dev.tfgalmacen.rest.users.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRequest {
    private String nombre;
    private String apellidos;
    private String correo;
    private String password;
    private String telefono;
    private String ciudad;
    private String foto;
    private Set<UserRole> roles;

    private String dni;
    private String fotoDni;
    private String direccionEnvio;
    private String numeroSeguridadSocial;
}


