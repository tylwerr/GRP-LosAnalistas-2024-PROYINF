$(document).ready(function () {
    $('.menuNav').load('./Navbar.html');
    $('.submenu').hide();

    $('.menu-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).siblings('.submenu').slideToggle(); 
    });

    $('#upload-files').on('click', function(e) { 
        e.preventDefault();
        $('#file-input').click(); 
    });

    const dicomImageElement = document.getElementById('dicom-image');
    cornerstone.enable(dicomImageElement);

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.configure({
        beforeLoad: function(imageId) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
    });

    $('#file-input').on('change', function() { //Aqui se obtiene la imagen
        const files = this.files;
        if (files.length > 0) {
            let imageStack = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = function(event) {
                    const dicomBlob = new Blob([event.target.result]);
                    const dicomUrl = URL.createObjectURL(dicomBlob);
                    cornerstone.loadAndCacheImage('wadouri:' + dicomUrl).then(function(image) {
                        cornerstone.displayImage(dicomImageElement, image);
                        imageStack.push(image);
                    }).catch(function(error) {
                        console.error('Error al cargar la imagen DICOM:', error);
                    });
                };
                reader.readAsArrayBuffer(file);
            }
        } else {
            alert("Por favor, seleccione al menos un archivo DICOM");
        }
    });

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