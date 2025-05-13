package examen.dev.tfgalmacen.rest.productos.service;

import examen.dev.tfgalmacen.rest.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.rest.productos.dto.ProductoResponse;

import java.util.List;

public interface ProductoService {

    List<ProductoResponse> getAll();

    ProductoResponse getById(Long id);

    ProductoResponse create(ProductoRequest request);

    ProductoResponse update(Long id, ProductoRequest request);

    void delete(Long id);
}
