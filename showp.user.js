// ==UserScript==
// @name           ShowP
// @namespace      null
// @description    Show big preview pictures for carib
// @include        http://www.caribbeancom.com/moviepages/*
// ==/UserScript==
var id = location.pathname.replace('index.html', 'images/');
var photo = document.getElementsByClassName('photo')[0];
if (photo) {
  photo.lastChild.innerHTML = '<img width=575 src="' + id + 'l_l.jpg">';
  for (var i = 1; i < 13; i++) {
    img = document.createElement('img');
    img.height = 100;
    img.src = id + 'g_big00' + i + '.jpg';
    if (i > 9) {
      img.src = id + 'g_big0' + i + '.jpg';
    }
    photo.lastChild.appendChild(img);
  }
}