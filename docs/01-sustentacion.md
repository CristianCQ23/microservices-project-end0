# Sustentacion del proyecto

Este documento resume las decisiones tecnicas que se pueden defender oralmente durante la presentacion del proyecto.

## 1. Por que estos tres dominios

Los dominios se separaron usando criterios de negocio y de responsabilidad, no por cantidad de carpetas:

- **Products** representa el catalogo de vehiculos. Su responsabilidad es publicar productos y consultar el detalle de un vehiculo.
- **Customers** representa la cuenta del cliente. Es dueño del registro, inicio de sesion, perfil, favoritos y carrito.
- **Shopping** representa la compra. Coordina la creacion de pedidos, calcula el total del carrito y comunica el cierre de la compra.

Estos tres dominios cubren el flujo principal del sistema: consultar un vehiculo, asociarlo a un cliente y convertir el carrito en una orden.

El criterio para cortar fue la propiedad de los datos y la cohesion de las reglas. Si una funcionalidad cambia por razones distintas o tiene datos que pertenecen a otro negocio, debe vivir en otro dominio. Por eso no se creo un microservicio para cada endpoint ni se separaron funciones que necesitan cambiar juntas.

El **gateway** no es un dominio de negocio. Es una capa de entrada que centraliza el acceso HTTP, CORS y el proxy hacia los servicios.

## 2. Por que el repository es el unico que toca el modelo

El repository encapsula la persistencia. Es el unico lugar que conoce los modelos de Mongoose y las consultas concretas a MongoDB.

La razon es separar responsabilidades:

- La API conoce HTTP: rutas, headers, autenticacion y respuestas.
- El service conoce los casos de uso: registro, agregar al carrito, crear un pedido y sus reglas.
- El repository conoce como guardar y consultar datos.
- El model describe el esquema de MongoDB.

Si el controlador accediera directamente a Mongoose, la logica quedaria repartida entre rutas y consultas. Eso dificulta probarla, cambiar MongoDB o reutilizar un caso de uso desde otra entrada.

El flujo esperado es:

```text
api -> service -> repository -> model
```

Por ejemplo, `PUT /cart` recibe la peticion en la API, el service valida y coordina el caso de uso, el repository modifica el cliente y el model define la forma persistida del carrito.

## 3. Por que CORS va en el gateway

CORS es una politica de acceso HTTP entre el navegador y la API publica. El frontend no deberia conocer ni llamar directamente a cada microservicio.

Por eso el gateway es el lugar correcto para:

- aceptar el origen autorizado del frontend;
- manejar preflight `OPTIONS`;
- aplicar una politica uniforme;
- evitar que cada servicio tenga configuraciones distintas;
- mantener los servicios internos fuera del acceso directo del navegador.

La explicacion defendible es: **CORS pertenece a la frontera publica, y la frontera publica es el gateway**.

Nota sobre el estado actual: `customers` y `shopping` todavia tienen middleware `cors()` local. Eso funciona, pero duplica una responsabilidad que deberia centralizarse. Para cumplir estrictamente la regla de esta pregunta, se debe dejar CORS solo en el gateway y retirar ese middleware de los servicios internos.

## 4. Que pasa si products se cae

Si `products` se cae, el gateway no puede obtener el catalogo ni el detalle de vehiculos. Las peticiones que dependen de products deben responder un error de disponibilidad, normalmente `503 Service Unavailable`, en vez de inventar datos o devolver una respuesta aparentemente correcta.

Los otros dominios no tienen que caerse automaticamente:

- un usuario autenticado puede seguir existiendo en `customers`;
- el carrito y los favoritos ya guardados pertenecen a `customers`;
- `shopping` puede seguir disponible para operaciones que no necesiten consultar el catalogo en ese momento.

Esto es una decision de diseño porque cada servicio tiene una responsabilidad y una base de datos separadas. El fallo queda contenido en el dominio afectado. El costo es que el sistema queda parcialmente degradado: no se pueden explorar ni agregar vehiculos nuevos hasta que products vuelva.

En produccion se complementaria con timeouts, health checks, reintentos limitados, circuit breakers, logs y una respuesta clara de disponibilidad.

## 5. Que se gano y que se pago frente al monolito

### Ganancias

- **Aislamiento de fallos:** un problema en products no tiene que tumbar customers.
- **Autonomia:** cada servicio puede instalarse, probarse y desplegarse de forma independiente.
- **Fronteras claras:** cada dominio es dueño de sus datos y reglas.
- **Escalado independiente:** products puede recibir mas replicas sin escalar autenticacion.
- **Cambios mas localizados:** una modificacion del catalogo no obliga a desplegar todo el sistema.
- **Pruebas enfocadas:** cada servicio tiene sus propias pruebas unitarias e integración.

### Costos

- Hay mas procesos, mas configuracion y mas despliegues que mantener.
- Cada servicio necesita su propio `package.json`, imagen, variables y observabilidad.
- Una operacion de negocio puede requerir varias llamadas de red.
- Aparecen problemas distribuidos: timeouts, disponibilidad, contratos y consistencia.
- Se necesita coordinar versiones y diagnosticar logs de varios servicios.
- La infraestructura cuesta mas que ejecutar un solo proceso monolitico.

La decision se justifica cuando la autonomia, el aislamiento y la posibilidad de evolucionar dominios compensan ese costo. Para un sistema pequeño, un monolito puede ser mas barato y simple; los microservicios se eligen aqui como ejercicio de fronteras y como base para escalar por dominio.

## 6. Que falta para produccion

Antes de llevarlo a produccion faltaria, como minimo:

1. **Seguridad:** secretos gestionados fuera del repositorio, contrasenas fuertes, rotacion de `APP_SECRET`, validacion de entrada y CORS con una lista de origenes permitidos.
2. **Persistencia:** backups automaticos, replicas de MongoDB, indices revisados y politica de retencion.
3. **Disponibilidad:** health checks por servicio, timeouts, reintentos limitados, circuit breakers y despliegues con rollback.
4. **Observabilidad:** logs estructurados, correlation ID, metricas, trazas distribuidas y alertas.
5. **Operaciones:** CI/CD, escaneo de dependencias e imagenes, control de versiones de contratos y ambientes separados.
6. **Pruebas:** mas pruebas de contrato entre servicios, pruebas de carga, pruebas de seguridad y pruebas end-to-end.
7. **Gateway:** dejar CORS centralizado, limitar solicitudes, autenticar rutas protegidas y documentar OpenAPI.
8. **Datos:** definir una estrategia de consistencia para pedidos, idempotencia para crear ordenes y manejo de eventos si el flujo crece.

El proyecto actual demuestra la separacion de dominios y el flujo principal, pero no pretende ser todavia una plataforma de produccion completa.

## Respuesta corta para la defensa

> Separe products, customers y shopping por propiedad de datos y cohesion de negocio. El gateway queda como frontera publica y no contiene reglas de negocio. La API no toca Mongoose; el service coordina casos de uso y el repository concentra la persistencia. Si products falla, el sistema se degrada solo en catalogo, lo cual es un efecto controlado de la autonomia. Ganamos aislamiento, despliegues y escalado independiente, pero pagamos mas complejidad operativa, red y observabilidad. Para produccion faltan seguridad, monitoreo, resiliencia, CI/CD, backups y pruebas de contrato.
