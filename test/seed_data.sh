#!/bin/bash

# Base URL del Backend
API="http://localhost:8080/api"

echo "=================================================="
echo "🚀 INICIANDO CARGA MASIVA DE DATOS DE PRUEBA"
echo "=================================================="

# --------------------------------------------------
# 1. CREACIÓN DE 5 CLIENTES
# --------------------------------------------------
echo -e "\n👥 Creando 5 Clientes..."

curl -s -X POST "$API/personas" -H "Content-Type: application/json" -d '{"cedula":"12345678A","nombre":"Juan","apellidos":"Pérez Gómez","email":"juan.perez@email.com","telefono":"600112233"}' > /dev/null
curl -s -X POST "$API/personas" -H "Content-Type: application/json" -d '{"cedula":"23456789B","nombre":"María","apellidos":"García López","email":"maria.garcia@email.com","telefono":"611223344"}' > /dev/null
curl -s -X POST "$API/personas" -H "Content-Type: application/json" -d '{"cedula":"34567890C","nombre":"Carlos","apellidos":"Rodríguez Martín","email":"carlos.rodriguez@email.com","telefono":"622334455"}' > /dev/null
curl -s -X POST "$API/personas" -H "Content-Type: application/json" -d '{"cedula":"45678901D","nombre":"Ana","apellidos":"Fernández Sánchez","email":"ana.fernandez@email.com","telefono":"633445566"}' > /dev/null
curl -s -X POST "$API/personas" -H "Content-Type: application/json" -d '{"cedula":"56789012E","nombre":"Luis","apellidos":"González Ruiz","email":"luis.gonzalez@email.com","telefono":"644556677"}' > /dev/null

echo "✅ 5 Clientes creados con éxito."

# --------------------------------------------------
# 2. CREACIÓN DE 10 ARTÍCULOS (Con stock suficiente)
# --------------------------------------------------
echo -e "\n📦 Creando 10 Artículos..."

curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-001","descripcion":"Monitor 27 4K","precioUnitario":250.00,"precioUrgente":300.00,"stockActual":100,"descuento":5.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-002","descripcion":"Teclado Mecánico RGB","precioUnitario":80.00,"precioUrgente":100.00,"stockActual":150,"descuento":10.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-003","descripcion":"Disco SSD NVMe 1TB","precioUnitario":95.00,"precioUrgente":120.00,"stockActual":200,"descuento":0.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-004","descripcion":"Ratón Inalámbrico Pro","precioUnitario":45.00,"precioUrgente":60.00,"stockActual":120,"descuento":0.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-005","descripcion":"Memoria RAM 16GB DDR5","precioUnitario":70.00,"precioUrgente":85.00,"stockActual":80,"descuento":5.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-006","descripcion":"Auriculares Bluetooth","precioUnitario":110.00,"precioUrgente":135.00,"stockActual":90,"descuento":15.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-007","descripcion":"Webcam Full HD 1080p","precioUnitario":55.00,"precioUrgente":70.00,"stockActual":110,"descuento":0.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-008","descripcion":"Soporte Eléctrico Escritorio","precioUnitario":320.00,"precioUrgente":380.00,"stockActual":50,"descuento":10.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-009","descripcion":"Cable HDMI 2.1 2m","precioUnitario":15.00,"precioUrgente":22.00,"stockActual":300,"descuento":0.0}' > /dev/null
curl -s -X POST "$API/articulos" -H "Content-Type: application/json" -d '{"codigo":"ART-010","descripcion":"HUB USB-C 7 en 1","precioUnitario":40.00,"precioUrgente":55.00,"stockActual":140,"descuento":5.0}' > /dev/null

echo "✅ 10 Artículos creados con éxito."

# --------------------------------------------------
# 3. CREACIÓN DE 20 FACTURAS REGISTRADAS
# --------------------------------------------------
echo -e "\n🧾 EMITIENDO 20 FACTURAS REGISTRADAS..."

# Función auxiliar para enviar facturas
emitir_factura() {
  local json_data="$1"
  curl -s -X POST "$API/facturas" -H "Content-Type: application/json" -d "$json_data" > /dev/null
}

# Facturas 1 a 5 (Cliente 1: Juan)
emitir_factura '{"clienteId":1,"aplicaProntoPago":true,"porcentajeProntoPago":5.0,"detalles":[{"articuloId":1,"cantidad":1},{"articuloId":4,"cantidad":2}]}'
emitir_factura '{"clienteId":1,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":3,"cantidad":1}]}'
emitir_factura '{"clienteId":1,"aplicaProntoPago":true,"porcentajeProntoPago":3.0,"detalles":[{"articuloId":9,"cantidad":5}]}'
emitir_factura '{"clienteId":1,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":2,"cantidad":1},{"articuloId":7,"cantidad":1}]}'
emitir_factura '{"clienteId":1,"aplicaProntoPago":true,"porcentajeProntoPago":5.0,"detalles":[{"articuloId":5,"cantidad":2}]}'

# Facturas 6 a 10 (Cliente 2: María)
emitir_factura '{"clienteId":2,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":8,"cantidad":1}]}'
emitir_factura '{"clienteId":2,"aplicaProntoPago":true,"porcentajeProntoPago":10.0,"detalles":[{"articuloId":6,"cantidad":2},{"articuloId":10,"cantidad":1}]}'
emitir_factura '{"clienteId":2,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":1,"cantidad":2}]}'
emitir_factura '{"clienteId":2,"aplicaProntoPago":true,"porcentajeProntoPago":5.0,"detalles":[{"articuloId":4,"cantidad":1}]}'
emitir_factura '{"clienteId":2,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":3,"cantidad":3}]}'

# Facturas 11 a 15 (Cliente 3: Carlos)
emitir_factura '{"clienteId":3,"aplicaProntoPago":true,"porcentajeProntoPago":4.0,"detalles":[{"articuloId":2,"cantidad":2}]}'
emitir_factura '{"clienteId":3,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":5,"cantidad":4}]}'
emitir_factura '{"clienteId":3,"aplicaProntoPago":true,"porcentajeProntoPago":5.0,"detalles":[{"articuloId":7,"cantidad":2}]}'
emitir_factura '{"clienteId":3,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":9,"cantidad":10}]}'
emitir_factura '{"clienteId":3,"aplicaProntoPago":true,"porcentajeProntoPago":2.0,"detalles":[{"articuloId":10,"cantidad":3}]}'

# Facturas 16 a 18 (Cliente 4: Ana)
emitir_factura '{"clienteId":4,"aplicaProntoPago":true,"porcentajeProntoPago":5.0,"detalles":[{"articuloId":8,"cantidad":1},{"articuloId":1,"cantidad":1}]}'
emitir_factura '{"clienteId":4,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":6,"cantidad":1}]}'
emitir_factura '{"clienteId":4,"aplicaProntoPago":true,"porcentajeProntoPago":5.0,"detalles":[{"articuloId":4,"cantidad":3}]}'

# Facturas 19 a 20 (Cliente 5: Luis)
emitir_factura '{"clienteId":5,"aplicaProntoPago":false,"porcentajeProntoPago":0.0,"detalles":[{"articuloId":3,"cantidad":2},{"articuloId":2,"cantidad":1}]}'
emitir_factura '{"clienteId":5,"aplicaProntoPago":true,"porcentajeProntoPago":5.0,"detalles":[{"articuloId":5,"cantidad":1},{"articuloId":7,"cantidad":1}]}'

echo "✅ 20 Facturas registradas con éxito."

echo -e "\n=================================================="
echo "🎉 ¡CARGA MASIVA FINALIZADA CON ÉXITO!"
echo "=================================================="
