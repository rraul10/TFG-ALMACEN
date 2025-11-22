package examen.dev.tfgalmacen.auth.resetPassword.repository;


import examen.dev.tfgalmacen.auth.resetPassword.models.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
}

