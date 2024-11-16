export function Regla(isLengthToolActive, dicomImageElement) {  
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
}