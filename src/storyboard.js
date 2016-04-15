require('es6-promise').polyfill()

import * as imageHelper from 'helpers/image'
import * as dom from 'helpers/dom'

class Storyboard {

  constructor (container, imagesSrcs, initialIndex) {

    this._index = initialIndex || 0
    this._offset = this._index
    this._duration = 1500
    this._listeners = {}
    this._container = container
    this._images = imagesSrcs.map(src => ({ src, loaded: false }))
    this._canvas = dom.create('canvas')
    this._ctx = this._canvas.getContext('2d')
    this._easing = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    this._touchX = 0

    this.render()

  }

  // --------------------------------
  //          Image loading
  // --------------------------------

  loadImage (img) {
    img.loading = true
    return imageHelper.load(img.src)
      .then(el => {
        img.el = el
        img.loaded = true
      })
      .catch(() => { img.error = true })
      .then(() => {
        img.loading = false
      })
  }

  // --------------------------------
  //           Navigation
  // --------------------------------

  next () {
    if (this._index < this._images.length - 1) {
      ++this._index
      this.animate()
    }
  }

  prev () {
    if (this._index > 0) {
      --this._index
      this.animate()
    }
  }

  // --------------------------------
  //             Canvas
  // --------------------------------

  render () {
    this.resize()
    dom.clearAndAppend(this._container, this._canvas)
    if (!this._resizeListener) {
      window.addEventListener('resize', this.refresh)
      this._resizeListener = true
    }
    this.draw()
    this.on('load-progress', this.draw)
  }

  resize () {
    this._bounds = dom.getBounds(this._container)
    this._canvas.width = this._bounds.width
    this._canvas.height = this._bounds.height
  }

  refresh = () => {
    this.resize()
    this.draw()
  }

  clear () {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  draw = () => {
    this.clear()
    this._images.forEach((img, i) => this.drawImage(i))
  }

  drawImage (i) {

    // canvas dimensions
    const { width, height } = this._canvas

    // save canvas context
    this._ctx.save()

    // get translation offset
    const offset = i - this._offset

    // prevent render images outside of screen
    if (Math.abs(offset) > 1) { return }

    // translate context with actual index and offset
    this._ctx.translate(offset * width, 0)

    // image to draw
    const img = this._images[i]

    // check if image is loaded
    if (img.loaded) {

      // get dom element
      const { el } = img

      let w = el.naturalWidth
      let h = el.naturalHeight
      const ratio = w / h

      if (w > width) {
        w = width
        h = w / ratio
      }

      if (h > height) {
        h = height
        w = h * ratio
      }

      const x = (width - w) / 2
      const y = (height - h) / 2

      this._ctx.drawImage(img.el, x, y, w, h)

    } else {

      const now = Date.now()

      if (!img.loading && (!img.lastFetch || now - img.lastFetch > 1e3)) {
        img.lastFetch = now
        this.loadImage(img)
          .then(() => {
            if (img.error) {
              setTimeout(this.draw.bind(this), 1.1e3)
            } else {
              this.draw()
            }
          })
      }

      // show loader
      this._ctx.beginPath()
      this._ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      this._ctx.rect(50, 50, width - 100, height - 100)
      this._ctx.fill()
      this._ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      this._ctx.font = '40px monospace'
      this._ctx.textAlign = 'center'
      this._ctx.fillText('loading...', width / 2, height / 2)

    }

    // restore canvas context
    this._ctx.restore()
  }

  animate () {
    this._end = Date.now() + this._duration
    if (this._animating) { return }
    this._animating = true
    this.tick()
  }

  tick = () => {

    const now = Date.now()
    const remaining = this._end - now

    const easing = this._easing(remaining / this._duration) * 1

    if (this._index > this._offset) {
      this._offset += (this._index - this._offset) * (1 - easing)
    } else {
      this._offset -= (this._offset - this._index) * (1 - easing)
    }

    this.draw()

    if (remaining < 50) {
      this._offset = this._index
      this.draw()
      this._animating = false
      return
    }

    requestAnimationFrame(this.tick)

  }

  // --------------------------------
  //          Event emitter
  // --------------------------------

  on (event, fn) {
    const listeners = this._listeners[event] || []
    if (listeners.indexOf(fn) === -1) {
      listeners.push(fn)
    }
    this._listeners[event] = listeners
  }

  off (event, fn) {
    let listeners = this._listeners[event] || []
    if (fn) {
      const index = listeners.indexOf(fn)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    } else {
      listeners = []
    }
    this._listeners[event] = listeners
  }

  trigger (event, args = []) {
    const listeners = this._listeners[event] || []
    listeners.forEach(listener => {
      listener(...args)
    })
  }

}

module.exports = Storyboard
