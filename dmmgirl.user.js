// ==UserScript==
// @name           DMMGirl
// @namespace      null
// @description    DMM.R18/mono/dvd tweak for non-member: show big cover, preload sample picture, local wishlist, remove member functions...
// @version        1.0.1
// @include        http://www.dmm.co.jp/mono/dvd/-/list/*
// @include        http://www.dmm.co.jp/coupon/check.html/=/navi=none/*
// @include        http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=*
// ==/UserScript==
var detail={
	max:10,
	init:function(){
		this.replaceRcolumn();
		this.showCover();
		this.addPreloadRadio();
	},
	//==Add preload radio button==
	addPreloadRadio:function(){
		var headline=getCn("headline mg-b10 lh3")[0];
		if (headline){
			var link=document.createElement('input');
			link.type="radio";
			link.id="prelink";
			link.addEventListener("click",this.evtPreloadSample,false);
			headline.appendChild(link);
			headline.appendChild(document.createTextNode("Preload "));
		}
	},
	//==Preload previews==
	evtPreloadSample:function(){
		this.removeEventListener('click', detail.evtPreloadSample, false);
		var sample=getCn('mg-b6');
		var i=0;
		detail.max=sample.length;
		var block=getId("sample-image-block");
		var newblock=document.createElement('div');
		if (sample[0].tagName==="DIV"){
			i=1;
			detail.max--;
			}
		for(i;i<sample.length;i++){
			var pic=document.createElement('img');
			pic.src=sample[i].src.replace('-','jp-');
			pic.height=73;
			pic.style.border='2px solid white';
			pic.addEventListener('click',detail.evtShowPic,false);
			newblock.appendChild(pic);
			}
		block.parentNode.replaceChild(newblock,block);
	},
	//==Show preview gallery==
	evtShowPic:function(){
		var origin=new Image();
		origin.src=this.src;
		var div=document.createElement('div');
		var background=document.createElement('div');
		background.setAttribute('style','position:fixed; height:100%; width:100%; left:0; top:0; background-color:black; opacity:0.8;z-index:20')
		background.addEventListener("click",function(){document.body.removeChild(div);},true);
		var box=document.createElement('div');
		box.id='box';
		box.style.position='absolute';
		box.style.left=window.pageXOffset+(window.innerWidth-origin.width)/2+'px';
		box.style.top=window.pageYOffset+(window.innerHeight-origin.height)/2+'px';
		box.style.zIndex=21;
		var leftd=document.createElement('div');
		leftd.id='leftd';
		leftd.setAttribute('style','position:absolute; left:0; top:0; height:100%; width:50%');
		leftd.addEventListener("click",detail.evtShowNext,true);
		var rightd=document.createElement('div');	
		rightd.id='rightd';
		rightd.setAttribute('style','position:absolute; right:0; top:0; height:100%; width:50%');
		rightd.addEventListener("click",detail.evtShowNext,true);
		box.appendChild(origin);
		box.appendChild(leftd);
		box.appendChild(rightd);
		div.appendChild(background);
		div.appendChild(box);
		document.body.appendChild(div);
	},
	//==Show next preview==
	evtShowNext:function(){
		var box=this.parentNode;
		var curpic=box.firstChild;
		var num=-1;
		if (this.id==='leftd'){num=1;}
		nextnum=curpic.src.match(/jp-[0-9]+/)[0].replace('jp-','')-num;
		if(nextnum<=detail.max&&nextnum>0){
			nextnum='jp-'+nextnum;
			var nextpic=new Image();
			nextpic.src=curpic.src.replace(/jp-[0-9]+/,nextnum);
			box.style.left=window.pageXOffset+(window.innerWidth-nextpic.width)/2+'px';
			box.style.top=window.pageYOffset+(window.innerHeight-nextpic.height)/2+'px';
			box.replaceChild(nextpic,curpic);
		}
		else{document.body.removeChild(box.parentNode);}
	},
	//==Show big cover==
	showCover:function (){
		var sample=getCn('float-l mg-b20 mg-r12')[0];
		var img=getCn('tdmm')[0];
		img.src=img.src.replace('ps.jpg','pl.jpg');
		removeChildren(sample);
		sample.className='mg-b20 mg-r12';
		sample.appendChild(img);
	},
	replaceRcolumn:function(){
		var rcolumn=getCn('vline')[0].nextElementSibling;
		var info=getCn('mg-b20')[1];
		var tbody=info.firstElementChild; //remove last 2 rows
		tbody.removeChild(tbody.lastElementChild);
		var review=getId('review-list');
		if (review){
			var star=tbody.lastElementChild.lastElementChild;
			var vote=getCn('count')[0];
			if (vote){
				star.lastElementChild.innerHTML='('+vote.innerHTML+')';
			}
			else {star.lastElementChild.innerHTML='(0)';}
			review.parentNode.parentNode.removeChild(review.parentNode);
		}
		var desc=info.nextElementSibling.nextElementSibling;
		var another=getCn('another')[0];
		var actress=getId('avcast_text');
		removeChildren(rcolumn);
		var div=document.createElement('div');
		div.setAttribute('style','font-size:1.2em;font-weight:bold;background-color:#F7FDFF;border:1px solid #CCCCCC;padding: 5px;margin-bottom:20px;')
		var add=document.createElement('a');
		add.href='#';
		add.appendChild(document.createTextNode('Add to Wishlist'));
		add.addEventListener("click",this.evtAddWish,false);
		var view=document.createElement('a');
		view.href='http://www.dmm.co.jp/coupon/check.html/=/navi=none/';
		view.appendChild(document.createTextNode('View Wishlist'));
		div.appendChild(add);
		div.appendChild(document.createElement('br'));
		div.appendChild(view);
		rcolumn.appendChild(div);
		rcolumn.appendChild(info);
		rcolumn.appendChild(desc);
		if (another){
			rcolumn.appendChild(another);
		}
		rcolumn.appendChild(actress);
	},
	//==Add to wishlist==
	evtAddWish:function(){
		var field=document.getElementsByTagName('td');
		for (var i=0;i<field.length;i++){//get date
			if (field[i].width==='100%'){
				var date=field[i];
				break;
			}
		}
		i+=4;//get actress
		var actress=field[i]
		i+=6;//get maker
		var maker=field[i]
		var title=getId('title')//get title
		var detail=date.innerHTML+'#'+actress.innerHTML+'#'+maker.innerHTML+'#'+title.innerHTML;
		localStorage.setItem(getCid(location.pathname),detail);
	}


};
var list={
	init:function(){
		var smallThumb = getCn("mg-r6");
		for (var i = 0; i < smallThumb.length; i++){
			smallThumb[i].addEventListener("mouseover",this.evtShowThumb,false);
		}
		var thumb=new Image();
		thumb.id='hoverpic';
		thumb.style.position='absolute';
		thumb.style.zIndex=22;
		thumb.style.display='none';
		thumb.addEventListener("mouseout",this.evtRemoveThumb,false);
		var a=document.createElement('a');
		a.appendChild(thumb);
		document.body.appendChild(a);
	},
	evtShowThumb:function(){
		if (this.src.search('noimage')===-1){
			var thumb=getId('hoverpic');
			thumb.src=this.src.replace("pt.jpg","ps.jpg");
			var pos=this.getBoundingClientRect();
			thumb.style.left=pos.left-29+window.pageXOffset+'px';//147*200,90*122
			thumb.style.top=pos.top-39+window.pageYOffset+'px';
			thumb.width=147;
			thumb.height=200;
			thumb.style.display='block';
			thumb.parentNode.href='http://www.dmm.co.jp/mono/dvd/-/detail/=/cid='+getCid(this.src)+'/';
		}
	},
	evtRemoveThumb:function(){
		this.style.display='none';
		this.src=null;
		this.parentNode.href=null;
	}
};
var wish={
	dvd:new Array(),
	sortType: ['cid','date','actress','maker'],
	init:function(){
		document.title='Wishlist';
		GM_addStyle(' \
			body,table {color:#333333; font-size:12px; font-family:"MS PGothic","Osaka";} \
			a:link {color:#005FC0; text-decoration:none;} \
			a:visited {color:#005FC0; text-decoration:none;} \
			a:hover,a:active {color:#EE2200; text-decoration:underline;} \
			table {text-align:center; width:590px; border-collapse:separate; border-spacing:5px;} \
			table th {font-size:1.1em; padding:2px; background-color:#242424; color:#ffffff} \
			table th:hover {cursor:pointer} \
			table td {padding:2px; background-color:#F8F8F8; border:1px solid #CCCCCC;} \
			p {text-align:left}'
		);
		document.body.innerHTML=' \
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
	evtSort:function(){
		for (var i=0;i<4;i++){
			getId(wish.sortType[i]).style.backgroundColor='#242424';
		}
		this.style.backgroundColor='#C10000';
		wish.dvd.sort(wish.by(this.id));
		wish.fillTable();
	},
	by:function(type){
		return function(a,b){
			var c=a[type];
			var d=b[type];
			if(c===d){
				return 0;
			}
			if(c<d){
				return -1;
			}
				else{return 1;} 
		}
	},
	createObj:function(){
		function Dvd(cid,date,actress,maker,title){
			this.cid=cid
			this.date=date;
			this.actress=actress;
			this.maker=maker;
			this.title=title;
		}
		Dvd.prototype.cid2=function(){
			if (this.cid.match(/^15/)){return this.cid+'so';}
			else return this.cid;
		}
		for(var i=0;i<localStorage.length;i++){
			var cid=localStorage.key(i);
			var info=localStorage[cid].split('#'); //Date[0]#Actress[1]#Maker[2]#Title[3]
			info[1]=info[1].replace(/></g,'><br /><');
			this.dvd[i]=new Dvd(cid,info[0],info[1],info[2],info[3])
		}
		//this.dvd.sort(this.by('date'));
	},
	fillTable:function(){
		for (var i=0;i<4;i++){
			getId(this.sortType[i]).addEventListener("click",this.evtSort,false);
		}
		var list = getId('wishlist'); 
		removeChildren(list);
		for(var i=0;i<this.dvd.length;i++){
			var item=document.createElement('tr');
			item.innerHTML = ' \
				<td height="130">' + (i+1) + '</td> \
				<td><img src="http://pics.dmm.co.jp/mono/movie/'+this.dvd[i].cid2()+'/'+this.dvd[i].cid2() +'pt.jpg" /></td> \
				<td><a href="http://www.dmm.co.jp/mono/dvd/-/detail/=/cid='+this.dvd[i].cid+'/">'+this.dvd[i].cid+'<br /></a><p>'+this.dvd[i].title+'</p></td> \
				<td>'+this.dvd[i].actress+'</td> \
				<td name="maker">'+this.dvd[i].maker+'</td> \
				<td>'+this.dvd[i].date+'</td> \
				<td><a href="" onclick="localStorage.removeItem(\''+this.dvd[i].cid+'\')">'+'X'+'</a></td>';
			list.appendChild(item);
		}
		
	}
};
var fav={
	init:function(){
		GM_addStyle(' \
			#header .hd-lnav ul li ul li {position: relative;top:-4em;margin:0;background-color:#242424} \
			#header .hd-lnav ul li ul {display:none; position:absolute;} \
			#header .hd-lnav ul li>ul {top: auto;left: auto;} \
			#header .hd-lnav ul li:hover ul {display:block}'
		);
		this.addMaker();
		this.addLink();
	},
	addMaker:function(){
		function Menu(name,id){
			this.name=name;
			this.id=id;
		}
		var maker=new Array();
		maker[0]=new Menu('Moodyz',1509);
		maker[1]=new Menu('SOD',45276);
		maker[2]=new Menu('IP',1219);
		maker[3]=new Menu('S1',3152);
		maker[4]=new Menu('Prestige',40136);
		maker[5]=new Menu('EBODY',5032);
		createMenu('Maker','maker',maker)
		var genre=new Array();
		genre[0]=new Menu('Titjob',5019)
		genre[1]=new Menu('Blowjob',5002)
		genre[2]=new Menu('Handjob',5004)
		genre[3]=new Menu('Cum inside',5001)
		genre[4]=new Menu('Cum on face',5023)
		createMenu('Genre','keyword',genre)
		function createMenu(menu,name,menuArr){
			var navBar = getCn("hd-lnav group")[0].firstElementChild;
			var liMenu=document.createElement('li');
			var aMenu=document.createElement('a');
			aMenu.href='/mono/dvd/-/'+menu.toLowerCase()+'/';
			aMenu.appendChild(document.createTextNode(menu));
			liMenu.appendChild(aMenu);
			var ulMenu=document.createElement('ul');
			liMenu.appendChild(ulMenu);
			navBar.appendChild(liMenu);
			for (var i = 0; i < menuArr.length; i++){
				var liSubmenu=document.createElement('li');
				var aSubmenu=document.createElement('a');
				aSubmenu.href='/mono/dvd/-/list/=/article='+name+'/id='+menuArr[i].id+'/sort=date/';
				aSubmenu.appendChild(document.createTextNode(menuArr[i].name));
				liSubmenu.appendChild(aSubmenu);
				ulMenu.appendChild(liSubmenu);
			}
		}
	},
	addLink:function(){
		var wishLink=document.createElement('a');
		wishLink.href='http://www.dmm.co.jp/coupon/check.html/=/navi=none/';
		wishLink.appendChild(document.createTextNode('Wishlist'));
		wishLink.style.marginLeft='5px';
		var key=getCn('popular-keyword')[0];
		key.appendChild(wishLink);
		key.style.right='-3em';
	}
}

//Get cid of the dvd.
getCid=function(str){
		var patt1=/cid=[^\/#]+|[^\/]+pt\.jpg$/
		var patt2=/^cid=|pt\.jpg$|sopt\.jpg$/
		var cid=str.match(patt1);
		cid=cid[0].replace(patt2,'');
		return cid;
}

removeChildren=function(e){
	while(e.firstChild){
	e.removeChild(e.firstChild);
	}
}

getId=function(id){
	return document.getElementById(id);
}

getCn=function(cn){
	return document.getElementsByClassName(cn);
}

var page=/\/coupon\/check\.html|\/detail\/|\/list\//.exec(location.pathname);
switch (page[0]){
	case '/list/':
		list.init();
		fav.init();
		break;
	case '/coupon/check.html':
		wish.init();
		break;
	case '/detail/':
		detail.init();
		fav.init();
		break;
}
