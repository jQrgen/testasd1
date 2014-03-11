'use strict';

describe('Service: Cordovaready', function () {

  // load the service's module
  beforeEach(module('devApp'));

  // instantiate service
  var Cordovaready;
  beforeEach(inject(function (_Cordovaready_) {
    Cordovaready = _Cordovaready_;
  }));

  it('should do something', function () {
    expect(!!Cordovaready).toBe(true);
  });

});
