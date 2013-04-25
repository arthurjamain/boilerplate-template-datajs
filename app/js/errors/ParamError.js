/**
 * @fileoverview Error that represents a third-party parameter error.
 *
 * A ParamError should typically be raised when a route contains an invalid
 * parameter.
 */
define(['./BaseError'], function (BaseError) {

  /**
   * Parameter error class
   */
  var ParamError = function (message, err) {
    BaseError.call(this, message, err);
    this.name = 'invalid parameter';
  };
  ParamError.prototype = new BaseError();

  return ParamError;
});
