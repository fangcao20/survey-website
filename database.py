import mysql.connector as connector
import random

mydb = connector.connect(user='root', password='Phiphi05',
                         host='localhost',
                         database='webkhaosat')
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
        sql = "INSERT INTO detai(user_id, ten_de_tai, nguoi_thuc_hien, ngay_thuc_hien, mo_ta) VALUES (%s, %s, %s, %s, %s)"
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


def delete_detai(detai):
    values = (1, detai['detai_id'])
    sql = """
            DELETE FROM detai
            WHERE user_id = %s AND
                  detai_id = %s;
        """
    mycursor.execute(sql, values)
    print("Delete")


def load_cauhoi(detai_id):
    mycursor.execute("SELECT * FROM cauhoi WHERE detai_id = %s", (detai_id, ))
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


def load_nhomcauhoi(detai_id):
    mycursor.execute("SELECT * FROM nhom_cauhoi WHERE detai_id = %s", (detai_id, ))
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

def delete_nhom_cauhoi(nhomcauhoi):
    values = (nhomcauhoi['nhom_cauhoi_id'],)
    sql = """
            DELETE FROM nhom_cauhoi
            WHERE nhom_cauhoi_id = %s;
        """
    mycursor.execute(sql, values)
    print("Delete")