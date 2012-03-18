var Seq = require('../../seq');

describe('seqMap', function () {
  it('should not over one running callback', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    var running = 0;
    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .seqMap(function (x, i) {
        running ++;

        running.should.eql(1);

        setTimeout((function () {
          running --;
          this(null, x * 10);
        }).bind(this), 5);
      })
    .seq(function () {
       this.stack.should.eql([10,20,30,40,50,60,70,80,90,100]);
       done();
     })
   ;
 });

  it('should put values into specified key', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    var running = 0;
    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .seqMap(function (x, i) {
        running ++;

        running.should.eql(1);

        setTimeout((function () {
          running --;
          this.into(9 - i)(null, x * 10);
        }).bind(this), 5);
      })
    .seq(function () {
       this.stack.should.eql([100, 90, 80, 70, 60, 50, 40, 30, 20, 10]);
       done();
     })
   ;
 });

});
