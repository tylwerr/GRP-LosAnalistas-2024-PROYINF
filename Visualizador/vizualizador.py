from tkinter import *
from tkinter import ttk
from tkinter import filedialog
import pydicom
from PIL import Image, ImageTk

def open_file():
    file_path = filedialog.askopenfilename(title="Seleccionar archivo DICOM", filetypes=[("Archivos DICOM", "*.dcm")])
    if file_path:
        dicom_data = pydicom.dcmread(file_path)
        image_array = dicom_data.pixel_array
        image = Image.fromarray(image_array)
        image_tk = ImageTk.PhotoImage(image)
        label_image.configure(image=image_tk)
        label_image.image = image_tk 

def menubar_shortcut(event=None):
    menubar = Menu()
    filemenu = Menu(menubar, tearoff=False)
    viewmenu = Menu(menubar, tearoff=False)
    open_recent = Menu(viewmenu)
    #menu de archivo
    menubar.add_cascade(label='Archivo', menu=filemenu)
    filemenu.add_command(label="Nuevo...")
    filemenu.add_command(label="Abrir...", command=open_file)
    filemenu.add_command(label="Salir")
    
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

app = Tk()
app.title("VISUALIZADOR USM")
fondo = PhotoImage(file="C:\\Users\\carlo\\OneDrive\\Escritorio\\usm\\1er semestre 2024\\Analisis\\proyecto\\GRP-LosAnalistas-2024-PROYINF\\Visualizador\\IMG\\foto_fondo.png")
label_fondo = Label(app, image=fondo)
label_fondo.place(x=0, y=0, relwidth=1, relheight=1)
app.iconbitmap("C:\\Users\\carlo\\OneDrive\\Escritorio\\usm\\1er semestre 2024\\Analisis\\proyecto\\GRP-LosAnalistas-2024-PROYINF\\Visualizador\\IMG\\Foto_Logo.ico")
menubar_shortcut()
label_image = Label(app)
label_image.pack()
app.geometry("800x600+560+240")
app.mainloop()
