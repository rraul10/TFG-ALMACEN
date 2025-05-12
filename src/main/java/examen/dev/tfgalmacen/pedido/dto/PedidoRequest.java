package examen.dev.tfgalmacen.pedido.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoRequest {
    private Long clienteId;
    private List<LineaVentaDTO> lineasVenta;
}

