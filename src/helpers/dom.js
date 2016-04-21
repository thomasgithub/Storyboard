/**
 * Get element boundaries
 */
export const getBounds = el => el.getBoundingClientRect()

/**
 * Create DOM element
 */
export const create = document.createElement.bind(document)

/**
 * Remove all element childs
 */
export const clearChilds = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
}

/**
 * Clean childs and append child
 */
export const clearAndAppend = (container, el) => {
  clearChilds(container)
  container.appendChild(el)
}

/**
 * Vendor prefixes
 */

export const setTransform = (el, val) => {
  el.style.transform = val
  el.style.msTransform = val
  el.style.mozTransform = val
  el.style.oTransform = val
  el.style.webkitTransform = val
}

export const setTransition = (el, val) => {
  el.style.transition = val
  el.style.msTransition = val
  el.style.mozTransition = val
  el.style.oTransition = val
  el.style.webkitTransition = val
}

export const setTransformOrigin = (el, val) => {
  el.style.transformOrigin = val
  el.style.msTransformOrigin = val
  el.style.mozTransformOrigin = val
  el.style.oTransformOrigin = val
  el.style.webkitTransformOrigin = val
}
