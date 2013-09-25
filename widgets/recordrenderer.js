goog.provide('smstb.widget.RecordRenderer');

goog.require('pstj.ui.TableViewItemRenderer');

/**
 * Provides the templated version of the TableViewItem renderer designed for our
 * application specifically.
 *
 * @constructor
 * @extends {pstj.ui.TableViewItemRenderer}
 */
smstb.widget.RecordRenderer = function() {
  goog.base(this);
};
goog.inherits(smstb.widget.RecordRenderer, pstj.ui.TableViewItemRenderer);
goog.addSingletonGetter(smstb.widget.RecordRenderer);

/**
 * @type {string}
 * @protected
 * @final
 */
smstb.widget.RecordRenderer.CSS_CLASS = goog.getCssName('playable-list-item');

/** @inheritDoc */
smstb.widget.RecordRenderer.prototype.getTemplate = function(comp) {
  return smstb.template.PlayableListItem(this.generateTemplateData(comp));
};

/** @inheritDoc */
smstb.widget.RecordRenderer.prototype.getCssClass = function() {
  return smstb.widget.RecordRenderer.CSS_CLASS;
};

/**
 * Export a new ng filter to use in the template related to this code.
 */
goog.exportSymbol('ngfDisplayIfLargerThanZero', function(data) {
  if (data > 0) return 'block';
  return 'none';
});

goog.exportSymbol('ngfDefaultImage', function(url) {
  if (!url || url == '') {
    return 'assets/default-thumbnail.svg';
  } else {
    return url;
  }
});

goog.exportSymbol('ngDisplayIfFalse', function(data) {
  if (data) return 'none';
  return 'block';
})

