var Seq = require('../../seq');

describe('RegressionTest for accidental deep traversal of the context', function () {
  it('should not over 1000 msec', function (done) {
       // create a single-item stack with a bunch of references to other objects:
       var stack = [{}];
       for (var i = 0 ; i < 10000 ; i += 1) {
           stack[0][i] = stack[0];
       }

       var startTime = new Date(),
           numCalled = 0,
           to = setTimeout(function () {
               throw new Error('never got to the end of the chain');
           }, 1000);

       Seq(stack)
           .parEach(function (item) {
               numCalled += 1;
               this();
           })
           .seq(function () {
               clearTimeout(to);
               numCalled.should.equal(1);
               (new Date().getTime() - startTime).should.below(1000);
               done();
           })
        ;
  });
});


