/**
 * @fileoverview Provides augmented pager for the STB. This class has
 * some utility methods for hoding the pager that are used by the
 * STB UI controller.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.widget.Pager');

goog.require('goog.dom.classlist');
goog.require('pstj.widget.Pager');



/**
 * Provides the functions needed in stb for pager.
 *
 * @constructor
 * @extends {pstj.widget.Pager}
 */
smstb.widget.Pager = function() {
  goog.base(this);
  this.hidden_ = false;
};
goog.inherits(smstb.widget.Pager, pstj.widget.Pager);

goog.scope(function() {
var _ = smstb.widget.Pager.prototype;


/**
 * Hides the whole component.
 */
_.hide = function() {
  this.hidden_ = true;
  goog.dom.classlist.add(this.getElement(), goog.getCssName('smstb-hidden'));
};


/**
 * Shows the component.
 */
_.show = function() {
  this.hidden_ = false;
  goog.dom.classlist.remove(this.getElement(),
      goog.getCssName('smstb-hidden'));
};


/**
 * Getter for the hidden state.
 *
 * TODO: this is a bad design!
 * @return {boolean} True if the component is currently hidden.
 */
_.isHidden = function() {
  return this.hidden_;
};

});  // goog.scope
