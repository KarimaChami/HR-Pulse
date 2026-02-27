import os
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class JobOffer(Base):
    __tablename__ = "job_offers"

    id             = Column(Integer, primary_key=True, index=True)
    job_title      = Column(String(255), nullable=False)
    skills_extracted = Column(Text, nullable=True)  # JSON stocké en texte


def init_db():
    """Crée les tables si elles n'existent pas."""
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()