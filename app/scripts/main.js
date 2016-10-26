/* eslint-disable */

/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
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
  'use strict';

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
    );

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
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  /**
   * The GameObject class
   */


  function GameObject(x, y, speed, radius, color) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = radius;
    this.color = color;

    this.draw = () => {
      context.beginPath()
      context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
      context.fillStyle = this.color
      context.fill()
    }

    this.leftPos = function() {
      return player.x - player.radius;
    }

    this.rightPos = function() {
      return player.x + player.radius;
    }

    this.topPos = function() {
      return player.y - player.radius;
    }

    this.bottomPos = function() {
      return player.y + player.radius;
    }
  }


  // for physics and AI movements.
  function update(delta) {

    // moving the player
    if (upArrowDown) {

      console.log(0 + " - " + player.topPos())

      if (player.topPos() < 0) {
        player.y = canvas.height + player.radius;
      } else {
        player.y -= player.speed;
      }

    }

    if (downArrowDown) {

      if (player.bottomPos() > canvas.height) {
        player.y = 0 - player.radius;
      } else {
        player.y += player.speed;
      }
    }

    if (rightArrowDown) {
      if (player.rightPos() > canvas.width) {
        player.x = 0 - player.radius;
      } else {
        player.x += player.speed;
      }
    }

    if (leftArrowDown) {

      if (player.leftPos() < 0) {
        player.x = canvas.width + player.radius;
      } else {
        player.x -= player.speed;
      }
    }


  }

  // update the screen
  function draw(interpolationPercentage) {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // draw player
    player.draw();

    // context.fillStyle="#FF0000";
    // context.fillRect(canvas.width / 2, player.bottomPos(), 10, 10);
  }

  // runs at the end of each frame
  function end(fps, panic) {
    if (panic) {
      var discardedTime = Math.round(MainLoop.resetFrameDelta());
      console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
    }
  }

  function handleKeyDown(e) {
    e = e || window.event;
    var key = e.keyCode;

    if (key == '38') {
      upArrowDown = true; }
    if (key == '40') {
      downArrowDown = true; }
    if (key == '37') {
      leftArrowDown = true; }
    if (key == '39') {
      rightArrowDown = true; }
  }

  function handleKeyUp(e) {
    e = e || window.event;
    var key = e.keyCode;

    if (key == '38') {
      upArrowDown = false; }
    if (key == '40') {
      downArrowDown = false; }
    if (key == '37') {
      leftArrowDown = false; }
    if (key == '39') {
      rightArrowDown = false; }
  }

  // Set up the canvas.
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  var upArrowDown = false;
  var downArrowDown = false;
  var leftArrowDown = false;
  var rightArrowDown = false;
  var player = new GameObject(canvas.width / 2, canvas.height / 2, 15, 50, '#F45B69');

  // Start the main loop.
  MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();

})();
