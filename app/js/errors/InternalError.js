/**
 * @fileoverview Error that represents an internal error.
 *
 * Internal errors should only be raised when unexpected error conditions
 * occur. In particular, such errors must not be raised when a parameter
 * provided by a third party is invalid.
 */
define(['./BaseError'], function (BaseError) {
  /**
   * Internal error class
   */
  var InternalError = function (message, err) {
    BaseError.call(this, message, err);
    this.name = 'internal error';
  };
  InternalError.prototype = new BaseError();

  return InternalError;
});
