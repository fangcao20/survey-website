import mysql.connector
import random

mydb = mysql.connector.connect(user='root', password='Phiphi05',
                               host='localhost',
                               database='webkhaosat')

mycursor = mydb.cursor()

mycursor.execute("SELECT * FROM detai")

myresult = mycursor.fetchall()
cautraloi_data = []
khaosat_data = []
phieukhaosat_id = 0
cautraloi_id = 0
nguoikhaosat = [None, "Nguyen Minh A", "Nguyen Minh B", "Nguyen Minh C"]

for detai in myresult:
    detai_id = detai[0]

    mycursor.execute("SELECT * FROM cauhoi WHERE detai_id = %s", (detai_id,))
    listcauhoi = mycursor.fetchall()

    for i in range(1, random.randint(2, 4) + 1):
        nguoi_khao_sat = random.choice(nguoikhaosat)
        phieukhaosat_id += 1
        khaosat_data.append((phieukhaosat_id, detai_id, nguoi_khao_sat))

        for cauhoi in listcauhoi:
            cautraloi_id += 1
            cauhoi_id = cauhoi[0]
            loai_cau_tra_loi_id = cauhoi[2]
            luachon_id = None
            diem_likert = None
            if loai_cau_tra_loi_id == 1:  # Trắc nghiệm
                sql = "SELECT * FROM luachon WHERE cauhoi_id = %s"
                params = (cauhoi_id,)

                mycursor.execute(sql, params)
                result = mycursor.fetchall()
                luachon_id = random.randint(1, len(result))
            else:
                diem_likert = random.randint(1, 5)
            cautraloi_data.append((cautraloi_id, phieukhaosat_id, cauhoi_id, luachon_id, diem_likert))

sql = "INSERT INTO phieukhaosat(phieukhaosat_id, detai_id, nguoi_khao_sat) VALUES (%s, %s, %s)"
mycursor.executemany(sql, khaosat_data)

sql = "INSERT INTO cautraloi(cautraloi_id, phieukhaosat_id, cauhoi_id, luachon_id, diem_likert) VALUES (%s ,%s ,%s ,%s ,%s)"
mycursor.executemany(sql, cautraloi_data)

mydb.commit()
print("done hihi")