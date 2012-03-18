 var Seq = require('../../seq');

describe('ok', function () {
  it('should call next chain', function (done) {
    var to = setTimeout(function () {
      throw new Error('seq never fired');
    }, 500);


    function mod1 (cb) { cb(3) }
    function mod2 (cb) { cb(4) }

    Seq()
        .par(function () { mod1(this.ok) })
        .par(function () { mod2(this.ok) })
        .seq(function (x, y) {
          x.should.equal(3);
          y.should.equal(4);
          this.ok([1, 2, 3]);
        })
        .flatten()
        .parMap(function (x) {
          this.ok(x * 100)
        })
        .seq(function () {
          this.stack.should.eql([100, 200, 300]);
          done();
        })
    ;
  });
});

