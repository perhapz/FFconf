// ==UserScript==
// @name           DMMGirl
// @namespace      null
// @description    DMM.R18/mono/dvd tweak for non-member: show big cover, preload sample picture, local wishlist, remove member functions...
// @version        1.0.4
// @updateURL      https://userscripts.org/scripts/source/123770.meta.js
// @include        http://www.dmm.co.jp/mono/dvd/-/list/*
// @include        http://www.dmm.co.jp/error/-/area/=/navi=none/*
// @include        http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=*
// ==/UserScript==
var detail = {
  init: function () {
    this.replaceRcolumn();
    this.showCover();
    this.addPreloadRadio();
  },
  //==Add preload radio button==
  addPreloadRadio: function () {
    var headline = getCn("headline mg-b10 lh3")[0];
    if (headline) {
      var link = document.createElement('input');
      link.type = "radio";
      link.id = "prelink";
      link.addEventListener("click", this.onPreloadSample, false);
      headline.appendChild(link);
      headline.appendChild(document.createTextNode("Preload "));
    }
  },
  //==Preload previews==
  onPreloadSample: function () {
    this.removeEventListener('click', detail.onPreloadSample, false);
    var sample = getCn('mg-b6');
    var i = 0;
    var block = getId("sample-image-block");
    var newblock = document.createElement('div');
    if (sample[0].tagName === "DIV") {
      i = 1;
    }
    for (i; i < sample.length; i++) {
      var pic = document.createElement('img');
      pic.src = sample[i].src.replace('-', 'jp-');
      pic.height = 73;
      pic.style.border = '2px solid white';
      pic.className = 'galpic';
      pic.addEventListener('click', gal.onShowPic, false);
      newblock.appendChild(pic);
    }
    block.parentNode.replaceChild(newblock, block);
  },

  //==Show big cover==
  showCover: function () {
    var sample = getCn('float-l mg-b20 mg-r12')[0];
    var img = getCn('tdmm')[0];
    img.src = img.src.replace('ps.jpg', 'pl.jpg');
    removeChildren(sample);
    sample.className = 'mg-b20 mg-r12';
    sample.appendChild(img);
  },
  replaceRcolumn: function () {
    var rcolumn = getCn('vline')[0].nextElementSibling;
    var info = getCn('mg-b20')[1];
    var tbody = info.firstElementChild; //remove last 2 rows
    tbody.removeChild(tbody.lastElementChild);
    var review = getId('review-list');
    if (review) {
      var star = tbody.lastElementChild.lastElementChild;
      var vote = getCn('count')[0];
      if (vote) {
        star.lastElementChild.innerHTML = '(' + vote.innerHTML + ')';
      }
      else {
        star.lastElementChild.innerHTML = '(0)';
      }
      review.parentNode.parentNode.removeChild(review.parentNode);
    }
    var box = getCn('bx-option mg-t20')[0];
    if (box) {
      box.parentNode.removeChild(box);
    }
    var tag = getId('producttag');
    tag.parentNode.removeChild(tag);
    var desc = info.nextElementSibling.nextElementSibling;
    var another = getCn('another')[0];
    var actress = getId('avcast_text');
    removeChildren(rcolumn);
    var div = document.createElement('div');
    div.id = 'mybox';
    div.setAttribute('style', 'font-size:1.2em;font-weight:bold;background-color:#F7FDFF;border:1px solid #CCCCCC;padding: 5px;margin-bottom:20px;');
    var add = document.createElement('a');
    add.href = '#';
    add.appendChild(document.createTextNode('Add to Wishlist'));
    add.addEventListener("click", this.onAddWish, false);
    var view = document.createElement('a');
    view.href = 'http://www.dmm.co.jp/error/-/area/=/navi=none/';
    view.appendChild(document.createTextNode('View Wishlist'));
    div.appendChild(add);
    div.appendChild(document.createElement('br'));
    div.appendChild(view);
    div.appendChild(document.createElement('br'));
    rcolumn.appendChild(div);
    rcolumn.appendChild(info);
    rcolumn.appendChild(desc);
    if (another) {
      rcolumn.appendChild(another);
    }
    rcolumn.appendChild(actress);
  },
  //==Add to wishlist==
  onAddWish: function () {
    var tds = getCn('nw'); //[date,length,actress,director,series,maker,label,genre,cid]
    var date = tds[0].nextElementSibling;
    var actress = tds[2].nextElementSibling;
    var maker = tds[5].nextElementSibling;
    var cid = tds[8].nextElementSibling.innerHTML;
    var title = getId('title'); //get title
    var detail = date.innerHTML + '#' + actress.innerHTML + '#' + maker.innerHTML + '#' + title.innerHTML;
    localStorage.setItem(cid, detail);
  }


};
var list = {
  init: function () {
    var smallThumb = getCn("mg-r6");
    for (var i = 0; i < smallThumb.length; i++) {
      smallThumb[i].addEventListener("mouseover", this.onShowThumb, false);
    }
    var thumb = new Image();
    thumb.id = 'hoverpic';
    thumb.style.position = 'absolute';
    thumb.style.zIndex = 22;
    thumb.style.display = 'none';
    thumb.addEventListener("mouseout", this.onRemoveThumb, false);
    var a = document.createElement('a');
    a.appendChild(thumb);
    document.body.appendChild(a);
  },
  onShowThumb: function () {
    if (this.src.search('noimage') === -1) {
      var thumb = getId('hoverpic');
      thumb.src = this.src.replace("pt.jpg", "ps.jpg");
      var pos = this.getBoundingClientRect();
      thumb.style.left = pos.left - 29 + window.pageXOffset + 'px'; //147*200,90*122
      thumb.style.top = pos.top - 39 + window.pageYOffset + 'px';
      thumb.width = 147;
      thumb.height = 200;
      thumb.style.display = 'block';
      thumb.parentNode.href = 'http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=' + getCid(this.src).replace(/so$/, '') + '/';
    }
  },
  onRemoveThumb: function () {
    this.style.display = 'none';
    this.src = null;
    this.parentNode.href = null;
  }
};
var wish = {
  dvd: [],
  sortType: ['cid', 'date', 'actress', 'maker'],
  init: function () {
    document.title = 'Wishlist';
    GM_addStyle(' \
      body,table {color:#333333; font-size:12px; font-family:"MS PGothic","Osaka";} \
      a:link {color:#005FC0; text-decoration:none;} \
      a:visited {color:#005FC0; text-decoration:none;} \
      a:hover,a:active {color:#EE2200; text-decoration:underline;} \
      table {text-align:center; width:590px; border-collapse:separate; border-spacing:5px;} \
      table th {font-size:1.1em; padding:2px; background-color:#242424; color:#ffffff} \
      table th:hover {cursor:pointer} \
      table td {padding:2px; background-color:#F8F8F8; border:1px solid #CCCCCC;} \
      p {text-align:left}');
    document.body.innerHTML = ' \
      <table> \
        <thead> \
          <tr> \
            <th width="3%">#</th> \
            <th width="15%">Cover</th> \
            <th width="30%" id="cid">CID</th> \
            <th width="17%" id="actress">Actress</th> \
            <th width="17%" id="maker">Maker</th> \
            <th width="14%" id="date">Date</th> \
            <th width="4%">X</th> \
          </tr> \
        </thead> \
        <tbody id="wishlist"></tbody> \
      </table>';
    this.createObj();
    this.fillTable();
  },
  onSort: function () {
    for (var i = 0; i < 4; i++) {
      getId(wish.sortType[i]).style.backgroundColor = '#242424';
    }
    this.style.backgroundColor = '#C10000';
    wish.dvd.sort(wish.by(this.id));
    wish.fillTable();
  },
  by: function (type) {
    return function (a, b) {
      var c = a[type];
      var d = b[type];
      if (c === d) {
        return 0;
      }
      if (c < d) {
        return -1;
      }
      else {
        return 1;
      }
    };
  },
  createObj: function () {
    function Dvd(cid, date, actress, maker, title) {
      this.cid = cid;
      this.date = date;
      this.actress = actress;
      this.maker = maker;
      this.title = title;
    }
    for (var i = 0; i < localStorage.length; i++) {
      var cid = localStorage.key(i);
      var info = localStorage[cid].split('#'); //Date[0]#Actress[1]#Maker[2]#Title[3]
      info[1] = info[1].replace(/></g, '><br /><');
      this.dvd[i] = new Dvd(cid, info[0], info[1], info[2], info[3]);
    }
    //this.dvd.sort(this.by('date'));
  },
  fillTable: function () {
    for (var i = 0; i < 4; i++) {
      getId(this.sortType[i]).addEventListener("click", this.onSort, false);
    }
    var list = getId('wishlist');
    removeChildren(list);
    for (i = 0; i < this.dvd.length; i++) {
      var item = document.createElement('tr');
      item.innerHTML = ' \
        <td height="130">' + (i + 1) + '</td> \
        <td><img src="http://pics.dmm.co.jp/mono/movie/' + this.dvd[i].cid + '/' + this.dvd[i].cid + 'pt.jpg" /></td> \
        <td><a href="http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=' + this.dvd[i].cid.replace(/so$/, '') + '/">' + this.dvd[i].cid + '<br /></a><p>' + this.dvd[i].title + '</p></td> \
        <td>' + this.dvd[i].actress + '</td> \
        <td name="maker">' + this.dvd[i].maker + '</td> \
        <td>' + this.dvd[i].date + '</td> \
        <td><a href="" onclick="localStorage.removeItem(\'' + this.dvd[i].cid + '\')">' + 'X' + '</a></td>';
      list.appendChild(item);
    }

  }
};
var fav = {
  init: function () {
    GM_addStyle(' \
      #header .hd-lnav ul li ul li {position: relative;top:-4em;margin:0;background-color:#242424} \
      #header .hd-lnav ul li ul {display:none; position:absolute;} \
      #header .hd-lnav ul li>ul {top: auto;left: auto;} \
      #header .hd-lnav ul li:hover ul {display:block}');
    this.addMaker();
    this.addLink();
  },
  addMaker: function () {
    function Menu(name, id) {
      this.name = name;
      this.id = id;
    }
    var maker = [];
    maker[0] = new Menu('Moodyz', 1509);
    maker[1] = new Menu('SOD', 45276);
    maker[2] = new Menu('IP', 1219);
    maker[3] = new Menu('S1', 3152);
    maker[4] = new Menu('Prestige', 40136);
    maker[5] = new Menu('EBODY', 5032);
    createMenu('Maker', 'maker', maker);
    var genre = [];
    genre[0] = new Menu('Titjob', 5019);
    genre[1] = new Menu('Blowjob', 5002);
    genre[2] = new Menu('Handjob', 5004);
    genre[3] = new Menu('Cum inside', 5001);
    genre[4] = new Menu('Cum on face', 5023);
    createMenu('Genre', 'keyword', genre);

    function createMenu(menu, name, menuArr) {
      var navBar = getCn("hd-lnav group")[0].firstElementChild;
      var liMenu = document.createElement('li');
      var aMenu = document.createElement('a');
      aMenu.href = '/mono/dvd/-/' + menu.toLowerCase() + '/';
      aMenu.appendChild(document.createTextNode(menu));
      liMenu.appendChild(aMenu);
      var ulMenu = document.createElement('ul');
      liMenu.appendChild(ulMenu);
      navBar.appendChild(liMenu);
      for (var i = 0; i < menuArr.length; i++) {
        var liSubmenu = document.createElement('li');
        var aSubmenu = document.createElement('a');
        aSubmenu.href = '/mono/dvd/-/list/=/article=' + name + '/id=' + menuArr[i].id + '/sort=date/';
        aSubmenu.appendChild(document.createTextNode(menuArr[i].name));
        liSubmenu.appendChild(aSubmenu);
        ulMenu.appendChild(liSubmenu);
      }
    }
  },
  addLink: function () {
    var wishLink = document.createElement('a');
    wishLink.href = 'http://www.dmm.co.jp/error/-/area/=/navi=none/';
    wishLink.appendChild(document.createTextNode('Wishlist'));
    wishLink.style.marginLeft = '5px';
    var key = getCn('popular-keyword')[0];
    key.appendChild(wishLink);
    key.style.right = '-3em';
  }
};

var gal = {
  init: function (e, width, height) {
    var div = document.createElement('div');
    var background = document.createElement('div');
    background.setAttribute('style', 'position:fixed; height:100%; width:100%; left:0; top:0; background-color:black; opacity:0.8;z-index:20');
    background.addEventListener("click", function () {
      document.body.removeChild(div);
    }, true);
    var box = document.createElement('div');
    box.id = 'box';
    box.style.position = 'absolute';
    box.style.left = window.pageXOffset + (window.innerWidth - width) / 2 + 'px';
    box.style.top = window.pageYOffset + (window.innerHeight - height) / 2 + 'px';
    box.style.zIndex = 21;
    document.body.appendChild(div);
    div.appendChild(background);
    div.appendChild(box);
    box.appendChild(e);
  },
  //==Show preview gallery==
  onShowPic: function () {
    var origin = new Image();
    origin.src = this.src;
    var leftd = document.createElement('div');
    leftd.id = 'leftd';
    leftd.setAttribute('style', 'position:absolute; left:0; top:0; height:100%; width:50%');
    leftd.addEventListener("click", gal.onShowNext, true);
    var rightd = document.createElement('div');
    rightd.id = 'rightd';
    rightd.setAttribute('style', 'position:absolute; right:0; top:0; height:100%; width:50%');
    rightd.addEventListener("click", gal.onShowNext, true);
    var image = document.createElement('div');
    image.appendChild(origin);
    image.appendChild(leftd);
    image.appendChild(rightd);
    gal.init(image, origin.width, origin.height);
  },
  //==Show next preview==
  onShowNext: function () {
    var box = this.parentNode;
    var curpic = box.firstChild;
    var gal = getCn('galpic').length;
    var num = 1;
    if (this.id === 'leftd') {
      num = -1;
    }
    var patt = /\d+(?=\.jpg$)/;
    patt.compile(patt);
    var nextnum = parseInt(curpic.src.match(patt)[0], 10) + num;
    if (nextnum <= gal && nextnum > 0) {
      var nextpic = new Image();
      nextpic.src = curpic.src.replace(patt, nextnum);
      box.style.left = window.pageXOffset + (window.innerWidth - nextpic.width) / 2 + 'px';
      box.style.top = window.pageYOffset + (window.innerHeight - nextpic.height) / 2 + 'px';
      box.insertBefore(nextpic, curpic);
      box.removeChild(curpic);
    }
    else {
      document.body.removeChild(box.parentNode.parentNode);
    }
  },
  onPlay: function () {
    var video = document.createElement('embed');
    video.width = 640;
    video.height = 480;
    video.src = sample.url;
    gal.init(video, video.width, video.height);
  }
};
var sample = {
  url: '',
  sods: [ //sod shop 640x480 http://str.sod.co.jp/201204/star_351/star_351_sample.wmv 
    'SODクリエイト', //SOD Create 45276
    'ディ�`プス', //Deep's 40003
    'ナチュラルハイ', //Natural High 40001
    'アイエナジ�`', //IEnergy 40004
    'ヒビノ', //hibino & switch<97 45277
    'V��Rプロダクツ', //V&R Products 45168
    'アキノリ', //AKNR 45289
    'DANDY', //DANDY 45286
    'LADY〜LADY', //LADYxLADY 45460
    'Hunter', //Hunter 45287
    'GARCON', //GARCON 45504
    'サディスティックヴィレッジ', //Sadistic Village 45356
    'ROCKET', //ROCKET 45371
    'AROUND', //AROUND 45562
    'KEU', //45615
    'ATOM', //45758
    'SWITCH', //>96 45914
    'F��A', //F&A 45831
    'new girl', //45887
    'SILK LABO', //45583
    'イフリ�`ト', //ifrit 45290
    'C��H', //C&H 45429
    'ピュアネスプラネット', //pureness planet 45453
    '繁�g深賀', //45455
    'シュガ�`ワ�`クス' //Sugar Works 40163
    ],
  kmps: [ //smm 320x240 http://st0.d-dx.jp/a5942/r1/unsecure/smm2012/0106/MILD-757.wmv
    //2012/0106 2011/0712 2011/0106 10/0112 09/0112/ 08/0112
    'ケイ?エム?プロデュ�`ス', //K.M.Produce: million+おかず。 40071
    'スク�`プ', //Scoop 45837
    'S��殆繁', //45434
    '嚴帑二鮫', //45858
    'バズ�`カ��BAZOOKA��', //BAZOOKA 45859
    'レアルワ�`クス', //Real Works 40185
    'なでしこ', //Nadeshiko 45216
    //also in
    'センタ�`ビレッジ', //centervillage 45016
    'h.m.p', //40027
    'クリスタル啌��', //40035
    'ワ�`プエンタテインメント', //WAAP ent. 40005
    'ドリ�`ムチケット', //dream ticket 40025
    'マックスエ�`', //MAX-A 40046
    'アップス', //UP'S 45313
    'ブリット', //bullitt 45176
    'ホットエンタ�`テイメント', //hot ent. 40045
    'マキシング', //maxing 45217 only mxgs
    'バルタン', //BALTAN 45700
    'ワンダフル��ONE DA FULL��', //45807
    'サムシング', //something 45489
    'ラマ', //lama 45416
    'HMJM' //45337
    ],
  pres: [ //500x376 http://download.prestige-av.com/sample_movie/ABS-096.wmv
    'プレステ�`ジ', //Prestige Fullsail DOC shiroutoTV saikyo magic Zetton onemore avant opus yabusame yabustyle ase digista40136
    'MAD', //45490
    'ラストラス' //LUSTROUS 45039
    //'GALLOP', //GALLOP 45735 no video
    ],
  init: function () {
    var tds = getCn('nw');
    var maker = tds[5].nextElementSibling.firstChild.innerHTML;
    var date = tds[0].nextElementSibling.innerHTML;
    var cid = tds[8].nextElementSibling.innerHTML;
    var pcid = cid.match(/([a-z]+)([0-9]+)/);
    var pdate = date.split('/');
    if (this.sods.indexOf(maker) !== -1) {
      this.url = 'http://str.sod.co.jp/' + pdate[0] + pdate[1] + '/' + pcid[1] + '_' + pcid[2] + '/' + pcid[1] + '_' + pcid[2] + '_sample.wmv';
      this.createLink();
    }
    else if (this.pres.indexOf(maker) !== -1) {
      this.url = 'http://download.prestige-av.com/sample_movie/' + pcid[1] + '-' + pcid[2] + '.wmv';
      this.createLink();
    }
    else if (this.kmps.indexOf(maker) !== -1) {
      var mon = '';
      if (pdate[0] === '2012' || pdate[0] === '2011') {
        mon = ((pdate[1] + pdate[2]) < '0701') ? '/0106/' : '/0712/';
      }
      else {
        mon = '/0112/';
      }
      this.url = 'http://st0.d-dx.jp/a5942/r1/unsecure/smm' + pdate[0] + mon + pcid[1].toUpperCase() + '-' + pcid[2] + '.wmv';
      this.createLink();
    }
  },
  createLink: function () {
    var mybox = getId('mybox');
    var play = document.createElement('a');
    play.href = 'javascript:void(0)';
    play.appendChild(document.createTextNode('Play Sample'));
    play.addEventListener("click", gal.onPlay, false);
    mybox.appendChild(play);
  }
};
//Get cid of the dvd.
function getCid(str) {
  var cid = str.match(/\w+\d+(?:so)?/);
  return cid[0];
}

function removeChildren(e) {
  while (e.firstChild) {
    e.removeChild(e.firstChild);
  }
}

function getId(id) {
  return document.getElementById(id);
}

function getCn(cn) {
  return document.getElementsByClassName(cn);
}

var page = /\/error\/-\/area\/=|\/detail\/|\/list\//.exec(location.pathname);
switch (page[0]) {
case '/list/':
  list.init();
  fav.init();
  break;
case '/error/-/area/=':
  wish.init();
  break;
case '/detail/':
  detail.init();
  fav.init();
  sample.init();
  break;
}