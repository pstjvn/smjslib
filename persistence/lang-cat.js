goog.provide('smstb.persistence.categories');
goog.provide('smstb.persistence.languages');

goog.require('smstb.persistence.List');

/**
 * @fileoverview Provides wrapped language and category settings access.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * @type {smstb.persistence.List}
 * @private
 */
smstb.persistence.languages.instance_ = null;

/**
 * Getter for the language list instance.
 * @return {smstb.persistence.List} The storage list instance for the languages.
 */
smstb.persistence.languages.getInstance = function() {
  if (!smstb.persistence.languages.instance_) {
    smstb.persistence.languages.instance_ = new smstb.persistence.List(
      'languages');
    smstb.persistence.languages.instance_.setNamedList(
      smstb.persistence.languages.list_);
  }
  return smstb.persistence.languages.instance_;
};

/**
 * The list of language names.
 * @type {Array.<string>}
 * @private
 */
smstb.persistence.languages.list_ = [
  'Afrikaans',
  'Albanian',
  'Arabic',
  'Armenian',
  'Azerbaijani',
  'Basque',
  'Belarusian',
  'Bulgarian',
  'Catalan',
  'Chinese',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Esperanto',
  'Estonian',
  'Filipino',
  'Finnish',
  'French',
  'Galician',
  'Georgian',
  'German',
  'Greek',
  'Gujarati',
  'Haitian Creole',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Icelandic',
  'Indonesian',
  'Irish',
  'Italian',
  'Japanese',
  'Kannada',
  'Korean',
  'Latin',
  'Latvian',
  'Lithuanian',
  'Macedonian',
  'Malay',
  'Maltese',
  'Norwegian',
  'Persian',
  'Polish',
  'Portuguese',
  'Romanian',
  'Russian',
  'Serbian',
  'Slovak',
  'Slovenian',
  'Spanish',
  'Swahili',
  'Swedish',
  'Tamil',
  'Telugu',
  'Thai',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Vietnamese',
  'Welsh',
  'Yiddish'
];

/**
 * @type {smstb.persistence.List}
 * @private
 */
smstb.persistence.categories.instance_ = null;

/**
 * Getter for the categoty list instance.
 * @return {smstb.persistence.List} The storage list instance for the
 *  categories.
 */
smstb.persistence.categories.getInstance = function() {
  if (!smstb.persistence.categories.instance_) {
    smstb.persistence.categories.instance_ = new smstb.persistence.List(
      'categories');
    smstb.persistence.categories.instance_.setNamedList(
      smstb.persistence.categories.list_);
  }
  return smstb.persistence.categories.instance_;
};

/**
 * The array of category names.
 * @type {Array.<string>}
 * @private
 */
smstb.persistence.categories.list_ = [
  'Drama',
  'Comedy',
  'Horror',
  'Documentary',
  'Action',
  'Sports',
  'News',
  'Series',
  'Kids',
  'Adult',
  'Family',
  'General Interest',
  'Music',
  'Entertainment',
  'Others'
];
