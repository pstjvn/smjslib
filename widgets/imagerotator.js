goog.provide('smstb.widget.ImageRotator');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.async.Delay');
goog.require('goog.dom.classlist');
goog.require('pstj.configure');
goog.require('pstj.ds.Image');
goog.require('pstj.ds.ImageList');
goog.require('pstj.ds.ImageList.EventType');
goog.require('pstj.ui.Templated');



/**
 * Provides the image rotator base component for relax center app.
 *
 * @constructor
 *
 * @extends {pstj.ui.Templated}
 */
smstb.widget.ImageRotator = function() {
  goog.base(this);
  this.imageList_ = new pstj.ds.ImageList();
  this.imageList_.enableListRewind(true);
  this.imageList_.setParentEventTarget(this);
  this.getHandler().listenOnce(this.imageList_,
      pstj.ds.ImageList.EventType.READY, this.onImageReady);
  this.rotateDelayed_ = new goog.async.Delay(this.rotate,
      +pstj.configure.getRuntimeValue('ROTATION_INTERVAL', 5000,
          'SYSMASTER.APPS.RELAX'), this);

  /**
   * The first slide of interchange images.
   *
   * @private
   * @type {Element}
   */
  this.slidea_ = null;

  /**
   * The second slide of interchangable images.
   *
   * @private
   * @type {Element}
   */
  this.slideb_ = null;

  /**
   * Whether the next slide to update and show is slide b.
   *
   * @type {boolean}
   * @private
   */
  this.nextisslideb_ = true;
};
goog.inherits(smstb.widget.ImageRotator, pstj.ui.Templated);


goog.scope(function() {

var _ = smstb.widget.ImageRotator.prototype;


/** @inheritDoc */
_.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.slidea_ = goog.dom.createDom('div', this.getBaseClassName());
  this.slideb_ = goog.dom.createDom('div', this.getBaseClassName());
  this.getElement().appendChild(this.slidea_);
  this.getElement().appendChild(this.slideb_);
};


/**
 * Getter for the base class name (to allow overriding in sublcasses.)
 *
 * @return {string} The base class name.
 */
_.getBaseClassName = function() {
  return goog.getCssName('image-rotation-slide');
};


/**
 * Adds list of images to be used in the rotation map.
 * @param {Array.<string>} imagelist The list of urls of images to load.
 */
_.addImages = function(imagelist) {
  goog.array.forEach(imagelist, function(src) {
    this.imageList_.loadImage(src);
  }, this);
};


/**
 * Adds a new image to the list to be loaded.
 *
 * @param {string} imagesrc The src of the image to load.
 */
_.addImage = function(imagesrc) {
  this.imageList_.loadImage(imagesrc);
};


/**
 * Swaps the images on the screen by altering the background image of the
 * invisible div and then toggle the classes of both images to swap them.
 *
 * @param {string} imageSource The source of the image to set to the div to be
 * shown.
 *
 * @protected
 */
_.swapImages = function(imageSource) {
  var slide = (this.nextisslideb_) ? this.slideb_ : this.slidea_;
  this.nextisslideb_ = !this.nextisslideb_;
  slide.style.backgroundImage = 'url(' + imageSource + ')';
  goog.dom.classlist.toggle(this.slideb_, goog.getCssName(
      this.getBaseClassName(), 'visible'));
  goog.dom.classlist.toggle(this.slidea_, goog.getCssName(
      this.getBaseClassName(), 'visible'));
};


/**
 * Torate the images, using the next image in the list.
 *
 * @protected
 */
_.rotate = function() {
  var record =  /** @type {pstj.ds.Image} */ (this.imageList_.getNext());
  this.swapImages(record.getSource());
  this.imageList_.setCurrent(record);
  this.rotateDelayed_.start();
};


/**
 * Handles the readiness of the first image in the listing.
 *
 * @protected
 */
_.onImageReady = function() {
  if (!this.isInDocument()) return;
  var count = this.imageList_.getCount();

  if (count < 1) {
    throw new Error('This should not happen!');
  }

  var record = this.imageList_.getCurrent();

  goog.asserts.assertInstanceof(record, pstj.ds.Image,
      'Only instances of image record are allowed');
  this.slidea_.style.backgroundImage = 'url(' + record.getSource() + ')';
  goog.dom.classlist.add(this.slidea_, goog.getCssName(
      this.getBaseClassName(), 'visible'));

  this.rotateDelayed_.start();
};


/**
 * Pause the image rotation sequence.
 */
_.pause = function() {
  this.rotateDelayed_.stop();
};


/**
 * Resumes the image rotation.
 */
_.resume = function() {
  this.rotateDelayed_.start();
};


/**
 * Sets the currently displayed image by its index. Notice that because the
 * images are loaded and added in the list asynchronously the index map might
 * be incorrect but becuase the ID of the images is the order in which they
 * are queued to be loaded it is safe to assume that the ID is the index and
 * thus we load by ID while the method is called by index.
 *
 * @param {number} index The index of the image to display.
 */
_.setImageByIndex = function(index) {
  if (index < 0 || index >= this.imageList_.getCount()) {
    return;
  }
  this.swapImages(/** @type {pstj.ds.Image} */ (
      this.imageList_.getById(index.toString())).getSource());
};


/**
 * In basic use case the ID is actually the order of the image converted to
 * string, so starting from 0. Setting the image by ID will swap the image
 * displayed and pause the rotation.
 *
 * @param {string} imageid The image ID to use.
 */
_.setById = function(imageid) {
  var record = /** @type {pstj.ds.Image} */(this.imageList_.getById(imageid));
  if (goog.isNull(record)) return;
  this.pause();
  this.swapImages(record.getSource());
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  if (this.imageList_.getCount() > 0) {
    this.onImageReady();
  }
};

});  // goog.scope
