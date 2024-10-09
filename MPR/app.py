from flask import Flask, render_template
app = Flask(__name__)
@app.route('/')
def index():
    return render_template('Index.html')

@app.route('/navbar')
def navbar():
    return render_template('Navbar.html')

@app.route('/seccionayuda')
def seccion_ayuda():
    return render_template('SeccionAyuda.html')
    
@app.route('/visualizador')
def visualizador():
    return render_template('Visualizador.html')

if __name__ == '__main__':
    app.run(debug=True)
