package examen.dev.tfgalmacen.rest.pedido.service;

import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.rest.pedido.dto.LineaVentaDTO;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoRequest;
import examen.dev.tfgalmacen.rest.pedido.dto.PedidoResponse;
import examen.dev.tfgalmacen.rest.pedido.exceptions.PedidoNotFoundException;
import examen.dev.tfgalmacen.rest.pedido.mapper.PedidoMapper;
import examen.dev.tfgalmacen.rest.pedido.models.EstadoPedido;
import examen.dev.tfgalmacen.rest.pedido.models.LineaVenta;
import examen.dev.tfgalmacen.rest.pedido.models.Pedido;
import examen.dev.tfgalmacen.rest.pedido.repository.PedidoRepository;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class PedidoServiceImplTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ClienteService clienteService;

    @InjectMocks
    private PedidoServiceImpl pedidoService;

    private Pedido pedido;
    private Cliente cliente;
    private PedidoRequest pedidoRequest;

    @BeforeEach
    public void setUp() {
        cliente = new Cliente();
        cliente.setId(1L);

        pedido = new Pedido();
        pedido.setId(1L);
        pedido.setCliente(cliente);
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setFecha(LocalDateTime.now());

        pedidoRequest = new PedidoRequest();
        pedidoRequest.setClienteId(1L);
        pedidoRequest.setLineasVenta(new ArrayList<>());
    }

    @Test
    void getAll() {
        when(pedidoRepository.findAllByDeletedFalse()).thenReturn(List.of(pedido));

        List<PedidoResponse> result = pedidoService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void getById() {
        when(pedidoRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(pedido));

        PedidoResponse result = pedidoService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getByIdNotFound() {
        when(pedidoRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());

        assertThrows(PedidoNotFoundException.class, () -> pedidoService.getById(1L));
    }

    @Test
    void create() {
        when(clienteService.getClienteEntityById(1L)).thenReturn(cliente);
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);

        LineaVenta lineaVenta = new LineaVenta();
        Producto producto = new Producto();
        producto.setId(1L);
        lineaVenta.setProducto(producto);
        lineaVenta.setCantidad(1);

        LineaVentaDTO lineaVentaDTO = PedidoMapper.toDto(lineaVenta);

        pedidoRequest.setLineasVenta(List.of(lineaVentaDTO));

        PedidoResponse result = pedidoService.create(pedidoRequest);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void createWithNoLineasVenta() {
        pedidoRequest.setLineasVenta(null);

        assertThrows(PedidoNotFoundException.class, () -> pedidoService.create(pedidoRequest));
    }

    @Test
    void createWhenNoLineasVentaThrowsException() {
        PedidoRequest request = new PedidoRequest();
        request.setClienteId(1L);
        request.setLineasVenta(List.of());

        PedidoNotFoundException exception = assertThrows(
                PedidoNotFoundException.class,
                () -> pedidoService.create(request)
        );

        assertEquals("El pedido debe contener al menos una línea de venta.", exception.getMessage());
    }


    @Test
    void update() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);

        PedidoResponse result = pedidoService.update(1L, pedidoRequest);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void updatePedidoNotFound() {
        PedidoRequest request = new PedidoRequest();
        request.setClienteId(1L);
        request.setLineasVenta(List.of());

        when(pedidoRepository.findById(1L)).thenReturn(Optional.empty());

        PedidoNotFoundException exception = assertThrows(
                PedidoNotFoundException.class,
                () -> pedidoService.update(1L, request)
        );

        assertEquals("Pedido no encontrado con id: 1", exception.getMessage());
    }


    @Test
    void delete() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        pedidoService.delete(1L);

        verify(pedidoRepository, times(1)).save(any(Pedido.class));
    }

    @Test
    void deletePedidoNotFound() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.empty());

        PedidoNotFoundException exception = assertThrows(
                PedidoNotFoundException.class,
                () -> pedidoService.delete(1L)
        );

        assertEquals("Pedido no encontrado con id: 1", exception.getMessage());
    }

}
