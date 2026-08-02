#!/bin/bash

API="http://localhost:8080/api"

echo "🔑 Solicitando Token JWT..."
LOGIN_RESPONSE=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}')

# Extraer el token del JSON con jq
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Error al obtener el token. Abortando."
  echo "Respuesta del servidor: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Token obtenido correctamente."

# Petición protegida de ejemplo
curl -s -X POST "$API/articulos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"codigo":"ART-001","descripcion":"Monitor 27 4K","precioUnitario":250.00,"precioUrgente":300.00,"stockActual":100,"descuento":5.0}'