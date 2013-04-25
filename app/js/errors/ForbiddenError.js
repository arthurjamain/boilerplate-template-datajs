/**
 * @fileoverview Error that represents a forbidden error.
 *
 * Forbidden errors should be raised when a request attempts to perform an
 * operation that is not authorized.
 */
define(['./BaseError'], function (BaseError) {

  /**
   * Internal error class
   */
  var ForbiddenError = function (message, err) {
    BaseError.call(this, message, err);
    this.name = 'forbidden';
  };
  ForbiddenError.prototype = new BaseError();

  return ForbiddenError;
});
