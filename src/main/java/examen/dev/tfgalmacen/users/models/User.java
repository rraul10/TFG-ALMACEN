package examen.dev.tfgalmacen.users.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @Column(nullable = false, unique = true)
    @Email(regexp =".*@.*\\..*", message ="Correo debe ser válido")
    @NotBlank(message = "El correo no puede estar vacío")
    private String correo;


    @Column(nullable = false)
    @NotBlank(message = "La contraseña no puede estar vacía")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime created;
    private LocalDateTime updated;
    private boolean isDeleted;

}
