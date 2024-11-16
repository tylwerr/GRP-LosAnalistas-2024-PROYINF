
const {
  ToolGroupManager,
  Enums,
  CrosshairsTool,
  synchronizers,
} = cornerstoneTools;

const { createSlabThicknessSynchronizer } = synchronizers;
const { MouseBindings } = csToolsEnums;
const { ViewportType } = Enums;
// Define a unique id for the volume
const volumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id
const toolGroupId = 'MY_TOOLGROUP_ID';
const viewportId1 = 'CT_AXIAL';
const viewportId2 = 'CT_SAGITTAL';
const viewportId3 = 'CT_CORONAL';
const viewportIds = [viewportId1, viewportId2, viewportId3];
const renderingEngineId = 'myRenderingEngine';
const synchronizerId = 'SLAB_THICKNESS_SYNCHRONIZER_ID';
// ======== Set up page ======== //

addButtonToToolbar({
  title: 'Reset Camera',
  onClick: () => {
    const viewport1 = getRenderingEngine(renderingEngineId).getViewport(
      viewportId1
    ) as Types.IVolumeViewport;
    const resetPan = true;
    const resetZoom = true;
    const resetToCenter = true;
    const resetRotation = true;
    const supressEvents = false;
    viewport1.resetCamera(
      resetPan,
      resetZoom,
      resetToCenter,
      resetRotation,
      supressEvents
    );
    viewport1.render();
  },
});
// ============================= //
const viewportColors = {
  [viewportId1]: 'rgb(200, 0, 0)',
  [viewportId2]: 'rgb(200, 200, 0)',
  [viewportId3]: 'rgb(0, 200, 0)',
};
let synchronizer;
const viewportReferenceLineControllable = [
  viewportId1,
  viewportId2,
  viewportId3,
];
const viewportReferenceLineDraggableRotatable = [
  viewportId1,
  viewportId2,
  viewportId3,
];
const viewportReferenceLineSlabThicknessControlsOn = [
  viewportId1,
  viewportId2,
  viewportId3,
];
function getReferenceLineColor(viewportId) {
  return viewportColors[viewportId];
}
function getReferenceLineControllable(viewportId) {
  const index = viewportReferenceLineControllable.indexOf(viewportId);
  return index !== -1;
}
function getReferenceLineDraggableRotatable(viewportId) {
  const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
  return index !== -1;
}
function getReferenceLineSlabThicknessControlsOn(viewportId) {
  const index =
    viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
  return index !== -1;
}
const blendModeOptions = {
  MIP: 'Maximum Intensity Projection',
  MINIP: 'Minimum Intensity Projection',
  AIP: 'Average Intensity Projection',
};
addDropdownToToolbar({
  options: {
    values: [
      'Maximum Intensity Projection',
      'Minimum Intensity Projection',
      'Average Intensity Projection',
    ],
    defaultValue: 'Maximum Intensity Projection',
  },
  onSelectedValueChange: (selectedValue) => {
    let blendModeToUse;
    switch (selectedValue) {
      case blendModeOptions.MIP = Enums.BlendModes.MAXIMUM_INTENSITY_BLEND;
        break;
      case blendModeOptions.MINIP = Enums.BlendModes.MINIMUM_INTENSITY_BLEND;
        break;
      case blendModeOptions.AIP = Enums.BlendModes.AVERAGE_INTENSITY_BLEND;
        break;
      default new Error('undefined orientation option');
    }
    const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
    const crosshairsInstance = toolGroup.getToolInstance(
      CrosshairsTool.toolName
    );
    const oldConfiguration = crosshairsInstance.configuration;
    crosshairsInstance.configuration = {
      ...oldConfiguration,
      slabThicknessBlendMode,
    };
    // Update the blendMode for actors to instantly reflect the change
    toolGroup.viewportsInfo.forEach(({ viewportId, renderingEngineId }) => {
      const renderingEngine = getRenderingEngine(renderingEngineId);
      const viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IVolumeViewport;
      viewport.setBlendMode(blendModeToUse);
      viewport.render();
    });
  },
});

// <---- SINCRONIZACION ---->
// Boton para inciar la sincronización 
addToggleButtonToToolbar({
  id: 'syncSlabThickness',
  title: 'Sync Slab Thickness',
  defaultToggle,
  onClick: (toggle) => {
    synchronizer.setEnabled(toggle);
  },
});
// Establecer los viewports que se sincronizarán
function setUpSynchronizers() {
  synchronizer = createSlabThicknessSynchronizer(synchronizerId);
  // Add viewports to VOI synchronizers
  [viewportId1, viewportId2, viewportId3].forEach((viewportId) => {
    synchronizer.add({
      renderingEngineId,
      viewportId,
    });
  });
  // Normally this would be left on, but here we are starting the demo in the
  // default state, which is to not have a synchronizer enabled.
  synchronizer.setEnabled(false);
}


/**
 * Runs the demo
 */
async function run() {
  // Init Cornerstone and related libraries
  await initDemo();
  // Add tools to Cornerstone3D
  cornerstoneTools.addTool(CrosshairsTool);
  // Get Cornerstone imageIds for the source data and fetch metadata into RAM
  const imageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    wadoRsRoot() || 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
  });
  // Define a volume in memory
  const volume = await volumeLoader.createAndCacheVolume(volumeId, {
    imageIds,
  });
  // Instantiate a rendering engine
  const renderingEngine = new RenderingEngine(renderingEngineId);
  // Create the viewports
  const viewportInputArray = [
    {
      viewportId,
      type.ORTHOGRAPHIC,
      element,
      defaultOptions: {
        orientation.OrientationAxis.AXIAL,
        background: <Types.Point3>[0, 0, 0],
      },
    },
    {
      viewportId,
      type.ORTHOGRAPHIC,
      element,
      defaultOptions: {
        orientation.OrientationAxis.SAGITTAL,
        background: <Types.Point3>[0, 0, 0],
      },
    },
    {
      viewportId,
      type.ORTHOGRAPHIC,
      element,
      defaultOptions: {
        orientation.OrientationAxis.CORONAL,
        background: <Types.Point3>[0, 0, 0],
      },
    },
  ];
  renderingEngine.setViewports(viewportInputArray);
  // Set the volume to load
  volume.load();
  // Set volumes on the viewports
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId,
        callback,
      },
    ],
    [viewportId1, viewportId2, viewportId3]
  );
   </Types.Point3>/ //Define tool groups to add the segmentation display tool to

  // Aca tools
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  addManipulationBindings(toolGroup);
  // For the crosshairs to operate, the viewports must currently be added ahead of setting the tool active. This will be improved in the future.
  toolGroup.addViewport(viewportId1, renderingEngineId);
  toolGroup.addViewport(viewportId2, renderingEngineId);
  toolGroup.addViewport(viewportId3, renderingEngineId);
  // Manipulation Tools
  // Add Crosshairs tool and configure it to link the three viewports
  // These viewports could use different tool groups. See the PET-CT example
  // for a more complicated used case.
  //const isMobile = window.matchMedia('(any-pointer)').matches; para celulares
  toolGroup.addTool(CrosshairsTool.toolName, {
    getReferenceLineColor,
    getReferenceLineControllable,
    getReferenceLineDraggableRotatable,
    getReferenceLineSlabThicknessControlsOn,
    mobile: {
      enabled,
      opacity.8,
      handleRadius,
    },
  });
  toolGroup.setToolActive(CrosshairsTool.toolName, {
    bindings: [{ mouseButton.Primary }],
  });
  setUpSynchronizers();
  // Render the image
  renderingEngine.renderViewports(viewportIds);
}
run();
