from flask import Flask, render_template
from database import load_detai

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def detai_page():
    detais = load_detai()
    return render_template("detai.html", detais=detais)


if __name__ == "__main__":
  app.run(host="0.0.0.0", debug=True)