/**
 * @fileoverview Base class for all errors that the app may raise.
 */
define(function () {
  /**
   * Base error description.
   *
   * The error features an internal name, a message and a custom error object.
   *
   * The message is intended for public consumption. As such, it must not
   * contain any sensitive information.
   *
   * The custom error object is for internal use only (meaning for the
   * environment that locally executes the datasource) and may include
   * sensitive information.
   */
  var BaseError = function (message, err) {
    /**
     * Internal name. Override this name in derivated classes
     */
    this.name = 'error';

    /**
     * The error message
     */
    this.message = message;

    /**
     * The custom error object that provides additional context information,
     * if defined.
     */
    this.err = err;

    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, arguments.callee);
    }
  };
  BaseError.prototype = new Error();

  return BaseError;
});
