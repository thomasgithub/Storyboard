/* eslint-disable no-console */

import './style.css'
import Storyboard from 'storyboard'

const container = document.querySelector('.Player-screen')
const leftArrow = document.querySelector('.Player-arrow-container.left .Player-arrow')
const rightArrow = document.querySelector('.Player-arrow-container.right .Player-arrow')
const deleteScreen = document.querySelector('.Nav-item.delete-screen')
const toggleText = document.querySelector('.Nav-item.toggle-text')
const textItem = document.querySelector('.Player-text')

const images = [
  require('./images/1.jpg'),
  require('./images/2.jpg'),
  require('./images/3.jpg'),
  require('./images/4.png')
]

// create storyboard instance
const s = new Storyboard(container, images)

// add keyb events
document.addEventListener('keyup', e => {
  switch (e.which) {
  case 39:
    s.next()
    break
  case 37:
    s.prev()
    break
  default:
    break
  }
})

// add click events on arrows
leftArrow.addEventListener('click', () => s.prev())
rightArrow.addEventListener('click', () => s.next())

deleteScreen.addEventListener('click', () => {
  if (!container.parentNode) { return }
  container.parentNode.removeChild(container)
  s.destroy()
})

// show/hide text
let text = true

toggleText.addEventListener('click', () => {
  text = !text
  if (text) {
    textItem.classList.remove('hide')
  } else {
    textItem.classList.add('hide')
  }
  s.refresh()
})
