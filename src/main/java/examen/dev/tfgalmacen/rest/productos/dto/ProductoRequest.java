package examen.dev.tfgalmacen.rest.productos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoRequest {
    private String nombre;
    private String tipo;
    private String imagen;
    private String descripcion;
    private Double precio;
    private Integer stock;

    public ProductoRequest(String nombre, Integer stock) {
        this.nombre = nombre;
        this.stock = stock;
    }
}

