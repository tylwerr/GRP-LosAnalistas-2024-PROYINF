import os
from flask import Flask, render_template, request, redirect , url_for, flash, jsonify
from werkzeug.utils import secure_filename #manejar archivos subidos
from flask_cors import CORS

UPLOAD_FOLDER = 'static/uploads'   
ALLOWED_EXTENSIONS = {'dcm'} #solo se permite dicom

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)

#verifica que el archivo sea de extensión dicom
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
    #file=''
    if request.method == 'POST':
        #verificar que el POST tenga parte file
        if 'file' not in request.files:
            if 'unittest-script' in user_agent:  # Verifica si la solicitud es AJAX
                return 'No se mandó un archivo',400
            return render_template('Visualizador.html',mensaje='falla1')
    
        file = request.files['file']
        
        #verificar que no esté vacío
        if file.filename == '':
            if 'unittest-script' in user_agent:  # Verifica si la solicitud es AJAX
                return 'Se mandó un archivo vacío',400
            return render_template('Visualizador.html',mensaje='falla2')
        
        #archivo permitido
        if file and archivo_permitido(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if 'unittest-script' in user_agent:  # Verifica si la solicitud es AJAX
                return 'Archivo DICOM subido correctamente',200
            return render_template('Visualizador.html',mensaje='listoo',archivo=file.filename) #archivo retornado
        
        else:
            #no es tipo dicom
            if 'unittest-script' in user_agent:  # Verifica si la solicitud es AJAX
                return 'Archivo subido no es tipo DICOM',415
            return render_template('Visualizador.html',mensaje='falla3')
            
    #página predeterminada
    return render_template('Visualizador.html',mensaje='normal')
    
if __name__ == '__main__':
    app.run(debug=True)