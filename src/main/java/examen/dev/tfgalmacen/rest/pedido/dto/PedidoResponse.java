package examen.dev.tfgalmacen.rest.pedido.dto;

import examen.dev.tfgalmacen.rest.pedido.mapper.PedidoMapper;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

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

    // Método estático para convertir un Pedido a PedidoResponse
    public static PedidoResponse fromPedido(Pedido pedido) {
        return PedidoResponse.builder()
                .id(pedido.getId())
                .clienteId(pedido.getCliente().getId())
                .estado(pedido.getEstado())
                .fecha(pedido.getFecha())
                .lineasVenta(pedido.getLineasVenta().stream()
                        .map(PedidoMapper::toDto)
                        .collect(Collectors.toList()))
                .build();
    }
}


