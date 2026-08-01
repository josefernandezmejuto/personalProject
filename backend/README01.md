Puedes guardar este documento como `TEST_APIS.md` en la raíz de tu proyecto para tenerlo siempre a mano.

---

# 🚀 Guía de Pruebas API REST (curl)

Esta guía contiene las peticiones HTTP para probar el ciclo completo del backend de facturación.

> **Nota:** Dado que el sistema utiliza una base de datos **H2 en memoria**, los datos se reinician cada vez que detienes la aplicación. Sigue las pruebas en el orden indicado (Clientes ➔ Artículos ➔ Facturas).

---

## 👥 1. Módulo de Clientes (`/api/personas`)

### 1.1. Crear Cliente (Juan Pérez)

* **Método:** `POST`
* **Endpoint:** `http://localhost:8080/api/personas`

```bash
curl -X POST http://localhost:8080/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678A",
    "nombre": "Juan",
    "apellidos": "Pérez Gómez",
    "email": "juan.perez@email.com",
    "telefono": "600112233"
  }'

```

---

### 1.2. Listar Todos los Clientes Activos

* **Método:** `GET`
* **Endpoint:** `http://localhost:8080/api/personas?soloActivas=true`

```bash
curl -X GET "http://localhost:8080/api/personas?soloActivas=true"

```

---

### 1.3. Obtener Cliente por ID

* **Método:** `GET`
* **Endpoint:** `http://localhost:8080/api/personas/1`

```bash
curl -X GET http://localhost:8080/api/personas/1

```

---

## 📦 2. Módulo de Inventario (`/api/articulos`)

### 2.1. Crear Artículo 1 (Monitor 4K)

* **Método:** `POST`
* **Endpoint:** `http://localhost:8080/api/articulos`

```bash
curl -X POST http://localhost:8080/api/articulos \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ART-001",
    "descripcion": "Monitor 27 Pulgadas 4K",
    "precioUnitario": 250.00,
    "precioUrgente": 300.00,
    "stockActual": 10,
    "descuento": 0.0
  }'

```

---

### 2.2. Crear Artículo 2 (Teclado RGB)

* **Método:** `POST`
* **Endpoint:** `http://localhost:8080/api/articulos`

```bash
curl -X POST http://localhost:8080/api/articulos \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ART-002",
    "descripcion": "Teclado Mecánico RGB",
    "precioUnitario": 80.00,
    "precioUrgente": 100.00,
    "stockActual": 15,
    "descuento": 10.0
  }'

```

---

### 2.3. Crear Artículo 3 (SSD NVMe)

* **Método:** `POST`
* **Endpoint:** `http://localhost:8080/api/articulos`

```bash
curl -X POST http://localhost:8080/api/articulos \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ART-003",
    "descripcion": "Disco SSD NVMe 1TB",
    "precioUnitario": 95.00,
    "precioUrgente": 120.00,
    "stockActual": 20,
    "descuento": 5.0
  }'

```

---

### 2.4. Listar Todos los Artículos

* **Método:** `GET`
* **Endpoint:** `http://localhost:8080/api/articulos`

```bash
curl -X GET http://localhost:8080/api/articulos

```

---

### 2.5. Probar Validación (Error 400 por falta de `precioUrgente`)

* **Método:** `POST`
* **Endpoint:** `http://localhost:8080/api/articulos`

```bash
curl -X POST http://localhost:8080/api/articulos \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ART-004",
    "descripcion": "Memoria RAM 16GB",
    "precioUnitario": 60.00,
    "stockActual": 15
  }'

```

---

## 🧾 3. Módulo de Facturación (`/api/facturas`)

### 3.1. Obtener Siguiente Número Correlativo

* **Método:** `GET`
* **Endpoint:** `http://localhost:8080/api/facturas/siguiente-numero`

```bash
curl -X GET http://localhost:8080/api/facturas/siguiente-numero

```

---

### 3.2. Emitir Factura con Pronto Pago (5%)

* **Método:** `POST`
* **Endpoint:** `http://localhost:8080/api/facturas`
* **Descripción:** Asocia al cliente `1`, compra 2 Monitores (`ART-001`) y 1 Teclado (`ART-002`), calcula subtotal, quita el 5% por pronto pago, aplica el 16% de IVA y reduce el stock de los artículos automáticamente.

```bash
curl -X POST http://localhost:8080/api/facturas \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "aplicaProntoPago": true,
    "porcentajeProntoPago": 5.0,
    "detalles": [
      {
        "articuloId": 1,
        "descripcionPersonalizada": "Monitor 27 Pulgadas 4K (Oferta Lanzamiento)",
        "cantidad": 2,
        "descuento": 0.0
      },
      {
        "articuloId": 2,
        "cantidad": 1,
        "descuento": 10.0
      }
    ]
  }'

```

---

### 3.3. Verificar Descuento Automático de Stock

* **Método:** `GET`
* **Endpoint:** `http://localhost:8080/api/articulos/1`
* **Descripción:** Comprueba que el stock del Artículo 1 bajó de 10 a 8 unidades tras emitir la factura.

```bash
curl -X GET http://localhost:8080/api/articulos/1

```

---

### 3.4. Listar Historial de Facturas

* **Método:** `GET`
* **Endpoint:** `http://localhost:8080/api/facturas`

```bash
curl -X GET http://localhost:8080/api/facturas

```

---

### 3.5. Anular Factura y Restaurar Stock

* **Método:** `PUT`
* **Endpoint:** `http://localhost:8080/api/facturas/1/anular`
* **Descripción:** Cambia el estado de la factura a "Anulada" y devuelve automáticamente las cantidades vendidas al stock de inventario.

```bash
curl -X PUT http://localhost:8080/api/facturas/1/anular

```

---

# 📋 Plan de Pruebas de Integración y Reglas de Negocio

## 🎯 Objetivo

Verificar que las operaciones de creación, modificación, eliminación (borrado lógico) y reglas de negocio transaccionales (cálculo de montos y control de inventario) funcionen de forma consistente en el sistema.

---

## 👤 MÓDULO 1: Gestión de Personas (Clientes)

### Casos de Prueba:

| ID | Operación | Nombre del Test | Descripción | Resultado Esperado |
| --- | --- | --- | --- | --- |
| **PERS-01** | `POST` | Crear Persona Exitosa | Registrar un cliente con todos sus datos válidos. | Status `201 Created` y retorna objeto con `id` asignado. |
| **PERS-02** | `GET` | Consultar Clientes Activos | Obtener listado mediante el filtro `soloActivas=true`. | Status `200 OK` devolviendo únicamente personas activas. |
| **PERS-03** | `PUT` | Modificar Persona | Actualizar el teléfono y email de un cliente existente. | Status `200 OK` con los datos actualizados reflejados. |
| **PERS-04** | `DELETE` | Eliminar Persona (Borrado Lógico) | Ejecutar borrado sobre la persona registrada. | Status `204 No Content`. El flag `activo` pasa a `false`. |

### 🧪 Ejecución de Pruebas:

```bash
# 1.1 Crear Persona
curl -X POST http://localhost:8080/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678A",
    "nombre": "Juan",
    "apellidos": "Pérez Gómez",
    "email": "juan.perez@email.com",
    "telefono": "600112233"
  }'

# 1.2 Modificar Persona (ID: 1)
curl -X PUT http://localhost:8080/api/personas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "12345678A",
    "nombre": "Juan",
    "apellidos": "Pérez Gómez",
    "email": "nuevo.email@email.com",
    "telefono": "699887766",
    "activo": true
  }'

# 1.3 Eliminar Persona (Borrado Lógico)
curl -X DELETE http://localhost:8080/api/personas/1

```

---

## 📦 MÓDULO 2: Gestión de Artículos (Inventario)

### Casos de Prueba:

| ID | Operación | Nombre del Test | Descripción | Resultado Esperado |
| --- | --- | --- | --- | --- |
| **ART-01** | `POST` | Crear Artículo Completo | Registrar artículo especificando `precioUnitario` y `precioUrgente`. | Status `201 Created` y datos mapeados en base de datos. |
| **ART-02** | `POST` | Validación `precioUrgente` | Intentar crear artículo omitiendo el `precioUrgente`. | Status `400 Bad Request` indicando que es obligatorio. |
| **ART-03** | `PUT` | Modificar Precios y Stock | Actualizar el stock actual y precios de un artículo. | Status `200 OK` con los precios actualizados. |
| **ART-04** | `DELETE` | Desactivar Artículo | Eliminar lógicamente un artículo de la venta directa. | Status `204 No Content`. |

### 🧪 Ejecución de Pruebas:

```bash
# 2.1 Crear Artículo Valido
curl -X POST http://localhost:8080/api/articulos \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ART-001",
    "descripcion": "Monitor 27 Pulgadas 4K",
    "precioUnitario": 250.00,
    "precioUrgente": 300.00,
    "stockActual": 10,
    "descuento": 5.0
  }'

# 2.2 Modificar Artículo (ID: 1)
curl -X PUT http://localhost:8080/api/articulos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ART-001",
    "descripcion": "Monitor 27 Pulgadas 4K (Edición 2026)",
    "precioUnitario": 240.00,
    "precioUrgente": 290.00,
    "stockActual": 15,
    "descuento": 0.0,
    "activo": true
  }'

# 2.3 Eliminar Artículo (Desactivación Lógica)
curl -X DELETE http://localhost:8080/api/articulos/1

```

---

## 🧾 MÓDULO 3: Flujo Transaccional de Facturación

### Casos de Prueba:

| ID | Operación | Nombre del Test | Descripción | Resultado Esperado |
| --- | --- | --- | --- | --- |
| **FAC-01** | `GET` | Generar Correlativo | Solicitar el número de la siguiente factura a emitir. | Status `200 OK` devolviendo `FAC-000001`. |
| **FAC-02** | `POST` | Emisión y Descuento de Stock | Generar factura para un cliente descontando unidades de inventario. | Status `201 Created`. Stock disminuye en la cantidad vendida. |
| **FAC-03** | `POST` | Validación Stock Insuficiente | Intentar facturar más unidades de las disponibles en inventario. | Status `500 Internal Error` / `400 Bad Request` cancelando transacción. |
| **FAC-04** | `PUT` | Anular Factura y Reversión | Anular una factura emitida previamente. | Status `204 No Content`. El stock gastado vuelve a incrementarse. |

### 🧪 Ejecución de Pruebas:

```bash
# 3.1 Prerrequisitos: Garantizar Cliente (ID: 1) y Artículo con Stock (ID: 1)
curl -X POST http://localhost:8080/api/personas -H "Content-Type: application/json" -d '{"cedula":"111A","nombre":"Ana","apellidos":"López"}'
curl -X POST http://localhost:8080/api/articulos -H "Content-Type: application/json" -d '{"codigo":"TECL-01","descripcion":"Teclado","precioUnitario":50.0,"precioUrgente":60.0,"stockActual":5}'

# 3.2 Emitir Factura (Comprar 2 teclados)
curl -X POST http://localhost:8080/api/facturas \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "aplicaProntoPago": true,
    "porcentajeProntoPago": 5.0,
    "detalles": [
      {
        "articuloId": 1,
        "cantidad": 2,
        "descuento": 0.0
      }
    ]
  }'

# 3.3 Verificar que el stock disminuyó de 5 a 3
curl -X GET http://localhost:8080/api/articulos/1

# 3.4 Anular Factura (ID: 1) y verificar restitución de stock a 5
curl -X PUT http://localhost:8080/api/facturas/1/anular
curl -X GET http://localhost:8080/api/articulos/1

```

---

## 📊 Resumen del Ciclo de Vida de Datos

```text
[Creación / POST] ──► [Edición / PUT] ──► [Uso Transaccional / Factura] ──► [Eliminación / DELETE]
  • Persona activa      • Datos al día        • Descuenta Stock               • Activo = False
  • Stock inicial       • Precio ajustado     • Liquida IVA / Pronto Pago    • Inv. Restaurado (si se anula)

```