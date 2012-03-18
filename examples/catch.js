var Seq = require('seq');

function lib (args, cb) {
  var error = null;

  if (args == undefined) {
    error = new Error('args is neccesary');
  }

  cb(error, args);
}

var result;

Seq()
    .seq(function () {
      lib('Hello', this);
     })
    .seq(function (args) {
      result = args;
      lib(undefined, this);
    })
    .catch(function (error) {
      console.log(result);
      console.error(error);
    })
    .seq(function (args) {
      throw new Error('This must passed');
    })
;

