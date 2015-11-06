var cachedModules=[];
cachedModules[1346]={exports:{}};
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
}).call(this,cachedModules[1346],cachedModules[1346].exports);
cachedModules[7891]={exports:{}};
(function(module,exports) {var clientID, configuration, headers, onError, req;

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

function relPathToAbs(sRelPath){
  var nUpLn, sDir = "", sPath = location.pathname.replace(/[^\/]*$/, sRelPath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
  for (var nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
    nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
    sDir = (sDir + sPath.substring(nStart, nEnd)).replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((nUpLn - 1) / 3) + "}$"), "/");
  }
  return sDir + sPath.substr(nStart);
};

clientID = null;

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
    setItem: function(k, v, u, p, d, s) {
      if (u == null) {
        u = Infinity;
      }
      console.log("Remove " + k);
      docCookies.removeItem(k);
      console.log("Set " + k + " to " + v);
      return docCookies.setItem(k, v, u, p, d, s);
    },
    getItem: function(k) {
      return docCookies.getItem(k);
    },
    relPathToAbs: function(sRelPath) {
      return relPathToAbs(sRelPath);
    },
    getClientID: function(realm) {
      return clientID;
    },
    setClientID: function(id, realm) {
      return clientID = id;
    }
  };
};
}).call(this,cachedModules[7891],cachedModules[7891].exports);
cachedModules[3683]={exports:{}};
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
}).call(this,cachedModules[3683],cachedModules[3683].exports);
cachedModules[3387]={exports:{}};
(function(module,exports) {var callback, dialogLogin, formLogin, loginUser, stk_config, stk_socket;

cachedModules[3683].exports;

stk_config = cachedModules[7891].exports;

stk_socket = cachedModules[1346].exports;

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
  stk_config().setItem('emailhash', emailhash);
  stk_config().setItem('email', email);
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
}).call(this,cachedModules[3387],cachedModules[3387].exports);
cachedModules[3741]={exports:{}};
(function(module,exports) {module.exports = function() {
  return {
    delay: function(ms, fn) {
      return setTimeout(fn, ms);
    },
    timer: function(ms, fn) {
      return setInterval(fn, ms);
    },
    timestamp: function() {
      if (window.performance.now) {
        return {
          hp: window.performance.now(),
          ts: new Date().getTime()
        };
      } else if (window.performance.webkitNow) {
        return {
          hp: window.performance.webkitNow(),
          ts: new Date().getTime()
        };
      } else {
        return {
          ts: new Date().getTime()
        };
      }
    }
  };
};
}).call(this,cachedModules[3741],cachedModules[3741].exports);
cachedModules[6609]={exports:{}};
(function(module,exports) {var addVibratePattern, removeVibratePattern, stopVibratePattern, vibrate, vibrateEnd, vibratePattern, vibrateTimeouts, vibrating,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

vibratePattern = {};

vibrateTimeouts = {};

vibrating = "";

vibrateEnd = 0;

vibrate = function(id, rawPattern) {
  var difference, f, index, index2, newRawPattern, p, p2, timeSum, _i, _j, _k, _l, _len, _len1, _len2, _len3;
  timeSum = 0;
  for (index = _i = 0, _len = rawPattern.length; _i < _len; index = ++_i) {
    p = rawPattern[index];
    console.log(id, index, p);
    timeSum += p;
  }
  if (timeSum < 6) {
    return console.log("Skip pattern " + id + ", timeSum is only " + timeSum);
  } else {
    if (vibrating === "") {
      vibrating = id;
      navigator.vibrate(rawPattern);
      vibrateEnd = new Date().getTime() + timeSum;
      f = function() {
        removeVibratePattern(id);
        vibrateEnd = 0;
        return vibrating === "";
      };
      return setTimeout(f, timeSum);
    } else {

      /*
      Schedule after
       */
      console.log("Schedule after", vibrating, id);
      difference = vibrateEnd - new Date().getTime();
      if (difference < 0 && difference > -21) {
        difference = 0;
      } else if (difference > 0) {
        console.log("difference > 0 :", difference);
      } else {
        console.log("difference < -20 :", difference);
      }
      console.log("startdifference", difference);
      newRawPattern = [];
      for (index = _j = 0, _len1 = rawPattern.length; _j < _len1; index = ++_j) {
        p = rawPattern[index];
        if (difference > 0) {
          if (difference >= p) {
            difference = difference - p;
          } else {
            p = p - difference;
            if (index & 1) {
              newRawPattern.push(p);
              for (index2 = _k = 0, _len2 = rawPattern.length; _k < _len2; index2 = ++_k) {
                p2 = rawPattern[index2];
                if (index2 > index) {
                  newRawPattern.push(p2);
                }
              }
              f = function() {
                return vibrate(id, newRawPattern);
              };
              vibratePattern[id].timestamp = vibrateEnd;
              vibratePattern[id].list = [0].concat(newRawPattern);
              vibrateTimeouts[id] = setTimeout(f, vibrateEnd - new Date().getTime());
              difference = -1;
            } else {
              newRawPattern.push(p);
              for (index2 = _l = 0, _len3 = rawPattern.length; _l < _len3; index2 = ++_l) {
                p2 = rawPattern[index2];
                if (index2 > index) {
                  newRawPattern.push(p2);
                }
              }
              f = function() {
                return vibrate(id, newRawPattern);
              };
              vibratePattern[id].timestamp = vibrateEnd;
              vibratePattern[id].list = newRawPattern;
              vibrateTimeouts[id] = setTimeout(f, vibrateEnd - new Date().getTime());
              difference = -1;
            }
            break;
          }
        }
      }
      if (difference >= 0) {
        console.log("Skip pattern ", id);
        return removeVibratePattern(id);
      }
    }
  }
};

addVibratePattern = function(pattern) {
  var difference, f, index, index2, p, p2, rawPattern, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _results;
  console.log("addVibratePattern", pattern);
  vibratePattern[pattern.id] = pattern;
  if (pattern.timestamp === 0 || pattern.timestamp === new Date().getTime()) {
    rawPattern = [pattern.list[1]];
    _ref = pattern.list;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      p = _ref[index];
      if (index > 1) {
        rawPattern.push(p);
      }
    }
    console.log("pattern.timestamp==0 || pattern.timestamp==new Date().getTime()");
    return vibrate(pattern.id, rawPattern);
  } else if (new Date().getTime() > pattern.timestamp) {
    difference = new Date().getTime() - pattern.timestamp;
    _ref1 = pattern.list;
    _results = [];
    for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
      p = _ref1[index];
      if (difference > 0) {
        if (difference >= p) {
          _results.push(difference = difference - p);
        } else {
          rawPattern = [];
          if (index & 1) {
            rawPattern.push(p - difference);
            _ref2 = pattern.list;
            for (index2 = _k = 0, _len2 = _ref2.length; _k < _len2; index2 = ++_k) {
              p2 = _ref2[index2];
              if (index2 > index) {
                rawPattern.push(p2);
              }
            }
            vibrate(pattern.id, rawPattern);
            console.log("odd");
          } else {
            _ref3 = pattern.list;
            for (index2 = _l = 0, _len3 = _ref3.length; _l < _len3; index2 = ++_l) {
              p2 = _ref3[index2];
              if (index2 > index) {
                rawPattern.push(p2);
              }
            }
            f = function() {
              return vibrate(pattern.id, rawPattern);
            };
            console.log("even", p - difference);
            vibrateTimeouts[pattern.id] = setTimeout(f, p - difference);
          }
          break;
        }
      }
    }
    return _results;
  } else if (new Date().getTime() < pattern.timestamp) {
    console.log("start in " + pattern.list.slice(1) + " in " + (pattern.timestamp - new Date().getTime()) + "ms");
    f = function() {
      return vibrate(pattern.id, pattern.list.slice(1));
    };
    return vibrateTimeouts[pattern.id] = setTimeout(f, pattern.timestamp - new Date().getTime());
  }
};

stopVibratePattern = function(id) {
  if (vibrating === id) {
    vibrating = "";
    return navigator.vibrate(0);
  }
};

removeVibratePattern = function(id) {
  if (vibrateTimeouts[id] !== void 0) {
    clearTimeout(vibrateTimeouts[id]);
    delete vibrateTimeouts[id];
  }
  if (vibratePattern[id] !== void 0) {
    stopVibratePattern(id);
    return delete vibratePattern[id];
  }
};


/*
test=()->
   *addVibratePattern {id:"wege",timestamp:0,list:[500,1000,200,300]}
   *addVibratePattern {id:"wege",timestamp:new Date().getTime()+2000,list:[500,1000,200,300]}
  
   *addVibratePattern {id:"wege",timestamp:new Date().getTime()+2200,list:[500,1000,200,300]}
   *removeVibratePattern "wege"
  
   *addVibratePattern {id:"wege",timestamp:new Date().getTime()+1000,list:[500,1000,200,10000-1700]}
   *addVibratePattern {id:"weg2e",timestamp:new Date().getTime()+1000,list:[11000,5000]}
  
   *addVibratePattern {id:"start1",timestamp:new Date().getTime()+200,list:[0,1111,666,2222]}

   *addVibratePattern {id:"start2",timestamp:new Date().getTime()+500,list:[1000,1000]}


test()
 */

module.exports = function() {
  return {
    isSupported: function() {
      if (__indexOf.call(navigator, "vibrate") >= 0) {
        return true;
      }
      return false;
    },
    addVibratePattern: function(pattern) {
      return addVibratePattern(pattern);
    },
    removeVibratePattern: function(id) {
      return removeVibratePattern(id);
    },
    vibrateNow: function(pattern) {
      if (pattern.list !== void 0) {
        return navigator.vibrate(pattern.list.slice(1));
      } else {
        return navigator.vibrate(pattern.slice(1));
      }
    }
  };
};
}).call(this,cachedModules[6609],cachedModules[6609].exports);
cachedModules[7616]={exports:{}};
(function(module,exports) {var fadeSound, getDuration, getState, muteSound, pauseSound, playSound, prepare, removeSound, seekSound, setRate, soundObjects, soundTimeouts, startSound, stopSound, unmuteSound, volumeSound;

soundObjects = {};

soundTimeouts = {};

prepare = function(so) {
  var newsound;
  console.log(so);
  so.isReady = false;
  so.state = 'loading';
  newsound = new Howl({
    autoplay: false,
    src: so.src,
    loop: so.loop,
    rate: so.rate,
    volume: so.volume,
    buffer: true,
    onload: function() {
      so.duration = this.duration();
      so.isReady = true;
      so.state = 'stoped';
      return console.log('ready:', this);
    },
    onloaderror: function() {
      console.log("Error loading ", so.id, " from ", so.src);
      return removeSound(so.id);
    },
    onplay: function() {
      return console.log('Playing', {
        onend: function() {
          return console.log('Finished!');
        }
      });
    }
  });
  so.howl = newsound;
  return soundObjects[so.id] = so;

  /*
  a=newsound.play()
  newsound.seek(0, a);
  console.log a
  
  sound = new Howl({
    src: ['../media/sounds/glass_ping-Go445-1207030150.wav'],
    autoplay: false,
    loop: false,
    volume: 1.0,
    onend: ()-> console.log 'Finished sound!'
    })
  id = sound.play();
  sound.seek(0, id);
   */
};

getDuration = function(id, cb) {
  var f;
  if (cb == null) {
    cb = void 0;
  }
  if (soundObjects[id] !== void 0) {
    if (cb === void 0) {
      if (so.isReady) {
        return so.howl.duration();
      } else {
        return 0;
      }
    } else {
      f = function() {
        so.duration = this.duration;
        so.isReady = true;
        return cb(this.duration);
      };
      return so.howl.onload = f;
    }
  } else {
    if (cb === void 0) {
      return 0;
    } else {
      return cb(0);
    }
  }
};

getState = function(id) {
  if (soundObjects[id] !== void 0) {
    return {
      timestamp: new Date().getTime(),
      state: soundObjects[id].state,
      muted: soundObjects[id].howl.mute(),
      volume: soundObjects[id].howl.volume(),
      position: soundObjects[id].howl.seek(),
      looping: soundObjects[id].howl.loop(),
      duration: soundObjects[id].howl.duration(),
      rate: soundObjects[id].howl.rate()
    };
  }
  return {};
};

setRate = function(id, rate) {
  if (soundObjects[id] !== void 0) {
    return soundObjects[id].howl.rate(rate);
  }
};

startSound = function(id, timestamp) {
  var difference, f, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp === now) {
      soundObjects[id].howl.play();
      soundObjects[id].howl.seek(0);
      soundObjects[id].state = 'playing';
      return console.log("# play immediately", id);
    } else if (now > timestamp) {
      difference = (now - timestamp) / 1000;
      console.log("# Seek forward to missed timestamp", id, difference, soundObjects[id].howl.duration());
      if (difference < soundObjects[id].howl.duration()) {
        soundObjects[id].howl.play();
        soundObjects[id].howl.seek(difference);
        return soundObjects[id].state = 'playing';
      }
    } else if (now < timestamp) {
      console.log("# Schedule play in " + (timestamp - now) + "ms");
      f = function() {
        soundObjects[id].howl.play();
        soundObjects[id].howl.seek(0);
        return soundObjects[id].state = 'playing';
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  } else {
    return console.log("soundObjects[" + id + "] is undefined");
  }
};

pauseSound = function(id, timestamp) {
  var difference, f, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp === now) {
      soundObjects[id].howl.pause();
      return soundObjects[id].state = 'paused';
    } else if (now > timestamp) {
      difference = (now - timestamp) / 1000;
      soundObjects[id].howl.pause();
      soundObjects[id].state = 'paused';
      if (soundObjects[id].howl.seek()(difference < soundObjects[id].howl.duration())) {
        return soundObjects[id].howl.seek(soundObjects[id].howl.seek() + difference);
      } else {
        return soundObjects[id].howl.seek(soundObjects[id].howl.duration());
      }
    } else if (now < timestamp) {
      console.log("pause in " + (timestamp - now) + "ms");
      f = function() {
        soundObjects[id].howl.pause();
        return soundObjects[id].state = 'paused';
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  }
};

seekSound = function(id, to, timestamp) {
  var f, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0 && to >= 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp <= now) {
      if (to < soundObjects[id].howl.duration()) {
        return soundObjects[id].howl.seek(to);
      } else {
        return soundObjects[id].howl.seek(soundObjects[id].howl.duration());
      }
    } else if (now < timestamp) {
      console.log("seek in " + (timestamp - now) + "ms");
      f = function() {
        if (to < soundObjects[id].howl.duration()) {
          return soundObjects[id].howl.seek(to);
        } else {
          return soundObjects[id].howl.seek(soundObjects[id].howl.duration());
        }
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  }
};

playSound = function(id, timestamp) {
  var difference, f, hid, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp === now) {
      console.log("NOW", soundObjects[id]);
      hid = soundObjects[id].howl.play();
      return soundObjects[id].state = 'playing';
    } else if (now > timestamp) {
      difference = (now - timestamp) / 1000;
      if (soundObjects[id].howl.seek() + difference < soundObjects[id].howl.duration()) {
        soundObjects[id].howl.play();
        soundObjects[id].howl.seek(soundObjects[id].howl.seek() + difference);
        return soundObjects[id].state = 'playing';
      } else {
        return soundObjects[id].howl.seek(soundObjects[id].howl.duration());
      }
    } else if (now < timestamp) {
      console.log("play in " + (timestamp - now) + "ms");
      f = function() {
        soundObjects[id].howl.play();
        return soundObjects[id].state = 'playing';
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  } else {
    return console.log("soundObjects[" + id + "] not found");
  }
};

stopSound = function(id, timestamp) {
  var f, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp <= now) {
      soundObjects[id].howl.stop();
      return soundObjects[id].state = 'stoped';
    } else {
      console.log("stop in " + (timestamp - now) + "ms");
      f = function() {
        soundObjects[id].howl.stop();
        return soundObjects[id].state = 'stoped';
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  }
};

muteSound = function(id, timestamp) {
  var f, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp <= now) {
      return soundObjects[id].howl.mute();
    } else {
      console.log("mute in " + (timestamp - now) + "ms");
      f = function() {
        return soundObjects[id].howl.mute();
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  }
};

unmuteSound = function(id, timestamp) {
  var f, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp <= now) {
      return soundObjects[id].howl.unmute();
    } else {
      console.log("unmute in " + (timestamp - now) + "ms");
      f = function() {
        return soundObjects[id].howl.unmute();
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  }
};

volumeSound = function(id, volume, timestamp) {
  var f, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp <= now) {
      return soundObjects[id].howl.volume(volume);
    } else if (now < timestamp) {
      console.log("volume in " + (timestamp - now) + "ms");
      f = function() {
        return soundObjects[id].howl.volume(volume);
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  }
};

fadeSound = function(id, fromVolume, toVolume, duration, timestamp) {
  var f, now;
  if (timestamp == null) {
    timestamp = 0;
  }
  if (soundObjects[id] !== void 0) {
    now = new Date().getTime();
    if (timestamp === 0 || timestamp <= now) {
      return soundObjects[id].fade(fromVolume, toVolume, duration);
    } else if (now < timestamp) {
      console.log("fade in " + (timestamp - now) + "ms");
      f = function() {
        return soundObjects[id].fade(fromVolume, toVolume, duration);
      };
      return soundTimeouts[id] = setTimeout(f, timestamp - now);
    }
  }
};

removeSound = function(id) {
  if (soundTimeouts[id] !== void 0) {
    clearTimeout(soundTimeouts[id]);
    delete soundTimeouts[id];
  }
  if (soundObjects[id] !== void 0) {
    soundObjects[id].howl.unload();
    return delete soundObjects[id];
  }
};


/*
test=()->
  prepare {id:"pling",src:['../media/sounds/glass_ping-Go445-1207030150.mp3','../media/sounds/glass_ping-Go445-1207030150.wav'],loop:false,rate:1.0,volume:1.0,duration:0}
  
  startSound "pling", (new Date().getTime()+3000)
  
test()
 */

module.exports = function() {
  return {
    addSoundObject: function(soundObject) {
      prepare(soundObject);
      return console.log("pling:", soundObject);
    },
    getDuration: function(id, cb) {
      if (cb == null) {
        cb = void 0;
      }
      return getDuration(id, cb);
    },
    removeSoundObject: function(id) {
      return removeSound(id);
    },
    start: function(id, timestamp) {
      if (timestamp == null) {
        timestamp = 0;
      }
      console.log("stk_auto start", id, timestamp);
      return startSound(id, timestamp);
    },
    pause: function(id, timestamp) {
      if (timestamp == null) {
        timestamp = 0;
      }
      return pauseSound(id, timestamp);
    },
    seek: function(id, to, timestamp) {
      if (timestamp == null) {
        timestamp = 0;
      }
      return seekSound(id, to, timestamp);
    },
    play: function(id, timestamp) {
      if (timestamp == null) {
        timestamp = 0;
      }
      return playSound(id, timestamp);
    },
    mute: function(id, muteOrUnmute, timestamp) {
      if (timestamp == null) {
        timestamp = 0;
      }
      if (muteOrUnmute) {
        return muteSound(id, timestamp);
      } else {
        return unmuteSound(id, timestamp);
      }
    },
    setVolume: function(id, volume, timestamp) {
      if (timestamp == null) {
        timestamp = 0;
      }
      return volumeSound(id, volume, timestamp);
    },
    fadeSound: function(id, fromVolume, toVolume, duration, timestamp) {
      if (timestamp == null) {
        timestamp = 0;
      }
      return fadeSound(id, fromVolume, toVolume, duration, timestamp);
    },
    muteAll: function() {
      return Howler.mute(true);
    },
    unmuteAll: function() {
      return Howler.mute(false);
    },
    masterVolume: function(volume) {
      return Howler.volume(volume);
    },
    getSupportedCodecs: function() {
      return ["mp3", "opus", "ogg", "wav", "aac", "m4a", "mp4", "weba"];
    },
    isCodecSupported: function(codec) {
      return Howler.codecs(codec);
    },
    removeAll: function() {
      var st, _i, _len;
      Howler.unload;
      for (_i = 0, _len = soundTimeouts.length; _i < _len; _i++) {
        st = soundTimeouts[_i];
        clearTimeout(st);
      }
      soundObjects = {};
      return soundTimeouts = {};
    },
    reset: function() {
      var so, st, _i, _j, _len, _len1, _results;
      Howler.unload;
      for (_i = 0, _len = soundTimeouts.length; _i < _len; _i++) {
        st = soundTimeouts[_i];
        clearTimeout(st);
      }
      soundTimeouts = {};
      _results = [];
      for (_j = 0, _len1 = soundObjects.length; _j < _len1; _j++) {
        so = soundObjects[_j];
        so.howl.stop();
        so.howl.volume(so.volume);
        _results.push(so.howl.unmute());
      }
      return _results;
    }
  };
};
}).call(this,cachedModules[7616],cachedModules[7616].exports);
cachedModules[9993]={exports:{}};
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
}).call(this,cachedModules[9993],cachedModules[9993].exports);var stk;

stk = {};

$(function() {
  var actualObject, addObject, addVibratePattern_handler, battery, batteryFailure, batterySuccess, batterystate, clientID, clientType, decider, drawObject, emailhash, envelop, eventhandler, fetchFFF, ff, ffcontainer, fff, getKey, getStageDimensions, getTimestampdifference, injectObject, injectObjects, is_dragging, justPrintOut, key, keys, keysPressed, keysReleased, load, nothing_to_do, objects, preventEventPropagation, realm, runAnimation, sendKeys, sendState, setFramesOnOff, setKey, socket, socketEmit, stage, stk_audio, stk_common, stk_config, stk_fullscreen, stk_login, stk_socket, stk_vibrate, timestampdifference, up, updateBatteryState, updateJoystick;
  key = window.key;
  console.log("Started execution ", key);

  

  /* {separatestart:['remotecontrol']} */
  clientType = "view";

  /* {separateend:['remotecontrol']} */
  console.log("My clientType is: ", clientType);
  up = 0;
  decider = 0;
  is_dragging = false;
  stk_socket = cachedModules[1346].exports;
  socket = stk_socket().getSocket();
  stk_config = cachedModules[7891].exports;
  stk_login = cachedModules[3387].exports;
  stk_common = cachedModules[3741].exports;
  stk_vibrate = cachedModules[6609].exports;
  stk_audio = cachedModules[7616].exports;
  ff = stk_config().parseGetparameter("formfactor");
  fff = 1;
  fetchFFF = function() {
    if (screen.width < screen.height) {
      return fff = screen.width / screen.height;
    } else {
      return fff = screen.height / screen.width;
    }
  };
  stk_fullscreen = cachedModules[9993].exports;
  stk_fullscreen().requireFullscreen(fetchFFF);
  envelop = {
    state: "undefined"
  };
  preventEventPropagation = {};
  socketEmit = function(msgType, msg) {
    var now;
    if (msg == null) {
      msg = {};
    }
    if (preventEventPropagation[msgType] === void 0) {
      msg.envelop = envelop;
      msg.envelop.timestamp = stk_common().timestamp();
      msg.envelop.clienttype = clientType;
      return stk_socket().emit(msgType, msg);
    } else {
      now = new Date().getTime();
      switch (msgType) {
        case "touchstart":
        case "touchmove":
        case "touchend":
          if (preventEventPropagation[msgType][msg.type + msg.id] !== void 0) {
            if (now >= preventEventPropagation[msgType][msg.type + msg.id].lastsend + preventEventPropagation[msgType][msg.type + msg.id].timeout) {
              msg.envelop = envelop;
              msg.envelop.timestamp = stk_common().timestamp();
              msg.envelop.clienttype = clientType;
              stk_socket().emit(msgType, msg);
              return preventEventPropagation[msgType][msg.type + msg.id].lastsend = now;
            }
          }
          break;
        default:
          if (now >= preventEventPropagation[msgType].lastsend + preventEventPropagation[msgType].timeout) {
            msg.envelop = envelop;
            msg.envelop.timestamp = stk_common().timestamp();
            msg.envelop.clienttype = clientType;
            stk_socket().emit(msgType, msg);
            return preventEventPropagation[msgType].lastsend = now;
          }
      }
    }
  };
  stk_audio().addSoundObject({
    id: "pling",
    src: ['media/sounds/' + key + '_glass_ping-Go445-1207030150.mp3', 'media/sounds/' + key + '_glass_ping-Go445-1207030150.wav'],
    loop: false,
    rate: 1.0,
    volume: 1.0,
    duration: 0
  });
  if (clientType === "view") {
    stk_common().delay(1234, function() {
      return socketEmit('do_audio', {
        task: "play",
        parameter: {
          id: "pling",
          timestamp: new Date().getTime() + 3000
        }
      });
    });
  }
  stk_common().delay(5134, function() {
    return socketEmit('do_audio', {
      task: "play",
      parameter: {
        id: "pling",
        timestamp: new Date().getTime()
      }
    });
  });
  keys = [];
  keysPressed = function(e) {
    keys[e.keyCode] = true;
    return sendKeys();
  };
  keysReleased = function(e) {
    keys[e.keyCode] = false;
    sendKeys();
    return delete keys[e.keyCode];
  };
  sendKeys = function() {
    var k, sendkeys, v, _i, _len;
    console.log(keys);
    sendkeys = [];
    for (v = _i = 0, _len = keys.length; _i < _len; v = ++_i) {
      k = keys[v];
      if (k === true) {
        sendkeys.push(v);
      }
    }
    console.log(sendkeys);
    return socketEmit('keyevent', {
      type: "draggable_keylistener",
      keys: sendkeys
    });
  };
  if (stk_config().parseGetparameter("embeded") === "true") {
    $("#fullscreen").remove();
  }

  /* {separatestart:['embeded']} */

  /* {separatestart:['remotecontrol']} */
  setKey = function(k) {
    return key = k.replace("\r", '');
  };
  load = stk_config().parseGetparameter('load');
  if (load !== "") {
    setKey(load);
    socketEmit('load', {
      key: load,
      "private": true
    });
  }

  /* {separateend:['remotecontrol']} */

  /* {separateend:['embeded']} */

  
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
    console.log("Stage: " + JSON.stringify(stage) + " " + JSON.stringify(c));
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
      case "draggable_iframe":
        thisObject.url = object.url;
        break;
      case "draggable_touchpad":
      case "draggable_joystick":
        thisObject.touchstart = object.touchstart;
        thisObject.touchmove = object.touchmove;
        thisObject.touchend = object.touchend;
        thisObject.touchstartvibrate = object.touchstartvibrate;
        thisObject.touchmovevibrate = object.touchmovevibrate;
        thisObject.touchendvibrate = object.touchendvibrate;
        thisObject.startmaxms = object.startmaxms;
        thisObject.movemaxms = object.movemaxms;
        thisObject.endmaxms = object.endmaxms;
        break;
      case "draggable_orientationsensor":
      case "draggable_accelerationsensor":
        thisObject.maxms = object.maxms;
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
    ocss.css("width", (o.w * 100 * o.scale) + "%");
    ocss.css("height", (o.h * 100 * o.scale) + "%");
    ocss.css("z-index", o.zindex);
    return ocss.css("opacity", o.opacity);
  };

  
  if (ff === "") {
    ffcontainer = "body";
    $(".framesXbyY").remove();
    fff = screen.height / screen.width;
    document.body.addEventListener('touchstart', function(event) {
      return event.preventDefault();
    }, false);
    document.body.addEventListener('touchmove', function(event) {
      return event.preventDefault();
    }, false);
    document.body.addEventListener('touchend', function(event) {
      return event.preventDefault();
    }, false);
  }
  stage = getStageDimensions(ffcontainer);
  console.log(stage);
  actualObject = null;
  objects = {};
  emailhash = stk_config().getItem('emailhash');
  if (emailhash !== void 0 && emailhash !== null) {
    socketEmit('join', {
      emailhash: emailhash
    });
    envelop = {
      emailhash: emailhash
    };
  } else {
    if (stk_config().parseGetparameter("embeded") !== "true") {
      nothing_to_do = "nothing_to_do";
    }
    envelop = {
      emailhash: void 0
    };
  }
  realm = "../../../";
  getKey = function(l) {
    var k, num, s, _i;
    if (l == null) {
      l = 8;
    }
    s = "acdefghknprstvwxyz23459";
    k = "";
    while (k === "") {
      for (num = _i = 1; 1 <= l ? _i <= l : _i >= l; num = 1 <= l ? ++_i : --_i) {
        k += s[Math.floor(Math.random() * s.length)];
      }
    }
    return k;
  };
  clientID = stk_config().getItem('clientid');
  if (clientID === null) {
    clientID = getKey(8);
    stk_config().setItem('clientid', clientID, Infinity, stk_config().relPathToAbs(realm));
  }
  envelop.clientid = clientID;
  stk_config().setClientID(clientID);
  socketEmit('join_client', {
    clientid: clientID
  });
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
  socket.on("do_audio", function(msg) {
    console.log("do_audio", msg);
    if (stk_config().parseGetparameter("embeded") !== "true") {
      stk_audio().start(msg.parameter.id, msg.parameter.timestamp - getTimestampdifference());
      return console.log("do_audio with", msg.parameter.id, msg.parameter.timestamp - getTimestampdifference(), new Date().getTime());
    }
  });
  justPrintOut = function(msg) {
    return console.log("justPrintOut: " + JSON.stringify(msg));
  };
  getKey = function(l) {
    var k, num, s, _i;
    if (l == null) {
      l = 8;
    }
    s = "acdefghknprstvwxyz23459";
    k = "";
    while (k === "") {
      for (num = _i = 1; 1 <= l ? _i <= l : _i >= l; num = 1 <= l ? ++_i : --_i) {
        k += s[Math.floor(Math.random() * s.length)];
      }
    }
    return k;
  };
  clientID = stk_config().getItem('clientid');
  if (clientID === null) {
    clientID = getKey(8);
    stk_config().setItem('clientid', clientID);
    envelop.clientid = clientID;
  } else {
    envelop.clientid = clientID;
  }
  socketEmit('join_client', {
    clientid: clientID
  });

  /* {separatestart:['embeded']} */

  /* {separatestart:['remotecontrol']} */
  updateJoystick = function(msg) {
    console.log("touchmove draggable_joystick " + JSON.stringify(msg));
    $('#joystick' + msg.id).css("left", ((msg.x - 0.5) * 20) + '%');
    return $('#joystick' + msg.id).css("top", ((msg.y - 0.5) * 20) + '%');
  };
  addVibratePattern_handler = function(msg) {
    stk_vibrate().addVibratePattern(msg.pattern);
    return console.log('Let it vibrate: ' + JSON.stringify(msg));
  };
  eventhandler = {
    draggable_joystick: updateJoystick,
    draggable_touchpad: justPrintOut,
    draggable_orientationsensor: justPrintOut,
    draggable_accelerationsensor: justPrintOut,
    draggable_keylistener: justPrintOut,
    custommessage: justPrintOut,
    addVibratePattern: addVibratePattern_handler
  };

  /* {separateend:['remotecontrol']} */

  /* {separateend:['embeded']} */

  
  socket.on("custommessage", function(msg) {
    console.log("custommessage", msg);
    if (msg.toClientTypes !== void 0 && $.inArray(clientType, msg.toClientTypes) > -1) {
      return eventhandler[msg.type](msg);
    } else if (msg.toClientTypes === void 0 || msg.toClientTypes === []) {
      return eventhandler[msg.type](msg);
    }
  });
  socket.on("touchmove", function(msg) {

    /* {separatestart:['embeded']} */
    var a;
    eventhandler[msg.type](msg);

    /* {separateend:['embeded']} */

    
  });

  
  timestampdifference = [0, 0, 0, 0, 0];
  getTimestampdifference = function() {
    var sum, t, _i, _len;
    sum = 0;
    for (_i = 0, _len = timestampdifference.length; _i < _len; _i++) {
      t = timestampdifference[_i];
      sum += t;
    }
    return Math.ceil(sum / 5);
  };
  socket.on("state", function(msg) {
    if (msg.envelop.clientid === clientID) {
      timestampdifference = timestampdifference.slice(1);
      timestampdifference.push(msg.envelop.timestampdifference);
    }
    return console.log("getTimestampdifference:" + getTimestampdifference());
  });

  /* {separatestart:['remotecontrol']} */
  socket.on("draggable_orientationsensor", function(msg) {
    return eventhandler[msg.type](msg);
  });
  socket.on("draggable_accelerationsensor", function(msg) {
    return eventhandler[msg.type](msg);
  });
  socket.on("accelerationpitch", function(msg) {
    return justPrintOut(msg);
  });

  /* {separateend:['remotecontrol']} */

  /* {separatestart:['embeded']} */

  /* {separatestart:['remotecontrol']} */
  socket.on("keyevent", function(msg) {
    return eventhandler[msg.type](msg);
  });

  /* {separateend:['remotecontrol']} */

  /* {separateend:['embeded']} */
  socket.on('vibration.isSupported', function(msg) {
    ioEmit(socket, 'vibration.support', {
      vibrationSupported: stk_vibrate().isSupported()
    });
    return console.log('vibration.support', {
      vibrationSupported: stk_vibrate().isSupported()
    });
  });
  socket.on('vibration.support', function(msg) {
    return console.log('vibration.support', msg);
  });
  socket.on('vibration.addVibratePattern', function(msg) {
    stk_vibrate().addVibratePattern(msg.pattern);
    return console.log('vibration.addVibratePattern', msg);
  });
  socket.on('vibration.removeVibratePattern', function(msg) {
    stk_vibrate().removeVibratePattern(msg.id);
    return console.log('vibration.removeVibratePattern', msg);
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
    if (msg.attr === "right") {
      objects[msg.type].objects[msg.id].w = msg.val;
    }
    if (msg.attr === "down") {
      objects[msg.type].objects[msg.id].h = msg.val;
    }
    console.log(msg, objects[msg.type].objects[msg.id]);
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
      if (msg.type === "draggable_iframe") {
        console.log("Set iframe #" + msg.type.replace("draggable_", "") + msg.id, msg.attributes.url);
        $("#" + msg.type.replace("draggable_", "") + msg.id).attr("src", msg.attributes.url);
      } else {
        $("#" + msg.type + msg.id).css({
          "background-image": "url(" + objects[msg.type].objects[msg.id].url + ")",
          "background-size": "cover"
        });
      }
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
    var cnr, f, j, jb, newObject, objName, objir;
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
          cnr.html("Position sensor");
          break;
        case "draggable_orientationsensor":
          cnr.html("Orientation sensor");
          break;
        case "draggable_accelerationsensor":
          cnr.html("Acceleration sensor");
          break;
        case "draggable_background":
          cnr.css({
            "background-image": "url(" + newObject.url + ")",
            "background-size": "cover"
          });
          break;
        case "draggable_image":
          cnr.css({
            "background-image": "url(" + newObject.url + ")",
            "background-size": "contain",
            "background-repeat": "no-repeat"
          });
          break;
        case "draggable_keylistener":
          cnr.html("Keylistener");
          break;
        case "draggable_iframe":
          f = $("<iframe />", {
            name: "iframe" + newObject.id,
            id: "iframe" + newObject.id,
            src: newObject.url,
            ALLOWTRANSPARENCY: true
          });
          cnr.append(f);
      }
      stage = getStageDimensions(ffcontainer);
      console.log("Drop created to:" + (newObject.x * 100) + "%, " + (newObject.y * 100) + "%");
      console.log("newObject:", newObject);
      $(ffcontainer).append(cnr);
      drawObject(newObject.type, newObject.id);

      
    }
  };

  /* {separatestart:['embeded']} */
  if (objectsToInject !== void 0) {
    injectObjects(objectsToInject);
  }

  /* {separatestart:['remotecontrol']} */
  stk = {
    framework: {
      register_handler: function(type, handler) {
        eventhandler[type] = handler;
        return console.log("Got " + type, handler, eventhandler);
      },
      delay: function(ms, fn) {
        return stk_common().delay(ms, fn);
      },
      timer: function(ms, fn) {
        return stk_common().timer(ms, fn);
      },
      isVibrationSupported: function(receiver) {
        if (receiver == null) {
          receiver = "self";
        }
        if (receiver === "self") {
          return stk_vibrate().isSupported;
        }
      },
      addVibratePattern: function(pattern, receiver) {
        if (receiver == null) {
          receiver = "self";
        }
        if (receiver === "self") {
          return stk_vibrate().addVibratePattern(pattern);
        }
      },
      removeVibratePattern: function(id, receiver) {
        if (receiver == null) {
          receiver = "self";
        }
        if (receiver === "self") {
          return stk_vibrate().removeVibratePattern(id);
        }
      },
      getClientID: function() {
        return stk_config().getClientID(realm);
      },
      sendMessage: function(msgType, msg) {
        if (msgType == null) {
          msgType = 'custommessage';
        }
        if (msg == null) {
          msg = {};
        }
        return socketEmit(msgType, msg);
      }
    }
  };

  /* {separateend:['remotecontrol']} */

  /* {separateend:['embeded']} */
  runAnimation = function() {
    var gamepads, pad, _i, _len, _results;
    window.requestAnimationFrame(runAnimation);
    gamepads = navigator.getGamepads;
    _results = [];
    for (_i = 0, _len = gamepads.length; _i < _len; _i++) {
      pad = gamepads[_i];
      _results.push(console.log(pad));
    }
    return _results;
  };
  window.requestAnimationFrame(runAnimation);

  /* {separatestart:['embeded']} */
  batterystate = {};
  batterystate.charging = void 0;
  batterystate.level = void 0;
  batterystate.chargingtime = void 0;
  batterystate.dischargingtime = void 0;
  battery = null;
  updateBatteryState = function() {
    batterystate.charging = battery.charging;
    batterystate.level = battery.level * 100;
    batterystate.chargingtime = battery.chargingTime;
    batterystate.dischargingtime = battery.dischargingTime;
    console.log("updateBatteryState");
    return true;
  };
  batterySuccess = function(bm) {
    var _ref;
    battery = bm;
    battery.addEventListener('chargingchange', updateBatteryState);
    battery.addEventListener('levelchange', updateBatteryState);
    battery.addEventListener('chargingtimechange', updateBatteryState);
    battery.addEventListener('dischargingtimechange', updateBatteryState);
    console.log("Battery charging? " + ((_ref = battery.charging) != null ? _ref : {
      "Yes": "No"
    }));
    console.log("Battery level: " + battery.level * 100 + "%");
    console.log("Battery charging time: " + battery.chargingTime + " seconds");
    console.log("Battery discharging time: " + battery.dischargingTime + " seconds");
    updateBatteryState();
    return true;
  };
  batteryFailure = function() {};
  if ("getBattery" in navigator) {
    console.log("getBattery is in navigator");
    navigator.getBattery().then(batterySuccess, batteryFailure);
  } else {
    console.log("getBattery not in navigator");
  };
  sendState = function() {
    return socketEmit("state", {
      battery: batterystate
    });
  };
  if (stk_config().parseGetparameter("embeded") !== "true") {
    stk_common().timer(1000, sendState);
  }

  /* {separateend:['embeded']} */
  return true;
});
