# Etapa 1: Build (caso queira usar multi-stage build com Maven)
FROM maven:3.9.3-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Imagem de produção
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
WORKDIR /app

# Copiando o .jar gerado (se você já tiver ele gerado localmente)
COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
