from fastapi import APIRouter, HTTPException
from db import internships
from bson import ObjectId

router = APIRouter()


# 📋 Get ALL (clean response)
@router.get("/all")
def get_all():
    data = list(internships.find())

    cleaned = []
    for d in data:
        cleaned.append({
            "_id": str(d["_id"]),
            "username": d["username"],
            "company_name": d["company_name"],
            "extracted_text": d["extracted_text"],
            "ai_verdict": d["ai_verdict"],
            "status": d["status"],
            "rejection_reason": d["rejection_reason"],
            "created_at": d["created_at"]
        })

    return cleaned


# 🔍 Filter by status (query param)
@router.get("/filter")
def filter_status(status: str):
    data = list(internships.find({"status": status}))

    cleaned = []
    for d in data:
        cleaned.append({
            "_id": str(d["_id"]),
            "username": d["username"],
            "company_name": d["company_name"],
            "extracted_text": d["extracted_text"],
            "ai_verdict": d["ai_verdict"],
            "status": d["status"],
            "rejection_reason": d["rejection_reason"],
            "created_at": d["created_at"]
        })

    return cleaned


# ✅ Approved only
@router.get("/approved")
def get_approved():
    return filter_status("approved")


# ❌ Rejected only
@router.get("/rejected")
def get_rejected():
    return filter_status("rejected")


# ⏳ Pending only
@router.get("/pending")
def get_pending():
    return filter_status("pending")


# 📑 Full detail (includes extracted_text)
@router.get("/detail/{id}")
def get_detail(id: str):
    doc = internships.find_one({"_id": ObjectId(id)})

    if not doc:
        raise HTTPException(status_code=404, detail="Internship not found")

    doc["_id"] = str(doc["_id"])

    return doc


# ✅ Approve
@router.post("/approve/{id}")
def approve(id: str):
    result = internships.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "status": "approved",
                "rejection_reason": None
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Internship not found")

    return {"message": "Approved by admin"}


# ❌ Reject (override AI)
@router.post("/reject/{id}")
def reject(id: str, reason: str):
    result = internships.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "status": "rejected",
                "rejection_reason": reason
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Internship not found")

    return {
        "message": "Rejected by admin",
        "note": "Admin decision overrides AI"
    }