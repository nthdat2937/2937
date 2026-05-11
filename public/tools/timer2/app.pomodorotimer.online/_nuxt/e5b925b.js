(window.webpackJsonp = window.webpackJsonp || []).push([
    [26, 9, 15, 16, 17, 22], {
        416: function(t, e, n) {
            (function(e) {
                t.exports = function() {
                    "use strict";
                    var i = {
                        errors: {
                            incompatible: "".concat("PushError:", " Push.js is incompatible with browser."),
                            invalid_plugin: "".concat("PushError:", " plugin class missing from plugin manifest (invalid plugin). Please check the documentation."),
                            invalid_title: "".concat("PushError:", " title of notification must be a string"),
                            permission_denied: "".concat("PushError:", " permission request declined"),
                            sw_notification_error: "".concat("PushError:", " could not show a ServiceWorker notification due to the following reason: "),
                            sw_registration_error: "".concat("PushError:", " could not register the ServiceWorker due to the following reason: "),
                            unknown_interface: "".concat("PushError:", " unable to create notification: unknown interface")
                        }
                    };

                    function t(i) {
                        return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(i) {
                            return typeof i
                        } : function(i) {
                            return i && "function" == typeof Symbol && i.constructor === Symbol && i !== Symbol.prototype ? "symbol" : typeof i
                        })(i)
                    }
                    function n(i, t) {
                        if (!(i instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }
                    function o(i, t) {
                        for (var e = 0; e < t.length; e++) {
                            var n = t[e];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(i, n.key, n)
                        }
                    }
                    function r(i, t, e) {
                        return t && o(i.prototype, t), e && o(i, e), i
                    }
                    function c(i, t) {
                        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                        i.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: i,
                                writable: !0,
                                configurable: !0
                            }
                        }), t && l(i, t)
                    }
                    function s(i) {
                        return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(i) {
                            return i.__proto__ || Object.getPrototypeOf(i)
                        })(i)
                    }
                    function l(i, t) {
                        return (l = Object.setPrototypeOf || function(i, t) {
                            return i.__proto__ = t, i
                        })(i, t)
                    }
                    function a(i, t) {
                        return !t || "object" != typeof t && "function" != typeof t ? function(i) {
                            if (void 0 === i) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return i
                        }(i) : t
                    }
                    var u = function() {
                        function i(t) {
                            n(this, i), this._win = t, this.GRANTED = "granted", this.DEFAULT = "default", this.DENIED = "denied", this._permissions = [this.GRANTED, this.DEFAULT, this.DENIED]
                        }
                        return r(i, [{
                            key: "request",
                            value: function(i, t) {
                                return arguments.length > 0 ? this._requestWithCallback.apply(this, arguments) : this._requestAsPromise()
                            }
                        }, {
                            key: "_requestWithCallback",
                            value: function(i, t) {
                                var e, n = this,
                                    o = this.get(),
                                    r = !1,
                                    s = function() {
                                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n._win.Notification.permission;
                                        r || (r = !0, void 0 === e && n._win.webkitNotifications && (e = n._win.webkitNotifications.checkPermission()), e === n.GRANTED || 0 === e ? i && i() : t && t())
                                    };
                                o !== this.DEFAULT ? s(o) : this._win.webkitNotifications && this._win.webkitNotifications.checkPermission ? this._win.webkitNotifications.requestPermission(s) : this._win.Notification && this._win.Notification.requestPermission ? (e = this._win.Notification.requestPermission(s)) && e.then && e.then(s).
                                catch ((function() {
                                    t && t()
                                })) : i && i()
                            }
                        }, {
                            key: "_requestAsPromise",
                            value: function() {
                                var i = this,
                                    t = this.get(),
                                    e = t !== this.DEFAULT,
                                    n = this._win.Notification && this._win.Notification.requestPermission,
                                    o = this._win.webkitNotifications && this._win.webkitNotifications.checkPermission;
                                return new Promise((function(r, s) {
                                    var c, a = !1,
                                        u = function(t) {
                                            a || (a = !0, function(t) {
                                                return t === i.GRANTED || 0 === t
                                            }(t) ? r() : s())
                                        };
                                    e ? u(t) : o ? i._win.webkitNotifications.requestPermission((function(i) {
                                        u(i)
                                    })) : n ? (c = i._win.Notification.requestPermission(u)) && c.then && c.then(u).
                                    catch (s) : r()
                                }))
                            }
                        }, {
                            key: "has",
                            value: function() {
                                return this.get() === this.GRANTED
                            }
                        }, {
                            key: "get",
                            value: function() {
                                return this._win.Notification && this._win.Notification.permission ? this._win.Notification.permission : this._win.webkitNotifications && this._win.webkitNotifications.checkPermission ? this._permissions[this._win.webkitNotifications.checkPermission()] : navigator.mozNotification ? this.GRANTED : this._win.external && this._win.external.msIsSiteMode ? this._win.external.msIsSiteMode() ? this.GRANTED : this.DEFAULT : this.GRANTED
                            }
                        }]), i
                    }(),
                        f = function() {
                            function i() {
                                n(this, i)
                            }
                            return r(i, null, [{
                                key: "isUndefined",
                                value: function(i) {
                                    return void 0 === i
                                }
                            }, {
                                key: "isNull",
                                value: function(i) {
                                    return null === obj
                                }
                            }, {
                                key: "isString",
                                value: function(i) {
                                    return "string" == typeof i
                                }
                            }, {
                                key: "isFunction",
                                value: function(i) {
                                    return i && "[object Function]" === {}.toString.call(i)
                                }
                            }, {
                                key: "isObject",
                                value: function(i) {
                                    return "object" === t(i)
                                }
                            }, {
                                key: "objectMerge",
                                value: function(i, t) {
                                    for (var e in t) i.hasOwnProperty(e) && this.isObject(i[e]) && this.isObject(t[e]) ? this.objectMerge(i[e], t[e]) : i[e] = t[e]
                                }
                            }]), i
                        }(),
                        d = function i(t) {
                            n(this, i), this._win = t
                        }, m = function(i) {
                            function t() {
                                return n(this, t), a(this, s(t).apply(this, arguments))
                            }
                            return c(t, d), r(t, [{
                                key: "isSupported",
                                value: function() {
                                    return void 0 !== this._win.Notification
                                }
                            }, {
                                key: "create",
                                value: function(i, t) {
                                    return new this._win.Notification(i, {
                                        icon: f.isString(t.icon) || f.isUndefined(t.icon) || f.isNull(t.icon) ? t.icon : t.icon.x32,
                                        body: t.body,
                                        tag: t.tag,
                                        requireInteraction: t.requireInteraction
                                    })
                                }
                            }, {
                                key: "close",
                                value: function(i) {
                                    i.close()
                                }
                            }]), t
                        }(),
                        v = function(t) {
                            function e() {
                                return n(this, e), a(this, s(e).apply(this, arguments))
                            }
                            return c(e, d), r(e, [{
                                key: "isSupported",
                                value: function() {
                                    return void 0 !== this._win.navigator && void 0 !== this._win.navigator.serviceWorker
                                }
                            }, {
                                key: "getFunctionBody",
                                value: function(i) {
                                    var t = i.toString().match(/function[^{]+{([\s\S]*)}$/);
                                    return null != t && t.length > 1 ? t[1] : null
                                }
                            }, {
                                key: "create",
                                value: function(t, e, n, o, r) {
                                    var s = this;
                                    this._win.navigator.serviceWorker.register(o), this._win.navigator.serviceWorker.ready.then((function(o) {
                                        var c = {
                                            id: t,
                                            link: n.link,
                                            origin: document.location.href,
                                            onClick: f.isFunction(n.onClick) ? s.getFunctionBody(n.onClick) : "",
                                            onClose: f.isFunction(n.onClose) ? s.getFunctionBody(n.onClose) : ""
                                        };
                                        void 0 !== n.data && null !== n.data && (c = Object.assign(c, n.data)), o.showNotification(e, {
                                            icon: n.icon,
                                            body: n.body,
                                            vibrate: n.vibrate,
                                            tag: n.tag,
                                            data: c,
                                            requireInteraction: n.requireInteraction,
                                            silent: n.silent
                                        }).then((function() {
                                            o.getNotifications().then((function(i) {
                                                o.active.postMessage(""), r(i)
                                            }))
                                        })).
                                        catch ((function(t) {
                                            throw new Error(i.errors.sw_notification_error + t.message)
                                        }))
                                    })).
                                    catch ((function(t) {
                                        throw new Error(i.errors.sw_registration_error + t.message)
                                    }))
                                }
                            }, {
                                key: "close",
                                value: function() {}
                            }]), e
                        }(),
                        h = function(i) {
                            function t() {
                                return n(this, t), a(this, s(t).apply(this, arguments))
                            }
                            return c(t, d), r(t, [{
                                key: "isSupported",
                                value: function() {
                                    return void 0 !== this._win.navigator.mozNotification
                                }
                            }, {
                                key: "create",
                                value: function(i, t) {
                                    var e = this._win.navigator.mozNotification.createNotification(i, t.body, t.icon);
                                    return e.show(), e
                                }
                            }]), t
                        }(),
                        _ = function(i) {
                            function t() {
                                return n(this, t), a(this, s(t).apply(this, arguments))
                            }
                            return c(t, d), r(t, [{
                                key: "isSupported",
                                value: function() {
                                    return void 0 !== this._win.external && void 0 !== this._win.external.msIsSiteMode
                                }
                            }, {
                                key: "create",
                                value: function(i, t) {
                                    return this._win.external.msSiteModeClearIconOverlay(), this._win.external.msSiteModeSetIconOverlay(f.isString(t.icon) || f.isUndefined(t.icon) ? t.icon : t.icon.x16, i), this._win.external.msSiteModeActivate(), null
                                }
                            }, {
                                key: "close",
                                value: function() {
                                    this._win.external.msSiteModeClearIconOverlay()
                                }
                            }]), t
                        }(),
                        w = function(i) {
                            function t() {
                                return n(this, t), a(this, s(t).apply(this, arguments))
                            }
                            return c(t, d), r(t, [{
                                key: "isSupported",
                                value: function() {
                                    return void 0 !== this._win.webkitNotifications
                                }
                            }, {
                                key: "create",
                                value: function(i, t) {
                                    var e = this._win.webkitNotifications.createNotification(t.icon, i, t.body);
                                    return e.show(), e
                                }
                            }, {
                                key: "close",
                                value: function(i) {
                                    i.cancel()
                                }
                            }]), t
                        }();
                    return new(function() {
                        function t(i) {
                            n(this, t), this._currentId = 0, this._notifications = {}, this._win = i, this.Permission = new u(i), this._agents = {
                                desktop: new m(i),
                                chrome: new v(i),
                                firefox: new h(i),
                                ms: new _(i),
                                webkit: new w(i)
                            }, this._configuration = {
                                serviceWorker: "/serviceWorker.min.js",
                                fallback: function(i) {}
                            }
                        }
                        return r(t, [{
                            key: "_closeNotification",
                            value: function(t) {
                                var e = !0,
                                    n = this._notifications[t];
                                if (void 0 !== n) {
                                    if (e = this._removeNotification(t), this._agents.desktop.isSupported()) this._agents.desktop.close(n);
                                    else if (this._agents.webkit.isSupported()) this._agents.webkit.close(n);
                                    else {
                                        if (!this._agents.ms.isSupported()) throw e = !1, new Error(i.errors.unknown_interface);
                                        this._agents.ms.close()
                                    }
                                    return e
                                }
                                return !1
                            }
                        }, {
                            key: "_addNotification",
                            value: function(i) {
                                var t = this._currentId;
                                return this._notifications[t] = i, this._currentId++, t
                            }
                        }, {
                            key: "_removeNotification",
                            value: function(i) {
                                var t = !1;
                                return this._notifications.hasOwnProperty(i) && (delete this._notifications[i], t = !0), t
                            }
                        }, {
                            key: "_prepareNotification",
                            value: function(i, t) {
                                var e, n = this;
                                return e = {
                                    get: function() {
                                        return n._notifications[i]
                                    },
                                    close: function() {
                                        n._closeNotification(i)
                                    }
                                }, t.timeout && setTimeout((function() {
                                    e.close()
                                }), t.timeout), e
                            }
                        }, {
                            key: "_serviceWorkerCallback",
                            value: function(i, t, e) {
                                var n = this,
                                    o = this._addNotification(i[i.length - 1]);
                                navigator && navigator.serviceWorker && (navigator.serviceWorker.addEventListener("message", (function(i) {
                                    var t = JSON.parse(i.data);
                                    "close" === t.action && Number.isInteger(t.id) && n._removeNotification(t.id)
                                })), e(this._prepareNotification(o, t))), e(null)
                            }
                        }, {
                            key: "_createCallback",
                            value: function(i, t, e) {
                                var n, o = this,
                                    r = null;
                                if (t = t || {}, n = function(i) {
                                    o._removeNotification(i), f.isFunction(t.onClose) && t.onClose.call(o, r)
                                }, this._agents.desktop.isSupported()) try {
                                    r = this._agents.desktop.create(i, t)
                                } catch (n) {
                                    var s = this._currentId,
                                        c = this.config().serviceWorker;
                                    this._agents.chrome.isSupported() && this._agents.chrome.create(s, i, t, c, (function(i) {
                                        return o._serviceWorkerCallback(i, t, e)
                                    }))
                                } else this._agents.webkit.isSupported() ? r = this._agents.webkit.create(i, t) : this._agents.firefox.isSupported() ? this._agents.firefox.create(i, t) : this._agents.ms.isSupported() ? r = this._agents.ms.create(i, t) : (t.title = i, this.config().fallback(t));
                                if (null !== r) {
                                    var a = this._addNotification(r),
                                        u = this._prepareNotification(a, t);
                                    f.isFunction(t.onShow) && r.addEventListener("show", t.onShow), f.isFunction(t.onError) && r.addEventListener("error", t.onError), f.isFunction(t.onClick) && r.addEventListener("click", t.onClick), r.addEventListener("close", (function() {
                                        n(a)
                                    })), r.addEventListener("cancel", (function() {
                                        n(a)
                                    })), e(u)
                                }
                                e(null)
                            }
                        }, {
                            key: "create",
                            value: function(t, e) {
                                var n, o = this;
                                if (!f.isString(t)) throw new Error(i.errors.invalid_title);
                                return n = this.Permission.has() ? function(i, n) {
                                    try {
                                        o._createCallback(t, e, i)
                                    } catch (i) {
                                        n(i)
                                    }
                                } : function(n, r) {
                                    o.Permission.request().then((function() {
                                        o._createCallback(t, e, n)
                                    })).
                                    catch ((function() {
                                        r(i.errors.permission_denied)
                                    }))
                                }, new Promise(n)
                            }
                        }, {
                            key: "count",
                            value: function() {
                                var i, t = 0;
                                for (i in this._notifications) this._notifications.hasOwnProperty(i) && t++;
                                return t
                            }
                        }, {
                            key: "close",
                            value: function(i) {
                                var t;
                                for (t in this._notifications) if (this._notifications.hasOwnProperty(t) && this._notifications[t].tag === i) return this._closeNotification(t)
                            }
                        }, {
                            key: "clear",
                            value: function() {
                                var i, t = !0;
                                for (i in this._notifications) this._notifications.hasOwnProperty(i) && (t = t && this._closeNotification(i));
                                return t
                            }
                        }, {
                            key: "supported",
                            value: function() {
                                var i = !1;
                                for (var t in this._agents) this._agents.hasOwnProperty(t) && (i = i || this._agents[t].isSupported());
                                return i
                            }
                        }, {
                            key: "config",
                            value: function(i) {
                                return (void 0 !== i || null !== i && f.isObject(i)) && f.objectMerge(this._configuration, i), this._configuration
                            }
                        }, {
                            key: "extend",
                            value: function(t) {
                                var e, n = {}.hasOwnProperty;
                                if (!n.call(t, "plugin")) throw new Error(i.errors.invalid_plugin);
                                for (var o in n.call(t, "config") && f.isObject(t.config) && null !== t.config && this.config(t.config), e = new(0, t.plugin)(this.config())) n.call(e, o) && f.isFunction(e[o]) && (this[o] = e[o])
                            }
                        }]), t
                    }())("undefined" != typeof window ? window : e)
                }()
            }).call(this, n(58))
        },
        441: function(t, e, n) {
            var content = n(457);
            content.__esModule && (content = content.
            default), "string" == typeof content && (content = [
                [t.i, content, ""]
            ]), content.locals && (t.exports = content.locals);
            (0, n(124).
            default)("3d050572", content, !0, {
                sourceMap: !1
            })
        },
        442: function(t, e, n) {
            var content = n(459);
            content.__esModule && (content = content.
            default), "string" == typeof content && (content = [
                [t.i, content, ""]
            ]), content.locals && (t.exports = content.locals);
            (0, n(124).
            default)("9f7c1724", content, !0, {
                sourceMap: !1
            })
        },
        444: function(t, e, n) {
            var content = n(462);
            content.__esModule && (content = content.
            default), "string" == typeof content && (content = [
                [t.i, content, ""]
            ]), content.locals && (t.exports = content.locals);
            (0, n(124).
            default)("5544c402", content, !0, {
                sourceMap: !1
            })
        },
        445: function(t, e, n) {
            var content = n(464);
            content.__esModule && (content = content.
            default), "string" == typeof content && (content = [
                [t.i, content, ""]
            ]), content.locals && (t.exports = content.locals);
            (0, n(124).
            default)("48900218", content, !0, {
                sourceMap: !1
            })
        },
        446: function(t, e, n) {
            var content = n(466);
            content.__esModule && (content = content.
            default), "string" == typeof content && (content = [
                [t.i, content, ""]
            ]), content.locals && (t.exports = content.locals);
            (0, n(124).
            default)("f811f1b2", content, !0, {
                sourceMap: !1
            })
        },
        447: function(t, e, n) {
            var content = n(468);
            content.__esModule && (content = content.
            default), "string" == typeof content && (content = [
                [t.i, content, ""]
            ]), content.locals && (t.exports = content.locals);
            (0, n(124).
            default)("37aa9522", content, !0, {
                sourceMap: !1
            })
        },
        451: function(t, e, n) {
            var content = n(472);
            content.__esModule && (content = content.
            default), "string" == typeof content && (content = [
                [t.i, content, ""]
            ]), content.locals && (t.exports = content.locals);
            (0, n(124).
            default)("37efd88e", content, !0, {
                sourceMap: !1
            })
        },
        454: function(t, e, n) {
            "use strict";
            n.r(e);
            var o = {
                model: {
                    prop: "checked",
                    event: "change"
                },
                props: {
                    checked: Boolean,
                    disabled: {
                        type: Boolean,
                        default: !1
                    }
                }
            }, r = n(55),
                component = Object(r.a)(o, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "w-14 rounded-full p-1 duration-150 ease-in-out",
                        class: [t.checked ? "bg-gray-800" : "bg-gray-300", t.disabled ? "cursor-not-allowed" : "cursor-pointer"],
                        on: {
                            click: function(e) {
                                !t.disabled && t.$emit("change", !t.checked)
                            }
                        }
                    }, [e("div", {
                        staticClass: "bg-white w-6 h-6 rounded-full shadow-md transform duration-150 ease-in-out",
                        class: {
                            "translate-x-6": t.checked
                        }
                    })])
                }), [], !1, null, "c87810ae", null);
            e.
            default = component.exports
        },
        456: function(t, e, n) {
            "use strict";
            n(441)
        },
        457: function(t, e, n) {
            var o = n(123)((function(i) {
                return i[1]
            }));
            o.push([t.i, ".username-container:hover .edit-button[data-v-a3a668b6]{display:block}.username[data-v-a3a668b6]{font-size:max(calc(3rem/2),2vw)}", ""]), o.locals = {}, t.exports = o
        },
        458: function(t, e, n) {
            "use strict";
            n(442)
        },
        459: function(t, e, n) {
            var o = n(123)((function(i) {
                return i[1]
            }));
            o.push([t.i, ".counters{font-size:max(1rem,1.2vw)}.shadow-border{text-shadow:.6px .6px 0 rgba(85,85,85,.5333333333333333),.6px -.6px 0 rgba(85,85,85,.5333333333333333),-.6px .6px 0 rgba(85,85,85,.5333333333333333),-.6px -.6px 0 rgba(85,85,85,.5333333333333333),.6px 0 0 rgba(85,85,85,.5333333333333333),0 .6px 0 rgba(85,85,85,.5333333333333333),-.6px 0 0 rgba(85,85,85,.5333333333333333),0 -.6px 0 rgba(85,85,85,.5333333333333333)}.counters:hover .menu-button{visibility:visible}.active-type{background-color:rgb(255 255 255 / 0.1)}.counter-item{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border-radius:1rem;padding-left:0.5rem;padding-right:0.5rem;padding-top:1rem;padding-bottom:1rem;transition-property:color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.counter-item:hover{background-color:rgb(255 255 255 / 0.1)}.counter-item:active{background-color:rgb(255 255 255 / 0.05)}@media (min-width: 768px){.counter-item{padding-left:1rem;padding-right:1rem}}.counter-item strong{display:inline-block;font-weight:900;font-size:120%}.is-running .counter-item:not(.active-type){cursor:not-allowed}.animate-counter{animation:leaves 1s ease-in-out}@keyframes leaves{0%{transform:scale(1)}50%{transform:scale(1.35)}to{transform:scale(1)}}", ""]), o.locals = {}, t.exports = o
        },
        460: function(t, e, n) {
            (function(e) {
                var n = /^\s+|\s+$/g,
                    o = /^[-+]0x[0-9a-f]+$/i,
                    r = /^0b[01]+$/i,
                    c = /^0o[0-7]+$/i,
                    l = parseInt,
                    f = "object" == typeof e && e && e.Object === Object && e,
                    d = "object" == typeof self && self && self.Object === Object && self,
                    m = f || d || Function("return this")(),
                    v = Object.prototype.toString,
                    h = Math.max,
                    _ = Math.min,
                    w = function() {
                        return m.Date.now()
                    };

                function x(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                function y(t) {
                    if ("number" == typeof t) return t;
                    if (function(t) {
                        return "symbol" == typeof t || function(t) {
                            return !!t && "object" == typeof t
                        }(t) && "[object Symbol]" == v.call(t)
                    }(t)) return NaN;
                    if (x(t)) {
                        var e = "function" == typeof t.valueOf ? t.valueOf() : t;
                        t = x(e) ? e + "" : e
                    }
                    if ("string" != typeof t) return 0 === t ? t : +t;
                    t = t.replace(n, "");
                    var f = r.test(t);
                    return f || c.test(t) ? l(t.slice(2), f ? 2 : 8) : o.test(t) ? NaN : +t
                }
                t.exports = function(t, e, n) {
                    var o, r, c, l, f, d, m = 0,
                        v = !1,
                        O = !1,
                        k = !0;
                    if ("function" != typeof t) throw new TypeError("Expected a function");

                    function C(time) {
                        var e = o,
                            n = r;
                        return o = r = void 0, m = time, l = t.apply(n, e)
                    }
                    function E(time) {
                        return m = time, f = setTimeout(T, e), v ? C(time) : l
                    }
                    function S(time) {
                        var t = time - d;
                        return void 0 === d || t >= e || t < 0 || O && time - m >= c
                    }
                    function T() {
                        var time = w();
                        if (S(time)) return M(time);
                        f = setTimeout(T, function(time) {
                            var t = e - (time - d);
                            return O ? _(t, c - (time - m)) : t
                        }(time))
                    }
                    function M(time) {
                        return f = void 0, k && o ? C(time) : (o = r = void 0, l)
                    }
                    function $() {
                        var time = w(),
                            t = S(time);
                        if (o = arguments, r = this, d = time, t) {
                            if (void 0 === f) return E(d);
                            if (O) return f = setTimeout(T, e), C(d)
                        }
                        return void 0 === f && (f = setTimeout(T, e)), l
                    }
                    return e = y(e) || 0, x(n) && (v = !! n.leading, c = (O = "maxWait" in n) ? h(y(n.maxWait) || 0, e) : c, k = "trailing" in n ? !! n.trailing : k), $.cancel = function() {
                        void 0 !== f && clearTimeout(f), m = 0, o = d = r = f = void 0
                    }, $.flush = function() {
                        return void 0 === f ? l : M(w())
                    }, $
                }
            }).call(this, n(58))
        },
        461: function(t, e, n) {
            "use strict";
            n(444)
        },
        462: function(t, e, n) {
            var o = n(123)((function(i) {
                return i[1]
            }));
            o.push([t.i, ".sound-button[data-v-6a0833d3]{border-top-width:1px;border-bottom-width:1px;border-color:rgb(156 163 175 / var(--tw-border-opacity));--tw-border-opacity:0.8;padding-top:0.5rem;padding-bottom:0.5rem;transition-property:color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms}.selected-sound[data-v-6a0833d3]{--tw-bg-opacity:1;background-color:rgb(31 41 55 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(249 250 251 / var(--tw-text-opacity));--tw-border-opacity:1 !important;border-color:rgb(31 41 55 / var(--tw-border-opacity)) !important}.animate .requires-stop-message[data-v-6a0833d3]{--tw-scale-x:1.05;--tw-scale-y:1.05;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));--tw-text-opacity:1;color:rgb(185 28 28 / var(--tw-text-opacity));transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:500ms}", ""]), o.locals = {}, t.exports = o
        },
        463: function(t, e, n) {
            "use strict";
            n(445)
        },
        464: function(t, e, n) {
            var o = n(123)((function(i) {
                return i[1]
            }));
            o.push([t.i, ".countdown{color:#fff;background:transparent;text-shadow:.7px .7px 0 rgba(51,51,51,.2),.7px -.7px 0 rgba(51,51,51,.2),-.7px .7px 0 rgba(51,51,51,.2),-.7px -.7px 0 rgba(51,51,51,.2),.7px 0 0 rgba(51,51,51,.2),0 .7px 0 rgba(51,51,51,.2),-.7px 0 0 rgba(51,51,51,.2),0 -.7px 0 rgba(85,85,85,.6);font-size:6rem;line-height:1}@media (min-width: 640px){.countdown{font-size:9rem}}@media (min-width: 1280px){.countdown{font-size:12.5vw}}.countdown-font{font-family:helvetica neue,open sans,Helvetica,Arial,sans-serif}", ""]), o.locals = {}, t.exports = o
        },
        465: function(t, e, n) {
            "use strict";
            n(446)
        },
        466: function(t, e, n) {
            var o = n(123)((function(i) {
                return i[1]
            }));
            o.push([t.i, "#mantra-input[data-v-2a3d0756]::-moz-placeholder{color:#fff;text-shadow:.6px .6px 0 rgba(85,85,85,.5333333333333333),.6px -.6px 0 rgba(85,85,85,.5333333333333333),-.6px .6px 0 rgba(85,85,85,.5333333333333333),-.6px -.6px 0 rgba(85,85,85,.5333333333333333),.6px 0 0 rgba(85,85,85,.5333333333333333),0 .6px 0 rgba(85,85,85,.5333333333333333),-.6px 0 0 rgba(85,85,85,.5333333333333333),0 -.6px 0 rgba(85,85,85,.5333333333333333)}#mantra-input[data-v-2a3d0756],#mantra-input[data-v-2a3d0756]::placeholder{color:#fff;text-shadow:.6px .6px 0 rgba(85,85,85,.5333333333333333),.6px -.6px 0 rgba(85,85,85,.5333333333333333),-.6px .6px 0 rgba(85,85,85,.5333333333333333),-.6px -.6px 0 rgba(85,85,85,.5333333333333333),.6px 0 0 rgba(85,85,85,.5333333333333333),0 .6px 0 rgba(85,85,85,.5333333333333333),-.6px 0 0 rgba(85,85,85,.5333333333333333),0 -.6px 0 rgba(85,85,85,.5333333333333333)}.shadow-border[data-v-2a3d0756]{text-shadow:.6px .6px 0 rgba(85,85,85,.5333333333333333),.6px -.6px 0 rgba(85,85,85,.5333333333333333),-.6px .6px 0 rgba(85,85,85,.5333333333333333),-.6px -.6px 0 rgba(85,85,85,.5333333333333333),.6px 0 0 rgba(85,85,85,.5333333333333333),0 .6px 0 rgba(85,85,85,.5333333333333333),-.6px 0 0 rgba(85,85,85,.5333333333333333),0 -.6px 0 rgba(85,85,85,.5333333333333333)}.mantra-container:hover .menu-button[data-v-2a3d0756]{visibility:visible}.fade-out[data-v-2a3d0756]{animation:fade-out-2a3d0756 4s ease}@keyframes fade-out-2a3d0756{0%{opacity:0}40%{opacity:1}80%{opacity:1}to{opacity:0}}.fade-in[data-v-2a3d0756]{animation:fade-in-2a3d0756 1s ease}@keyframes fade-in-2a3d0756{0%{opacity:0}to{opacity:1}}", ""]), o.locals = {}, t.exports = o
        },
        467: function(t, e, n) {
            "use strict";
            n(447)
        },
        468: function(t, e, n) {
            var o = n(123)((function(i) {
                return i[1]
            }));
            o.push([t.i, ".top-shadow[data-v-66cb269f]{box-shadow:0 -20px 100px -20px rgba(50,50,93,.25),0 -20px 60px -30px rgba(0,0,0,.3)}", ""]), o.locals = {}, t.exports = o
        },
        471: function(t, e, n) {
            "use strict";
            n(451)
        },
        472: function(t, e, n) {
            var o = n(123)((function(i) {
                return i[1]
            }));
            o.push([t.i, '.item-control[data-v-467e2b78]{flex:1 1 0%;border-color:rgb(255 255 255 / 0.3)}.item-control[data-v-467e2b78]:hover{opacity:1}@media (min-width: 640px){.item-control[data-v-467e2b78]{flex:none;border-radius:9999px;border-width:2px}}.item-control[data-v-467e2b78]{-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}.tooltip[data-v-467e2b78]{position:relative}.tooltip[data-v-467e2b78]:after{position:absolute;display:none;white-space:nowrap;border-radius:0.75rem;--tw-bg-opacity:1;background-color:rgb(17 24 39 / var(--tw-bg-opacity));padding-left:0.75rem;padding-right:0.75rem;padding-top:0.25rem;padding-bottom:0.25rem;--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity));z-index:999}.tooltip[data-v-467e2b78]:before{position:absolute;display:none;--tw-bg-opacity:1;background-color:rgb(17 24 39 / var(--tw-bg-opacity));content:" ";width:15px;height:15px;z-index:999}.tooltip[data-v-467e2b78]:hover:after,.tooltip[data-v-467e2b78]:hover:before{display:block}.tooltip.top[data-v-467e2b78]:after{font-weight:700;content:attr(data-tooltip);top:0;left:50%;transform:translate(-50%,calc(-100% - 10px))}.tooltip.top[data-v-467e2b78]:before{top:0;left:50%;transform:translate(-50%,calc(-100% - 5px)) rotate(45deg)}.scale-on-active[data-v-467e2b78]:active{transform:scale(.95)}.shadow-borders[data-v-467e2b78]{text-shadow:1px 1px 0 #333,1px -1px 0 #333,-1px 1px 0 #333,-1px -1px 0 #333,1px 0 0 #333,0 1px 0 #333,-1px 0 0 #333,0 -1px 0 #333}', ""]), o.locals = {}, t.exports = o
        },
        473: function(t, e, n) {
            var content = n(495);
            content.__esModule && (content = content.
            default), "string" == typeof content && (content = [
                [t.i, content, ""]
            ]), content.locals && (t.exports = content.locals);
            (0, n(124).
            default)("a218bb8e", content, !0, {
                sourceMap: !1
            })
        },
        478: function(t, e, n) {
            "use strict";
            n.r(e);
            n(26), n(13), n(27), n(28);
            var o = n(3),
                r = n(0),
                c = (n(31), n(16), n(6), n(15), n(14), n(84), n(460)),
                l = n.n(c),
                f = n(416),
                d = n.n(f),
                m = n(102),
                v = n(20);
            var h = n(415);

            function _(object, t) {
                var e = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(object);
                    t && (n = n.filter((function(t) {
                        return Object.getOwnPropertyDescriptor(object, t).enumerable
                    }))), e.push.apply(e, n)
                }
                return e
            }
            function w(t) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? _(Object(source), !0).forEach((function(e) {
                        Object(r.a)(t, e, source[e])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(source)) : _(Object(source)).forEach((function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(source, e))
                    }))
                }
                return t
            }
            var x = {
                background: "BACKGROUND",
                language: "LANGUAGE",
                concentrationTime: "CONCENTRATION_TIME",
                alarm: "ALARM",
                autoStart: "AUTO_START",
                notifications: "NOTIFICATIONS"
            }, y = {
                filters: {
                    toMins: function(t) {
                        return t / 60
                    }
                },
                data: function() {
                    return {
                        currentOption: null,
                        customDurations: w({}, this.$store.state.timer.schemes[v.d.CUSTOM]),
                        pushIsDenied: d.a.Permission.get() === d.a.Permission.DENIED,
                        alarmPlayer: h.a
                    }
                },
                watch: {
                    "$store.state.modals.showMenu": function(t) {
                        t || (this.currentOption = null)
                    },
                    customDurations: {
                        handler: function() {
                            this.debouncedSetCustomDurations()
                        },
                        deep: !0
                    }
                },
                created: function() {
                    this.options = x, this.SCHEME_TYPES = v.d, this.TIMERS = v.e, this.debouncedSetCustomDurations = l()(this.setCustomDurations, 250)
                },
                computed: w(w({}, Object(m.c)("timer", ["alarmOnCompletionIndex", "schemes", "alarmVolume", "isRunning"])), {}, {
                    colorBackgrounds: function() {
                        return v.g.filter((function(t) {
                            return !t.isImage
                        }))
                    },
                    imageBackgrounds: function() {
                        return v.g.filter((function(t) {
                            return t.isImage
                        }))
                    },
                    activeScheme: {
                        get: function() {
                            return this.$store.state.timer.activeScheme
                        },
                        set: function(t) {
                            this.$storage.strategy.setActiveScheme(t)
                        }
                    },
                    autoStartPomodoros: {
                        get: function() {
                            return this.$store.state.timer.autoStartPomodoros
                        },
                        set: function(t) {
                            this.$storage.strategy.updateAutoStartPomodoros(t)
                        }
                    },
                    autoStartBreaks: {
                        get: function() {
                            return this.$store.state.timer.autoStartBreaks
                        },
                        set: function(t) {
                            this.$storage.strategy.updateAutoStartBreaks(t)
                        }
                    },
                    notifyCompletion: {
                        get: function() {
                            return this.$store.state.timer.notifyCompletion
                        },
                        set: function(t) {
                            this.$storage.strategy.updateNotifyCompletion(t), t && this.checkPushPermissions()
                        }
                    },
                    isClientForNotify: function() {
                        return this.$device.isDesktop && (this.$device.isChrome || this.$device.isSafari)
                    }
                }),
                methods: {
                    checkPushPermissions: function() {
                        var t = this,
                            e = d.a.Permission.get();
                        this.pushIsDenied = e === d.a.Permission.DENIED, e === d.a.Permission.DEFAULT && d.a.Permission.request((function() {
                            var e;
                            e = t, d.a.create(e.$t("WELCOME_NOTIFICATION_TITLE"), {
                                body: e.$t("WELCOME_NOTIFICATION_BODY"),
                                onClick: function() {
                                    window.focus(), this.close()
                                },
                                icon: e.$icon(64)
                            }), window.dataLayer && window.dataLayer.push({
                                event: "notification_perm_granted"
                            })
                        }), (function() {
                            t.pushIsDenied = e === d.a.Permission.DENIED, window.dataLayer && window.dataLayer.push({
                                event: "notification_perm_denied"
                            })
                        }))
                    },
                    changeAlarmVolume: function(t) {
                        var e = parseInt(t.target.value);
                        h.a.stop(), h.a.setVolume(e), h.a.play(), this.$store.commit("timer/SET_ALARM_VOLUME", e), this.$storage.strategy.updateAlarmVolume(e)
                    },
                    updateAlarmOnCompletionIndex: function(t) {
                        this.$storage.strategy.updateAlarmOnCompletionIndex(t), h.a.stop(), t >= 0 && (h.a.orderIndex = t, h.a.play())
                    },
                    setCustomDurations: function() {
                        var t = this;
                        Object.keys(this.customDurations).forEach((function(e) {
                            t.$storage.strategy.updateCustomScheme(Object(r.a)({}, e, t.customDurations[e]))
                        }))
                    },
                    animate: function(t) {
                        t.target.classList.add("animate"), setTimeout((function() {
                            t.target.classList.remove("animate")
                        }), 500)
                    },
                    goToLogin: function() {
                        var t = this;
                        return Object(o.a)(regeneratorRuntime.mark((function e() {
                            return regeneratorRuntime.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        if (!t.$store.state.timer.isRunning) {
                                            e.next = 4;
                                            break
                                        }
                                        if (!confirm("Se perderán los cambios ¿Estás seguro?")) {
                                            e.next = 4;
                                            break
                                        }
                                        return e.next = 4, t.$store.dispatch("timer/stop");
                                    case 4:
                                        t.$store.commit("SET_MODAL", {
                                            name: "showMenu",
                                            value: !1
                                        }), t.$router.push(t.localePath("/login"));
                                    case 6:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))()
                    }
                }
            }, O = (n(461), n(55)),
                component = Object(O.a)(y, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        directives: [{
                            name: "click-outside",
                            rawName: "v-click-outside",
                            value: function() {
                                return t.$store.commit("SET_MODAL", {
                                    name: "showMenu",
                                    value: !1
                                })
                            },
                            expression: "\n    () => $store.commit('SET_MODAL', { name: 'showMenu', value: false })\n  "
                        }],
                        staticClass: "origin-top-right absolute top-0 right-0 overflow-hidden z-30 pl-3 pb-3"
                    }, [e("div", {
                        staticClass: "rounded-bl-[4rem] bg-white shadow-md overflow-hidden w-80 sm:w-[28rem] text-gray-900",
                        attrs: {
                            role: "menu",
                            "aria-orientation": "vertical",
                            "aria-labelledby": "options-menu"
                        }
                    }, [e("div", {
                        staticClass: "flex justify-between px-4 sm:px-6 md:px-10 pt-4 sm:pt-6 md:pt-10"
                    }, [e("span", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: t.currentOption,
                            expression: "currentOption"
                        }],
                        staticClass: "flex items-center"
                    }, [e("button", {
                        staticClass: "hover:bg-gray-100/80 px-2 rounded-lg mr-2",
                        on: {
                            click: function(e) {
                                t.currentOption = null
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-4xl",
                        attrs: {
                            icon: "arrow-left"
                        }
                    })], 1), t._v(" "), e("span", {
                        staticClass: "text-xl font-bold"
                    }, [t._v(t._s(t.$t(t.currentOption)))])]), t._v(" "), e("div", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: !t.currentOption,
                            expression: "!currentOption"
                        }],
                        staticClass: "flex"
                    }, [e("button", {
                        staticClass: "flex items-center hover:bg-gray-100/80 px-2 rounded-lg font-semibold mr-6",
                        on: {
                            click: function(e) {
                                t.currentOption = t.options.background
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "mr-3 opacity-70",
                        attrs: {
                            icon: "image"
                        }
                    }), t._v("\n          " + t._s(t.$t("BACKGROUND")) + "\n        ")], 1), t._v(" "), e("button", {
                        staticClass: "hover:bg-gray-100/80 px-2 rounded-lg font-semibold mr-6 capitalize",
                        on: {
                            click: function(e) {
                                t.currentOption = t.options.language
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-lg",
                        attrs: {
                            icon: "globe"
                        }
                    }), t._v("\n          " + t._s(t.$i18n.locale) + "\n        ")], 1)]), t._v(" "), e("button", {
                        staticClass: "px-2",
                        on: {
                            click: function(e) {
                                return t.$store.commit("SET_MODAL", {
                                    name: "showMenu",
                                    value: !1
                                })
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-4xl",
                        attrs: {
                            icon: "times"
                        }
                    })], 1)]), t._v(" "), e("div", {
                        staticClass: "w-[40rem] sm:w-[56rem] grid grid-cols-2 transition-transform duration-75 py-6 md:py-10",
                        class: {
                            "translate-x-[-20rem] sm:translate-x-[-28rem]": t.currentOption
                        }
                    }, [e("div", {
                        staticClass: "px-6 md:px-10 lg:text-lg",
                        class: {
                            "h-0": t.currentOption
                        }
                    }, [e("button", {
                        staticClass: "flex py-3 px-4 font-semibold w-full hover:bg-gray-100/80 text-left rounded-md",
                        class: {
                            "opacity-60 cursor-not-allowed": t.isRunning
                        },
                        attrs: {
                            id: "concentration-time"
                        },
                        on: {
                            click: function(e) {
                                t.isRunning ? t.animate(e) : t.currentOption = t.options.concentrationTime
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "mr-3 mt-1 opacity-70 pointer-events-none",
                        attrs: {
                            icon: "clock"
                        }
                    }), t._v(" "), e("span", {
                        staticClass: "pointer-events-none"
                    }, [t._v("\n            " + t._s(t.$t("CONCENTRATION_TIME")) + "\n            "), t.isRunning ? e("div", {
                        staticClass: "text-xs requires-stop-message"
                    }, [t._v("\n              Stop the timer to change the time\n            ")]) : t._e()])], 1), t._v(" "), e("button", {
                        staticClass: "block py-3 px-4 font-semibold w-full hover:bg-gray-100/80 text-left rounded-md",
                        on: {
                            click: function(e) {
                                t.currentOption = t.options.alarm
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "mr-3 opacity-70",
                        attrs: {
                            icon: "bell"
                        }
                    }), t._v("\n          " + t._s(t.$t("ALARM")) + "\n        ")], 1), t._v(" "), e("button", {
                        staticClass: "block py-3 px-4 font-semibold w-full hover:bg-gray-100/80 text-left rounded-md",
                        on: {
                            click: function(e) {
                                t.currentOption = t.options.autoStart
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "mr-3 opacity-70",
                        attrs: {
                            icon: "redo-alt"
                        }
                    }), t._v("\n          " + t._s(t.$t("AUTO_START")) + "\n        ")], 1), t._v(" "), e("button", {
                        staticClass: "block py-3 px-4 font-semibold w-full hover:bg-gray-100/80 text-left rounded-md",
                        on: {
                            click: function(e) {
                                t.currentOption = t.options.notifications
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "mr-3 opacity-70",
                        attrs: {
                            icon: "comment-alt"
                        }
                    }), t._v("\n          " + t._s(t.$t("NOTIFICATIONS")) + "\n        ")], 1), t._v(" "), e("hr", {
                        staticClass: "my-2 md:hidden"
                    }), t._v(" "), e("button", {
                        staticClass: "block py-3 px-4 font-semibold w-full hover:bg-gray-100/80 text-left rounded-md md:hidden",
                        on: {
                            click: function(e) {
                                t.$store.commit("SET_MODAL", {
                                    name: "showMenu",
                                    value: !1
                                }), t.$store.commit("SET_MODAL", {
                                    name: "showResetCounters",
                                    value: !0
                                })
                            }
                        }
                    }, [t._v("\n          " + t._s(t.$t("RESET_COUNTERS")) + "\n        ")])]), t._v(" "), e("div", {
                        staticClass: "px-4 sm:px-6 md:px-10 text-lg"
                    }, [t.currentOption === t.options.background ? e("div", [e("div", {
                        staticClass: "font-semibold text-xl mb-2"
                    }, [t._v(t._s(t.$t("COLORS")))]), t._v(" "), e("div", {
                        staticClass: "grid grid-cols-5 gap-3 w-fit"
                    }, t._l(t.colorBackgrounds, (function(n, o) {
                        return e("button", {
                            key: o,
                            staticClass: "w-14 h-14 rounded-lg outline outline-offset-2 outline-transparent",
                            class: {
                                "outline-gray-900": t.$store.state.activeBackground.styles && n.styles && n.styles.backgroundColor == t.$store.state.activeBackground.styles.backgroundColor
                            },
                            style: n.styles,
                            on: {
                                click: function(e) {
                                    return t.$storage.strategy.setBackground(n)
                                }
                            }
                        })
                    })), 0), t._v(" "), e("div", {
                        staticClass: "font-semibold text-xl my-2"
                    }, [t._v(t._s(t.$t("IMAGES")))]), t._v(" "), e("div", {
                        staticClass: "grid grid-cols-5 gap-3 w-fit"
                    }, t._l(t.imageBackgrounds, (function(n, o) {
                        return e("button", {
                            key: o,
                            staticClass: "w-14 h-14 rounded-lg outline outline-offset-2 outline-transparent",
                            class: {
                                "outline-gray-900": n.image == t.$store.state.activeBackground.image
                            },
                            style: "\n                    background: url(".concat(n.thumbnail, ")\n                      no-repeat center center fixed;\n                    -webkit-background-size: cover;\n                    -moz-background-size: cover;\n                    -o-background-size: cover;\n                    background-size: cover;\n                  "),
                            on: {
                                click: function(e) {
                                    return t.$storage.strategy.setBackground(n)
                                }
                            }
                        })
                    })), 0)]) : t._e(), t._v(" "), t.currentOption === t.options.language ? e("div", t._l(t.$i18n.locales, (function(n) {
                        return e("nuxt-link", {
                            key: n.code,
                            staticClass: "block capitalize py-3 px-4",
                            attrs: {
                                to: t.switchLocalePath(n.code)
                            },
                            nativeOn: {
                                click: function(e) {
                                    return t.$store.commit("SET_MODAL", {
                                        name: "showMenu",
                                        value: !1
                                    })
                                }
                            }
                        }, [t._v("\n            " + t._s(n.name) + "\n            "), n.code === t.$i18n.locale ? e("fa-icon", {
                            staticClass: "ml-1",
                            attrs: {
                                icon: "check"
                            }
                        }) : t._e()], 1)
                    })), 1) : t._e(), t._v(" "), t.currentOption === t.options.concentrationTime ? e("div", t._l(t.SCHEME_TYPES, (function(n, o) {
                        return e("div", {
                            key: n,
                            staticClass: "flex items-start px-8 py-2"
                        }, [e("input", {
                            directives: [{
                                name: "model",
                                rawName: "v-model",
                                value: t.activeScheme,
                                expression: "activeScheme"
                            }],
                            staticClass: "w-6 h-6 accent-gray-800 cursor-pointer",
                            attrs: {
                                id: o,
                                type: "radio"
                            },
                            domProps: {
                                value: n,
                                checked: t._q(t.activeScheme, n)
                            },
                            on: {
                                change: function(e) {
                                    t.activeScheme = n
                                }
                            }
                        }), t._v(" "), e("label", {
                            staticClass: "flex-1 ml-3 cursor-pointer",
                            attrs: {
                                for: o
                            }
                        }, [e("span", {
                            staticClass: "font-bold block"
                        }, [t._v("\n                " + t._s(t.$t(o)) + "\n              ")]), t._v(" "), n === t.SCHEME_TYPES.CUSTOM ? [e("div", [e("div", {
                            staticClass: "text-gray-400"
                        }, [t._v("\n                    " + t._s(t._f("toMins")(t.customDurations[t.TIMERS.POMODORO])) + "\n                    min\n                    "), e("span", {
                            staticClass: "float-right"
                        }, [t._v("Pomodoro")])]), t._v(" "), e("input", {
                            directives: [{
                                name: "model",
                                rawName: "v-model.number",
                                value: t.customDurations[t.TIMERS.POMODORO],
                                expression: "customDurations[TIMERS.POMODORO]",
                                modifiers: {
                                    number: !0
                                }
                            }],
                            staticClass: "w-full accent-gray-800",
                            attrs: {
                                disabled: t.activeScheme !== t.SCHEME_TYPES.CUSTOM,
                                type: "range",
                                min: "60",
                                max: "6000",
                                step: "60"
                            },
                            domProps: {
                                value: t.customDurations[t.TIMERS.POMODORO]
                            },
                            on: {
                                __r: function(e) {
                                    t.$set(t.customDurations, t.TIMERS.POMODORO, t._n(e.target.value))
                                },
                                blur: function(e) {
                                    return t.$forceUpdate()
                                }
                            }
                        }), t._v(" "), e("div", {
                            staticClass: "text-gray-400"
                        }, [t._v("\n                    " + t._s(t._f("toMins")(t.customDurations[t.TIMERS.BREAK])) + "\n                    min\n                    "), e("span", {
                            staticClass: "float-right"
                        }, [t._v(t._s(t.$t("BREAK")))])]), t._v(" "), e("input", {
                            directives: [{
                                name: "model",
                                rawName: "v-model.number",
                                value: t.customDurations[t.TIMERS.BREAK],
                                expression: "customDurations[TIMERS.BREAK]",
                                modifiers: {
                                    number: !0
                                }
                            }],
                            staticClass: "w-full accent-gray-800",
                            attrs: {
                                disabled: t.activeScheme !== t.SCHEME_TYPES.CUSTOM,
                                type: "range",
                                min: "60",
                                max: "6000",
                                step: "60"
                            },
                            domProps: {
                                value: t.customDurations[t.TIMERS.BREAK]
                            },
                            on: {
                                __r: function(e) {
                                    t.$set(t.customDurations, t.TIMERS.BREAK, t._n(e.target.value))
                                },
                                blur: function(e) {
                                    return t.$forceUpdate()
                                }
                            }
                        }), t._v(" "), e("div", {
                            staticClass: "text-gray-400"
                        }, [t._v("\n                    " + t._s(t._f("toMins")(t.customDurations[t.TIMERS.LONG_BREAK])) + "\n                    min\n                    "), e("span", {
                            staticClass: "float-right"
                        }, [t._v(t._s(t.$t("LONG_BREAK")))])]), t._v(" "), e("input", {
                            directives: [{
                                name: "model",
                                rawName: "v-model.number",
                                value: t.customDurations[t.TIMERS.LONG_BREAK],
                                expression: "customDurations[TIMERS.LONG_BREAK]",
                                modifiers: {
                                    number: !0
                                }
                            }],
                            staticClass: "w-full accent-gray-800",
                            attrs: {
                                disabled: t.activeScheme !== t.SCHEME_TYPES.CUSTOM,
                                type: "range",
                                min: "60",
                                max: "6000",
                                step: "60"
                            },
                            domProps: {
                                value: t.customDurations[t.TIMERS.LONG_BREAK]
                            },
                            on: {
                                __r: function(e) {
                                    t.$set(t.customDurations, t.TIMERS.LONG_BREAK, t._n(e.target.value))
                                },
                                blur: function(e) {
                                    return t.$forceUpdate()
                                }
                            }
                        })])] : e("span", {
                            staticClass: "text-gray-400 lowercase"
                        }, [t._v("\n                " + t._s(t._f("toMins")(t.schemes[n][t.TIMERS.POMODORO])) + "\n                min Pomodoro "), e("br"), t._v("\n                " + t._s(t._f("toMins")(t.schemes[n][t.TIMERS.BREAK])) + "\n                min " + t._s(t.$t("BREAK")) + " "), e("br"), t._v("\n                " + t._s(t._f("toMins")(t.schemes[n][t.TIMERS.LONG_BREAK])) + "\n                min " + t._s(t.$t("LONG_BREAK")) + "\n              ")])], 2)])
                    })), 0) : t._e(), t._v(" "), t.currentOption === t.options.alarm ? e("div", [e("label", {
                        staticClass: "font-bold block mb-2"
                    }, [t._v("\n            " + t._s(t.$t("ALARM_ON_COMPLETION")) + "\n          ")]), t._v(" "), e("div", {
                        staticClass: "grid grid-cols-4 mb-3"
                    }, [t._l(t.alarmPlayer.tracks, (function(track, n) {
                        return e("button", {
                            key: n,
                            staticClass: "sound-button border-l",
                            class: {
                                "rounded-l-md": !n,
                                "border-r": n === t.alarmPlayer.tracks.length - 1,
                                "selected-sound": t.alarmOnCompletionIndex === n
                            },
                            on: {
                                click: function(e) {
                                    return t.updateAlarmOnCompletionIndex(n)
                                }
                            }
                        }, [t._v("\n              " + t._s(track.title) + "\n            ")])
                    })), t._v(" "), e("button", {
                        staticClass: "sound-button border-r rounded-r-md text-gray-400",
                        class: {
                            "selected-sound": -1 === t.alarmOnCompletionIndex
                        },
                        on: {
                            click: function(e) {
                                return t.updateAlarmOnCompletionIndex(-1)
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-xl",
                        attrs: {
                            icon: "volume-mute"
                        }
                    })], 1)], 2), t._v(" "), e("div", {
                        staticClass: "flex"
                    }, [e("label", {
                        staticClass: "font-bold block mb-2"
                    }, [t._v(t._s(t.$t("VOLUME")))]), t._v(" "), e("span", {
                        staticClass: "ml-auto font-bold"
                    }, [t._v(" " + t._s(t.alarmVolume) + "% ")])]), t._v(" "), e("input", {
                        staticClass: "w-full accent-gray-800",
                        attrs: {
                            type: "range",
                            min: "0",
                            max: "100",
                            step: "10",
                            disabled: -1 === t.alarmOnCompletionIndex
                        },
                        domProps: {
                            value: t.alarmVolume
                        },
                        on: {
                            change: t.changeAlarmVolume
                        }
                    })]) : t._e(), t._v(" "), t.currentOption === t.options.autoStart ? e("div", [e("div", {
                        staticClass: "flex items-start px-8 mb-4"
                    }, [e("label", {
                        staticClass: "font-bold mr-4"
                    }, [t._v("\n              " + t._s(t.$t("AUTO_START_POMODOROS")) + "\n            ")]), t._v(" "), e("SwitchInput", {
                        staticClass: "ml-auto",
                        model: {
                            value: t.autoStartPomodoros,
                            callback: function(e) {
                                t.autoStartPomodoros = e
                            },
                            expression: "autoStartPomodoros"
                        }
                    })], 1), t._v(" "), e("div", {
                        staticClass: "flex items-start px-8 mb-4"
                    }, [e("label", {
                        staticClass: "font-bold mr-4"
                    }, [t._v("\n              " + t._s(t.$t("AUTO_START_BREAKS")) + "\n            ")]), t._v(" "), e("SwitchInput", {
                        staticClass: "ml-auto",
                        model: {
                            value: t.autoStartBreaks,
                            callback: function(e) {
                                t.autoStartBreaks = e
                            },
                            expression: "autoStartBreaks"
                        }
                    })], 1)]) : t._e(), t._v(" "), t.currentOption === t.options.notifications ? e("div", [e("div", {
                        staticClass: "py-3 px-8 mb-4"
                    }, [e("div", {
                        staticClass: "flex items-start"
                    }, [e("label", {
                        staticClass: "font-bold mr-4 flex-1"
                    }, [t._v("\n                " + t._s(t.$t("NOTIFY_ON_COMPLETION")) + "\n              ")]), t._v(" "), e("SwitchInput", {
                        staticClass: "ml-auto",
                        attrs: {
                            disabled: !t.isClientForNotify
                        },
                        model: {
                            value: t.notifyCompletion,
                            callback: function(e) {
                                t.notifyCompletion = e
                            },
                            expression: "notifyCompletion"
                        }
                    })], 1), t._v(" "), t.isClientForNotify ? t._e() : e("span", {
                        staticClass: "text-sm block mt-2 text-yellow-600"
                    }, [t._v("\n              " + t._s(t.$t("NOTIFICATIONS_AVAILABLE_FOR")) + "\n            ")]), t._v(" "), t.notifyCompletion && t.pushIsDenied ? e("span", {
                        staticClass: "text-sm block mt-2 text-yellow-600"
                    }, ["en" === t.$i18n.locale ? [t._v("\n                We want to show you notifications, however, the permission\n                that we need is locked,\n                "), e("a", {
                        staticClass: "underline hover:text-yellow-700",
                        attrs: {
                            href: "https://support.google.com/chrome/answer/3220216?hl=en&co=GENIE.Platform",
                            target: "_blank",
                            rel: "noopener"
                        }
                    }, [t._v("\n                  you can unlock it by following the steps\n                ")])] : "es" === t.$i18n.locale ? [t._v("\n                Queremos mostrarte notificaciones, sin embargo, el permiso que\n                necesitamos está bloqueado,\n                "), e("a", {
                        staticClass: "underline hover:text-yellow-700",
                        attrs: {
                            href: "https://support.google.com/chrome/answer/3220216?hl=es&co=GENIE.Platform",
                            target: "_blank",
                            rel: "noopener"
                        }
                    }, [t._v("\n                  puedes desbloquearlo siguiendo los siguientes pasos\n                ")])] : "pt" === t.$i18n.locale ? [t._v("\n                Queremos mostrar notificações, no entanto, a permissão que que\n                precisamos está bloqueado,\n                "), e("a", {
                        staticClass: "underline hover:text-yellow-700",
                        attrs: {
                            href: "https://support.google.com/chrome/answer/3220216?hl=pt&co=GENIE.Platform",
                            target: "_blank",
                            rel: "noopener"
                        }
                    }, [t._v("\n                  você pode desbloqueá-lo seguindo as etapas\n                ")])] : t._e()], 2) : t._e()])]) : t._e()])])])])
                }), [], !1, null, "6a0833d3", null);
            e.
            default = component.exports;
            installComponents(component, {
                SwitchInput: n(454).
                default
            })
        },
        479: function(t, e, n) {
            "use strict";
            n.r(e);
            n(14), n(13), n(16), n(6), n(27), n(15), n(28);
            var o = n(3),
                r = n(0),
                c = (n(31), n(33), n(32), n(416)),
                l = n.n(c),
                f = n(102);

            function d(t) {
                if (!window.__iconElement) {
                    var e = document.querySelectorAll('[rel="icon"], [rel="shortcut icon"]');
                    window.__iconElement = e[e.length - 1]
                }
                window.__iconElement.href = t
            }
            var m, v, h = n(20),
                _ = n(415);

            function w(object, t) {
                var e = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(object);
                    t && (n = n.filter((function(t) {
                        return Object.getOwnPropertyDescriptor(object, t).enumerable
                    }))), e.push.apply(e, n)
                }
                return e
            }
            function x(t) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? w(Object(source), !0).forEach((function(e) {
                        Object(r.a)(t, e, source[e])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(source)) : w(Object(source)).forEach((function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(source, e))
                    }))
                }
                return t
            }
            var y = (m = {}, Object(r.a)(m, h.e.BREAK, "TIME_FOR_A_BREAK"), Object(r.a)(m, h.e.LONG_BREAK, "TIME_FOR_A_LONG_BREAK"), m),
                O = (v = {}, Object(r.a)(v, h.e.POMODORO, "POMODORO_COMPLETED_NOTIFICATION_TITLE"), Object(r.a)(v, h.e.BREAK, "BREAK_COMPLETED_NOTIFICATION_TITLE"), Object(r.a)(v, h.e.LONG_BREAK, "BREAK_COMPLETED_NOTIFICATION_TITLE"), v),
                k = {
                    computed: x(x({}, Object(f.c)("timer", ["percentage", "counters", "type", "alarmVolume", "bgMusicVolume", "autoStartBreaks", "autoStartPomodoros", "isRunning", "notifyCompletion", "focusChallenge"])), {}, {
                        isClientForNotify: function() {
                            return this.$device.isDesktop && (this.$device.isChrome || this.$device.isSafari)
                        }
                    }),
                    created: function() {
                        this.messages = y, this.TIMERS = h.e, this.setupWorker()
                    },
                    methods: {
                        setupWorker: function() {
                            var t = this;
                            if (!window.__webworker__) {
                                var e = new Worker("webworker.js");
                                window.__webworker__ = e, e.onerror = function(e) {
                                    return t.$sentry && t.$sentry.captureException(e)
                                }, e.onmessage = function(e) {
                                    var data = e.data,
                                        n = "on".concat(data.event.charAt(0).toUpperCase() + data.event.slice(1));
                                    t[n](data.payload)
                                }
                            }
                        },
                        onWorkerLoaded: function() {
                            var t = this;
                            return Object(o.a)(regeneratorRuntime.mark((function e() {
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return e.next = 2, t.$storage.strategy.loadTimerScheme();
                                        case 2:
                                            return _.a.setVolume(t.alarmVolume), _.b.setVolume(t.bgMusicVolume), e.next = 6, t.$storage.strategy.loadTodoLists();
                                        case 6:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e)
                            })))()
                        },
                        onChangeCountdown: function(t) {
                            if (this.$store.state.timer.isRunning) {
                                this.$store.commit("timer/SET_COUNTDOWN", t.countdown), this.$store.commit("timer/SET_PERCENTAGE", t.percentage);
                                var e = this.$store.getters["timer/minutes"],
                                    n = this.$store.getters["timer/seconds"],
                                    o = this.$t(h.f[this.type]);
                                document.title = "".concat(e, ":").concat(n, " ").concat(o), d(t.iconUrl)
                            }
                        },
                        onComplete: function(t) {
                            var e = this;
                            return Object(o.a)(regeneratorRuntime.mark((function n() {
                                var o;
                                return regeneratorRuntime.wrap((function(n) {
                                    for (;;) switch (n.prev = n.next) {
                                        case 0:
                                            return o = t.type, n.next = 3, e.$store.dispatch("timer/stop");
                                        case 3:
                                            if (o !== h.e.POMODORO) {
                                                n.next = 11;
                                                break
                                            }
                                            return n.next = 6, e.$store.dispatch("timer/prepareBreak");
                                        case 6:
                                            if (!e.autoStartBreaks) {
                                                n.next = 9;
                                                break
                                            }
                                            return n.next = 9, e.$store.dispatch("timer/start");
                                        case 9:
                                            n.next = 16;
                                            break;
                                        case 11:
                                            return n.next = 13, e.$store.dispatch("timer/prepareStart", h.e.POMODORO);
                                        case 13:
                                            if (!e.autoStartPomodoros) {
                                                n.next = 16;
                                                break
                                            }
                                            return n.next = 16, e.$store.dispatch("timer/start");
                                        case 16:
                                            _.a.play(), e.notifyCompletion && e.isClientForNotify && (l.a.clear(), l.a.create(e.$t(O[o]), {
                                                onClick: function() {
                                                    window.focus(), this.close()
                                                },
                                                requireInteraction: !0
                                            }));
                                        case 18:
                                        case "end":
                                            return n.stop()
                                    }
                                }), n)
                            })))()
                        },
                        onStop: function() {
                            document.title = this.$t("PAGE_TITLE"), d(this.$icon(64))
                        },
                        onIncreaseTimerCounter: function(t) {
                            var e = t.type;
                            this.$storage.strategy.updateTimerCounter({
                                type: e,
                                value: this.counters[e] + 1
                            })
                        },
                        showFocusTime: function() {
                            var t = this;
                            return Object(o.a)(regeneratorRuntime.mark((function e() {
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return t.$store.commit("SET_MODAL", {
                                                name: "showMenu",
                                                value: !t.$store.state.modals.showMenu
                                            }), e.next = 3, t.$nextTick();
                                        case 3:
                                            document.getElementById("concentration-time").click();
                                        case 4:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e)
                            })))()
                        }
                    }
                }, C = (n(463), n(55)),
                component = Object(C.a)(k, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", [e("section", {
                        staticClass: "w-fit relative cursor-pointer hover:bg-gray-100/[0.08] active:bg-white/5 transition-colors rounded-3xl px-3 z-[2] -mt-10",
                        on: {
                            click: t.showFocusTime
                        }
                    }, [e("span", {
                        staticClass: "countdown font-semibold select-none",
                        staticStyle: {
                            "font-variant-numeric": "tabular-nums"
                        }
                    }, [e("span", {
                        staticClass: "countdown-font"
                    }, [t._v(t._s(t.$store.getters["timer/minutes"]))]), e("span", {
                        staticClass: "mx-1.5 font-normal"
                    }, [t._v(":")]), e("span", {
                        staticClass: "countdown-font"
                    }, [t._v(t._s(t.$store.getters["timer/seconds"]))])])]), t._v(" "), t.$store.state.activeBackground.isImage && t.$store.state.timer.type === t.TIMERS.POMODORO ? e("svg", {
                        staticClass: "absolute inset-0 pointer-events-none z-[1]",
                        attrs: {
                            width: "100%",
                            height: "100%",
                            xmlns: "http://www.w3.org/2000/svg",
                            overflow: "auto"
                        }
                    }, [e("filter", {
                        attrs: {
                            id: "blurMe",
                            height: "200%",
                            width: "200%",
                            x: "-50%",
                            y: "-50%"
                        }
                    }, [e("feGaussianBlur", {
                        attrs: {
                            stdDeviation: "50"
                        }
                    })], 1), t._v(" "), e("ellipse", {
                        attrs: {
                            cx: "50%",
                            cy: "46%",
                            rx: "25%",
                            ry: "11%",
                            fill: "#00000022",
                            filter: "url(#blurMe)"
                        }
                    })]) : t._e()])
                }), [], !1, null, null, null);
            e.
            default = component.exports
        },
        480: function(t, e, n) {
            "use strict";
            n.r(e);
            n(26);
            var o = n(3),
                r = (n(51), n(31), [8, 9, 37, 38, 39, 40]),
                c = {
                    data: function() {
                        return {
                            touched: !1,
                            editable: !1
                        }
                    },
                    methods: {
                        edit: function() {
                            var t = this;
                            return Object(o.a)(regeneratorRuntime.mark((function e() {
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return t.editable = !0, e.next = 3, t.$nextTick();
                                        case 3:
                                            t.$refs.input.focus();
                                        case 4:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e)
                            })))()
                        },
                        save: function(t) {
                            if (this.editable = !1, this.touched) {
                                var e = t.target.innerText;
                                if (e) return this.$storage.strategy.updateUsername(e);
                                t.target.innerText = this.$store.state.user.name
                            }
                        },
                        controlLenght: function(t) {
                            t.target.innerText.length > 20 && !r.includes(t.keyCode) && t.preventDefault()
                        },
                        blur: function() {
                            this.$refs.input.blur()
                        }
                    }
                }, l = (n(456), n(55)),
                component = Object(l.a)(c, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "username-container relative pr-10"
                    }, [t.editable ? t._e() : e("button", {
                        staticClass: "edit-button hidden absolute right-0 top-1.5 lg:top-2 px-2 py-1 bg-black rounded-xl",
                        attrs: {
                            type: "button"
                        },
                        on: {
                            click: t.edit
                        }
                    }, [e("fa-icon", {
                        attrs: {
                            icon: "pen"
                        }
                    })], 1), t._v(" "), e("span", {
                        ref: "input",
                        staticClass: "username inline-block font-black tracking-tight cursor-default px-2 focus:outline-none border-b border-transparent focus:border-white",
                        attrs: {
                            role: "textbox",
                            contenteditable: !! t.editable && "plaintext-only",
                            spellcheck: "false"
                        },
                        on: {
                            input: function(e) {
                                t.touched = !0
                            },
                            blur: t.save,
                            keydown: [function(e) {
                                return !e.type.indexOf("key") && t._k(e.keyCode, "enter", 13, e.key, "Enter") ? null : (e.preventDefault(), t.blur.apply(null, arguments))
                            },
                            t.controlLenght],
                            paste: function(t) {
                                t.preventDefault()
                            }
                        }
                    }, [t._v(t._s(t.$store.state.user.name))])])
                }), [], !1, null, "a3a668b6", null);
            e.
            default = component.exports
        },
        481: function(t, e, n) {
            "use strict";
            n.r(e);
            n(14), n(13), n(16), n(6), n(27), n(15), n(28);
            var o = n(0),
                r = n(20),
                c = n(102);

            function l(object, t) {
                var e = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(object);
                    t && (n = n.filter((function(t) {
                        return Object.getOwnPropertyDescriptor(object, t).enumerable
                    }))), e.push.apply(e, n)
                }
                return e
            }
            var f = {
                data: function() {
                    return {
                        showMenu: !1
                    }
                },
                computed: function(t) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = null != arguments[i] ? arguments[i] : {};
                        i % 2 ? l(Object(source), !0).forEach((function(e) {
                            Object(o.a)(t, e, source[e])
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(source)) : l(Object(source)).forEach((function(e) {
                            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(source, e))
                        }))
                    }
                    return t
                }({}, Object(c.c)(["activeBackground"])),
                created: function() {
                    this.TIMERS = r.e
                },
                methods: {
                    changeType: function(t) {
                        this.$store.state.timer.isRunning || this.$store.dispatch("timer/prepareStart", t)
                    }
                }
            }, d = f,
                m = (n(458), n(55)),
                component = Object(m.a)(d, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "counters flex md:gap-x-px lowercase whitespace-nowrap",
                        class: {
                            "shadow-border": t.activeBackground.isImage && t.$store.state.timer.type === t.TIMERS.POMODORO
                        }
                    }, [e("div", [e("span", {
                        staticClass: "counter-item",
                        class: {
                            "active-type": t.$store.state.timer.type === t.TIMERS.POMODORO
                        },
                        on: {
                            click: function(e) {
                                return t.changeType(t.TIMERS.POMODORO)
                            }
                        }
                    }, [e("strong", {
                        class: {
                            "animate-counter": t.$store.state.timer.resettingCounters
                        }
                    }, [t._v("\n        " + t._s(t.$store.state.timer.counters[t.TIMERS.POMODORO]) + "\n      ")]), t._v(" "), e("span", {
                        staticClass: "font-semibold inline-block ml-1"
                    }, [t._v(" pomodoros ")])])]), t._v(" "), e("div", [e("span", {
                        staticClass: "counter-item",
                        class: {
                            "active-type": t.$store.state.timer.type === t.TIMERS.BREAK
                        },
                        on: {
                            click: function(e) {
                                return t.changeType(t.TIMERS.BREAK)
                            }
                        }
                    }, [e("strong", {
                        class: {
                            "animate-counter": t.$store.state.timer.resettingCounters
                        }
                    }, [t._v("\n        " + t._s(t.$store.state.timer.counters[t.TIMERS.BREAK]) + "\n      ")]), t._v(" "), e("span", {
                        staticClass: "font-semibold inline-block ml-1"
                    }, [t._v(t._s(t.$t("BREAKS")))])])]), t._v(" "), e("div", [e("span", {
                        staticClass: "counter-item",
                        class: {
                            "active-type": t.$store.state.timer.type === t.TIMERS.LONG_BREAK
                        },
                        on: {
                            click: function(e) {
                                return t.changeType(t.TIMERS.LONG_BREAK)
                            }
                        }
                    }, [e("strong", {
                        class: {
                            "animate-counter": t.$store.state.timer.resettingCounters
                        }
                    }, [t._v("\n        " + t._s(t.$store.state.timer.counters[t.TIMERS.LONG_BREAK]) + "\n      ")]), t._v(" "), e("span", {
                        staticClass: "font-semibold inline-block ml-1"
                    }, [t._v(t._s(t.$t("LONG_BREAKS")))])])]), t._v(" "), e("div", {
                        staticClass: "absolute left-full top-0 ml-1 md:ml-4 text-base"
                    }, [e("button", {
                        staticClass: "menu-button px-2 py-1 bg-black rounded-xl",
                        class: [t.showMenu ? "visible" : "invisible"],
                        attrs: {
                            type: "button"
                        },
                        on: {
                            click: function(e) {
                                t.showMenu = !t.showMenu
                            }
                        }
                    }, [e("fa-icon", {
                        attrs: {
                            icon: "ellipsis-h"
                        }
                    })], 1), t._v(" "), e("transition", {
                        attrs: {
                            "enter-active-class": "transition ease-out duration-75",
                            "enter-class": "transform opacity-0 scale-95",
                            "enter-to-class": "transform opacity-100 scale-100",
                            "leave-active-class": "transition ease-in duration-75",
                            "leave-class": "transform opacity-100 scale-100",
                            "leave-to-class": "transform opacity-0 scale-95"
                        }
                    }, [t.showMenu ? e("Dropdown", {
                        staticClass: "right-0 whitespace-nowrap",
                        on: {
                            close: function(e) {
                                t.showMenu = !1
                            }
                        }
                    }, [e("div", {
                        staticClass: "w-auto transition-transform duration-75"
                    }, [e("div", {}, [e("button", {
                        staticClass: "flex py-3 px-4 font-semibold w-full hover:bg-gray-100/80 text-left rounded-md",
                        on: {
                            click: function(e) {
                                t.$store.commit("SET_MODAL", {
                                    name: "showMenu",
                                    value: !1
                                }), t.$store.commit("SET_MODAL", {
                                    name: "showResetCounters",
                                    value: !0
                                })
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "mr-3 mt-1 opacity-70 pointer-events-none",
                        attrs: {
                            icon: "redo-alt"
                        }
                    }), t._v("\n              " + t._s(t.$t("RESET_COUNTERS")) + "\n            ")], 1)])])]) : t._e()], 1)], 1)])
                }), [], !1, null, null, null);
            e.
            default = component.exports;
            installComponents(component, {
                Dropdown: n(418).
                default
            })
        },
        482: function(t, e, n) {
            "use strict";
            n.r(e);
            n(26), n(14), n(13), n(16), n(6), n(27), n(15), n(28);
            var o = n(3),
                r = n(0),
                c = (n(31), n(84), n(260), n(51), n(22), n(68), n(33), n(102)),
                l = n(20);

            function f(object, t) {
                var e = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(object);
                    t && (n = n.filter((function(t) {
                        return Object.getOwnPropertyDescriptor(object, t).enumerable
                    }))), e.push.apply(e, n)
                }
                return e
            }
            function d(t) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? f(Object(source), !0).forEach((function(e) {
                        Object(r.a)(t, e, source[e])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(source)) : f(Object(source)).forEach((function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(source, e))
                    }))
                }
                return t
            }
            var m = [8, 9, 37, 38, 39, 40],
                v = {
                    data: function() {
                        return {
                            greet: !0,
                            showMenu: !1,
                            fadeIn: !0,
                            showForm: !1,
                            touched: !1
                        }
                    },
                    created: function() {
                        this.TIMERS = l.e
                    },
                    mounted: function() {
                        var t = this;
                        setTimeout((function() {
                            t.fadeIn = !0, t.greet = !1
                        }), 4e3)
                    },
                    computed: d(d(d({}, Object(c.c)(["activeBackground"])), Object(c.c)("mantras", ["custom"])), {}, {
                        timeGreeting: function() {
                            var t = (new Date).getHours();
                            return t < 12 ? this.$t("GOOD_MORNING") : t < 18 ? this.$t("GOOD_AFTERNOON") : this.$t("GOOD_EVENING")
                        },
                        mantraText: function() {
                            var t;
                            return this.custom || (null === (t = this.$store.getters["mantras/mantra"]) || void 0 === t ? void 0 : t[this.$i18n.locale])
                        }
                    }),
                    methods: {
                        removeCustomMantra: function() {
                            var t = this;
                            this.fadeIn = !1, setTimeout((function() {
                                t.fadeIn = !0, t.$storage.strategy.removeCustomMantra()
                            }), 100), this.showMenu = !1
                        },
                        enableForm: function() {
                            var t = this;
                            return Object(o.a)(regeneratorRuntime.mark((function e() {
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return t.showForm = !0, e.next = 3, t.$nextTick();
                                        case 3:
                                            t.$refs.mantraInput.focus();
                                        case 4:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e)
                            })))()
                        },
                        save: function(t) {
                            var e = this;
                            return Object(o.a)(regeneratorRuntime.mark((function n() {
                                var o;
                                return regeneratorRuntime.wrap((function(n) {
                                    for (;;) switch (n.prev = n.next) {
                                        case 0:
                                            if (e.touched) {
                                                n.next = 4;
                                                break
                                            }
                                            return e.showMenu = !1, e.showForm = !1, n.abrupt("return");
                                        case 4:
                                            if (!(o = t.target.innerText.trim())) {
                                                n.next = 10;
                                                break
                                            }
                                            return e.$storage.strategy.updateCustomMantra(o), e.showMenu = !1, e.showForm = !1, n.abrupt("return");
                                        case 10:
                                            e.$refs.mantraInput.focus();
                                        case 11:
                                        case "end":
                                            return n.stop()
                                    }
                                }), n)
                            })))()
                        },
                        controlLenght: function(t) {
                            t.target.innerText.length > 280 && !m.includes(t.keyCode) && t.preventDefault()
                        },
                        normalizePaste: function(t) {
                            var text = t.clipboardData.getData("text/plain").replace(/\s+/g, " ").trim();
                            text.length > 280 && (text = text.slice(0, 280)), t.target.innerText = text, this.touched = !0
                        },
                        blur: function() {
                            this.$refs.mantraInput.blur()
                        }
                    }
                }, h = (n(465), n(55)),
                component = Object(h.a)(v, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "top-full left-0 right-0 mt-10 text-center tracking-tight font-semibold"
                    }, [t.greet ? e("span", {
                        staticClass: "absolute top-full left-0 w-full text-4xl fade-out",
                        class: {
                            "shadow-border": t.activeBackground.isImage && t.$store.state.timer.type === t.TIMERS.POMODORO
                        }
                    }, [t._v(t._s(t.timeGreeting) + ", " + t._s(t.$store.state.user.name) + ".")]) : e("div", {
                        staticClass: "mantra-container relative"
                    }, [e("span", {
                        staticClass: "absolute top-full left-0 w-full hover:bg-gray-100/[0.08] rounded-2xl px-4 py-6 cursor-default"
                    }, [t.showForm ? e("span", {
                        ref: "mantraInput",
                        staticClass: "px-2 inline-block text-2xl font-bold max-w-full focus:outline-none border-b border-transparent focus:border-white",
                        attrs: {
                            id: "mantra-input",
                            role: "textbox",
                            contenteditable: "plaintext-only",
                            spellcheck: "true",
                            maxlength: "280"
                        },
                        on: {
                            input: function(e) {
                                t.touched = !0
                            },
                            blur: t.save,
                            keydown: [function(e) {
                                return !e.type.indexOf("key") && t._k(e.keyCode, "enter", 13, e.key, "Enter") ? null : (e.preventDefault(), t.blur.apply(null, arguments))
                            },
                            t.controlLenght],
                            paste: function(e) {
                                return e.preventDefault(), t.normalizePaste.apply(null, arguments)
                            }
                        }
                    }, [t._v(t._s(t.custom || t.$t("WRITE_YOUR_MANTRA")))]) : [e("div", {
                        staticClass: "absolute left-full top-0"
                    }, [e("button", {
                        staticClass: "menu-button px-2 py-1 bg-black rounded-xl",
                        class: [t.showMenu ? "visible" : "invisible"],
                        attrs: {
                            type: "button"
                        },
                        on: {
                            click: function(e) {
                                t.showMenu = !t.showMenu
                            }
                        }
                    }, [e("fa-icon", {
                        attrs: {
                            icon: "ellipsis-h"
                        }
                    })], 1), t._v(" "), e("transition", {
                        attrs: {
                            "enter-active-class": "transition ease-out duration-75",
                            "enter-class": "transform opacity-0 scale-95",
                            "enter-to-class": "transform opacity-100 scale-100",
                            "leave-active-class": "transition ease-in duration-75",
                            "leave-class": "transform opacity-100 scale-100",
                            "leave-to-class": "transform opacity-0 scale-95"
                        }
                    }, [t.showMenu ? e("Dropdown", {
                        staticClass: "right-0 text whitespace-nowrap",
                        on: {
                            close: function(e) {
                                t.showMenu = !1
                            }
                        }
                    }, [e("div", {
                        staticClass: "w-auto transition-transform duration-75"
                    }, [e("div", {}, [e("button", {
                        staticClass: "block py-3 px-4 font-semibold w-full hover:bg-gray-100/80 text-left rounded-md",
                        on: {
                            click: t.enableForm
                        }
                    }, [e("fa-icon", {
                        staticClass: "inline-block w-8 opacity-70 pointer-events-none",
                        attrs: {
                            icon: "pen"
                        }
                    }), t._v("\n                    " + t._s(t.$t("PERSONALIZED_MANTRA")) + "\n                  ")], 1), t._v(" "), t.$store.state.mantras.custom ? e("button", {
                        staticClass: "block py-3 px-4 font-semibold w-full hover:bg-gray-100/80 text-left rounded-md",
                        on: {
                            click: t.removeCustomMantra
                        }
                    }, [e("fa-icon", {
                        staticClass: "inline-block w-8 opacity-70 pointer-events-none",
                        attrs: {
                            icon: "trash"
                        }
                    }), t._v("\n                    " + t._s(t.$t("REMOVE_PERSONALIZED_MANTRA")) + "\n                  ")], 1) : t._e()])])]) : t._e()], 1)], 1), t._v(" "), e("strong", {
                        staticClass: "text-2xl font-bold",
                        class: {
                            "fade-in": t.fadeIn,
                            "shadow-border": t.activeBackground.isImage && t.$store.state.timer.type === t.TIMERS.POMODORO
                        }
                    }, [t._v("“" + t._s(t.mantraText) + "”.")])]], 2)])])
                }), [], !1, null, "2a3d0756", null);
            e.
            default = component.exports;
            installComponents(component, {
                Dropdown: n(418).
                default
            })
        },
        483: function(t, e, n) {
            "use strict";
            n.r(e);
            n(14), n(13), n(16), n(6), n(27), n(15), n(28);
            var o, r = n(0),
                c = n(193),
                l = n.n(c),
                f = n(102),
                d = n(20);

            function m(object, t) {
                var e = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(object);
                    t && (n = n.filter((function(t) {
                        return Object.getOwnPropertyDescriptor(object, t).enumerable
                    }))), e.push.apply(e, n)
                }
                return e
            }
            var v = l.a.directive,
                h = v.bind,
                _ = v.unbind,
                w = (o = {}, Object(r.a)(o, d.a.WITH_FRIENDS, "user-friends"), Object(r.a)(o, d.a.MUSIC, "music"), Object(r.a)(o, d.a.TODO_LISTS, "tasks"), Object(r.a)(o, d.a.STATS, "chart-pie"), o),
                x = {
                    computed: function(t) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = null != arguments[i] ? arguments[i] : {};
                            i % 2 ? m(Object(source), !0).forEach((function(e) {
                                Object(r.a)(t, e, source[e])
                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(source)) : m(Object(source)).forEach((function(e) {
                                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(source, e))
                            }))
                        }
                        return t
                    }({}, Object(f.c)(["activeOption"])),
                    created: function() {
                        this.ICONS = w, this.CONTROLS = d.a
                    },
                    watch: {
                        "$store.state.modals.showOption": "toggleListeners"
                    },
                    methods: {
                        toggleListeners: function(t) {
                            t ? h(this.$refs.vClickOutsideTarget, {
                                value: this.onOutsideClick
                            }) : _(this.$refs.vClickOutsideTarget)
                        },
                        onOutsideClick: function() {
                            this.$store.dispatch("closeDetailModal")
                        }
                    }
                }, y = x,
                O = (n(467), n(55)),
                component = Object(O.a)(y, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", [e("transition", {
                        attrs: {
                            "enter-active-class": "transition ease-out duration-150",
                            "enter-class": "transform opacity-0 scale-95",
                            "enter-to-class": "transform opacity-100 scale-100",
                            "leave-active-class": "transition ease-in duration-100",
                            "leave-class": "transform opacity-100 scale-100",
                            "leave-to-class": "transform opacity-0 scale-95"
                        }
                    }, [e("div", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: t.$store.state.modals.showOption,
                            expression: "$store.state.modals.showOption"
                        }],
                        staticClass: "origin-bottom absolute bottom-0 right-0 left-0 z-20"
                    }, [e("div", {
                        ref: "vClickOutsideTarget",
                        staticClass: "mx-auto max-w-4xl rounded-t-3xl bg-white text-gray-900 top-shadow"
                    }, [e("div", {
                        staticClass: "flex mb-4 pt-10 px-4 sm:px-10"
                    }, [e("div", [t.activeOption ? e("fa-icon", {
                        staticClass: "text-2xl xl:text-[1.5vw] mr-2",
                        attrs: {
                            icon: t.ICONS[t.activeOption]
                        }
                    }) : t._e(), t._v(" "), e("span", {
                        staticClass: "font-semibold text-2xl xl:text-[1.5vw]"
                    }, [t._v("\n              " + t._s(t.$t(t.activeOption)) + "\n            ")])], 1), t._v(" "), e("div", {
                        staticClass: "ml-auto"
                    }, [e("button", {
                        staticClass: "px-2",
                        on: {
                            click: function(e) {
                                return t.$store.dispatch("closeDetailModal")
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-2xl xl:text-[1.5vw]",
                        attrs: {
                            icon: "times"
                        }
                    })], 1)])]), t._v(" "), e("MusicPlayer", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: t.activeOption === t.CONTROLS.MUSIC,
                            expression: "activeOption === CONTROLS.MUSIC"
                        }],
                        attrs: {
                            active: t.activeOption === t.CONTROLS.MUSIC
                        }
                    }), t._v(" "), t.activeOption === t.CONTROLS.TODO_LISTS ? e("TodoLists") : t._e()], 1)])])], 1)
                }), [], !1, null, "66cb269f", null);
            e.
            default = component.exports;
            installComponents(component, {
                MusicPlayer: n(484).
                default,
                TodoLists: n(485).
                default
            })
        },
        489: function(t, e, n) {
            "use strict";
            n.r(e);
            n(14), n(13), n(16), n(6), n(27), n(15), n(28);
            var o = n(3),
                r = n(0),
                c = (n(31), n(102)),
                l = n(20),
                f = n(415);

            function d(object, t) {
                var e = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(object);
                    t && (n = n.filter((function(t) {
                        return Object.getOwnPropertyDescriptor(object, t).enumerable
                    }))), e.push.apply(e, n)
                }
                return e
            }
            var m = {
                computed: function(t) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = null != arguments[i] ? arguments[i] : {};
                        i % 2 ? d(Object(source), !0).forEach((function(e) {
                            Object(r.a)(t, e, source[e])
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(source)) : d(Object(source)).forEach((function(e) {
                            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(source, e))
                        }))
                    }
                    return t
                }({}, Object(c.c)("timer", ["type", "alarmVolume"])),
                created: function() {
                    this.CONTROLS = l.a
                },
                methods: {
                    start: function() {
                        var t = this;
                        return Object(o.a)(regeneratorRuntime.mark((function e() {
                            return regeneratorRuntime.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, t.$store.dispatch("timer/prepareStart", t.type);
                                    case 2:
                                        return e.next = 4, t.$store.dispatch("timer/start");
                                    case 4:
                                        f.a.loadTrack();
                                    case 5:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))()
                    }
                }
            }, v = m,
                h = (n(471), n(55)),
                component = Object(h.a)(v, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "relative bg-black/30 sm:bg-transparent sm:w-fit sm:mx-auto flex items-center sm:gap-x-2 sm:pb-5"
                    }, [e("button", {
                        staticClass: "item-control scale-on-active tooltip top sm:w-20 h-20 xl:w-[5vw] xl:h-[5vw]",
                        attrs: {
                            "data-tooltip": t.$t("MUSIC")
                        },
                        on: {
                            click: function(e) {
                                return t.$store.dispatch("openDetailModal", t.CONTROLS.MUSIC)
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-2xl xl:text-[1.5vw]",
                        attrs: {
                            icon: "music"
                        }
                    })], 1), t._v(" "), e("button", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: t.$store.state.timer.isRunning,
                            expression: "$store.state.timer.isRunning"
                        }],
                        staticClass: "shadow-borders item-control scale-on-active sm:w-24 h-20 sm:h-24 xl:w-[8vw] xl:h-[8vw] font-black text-lg",
                        on: {
                            click: function(e) {
                                return t.$store.dispatch("timer/stop")
                            }
                        }
                    }, [t._v("\n    STOP\n  ")]), t._v(" "), e("button", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: !t.$store.state.timer.isRunning,
                            expression: "!$store.state.timer.isRunning"
                        }],
                        staticClass: "shadow-borders item-control scale-on-active sm:w-24 h-20 sm:h-24 xl:w-[8vw] xl:h-[8vw] font-black text-lg",
                        on: {
                            click: t.start
                        }
                    }, [t._v("\n    START\n  ")]), t._v(" "), e("button", {
                        staticClass: "item-control scale-on-active tooltip top sm:w-20 h-20 xl:w-[5vw] xl:h-[5vw]",
                        attrs: {
                            "data-tooltip": t.$t("TODO_LISTS")
                        },
                        on: {
                            click: function(e) {
                                return t.$store.dispatch("openDetailModal", t.CONTROLS.TODO_LISTS)
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-2xl xl:text-[1.5vw]",
                        attrs: {
                            icon: "tasks"
                        }
                    })], 1)])
                }), [], !1, null, "467e2b78", null);
            e.
            default = component.exports
        },
        490: function(t, e, n) {
            "use strict";
            n.r(e);
            n(84);
            var o = n(20),
                r = {
                    methods: {
                        reset: function() {
                            var t = this;
                            for (var e in this.$store.commit("timer/SET_RESETTING_COUNTERS", !0), setTimeout((function() {
                                t.$store.commit("timer/SET_RESETTING_COUNTERS", !1)
                            }), 1e3), o.e) this.$storage.strategy.updateTimerCounter({
                                type: o.e[e],
                                value: 0
                            });
                            this.$emit("close")
                        }
                    }
                }, c = n(55),
                component = Object(c.a)(r, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "origin-center fixed inset-0 bg-gray-900/50 flex justify-center z-20",
                        on: {
                            click: function(e) {
                                return e.target !== e.currentTarget ? null : t.$emit("close")
                            }
                        }
                    }, [e("div", {
                        staticClass: "absolute top-8 w-full md:w-[calc(3*theme(spacing.56))] flex flex-col rounded-xl shadow mx-auto bg-white z-30 py-6 text-gray-900"
                    }, [e("div", {
                        staticClass: "flex justify-between items-center px-4 sm:px-6 md:px-10"
                    }, [e("strong", {
                        staticClass: "text-2xl"
                    }, [t._v(" " + t._s(t.$t("RESET_COUNTERS")) + " ")]), t._v(" "), e("button", {
                        staticClass: "px-2",
                        on: {
                            click: function(e) {
                                return t.$emit("close")
                            }
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-4xl",
                        attrs: {
                            icon: "times"
                        }
                    })], 1)]), t._v(" "), e("div", {
                        staticClass: "px-4 sm:px-6 md:px-10 my-6"
                    }, [e("p", {
                        staticClass: "text-xl mb-2"
                    }, [t._v("\n        " + t._s(t.$t("RESET_COUNTERS_CONFIRM")) + "\n      ")])]), t._v(" "), e("div", {
                        staticClass: "px-4 sm:px-6 md:px-10 text-right"
                    }, [e("button", {
                        staticClass: "px-4 py-2 rounded-lg bg-gray-100 font-bold mr-2",
                        on: {
                            click: function(e) {
                                return t.$emit("close")
                            }
                        }
                    }, [t._v("\n        " + t._s(t.$t("CANCEL")) + "\n      ")]), t._v(" "), e("button", {
                        staticClass: "px-4 py-2 rounded-lg bg-green-200 text-green-700 font-bold",
                        on: {
                            click: t.reset
                        }
                    }, [t._v("\n        " + t._s(t.$t("RESET_COUNTERS")) + "\n      ")])])])])
                }), [], !1, null, "b5133cc4", null);
            e.
            default = component.exports
        },
        491: function(t, e, n) {
            "use strict";
            n.r(e);
            n(26), n(260);
            var o = {
                data: function() {
                    return {
                        name: ""
                    }
                },
                created: function() {
                    0
                },
                methods: {
                    save: function() {
                        if (!this.name) return this.$refs.name.focus();
                        this.$storage.strategy.updateUsername(this.name)
                    }
                }
            }, r = n(55),
                component = Object(r.a)(o, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "origin-center bg-white absolute left-0 top-0 right-0 z-10 text-gray-900 flex items-center justify-center",
                        staticStyle: {
                            bottom: "0.5px"
                        }
                    }, [e("form", {
                        on: {
                            submit: function(e) {
                                return e.preventDefault(), t.save.apply(null, arguments)
                            }
                        }
                    }, [e("div", {
                        staticClass: "text-4xl block mb-8 tracking-tight word-spacing font-medium px-2"
                    }, [e("div", {
                        staticClass: "text-center"
                    }, [t._v("\n        " + t._s(t.$t("FIRST_GREETING")) + "\n        "), e("span", {
                        staticClass: "inline-block w-8 h-8"
                    }, [e("svg", {
                        staticClass: "w-full",
                        attrs: {
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 36 36"
                        }
                    }, [e("path", {
                        attrs: {
                            fill: "#EF9645",
                            d: "M4.861 9.147c.94-.657 2.357-.531 3.201.166l-.968-1.407c-.779-1.111-.5-2.313.612-3.093 1.112-.777 4.263 1.312 4.263 1.312-.786-1.122-.639-2.544.483-3.331 1.122-.784 2.67-.513 3.456.611l10.42 14.72L25 31l-11.083-4.042L4.25 12.625c-.793-1.129-.519-2.686.611-3.478z"
                        }
                    }), t._v(" "), e("path", {
                        attrs: {
                            fill: "#FFDC5D",
                            d: "M2.695 17.336s-1.132-1.65.519-2.781c1.649-1.131 2.78.518 2.78.518l5.251 7.658c.181-.302.379-.6.6-.894L4.557 11.21s-1.131-1.649.519-2.78c1.649-1.131 2.78.518 2.78.518l6.855 9.997c.255-.208.516-.417.785-.622L7.549 6.732s-1.131-1.649.519-2.78c1.649-1.131 2.78.518 2.78.518l7.947 11.589c.292-.179.581-.334.871-.498L12.238 4.729s-1.131-1.649.518-2.78c1.649-1.131 2.78.518 2.78.518l7.854 11.454 1.194 1.742c-4.948 3.394-5.419 9.779-2.592 13.902.565.825 1.39.26 1.39.26-3.393-4.949-2.357-10.51 2.592-13.903L24.515 8.62s-.545-1.924 1.378-2.47c1.924-.545 2.47 1.379 2.47 1.379l1.685 5.004c.668 1.984 1.379 3.961 2.32 5.831 2.657 5.28 1.07 11.842-3.94 15.279-5.465 3.747-12.936 2.354-16.684-3.11L2.695 17.336z"
                        }
                    }), t._v(" "), e("g", {
                        attrs: {
                            fill: "#5DADEC"
                        }
                    }, [e("path", {
                        attrs: {
                            d: "M12 32.042C8 32.042 3.958 28 3.958 24c0-.553-.405-1-.958-1s-1.042.447-1.042 1C1.958 30 6 34.042 12 34.042c.553 0 1-.489 1-1.042s-.447-.958-1-.958z"
                        }
                    }), t._v(" "), e("path", {
                        attrs: {
                            d: "M7 34c-3 0-5-2-5-5 0-.553-.447-1-1-1s-1 .447-1 1c0 4 3 7 7 7 .553 0 1-.447 1-1s-.447-1-1-1zM24 2c-.552 0-1 .448-1 1s.448 1 1 1c4 0 8 3.589 8 8 0 .552.448 1 1 1s1-.448 1-1c0-5.514-4-10-10-10z"
                        }
                    }), t._v(" "), e("path", {
                        attrs: {
                            d: "M29 .042c-.552 0-1 .406-1 .958s.448 1.042 1 1.042c3 0 4.958 2.225 4.958 4.958 0 .552.489 1 1.042 1s.958-.448.958-1C35.958 3.163 33 .042 29 .042z"
                        }
                    })])])])])]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model.trim",
                            value: t.name,
                            expression: "name",
                            modifiers: {
                                trim: !0
                            }
                        }],
                        ref: "name",
                        staticClass: "border-b-2 text-4xl block w-full text-center focus:outline-none focus:border-gray-700 font-medium py-1 px-2 mb-8",
                        attrs: {
                            type: "text",
                            name: "name",
                            autocomplete: "given-name",
                            placeholder: t.$t("WHAT_IS_YOUR_NAME")
                        },
                        domProps: {
                            value: t.name
                        },
                        on: {
                            input: function(e) {
                                e.target.composing || (t.name = e.target.value.trim())
                            },
                            blur: function(e) {
                                return t.$forceUpdate()
                            }
                        }
                    }), t._v(" "), e("div", {
                        staticClass: "text-center"
                    }, [e("button", {
                        staticClass: "bg-gray-700 hover:bg-gray-900 text-white rounded-full w-16 h-16 font-medium inline-flex justify-center items-center",
                        attrs: {
                            type: "submit"
                        }
                    }, [e("fa-icon", {
                        staticClass: "text-3xl",
                        attrs: {
                            icon: "arrow-right"
                        }
                    })], 1)])]), t._v(" "), t._m(0)])
                }), [function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "absolute left-0 bottom-0 hidden lg:block text-sm opacity-80 px-10 pb-10"
                    }, [t._v("\n    PomodoroTimer.online\n    "), e("span", {
                        staticClass: "bg-black text-white rounded-md px-1.5 py-px text-xs"
                    }, [t._v("\n      Beta\n    ")])])
                }], !1, null, "68d9178b", null);
            e.
            default = component.exports
        },
        493: function(t, e, n) {
            t.exports = n.p + "img/discord.532d75d.png"
        },
        494: function(t, e, n) {
            "use strict";
            n(473)
        },
        495: function(t, e, n) {
            var o = n(123)((function(i) {
                return i[1]
            }));
            o.push([t.i, "#background-image{position:fixed;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;z-index:-1;pointer-events:none}.overlay{background:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.break-background{background:#3bb78f;background:radial-gradient(circle,#3bb78f 0,#24b8b4 100%)}", ""]), o.locals = {}, t.exports = o
        },
        521: function(t, e, n) {
            "use strict";
            n.r(e);
            n(26);
            var o = [function() {
                var t = this,
                    e = t._self._c;
                return e("", {
                    staticClass: "absolute left-0 bottom-0 hidden lg:block opacity-80 px-10 pb-10"
                }, [e("span", {
                    staticClass: "text-xs inline-block ml-1 align-middle"
                }, [t._v("\n        PomodoroTimer.online\n      ")]), t._v(" "), e("span", {
                    staticClass: "bg-gray-900/95 text-white rounded-md px-1 text-xs inline-block align-middle"
                }, [t._v("\n        Beta\n      ")]), t._v(" "), e("div", [e("a", {
                    attrs: {
                        href: "https://discord.gg/ed7mBXKwZd",
                        target: "_blank",
                        rel: "noopener"
                    }
                }, [e("img", {
                    staticClass: "w-44",
                    attrs: {
                        src: n(493),
                        alt: "Discord"
                    }
                })])])])
            }],
                r = (n(14), n(13), n(16), n(6), n(27), n(15), n(28), n(3)),
                c = n(0),
                l = (n(31), n(194), n(102)),
                f = n(20);

            function d(object, t) {
                var e = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(object);
                    t && (n = n.filter((function(t) {
                        return Object.getOwnPropertyDescriptor(object, t).enumerable
                    }))), e.push.apply(e, n)
                }
                return e
            }
            function m(t) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? d(Object(source), !0).forEach((function(e) {
                        Object(c.a)(t, e, source[e])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(source)) : d(Object(source)).forEach((function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(source, e))
                    }))
                }
                return t
            }
            var v = {
                middleware: ["initial-data"],
                head: function() {
                    return {
                        title: this.$t("PAGE_TITLE")
                    }
                },
                computed: m(m({}, Object(l.c)(["activeBackground"])), {}, {
                    isBreak: function() {
                        return this.$store.state.timer.type !== f.e.POMODORO
                    },
                    styles: function() {
                        return this.isBreak || this.activeBackground.isImage ? "" : this.activeBackground.styles
                    }
                }),
                created: function() {
                    window.fallback = this.fallback
                },
                methods: {
                    fallback: function() {
                        var t = this;
                        return Object(r.a)(regeneratorRuntime.mark((function e() {
                            var n;
                            return regeneratorRuntime.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, t.$nextTick();
                                    case 2:
                                        n = f.g[f.g.findIndex((function(t) {
                                            return t.isImage
                                        }))], t.$refs.backgroundImage.src = n.image;
                                    case 4:
                                    case "end":
                                        return e.stop()
                                }
                            }), e)
                        })))()
                    }
                }
            }, h = (n(494), n(55)),
                component = Object(h.a)(v, (function() {
                    var t = this,
                        e = t._self._c;
                    return e("div", {
                        staticClass: "absolute inset-0 flex flex-col antialiased text-white pt-4 sm:pt-6 md:pt-10",
                        class: {
                            "is-running": t.$store.state.timer.isRunning,
                            "break-background": t.isBreak,
                            overlay: !t.isBreak
                        },
                        style: t.styles
                    }, [e("img", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: !t.isBreak,
                            expression: "!isBreak"
                        }],
                        ref: "backgroundImage",
                        attrs: {
                            id: "background-image",
                            src: t.activeBackground.image,
                            onerror: "fallback()"
                        }
                    }), t._v(" "), e("header", {
                        staticClass: "flex items-center justify-between z-10 px-2 sm:px-6 md:px-10"
                    }, [e("Username"), t._v(" "), e("div", {
                        staticClass: "fixed left-1/2 top-24 lg:top-auto -translate-x-1/2"
                    }, [e("Counters")], 1), t._v(" "), e("div", [e("div", {
                        staticClass: "inline-block text-left"
                    }, [e("button", {
                        staticClass: "xl:text-[1.4vw] cursor-pointer hover:bg-white/10 active:bg-white/5 px-6 py-2 rounded-2xl",
                        on: {
                            click: function(e) {
                                return t.$store.commit("SET_MODAL", {
                                    name: "showMenu",
                                    value: !0
                                })
                            }
                        }
                    }, [e("fa-icon", {
                        attrs: {
                            icon: "bars"
                        }
                    })], 1), t._v(" "), e("transition", {
                        attrs: {
                            "enter-active-class": "transition ease-out duration-75",
                            "enter-class": "transform opacity-0 scale-95",
                            "enter-to-class": "transform opacity-100 scale-100",
                            "leave-active-class": "transition ease-in duration-75",
                            "leave-class": "transform opacity-100 scale-100",
                            "leave-to-class": "transform opacity-0 scale-95"
                        }
                    }, [t.$store.state.modals.showMenu ? e("Menu") : t._e()], 1)], 1)])], 1), t._v(" "), e("main", {
                        staticClass: "flex flex-col items-center justify-center flex-1 px-4 sm:px-6 md:px-10"
                    }, [e("div", {
                        staticClass: "relative"
                    }, [e("Timer"), t._v(" "), t.$store.state.user.name ? e("Mantras") : t._e()], 1)]), t._v(" "), e("footer", {
                        staticClass: "relative"
                    }, [t._m(0), t._v(" "), e("DetailModal"), t._v(" "), e("Controls")], 1), t._v(" "), e("transition", {
                        attrs: {
                            "enter-active-class": "transition ease-out duration-75",
                            "enter-class": "transform opacity-0 scale-95",
                            "enter-to-class": "transform opacity-100 scale-100",
                            "leave-active-class": "transition ease-in duration-75",
                            "leave-class": "transform opacity-100 scale-100",
                            "leave-to-class": "transform opacity-0 scale-95"
                        }
                    }, [t.$store.state.modals.showResetCounters ? e("ResetCountersModal", {
                        on: {
                            close: function(e) {
                                return t.$store.commit("SET_MODAL", {
                                    name: "showResetCounters",
                                    value: !1
                                })
                            }
                        }
                    }) : t._e()], 1), t._v(" "), e("transition", {
                        attrs: {
                            "enter-active-class": "transition ease-out duration-75",
                            "enter-class": "transform opacity-0 scale-95",
                            "enter-to-class": "transform opacity-100 scale-100",
                            "leave-active-class": "transition ease-in duration-75",
                            "leave-class": "transform opacity-100 scale-100",
                            "leave-to-class": "transform opacity-0 scale-95"
                        }
                    }, [t.$store.state.user.name ? t._e() : e("NameForm")], 1)], 1)
                }), o, !1, null, null, null);
            e.
            default = component.exports;
            installComponents(component, {
                Username: n(480).
                default,
                Counters: n(481).
                default,
                Menu: n(478).
                default,
                Timer: n(479).
                default,
                Mantras: n(482).
                default,
                DetailModal: n(483).
                default,
                Controls: n(489).
                default,
                ResetCountersModal: n(490).
                default,
                NameForm: n(491).
                default
            })
        }
    }]);