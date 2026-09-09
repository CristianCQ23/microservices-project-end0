# Car Sales API: microservicios

API para una tienda de vehiculos, migrada desde un monolito a cuatro procesos independientes: gateway, customers, products y shopping.

## Que hace el sistema

- El frontend consulta vehiculos a traves del gateway.
- Customers registra e identifica usuarios, perfiles, favoritos y carrito.
- Products administra el catalogo de vehiculos.
- Shopping crea pedidos a partir del carrito del cliente.
- El gateway centraliza el acceso HTTP y reenvia las peticiones a cada dominio.

## Servicios

| Servicio | Puerto | Responsabilidad | Base de datos |
| --- | ---: | --- | --- |
| [gateway](./gateway) | 8000 | Entrada HTTP, CORS y proxy | Ninguna |
| [customers](./customers) | 8001 | Usuarios, autenticacion, perfil, carrito y favoritos | MongoDB `customers` |
| [products](./products) | 8002 | Catalogo y detalle de vehiculos | MongoDB `products` |
| [shopping](./shopping) | 8003 | Coordinacion de pedidos | MongoDB `shopping` preparada |

La organizacion interna y la regla de frontera entre dominios estan documentadas en [docs/00-modelo-de-organizacion.md](./docs/00-modelo-de-organizacion.md).

## Requisitos

- Node.js 22 o superior.
- npm.
- MongoDB local o Docker Desktop.
- `jq` es opcional y solo se usa en los ejemplos de consulta.

## Variables de entorno

Cada servicio tiene un archivo `.env.example` con todas sus variables:

- [customers/.env.example](./customers/.env.example): `PORT`, `DB_URL`, `APP_SECRET`.
- [products/.env.example](./products/.env.example): `PORT`, `DB_URL`.
- [shopping/.env.example](./shopping/.env.example): `PORT`, `DB_URL`, `APP_SECRET`.
- [gateway/.env.example](./gateway/.env.example): `PORT`, `CUSTOMERS_URL`, `PRODUCTS_URL`, `SHOPPING_URL`.

Los archivos `.env` reales estan excluidos por `.gitignore`. Para ejecutar sin Docker:

```bash
cp customers/.env.example customers/.env
cp products/.env.example products/.env
cp shopping/.env.example shopping/.env
cp gateway/.env.example gateway/.env
```

Revisa que MongoDB este escuchando en `localhost:27017`. Cambia `DB_URL` si usas otra instancia.

## Levantar todo sin Docker

Instala dependencias en cada servicio:

```bash
cd customers && npm install
cd ../products && npm install
cd ../shopping && npm install
cd ../gateway && npm install
```

Arranca primero los servicios de dominio y despues el gateway, cada uno en una terminal:

```bash
cd customers && npm start
cd products && npm start
cd shopping && npm start
cd gateway && npm start
```

La API publica queda disponible en `http://localhost:8000`.

Comprobaciones rapidas:

```bash
curl -i http://localhost:8000/health
curl -s http://localhost:8000/ | jq
```

## Levantar servicios con Docker

Cada carpeta tiene su propio `docker-compose.yml`. Levanta Mongo y el servicio en este orden:

```bash
cd customers && docker compose up --build -d
cd ../products && docker compose up --build -d
cd ../shopping && docker compose up --build -d
cd ../gateway && docker compose up --build -d
```

El gateway usa `host.docker.internal` para comunicarse con los servicios publicados en los puertos 8001, 8002 y 8003. Para detener un servicio:

```bash
docker compose down
```

## Datos iniciales

Products incluye un seed de vehiculos:

```bash
cd products
npm run seed
```

## Pruebas

Cada servicio tiene pruebas unitarias y de integracion en `__test__/`:

```bash
cd customers && npm test
cd ../products && npm test
cd ../shopping && npm test
```

Las pruebas no requieren levantar el servidor completo: simulan dependencias externas y usan mocks para aislar cada dominio.

## Rutas principales a traves del gateway

| Metodo | Ruta | Funcion |
| --- | --- | --- |
| `GET` | `/` | Lista de vehiculos |
| `GET` | `/:id` | Detalle de vehiculo |
| `POST` | `/customer/signup` | Registro |
| `POST` | `/customer/login` | Inicio de sesion |
| `GET` | `/customer/profile` | Perfil autenticado |
| `PUT` / `DELETE` | `/wishlist` y `/wishlist/:id` | Agregar o quitar favorito |
| `PUT` / `DELETE` | `/cart` y `/cart/:id` | Agregar, actualizar o quitar carrito |
| `POST` | `/shopping/order` | Crear pedido |

Las rutas protegidas requieren `Authorization: Bearer <token>`.
