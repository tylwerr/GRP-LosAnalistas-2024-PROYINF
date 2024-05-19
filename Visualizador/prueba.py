from tkinter import *
from tkinter import ttk
from tkinter import filedialog
import pydicom
from PIL import Image, ImageTk

def open_file():
    global image, canvas_image
    file_path = filedialog.askopenfilename(title="Seleccionar archivo DICOM", filetypes=[("Archivos DICOM", "*.dcm")])
    if file_path:
        dicom_data = pydicom.dcmread(file_path)
        image_array = dicom_data.pixel_array
        image = Image.fromarray(image_array)
        image = image.convert('L')
        image = image.resize((600, 700), Image.BICUBIC)
        update_image()

def update_image():
    global image_tk, canvas_image, image, canvas
    image_tk = ImageTk.PhotoImage(image)
    canvas.delete(canvas_image)
    canvas_image = canvas.create_image(0, 0, anchor=NW, image=image_tk)
    canvas.config(scrollregion=canvas.bbox(ALL))

def zoom_in():
    global image
    width, height = image.size
    image = image.resize((int(width * 1.1), int(height * 1.1)), Image.BICUBIC)
    update_image()

def zoom_out():
    global image
    width, height = image.size
    image = image.resize((int(width * 0.9), int(height * 0.9)), Image.BICUBIC)
    update_image()

def colocar_botones():
    button_height = zoom_in_button.winfo_reqheight()
    y_position = app.winfo_height() - button_height
    zoom_out_button.place(x=0, y=y_position)
    y_position -= button_height
    zoom_in_button.place(x=0, y=y_position)

def menubar_shortcut(event=None):
    menubar = Menu()
    filemenu = Menu(menubar, tearoff=False)
    viewmenu = Menu(menubar, tearoff=False)
    open_recent = Menu(viewmenu)
    # menú de archivo
    menubar.add_cascade(label='Archivo', menu=filemenu)
    filemenu.add_command(label="Nuevo...")
    filemenu.add_command(label="Abrir...", command=open_file)
    filemenu.add_command(label="Salir", command=cerrar)
    # menú de las vistas
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
    screen_width = app.winfo_screenwidth()
    screen_height = app.winfo_screenheight()
    app.geometry(f"{screen_width}x{screen_height}+0+0")

def cerrar():
    app.destroy()

app = Tk()
app.title("VISUALIZADOR USM")
app.geometry("800x600+560+240")
pantalla_completa()

# Configuración del canvas y barras de desplazamiento
frame = Frame(app)
frame.pack(fill=BOTH, expand=1)

canvas = Canvas(frame)
canvas.pack(side=LEFT, fill=BOTH, expand=1)

# Fondo de la ventana en el canvas
fondo = PhotoImage(file=".\\Visualizador\\IMG\\foto_fondo.png")
canvas.create_image(0, 0, anchor=NW, image=fondo)
canvas.image = fondo

scroll_x = Scrollbar(frame, orient=HORIZONTAL, command=canvas.xview)
scroll_x.pack(side=BOTTOM, fill=X)

scroll_y = Scrollbar(frame, orient=VERTICAL, command=canvas.yview)
scroll_y.pack(side=RIGHT, fill=Y)

canvas.configure(xscrollcommand=scroll_x.set, yscrollcommand=scroll_y.set)
canvas.bind('<Configure>', lambda e: canvas.config(scrollregion=canvas.bbox(ALL)))

menubar_shortcut()

zoom_in_imagen = PhotoImage(file=".\\Visualizador\\IMG\\acercarse.png")
zoom_out_imagen = PhotoImage(file=".\\Visualizador\\IMG\\alejarse.png")
zoom_in_button = ttk.Button(app, image=zoom_in_imagen, command=zoom_in)
zoom_out_button = ttk.Button(app, image=zoom_out_imagen, command=zoom_out)

app.after(100, colocar_botones)
app.mainloop()
