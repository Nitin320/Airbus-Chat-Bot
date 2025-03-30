from flask import Flask, request, jsonify
import os
import httpx
import fitz  # PyMuPDF for PDF processing
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set API Key
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY", "4112fdd91cc387561671f0d859fa17a239d249d8387ce05a009d5e48035bacfb")
TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions"

# Load PDF and split into text chunks
PDF_PATH = "server/a320training.pdf"
CHUNK_SIZE = 500
text_chunks = []

def load_pdf():
    """Loads the PDF and splits text into chunks"""
    global text_chunks
    try:
        if os.path.exists(PDF_PATH):
            doc = fitz.open(PDF_PATH)
            full_text = "\n".join([page.get_text("text") for page in doc])
            text_chunks = [full_text[i:i + CHUNK_SIZE] for i in range(0, len(full_text), CHUNK_SIZE)]
            print(f"✅ Loaded {len(text_chunks)} text chunks from PDF.")
        else:
            print(f"⚠️ PDF file not found at {PDF_PATH}")
    except Exception as e:
        print(f"❌ Error loading PDF: {e}")

# Function to retrieve relevant text (basic keyword search)
def retrieve_relevant_chunks(query, top_k=3):
    """Finds text chunks that contain the query keywords"""
    keyword = query.lower()
    matching_chunks = [chunk for chunk in text_chunks if keyword in chunk.lower()]
    return "\n".join(matching_chunks[:top_k]) if matching_chunks else ""

# Function to get AI response with context
def get_ai_response(prompt, context=""):
    headers = {"Authorization": f"Bearer {TOGETHER_API_KEY}", "Content-Type": "application/json"}
    
    full_prompt = f"""
    You are an AI assistant specializing in Airbus A320 training materials. Use the provided context to answer.
    
    Context: {context}
    
    User: {prompt}
    Assistant:
    """
    payload = {
        "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        "messages": [{"role": "user", "content": full_prompt}],
        "temperature": 0.5,
        "max_tokens": 500  # Increased for longer responses
    }
    
    try:
        response = httpx.post(TOGETHER_API_URL, headers=headers, json=payload)
        response_data = response.json()
        
        if response.status_code != 200:
            print(f"❌ API Error {response.status_code}: {response.text}")
            return f"Error: {response.status_code} - {response.text}"
        
        print(f"✅ API Response: {response_data}")
        return response_data.get("choices", [{}])[0].get("message", {}).get("content", "Error fetching response")
    except Exception as e:
        print(f"❌ Exception calling API: {e}")
        return "Error communicating with AI service"

@app.route("/", methods=["GET", "POST"])
def health_check():
    return jsonify({"message": "Service is running"})

@app.route("/chat", methods=["POST", "GET"])
def chat():
    """Handles incoming chat requests"""
    if request.content_type != "application/json":
        return jsonify({"error": "Unsupported Media Type. Use 'application/json'"}), 415

    data = request.get_json(silent=True)
    if not data or "question" not in data:
        return jsonify({"error": "Invalid request. Send JSON with a 'question' field."}), 400

    question = data["question"]
    context = retrieve_relevant_chunks(question)
    response = get_ai_response(question, context)
    
    return jsonify({"answer": response})

# Load PDF at startup
load_pdf()

if __name__ == "__main__":
    app.run(debug=True)  # Enabled debug mode for better error tracking