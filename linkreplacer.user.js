// ==UserScript==
// @name           LinkReplacer
// @namespace      null
// @description    Replace link with image for freedl.org
// @version        1.0.4
// @updateURL      https://raw.github.com/perhapz/FFconf/master/linkreplacer.user.js
// @include        http://www.freedl.org/*
// @include        http://www.alabout.com/*
// ==/UserScript==
var box = document.createElement('input');
box.type = "checkbox";
box.addEventListener('click', preLoad, false);
document.body.insertBefore(box, document.body.firstChild);
var link = document.getElementsByTagName('a');
for (var i = 0; i < link.length; i++) {
  if (/http:\/\/(www\.)?(alabout|alafs)\.com\/j\.phtml\?url=/.test(link[i].href)) {
    link[i].href = link[i].textContent;
  }
  var site = /mrjh\.org|pics\.dmm\.co\.jp|imgchili\.com|imageporter\.com|imagecarry\.com|imagedunk\.com|picleet\.com|picturedip\.com|piclambo\.net|imagetwist\.com|imagehyper\.com/i.exec(link[i].href);
  //prestige\.shard\.jp|image\.prestige-av\.com|slide\.com|picshare\.eu
  if (site) {
    switch (site[0]) {
    case 'mrjh.org':
      link[i].href = link[i].href.replace('gallery.php?entry=', '');
      fixLink(link[i]);
      break;
    case 'pics.dmm.co.jp':
    //case 'prestige.shard.jp':
    //case 'image.prestige-av.com':
    //case 'slide.com':
      fixLink(link[i]);
      break;
    case 'imgchili.com':
    case 'imageporter.com':
    case 'imagecarry.com':
    case 'imagedunk.com':
    case 'picleet.com':
    case 'picturedip.com':
    case 'piclambo.net':
    case 'imagetwist.com':
    case 'imagehyper.com'
    //case 'picshare.eu':
      link[i].name = 'plink';
      link[i].addEventListener('mouseover', requestPic, false);
      break;
    }
  }
}

function fixLink(a) {
  a.name = 'plink';
  a.addEventListener('mouseover', loadPic, false);
}

function loadPic() {
  var link = this;
  link.removeEventListener('mouseover', loadPic, false);
  img = document.createElement('img');
  img.src = link.href;
  link.removeChild(link.firstChild);
  link.appendChild(img);
}

function requestPic() {
  var link = this;
  link.removeEventListener('mouseover', requestPic, false);
  GM_xmlhttpRequest({
    method: "GET",
    url: link.href,
    onload: function (response) {
      var src = response.responseText.match(/http:\/\/(img\d\d|i[123]\.imgchili|img\d|picshare\.eu\/data)[^"\s]+/); //http://img52.imageporter.com/i/00297/49x4s6jbrku8.jpg" id="looz1oo"http://picshare.eu/data/IMG
      img = document.createElement('img');
      if (src) {
        img.src = src[0];
        link.href = img.src;
        link.removeChild(link.firstChild);
        link.appendChild(img);
      }
      else {
        link.addEventListener('mouseover', requestPic, false);
      }
    },
    onerror: function () {
      link.addEventListener('mouseover', requestPic, false);
    }
  });
}

function preLoad() {
  var plink = document.getElementsByName('plink');
  for (var i = 0; i < plink.length; i++) {
    if (plink[i].previousSibling === null || plink[i].previousSibling.previousSibling.name !== 'plink') {
      if (plink[i].previousElementSibling.previousElementSibling && plink[i].previousElementSibling.previousElementSibling.previousElementSibling && plink[i].nextElementSibling && plink[i].nextElementSibling.nextElementSibling) {
        if (plink[i].previousElementSibling.previousElementSibling.previousElementSibling.name === 'plink' && plink[i].nextElementSibling.nextElementSibling.name == 'plink') {
          continue;
        }
      }
      var evt = document.createEvent('MouseEvents');
      evt.initEvent('mouseover', true, false);
      plink[i].dispatchEvent(evt);
    }
  }
}