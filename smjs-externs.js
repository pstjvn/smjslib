
var SMJSJson = {};



/** @constructor */
SMJSJson.Header = function() {};


/** @type {string} */
SMJSJson.Header.prototype.tag;


/** @type {string} */
SMJSJson.Header.prototype.method;


/** @type {string} */
SMJSJson.Header.prototype.type;



/** @constructor */
SMJSJson.Request = function() {};


/** @type {string} */
SMJSJson.Request.prototype.url;


/** @type {string} */
SMJSJson.Request.prototype.page;



/** @constructor */
SMJSJson.Event = function() {};


/** @type {string} */
SMJSJson.Event.prototype.key;


/** @type {string} */
SMJSJson.Event.prototype.message;


/** @type {string} */
SMJSJson.Event.prototype.action;



/** @constructor */
SMJSJson.PlayerEvent = function() {};


/** @type {string} */
SMJSJson.PlayerEvent.prototype.serverip;


/** @type {boolean} */
SMJSJson.PlayerEvent.prototype.has_video;


/** @type {boolean} */
SMJSJson.PlayerEvent.prototype.has_audio;


/** @type {boolean} */
SMJSJson.PlayerEvent.prototype.seekable;


/** @type {number} */
SMJSJson.PlayerEvent.prototype.duration;


/** @type {string} */
SMJSJson.PlayerEvent.prototype.audio_codec;


/** @type {string} */
SMJSJson.PlayerEvent.prototype.format;


/** @type {string} */
SMJSJson.PlayerEvent.prototype.title;


/** @type {number} */
SMJSJson.PlayerEvent.prototype.current_position;


/** @type {number} */
SMJSJson.PlayerEvent.prototype.buffer_size;


/** @type {number} */
SMJSJson.PlayerEvent.prototype.buffer_time;


/** @type {number} */
SMJSJson.PlayerEvent.prototype.audio_samplerate;


/** @type {number} */
SMJSJson.PlayerEvent.prototype.audio_bitrate;


/** @type {boolean} */
SMJSJson.PlayerEvent.prototype.recording;



/** @constructor */
SMJSJson.MediaEvent = function() {};


/** @type {string} */
SMJSJson.MediaEvent.prototype.state;



/** @constructor */
SMJSJson.Response = function() {};


/** @type {string} */
SMJSJson.Response.prototype.status;


/** @type {string} */
SMJSJson.Response.prototype.content;



/**
 * @constructor
 */
SMJSJson.Packet = function() {};


/**
 * @type {SMJSJson.Header}
 */
SMJSJson.Packet.prototype.header;


/**
 * @type {SMJSJson.Request}
 */
SMJSJson.Packet.prototype.request;


/**
 * @type {SMJSJson.Event|SMJSJson.PlayerEvent|SMJSJson.MediaEvent}
 */
SMJSJson.Packet.prototype.event;


/**
 * @type {SMJSJson.Response}
 */
SMJSJson.Packet.prototype.response;



/** @constructor */
SMJSJson.CallDRequest = function() {};


/** @type {string} */
SMJSJson.CallDRequest.prototype.run;


/** @type {number} */
SMJSJson.CallDRequest.prototype.newif;


/** @type {string} */
SMJSJson.CallDRequest.prototype.sig;


/** @type {number} */
SMJSJson.CallDRequest.prototype.type;
