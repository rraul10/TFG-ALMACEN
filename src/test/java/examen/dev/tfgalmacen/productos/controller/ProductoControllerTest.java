package examen.dev.tfgalmacen.productos.controller;

import examen.dev.tfgalmacen.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.productos.dto.ProductoResponse;
import examen.dev.tfgalmacen.productos.service.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
class ProductoControllerTest {

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ProductoController productoController;

    @BeforeEach
    void setUp() {
    }

    @Test
    void getAllOk() {
        ProductoResponse p1 = new ProductoResponse(1L, "Producto 1", "Tipo 1", "Descripción 1", 100.0, 10, "imagen1.png");
        ProductoResponse p2 = new ProductoResponse(2L, "Producto 2", "Tipo 2", "Descripción 2", 200.0, 20, "imagen2.png");

        when(productoService.getAll()).thenReturn(List.of(p1, p2));

        ResponseEntity<List<ProductoResponse>> response = productoController.getAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals("Producto 1", response.getBody().get(0).getNombre());
        assertEquals("Producto 2", response.getBody().get(1).getNombre());
    }

    @Test
    void getAllEmptyListProductosDeleted() {
        when(productoService.getAll()).thenReturn(List.of());

        ResponseEntity<List<ProductoResponse>> response = productoController.getAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void createOk() {
        ProductoRequest request = new ProductoRequest("Test", 5);
        ProductoResponse response = new ProductoResponse(1L, "Test", "Tipo Test", "Descripción Test", 50.0, 5, "imagenTest.png");

        when(productoService.create(request)).thenReturn(response);

        ResponseEntity<ProductoResponse> result = productoController.create(request);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Test", result.getBody().getNombre());
        assertEquals(5, result.getBody().getStock());
    }

    @Test
    void updateOk() {
        ProductoRequest request = new ProductoRequest("Producto Actualizado", 5);
        ProductoResponse response = new ProductoResponse(1L, "Producto Actualizado", "Tipo Actualizado", "Descripción Actualizada", 60.0, 5, "imagenActualizada.png");

        when(productoService.update(1L, request)).thenReturn(response);

        ResponseEntity<ProductoResponse> result = productoController.update(1L, request);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Producto Actualizado", result.getBody().getNombre());
        assertEquals(5, result.getBody().getStock());
    }

    @Test
    void deleteOk() {
        ProductoResponse response = new ProductoResponse(1L, "Producto Borrado", "Tipo Borrado", "Descripción Borrada", 0.0, 0, "imagenBorrada.png");

        doNothing().when(productoService).delete(1L);

        ResponseEntity<Void> result = productoController.delete(1L);

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
    }
}
