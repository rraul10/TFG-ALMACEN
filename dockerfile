FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY src ./src

RUN chmod +x gradlew

RUN ./gradlew bootJar --no-daemon

RUN echo "Contenido de build/libs:" && ls -l build/libs

EXPOSE 8080

CMD ["sh", "-c", "echo 'Iniciando aplicación...'; java -jar build/libs/*.jar"]
