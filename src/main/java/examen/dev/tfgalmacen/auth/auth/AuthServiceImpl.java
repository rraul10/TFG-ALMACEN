package examen.dev.tfgalmacen.auth.auth;

import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterUserRequest;
import examen.dev.tfgalmacen.auth.dto.UserLoginRequest;
import examen.dev.tfgalmacen.auth.jwt.JwtService;
import examen.dev.tfgalmacen.users.models.Role;
import examen.dev.tfgalmacen.users.models.User;
import examen.dev.tfgalmacen.users.models.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;




    @Override
    public JwtAuthResponse register(RegisterUserRequest request) {
        User user = new User();
        user.setNombre(request.getNombre());
        user.setCorreo(request.getCorreo());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.CLIENTE);
        user.setCreated(LocalDateTime.now());
        user.setUpdated(LocalDateTime.now());
        user.setDeleted(false);

        userRepository.save(user);

        String token = jwtService.generateToken((UserDetails) user);
        return new JwtAuthResponse(token);
    }

    @Override
    public JwtAuthResponse login(UserLoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
        );

        User user = userRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtService.generateToken((UserDetails) user);
        return new JwtAuthResponse(token);
    }
}
