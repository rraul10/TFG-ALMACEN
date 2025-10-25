package examen.dev.tfgalmacen.rest.pedido.service;

import examen.dev.tfgalmacen.rest.pedido.dto.CompraRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;

import java.util.List;

public interface PedidoService {

    List<PedidoResponse> getAll();

    PedidoResponse getById(Long id);

    PedidoResponse create(PedidoRequest request);

    PedidoResponse update(Long id, PedidoRequest request);

    void delete(Long id);

    PedidoResponse crearCompraDesdeNombreProducto(CompraRequest request);

    List<PedidoResponse> getPedidosByClienteId(Long clienteId);

    PedidoResponse actualizarEstadoPedido(Long id, EstadoPedido nuevoEstado);

    String createStripeCheckout(PedidoRequest pedidoRequest);
}
