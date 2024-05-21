from tkinter import *
from tkinter import ttk
from tkinter import filedialog
import pydicom
from PIL import Image, ImageTk

vistas = 1
canvases = []
labels = []
image_tk_list = []
images = []

def open_file():
    global images
    file_path = filedialog.askopenfilename(title="Seleccionar archivo DICOM", filetypes=[("Archivos DICOM", "*.dcm")])
    if file_path:
        dicom_data = pydicom.dcmread(file_path)
        image_array = dicom_data.pixel_array
        image = Image.fromarray(image_array)
        image = image.convert('L')
        image = image.resize((600, 700), Image.BICUBIC)
        images = [image] * vistas
        update_images()

def update_images():
    global image_tk_list, labels, images
    image_tk_list = []
    for i in range(vistas):
        image_tk = ImageTk.PhotoImage(images[i])
        image_tk_list.append(image_tk)
        labels[i].configure(image=image_tk)
        labels[i].image = image_tk

def zoom_in(view_index):
    global images
    width, height = images[view_index].size
    images[view_index] = images[view_index].resize((int(width * 1.1), int(height * 1.1)), Image.BICUBIC)
    update_images()

def zoom_out(view_index):
    global images
    width, height = images[view_index].size
    images[view_index] = images[view_index].resize((int(width * 0.9), int(height * 0.9)), Image.BICUBIC)
    update_images()

def center_images(event=None):
    for i in range(vistas):
        canvases[i].config(scrollregion=canvases[i].bbox(ALL))
        window_width = canvases[i].winfo_width()
        window_height = canvases[i].winfo_height()
        image_width = labels[i].winfo_width()
        image_height = labels[i].winfo_height()
        x = (window_width - image_width) // 2
        y = (window_height - image_height) // 2
        canvases[i].coords(image_windows[i], x, y)

def create_views(n):
    global vistas, canvases, labels, image_windows, scrollbars_v, scrollbars_h
    vistas = n
    for canvas in canvases:
        canvas.destroy()
    for label in labels:
        label.destroy()

    canvases = []
    labels = []
    image_windows = []

    for scrollbar in scrollbars_v:
        scrollbar.destroy()
    for scrollbar in scrollbars_h:
        scrollbar.destroy()
    scrollbars_v = []
    scrollbars_h = []

    for i in range(vistas):
        canvas = Canvas(frame, bg="white", yscrollincrement=1, xscrollincrement=1)
        canvas.pack(side=LEFT, fill=BOTH, expand=YES)
        canvases.append(canvas)
        label = Label(canvas)
        labels.append(label)
        image_window = canvas.create_window(0, 0, anchor=NW, window=label)
        image_windows.append(image_window)
        scrollbar_v = Scrollbar(canvas, orient=VERTICAL)
        scrollbar_h = Scrollbar(canvas, orient=HORIZONTAL)
        scrollbar_v.pack(side=RIGHT, fill=Y)
        scrollbar_h.pack(side=BOTTOM, fill=X)
        scrollbars_v.append(scrollbar_v)
        scrollbars_h.append(scrollbar_h)
        canvas.config(yscrollcommand=scrollbars_v[i].set, xscrollcommand=scrollbars_h[i].set)
        scrollbars_v[i].config(command=canvas.yview)
        scrollbars_h[i].config(command=canvas.xview)
        zoom_in_button = ttk.Button(canvas, image=zoom_in_image, command=lambda i=i: zoom_in(i))
        zoom_out_button = ttk.Button(canvas, image=zoom_out_image, command=lambda i=i: zoom_out(i))
        zoom_in_button.pack(side=TOP, anchor=NW)
        zoom_out_button.pack(side=TOP, anchor=NW)

    frame.update_idletasks()
    center_images()


def menubar_shortcut(event=None):
    menubar = Menu()
    filemenu = Menu(menubar, tearoff=False)
    viewmenu = Menu(menubar, tearoff=False)
    open_recent = Menu(viewmenu)
    # Menu de archivo
    menubar.add_cascade(label='Archivo', menu=filemenu)
    filemenu.add_command(label="Nuevo...")
    filemenu.add_command(label="Abrir...", command=open_file)
    filemenu.add_command(label="Salir", command=close)
    # Menu de las vistas
    menubar.add_cascade(label="Vistas", menu=viewmenu)
    viewmenu.add_cascade(label="Cant vistas...", menu=open_recent)
    open_recent.add_command(label="1", command=lambda: create_views(1))
    open_recent.add_command(label="2", command=lambda: create_views(2))
    open_recent.add_command(label="3", command=lambda: create_views(3))
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
scrollbars_v = []
scrollbars_h = []
scrollbar_v = Scrollbar(frame, orient=VERTICAL)
scrollbar_v.pack(side=RIGHT, fill=Y)
scrollbar_h = Scrollbar(app, orient=HORIZONTAL)
scrollbar_h.pack(side=BOTTOM, fill=X)
scrollbars_v.append(scrollbar_v)
scrollbars_h.append(scrollbar_h)
zoom_in_image = PhotoImage(file=".\\Visualizador\\IMG\\acercarse.png")
zoom_out_image = PhotoImage(file=".\\Visualizador\\IMG\\alejarse.png")
adjust_screen_size()
app.bind("<Configure>", center_images)
create_views(1)
app.mainloop()
