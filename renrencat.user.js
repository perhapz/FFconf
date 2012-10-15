// ==UserScript==
// @name           RenRenCat
// @namespace      null
// @description    Access public album, status and share
// @version        1.0.1
// @include        http://www.renren.com/*
// ==/UserScript==

(function(){
  GM_addStyle(' \
    #navi {float:right; font-weight:bold;} \
    #navi li {float:left; margin-left:5px} \
    #navi li>a{background-color:#336699; color:#FFFFFF;  text-decoration:none; padding:0 7px; white-space:nowrap; display:block} \
    #navi li:hover>a{background-color:#FFFFFF; color: #336699} \
    #navi li ul li {float:none; position:relative; z-index:99} \
    #navi li ul {display:none; position:absolute; top:auto; left:auto;} \
    #navi li:hover ul {display:block}');

  function Link (label, url) {
    this.label = label;
    this.url = url;
  }
  var links = [];
  links[0] = new Link('Album', 'http://photo.renren.com/getalbumprofile.do?owner=');
  links[1] = new Link('Status', 'http://status.renren.com/status/');
  links[2] = new Link('Share', 'http://share.renren.com/share/ShareList.do?id=');
  links[3] = new Link('+Fav', '');
  var id = location.href.match(/\d{8,9}/);
  var box = document.getElementsByClassName('add-guide')[0];
  var nav = document.createElement('ul');
  nav.id = 'navi';
  if (box) {
    box.appendChild(nav);
    for (var i = 0; i<links.length; i++) {
      var liMenu = document.createElement('li');
      var aMenu = document.createElement('a');
      aMenu.href = links[i].url ? (links[i].url + id) : '#';
      aMenu.textContent = links[i].label;
      liMenu.appendChild(aMenu);
      nav.appendChild(liMenu);
    }
    var favLink = document.querySelector('#navi li:last-child a');
    favLink.addEventListener('click', addFav, false);
    favLink.id = id;
    var ulSubmenu = document.createElement('ul');
    favLink.parentNode.appendChild(ulSubmenu);
    for (var i = 0; i < localStorage.length; i++) {
      var id = localStorage.key(i);
      var name = localStorage.getItem(id);
      var liSubmenu = document.createElement('li');
      var aSubmenu = document.createElement('a');
      aSubmenu.href = 'http://www.renren.com/' + id;
      aSubmenu.textContent = name;
      liSubmenu.appendChild(aSubmenu);
      ulSubmenu.appendChild(liSubmenu);
    }
  }
  function addFav () {
    localStorage.setItem(this.id, document.querySelector('.username').textContent);
  }
})();