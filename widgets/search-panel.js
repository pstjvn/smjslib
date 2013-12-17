/**
 * @fileoverview Provides wrapping logic for the search panel. This is very
 *  ugly, bound to HTML code, that you should NOT reuse!
 *
 * @author <regardingscot@gmail.com> (PeterStJ)
 */

goog.provide('smstb.widget.SearchPanel');

goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('pstj.configure');
goog.require('pstj.ui.TouchAgent');
goog.require('smstb.widget.RadioSelect');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
smstb.widget.SearchPanel = function() {
  goog.base(this);
  /**
   * @type {Element}
   * @private
   */
  this.input_ = null;
  /**
   * @type {smstb.widget.RadioSelect}
   * @private
   */
  this.type_ = new smstb.widget.RadioSelect();
  /**
   * @type {Element}
   * @private
   */
  this.language_ = null;
  /**
   * @type {Element}
   * @private
   */
  this.category_ = null;

  this.clear_ = new goog.ui.Control('');
  this.hide_ = new goog.ui.Control('');
  this.clearLanguage_ = new goog.ui.Control('');
  this.clearCategory_ = new goog.ui.Control('');
  this.hideAfterTypeChange_ = goog.asserts.assertBoolean(
      pstj.configure.getRuntimeValue('TYPE_HIDES_FILTER',
          false, 'SYSMASTER.APPS.MOBILETV'), 'The option should be boolean');
};
goog.inherits(smstb.widget.SearchPanel, goog.ui.Component);


/** @inheritDoc */
smstb.widget.SearchPanel.prototype.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);

  this.input_ = this.getElementByClass(goog.getCssName('searchfield'));

  this.type_.decorate(this.getElementByClass(goog.getCssName(
      'type-selection')));

  this.language_ = this.getElementByClass(goog.getCssName(
      'language-selection'));
  this.category_ = this.getElementByClass(goog.getCssName(
      'category-selection'));


  this.clear_.decorate(this.getElementByClass(goog.getCssName(
      'search-clear')));
  this.hide_.decorate(this.getElementByClass(goog.getCssName('hide-button')));
  this.clearLanguage_.decorate(this.getElementByClass(goog.getCssName(
      'language-clear')));
  this.clearCategory_.decorate(this.getElementByClass(goog.getCssName(
      'category-clear')));

  pstj.ui.TouchAgent.getInstance().attach(this.hide_);
  pstj.ui.TouchAgent.getInstance().attach(this.clear_);
  pstj.ui.TouchAgent.getInstance().attach(this.clearLanguage_);
  pstj.ui.TouchAgent.getInstance().attach(this.clearCategory_);
};


/** @inheritDoc */
smstb.widget.SearchPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.input_, goog.events.EventType.CHANGE,
      function(e) {
        this.input_.blur();
        this.dispatchEvent(goog.ui.Component.EventType.ACTION);
      });

  this.getHandler().listen(this.type_, goog.ui.Component.EventType.ACTION,
      function(e) {
        this.dispatchEvent(goog.ui.Component.EventType.ACTION);
        if (this.hideAfterTypeChange_) {
          this.enable(false);
        }
      });

  this.getHandler().listen(this.language_, goog.events.EventType.CHANGE,
      function(e) {
        this.dispatchEvent(goog.ui.Component.EventType.ACTION);
      });

  this.getHandler().listen(this.category_, goog.events.EventType.CHANGE,
      function(e) {
        this.dispatchEvent(goog.ui.Component.EventType.ACTION);
      });

  this.getHandler().listen(this.clear_, goog.ui.Component.EventType.ACTION,
      function(e) {
        e.stopPropagation();
        this.input_.value = '';
        this.dispatchEvent(goog.ui.Component.EventType.ACTION);
      });

  this.getHandler().listen(this.hide_, goog.ui.Component.EventType.ACTION,
      function(e) {
        e.stopPropagation();
        this.enable(false);
      });

  this.getHandler().listen(this.clearLanguage_,
      goog.ui.Component.EventType.ACTION,
      function(e) {
        e.stopPropagation();
        this.language_.selectedIndex = 0;
        this.dispatchEvent(goog.ui.Component.EventType.ACTION);
      });

  this.getHandler().listen(this.clearCategory_,
      goog.ui.Component.EventType.ACTION,
      function(e) {
        this.category_.selectedIndex = 0;
        this.dispatchEvent(goog.ui.Component.EventType.ACTION);
      });
};


/**
 * Shows/hides the panel.
 * @param {boolean} enable If true the panel is visualized.
 */
smstb.widget.SearchPanel.prototype.enable = function(enable) {
  goog.dom.classlist.enable(this.getElement(), goog.getCssName('active'),
      enable);
};


/**
 * Getter for the current value of the search.
 * @return {Array.<string>}
 */
smstb.widget.SearchPanel.prototype.getSearchPattern = function() {
  return [
    goog.string.trim(this.input_.value),
    this.language_.value,
    this.type_.getValue(),
    this.category_.value];
};
