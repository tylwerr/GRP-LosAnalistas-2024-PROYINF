export function Zoom(isZoomToolActive, toolGroup) {
    // Botón para activar/desactivar la herramienta de zoom
    document.getElementById('zoom-btn').addEventListener('click', function () {
        if (isZoomToolActive) {
            toolGroup.setToolDisabled(ZoomTool.toolName, {mouseButtonMask: 1});
            console.log('Herramienta de zoom desactivada');
        } else {
            toolGroup.setToolActive(ZoomTool.toolName, { mouseButtonMask: 1 });
            console.log('Herramienta de zoom activada');
        }
        isZoomToolActive = !isZoomToolActive;
    });
}
