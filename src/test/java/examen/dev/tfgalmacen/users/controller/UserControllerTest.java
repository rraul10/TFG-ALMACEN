package examen.dev.tfgalmacen.users.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

/**
 *

@ExtendWith(MockitoExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK) // Carga el contexto completo
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;  // Inyección de MockMvc

    @MockBean  // Usamos MockBean para mockear el servicio en el contexto completo
    private UserService userService;

    private UserRequest userRequest;
    private UserResponse userResponse;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        // Inicializar los objetos necesarios para las pruebas
        userRequest = new UserRequest("Raul", "raul@example.com", "password123", Set.of(UserRole.CLIENTE));
        userResponse = new UserResponse(1L, "Raul", "raul@example.com", Set.of(UserRole.CLIENTE));
    }

    @Test
    void getAllUsers() throws Exception {
        // Mockear el comportamiento del servicio
        Mockito.when(userService.getAllUsers()).thenReturn(List.of(userResponse));

        // Ejecutar la petición y verificar el resultado
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))  // Verificar que hay 1 usuario
                .andExpect(jsonPath("$[0].nombre").value("Raul"));
    }

    @Test
    void getUserById() throws Exception {
        Mockito.when(userService.getUserById(1L)).thenReturn(userResponse);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("raul@example.com"));
    }

    @Test
    void createUser() throws Exception {
        Mockito.when(userService.createUser(any(UserRequest.class))).thenReturn(userResponse);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Raul"));
    }

    @Test
    void updateUser() throws Exception {
        Mockito.when(userService.updateUser(eq(1L), any(UserRequest.class))).thenReturn(userResponse);

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("raul@example.com"));
    }

    @Test
    void deleteUser() throws Exception {
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());
    }
}
 */



