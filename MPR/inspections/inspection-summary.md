### Resultados de la inspección de SonarQube 

Isssue 1: 
**Severidad**: Alta, los strings literals duplicados hacen del proceso de refactorización más complejo y cualquier otro cambio se puede propagar en todas las ocurrencias.
**Descripción**: En app.py, uso de constante 'Visualizador.html' repetidamente por cinco veces, para python los strings literals no deben duplicarse.
**Recomendación**: Utilice constantes para reemplazar los literales de cadena duplicados. Se puede hacer referencia a las constantes desde muchos lugares, pero solo es necesario actualizarlas en un solo lugar.
**Acción**: Crear una constante para reemplazar la llamadas constantes del striung 'Visualizador.html'.

Isssue 2: 
**Severidad**: Mediana, reduce la legibilidad y dificulta la identificación de variables, esto puede llevar a un aumento de riesgo de errores junto a una compleja mantención del código.
**Descripción**: Renombrar la variable local "fileNames" a un nombre compatible con expresiones regulares.
**Recomendación**:En primer lugar, familiarícese con la convención de nombres específica del proyecto en cuestión. Luego, actualice el nombre para que coincida con la convención, así como con todos los usos del nombre. En muchos IDE, puede utilizar funciones integradas de cambio de nombre y refactorización para actualizar todos los usos a la vez.
**Acción**: Renonbrar la variable "fileNames" a un nombre más facil de leer y que no pueda causar confuciones.