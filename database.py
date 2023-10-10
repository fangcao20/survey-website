import mysql.connector as connector
import os

USERNAME = os.environ.get('USERNAME')
PASSWORD = os.environ.get('PASSWORD')
HOST = os.environ.get('HOST')
DATABASE = os.environ.get('DATABASE')

mydb = connector.connect(user=USERNAME, password=PASSWORD,
                         host=HOST,
                         database=DATABASE)
mycursor = mydb.cursor()


def load_detai():
    mycursor.execute("SELECT * FROM detai")
    result = mycursor.fetchall()

    # Lấy thông tin các cột
    columns = [column[0] for column in mycursor.description]

    # Tạo danh sách các dictionary
    records = []
    for row in result:
        record = {}
        for i in range(len(columns)):
            record[columns[i]] = row[i]
        records.append(record)
    return records


def insert_detai(detai):
    values = (1, detai['ten_de_tai'],
              detai['nguoi_thuc_hien'],
              detai['ngay_thuc_hien'],
              detai['mo_ta'])
    if detai['detai_id'] == 0:
        sql = """INSERT INTO detai(user_id, ten_de_tai, nguoi_thuc_hien, ngay_thuc_hien, mo_ta)
                VALUES (%s, %s, %s, %s, %s)"""
        mycursor.execute(sql, values)
        print("Insert")
    else:
        sql = """UPDATE detai SET
                    user_id = %s,
                    ten_de_tai = %s,
                    nguoi_thuc_hien = %s,
                    ngay_thuc_hien = %s,
                    mo_ta = %s
                WHERE detai_id = %s
                """
        values = (1, detai['ten_de_tai'],
                  detai['nguoi_thuc_hien'],
                  detai['ngay_thuc_hien'],
                  detai['mo_ta'],
                  detai['detai_id'])
        mycursor.execute(sql, values)
        print("Update")
    mydb.commit()


def delete_detai(detai):
    values = (detai['detai_id'],)
    sql = """
            DELETE FROM detai
            WHERE detai_id = %s;
        """
    mycursor.execute(sql, values)
    mydb.commit()
    print("Delete")


def load_cauhoi(detai_id):
    mycursor.execute("SELECT * FROM cauhoi WHERE detai_id = %s", (detai_id,))
    result = mycursor.fetchall()

    # Lấy thông tin các cột
    columns = [column[0] for column in mycursor.description]

    # Tạo danh sách các dictionary
    records = []
    for row in result:
        record = {}
        for i in range(len(columns)):
            record[columns[i]] = row[i]
        records.append(record)
    return records


def insert_cauhoi(cauhoi):
    values = (cauhoi['detai_id'],
              cauhoi['nhom_cauhoi_id'],
              cauhoi['loai_cau_tra_loi_id'],
              cauhoi['ma_cauhoi'],
              cauhoi['noi_dung'],
              'Hiện')
    if cauhoi['cauhoi_id'] == 0:
        sql = """INSERT INTO cauhoi(detai_id, nhom_cauhoi_id, loai_cau_tra_loi_id, ma_cauhoi, noi_dung, trang_thai) 
                VALUES (%s, %s, %s, %s, %s, %s)"""
        mycursor.execute(sql, values)
        mycursor.execute("""SELECT * FROM cauhoi WHERE detai_id = %s AND
                                                    nhom_cauhoi_id = %s AND
                                                    loai_cau_tra_loi_id = %s AND
                                                    ma_cauhoi = %s AND
                                                    noi_dung = %s AND
                                                    trang_thai = %s
                            """, values)
        result = mycursor.fetchall()
        cauhoi['cauhoi_id'] = result[0][0]
        print(result)
        print("Insert")
    else:
        sql = """UPDATE cauhoi SET
                    ma_cauhoi = %s,
                    noi_dung = %s
                WHERE cauhoi_id = %s
                """
        values = (cauhoi['ma_cauhoi'],
                  cauhoi['noi_dung'],
                  cauhoi['cauhoi_id'])
        mycursor.execute(sql, values)
        print("Update")
    insert_cau_traloi(cauhoi['cauhoi_id'], cauhoi['loai_cau_tra_loi_id'], cauhoi['cautraloi'])
    print(cauhoi['cautraloi'])
    mydb.commit()


def delete_cauhoi(cauhoi):
    values = (cauhoi['cauhoi_id'],)
    sql = """
                DELETE FROM cauhoi
                WHERE cauhoi_id = %s;
            """
    mycursor.execute(sql, values)
    print("Delete")
    mydb.commit()


def load_nhomcauhoi(detai_id):
    mycursor.execute("SELECT * FROM nhom_cauhoi WHERE detai_id = %s", (detai_id,))
    result = mycursor.fetchall()

    # Lấy thông tin các cột
    columns = [column[0] for column in mycursor.description]

    # Tạo danh sách các dictionary
    records = []
    for row in result:
        record = {}
        for i in range(len(columns)):
            record[columns[i]] = row[i]
        records.append(record)
    return records


def insert_nhom_cauhoi(nhomcauhoi):
    values = (nhomcauhoi['detai_id'],
              nhomcauhoi['ma_nhom'],
              nhomcauhoi['ten_nhom'])
    if nhomcauhoi['nhom_cauhoi_id'] == 0:
        sql = "INSERT INTO nhom_cauhoi(detai_id, ma_nhom, noi_dung) VALUES (%s, %s, %s)"
        mycursor.execute(sql, values)
        print("Insert")
    else:
        sql = """UPDATE nhom_cauhoi SET
                        ma_nhom = %s,
                        noi_dung = %s
                    WHERE nhom_cauhoi_id = %s
                    """
        values = (nhomcauhoi['ma_nhom'],
                  nhomcauhoi['ten_nhom'],
                  nhomcauhoi['nhom_cauhoi_id'])
        mycursor.execute(sql, values)
        print("Update")
    mydb.commit()


def delete_nhom_cauhoi(nhomcauhoi):
    values = (nhomcauhoi['nhom_cauhoi_id'],)
    sql = """
            DELETE FROM nhom_cauhoi
            WHERE nhom_cauhoi_id = %s;
        """
    mycursor.execute(sql, values)
    print("Delete")
    mydb.commit()


def load_luachon(cauhoi_id):
    mycursor.execute("SELECT * FROM luachon WHERE cauhoi_id = %s", (cauhoi_id,))
    result = mycursor.fetchall()

    # Lấy thông tin các cột
    columns = [column[0] for column in mycursor.description]

    # Tạo danh sách các dictionary
    records = []
    for row in result:
        record = {}
        for i in range(len(columns)):
            record[columns[i]] = row[i]
        records.append(record)
    return records


def insert_cau_traloi(cauhoi_id, loai_cau_tra_loi_id, cautraloi):
    if loai_cau_tra_loi_id == 1:
        for luachon in cautraloi:
            values = (
                cauhoi_id,
                luachon['Nội dung']
            )
            if luachon['luachon_id'] == 0:
                sql = "INSERT INTO luachon(cauhoi_id, noi_dung) VALUES (%s, %s)"
                mycursor.execute(sql, values)
            else:
                sql = "UPDATE luachon SET noi_dung = %s WHERE luachon_id = %s"
                values = (luachon['Nội dung'], luachon['luachon_id'])
                mycursor.execute(sql, values)
    elif loai_cau_tra_loi_id == 2:
        for luachon in cautraloi:
            values = (
                cauhoi_id,
                luachon['Điểm Likert'],
                luachon['Nội dung']
            )
            if luachon['likert_id'] == 0:
                sql = "INSERT INTO thangdolikert(cauhoi_id, diem_likert, noi_dung) VALUES (%s, %s, %s)"
                mycursor.execute(sql, values)
            else:
                sql = "UPDATE thangdolikert SET diem_likert = %s, noi_dung = %s WHERE likert_id = %s"
                values = (luachon['Điểm Likert'], luachon['Nội dung'], luachon['likert_id'])
                mycursor.execute(sql, values)
    print("Lưu câu trả lời")
    mydb.commit()


def load_thangdolikert(cauhoi_id):
    mycursor.execute("SELECT * FROM thangdolikert WHERE cauhoi_id = %s", (cauhoi_id,))
    result = mycursor.fetchall()

    # Lấy thông tin các cột
    columns = [column[0] for column in mycursor.description]

    # Tạo danh sách các dictionary
    records = []
    for row in result:
        record = {}
        for i in range(len(columns)):
            record[columns[i]] = row[i]
        records.append(record)
    return records


def load_dulieudetai(data):
    detai_id = data['detai_id']

    def convertdate(date):
        ymd = date.split('-')
        return f"{ymd[0]}-{ymd[2]}-{ymd[1]}"

    starttime = convertdate(data['start'])
    endtime = convertdate(data['end'])

    mycursor.execute("SELECT ma_cauhoi FROM cauhoi WHERE detai_id = %s", (detai_id,))
    result = mycursor.fetchall()
    macauhois = []
    for row in result:
        macauhois.append(row[0])

    mycursor.execute("SELECT phieukhaosat_id, ngay_khao_sat FROM phieukhaosat WHERE detai_id = %s", (detai_id,))
    result = mycursor.fetchall()
    phieukhaosats = []
    for row in result:
        ngaykhaosat = row[1]
        if (str(ngaykhaosat) >= starttime) and (str(ngaykhaosat) <= endtime):
            phieukhaosats.append(row[0])

    sql = "SELECT diem_likert FROM cautraloi WHERE phieukhaosat_id = %s"
    cautralois = {}
    for i in range(len(phieukhaosats)):
        phieukhaosat_id = phieukhaosats[i]
        mycursor.execute(sql, (phieukhaosat_id,))
        result = mycursor.fetchall()
        row = []
        for diem in result:
            row.append(diem[0])
        cautralois[i + 1] = row
    return macauhois, cautralois


def load_cauhoi_sangloc(macauhois):
    load_result = []
    for macauhoi in macauhois:
        mydict = {}
        value = (macauhoi,)
        sql = "SELECT cauhoi_id, noi_dung FROM cauhoi WHERE ma_cauhoi = %s"
        mycursor.execute(sql, value)
        result = mycursor.fetchall()

        print(result)
    #     mydict['cauhoi_id'] = result[0][0]
    #     mydict['ma_cauhoi'] = macauhoi
    #     mydict['noi_dung'] = result[0][1]
    #     load_result.append(mydict)
    # print(load_result)
