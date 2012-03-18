 var Seq = require('../../seq');

describe('Par', function () {
  it('should gather arguments into its stack and args', function (done) {
    var to = setTimeout(function () {
      throw new Error('seq never fire');
    }, 1000);

    Seq()
        .seq(function () {
            this(null, 'mew');
        })
        .par(function () {
            var seq = this;
            setTimeout(function () { seq(null, 'x') }, 5);
        })
        .par(function () {
            var seq = this;
            setTimeout(function () {seq(null, 'y') }, 2);
        })
        .par('z', function () {
            this(null, 42);
        })
        .seq(function (x, y, z) {
          clearTimeout(to);
          x.should.equal('x');
          y.should.equal('y');
          z.should.equal(42);
          this.args.should.eql({0: ['x'], 1: ['y'], z: [42]});
          this.stack.should.eql(['x', 'y', 42]);
          this.vars.should.eql({z: 42});
          done();
        })
    ;
  });

  it('should catch error and do not got to next seq', function (done) {
    var tc = setTimeout(function () {
      throw new Error('error not caught');
    }, 1000);

    Seq()
        .par('one', function () {
          setTimeout(this.bind({}, 'rawr'), 2);
        })
        .par('two', function () {
          setTimeout(this.bind({}, null, 'y'), 5);
        })
        .seq(function (x, y) {
          throw new Error('seq fired with error abobe');
        })
        .catch(function (err, key) {
          clearTimeout(tc);
          err.should.equal('rawr');
          key.should.equal('one');
          setTimeout((function () {
            this.vars.should.have.property('two');
            this.vars.two.should.equal('y');
            done();
          }).bind(this), 5);
        })
        .seq(function () {
          throw new Error('should skip this');
        })
    ;
  });

  it('should support par seq error handle issue #5', function (done) {
    var to = setTimeout(function () {
      throw new Error('2nd catch never fired');
    }, 50);
    var tc = setTimeout(function () {
      throw new Error('seq never fired');
    }, 25);

    Seq()
      .par(function () {
        this(null, 'x');
      })
      .catch(function () {
        throw new Error('should skip this');
      })
      .seq(function (x) {
        clearTimeout(tc);
        this('pow!');
      })
      .catch(function (err) {
        clearTimeout(to);
        err.should.equal('pow!');
        done();
      })
    ;
  });

  it('should catch without Seq', function (done) {
    var finish = false,
        caught = false;
    var tc = setTimeout(function () {
      throw new Error('error not caught');
    }, 5000);

    Seq()
        .par('one', function () {
          setTimeout(this.bind({}, 'rawr'), 2);
        })
        .par('two', function () {
          setTimeout(this.bind({}, null, 'y'), 5);
        })
        .catch(function (err, key) {
          clearTimeout(tc);
          err.should.equal('rawr');
          key.should.equal('one');
          setTimeout((function () {
            this.vars.should.have.property('two');
            this.vars.two.should.equal('y');
            done();
          }).bind(this), 5);
        });
    ;
  });
});
