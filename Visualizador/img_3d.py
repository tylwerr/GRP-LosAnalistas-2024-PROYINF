import os
import numpy as np
import pydicom
from mayavi import mlab
from tkinter import *

def cargar_3d(dir_path):
    lista_archivos = [os.path.join(dir_path, nombre_archivo) for nombre_archivo in os.listdir(dir_path) if nombre_archivo.endswith('.dcm')]
    imagen_stack = []

    for path_archivo in lista_archivos:
        dicom_data = pydicom.dcmread(path_archivo)
        imagen_array = dicom_data.pixel_array.astype(np.float32)
        imagen_stack.append(imagen_array)

    imagen_stack = np.array(imagen_stack)
    return imagen_stack
'''
def abrir_img_3d(dir_path):
    imagen_stack = get_3d_matrix(dir_path)
    imagen_escalada_stack = imagen_stack / np.max(imagen_stack)
    return imagen_escalada_stack
'''
    
def abrir_img_3d(image_stack):
    mlab.figure() 
    volumen = mlab.pipeline.volume(mlab.pipeline.scalar_field(image_stack), vmin=0.0, vmax=1.0) #Los parametros dan el color
    mlab.show()

def vistas_corte(image_stack, tipo_vista):
    #vista axial
    if tipo_vista == 1:
        slice_index = image_stack.shape[0] // 2
        vista = image_stack[slice_index, :, :]

    #vista coronal
    elif tipo_vista == 2:
        slice_index = image_stack.shape[1] // 2
        vista = image_stack[:, slice_index, :]

    #vista sagital
    else:
        slice_index = image_stack.shape[2] // 2
        vista = image_stack[:, :, slice_index]
    
    vista_normalizada = vista.astype(np.float32) / np.max(vista)
    
    return vista_normalizada

if __name__ == "__main__":
    directorio = r"..\GRP-LosAnalistas-2024-PROYINF\DATOS_DICOM\BSSFP"
    abrir_img_3d(directorio)
