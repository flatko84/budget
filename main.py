from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
import uvicorn
from sqlalchemy import create_engine, Column, Integer, String, Numeric, ForeignKey, select
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase, Mapped, mapped_column, relationship, selectinload, joinedload
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware

print("Server starting...")

app = FastAPI(title="Budget")

origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("sqlite:///budget.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

class Category(Base):
    __tablename__="categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    transaction_type: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    transactions: Mapped[List["Transaction"]] = relationship(back_populates="category")


class Transaction(Base):
    __tablename__="transactions"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    category: Mapped["Category"] = relationship(back_populates="transactions")
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric, nullable=False)

class CategoryCreate(BaseModel):
    transaction_type:int
    name:str

class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes = True, arbitrary_types_allowed=True)

    id:int
    transaction_type:int
    name:str    

class TransactionCreate(BaseModel):
    category_id:int
    name:str
    amount:float

class TransactionDelete(BaseModel):
    id: int

class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes = True, arbitrary_types_allowed=True)

    id:int
    category_id:int
    name:str
    amount:float
    category:CategoryResponse    


Base.metadata.create_all(engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#get_db()


@app.get("/", response_class=HTMLResponse)
def get_root():
    return """
    <html>
            <head>
                <title>Budget</title>
            </head>
            <body>
                <h1>Budget app v0.1</h1>
            </body>
        </html>
    """


@app.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category(category_id:int, db:Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@app.get("/categories")
def get_categories(db:Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@app.post("/categories/", response_model=CategoryResponse)
def create_category(category:CategoryCreate, db:Session = Depends(get_db)):
    if db.query(Category).filter(Category.name == category.name).first():
        raise HTTPException(status_code=501, detail="This category exists")
    new_category = Category(**category.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.delete("/category/{category_id}")
def delete_category(category_id:int, db:Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).delete()
    db.commit()
    if (not category):
        raise HTTPException(status_code=404, detail="This category does not exist.")
    return category

@app.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id:int, db:Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@app.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(db:Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return transactions

@app.post("/transactions", response_model=TransactionResponse)
def create_transaction(response: Response, transaction:TransactionCreate, db:Session = Depends(get_db)):
    new_transaction = Transaction(**transaction.model_dump())
    response.headers["Content-type"] = "application/json"
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@app.delete("/transaction/{transaction_id}")
def delete_transaction(transaction_id:int, db:Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).delete()
    db.commit()
    if (not transaction):
        raise HTTPException(status_code=404, detail="This transaction does not exist.")
    return transaction

if __name__ == "__main__":
    # Change the port here
    uvicorn.run(app, host="0.0.0.0", port=8000)