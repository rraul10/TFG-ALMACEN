package examen.dev.tfgalmacen.productos.service;

import examen.dev.tfgalmacen.rest.productos.service.ProductoServiceImpl;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoResponse;
import examen.dev.tfgalmacen.rest.productos.exceptions.ProductoNotFoundException;
import examen.dev.tfgalmacen.rest.productos.mapper.ProductoMapper;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import examen.dev.tfgalmacen.rest.productos.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductoServiceImplTest {

    private ProductoRepository productoRepository;
    private ProductoMapper productoMapper;
    private EmailService emailService;
    private ProductoServiceImpl productoService;

    @BeforeEach
    void setUp() {
        productoRepository = mock(ProductoRepository.class);
        productoMapper = mock(ProductoMapper.class);
        emailService = mock(EmailService.class);
        productoService = new ProductoServiceImpl(productoRepository, productoMapper, emailService);
    }

    @Test
    void getAllOk() {
        Producto p1 = Producto.builder().id(1L).nombre("A").deleted(false).build();
        Producto p2 = Producto.builder().id(2L).nombre("B").deleted(true).build();
        Producto p3 = Producto.builder().id(3L).nombre("C").deleted(false).build();

        when(productoRepository.findAll()).thenReturn(Arrays.asList(p1, p2, p3));
        when(productoMapper.toDto(p1)).thenReturn(ProductoResponse.builder().id(1L).nombre("A").build());
        when(productoMapper.toDto(p3)).thenReturn(ProductoResponse.builder().id(3L).nombre("C").build());

        List<ProductoResponse> result = productoService.getAll();

        assertEquals(2, result.size());
        assertEquals("A", result.get(0).getNombre());
        assertEquals("C", result.get(1).getNombre());
    }

    @Test
    void getAllEmptyListProductosDeleted() {
        Producto p1 = Producto.builder().id(1L).nombre("Prod1").deleted(true).build();
        Producto p2 = Producto.builder().id(2L).nombre("Prod2").deleted(true).build();

        when(productoRepository.findAll()).thenReturn(List.of(p1, p2));

        List<ProductoResponse> result = productoService.getAll();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }


    @Test
    void getByIdOk() {
        Producto producto = Producto.builder().id(1L).nombre("Producto").build();
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(productoMapper.toDto(producto)).thenReturn(ProductoResponse.builder().id(1L).nombre("Producto").build());

        ProductoResponse response = productoService.getById(1L);

        assertEquals(1L, response.getId());
        assertEquals("Producto", response.getNombre());
    }

    @Test
    void getByIdNotFound() {
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ProductoNotFoundException.class, () -> productoService.getById(99L));
    }

    @Test
    void createOk() {
        ProductoRequest request = ProductoRequest.builder().nombre("Test").stock(5).build();
        Producto producto = Producto.builder().id(1L).nombre("Test").stock(5).build();
        ProductoResponse response = ProductoResponse.builder().id(1L).nombre("Test").stock(5).build();

        when(productoMapper.toEntity(request)).thenReturn(producto);
        when(productoMapper.toDto(producto)).thenReturn(response);

        ProductoResponse result = productoService.create(request);

        verify(productoRepository).save(producto);
        verify(emailService).notificarStockAgotado(producto);
        assertEquals("Test", result.getNombre());
    }

    @Test
    void createFailswhenNombreIsNull() {
        ProductoRequest request = ProductoRequest.builder()
                .nombre(null)
                .tipo("tipo")
                .descripcion("desc")
                .imagen("img")
                .precio(10.0)
                .stock(20)
                .build();

        assertThrows(IllegalArgumentException.class, () -> {
            productoService.create(request);
        });

        verifyNoInteractions(productoRepository);
        verifyNoInteractions(emailService);
    }

    @Test
    void createOkWithoutNotification() {
        ProductoRequest request = ProductoRequest.builder().nombre("Producto").stock(50).build();
        Producto producto = Producto.builder().id(1L).nombre("Producto").stock(50).build();
        ProductoResponse response = ProductoResponse.builder().id(1L).nombre("Producto").stock(50).build();

        when(productoMapper.toEntity(request)).thenReturn(producto);
        when(productoMapper.toDto(producto)).thenReturn(response);

        ProductoResponse result = productoService.create(request);

        assertEquals("Producto", result.getNombre());
        verify(productoRepository).save(producto);
        verify(emailService, never()).notificarStockAgotado(any());
    }

    @Test
    void createFailswhenNombreIsBlank() {
        ProductoRequest request = ProductoRequest.builder()
                .nombre("   ")
                .tipo("tipo")
                .descripcion("desc")
                .imagen("img")
                .precio(10.0)
                .stock(20)
                .build();

        assertThrows(IllegalArgumentException.class, () -> productoService.create(request));

        verifyNoInteractions(productoRepository);
        verifyNoInteractions(emailService);
    }


    @Test
    void updateOk() {
        Producto producto = Producto.builder()
                .id(1L)
                .nombre("Producto Original")
                .stock(100)
                .build();

        ProductoRequest request = ProductoRequest.builder()
                .nombre("Producto Actualizado")
                .stock(5)
                .build();

        ProductoResponse response = ProductoResponse.builder()
                .id(1L)
                .nombre("Producto Actualizado")
                .stock(5)
                .build();

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        doAnswer(invocation -> {
            Producto p = invocation.getArgument(0);
            ProductoRequest r = invocation.getArgument(1);
            p.setNombre(r.getNombre());
            p.setStock(r.getStock());
            return null;
        }).when(productoMapper).updateProductoFromRequest(any(Producto.class), any(ProductoRequest.class));

        when(productoMapper.toDto(producto)).thenReturn(response);
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        ProductoResponse result = productoService.update(1L, request);

        assertNotNull(result);
        assertEquals("Producto Actualizado", result.getNombre());
        assertEquals(5, result.getStock());

        verify(emailService).notificarStockAgotado(producto);
    }

    @Test
    void updateOkWithoutNotification() {
        Producto producto = Producto.builder().id(1L).nombre("Antiguo").stock(100).build();
        ProductoRequest request = ProductoRequest.builder().nombre("Nuevo").stock(100).build();
        ProductoResponse response = ProductoResponse.builder().id(1L).nombre("Nuevo").stock(100).build();

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        doAnswer(invocation -> {
            Producto p = invocation.getArgument(0);
            ProductoRequest r = invocation.getArgument(1);
            p.setNombre(r.getNombre());
            p.setStock(r.getStock());
            return null;
        }).when(productoMapper).updateProductoFromRequest(any(), any());

        when(productoMapper.toDto(producto)).thenReturn(response);
        when(productoRepository.save(any())).thenReturn(producto);

        ProductoResponse result = productoService.update(1L, request);

        assertEquals("Nuevo", result.getNombre());
        verify(emailService, never()).notificarStockAgotado(any());
    }


    @Test
    void updateNotFound() {
        ProductoRequest request = ProductoRequest.builder().nombre("Nuevo").stock(10).build();
        when(productoRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductoNotFoundException.class, () -> productoService.update(999L, request));

        verify(productoRepository, never()).save(any());
        verifyNoInteractions(emailService);
    }


    @Test
    void deleteOk() {
        Producto producto = Producto.builder().id(1L).deleted(false).build();
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        productoService.delete(1L);

        assertTrue(producto.isDeleted());
        verify(productoRepository).save(producto);
    }

    @Test
    void deleteNotFound() {
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ProductoNotFoundException.class, () -> productoService.delete(99L));
    }
}
