package examen.dev.tfgalmacen.users.service;

import examen.dev.tfgalmacen.users.dto.UserRequest;
import examen.dev.tfgalmacen.users.dto.UserResponse;
import examen.dev.tfgalmacen.users.models.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse createUser(UserRequest userRequest);

    UserResponse updateUser(Long id, UserRequest userRequest);

    void deleteUser(Long id);

}

