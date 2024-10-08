import unittest
import requests

class TestUploadDICOM(unittest.TestCase):

    def test_subir_dicom_valido(self):
        url = "http://localhost:5500/MPR/visualizador2.html"
        files = {'file': open('/DATOS_DICOM/Gd-MRA/IMG-0001-00001.dcm', 'rb')}  # Simulación de archivo DICOM válido
        response = requests.post(url, files=files)
        self.assertEqual(response.statuscode, 200)
        self.assertEqual(response.json().get("message"), "Imagen DICOM subida correctamente")

    def test_subir_dicom_no_valido(self):
        url = "http://localhost:5500/MPR/visualizador2.html"
        files = {'file': open('/tests/image.png', 'rb')}  # Simulación de archivo no válido
        response = requests.post(url, files=files)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json().get("message"), "Tipo de archivo no válido")

    def testmeasuredistance(self):
        url = "http://localhost:5500/MPR/visualizador2.html"
        data = {
            "point1": {"x": 10, "y": 20},
            "point2": {"x": 30, "y": 40}
        }

        response = requests.post(url, json=data)

        self.assertEqual(response.statuscode, 200)
        self.assertTrue('distance' in response.json())
        distance = response.json()['distance']

        expected_distance = ((30 - 10)**2 + (40 - 20)**2) ** 0.5  # Cálculo de distancia euclidiana
        self.assertAlmostEqual(distance, expected_distance, places=2)


if __name__ == '__main__':
    unittest.main()