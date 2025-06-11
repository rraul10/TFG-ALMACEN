package examen.dev.tfgalmacen.rest.productos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String tipo;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String imagen;
}

