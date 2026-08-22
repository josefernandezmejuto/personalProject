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