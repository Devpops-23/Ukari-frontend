from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import os
import jwt

app = FastAPI()

# Allow calls from the Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory fake DB (process-lifetime)
fake_users: dict[str, dict] = {}

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/auth/signup")
def signup(payload: SignupRequest):
    if payload.email in fake_users:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Save user (in-memory)
    fake_users[payload.email] = {
        "email": payload.email,
        "name": payload.name,
        "password": payload.password,  # later hash this
    }

    # Create JWT token
    token = create_access_token({"sub": payload.email})

    return {
        "access_token": token,
        "user": {"email": payload.email, "name": payload.name},
    }
