# ==========================================================
# ETAPA 1 - BUILD DE SPRING BOOT
# ==========================================================
FROM registry.access.redhat.com/ubi9/openjdk-21 AS builder


# ----------------------------------------------------------
# Actualizaciones de seguridad
# ----------------------------------------------------------
USER 0

RUN microdnf -y update && \
    microdnf clean all


# ----------------------------------------------------------
# Preparar directorio para usuario no privilegiado
# ----------------------------------------------------------
RUN mkdir -p /home/jboss/project && \
    chown -R 185:0 /home/jboss/project && \
    chmod -R g=u /home/jboss/project

USER 185

# ----------------------------------------------------------
# Directorio de trabajo
# ----------------------------------------------------------
WORKDIR /home/jboss/project

# ----------------------------------------------------------
# Copiar POM primero para aprovechar cache
# ----------------------------------------------------------
COPY --chown=185:0 pom.xml ./

# ----------------------------------------------------------
# Descargar dependencias
# ----------------------------------------------------------
RUN mvn dependency:go-offline -B

# ----------------------------------------------------------
# Copiar código fuente
# ----------------------------------------------------------
COPY --chown=185:0 src ./src


# ----------------------------------------------------------
# Compilar Spring Boot y obtener JAR ejecutable
# ----------------------------------------------------------
RUN mvn clean package -DskipTests -B && \
    JAR_FILE=$(find target \
        -maxdepth 1 \
        -type f \
        -name "*.jar" \
        ! -name "*.original" \
        ! -name "*-sources.jar" \
        ! -name "*-javadoc.jar" \
        ! -name "*-plain.jar" \
        -print -quit) && \
    echo "JAR generado: ${JAR_FILE}" && \
    test -n "${JAR_FILE}" && \
    cp "${JAR_FILE}" /tmp/application.jar


# ==========================================================
# ETAPA 2 - RUNTIME
# ==========================================================
FROM registry.access.redhat.com/ubi9/openjdk-21-runtime


# ----------------------------------------------------------
# Metadata
# ----------------------------------------------------------
ARG APP_VERSION="1.0.0"
ARG APP_RELEASE="1"

LABEL name="personalproject/backend-springboot" \
      maintainer="Jose Fernandez Mejuto" \
      vendor="Jose Fernandez Mejuto" \
      version="${APP_VERSION}" \
      release="${APP_RELEASE}" \
      summary="Spring Boot backend application" \
      description="Spring Boot REST backend running on Red Hat UBI 9 with OpenJDK 21."

LABEL org.opencontainers.image.title="Spring Boot Backend" \
      org.opencontainers.image.description="Spring Boot REST backend running on Red Hat UBI 9 with OpenJDK 21" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.vendor="Jose Fernandez Mejuto"

# ----------------------------------------------------------
# Actualizaciones de seguridad de la imagen FINAL
# ----------------------------------------------------------
USER 0

RUN microdnf -y update && \
    microdnf clean all

# ----------------------------------------------------------
# Licencias
# ----------------------------------------------------------
COPY --chown=185:0 licenses/ /licenses/

# ----------------------------------------------------------
# Copiar únicamente artefacto ejecutable
# ----------------------------------------------------------
COPY --from=builder --chown=185:0 \
     /tmp/application.jar \
     /deployments/application.jar

# ----------------------------------------------------------
# Usuario no privilegiado
# ----------------------------------------------------------
USER 185

# ----------------------------------------------------------
# Puerto Spring Boot
# ----------------------------------------------------------
EXPOSE 8080

# ----------------------------------------------------------
# Runtime Red Hat OpenJDK
# ----------------------------------------------------------
ENV JAVA_APP_JAR="/deployments/application.jar"

# ----------------------------------------------------------
# Ejecutar Spring Boot
# ----------------------------------------------------------
ENTRYPOINT ["/opt/jboss/container/java/run/run-java.sh"]

# cd ~/Documents/VisualStudioCode/personalProject/backend
# docker stop backend-springboot
# docker rm backend-springboot
# docker build -t backend-springboot:1.0 .
# docker run -d --name backend-springboot -p 8080:8080 -e SPRING_H2_CONSOLE_ENABLED=true -e SPRING_H2_CONSOLE_SETTINGS_WEB_ALLOW_OTHERS=true backend-springboot:1.0