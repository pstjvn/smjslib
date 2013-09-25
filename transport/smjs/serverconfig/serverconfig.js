goog.provide('smstb.serverconfig.Section');
goog.provide('smstb.serverconfig.Section.EventType');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('smstb.transport.smjspackage.Base');

/**
 * Provides the section abstraction for the config.
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {string} section The section name that this wrapper will be
 *   responsible for.
 */
smstb.serverconfig.Section = function(section) {
  goog.base(this);
  /**
   * @private
   * @type {string}
   */
  this.sectionName_ = section;
  /**
   * @private
   * @type {Object}
   */
  this.section_ = {};
};
goog.inherits(smstb.serverconfig.Section, goog.events.EventTarget);

goog.scope(function() {

  var _ = smstb.serverconfig.Section.prototype;

  /**
   * Gets the section value by name.
   * @param {string} name The name of the value to look up.
   * @param {function(string): undefined} callback The callback accepting the
   *   value.
   */
  _.get = function(name, callback) {
    if (goog.object.containsKey(this.section_, name)) {
      var result = goog.object.get(this.section_, name);
      setTimeout(function() {
        callback(result);
      }, 1);
    } else {
      (new smstb.transport.smjspackage.Base({
        'section': this.sectionName_,
        'var': name,
        'run': 'get_cfgval_json'
      })).send(goog.bind(
        function(response) {
          goog.object.set(this.section_, name, response.getResponseContent());
          callback(goog.object.get(this.section_, name));
        }, this));
    }
  };

  /**
   * Sets the value of an option name for this section.
   * @param {string} name The value name.
   * @param {string} newvalue The value option.
   * @param {function(string): undefined} callback We do not know it yet.
   */
  _.set = function(name, newvalue, callback) {
    if (goog.object.containsKey(this.section_, name)) {
      var value = goog.object.get(this.section_, name);
      if (value != newvalue) {
        (new smstb.transport.smjspackage.Base({
          'run': 'set_cfgval_json',
          'var': name,
          'val': newvalue,
          'section': this.sectionName_
        })).send(goog.bind(
          function(response) {
            console.log(response);
            goog.object.set(this.section_, name, newvalue);
            // callback(response.getResponseContent());
            this.dispatchEvent(smstb.serverconfig.Section.EventType.CHANGE);
          }, this));
      } else {
        callback(newvalue);
      }
    } else {
      // setting value that we know nothing about is funny...
      throw new Error('Cannot set unknown value');
    }
  };
});

/**
 * The events fired by the section instances.
 * @enum {string}
 */
smstb.serverconfig.Section.EventType = {
  CHANGE: goog.events.getUniqueId('change')
};

/**
 * Cache of section objects one for each section of the config.
 * @type {Object}
 * @private
 */
smstb.serverconfig.Section.instances_ = {};

/**
 * Caches the sections and returns always the one and same instance.
 * @param {string} sectionname The section name to look up and return.
 * @return {smstb.serverconfig.Section} The section instance mathcing that
 *   name.
 */
smstb.serverconfig.Section.getSection = function(sectionname) {
  if (!goog.object.containsKey(smstb.serverconfig.Section.instances_,
    sectionname)) {
    goog.object.set(smstb.serverconfig.Section.instances_, sectionname,
      new smstb.serverconfig.Section(sectionname));
  }
  return /** @type {smstb.serverconfig.Section} */ (goog.object.get(
    smstb.serverconfig.Section.instances_, sectionname));
};
