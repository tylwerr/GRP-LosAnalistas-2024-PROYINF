$(document).ready(function () {
    // Carga una barra de navegación dinámica desde otra ruta
    $('.menuNav').load('/navbar');
    $('.submenu').hide();  // Esconde los submenús inicialmente

    // Desplegar el submenú al hacer clic en el menú principal
    $('.menu-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).siblings('.submenu').slideToggle(); 
    });

    // Simula un clic en el input de archivos cuando se presiona el botón de subir archivos
    $('#upload-files').on('click', function(e) { 
        e.preventDefault();
        $('#file-input').click(); 
    });

    // Habilitar el botón de subida solo si hay un archivo seleccionado
    $('#select_file').on('click', function(){
        if($(this).val()){
            $('#upload_file').prop('disabled', false); 
        }
    });

    // Inicializa el entorno de Cornerstone para cargar imágenes DICOM
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    let currentImageIndex = 0;
    // Inicializa herramientas de Cornerstone Tools
    cornerstoneTools.init({
        mouseEnabled: true,
        showSVGCursors: true,  // Muestra cursores SVG
    });

    const axialViewElement = document.getElementById('axial-view');
    const coronalViewElement = document.getElementById('coronal-view');
    const sagittalViewElement = document.getElementById('sagittal-view');

    cornerstone.enable(axialViewElement);
    cornerstone.enable(coronalViewElement);
    cornerstone.enable(sagittalViewElement);

    let imagenesIds = []
    
    
    // Agrega la herramienta de medición de longitud
    /*
    const LengthTool = cornerstoneTools.LengthTool;
    cornerstoneTools.addToolForElement(dicomImageElement, LengthTool);

    // Agrega la herramienta de zoom
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
    cornerstoneTools.addToolForElement(dicomImageElement, ZoomMouseWheelTool);

    // Estado para las herramientas de medición y zoom
    let isLengthToolActive = false; 
    let isZoomToolActive = false;
    */
    // Configura Cornerstone para cargar imágenes antes de mostrarlas

    cornerstoneWADOImageLoader.configure({
        beforeLoad: function(imageId) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
    });

    // Opciones de estilo para las herramientas de Cornerstone
    const toolOptions = {
        activeColor: 'yellow',  // Color para las herramientas activas
        shadow: true,  // Añade sombra para mejor visibilidad
        lineWidth: 2,  // Grosor de la línea
    };

    // Si existe un archivo cargado, se carga la imagen DICOM
    if (uploadFilename) {
        const imageId = 'wadouri:' + imageUrl;

        // Cargar la imagen DICOM para cada vista
        cornerstone.loadImage(imageId).then(function(image) {
            // Muestra la imagen en las tres vistas con orientación correspondiente
            cornerstone.displayImage(axialViewElement, image);   // Axial
            cornerstone.displayImage(coronalViewElement, image); // Coronal
            cornerstone.displayImage(sagittalViewElement, image);// Sagital
        }).catch(function(error) {
            console.error('Error al cargar la imagen:', error);
        });
    }

    /*
    // Botón para activar/desactivar la herramienta de medición
    document.getElementById('measure-btn').addEventListener('click', function () {
        if (isLengthToolActive) {
            cornerstoneTools.setToolDisabled('Length', { mouseButtonMask: 1 });
            console.log('Herramienta de medición desactivada');
        } else {
            cornerstoneTools.setToolActiveForElement(dicomImageElement, 'Length', { mouseButtonMask: 1 });
            console.log('Herramienta de medición activada');
        }
        isLengthToolActive = !isLengthToolActive;
    });

    // Botón para activar/desactivar la herramienta de zoom
    document.getElementById('zoom-btn').addEventListener('click', function () {
        if (isZoomToolActive) {
            cornerstoneTools.setToolDisabled('ZoomMouseWheel', {mouseButtonMask: 1});
            console.log('Herramienta de zoom desactivada');
        } else {
            cornerstoneTools.setToolActiveForElement(dicomImageElement, 'ZoomMouseWheel', { mouseButtonMask: 1 });
            console.log('Herramienta de zoom activada');
        }
        isZoomToolActive = !isZoomToolActive;
    });

    // Evento cuando se completa una medición
    dicomImageElement.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED, function(event) {
        const measurementData = event.detail.measurementData;
        console.log(`Medición completada: ${measurementData.length.toFixed(2)} mm`);
    });

    // Mostrar información del DICOM al pasar el mouse sobre el botón de información
    const infoButton = document.getElementById('info-btn');
    const dicomInfoCard = document.getElementById('dicom-info-card');

    infoButton.addEventListener('mouseover', function() {
        dicomInfoCard.style.display = 'block';  // Mostrar tarjeta de información
    });

    // Ocultar la tarjeta de información cuando se deja de pasar el mouse
    infoButton.addEventListener('mouseout', function() {
        dicomInfoCard.style.display = 'none';  // Ocultar tarjeta de información
    });
    */
});
