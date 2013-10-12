goog.provide('smstb.tv.ButtonRenderer');

goog.require('smstb.tv.ComponentRenderer');



/**
 * Provides the class name space for the TV button.
 * @constructor
 * @extends {smstb.tv.ComponentRenderer}
 */
smstb.tv.ButtonRenderer = function() {
  goog.base(this);
};
goog.inherits(smstb.tv.ButtonRenderer, smstb.tv.ComponentRenderer);
goog.addSingletonGetter(smstb.tv.ButtonRenderer);


/**
 * @const
 * @type {string}
 */
smstb.tv.ButtonRenderer.CSS_CLASS = goog.getCssName('tv-button');

goog.scope(function() {

var _ = smstb.tv.ButtonRenderer.prototype;


/** @inheritDoc */
_.getCssClass = function() {
  return smstb.tv.ButtonRenderer.CSS_CLASS;
};

});  // goog.scope
