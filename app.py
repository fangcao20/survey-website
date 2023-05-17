from flask import Flask, render_template, request, jsonify
from database import load_detai, insert_detai, delete_detai

app = Flask(__name__)

@app.route("/")
def detai_page():
    detais = load_detai()
    return render_template("detai.html", detais=detais)

@app.route("/insert_detai", methods=["POST"])
def input_detai():
    data = request.get_json()
    detai = data['detai']
    action = data['action']
    if action == 'luu':
        insert_detai(detai)
    elif action == 'xoa':
        delete_detai(detai)
    return jsonify(detai)


if __name__ == "__main__":
  app.run(debug=True)

