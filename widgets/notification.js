goog.provide('smstb.widget.Notification');

goog.require('goog.async.Delay');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('pstj.ds.ListItem');
goog.require('pstj.ui.ngAgent');


/**
 * @fileoverview Provides a very simple notification component that when
 *  enabled displays a message on the top part of the screen. The message
 *  will be auto hidden after 3.5 seconds or after the top part of the
 *  screen is pressed / clicked.
 * @author <regardingscot@gmai.com> (PeterStJ)
 */



/**
 * Simple notification widget for PC and mobile. It expects its model to either
 *  be a string or an object. By default the string model is converted to object
 *  with 'text' property for the template is executed as ngTemplate and expects
 *  a list item as model.
 * @constructor
 * @extends {goog.ui.Component}
 */
smstb.widget.Notification = function() {
  goog.base(this);
  this.delay_ = new goog.async.Delay(function() {
    this.enable(false);
  }, 1500, this);
  this.registerDisposable(this.delay_);
  this.enabled_ = false;
  this.needsUpdate_ = false;
};
goog.inherits(smstb.widget.Notification, goog.ui.Component);


/** @inheritDoc */
smstb.widget.Notification.prototype.setModel = function(model) {
  if (goog.isString(model)) {
    if (this.getModel() instanceof pstj.ds.ListItem) {
      this.getModel().mutate('text', model);
    } else {
      goog.base(this, 'setModel', new pstj.ds.ListItem({
        'id': 1,
        'text': model
      }));
    }
  } else if (model instanceof pstj.ds.ListItem) {
    goog.base(this, 'setModel', model);
  } else {
    throw new Error(
        'The model for notification should either be a string or a list item');
  }
  if (this.enabled_) {
    this.needsUpdate_ = true;
  } else {
    pstj.ui.ngAgent.getInstance().apply(this);
    this.needsUpdate_ = false;
  }
  this.enable(true);
  this.delay_.start();
};


/** @inheritDoc */
smstb.widget.Notification.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getElement(),
      [goog.events.EventType.CLICK,
        goog.events.EventType.TOUCHSTART], function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.enable(false);
      });
};


/**
 * Enables/disables the visibility of the component.
 * @param {boolean} enable If ture the component will be shown.
 */
smstb.widget.Notification.prototype.enable = function(enable) {
  if (this.needsUpdate_) {
    pstj.ui.ngAgent.getInstance().apply(this);
    this.needsUpdate_ = false;
    enable = true;
  }
  if (!enable) {
    this.delay_.stop();
  }
  this.enabled_ = enable;
  goog.dom.classes.enable(this.getElement(), goog.getCssName('active'), enable);
};

