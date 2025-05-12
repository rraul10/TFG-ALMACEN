package examen.dev.tfgalmacen.pedido.service;

import examen.dev.tfgalmacen.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.pedido.dto.PedidoResponse;

import java.util.List;

public interface PedidoService {

    List<PedidoResponse> getAll();

    PedidoResponse getById(Long id);

    PedidoResponse create(PedidoRequest request);

    PedidoResponse update(Long id, PedidoRequest request);

    void delete(Long id);
}
