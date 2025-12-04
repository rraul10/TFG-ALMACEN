package examen.dev.tfgalmacen.rest.productos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoResponse;
import examen.dev.tfgalmacen.rest.productos.service.ProductoService;
import examen.dev.tfgalmacen.storage.service.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductoControllerTest {

    private ProductoService productoService;
    private StorageService storageService;
    private ProductoController productoController;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        productoService = Mockito.mock(ProductoService.class);
        storageService = Mockito.mock(StorageService.class);
        productoController = new ProductoController(productoService, storageService);
        mockMvc = MockMvcBuilders.standaloneSetup(productoController).build();
    }

    @Test
    void getAllOk() throws Exception {
        ProductoResponse p1 = new ProductoResponse(1L, "Producto 1", "Tipo 1", "Descripción 1", 100.0, 10, "imagen1.png");
        ProductoResponse p2 = new ProductoResponse(2L, "Producto 2", "Tipo 2", "Descripción 2", 200.0, 20, "imagen2.png");

        when(productoService.getAll()).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Producto 1"))
                .andExpect(jsonPath("$[1].nombre").value("Producto 2"));
    }

    @Test
    void getByIdOk() throws Exception {
        ProductoResponse producto = new ProductoResponse(1L, "Producto 1", "Tipo 1", "Descripción 1", 100.0, 10, "imagen1.png");

        when(productoService.getById(1L)).thenReturn(producto);

        mockMvc.perform(get("/api/productos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Producto 1"))
                .andExpect(jsonPath("$.tipo").value("Tipo 1"))
                .andExpect(jsonPath("$.descripcion").value("Descripción 1"))
                .andExpect(jsonPath("$.precio").value(100.0))
                .andExpect(jsonPath("$.stock").value(10))
                .andExpect(jsonPath("$.imagen").value("imagen1.png"));

        verify(productoService).getById(1L);
    }

    @Test
    void createOk() throws Exception {
        ProductoRequest request = new ProductoRequest("Test", 5);
        request.setImagen("default.jpg");
        ProductoResponse response = new ProductoResponse(1L, "Test", "Tipo Test", "Descripción Test", 50.0, 5, "default.jpg");

        when(storageService.store(any())).thenReturn("default.jpg");
        when(productoService.create(any(ProductoRequest.class))).thenReturn(response);

        String productoJson = "{\"nombre\":\"Test\",\"stock\":5}";
        MockMultipartFile productoPart = new MockMultipartFile("producto", "", "application/json", productoJson.getBytes());

        mockMvc.perform(multipart("/api/productos/create")
                        .file(productoPart)
                        .with(req -> { req.setMethod("POST"); return req; }))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Test"))
                .andExpect(jsonPath("$.stock").value(5));
    }

    @Test
    void createFail() throws Exception {
        when(storageService.store(any())).thenReturn("default.jpg");
        when(productoService.create(any(ProductoRequest.class)))
                .thenThrow(new RuntimeException("Error creando producto"));

        String productoJson = "{\"nombre\":\"Test\",\"stock\":5}";
        MockMultipartFile productoPart = new MockMultipartFile("producto", "", "application/json", productoJson.getBytes());

        mockMvc.perform(multipart("/api/productos/create")
                        .file(productoPart)
                        .with(req -> { req.setMethod("POST"); return req; }))
                .andExpect(status().isCreated()) // El controller devuelve 201 aunque haya aviso
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Producto creado, pero hubo un aviso: Error creando producto")));
    }

    @Test
    void updateOk() throws Exception {
        ProductoRequest request = new ProductoRequest("Producto Actualizado", 5);
        request.setImagen("default.jpg");
        ProductoResponse response = new ProductoResponse(1L, "Producto Actualizado", "Tipo Actualizado", "Descripción Actualizada", 60.0, 5, "default.jpg");

        when(storageService.store(any())).thenReturn("default.jpg");
        when(productoService.update(anyLong(), any(ProductoRequest.class))).thenReturn(response);

        String productoJson = "{\"nombre\":\"Producto Actualizado\",\"stock\":5}";
        MockMultipartFile productoPart = new MockMultipartFile("producto", "", "application/json", productoJson.getBytes());

        mockMvc.perform(multipart("/api/productos/1")
                        .file(productoPart)
                        .with(req -> { req.setMethod("PUT"); return req; }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Producto Actualizado"))
                .andExpect(jsonPath("$.stock").value(5));
    }

    @Test
    void deleteOk() throws Exception {
        doNothing().when(productoService).delete(1L);

        mockMvc.perform(delete("/api/productos/1"))
                .andExpect(status().isNoContent());
    }
}
