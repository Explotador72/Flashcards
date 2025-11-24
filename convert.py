import csv
import json
import requests
from io import StringIO

# URL pública de tu Google Sheet exportada como CSV
url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNGZwo-97c1vhJdxEzrS4-RBL5PJuoPu_KGw5gdaTYIO61YwgkB76YSeDmuOKFXr7o9y_41LLYMFAf/pub?gid=0&single=true&output=csv"

json_file = "data.json"

# Descargar CSV
response = requests.get(url)
response.encoding = 'utf-8-sig'  # <- esto corrige los acentos

csv_text = StringIO(response.text)
reader = csv.DictReader(csv_text)
flashcards = []

for row in reader:
    flashcards.append({
        "question": row.get("question", "").strip(),
        "answer": row.get("answer", "").strip(),
        "category": row.get("category", "").strip()
    })

# Guardar JSON
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(flashcards, f, ensure_ascii=False, indent=2)

print(f"{len(flashcards)} flashcards guardadas en {json_file}")
