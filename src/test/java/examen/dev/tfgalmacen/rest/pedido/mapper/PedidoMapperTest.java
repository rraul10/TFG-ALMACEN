package examen.dev.tfgalmacen.rest.pedido.mapper;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.pedido.dto.LineaVentaDTO;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.models.LineaVenta;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class PedidoMapperTest {

    @Test
    void testToEntity() {
        PedidoRequest pedidoRequest = new PedidoRequest();
        pedidoRequest.setLineasVenta(List.of(new LineaVentaDTO(1L, null, 2, null)));

        Cliente cliente = new Cliente();
        cliente.setId(1L);

        Pedido pedido = PedidoMapper.toEntity(pedidoRequest, cliente);

        assertNotNull(pedido);
        assertEquals(cliente.getId(), pedido.getCliente().getId());
        assertEquals(EstadoPedido.PENDIENTE, pedido.getEstado());
        assertFalse(pedido.isDeleted());
        assertEquals(1, pedido.getLineasVenta().size());
    }

    @Test
    void testToDto() {
        Pedido pedido = new Pedido();
        pedido.setId(1L);

        Cliente cliente = new Cliente();
        cliente.setId(1L);
        pedido.setCliente(cliente);

        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setFecha(java.time.LocalDateTime.now());

        LineaVenta lineaVenta = new LineaVenta();
        Producto producto = new Producto();
        producto.setId(1L);
        lineaVenta.setProducto(producto);
        lineaVenta.setCantidad(2);

        pedido.setLineasVenta(List.of(lineaVenta));

        PedidoResponse response = PedidoMapper.toDto(pedido);

        assertNotNull(response);
        assertEquals(pedido.getId(), response.getId());
        assertEquals(cliente.getId(), response.getClienteId());
        assertEquals(EstadoPedido.PENDIENTE, response.getEstado());
        assertEquals(1, response.getLineasVenta().size());
    }

    @Test
    void testUpdatePedidoFromRequest() {
        Pedido pedido = new Pedido();
        pedido.setId(1L);

        PedidoRequest pedidoRequest = new PedidoRequest();
        pedidoRequest.setLineasVenta(List.of(new LineaVentaDTO(1L, null, 5, null)));

        PedidoMapper.updatePedidoFromRequest(pedido, pedidoRequest);

        assertNotNull(pedido.getLineasVenta());
        assertEquals(1, pedido.getLineasVenta().size());
        assertEquals(5, pedido.getLineasVenta().get(0).getCantidad());
    }

    @Test
    void testLineaVentaDtoToEntity() {
        LineaVentaDTO dto = new LineaVentaDTO(10L, null, 3, null)
        ;

        LineaVenta entity = PedidoMapper.toEntity(dto);

        assertNotNull(entity);
        assertEquals(10L, entity.getProducto().getId());
        assertEquals(3, entity.getCantidad());
    }

    @Test
    void testLineaVentaToDto() {
        Producto producto = new Producto();
        producto.setId(20L);

        LineaVenta lineaVenta = new LineaVenta();
        lineaVenta.setProducto(producto);
        lineaVenta.setCantidad(5);

        LineaVentaDTO dto = PedidoMapper.toDto(lineaVenta);

        assertNotNull(dto);
        assertEquals(20L, dto.getProductoId());
        assertEquals(5, dto.getCantidad());
    }

    @Test
    void testUpdatePedidoFromRequest_WithNullLineasVenta_DoesNotOverwrite() {
        LineaVenta original = new LineaVenta();
        Producto producto = new Producto();
        producto.setId(1L);
        original.setProducto(producto);
        original.setCantidad(10);

        Pedido pedido = new Pedido();
        pedido.setLineasVenta(List.of(original));

        PedidoRequest request = new PedidoRequest();

        PedidoMapper.updatePedidoFromRequest(pedido, request);

        assertEquals(1, pedido.getLineasVenta().size());
        assertEquals(10, pedido.getLineasVenta().get(0).getCantidad());
    }

}