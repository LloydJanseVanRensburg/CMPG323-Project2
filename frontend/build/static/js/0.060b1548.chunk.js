(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{357:function(t,e,n){"use strict";n.r(e),n.d(e,"createSwipeBackGesture",(function(){return i}));var r=n(19),a=n(87),i=(n(44),function(t,e,n,i,o){var c=t.ownerDocument.defaultView;return Object(a.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:function(t){return t.startX<=50&&e()},onStart:n,onMove:function(t){var e=t.deltaX/c.innerWidth;i(e)},onEnd:function(t){var e=t.deltaX,n=c.innerWidth,a=e/n,i=t.velocityX,u=n/2,s=i>=0&&(i>.2||t.deltaX>u),d=(s?1-a:a)*n,f=0;if(d>5){var h=d/Math.abs(i);f=Math.min(h,540)}o(s,a<=0?.01:Object(r.j)(0,a,.9999),f)}})})}}]);
//# sourceMappingURL=0.060b1548.chunk.js.map