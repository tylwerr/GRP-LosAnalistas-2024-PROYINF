$(document).ready(function () {
    $('.menuNav').load('/navbar');
    $('.submenu').hide();

    $('.menu-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).siblings('.submenu').slideToggle(); 
    });

    $('#upload-files').on('click', function(e) { 
        e.preventDefault();
        $('#file-input').click(); 
    });

    $('#select_file').on('click', function(){
        if($(this).val()){
            $('#upload_file').prop('disabled', false); // Habilitar el botón de subida
        }
    });

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

    cornerstoneTools.init({
        mouseEnabled: true,
        showSVGCursors: true, // Para mostrar cursores SVG en las herramientas
    });

    const dicomImageElement = document.querySelector('#dicom-viewer');
    cornerstone.enable(dicomImageElement);

    const LengthTool = cornerstoneTools.LengthTool;
    cornerstoneTools.addToolForElement(dicomImageElement,LengthTool);

    // Configuración del cargador
    cornerstoneWADOImageLoader.configure({
        beforeLoad: function(imageId) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
    });

    const toolOptions = {
        activeColor: 'yellow',  // Color para las mediciones activas
        shadow: true,  // Para darle un efecto de sombra y mayor visibilidad
        lineWidth: 2,  // Grosor de la línea de medición
    };

    if (uploadFilename) {
        // Carga la imagen DICOM
        cornerstone.loadImage('wadouri:' + imageUrl).then(function (image){
            cornerstone.displayImage(dicomImageElement, image); 
            dicomImageElement.style.cursor = 'crosshair';

            // Variables para almacenar los dos clics
            let firstClick = null;
            let secondClick = null;

            // Evento para manejar clics en la imagen DICOM
            dicomImageElement.addEventListener('mousedown', function (e) {
                const imageCoords = cornerstone.pageToPixel(dicomImageElement, e.pageX, e.pageY);

                if (!firstClick) {
                    // Guardar el primer clic
                    firstClick = imageCoords;
                    console.log(`Primer clic: x = ${firstClick.x}, y = ${firstClick.y}`);
                } else {
                    // Guardar el segundo clic y calcular la distancia
                    secondClick = imageCoords;
                    console.log(`Segundo clic: x = ${secondClick.x}, y = ${secondClick.y}`);

                    const measurementData = {
                        visible: true,
                        active: true,
                        handles: {
                            start: { x: firstClick.x, y: firstClick.y, highlight: true, active: false },
                            end: { x: secondClick.x, y: secondClick.y, highlight: true, active: true },
                            textBox: {
                                active: false,
                                hasMoved: false,
                                drawnIndependently: true,
                                movesIndependently: false,
                                x: (firstClick.x + secondClick.x) / 2,
                                y: (firstClick.y + secondClick.y) / 2,
                            },
                        },
                    };

                    // Añadir el estado de la herramienta de medición
                    cornerstoneTools.addToolState(dicomImageElement, 'Length', measurementData);
                    cornerstone.updateImage(dicomImageElement);

                    // Resetear clics
                    firstClick = null;
                    secondClick = null;
                }
            });

        }).catch(function (error) {
            console.error('Error al cargar la imagen: ', error);
        });
    }

    document.getElementById('measure-btn').addEventListener('click', function () {
        // Activar la herramienta de medición para el elemento habilitado
        cornerstoneTools.setToolActiveForElement(dicomImageElement,'Length', { mouseButtonMask: 1 });  // Corregido de 'Lenght' a 'Length'
        console.log('Herramienta de medición activada'); // Verificar en la consola
    });

    dicomImageElement.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED, function(event) {
        const measurementData = event.detail.measurementData;
        console.log(`Medición completada: ${measurementData.length.toFixed(2)} mm`);
    });

    const infoButton = document.getElementById('info-btn');
    const dicomInfoCard = document.getElementById('dicom-info-card');

    infoButton.addEventListener('mouseover', function() {
        dicomInfoCard.style.display = 'block'; // Mostrar información
    });

    // Ocultar la información del DICOM cuando el mouse sale del botón
    infoButton.addEventListener('mouseout', function() {
        dicomInfoCard.style.display = 'none'; // Ocultar información
    });
});
