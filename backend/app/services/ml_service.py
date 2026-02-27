# backend/app/predictor.py

import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent.parent.parent.parent / "ml" / "models" / "salary_model.pkl"

print(f"✅ Modèle path : {MODEL_PATH}")
print(f"✅ Existe      : {MODEL_PATH.exists()}")

# Features exactes du modèle entraîné
FEATURES = [
    'is_senior', 'is_junior', 'is_data', 'is_ml', 'is_engineer',
    'is_manager', 'is_research', 'title_len', 'Rating', 'company_age',
    'sector_enc', 'state_enc',
    'skill_data', 'skill_machine_learning', 'skill_business',
    'skill_data_science', 'skill_support', 'skill_research',
    'skill_analyze', 'skill_develop', 'skill_insights',
    'skill_technology', 'skill_development', 'skill_collaborate',
    'skill_analysis', 'skill_analytics', 'skill_design',
    'skill_count'
]

def predict_salary(job_title: str, skills: list = None) -> dict:

    payload = joblib.load(MODEL_PATH)

    # ── Supporter les 2 formats (dict ou modèle direct) ───────
    if isinstance(payload, dict):
        model = payload["regressor"]
    else:
        model = payload

    if skills is None:
        skills = []

    skills_lower = [s.strip().lower() for s in skills]
    title        = job_title.lower()

    # ── Construction des features (noms EXACTS du modèle) ─────
    row = {
        # Titre
        'is_senior':   int(any(x in title for x in ['senior', 'sr', 'lead', 'principal', 'staff'])),
        'is_junior':   int(any(x in title for x in ['junior', 'jr', 'entry', 'associate'])),
        'is_data':     int(any(x in title for x in ['data', 'analytics', 'analyst'])),
        'is_ml':       int(any(x in title for x in ['machine learning', 'ml', 'ai', 'deep learning'])),
        'is_engineer': int(any(x in title for x in ['engineer', 'developer', 'dev'])),
        'is_manager':  int(any(x in title for x in ['manager', 'director', 'head', 'vp', 'chief'])),
        'is_research': int(any(x in title for x in ['research', 'scientist'])),
        'title_len':   len(job_title),
        # Entreprise — valeurs par défaut
        'Rating':      3.8,   # ← majuscule comme dans le modèle !
        'company_age': 20,
        'sector_enc':  0,
        'state_enc':   0,
        # Skills NER — exactement les 15 du modèle
        'skill_data':             int('data' in skills_lower),
        'skill_machine_learning': int('machine learning' in skills_lower),
        'skill_business':         int('business' in skills_lower),
        'skill_data_science':     int('data science' in skills_lower),
        'skill_support':          int('support' in skills_lower),
        'skill_research':         int('research' in skills_lower),
        'skill_analyze':          int('analyze' in skills_lower),
        'skill_develop':          int('develop' in skills_lower),
        'skill_insights':         int('insights' in skills_lower),
        'skill_technology':       int('technology' in skills_lower),
        'skill_development':      int('development' in skills_lower),
        'skill_collaborate':      int('collaborate' in skills_lower),
        'skill_analysis':         int('analysis' in skills_lower),
        'skill_analytics':        int('analytics' in skills_lower),
        'skill_design':           int('design' in skills_lower),
        'skill_count':            len(skills_lower),
    }

    # ── Aligner avec les features exactes ─────────────────────
    X = pd.DataFrame([row]).reindex(columns=FEATURES, fill_value=0)

    # ── Prédiction ────────────────────────────────────────────
    salary_pred = float(model.predict(X)[0])

    return {
        "job_title":        job_title,
        "predicted_salary": round(salary_pred, 2),
        "salary_range":     f"${salary_pred*0.9:,.0f} — ${salary_pred*1.1:,.0f}",
        "skills_used":      skills,
    }