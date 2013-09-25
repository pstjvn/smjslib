goog.provide('smstb.transport.Resource');

/**
 * @fileoverview Provides the enumaration of all known prefedined resources
 *   that can be retrieved without knowing their exact query specific names.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */


/**
 * The type of sources that we should know how to obtain.
 * @enum {number}
 */
smstb.transport.Resource = {
  IPTVLIST: 0,
  IPTVEPG: 1,
  VODLIST: 2,
  PPVLIST: 3,
  USERVIDEOLIST: 4,
  AODLIST: 5,
  ONLINERADIOLIST: 6
};
