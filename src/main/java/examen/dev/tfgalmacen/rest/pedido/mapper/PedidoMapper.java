package examen.dev.tfgalmacen.rest.pedido.mapper;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.pedido.dto.LineaVentaDTO;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.models.LineaVenta;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.productos.models.Producto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PedidoMapper {

    public static Pedido toEntity(PedidoRequest request, Cliente cliente) {
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setFecha(java.time.LocalDateTime.now());
        pedido.setCreated(java.time.LocalDateTime.now());
        pedido.setUpdated(java.time.LocalDateTime.now());
        pedido.setDeleted(false);

        List<LineaVenta> lineas = toLineaVentaEntities(request.getLineasVenta());
        for (LineaVenta lv : lineas) {
            lv.setPedido(pedido);
        }
        pedido.setLineasVenta(lineas);

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
        if (lineasVentaDTO == null || lineasVentaDTO.isEmpty()) {
            return new ArrayList<>();
        }
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
        if (lineasVenta == null || lineasVenta.isEmpty()) {
            return new ArrayList<>();
        }
        return lineasVenta.stream().map(linea -> {
            LineaVentaDTO dto = new LineaVentaDTO();
            dto.setProductoId(linea.getProducto().getId());
            dto.setCantidad(linea.getCantidad());
            return dto;
        }).collect(Collectors.toList());
    }

    public static void updatePedidoFromRequest(Pedido pedido, PedidoRequest request) {
        if (request.getLineasVenta() != null) {
            List<LineaVenta> lineasVenta = toLineaVentaEntities(request.getLineasVenta());
            pedido.setLineasVenta(lineasVenta);
        }
        pedido.setUpdated(java.time.LocalDateTime.now());
    }

    public static LineaVentaDTO toDto(LineaVenta lineaVenta) {
        LineaVentaDTO dto = new LineaVentaDTO();
        dto.setProductoId(lineaVenta.getProducto().getId());
        dto.setCantidad(lineaVenta.getCantidad());
        return dto;
    }

    public static LineaVenta toEntity(LineaVentaDTO dto) {
        LineaVenta lineaVenta = new LineaVenta();
        Producto producto = new Producto();
        producto.setId(dto.getProductoId());
        lineaVenta.setProducto(producto);
        lineaVenta.setCantidad(dto.getCantidad());
        return lineaVenta;
    }

}
