import unittest
import requests

class TestRegla(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        #datos que se van a usar
        cls.url = "http://127.0.0.1:5000/Visualizador"
        cls.headers = {'User-Agent': 'unittest-script'} #identifica que es un script el que hace POST

    @classmethod
    def tearDownClass(cls):
        #no requiere de limpieza ya que retorna mensajes
        print("\nLimpieza después de todas las pruebas.")

    def valid_distance(self):
        return 400


    def invalid_distance(self):
        return 400

        
class TestUploadDICOM(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        #datos que se van a usar
        cls.url = "http://127.0.0.1:5000/Visualizador"
        cls.headers = {'User-Agent': 'unittest-script'} #identifica que es un script el que hace POST

    @classmethod
    def tearDownClass(cls):
        #no requiere de limpieza ya que retorna mensajes
        print("\nLimpieza después de todas las pruebas.")


    def test_subir_dicom_valido(self):
        with open('../../DATOS_DICOM/Gd-MRA/IMG-0001-00001.dcm', 'rb') as f:
            files = {'file': f}  #Simulación de archivo DICOM válido
            response = requests.post(self.url, files=files, headers=self.headers)

            try:
                self.assertEqual(response.status_code, 200)
                print("\nTest subir dicom valido: Aceptado.")
            except ValueError:
                print("Respuesta del servidor:", response.text)

    def test_subir_dicom_no_valido(self):
        with open('image.png', 'rb') as f:
            files = {'file': f}  #Simulación de archivo no válido
            response = requests.post(self.url, files=files, headers=self.headers)

            try:
                self.assertEqual(response.status_code, 400)
                print("\nTest subir archivo no válido: Aceptado.")
            except ValueError:
                print("Response content:", response.content)

    def test_subir_dicom_vacio(self):
        files = {'file': ('', '')} #Simulación de archivo vacío
        response = requests.post(self.url, files=files, headers=self.headers)

        try:
            self.assertEqual(response.status_code, 400)
            print("\nTest subir archivo vacío: Aceptado.")
        except ValueError:
            print("Response content:", response.content) 

    '''
    def test_measuredistance(self):
        url = "http://127.0.0.1:5000/Visualizador"
        data = {
            "point1": {"x": 10, "y": 20},
            "point2": {"x": 30, "y": 40}
        }

        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('distance' in response.json())

        distance = response.json()['distance']
        expected_distance = ((30 - 10)**2 + (40 - 20)**2) ** 0.5  #Cálculo de distancia euclidiana
        self.assertAlmostEqual(distance, expected_distance, places=2)

    def test_measuredistance_invalid(self):
        url = "http://127.0.0.1:5000/Visualizador"
        data = {
            "point1": {"x": -10, "y": -20},
            "point2": {"x": 30, "y": 40}
        }
        response = requests.post(url, json=data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid points', response.json().get('message', 'Points fuera de rango'))
    '''

if __name__ == '__main__':
    unittest.main()