
# Smart Inventory: MERN Inventory Management System

A full-stack inventory management app where users can sign up, log in, and manage products with a live analytics dashboard and low-stock tracking.

**Live demo:** [inventory-maagement.vercel.app]

> The backend runs on a free hosting tier, so the first request after a period of inactivity can take about 30 seconds while the server wakes up.

## Screenshots

<img width="1920" height="961" alt="Screenshot (277)" src="https://github.com/user-attachments/assets/d97f98c3-bdf8-42a8-86a2-8d81f9538e6c" />
<img width="1920" height="965" alt="Screenshot (276)" src="https://github.com/user-attachments/assets/4b4b06d4-29e5-41d9-815f-e8fe33bf1fb2" />

<img width="1920" height="955" alt="Screenshot (278)" src="https://github.com/user-attachments/assets/03566695-5d59-4838-9ac5-284475118cb3" />



## Features

- User sign up and login with JWT authentication and hashed passwords (bcrypt)
- Role-based access control through backend middleware
- Full CRUD for products: add, view, update and delete
- Unique barcode validation, so duplicate products are rejected
- Dashboard cards: total products, total inventory value, most and least expensive product, low-stock count
- Charts for inventory value trend and products by quantity
- Low-stock view for items with quantity below 5
- Reserved quantity tracking and prices shown in INR (₹)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Bootstrap, Chart.js, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | JSON Web Tokens, bcryptjs |
| Hosting | Vercel (frontend), Render (backend) |

## Run Locally

**Prerequisites:** Node.js and a MongoDB database (local or MongoDB Atlas).

1. Clone the repo:
   ```bash
   git clone https://github.com/rachanaraghu1/Inventory_maagement.git
   cd Inventory_maagement
   ```

2. Start the backend:
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in `Backend` with your connection string:
   ```
   MONGO_URI=your_mongodb_connection_string
   ```
   Then run:
   ```bash
   npm run server
   ```
   The API runs on `http://localhost:3001`.

3. Start the frontend in a second terminal:
   ```bash
   cd Frontend/inventory_management_system
   npm install
   npm start
   ```
   The app opens at `http://localhost:3000`.

> The frontend calls the backend using a URL written in the source files. For local development, make sure those calls point to `http://localhost:3001`.

## Project Structure

```
Backend/
  middleware/   auth and role checks
  Models/       Mongoose schemas
  Routes/       API routes
  db.js         database connection
  index.js      server entry point
Frontend/inventory_management_system/
  src/components/   pages and UI components
  src/utils/        helpers
```

## Deployment

- **Database:** MongoDB Atlas
- **Backend:** Render, with `MONGO_URI` set as an environment variable
- **Frontend:** Vercel, deployed from the `Frontend/inventory_management_system` folder


