 var Seq = require('../../seq'),
     should = require('should');

describe('Seq', function () {
  it('should do sequentially', function (done) {
    var to = setTimeout(function () {
      throw new Error('never got to the end of the chain');
    }, 100);

    Seq([0])
        .seq('pow', function (n) {
          this(null, 1);
        })
        .seq(function (n) {
          n.should.equal(1);
          n.should.equal(this.vars.pow);
          var seq = this;
          setTimeout(function () { seq(null, 2) }, 5);
          this.stack.should.eql([n]);
        })
        .seq(function (n) {
          n.should.equal(2);
          this.stack.should.eql([n]);
          this(null, 5, 6, 7);
        })
        .seq(function (x, y, z) {
          clearTimeout(to);
          [x, y, z].should.eql([5, 6, 7]);
          done();
        });
        ;
  });

  it('should support into method', function (done) {
    var to = setTimeout(function () {
      throw new Error('never got to the end of the chain');
    }, 100);
    var calls = 0;

    Seq([3, 4, 5])
        .seq(function () {
          this.into('w')(null, 5);
        })
        .seq(function (w) {
          clearTimeout(to);
          w.should.equal(this.vars.w);
          arguments.length.should.equal(1);
          w.should.equal(5);
          done();
        })
        ;
  });

  it('should catch error', function (done) {
    var to = setTimeout(function () {
        throw new Error('never caught the error');
    }, 100);

    var calls = {};
    Seq([1])
        .seq(function (n) {
          n.should.equal(1);
          calls.before = true;
          this('pow!');
          calls.after = true;
        })
        .seq(function (n) {
          calls.next = true;
          throw new Error('should have skipped this');
        })
        .catch(function (err) {
          err.should.equal('pow!');
          calls.before.should.ok;
          should.not.exist(calls.after)
          should.not.exist(calls.next);
          clearTimeout(to);
          done();
        })
    ;
  });

  it('should catch error and do not go to next seq', function (done) {
    var to = setTimeout(function () {
      throw new Error('catch never fire');
    }, 1000);

    Seq()
        .seq(function () {
          this('pow!');
        })
        .seq(function () {
          throw new Error('should skip this');
        })
        .catch(function (err) {
          clearTimeout(to);
          err.should.be.exist;
          err.should.equal('pow!');
          setTimeout(function () { done(); }, 2);
        })
        .seq(function () {
          throw new error('also should skip this');
        })
    ;
  });

  it('should catch error at individual step', function (done) {
    var to = setTimeout(function () {
      throw new Error('catch never fire');
    }, 1000);

    Seq()
        .seq(function () {
          this(null, 'x');
        })
        .catch(function (err) {
          throw new Error('should skip this catch');
        })
        .seq(function (x) {
          x.should.equal('x');
          this('pow!');
        })
        .seq(function () {
          throw new Error('should skip this');
        })
        .catch(function (err) {
          clearTimeout(to);
          err.should.be.exist;
          err.should.equal('pow!');
          setTimeout(function () { done(); }, 2);
        })
        .seq(function () {
          throw new error('also should skip this');
        })
    ;
  });

  it('should support .ap', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 100);

    var cmp = [1, 2, 3];
    Seq.ap([1, 2, 3])
        .seqEach(function (x) {
          cmp.shift().should.equal(x);
          this(null);
        })
        .seq(function () {
          clearTimeout(to);
          cmp.should.eql([]);
          done();
        })
    ;
  });

});
