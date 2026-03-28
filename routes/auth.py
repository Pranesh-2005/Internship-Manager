from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import users
import bcrypt

router = APIRouter()

# ✅ Request model
class UserIn(BaseModel):
    username: str
    password: str


# 📝 Register
@router.post("/register")
def register(user: UserIn):

    if users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())

    users.insert_one({
        "username": user.username,
        "password": hashed,
        "role": "student"
    })

    return {"message": "Student registered successfully"}


# 🔑 Login
@router.post("/login")
def login(user: UserIn):

    db_user = users.find_one({"username": user.username})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.checkpw(user.password.encode(), db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "username": db_user["username"],
        "role": db_user["role"]
    }