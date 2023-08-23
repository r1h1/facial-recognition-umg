import mysql.connector as db
import json

with open('keys.json') as json_file:
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

def registerUser(photo, name):
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
