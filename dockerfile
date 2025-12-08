# --- Imagen base con Java 21 y Node.js ---
FROM eclipse-temurin:21-jdk-alpine

# Instalar Node.js y npm
RUN apk add --no-cache nodejs npm bash

# --- Directorio de trabajo ---
WORKDIR /app

# --- Copiar proyecto Spring Boot ---
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY src ./src

# --- Copiar frontend Angular ---
COPY almacen-app ./almacen-app

# --- Dar permisos al wrapper de Gradle ---
RUN chmod +x gradlew

# --- Build del JAR de Spring Boot ---
RUN ./gradlew bootJar --no-daemon

# --- Instalar dependencias de Angular y build ---
WORKDIR /app/almacen-app
RUN npm install
RUN npm run build --prod

# Volver al directorio raíz
WORKDIR /app

# --- Copiar server.js para Express ---
COPY server.js .

# --- Exponer puertos ---
EXPOSE 8080 3000

# --- Script para levantar ambos ---
CMD ["sh", "-c", "java -jar build/libs/*.jar & node server.js"]
