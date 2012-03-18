 var Seq = require('../../seq');

describe('forEach', function () {
  it('should do array like execution', function () {
    var to = setTimeout(function () {
      throw new Error('seq never fired after forEach')
    }, 25);

    var count = 0;
    Seq([1, 2, 3])
        .push(4)
        .forEach(function (x, i) {
          (x - 1).should.eql(i);
          count ++;
        })
        .seq(function () {
          clearTimeout(to);
          count.should.equal(4);
        })
    ;
  });
});
