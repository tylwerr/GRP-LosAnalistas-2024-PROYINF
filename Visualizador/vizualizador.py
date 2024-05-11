from tkinter import *
from tkinter import ttk
from tkinter import filedialog
import pydicom
from PIL import Image, ImageTk

def open_file():
    global image 
    file_path = filedialog.askopenfilename(title="Seleccionar archivo DICOM", filetypes=[("Archivos DICOM", "*.dcm")])
    if file_path:
        dicom_data = pydicom.dcmread(file_path)
        image_array = dicom_data.pixel_array
        image = Image.fromarray(image_array)
        image = image.convert('L')
        image = image.resize((600,700), Image.BICUBIC) 
        update_image()

def update_image():
    global image_tk, label_image, image
    image_tk = ImageTk.PhotoImage(image)
    label_image.configure(image=image_tk)
    label_image.image = image_tk 
    imagen_centro()

def zoom_in():
    global image
    width, height = image.size
    image = image.resize((int(width*1.1), int(height*1.1)), Image.BICUBIC)
    update_image()

def zoom_out():
    global image
    width, height = image.size
    image = image.resize((int(width*0.9), int(height*0.9)), Image.BICUBIC)
    update_image()

def colocar_botones():
    button_width = zoom_in_button.winfo_reqwidth()  
    button_height = zoom_in_button.winfo_reqheight() 
    x_position = app.winfo_width() - 2 * button_width  
    y_position = app.winfo_height() - button_height  
    zoom_in_button.place(x=x_position, y=y_position)
    zoom_out_button.place(x=x_position + button_width, y=y_position)

def imagen_centro():
    window_width = app.winfo_width()
    window_height = app.winfo_height()
    image_width = label_image.winfo_width()
    image_height = label_image.winfo_height()
    x = (window_width - image_width) // 2
    y = (window_height - image_height) // 2
    label_image.place(x=x, y=y)

def menubar_shortcut(event=None):
    menubar = Menu()
    filemenu = Menu(menubar, tearoff=False)
    viewmenu = Menu(menubar, tearoff=False)
    open_recent = Menu(viewmenu)
    #menu de archivo
    menubar.add_cascade(label='Archivo', menu=filemenu)
    filemenu.add_command(label="Nuevo...")
    filemenu.add_command(label="Abrir...", command=open_file)
    filemenu.add_command(label="Salir", command=cerrar)
    #menu de las vistas
    menubar.add_cascade(label="Vistas", menu=viewmenu)
    viewmenu.add_cascade(label="Cant vistas...", menu=open_recent)
    open_recent.add_command(label="1")
    open_recent.add_command(label="2")
    open_recent.add_command(label="3")
    viewmenu.add_separator()
    viewmenu.add_command(label="Vista axial")
    viewmenu.add_command(label="Vista coronal")
    viewmenu.add_command(label="Vista sagital")
    
    app.config(menu=menubar)

def pantalla_completa():
    app.attributes('-fullscreen', True)

def cerrar():
    app.destroy()

app = Tk()
app.title("VISUALIZADOR USM")
fondo = PhotoImage(file=".\\Visualizador\\IMG\\foto_fondo.png")
label_fondo = Label(app, image=fondo)
label_fondo.place(x=0, y=0, relwidth=1, relheight=1)
app.iconbitmap(".\\Visualizador\\IMG\\Foto_Logo.ico")
menubar_shortcut()
label_image = Label(app)
label_image.pack()
app.geometry("800x600+560+240")
pantalla_completa()
app.bind("<Configure>", lambda e: imagen_centro())
zoom_in_imagen = PhotoImage(file=".\\Visualizador\\IMG\\acercarse.png")
zoom_out_imagen = PhotoImage(file=".\\Visualizador\\IMG\\alejarse.png")
zoom_in_button = ttk.Button(app, image=zoom_in_imagen, command=zoom_in)
zoom_out_button = ttk.Button(app, image=zoom_out_imagen, command=zoom_out)
app.after(100, colocar_botones)
app.mainloop()
