var Seq = require('../../seq');

describe('empty', function () {
  it('should support seqEach', function (done) {
    var to = setTimeout(function () {
      throw new Error('seq never fired');
    }, 100);

  Seq()
      .seqEach(function (x) {
        throw new Error('no elements');
      })
      .seq(function () {
        clearTimeout(to);
        done();
      })
    ;
  });

  it('should support parEach', function (done) {
    var to = setTimeout(function () {
      throw new Error('seq never fired');
    }, 500);

    Seq()
        .parEach(function () {
          throw new Error('non-empty stack');
        })
        .seq(function () {
          clearTimeout(to);
          done();
        })
    ;
  });

  it('should support SeqMap', function (done) {
    var to = setTimeout(function () {
      throw new Error('seq never fired');
    }, 500);

    Seq()
        .seqMap(function () {
          throw new Error('non-empty stack');
        })
        .seq(function () {
          clearTimeout(to);
          done();
        })
    ;
  });

  it('should support ParMap', function (done) {
    var to = setTimeout(function () {
      throw new Error('seq never fired');
    }, 500);

    Seq()
        .parMap(function () {
          throw new Error('non-empty stack');
        })
        .seq(function () {
          clearTimeout(to);
          done();
        })
    ;
  });
});
