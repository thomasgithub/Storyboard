import * as imageHelper from 'helpers/image'
import * as dom from 'helpers/dom'

class Storyboard {

  constructor (container, imagesSrcs, initialIndex) {

    // animation duration
    this._duration = 500

    // time before retry fetch of a failed image
    this._fetchRate = 1000

    // time between each refresh
    this._refreshRate = 500

    // index of current image
    this._index = initialIndex || 0

    // dom container
    this._container = container

    // images
    this._images = imagesSrcs.map(src => ({ src, loaded: false }))

    // count how many animations are running
    // (when using next/prev multiple times)
    this._pendingAnimations = 0

    // ==> render
    this.render()

    // ==> refresh every n milliseconds
    this.loop()

  }

  /**
   * Clean up things
   */
  destroy () {
    this._destroyed = true
    window.removeEventListener('resize', this.refresh)
  }

  /**
   * Initialize wrapper
   */
  render () {
    this._container.style.overflow = 'hidden'
    this._slider = dom.create('div')
    this._slider.style.position = 'absolute'
    this._slider.style.top = 0
    this._slider.style.left = 0
    this._slider.style.right = 0
    this._slider.style.bottom = 0
    dom.clearAndAppend(this._container, this._slider)

    this.refresh()
    window.addEventListener('resize', this.refresh)
  }

  /**
   * Executed every 500ms
   * Refresh the whole thing (for resizing, re-loading failed imgs, etc.)
   */
  loop = () => {
    if (this._destroyed) { return }
    this.refresh()
    setTimeout(this.loop, this._refreshRate)
  }

  /**
   * Create and put image in slider
   */
  putImage = (img, i) => {
    const image = dom.create('img')
    image.style.position = 'absolute'
    image.style.transformOrigin = 'top left'
    image.style.left = `${i * 100}%`
    image.src = img.src
    img.domEl = image
    this._slider.appendChild(image)
  }

  /**
   * Refresh all. Check for needed images, boundaries
   */
  refresh = () => {
    this.loadNeededImages()
    this._bounds = dom.getBounds(this._slider)
    dom.translate(this._slider, this._index * this._bounds.width * -1)
    this._images.forEach(this.scaleImage)
  }

  /**
   * Scale and translate image, to fit screen
   */
  scaleImage = (img, i) => {
    if (img.loaded) {

      // remove loader if exists
      if (img.loader) {
        this._slider.removeChild(img.loader)
        img.loader = null
      }

      // put image if not in dom
      if (!img.domEl) {
        this.putImage(img, i)
      }

      const { width, height } = this._bounds
      const { el, domEl } = img

      let w = el.naturalWidth
      let h = el.naturalHeight

      let scale = 1

      if (w > width) {
        scale = width / el.naturalWidth
        h *= scale
      }

      if (h > height) {
        scale = height / el.naturalHeight
        w *= scale
      }

      const x = (width - (scale * el.naturalWidth)) / 2
      const y = (height - (scale * el.naturalHeight)) / 2

      img.domEl.style.opacity = 1
      dom.ajust(domEl, scale, x, y)

    } else if (!img.loader) {
      this.putLoader(img, i)
    }
  }

  /**
   * Draw a loader
   */
  putLoader (img, i) {
    const loader = dom.create('div')
    loader.innerHTML = 'LOADING'
    loader.style.position = 'absolute'
    loader.style.left = `${i * 100 + 50}%`
    loader.style.top = '50%'
    loader.style.transform = 'translate(-50%, -50%)'
    this._slider.appendChild(loader)
    img.loader = loader
  }

  /**
   * Load the current img, and prev/next if needed
   */
  loadNeededImages () {
    const now = Date.now()
    const imgsToLoad = [
      this._images[this._index],
      this._index > 0 ? this._images[this._index - 1] : null,
      this._index < this._images.length - 1 ? this._images[this._index + 1] : null
    ]

    imgsToLoad
      .filter(img => !!img && !img.loaded && !img.loading && (!img.lastFetch || now - img.lastFetch > this._fetchRate))
      .map(this.loadImage)
  }

  /**
   * Load an image
   * Attach error prop to it if failed
   */
  loadImage = (img) => {
    img.loading = true
    imageHelper.load(img.src, (err, el) => {
      img.loading = false
      if (err) {
        img.error = true
        img.lastFetch = Date.now()
      } else {
        img.el = el
        img.loaded = true
      }
    })
  }

  enableAnim () {
    this._slider.style.transition = `${this._duration}ms ease-in-out transform`
    this._pendingAnimations += 1
    setTimeout(() => {
      this._pendingAnimations -= 1
      if (this._pendingAnimations === 0) {
        this._slider.style.transition = 'none'
      }
    }, this._duration + 10)
  }

  /**
   * Increase index
   */
  next () {
    if (this._index < this._images.length - 1) {
      ++this._index
      this.enableAnim()
      this.refresh()
    }
  }

  /**
   * Decrease index
   */
  prev () {
    if (this._index > 0) {
      --this._index
      this.enableAnim()
      this.refresh()
    }
  }

}

module.exports = Storyboard
