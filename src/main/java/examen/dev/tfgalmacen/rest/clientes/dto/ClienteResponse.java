package examen.dev.tfgalmacen.rest.clientes.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteResponse {
    private Long id;
    private Long userId;
    private String nombre;
    private String email;
    private String telefono;
    private String dni;
    private String fotoDni;
    private String direccionEnvio;
}

