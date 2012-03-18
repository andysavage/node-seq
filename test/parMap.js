 var Seq = require('../../seq');

describe('parMap', function () {
  it('should not over 2 running callbacks', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    var running = 0;
    var values = 0;
    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .parMap(2, function (x, i) {
          running ++;

          running.should.below(3);

          setTimeout((function () {
            running --;
            this(null, x * 10);
          }).bind(this), Math.floor(Math.random() * 10));
        })
        .seq(function () {
          clearTimeout(to);
          this.stack.should.eql([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
          var args = [].slice.call(arguments);
          this.stack.should.eql.args;
          done();
        })
    ;
  });

  it('should do Fast', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .parMap(function (x, i) {
          this(null, x * 10);
        })
        .seq(function () {
          clearTimeout(to);
          this.stack.should.eql([10,20,30,40,50,60,70,80,90,100]);
          var args = [].slice.call(arguments);
          this.stack.should.eql(args);
          done();
        })
    ;
  });

  it('should push values into specified key', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .parMap(function (x, i) {
          this.into(9 - i)(null, x * 10);
        })
        .seq(function () {
          clearTimeout(to);
          this.stack.should.eql([100, 90, 80, 70, 60, 50, 40, 30, 20, 10]);
          var args = [].slice.call(arguments);
          this.stack.should.eql(args);
          done();
        })
    ;
  });

});
