from tkinter import *
from tkinter import messagebox as msg
import os
import cv2
from matplotlib import pyplot as plt
from mtcnn.mtcnn import MTCNN
import database as db

# CONFIG
path = "C:/xampp/htdocs/pablo/facial_recognition/" # your path
txt_login = "Registrar Ingreso"
txt_exit = "Registrar Salida"
txt_register = "Agregar Fotografía Usuario"

color_white = "#f4f5f4"
color_black = "#101010"

color_black_btn = "#202020"
color_background = "#151515"

font_label = "Century Gothic"
size_screen = "600x400"

# colors
color_success = "\033[1;32;40m"
color_error = "\033[1;31;40m"
color_normal = "\033[0;37;40m"

res_bd = {"id": 0, "affected": 0} # database variable

# GENERAL
def getEnter(screen):
    ''' Set an enter inside the screen '''
    Label(screen, text="", bg=color_background).pack()

def printAndShow(screen, text, flag):
    ''' Prints and shows text '''
    if flag:
        print(color_success + text + color_normal)
        screen.destroy()
        msg.showinfo(message=text, title="¡Éxito!")
    else:
        print(color_error + text + color_normal)
        Label(screen, text=text, fg="red", bg=color_background, font=(font_label, 12)).pack()

def configure_screen(screen, text):
    ''' Configure global styles '''
    screen.title(text)
    screen.geometry(size_screen)
    screen.configure(bg=color_background)
    Label(screen, text=f"¡{text}!", fg=color_white, bg=color_black, font=(font_label, 18), width="500", height="2").pack()

def credentials(screen, var, flag):
    ''' Configuration of user input '''
    Label(screen, text="CUI:", fg=color_white, bg=color_background, font=(font_label, 12)).pack()
    entry = Entry(screen, textvariable=var, justify=CENTER, font=(font_label, 12))
    entry.focus_force()
    entry.pack(side=TOP, ipadx=30, ipady=6)

    getEnter(screen)
    if flag == 1:
        Button(screen, text="Capturar rostro", fg=color_white, bg=color_black_btn, activebackground=color_background, borderwidth=0, font=(font_label, 14), height="2", width="40", command=login_capture).pack()
    if flag == 2:
        Button(screen, text="Capturar rostro", fg=color_white, bg=color_black_btn, activebackground=color_background, borderwidth=0, font=(font_label, 14), height="2", width="40", command=exit_capture).pack()
    if flag == 0:
        Button(screen, text="Capturar rostro", fg=color_white, bg=color_black_btn, activebackground=color_background, borderwidth=0, font=(font_label, 14), height="2", width="40", command=register_capture).pack()
    return entry

def face(img, faces):
    data = plt.imread(img)
    for i in range(len(faces)):
        x1, y1, ancho, alto = faces[i]["box"]
        x2, y2 = x1 + ancho, y1 + alto
        plt.subplot(1,len(faces), i + 1)
        plt.axis("off")
        face = cv2.resize(data[y1:y2, x1:x2],(150,200), interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(img, face)
        plt.imshow(data[y1:y2, x1:x2])

# REGISTER #
def register_face_db(img):
    name_user = img.replace(".jpg","").replace(".png","")
    res_bd = db.updateUser(path + img, name_user)

    getEnter(screen1)
    if res_bd["updated_rows"]:
        printAndShow(screen1, "¡Éxito! Se ha registrado correctamente", 1)
    else:
        printAndShow(screen1, "¡Error! No se ha registrado correctamente", 0)
    os.remove(img)

def register_capture():
    cap = cv2.VideoCapture(0)
    user_reg_img = user1.get()
    img = f"{user_reg_img}.jpg"

    while True:
        ret, frame = cap.read()
        cv2.imshow("Registro Facial", frame)
        if cv2.waitKey(1) == 27:
            break
    
    cv2.imwrite(img, frame)
    cap.release()
    cv2.destroyAllWindows()

    user_entry1.delete(0, END)
    
    pixels = plt.imread(img)
    faces = MTCNN().detect_faces(pixels)
    face(img, faces)
    register_face_db(img)

def register():
    global user1
    global user_entry1
    global screen1

    screen1 = Toplevel(root)
    user1 = StringVar()

    configure_screen(screen1, txt_register)
    user_entry1 = credentials(screen1, user1, 0)

# LOGIN #
def compatibility(img1, img2):
    orb = cv2.ORB_create()

    kpa, dac1 = orb.detectAndCompute(img1, None)
    kpa, dac2 = orb.detectAndCompute(img2, None)

    comp = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    matches = comp.match(dac1, dac2)

    similar = [x for x in matches if x.distance < 70]
    if len(matches) == 0:
        return 0
    return len(similar)/len(matches)

def login_capture():
    cap = cv2.VideoCapture(0)
    user_login = user2.get()
    img = f"{user_login}_login.jpg"
    img_user = f"{user_login}.jpg"

    while True:
        ret, frame = cap.read()
        cv2.imshow("Login Facial", frame)
        if cv2.waitKey(1) == 27:
            break
    
    cv2.imwrite(img, frame)
    cap.release()
    cv2.destroyAllWindows()

    user_entry2.delete(0, END)
    
    pixels = plt.imread(img)
    faces = MTCNN().detect_faces(pixels)

    face(img, faces)
    getEnter(screen2)

    res_db = db.getUser(user_login, path + img_user)
    if(res_db["affected"]):
        my_files = os.listdir()
        if img_user in my_files:
            face_reg = cv2.imread(img_user, 0)
            face_log = cv2.imread(img, 0)

            comp = compatibility(face_reg, face_log)
            
            if comp >= 0.50:
                print("{}Compatibilidad del {:.1%}{}".format(color_success, float(comp), color_normal))
                printAndShow(screen2, f"Permiso concedido, {user_login}", 1)
                db.insertEntry(res_db["id"])                    
            else:
                print("{}Compatibilidad del {:.1%}{}".format(color_error, float(comp), color_normal))
                printAndShow(screen2, "El usuario no puede acceder", 0)
            os.remove(img_user)
    
        else:
            printAndShow(screen2, "El usuario no fue encontrado", 0)
    else:
        printAndShow(screen2, "Usuario no encontrado", 0)
    os.remove(img)


def exit_capture():
    cap = cv2.VideoCapture(0)
    user_login = user3.get()
    img = f"{user_login}_login.jpg"
    img_user = f"{user_login}.jpg"

    while True:
        ret, frame = cap.read()
        cv2.imshow("Login Facial", frame)
        if cv2.waitKey(1) == 27:
            break
    
    cv2.imwrite(img, frame)
    cap.release()
    cv2.destroyAllWindows()

    user_exit.delete(0, END)
    
    pixels = plt.imread(img)
    faces = MTCNN().detect_faces(pixels)

    face(img, faces)
    getEnter(screen3)

    res_db = db.getUser(user_login, path + img_user)
    if(res_db["affected"]):
        my_files = os.listdir()
        if img_user in my_files:
            face_reg = cv2.imread(img_user, 0)
            face_log = cv2.imread(img, 0)

            comp = compatibility(face_reg, face_log)
            
            if comp >= 0.50:
                print("{}Compatibilidad del {:.1%}{}".format(color_success, float(comp), color_normal))
                printAndShow(screen3, f"Permiso concedido, {user_login}", 1)
                db.insertExit(res_db["id"])                    
            else:
                print("{}Compatibilidad del {:.1%}{}".format(color_error, float(comp), color_normal))
                printAndShow(screen3, "El usuario no puede acceder", 0)
            os.remove(img_user)
    
        else:
            printAndShow(screen3, "El usuario no fue encontrado", 0)
    else:
        printAndShow(screen3, "Usuario no encontrado", 0)
    os.remove(img)


def login():
    global screen2
    global user2
    global user_entry2

    screen2 = Toplevel(root)
    user2 = StringVar()

    configure_screen(screen2, txt_login)
    user_entry2 = credentials(screen2, user2, 1)

def exit():
    global screen3
    global user3
    global user_exit

    screen3 = Toplevel(root)
    user3 = StringVar()

    configure_screen(screen3, txt_exit)
    user_exit = credentials(screen3, user3, 2)

root = Tk()
root.geometry(size_screen)
root.title("AVM")
root.configure(bg=color_background)
Label(text="Reconocimiento Facial, Valles SMP", fg=color_white, bg=color_black, font=(font_label, 18), width="500", height="2").pack()

getEnter(root)
Button(text=txt_login, fg=color_white, bg=color_black_btn, activebackground=color_background, borderwidth=0, font=(font_label, 14), height="2", width="40", command=login).pack()

getEnter(root)
Button(text=txt_exit, fg=color_white, bg=color_black_btn, activebackground=color_background, borderwidth=0, font=(font_label, 14), height="2", width="40", command=exit).pack()

getEnter(root)
Button(text=txt_register, fg=color_white, bg=color_black_btn, activebackground=color_background, borderwidth=0, font=(font_label, 14), height="2", width="40", command=register).pack()

root.mainloop()