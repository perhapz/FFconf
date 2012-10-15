// ==UserScript==
// @name           LinkReplacer
// @namespace      null
// @description    Replace link with image for freedl.org
// @version        1.0.6
// @updateURL      https://raw.github.com/perhapz/FFconf/master/linkreplacer.user.js
// @include        http://www.freedl.org/*
// @include        http://www.alabout.com/*
// @include        http://alabout.com/*
// ==/UserScript==
var box = document.createElement('input');
box.type = "checkbox";
box.addEventListener('click', preLoad, false);
document.body.insertBefore(box, document.body.firstChild);
var link = document.getElementsByTagName('a');
var pattLink = /http:\/\/(www\.)?(alabout|alafs)\.com\/j\.phtml\?url=/;
pattLink.compile(pattLink);
var pattSite = /mrjh\.org|pics\.dmm\.co\.jp|imgchili\.com|imageporter\.com|imagecarry\.com|imagedunk\.com|picleet\.com|picturedip\.com|piclambo\.net|imagetwist\.com|imagehyper\.com/i;
pattSite.compile(pattSite);
for (var i = 0, len = link.length; i < len; i++) {
  if (pattLink.test(link[i].href)) {
    link[i].href = link[i].textContent;
  }
  var site = pattSite.exec(link[i].href);
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
    case 'imagehyper.com':
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
  var img = document.createElement('img');
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
      var src = response.responseText.match(/http:\/\/(img\d\d|i[1234]\.imgchili|img\d\.imagehyper\.com\/img)[^"\s]+/); //http://img52.imageporter.com/i/00297/49x4s6jbrku8.jpg" id="looz1oo"http://picshare.eu/data/IMG
      var img = document.createElement('img');
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
  var block = document.getElementsByTagName('blockquote');
  var evt = document.createEvent('MouseEvents');
  evt.initEvent('mouseover', true, false);
  for (var i =0; i < block.length; i++) {
    var plink = block[i].querySelectorAll('a[name="plink"]');
    if (plink[0]) {
      plink[0].dispatchEvent(evt);
    }
    for (var j = 1; j < plink.length; j++) {
      if (plink[j].previousSibling.previousSibling.name !== 'plink' && (!plink[j].nextSibling || plink[j].nextSibling.nextSibling.name !== 'plink')) {
          plink[j].dispatchEvent(evt);
      }
    }
  }
}