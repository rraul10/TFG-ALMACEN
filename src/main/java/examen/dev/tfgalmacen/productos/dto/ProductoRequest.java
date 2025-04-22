package examen.dev.tfgalmacen.productos.dto;

import lombok.Data;

@Data
public class ProductoRequest {
    private String nombre;
    private String tipo;
    private String imagen;
    private String descripcion;
    private Double precio;
    private Integer stock;
}

