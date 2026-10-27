# CogniBridge

CogniBridge is a B.Tech capstone prototype for an inclusive virtual-school platform. This demo focuses on a small working vertical slice: role-based workspaces, a short student quiz, and an AI-assisted learning-profile response.

## Architecture

- `frontend/` - React + Vite interface with mock role authentication, dashboards and Chart.js charts.
- `ai-service/` - FastAPI service that classifies quiz-history features and returns a lightweight adapted lesson.
- Planned later: Node.js API gateway, persistent databases, authentication provider and real-time services.

## Run the demo

### 1. Start the AI service

```powershell
cd ai-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train.py
uvicorn main:app --reload
```

The AI service starts at `http://127.0.0.1:8000`.

### 2. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally `http://127.0.0.1:5173`. Set `VITE_AI_URL` if the AI service runs somewhere other than `http://127.0.0.1:8000`.

## Demo credentials

All demo accounts use the password `demo123`.

| Role | Email |
| --- | --- |
| Institute | `institute@cognibridge.demo` |
| Teacher | `teacher@cognibridge.demo` |
| Student | `student@cognibridge.demo` |
| Parent | `parent@cognibridge.demo` |

## Status

### Done

- Mock role login stored in browser `localStorage`
- Institute, Teacher, Student and read-only Parent dashboards
- Learning-profile distribution chart and student progress chart
- Five-question student quiz connected to FastAPI classification
- Adapted micro-lesson view and frontend fallback when the AI service is down

### In progress

- Better frontend validation and richer content data
- Teacher assessment workflow

### Planned

- WebRTC live classes
- Collaborative learning rooms
- Plagiarism detection
- Whisper lecture transcription
- Node API gateway, database storage and real authentication

## Synthetic-data disclaimer

`ai-service/train.py` generates **synthetic** quiz-history data solely for the mentor demo. The classifier is not a diagnostic tool and must not be used for educational, clinical or high-stakes decisions. A future phase needs consented real data, fairness testing, educational validation and appropriate human oversight.
