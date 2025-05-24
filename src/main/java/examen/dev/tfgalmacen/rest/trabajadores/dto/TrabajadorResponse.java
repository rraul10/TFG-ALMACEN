package examen.dev.tfgalmacen.rest.trabajadores.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrabajadorResponse {
    private Long id;
    private Long userId;
    private String nombre;
    private String correo;
    private String numeroSeguridadSocial;
}
