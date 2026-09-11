# ==========================================================
# ETAPA 1 - BUILD DE ANGULAR
# ==========================================================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS builder

# ----------------------------------------------------------
# Actualizaciones de seguridad del sistema operativo
# ----------------------------------------------------------
USER 0

RUN dnf -y update-minimal \
  --security \
  --sec-severity=Important \
  --sec-severity=Critical \
  && dnf clean all

# Volvemos al usuario no privilegiado
USER 1001

WORKDIR /opt/app-root/src


# ----------------------------------------------------------
# Primero copiamos package.json y package-lock.json
# ----------------------------------------------------------
COPY --chown=1001:0 package*.json ./

# Instalación reproducible de dependencias
RUN npm ci


# ----------------------------------------------------------
# Copiamos el código fuente
# ----------------------------------------------------------
COPY --chown=1001:0 . .

# Construimos Angular para producción
RUN npm run build


# ==========================================================
# ETAPA 2 - IMAGEN FINAL / RUNTIME
# ==========================================================
FROM registry.access.redhat.com/ubi9/nginx-126

LABEL name="personalproject/frontend" \
      vendor="Jose Fernandez Mejuto" \
      version="1.0.0" \
      release="1" \
      summary="Frontend Angular application" \
      description="Angular frontend application served by NGINX on Red Hat UBI 9."

LABEL org.opencontainers.image.title="Frontend Angular" \
      org.opencontainers.image.description="Angular frontend application served by NGINX on Red Hat UBI 9" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="Jose Fernandez Mejuto"

# ----------------------------------------------------------
# Actualizaciones de seguridad de la IMAGEN FINAL
# ----------------------------------------------------------
USER 0

RUN dnf -y update-minimal \
  --security \
  --sec-severity=Important \
  --sec-severity=Critical \
  && dnf clean all

# ----------------------------------------------------------
# Copiamos solamente el resultado de Angular
# IMPORTANTE: ajustar NOMBRE-APLICACION
# ----------------------------------------------------------
COPY --from=builder --chown=1001:0 \
  /opt/app-root/src/dist/frontend/browser/ \
  /opt/app-root/src/


RUN chown -R 1001:0 /opt/app-root/src && \
  chmod -R g=u /opt/app-root/src

USER 1001

# Arrancar NGINX
CMD ["nginx", "-g", "daemon off;"]

# cd ~/Documents/VisualStudioCode/personalProject/frontend
# docker stop frontend-angular
# docker rm frontend-angular
# docker build -t frontend-angular:1.0 .
# docker run -d --name frontend-angular -p 4200:8080 frontend-angular:1.0
