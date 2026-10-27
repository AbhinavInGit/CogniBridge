from pathlib import Path
import re
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title='CogniBridge AI Demo Service')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'], allow_methods=['*'], allow_headers=['*'])
MODEL_PATH = Path(__file__).parent / 'model.joblib'

class QuizFeatures(BaseModel):
    avg_score: float
    score_trend: float
    avg_time_per_question: float
    retry_count: float
    score_variance: float
    completion_rate: float

class AdaptRequest(BaseModel):
    text: str
    mode: str

def get_bundle():
    if not MODEL_PATH.exists(): raise HTTPException(503, 'Model is not trained. Run python train.py first.')
    return joblib.load(MODEL_PATH)

@app.get('/health')
def health(): return {'status': 'ok', 'model_ready': MODEL_PATH.exists()}

@app.post('/classify')
def classify(features: QuizFeatures):
    bundle = get_bundle()
    row = np.array([[getattr(features, feature) for feature in bundle['features']]])
    probabilities = bundle['model'].predict_proba(row)[0]
    label_index = int(np.argmax(probabilities))
    profile = bundle['labels'][label_index]
    return {'profile': profile, 'confidence': float(probabilities[label_index]), 'mode': 'standard' if profile == 'standard' else 'nd'}

@app.post('/adapt')
def adapt(request: AdaptRequest):
    # TODO: replace this extractive demo heuristic with a locally hosted T5/BART model.
    sentences = [sentence.strip() for sentence in re.split(r'(?<=[.!?])\s+', request.text) if sentence.strip()]
    summary = sentences[:3]
    words = re.findall(r'[A-Za-z]{4,}', request.text.lower())
    key_terms = list(dict.fromkeys(words))[:3]
    return {'summary': summary, 'key_terms': key_terms, 'mode': request.mode}
