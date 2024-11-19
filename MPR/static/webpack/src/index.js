import * as cornerstoneCore from '@cornerstonejs/core';
import * as dicomImageLoader from '@cornerstonejs/dicom-image-loader';
//import * as cornerstoneTools from '@cornerstonejs/tools'; // Para tools.js
import { Informacion } from './Mostrar_informacion.js';
import { Regla } from './Regla.js';
import { Zoom } from './Zoom.js';




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
    await cornerstoneCore.init();
    await dicomImageLoader.init();
    await cornerstoneTools.init({
        mouseEnabled: true,
        showSVGCursors: true, // Para mostrar cursores SVG en las herramientas
    });
    
    //const { ToolGroupManager, Enums, CrosshairsTool, synchronizers, } = cornerstoneTools;
    
    //const { createSlabThicknessSynchronizer } = synchronizers;
    const { ViewportType } = cornerstoneCore.Enums;

    const axialViewElement = document.getElementById('axial-view');
    const coronalViewElement = document.getElementById('coronal-view');
    const sagittalViewElement = document.getElementById('sagittal-view');

    const viewportId1 = 'CT_AXIAL';
    const viewportId2 = 'CT_SAGITTAL';
    const viewportId3 = 'CT_CORONAL';

    const toolGroupId = 'MY_TOOLGROUP_ID';
    //const toolGroup = cornerstoneTools.ToolGroupManager.createToolGroup(toolGroupId);

    const synchronizerId = 'SLAB_THICKNESS_SYNCHRONIZER_ID';
    
    // Creacion imagenes IDs
    const imageIds = fileNames.map(fileName=>"wadouri:http://localhost:5000/static/uploads/"+fileName);
    
    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new cornerstoneCore.RenderingEngine(renderingEngineId);

    const volumeId = 'cornerstoneStreamingImageVolume:CT_VOLUME_ID';
    
    const volume = await cornerstoneCore.volumeLoader.createAndCacheVolume(volumeId, {imageIds});

    const viewportInput = [
    {
        viewportId: viewportId1,
        element: axialViewElement,
        type: ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
            orientation: cornerstoneCore.Enums.OrientationAxis.AXIAL,
            
        },
    },
    {
        viewportId: viewportId2,
        element: sagittalViewElement,
        type: ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
            orientation: cornerstoneCore.Enums.OrientationAxis.SAGITTAL,

        },
    },
    {
        viewportId: viewportId3,
        element: coronalViewElement,
        type: ViewportType.ORTHOGRAPHIC,
        defaultOptions: {
            orientation: cornerstoneCore.Enums.OrientationAxis.CORONAL,
            
        },
    },
    ];
    
    renderingEngine.setViewports(viewportInput);

    volume.load();

    cornerstoneCore.setVolumesForViewports(
    renderingEngine,
    [{ volumeId }],
    [viewportId1, viewportId2, viewportId3]
    );

//<------- END INICIALIZACIÓN DE CORNERSTONE ------->

//<------- SINCRONIZACIÓN ------->
    /*
    let synchronizer;
    // Opciones de estilo para las herramientas de Cornerstone
    const toolOptions = {
        activeColor: 'yellow',  // Color para las herramientas activas
        shadow: true,          // Añade sombra para mejor visibilidad
        lineWidth: 2,         // Grosor de la línea
    };

    const viewportReferenceLineControllable = [
        viewportId1,
        viewportId2,
        viewportId3,
    ];

    const viewportReferenceLineDraggableRotatable = [
        viewportId1,
        viewportId2,
        viewportId3,
    ];

    const viewportReferenceLineSlabThicknessControlsOn = [
        viewportId1,
        viewportId2,
        viewportId3,
    ];

    function getReferenceLineColor(viewportId) {
        return viewportColors[viewportId];
    }

    function getReferenceLineControllable(viewportId) {
        const index = viewportReferenceLineControllable.indexOf(viewportId);
        return index !== -1;
    }

    function getReferenceLineDraggableRotatable(viewportId) {
        const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
        return index !== -1;
    }

    function getReferenceLineSlabThicknessControlsOn(viewportId) {
        const index = viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
        return index !== -1;
    }

    //cornerstoneTools.addTool(CrosshairsTool);
    //cornerstoneTools.addTool(ZoomTool);
    //toolGroup.addTool(CrosshairsTool.toolName);
    //toolGroup.addTool(ZoomTool.toolName);
    //addManipulationBindings(toolGroup);

    toolGroup.addViewport(viewportId1, renderingEngineId);
    toolGroup.addViewport(viewportId2, renderingEngineId);
    toolGroup.addViewport(viewportId3, renderingEngineId);
    */



//<------- END SINCRONIZACIÓN ------->

//<------- FUNCIONALIDADES ------->
    
    //Botón de Regla
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    const LengthTool = cornerstoneTools.LengthTool;
    cornerstoneTools.addTool(LengthTool);

    let isLengthToolActive = false;

    Regla(isLengthToolActive, axialViewElement);
    Regla(isLengthToolActive, coronalViewElement);
    Regla(isLengthToolActive, sagittalViewElement);


    //Botón de Zoom
    //let isZoomToolActive = false;
    //Zoom(isZoomToolActive, toolGroup);
    



    //Mostrar información
    Informacion();

        // Render the image
    renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
//<------- END FUNCIONALIDADES ------->
});
