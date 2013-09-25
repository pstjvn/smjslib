/**
 * @fileoverview Provides the video / audio listing data structure. The basic
 *   listing is nothing more than an augmented data list, however we need to
 *   support nested listings and thus we need to make sure that lists can
 *   refference children listings and child list can refference its parent
 *   listing. This file also provide the global search function, that allows
 *   the end user to dial in the channel ID directly and the system will have
 *   access to all loaded data and perform eficient search for it. The file
 *   also provides abstracted loader implemenation that allows the lists to
 *   load sub-lists efficiently. The loader can be used to initialize the main
 *   lists while the lists will handle loading sublists themselves uing the
 *   same loader instance.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('smstb.ds.List');
goog.provide('smstb.ds.Loader');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.object');
goog.require('pstj.ds.List');
goog.require('smstb.ds.Record');
goog.require('smstb.transport.Transport');



/**
 * Extended listing for the view items. The catch is that we might point to
 *   another listing. Because users want to be able to dial any ID and the
 *   channel to just go and play we want to have global map for all possible
 *   items to be played. For this to work property it is most suitable that we
 *   have a global dial function that known in which list is each ID.
 * @constructor
 * @extends {pstj.ds.List}
 * @param {Array.<smstb.ds.Record>=} opt_nodes Optional list of nodes to add
 *   initially.
 */
smstb.ds.List = function(opt_nodes) {
  /**
   * The parent listing pointer.
   * @private
   * @type {smstb.ds.List}
   */
  this.parent_ = null;
  /**
   * The list of pointers to dir lists. The lists themselves should have back
   *   pointer to the parent.
   * @private
   * @type {Object}
   */
  this.dirs_ = {};

  // register at the global list of listings for syste wide search.
  smstb.ds.List.instances_.push(this);
  goog.base(this, opt_nodes);
};
goog.inherits(smstb.ds.List, pstj.ds.List);


/**
 * Loads a subdirectory of this directory, basically supporting filesystem
 *   like hierchy.
 * @param {smstb.ds.Record} node A node in the list that can potentially be a
 *   directory.
 * @protected
 */
smstb.ds.List.prototype.loadDir = function(node) {
  if (!!(node.getProp(smstb.ds.Record.Property.ISDIR)) != false) {
    smstb.ds.Loader.getInstance().load(
        /** @type {Object|smstb.transport.Resource.<number>|string} */ (
        node.getProp(smstb.ds.Record.Property.ISDIR)), goog.bind(
        function(list) {
          this.dirs_[node.getId()] = list;
          list.setParent(this);
        }, this));
  }
};


/**
 * Sets the parent list for this list instance. This allows us to have a
 *   global store for all lists and reference them from application UI level
 *   by their main ID and from there by items pointing to ID lists and the
 *   child lists are effectively pointing to their parent, thus the child
 *   lists do not nessesarily need special item in them for 'parent'.
 * @param {!smstb.ds.List} parent The parent list of this list instance to
 *   set.
 */
smstb.ds.List.prototype.setParent = function(parent) {
  this.parent_ = parent;
};


/**
 * Gets the parent list if there is one.
 * @return {?smstb.ds.List} The parent list or null if there is not one set.
 */
smstb.ds.List.prototype.getParent = function() {
  return this.parent_;
};


/** @inheritDoc */
smstb.ds.List.prototype.disposeInternal = function() {
  goog.array.remove(smstb.ds.List.instances_, this);
  goog.object.forEach(this.dirs_, function(list) {
    goog.dispose(list);
  });
  this.dirs_ = null;
  this.parent_ = null;
  goog.base(this, 'disposeInternal');
};


/**
 * Overrides the method to make check to assure the type of the node.
 * @override
 */
smstb.ds.List.prototype.add = function(node) {
  goog.asserts.assertInstanceof(node, smstb.ds.Record,
      'Only records should be put in the list');
  goog.base(this, 'add', node);
  this.loadDir(node);
};


/**
 * @private
 * @type {Array.<smstb.ds.List>}
 */
smstb.ds.List.instances_ = [];


/**
 * Search for a particular ID in all lists created. This will include any
 *   lists, including ones that are aloded after the initial setup and sub
 *   directory listings.
 * @param {pstj.ds.RecordID} id The record id to look up.
 * @return {?smstb.ds.Record} The item found or null.
 */
smstb.ds.List.globalSearch = function(id) {
  var list = goog.array.find(smstb.ds.List.instances_, function(list) {
    return !(goog.isNull(list.getById(id)));
  });
  // now that we have the list, we can emit the fact that this list is now
  // active and we can return the element itself.
  if (goog.isNull(list)) {
    return null;
  } else {
    var result = list.getById(id);
    // assert the type - makes compiler happy and is removed with goog.DEBUG =
    // false;
    goog.asserts.assertInstanceof(result, smstb.ds.Record,
        'The record is not really instance of record.');
    return result;
  }
};



/**
 * Provides the loader innstance and makes it globally available as well as
 *   intrinsically available to lists.
 * @constructor
 */
smstb.ds.Loader = function() {
  /**
   * @private
   * @type {Array.<(Object|smstb.transport.Resource.<number>|string)>}
   */
  this.uris_ = [];
  /**
   * @private
   * @type {Array.<function(!smstb.ds.List): undefined>}
   */
  this.callbacks_ = [];
  this.boundTick_ = goog.bind(this.tick, this);
};
goog.addSingletonGetter(smstb.ds.Loader);

goog.scope(function() {

var _ = smstb.ds.Loader.prototype;


/**
 * Abstracts the loading of data in lists.
 * @param {Object|smstb.transport.Resource.<number>|string} resource The
 *   resource to load, could be anything because different subsystems use
 *   different foler stuctures.
 * @param {function(!smstb.ds.List): undefined} callback The callback to
 *   execute with the response.
 * @param {boolean=} opt_has_priority If the resource should be loaded with
 *   priority.
 */
_.load = function(resource, callback, opt_has_priority) {
  if (!!opt_has_priority) {
    this.uris_.unshift(resource);
    this.callbacks_.unshift(callback);
  } else {
    this.uris_.push(resource);
    this.callbacks_.push(callback);
  }
  setTimeout(this.boundTick_, 100);
};


/**
 * Handles a load of data.
 * @private
 * @param {function(!smstb.ds.List): undefined} callback The callback to
 *   execute with the list.
 * @param {Error} error An error that might have occured on loading.
 * @param {Array|Object|string} raw_data The data returned by the server.
 */
_.handleLoadedFolder_ = function(callback, error, raw_data) {
  if (goog.isArray(raw_data)) {
    var list = new smstb.ds.List();
    goog.array.forEach(raw_data, function(data) {
      list.add(new smstb.ds.Record(data));
    });
    callback(list);
  } else {
    // what will we do with non list data...
    if (goog.DEBUG) {
      console.log('The returned data should have been a list...');
    }
  }
};


/**
 * Tick function, called only when needed.
 * @protected
 */
_.tick = function() {
  if (!goog.array.isEmpty(this.uris_)) {
    var resource = this.uris_.shift();
    var callback = this.callbacks_.shift();
    smstb.transport.Transport.getInstance().getSourceFromName(
        resource, goog.bind(this.handleLoadedFolder_, this, callback));
  }
};

});  // goog.scope

