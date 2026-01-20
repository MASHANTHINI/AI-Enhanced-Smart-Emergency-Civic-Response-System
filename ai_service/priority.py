from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# Allow frontend/backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model
model = joblib.load("urgency_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

# ---------- Data Model ----------
class ComplaintInput(BaseModel):
    text: str   # 🔥 MATCH BACKEND

# ---------- Helpers ----------
def urgency_label(x):
    return ["Low", "Medium", "High"][x]

def priority_score(x):
    if x == 2:
        return 9
    elif x == 1:
        return 6
    else:
        return 3

# ---------- AI API ----------
@app.post("/analyze")
def analyze(data: ComplaintInput):

    text_vec = vectorizer.transform([data.text])
    pred = model.predict(text_vec)[0]

    return {
        "urgency": urgency_label(pred),
        "category": "Emergency" if pred==2 else "Infrastructure" if pred==1 else "General",
        "priority": priority_score(pred)
    }

# ---------- Test ----------
@app.get("/")
def root():
    return {"message": "AI NLP Priority Service Running"}
