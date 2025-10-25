package examen.dev.tfgalmacen.rest.pedido.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineaVentaDTO {
    private Long productoId;
    private int cantidad;
    private Long precio;
}
