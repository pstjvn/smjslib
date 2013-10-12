goog.provide('smstb.tv.ErrorDialog');

goog.require('goog.ui.ControlRenderer');
// we know that the player dialog needs the button and inlinelist component.
goog.require('smstb.tv.Button');
goog.require('smstb.tv.Container');
goog.require('smstb.tv.ContainerRenderer');
goog.require('smstb.tv.decorator');



/**
 * Provides the dialog for player configuration.
 * @constructor
 * @extends {smstb.tv.Container}
 */
smstb.tv.ErrorDialog = function() {
  goog.base(this, (/** @type {pstj.ui.ControlRenderer} */(
      goog.ui.ControlRenderer.getCustomRenderer(
          smstb.tv.ContainerRenderer, goog.getCssName('error-dialog')))));
};
goog.inherits(smstb.tv.ErrorDialog, smstb.tv.Container);


smstb.tv.decorator.register(goog.getCssName('error-dialog'),
    smstb.tv.ErrorDialog);


goog.scope(function() {

var _ = smstb.tv.ErrorDialog.prototype;


/**
 * Sets the error message text.
 * @param {string} str The message to set.
 */
_.setErrorText = function(str) {
  this.getElementByClass(goog.getCssName('dialog-message')).innerHTML = str;
};

});  // goog.scope
