// Sizing rules (sources in methodology): 30in/person min, 36in comfortable (Paul Downs, OFW);
// one seat at each end of rectangular tables; 42-48in clearance from table edge to wall.
(function(root){
function widthFor(len){ if(len<=72) return [36,42]; if(len<=120) return [42,48]; if(len<=192) return [48,54]; if(len<=264) return [54,60]; return [60,66]; }
function seatsFor(len, spacing){ return 2*Math.floor(len/spacing)+2; }
function lengthFor(seats, spacing){ var side=Math.max(1,Math.ceil((seats-2)/2)); return Math.ceil(side*spacing/6)*6; }
function plan(o){
  var spacing=o.spacing||30, clr=o.clearance||48;
  var roomL=Math.max(o.roomL,o.roomW)*12, roomW=Math.min(o.roomL,o.roomW)*12;
  var maxLen=roomL-2*clr, maxWid=roomW-2*clr, r={warnings:[]};
  if(maxLen<48||maxWid<36){ r.fits=false; r.warnings.push('Room too small for a conference table with this clearance.'); r.maxSeats=0; return r; }
  var wFit=Math.min(widthFor(maxLen)[1],maxWid); r.maxLength=Math.floor(maxLen/6)*6; r.maxWidth=Math.floor(wFit/6)*6;
  r.maxSeats=seatsFor(r.maxLength,spacing);
  if(o.seats){ var L=lengthFor(o.seats,spacing), W=widthFor(L);
    r.length=[L, L+12]; r.width=W; r.fits=L<=maxLen && W[0]<=maxWid;
    if(!r.fits) r.warnings.push('Desired seats need a '+L+'in table; this room fits up to '+r.maxLength+'in ('+r.maxSeats+' seats).');
  } else { r.length=[r.maxLength,r.maxLength]; r.width=[r.maxWidth,r.maxWidth]; r.fits=true; }
  var n=o.seats||r.maxSeats; r.shapes=['Rectangle'];
  if(r.length[0]>=96) r.shapes.push('Boat (wider middle, better sightlines)');
  if(r.length[0]>=144) r.shapes.push('Racetrack (rounded ends)');
  if(n>=16 || o.video) r.shapes.push('U or V shape (for video / presentations)');
  return r; }
root.TP={plan:plan,seatsFor:seatsFor,lengthFor:lengthFor,widthFor:widthFor};
})(typeof module!=='undefined'?module.exports:window);
