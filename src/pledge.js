'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

const $Promise = function(executor){
  this._state = 'pending'; // pending, fulfilled, rejected
  this._value = undefined;
  this._handlerGroups = [];

  let boundResolve = this._internalResolve.bind(this);
  let boundReject = this._internalReject.bind(this);

  if (executor) executor(boundResolve, boundReject);
}

$Promise.prototype._internalResolve = function(data) {
    if (this._state !== 'pending') return;
    this._state = 'fulfilled';
    this._value = data;
    this._callHandlers();
  };

$Promise.prototype._internalReject = function(data) {
    if (this._state !== 'pending') return;
    this._state = 'rejected';
    this._value = data;
    this._callHandlers();
}

$Promise.prototype.then = function(successCb, errorCb) {
    if (typeof successCb !== 'function') successCb = null; 
    if (typeof errorCb !== 'function') errorCb = null; 
    let newPromise = new $Promise();

    //if (!(successCb instanceof $Promise)) newPromise._value =  successCb();

    this._handlerGroups.push(
      {successCb: successCb, 
       errorCb: errorCb, 
       downstreamPromise: newPromise});
    if (this._state !== 'pending') this._callHandlers();
    return newPromise;
}

$Promise.prototype._callHandlers = function() {
    while (this._handlerGroups.length > 0) {
        var handlerGroup = this._handlerGroups.shift();
        if (handlerGroup) {
            if (this._state === 'fulfilled') {
                if (handlerGroup.successCb) handlerGroup.successCb(this._value);
                else handlerGroup.downstreamPromise._internalResolve(this._value);
            }
            if (this._state === 'rejected') {
                if (handlerGroup.errorCb) handlerGroup.errorCb(this._value);
                else handlerGroup.downstreamPromise._internalReject(this._value);
            } 
        }
    }
}

$Promise.prototype.catch = function(func) {
    return this.then(null, func);
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
