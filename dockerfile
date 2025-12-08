# Imagen base con Java 21
FROM eclipse-temurin:21-jdk-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de Gradle y proyecto
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY src ./src

# Dar permisos al wrapper de Gradle
RUN chmod +x gradlew

# Build del proyecto
RUN ./gradlew build --no-daemon

# Listar contenido de build/libs para debug (opcional)
RUN ls -l build/libs

# Exponer puerto
EXPOSE 8080

# Comando para arrancar la app usando wildcard para el jar
CMD ["sh", "-c", "java -jar build/libs/*.jar"]
