require('es6-promise').polyfill()

import * as imageHelper from 'helpers/image'
import * as dom from 'helpers/dom'

class Storyboard {

  constructor (container, imagesSrcs, initialIndex) {

    // animation duration
    this._duration = 500

    // index of current image
    this._index = initialIndex || 0

    // dom container
    this._container = container

    // images
    this._images = imagesSrcs.map(src => ({ src, loaded: false }))

    // ==> render
    this.render()

    this.watchResize()
    window.addEventListener('resize', this.refresh)

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
    this._slider.style.transition = `${this._duration}ms ease-in-out transform`
    this._slider.style.position = 'absolute'
    this._slider.style.top = 0
    this._slider.style.left = 0
    this._slider.style.right = 0
    this._slider.style.bottom = 0
    dom.clearAndAppend(this._container, this._slider)
    this.draw()
  }

  watchResize = () => {
    if (this._destroyed) { return }
    this.refresh()
    setTimeout(this.watchResize, 500)
  }

  draw () {
    this._bounds = dom.getBounds(this._slider)
    this._images.forEach(this.drawImage)
    this.refresh()
  }

  drawImage = (img, i) => {
    const image = dom.create('img')
    image.style.position = 'absolute'
    image.style.transition = '100ms ease-out transform'
    image.style.transformOrigin = 'top left'
    image.style.left = `${i * 100}%`
    image.src = img.src
    img.domEl = image
    this._slider.appendChild(image)
  }

  refresh = () => {
    this.loadNeededImages()
    this._bounds = dom.getBounds(this._slider)
    dom.translate(this._slider, this._index * this._bounds.width * -1)
    this._images.forEach(this.scaleImage)
  }

  scaleImage = img => {
    if (img.loaded) {

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

    } else {
      img.domEl.style.opacity = 0
    }
  }

  loadNeededImages () {
    [
      this._images[this._index],
      this._index > 0 ? this._images[this._index - 1] : null,
      this._index < this._images.length - 1 ? this._images[this._index + 1] : null
    ]
      .filter(img => !!img)
      .map(this.loadImage)
  }

  /**
   * Load an image
   * Attach error prop to it if failed
   *
   * @return {Promise} - resolved when image finished loading
   */
  loadImage = (img) => {
    img.loading = true
    return imageHelper.load(img.src)

      // all is alright
      .then(el => {
        img.el = el
        img.loaded = true
      })

      // image failed loading
      .catch(() => {
        img.error = true
      })

      // image is not loading anymore
      .then(() => {
        img.loading = false
      })
  }

  /**
   * Increase index
   */
  next () {
    if (this._index < this._images.length - 1) {
      ++this._index
      this.refresh()
    }
  }

  /**
   * Decrease index
   */
  prev () {
    if (this._index > 0) {
      --this._index
      this.refresh()
    }
  }

}

module.exports = Storyboard
