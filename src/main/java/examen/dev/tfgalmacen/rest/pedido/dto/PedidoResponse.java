package examen.dev.tfgalmacen.rest.pedido.dto;

import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponse {
    private Long id;
    private Long clienteId;
    private EstadoPedido estado;
    private LocalDateTime fecha;
    private List<LineaVentaDTO> lineasVenta;
    private String url;

}
