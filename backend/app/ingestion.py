import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)

# ── Créer la table ─────────────────────────────────────────────
with engine.connect() as connection:
    connection.execute(text("""
        IF NOT EXISTS (
            SELECT * FROM sysobjects 
            WHERE name='jobs' AND xtype='U'
        )
        CREATE TABLE jobs (
            id     INT IDENTITY(1,1) PRIMARY KEY,
            title  NVARCHAR(255),
            skills NVARCHAR(MAX)
        )
    """))
    connection.commit()

print('✅ Table créée (ou déjà existante)')

# ── Charger le CSV ─────────────────────────────────────────────
df = pd.read_csv('./DATA/dataset_with_skills.csv')
print(f'Colonnes disponibles : {df.columns.tolist()}')
print(f'Lignes à injecter    : {len(df)}')

# ── Insérer les données ────────────────────────────────────────
with engine.connect() as connection:
    for _, row in df.iterrows():
        connection.execute(text("""
            INSERT INTO jobs (title, skills)
            VALUES (:title, :skills)
        """), {
            "title":  str(row["Job Title"]),       # ← vérifier le nom exact
            "skills": str(row["extracted_skills"])
        })
    connection.commit()

print(f'✅ {len(df)} offres injectées dans Azure SQL')
# Ajouter à la fin du script
with engine.connect() as connection:
    result = connection.execute(text("SELECT COUNT(*) FROM jobs"))
    print(f"Total en base : {result.scalar()}")
    
    sample = connection.execute(text("SELECT TOP 3 * FROM jobs"))
    for row in sample:
        print(row)