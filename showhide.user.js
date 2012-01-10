// ==UserScript==
// @name           ShowHide
// @namespace      null
// @description    Move hidden block to top
// @include        http://64.78.167.63/bbs/viewthread.php*
// ==/UserScript==

var hide=document.getElementsByClassName('showhide');
if(hide){
	var title=document.getElementById('threadtitle');
	title.appendChild(hide[0]);
}
