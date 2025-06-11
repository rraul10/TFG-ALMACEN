package examen.dev.tfgalmacen.auth.auth;


import examen.dev.tfgalmacen.auth.dto.JwtAuthResponse;
import examen.dev.tfgalmacen.auth.dto.RegisterClienteRequest;
import examen.dev.tfgalmacen.auth.dto.RegisterUserRequest;
import examen.dev.tfgalmacen.auth.dto.UserLoginRequest;

public interface AuthService {
    JwtAuthResponse login(UserLoginRequest request);
    JwtAuthResponse register(RegisterUserRequest request);
    JwtAuthResponse registerCliente(RegisterClienteRequest request);

}

