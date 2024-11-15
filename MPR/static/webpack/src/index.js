import { RenderingEngine, Enums, volumeLoader, cornerstoneStreamingImageVolumeLoader, setVolumesForViewports, init } from '@cornerstonejs/core';
import { Informacion } from '../../Mostrar_informacion.js';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';


$(document).ready(async function () {
    
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
    init();

    const axialViewElement = document.getElementById('axial-view');
    const coronalViewElement = document.getElementById('coronal-view');
    const sagittalViewElement = document.getElementById('sagittal-view');

    // Creacion imagenes IDs
    const imageIds = fileNames.map(fileName=>"wadouri:/static/uploads/"+fileName)//Recorre para crear el path

    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    const volumeId = 'cornerstoneStreamingImageVolume:myVolumeId';
    console.log("carlos")
    
    const volume = await volumeLoader.createAndCacheVolume(volumeId, { imageIds: imageIds });//AQUI EL ERRRROOOOOOOOOOR

    console.log("Arévalo")
    const viewportId1 = 'CT_AXIAL';
    const viewportId2 = 'CT_SAGITTAL';
    const viewportId3 = 'CT_CORONAL';
    console.log("chavela")
    const viewportInput = [
    {
        viewportId: viewportId1,
        element: axialViewElement,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
            orientation: Enums.OrientationAxis.AXIAL,
        },
    },
    {
        viewportId: viewportId2,
        element: sagittalViewElement,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
            orientation: Enums.OrientationAxis.SAGITTAL,
        },
    },
    {
        viewportId: viewportId3,
        element: coronalViewElement,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
            orientation: Enums.OrientationAxis.CORONAL,
        },
    },
    ];
    console.log("hola")
    renderingEngine.setViewports(viewportInput);

    volume.load();

    setVolumesForViewports(
    renderingEngine,
    [{ volumeId }],
    [viewportId1, viewportId2, viewportId3]
    );

    // Render the image
    renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);



//<------- END INICIALIZACIÓN DE CORNERSTONE ------->

//<------- CARGAR IMÁGENES Y USO DE CORNERSTONE ------->



//<------- END CARGAR IMÁGENES Y USO DE CORNERSTONE ------->
    
//<------- FUNCIONALIDADES ------->

    //Mostrar información
    Informacion();
    
//<------- END FUNCIONALIDADES ------->
});