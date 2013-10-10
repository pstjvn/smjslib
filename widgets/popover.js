/**
 * @fileoverview Provides the popover layer instanciated for use in the whole
 * app. It is primarily used to show options dialogs in STB environment.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.widget.PopOver');

goog.require('pstj.ui.PopOverLayer');


/**
 * @private
 * @type {pstj.ui.PopOverLayer}
 */
smstb.widget.PopOver.instance_ = null;


/**
 * Getter for the instance to use. Require this instance throuout the lifecycle
 *  of your application to make sure no stacking problems will arrise.
 * @return {pstj.ui.PopOverLayer}
 */
smstb.widget.PopOver.getInstance = function() {
  if (goog.isNull(smstb.widget.PopOver.instance_)) {
    smstb.widget.PopOver.instance_ = new pstj.ui.PopOverLayer();
    smstb.widget.PopOver.instance_.render();
  }
  return smstb.widget.PopOver.instance_;
};
