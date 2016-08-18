/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {writeScript, loadScript, checkData} from '../3p/3p';

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function adgear(global, data) {

  const supportedFields = ['platform', 'tag_type', 'format_id',
                           // Console
                           'host', 'chip_key', 'impression_hints', 'dont_say_hello',
                           /* Console Static */ 'adspot_id',
                           /* Console Dynamic */ 'container_id', 'path',
                           /* Console Agency */ 'placement_id', 'click_tracker', 'cache_buster', 'click_tracker_expects_encoded', 'click_tracker_is_encoded', 'click_tracker_is_double_encoded', 'agref',
                           // Trader
                           /* SSP */ 'seller_public_id',
                           /* Universal */ 'buyer_id', 'buyer_security_token', 'agdata', 'ag'];
  checkData(data, supportedFields);

  function toBoolean(value, default_value) {
    if (value === 1 || value === true || value === "true") {
      return true;
    } else if (value === 0 || value === false || value === "false") {
      return false;
    } else {
      return default_value || false;
    }
  }

  function parseJSON(str, default_value) {
    try { return JSON.parse(str); }
    catch(err) { return default_value; }
  }

  // Console detection
  // Console Static AdSpot
  if (data.adspot_id && data.adspot_id !== "") {
    data.platform = data.platform || "console";
    data.tag_type = data.tag_type || "static";
  // Console Dynamic AdSpot
  } else if (data.container_id && data.container_id !== "") {
    data.platform = data.platform || "console";
    data.tag_type = data.tag_type || "dynamic";
  // Console Agency tag
  } else if (data.placement_id && data.placement_id !== "") {
    data.platform = data.platform || "console";
    data.tag_type = data.tag_type || "agency";

  // Trader detection
  // Trader SSP tag
  } else if (data.seller_public_id && data.seller_public_id !== "") {
    data.platform = data.platform || "trader";
    data.tag_type = data.tag_type || "ssp";
  // Trader Universal tag
  } else if (data.buyer_id && data.buyer_id !== "") {
    data.platform = data.platform || "trader";
    data.tag_type = data.tag_type || "universal";
  }

  // ////////////// //
  // AdGear Console //
  // ////////////// //
  if (data.platform === "console") {

    let impression_hints = parseJSON(data.impression_hints, {});

    // Agency Third-Party tag
    if (data.tag_type === "agency") {
      let host = "d.adgear.com";
      if (data.host) { host = data.host.replace(/https:\/\//, "").replace(/\//, ""); }

      (function() {
        global.__ADGEAR_SSL = true;
        global.ADGEAR_SOURCE_CLICKTRACKER = data.click_tracker || "__CLICK_TRACKER_URL__";
        global.ADGEAR_SOURCE_CLICKTRACKER_EXPECTS_ENCODED = toBoolean(data.click_tracker_expects_encoded, false);
        global.ADGEAR_SOURCE_CLICKTRACKER_IS_ENCODED = toBoolean(data.click_tracker_is_encoded, false);
        global.ADGEAR_SOURCE_CLICKTRACKER_IS_DOUBLE_ENCODED = toBoolean(data.click_tracker_is_double_encoded, false);
        var randomnum = encodeURIComponent(data.cache_buster || "__RANDOM_NUMBER__");
        var agref = "";
        var proto = "http:";
        if (!agref.match(/^https?/i)) agref = data.agref || "";
        if (((typeof __ADGEAR_SSL != "undefined") && __ADGEAR_SSL) || (window.location.protocol == "https:")) proto = "https:";
        if (randomnum.substring(0,2) == "__") randomnum = String(Math.random());

        let impression_hints_str = "";
        Object.keys(impression_hints).forEach(key => {
          impression_hints_str += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(impression_hints[key]);
        });

        let agency_url = "https://" + encodeURIComponent(host) + "/impressions/ext/p=" +
                         encodeURIComponent(data.placement_id) + ".js?AG_R=" + randomnum +
                         (agref === "" ? "" : ("&AG_REF=" + encodeURIComponent(agref))) +
                         (impression_hints_str === "" ? "" : impression_hints_str)

        writeScript(global, agency_url);
      })();

    // Publisher tags
    } else if (data.tag_type === "static" || data.tag_type === "dynamic") {
      global.ADGEAR_DONT_SAY_HELLO = toBoolean(data.dont_say_hello, true);

      let host = "a.adgear.com";
      if (data.host) { host = data.host.replace(/https:\/\//, "").replace(/\//, ""); }

      writeScript(global, "https://" + encodeURIComponent(host) + "/adgear.js/current/adgear.js", () => {
        global.ADGEAR.tags.script.init();
        global.ADGEAR.lang.namespace("ADGEAR.site_callbacks");

        global.ADGEAR.site_callbacks.variables = function() {
          return impression_hints;
        }

        // Static Adspot
        if (data.tag_type === "static") {
          global.ADGEAR.tags.script.embed({
            "id":       data.adspot_id,
            "chip_key": data.chip_key
          });

        // Dynamic Adspot
        } else if (data.tag_type === "dynamic") {
          let path = parseJSON(data.path, []);

          global.ADGEAR.tags.script.universal({
            "chip_key":     data.chip_key,
            "container_id": data.container_id,
            "format_id":    data.format_id,
            "path":         path
          });

        }
      });

    // No valid tag_type found
    } else {
      throw new Error("Unknown AdGear Console tag type")
    }

  // /////////////////// //
  // AdGear Trader - SSP //
  // /////////////////// //
  } else if (data.platform === "trader") {

    // SSP Tag
    if (data.tag_type === "ssp") {
      let host = "cdn.adgrx.com";
      if (data.host) { host = data.host.replace(/https:\/\//, "").replace(/\//, ""); }

      global.__AG = {
        spots: [{
          "format":   data.format_id,
          "size":     data.width + "x" + data.height,
          "target":   "c",
          "position": null
        }]
      };
      loadScript(global, "https://" + encodeURIComponent(host) + "/sites/" + encodeURIComponent(data.seller_public_id) + "/tag.js");

    // Universal Tag
    } else if (data.tag_type === "universal") {
      let host = "cdn.adgrx.com";
      if (data.host) { host = data.host.replace(/https:\/\//, "").replace(/\//, ""); }

      global.__AGDATA = parseJSON(data.agdata, {});
      global.__AG = parseJSON(data.ag, {});
      loadScript(global, "https://" + encodeURIComponent(host) + "/usegments/" + encodeURIComponent(data.buyer_security_token) + "/" + encodeURIComponent(data.buyer_id) + ".js");

    // No valid tag_type found
    } else {
      throw new Error("Unknown AdGear Trader tag type")
    }

  // No platform found
  } else {
    throw new Error("Unknown AdGear tag type")
  }
}
