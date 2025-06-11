package examen.dev.tfgalmacen.rest.productos.mapper;

import examen.dev.tfgalmacen.rest.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoResponse;
import examen.dev.tfgalmacen.rest.productos.models.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public Producto toEntity(ProductoRequest request) {
        return Producto.builder()
                .nombre(request.getNombre())
                .tipo(request.getTipo())
                .imagen(request.getImagen())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .stock(request.getStock())
                .build();
    }

    public ProductoResponse toDto(Producto producto) {
        return ProductoResponse.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .tipo(producto.getTipo())
                .descripcion(producto.getDescripcion())
                .imagen(producto.getImagen())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .build();
    }

    public void updateProductoFromRequest(Producto producto, ProductoRequest request) {
        producto.setNombre(request.getNombre());
        producto.setTipo(request.getTipo());
        producto.setImagen(request.getImagen());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
    }
}

