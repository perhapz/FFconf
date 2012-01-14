// ==UserScript==
// @name           DMMGirl
// @namespace      null
// @description    DMM Tweak
// @include        http://www.dmm.co.jp/mono/dvd/-/list/*
// @include        http://www.dmm.co.jp/coupon/check.html/=/navi=none/*
// @include        http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=*
// ==/UserScript==
//(function(){
var detail={
	max:10,
	init:function(){
		this.replaceRcolumn();
		this.removeComment();
		this.showCover();
		unsafeWindow.sample_spread();//Show all preview pics
		this.addPreloadRadio();
	},
	//==Add preload radio button==
	addPreloadRadio:function(){
		var headline=document.getElementsByClassName("headline mg-b10 lh3")[0];
		var link=document.createElement('input');
		link.type="radio";
		link.id="prelink";
		link.addEventListener("click",this.evtPreloadSample,false);
		headline.appendChild(link);
		headline.appendChild(document.createTextNode("Preload "));
	},
	//==Preload previews==
	evtPreloadSample:function(){
		this.removeEventListener('click', detail.evtPreloadSample, false);
		var sample=document.getElementsByClassName('mg-b6');
		var i=0;
		detail.max=sample.length;
		var block=document.getElementById("sample-image-block");
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
		var block1=document.getElementById('block1');
		block1.parentNode.removeChild(block1);
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
		//box.style.textAlign='center';
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
		//console.log(detail.max);
		//console.log(nextnum);
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
		var sample=document.getElementsByClassName('float-l mg-b20 mg-r12')[0];
		var img=document.getElementsByClassName('tdmm')[0];
		img.src=img.src.replace('ps.jpg','pl.jpg');
		removeChildren(sample);
		sample.className='mg-b20 mg-r12';
		sample.appendChild(img);
	},
	replaceRcolumn:function(){
		var rcolumn=document.getElementsByClassName('vline')[0].nextElementSibling;
		var info=document.getElementsByClassName('mg-b20')[1];
		var tbody=info.firstElementChild; //remove last 2 rows
		tbody.removeChild(tbody.lastElementChild);
		var star=tbody.lastElementChild.lastElementChild;
		var vote=document.getElementsByClassName('count')[0];
		star.lastElementChild.innerHTML='('+vote.innerHTML+')';
		var desc=info.nextElementSibling.nextElementSibling;
		var another=document.getElementsByClassName('another')[0];
		var actress=document.getElementById('avcast_text');
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
	//==Remove review==
	removeComment:function(){
		var review=document.getElementById('review');
		review.parentNode.removeChild(review);
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
		var title=document.getElementById('title')//get title
		var detail=date.innerHTML+'#'+actress.innerHTML+'#'+maker.innerHTML+'#'+title.innerHTML;
		localStorage.setItem(tool.getCid(location.pathname),detail);
	}


};
var list={
	init:function(){
		var smallThumb = document.getElementsByClassName("mg-r6");
		for (var i = 0; i < smallThumb.length; i++){
			smallThumb[i].addEventListener("mouseover",this.showThumb,false);
		}
		var thumb=new Image();
		thumb.id='hoverpic';
		thumb.style.position='absolute';
		thumb.style.zIndex=22;
		thumb.style.display='none';
		thumb.addEventListener("mouseout",this.removeThumb,false);
		var a=document.createElement('a');
		a.appendChild(thumb);
		document.body.appendChild(a);
	},
	showThumb:function(){
		if (this.src.search('noimage')===-1){
			var thumb=document.getElementById('hoverpic');
			thumb.src=this.src.replace("pt.jpg","ps.jpg");
			var pos=this.getBoundingClientRect();
			thumb.style.left=pos.left-29+window.pageXOffset+'px';//147*200,90*122
			thumb.style.top=pos.top-39+window.pageYOffset+'px';
			thumb.width=147;
			thumb.height=200;
			thumb.style.display='block';
			thumb.parentNode.href='http://www.dmm.co.jp/mono/dvd/-/detail/=/cid='+tool.getCid(this.src)+'/';
		}
	},
	removeThumb:function(){
		this.style.display='none';
		this.src=null;
		this.parentNode.href=null;
	}
};
var wish={
	init:function(){
		document.title='Wishlist';
		GM_addStyle(' \
			body,table {color:#333333; font-size:12px; font-family:"MS PGothic","Osaka";} \
			a:link {color:#005FC0; text-decoration:none;} \
			a:visited {color:#005FC0; text-decoration:none;} \
			a:hover,a:active {color:#EE2200; text-decoration:underline;} \
			table {text-align:center; width:590px; border-collapse:separate; border-spacing:5px;} \
			table th {font-size:1.1em; padding:2px; background-color:#242424; color:#ffffff} \
			table td {padding:2px; background-color:#F8F8F8; border:1px solid #CCCCCC;} \
			p {text-align:left}'
		);
		document.body.innerHTML=' \
			<table> \
				<thead> \
					<tr> \
						<th width="3%">#</th> \
						<th width="15%">Cover</th> \
						<th width="30%">CID</th> \
						<th width="17%">Actress</th> \
						<th width="17%">Maker</th> \
						<th width="14%">Date</th> \
						<th width="4%">X</th> \
					</tr> \
				</thead> \
				<tbody id="wishlist"></tbody> \
			</table>';
		this.fillTable();
		this.replaceMaker();
	},
	fillTable:function(){
		var list = document.getElementById('wishlist'); 
		for(var i=0;i<localStorage.length;i++){
			var item=document.createElement('tr');
			var cid=localStorage.key(i);
			var cid2=cid;
			if (cid.match(/^15/)){cid2=cid2+'so';}
			var j=i+1;
			var info=localStorage.getItem(cid).split('#'); //Date[0]#Actress[1]#Maker[2]#Title[3]
			info[1]=info[1].replace(/></g,'><br /><');
			item.innerHTML = ' \
				<td height="130">' + j + '</td> \
				<td><img src="http://pics.dmm.co.jp/mono/movie/'+cid2+'/'+cid2 +'pt.jpg" /></td> \
				<td><a href="http://www.dmm.co.jp/mono/dvd/-/detail/=/cid='+cid+'/">'+cid+'<br /></a><p>'+info[3]+'</p></td> \
				<td>'+info[1]+'</td> \
				<td name="maker">'+info[2]+'</td> \
				<td>'+info[0]+'</td> \
				<td><a href="" onclick="localStorage.removeItem(\''+cid+'\')">'+'X'+'</a></td>';
			list.appendChild(item);
		}
		
	},
	replaceMaker:function(){
		var maker=document.getElementsByName('maker');
		for(i=0;i<maker.length;i++){
			var mid=new String(maker[i].firstChild.href.match('id=[^/#]+'));
			mid=mid.replace('id=','');
			var name=maker[i].firstChild;
			switch (mid){
			case '1219':
				name.innerHTML='IdeaPocket';
				break;
			case '3152':
				name.innerHTML='S1';
				break;
			case '45276':
				name.innerHTML='SODcreate';
				break;
			case '3890':
				name.innerHTML='PREMIUM';
				break;
			case '1509':
				name.innerHTML='MOODZY';
				break;
			case '40136':
				name.innerHTML='PRESTIGE';
				break;
			case '45217':
				name.innerHTML='MAXING';
				break;
			case '40046':
				name.innerHTML='MAX-A';
				break;
			}
		}
	}
};
var tool={
	getCid:function(str){
		var patt1=/cid=[^\/#]+|[^\/]+pt\.jpg$/
		var patt2=/^cid=|pt\.jpg$|sopt\.jpg$/
		var cid=str.match(patt1);
		cid=cid[0].replace(patt2,'');
		return cid;
	},
};

removeChildren=function(e){
	while(e.firstChild){
	e.removeChild(e.firstChild);
	}
}
//$id=
//$cn=
var page=/\/coupon\/check\.html|\/detail\/|\/list\//.exec(location.pathname);
switch (page[0]){
	case '/list/':
		list.init();
		break;
	case '/coupon/check.html':
		wish.init();
		break;
	case '/detail/':
		detail.init();
		break;
}
//})();
