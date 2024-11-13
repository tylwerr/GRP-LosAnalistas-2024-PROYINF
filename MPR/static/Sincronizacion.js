const synchronizeCrosshairs = (event) => {
    const eventData = event.detail;
    cornerstoneTools.setToolEnabledForElement(axialElement, 'Crosshairs');
    cornerstoneTools.setToolEnabledForElement(sagittalElement, 'Crosshairs');
    cornerstoneTools.setToolEnabledForElement(coronalElement, 'Crosshairs');

    cornerstoneTools.crosshairs.setCrosshairPosition(axialElement, eventData.currentPoints.image);
    cornerstoneTools.crosshairs.setCrosshairPosition(sagittalElement, eventData.currentPoints.image);
    cornerstoneTools.crosshairs.setCrosshairPosition(coronalElement, eventData.currentPoints.image);
};

// Escuchar el evento de actualización de crosshairs en cada vista
axialElement.addEventListener(cornerstoneTools.EVENTS.CROSSHAIRS_UPDATED, synchronizeCrosshairs);
sagittalElement.addEventListener(cornerstoneTools.EVENTS.CROSSHAIRS_UPDATED, synchronizeCrosshairs);
coronalElement.addEventListener(cornerstoneTools.EVENTS.CROSSHAIRS_UPDATED, synchronizeCrosshairs);