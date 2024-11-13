import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename  # manejar archivos subidos
from flask_cors import CORS
import pydicom

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'dcm'}  # solo se permite dicom

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)

# verifica que el archivo sea de extensión dicom
def archivo_permitido(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def redireccion_inicio():
    return redirect(url_for('index'))

@app.route('/Multiplanar Reformation')
def index():
    return render_template('Index.html')

@app.route('/navbar')
def navbar():
    return render_template('Navbar.html')

@app.route('/Ayuda')
def seccion_ayuda():
    return render_template('SeccionAyuda.html')

@app.route('/Visualizador', methods=['POST', 'GET'])
def visualizador():
    user_agent = request.headers.get('User-Agent')

    if request.method == 'POST':
        if 'files' not in request.files:
            if 'unittest-script' in user_agent:
                return 'No se mandó un archivo', 400
            return render_template('Visualizador.html', mensaje='falla1')

        files = request.files.getlist('files')  # Obtener todos los archivos

        if not files:
            if 'unittest-script' in user_agent:
                return 'Se mandó un archivo vacío', 400
            return render_template('Visualizador.html', mensaje='falla2')

        dicom_info_list = []
        dicom_urls = []
        fileNames = []
        errors = []

        for file in files:
            if file.filename == '':
                errors.append('Archivo vacío detectado')
                continue

            if file and archivo_permitido(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)

                try:
                    ds = pydicom.dcmread(filepath)

                    dicom_info = {
                        "PatientName": str(ds.PatientName),
                        "PatientID": str(ds.PatientID),
                        "StudyDate": str(ds.StudyDate),
                        "Modality": str(ds.Modality),
                        "InstitutionName": str(ds.get("InstitutionName", "N/A")),
                        "BodyPartExamined": str(ds.get("BodyPartExamined", "N/A"))
                    }

                    year = dicom_info['StudyDate'][:4]
                    month = dicom_info['StudyDate'][4:6]
                    day = dicom_info['StudyDate'][6:8]
                    dicom_info['StudyDate'] = day + '/' + month + '/' + year

                    if 'anon' in dicom_info['PatientName']:
                        dicom_info['PatientName'] = "Anónimo"

                    if 'anon' in dicom_info['PatientID']:
                        dicom_info['PatientID'] = "Anónimo"

                    dicom_urls.append(url_for('static', filename=f'uploads/{filename}')) #guardamos el path del archivo subido
                    dicom_info_list.append(dicom_info)
                    fileNames.append(filename)

                except Exception as e:
                    errors.append(f'Error al procesar {file.filename}: {str(e)}')

            else:
                errors.append(f'{file.filename} no es un archivo DICOM válido')

        if errors:
            return render_template('Visualizador.html', mensaje='Errores en la carga', errors=errors)

        return render_template(
            'Visualizador.html',
            mensaje='listoo',
            dicom_info=dicom_info,
            archivosID=fileNames
        )

    # Si es un GET o no se suben archivos, aún renderizamos la plantilla
    return render_template('Visualizador.html', mensaje='normal', dicom_info=None)

# eliminar los archivos subidos de la carpeta uploads al momento que se cierre la pagina
@app.route('/delete-uploads', methods=['POST'])
def delete_uploads():
    """Eliminar archivos en la carpeta de uploads."""
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)  # Eliminar archivo
        except Exception as e:
            print(f"Error al eliminar {file_path}: {e}")
    return '', 200

if __name__ == '__main__':
    app.run(debug=True)
