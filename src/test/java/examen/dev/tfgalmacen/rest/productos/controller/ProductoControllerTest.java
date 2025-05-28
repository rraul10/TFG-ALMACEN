package examen.dev.tfgalmacen.rest.productos.controller;

import examen.dev.tfgalmacen.rest.productos.controller.ProductoController;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoResponse;
import examen.dev.tfgalmacen.rest.productos.service.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class ProductoControllerTest {

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ProductoController productoController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productoController).build();
    }

    @Test
    void getAllOk() throws Exception {
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
    void getAllEmptyListProductosDeleted() throws Exception {
        when(productoService.getAll()).thenReturn(List.of());

        ResponseEntity<List<ProductoResponse>> response = productoController.getAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void createOk() throws Exception {
        ProductoRequest request = new ProductoRequest("Test", 5);
        request.setImagen("default.jpg");

        ProductoResponse response = new ProductoResponse(1L, "Test", "Tipo Test", "Descripción Test", 50.0, 5, "default.jpg");

        when(productoService.create(eq(request))).thenReturn(response);

        String productoJson = "{\"nombre\":\"Test\",\"stock\":5}";

        MockMultipartFile productoPart = new MockMultipartFile(
                "producto",
                "",
                "application/json",
                productoJson.getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/productos/create")
                        .file(productoPart)
                        .with(req -> {
                            req.setMethod("POST");
                            return req;
                        }))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nombre").value("Test"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.stock").value(5));

        verify(productoService).create(eq(request));
    }

    @Test
    void updateOk() throws Exception {
        ProductoRequest request = new ProductoRequest("Producto Actualizado", 5);
        request.setImagen("default.jpg");

        ProductoResponse response = new ProductoResponse(1L, "Producto Actualizado", "Tipo Actualizado", "Descripción Actualizada", 60.0, 5, "default.jpg");

        when(productoService.update(eq(1L), eq(request))).thenReturn(response);

        String productoJson = "{\"nombre\":\"Producto Actualizado\",\"stock\":5}";

        MockMultipartFile productoPart = new MockMultipartFile(
                "producto",
                "",
                "application/json",
                productoJson.getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/productos/1")
                        .file(productoPart)
                        .with(req -> {
                            req.setMethod("PUT");
                            return req;
                        }))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.nombre").value("Producto Actualizado"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.stock").value(5));

        verify(productoService).update(eq(1L), eq(request));
    }

    @Test
    void deleteOk() throws Exception {
        doNothing().when(productoService).delete(1L);

        ResponseEntity<Void> result = productoController.delete(1L);

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
    }
}
