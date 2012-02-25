// ==UserScript==
// @name           ShowHide
// @namespace      null
// @description    Move hidden block to top
// @version        1.0.0
// @updateURL      https://raw.github.com/perhapz/FFconf/master/showhide.user.js
// @include        http://64.78.167.63/bbs/viewthread.php*
// @include        http://64.78.167.62/bbs/viewthread.php*
// ==/UserScript==
var hide = document.getElementsByClassName('showhide');
if (hide) {
  var title = document.getElementById('threadtitle');
  title.appendChild(hide[0]);
}