import { MIN_ZOOM } from "../constants";
import { AppState, NormalizedZoomValue } from "../types";

export const getNormalizedZoom = (zoom: number): NormalizedZoomValue => {
  return Math.max(MIN_ZOOM, Math.min(zoom, 30)) as NormalizedZoomValue;
};

export const getStateForZoom = (
  {
    viewportX,
    viewportY,
    nextZoom,
  }: {
    viewportX: number;
    viewportY: number;
    nextZoom: NormalizedZoomValue;
  },
  appState: AppState,
) => {
  const appLayerX = viewportX - appState.offsetLeft;
  const appLayerY = viewportY - appState.offsetTop;

  const currentZoom = appState.zoom.value;
  const urlParams = new URLSearchParams( window.location.search);
  
  //
  //let z = 1.0;
  //
  //if (urlParams.has("zoom")) {
  //  let p = urlParams.get("zoom");
  //  if (p !== undefined && p !== null ) {
  //    z = parseFloat(p);
  //  }
  //  nextZoom = z as NormalizedZoomValue;
  //} 

  // get original scroll position without zoom
  const baseScrollX = appState.scrollX + (appLayerX - appLayerX / currentZoom);
  const baseScrollY = appState.scrollY + (appLayerY - appLayerY / currentZoom);

  // get scroll offsets for target zoom level
  const zoomOffsetScrollX = -(appLayerX - appLayerX / nextZoom);
  const zoomOffsetScrollY = -(appLayerY - appLayerY / nextZoom);

  let sX = baseScrollX + zoomOffsetScrollX;
  let sY = baseScrollY + zoomOffsetScrollY;

  console.log("------------ zoom.ts -------------------------------------------")
  console.log("currentZoom", currentZoom, " nextZoom",nextZoom);
  console.log("appState.scrollX", appState.scrollX, " appLayerX", appLayerX, " zoomOffsetScrollX", zoomOffsetScrollX, " sX", sX);
  console.log("appState.scrollY", appState.scrollY, " appLayerY", appLayerY, " zoomOffsetScrollY", zoomOffsetScrollY, " sY", sY);

  if (urlParams.has("nozoom") ) {
    nextZoom = 1 as NormalizedZoomValue;
    sX = 0;
    sY = 0;
  } 
  if (urlParams.has("noscroll")) {
    sX = 0;
    sY = 0;
} 
  if (urlParams.has("sX")) {
    let p = urlParams.get("sX");
    if (p !== undefined && p !== null ) {
      sX = parseFloat(p);
    }
  } 
  if (urlParams.has("sY")) {
    let p = urlParams.get("sY");
    if (p !== undefined && p !== null ) {
      sY = parseFloat(p);
    }
  } 

  return {
    scrollX: sX, 
    scrollY: sY,

    zoom: {
      value: nextZoom,
    },
  };
};
