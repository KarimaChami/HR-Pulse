from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from backend.app.schemas.user import UserRegister, UserLogin, UserResponse, Token
from backend.app.services.auth_service import get_current_user, register_user, authenticate_user, login_user
from backend.app.db import get_db,init_db
# from app.dependencies.auth_dependencies import require_admin
# from app.models.user import User
# from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.app.models.prediction import PredictRequest
from backend.app.services.ml_service import predict_salary
from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
@app.post("/register", response_model=UserResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    return register_user(db, user)


@app.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    authenticated_user = authenticate_user(
        db,
        form_data.username,  # ⚠️ Swagger envoie username
        form_data.password
    )

    token = login_user(authenticated_user)

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/me", tags=["Auth"], response_model=UserResponse)
def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current authenticated user info."""
    return current_user

@app.get("/jobs", tags=["Jobs"])
def get_jobs(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Liste les offres depuis Azure SQL."""
    result = db.execute(
        text("SELECT id, title, skills FROM jobs ORDER BY id OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY"),
        {"offset": offset, "limit": limit}
    ).fetchall()

    return [
        {
            "id":     row[0],
            "title":  row[1],
            "skills": row[2][:200] + "..." if row[2] and len(row[2]) > 200 else row[2]
        }
        for row in result
    ]


@app.get("/jobs/search", tags=["Jobs"])
def search_jobs(
    skill: str ,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    """Recherche les offres contenant une compétence spécifique."""
    result = db.execute(
        text("SELECT id, title, skills FROM jobs WHERE LOWER(skills) LIKE :skill"),
        {"skill": f"%{skill.lower()}%"}
    ).fetchall()

    if not result:
        raise HTTPException(status_code=404, detail=f"Aucune offre trouvée pour la skill : {skill}")

    return {
        "skill":   skill,
        "count":   len(result),
        "results": [{"id": r[0], "title": r[1]} for r in result]
    }

@app.get("/jobs/{job_id}", tags=["Jobs"])
def get_job(job_id: int, db: Session = Depends(get_db),current_user: UserResponse = Depends(get_current_user)):
    """Détail d'une offre par ID."""
    result = db.execute(
        text("SELECT id, title, skills FROM jobs WHERE id = :id"),
        {"id": job_id}
    ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Offre introuvable")

    return {"id": result[0], "title": result[1], "skills": result[2]}


@app.post("/predict-salary", tags=["ML"],)
def predict(request: PredictRequest, current_user: UserResponse = Depends(get_current_user)):
    result = predict_salary(
        job_title=request.job_title,
        skills=request.skills
    )
    return result


@app.get("/health", tags=["System"])
def health(db: Session = Depends(get_db)):
    """Vérifie l'état de l'API et de la connexion SQL."""
    try:
        count = db.execute(text("SELECT COUNT(*) FROM jobs")).scalar()
        return {
            "status":     "healthy",
            "jobs_in_db": count,
            "api":        "HR-Pulse v1.0"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"DB inaccessible : {str(e)}")


# if __name__ == "__main__":
#     main()
