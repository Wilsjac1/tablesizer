(function(){
var $=function(s){return document.querySelector(s)},D=document;
var S={l:240,w:168,n:10,auto:false,s:30,c:48,sh:'rectangle',wall:false,u:'imp'};
// read URL
var q=new URLSearchParams(location.search);['l','w','n','s','c'].forEach(function(k){if(q.has(k)&&!isNaN(+q.get(k)))S[k]=+q.get(k)});
if(q.has('sh')&&TP.SHAPES.indexOf(q.get('sh'))>-1)S.sh=q.get('sh');S.wall=q.get('wall')==='1';S.auto=q.get('n')==='0';if(q.get('u')==='met')S.u='met';
var met=function(){return S.u==='met'};
function fmt(i){if(met()){var cm=i*2.54;return cm>=100?(cm/100).toFixed(2)+' m':Math.round(cm)+' cm'}var f=Math.floor(i/12),r=Math.round(i%12);if(r===12){f++;r=0}return f?(f+'′'+(r?' '+r+'″':'')):r+'″'}
function inW(i){return met()?Math.round(i*2.54)+' cm':i+' in'}
// room inputs: slider in ft or m, number box mirrors
function bindRoom(id,key){var r=$('#'+id+'R'),n=$('#'+id+'N');
 function sync(){if(met()){r.min=2.4;r.max=18;r.step=.1;r.value=n.value=(S[key]*0.0254).toFixed(1)}else{r.min=8;r.max=60;r.step=.5;r.value=n.value=+(S[key]/12).toFixed(1)}$('#'+id+'U').textContent=met()?'m':'ft'}
 function set(v){v=+v;if(!v)return;S[key]=Math.round(met()?v/0.0254:v*12);}
 r.addEventListener('input',function(){n.value=r.value;set(r.value);go()});n.addEventListener('input',function(){r.value=n.value;set(n.value);go()});return sync}
var syncL=bindRoom('rl','l'),syncW=bindRoom('rw','w');
var sr=$('#seatsR'),sn=$('#seatsN');sr.value=sn.value=S.n;
sr.addEventListener('input',function(){sn.value=sr.value;S.n=+sr.value;S.auto=false;$('#auto').checked=false;go()});
sn.addEventListener('input',function(){if(+sn.value){sr.value=sn.value;S.n=+sn.value;S.auto=false;$('#auto').checked=false;go()}});
$('#auto').checked=S.auto;$('#auto').addEventListener('change',function(e){S.auto=e.target.checked;go()});
$('#wall').checked=S.wall;$('#wall').addEventListener('change',function(e){S.wall=e.target.checked;go()});
D.querySelectorAll('#presets button').forEach(function(b){b.addEventListener('click',function(){var p=TP.PRESETS[+b.dataset.i];if(!p)return;
 S.l=p.roomL;S.w=p.roomW;S.n=p.seats;S.auto=false;S.sh=p.shape;S.wall=!!p.wall;if(p.clearance)S.c=p.clearance;
 sr.value=sn.value=S.n;$('#auto').checked=false;$('#wall').checked=S.wall;syncL();syncW();track('preset',{preset:p.id});go();})});
var _pt;function track(n,d){if(window.tsTrack){clearTimeout(_pt);_pt=setTimeout(function(){window.tsTrack(n,d||{shape:S.sh,seats:S.n,room_in:[S.l,S.w]})},900)}}

function seg(id,key,num){var g=$('#'+id);g.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){S[key]=num?+b.dataset.v:b.dataset.v;if(key==='u'){syncL();syncW()}go()})});
 return function(){g.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v==String(S[key])))})}}
var segs=[seg('spacing','s',1),seg('clear','c',1),seg('shape','sh'),seg('units','u')];
// SVG plan
function chairSVG(p){return '<g transform="rotate('+p.a+' '+p.x+' '+p.y+')"><rect x="'+(p.x-10)+'" y="'+(p.y-9)+'" width="20" height="18" rx="2"/><line x1="'+(p.x-9)+'" x2="'+(p.x+9)+'" y1="'+(p.y-6)+'" y2="'+(p.y-6)+'"/></g>'}
function tableSVG(sh,t){var A=TP.ARM,L=t.L,W=t.W;
 if(sh==='round')return '<circle cx="'+L/2+'" cy="'+L/2+'" r="'+L/2+'"/>';
 if(sh==='racetrack')return '<rect width="'+L+'" height="'+W+'" rx="'+W/2+'"/>';
 if(sh==='boat')return '<path d="M0 3 Q'+L/2+' -3 '+L+' 3 L'+L+' '+(W+3)+' Q'+L/2+' '+(W+9)+' 0 '+(W+3)+'Z"/>';
 if(sh==='u')return '<path d="M0 0H'+L+'V'+A+'H'+A+'V'+(W-A)+'H'+L+'V'+W+'H0Z"/>';
 if(sh==='v'){var f=TP.footprint('v',t),cy=f.y/2;return '<g transform="translate(0 '+cy+')"><rect y="'+(-A/2)+'" width="'+L+'" height="'+A+'" transform="rotate(-30 0 0)"/><rect y="'+(-A/2)+'" width="'+L+'" height="'+A+'" transform="rotate(30 0 0)"/></g>'}
 return '<rect width="'+L+'" height="'+W+'" rx="3"/>'}
function draw(r){var u=r.usable,RL=u.RL,RW=u.RW,c=u.c,t=r.fits?r.table:r.max,pad=40;
 if(!t)return '<svg viewBox="0 0 '+(RL+2*pad)+' '+(RW+2*pad)+'"><rect x="'+pad+'" y="'+pad+'" width="'+RL+'" height="'+RW+'" fill="none" stroke="currentColor" stroke-width="4"/></svg>';
 var f=TP.footprint(r.shape,t),tx=pad+c+(u.x-f.x)/2,ty=pad+c+(u.y-f.y)/2,h='';
 h+='<svg viewBox="0 0 '+(RL+2*pad)+' '+(RW+2*pad)+'" style="font-size:'+Math.max(9,(RL+80)/70).toFixed(1)+'px" role="img" aria-label="To-scale top-down plan: '+TP.LABEL[r.shape]+' table '+fmt(t.L)+' by '+fmt(t.W)+' in a '+fmt(RL)+' by '+fmt(RW)+' room, '+TP.chairs(r.shape,t,S.s).length+' chairs">';
 h+='<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line y2="7" stroke="#222" stroke-opacity=".12" stroke-width="1"/></pattern></defs>';
 h+='<rect x="'+pad+'" y="'+pad+'" width="'+RL+'" height="'+RW+'" fill="url(#hatch)"/>';
 h+='<rect x="'+(pad+c)+'" y="'+(pad+c)+'" width="'+u.x+'" height="'+u.y+'" fill="#fff" stroke="#222" stroke-width=".75" stroke-dasharray="4 5"/>';
 h+='<rect x="'+pad+'" y="'+pad+'" width="'+RL+'" height="'+RW+'" fill="none" stroke="#222" stroke-width="3"/><rect x="'+(pad+2.5)+'" y="'+(pad+2.5)+'" width="'+(RL-5)+'" height="'+(RW-5)+'" fill="none" stroke="#222" stroke-width=".6"/>';
 if(u.wall){var wx=pad+RL-u.wall;h+='<rect x="'+wx+'" y="'+(pad+RW*.3)+'" width="'+u.wall+'" height="'+RW*.4+'" fill="#fff" stroke="#222" stroke-width=".8"/><line x1="'+(pad+RL-3)+'" x2="'+(pad+RL-3)+'" y1="'+(pad+RW*.32)+'" y2="'+(pad+RW*.68)+'" stroke="#222" stroke-width="3"/><text x="'+(wx-6)+'" y="'+(pad+RW*.3-6)+'" text-anchor="end">Credenza + display</text>'}
 h+='<g transform="translate('+tx+' '+ty+')"><g fill="#b48a63" stroke="#6e4a2c" stroke-width="1">'+tableSVG(r.shape,t)+'</g>';
 h+='<g fill="#fff" stroke="#222" stroke-width=".8">'+TP.chairs(r.shape,t,S.s).map(chairSVG).join('')+'</g>';
 var lx=r.shape==='round'?t.L/2:r.shape==='u'||r.shape==='v'?f.x/2:t.L/2,ly=f.y/2;
 h+='<text x="'+lx+'" y="'+(ly+4)+'" text-anchor="middle" style="fill:#fff;letter-spacing:.16em">'+(r.shape==='round'?'⌀ '+fmt(t.L):r.shape==='v'?'2 × '+fmt(t.L)+' legs':fmt(t.L)+' × '+fmt(t.W))+'</text></g>';
 // dims
 var y0=pad-18,x0=pad-18;h+='<g stroke="#222" stroke-width=".7"><line x1="'+pad+'" x2="'+(pad+RL)+'" y1="'+y0+'" y2="'+y0+'"/><line x1="'+pad+'" x2="'+pad+'" y1="'+(y0-5)+'" y2="'+(y0+5)+'"/><line x1="'+(pad+RL)+'" x2="'+(pad+RL)+'" y1="'+(y0-5)+'" y2="'+(y0+5)+'"/><line x1="'+x0+'" x2="'+x0+'" y1="'+pad+'" y2="'+(pad+RW)+'"/><line x1="'+(x0-5)+'" x2="'+(x0+5)+'" y1="'+pad+'" y2="'+pad+'"/><line x1="'+(x0-5)+'" x2="'+(x0+5)+'" y1="'+(pad+RW)+'" y2="'+(pad+RW)+'"/></g>';
 h+='<text x="'+(pad+RL/2)+'" y="'+(pad-24)+'" text-anchor="middle" style="paint-order:stroke;stroke:#fff;stroke-width:6px">'+fmt(RL)+'</text><text transform="translate('+(pad-24)+' '+(pad+RW/2)+') rotate(-90)" text-anchor="middle">'+fmt(RW)+'</text>';
 h+='<text x="'+(pad+8)+'" y="'+(pad+RW-8)+'">'+fmt(c)+' clearance zone</text></svg>';return h}
var shapeName=function(sh){return TP.LABEL[sh]};
function go(){segs.forEach(function(f){f()});
 $('#seatsN').disabled=false;$('#seatsOut').textContent=S.auto?'max for room':S.n;
 var r=TP.plan({roomL:S.l,roomW:S.w,seats:S.auto?0:S.n,spacing:S.s,clearance:S.c,shape:S.sh,wall:S.wall});
 var t=r.fits?r.table:r.max,o='';
 r.warnings.forEach(function(w){o+='<div class="warn" role="status">'+w+'</div>'});
 if(t){o+='<div class="result"><div class="stat"><span>'+(S.sh==='round'?'Diameter':S.sh==='v'?'Leg length':'Table length')+'</span><b>'+fmt(t.L)+'</b><span>'+inW(t.L)+'</span></div>';
  o+='<div class="stat"><span>'+(S.sh==='u'?'Head width':S.sh==='round'||S.sh==='v'?'Footprint':'Width')+'</span><b>'+(S.sh==='v'?fmt(Math.round(TP.footprint('v',t).y)):fmt(t.W))+'</b><span>'+(S.sh==='rectangle'||S.sh==='boat'||S.sh==='racetrack'?'range '+inW(r.width[0])+'–'+inW(r.width[1]):inW(t.W))+'</span></div>';
  o+='<div class="stat"><span>Seats at this table</span><b>'+r.seats+'</b><span>room max '+r.maxSeats+' ('+shapeName(S.sh).toLowerCase()+')</span></div></div>'}
 o+='<div class="plan" id="planBox">'+draw(r)+'</div>';
 if(t){var nc=TP.chairs(r.shape,t,S.s).length;o+='<p class="planmeta" role="status">'+nc+' chairs shown · '+fmt(S.c)+' clearance on all sides'+(S.wall?' · credenza/display wall allowed for':'')+' · '+fmt(S.s)+' per person</p>'}
 if(r.options&&r.options.length){o+='<div class="fits"><span class="label">What fits this room</span><ol>';r.options.forEach(function(x){o+='<li><button class="opt" data-sh="'+x.shape+'">'+x.label+' <span>'+(x.shape==='round'?'⌀ '+fmt(x.L):x.shape==='v'?fmt(x.L)+' legs':fmt(x.L)+' × '+fmt(x.W))+' · seats '+x.seats+'</span></button></li>'});o+='</ol></div>'}
 $('#out').innerHTML=o;D.querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){S.sh=b.dataset.sh;go()})});
 // URL + CTA
 var p=new URLSearchParams({l:S.l,w:S.w,n:S.auto?0:S.n,s:S.s,c:S.c,sh:S.sh});if(S.wall)p.set('wall','1');if(met())p.set('u','met');
 history.replaceState(null,'','?'+p.toString());
 if(t){var cta=new URLSearchParams({utm_source:'tablesizer',utm_medium:'referral',utm_campaign:'planner',shape:S.sh,length_in:t.L,width_in:t.W,seats:r.seats,size:t.L+'x'+t.W+'in'});
  $('#quote').href='https://fargowoodworks.com/?'+cta.toString();$('#quote').textContent='Request a quote for this table'}
 track('planner_used');
 $('#ph').textContent=shapeName(S.sh)+' table '+(t?fmt(t.L)+' × '+fmt(t.W):'')+' · '+r.seats+' seats · room '+fmt(S.l)+' × '+fmt(S.w)+' · '+fmt(S.c)+' clearance · '+fmt(S.s)+' per seat';
}
$('#share').addEventListener('click',function(){var b=this,u=location.href;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){b.textContent='Link copied ✓'},function(){prompt('Copy this link',u)});setTimeout(function(){b.textContent='Copy link to plan'},2200)});
$('#print').addEventListener('click',function(){window.print()});
var dl=$('#download');if(dl)dl.addEventListener('click',function(){if(window.tsTrack)window.tsTrack('plan_download',{});window.print()});
syncL();syncW();go();
})();
