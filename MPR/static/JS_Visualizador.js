
import { Regla } from './Regla.js';
import { Zoom } from './Zoom.js';
import { Informacion } from './Mostrar_informacion.js';
//import { RenderingEngine } from '/static/node_modules/@cornerstonejs/streaming-image-volume-loader/dist/esm/index.js';  
//import { volumeLoader } from './@cornerstonejs/streaming-image-volume-loader';


$(document).ready(function () {
    
    
    //<------- VINCULACIONES CON HTML ------->

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

    //<------- END VINCULACIONES CON HTML ------->

    //<------- INICIALIZACIÓN DE CORNERSTONE ------->

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneWADOImageLoader.webWorkerManager.initialize();
    cornerstoneWADOImageLoader.configure({
        useWebWorkers: true,
    });
    
    
    const axialViewElement = document.getElementById('axial-view');
    const coronalViewElement = document.getElementById('coronal-view');
    const sagittalViewElement = document.getElementById('sagittal-view');

    // Habilitar elementos de Cornerstone
    
    cornerstone.enable(axialViewElement);
    cornerstone.enable(coronalViewElement);
    cornerstone.enable(sagittalViewElement);

    // Creacion imagenes IDs
    
    const imageIds = []

    for(let i = 0; i < fileNames.length; i++){
        imageIds[i] = `wadouri:/static/uploads/${fileNames[i]}`;

    };
    console.log(imageIds)
    
    // Inicializa herramientas de Cornerstone Tools
    /*
    cornerstoneTools.init({
        mouseEnabled: true,
        showSVGCursors: true,  // Muestra cursores SVG
    });*/

    


    //cornerstoneTools.addTool(cornerstoneTools.CrosshairsTool);

    //<------- END INICIALIZACIÓN DE CORNERSTONE ------->

    //<------- CARGAR IMÁGENES Y USO DE CORNERSTONE ------->

    let currentImageIndex = 0;
    function loadImageForAllViews(imageIndex){
        // Cargar y mostrar la imagen para cada vista
        cornerstone.loadAndCacheImage(imageIds[imageIndex]).then(function(image) {
            cornerstone.displayImage(axialViewElement, image);
            cornerstone.displayImage(coronalViewElement, image);
            cornerstone.displayImage(sagittalViewElement, image);
        }).catch(err => console.error('Error al cargar imagen:', err));
    }
    
    // Inicializar la primera imagen
    loadImageForAllViews(currentImageIndex);


    /*
    function scrollSynchronize(event) {
        const delta = event.detail.direction; // Obtener la dirección del scroll
        currentImageIndex += delta;

        // Restringir el índice de imagen a los límites de la serie DICOM
        if (currentImageIndex < 0) {
            currentImageIndex = 0;
        } else if (currentImageIndex >= imagenesIds.length) {
            currentImageIndex = imagenesIds.length - 1;
        }

        // Actualizar todas las vistas con la nueva imagen
        loadImageForAllViews(currentImageIndex);
    }


    // Configura Cornerstone para cargar imágenes antes de mostrarlas
    cornerstoneWADOImageLoader.configure({
        beforeLoad: function(imageId) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
    });

    // Si existe un archivo cargado, se carga la imagen DICOM
    if (uploadFilesName) {
        const imageId = 'wadouri:' + imageUrl;

        // Cargar la imagen DICOM para cada vista
        cornerstone.loadImage(imageId).then(function(image) {
            // Muestra la imagen en las tres vistas con orientación correspondiente
            cornerstone.displayImage(axialViewElement, image);
            cornerstone.displayImage(coronalViewElement, image);
            cornerstone.displayImage(sagittalViewElement, image);
        }).catch(function(error) {
            console.error('Error al cargar la imagen:', error);
        });
    }
    */

    //<------- END CARGAR IMÁGENES Y USO DE CORNERSTONE ------->
    
    //<------- FUNCIONALIDADES ------->

    // Agrega la herramienta de medición de longitud
    const LengthTool = cornerstoneTools.LengthTool;
    //cornerstoneTools.addToolForElement(dicomImageElement, LengthTool);

    // Agrega la herramienta de zoom
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
    //cornerstoneTools.addToolForElement(dicomImageElement, ZoomMouseWheelTool);

    // Habilitar el scroll tool para sincronizar en todas las vistas
    //cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool);

    // Estado para las herramientas de medición y zoom
    let isLengthToolActive = false; 
    let isZoomToolActive = false;

    // Opciones de estilo para las herramientas de Cornerstone
    const toolOptions = {
        activeColor: 'yellow',  // Color para las herramientas activas
        shadow: true,          // Añade sombra para mejor visibilidad
        lineWidth: 2,         // Grosor de la línea
    };

    /*
    cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 1 });
    // Escuchar los eventos de scroll en una de las vistas (puede ser axialElement)
    axialElement.addEventListener('cornerstonetoolsmousewheel', scrollSynchronize);
    sagittalElement.addEventListener('cornerstonetoolsmousewheel', scrollSynchronize);
    coronalElement.addEventListener('cornerstonetoolsmousewheel', scrollSynchronize);
    */

    //Botón de Regla
    //Regla(isLengthToolActive, dicomImageElement);

    //Botón de Zoom
    //Zoom(isZoomToolActive, dicomImageElement);

    //Mostrar información
    //Informacion();

    /*
    // Evento cuando se completa una medición
    dicomImageElement.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED, function(event) {
        const measurementData = event.detail.measurementData;
        console.log(`Medición completada: ${measurementData.length.toFixed(2)} mm`);
    });
    */
    
    //<------- END FUNCIONALIDADES ------->
});
