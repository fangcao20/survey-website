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
    sql = "INSERT INTO detai(user_id, ten_de_tai, nguoi_thuc_hien, ngay_thuc_hien, mo_ta) VALUES (%s, %s, %s, %s, %s)"
    mycursor.execute(sql, values)
    print("Done")

# mycursor.execute("SELECT * FROM detai")
# result = mycursor.fetchall()
# print(result)