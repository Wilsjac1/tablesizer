const TP=require('./calc.js').TP, a=require('assert');
// Matches Paul Downs chart (30in): 96in->8, 144in->10, 168in->12, 216in->16
a.equal(TP.seatsFor(96,30),8);a.equal(TP.seatsFor(144,30),10);a.equal(TP.seatsFor(168,30),12);a.equal(TP.seatsFor(216,30),16);
a.equal(TP.lengthFor(10,30),120);a.equal(TP.lengthFor(10,36),144);a.equal(TP.lengthFor(22,30),300);
let r=TP.plan({roomL:20,roomW:14,seats:10,spacing:30,clearance:48});a.ok(r.fits);console.log('20x14,10 seats:',JSON.stringify(r));
r=TP.plan({roomL:12,roomW:10,seats:12,spacing:36,clearance:48});a.ok(!r.fits);console.log('12x10,12 seats:',r.warnings[0]);
r=TP.plan({roomL:8,roomW:8,spacing:30,clearance:48});a.equal(r.maxSeats,0);console.log('8x8:',r.warnings[0]);
r=TP.plan({roomL:30,roomW:20,spacing:30,clearance:48});console.log('30x20 max seats:',r.maxSeats,r.maxLength,r.maxWidth);
console.log('ALL TESTS PASSED');
