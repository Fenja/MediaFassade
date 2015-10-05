var cachedModules=[];
cachedModules[6100]={exports:{}};
(function(module,exports) {var socket;

socket = io();

module.exports = function() {
  return {
    getSocket: function() {
      return socket;
    },
    emit: function(msgType, msg) {
      return socket.emit(msgType, msg);
    }
  };
};
}).call(this,cachedModules[6100],cachedModules[6100].exports);
cachedModules[6411]={exports:{}};
(function(module,exports) {var configuration, headers, onError, req;

headers = "";

req = new XMLHttpRequest;

req.open('GET', document.location, true);

req.onload = function(e) {
  if (req.readyState === 4) {
    if (req.status === 200) {
      return headers = req.getAllResponseHeaders().toLowerCase().split("\n");
    } else {
      return console.error(req.statusText);
    }
  }
};

req.onerror = function(e) {
  return console.error(req.statusText);
};

req.send(null);

configuration = {};

onError = function(err) {
  if (err) {
    return console.log(err);
  }
};

module.exports = function() {
  return {
    parseGetparameter: function(val) {
      var index, items, result, tmp;
      result = "";
      tmp = [];
      items = location.search.substr(1).split("&");
      index = 0;
      while (index < items.length) {
        tmp = items[index].split("=");
        if (tmp[0] === val) {
          result = decodeURIComponent(tmp[1]);
        }
        index++;
      }
      return result;
    },
    getConfigurationObject: configuration,
    setConfigurationAttribute: function(key, value) {
      return configuration[key] = value;
    },
    setConfigurationAttributes: function(l) {
      var key, value, _results;
      _results = [];
      for (key in l) {
        value = l[key];
        _results.push(configuration[key] = value);
      }
      return _results;
    },
    getGravatar: function(emailhash, callback) {
      var gravatar;
      if (callback == null) {
        callback = onError;
      }
      gravatar = $('<img>').attr({
        src: 'http://www.gravatar.com/avatar/' + emailhash + '?s=64&m=identicon',
        "class": 'beforebgr'
      }).on("click", function() {
        return dialogLogin.dialog("open");
      });
      return $.getScript('http://www.gravatar.com/' + emailhash + '.json?callback=gravatarUserData').done(function(script, textStatus) {
        $('#login').replaceWith(gravatar);
        $("body").append(script);
        return callback({
          state: true,
          emailhash: emailhash
        });
      }).fail(function(jqxhr, settings, exception) {
        return callback({
          state: false,
          msg: "Triggered ajaxError handler."
        });
      });
    },
    getHeader: function(name) {
      var h, kv, _i, _len;
      if (headers === "") {
        return {
          state: "not ready"
        };
      }
      for (_i = 0, _len = headers.length; _i < _len; _i++) {
        h = headers[_i];
        kv = h.split(": ");
        if (kv[0] === name) {
          return {
            state: "ok",
            value: kv[1] + ""
          };
        }
      }
      return {
        state: "not found"
      };
    },
    setCookie: function(k, v, u) {
      if (u == null) {
        u = Infinity;
      }
      console.log("Remove " + k);
      docCookies.removeItem(k);
      console.log("Set " + k + " to " + v);
      return docCookies.setItem(k, v, u);
    }
  };
};
}).call(this,cachedModules[6411],cachedModules[6411].exports);
cachedModules[8774]={exports:{}};
(function(module,exports) {/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define */

(function ($) {
    'use strict';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
    * Convert an array of little-endian words to a string
    */
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
    * Calculate the MD5 of a raw string
    */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
    * Convert a raw string to a hex string
    */
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
    * Encode a string as utf-8
    */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            }
            return raw_md5(string);
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return md5;
        });
    } else {
        $.md5 = md5;
    }
}(this));
}).call(this,cachedModules[8774],cachedModules[8774].exports);
cachedModules[6277]={exports:{}};
(function(module,exports) {var callback, dialogLogin, formLogin, loginUser, stk_config, stk_socket;

cachedModules[8774].exports;

stk_config = cachedModules[6411].exports;

stk_socket = cachedModules[6100].exports;

callback = function(ret) {
  if (ret.state) {
    return stk_socket().emit('join', {
      emailhash: ret.emailhash
    });
  } else {
    return dialogLogin.dialog("open");
  }
};

loginUser = function() {
  var email, emailhash, name;
  name = $("#login-form #name").val();
  email = $("#login-form #email").val();
  emailhash = window.md5(email.toLowerCase().trim());
  stk_config().setCookie('emailhash', emailhash);
  stk_config().setCookie('email', email);
  stk_config().getGravatar(emailhash, callback);
  return true;
};

dialogLogin = $("#login-form").dialog({
  autoOpen: false,
  height: 340,
  width: 350,
  modal: true,
  buttons: {
    "Login": function() {
      dialogLogin.dialog("close");
      return loginUser();
    }
  },
  close: function() {}
});

formLogin = dialogLogin.find("form").on("submit", function(event) {
  event.preventDefault();
  return loginUser();
});

$("#login").button().on("click", function() {
  return dialogLogin.dialog("open");
});

module.exports = function() {
  return {
    dialogLogin: dialogLogin,
    loginUser: loginUser,
    prepare: prepare
  };
};
}).call(this,cachedModules[6277],cachedModules[6277].exports);
cachedModules[7606]={exports:{}};
(function(module,exports) {module.exports = function() {
  return {
    requireFullscreen: function(callback) {
      var Fullscreen, fullscreen, fullscreenElement, fullscreenEnabled, fullscreenExit, fullscreenchanged, prefix;
      fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
      fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
      fullscreen = function(e) {
        if (e == null) {
          e = document.documentElement;
        }
        if (e.requestFullScreen) {
          return e.mozRequestFullScreen();
        } else if (e.mozRequestFullScreen) {
          return e.mozRequestFullScreen();
        } else if (e.webkitRequestFullScreen) {
          return e.webkitRequestFullScreen();
        } else if (e.msRequestFullscreen) {
          return e.msRequestFullscreen();
        }
      };
      fullscreenExit = function(e) {
        if (e == null) {
          e = document.documentElement;
        }
        if (e.cancelFullScreen) {
          return e.mozCancelFullScreen();
        } else if (e.mozCancelFullScreen) {
          return e.mozCancelFullScreen();
        } else if (e.webkitExitFullscreen) {
          return e.webkitExitFullscreen();
        } else if (e.msExitFullscreen) {
          return e.msExitFullscreen();
        }
      };
      fullscreenchanged = function() {};
      document.addEventListener("fullscreenchange", fullscreenchanged, false);
      document.addEventListener("mozfullscreenchange", fullscreenchanged, false);
      document.addEventListener("webkitfullscreenchange", fullscreenchanged, false);
      prefix = ("orientation" in screen ? "" : ("mozOrientation" in screen ? "moz" : ("msOrientation" in screen ? "ms" : null)));
      if (prefix === null) {
        return alert("unsupported");
      } else {
        Fullscreen = {
          launch: function(element) {
            if (element.requestFullscreen) {
              return element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
              return element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
              return element.webkitRequestFullscreen();
            } else {
              if (element.msRequestFullscreen) {
                return element.msRequestFullscreen();
              }
            }
          },
          exit: function() {
            if (document.exitFullscreen) {
              return document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              return document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              return document.webkitExitFullscreen();
            } else {
              if (document.msExitFullscreen) {
                return document.msExitFullscreen();
              }
            }
          }
        };
        if ("orientation" in screen && "angle" in screen.orientation) {
          return $("#fullscreen").on("click", function(event) {
            event.preventDefault();
            Fullscreen.launch(document.documentElement);
            $("#fullscreen").remove();
            if (callback !== void 0) {
              return callback();
            }
          });
        }
      }
    }
  };
};
}).call(this,cachedModules[7606],cachedModules[7606].exports);var stk;

stk = {};

$(function() {
  var a, actualObject, addObject, decider, drawObject, emailhash, envelop, eventhandler, fetchFFF, ff, ffcontainer, fff, getStageDimensions, injectObject, injectObjects, is_dragging, justPrintOut, key, load, objects, setFramesOnOff, setKey, socket, socketEmit, stage, stk_config, stk_fullscreen, stk_login, stk_socket, up, updateJoystick;
  up = 0;
  decider = 0;
  is_dragging = false;
  stk_socket = cachedModules[6100].exports;
  socket = stk_socket().getSocket();
  stk_config = cachedModules[6411].exports;
  stk_login = cachedModules[6277].exports;
  ff = stk_config().parseGetparameter("formfactor");
  fff = 1;
  fetchFFF = function() {
    if (screen.width < screen.height) {
      return fff = screen.width / screen.height;
    } else {
      return fff = screen.height / screen.width;
    }
  };
  stk_fullscreen = cachedModules[7606].exports;
  stk_fullscreen().requireFullscreen(fetchFFF);
  key = void 0;
  if (stk_config().parseGetparameter("embeded") === "true") {
    $("#fullscreen").remove();
  }

  /* {separatestart:['embeded']} */

  

  /* {separateend:['embeded']} */

  /* {separatestart:['view']} */

  

  /* {separateend:['view']} */
  getStageDimensions = function(c) {
    var stage;
    stage = {
      x: $(c).offset().left,
      y: $(c).offset().top
    };
    stage.x2 = stage.x + $(c).width();
    stage.y2 = stage.y + $(c).height();
    stage.w = $(c).width();
    stage.h = $(c).height();
    stage.wp = stage.w / 100;
    stage.hp = stage.h / 100;
    return stage;
  };
  addObject = function(object) {
    var objectID, stage, thisObject, v;
    stage = getStageDimensions(ffcontainer);
    if (object.constraint) {
      v = 1;
      if (stage.w > stage.h) {
        object.w = object.w * fff;
      } else {
        object.h = object.h * fff;
      }
    }
    switch (object.type) {
      case "draggable_background":
        object.x = 0;
        object.y = 0;
    }
    if (objects[object.type] === void 0) {
      objectID = 0;
      objects[object.type] = {
        lastID: 0,
        objects: [
          {
            type: object.type,
            id: objectID,
            x: object.x,
            y: object.y,
            ox: object.x,
            oy: object.y,
            h: object.h,
            w: object.w,
            zindex: object.zindex,
            opacity: object.opacity,
            scale: object.scale,
            constraint: object.constraint
          }
        ]
      };
    } else {
      objects[object.type].lastID++;
      objectID = objects[object.type].lastID;
      objects[object.type].objects.push({
        type: object.type,
        id: objectID,
        x: object.x,
        y: object.y,
        ox: object.x,
        oy: object.y,
        h: object.h,
        w: object.w,
        zindex: object.zindex,
        opacity: object.opacity,
        scale: object.scale,
        constraint: object.constraint
      });
    }
    thisObject = objects[object.type].objects[objectID];
    switch (object.type) {
      case "draggable_background":
      case "draggable_image":
        thisObject.url = object.url;
    }
    console.log("CREATED:" + JSON.stringify(thisObject));
    return thisObject;
  };
  drawObject = function(type, id) {
    var o, ocss;
    o = objects[type].objects[id];
    ocss = $("#" + type + id);
    ocss.css("left", (o.x * 100) + "%");
    ocss.css("top", (o.y * 100) + "%");
    ocss.css("width", o.w * 100 * o.scale + "%");
    ocss.css("height", o.h * 100 * o.scale + "%");
    ocss.css("z-index", o.zindex);
    return ocss.css("opacity", o.opacity);
  };

  /* {separatestart:['view']} */

  

  /* {separateend:['view']} */
  if (ff === "") {
    ffcontainer = "body";
    $(".framesXbyY").remove();
    fff = screen.height / screen.width;
    document.body.addEventListener('touchmove', function(event) {
      return event.preventDefault();
    }, false);
  }
  stage = getStageDimensions(ffcontainer);
  console.log(stage);
  actualObject = null;
  objects = {};
  socketEmit = function(msgType, msg) {
    msg.envelop = envelop;
    return stk_socket().emit(msgType, msg);
  };
  emailhash = docCookies.getItem('emailhash');
  if (emailhash !== null) {
    socketEmit('join', {
      emailhash: emailhash
    });
    envelop = {
      emailhash: emailhash
    };
  } else {
    if (stk_config().parseGetparameter("embeded") !== "true") {
      a = a;
    }
    envelop = {
      emailhash: void 0
    };
  }
  $(ffcontainer).droppable({
    drop: function(event, ui) {
      var id, lastX, lastY, m, offset, type;
      is_dragging = false;
      offset = $("#" + ui.draggable.get(0).id).offset();
      if (offset.left >= stage.x && offset.left <= stage.x2 && offset.top >= stage.y && offset.top <= stage.y2) {
        console.log("dragevent: " + offset.left + ":" + offset.top);
        console.log(JSON.stringify(ui));
        type = ui.draggable.get(0).id.split(/(\D*)(\d*)/)[1];
        id = ui.draggable.get(0).id.split(/(\D*)(\d*)/)[2];
        lastX = (offset.left - stage.x) / stage.w;
        lastY = (offset.top - stage.y) / stage.h;
        m = {
          type: type,
          id: id,
          x: lastX,
          y: lastY
        };
        socketEmit("dropevent", m);
        console.log("Dropped: " + JSON.stringify(m));
        console.log("Dropped: stage:" + JSON.stringify(stage));
        return actualObject = null;
      }
    }
  });
  socket.on("getStageDimensions", function(msg) {
    var m;
    console.log("getStageDimensions: " + JSON.stringify(msg));
    if (msg.stage === ffcontainer) {
      m = getStageDimensions(ffcontainer);
      m.id = ffcontainer;
      return socketEmit("stageDimensions", m);
    }
  });
  socket.on("dropevent", function(msg) {
    if (!is_dragging) {
      objects[msg.type].objects[msg.id].x = msg.x;
      objects[msg.type].objects[msg.id].y = msg.y;
      return drawObject(msg.type, msg.id);
    }
  });

  /* {separatestart:['embeded']} */

  

  /* {separateend:['embeded']} */
  socket.on("touchmove", function(msg) {

    /* {separatestart:['embeded']} */
    eventhandler[msg.type](msg);

    /* {separateend:['embeded']} */

    /* {separatestart:['view']} */

    

    /* {separateend:['view']} */
  });
  socket.on("reset", function(msg) {
    console.log("reload(true)");
    return location.reload(true);
  });
  socket.on("movebyeditorevent", function(msg) {
    if (msg.attr === "left") {
      objects[msg.type].objects[msg.id].x = msg.val;
    }
    if (msg.attr === "up") {
      objects[msg.type].objects[msg.id].y = msg.val;
    }
    return drawObject(msg.type, msg.id);
  });
  socket.on("scaleevent", function(msg) {
    objects[msg.type].objects[msg.id].scale = msg.scale;
    stage = getStageDimensions(ffcontainer);
    return drawObject(msg.type, msg.id);
  });
  socket.on("attributechange", function(msg) {
    if (msg.attributes.url !== void 0) {
      objects[msg.type].objects[msg.id].url = msg.attributes.url;
      $("#" + msg.type + msg.id).css({
        "background-image": "url(" + objects[msg.type].objects[msg.id].url + ")",
        "background-size": "cover"
      });
    }
    if (msg.attributes.zindex !== void 0) {
      objects[msg.type].objects[msg.id].zindex = msg.attributes.zindex;
      $('#' + msg.type + msg.id).css({
        "z-index": msg.attributes.zindex
      });
    }
    if (msg.attributes.opacity !== void 0) {
      objects[msg.type].objects[msg.id].opacity = msg.attributes.opacity;
      return $('#' + msg.type + msg.id).css({
        "opacity": msg.attributes.opacity
      });
    }
  });
  socket.on("createevent", function(msg) {
    return injectObject(msg);
  });
  injectObjects = function(objects_) {
    var doInject, n, o, _results;
    console.log("injectObjects " + JSON.stringify(objects_));
    doInject = function(o) {
      var doInject2, o2, _i, _len, _ref, _results;
      console.log("injectObjects " + JSON.stringify(o));
      doInject2 = function(o) {
        return injectObject({
          object: o
        });
      };
      _ref = o.objects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o2 = _ref[_i];
        _results.push(doInject2(o2));
      }
      return _results;
    };
    _results = [];
    for (n in objects_) {
      o = objects_[n];
      _results.push(doInject(o));
    }
    return _results;
  };
  injectObject = function(msg) {
    var cnr, j, jb, newObject, objName, objir;
    console.log(JSON.stringify(msg.object));
    newObject = addObject(msg.object);
    if (newObject.id !== msg.object.id) {
      return console.log("drop new NOT in sync " + msg.object.type + " " + msg.object.id + " newObjectID:" + newObject.id);
    } else {
      cnr = $("<div />", {
        name: newObject.type + newObject.id,
        id: newObject.type + newObject.id,
        "class": "draggable"
      });
      switch (newObject.type) {
        case "draggable_joystick":
          j = $("<div />", {
            name: "joystick" + newObject.id,
            id: "joystick" + newObject.id,
            "class": "joystick"
          });
          jb = $("<div />", {
            name: "joystickbase" + newObject.id,
            id: "joystickbase" + newObject.id,
            "class": "joystickbase"
          });
          j.html($("#joystick").clone().html());
          jb.html($("#joystickbase").clone().html());
          cnr.append(jb).append(j);
          break;
        case "draggable_touchpad":
          cnr.html("Touchpad");
          break;
        case "draggable_positionsensor":
          a = a;
          break;
        case "draggable_background":
        case "draggable_image":
          cnr.css({
            "background-image": "url(" + newObject.url + ")",
            "background-size": "cover"
          });
      }
      stage = getStageDimensions(ffcontainer);
      console.log("Drop created to:" + $(this) + "  " + (newObject.x * 100) + "%");
      $(ffcontainer).append(cnr);
      drawObject(newObject.type, newObject.id);

      /* {separatestart:['view']} */
      objName = newObject.type + newObject.id;
      objir = document.getElementById(objName);
      switch (newObject.type) {
        case "draggable_joystick":
        case "draggable_touchpad":
          objir.addEventListener('touchmove', function(event) {
            var m, o, offset, self, touch, x, y, _ref, _ref1;
            if (event.targetTouches.length === 1) {
              touch = event.targetTouches[0];
              self = $('#' + objName);
              offset = self.offset();
              if ((offset.left <= (_ref = touch.pageX) && _ref <= offset.left + self.width()) && (offset.top <= (_ref1 = touch.pageY) && _ref1 <= offset.top + self.height())) {
                o = objects[newObject.type].objects[newObject.id];
                x = (touch.pageX - offset.left) / self.width();
                y = (touch.pageY - offset.top) / self.height();
                m = {
                  type: newObject.type,
                  id: newObject.id,
                  x: x,
                  y: y
                };
                return socketEmit("touchmove", m);
              }
            }
          }, false);

          /* {separatestart:['embeded']} */
          break;
        case "draggable_positionsensor":
          if (stk_config().parseGetparameter("embeded") === "false") {
            if (window.DeviceOrientationEvent) {
              window.addEventListener('deviceorientation', function(event) {
                var alpha, beta, factor, gamma, m, obereKante;
                alpha = event.alpha;
                beta = event.beta;
                gamma = event.gamma;
                if (alpha !== null || beta !== null || gamma !== null) {
                  if (beta < 0) {
                    obereKante = "unten";
                    up = -1;
                  }
                  if (beta > 0) {
                    obereKante = "oben";
                    up = 1;
                  }
                  factor = (beta + 90) / 180;
                  if (factor > 1) {
                    factor = 2 - factor;
                  }
                  if (decider === 0) {
                    factor = Math.abs(factor);
                  } else {
                    factor = 1 - Math.abs(factor);
                  }

                  /*  dataContainerOrientation.innerHTML = 'beta: ' + beta + '<br />abs-90: ' + (Math.abs(beta) - 90) + '<br />factor: ' + factor + '<br />up: ' + up +
                                       '<br />alpha: ' + alpha + '<br/>beta: ' + beta + '<br />gamma: ' + gamma + '<br />obereKante: ' + obereKante +
                                       '<br />decider: ' + decider;
                   */
                  m = {
                    a: alpha,
                    b: beta,
                    g: gamma,
                    f: factor,
                    up: up,
                    objName: objName
                  };
                  return socketEmit('deviceorientation', m);
                }
              }, false);
            }
            if (window.DeviceMotionEvent) {
              window.addEventListener('devicemotion', function(event) {
                var r, x, y, z;
                x = event.accelerationIncludingGravity.x;
                y = event.accelerationIncludingGravity.y;
                z = event.accelerationIncludingGravity.z;
                r = event.rotationRate;

                /*var html = 'Acceleration:<br />';
                        html += 'x: ' + x + '<br />y: ' + y + '<br/>z: ' + z + '<br />';
                        html += 'Rotation rate:<br />';
                        if (r != null) html += 'alpha: ' + r.alpha + '<br />beta: ' + r.beta + '<br/>gamma: ' + r.gamma + '<br />';
                        dataContainerMotion.innerHTML = html;
                 */
                if (x > 0) {
                  decider = 0;
                }
                if (x < 0) {
                  return decider = 1;
                }
              });
            }
          }

          /* {separateend:['embeded']} */
      }

      

      

      /* {separateend:['view']} */
    }
  };

  /* {separatestart:['embeded']} */
  if (objectsToInject !== void 0) {
    injectObjects(objectsToInject);
  }

  

  /* {separateend:['embeded']} */
  return true;
});
