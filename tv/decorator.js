goog.provide('smstb.tv.decorator');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');


goog.scope(function() {

var _ = smstb.tv.decorator;


/**
 * The css class name to match when determining if a child DOM element
 *   should be considered for decoration. This is used to tell the decorator
 *   that a DOM element is expected to be decorated when automatic
 *   recursuive decoration is performed. Without it the looking up on all
 *   children elements of a base DOM element can take too much time in
 *   complext structures.
 * @type {string}
 * @private
 */
_.decorateCssClass_ = goog.getCssName('decorate');


/**
 * The class name to use when determining which component to focus initially
 *   when the decoration is executed recursively.
 * @type {string}
 * @private
 */
_.focusCssClass_ = goog.getCssName('focusme');


/**
 * Object that serve as hash for the classname -> decorator Class link.
 *
 * @type {Object}
 * @private
 */
_.registry_ = {};


/**
 * Registers a class name with a contructor / decorator.
 * @param  {!string} classname The css class name to match.
 * @param  {!function(new:smstb.tv.Component)} constr The contructor
 *   function to execute with the elements that match the css class.
 */
_.register = function(classname, constr) {
  _.registry_[classname] = constr;
};


/**
 * Decorate a DOM element and optionally its children.
 * @param  {!string|Element} baseElement The ID of an element ir the element
 *   itself to decorate.
 * @param  {boolean=} opt_recursive If true, the children DOM elements will be
 *   checked for automatic decoration.
 * @param  {string=} opt_deco_cssclass Optional css class name to use to
 *   match elements that want to be decorated (only for children elements).
 * @return {!smstb.tv.Component}
 */
_.decorate = function(baseElement, opt_recursive, opt_deco_cssclass) {


  var mainCompponent;
  var element = goog.dom.getElement(baseElement);
  var decorator = _.findDecorator_(goog.dom.classlist.get(element));

  if (decorator && element) {
    mainCompponent = /** @type {!smstb.tv.Component} */(new decorator());
    mainCompponent.decorate(element);


    if (opt_recursive) {
      _.decorateChildren(mainCompponent, goog.isString(opt_deco_cssclass) ?
          opt_deco_cssclass : _.decorateCssClass_);
    }

    return mainCompponent;
  } else {
    throw new Error('Cound not decorate the element');
  }
};


/**
 * Sets the css class name that will be used to match DOM elements that have
 *   been decorated to components when determining if a component should be
 *   focused after recusrive automatic decoration.
 * @param {!string} cssclass The css class name to look for on DOM elements,
 *   when searching for item to focus.
 */
_.setFocusCssClass = function(cssclass) {
  _.focusCssClass_ = cssclass;
};


/**
 * Looks up the class name in the css class -> component registry.
 * @param  {{length: number}} cssclasses The list of css class names assigned
 *   to the DOM element that we want to decorate.
 * @private
 * @return {?function(new:smstb.tv.Component)} The constructor matching
 *   the class name or null if none is found.
 */
_.findDecorator_ = function(cssclasses) {
  var decorator;
  for (var i = 0, len = cssclasses.length; i < len; i++) {
    decorator = _.registry_[cssclasses[i]];
    if (decorator) {
      return decorator;
    }
  }
  return null;
};


/**
 * Decorates a base element recursively.
 * @param  {smstb.tv.Component} base The base component that we should search
 *   for DOM elements that need decoration.
 * @param  {!string} css_decorate_me Css class name to match when performing
 *   the children element css class name match to figure out if that
 *   particular DOM element should be decorated.
 * @protected
 */
_.decorateChildren = function(base, css_decorate_me) {
  // The base DOM element to walk
  var baseElement = base.getElement();

  // All DOM elements that have the decorate-me class
  var collection = goog.dom.getElementsByClass(css_decorate_me, baseElement);
  if (goog.DEBUG) {
    console.log('Css decorateme class', css_decorate_me);
    console.log('the base Element', baseElement);
    console.log('The matching elements fond', collection);
  }

  if (goog.array.isEmpty(collection)) {
    return;
  }

  // All components
  /**
   * @type {Array.<smstb.tv.Component>}
   */
  var components = [base];
  // All DOM elements
  var elements = [baseElement];

  var decorator;
  var component;

  for (var i = 0, len = collection.length; i < len; i++) {
    decorator = _.findDecorator_(goog.dom.classlist.get(collection[i]));

    if (decorator) {
      component = new decorator();
      component.decorate(collection[i]);
      components.push(component);
      elements.push(collection[i]);
      component = null;
      decorator = null;
    }
  }

  var node;
  var index;

  // Set the top most DOM node, above which no checks are performed
  var limit = baseElement.parentNode;

  // Setup parent/child connection for decorated elements
  if (goog.DEBUG) console.log(components);
  if (!goog.array.isEmpty(components)) {
    // For each found component
    for (i = 0, len = components.length; i < len; i++) {
      // Get the element.
      var el = components[i].getElement();
      // Find the parent node
      node = el.parentNode;
      // Walk trou the parent nodes
      while (node != limit) {
        // If the parent node is also a component
        index = elements.indexOf(node);
        if (index != -1) {
          // Add the component to the found parent component
          components[index].addChild(components[i]);
          break;
        } else {
          node = node.parentNode;
        }
      }
    }
  }

  // Find the first DOM element that has the focise-me class
  var focused = goog.dom.getElementByClass(_.focusCssClass_, baseElement);

  if (goog.DEBUG) console.log(' Focused element', focused);

  // If there is one, find its index in the list to match the component by
  // index and call its focus method.
  if (focused) {
    var findex = elements.indexOf(focused);

    goog.DEBUG && console.log('Focus index', findex);

    if (findex > -1) {
      components[findex].focus();
    }
  }
};

});  // goog.scope
