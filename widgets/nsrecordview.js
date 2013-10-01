/**
 * @fileoverview Application specific subclassing of the TableView to handle
 * peculiarities of the listing.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('smstb.widget.NSRecordView');

goog.require('pstj.lab.style.css');
goog.require('pstj.ui.TableView');
goog.require('smstb.widget.NSRecordItem');
goog.require('smstb.widget.RecordRenderer');



/**
 * Provides implementation of TableView with the cell components being rendered
 * by specialized instances suitable for the application. More specifically the
 * implementation also listens for the rasterize ready event and calls the
 * showImages method of its children.
 *
 * @constructor
 * @extends {pstj.ui.TableView}
 */
smstb.widget.NSRecordView = function() {
  goog.base(this);
  this.getHandler().listen(this, pstj.ui.TableView.EventType.RASTERIZE_READY,
      this.handleRasterizeReady);
};
goog.inherits(smstb.widget.NSRecordView, pstj.ui.TableView);


smstb.widget.NSRecordView.ActiveItemStyleSuffix_ = ' scale(0.98)';

/** @inheritDoc */
smstb.widget.NSRecordView.prototype.createRowCell = function() {
  return new smstb.widget.NSRecordItem(
      smstb.widget.RecordRenderer.getInstance());
};


/** @inheritDoc */
smstb.widget.NSRecordView.prototype.setModel = function(model) {
  goog.base(this, 'setModel', model);
  this.handleRasterizeReady();
};


/**
 * Handles the rasterize ready event.
 * @protected
 */
smstb.widget.NSRecordView.prototype.handleRasterizeReady = function() {
  this.forEachChild(function(child) {
    child.showImages();
  });
};


/** @inheritDoc */
smstb.widget.NSRecordView.prototype.applyStyles = function() {
  for (var i = 0, len = this.getChildCount(); i < len; i++) {
    var child = this.getChildByOffsetIndex(i);
    pstj.lab.style.css.setTranslation(child.getElement(), 0,
        ((i * this.getChildHeight()) + this.getVisualOffset()), undefined,
        child.isActive() ? smstb.widget.NSRecordView.ActiveItemStyleSuffix_ :
        '');
  }
};
