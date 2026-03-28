from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import student, admin, auth

app = FastAPI(title="Internship Verification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for dev (later restrict)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(student.router, prefix="/student", tags=["Student"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}

@app.get("/kaithheathcheck")
def kaithhealth_check():
    return {"status": "healthy"}

@app.get("/kaithhealthcheck")
def kaith_health_check():
    return {"status": "healthy"}