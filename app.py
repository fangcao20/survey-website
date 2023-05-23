from flask import Flask, render_template, request, jsonify
from database import load_detai, insert_detai, delete_detai, load_cauhoi, load_nhomcauhoi
from phantich import phantichfile

app = Flask(__name__)

@app.route("/")
@app.route("/detai")
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

@app.route("/phantich")
def phantich_page():
    detais = load_detai()
    so_luong_detai = len(detais)
    return render_template("phantich.html", detais=detais, so_luong_detai=so_luong_detai)


@app.route("/phantich_data", methods=["POST"])
def phantich_data():
    f = request.files['file']
    f.save(f.filename)
    data = phantichfile(f.filename)
    df = data[0]
    cronbach = data[1]
    rows = df.to_dict(orient="records")
    cols = list(df.columns)
    data = [cols, rows]
    return jsonify(data=data)

@app.route("/taocauhoi")
def taocauhoi_page():
    detais = load_detai()
    so_luong_detai = len(detais)
    return render_template("taocauhoi.html",
                           detais=detais,
                           so_luong_detai=so_luong_detai)


@app.route("/taocauhoi_data", methods=["POST"])
def taocauhoi_data():
    data = request.get_json()
    detai_id = data['detai_id']
    ten_de_tai = data['ten_de_tai']
    cauhois = load_cauhoi(detai_id)
    nhomcauhois = load_nhomcauhoi(detai_id)
    return(jsonify(cauhois=cauhois, nhomcauhois=nhomcauhois))


if __name__ == "__main__":
  app.run(debug=True)

