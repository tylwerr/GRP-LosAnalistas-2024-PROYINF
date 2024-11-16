export function Regla(isLengthToolActive, dicomElements) {
    document.getElementById('measure-btn').addEventListener('click', function () {
        dicomElements.forEach((element) => {
            if (isLengthToolActive) {
                cornerstoneTools.setToolDisabledForElement(element, 'Length');
                console.log(`Herramienta de medición desactivada en: ${element.id}`);
            } else {
                cornerstoneTools.setToolActiveForElement(element, 'Length', { mouseButtonMask: 1 });
                console.log(`Herramienta de medición activada en: ${element.id}`);
            }
        });
        isLengthToolActive = !isLengthToolActive;
    });
}
