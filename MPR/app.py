import os
from flask import Flask, render_template, request, redirect , url_for, flash, jsonify
from werkzeug.utils import secure_filename #manejar archivos subidos

UPLOAD_FOLDER = 'static/uploads'   
ALLOWED_EXTENSIONS = {'dcm'} #solo se permite dicom

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#verifica que el archivo sea de extensión dicom
def archivo_permitido(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
    file=''
    if request.method == 'POST':
        #verificar que el POST tenga parte file
        if 'file' not in request.files:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Verifica si la solicitud es AJAX
                return 400
            return render_template('Visualizador.html',mensaje='falla1')
    
        file = request.files['file']
        
        #verificar que no esté vacío
        if file.filename == '':
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Verifica si la solicitud es AJAX
                return 400
            return render_template('Visualizador.html',mensaje='falla2')
        
        #archivo permitido
        if file and archivo_permitido(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Verifica si la solicitud es AJAX
                return 200
            return render_template('Visualizador.html',mensaje='listoo',archivo=file.filename) #archivo retornado
        
        else:
            #no es tipo dicom
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # Verifica si la solicitud es AJAX
                return 400
            return render_template('Visualizador.html',mensaje='falla3')
            
    #página predeterminada
    return render_template('Visualizador.html',mensaje='normal')
    
if __name__ == '__main__':
    app.run(debug=True)