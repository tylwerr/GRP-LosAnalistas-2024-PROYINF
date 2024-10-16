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
            $('#upload_file').prop('disabled', false) //es habilitar el boton de subida
        }
    });

    const dicomImageElement = document.getElementById('dicom-viewer');
    cornerstone.enable(dicomImageElement);
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

    //configuracion del cargador
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

    if(uploadFilename){
        // carga la imagen dicom
        cornerstone.loadImage('wadouri:' + imageUrl).then(function (image){
            cornerstone.displayImage(dicomImageElement, image); 
            cornerstoneTools.init(); // inicializa las herramientas de cornerstone

            cornerstoneTools.addTool(cornerstoneTools.LengthTool); // agregar la herramienta de medicion
            cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1, options: toolOptions });

        }).catch(function (error){
            console.error('Error al cargar la imagen: ', error);
        });
    }

    document.getElementById('measure-btn').addEventListener('click', function () {
        cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1, options: toolOptions}); // Activa la herramienta de medición
        console.log('Herramienta de medición activada'); // Para verificar en la consola
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