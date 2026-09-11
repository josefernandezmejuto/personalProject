# ==========================================================
# ETAPA 1 - BUILD DE SPRING BOOT
# ==========================================================
FROM registry.access.redhat.com/ubi9/openjdk-21 AS builder


# ----------------------------------------------------------
# 1. Actualizaciones de seguridad
# ----------------------------------------------------------
USER root

RUN microdnf -y update && \
    microdnf clean all


# ----------------------------------------------------------
# 2. Directorio de trabajo
# ----------------------------------------------------------
WORKDIR /home/jboss/project


# ----------------------------------------------------------
# 3. Copiar primero el POM
#    Esto permite aprovechar la cache de Docker
# ----------------------------------------------------------
COPY pom.xml ./


# ----------------------------------------------------------
# 4. Descargar dependencias Maven
# ----------------------------------------------------------
RUN mvn dependency:go-offline -B


# ----------------------------------------------------------
# 5. Copiar código fuente
# ----------------------------------------------------------
COPY src ./src


# ----------------------------------------------------------
# 6. Compilar Spring Boot
# ----------------------------------------------------------
RUN mvn clean package -DskipTests -B


# ----------------------------------------------------------
# 7. Identificar el JAR generado y darle nombre conocido
# ----------------------------------------------------------
RUN JAR_FILE=$(find target \
        -maxdepth 1 \
        -type f \
        -name "*.jar" \
        ! -name "*.original" \
        | head -n 1) && \
    echo "JAR generado: ${JAR_FILE}" && \
    test -n "${JAR_FILE}" && \
    cp "${JAR_FILE}" /tmp/application.jar



# ==========================================================
# ETAPA 2 - RUNTIME
# ==========================================================
FROM registry.access.redhat.com/ubi9/openjdk-21-runtime


# ----------------------------------------------------------
# 8. LABELS
# ----------------------------------------------------------
LABEL name="personalproject/backend-springboot" \
      vendor="Jose Fernandez Mejuto" \
      version="1.0.0" \
      release="1" \
      summary="Spring Boot backend application" \
      description="Spring Boot REST backend running on Red Hat UBI 9 with OpenJDK 21."

LABEL org.opencontainers.image.title="Spring Boot Backend" \
      org.opencontainers.image.description="Spring Boot REST backend running on Red Hat UBI 9 with OpenJDK 21" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="Jose Fernandez Mejuto"


# ----------------------------------------------------------
# 9. Actualizaciones de seguridad de la imagen FINAL
# ----------------------------------------------------------
USER root

RUN microdnf -y update && \
    microdnf clean all


# ----------------------------------------------------------
# 10. Crear directorio de despliegue
# ----------------------------------------------------------
RUN mkdir -p /deployments


# ----------------------------------------------------------
# 11. Copiar únicamente el JAR generado en el builder
# ----------------------------------------------------------
COPY --from=builder --chown=185:0 \
     /tmp/application.jar \
     /deployments/application.jar


# ----------------------------------------------------------
# 12. Group ownership y permisos OpenShift
# ----------------------------------------------------------
RUN chgrp -R 0 /deployments && \
    chmod -R g=u /deployments


# ----------------------------------------------------------
# 13. Usuario no privilegiado
# ----------------------------------------------------------
USER 185


# ----------------------------------------------------------
# 14. Puerto Spring Boot
# application.properties:
# server.port=8080
# ----------------------------------------------------------
EXPOSE 8080


# ----------------------------------------------------------
# 15. Configuración de la aplicación Java
# ----------------------------------------------------------
ENV JAVA_APP_JAR="/deployments/application.jar"


# ----------------------------------------------------------
# 16. Ejecutar Spring Boot
# ----------------------------------------------------------
ENTRYPOINT ["/opt/jboss/container/java/run/run-java.sh"]

# cd ~/Documents/VisualStudioCode/personalProject/backend
# docker stop backend-springboot
# docker rm backend-springboot
# docker build -t backend-springboot:1.0 .
# docker run -d --name backend-springboot -p 8080:8080 -e SPRING_H2_CONSOLE_ENABLED=true -e SPRING_H2_CONSOLE_SETTINGS_WEB_ALLOW_OTHERS=true backend-springboot:1.0