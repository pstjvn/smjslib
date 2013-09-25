goog.provide('smstb.widget.MobilePopup');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.Templated');
goog.require('pstj.ui.ngAgent');

/**
 * @fileoverview For the mobile platforms we need a popup that is protected
 *  with an iframe as to not allow stealing of events from native tags like the
 *  video tag on ipad.
 * @author <regardingscot@gmail.com> (PeterStJ)
 */

/**
 * Because we need special actions and presumably special dom tree we inherits
 *  from the templated version of the components.
 * @param {pstj.ui.Template=} opt_template Optionally the template to use for
 *  DOM construction.
 * @constructor
 * @extends {pstj.ui.Templated}
 */
smstb.widget.MobilePopup = function(opt_template) {
  goog.base(this, opt_template);
  /**
   * @type {Element}
   * @private
   */
  this.frameOverlay_ = null;
  /**
   * @type {?function(boolean):void}
   * @private
   */
  this.callback_ = null;
  this.closeButton = new pstj.ui.Button();
  this.okButton = new pstj.ui.Button();
  this.cancelButton = new pstj.ui.Button();
};
goog.inherits(smstb.widget.MobilePopup, pstj.ui.Templated);

/** @inheritDoc */
smstb.widget.MobilePopup.prototype.setModel = function(model) {
  goog.base(this, 'setModel', model);
  pstj.ui.ngAgent.getInstance().apply(this);
};

/** @inheritDoc */
smstb.widget.MobilePopup.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);

  this.frameOverlay_ = goog.dom.createDom('iframe', goog.getCssName('smstb-iframe-overlay'));
  this.frameOverlay_.style.display = 'none';
  goog.dom.insertSiblingBefore(this.getElement(), this.frameOverlay_);

  this.addChild(this.closeButton);
  this.addChild(this.okButton);
  this.addChild(this.cancelButton);

  this.closeButton.decorate(this.getElementByClass(goog.getCssName('close')));
  this.okButton.decorate(this.getElementByClass(goog.getCssName('ok')));
  this.cancelButton.decorate(this.getElementByClass(goog.getCssName('cancel')));

  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION, function(e) {
    e.stopPropagation();
    this.callback_(e.target == this.okButton);
    this.enable(false);
  });
};

/**
 * Enables/disables the popup.
 * @param {boolean} enable If true the popup is enabled.
 * @param {function(boolean):void=} callback The callback to use when handling the result from the popup query.
 */
smstb.widget.MobilePopup.prototype.enable = function(enable, callback) {
  if (enable) {
    this.frameOverlay_.style.display = 'block';
    goog.asserts.assertFunction(callback);
    this.callback_ = callback;
  } else {
    this.frameOverlay_.style.display = 'none';
  }
  goog.dom.classlist.enable(this.getElement(), goog.getCssName('active'), enable);
};
