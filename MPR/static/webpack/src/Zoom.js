export function Zoom(isZoomToolActive, dicomImageElement) {
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
}