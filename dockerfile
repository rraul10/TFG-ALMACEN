# Imagen base con Java 21
FROM eclipse-temurin:21-jdk-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar Gradle y proyecto
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY src ./src

# Permisos
RUN chmod +x gradlew

# Build del JAR ejecutable de Spring Boot
RUN ./gradlew bootJar --no-daemon

# Listar para debug
RUN ls -l build/libs

# Exponer puerto
EXPOSE 8080

# Comando para arrancar la app
CMD ["sh", "-c", "java -jar build/libs/*.jar"]
