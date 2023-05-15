from flask import Flask, render_template, request
from database import load_detai, insert_detai

app = Flask(__name__)

@app.route("/")
def detai_page():
    detais = load_detai()
    return render_template("detai.html", detais=detais)

@app.route("/insert_detai", methods=["POST"])
def input_detai():
    data = request.get_json()
    detai = data['detai']
    insert_detai(detai)
    print(detai)
    return "Data successfully inserted"

if __name__ == "__main__":
  app.run(host="0.0.0.0", debug=True)

