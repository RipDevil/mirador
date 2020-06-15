import { createSelector } from 'reselect';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import AnnotationFactory from '../../lib/AnnotationFactory';
import { getCanvas, getVisibleCanvasIds } from './canvases';

const getAnnotationsOnCanvas = createSelector(
  [
    getCanvas,
    state => state.annotations,
  ],
  (canvas, annotations) => {
    if (!annotations || !canvas) return [];
    if (!annotations[canvas.id]) return [];

    return flatten(Object.values(annotations[canvas.id]));
  },
);

const getPresentAnnotationsCanvas = createSelector(
  [
    getAnnotationsOnCanvas,
  ],
  annotations => filter(
    Object.values(annotations)
      .map(annotation => annotation && AnnotationFactory.determineAnnotation(annotation.json)),
    annotation => annotation && annotation.present(),
  ),
);


const getAnnotationsOnSelectedCanvases = createSelector(
  [
    getVisibleCanvasIds,
    state => state.annotations,
  ],
  (canvasIds, annotations) => {
    if (!annotations || canvasIds.length === 0) return [];
    return flatten(
      canvasIds.map(
        targetId => annotations[targetId] && Object.values(annotations[targetId]),
      ),
    );
  },
);

export const getPresentAnnotationsOnSelectedCanvases = createSelector(
  [
    getAnnotationsOnSelectedCanvases,
  ],
  annotations => filter(
    Object.values(annotations)
      .map(annotation => annotation && AnnotationFactory.determineAnnotation(annotation.json)),
    annotation => annotation && annotation.present(),
  ),
);

/**
* Return an array of annotation resources filtered by the given motivation for a particular canvas
* @param {Array} annotations
* @param {Array} motivations
* @return {Array}
*/
export const getAnnotationResourcesByMotivationForCanvas = createSelector(
  [
    getPresentAnnotationsCanvas,
    (state, { motivations }) => motivations,
  ],
  (annotations, motivations) => filter(
    flatten(annotations.map(annotation => annotation.resources)),
    resource => resource.motivations.some(
      motivation => motivations.includes(motivation),
    ),
  ),
);

/**
* Return an array of annotation resources filtered by the given motivation
* @param {Array} annotations
* @param {Array} motivations
* @return {Array}
*/
export const getAnnotationResourcesByMotivation = createSelector(
  [
    getPresentAnnotationsOnSelectedCanvases,
    (state, { motivations }) => motivations,
  ],
  (annotations, motivations) => filter(
    flatten(annotations.map(annotation => annotation.resources)),
    resource => resource.motivations.some(
      motivation => motivations.includes(motivation),
    ),
  ),
);

/**
 * Return the selected annotations IDs of a given CanvasId
 * @param {Object} state
 * @param {String} windowId
 * @param {Array} targetIds
 * @return {Array}
 */
export const getSelectedAnnotationId = createSelector(
  [
    (state, { windowId }) => state.windows[windowId].selectedAnnotationId,
  ],
  selectedAnnotationId => selectedAnnotationId,
);

export const getSelectedAnnotationsOnCanvases = createSelector(
  [
    getPresentAnnotationsOnSelectedCanvases,
    getSelectedAnnotationId,
  ],
  (canvasAnnotations, selectedAnnotationId) => canvasAnnotations.map(annotation => ({
    id: (annotation['@id'] || annotation.id),
    resources: annotation.resources.filter(
      r => selectedAnnotationId === r.id,
    ),
  })).filter(val => val.resources.length > 0),
);
