var Seq = require('../../seq');

describe('Bind', function () {
  it('should support seq', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 100);

    Seq([4, 5])
      .seq(function (a, b, c, d) {
        a.should.equal(2);
        b.should.equal(3);
        c.should.equal(4);
        d.should.equal(5);
        this(null);
      }, 2, 3)
      .seq(function () {
        clearTimeout(to);
        done();
      })
    ;
  });

  it('should support par', function (done) {
    var t1 = setTimeout(function () {
        throw new Error('1 never finished');
    }, 500);
    var t2 = setTimeout(function () {
        throw new Error('2 never finished');
    }, 500);
    var t3 = setTimeout(function () {
        throw new Error('3 never finished');
    }, 500);

    Seq(['c'])
      .par(function (a, b, c) {
        clearTimeout(t1);
        a.should.equal('a');
        b.should.equal('b');
        c.should.equal('c');
        this(null);
      }, 'a', 'b')
      .par(function (x, c) {
        clearTimeout(t2);
        x.should.equal('x');
        c.should.equal('c');
        this(null);
      }, 'x')
      .seq(function () {
        clearTimeout(t3);
        done();
      })
    ;
  });
});
