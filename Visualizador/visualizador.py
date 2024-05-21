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
        image = image.resize((600, 700), Image.BICUBIC) 
        update_image()

def update_image():
    global image_tk, label_image, image
    image_tk = ImageTk.PhotoImage(image)
    label_image.configure(image=image_tk)
    label_image.image = image_tk 
    center_image()

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

def place_buttons():
    button_height = zoom_in_button.winfo_reqheight()  
    y_position = app.winfo_height() - button_height - 80
    zoom_out_button.place(x=10, y=y_position) 
    y_position -= button_height + 10 
    zoom_in_button.place(x=10, y=y_position)

def center_image(event=None):
    canvas.config(scrollregion=canvas.bbox(ALL))
    window_width = canvas.winfo_width()
    window_height = canvas.winfo_height()
    image_width = label_image.winfo_width()
    image_height = label_image.winfo_height()
    x = (window_width - image_width) // 2
    y = (window_height - image_height) // 2
    canvas.coords(image_window, x, y)

def menubar_shortcut(event=None):
    menubar = Menu()
    filemenu = Menu(menubar, tearoff=False)
    viewmenu = Menu(menubar, tearoff=False)
    open_recent = Menu(viewmenu)
    #menu de archivo
    menubar.add_cascade(label='Archivo', menu=filemenu)
    filemenu.add_command(label="Nuevo...")
    filemenu.add_command(label="Abrir...", command=open_file)
    filemenu.add_command(label="Salir", command=close)
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

def adjust_screen_size():
    screen_width = app.winfo_screenwidth()
    screen_height = app.winfo_screenheight()
    app.geometry(f"{screen_width}x{screen_height}+0+0")

def close():
    app.destroy()

app = Tk()
app.title("VISUALIZADOR USM")
app.iconbitmap(".\\Visualizador\\IMG\\Foto_Logo.ico")
menubar_shortcut()
frame = Frame(app)
frame.pack(fill=BOTH, expand=YES)
canvas = Canvas(frame, bg="white")
canvas.pack(side=LEFT, fill=BOTH, expand=YES)
scrollbar_v = Scrollbar(frame, orient=VERTICAL, command=canvas.yview)
scrollbar_v.pack(side=RIGHT, fill=Y)
scrollbar_h = Scrollbar(app, orient=HORIZONTAL, command=canvas.xview)
scrollbar_h.pack(side=BOTTOM, fill=X)
canvas.config(yscrollcommand=scrollbar_v.set, xscrollcommand=scrollbar_h.set)
label_image = Label(canvas)
image_window = canvas.create_window(0, 0, anchor=NW, window=label_image)
zoom_in_image = PhotoImage(file=".\\Visualizador\\IMG\\acercarse.png")
zoom_out_image = PhotoImage(file=".\\Visualizador\\IMG\\alejarse.png")
zoom_in_button = ttk.Button(app, image=zoom_in_image, command=zoom_in)
zoom_out_button = ttk.Button(app, image=zoom_out_image, command=zoom_out)
app.after(100, place_buttons)
adjust_screen_size()
app.bind("<Configure>", center_image)
canvas.bind("<Configure>", center_image)
app.mainloop()
