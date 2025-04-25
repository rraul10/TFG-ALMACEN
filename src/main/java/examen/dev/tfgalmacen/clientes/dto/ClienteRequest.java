package examen.dev.tfgalmacen.clientes.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteRequest {
    private Long userId;
    private String dni;
    private String fotoDni;
    private String direccionEnvio;
}

