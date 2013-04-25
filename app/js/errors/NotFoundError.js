/**
 * @fileoverview Error that represents a not-found error.
 *
 * A NotFoundError should typically be raised when a request is made to a
 * non existing application route.
 */
define(['./BaseError'], function (BaseError) {

  /**
   * Parameter error class
   */
  var NotFoundError = function (message, err) {
    BaseError.call(this, message, err);
    this.name = 'not found';
  };
  NotFoundError.prototype = new BaseError();

  return NotFoundError;
});
