function ln(x, animationTime) {
  return x === 0 ? 0 : Math.log(animationTime / x);
}

function line() {
  return 1;
}

function lineUp(x) {
  return x;
}

function lineDown(x, animationTime) {
  return -x + animationTime
}

function createTickSpeeds(animationTime, FPS, mode, customAnimationFunc) {
  let summa = 0;
  let speeds = [];
  let tick = 0;

  let animationFunc

  switch (mode) {
    case 'line':
      animationFunc = line
      break;
    case 'ln':
      animationFunc = ln
      break;
    case 'lineUp':
      animationFunc = lineUp
      break;
    case 'lineDown':
      animationFunc = lineDown
      break;
    case 'custom':
      animationFunc = customAnimationFunc
      break;
  }

  while (tick < animationTime * (FPS / 1000)) {
    let speed = animationFunc(tick * (1000 / FPS), animationTime);
    summa += speed;
    speeds.push(speed);
    tick++;
  }
  return speeds.map((i) => i / summa);
}

export class Animation {
  constructor (target) {
    this.target = target
    this.actions = []
  }

  to(values, time, FPS = 50, mode='line', customAnimationFunc = () => {}) {
    this.actions.push({type: 'animation', values, time, FPS, mode, speeds: createTickSpeeds(time, FPS, mode, customAnimationFunc)})
    return this
  }

  wait(time) {
    this.actions.push({type: 'wait', time})
    return this
  }

  call(callback) {
    this.callback = callback
    return this
  }

  start() {
    this.actions.forEach((action, index) => {
      // Опеределяем задержку для начала нового action
      let wait = 0
      for (let i = 0; i < index; i++) {
        wait += this.actions[i]['time']
      }


      // Проверяем, нужно после этого action вызывать callback
      let call = (index === this.actions.length - 1 && !! this.callback)
      
      // запускаем анимаю только action является анимацией
      if (action['type'] === 'animation') {
        setTimeout(() => {
          let index = 0;
    
          const timer = setInterval(() => {
            for (const [key, value] of Object.entries(action['values'])) {
              this.target[key] += value * action['speeds'][index];
            }
    
            index++;
            if (index === action['speeds'].length) {
              clearInterval(timer);
              if (call) {
                this.callback()
              }
            }
          }, 1000 / action.FPS);
        }, wait)
      }
    })
    return this
  }

  reverse() {
    /**
     * Создание обратной анимации
     */
    const reverse = new Animation(this.target)
    this.actions.forEach(action => {
      if (action.type === 'animation') {
        let values = Object.assign({}, action.values);

        for (let key in values) {
          values[key] = -values[key]
        }

        reverse.to(values, action.time, action.FPS, action.mode, action.customAnimationFunc)
      } else if (action.type === 'wait') {
        reverse.wait(action.time)
      }
    })

    return reverse

  }
}

export class AnimationMix {
  constructor() {
    this.animations = Object.values(arguments)
  }

  start() {
    this.animations.forEach(animation => {
      animation.start()
    })
  }

  reverse() {
    return new AnimationMix(...this.animations.map(animation => animation.reverse()))
  }
}