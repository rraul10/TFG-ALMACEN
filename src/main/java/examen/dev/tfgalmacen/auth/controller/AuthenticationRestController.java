package examen.dev.tfgalmacen.auth.controller;
import examen.dev.tfgalmacen.auth.auth.AuthService;
import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterClienteRequest;
import examen.dev.tfgalmacen.auth.dto.RegisterUserRequest;
import examen.dev.tfgalmacen.auth.dto.UserLoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationRestController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody UserLoginRequest request) {
        JwtAuthResponse jwtAuthResponse = authService.login(request);
        return ResponseEntity.ok(jwtAuthResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<JwtAuthResponse> register(@RequestBody RegisterUserRequest request) {
        JwtAuthResponse jwtAuthResponse = authService.register(request);
        return ResponseEntity.ok(jwtAuthResponse);
    }

    @PostMapping("/register/cliente")
    public ResponseEntity<JwtAuthResponse> registerCliente(@RequestBody RegisterClienteRequest request) {
        JwtAuthResponse jwtAuthResponse = authService.registerCliente(request);
        return ResponseEntity.ok(jwtAuthResponse);
    }
}

