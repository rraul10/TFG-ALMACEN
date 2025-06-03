package examen.dev.tfgalmacen.rest.pedido.service;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.rest.pedido.dto.CompraRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.LineaVentaDTO;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.exceptions.PedidoNotFoundException;
import examen.dev.tfgalmacen.rest.pedido.mapper.PedidoMapper;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.models.LineaVenta;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.pedido.repository.PedidoRepository;
import examen.dev.tfgalmacen.rest.productos.exceptions.ProductoNotFoundException;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import examen.dev.tfgalmacen.rest.productos.repository.ProductoRepository;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import examen.dev.tfgalmacen.websockets.notifications.TicketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteService clienteService;
    private final ProductoRepository productoRepository;
    private final EmailService emailService;
    private final TicketService  ticketService;

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
    @Transactional
    public PedidoResponse create(PedidoRequest request) {
        if (request.getLineasVenta() == null || request.getLineasVenta().isEmpty()) {
            throw new PedidoNotFoundException("El pedido debe contener al menos una línea de venta.");
        }

        Cliente cliente = clienteService.getClienteEntityById(request.getClienteId());

        List<LineaVenta> lineasVenta = new ArrayList<>();

        for (LineaVentaDTO lineaDTO : request.getLineasVenta()) {
            Producto producto = productoRepository.findById(lineaDTO.getProductoId())
                    .orElseThrow(() -> new ProductoNotFoundException(
                            "Producto no encontrado con ID: " + lineaDTO.getProductoId()));

            if (producto.getStock() == null || producto.getStock() < lineaDTO.getCantidad()) {
                throw new ProductoNotFoundException(
                        "Stock insuficiente para el producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - lineaDTO.getCantidad());
            productoRepository.save(producto);

            if (producto.getStock() < 10) {
                emailService.notificarStockAgotado(producto);
            }

            LineaVenta linea = LineaVenta.builder()
                    .producto(producto)
                    .cantidad(lineaDTO.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .build();

            lineasVenta.add(linea);
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setFecha(LocalDateTime.now());
        pedido.setLineasVenta(lineasVenta);

        lineasVenta.forEach(lv -> lv.setPedido(pedido));

        Pedido saved = pedidoRepository.save(pedido);

        return PedidoMapper.toDto(saved);
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

    @Override
    @Transactional
    public PedidoResponse crearCompraDesdeNombreProducto(CompraRequest request) {
        Producto producto = productoRepository.findByNombreIgnoreCase(request.getProductoNombre())
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado"));

        if (producto.getStock() < request.getCantidad()) {
            throw new ProductoNotFoundException("Stock insuficiente");
        }

        producto.setStock(producto.getStock() - request.getCantidad());
        productoRepository.save(producto);

        if (producto.getStock() <= 10) {
            emailService.notificarStockAgotado(producto);
        }

        LineaVenta linea = LineaVenta.builder()
                .producto(producto)
                .cantidad(request.getCantidad())
                .precioUnitario(producto.getPrecio())
                .build();

        Pedido pedido = new Pedido();
        pedido.setCliente(clienteService.getClienteEntityById(request.getClienteId()));
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setFecha(LocalDateTime.now());
        pedido.setLineasVenta(new ArrayList<>());

        linea.setPedido(pedido);
        pedido.getLineasVenta().add(linea);

        pedidoRepository.save(pedido);

        ByteArrayOutputStream pdfStream = ticketService.generarTicketPDF(pedido);

        String emailCliente = pedido.getCliente().getUser().getCorreo();
        emailService.enviarTicketPorEmail(emailCliente, pdfStream);

        return PedidoMapper.toDto(pedido);
    }



    @Override
    public List<PedidoResponse> getPedidosByClienteId(Long clienteId) {
        List<Pedido> pedidos = pedidoRepository.findByClienteIdAndDeletedFalse(clienteId);
        return pedidos.stream()
                .map(PedidoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PedidoResponse actualizarEstadoPedido(Long id, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido no encontrado con id: " + id));

        if (pedido.getEstado() == EstadoPedido.ENTREGADO) {
            throw new PedidoNotFoundException("No se puede cambiar el estado de un pedido entregado.");
        }

        EstadoPedido estadoAnterior = pedido.getEstado();

        pedido.setEstado(nuevoEstado);
        Pedido savedPedido = pedidoRepository.save(pedido);

        if (!estadoAnterior.equals(nuevoEstado)) {
            String mensaje = "El estado de su pedido ha cambiado a: " + nuevoEstado;
            emailService.notificarCambioEstadoPedido(pedido, mensaje);
        }

        return PedidoMapper.toDto(savedPedido);
    }


}
