# Utiliza la imagen oficial de OpenJDK como base
FROM openjdk:11-jre-slim

# Copia el JAR de tu aplicación al contenedor
COPY target/blog-0.0.1-SNAPSHOT.jar /app/app.jar

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Expone el puerto en el que se ejecuta tu aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación cuando el contenedor se inicia
CMD ["java", "-jar", "app.jar"]

