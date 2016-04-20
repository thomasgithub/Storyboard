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

export const translate = (el, val) => {
  val = val ? `${val}px` : 0
  el.style.transform = `translateX(${val})`
}

export const ajust = (el, scale, x, y) => {
  el.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`
}
