Aquí tienes los comandos de terminal estándar para iniciar cada una de las tres partes de tu proyecto:

---

### 1. Base de Datos en Memoria (H2 / Docker)

* **Si usas la base de datos H2 (integrada en Spring Boot):**
No requiere ningún comando previo. Se inicia automáticamente dentro de la misma memoria RAM de tu aplicación Java cuando ejecutas el Backend.
* **Si usas PostgreSQL / MySQL en un contenedor Docker en memoria:**
```bash
docker run -d --name mi-db-memoria -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=proyectodb postgres:alpine

```



---

### 2. Capa Back (Spring Boot / Java)

Abre la terminal en la carpeta de tu proyecto Backend (`.../personalProject/backend`) y ejecuta:

* **Con el wrapper de Maven (Recomendado):**
```bash
cd /home/jfmejuto/Documents/VisualStudioCode/personalProject/backend/
./mvnw clean spring-boot:run

```


* **Con Maven global instalado:**
```bash
mvn clean spring-boot:run

```



---

### 3. Capa Web (Frontend Angular)

Abre otra pestaña de la terminal en la carpeta de tu proyecto Frontend (`.../personalProject/frontend`) y ejecuta:

* **Iniciar servidor de desarrollo:**
```bash
ng serve

```


* **Iniciar servidor de desarrollo (Abre la pestaña en el navegador automáticamente):**
```bash
cd /home/jfmejuto/Documents/VisualStudioCode/personalProject/frontend/
ng serve -o

```



---

> **Tip para desarrollo:** Levanta primero la **Base de Datos** (si usas Docker), segundo el **Backend** (puerto `8080`) y finalmente el **Frontend** (puerto `4200`).


La consola que estás viendo (`http://localhost:8080/h2-console/...`) corresponde a **H2 Database**, la base de datos relacional embebida en Java.

Al ser una base de datos **en memoria**, **se inicia y se detiene automáticamente en el mismo instante en que levantas el Backend**. No necesita comandos externos ni instalaciones independientes.

---

### ¿Cómo disponibilizarla paso a paso?

#### 1. Iniciar el Backend

Al ejecutar el comando de Spring Boot en tu terminal:

```bash
mvn clean spring-boot:run

```

En el momento en que Spring Boot arranca en el puerto `8080`, la base de datos H2 ya queda viva, en memoria RAM y lista para recibir consultas.

---

#### 2. Acceder a la Consola H2 en el Navegador

Entra en la URL limpia en tu navegador:
`http://localhost:8080/h2-console` *(No necesitas incluir el jsessionid largo)*.

Para conectarte a la sesión, asegúrate de que los campos coincidan con tu archivo `application.properties` (o `application.yml`):

| Campo en la pantalla H2 | Valor predeterminado / Tu configuración |
| --- | --- |
| **Driver Class** | `org.h2.Driver` |
| **JDBC URL** | `jdbc:h2:mem:testdb` *(o la URL que tengas configurada)* |
| **User Name** | `sa` |
| **Password** | *(Vacío o tu clave configurada)* |

Pulsas el botón **Connect** y entrarás al panel donde verás las tablas `PERSONAS`, `ARTICULOS`, etc.

---

### ⚠️ Un detalle fundamental de la Base de Datos en Memoria:

Al ser una base de datos basada en memoria RAM:

* **Si apagas o reinicias el Backend (Spring Boot), todos los registros creados desde el Frontend se borrarán.**
* Cada vez que ejecutas `mvn clean spring-boot:run`, H2 se inicia de nuevo completamente limpia.

---

### 💡 Tip para no perder datos al reiniciar (Opcional):

Si quieres que los datos que registras desde Angular se mantengan guardados en tu disco local aunque apagues la computadora o el servidor, cambia la propiedad en `src/main/resources/application.properties`:

```properties
# ❌ En memoria pura (se borra al reiniciar):
# spring.datasource.url=jdbc:h2:mem:proyectodb

# 🟢 Persistente en archivo local (se guarda en una carpeta de tu PC):
spring.datasource.url=jdbc:h2:file:./data/proyectodb

```





INSERT INTO ARTICULOS (ACTIVO, CODIGO, DESCRIPCION, DESCUENTO, PRECIO_UNITARIO, PRECIO_URGENTE, STOCK_ACTUAL) VALUES
(TRUE, 'TINT-001', 'Camisa de Vestir (Almidonada)', 0.0, 4.50, 6.30, 45),
(TRUE, 'TINT-002', 'Camisa de Seda', 0.0, 8.00, 11.20, 20),
(TRUE, 'TINT-003', 'Blusa de Lino', 0.0, 6.50, 9.10, 30),
(TRUE, 'TINT-004', 'Pantalón de Vestir', 0.0, 5.50, 7.70, 60),
(TRUE, 'TINT-005', 'Pantalón de Lana', 0.0, 7.00, 9.80, 25),
(TRUE, 'TINT-006', 'Jeans / Vaqueros', 0.0, 5.00, 7.00, 80),
(TRUE, 'TINT-007', 'Saco / Americana Ejecutiva', 0.0, 9.00, 12.60, 40),
(TRUE, 'TINT-008', 'Traje de 2 Piezas', 0.0, 15.00, 21.00, 35),
(TRUE, 'TINT-009', 'Traje de 3 Piezas', 0.0, 18.00, 25.20, 15),
(TRUE, 'TINT-010', 'Esmoking / Tuxedo', 0.0, 22.00, 30.80, 10),
(TRUE, 'TINT-011', 'Vestido Corto Simple', 0.0, 10.00, 14.00, 50),
(TRUE, 'TINT-012', 'Vestido de Fiesta', 0.0, 16.00, 22.40, 25),
(TRUE, 'TINT-013', 'Vestido de Gala', 0.0, 25.00, 35.00, 12),
(TRUE, 'TINT-014', 'Vestido de Novia (Tratamiento Especial)', 0.0, 80.00, 112.00, 5),
(TRUE, 'TINT-015', 'Vestido de Cera / Quinceañera', 0.0, 60.00, 84.00, 8),
(TRUE, 'TINT-016', 'Falda Recta', 0.0, 5.00, 7.00, 40),
(TRUE, 'TINT-017', 'Falda Plisada', 0.0, 7.50, 10.50, 30),
(TRUE, 'TINT-018', 'Abrigo de Paño', 0.0, 18.00, 25.20, 20),
(TRUE, 'TINT-019', 'Abrigo de Lana Largo', 0.0, 22.00, 30.80, 15),
(TRUE, 'TINT-020', 'Chaqueta de Cuero', 0.0, 35.00, 49.00, 12),
(TRUE, 'TINT-021', 'Chaqueta de Gamuza / Ante', 0.0, 40.00, 56.00, 10),
(TRUE, 'TINT-022', 'Chaqueta de Plumas / Anorak', 0.0, 20.00, 28.00, 25),
(TRUE, 'TINT-023', 'Impermeable / Gabardina', 0.0, 16.00, 22.40, 18),
(TRUE, 'TINT-024', 'Chaleco de Vestir', 0.0, 6.00, 8.40, 35),
(TRUE, 'TINT-025', 'Chaleco de Plumas', 0.0, 12.00, 16.80, 22),
(TRUE, 'TINT-026', 'Jersey / Suéter de Algodón', 0.0, 6.00, 8.40, 50),
(TRUE, 'TINT-027', 'Suéter de Lana / Cachemira', 0.0, 9.50, 13.30, 30),
(TRUE, 'TINT-028', 'Cardigan Fino', 0.0, 7.00, 9.80, 40),
(TRUE, 'TINT-029', 'Sudadera con Capucha', 0.0, 6.00, 8.40, 65),
(TRUE, 'TINT-030', 'Corbata de Seda', 0.0, 3.50, 4.90, 100),
(TRUE, 'TINT-031', 'Pajarita / Corbatín', 0.0, 3.00, 4.20, 50),
(TRUE, 'TINT-032', 'Bufanda de Lana', 0.0, 4.00, 5.60, 45),
(TRUE, 'TINT-033', 'Bufanda de Cachemira', 0.0, 7.00, 9.80, 20),
(TRUE, 'TINT-034', 'Pañuelo de Seda', 0.0, 5.00, 7.00, 60),
(TRUE, 'TINT-035', 'Mantón de Manila', 0.0, 25.00, 35.00, 8),
(TRUE, 'TINT-036', 'Gabardina Larga', 0.0, 18.00, 25.20, 14),
(TRUE, 'TINT-037', 'Cazadora de Mezclilla', 0.0, 12.00, 16.80, 30),
(TRUE, 'TINT-038', 'Chaqueta de Esplendor / Lentejuelas', 0.0, 15.00, 21.00, 12),
(TRUE, 'TINT-039', 'Uniforme Escolar Completo', 0.0, 12.00, 16.80, 40),
(TRUE, 'TINT-040', 'Uniforme Médico / Filipina', 0.0, 8.00, 11.20, 70),
(TRUE, 'TINT-041', 'Toga y Birrete', 0.0, 14.00, 19.60, 15),
(TRUE, 'TINT-042', 'Disfraz Completo', 0.0, 15.00, 21.00, 18),
(TRUE, 'TINT-043', 'Bata de Baño', 0.0, 7.00, 9.80, 30),
(TRUE, 'TINT-044', 'Pijama de Seda', 0.0, 10.00, 14.00, 22),
(TRUE, 'TINT-045', 'Edredón Sintético Individual', 0.0, 14.00, 19.60, 25),
(TRUE, 'TINT-046', 'Edredón Sintético Matrimonial', 0.0, 18.00, 25.20, 35),
(TRUE, 'TINT-047', 'Edredón de Plumas Individual', 0.0, 22.00, 30.80, 15),
(TRUE, 'TINT-048', 'Edredón de Plumas Matrimonial', 0.0, 26.00, 36.40, 20),
(TRUE, 'TINT-049', 'Manta Tejida', 0.0, 10.00, 14.00, 28),
(TRUE, 'TINT-050', 'Cobija Térmica', 0.0, 12.00, 16.80, 32),
(TRUE, 'TINT-051', 'Funda de Edredón / Duvet', 0.0, 8.00, 11.20, 40),
(TRUE, 'TINT-052', 'Sábana Juego Individual', 0.0, 10.00, 14.00, 50),
(TRUE, 'TINT-053', 'Sábana Juego Matrimonial', 0.0, 14.00, 19.60, 60),
(TRUE, 'TINT-054', 'Almohada de Plumas', 0.0, 12.00, 16.80, 20),
(TRUE, 'TINT-055', 'Almohada Sintética', 0.0, 8.00, 11.20, 35),
(TRUE, 'TINT-056', 'Mantel Comedor (4 Puestos)', 0.0, 9.00, 12.60, 25),
(TRUE, 'TINT-057', 'Mantel Comedor (8 Puestos)', 0.0, 14.00, 19.60, 30),
(TRUE, 'TINT-058', 'Mantel de Encaje / Hilo', 0.0, 20.00, 28.00, 12),
(TRUE, 'TINT-059', 'Servilletas de Tela (Juego x6)', 0.0, 6.00, 8.40, 45),
(TRUE, 'TINT-060', 'Caminos de Mesa', 0.0, 7.00, 9.80, 30),
(TRUE, 'TINT-061', 'Cortinas Livianas (por hoja)', 0.0, 12.00, 16.80, 40),
(TRUE, 'TINT-062', 'Cortinas Pesadas / Blackout (por hoja)', 0.0, 22.00, 30.80, 25),
(TRUE, 'TINT-063', 'Cojín Decorativo', 0.0, 6.00, 8.40, 50),
(TRUE, 'TINT-064', 'Funda de Sofá', 0.0, 15.00, 21.00, 15),
(TRUE, 'TINT-065', 'Esterilla / Tapete Pequeño', 0.0, 8.00, 11.20, 20),
(TRUE, 'TINT-066', 'Alfombra de Baño', 0.0, 6.00, 8.40, 35),
(TRUE, 'TINT-067', 'Moqueta / Alfombra Grande', 0.0, 25.00, 35.00, 10),
(TRUE, 'TINT-068', 'Peluche Pequeño', 0.0, 8.00, 11.20, 22),
(TRUE, 'TINT-069', 'Peluche Grande', 0.0, 15.00, 21.00, 14),
(TRUE, 'TINT-070', 'Saco de Dormir / Camping', 0.0, 18.00, 25.20, 18),
(TRUE, 'TINT-071', 'Chaqueta de Esquí / Nieve', 0.0, 22.00, 30.80, 16),
(TRUE, 'TINT-072', 'Pantalón de Esquí', 0.0, 16.00, 22.40, 18),
(TRUE, 'TINT-073', 'Mono de Trabajo', 0.0, 10.00, 14.00, 40),
(TRUE, 'TINT-074', 'Overol Industrial', 0.0, 12.00, 16.80, 30),
(TRUE, 'TINT-075', 'Bata de Laboratorio', 0.0, 7.50, 10.50, 50),
(TRUE, 'TINT-076', 'Impermeabilización de Gabardina', 0.0, 10.00, 14.00, 25),
(TRUE, 'TINT-077', 'Desmanchado Especial de Seda', 0.0, 12.00, 16.80, 20),
(TRUE, 'TINT-078', 'Tinte para Prenda de Algodón', 0.0, 25.00, 35.00, 15),
(TRUE, 'TINT-079', 'Restauración de Cuero', 0.0, 45.00, 63.00, 8),
(TRUE, 'TINT-080', 'Limpieza de Casco de Moto', 0.0, 15.00, 21.00, 22),
(TRUE, 'TINT-081', 'Maleta de Viaje (Interior/Exterior)', 0.0, 25.00, 35.00, 12),
(TRUE, 'TINT-082', 'Vestido de Primera Comunión', 0.0, 35.00, 49.00, 10),
(TRUE, 'TINT-083', 'Falda Larga de Gala', 0.0, 30.00, 42.00, 15),
(TRUE, 'TINT-084', 'Chaqueta de Piel Sintética', 0.0, 18.00, 25.20, 20),
(TRUE, 'TINT-085', 'Abrigo de Visón / Piel Natural', 0.0, 45.00, 63.00, 5),
(TRUE, 'TINT-086', 'Gorra Deportiva', 0.0, 4.00, 5.60, 60),
(TRUE, 'TINT-087', 'Sombrero de Fieltro / Lana', 0.0, 8.00, 11.20, 25),
(TRUE, 'TINT-088', 'Guantes de Cuero', 0.0, 6.00, 8.40, 30),
(TRUE, 'TINT-089', 'Saco de Lino', 0.0, 8.50, 11.90, 22),
(TRUE, 'TINT-090', 'Pantalón de Lino', 0.0, 7.50, 10.50, 28),
(TRUE, 'TINT-091', 'Guayabera Tradicional', 0.0, 9.00, 12.60, 35),
(TRUE, 'TINT-092', 'Corsé / Prenda Moldeadora', 0.0, 12.00, 16.80, 18),
(TRUE, 'TINT-093', 'Bata de Seda', 0.0, 10.00, 14.00, 20),
(TRUE, 'TINT-094', 'Kimonos / Batas Especiales', 0.0, 18.00, 25.20, 10),
(TRUE, 'TINT-095', 'Traje de Neopreno', 0.0, 20.00, 28.00, 12),
(TRUE, 'TINT-096', 'Bandera / Estandarte Grande', 0.0, 15.00, 21.00, 15),
(TRUE, 'TINT-097', 'Tapiz de Pared', 0.0, 20.00, 28.00, 8),
(TRUE, 'TINT-098', 'Funda de Colchón', 0.0, 14.00, 19.60, 25),
(TRUE, 'TINT-099', 'Mantón Tejido a Mano', 0.0, 18.00, 25.20, 12),
(TRUE, 'TINT-100', 'Bolso de Tela / Cuero', 0.0, 16.00, 22.40, 30);


