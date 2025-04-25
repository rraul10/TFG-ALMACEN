package examen.dev.tfgalmacen.users.service;


import examen.dev.tfgalmacen.auth.exceptions.UserNotFound;
import examen.dev.tfgalmacen.users.dto.UserRequest;
import examen.dev.tfgalmacen.users.dto.UserResponse;
import examen.dev.tfgalmacen.users.mapper.UserMapper;
import examen.dev.tfgalmacen.users.models.User;
import examen.dev.tfgalmacen.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));
        return userMapper.toDto(user);
    }

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        User user = userMapper.toEntity(userRequest);
        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));

        userMapper.updateUserFromRequest(user, userRequest);
        user = userRepository.save(user);
        return userMapper.toDto(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound("Usuario no encontrado"));

        user.setDeleted(true);
        userRepository.save(user);
    }
}

