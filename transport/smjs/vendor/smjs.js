/**
 * @fileoverview Provides asbtracted model over the smjs host object found in
 * the Sysmaster STB devices of the M series.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.vendor.Smjs');

goog.require('smstb.transport.smjs.Dispatcher');
goog.require('smstb.vendor.ESmjs');



/**
 * The smjs wrapper class. The class is designed to not be instanciated,
 *   instead use the getInstance static method.
 * @constructor
 */
smstb.vendor.Smjs = function() {
  /**
   * Flag is set to true when the initialization completes, used to prevent
   *   re-initialization.
   * @type {boolean}
   * @private
   */
  this.hasBeenInited_ = false;
  /**
   * Flag that is set to true when the emulated instance is used. It requires
   *   websocket in the host and socket server enabled in the STB and us ised
   *   mainly for development.
   * @type {boolean}
   * @private
   */
  this.emulated_ = false;

  if (goog.isDef(goog.global['smjs'])) {
    this.smjs_ = goog.global['smjs'];
  } else {
    this.emulated_ = true;
    this.smjs_ = new smstb.vendor.ESmjs();
  }
  this.initAPI_();
};
goog.addSingletonGetter(smstb.vendor.Smjs);


/**
 * The method is copied from the original host implementation but is alled
 *   internally.
 * @private
 */
smstb.vendor.Smjs.prototype.initAPI_ = function() {
  if (this.hasBeenInited_) return;
  this.smjs_['initapi']();
  this.hasBeenInited_ = true;
  // If the host object is used, we need to set up the global receiver
  // function that the host will attempt to execute once there is a packet
  // to be sent to the JS land. We will do it here and after that we need to
  // let the host know about the name to be used.
  if (!this.isEmulated()) {
    var dispatcher = smstb.transport.smjs.Dispatcher.getInstance();
    goog.exportSymbol(smstb.vendor.Smjs.DEFAULT_HANDLER_NAME_,
        goog.bind(dispatcher.process, dispatcher));
  }
  this.setHandler_(smstb.vendor.Smjs.DEFAULT_HANDLER_NAME_);
};


/**
 * Wraps the host object emthod for setting the symbol name to call with
 *   package data.
 * @param {string} symbol The symbol name.
 * @private
 */
smstb.vendor.Smjs.prototype.setHandler_ = function(symbol) {
  this.smjs_['set_json_handler'](symbol);
};


/**
 * Wraps the command calling method of the host object. It expects string
 *   (JSON string).
 * @param {string} command The serialized object with command.
 */
smstb.vendor.Smjs.prototype.cmd = function(command) {
  this.smjs_['jsoncmd'](command);
};


/**
 * Wraps the host object API for configuring the OSD in the native STB player.
 *   The API allows the developer to configure which OSD symbols will be
 *   displayed on the player when its state changes.
 *
 * Note that the flags are not supported in the emulated environment as the
 *   call cannot be transported over the socket.
 * @param {number} flags The flags to set on the OSD control. The flags are a
 *   bit mask combination of the supported flags.
 */
smstb.vendor.Smjs.prototype.setOSDFlags = function(flags) {
  if (this.isEmulated()) return;
  this.smjs_['setosdflags'](flags);
};


/**
 * Accessor method to check if the environment is emulating the smjs object or
 *   the vendor one is used.
 * @return {boolean} True if the envoronment is emulated.
 */
smstb.vendor.Smjs.prototype.isEmulated = function() {
  return this.emulated_;
};


/**
 * The global callback name.
 * @type {string}
 * @private
 * @final
 */
smstb.vendor.Smjs.DEFAULT_HANDLER_NAME_ = 'jsonReceiver';


/**
 * The OSD flags that are supported.
 * @enum {number}
 */
smstb.vendor.Smjs.OSFFlags = {
  // If bit is set the buffering OSD will not be shown.
  BUFFERING: 0x01
};
