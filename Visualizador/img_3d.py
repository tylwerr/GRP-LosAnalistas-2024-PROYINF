import os
import numpy as np
import pydicom
from mayavi import mlab

def abrir_img_3d(dir_path):
    lista_archivos = [os.path.join(dir_path, nombre_archivo) for nombre_archivo in os.listdir(dir_path) if nombre_archivo.endswith('.dcm')]
    imagen_stack = []
    for path_archivo in lista_archivos:
        dicom_data = pydicom.dcmread(path_archivo)
        imagen_array = dicom_data.pixel_array.astype(np.float32)
        imagen_stack.append(imagen_array)
    imagen_stack = np.array(imagen_stack)
    imagen_escalada_stack = imagen_stack / np.max(imagen_stack)
    mlab.figure() 
    volumen = mlab.pipeline.volume(mlab.pipeline.scalar_field(imagen_escalada_stack), vmin=0.0, vmax=1.0) #Los parametros dan el color
    #mlab.colorbar() 
    mlab.show()


if __name__ == "__main__":
    directorio = r"..\GRP-LosAnalistas-2024-PROYINF\DATOS_DICOM\BSSFP"
    abrir_img_3d(directorio)
