/**
 * @fileoverview Provides tweaked implementation for the record item view that
 * handles the images differently to allow for smoother animation.
 * The widget itself is a composite component that utilizes both the image
 * component and the NG agent to display its content.
 * TODO: add the EPG preview widget as well.
 *
 * @author regardingscot@gmail.com (PeterStJ)
 */

goog.provide('smstb.widget.NSRecordItem');

goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');
goog.require('pstj.configure');
goog.require('pstj.ui.Image');
goog.require('pstj.ui.TableViewItem');
goog.require('pstj.ui.TouchAgent');



/**
 * Specialized implementation that for TableViewItem that uses ngAgent for text
 * but handles the images expecting call to its showImages method. This allows
 * the developer to postpone the image rasterization process and thus reduce the
 * paint timing and improve performance.
 *
 * @constructor
 * @extends {pstj.ui.TableViewItem}
 * @param {pstj.ui.ControlRenderer=} opt_renderer Optional renderer to use.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 * document interaction.
 */
smstb.widget.NSRecordItem = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer);
  /**
   * Reference to the image component. It is used internally to represen the
   * thumbnail of the record.
   * @type {pstj.ui.Image}
   * @private
   */
  this.image_ = new pstj.ui.Image();
  this.registerDisposable(this.image_);
  // Enable hover state only on PC as it has the resources to render that
  // on Mobile this is overhead we want to avoid.
  if (pstj.configure.getRuntimeValue(
      'PLATFORM', 'pc', 'SYSMASTER.APPS.MOBILETV') != 'pc') {
    this.setSupportedState(goog.ui.Component.State.HOVER, false);
  }
};
goog.inherits(smstb.widget.NSRecordItem, pstj.ui.TableViewItem);


/**
 * This is reference to the default thumbnail to use. Deprecated as the ng
 * filter is handling the images in such a way as to always return a valid
 * image source.
 *
 * @type {string}
 * @protected
 */
smstb.widget.NSRecordItem.DEFAULT_THUMBNAIL = goog.asserts.assertString(
    pstj.configure.getRuntimeValue('DEFAULT_THUMBNAIL',
    'assets/default-thumbnail.svg',
    'SYSMASTER.APPS.MOBILETV').toString());


/**
 * Reference the default thumbnail for folders.
 *
 * @type {string}
 * @protected
 */
smstb.widget.NSRecordItem.DEFAULT_FOLDER_THUMBNAIL = goog.asserts.assertString(
    pstj.configure.getRuntimeValue('DEFAULT_FOLDER_THUMBNAIL',
    'assets/default-folder-thumbnail.png',
    'SYSMASTER.APPS.MOBILETV'));


goog.scope(function() {

var _ = smstb.widget.NSRecordItem.prototype;


/** @inheritDoc */
_.setModel = function(model) {
  goog.base(this, 'setModel', model);
  this.setThumbnail();
};


/**
 * Sets the thumbnail of the record.
 * @protected
 */
_.setThumbnail = function() {
  if (goog.isNull(this.getModel())) {
    this.image_.setModel('');
  } else {
    var src = this.getModel().getProp(smstb.ds.Record.Property.THUMBNAIL);
    if (src == '') {
      if (this.getModel().getProp(smstb.ds.Record.Property.ISDIR)) {
        src = smstb.widget.NSRecordItem.DEFAULT_FOLDER_THUMBNAIL;
      } else {
        src = smstb.widget.NSRecordItem.DEFAULT_THUMBNAIL;
      }
    }
    this.image_.setModel(src);
  }
};


/**
 * Shows the image currently set in the model. This is to divert the rendering
 * path that has issues on the mobile when rasterzing the images.
 */
_.showImages = function() {};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.addChild(this.image_);
  this.image_.decorate(this.getElementByClass(goog.getCssName('poster')));
  pstj.ui.TouchAgent.getInstance().attach(this);
};

});  // goog.scope
