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

# ----------------------------------------------------------
# Actualizaciones de seguridad de la IMAGEN FINAL
# ----------------------------------------------------------
USER 0

RUN dnf -y update-minimal \
      --security \
      --sec-severity=Important \
      --sec-severity=Critical \
    && dnf clean all

USER 1001


# ----------------------------------------------------------
# Copiamos solamente el resultado de Angular
# IMPORTANTE: ajustar NOMBRE-APLICACION
# ----------------------------------------------------------
COPY --from=builder --chown=1001:0 \
     /opt/app-root/src/dist/NOMBRE-APLICACION/browser/ \
     /opt/app-root/src/


# Arrancar NGINX
CMD ["nginx", "-g", "daemon off;"]
