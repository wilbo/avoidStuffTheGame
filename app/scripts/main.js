/* eslint-disable */

/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License")
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {

'use strict'

// Check to make sure service workers are supported in the current browser,
// and that the current page is accessed from a secure origin. Using a
// service worker from an insecure origin will trigger JS console errors. See
// http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  )

if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
  navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    // updatefound is fired if service-worker.js changes.
    registration.onupdatefound = function() {
      // updatefound is also fired the very first time the SW is installed,
      // and there's no need to prompt for a reload at that point.
      // So check here to see if the page is already controlled,
      // i.e. whether there's an existing service worker.
      if (navigator.serviceWorker.controller) {
        // The updatefound event implies that registration.installing is set:
        // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
        var installingWorker = registration.installing

        installingWorker.onstatechange = function() {
          switch (installingWorker.state) {
            case 'installed':
              // At this point, the old content will have been purged and the
              // fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available please refresh." message in the page's interface.
              break

            case 'redundant':
              throw new Error('The installing ' +
                              'service worker became redundant.')

            default:
              // Ignore
          }
        }
      }
    }
  }).catch(function(e) {
    console.error('Error during service worker registration:', e)
  })
}

/**
 * The GameObject class
 */

class GameObject {
  constructor(context, speed, radius, color) {
    this._speed = speed
    this._radius = radius
    this._color = color
    this._context = context
  }

  draw() {
    this.shape(this._x, this._y)
    this.infiniteCanvas()
  }

   // the shape of the object
  shape(x ,y) {
    this._context.beginPath()
    this._context.arc(x, y, this._radius, 0, 2 * Math.PI, false)
    this._context.fillStyle = this._color
    this._context.fill()
  }

  infiniteCanvas() {
    // reset positions if out of bounds
    if (this.centerOnBoundsTop())
      this._y = this.getCanvasHeight()
    if (this.centerOnBoundsBottom())
      this._y = 0
    if (this.centerOnBoundsRight())
      this._x = 0
    if (this.centerOnBoundsLeft())
      this._x = this.getCanvasWidth()

    // shape mirroring
    if (this.touchesBoundsTop())
      this.shape(this._x, this._y + this.getCanvasHeight())

    if (this.touchesBoundsBottom())
      this.shape(this._x, this._y - this.getCanvasHeight())

    if (this.touchesBoundsRight())
      this.shape(this._x - this.getCanvasWidth(), this._y)

    if (this.touchesBoundsLeft())
      this.shape(this._x + this.getCanvasWidth(), this._y)

    if (this.touchesBoundsTop() && this.touchesBoundsLeft())
      this.shape(this._x + this.getCanvasWidth(), this._y + this.getCanvasHeight())

    if (this.touchesBoundsTop() && this.touchesBoundsRight())
      this.shape(this._x - this.getCanvasWidth(), this._y + this.getCanvasHeight())

    if (this.touchesBoundsBottom() && this.touchesBoundsLeft())
      this.shape(this._x + this.getCanvasWidth(), this._y - this.getCanvasHeight())

    if (this.touchesBoundsBottom() && this.touchesBoundsRight())
      this.shape(this._x - this.getCanvasWidth(), this._y - this.getCanvasHeight())
  }

  // measurements
  getWidth() { return this._radius * 2}
  getHeight() { return this._radius * 2}
  getCanvasWidth() { return this._context.canvas.width }
  getCanvasHeight() { return this._context.canvas.height }
  getOuterLeft() { return this._x - this._radius}
  getOuterRight() { return this._x + this._radius}
  getOuterTop() { return this._y - this._radius}
  getOuterBottom() { return this._y + this._radius}

  // moving
  moveUp(delta) { this._y -= this._speed * delta }
  moveDown(delta) { this._y += this._speed * delta }
  moveRight(delta) { this._x += this._speed * delta }
  moveLeft(delta) { this._x -= this._speed * delta }

  // touches canvas bounds
  touchesBoundsTop() { return this._y < this._radius }
  touchesBoundsBottom() { return this._y > this.getCanvasHeight() - this._radius}
  touchesBoundsLeft() { return this._x < this._radius }
  touchesBoundsRight() { return this._x > this.getCanvasWidth() - this._radius }

  // center of shape touches canvas bounds
  centerOnBoundsTop() { return this._y < 0 }
  centerOnBoundsBottom() { return this._y > this.getCanvasHeight()}
  centerOnBoundsLeft() { return this._x < 0 }
  centerOnBoundsRight() { return this._x > this.getCanvasWidth() }

  // shape is out of bounds
  outOfBoundsTop() { return this._y < -this._radius }
  outOfBoundsBottom() { return this._y > this.getCanvasHeight() + this._radius}
  outOfBoundsLeft() { return this._x < -this._radius }
  outOfBoundsRight() { return this._x > this.getCanvasWidth() + this._radius }

}

class Player extends GameObject {
  constructor(context, speed, radius, color) {
    super(context, speed, radius, color)

    // spawn object at center of canvas
    this._x = this.getCanvasWidth() / 2
    this._y = this.getCanvasHeight() / 2
  }
}

class Enemy extends GameObject {
  constructor(context) {
    super(context, 0, 0, '#E8D153')

    this._direction = 0
    this.resetEnemyProperties()
  }

  draw() {
    this.shape(this._x, this._y)

    // if enemy out of canvas
    if (this.outOfBoundsBottom() || this.outOfBoundsTop() || this.outOfBoundsLeft() || this.outOfBoundsRight()) {
      this.resetEnemyProperties()
    }
  }

  resetEnemyProperties() {
    this._direction = this.getRandomInt(0, 3)
    this._radius = this.getRandomInt(25, 75)
    this._speed = this.getRandomFloat(0.3, 0.5)

    switch (this._direction) {
      case 0:
        this._x = this.getRandomInt(0, this.getCanvasWidth())
        this._y = this.getCanvasHeight() + this._radius
        this.move = function(delta) { this._y -= this._speed * delta }
        break;
      case 1:
        this._x = this.getRandomInt(0, this.getCanvasWidth())
        this._y = 0 - this._radius
        this.move = function(delta) { this._y += this._speed * delta }
        break;
      case 2:
        this._x = 0 - this._radius
        this._y = this.getRandomInt(0, this.getCanvasHeight())
        this.move = function(delta) { this._x += this._speed * delta }
        break;
      case 3:
        this._x = this.getCanvasWidth() + this._radius;
        this._y = this.getRandomInt(0, this.getCanvasHeight())
        this.move = function(delta) { this._x -= this._speed * delta }
        break;
    }
  }

  getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
}

class GameLoop {
  constructor(game) {
    this._game = game
  }

  update(delta) {
    // moving the player
    if (upArrowDown) { this._game._player.moveUp(delta) }
    if (downArrowDown) { this._game._player.moveDown(delta) }
    if (rightArrowDown) { this._game._player.moveRight(delta) }
    if (leftArrowDown) { this._game._player.moveLeft(delta) }

    // moving enemies
    this._game._enemies.forEach((enemy) => {
      enemy.move(delta)

      // game options
      if (!this._game._idle) {
        this._game.onCollision(enemy)
        this._game.updateScore()
      }
    })
  }

  draw(interpolationPercentage) {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    if (!this._game._idle) {
      this._game._player.draw()
    }

    this._game._enemies.forEach((enemy) => {
      enemy.draw()
    })
  }

  end(fps, panic) {
    if (panic) {
      var discardedTime = Math.round(MainLoop.resetFrameDelta())
      console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms')
    }
  }

  start() {
    MainLoop
      .setUpdate(this.update.bind(this))
      .setDraw(this.draw.bind(this))
      .setEnd(this.end.bind(this))
      .start()
  }

  stop() {
    MainLoop.stop()
  }

}

class Game {
  constructor() {
    this._idle = true
    this._difficulty = 3
    this._player = new Player(context, 0.75, 50, '#F45B69')
    this._enemies = []
    this.createEnemies()

    this._scoreElement = document.getElementById('score')
    this._overlay = document.getElementById('overlay')

    this._gameLoop = new GameLoop(this);
    this._gameLoop.start()

    this.gameSetup()
  }

  gameSetup() {
    this._overlay.innerHTML = '<div class="content-center"><p>Use arrow keys to move the player</p><button id="start">Start Game</button></div>'
    this._startButton = document.getElementById('start')
    this._startButton.addEventListener('click', (e) => {
      e.preventDefault()
      this._overlay.style.visibility = 'hidden'
      this._idle = false
      this._scoreElement.textContent = "score: 0"
      this.resetGame()
    });
  }

  gameOver() {
    this._gameLoop.stop()
    this._overlay.style.visibility = 'visible'
    this._scoreElement.textContent = " "

    this._overlay.innerHTML = '<div class="content-center"><h1>Game Over!</h1><p>Your score is:</p><h2 id="end-score">' + this._score  + '</h2><button id="start">Restart Game</button></div>'
    this._startButton = document.getElementById('start')
    this._startButton.addEventListener('click', (e) => {
      e.preventDefault()
      this._overlay.style.visibility = 'hidden'
      this.resetGame()
    });
  }

  resetGame() {
    this._difficulty = 3
    this._startTime = new Date().getTime()
    this._score = 1
    this._player._x = this._player.getCanvasWidth() / 2
    this._player._y = this._player.getCanvasHeight() / 2
    this._enemies = []
    this.createEnemies()
    this._gameLoop.start()
    console.log(this._enemies.length)
  }

  onCollision(enemy) {
    const dx = this._player._x - enemy._x;
    const dy = this._player._y - enemy._y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this._player._radius + enemy._radius) {
      this.gameOver()
    }
  }

  createEnemies() {
    for (let i = 0; i < this._difficulty; i++) {
      this._enemies[i] = new Enemy(context)
    }
  }

  upDifficulty() {
    // addding enemy every + 1000 score
    if (this._score % 100 == 0) {
      this._difficulty++
      this._enemies[this._difficulty] = new Enemy(context)
    }
  }

  updateScore() {
    const now = new Date().getTime()
    if (now - this._startTime > 100) {
      this._scoreElement.textContent = "score: " + this._score
      this._score++
      this.upDifficulty()
      this._startTime = new Date().getTime()
    }
  }
}



/*
    key listeners
*/

// setup listeners
document.onkeydown = handleKeyDown
document.onkeyup = handleKeyUp

// defaults
let upArrowDown = false
let downArrowDown = false
let leftArrowDown = false
let rightArrowDown = false

function handleKeyDown(e) {
  const key = e.keyCode

  if (key == '38') { upArrowDown = true }
  if (key == '40') { downArrowDown = true }
  if (key == '37') { leftArrowDown = true }
  if (key == '39') { rightArrowDown = true }
}

function handleKeyUp(e) {
  const key = e.keyCode

  if (key == '38') { upArrowDown = false }
  if (key == '40') { downArrowDown = false }
  if (key == '37') { leftArrowDown = false }
  if (key == '39') { rightArrowDown = false }
}

// Set up the canvas.
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
// full width canvas
canvas.width = window.innerWidth
canvas.height = window.innerHeight
// setup game
const game = new Game()

})()
