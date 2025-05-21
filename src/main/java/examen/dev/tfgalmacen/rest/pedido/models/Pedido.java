package examen.dev.tfgalmacen.rest.pedido.models;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pedido")
@Where(clause = "deleted = false")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Builder.Default
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LineaVenta> lineasVenta = new ArrayList<>();


    @Builder.Default
    private boolean deleted = false;

    private LocalDateTime created;
    private LocalDateTime updated;
}

