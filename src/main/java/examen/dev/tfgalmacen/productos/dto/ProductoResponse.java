package examen.dev.tfgalmacen.productos.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String tipo;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String imagen;
}

