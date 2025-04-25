package examen.dev.tfgalmacen.clientes.models;

import examen.dev.tfgalmacen.users.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String dni;

    private String fotoDni;

    private String direccionEnvio;

    // @OneToMany(mappedBy = "cliente")
    // private List<Pedido> pedidos;

    private boolean isDeleted;

    private LocalDateTime created;
    private LocalDateTime updated;
}
