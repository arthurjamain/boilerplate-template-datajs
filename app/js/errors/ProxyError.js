/**
 * @fileoverview Error that represents an error returned by some third party
 * remote server.
 *
 * A ProxyError should typically be raised when a content provider cannot be
 * reached or returns an error.
 */
define(['./BaseError'], function (BaseError) {

  /**
   * Proxy error class
   */
  var ProxyError = function (message, err) {
    BaseError.call(this, message, err);
    this.name = 'gateway error';
  };
  ProxyError.prototype = new BaseError();

  return ProxyError;
});
