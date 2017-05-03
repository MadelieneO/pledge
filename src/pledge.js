'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

const $Promise = function(executor){
  this._state = 'pending';
  this._value = undefined;

  let boundResolve = this._internalResolve.bind(this);
  let boundReject = this._internalReject.bind(this);

  if (executor) executor(boundResolve, boundReject);
}

$Promise.prototype._internalResolve = function(data) {
    if (this._state !== 'pending') return;
    this._state = 'fulfilled';
    this._value = data;
  };

$Promise.prototype._internalReject = function(data) {
    if (this._state !== 'pending') return;
    this._state = 'rejected';
    this._value = data;
  }


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
