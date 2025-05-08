package examen.dev.tfgalmacen.productos.service;

import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import examen.dev.tfgalmacen.productos.dto.ProductoRequest;
import examen.dev.tfgalmacen.productos.dto.ProductoResponse;
import examen.dev.tfgalmacen.productos.exceptions.ProductoNotFoundException;
import examen.dev.tfgalmacen.productos.mapper.ProductoMapper;
import examen.dev.tfgalmacen.productos.models.Producto;
import examen.dev.tfgalmacen.productos.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoMapper productoMapper;
    private final EmailService emailService;


    @Override
    public List<ProductoResponse> getAll() {
        return productoRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(productoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductoResponse getById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado"));
        return productoMapper.toDto(producto);
    }

    @Override
    public ProductoResponse create(ProductoRequest request) {
        if (request.getNombre() == null || request.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del producto no puede ser nulo o vacío");
        }

        Producto producto = productoMapper.toEntity(request);
        productoRepository.save(producto);

        if (producto.getStock() <= 10) {
            emailService.notificarStockAgotado(producto);
        }

        return productoMapper.toDto(producto);
    }


    @Override
    public ProductoResponse update(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado"));

        productoMapper.updateProductoFromRequest(producto, request);
        productoRepository.save(producto);

        if (producto.getStock() <= 10) {
            emailService.notificarStockAgotado(producto);
        }

        return productoMapper.toDto(producto);
    }

    @Override
    public void delete(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado"));

        producto.setDeleted(true);

        productoRepository.save(producto);
    }

}

