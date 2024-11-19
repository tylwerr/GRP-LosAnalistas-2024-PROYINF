export function Regla(isLengthToolActive, dicomElements) {
    document.getElementById('measure-btn').addEventListener('click', function () {
            if (isLengthToolActive) {
                cornerstoneTools.setToolDisabled('Length', { mouseButtonMask: 1 });
                console.log(`Herramienta de medición desactivada en: ${dicomElements.id}`);
            } else {
                cornerstoneTools.setToolActive(dicomElements, 'Length', { mouseButtonMask: 1 });
                console.log(`Herramienta de medición activada en: ${dicomElements.id}`);
            }
        isLengthToolActive = !isLengthToolActive;
    });
}
    