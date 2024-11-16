export function Informacion() {
    // Mostrar información del DICOM al pasar el mouse sobre el botón de información
    const infoButton = document.getElementById('info-btn');
    const dicomInfoCard = document.getElementById('dicom-info-card');

    // Mostrar tarjeta de información
    infoButton.addEventListener('mouseover', function() {
        dicomInfoCard.style.display = 'block';  
    });

    // Ocultar la tarjeta de información cuando se deja de pasar el mouse
    infoButton.addEventListener('mouseout', function() {
        dicomInfoCard.style.display = 'none';  // Ocultar tarjeta de información
    });
}
