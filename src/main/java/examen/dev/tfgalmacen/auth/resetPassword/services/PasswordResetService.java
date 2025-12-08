package examen.dev.tfgalmacen.auth.resetPassword.services;

import examen.dev.tfgalmacen.rest.users.models.User;
import examen.dev.tfgalmacen.rest.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;
import examen.dev.tfgalmacen.rest.clientes.models.Cliente;
import examen.dev.tfgalmacen.rest.clientes.service.ClienteService;
import examen.dev.tfgalmacen.auth.resetPassword.models.PasswordResetToken;
import examen.dev.tfgalmacen.auth.resetPassword.repository.PasswordResetTokenRepository;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final ClienteService clienteService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public PasswordResetToken createToken(Cliente cliente) {
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .cliente(cliente)
                .token(token)
                .expiration(LocalDateTime.now().plusHours(1))
                .build();

        return tokenRepository.save(resetToken);
    }

    public Cliente validateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido"));
        if (resetToken.getExpiration().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expirado");
        }
        return resetToken.getCliente();
    }

    public void deleteToken(String token) {
        tokenRepository.findByToken(token).ifPresent(tokenRepository::delete);
    }

    public void updatePassword(Cliente cliente, String nuevaPass) {
        User user = cliente.getUser();

        user.setPassword(passwordEncoder.encode(nuevaPass));

        userRepository.save(user);

        cliente.setUpdated(LocalDateTime.now());
        clienteService.updateClienteEntity(cliente);
    }
}
