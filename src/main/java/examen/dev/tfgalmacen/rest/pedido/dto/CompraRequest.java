package examen.dev.tfgalmacen.rest.pedido.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompraRequest {
    private String productoNombre;
    private int cantidad;
    private Long clienteId;
    private Long userId;
}

