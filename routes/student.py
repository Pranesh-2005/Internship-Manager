from fastapi import APIRouter, UploadFile, File, Form
from datetime import datetime
from db import internships
from utils import extract_text, check_legitimacy
from bson import ObjectId

router = APIRouter()


# 📤 Upload Internship
@router.post("/upload")
async def upload_internship(
    username: str = Form(...),
    company_name: str = Form(...),
    file: UploadFile = File(...)
):
    # 1. Extract text
    text = extract_text(file)

    # 2. LLM suggestion
    ai_result = check_legitimacy(text)

    # 3. Store in DB
    data = {
        "username": username,
        "company_name": company_name,
        "extracted_text": text,
        "ai_verdict": ai_result.get("verdict"),
        "ai_reason": ai_result.get("reason"),
        "status": "pending",
        "rejection_reason": None,
        "created_at": datetime.utcnow()
    }

    internships.insert_one(data)

    return {
        "message": "Uploaded successfully",
        "ai_suggestion": ai_result,
        "note": "Admin will take final decision"
    }


# 📄 Get ALL (HIDDEN extracted_text)
@router.get("/my/{username}")
def get_my_data(username: str):
    data = list(internships.find({"username": username}))

    cleaned = []
    for d in data:
        cleaned.append({
            "_id": str(d["_id"]),
            "username": d["username"],
            "company_name": d["company_name"],
            "ai_verdict": d["ai_verdict"],
            "status": d["status"],
            "rejection_reason": d["rejection_reason"],
            "ai_reason": d["ai_reason"],
            "created_at": d["created_at"]
        })

    return cleaned


# 🔍 Filter by status
@router.get("/my/{username}/{status}")
def get_by_status(username: str, status: str):
    data = list(internships.find({
        "username": username,
        "status": status
    }))

    cleaned = []
    for d in data:
        cleaned.append({
            "_id": str(d["_id"]),
            "username": d["username"],
            "company_name": d["company_name"],
            "ai_verdict": d["ai_verdict"],
            "status": d["status"],
            "ai_reason": d["ai_reason"],
            "rejection_reason": d["rejection_reason"],
            "created_at": d["created_at"]
        })

    return cleaned


# 📑 Full Detail View (includes extracted_text)
@router.get("/detail/{id}")
def get_detail(id: str):
    doc = internships.find_one({"_id": ObjectId(id)})

    if not doc:
        return {"error": "Not found"}

    doc["_id"] = str(doc["_id"])

    return doc