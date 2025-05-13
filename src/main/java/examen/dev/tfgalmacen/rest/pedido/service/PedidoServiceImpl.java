package examen.dev.tfgalmacen.rest.pedido.service;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.exceptions.PedidoNotFoundException;
import examen.dev.tfgalmacen.rest.pedido.mapper.PedidoMapper;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.pedido.repository.PedidoRepository;
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
        return pedidoRepository.findAllByDeletedFalse().stream()
                .map(PedidoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PedidoResponse getById(Long id) {
        Pedido pedido = pedidoRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido no encontrado con id: " + id));
        return PedidoMapper.toDto(pedido);
    }


    @Override
    public PedidoResponse create(PedidoRequest request) {
        if (request.getLineasVenta() == null || request.getLineasVenta().isEmpty()) {
            throw new PedidoNotFoundException("El pedido debe contener al menos una línea de venta.");
        }

        Cliente cliente = clienteService.getClienteEntityById(request.getClienteId());

        Pedido pedido = PedidoMapper.toEntity(request, cliente);

        LocalDateTime now = LocalDateTime.now();
        pedido.setFecha(now);
        pedido.setCreated(now);
        pedido.setUpdated(now);
        pedido.setDeleted(false);
        pedido.setEstado(EstadoPedido.PENDIENTE);

        Pedido saved = pedidoRepository.save(pedido);
        System.out.println("Pedido creado con ID: " + saved.getId());

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
