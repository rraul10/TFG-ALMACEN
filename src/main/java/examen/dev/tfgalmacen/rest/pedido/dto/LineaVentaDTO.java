package examen.dev.tfgalmacen.rest.pedido.dto;

import examen.dev.tfgalmacen.rest.pedido.models.LineaVenta;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineaVentaDTO {

    private Long productoId;
    private String productoNombre;
    private Integer cantidad;
    private Double precio;

    // Método estático para convertir LineaVenta a LineaVentaDTO
    public static LineaVentaDTO fromLineaVenta(LineaVenta lineaVenta) {
        return LineaVentaDTO.builder()
                .productoId(lineaVenta.getProducto().getId())
                .productoNombre(lineaVenta.getProducto().getNombre())
                .cantidad(lineaVenta.getCantidad())
                .precio(lineaVenta.getPrecioUnitario())
                .build();
    }

}



