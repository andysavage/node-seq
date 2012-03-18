var Seq = require('../../seq');

describe('seqEach', function () {
  it('should do seqEach', function () {
    var to = setTimeout(function () {
      throw new Error('seqEach never finished');
    }, 25);

    var count = 0;
    var ii = 0;
    Seq([1, 2, 3])
        .seqEach(function (x, i) {
           x.should.equal(++ii);
           x.should.equal([1, 2, 3][i]);
           count ++;
           this(null);
        })
        .seq(function () {
           clearTimeout(to);
           count.should.equal(3);
        })
    ;
  });

  it('should catch error in seq', function (done) {
    var to = setTimeout(function () {
      throw new Error('never caught the error');
    }, 100);
    var tf = setTimeout(function () {
      throw new Error('never resumed afterwards')
    }, 50);

    var meows = [];

    var values = [];
    Seq([1, 2, 3, 4])
        .seqEach(function (x, i) {
          values.push([i, x]);
          (x - 1).should.equal(i);
          if (i >= 2) this('meow ' + i);
          else this(null, x * 10)
        })
        .seq(function (xs) {
          throw new Error('throw new Error before this action');
        })
        .catch(function (err) {
          clearTimeout(to);
          meows.push(err);
          err.should.equal('meow 2');
          values.should.eql([[0, 1], [1, 2], [2, 3]]);
          setTimeout(function () { done(); }, 5);
          clearTimeout(tf);
        })
        .seq(function () {
          throw new Error('should finish before this action');
        })
    ;
  });
});
