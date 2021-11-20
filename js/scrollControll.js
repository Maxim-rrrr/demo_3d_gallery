import { imagesScrollDown, imagesScrollUp, startImagesScrollDown, startImagesScrollUp, endImagesScrollDown, endImagesScrollUp } from './scene.js'
import { contentScrollDown, contentScrollUp } from './content.js'
import { scrollTime } from './config.js'

let scroll = false


$(document).ready(() => {
  // Поэкранный скролл
  $('html').css('overflow-y', 'hidden')
  $(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll', (event) => {
    const delta = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail);

    if (!scroll) {
      if (delta >= 0) {
        scrollUp()
      } else {
        scrollDown()
      }
    }
  });
})

let screenIndex = 0

export const scrollUp = () => {
  if (screenIndex > 0 && !scroll) {
    scroll = true

    contentScrollUp(screenIndex)

    if (screenIndex == 1) {
      startImagesScrollUp()
    } else if (screenIndex === 5) {
      endImagesScrollUp()
    } else {
      imagesScrollUp()
    }

    $('.indication-' + (screenIndex)).removeClass('indication--active')
    
    setTimeout(() => {
      scroll = false
      screenIndex -= 1
    }, scrollTime)
  }
}

export const scrollDown = () => {
  if (screenIndex < 5 && !scroll) {
    scroll = true

    contentScrollDown(screenIndex)

    if (screenIndex == 0) {
      startImagesScrollDown()
    } else if (screenIndex === 4) {
      endImagesScrollDown()
    } else {
      imagesScrollDown()
    }

    $('.indication-' + (screenIndex + 1)).addClass('indication--active')
    
    setTimeout(() => {
      scroll = false
      screenIndex += 1
    }, scrollTime)
  }
}

$('.scroll-controll__down').on('click', () => {
  scrollDown()
})

$('.scroll-controll__up').on('click', () => {
  scrollUp()
})