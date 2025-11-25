from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PRODUCT = {
    "id": "SNK-001",
    "name": "Minimal Sneakers",
    "price": 5999,
    "currency": "INR",
}

@app.get("/api/product")
def get_product():
    return jsonify(PRODUCT)

@app.post("/api/checkout")
def checkout():
    data = request.get_json(force=True, silent=True) or {}
    # Place order handling here (validate, persist, payment, etc.)
    return jsonify({"status": "ok", "received": data}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


