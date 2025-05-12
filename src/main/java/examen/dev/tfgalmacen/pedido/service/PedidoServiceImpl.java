package examen.dev.tfgalmacen.pedido.service;

import examen.dev.tfgalmacen.clientes.models.Cliente;
import examen.dev.tfgalmacen.clientes.service.ClienteService;
import examen.dev.tfgalmacen.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.pedido.exceptions.PedidoNotFoundException;
import examen.dev.tfgalmacen.pedido.mapper.PedidoMapper;
import examen.dev.tfgalmacen.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.pedido.models.Pedido;
import examen.dev.tfgalmacen.pedido.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteService clienteService;

    @Override
    public List<PedidoResponse> getAll() {
        return pedidoRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(PedidoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PedidoResponse getById(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido no encontrado con id: " + id));
        return PedidoMapper.toDto(pedido);
    }

    @Override
    public PedidoResponse create(PedidoRequest request) {
        if (request.getLineasVenta() == null || request.getLineasVenta().isEmpty()) {
            throw new IllegalArgumentException("El pedido debe contener al menos una línea de venta.");
        }

        Cliente cliente = clienteService.getClienteEntityById(request.getClienteId());

        Pedido pedido = PedidoMapper.toEntity(request, cliente);

        LocalDateTime now = LocalDateTime.now();
        pedido.setFecha(now);
        pedido.setCreated(now);
        pedido.setUpdated(now);

        pedido.setEstado(EstadoPedido.PENDIENTE);

        pedidoRepository.save(pedido);

        return PedidoMapper.toDto(pedido);
    }


    @Override
    public PedidoResponse update(Long id, PedidoRequest request) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido no encontrado con id: " + id));

        PedidoMapper.updatePedidoFromRequest(pedido, request);
        pedido.setUpdated(LocalDateTime.now());

        pedidoRepository.save(pedido);

        return PedidoMapper.toDto(pedido);
    }

    @Override
    public void delete(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido no encontrado con id: " + id));

        pedido.setDeleted(true);
        pedidoRepository.save(pedido);
    }
}
