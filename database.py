import mysql.connector as connector

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

mydb.commit()

# Đóng kết nối
