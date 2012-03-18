var Seq = require('../../seq');

describe('stack', function () {
  it('should stack arguments', function (done) {
     var to = setTimeout(function () {
       throw new Error('never finished');
     }, 500);

     Seq([4, 5, 6])
         .seq(function (x, y, z) {
           arguments.length.should.equal(3);
           [x, y, z].should.eql([4, 5, 6]);
           this.stack.should.eql([4, 5, 6]);
           this(null);
         })
         .set([3, 4])
         .seq(function (x, y) {
           arguments.length.should.equal(2);
           [x, y].should.eql([3, 4]);
           this.stack.should.eql([3, 4]);
           this(null);
         })
         .empty()
         .seq(function () {
           arguments.length.should.equal(0);
           this.stack.should.eql([]);
           this.next(null, ['a']);
         })
         .extend(['b', 'c'])
         .seq(function (a, b, c) {
           arguments.length.should.equal(3);
           [a, b, c].should.eql(['a', 'b', 'c']);
           this.stack.should.eql(['a', 'b', 'c']);
           this.pass(null);
         })
         .pop()
         .push('c', 'd', 'e')
         .seq(function (a, b, c, d, e) {
           arguments.length.should.equal(5);
           [a, b, c, d, e].should.eql(['a','b','c','d','e']);
           this.stack.should.eql(['a','b','c','d','e']);
           this.pass(null);
         })
         .shift()
         .shift()
         .seq(function (c, d, e) {
           arguments.length.should.equal(3);
           [c, d, e].should.eql(['c', 'd', 'e']);
           this.stack.should.eql(['c', 'd', 'e']);
           this.pass(null);
         })
         .set([['a',['b']],['c','d',['e']]])
         .flatten(false)
         .seq(function (a, b, c, d, e) {
           arguments.length.should.equal(5);
           [a, b, c, d, e].should.eql(['a',['b'],'c','d',['e']]);
           this.stack.should.eql(['a',['b'],'c','d',['e']]);
           this.pass(null);
         })
         .set([['a','b'],['c','d',['e']]])
         .flatten()
         .seq(function (a, b, c, d, e) {
           arguments.length.should.equal(5);
           [a, b, c, d, e].should.eql(['a','b','c','d','e']);
           this.stack.should.eql(['a','b','c','d','e']);
           this.pass(null);
         })
         .splice(2, 2)
         .seq(function (a, b, e) {
           arguments.length.should.equal(3);
           [a, b, e].should.eql(['a','b','e']);
           this.stack.should.eql(['a','b','e']);
           this.pass(null);
         })
         .reverse()
         .seq(function (a, b, e) {
           arguments.length.should.equal(3);
           [a, b, e].should.eql(['e','b','a']);
           this.stack.should.eql(['e','b','a']);
           this.pass(null);
         })
         .map(function(ch){ return ch.toUpperCase(); })
         .seq(function (A, B, E) {
           arguments.length.should.equal(3);
           [A, B, E].should.eql(['E','B','A']);
           this.stack.should.eql(['E','B','A']);
           this.pass(null);
         })
         .reduce(function(s, ch){ return s + ':' + ch; })
         .seq(function (acc) {
           arguments.length.should.equal(1);
           acc.should.eql('E:B:A');
           this.stack.should.eql(['E:B:A']);
           this.pass(null);
         })
         .seq(function () {
           clearTimeout(to);
           done();
         })
     ;
   });
});


