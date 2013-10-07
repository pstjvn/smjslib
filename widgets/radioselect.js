goog.provide('smstb.widget.RadioSelect');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ControlRenderer');
goog.require('pstj.ui.Button');
goog.require('pstj.ui.EmbededButtonRenderer');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
smstb.widget.RadioSelect = function() {
  goog.base(this);
  /**
   * The currently selected item.
   * @type {pstj.ui.Button}
   * @private
   */
  this.current_ = null;
};
goog.inherits(smstb.widget.RadioSelect, goog.ui.Component);


goog.scope(function() {

var _ = smstb.widget.RadioSelect.prototype;


/** @inheritDoc */
_.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);

  var children = this.getElement()['children'];
  for (var i = 0; i < children.length; i++) {
    var button = new pstj.ui.Button(
        /** @type {pstj.ui.CustomButtonRenderer} */(
        goog.ui.ControlRenderer.getCustomRenderer(
        pstj.ui.EmbededButtonRenderer, goog.getCssName(
            'smstb-radio-button'))));
    button.setSupportedState(goog.ui.Component.State.CHECKED, true);
    button.setAutoStates(goog.ui.Component.State.CHECKED, false);
    this.addChild(button);
    button.decorate(children.item(i));
    this.registerDisposable(button);
  }
  this.current_ = this.getChildAt(0);
  this.current_.setChecked(true);
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
      this.handleAction);
};


/**
 * Handler for the selection event happening in the child list.
 * @param {goog.events.Event} e The ACTION UI event.
 * @protected
 */
_.handleAction = function(e) {
  var target = /** @type {pstj.ui.Button} */(e.target);
  if (this.current_ != target) {
    if (!goog.isNull(this.current_)) {
      this.current_.setChecked(false);
    }
    this.current_ = target;
    this.current_.setChecked(true);
  }
};


/**
 * Getter for the current value selected in the radio options.
 * @return {string}
 */
_.getValue = function() {
  console.log(this.current_);
  var ret = this.current_.getActionName();
  if (goog.isNull(ret)) return '';
  return ret;
};

});  // goog.scope
