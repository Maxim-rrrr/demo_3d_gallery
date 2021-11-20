function startAnimationContent() {
    setTimeout(() => {
        $('.logo').addClass('logo--start')
    }, 2500)

    setTimeout(() => {
        $('.section_0').addClass('section_0--start')
    }, 3000)
}


export function contentScrollDown(screenIndex) {
    if (screenIndex === 0) {
        $('.logo').removeClass('logo--start')
        $('.logo').addClass('logo--not-start')
    } else if (screenIndex === 4) {
        setTimeout(() => {
            $('.footer__line').addClass('footer__line--active')
        }, 1400)
    }

    $('.section_' + screenIndex).addClass('section--hide')
    setTimeout(() => {
        $('.section_' + (screenIndex + 1)).removeClass('section--hide')
    }, 1000)
}

export function contentScrollUp(screenIndex) {
    if (screenIndex === 1) {
        $('.logo').addClass('logo--start')
        $('.logo').removeClass('logo--not-start')
    } else if (screenIndex === 5) {
        $('.footer__line').removeClass('footer__line--active')
    }

    $('.section_' + screenIndex).addClass('section--hide')
    setTimeout(() => {
        $('.section_' + (screenIndex - 1)).removeClass('section--hide')
    }, 1000)
}

$(document).ready(() => {
    startAnimationContent()
})