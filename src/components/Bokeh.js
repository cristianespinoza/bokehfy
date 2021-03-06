'use strict'
const Field = require('./Field');
const tinyColor = require('tinycolor2');
const { isValidNumber, fixInRange } = require('../utilities/');

class Bokeh {
  constructor(settings) {
    this.API = {
      density: this.density,
      backgroundColor: this.backgroundColor,
      transparent: this.transparent,
      radius: this.radius,
      star: this.star,
      color: this.color,
      dx: this.dx,
      dy: this.dy,
      gradient: this.gradient,
      halflife: this.halflife,
      framerate: this.framerate,
    }
    this.settingsParams = settings;
    this.parent = this.settingsParams.parent;
    this.canvas = this._createCanvas(this.parent);
    this.field = this._initField(this.canvas);
    this.settings(this.settingsParams);

    this._fitCanvas = this._fitCanvas.bind(this);
    window.addEventListener('resize', this._fitCanvas)
  };

  /**
   * Create a new bokeh field instance. The user can optionally provide a parent
   * element to attach the canvas too. If none is provided it will be attached to the
   * document body and automatically set to full screen.
   * @param  {Node} parentNode [Optional: Parent element that will contain the canvas]
   * @return {Field}        [An instance of the bokehfy field with public methods]
   */
  _initField() {
    this._fitCanvas()
    const field = new Field(this.canvas)
    return field;    
  }

  /**
   * Create a new canvas element and attach it to the DOM, sized to fit the 
   * parent element provided (defaulting to 'body' if none is provided).
   * @param  {Node} parent [Container for canvas - body if none povided]
   * @return {canvas}               [canvas element attached to DOM]
   */
  _createCanvas() {
    const canvas = window.document.createElement('canvas')
    canvas.setAttribute('style', "position: absolute; top: 0; left: 0;")
    this.parent.prepend(canvas);
    return canvas;
  }

  /**
   * Canvas will be resized to fit it's current parent
   * @param  {Canvas} canvas [Canvas already attached to DOM]
   **/
  _fitCanvas() {
    const width = this.canvas.parentNode.clientWidth;
    const height = this.canvas.parentNode.clientHeight;
    this.canvas.setAttribute('width', width)
    this.canvas.setAttribute('height', height)    
  }


  //#### API
  start() {
    this.field.start();
  }

  stop() {
    this.field.stop();
  }

  pause() {
    this.field.pause();
  }

  delete() {
    this.field.stop();
    window.removeEventListener('resize', this._fitCanvas);
    this.parent.removeChild(this.canvas);
  }

  settings(obj) {
    if(obj === Object(obj) && typeof obj === 'object') {
      const array = Object.entries(obj);
      array.forEach(cmd => {
        const key = cmd[0];
        const args = cmd[1]
        if(this.API.hasOwnProperty(key)) {
          let func = this.API[key]
          func.call(this, args)
        }
      })
    }
  }

  backgroundColor(newColor = '') {
    const color = tinyColor(newColor);
    if(color.isValid() && this.field) {
      this.field.changeBackgroundColor(color.toHexString());
    }
  }

  transparent(isTrans = false) {
    if(this.field && typeof isTrans === 'boolean') {
      this.field.setTransparency(isTrans);
    }
  }

  toggleBackground() {
    if(this.field) {
      this.field.toggleBackground();
    }
  }

  radius(newMaxRadius) {
    if(this.field && isValidNumber(newMaxRadius)) {
      const fixedMaxRadius = fixInRange(newMaxRadius, 0.00001, 1000);
      this.field.resizePoints(fixedMaxRadius);
    }
  }

  color(newPointColor = '') {
    const color = tinyColor(newPointColor)
    if(color.isValid() && this.field) {
      this.field.setGradient([color.toRgb()]);
    }
  }

  star(newStarColor = '') {
    const color = tinyColor(newStarColor)
    if(color.isValid() && this.field) {
      this.field.setGradient([{r: 255, g: 255, b: 255}, color.toRgb(),color.toRgb()]);
    }
  }

  gradient(colorArray) {
    if(Array.isArray(colorArray) && colorArray.length) {
      let colors = colorArray.map(color => tinyColor(color));
      if(colors.every(color => color.isValid())){
        colors = colors.map(color => color.toRgb());
        this.field.setGradient(colors);
      }
    }
  }

  density(newDensity) {
    if(this.field && isValidNumber(newDensity)) {
      const fixedDensity = fixInRange(newDensity, 0, 2000);
      this.field.changeDensity(fixedDensity);
    }
  }

  halflife(newHalflife) {
    if(this.field && isValidNumber(newHalflife)) {
      const fixedHalflife = fixInRange(newHalflife, 0.00001,10000);
      this.field.changeHalflife(fixedHalflife);
    }
  }

  framerate(newFramerate) {
    if(this.field && isValidNumber(newFramerate)) {
      const fixedFramerate = fixInRange(newFramerate, 0, 10000);
      this.field.changeFramerate(fixedFramerate);
    }
  }

  dx(newDX) {
    if(this.field && isValidNumber(newDX)) {
      const fixedDX = fixInRange(newDX, 0, 10000);
      this.field.changeDX(fixedDX);
    }
  }

  dy(newDY) {
    if(this.field && isValidNumber(newDY)) {
      const fixedDY = fixInRange(newDY, 0, 10000);
      this.field.changeDY(fixedDY);
    }
  }

}

module.exports = Bokeh;