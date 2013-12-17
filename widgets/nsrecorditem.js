/**
 * @fileoverview Provides tweaked implementation for the record item view that
 * handles the images differently to allow for smoother animation.
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
  this.image_ = new pstj.ui.Image();
  /**
   * @type {Element}
   * @private
   */
  this.imageTag_ = null;
  /**
   * The source name (i.e. model attribute) of the image.
   * @type {string}
   * @private
   */
  this.imageSource_ = '';
  /**
   * Flag if we have an image to show, used to skip DOM alterations when not
   * needed.
   * @type {boolean}
   * @private
   */
  this.hasHiddenImages_ = false;
  /**
   * Flag if the image is currently visible.
   * @type {boolean}
   * @private
   */
  this.imageVisible_ = false;
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
 * Sets the visiblity state of the image. Basically we want to hide the old
 * image before we actually change the image itself in order to impove
 * rendering performance.
 * @protected
 * @param {boolean} visible True if the image should be visible.
 */
_.setImageVisible = function(visible) {
  if (this.imageVisible_ != visible) {
    this.imageVisible_ = visible;
    goog.dom.classlist.enable(this.imageTag_, goog.getCssName(
        'smstb-hidden-image'), !visible);
  }
};


/**
 * Shows the image currently set in the model. This is to divert the rendering
 * path that has issues on the mobile when rasterzing the images.
 */
_.showImages = function() {
  return;
  if (!this.hasHiddenImages_) {
    return;
  }
  this.hasHiddenImages_ = false;
  var url = '';

  if (!goog.isNull(this.getModel())) {
    url = this.getModel().getProp(this.imageSource_);
    if (url == '') {
      if (this.getModel().getProp(smstb.ds.Record.Property.ISDIR)) {
        url = smstb.widget.NSRecordItem.DEFAULT_FOLDER_THUMBNAIL;
      } else {
        url = smstb.widget.NSRecordItem.DEFAULT_THUMBNAIL;
      }
    }
  }
  this.imageTag_.src = url;
};


/** @inheritDoc */
_.exitDocument = function() {
  goog.base(this, 'exitDocument');
  if (!goog.isNull(this.imageTag_)) {
    this.imageTag_.onload = null;
  }
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.addChild(this.image_);
  this.image_.decorate(this.getElementByClass(goog.getCssName('poster')));
  //this.imageTag_ = this.getElement().querySelector('img');

  // if (!goog.isNull(this.imageTag_)) {
  //   this.imageTag_.onload = goog.bind(function() {
  //     this.setImageVisible(true);
  //   }, this);
  //   this.imageSource_ = goog.dom.dataset.get(this.imageTag_, 'urlname') ||
  //       'none';
  // }

  pstj.ui.TouchAgent.getInstance().attach(this);
};

});  // goog.scope
