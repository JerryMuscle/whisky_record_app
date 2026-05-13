from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
db = SQLAlchemy(app)

@app.route("/health")
def health():
    return jsonify({"status": "ok", "message": "Flask is running!"})

@app.route("/health/db")
def health_db():
    try:
        db.session.execute(db.text("SELECT 1"))
        return jsonify({"status": "ok", "message": "DB connected!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)