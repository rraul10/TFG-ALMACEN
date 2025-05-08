package examen.dev.tfgalmacen.productos.mapper;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import examen.dev.tfgalmacen.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.productos.dto.ProductoResponse;
import examen.dev.tfgalmacen.productos.models.Producto;
import org.junit.jupiter.api.BeforeEach;

class ProductoMapperTest {

    private ProductoMapper productoMapper;

    @BeforeEach
    void setUp() {
        productoMapper = new ProductoMapper();
    }

    @Test
    void testToEntity() {
        ProductoRequest request = ProductoRequest.builder()
                .nombre("Camiseta")
                .tipo("Ropa")
                .imagen("camiseta.jpg")
                .descripcion("Camiseta de algodón")
                .precio(19.99)
                .stock(50)
                .build();

        Producto producto = productoMapper.toEntity(request);

        assertEquals("Camiseta", producto.getNombre());
        assertEquals("Ropa", producto.getTipo());
        assertEquals("camiseta.jpg", producto.getImagen());
        assertEquals("Camiseta de algodón", producto.getDescripcion());
        assertEquals(19.99, producto.getPrecio());
        assertEquals(50, producto.getStock());
    }

    @Test
    void testToDto() {
        Producto producto = Producto.builder()
                .id(1L)
                .nombre("Zapatos")
                .tipo("Calzado")
                .imagen("zapatos.jpg")
                .descripcion("Zapatos de cuero")
                .precio(59.99)
                .stock(10)
                .build();

        ProductoResponse response = productoMapper.toDto(producto);

        assertEquals(1L, response.getId());
        assertEquals("Zapatos", response.getNombre());
        assertEquals("Calzado", response.getTipo());
        assertEquals("zapatos.jpg", response.getImagen());
        assertEquals("Zapatos de cuero", response.getDescripcion());
        assertEquals(59.99, response.getPrecio());
        assertEquals(10, response.getStock());
    }

    @Test
    void testUpdateProductoFromRequest() {
        Producto producto = Producto.builder()
                .nombre("Antiguo")
                .tipo("Viejo")
                .imagen("viejo.jpg")
                .descripcion("Descripción vieja")
                .precio(10.0)
                .stock(5)
                .build();

        ProductoRequest request = ProductoRequest.builder()
                .nombre("Nuevo")
                .tipo("Moderno")
                .imagen("nuevo.jpg")
                .descripcion("Descripción nueva")
                .precio(25.5)
                .stock(20)
                .build();

        productoMapper.updateProductoFromRequest(producto, request);

        assertEquals("Nuevo", producto.getNombre());
        assertEquals("Moderno", producto.getTipo());
        assertEquals("nuevo.jpg", producto.getImagen());
        assertEquals("Descripción nueva", producto.getDescripcion());
        assertEquals(25.5, producto.getPrecio());
        assertEquals(20, producto.getStock());
    }
}
