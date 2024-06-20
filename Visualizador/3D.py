import os
import numpy as np
import pydicom
from mayavi import mlab

#Carpeta donde estan las imagenes dicom
directorio = r".\GRP-LosAnalistas-2024-PROYINF\DATOS_DICOM\BSSFP"

#Lista de los archivos dicom de la carpeta
lista_archivos = [os.path.join(directorio, nombre_archivo) for nombre_archivo in os.listdir(directorio) if nombre_archivo.endswith('.dcm')]

#Lee todas las imagenes dicom y se colocan en una matriz tridimensional
imagen_stack = []
for path_archivo in lista_archivos:
    dicom_data = pydicom.dcmread(path_archivo)
    imagen_array = dicom_data.pixel_array.astype(np.float32)
    imagen_stack.append(imagen_array)

#Se convierten las imagenes en una matriz tridimensional
imagen_stack = np.array(imagen_stack)

#Se escalan los pixeles al rango [0, 1]
imagen_escalada_stack = imagen_stack / np.max(imagen_stack)

#Se visualiza en Mayavi
mlab.figure() #Abre Mayavi
volumen = mlab.pipeline.volume(mlab.pipeline.scalar_field(imagen_escalada_stack), vmin=0.0, vmax=1.0) #Los parametros dan el color
mlab.colorbar() #Opcional, sirve para saber el rango de valores de los colores
mlab.show()
