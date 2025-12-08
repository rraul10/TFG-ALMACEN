# --- Imagen base con Java 21 ---
FROM eclipse-temurin:21-jdk-alpine

# --- Directorio de trabajo ---
WORKDIR /app

# --- Copiar Gradle y proyecto ---
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY src ./src

# --- Dar permisos al wrapper de Gradle ---
RUN chmod +x gradlew

# --- Build del JAR ejecutable de Spring Boot ---
RUN ./gradlew bootJar --no-daemon

# --- Listar contenido de build/libs para debug ---
RUN echo "Contenido de build/libs:" && ls -l build/libs

# --- Exponer puerto ---
EXPOSE 8080

# --- Comando para arrancar la app ---
CMD ["sh", "-c", "echo 'Iniciando aplicación...'; java -jar build/libs/*.jar"]
