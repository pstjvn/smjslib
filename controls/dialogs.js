goog.provide('smstb.control.dialogs');

goog.require('smstb.tv.ErrorDialog');

// TODO: this is not finished work
goog.scope(function() {

  var _ = smstb.control.dialogs;

  /**
   * Flag for if we already have a visible dialog.
   * @type {boolean}
   * @private
   */
  _.hasDialogVisible_ = false;

  /**
   * Queue with dialog requests.
   * @type {Array.<?>}
   * @private
   */
  _.dialogQueue_ = [];

  /**
   * Initialization logic
   */
  _.init = function() {
    // create the dialogs in the dom.
    // decorate all type of dialogs.
  };

  /**
   * The type of dialogs we want to have.
   * @enum {number}
   */
  _.Type = {
    ERROR: 0,
    PLAYER_CONFIG: 1
  };

  /**
   * Creates a dialog and attached handler to its demise.
   * @param {smstb.control.dialogs.Type} type The type of the dialog to show.
   * @param {function(boolean): void} handler The handler for the dialog.
   * @param {string=} options Possible options for the dialog.
   */
  _.createDialog = function(type, handler, options) {
  };
});
