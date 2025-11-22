package examen.dev.tfgalmacen.auth.resetPassword.controller;

import examen.dev.tfgalmacen.auth.resetPassword.services.PasswordResetService;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.websockets.notifications.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final ClienteService clienteService;
    private final PasswordResetService passwordResetService;
    private final EmailService emailService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            Cliente cliente = clienteService.getClienteByEmail(email);
            if (cliente == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email no encontrado");
            }

            var token = passwordResetService.createToken(cliente);
            emailService.enviarEmailResetPassword(email, token.getToken());

            return ResponseEntity.ok("Correo enviado si el email existe.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar correo: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String nuevaPass = request.get("newPassword");

            Cliente cliente = passwordResetService.validateToken(token);
            passwordResetService.updatePassword(cliente, nuevaPass);
            passwordResetService.deleteToken(token);

            return ResponseEntity.ok("Contraseña actualizada con éxito.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor: " + e.getMessage());
        }
    }


}



