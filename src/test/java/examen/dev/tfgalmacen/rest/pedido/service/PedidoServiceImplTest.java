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
import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import examen.dev.tfgalmacen.websockets.notifications.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceImplTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private ClienteService clienteService;

    @Mock
    private EmailService emailService;

    @Mock
    private TicketService ticketService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PedidoServiceImpl pedidoService;

    private Pedido pedido;
    private Cliente cliente;
    private PedidoRequest pedidoRequest;

    @BeforeEach
    void setUp() {
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
        // Mocks correctos
        when(clienteService.getClienteEntityByUserId(1L)).thenReturn(cliente);

        Producto producto = new Producto();
        producto.setId(1L);
        producto.setStock(20);
        producto.setNombre("Producto Test");
        producto.setPrecio(10.0);
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any())).thenReturn(producto);

        Pedido pedidoGuardado = new Pedido();
        pedidoGuardado.setId(1L);
        pedidoGuardado.setCliente(cliente);
        pedidoGuardado.setEstado(EstadoPedido.PENDIENTE);
        pedidoGuardado.setFecha(LocalDateTime.now());
        when(pedidoRepository.save(any())).thenReturn(pedidoGuardado);

        LineaVentaDTO lineaDTO = new LineaVentaDTO();
        lineaDTO.setProductoId(1L);
        lineaDTO.setCantidad(1);

        PedidoRequest request = new PedidoRequest();
        request.setLineasVenta(List.of(lineaDTO));

        PedidoResponse response = pedidoService.create(request, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        verify(productoRepository).save(producto);
        verify(emailService, never()).notificarStockAgotado(any());
    }

    @Test
    void createWithNoLineasVentaThrowsException() {
        when(clienteService.getClienteEntityByUserId(anyLong())).thenReturn(cliente);

        PedidoRequest request = new PedidoRequest();
        request.setLineasVenta(List.of());

        PedidoNotFoundException exception = assertThrows(
                PedidoNotFoundException.class,
                () -> pedidoService.create(request, 1L)
        );

        assertEquals("El pedido debe contener al menos una línea de venta.", exception.getMessage());
    }


    @Test
    void update() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(any())).thenReturn(pedido);

        PedidoResponse result = pedidoService.update(1L, pedidoRequest);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void updatePedidoNotFound() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.empty());

        PedidoNotFoundException ex = assertThrows(
                PedidoNotFoundException.class,
                () -> pedidoService.update(1L, pedidoRequest)
        );

        assertEquals("Pedido no encontrado con id: 1", ex.getMessage());
    }

    @Test
    void delete() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        pedidoService.delete(1L);

        assertTrue(pedido.isDeleted());
        verify(pedidoRepository).save(pedido);
    }

    @Test
    void deletePedidoNotFound() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.empty());

        PedidoNotFoundException ex = assertThrows(
                PedidoNotFoundException.class,
                () -> pedidoService.delete(1L)
        );

        assertEquals("Pedido no encontrado con id: 1", ex.getMessage());
    }

    @Test
    void crearCompraDesdeNombreProducto_Success() throws Exception {
        Long clienteId = 1L;
        String productoNombre = "Producto de prueba";
        int cantidad = 2;

        Producto productoMock = new Producto();
        productoMock.setStock(10);
        productoMock.setPrecio(50.0);
        productoMock.setNombre(productoNombre);

        Cliente clienteMock = new Cliente();
        clienteMock.setId(clienteId);
        User userMock = new User();
        userMock.setCorreo("test@correo.com");
        clienteMock.setUser(userMock);

        CompraRequest request = CompraRequest.builder()
                .productoNombre(productoNombre)
                .cantidad(cantidad)
                .userId(clienteId)
                .build();

        when(productoRepository.findByNombreIgnoreCase(productoNombre))
                .thenReturn(Optional.of(productoMock));

        // ⚡ Corregido: mock del cliente usando el método correcto
        when(clienteService.getClienteEntityByUserId(clienteId)).thenReturn(clienteMock);

        when(pedidoRepository.save(any(Pedido.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(ticketService.generarTicketPDF(any(Pedido.class)))
                .thenReturn(new ByteArrayOutputStream());

        doNothing().when(emailService).enviarTicketPorEmail(anyString(), any(ByteArrayOutputStream.class));

        PedidoResponse response = pedidoService.crearCompraDesdeNombreProducto(request);

        assertNotNull(response);
        assertEquals(clienteId, response.getClienteId());

        // ⚡ Corregido: usar eq() para no mezclar matchers y valores literales
        verify(emailService).enviarTicketPorEmail(eq("test@correo.com"), any(ByteArrayOutputStream.class));
        verify(productoRepository).findByNombreIgnoreCase(productoNombre);
        verify(clienteService).getClienteEntityByUserId(clienteId);
        verify(ticketService).generarTicketPDF(any(Pedido.class));
        verify(pedidoRepository, times(1)).save(any(Pedido.class));
    }


    @Test
    void crearCompraDesdeNombreProducto_ProductoNoEncontrado() {
        CompraRequest request = CompraRequest.builder()
                .productoNombre("Producto")
                .cantidad(2)
                .userId(1L)
                .build();

        when(productoRepository.findByNombreIgnoreCase("Producto")).thenReturn(Optional.empty());

        assertThrows(ProductoNotFoundException.class, () ->
                pedidoService.crearCompraDesdeNombreProducto(request)
        );
    }

    @Test
    void actualizarEstadoPedido_Success() {
        Pedido pedidoMock = new Pedido();
        pedidoMock.setId(1L);
        pedidoMock.setEstado(EstadoPedido.PENDIENTE);
        Cliente clienteMock = new Cliente();
        pedidoMock.setCliente(clienteMock);

        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedidoMock));
        when(pedidoRepository.save(any())).thenReturn(pedidoMock);
        doNothing().when(emailService).notificarCambioEstadoPedido(any(), any());

        PedidoResponse response = pedidoService.actualizarEstado(1L, EstadoPedido.ENTREGADO.name());

        assertEquals(EstadoPedido.ENTREGADO, response.getEstado());
        verify(emailService).notificarCambioEstadoPedido(any(), any());
    }

    @Test
    void actualizarEstadoPedido_PedidoNoEncontrado() {
        when(pedidoRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () ->
                pedidoService.actualizarEstado(1L, EstadoPedido.ENTREGADO.name())
        );
    }
}
