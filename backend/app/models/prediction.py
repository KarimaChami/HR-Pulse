from pydantic import BaseModel
# from pyparsing import Optional
from typing import Optional


class PredictRequest(BaseModel):
    job_title: str
    skills: Optional[list[str]] = []

    class Config:
        json_schema_extra = {
            "example": {
                "job_title": "Senior Data Scientist",
                "skills": ["python", "machine learning", "aws", "sql"]
            }
        }