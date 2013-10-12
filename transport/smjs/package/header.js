/**
 * @fileoverview Provides the header for the packages.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.transport.smjspackage.Header');

goog.require('pstj.math.utils');



/**
 * @constructor
 * @param {string=} opt_method The method to set for the header.
 * @param {string=} opt_type The type of the package to ser for th header.
 */
smstb.transport.smjspackage.Header = function(opt_method, opt_type) {
  this['method'] = opt_method ||
      smstb.transport.smjspackage.Header.defaultMethod_;
  this['type'] = opt_type || smstb.transport.smjspackage.Header.defaultType_;
  this['tag'] = smstb.transport.smjspackage.Header.generateTag_();
};


/**
 * @private
 * @type {string}
 */
smstb.transport.smjspackage.Header.defaultMethod_ = 'calld';


/**
 * @private
 * @type {string}
 */
smstb.transport.smjspackage.Header.defaultType_ = 'request';


/**
 * Generates the tag for the new package.
 * @private
 * @return {string} The unique tag.
 */
smstb.transport.smjspackage.Header.generateTag_ = function() {
  return '_' + goog.now() + '_' + pstj.math.utils.getRandomBetween(1, 1000);
};
