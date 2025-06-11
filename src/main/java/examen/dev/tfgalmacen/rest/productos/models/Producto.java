package examen.dev.tfgalmacen.rest.productos.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Where(clause = "is_deleted = false")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String tipo;
    private String imagen;
    private String descripcion;
    private Double precio;
    @Builder.Default
    @Column(nullable = false)
    private Integer stock = 0;


    @Builder.Default
    private LocalDateTime created = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updated = LocalDateTime.now();

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @PreUpdate
    public void preUpdate() {
        updated = LocalDateTime.now();
    }

}

