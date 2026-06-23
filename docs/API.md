# Hard-Wear API (REST)

Base URL:

- Dev (via Vite proxy): `/api`
- Direct: `http://localhost:5000/api`

## Auth

### `POST /auth/register`

Body:

```json
{ "name": "Kartik", "email": "k@example.com", "password": "secret123" }
```

Response:

```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "user" }, "token": "..." }
```

### `POST /auth/login`

Body:

```json
{ "email": "k@example.com", "password": "secret123" }
```

### `GET /auth/me` (protected)

Header:

- `Authorization: Bearer <JWT>`

## Products

### `GET /products`

Query params:

- `q` (search by name)
- `featured=true`
- `size=S|M|L|XL`
- `color=Black`
- `priceMin=0`
- `priceMax=2000`
- `sort=newest|price_asc|price_desc`

### `GET /products/:slug`

### Admin (protected + admin)

- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Cart (protected)

- `GET /cart`
- `POST /cart/items` body: `{ "productId": "...", "qty": 1, "size": "M", "color": "Black" }`
- `PUT /cart/items` body: `{ "productId": "...", "qty": 2, "size": "M", "color": "Black" }`
- `DELETE /cart/items` body: `{ "productId": "...", "size": "M", "color": "Black" }`
- `DELETE /cart` clears cart

## Wishlist (protected)

- `GET /wishlist`
- `POST /wishlist/items` body: `{ "productId": "..." }`
- `DELETE /wishlist/items` body: `{ "productId": "..." }`

## Orders (protected)

- `POST /orders` body: `{ "shippingAddress": { "fullName": "...", "phone": "...", "line1": "...", "city": "...", "state": "...", "postalCode": "...", "country": "India" } }`
- `GET /orders/mine`

### Admin

- `GET /orders`
- `PUT /orders/:id/status` body: `{ "status": "pending|delivered" }`

