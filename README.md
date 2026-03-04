# Budget App

A learning-oriented project built to explore **FastAPI**, **React**, and **SQLAlchemy**.  
The application begins as a simple budgeting tool with two CRUD resources and a few endpoints, with the goal of gradually expanding functionality to cover more backend and frontend concepts.

---

## 📌 Goals

### Initial Learning Objectives
Gain foundational experience with:

- **FastAPI** – routes, dependency injection, Pydantic models, validation  
- **SQLAlchemy** – models, relationships, queries  
- **React** – components, state management, fetching API data, UI rendering  

---

## 📌 Initial Scope

A minimal personal budgeting tool for managing income and expense transactions.

### User Story

- Add **two types of transactions**: *income* or *expense*  
- After selecting a type, date, choose a **category**, enter an **amount**, and provide a **name**  
- View a **chronological list** of all transactions  
  - Incomes appear in **green**  
  - Expenses appear in **red**  
  - Each entry includes a **Delete** button  
- The list updates automatically as changes are made

---

## 🛠️ Technology Stack

### Backend
- Python  
- FastAPI  
- Pydantic  
- SQLAlchemy  
- SQLite  
- Uvicorn  

> Note: The backend currently resides in a single file for simplicity.  
> It will be modularized as the project scales.

### Frontend
- React (JavaScript)  
- React Query  
- Vite  
- `.tsx` files used as JS (TypeScript not yet enabled)  
- API URLs are currently hardcoded  

---

## 📈 Roadmap / To‑Do List

- Implement balance check for a given period - total income, total expense, total balance
- Implement filtering by type, category, and/or date
- Build a React UI for Category CRUD  
  (currently accessible only via the FastAPI Swagger UI)
- Add authentication to make the app multi-user
- Containerize the application (Docker)
- Refactor backend into modules (routers, schemas, services, etc.)

---

## 📦 Installation

### Prerequisites
- Python **3.10** (tested)
- **uv**
- Node.js + **npm** (npm version tested: 11.9)

---

## ▶️ Backend Setup

```bash
uv pip install fastapi pydantic sqlalchemy uvicorn
uv run main.py
```

---

## ▶️ Frontend Setup

```bash
cd frontend/budget
npm install
npm run dev
```