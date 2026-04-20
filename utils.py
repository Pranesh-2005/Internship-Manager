import fitz  # PyMuPDF
import json
import re
from openai import OpenAI
from config import NEBIUS_API_KEY, MODEL

# Initialize client
client = OpenAI(
    base_url="https://api.tokenfactory.nebius.com/v1/",
    api_key=NEBIUS_API_KEY
)

def extract_text(file):
    doc = fitz.open(stream=file.file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text[:3000]

def check_legitimacy(text):

    prompt = f"""
        You are an AI that ONLY returns JSON.

        STRICT RULES:
        - No explanation outside JSON
        - No markdown
        - Only valid JSON

        Format:
        {{ "verdict": "legit" or "fake", "reason": "short reason" }}

        TEXT:
        {text}
        This is extracted text from the Internship offer letter. If the offer Letter is legitimate, return "legit". If it is fake, return "fake" with a short reason.
        For Legit it should have 3 important things:
        1. Stipend (Can be ignored)
        2. Internship Period (Must be above 2 months)
        3. Company Name (Ignore Companies like Internshala, AICTE......)
        """

    response = client.chat.completions.create(
        model="google/gemma-2-2b-it",
        messages=[
            {
                "role": "system",
                "content": "You are a strict internship verifier."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content

    return safe_parse(content)

def safe_parse(content):
    try:
        return json.loads(content)
    except:
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                pass

        return {
            "verdict": "unknown",
            "reason": content
        }
