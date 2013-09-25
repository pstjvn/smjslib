goog.provide('smstb.tv.ComponentRenderer');

goog.require('pstj.ui.ControlRenderer');

/**
 * @constructor
 * @extends {pstj.ui.ControlRenderer}
 */
smstb.tv.ComponentRenderer = function() {
  goog.base(this);
};
goog.inherits(smstb.tv.ComponentRenderer, pstj.ui.ControlRenderer);
goog.addSingletonGetter(smstb.tv.ComponentRenderer);

/**
 * @const
 * @type {string}
 */
smstb.tv.ComponentRenderer.CSS_CLASS = goog.getCssName('tvc');

goog.scope(function() {

  var _ = smstb.tv.ComponentRenderer.prototype;

  /** @inheritDoc */
  _.getCssClass = function() {
    return smstb.tv.ComponentRenderer.CSS_CLASS;
  };

  /** @inheritDoc */
  _.getKeyEventTarget = function(component) {
    return null;
  };
});
