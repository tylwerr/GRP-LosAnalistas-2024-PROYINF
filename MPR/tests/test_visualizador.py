import unittest
import requests


class TestUploadDICOM(unittest.TestCase):

    def test_subir_dicom_valido(self):
        url = "http://127.0.0.1:5000/Visualizador"
        with open('../../DATOS_DICOM/Gd-MRA/IMG-0001-00001.dcm', 'rb') as f:
            files = {'file': f}  #Simulación de archivo DICOM válido
            response = requests.post(url, files=files)


            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json().get("message"), "Imagen DICOM subida correctamente")

    def test_subir_dicom_no_valido(self):
        url = "http://127.0.0.1:5000/Visualizador"
        with open('image.png', 'rb') as f:
            files = {'file': f}  #Simulación de archivo no válido
            response = requests.post(url, files=files)

            try:
                self.assertEqual(response.json().get("message"), "Tipo de archivo no válido")
            except ValueError:
                print("Response content:", response.content)
            #self.assertEqual(response.status_code, 200)
            #self.assertEqual(response.json().get("message"), "Tipo de archivo no válido")

    def test_subir_dicom_vacio(self):
        url = "http://127.0.0.1:5000/Visualizador"
        #files = {'file': ''}  #Simulación de archivo vacío
        response = requests.post(url, files={})

        try:
            self.assertEqual(response.json().get("message"), "No se seleccionó ningún archivo")
        except ValueError:
            print("Response content:", response.content) 
        #self.assertEqual(response.status_code, 200)
        #self.assertEqual(response.json().get("message"), "No se seleccionó ningún archivo")

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