import mysql.connector as db
import json
import datetime

current_date = datetime.datetime.now().date()
formatted_date = current_date.strftime("%Y-%m-%d")

with open('C:/xampp/htdocs/pablo/facial_recognition/keys.json') as json_file:
    keys = json.load(json_file)

def convertToBinaryData(filename):
    # Convert digital data to binary format
    try:
        with open(filename, 'rb') as file:
            binaryData = file.read()
        return binaryData
    except:
        return 0

def write_file(data, path):
    # Convert binary data to proper format and write it on your computer
    with open(path, 'wb') as file:
        file.write(data)

def updateUser(photo, name):
    updated_rows = 0

    try:
        con = db.connect(host=keys["host"], user=keys["user"], password=keys["password"], database=keys["database"])
        cursor = con.cursor()

        # Assuming you have a `user` table with columns `id`, `name`, and `photo`
        sql = "UPDATE `users` SET `photo` = %s WHERE `cui` = %s"
        pic = convertToBinaryData(photo)

        if pic:
            cursor.execute(sql, (pic, name))
            con.commit()
            updated_rows = cursor.rowcount
    except db.Error as e:
        print(f"Failed inserting image: {e}")
    finally:
        if con.is_connected():
            cursor.close()
            con.close()

    return {"updated_rows": updated_rows}


def insertEntry(id):
    id2 = 0
    inserted = 0
    noData = ''
    date = formatted_date

    try:
        con = db.connect(host=keys["host"], user=keys["user"], password=keys["password"], database=keys["database"]) 
        cursor = con.cursor()
        sql = "INSERT INTO `entrys_and_exits`(`id`,`iduserentryandexit`, `dateandhourentry`, `dateandhourexit`, `typeuser`) VALUES (%s, %s, %s, %s, %s)"

        if id:
            cursor.execute(sql,(noData,id,date,noData,1))
            con.commit()
            inserted = cursor.rowcount
            id2 = cursor.lastrowid
    except db.Error as e:
        print(f"Failed inserting data: {e}")
    finally:
        if con.is_connected():
            cursor.close()
            con.close()
    return {"id": id2, "affected": inserted}


def insertExit(id):
    id3 = 0
    inserted = 0
    date = formatted_date

    try:
        con = db.connect(host=keys["host"], user=keys["user"], password=keys["password"], database=keys["database"]) 
        cursor = con.cursor()
        sql = "UPDATE `entrys_and_exits` SET `dateandhourexit`= %s WHERE `id`= %s AND `typeuser` = 1 AND `datehourentry` = %s"

        cursor.execute(sql,(date,id,date))
        con.commit()
        inserted = cursor.rowcount
        id3 = cursor.lastrowid

    except db.Error as e:
        print(f"Failed inserting data: {e}")
    finally:
        if con.is_connected():
            cursor.close()
            con.close()
    return {"id": id3, "affected": inserted}


def getUser(name, path):
    id = 0
    rows = 0

    try:
        con = db.connect(host=keys["host"], user=keys["user"], password=keys["password"], database=keys["database"])
        cursor = con.cursor()
        sql = "SELECT * FROM `users` WHERE `cui` = %s"

        cursor.execute(sql, (name,))
        records = cursor.fetchall()

        for row in records:
            id = row[0]
            write_file(row[10], path)
        rows = len(records)
    except db.Error as e:
        print(f"Failed to read image: {e}")
    finally:
        if con.is_connected():
            cursor.close()
            con.close()
    return {"id": id, "affected": rows}
