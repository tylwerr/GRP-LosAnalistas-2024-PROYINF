export function Regla(isLengthToolActive, dicomElement) {
    document.getElementById('measure-btn').addEventListener('click', function () {
            if (isLengthToolActive) {
                cornerstoneTools.setToolDisabledForElement(dicomElement, 'Length', { mouseButtonMask: 1 });
                console.log(`Herramienta de medición desactivada en: ${dicomElement.id}`);
            } else {
                cornerstoneTools.setToolActiveForElement(dicomElement, 'Length', { mouseButtonMask: 1 });
                console.log(`Herramienta de medición activada en: ${dicomElement.id}`);
            }
        isLengthToolActive = !isLengthToolActive;
    });
}
    