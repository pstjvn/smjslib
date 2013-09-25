/**
 * @fileoverview Implements alternative ControlGroup that saves some memory on
 * event listeners and allows for manual management of active children (i.e.
 * mutexes etc if extended).
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.widget.ButtonPanel');

goog.require('goog.async.Delay');
goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');



/**
 * FIXME: transfer this to the library as it is well abstracted code.
 *
 * Implements behaviour very similar to pstj.widget.ControlGroup, however based
 * on the specific requirement for the fx part of the UI it was decided to
 * implement it as a stand alone component instead of a comosite (as it is used
 * in ControlGroup - a composite of Button instances).
 *
 * The component assumes a list of child nodes that can be 'click'-ed and
 * 'touch'-ed to activate actions on them similar to the ControlGroup, however
 * the state system of the button controls was not well suited and instead it
 * was decided to spare the extra listeners (by avoid creation of button
 * instances) and manage the state of the children nodes manually.
 *
 * The interface is preserved to be compatible with the ControlGroup handlers (
 * i.e. get the target of the event and getActionName method on it so one can
 * swap the ControlGroup safely with this one where needed).
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @param {number=} opt_delay Optionally the delay to use to call the
 * postHandler method.
 */
smstb.widget.ButtonPanel = function(opt_delay) {
  goog.base(this);
  /**
   * Points to the last element that had been activated.
   * @type {Element}
   * @private
   */
  this.current_ = null;
  this.delay_ = new goog.async.Delay(this.postHandler, ((
      goog.isNumber(opt_delay) && opt_delay > 0) ? opt_delay : 2000), this);

  this.registerDisposable(this.delay_);
};
goog.inherits(smstb.widget.ButtonPanel, goog.ui.Component);


/** @inheritDoc */
smstb.widget.ButtonPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getElement(), [goog.events.EventType.CLICK,
    goog.events.EventType.TOUCHSTART], this.preHandler);
};


/**
 * This method is designed to be delayed and the delay to be started at the end
 * of the activation handler. It is used to control classes and optionally
 * mutexes for exclution patterns of the buttons. In this implementation it
 * simply removes the 'active' class name from the activated button.
 *
 * @protected
 */
smstb.widget.ButtonPanel.prototype.postHandler = function() {
  goog.dom.classlist.remove(this.current_, goog.getCssName('active'));
};


/**
 * Handles the click/touchstart event in the component and try to match it to
 * an 'action'-able child node. If a child node was already marked as active
 * if is unmarked (i.e. no mutexing is applied to buttons).
 *
 * TODO: make the target walkable and search upwards for parent node that has
 * the action data attribute set until the component's element is reached. This
 * will allow to have more complex structure on the pseudo buttons.
 *
 * @param {goog.events.Event} e The browser CLICK/TOUCHSTART event.
 * @protected
 */
smstb.widget.ButtonPanel.prototype.preHandler = function(e) {
  e.stopPropagation();
  e.preventDefault();
  if (goog.dom.dataset.has(/** @type {Element} */ (e.target), 'action')) {
    if (!goog.isNull(this.current_)) {
      goog.dom.classlist.remove(this.current_, goog.getCssName('active'));
    }
    this.current_ = goog.asserts.assertInstanceof(e.target, Element);
    goog.dom.classlist.add(e.target, goog.getCssName('active'));
    this.dispatchEvent(goog.ui.Component.EventType.ACTION);
    this.delay_.start();
  }
};


/**
 * Returns the action data string if it exists on the last active element.
 *
 * @return {?string}
 */
smstb.widget.ButtonPanel.prototype.getActionName = function() {
  return goog.dom.dataset.get(this.current_, 'action');
};


/** inheritDoc */
smstb.widget.ButtonPanel.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.current_ = null;
  this.delay_ = null;
};
