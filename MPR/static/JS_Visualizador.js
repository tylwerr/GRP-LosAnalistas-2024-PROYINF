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
    cornerstoneWADOImageLoader.configure({
        beforeLoad: function(imageId) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
    });

    if(uploadFilename){
        cornerstone.loadImage('wadouri:' + imageUrl).then(function (image){
            cornerstone.displayImage(dicomImageElement, image);    
        }).catch(function (error){
            console.error('Error al cargar la imagen: ', error);
        });

        
    }

    let points = [];
    $('#ruler-toggle').on('click', function(e) {
        e.preventDefault();
        points = []; 
        $(dicomImageElement).off('click').on('click', addPoint);
    });

    function addPoint(event) {
        const rect = dicomImageElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        points.push({ x, y });


        const pointDiv = $('<div class="point"></div>').css({ left: x + 'px', top: y + 'px' });
        $(dicomImageElement).append(pointDiv);

        if (points.length === 2) {
            drawLine(points[0], points[1]);
            const distance = calculateDistance(points[0], points[1]);
            alert(`Distancia: ${distance.toFixed(2)} px`);
            $(dicomImageElement).off('click'); 
        }
    }

    function drawLine(point1, point2) {
        const lineDiv = $('<div class="line"></div>');
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        lineDiv.css({
            width: length + 'px',
            left: point1.x + 'px',
            top: point1.y + 'px',
            transform: `rotate(${angle}deg)`
        });

        $(dicomImageElement).append(lineDiv);
    }

    function calculateDistance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
});