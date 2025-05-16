package examen.dev.tfgalmacen.rest.trabajadores.models;


import examen.dev.tfgalmacen.rest.users.models.User;
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
@Table(name = "trabajadores")
@Where(clause = "deleted = false")
public class Trabajador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String numeroSeguridadSocial;

    @Column(name = "deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;

    private LocalDateTime created;
    private LocalDateTime updated;

    @Version
    private Long version;
}

