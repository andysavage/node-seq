 var Seq = require('../../seq');

describe('parEach', function () {
  it('should do parEach', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 100);

   var values = [];
   Seq([1, 2, 3, 4])
       .parEach(function (x, i) {
         values.push([i, x]);
         setTimeout(this.bind({}, null), 20);
       })
       .seq(function () {
         this.stack.should.eql([1, 2, 3, 4]);
         values.should.eql([[0, 1], [1, 2], [2, 3], [3, 4]]);
         clearTimeout(to);
         done();
       })
    ;
  });

  it('should have parEachVars', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 1000);
    var values = [];

    Seq()
        .seq('abc', function () {
          this(null, 'a', 'b', 'c');
        })
        .parEach(function (x) {
          values.push(x);
          setTimeout(this.bind(this, null), Math.floor(Math.random() * 50));
        })
        .seq(function () {
          clearTimeout(to);
          values.should.eql(['a', 'b', 'c']);
          this.stack.should.eql(['a', 'b', 'c']);
          this.vars.abc.should.eql('a');
          done();
        })
    ;
  });

  it('should have pareachinto', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    });

    Seq([1, 2, 3, 4])
        .parEach(function (x, i) {
          setTimeout((function () {
            this.into('abcd'.charAt(i))(null, x);
          }).bind(this), 20);
        })
        .seq(function () {
          clearTimeout(to);
          this.stack.should.eql([1, 2, 3, 4]);
          this.vars.should.eql({a: 1, b: 2, c: 3, d: 4});
          done();
        })
    ;
  });

  it('should catch error', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 100);

    var running = 0;
    var values = [];
    Seq([1, 2, 3, 4])
        .parEach(function (x, i) {
          values.push([i, x]);
          setTimeout(this.bind({}, 'zing'), 10);
        })
        .seq(function () {
          throw new Error('should have errored before this point');
        })
        .catch(function (err) {
          clearTimeout(to);
          err.should.equal('zing');
          values.length.should.equal(4);
          values.should.eql([[0, 1], [1, 2], [2, 3], [3, 4]]);
          running ++;
          if (running === 4) {
            setTimeout(function () { done(); }, 20);
          }
        })
        .seq(function () {
          throw new Error('should end before this point');
        })
    ;
  });

  it('should have parEachLimited', function (done) {
    var to = setTimeout(function () {
      throw new Error('never finished');
    }, 500);

    var running = 0;
    var values = [];
    Seq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .parEach(3, function (x, i) {
          running ++;

          running.should.below(4);
          values.push([i, x]);
          setTimeout((function () {
            running --;
            this(null);
          }).bind(this), 10);
        })
        .seq(function () {
          clearTimeout(to);
          values.should.eql([[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]]);
          done();
        })
    ;
  });

});
