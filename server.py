# server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://fwv-calculators.vercel.app",   # your Vercel preview/prod
    "https://fosterwealthventures.store",   # your custom domain
    "https://www.fosterwealthventures.store",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],  # or a strict list if you prefer
)
