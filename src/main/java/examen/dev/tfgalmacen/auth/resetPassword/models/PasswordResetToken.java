package examen.dev.tfgalmacen.auth.resetPassword.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private LocalDateTime expiration;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private examen.dev.tfgalmacen.rest.clientes.models.Cliente cliente;
}

