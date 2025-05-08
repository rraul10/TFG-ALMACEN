package examen.dev.tfgalmacen.clientes.models;

import examen.dev.tfgalmacen.users.models.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Where(clause = "deleted = false")
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

    @Column(name = "deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;

    private LocalDateTime created;
    private LocalDateTime updated;
}
