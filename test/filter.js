var Seq = require('../../seq');

describe('Filter', function () {
  it('should filter on par', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    var running = 0;
    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .parFilter(2, function (x, i) {
        running ++;

        running.should.below(3);

        setTimeout((function () {
          running --;
          this(null, x % 2 === 0);
        }).bind(this), Math.floor(Math.random() * 100));
      })
      .seq(function () {
        clearTimeout(to);
        this.stack.should.eql([2, 4, 6, 8, 10]);
        this.stack.should.eql([].slice.call(arguments));
        done();
      })
    ;
  });

  it('should filter on seq', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    var running = 0;
    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .seqFilter(function (x, i) {
        running ++;

        running.should.eql(1);

        setTimeout((function () {
          running --;
          this(null, x % 2 === 0);
        }).bind(this), 5);
      })
      .seq(function () {
        clearTimeout(to);
        this.stack.should.eql([2, 4, 6, 8, 10]);
        this.stack.should.eql([].slice.call(arguments));
        done();
      })
    ;
  });

  it('should used in parFilterInto', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    var running = 0;
    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .parFilter(2, function (x, i) {
        running ++;

        running.should.below(3);

        setTimeout((function () {
          running --;
          this.into(x % 3)(null, x % 2 === 0);
        }).bind(this), Math.floor(Math.random() * 100));
      })
      .seq(function () {
        clearTimeout(to);
        this.stack.should.eql([ 6, 10, 4, 2, 8 ]);
        this.stack.should.eql([].slice.call(arguments));
        done();
      })
    ;
  });

  it('should used in seqFilterInto', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    var running = 0;
    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .seqFilter(function (x, i) {
        running ++;

        running.should.eql(1);

        setTimeout((function () {
          running --;
          this.into(x % 3)(null, x % 2 === 0);
        }).bind(this), 5);
      })
      .seq(function () {
        clearTimeout(to);
        this.stack.should.eql([ 6, 10, 4, 2, 8 ]);
        this.stack.should.eql([].slice.call(arguments));
        done();
      })
    ;
  });

});



