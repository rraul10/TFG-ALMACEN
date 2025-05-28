package examen.dev.tfgalmacen.rest.clientes.dto;


import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteRequest {

    @NotNull(message = "El ID de usuario es obligatorio")
    private Long userId;

    @NotBlank(message = "El DNI es obligatorio")
    private String dni;

    private String fotoDni;

    @NotBlank(message = "La dirección de envío es obligatoria")
    private String direccionEnvio;
}

