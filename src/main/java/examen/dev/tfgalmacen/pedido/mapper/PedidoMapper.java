package examen.dev.tfgalmacen.pedido.mapper;

import examen.dev.tfgalmacen.clientes.models.Cliente;
import examen.dev.tfgalmacen.pedido.dto.LineaVentaDTO;
import examen.dev.tfgalmacen.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.pedido.models.LineaVenta;
import examen.dev.tfgalmacen.pedido.models.Pedido;
import examen.dev.tfgalmacen.productos.models.Producto;

import java.util.List;
import java.util.stream.Collectors;

public class PedidoMapper {

    public static Pedido toEntity(PedidoRequest request, Cliente cliente) {
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setLineasVenta(toLineaVentaEntities(request.getLineasVenta()));
        pedido.setCreated(java.time.LocalDateTime.now());
        pedido.setUpdated(java.time.LocalDateTime.now());
        pedido.setDeleted(false);
        return pedido;
    }

    public static PedidoResponse toDto(Pedido pedido) {
        PedidoResponse response = new PedidoResponse();
        response.setId(pedido.getId());
        response.setClienteId(pedido.getCliente().getId());
        response.setEstado(pedido.getEstado());
        response.setFecha(pedido.getFecha());
        response.setLineasVenta(toLineaVentaDTOs(pedido.getLineasVenta()));
        return response;
    }

    private static List<LineaVenta> toLineaVentaEntities(List<LineaVentaDTO> lineasVentaDTO) {
        return lineasVentaDTO.stream().map(dto -> {
            LineaVenta lineaVenta = new LineaVenta();
            Producto producto = new Producto();
            producto.setId(dto.getProductoId());
            lineaVenta.setProducto(producto);
            lineaVenta.setCantidad(dto.getCantidad());
            return lineaVenta;
        }).collect(Collectors.toList());
    }

    private static List<LineaVentaDTO> toLineaVentaDTOs(List<LineaVenta> lineasVenta) {
        return lineasVenta.stream().map(linea -> {
            LineaVentaDTO dto = new LineaVentaDTO();
            dto.setProductoId(linea.getProducto().getId());
            dto.setCantidad(linea.getCantidad());
            return dto;
        }).collect(Collectors.toList());
    }

    public static void updatePedidoFromRequest(Pedido pedido, PedidoRequest request) {
        List<LineaVenta> lineasVenta = toLineaVentaEntities(request.getLineasVenta());
        pedido.setLineasVenta(lineasVenta);

        pedido.setUpdated(java.time.LocalDateTime.now());
    }
}
