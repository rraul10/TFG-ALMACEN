package examen.dev.tfgalmacen.pedido.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineaVentaDTO {
    private Long productoId;
    private int cantidad;
}
