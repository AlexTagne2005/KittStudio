from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="KittStudio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporaire pour le dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to KittStudio API"}
