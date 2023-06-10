from flask import Flask, render_template, request, jsonify
from database import load_detai, insert_detai, delete_detai, load_cauhoi, load_nhomcauhoi, insert_nhom_cauhoi, delete_nhom_cauhoi
from database import insert_cauhoi, delete_cauhoi, load_luachon, load_thangdolikert, load_dulieudetai, load_cauhoi_sangloc
from phantich import cronbach, efa
import csv


app = Flask(__name__)


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


@app.route("/taocauhoi")
def taocauhoi_page():
    detais = load_detai()
    so_luong_detai = len(detais)
    return render_template("taocauhoi.html",
                           detais=detais,
                           so_luong_detai=so_luong_detai)


@app.route("/taocauhoi_data", methods=["POST"])
def taocauhoi_data():
    dt = request.get_json()
    data = dt['data']
    action = dt['action']
    if 'detai_id' in data:
        detai_id = data["detai_id"]
        if action == 'luu_nhom_cauhoi':
            insert_nhom_cauhoi(data)
        elif action == 'xoa_nhom_cauhoi':
            delete_nhom_cauhoi(data)

        if action == 'luu_cauhoi':
            print(data)
            insert_cauhoi(data)
        elif action == 'xoa_cauhoi':
            delete_cauhoi(data)

        cauhois = load_cauhoi(detai_id)
        tracnghiems = []
        likerts = []
        for cauhoi in cauhois:
            if cauhoi['loai_cau_tra_loi_id'] == 1:
                tracnghiems.append({
                    'cauhoi_id': cauhoi['cauhoi_id'],
                    'luachons': load_luachon(cauhoi['cauhoi_id'])
                })
            elif cauhoi['loai_cau_tra_loi_id'] == 2:
                likerts.append({
                    'cauhoi_id': cauhoi['cauhoi_id'],
                    'likerts': load_thangdolikert(cauhoi['cauhoi_id'])
                })
        nhomcauhois = load_nhomcauhoi(detai_id)
    else:
        print('"detai_id" not in data')
    return jsonify(cauhois=cauhois, nhomcauhois=nhomcauhois, tracnghiems=tracnghiems, likerts=likerts)


@app.route('/khaosat')
def khaosat_page():
    detais = load_detai()
    so_luong_detai = len(detais)
    return render_template('khaosat.html', detais=detais,
                           so_luong_detai=so_luong_detai)

@app.route("/khaosat_data", methods=["POST"])
def khaosat_data():
    dt = request.get_json()
    data = dt['data']
    action = dt['action']
    if 'detai_id' in data:
        detai_id = data["detai_id"]
        cauhois = load_cauhoi(detai_id)
        tracnghiems = []
        likerts = []
        for cauhoi in cauhois:
            if cauhoi['loai_cau_tra_loi_id'] == 1:
                tracnghiems.append({
                    'cauhoi_id': cauhoi['cauhoi_id'],
                    'luachons': load_luachon(cauhoi['cauhoi_id'])
                })
            elif cauhoi['loai_cau_tra_loi_id'] == 2:
                likerts.append({
                    'cauhoi_id': cauhoi['cauhoi_id'],
                    'likerts': load_thangdolikert(cauhoi['cauhoi_id'])
                })
    return jsonify(cauhois=cauhois, tracnghiems=tracnghiems, likerts=likerts)


@app.route("/chondulieu")
def chondulieu_page():
    detais = load_detai()
    so_luong_detai = len(detais)
    return render_template("chondulieu.html", detais=detais, so_luong_detai=so_luong_detai)

@app.route("/phantich_data", methods=["POST"])
def phantich_data():
    if request.headers.get("Content-Type") == "application/json":
        dt = request.get_json()
        data = dt['data']
        nhomcauhoi = dt['nhomcauhoi']
        cronbach_result = cronbach(data, nhomcauhoi)
        cronbach_total = cronbach_result[0][0]
        cronbach_table = cronbach_result[1]
        soluongbien = cronbach_result[2]

        efa_result = efa()
        p_value = efa_result['p_value']
        kmo = efa_result['kmo']
        ev = efa_result['ev']
        binhphuong = efa_result['binhphuong']
        tile = efa_result['tile']
        tichluy = efa_result['tichluy']
        matran = efa_result['matran']
        comau = efa_result['comau']

        return jsonify(cronbach_table=cronbach_table, cronbach_total=cronbach_total,
                       soluongbien=soluongbien, p_value=p_value, kmo=kmo, ev=ev,
                       binhphuong=binhphuong, tile=tile, tichluy=tichluy, matran=matran, comau=comau)


@app.route("/detai_data", methods=["POST"])
def detai_data():
    data = request.get_json()
    if len(data.keys()) == 2:
        macauhois = data['macauhois']
        cautralois = data['cautralois']
    else:
        macauhois = load_dulieudetai(data)[0]
        cautralois = load_dulieudetai(data)[1]

    filename = 'data.csv'

    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(macauhois)
        for key, values in cautralois.items():
            writer.writerow(values)

    print(f'Data saved to {filename}')

    return jsonify(macauhois=macauhois, cautralois=cautralois)


@app.route("/danhgiathidiem")
def danhgiathidiem():
    return render_template('danhgiathidiem.html')

@app.route("/sangloccauhoi")
def sangloccauhoi():
    return render_template('sangloccauhoi.html')

@app.route("/sangloc_data", methods=["POST"])
def sangloc_data():
    data = request.get_json()
    macauhoichinhthucs = data['macauhoichinhthucs']
    print(macauhoichinhthucs)
    macauhoiloaibos = data['macauhoiloaibos']
    dschct = load_cauhoi_sangloc(macauhoichinhthucs)
    # dschlb = load_cauhoi_sangloc(macauhoiloaibos)
    return jsonify(dschct=dschct)


@app.route("/")
@app.route('/dangnhap')
def login():
    return render_template('login.html')

@app.route('/dangky')
def signup():
    return render_template('signup.html')


if __name__ == "__main__":
  app.run(debug=True)

