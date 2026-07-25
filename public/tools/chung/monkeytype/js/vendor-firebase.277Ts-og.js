(function() {
    try {
        var e = typeof window < `u` ? window : typeof global < `u` ? global : typeof globalThis < `u` ? globalThis : typeof self < `u` ? self : {};
        e.SENTRY_RELEASE = {
            id: `2026.07.15_23.08_7713c8d7a`
        }, e._sentryModuleMetadata = e._sentryModuleMetadata || {}, e._sentryModuleMetadata[new e.Error().stack] = function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                if (n != null)
                    for (var r in n) n.hasOwnProperty(r) && (e[r] = n[r])
            }
            return e
        }({}, e._sentryModuleMetadata[new e.Error().stack], {
            "_sentryBundlerPluginAppKey:monkeytype-frontend": !0
        });
        var t = new e.Error().stack;
        t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = `d56066be-1c2f-40f6-8222-8f35449f6b37`, e._sentryDebugIdIdentifier = `sentry-dbid-d56066be-1c2f-40f6-8222-8f35449f6b37`)
    } catch {}
})();
var e = () => void 0,
    t = function(e) {
        let t = [],
            n = 0;
        for (let r = 0; r < e.length; r++) {
            let i = e.charCodeAt(r);
            i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = i & 63 | 128) : (i & 64512) == 55296 && r + 1 < e.length && (e.charCodeAt(r + 1) & 64512) == 56320 ? (i = 65536 + ((i & 1023) << 10) + (e.charCodeAt(++r) & 1023), t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128) : (t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128)
        }
        return t
    },
    n = function(e) {
        let t = [],
            n = 0,
            r = 0;
        for (; n < e.length;) {
            let i = e[n++];
            if (i < 128) t[r++] = String.fromCharCode(i);
            else if (i > 191 && i < 224) {
                let a = e[n++];
                t[r++] = String.fromCharCode((i & 31) << 6 | a & 63)
            } else if (i > 239 && i < 365) {
                let a = e[n++],
                    o = e[n++],
                    s = e[n++],
                    c = ((i & 7) << 18 | (a & 63) << 12 | (o & 63) << 6 | s & 63) - 65536;
                t[r++] = String.fromCharCode(55296 + (c >> 10)), t[r++] = String.fromCharCode(56320 + (c & 1023))
            } else {
                let a = e[n++],
                    o = e[n++];
                t[r++] = String.fromCharCode((i & 15) << 12 | (a & 63) << 6 | o & 63)
            }
        }
        return t.join(``)
    },
    r = {
        byteToCharMap_: null,
        charToByteMap_: null,
        byteToCharMapWebSafe_: null,
        charToByteMapWebSafe_: null,
        ENCODED_VALS_BASE: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`,
        get ENCODED_VALS() {
            return this.ENCODED_VALS_BASE + `+/=`
        },
        get ENCODED_VALS_WEBSAFE() {
            return this.ENCODED_VALS_BASE + `-_.`
        },
        HAS_NATIVE_SUPPORT: typeof atob == `function`,
        encodeByteArray(e, t) {
            if (!Array.isArray(e)) throw Error(`encodeByteArray takes an array as a parameter`);
            this.init_();
            let n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
                r = [];
            for (let t = 0; t < e.length; t += 3) {
                let i = e[t],
                    a = t + 1 < e.length,
                    o = a ? e[t + 1] : 0,
                    s = t + 2 < e.length,
                    c = s ? e[t + 2] : 0,
                    l = i >> 2,
                    u = (i & 3) << 4 | o >> 4,
                    d = (o & 15) << 2 | c >> 6,
                    f = c & 63;
                s || (f = 64, a || (d = 64)), r.push(n[l], n[u], n[d], n[f])
            }
            return r.join(``)
        },
        encodeString(e, n) {
            return this.HAS_NATIVE_SUPPORT && !n ? btoa(e) : this.encodeByteArray(t(e), n)
        },
        decodeString(e, t) {
            return this.HAS_NATIVE_SUPPORT && !t ? atob(e) : n(this.decodeStringToByteArray(e, t))
        },
        decodeStringToByteArray(e, t) {
            this.init_();
            let n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
                r = [];
            for (let t = 0; t < e.length;) {
                let a = n[e.charAt(t++)],
                    o = t < e.length ? n[e.charAt(t)] : 0;
                ++t;
                let s = t < e.length ? n[e.charAt(t)] : 64;
                ++t;
                let c = t < e.length ? n[e.charAt(t)] : 64;
                if (++t, a == null || o == null || s == null || c == null) throw new i;
                let l = a << 2 | o >> 4;
                if (r.push(l), s !== 64) {
                    let e = o << 4 & 240 | s >> 2;
                    if (r.push(e), c !== 64) {
                        let e = s << 6 & 192 | c;
                        r.push(e)
                    }
                }
            }
            return r
        },
        init_() {
            if (!this.byteToCharMap_) {
                this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
                for (let e = 0; e < this.ENCODED_VALS.length; e++) this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e), this.charToByteMap_[this.byteToCharMap_[e]] = e, this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e, e >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e)
            }
        }
    },
    i = class extends Error {
        constructor() {
            super(...arguments), this.name = `DecodeBase64StringError`
        }
    },
    a = function(e) {
        let n = t(e);
        return r.encodeByteArray(n, !0)
    },
    o = function(e) {
        return a(e).replace(/\./g, ``)
    },
    s = function(e) {
        try {
            return r.decodeString(e, !0)
        } catch (e) {
            console.error(`base64Decode failed: `, e)
        }
        return null
    };

function c() {
    if (typeof self < `u`) return self;
    if (typeof window < `u`) return window;
    if (typeof global < `u`) return global;
    throw Error(`Unable to locate global object.`)
}
var l = () => c().__FIREBASE_DEFAULTS__,
    u = () => {
        if (typeof process > `u`) return;
        let e = {}.__FIREBASE_DEFAULTS__;
        if (e) return JSON.parse(e)
    },
    d = () => {
        if (typeof document > `u`) return;
        let e;
        try {
            e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)
        } catch {
            return
        }
        let t = e && s(e[1]);
        return t && JSON.parse(t)
    },
    f = () => {
        try {
            return e() || l() || u() || d()
        } catch (e) {
            console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
            return
        }
    },
    ee = e => f() ?.emulatorHosts ?.[e],
    te = () => f() ?.config,
    ne = e => f() ?.[`_${e}`],
    re = class {
        constructor() {
            this.reject = () => {}, this.resolve = () => {}, this.promise = new Promise((e, t) => {
                this.resolve = e, this.reject = t
            })
        }
        wrapCallback(e) {
            return (t, n) => {
                t ? this.reject(t) : this.resolve(n), typeof e == `function` && (this.promise.catch(() => {}), e.length === 1 ? e(t) : e(t, n))
            }
        }
    };

function p() {
    return typeof navigator < `u` && typeof navigator.userAgent == `string` ? navigator.userAgent : ``
}

function ie() {
    return typeof window < `u` && !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(p())
}

function ae() {
    return typeof navigator < `u` && navigator.userAgent === `Cloudflare-Workers`
}

function oe() {
    let e = typeof chrome == `object` ? chrome.runtime : typeof browser == `object` ? browser.runtime : void 0;
    return typeof e == `object` && e.id !== void 0
}

function se() {
    return typeof navigator == `object` && navigator.product === `ReactNative`
}

function ce() {
    let e = p();
    return e.indexOf(`MSIE `) >= 0 || e.indexOf(`Trident/`) >= 0
}

function le() {
    try {
        return typeof indexedDB == `object`
    } catch {
        return !1
    }
}

function ue() {
    return new Promise((e, t) => {
        try {
            let n = !0,
                r = `validate-browser-context-for-indexeddb-analytics-module`,
                i = self.indexedDB.open(r);
            i.onsuccess = () => {
                i.result.close(), n || self.indexedDB.deleteDatabase(r), e(!0)
            }, i.onupgradeneeded = () => {
                n = !1
            }, i.onerror = () => {
                t(i.error ?.message || ``)
            }
        } catch (e) {
            t(e)
        }
    })
}

function de() {
    return !(typeof navigator > `u` || !navigator.cookieEnabled)
}
var fe = `FirebaseError`,
    m = class e extends Error {
        constructor(t, n, r) {
            super(n), this.code = t, this.customData = r, this.name = fe, Object.setPrototypeOf(this, e.prototype), Error.captureStackTrace && Error.captureStackTrace(this, h.prototype.create)
        }
    },
    h = class {
        constructor(e, t, n) {
            this.service = e, this.serviceName = t, this.errors = n
        }
        create(e, ...t) {
            let n = t[0] || {},
                r = `${this.service}/${e}`,
                i = this.errors[e],
                a = i ? pe(i, n) : `Error`;
            return new m(r, `${this.serviceName}: ${a} (${r}).`, n)
        }
    };

function pe(e, t) {
    return e.replace(me, (e, n) => {
        let r = t[n];
        return r == null ? `<${n}?>` : String(r)
    })
}
var me = /\{\$([^}]+)}/g;

function he(e) {
    for (let t in e)
        if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
    return !0
}

function g(e, t) {
    if (e === t) return !0;
    let n = Object.keys(e),
        r = Object.keys(t);
    for (let i of n) {
        if (!r.includes(i)) return !1;
        let n = e[i],
            a = t[i];
        if (ge(n) && ge(a)) {
            if (!g(n, a)) return !1
        } else if (n !== a) return !1
    }
    for (let e of r)
        if (!n.includes(e)) return !1;
    return !0
}

function ge(e) {
    return typeof e == `object` && !!e
}

function _e(e) {
    let t = [];
    for (let [n, r] of Object.entries(e)) Array.isArray(r) ? r.forEach(e => {
        t.push(encodeURIComponent(n) + `=` + encodeURIComponent(e))
    }) : t.push(encodeURIComponent(n) + `=` + encodeURIComponent(r));
    return t.length ? `&` + t.join(`&`) : ``
}

function _(e) {
    let t = {};
    return e.replace(/^\?/, ``).split(`&`).forEach(e => {
        if (e) {
            let [n, r] = e.split(`=`);
            t[decodeURIComponent(n)] = decodeURIComponent(r)
        }
    }), t
}

function ve(e) {
    let t = e.indexOf(`?`);
    if (!t) return ``;
    let n = e.indexOf(`#`, t);
    return e.substring(t, n > 0 ? n : void 0)
}

function ye(e, t) {
    let n = new be(e, t);
    return n.subscribe.bind(n)
}
var be = class {
    constructor(e, t) {
        this.observers = [], this.unsubscribes = [], this.observerCount = 0, this.task = Promise.resolve(), this.finalized = !1, this.onNoObservers = t, this.task.then(() => {
            e(this)
        }).catch(e => {
            this.error(e)
        })
    }
    next(e) {
        this.forEachObserver(t => {
            t.next(e)
        })
    }
    error(e) {
        this.forEachObserver(t => {
            t.error(e)
        }), this.close(e)
    }
    complete() {
        this.forEachObserver(e => {
            e.complete()
        }), this.close()
    }
    subscribe(e, t, n) {
        let r;
        if (e === void 0 && t === void 0 && n === void 0) throw Error(`Missing Observer.`);
        r = xe(e, [`next`, `error`, `complete`]) ? e : {
            next: e,
            error: t,
            complete: n
        }, r.next === void 0 && (r.next = Se), r.error === void 0 && (r.error = Se), r.complete === void 0 && (r.complete = Se);
        let i = this.unsubscribeOne.bind(this, this.observers.length);
        return this.finalized && this.task.then(() => {
            try {
                this.finalError ? r.error(this.finalError) : r.complete()
            } catch {}
        }), this.observers.push(r), i
    }
    unsubscribeOne(e) {
        this.observers === void 0 || this.observers[e] === void 0 || (delete this.observers[e], --this.observerCount, this.observerCount === 0 && this.onNoObservers !== void 0 && this.onNoObservers(this))
    }
    forEachObserver(e) {
        if (!this.finalized)
            for (let t = 0; t < this.observers.length; t++) this.sendOne(t, e)
    }
    sendOne(e, t) {
        this.task.then(() => {
            if (this.observers !== void 0 && this.observers[e] !== void 0) try {
                t(this.observers[e])
            } catch (e) {
                typeof console < `u` && console.error && console.error(e)
            }
        })
    }
    close(e) {
        this.finalized || (this.finalized = !0, e !== void 0 && (this.finalError = e), this.task.then(() => {
            this.observers = void 0, this.onNoObservers = void 0
        }))
    }
};

function xe(e, t) {
    if (typeof e != `object` || !e) return !1;
    for (let n of t)
        if (n in e && typeof e[n] == `function`) return !0;
    return !1
}

function Se() {}
var Ce = 1e3,
    we = 2,
    Te = 14400 * 1e3,
    Ee = .5;

function De(e, t = Ce, n = we) {
    let r = t * n ** +e,
        i = Math.round(Ee * r * (Math.random() - .5) * 2);
    return Math.min(Te, r + i)
}

function v(e) {
    return e && e._delegate ? e._delegate : e
}

function Oe(e) {
    try {
        return (e.startsWith(`http://`) || e.startsWith(`https://`) ? new URL(e).hostname : e).endsWith(`.cloudworkstations.dev`)
    } catch {
        return !1
    }
}
async function ke(e) {
    return (await fetch(e, {
        credentials: `include`
    })).ok
}
var y = class {
        constructor(e, t, n) {
            this.name = e, this.instanceFactory = t, this.type = n, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = `LAZY`, this.onInstanceCreated = null
        }
        setInstantiationMode(e) {
            return this.instantiationMode = e, this
        }
        setMultipleInstances(e) {
            return this.multipleInstances = e, this
        }
        setServiceProps(e) {
            return this.serviceProps = e, this
        }
        setInstanceCreatedCallback(e) {
            return this.onInstanceCreated = e, this
        }
    },
    b = `[DEFAULT]`,
    Ae = class {
        constructor(e, t) {
            this.name = e, this.container = t, this.component = null, this.instances = new Map, this.instancesDeferred = new Map, this.instancesOptions = new Map, this.onInitCallbacks = new Map
        }
        get(e) {
            let t = this.normalizeInstanceIdentifier(e);
            if (!this.instancesDeferred.has(t)) {
                let e = new re;
                if (this.instancesDeferred.set(t, e), this.isInitialized(t) || this.shouldAutoInitialize()) try {
                    let n = this.getOrInitializeService({
                        instanceIdentifier: t
                    });
                    n && e.resolve(n)
                } catch {}
            }
            return this.instancesDeferred.get(t).promise
        }
        getImmediate(e) {
            let t = this.normalizeInstanceIdentifier(e ?.identifier),
                n = e ?.optional ?? !1;
            if (this.isInitialized(t) || this.shouldAutoInitialize()) try {
                    return this.getOrInitializeService({
                        instanceIdentifier: t
                    })
                } catch (e) {
                    if (n) return null;
                    throw e
                } else if (n) return null;
                else throw Error(`Service ${this.name} is not available`)
        }
        getComponent() {
            return this.component
        }
        setComponent(e) {
            if (e.name !== this.name) throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
            if (this.component) throw Error(`Component for ${this.name} has already been provided`);
            if (this.component = e, this.shouldAutoInitialize()) {
                if (Me(e)) try {
                    this.getOrInitializeService({
                        instanceIdentifier: b
                    })
                } catch {}
                for (let [e, t] of this.instancesDeferred.entries()) {
                    let n = this.normalizeInstanceIdentifier(e);
                    try {
                        let e = this.getOrInitializeService({
                            instanceIdentifier: n
                        });
                        t.resolve(e)
                    } catch {}
                }
            }
        }
        clearInstance(e = b) {
            this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e)
        }
        async delete() {
            let e = Array.from(this.instances.values());
            await Promise.all([...e.filter(e => `INTERNAL` in e).map(e => e.INTERNAL.delete()), ...e.filter(e => `_delete` in e).map(e => e._delete())])
        }
        isComponentSet() {
            return this.component != null
        }
        isInitialized(e = b) {
            return this.instances.has(e)
        }
        getOptions(e = b) {
            return this.instancesOptions.get(e) || {}
        }
        initialize(e = {}) {
            let {
                options: t = {}
            } = e, n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
            if (this.isInitialized(n)) throw Error(`${this.name}(${n}) has already been initialized`);
            if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
            let r = this.getOrInitializeService({
                instanceIdentifier: n,
                options: t
            });
            for (let [e, t] of this.instancesDeferred.entries()) n === this.normalizeInstanceIdentifier(e) && t.resolve(r);
            return r
        }
        onInit(e, t) {
            let n = this.normalizeInstanceIdentifier(t),
                r = this.onInitCallbacks.get(n) ?? new Set;
            r.add(e), this.onInitCallbacks.set(n, r);
            let i = this.instances.get(n);
            return i && e(i, n), () => {
                r.delete(e)
            }
        }
        invokeOnInitCallbacks(e, t) {
            let n = this.onInitCallbacks.get(t);
            if (n)
                for (let r of n) try {
                    r(e, t)
                } catch {}
        }
        getOrInitializeService({
            instanceIdentifier: e,
            options: t = {}
        }) {
            let n = this.instances.get(e);
            if (!n && this.component && (n = this.component.instanceFactory(this.container, {
                    instanceIdentifier: je(e),
                    options: t
                }), this.instances.set(e, n), this.instancesOptions.set(e, t), this.invokeOnInitCallbacks(n, e), this.component.onInstanceCreated)) try {
                this.component.onInstanceCreated(this.container, e, n)
            } catch {}
            return n || null
        }
        normalizeInstanceIdentifier(e = b) {
            return this.component ? this.component.multipleInstances ? e : b : e
        }
        shouldAutoInitialize() {
            return !!this.component && this.component.instantiationMode !== `EXPLICIT`
        }
    };

function je(e) {
    return e === b ? void 0 : e
}

function Me(e) {
    return e.instantiationMode === `EAGER`
}
var Ne = class {
        constructor(e) {
            this.name = e, this.providers = new Map
        }
        addComponent(e) {
            let t = this.getProvider(e.name);
            if (t.isComponentSet()) throw Error(`Component ${e.name} has already been registered with ${this.name}`);
            t.setComponent(e)
        }
        addOrOverwriteComponent(e) {
            this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e)
        }
        getProvider(e) {
            if (this.providers.has(e)) return this.providers.get(e);
            let t = new Ae(e, this);
            return this.providers.set(e, t), t
        }
        getProviders() {
            return Array.from(this.providers.values())
        }
    },
    Pe = [],
    x;
(function(e) {
    e[e.DEBUG = 0] = `DEBUG`, e[e.VERBOSE = 1] = `VERBOSE`, e[e.INFO = 2] = `INFO`, e[e.WARN = 3] = `WARN`, e[e.ERROR = 4] = `ERROR`, e[e.SILENT = 5] = `SILENT`
})(x ||= {});
var Fe = {
        debug: x.DEBUG,
        verbose: x.VERBOSE,
        info: x.INFO,
        warn: x.WARN,
        error: x.ERROR,
        silent: x.SILENT
    },
    Ie = x.INFO,
    Le = {
        [x.DEBUG]: `log`,
        [x.VERBOSE]: `log`,
        [x.INFO]: `info`,
        [x.WARN]: `warn`,
        [x.ERROR]: `error`
    },
    Re = (e, t, ...n) => {
        if (t < e.logLevel) return;
        let r = new Date().toISOString(),
            i = Le[t];
        if (i) console[i](`[${r}]  ${e.name}:`, ...n);
        else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)
    },
    ze = class {
        constructor(e) {
            this.name = e, this._logLevel = Ie, this._logHandler = Re, this._userLogHandler = null, Pe.push(this)
        }
        get logLevel() {
            return this._logLevel
        }
        set logLevel(e) {
            if (!(e in x)) throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
            this._logLevel = e
        }
        setLogLevel(e) {
            this._logLevel = typeof e == `string` ? Fe[e] : e
        }
        get logHandler() {
            return this._logHandler
        }
        set logHandler(e) {
            if (typeof e != `function`) throw TypeError("Value assigned to `logHandler` must be a function");
            this._logHandler = e
        }
        get userLogHandler() {
            return this._userLogHandler
        }
        set userLogHandler(e) {
            this._userLogHandler = e
        }
        debug(...e) {
            this._userLogHandler && this._userLogHandler(this, x.DEBUG, ...e), this._logHandler(this, x.DEBUG, ...e)
        }
        log(...e) {
            this._userLogHandler && this._userLogHandler(this, x.VERBOSE, ...e), this._logHandler(this, x.VERBOSE, ...e)
        }
        info(...e) {
            this._userLogHandler && this._userLogHandler(this, x.INFO, ...e), this._logHandler(this, x.INFO, ...e)
        }
        warn(...e) {
            this._userLogHandler && this._userLogHandler(this, x.WARN, ...e), this._logHandler(this, x.WARN, ...e)
        }
        error(...e) {
            this._userLogHandler && this._userLogHandler(this, x.ERROR, ...e), this._logHandler(this, x.ERROR, ...e)
        }
    },
    Be = (e, t) => t.some(t => e instanceof t),
    Ve, He;

function Ue() {
    return Ve ||= [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]
}

function We() {
    return He ||= [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]
}
var Ge = new WeakMap,
    Ke = new WeakMap,
    qe = new WeakMap,
    Je = new WeakMap,
    Ye = new WeakMap;

function Xe(e) {
    let t = new Promise((t, n) => {
        let r = () => {
                e.removeEventListener(`success`, i), e.removeEventListener(`error`, a)
            },
            i = () => {
                t(S(e.result)), r()
            },
            a = () => {
                n(e.error), r()
            };
        e.addEventListener(`success`, i), e.addEventListener(`error`, a)
    });
    return t.then(t => {
        t instanceof IDBCursor && Ge.set(t, e)
    }).catch(() => {}), Ye.set(t, e), t
}

function Ze(e) {
    if (Ke.has(e)) return;
    let t = new Promise((t, n) => {
        let r = () => {
                e.removeEventListener(`complete`, i), e.removeEventListener(`error`, a), e.removeEventListener(`abort`, a)
            },
            i = () => {
                t(), r()
            },
            a = () => {
                n(e.error || new DOMException(`AbortError`, `AbortError`)), r()
            };
        e.addEventListener(`complete`, i), e.addEventListener(`error`, a), e.addEventListener(`abort`, a)
    });
    Ke.set(e, t)
}
var Qe = {
    get(e, t, n) {
        if (e instanceof IDBTransaction) {
            if (t === `done`) return Ke.get(e);
            if (t === `objectStoreNames`) return e.objectStoreNames || qe.get(e);
            if (t === `store`) return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0])
        }
        return S(e[t])
    },
    set(e, t, n) {
        return e[t] = n, !0
    },
    has(e, t) {
        return e instanceof IDBTransaction && (t === `done` || t === `store`) ? !0 : t in e
    }
};

function $e(e) {
    Qe = e(Qe)
}

function et(e) {
    return e === IDBDatabase.prototype.transaction && !(`objectStoreNames` in IDBTransaction.prototype) ? function(t, ...n) {
        let r = e.call(nt(this), t, ...n);
        return qe.set(r, t.sort ? t.sort() : [t]), S(r)
    } : We().includes(e) ? function(...t) {
        return e.apply(nt(this), t), S(Ge.get(this))
    } : function(...t) {
        return S(e.apply(nt(this), t))
    }
}

function tt(e) {
    return typeof e == `function` ? et(e) : (e instanceof IDBTransaction && Ze(e), Be(e, Ue()) ? new Proxy(e, Qe) : e)
}

function S(e) {
    if (e instanceof IDBRequest) return Xe(e);
    if (Je.has(e)) return Je.get(e);
    let t = tt(e);
    return t !== e && (Je.set(e, t), Ye.set(t, e)), t
}
var nt = e => Ye.get(e);

function rt(e, t, {
    blocked: n,
    upgrade: r,
    blocking: i,
    terminated: a
} = {}) {
    let o = indexedDB.open(e, t),
        s = S(o);
    return r && o.addEventListener(`upgradeneeded`, e => {
        r(S(o.result), e.oldVersion, e.newVersion, S(o.transaction), e)
    }), n && o.addEventListener(`blocked`, e => n(e.oldVersion, e.newVersion, e)), s.then(e => {
        a && e.addEventListener(`close`, () => a()), i && e.addEventListener(`versionchange`, e => i(e.oldVersion, e.newVersion, e))
    }).catch(() => {}), s
}
var it = [`get`, `getKey`, `getAll`, `getAllKeys`, `count`],
    at = [`put`, `add`, `delete`, `clear`],
    ot = new Map;

function st(e, t) {
    if (!(e instanceof IDBDatabase && !(t in e) && typeof t == `string`)) return;
    if (ot.get(t)) return ot.get(t);
    let n = t.replace(/FromIndex$/, ``),
        r = t !== n,
        i = at.includes(n);
    if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || it.includes(n))) return;
    let a = async function(e, ...t) {
        let a = this.transaction(e, i ? `readwrite` : `readonly`),
            o = a.store;
        return r && (o = o.index(t.shift())), (await Promise.all([o[n](...t), i && a.done]))[0]
    };
    return ot.set(t, a), a
}
$e(e => ({ ...e,
    get: (t, n, r) => st(t, n) || e.get(t, n, r),
    has: (t, n) => !!st(t, n) || e.has(t, n)
}));
var ct = class {
    constructor(e) {
        this.container = e
    }
    getPlatformInfoString() {
        return this.container.getProviders().map(e => {
            if (lt(e)) {
                let t = e.getImmediate();
                return `${t.library}/${t.version}`
            } else return null
        }).filter(e => e).join(` `)
    }
};

function lt(e) {
    return e.getComponent() ?.type === `VERSION`
}
var ut = `@firebase/app`,
    dt = `0.14.12`,
    C = new ze(`@firebase/app`),
    ft = `@firebase/app-compat`,
    pt = `@firebase/analytics-compat`,
    mt = `@firebase/analytics`,
    ht = `@firebase/app-check-compat`,
    gt = `@firebase/app-check`,
    _t = `@firebase/auth`,
    vt = `@firebase/auth-compat`,
    yt = `@firebase/database`,
    bt = `@firebase/data-connect`,
    xt = `@firebase/database-compat`,
    St = `@firebase/functions`,
    Ct = `@firebase/functions-compat`,
    wt = `@firebase/installations`,
    Tt = `@firebase/installations-compat`,
    Et = `@firebase/messaging`,
    Dt = `@firebase/messaging-compat`,
    Ot = `@firebase/performance`,
    kt = `@firebase/performance-compat`,
    At = `@firebase/remote-config`,
    jt = `@firebase/remote-config-compat`,
    Mt = `@firebase/storage`,
    Nt = `@firebase/storage-compat`,
    Pt = `@firebase/firestore`,
    Ft = `@firebase/ai`,
    It = `@firebase/firestore-compat`,
    Lt = `firebase`,
    Rt = `12.13.0`,
    zt = `[DEFAULT]`,
    Bt = {
        [ut]: `fire-core`,
        [ft]: `fire-core-compat`,
        [mt]: `fire-analytics`,
        [pt]: `fire-analytics-compat`,
        [gt]: `fire-app-check`,
        [ht]: `fire-app-check-compat`,
        [_t]: `fire-auth`,
        [vt]: `fire-auth-compat`,
        [yt]: `fire-rtdb`,
        [bt]: `fire-data-connect`,
        [xt]: `fire-rtdb-compat`,
        [St]: `fire-fn`,
        [Ct]: `fire-fn-compat`,
        [wt]: `fire-iid`,
        [Tt]: `fire-iid-compat`,
        [Et]: `fire-fcm`,
        [Dt]: `fire-fcm-compat`,
        [Ot]: `fire-perf`,
        [kt]: `fire-perf-compat`,
        [At]: `fire-rc`,
        [jt]: `fire-rc-compat`,
        [Mt]: `fire-gcs`,
        [Nt]: `fire-gcs-compat`,
        [Pt]: `fire-fst`,
        [It]: `fire-fst-compat`,
        [Ft]: `fire-vertex`,
        "fire-js": `fire-js`,
        [Lt]: `fire-js-all`
    },
    Vt = new Map,
    Ht = new Map,
    Ut = new Map;

function Wt(e, t) {
    try {
        e.container.addComponent(t)
    } catch (n) {
        C.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`, n)
    }
}

function w(e) {
    let t = e.name;
    if (Ut.has(t)) return C.debug(`There were multiple attempts to register component ${t}.`), !1;
    Ut.set(t, e);
    for (let t of Vt.values()) Wt(t, e);
    for (let t of Ht.values()) Wt(t, e);
    return !0
}

function T(e, t) {
    let n = e.container.getProvider(`heartbeat`).getImmediate({
        optional: !0
    });
    return n && n.triggerHeartbeat(), e.container.getProvider(t)
}

function E(e) {
    return e == null ? !1 : e.settings !== void 0
}
var D = new h(`app`, `Firebase`, {
        "no-app": `No Firebase App '{$appName}' has been created - call initializeApp() first`,
        "bad-app-name": `Illegal App name: '{$appName}'`,
        "duplicate-app": `Firebase App named '{$appName}' already exists with different options or config`,
        "app-deleted": `Firebase App named '{$appName}' already deleted`,
        "server-app-deleted": `Firebase Server App has been deleted`,
        "no-options": `Need to provide options, when not being deployed to hosting via source.`,
        "invalid-app-argument": `firebase.{$appName}() takes either no argument or a Firebase App instance.`,
        "invalid-log-argument": "First argument to `onLog` must be null or a function.",
        "idb-open": `Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.`,
        "idb-get": `Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.`,
        "idb-set": `Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.`,
        "idb-delete": `Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.`,
        "finalization-registry-not-supported": `FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.`,
        "invalid-server-app-environment": `FirebaseServerApp is not for use in browser environments.`
    }),
    Gt = class {
        constructor(e, t, n) {
            this._isDeleted = !1, this._options = { ...e
            }, this._config = { ...t
            }, this._name = t.name, this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled, this._container = n, this.container.addComponent(new y(`app`, () => this, `PUBLIC`))
        }
        get automaticDataCollectionEnabled() {
            return this.checkDestroyed(), this._automaticDataCollectionEnabled
        }
        set automaticDataCollectionEnabled(e) {
            this.checkDestroyed(), this._automaticDataCollectionEnabled = e
        }
        get name() {
            return this.checkDestroyed(), this._name
        }
        get options() {
            return this.checkDestroyed(), this._options
        }
        get config() {
            return this.checkDestroyed(), this._config
        }
        get container() {
            return this._container
        }
        get isDeleted() {
            return this._isDeleted
        }
        set isDeleted(e) {
            this._isDeleted = e
        }
        checkDestroyed() {
            if (this.isDeleted) throw D.create(`app-deleted`, {
                appName: this._name
            })
        }
    },
    Kt = Rt;

function qt(e, t = {}) {
    let n = e;
    typeof t != `object` && (t = {
        name: t
    });
    let r = {
            name: zt,
            automaticDataCollectionEnabled: !0,
            ...t
        },
        i = r.name;
    if (typeof i != `string` || !i) throw D.create(`bad-app-name`, {
        appName: String(i)
    });
    if (n ||= te(), !n) throw D.create(`no-options`);
    let a = Vt.get(i);
    if (a) {
        if (g(n, a.options) && g(r, a.config)) return a;
        throw D.create(`duplicate-app`, {
            appName: i
        })
    }
    let o = new Ne(i);
    for (let e of Ut.values()) o.addComponent(e);
    let s = new Gt(n, r, o);
    return Vt.set(i, s), s
}

function Jt(e = zt) {
    let t = Vt.get(e);
    if (!t && e === `[DEFAULT]` && te()) return qt();
    if (!t) throw D.create(`no-app`, {
        appName: e
    });
    return t
}

function Yt() {
    return Array.from(Vt.values())
}

function O(e, t, n) {
    let r = Bt[e] ?? e;
    n && (r += `-${n}`);
    let i = r.match(/\s|\//),
        a = t.match(/\s|\//);
    if (i || a) {
        let e = [`Unable to register library "${r}" with version "${t}":`];
        i && e.push(`library name "${r}" contains illegal characters (whitespace or "/")`), i && a && e.push(`and`), a && e.push(`version name "${t}" contains illegal characters (whitespace or "/")`), C.warn(e.join(` `));
        return
    }
    w(new y(`${r}-version`, () => ({
        library: r,
        version: t
    }), `VERSION`))
}
var Xt = `firebase-heartbeat-database`,
    Zt = 1,
    Qt = `firebase-heartbeat-store`,
    $t = null;

function en() {
    return $t ||= rt(Xt, Zt, {
        upgrade: (e, t) => {
            switch (t) {
                case 0:
                    try {
                        e.createObjectStore(Qt)
                    } catch (e) {
                        console.warn(e)
                    }
            }
        }
    }).catch(e => {
        throw D.create(`idb-open`, {
            originalErrorMessage: e.message
        })
    }), $t
}
async function tn(e) {
    try {
        let t = (await en()).transaction(Qt),
            n = await t.objectStore(Qt).get(rn(e));
        return await t.done, n
    } catch (e) {
        if (e instanceof m) C.warn(e.message);
        else {
            let t = D.create(`idb-get`, {
                originalErrorMessage: e ?.message
            });
            C.warn(t.message)
        }
    }
}
async function nn(e, t) {
    try {
        let n = (await en()).transaction(Qt, `readwrite`);
        await n.objectStore(Qt).put(t, rn(e)), await n.done
    } catch (e) {
        if (e instanceof m) C.warn(e.message);
        else {
            let t = D.create(`idb-set`, {
                originalErrorMessage: e ?.message
            });
            C.warn(t.message)
        }
    }
}

function rn(e) {
    return `${e.name}!${e.options.appId}`
}
var an = 1024,
    on = 30,
    sn = class {
        constructor(e) {
            this.container = e, this._heartbeatsCache = null, this._storage = new un(this.container.getProvider(`app`).getImmediate()), this._heartbeatsCachePromise = this._storage.read().then(e => (this._heartbeatsCache = e, e))
        }
        async triggerHeartbeat() {
            try {
                let e = this.container.getProvider(`platform-logger`).getImmediate().getPlatformInfoString(),
                    t = cn();
                if (this._heartbeatsCache ?.heartbeats == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, this._heartbeatsCache ?.heartbeats == null) || this._heartbeatsCache.lastSentHeartbeatDate === t || this._heartbeatsCache.heartbeats.some(e => e.date === t)) return;
                if (this._heartbeatsCache.heartbeats.push({
                        date: t,
                        agent: e
                    }), this._heartbeatsCache.heartbeats.length > on) {
                    let e = fn(this._heartbeatsCache.heartbeats);
                    this._heartbeatsCache.heartbeats.splice(e, 1)
                }
                return this._storage.overwrite(this._heartbeatsCache)
            } catch (e) {
                C.warn(e)
            }
        }
        async getHeartbeatsHeader() {
            try {
                if (this._heartbeatsCache === null && await this._heartbeatsCachePromise, this._heartbeatsCache ?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) return ``;
                let e = cn(),
                    {
                        heartbeatsToSend: t,
                        unsentEntries: n
                    } = ln(this._heartbeatsCache.heartbeats),
                    r = o(JSON.stringify({
                        version: 2,
                        heartbeats: t
                    }));
                return this._heartbeatsCache.lastSentHeartbeatDate = e, n.length > 0 ? (this._heartbeatsCache.heartbeats = n, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), r
            } catch (e) {
                return C.warn(e), ``
            }
        }
    };

function cn() {
    return new Date().toISOString().substring(0, 10)
}

function ln(e, t = an) {
    let n = [],
        r = e.slice();
    for (let i of e) {
        let e = n.find(e => e.agent === i.agent);
        if (!e) {
            if (n.push({
                    agent: i.agent,
                    dates: [i.date]
                }), dn(n) > t) {
                n.pop();
                break
            }
        } else if (e.dates.push(i.date), dn(n) > t) {
            e.dates.pop();
            break
        }
        r = r.slice(1)
    }
    return {
        heartbeatsToSend: n,
        unsentEntries: r
    }
}
var un = class {
    constructor(e) {
        this.app = e, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck()
    }
    async runIndexedDBEnvironmentCheck() {
        return le() ? ue().then(() => !0).catch(() => !1) : !1
    }
    async read() {
        if (await this._canUseIndexedDBPromise) {
            let e = await tn(this.app);
            return e ?.heartbeats ? e : {
                heartbeats: []
            }
        } else return {
            heartbeats: []
        }
    }
    async overwrite(e) {
        if (await this._canUseIndexedDBPromise) {
            let t = await this.read();
            return nn(this.app, {
                lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? t.lastSentHeartbeatDate,
                heartbeats: e.heartbeats
            })
        } else return
    }
    async add(e) {
        if (await this._canUseIndexedDBPromise) {
            let t = await this.read();
            return nn(this.app, {
                lastSentHeartbeatDate: e.lastSentHeartbeatDate ?? t.lastSentHeartbeatDate,
                heartbeats: [...t.heartbeats, ...e.heartbeats]
            })
        } else return
    }
};

function dn(e) {
    return o(JSON.stringify({
        version: 2,
        heartbeats: e
    })).length
}

function fn(e) {
    if (e.length === 0) return -1;
    let t = 0,
        n = e[0].date;
    for (let r = 1; r < e.length; r++) e[r].date < n && (n = e[r].date, t = r);
    return t
}

function pn(e) {
    w(new y(`platform-logger`, e => new ct(e), `PRIVATE`)), w(new y(`heartbeat`, e => new sn(e), `PRIVATE`)), O(ut, dt, e), O(ut, dt, `esm2020`), O(`fire-js`, ``)
}
pn(``);

function mn() {
    return {
        "dependent-sdk-initialized-before-auth": "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
    }
}
var hn = mn,
    gn = new h(`auth`, `Firebase`, mn()),
    _n = new ze(`@firebase/auth`);

function vn(e, ...t) {
    _n.logLevel <= x.WARN && _n.warn(`Auth (${Kt}): ${e}`, ...t)
}

function yn(e, ...t) {
    _n.logLevel <= x.ERROR && _n.error(`Auth (${Kt}): ${e}`, ...t)
}

function k(e, ...t) {
    throw Sn(e, ...t)
}

function A(e, ...t) {
    return Sn(e, ...t)
}

function bn(e, t, n) {
    return new h(`auth`, `Firebase`, { ...hn(),
        [t]: n
    }).create(t, {
        appName: e.name
    })
}

function j(e) {
    return bn(e, `operation-not-supported-in-this-environment`, `Operations that alter the current user are not supported in conjunction with FirebaseServerApp`)
}

function xn(e, t, n) {
    let r = n;
    if (!(t instanceof r)) throw r.name !== t.constructor.name && k(e, `argument-error`), bn(e, `argument-error`, `Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)
}

function Sn(e, ...t) {
    if (typeof e != `string`) {
        let n = t[0],
            r = [...t.slice(1)];
        return r[0] && (r[0].appName = e.name), e._errorFactory.create(n, ...r)
    }
    return gn.create(e, ...t)
}

function M(e, t, ...n) {
    if (!e) throw Sn(t, ...n)
}

function N(e) {
    let t = `INTERNAL ASSERTION FAILED: ` + e;
    throw yn(t), Error(t)
}

function P(e, t) {
    e || N(t)
}

function Cn() {
    return typeof self < `u` && self.location ?.href || ``
}

function wn() {
    return Tn() === `http:` || Tn() === `https:`
}

function Tn() {
    return typeof self < `u` && self.location ?.protocol || null
}

function En() {
    return typeof navigator < `u` && navigator && `onLine` in navigator && typeof navigator.onLine == `boolean` && (wn() || oe() || `connection` in navigator) ? navigator.onLine : !0
}

function Dn() {
    if (typeof navigator > `u`) return null;
    let e = navigator;
    return e.languages && e.languages[0] || e.language || null
}
var On = class {
    constructor(e, t) {
        this.shortDelay = e, this.longDelay = t, P(t > e, `Short delay should be less than long delay!`), this.isMobile = ie() || se()
    }
    get() {
        return En() ? this.isMobile ? this.longDelay : this.shortDelay : Math.min(5e3, this.shortDelay)
    }
};

function kn(e, t) {
    P(e.emulator, `Emulator should always be set here`);
    let {
        url: n
    } = e.emulator;
    return t ? `${n}${t.startsWith(`/`)?t.slice(1):t}` : n
}
var An = class {
        static initialize(e, t, n) {
            this.fetchImpl = e, t && (this.headersImpl = t), n && (this.responseImpl = n)
        }
        static fetch() {
            if (this.fetchImpl) return this.fetchImpl;
            if (typeof self < `u` && `fetch` in self) return self.fetch;
            if (typeof globalThis < `u` && globalThis.fetch) return globalThis.fetch;
            if (typeof fetch < `u`) return fetch;
            N(`Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill`)
        }
        static headers() {
            if (this.headersImpl) return this.headersImpl;
            if (typeof self < `u` && `Headers` in self) return self.Headers;
            if (typeof globalThis < `u` && globalThis.Headers) return globalThis.Headers;
            if (typeof Headers < `u`) return Headers;
            N(`Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill`)
        }
        static response() {
            if (this.responseImpl) return this.responseImpl;
            if (typeof self < `u` && `Response` in self) return self.Response;
            if (typeof globalThis < `u` && globalThis.Response) return globalThis.Response;
            if (typeof Response < `u`) return Response;
            N(`Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill`)
        }
    },
    jn = {
        CREDENTIAL_MISMATCH: `custom-token-mismatch`,
        MISSING_CUSTOM_TOKEN: `internal-error`,
        INVALID_IDENTIFIER: `invalid-email`,
        MISSING_CONTINUE_URI: `internal-error`,
        INVALID_PASSWORD: `wrong-password`,
        MISSING_PASSWORD: `missing-password`,
        INVALID_LOGIN_CREDENTIALS: `invalid-credential`,
        EMAIL_EXISTS: `email-already-in-use`,
        PASSWORD_LOGIN_DISABLED: `operation-not-allowed`,
        INVALID_IDP_RESPONSE: `invalid-credential`,
        INVALID_PENDING_TOKEN: `invalid-credential`,
        FEDERATED_USER_ID_ALREADY_LINKED: `credential-already-in-use`,
        MISSING_REQ_TYPE: `internal-error`,
        EMAIL_NOT_FOUND: `user-not-found`,
        RESET_PASSWORD_EXCEED_LIMIT: `too-many-requests`,
        EXPIRED_OOB_CODE: `expired-action-code`,
        INVALID_OOB_CODE: `invalid-action-code`,
        MISSING_OOB_CODE: `internal-error`,
        CREDENTIAL_TOO_OLD_LOGIN_AGAIN: `requires-recent-login`,
        INVALID_ID_TOKEN: `invalid-user-token`,
        TOKEN_EXPIRED: `user-token-expired`,
        USER_NOT_FOUND: `user-token-expired`,
        TOO_MANY_ATTEMPTS_TRY_LATER: `too-many-requests`,
        PASSWORD_DOES_NOT_MEET_REQUIREMENTS: `password-does-not-meet-requirements`,
        INVALID_CODE: `invalid-verification-code`,
        INVALID_SESSION_INFO: `invalid-verification-id`,
        INVALID_TEMPORARY_PROOF: `invalid-credential`,
        MISSING_SESSION_INFO: `missing-verification-id`,
        SESSION_EXPIRED: `code-expired`,
        MISSING_ANDROID_PACKAGE_NAME: `missing-android-pkg-name`,
        UNAUTHORIZED_DOMAIN: `unauthorized-continue-uri`,
        INVALID_OAUTH_CLIENT_ID: `invalid-oauth-client-id`,
        ADMIN_ONLY_OPERATION: `admin-restricted-operation`,
        INVALID_MFA_PENDING_CREDENTIAL: `invalid-multi-factor-session`,
        MFA_ENROLLMENT_NOT_FOUND: `multi-factor-info-not-found`,
        MISSING_MFA_ENROLLMENT_ID: `missing-multi-factor-info`,
        MISSING_MFA_PENDING_CREDENTIAL: `missing-multi-factor-session`,
        SECOND_FACTOR_EXISTS: `second-factor-already-in-use`,
        SECOND_FACTOR_LIMIT_EXCEEDED: `maximum-second-factor-count-exceeded`,
        BLOCKING_FUNCTION_ERROR_RESPONSE: `internal-error`,
        RECAPTCHA_NOT_ENABLED: `recaptcha-not-enabled`,
        MISSING_RECAPTCHA_TOKEN: `missing-recaptcha-token`,
        INVALID_RECAPTCHA_TOKEN: `invalid-recaptcha-token`,
        INVALID_RECAPTCHA_ACTION: `invalid-recaptcha-action`,
        MISSING_CLIENT_TYPE: `missing-client-type`,
        MISSING_RECAPTCHA_VERSION: `missing-recaptcha-version`,
        INVALID_RECAPTCHA_VERSION: `invalid-recaptcha-version`,
        INVALID_REQ_TYPE: `invalid-req-type`
    },
    Mn = [`/v1/accounts:signInWithCustomToken`, `/v1/accounts:signInWithEmailLink`, `/v1/accounts:signInWithIdp`, `/v1/accounts:signInWithPassword`, `/v1/accounts:signInWithPhoneNumber`, `/v1/token`],
    Nn = new On(3e4, 6e4);

function F(e, t) {
    return e.tenantId && !t.tenantId ? { ...t,
        tenantId: e.tenantId
    } : t
}
async function I(e, t, n, r, i = {}) {
    return Pn(e, i, async () => {
        let i = {},
            a = {};
        r && (t === `GET` ? a = r : i = {
            body: JSON.stringify(r)
        });
        let o = _e({
                key: e.config.apiKey,
                ...a
            }).slice(1),
            s = await e._getAdditionalHeaders();
        s[`Content-Type`] = `application/json`, e.languageCode && (s[`X-Firebase-Locale`] = e.languageCode);
        let c = {
            method: t,
            headers: s,
            ...i
        };
        return ae() || (c.referrerPolicy = `no-referrer`), e.emulatorConfig && Oe(e.emulatorConfig.host) && (c.credentials = `include`), An.fetch()(await Fn(e, e.config.apiHost, n, o), c)
    })
}
async function Pn(e, t, n) {
    e._canInitEmulator = !1;
    let r = { ...jn,
        ...t
    };
    try {
        let t = new Ln(e),
            i = await Promise.race([n(), t.promise]);
        t.clearNetworkTimeout();
        let a = await i.json();
        if (`needConfirmation` in a) throw Rn(e, `account-exists-with-different-credential`, a);
        if (i.ok && !(`errorMessage` in a)) return a; {
            let [t, n] = (i.ok ? a.errorMessage : a.error.message).split(` : `);
            if (t === `FEDERATED_USER_ID_ALREADY_LINKED`) throw Rn(e, `credential-already-in-use`, a);
            if (t === `EMAIL_EXISTS`) throw Rn(e, `email-already-in-use`, a);
            if (t === `USER_DISABLED`) throw Rn(e, `user-disabled`, a);
            let o = r[t] || t.toLowerCase().replace(/[_\s]+/g, `-`);
            if (n) throw bn(e, o, n);
            k(e, o)
        }
    } catch (t) {
        if (t instanceof m) throw t;
        k(e, `network-request-failed`, {
            message: String(t)
        })
    }
}
async function L(e, t, n, r, i = {}) {
    let a = await I(e, t, n, r, i);
    return `mfaPendingCredential` in a && k(e, `multi-factor-auth-required`, {
        _serverResponse: a
    }), a
}
async function Fn(e, t, n, r) {
    let i = `${t}${n}?${r}`,
        a = e,
        o = a.config.emulator ? kn(e.config, i) : `${e.config.apiScheme}://${i}`;
    return Mn.includes(n) && (await a._persistenceManagerAvailable, a._getPersistenceType() === `COOKIE`) ? a._getPersistence()._getFinalTarget(o).toString() : o
}

function In(e) {
    switch (e) {
        case `ENFORCE`:
            return `ENFORCE`;
        case `AUDIT`:
            return `AUDIT`;
        case `OFF`:
            return `OFF`;
        default:
            return `ENFORCEMENT_STATE_UNSPECIFIED`
    }
}
var Ln = class {
    clearNetworkTimeout() {
        clearTimeout(this.timer)
    }
    constructor(e) {
        this.auth = e, this.timer = null, this.promise = new Promise((e, t) => {
            this.timer = setTimeout(() => t(A(this.auth, `network-request-failed`)), Nn.get())
        })
    }
};

function Rn(e, t, n) {
    let r = {
        appName: e.name
    };
    n.email && (r.email = n.email), n.phoneNumber && (r.phoneNumber = n.phoneNumber);
    let i = A(e, t, r);
    return i.customData._tokenResponse = n, i
}

function zn(e) {
    return e !== void 0 && e.enterprise !== void 0
}
var Bn = class {
    constructor(e) {
        if (this.siteKey = ``, this.recaptchaEnforcementState = [], e.recaptchaKey === void 0) throw Error(`recaptchaKey undefined`);
        this.siteKey = e.recaptchaKey.split(`/`)[3], this.recaptchaEnforcementState = e.recaptchaEnforcementState
    }
    getProviderEnforcementState(e) {
        if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) return null;
        for (let t of this.recaptchaEnforcementState)
            if (t.provider && t.provider === e) return In(t.enforcementState);
        return null
    }
    isProviderEnabled(e) {
        return this.getProviderEnforcementState(e) === `ENFORCE` || this.getProviderEnforcementState(e) === `AUDIT`
    }
    isAnyProviderEnabled() {
        return this.isProviderEnabled(`EMAIL_PASSWORD_PROVIDER`) || this.isProviderEnabled(`PHONE_PROVIDER`)
    }
};
async function Vn(e, t) {
    return I(e, `GET`, `/v2/recaptchaConfig`, F(e, t))
}
async function Hn(e, t) {
    return I(e, `POST`, `/v1/accounts:delete`, t)
}
async function Un(e, t) {
    return I(e, `POST`, `/v1/accounts:update`, t)
}
async function Wn(e, t) {
    return I(e, `POST`, `/v1/accounts:lookup`, t)
}

function Gn(e) {
    if (e) try {
        let t = new Date(Number(e));
        if (!isNaN(t.getTime())) return t.toUTCString()
    } catch {}
}

function Kn(e, t = !1) {
    return v(e).getIdToken(t)
}
async function qn(e, t = !1) {
    let n = v(e),
        r = await n.getIdToken(t),
        i = Yn(r);
    M(i && i.exp && i.auth_time && i.iat, n.auth, `internal-error`);
    let a = typeof i.firebase == `object` ? i.firebase : void 0,
        o = a ?.sign_in_provider;
    return {
        claims: i,
        token: r,
        authTime: Gn(Jn(i.auth_time)),
        issuedAtTime: Gn(Jn(i.iat)),
        expirationTime: Gn(Jn(i.exp)),
        signInProvider: o || null,
        signInSecondFactor: a ?.sign_in_second_factor || null
    }
}

function Jn(e) {
    return Number(e) * 1e3
}

function Yn(e) {
    let [t, n, r] = e.split(`.`);
    if (t === void 0 || n === void 0 || r === void 0) return yn(`JWT malformed, contained fewer than 3 sections`), null;
    try {
        let e = s(n);
        return e ? JSON.parse(e) : (yn(`Failed to decode base64 JWT payload`), null)
    } catch (e) {
        return yn(`Caught error parsing JWT payload as JSON`, e ?.toString()), null
    }
}

function Xn(e) {
    let t = Yn(e);
    return M(t, `internal-error`), M(t.exp !== void 0, `internal-error`), M(t.iat !== void 0, `internal-error`), Number(t.exp) - Number(t.iat)
}
async function R(e, t, n = !1) {
    if (n) return t;
    try {
        return await t
    } catch (t) {
        throw t instanceof m && Zn(t) && e.auth.currentUser === e && await e.auth.signOut(), t
    }
}

function Zn({
    code: e
}) {
    return e === `auth/user-disabled` || e === `auth/user-token-expired`
}
var Qn = class {
        constructor(e) {
            this.user = e, this.isRunning = !1, this.timerId = null, this.errorBackoff = 3e4
        }
        _start() {
            this.isRunning || (this.isRunning = !0, this.schedule())
        }
        _stop() {
            this.isRunning && (this.isRunning = !1, this.timerId !== null && clearTimeout(this.timerId))
        }
        getInterval(e) {
            if (e) {
                let e = this.errorBackoff;
                return this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4), e
            } else {
                this.errorBackoff = 3e4;
                let e = (this.user.stsTokenManager.expirationTime ?? 0) - Date.now() - 3e5;
                return Math.max(0, e)
            }
        }
        schedule(e = !1) {
            if (!this.isRunning) return;
            let t = this.getInterval(e);
            this.timerId = setTimeout(async () => {
                await this.iteration()
            }, t)
        }
        async iteration() {
            try {
                await this.user.getIdToken(!0)
            } catch (e) {
                e ?.code === `auth/network-request-failed` && this.schedule(!0);
                return
            }
            this.schedule()
        }
    },
    $n = class {
        constructor(e, t) {
            this.createdAt = e, this.lastLoginAt = t, this._initializeTime()
        }
        _initializeTime() {
            this.lastSignInTime = Gn(this.lastLoginAt), this.creationTime = Gn(this.createdAt)
        }
        _copy(e) {
            this.createdAt = e.createdAt, this.lastLoginAt = e.lastLoginAt, this._initializeTime()
        }
        toJSON() {
            return {
                createdAt: this.createdAt,
                lastLoginAt: this.lastLoginAt
            }
        }
    };
async function z(e) {
    let t = e.auth,
        n = await R(e, Wn(t, {
            idToken: await e.getIdToken()
        }));
    M(n ?.users.length, t, `internal-error`);
    let r = n.users[0];
    e._notifyReloadListener(r);
    let i = r.providerUserInfo ?.length ? nr(r.providerUserInfo) : [],
        a = tr(e.providerData, i),
        o = e.isAnonymous,
        s = !(e.email && r.passwordHash) && !a ?.length,
        c = o ? s : !1,
        l = {
            uid: r.localId,
            displayName: r.displayName || null,
            photoURL: r.photoUrl || null,
            email: r.email || null,
            emailVerified: r.emailVerified || !1,
            phoneNumber: r.phoneNumber || null,
            tenantId: r.tenantId || null,
            providerData: a,
            metadata: new $n(r.createdAt, r.lastLoginAt),
            isAnonymous: c
        };
    Object.assign(e, l)
}
async function er(e) {
    let t = v(e);
    await z(t), await t.auth._persistUserIfCurrent(t), t.auth._notifyListenersIfCurrent(t)
}

function tr(e, t) {
    return [...e.filter(e => !t.some(t => t.providerId === e.providerId)), ...t]
}

function nr(e) {
    return e.map(({
        providerId: e,
        ...t
    }) => ({
        providerId: e,
        uid: t.rawId || ``,
        displayName: t.displayName || null,
        email: t.email || null,
        phoneNumber: t.phoneNumber || null,
        photoURL: t.photoUrl || null
    }))
}
async function rr(e, t) {
    let n = await Pn(e, {}, async () => {
        let n = _e({
                grant_type: `refresh_token`,
                refresh_token: t
            }).slice(1),
            {
                tokenApiHost: r,
                apiKey: i
            } = e.config,
            a = await Fn(e, r, `/v1/token`, `key=${i}`),
            o = await e._getAdditionalHeaders();
        o[`Content-Type`] = `application/x-www-form-urlencoded`;
        let s = {
            method: `POST`,
            headers: o,
            body: n
        };
        return e.emulatorConfig && Oe(e.emulatorConfig.host) && (s.credentials = `include`), An.fetch()(a, s)
    });
    return {
        accessToken: n.access_token,
        expiresIn: n.expires_in,
        refreshToken: n.refresh_token
    }
}
async function ir(e, t) {
    return I(e, `POST`, `/v2/accounts:revokeToken`, F(e, t))
}
var ar = class e {
    constructor() {
        this.refreshToken = null, this.accessToken = null, this.expirationTime = null
    }
    get isExpired() {
        return !this.expirationTime || Date.now() > this.expirationTime - 3e4
    }
    updateFromServerResponse(e) {
        M(e.idToken, `internal-error`), M(e.idToken !== void 0, `internal-error`), M(e.refreshToken !== void 0, `internal-error`);
        let t = `expiresIn` in e && e.expiresIn !== void 0 ? Number(e.expiresIn) : Xn(e.idToken);
        this.updateTokensAndExpiration(e.idToken, e.refreshToken, t)
    }
    updateFromIdToken(e) {
        M(e.length !== 0, `internal-error`);
        let t = Xn(e);
        this.updateTokensAndExpiration(e, null, t)
    }
    async getToken(e, t = !1) {
        return !t && this.accessToken && !this.isExpired ? this.accessToken : (M(this.refreshToken, e, `user-token-expired`), this.refreshToken ? (await this.refresh(e, this.refreshToken), this.accessToken) : null)
    }
    clearRefreshToken() {
        this.refreshToken = null
    }
    async refresh(e, t) {
        let {
            accessToken: n,
            refreshToken: r,
            expiresIn: i
        } = await rr(e, t);
        this.updateTokensAndExpiration(n, r, Number(i))
    }
    updateTokensAndExpiration(e, t, n) {
        this.refreshToken = t || null, this.accessToken = e || null, this.expirationTime = Date.now() + n * 1e3
    }
    static fromJSON(t, n) {
        let {
            refreshToken: r,
            accessToken: i,
            expirationTime: a
        } = n, o = new e;
        return r && (M(typeof r == `string`, `internal-error`, {
            appName: t
        }), o.refreshToken = r), i && (M(typeof i == `string`, `internal-error`, {
            appName: t
        }), o.accessToken = i), a && (M(typeof a == `number`, `internal-error`, {
            appName: t
        }), o.expirationTime = a), o
    }
    toJSON() {
        return {
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            expirationTime: this.expirationTime
        }
    }
    _assign(e) {
        this.accessToken = e.accessToken, this.refreshToken = e.refreshToken, this.expirationTime = e.expirationTime
    }
    _clone() {
        return Object.assign(new e, this.toJSON())
    }
    _performRefresh() {
        return N(`not implemented`)
    }
};

function B(e, t) {
    M(typeof e == `string` || e === void 0, `internal-error`, {
        appName: t
    })
}
var V = class e {
        constructor({
            uid: e,
            auth: t,
            stsTokenManager: n,
            ...r
        }) {
            this.providerId = `firebase`, this.proactiveRefresh = new Qn(this), this.reloadUserInfo = null, this.reloadListener = null, this.uid = e, this.auth = t, this.stsTokenManager = n, this.accessToken = n.accessToken, this.displayName = r.displayName || null, this.email = r.email || null, this.emailVerified = r.emailVerified || !1, this.phoneNumber = r.phoneNumber || null, this.photoURL = r.photoURL || null, this.isAnonymous = r.isAnonymous || !1, this.tenantId = r.tenantId || null, this.providerData = r.providerData ? [...r.providerData] : [], this.metadata = new $n(r.createdAt || void 0, r.lastLoginAt || void 0)
        }
        async getIdToken(e) {
            let t = await R(this, this.stsTokenManager.getToken(this.auth, e));
            return M(t, this.auth, `internal-error`), this.accessToken !== t && (this.accessToken = t, await this.auth._persistUserIfCurrent(this), this.auth._notifyListenersIfCurrent(this)), t
        }
        getIdTokenResult(e) {
            return qn(this, e)
        }
        reload() {
            return er(this)
        }
        _assign(e) {
            this !== e && (M(this.uid === e.uid, this.auth, `internal-error`), this.displayName = e.displayName, this.photoURL = e.photoURL, this.email = e.email, this.emailVerified = e.emailVerified, this.phoneNumber = e.phoneNumber, this.isAnonymous = e.isAnonymous, this.tenantId = e.tenantId, this.providerData = e.providerData.map(e => ({ ...e
            })), this.metadata._copy(e.metadata), this.stsTokenManager._assign(e.stsTokenManager))
        }
        _clone(t) {
            let n = new e({ ...this,
                auth: t,
                stsTokenManager: this.stsTokenManager._clone()
            });
            return n.metadata._copy(this.metadata), n
        }
        _onReload(e) {
            M(!this.reloadListener, this.auth, `internal-error`), this.reloadListener = e, this.reloadUserInfo &&= (this._notifyReloadListener(this.reloadUserInfo), null)
        }
        _notifyReloadListener(e) {
            this.reloadListener ? this.reloadListener(e) : this.reloadUserInfo = e
        }
        _startProactiveRefresh() {
            this.proactiveRefresh._start()
        }
        _stopProactiveRefresh() {
            this.proactiveRefresh._stop()
        }
        async _updateTokensIfNecessary(e, t = !1) {
            let n = !1;
            e.idToken && e.idToken !== this.stsTokenManager.accessToken && (this.stsTokenManager.updateFromServerResponse(e), n = !0), t && await z(this), await this.auth._persistUserIfCurrent(this), n && this.auth._notifyListenersIfCurrent(this)
        }
        async delete() {
            if (E(this.auth.app)) return Promise.reject(j(this.auth));
            let e = await this.getIdToken();
            return await R(this, Hn(this.auth, {
                idToken: e
            })), this.stsTokenManager.clearRefreshToken(), this.auth.signOut()
        }
        toJSON() {
            return {
                uid: this.uid,
                email: this.email || void 0,
                emailVerified: this.emailVerified,
                displayName: this.displayName || void 0,
                isAnonymous: this.isAnonymous,
                photoURL: this.photoURL || void 0,
                phoneNumber: this.phoneNumber || void 0,
                tenantId: this.tenantId || void 0,
                providerData: this.providerData.map(e => ({ ...e
                })),
                stsTokenManager: this.stsTokenManager.toJSON(),
                _redirectEventId: this._redirectEventId,
                ...this.metadata.toJSON(),
                apiKey: this.auth.config.apiKey,
                appName: this.auth.name
            }
        }
        get refreshToken() {
            return this.stsTokenManager.refreshToken || ``
        }
        static _fromJSON(t, n) {
            let r = n.displayName ?? void 0,
                i = n.email ?? void 0,
                a = n.phoneNumber ?? void 0,
                o = n.photoURL ?? void 0,
                s = n.tenantId ?? void 0,
                c = n._redirectEventId ?? void 0,
                l = n.createdAt ?? void 0,
                u = n.lastLoginAt ?? void 0,
                {
                    uid: d,
                    emailVerified: f,
                    isAnonymous: ee,
                    providerData: te,
                    stsTokenManager: ne
                } = n;
            M(d && ne, t, `internal-error`);
            let re = ar.fromJSON(this.name, ne);
            M(typeof d == `string`, t, `internal-error`), B(r, t.name), B(i, t.name), M(typeof f == `boolean`, t, `internal-error`), M(typeof ee == `boolean`, t, `internal-error`), B(a, t.name), B(o, t.name), B(s, t.name), B(c, t.name), B(l, t.name), B(u, t.name);
            let p = new e({
                uid: d,
                auth: t,
                email: i,
                emailVerified: f,
                displayName: r,
                isAnonymous: ee,
                photoURL: o,
                phoneNumber: a,
                tenantId: s,
                stsTokenManager: re,
                createdAt: l,
                lastLoginAt: u
            });
            return te && Array.isArray(te) && (p.providerData = te.map(e => ({ ...e
            }))), c && (p._redirectEventId = c), p
        }
        static async _fromIdTokenResponse(t, n, r = !1) {
            let i = new ar;
            i.updateFromServerResponse(n);
            let a = new e({
                uid: n.localId,
                auth: t,
                stsTokenManager: i,
                isAnonymous: r
            });
            return await z(a), a
        }
        static async _fromGetAccountInfoResponse(t, n, r) {
            let i = n.users[0];
            M(i.localId !== void 0, `internal-error`);
            let a = i.providerUserInfo === void 0 ? [] : nr(i.providerUserInfo),
                o = !(i.email && i.passwordHash) && !a ?.length,
                s = new ar;
            s.updateFromIdToken(r);
            let c = new e({
                    uid: i.localId,
                    auth: t,
                    stsTokenManager: s,
                    isAnonymous: o
                }),
                l = {
                    uid: i.localId,
                    displayName: i.displayName || null,
                    photoURL: i.photoUrl || null,
                    email: i.email || null,
                    emailVerified: i.emailVerified || !1,
                    phoneNumber: i.phoneNumber || null,
                    tenantId: i.tenantId || null,
                    providerData: a,
                    metadata: new $n(i.createdAt, i.lastLoginAt),
                    isAnonymous: !(i.email && i.passwordHash) && !a ?.length
                };
            return Object.assign(c, l), c
        }
    },
    or = new Map;

function H(e) {
    P(e instanceof Function, `Expected a class definition`);
    let t = or.get(e);
    return t ? (P(t instanceof e, `Instance stored in cache mismatched with class`), t) : (t = new e, or.set(e, t), t)
}
var sr = class {
    constructor() {
        this.type = `NONE`, this.storage = {}
    }
    async _isAvailable() {
        return !0
    }
    async _set(e, t) {
        this.storage[e] = t
    }
    async _get(e) {
        let t = this.storage[e];
        return t === void 0 ? null : t
    }
    async _remove(e) {
        delete this.storage[e]
    }
    _addListener(e, t) {}
    _removeListener(e, t) {}
};
sr.type = `NONE`;
var cr = sr;

function lr(e, t, n) {
    return `firebase:${e}:${t}:${n}`
}
var ur = class e {
    constructor(e, t, n) {
        this.persistence = e, this.auth = t, this.userKey = n;
        let {
            config: r,
            name: i
        } = this.auth;
        this.fullUserKey = lr(this.userKey, r.apiKey, i), this.fullPersistenceKey = lr(`persistence`, r.apiKey, i), this.boundEventHandler = t._onStorageEvent.bind(t), this.persistence._addListener(this.fullUserKey, this.boundEventHandler)
    }
    setCurrentUser(e) {
        return this.persistence._set(this.fullUserKey, e.toJSON())
    }
    async getCurrentUser() {
        let e = await this.persistence._get(this.fullUserKey);
        if (!e) return null;
        if (typeof e == `string`) {
            let t = await Wn(this.auth, {
                idToken: e
            }).catch(() => void 0);
            return t ? V._fromGetAccountInfoResponse(this.auth, t, e) : null
        }
        return V._fromJSON(this.auth, e)
    }
    removeCurrentUser() {
        return this.persistence._remove(this.fullUserKey)
    }
    savePersistenceForRedirect() {
        return this.persistence._set(this.fullPersistenceKey, this.persistence.type)
    }
    async setPersistence(e) {
        if (this.persistence === e) return;
        let t = await this.getCurrentUser();
        if (await this.removeCurrentUser(), this.persistence = e, t) return this.setCurrentUser(t)
    }
    delete() {
        this.persistence._removeListener(this.fullUserKey, this.boundEventHandler)
    }
    static async create(t, n, r = `authUser`) {
        if (!n.length) return new e(H(cr), t, r);
        let i = (await Promise.all(n.map(async e => {
                if (await e._isAvailable()) return e
            }))).filter(e => e),
            a = i[0] || H(cr),
            o = lr(r, t.config.apiKey, t.name),
            s = null;
        for (let e of n) try {
            let n = await e._get(o);
            if (n) {
                let r;
                if (typeof n == `string`) {
                    let e = await Wn(t, {
                        idToken: n
                    }).catch(() => void 0);
                    if (!e) break;
                    r = await V._fromGetAccountInfoResponse(t, e, n)
                } else r = V._fromJSON(t, n);
                e !== a && (s = r), a = e;
                break
            }
        } catch {}
        let c = i.filter(e => e._shouldAllowMigration);
        return !a._shouldAllowMigration || !c.length ? new e(a, t, r) : (a = c[0], s && await a._set(o, s.toJSON()), await Promise.all(n.map(async e => {
            if (e !== a) try {
                await e._remove(o)
            } catch {}
        })), new e(a, t, r))
    }
};

function dr(e) {
    let t = e.toLowerCase();
    if (t.includes(`opera/`) || t.includes(`opr/`) || t.includes(`opios/`)) return `Opera`;
    if (hr(t)) return `IEMobile`;
    if (t.includes(`msie`) || t.includes(`trident/`)) return `IE`;
    if (t.includes(`edge/`)) return `Edge`;
    if (fr(t)) return `Firefox`;
    if (t.includes(`silk/`)) return `Silk`;
    if (_r(t)) return `Blackberry`;
    if (vr(t)) return `Webos`;
    if (pr(t)) return `Safari`;
    if ((t.includes(`chrome/`) || mr(t)) && !t.includes(`edge/`)) return `Chrome`;
    if (gr(t)) return `Android`; {
        let t = e.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);
        if (t ?.length === 2) return t[1]
    }
    return `Other`
}

function fr(e = p()) {
    return /firefox\//i.test(e)
}

function pr(e = p()) {
    let t = e.toLowerCase();
    return t.includes(`safari/`) && !t.includes(`chrome/`) && !t.includes(`crios/`) && !t.includes(`android`)
}

function mr(e = p()) {
    return /crios\//i.test(e)
}

function hr(e = p()) {
    return /iemobile/i.test(e)
}

function gr(e = p()) {
    return /android/i.test(e)
}

function _r(e = p()) {
    return /blackberry/i.test(e)
}

function vr(e = p()) {
    return /webos/i.test(e)
}

function yr(e = p()) {
    return /iphone|ipad|ipod/i.test(e) || /macintosh/i.test(e) && /mobile/i.test(e)
}

function br(e = p()) {
    return yr(e) && !!window.navigator ?.standalone
}

function xr() {
    return ce() && document.documentMode === 10
}

function Sr(e = p()) {
    return yr(e) || gr(e) || vr(e) || _r(e) || /windows phone/i.test(e) || hr(e)
}

function Cr(e, t = []) {
    let n;
    switch (e) {
        case `Browser`:
            n = dr(p());
            break;
        case `Worker`:
            n = `${dr(p())}-${e}`;
            break;
        default:
            n = e
    }
    let r = t.length ? t.join(`,`) : `FirebaseCore-web`;
    return `${n}/JsCore/${Kt}/${r}`
}
var wr = class {
    constructor(e) {
        this.auth = e, this.queue = []
    }
    pushCallback(e, t) {
        let n = t => new Promise((n, r) => {
            try {
                n(e(t))
            } catch (e) {
                r(e)
            }
        });
        n.onAbort = t, this.queue.push(n);
        let r = this.queue.length - 1;
        return () => {
            this.queue[r] = () => Promise.resolve()
        }
    }
    async runMiddleware(e) {
        if (this.auth.currentUser === e) return;
        let t = [];
        try {
            for (let n of this.queue) await n(e), n.onAbort && t.push(n.onAbort)
        } catch (e) {
            t.reverse();
            for (let e of t) try {
                e()
            } catch {}
            throw this.auth._errorFactory.create(`login-blocked`, {
                originalMessage: e ?.message
            })
        }
    }
};
async function Tr(e, t = {}) {
    return I(e, `GET`, `/v2/passwordPolicy`, F(e, t))
}
var Er = 6,
    Dr = class {
        constructor(e) {
            let t = e.customStrengthOptions;
            this.customStrengthOptions = {}, this.customStrengthOptions.minPasswordLength = t.minPasswordLength ?? Er, t.maxPasswordLength && (this.customStrengthOptions.maxPasswordLength = t.maxPasswordLength), t.containsLowercaseCharacter !== void 0 && (this.customStrengthOptions.containsLowercaseLetter = t.containsLowercaseCharacter), t.containsUppercaseCharacter !== void 0 && (this.customStrengthOptions.containsUppercaseLetter = t.containsUppercaseCharacter), t.containsNumericCharacter !== void 0 && (this.customStrengthOptions.containsNumericCharacter = t.containsNumericCharacter), t.containsNonAlphanumericCharacter !== void 0 && (this.customStrengthOptions.containsNonAlphanumericCharacter = t.containsNonAlphanumericCharacter), this.enforcementState = e.enforcementState, this.enforcementState === `ENFORCEMENT_STATE_UNSPECIFIED` && (this.enforcementState = `OFF`), this.allowedNonAlphanumericCharacters = e.allowedNonAlphanumericCharacters ?.join(``) ?? ``, this.forceUpgradeOnSignin = e.forceUpgradeOnSignin ?? !1, this.schemaVersion = e.schemaVersion
        }
        validatePassword(e) {
            let t = {
                isValid: !0,
                passwordPolicy: this
            };
            return this.validatePasswordLengthOptions(e, t), this.validatePasswordCharacterOptions(e, t), t.isValid &&= t.meetsMinPasswordLength ?? !0, t.isValid &&= t.meetsMaxPasswordLength ?? !0, t.isValid &&= t.containsLowercaseLetter ?? !0, t.isValid &&= t.containsUppercaseLetter ?? !0, t.isValid &&= t.containsNumericCharacter ?? !0, t.isValid &&= t.containsNonAlphanumericCharacter ?? !0, t
        }
        validatePasswordLengthOptions(e, t) {
            let n = this.customStrengthOptions.minPasswordLength,
                r = this.customStrengthOptions.maxPasswordLength;
            n && (t.meetsMinPasswordLength = e.length >= n), r && (t.meetsMaxPasswordLength = e.length <= r)
        }
        validatePasswordCharacterOptions(e, t) {
            this.updatePasswordCharacterOptionsStatuses(t, !1, !1, !1, !1);
            let n;
            for (let r = 0; r < e.length; r++) n = e.charAt(r), this.updatePasswordCharacterOptionsStatuses(t, n >= `a` && n <= `z`, n >= `A` && n <= `Z`, n >= `0` && n <= `9`, this.allowedNonAlphanumericCharacters.includes(n))
        }
        updatePasswordCharacterOptionsStatuses(e, t, n, r, i) {
            this.customStrengthOptions.containsLowercaseLetter && (e.containsLowercaseLetter ||= t), this.customStrengthOptions.containsUppercaseLetter && (e.containsUppercaseLetter ||= n), this.customStrengthOptions.containsNumericCharacter && (e.containsNumericCharacter ||= r), this.customStrengthOptions.containsNonAlphanumericCharacter && (e.containsNonAlphanumericCharacter ||= i)
        }
    },
    Or = class {
        constructor(e, t, n, r) {
            this.app = e, this.heartbeatServiceProvider = t, this.appCheckServiceProvider = n, this.config = r, this.currentUser = null, this.emulatorConfig = null, this.operations = Promise.resolve(), this.authStateSubscription = new kr(this), this.idTokenSubscription = new kr(this), this.beforeStateQueue = new wr(this), this.redirectUser = null, this.isProactiveRefreshEnabled = !1, this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1, this._canInitEmulator = !0, this._isInitialized = !1, this._deleted = !1, this._initializationPromise = null, this._popupRedirectResolver = null, this._errorFactory = gn, this._agentRecaptchaConfig = null, this._tenantRecaptchaConfigs = {}, this._projectPasswordPolicy = null, this._tenantPasswordPolicies = {}, this._resolvePersistenceManagerAvailable = void 0, this.lastNotifiedUid = void 0, this.languageCode = null, this.tenantId = null, this.settings = {
                appVerificationDisabledForTesting: !1
            }, this.frameworks = [], this.name = e.name, this.clientVersion = r.sdkClientVersion, this._persistenceManagerAvailable = new Promise(e => this._resolvePersistenceManagerAvailable = e)
        }
        _initializeWithPersistence(e, t) {
            return t && (this._popupRedirectResolver = H(t)), this._initializationPromise = this.queue(async () => {
                if (!this._deleted && (this.persistenceManager = await ur.create(this, e), this._resolvePersistenceManagerAvailable ?.(), !this._deleted)) {
                    if (this._popupRedirectResolver ?._shouldInitProactively) try {
                        await this._popupRedirectResolver._initialize(this)
                    } catch {}
                    await this.initializeCurrentUser(t), this.lastNotifiedUid = this.currentUser ?.uid || null, !this._deleted && (this._isInitialized = !0)
                }
            }), this._initializationPromise
        }
        async _onStorageEvent() {
            if (this._deleted) return;
            let e = await this.assertedPersistence.getCurrentUser();
            if (!(!this.currentUser && !e)) {
                if (this.currentUser && e && this.currentUser.uid === e.uid) {
                    this._currentUser._assign(e), await this.currentUser.getIdToken();
                    return
                }
                await this._updateCurrentUser(e, !0)
            }
        }
        async initializeCurrentUserFromIdToken(e) {
            try {
                let t = await Wn(this, {
                        idToken: e
                    }),
                    n = await V._fromGetAccountInfoResponse(this, t, e);
                await this.directlySetCurrentUser(n)
            } catch (e) {
                console.warn(`FirebaseServerApp could not login user with provided authIdToken: `, e), await this.directlySetCurrentUser(null)
            }
        }
        async initializeCurrentUser(e) {
            if (E(this.app)) {
                let e = this.app.settings.authIdToken;
                return e ? new Promise(t => {
                    setTimeout(() => this.initializeCurrentUserFromIdToken(e).then(t, t))
                }) : this.directlySetCurrentUser(null)
            }
            let t = await this.assertedPersistence.getCurrentUser(),
                n = t,
                r = !1;
            if (e && this.config.authDomain) {
                await this.getOrInitRedirectPersistenceManager();
                let t = this.redirectUser ?._redirectEventId,
                    i = n ?._redirectEventId,
                    a = await this.tryRedirectSignIn(e);
                (!t || t === i) && a ?.user && (n = a.user, r = !0)
            }
            if (!n) return this.directlySetCurrentUser(null);
            if (!n._redirectEventId) {
                if (r) try {
                    await this.beforeStateQueue.runMiddleware(n)
                } catch (e) {
                    n = t, this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e))
                }
                return n ? this.reloadAndSetCurrentUserOrClear(n) : this.directlySetCurrentUser(null)
            }
            return M(this._popupRedirectResolver, this, `argument-error`), await this.getOrInitRedirectPersistenceManager(), this.redirectUser && this.redirectUser._redirectEventId === n._redirectEventId ? this.directlySetCurrentUser(n) : this.reloadAndSetCurrentUserOrClear(n)
        }
        async tryRedirectSignIn(e) {
            let t = null;
            try {
                t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0)
            } catch {
                await this._setRedirectUser(null)
            }
            return t
        }
        async reloadAndSetCurrentUserOrClear(e) {
            try {
                await z(e)
            } catch (e) {
                if (e ?.code !== `auth/network-request-failed`) return this.directlySetCurrentUser(null)
            }
            return this.directlySetCurrentUser(e)
        }
        useDeviceLanguage() {
            this.languageCode = Dn()
        }
        async _delete() {
            this._deleted = !0
        }
        async updateCurrentUser(e) {
            if (E(this.app)) return Promise.reject(j(this));
            let t = e ? v(e) : null;
            return t && M(t.auth.config.apiKey === this.config.apiKey, this, `invalid-user-token`), this._updateCurrentUser(t && t._clone(this))
        }
        async _updateCurrentUser(e, t = !1) {
            if (!this._deleted) return e && M(this.tenantId === e.tenantId, this, `tenant-id-mismatch`), t || await this.beforeStateQueue.runMiddleware(e), this.queue(async () => {
                await this.directlySetCurrentUser(e), this.notifyAuthListeners()
            })
        }
        async signOut() {
            return E(this.app) ? Promise.reject(j(this)) : (await this.beforeStateQueue.runMiddleware(null), (this.redirectPersistenceManager || this._popupRedirectResolver) && await this._setRedirectUser(null), this._updateCurrentUser(null, !0))
        }
        setPersistence(e) {
            return E(this.app) ? Promise.reject(j(this)) : this.queue(async () => {
                await this.assertedPersistence.setPersistence(H(e))
            })
        }
        _getRecaptchaConfig() {
            return this.tenantId == null ? this._agentRecaptchaConfig : this._tenantRecaptchaConfigs[this.tenantId]
        }
        async validatePassword(e) {
            this._getPasswordPolicyInternal() || await this._updatePasswordPolicy();
            let t = this._getPasswordPolicyInternal();
            return t.schemaVersion === this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION ? t.validatePassword(e) : Promise.reject(this._errorFactory.create(`unsupported-password-policy-schema-version`, {}))
        }
        _getPasswordPolicyInternal() {
            return this.tenantId === null ? this._projectPasswordPolicy : this._tenantPasswordPolicies[this.tenantId]
        }
        async _updatePasswordPolicy() {
            let e = new Dr(await Tr(this));
            this.tenantId === null ? this._projectPasswordPolicy = e : this._tenantPasswordPolicies[this.tenantId] = e
        }
        _getPersistenceType() {
            return this.assertedPersistence.persistence.type
        }
        _getPersistence() {
            return this.assertedPersistence.persistence
        }
        _updateErrorMap(e) {
            this._errorFactory = new h(`auth`, `Firebase`, e())
        }
        onAuthStateChanged(e, t, n) {
            return this.registerStateListener(this.authStateSubscription, e, t, n)
        }
        beforeAuthStateChanged(e, t) {
            return this.beforeStateQueue.pushCallback(e, t)
        }
        onIdTokenChanged(e, t, n) {
            return this.registerStateListener(this.idTokenSubscription, e, t, n)
        }
        authStateReady() {
            return new Promise((e, t) => {
                if (this.currentUser) e();
                else {
                    let n = this.onAuthStateChanged(() => {
                        n(), e()
                    }, t)
                }
            })
        }
        async revokeAccessToken(e) {
            if (this.currentUser) {
                let t = {
                    providerId: `apple.com`,
                    tokenType: `ACCESS_TOKEN`,
                    token: e,
                    idToken: await this.currentUser.getIdToken()
                };
                this.tenantId != null && (t.tenantId = this.tenantId), await ir(this, t)
            }
        }
        toJSON() {
            return {
                apiKey: this.config.apiKey,
                authDomain: this.config.authDomain,
                appName: this.name,
                currentUser: this._currentUser ?.toJSON()
            }
        }
        async _setRedirectUser(e, t) {
            let n = await this.getOrInitRedirectPersistenceManager(t);
            return e === null ? n.removeCurrentUser() : n.setCurrentUser(e)
        }
        async getOrInitRedirectPersistenceManager(e) {
            if (!this.redirectPersistenceManager) {
                let t = e && H(e) || this._popupRedirectResolver;
                M(t, this, `argument-error`), this.redirectPersistenceManager = await ur.create(this, [H(t._redirectPersistence)], `redirectUser`), this.redirectUser = await this.redirectPersistenceManager.getCurrentUser()
            }
            return this.redirectPersistenceManager
        }
        async _redirectUserForId(e) {
            return this._isInitialized && await this.queue(async () => {}), this._currentUser ?._redirectEventId === e ? this._currentUser : this.redirectUser ?._redirectEventId === e ? this.redirectUser : null
        }
        async _persistUserIfCurrent(e) {
            if (e === this.currentUser) return this.queue(async () => this.directlySetCurrentUser(e))
        }
        _notifyListenersIfCurrent(e) {
            e === this.currentUser && this.notifyAuthListeners()
        }
        _key() {
            return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`
        }
        _startProactiveRefresh() {
            this.isProactiveRefreshEnabled = !0, this.currentUser && this._currentUser._startProactiveRefresh()
        }
        _stopProactiveRefresh() {
            this.isProactiveRefreshEnabled = !1, this.currentUser && this._currentUser._stopProactiveRefresh()
        }
        get _currentUser() {
            return this.currentUser
        }
        notifyAuthListeners() {
            if (!this._isInitialized) return;
            this.idTokenSubscription.next(this.currentUser);
            let e = this.currentUser ?.uid ?? null;
            this.lastNotifiedUid !== e && (this.lastNotifiedUid = e, this.authStateSubscription.next(this.currentUser))
        }
        registerStateListener(e, t, n, r) {
            if (this._deleted) return () => {};
            let i = typeof t == `function` ? t : t.next.bind(t),
                a = !1,
                o = this._isInitialized ? Promise.resolve() : this._initializationPromise;
            if (M(o, this, `internal-error`), o.then(() => {
                    a || i(this.currentUser)
                }), typeof t == `function`) {
                let i = e.addObserver(t, n, r);
                return () => {
                    a = !0, i()
                }
            } else {
                let n = e.addObserver(t);
                return () => {
                    a = !0, n()
                }
            }
        }
        async directlySetCurrentUser(e) {
            this.currentUser && this.currentUser !== e && this._currentUser._stopProactiveRefresh(), e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(), this.currentUser = e, e ? await this.assertedPersistence.setCurrentUser(e) : await this.assertedPersistence.removeCurrentUser()
        }
        queue(e) {
            return this.operations = this.operations.then(e, e), this.operations
        }
        get assertedPersistence() {
            return M(this.persistenceManager, this, `internal-error`), this.persistenceManager
        }
        _logFramework(e) {
            !e || this.frameworks.includes(e) || (this.frameworks.push(e), this.frameworks.sort(), this.clientVersion = Cr(this.config.clientPlatform, this._getFrameworks()))
        }
        _getFrameworks() {
            return this.frameworks
        }
        async _getAdditionalHeaders() {
            let e = {
                "X-Client-Version": this.clientVersion
            };
            this.app.options.appId && (e[`X-Firebase-gmpid`] = this.app.options.appId);
            let t = await this.heartbeatServiceProvider.getImmediate({
                optional: !0
            }) ?.getHeartbeatsHeader();
            t && (e[`X-Firebase-Client`] = t);
            let n = await this._getAppCheckToken();
            return n && (e[`X-Firebase-AppCheck`] = n), e
        }
        async _getAppCheckToken() {
            if (E(this.app) && this.app.settings.appCheckToken) return this.app.settings.appCheckToken;
            let e = await this.appCheckServiceProvider.getImmediate({
                optional: !0
            }) ?.getToken();
            return e ?.error && vn(`Error while retrieving App Check token: ${e.error}`), e ?.token
        }
    };

function U(e) {
    return v(e)
}
var kr = class {
        constructor(e) {
            this.auth = e, this.observer = null, this.addObserver = ye(e => this.observer = e)
        }
        get next() {
            return M(this.observer, this.auth, `internal-error`), this.observer.next.bind(this.observer)
        }
    },
    Ar = {
        async loadJS() {
            throw Error(`Unable to load external scripts`)
        },
        recaptchaV2Script: ``,
        recaptchaEnterpriseScript: ``,
        gapiScript: ``
    };

function jr(e) {
    Ar = e
}

function Mr(e) {
    return Ar.loadJS(e)
}

function Nr() {
    return Ar.recaptchaEnterpriseScript
}

function Pr() {
    return Ar.gapiScript
}

function Fr(e) {
    return `__${e}${Math.floor(Math.random()*1e6)}`
}
var Ir = class {
        constructor() {
            this.enterprise = new Lr
        }
        ready(e) {
            e()
        }
        execute(e, t) {
            return Promise.resolve(`token`)
        }
        render(e, t) {
            return ``
        }
    },
    Lr = class {
        ready(e) {
            e()
        }
        execute(e, t) {
            return Promise.resolve(`token`)
        }
        render(e, t) {
            return ``
        }
    },
    Rr = `recaptcha-enterprise`,
    zr = `NO_RECAPTCHA`,
    Br = class {
        constructor(e) {
            this.type = Rr, this.auth = U(e)
        }
        async verify(e = `verify`, t = !1) {
            async function n(e) {
                if (!t) {
                    if (e.tenantId == null && e._agentRecaptchaConfig != null) return e._agentRecaptchaConfig.siteKey;
                    if (e.tenantId != null && e._tenantRecaptchaConfigs[e.tenantId] !== void 0) return e._tenantRecaptchaConfigs[e.tenantId].siteKey
                }
                return new Promise(async (t, n) => {
                    Vn(e, {
                        clientType: `CLIENT_TYPE_WEB`,
                        version: `RECAPTCHA_ENTERPRISE`
                    }).then(r => {
                        if (r.recaptchaKey === void 0) n(Error(`recaptcha Enterprise site key undefined`));
                        else {
                            let n = new Bn(r);
                            return e.tenantId == null ? e._agentRecaptchaConfig = n : e._tenantRecaptchaConfigs[e.tenantId] = n, t(n.siteKey)
                        }
                    }).catch(e => {
                        n(e)
                    })
                })
            }

            function r(t, n, r) {
                let i = window.grecaptcha;
                zn(i) ? i.enterprise.ready(() => {
                    i.enterprise.execute(t, {
                        action: e
                    }).then(e => {
                        n(e)
                    }).catch(() => {
                        n(zr)
                    })
                }) : r(Error(`No reCAPTCHA enterprise script loaded.`))
            }
            return this.auth.settings.appVerificationDisabledForTesting ? new Ir().execute(`siteKey`, {
                action: `verify`
            }) : new Promise((e, i) => {
                n(this.auth).then(n => {
                    if (!t && zn(window.grecaptcha)) r(n, e, i);
                    else {
                        if (typeof window > `u`) {
                            i(Error(`RecaptchaVerifier is only supported in browser`));
                            return
                        }
                        let t = Nr();
                        t.length !== 0 && (t += n), Mr(t).then(() => {
                            r(n, e, i)
                        }).catch(e => {
                            i(e)
                        })
                    }
                }).catch(e => {
                    i(e)
                })
            })
        }
    };
async function Vr(e, t, n, r = !1, i = !1) {
    let a = new Br(e),
        o;
    if (i) o = zr;
    else try {
        o = await a.verify(n)
    } catch {
        o = await a.verify(n, !0)
    }
    let s = { ...t
    };
    if (n === `mfaSmsEnrollment` || n === `mfaSmsSignIn`) {
        if (`phoneEnrollmentInfo` in s) {
            let e = s.phoneEnrollmentInfo.phoneNumber,
                t = s.phoneEnrollmentInfo.recaptchaToken;
            Object.assign(s, {
                phoneEnrollmentInfo: {
                    phoneNumber: e,
                    recaptchaToken: t,
                    captchaResponse: o,
                    clientType: `CLIENT_TYPE_WEB`,
                    recaptchaVersion: `RECAPTCHA_ENTERPRISE`
                }
            })
        } else if (`phoneSignInInfo` in s) {
            let e = s.phoneSignInInfo.recaptchaToken;
            Object.assign(s, {
                phoneSignInInfo: {
                    recaptchaToken: e,
                    captchaResponse: o,
                    clientType: `CLIENT_TYPE_WEB`,
                    recaptchaVersion: `RECAPTCHA_ENTERPRISE`
                }
            })
        }
        return s
    }
    return r ? Object.assign(s, {
        captchaResp: o
    }) : Object.assign(s, {
        captchaResponse: o
    }), Object.assign(s, {
        clientType: `CLIENT_TYPE_WEB`
    }), Object.assign(s, {
        recaptchaVersion: `RECAPTCHA_ENTERPRISE`
    }), s
}
async function W(e, t, n, r, i) {
    return i === `EMAIL_PASSWORD_PROVIDER` ? e._getRecaptchaConfig() ?.isProviderEnabled(`EMAIL_PASSWORD_PROVIDER`) ? r(e, await Vr(e, t, n, n === `getOobCode`)) : r(e, t).catch(async i => i.code === `auth/missing-recaptcha-token` ? (console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`), r(e, await Vr(e, t, n, n === `getOobCode`))) : Promise.reject(i)) : i === `PHONE_PROVIDER` ? e._getRecaptchaConfig() ?.isProviderEnabled(`PHONE_PROVIDER`) ? r(e, await Vr(e, t, n)).catch(async i => e._getRecaptchaConfig() ?.getProviderEnforcementState(`PHONE_PROVIDER`) === `AUDIT` && (i.code === `auth/missing-recaptcha-token` || i.code === `auth/invalid-app-credential`) ? (console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${n} flow.`), r(e, await Vr(e, t, n, !1, !0))) : Promise.reject(i)) : r(e, await Vr(e, t, n, !1, !0)) : Promise.reject(i + ` provider is not supported.`)
}
async function Hr(e) {
    let t = U(e),
        n = new Bn(await Vn(t, {
            clientType: `CLIENT_TYPE_WEB`,
            version: `RECAPTCHA_ENTERPRISE`
        }));
    t.tenantId == null ? t._agentRecaptchaConfig = n : t._tenantRecaptchaConfigs[t.tenantId] = n, n.isAnyProviderEnabled() && new Br(t).verify()
}

function Ur(e, t) {
    let n = T(e, `auth`);
    if (n.isInitialized()) {
        let e = n.getImmediate();
        if (g(n.getOptions(), t ?? {})) return e;
        k(e, `already-initialized`)
    }
    return n.initialize({
        options: t
    })
}

function Wr(e, t) {
    let n = t ?.persistence || [],
        r = (Array.isArray(n) ? n : [n]).map(H);
    t ?.errorMap && e._updateErrorMap(t.errorMap), e._initializeWithPersistence(r, t ?.popupRedirectResolver)
}

function Gr(e, t, n) {
    let r = U(e);
    M(/^https?:\/\//.test(t), r, `invalid-emulator-scheme`);
    let i = !!n ?.disableWarnings,
        a = Kr(t),
        {
            host: o,
            port: s
        } = qr(t),
        c = s === null ? `` : `:${s}`,
        l = {
            url: `${a}//${o}${c}/`
        },
        u = Object.freeze({
            host: o,
            port: s,
            protocol: a.replace(`:`, ``),
            options: Object.freeze({
                disableWarnings: i
            })
        });
    if (!r._canInitEmulator) {
        M(r.config.emulator && r.emulatorConfig, r, `emulator-config-failed`), M(g(l, r.config.emulator) && g(u, r.emulatorConfig), r, `emulator-config-failed`);
        return
    }
    r.config.emulator = l, r.emulatorConfig = u, r.settings.appVerificationDisabledForTesting = !0, Oe(o) ? ke(`${a}//${o}${c}`) : i || Yr()
}

function Kr(e) {
    let t = e.indexOf(`:`);
    return t < 0 ? `` : e.substr(0, t + 1)
}

function qr(e) {
    let t = Kr(e),
        n = /(\/\/)?([^?#/]+)/.exec(e.substr(t.length));
    if (!n) return {
        host: ``,
        port: null
    };
    let r = n[2].split(`@`).pop() || ``,
        i = /^(\[[^\]]+\])(:|$)/.exec(r);
    if (i) {
        let e = i[1];
        return {
            host: e,
            port: Jr(r.substr(e.length + 1))
        }
    } else {
        let [e, t] = r.split(`:`);
        return {
            host: e,
            port: Jr(t)
        }
    }
}

function Jr(e) {
    if (!e) return null;
    let t = Number(e);
    return isNaN(t) ? null : t
}

function Yr() {
    function e() {
        let e = document.createElement(`p`),
            t = e.style;
        e.innerText = `Running in emulator mode. Do not use with production credentials.`, t.position = `fixed`, t.width = `100%`, t.backgroundColor = `#ffffff`, t.border = `.1em solid #000000`, t.color = `#b50000`, t.bottom = `0px`, t.left = `0px`, t.margin = `0px`, t.zIndex = `10000`, t.textAlign = `center`, e.classList.add(`firebase-emulator-warning`), document.body.appendChild(e)
    }
    typeof console < `u` && typeof console.info == `function` && console.info(`WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.`), typeof window < `u` && typeof document < `u` && (document.readyState === `loading` ? window.addEventListener(`DOMContentLoaded`, e) : e())
}
var Xr = class {
    constructor(e, t) {
        this.providerId = e, this.signInMethod = t
    }
    toJSON() {
        return N(`not implemented`)
    }
    _getIdTokenResponse(e) {
        return N(`not implemented`)
    }
    _linkToIdToken(e, t) {
        return N(`not implemented`)
    }
    _getReauthenticationResolver(e) {
        return N(`not implemented`)
    }
};
async function Zr(e, t) {
    return I(e, `POST`, `/v1/accounts:resetPassword`, F(e, t))
}
async function Qr(e, t) {
    return I(e, `POST`, `/v1/accounts:update`, t)
}
async function $r(e, t) {
    return I(e, `POST`, `/v1/accounts:signUp`, t)
}
async function ei(e, t) {
    return I(e, `POST`, `/v1/accounts:update`, F(e, t))
}
async function ti(e, t) {
    return L(e, `POST`, `/v1/accounts:signInWithPassword`, F(e, t))
}
async function ni(e, t) {
    return I(e, `POST`, `/v1/accounts:sendOobCode`, F(e, t))
}
async function ri(e, t) {
    return ni(e, t)
}
async function ii(e, t) {
    return L(e, `POST`, `/v1/accounts:signInWithEmailLink`, F(e, t))
}
async function ai(e, t) {
    return L(e, `POST`, `/v1/accounts:signInWithEmailLink`, F(e, t))
}
var oi = class e extends Xr {
    constructor(e, t, n, r = null) {
        super(`password`, n), this._email = e, this._password = t, this._tenantId = r
    }
    static _fromEmailAndPassword(t, n) {
        return new e(t, n, `password`)
    }
    static _fromEmailAndCode(t, n, r = null) {
        return new e(t, n, `emailLink`, r)
    }
    toJSON() {
        return {
            email: this._email,
            password: this._password,
            signInMethod: this.signInMethod,
            tenantId: this._tenantId
        }
    }
    static fromJSON(e) {
        let t = typeof e == `string` ? JSON.parse(e) : e;
        if (t ?.email && t ?.password) {
            if (t.signInMethod === `password`) return this._fromEmailAndPassword(t.email, t.password);
            if (t.signInMethod === `emailLink`) return this._fromEmailAndCode(t.email, t.password, t.tenantId)
        }
        return null
    }
    async _getIdTokenResponse(e) {
        switch (this.signInMethod) {
            case `password`:
                return W(e, {
                    returnSecureToken: !0,
                    email: this._email,
                    password: this._password,
                    clientType: `CLIENT_TYPE_WEB`
                }, `signInWithPassword`, ti, `EMAIL_PASSWORD_PROVIDER`);
            case `emailLink`:
                return ii(e, {
                    email: this._email,
                    oobCode: this._password
                });
            default:
                k(e, `internal-error`)
        }
    }
    async _linkToIdToken(e, t) {
        switch (this.signInMethod) {
            case `password`:
                return W(e, {
                    idToken: t,
                    returnSecureToken: !0,
                    email: this._email,
                    password: this._password,
                    clientType: `CLIENT_TYPE_WEB`
                }, `signUpPassword`, $r, `EMAIL_PASSWORD_PROVIDER`);
            case `emailLink`:
                return ai(e, {
                    idToken: t,
                    email: this._email,
                    oobCode: this._password
                });
            default:
                k(e, `internal-error`)
        }
    }
    _getReauthenticationResolver(e) {
        return this._getIdTokenResponse(e)
    }
};
async function G(e, t) {
    return L(e, `POST`, `/v1/accounts:signInWithIdp`, F(e, t))
}
var si = `http://localhost`,
    ci = class e extends Xr {
        constructor() {
            super(...arguments), this.pendingToken = null
        }
        static _fromParams(t) {
            let n = new e(t.providerId, t.signInMethod);
            return t.idToken || t.accessToken ? (t.idToken && (n.idToken = t.idToken), t.accessToken && (n.accessToken = t.accessToken), t.nonce && !t.pendingToken && (n.nonce = t.nonce), t.pendingToken && (n.pendingToken = t.pendingToken)) : t.oauthToken && t.oauthTokenSecret ? (n.accessToken = t.oauthToken, n.secret = t.oauthTokenSecret) : k(`argument-error`), n
        }
        toJSON() {
            return {
                idToken: this.idToken,
                accessToken: this.accessToken,
                secret: this.secret,
                nonce: this.nonce,
                pendingToken: this.pendingToken,
                providerId: this.providerId,
                signInMethod: this.signInMethod
            }
        }
        static fromJSON(t) {
            let {
                providerId: n,
                signInMethod: r,
                ...i
            } = typeof t == `string` ? JSON.parse(t) : t;
            if (!n || !r) return null;
            let a = new e(n, r);
            return a.idToken = i.idToken || void 0, a.accessToken = i.accessToken || void 0, a.secret = i.secret, a.nonce = i.nonce, a.pendingToken = i.pendingToken || null, a
        }
        _getIdTokenResponse(e) {
            return G(e, this.buildRequest())
        }
        _linkToIdToken(e, t) {
            let n = this.buildRequest();
            return n.idToken = t, G(e, n)
        }
        _getReauthenticationResolver(e) {
            let t = this.buildRequest();
            return t.autoCreate = !1, G(e, t)
        }
        buildRequest() {
            let e = {
                requestUri: si,
                returnSecureToken: !0
            };
            if (this.pendingToken) e.pendingToken = this.pendingToken;
            else {
                let t = {};
                this.idToken && (t.id_token = this.idToken), this.accessToken && (t.access_token = this.accessToken), this.secret && (t.oauth_token_secret = this.secret), t.providerId = this.providerId, this.nonce && !this.pendingToken && (t.nonce = this.nonce), e.postBody = _e(t)
            }
            return e
        }
    };
async function li(e, t) {
    return I(e, `POST`, `/v1/accounts:sendVerificationCode`, F(e, t))
}
async function ui(e, t) {
    return L(e, `POST`, `/v1/accounts:signInWithPhoneNumber`, F(e, t))
}
async function di(e, t) {
    let n = await L(e, `POST`, `/v1/accounts:signInWithPhoneNumber`, F(e, t));
    if (n.temporaryProof) throw Rn(e, `account-exists-with-different-credential`, n);
    return n
}
var fi = {
    USER_NOT_FOUND: `user-not-found`
};
async function pi(e, t) {
    return L(e, `POST`, `/v1/accounts:signInWithPhoneNumber`, F(e, { ...t,
        operation: `REAUTH`
    }), fi)
}
var mi = class e extends Xr {
    constructor(e) {
        super(`phone`, `phone`), this.params = e
    }
    static _fromVerification(t, n) {
        return new e({
            verificationId: t,
            verificationCode: n
        })
    }
    static _fromTokenResponse(t, n) {
        return new e({
            phoneNumber: t,
            temporaryProof: n
        })
    }
    _getIdTokenResponse(e) {
        return ui(e, this._makeVerificationRequest())
    }
    _linkToIdToken(e, t) {
        return di(e, {
            idToken: t,
            ...this._makeVerificationRequest()
        })
    }
    _getReauthenticationResolver(e) {
        return pi(e, this._makeVerificationRequest())
    }
    _makeVerificationRequest() {
        let {
            temporaryProof: e,
            phoneNumber: t,
            verificationId: n,
            verificationCode: r
        } = this.params;
        return e && t ? {
            temporaryProof: e,
            phoneNumber: t
        } : {
            sessionInfo: n,
            code: r
        }
    }
    toJSON() {
        let e = {
            providerId: this.providerId
        };
        return this.params.phoneNumber && (e.phoneNumber = this.params.phoneNumber), this.params.temporaryProof && (e.temporaryProof = this.params.temporaryProof), this.params.verificationCode && (e.verificationCode = this.params.verificationCode), this.params.verificationId && (e.verificationId = this.params.verificationId), e
    }
    static fromJSON(t) {
        typeof t == `string` && (t = JSON.parse(t));
        let {
            verificationId: n,
            verificationCode: r,
            phoneNumber: i,
            temporaryProof: a
        } = t;
        return !r && !n && !i && !a ? null : new e({
            verificationId: n,
            verificationCode: r,
            phoneNumber: i,
            temporaryProof: a
        })
    }
};

function hi(e) {
    switch (e) {
        case `recoverEmail`:
            return `RECOVER_EMAIL`;
        case `resetPassword`:
            return `PASSWORD_RESET`;
        case `signIn`:
            return `EMAIL_SIGNIN`;
        case `verifyEmail`:
            return `VERIFY_EMAIL`;
        case `verifyAndChangeEmail`:
            return `VERIFY_AND_CHANGE_EMAIL`;
        case `revertSecondFactorAddition`:
            return `REVERT_SECOND_FACTOR_ADDITION`;
        default:
            return null
    }
}

function gi(e) {
    let t = _(ve(e)).link,
        n = t ? _(ve(t)).deep_link_id : null,
        r = _(ve(e)).deep_link_id;
    return (r ? _(ve(r)).link : null) || r || n || t || e
}
var _i = class e {
        constructor(e) {
            let t = _(ve(e)),
                n = t.apiKey ?? null,
                r = t.oobCode ?? null,
                i = hi(t.mode ?? null);
            M(n && r && i, `argument-error`), this.apiKey = n, this.operation = i, this.code = r, this.continueUrl = t.continueUrl ?? null, this.languageCode = t.lang ?? null, this.tenantId = t.tenantId ?? null
        }
        static parseLink(t) {
            let n = gi(t);
            try {
                return new e(n)
            } catch {
                return null
            }
        }
    },
    vi = class e {
        constructor() {
            this.providerId = e.PROVIDER_ID
        }
        static credential(e, t) {
            return oi._fromEmailAndPassword(e, t)
        }
        static credentialWithLink(e, t) {
            let n = _i.parseLink(t);
            return M(n, `argument-error`), oi._fromEmailAndCode(e, n.code, n.tenantId)
        }
    };
vi.PROVIDER_ID = `password`, vi.EMAIL_PASSWORD_SIGN_IN_METHOD = `password`, vi.EMAIL_LINK_SIGN_IN_METHOD = `emailLink`;
var yi = class {
        constructor(e) {
            this.providerId = e, this.defaultLanguageCode = null, this.customParameters = {}
        }
        setDefaultLanguage(e) {
            this.defaultLanguageCode = e
        }
        setCustomParameters(e) {
            return this.customParameters = e, this
        }
        getCustomParameters() {
            return this.customParameters
        }
    },
    bi = class extends yi {
        constructor() {
            super(...arguments), this.scopes = []
        }
        addScope(e) {
            return this.scopes.includes(e) || this.scopes.push(e), this
        }
        getScopes() {
            return [...this.scopes]
        }
    },
    xi = class e extends bi {
        constructor() {
            super(`facebook.com`)
        }
        static credential(t) {
            return ci._fromParams({
                providerId: e.PROVIDER_ID,
                signInMethod: e.FACEBOOK_SIGN_IN_METHOD,
                accessToken: t
            })
        }
        static credentialFromResult(t) {
            return e.credentialFromTaggedObject(t)
        }
        static credentialFromError(t) {
            return e.credentialFromTaggedObject(t.customData || {})
        }
        static credentialFromTaggedObject({
            _tokenResponse: t
        }) {
            if (!t || !(`oauthAccessToken` in t) || !t.oauthAccessToken) return null;
            try {
                return e.credential(t.oauthAccessToken)
            } catch {
                return null
            }
        }
    };
xi.FACEBOOK_SIGN_IN_METHOD = `facebook.com`, xi.PROVIDER_ID = `facebook.com`;
var Si = class e extends bi {
    constructor() {
        super(`google.com`), this.addScope(`profile`)
    }
    static credential(t, n) {
        return ci._fromParams({
            providerId: e.PROVIDER_ID,
            signInMethod: e.GOOGLE_SIGN_IN_METHOD,
            idToken: t,
            accessToken: n
        })
    }
    static credentialFromResult(t) {
        return e.credentialFromTaggedObject(t)
    }
    static credentialFromError(t) {
        return e.credentialFromTaggedObject(t.customData || {})
    }
    static credentialFromTaggedObject({
        _tokenResponse: t
    }) {
        if (!t) return null;
        let {
            oauthIdToken: n,
            oauthAccessToken: r
        } = t;
        if (!n && !r) return null;
        try {
            return e.credential(n, r)
        } catch {
            return null
        }
    }
};
Si.GOOGLE_SIGN_IN_METHOD = `google.com`, Si.PROVIDER_ID = `google.com`;
var Ci = class e extends bi {
    constructor() {
        super(`github.com`)
    }
    static credential(t) {
        return ci._fromParams({
            providerId: e.PROVIDER_ID,
            signInMethod: e.GITHUB_SIGN_IN_METHOD,
            accessToken: t
        })
    }
    static credentialFromResult(t) {
        return e.credentialFromTaggedObject(t)
    }
    static credentialFromError(t) {
        return e.credentialFromTaggedObject(t.customData || {})
    }
    static credentialFromTaggedObject({
        _tokenResponse: t
    }) {
        if (!t || !(`oauthAccessToken` in t) || !t.oauthAccessToken) return null;
        try {
            return e.credential(t.oauthAccessToken)
        } catch {
            return null
        }
    }
};
Ci.GITHUB_SIGN_IN_METHOD = `github.com`, Ci.PROVIDER_ID = `github.com`;
var wi = class e extends bi {
    constructor() {
        super(`twitter.com`)
    }
    static credential(t, n) {
        return ci._fromParams({
            providerId: e.PROVIDER_ID,
            signInMethod: e.TWITTER_SIGN_IN_METHOD,
            oauthToken: t,
            oauthTokenSecret: n
        })
    }
    static credentialFromResult(t) {
        return e.credentialFromTaggedObject(t)
    }
    static credentialFromError(t) {
        return e.credentialFromTaggedObject(t.customData || {})
    }
    static credentialFromTaggedObject({
        _tokenResponse: t
    }) {
        if (!t) return null;
        let {
            oauthAccessToken: n,
            oauthTokenSecret: r
        } = t;
        if (!n || !r) return null;
        try {
            return e.credential(n, r)
        } catch {
            return null
        }
    }
};
wi.TWITTER_SIGN_IN_METHOD = `twitter.com`, wi.PROVIDER_ID = `twitter.com`;
async function Ti(e, t) {
    return L(e, `POST`, `/v1/accounts:signUp`, F(e, t))
}
var Ei = class e {
    constructor(e) {
        this.user = e.user, this.providerId = e.providerId, this._tokenResponse = e._tokenResponse, this.operationType = e.operationType
    }
    static async _fromIdTokenResponse(t, n, r, i = !1) {
        return new e({
            user: await V._fromIdTokenResponse(t, r, i),
            providerId: Di(r),
            _tokenResponse: r,
            operationType: n
        })
    }
    static async _forOperation(t, n, r) {
        return await t._updateTokensIfNecessary(r, !0), new e({
            user: t,
            providerId: Di(r),
            _tokenResponse: r,
            operationType: n
        })
    }
};

function Di(e) {
    return e.providerId ? e.providerId : `phoneNumber` in e ? `phone` : null
}
var Oi = class e extends m {
    constructor(t, n, r, i) {
        super(n.code, n.message), this.operationType = r, this.user = i, Object.setPrototypeOf(this, e.prototype), this.customData = {
            appName: t.name,
            tenantId: t.tenantId ?? void 0,
            _serverResponse: n.customData._serverResponse,
            operationType: r
        }
    }
    static _fromErrorAndOperation(t, n, r, i) {
        return new e(t, n, r, i)
    }
};

function ki(e, t, n, r) {
    return (t === `reauthenticate` ? n._getReauthenticationResolver(e) : n._getIdTokenResponse(e)).catch(n => {
        throw n.code === `auth/multi-factor-auth-required` ? Oi._fromErrorAndOperation(e, n, t, r) : n
    })
}

function Ai(e) {
    return new Set(e.map(({
        providerId: e
    }) => e).filter(e => !!e))
}
async function ji(e, t) {
    let n = v(e);
    await Ni(!0, n, t);
    let {
        providerUserInfo: r
    } = await Un(n.auth, {
        idToken: await n.getIdToken(),
        deleteProvider: [t]
    }), i = Ai(r || []);
    return n.providerData = n.providerData.filter(e => i.has(e.providerId)), i.has(`phone`) || (n.phoneNumber = null), await n.auth._persistUserIfCurrent(n), n
}
async function Mi(e, t, n = !1) {
    let r = await R(e, t._linkToIdToken(e.auth, await e.getIdToken()), n);
    return Ei._forOperation(e, `link`, r)
}
async function Ni(e, t, n) {
    await z(t);
    let r = Ai(t.providerData),
        i = e === !1 ? `provider-already-linked` : `no-such-provider`;
    M(r.has(n) === e, t.auth, i)
}
async function Pi(e, t, n = !1) {
    let {
        auth: r
    } = e;
    if (E(r.app)) return Promise.reject(j(r));
    let i = `reauthenticate`;
    try {
        let a = await R(e, ki(r, i, t, e), n);
        M(a.idToken, r, `internal-error`);
        let o = Yn(a.idToken);
        M(o, r, `internal-error`);
        let {
            sub: s
        } = o;
        return M(e.uid === s, r, `user-mismatch`), Ei._forOperation(e, i, a)
    } catch (e) {
        throw e ?.code === `auth/user-not-found` && k(r, `user-mismatch`), e
    }
}
async function Fi(e, t, n = !1) {
    if (E(e.app)) return Promise.reject(j(e));
    let r = `signIn`,
        i = await ki(e, r, t),
        a = await Ei._fromIdTokenResponse(e, r, i);
    return n || await e._updateCurrentUser(a.user), a
}
async function Ii(e, t) {
    return Fi(U(e), t)
}
async function Li(e, t) {
    let n = v(e);
    return await Ni(!1, n, t.providerId), Mi(n, t)
}
async function Ri(e, t) {
    return Pi(v(e), t)
}
var zi = class {
        constructor(e, t) {
            this.factorId = e, this.uid = t.mfaEnrollmentId, this.enrollmentTime = new Date(t.enrolledAt).toUTCString(), this.displayName = t.displayName
        }
        static _fromServerResponse(e, t) {
            return `phoneInfo` in t ? Bi._fromServerResponse(e, t) : `totpInfo` in t ? Vi._fromServerResponse(e, t) : k(e, `internal-error`)
        }
    },
    Bi = class e extends zi {
        constructor(e) {
            super(`phone`, e), this.phoneNumber = e.phoneInfo
        }
        static _fromServerResponse(t, n) {
            return new e(n)
        }
    },
    Vi = class e extends zi {
        constructor(e) {
            super(`totp`, e)
        }
        static _fromServerResponse(t, n) {
            return new e(n)
        }
    };

function Hi(e, t, n) {
    M(n.url ?.length > 0, e, `invalid-continue-uri`), M(n.dynamicLinkDomain === void 0 || n.dynamicLinkDomain.length > 0, e, `invalid-dynamic-link-domain`), M(n.linkDomain === void 0 || n.linkDomain.length > 0, e, `invalid-hosting-link-domain`), t.continueUrl = n.url, t.dynamicLinkDomain = n.dynamicLinkDomain, t.linkDomain = n.linkDomain, t.canHandleCodeInApp = n.handleCodeInApp, n.iOS && (M(n.iOS.bundleId.length > 0, e, `missing-ios-bundle-id`), t.iOSBundleId = n.iOS.bundleId), n.android && (M(n.android.packageName.length > 0, e, `missing-android-pkg-name`), t.androidInstallApp = n.android.installApp, t.androidMinimumVersionCode = n.android.minimumVersion, t.androidPackageName = n.android.packageName)
}
async function Ui(e) {
    let t = U(e);
    t._getPasswordPolicyInternal() && await t._updatePasswordPolicy()
}
async function Wi(e, t, n) {
    await Zr(v(e), {
        oobCode: t,
        newPassword: n
    }).catch(async t => {
        throw t.code === `auth/password-does-not-meet-requirements` && Ui(e), t
    })
}
async function Gi(e, t) {
    await ei(v(e), {
        oobCode: t
    })
}
async function Ki(e, t) {
    let n = v(e),
        r = await Zr(n, {
            oobCode: t
        }),
        i = r.requestType;
    switch (M(i, n, `internal-error`), i) {
        case `EMAIL_SIGNIN`:
            break;
        case `VERIFY_AND_CHANGE_EMAIL`:
            M(r.newEmail, n, `internal-error`);
            break;
        case `REVERT_SECOND_FACTOR_ADDITION`:
            M(r.mfaInfo, n, `internal-error`);
        default:
            M(r.email, n, `internal-error`)
    }
    let a = null;
    return r.mfaInfo && (a = zi._fromServerResponse(U(n), r.mfaInfo)), {
        data: {
            email: (r.requestType === `VERIFY_AND_CHANGE_EMAIL` ? r.newEmail : r.email) || null,
            previousEmail: (r.requestType === `VERIFY_AND_CHANGE_EMAIL` ? r.email : r.newEmail) || null,
            multiFactorInfo: a
        },
        operation: i
    }
}
async function qi(e, t) {
    let {
        data: n
    } = await Ki(v(e), t);
    return n.email
}
async function Ji(e, t, n) {
    if (E(e.app)) return Promise.reject(j(e));
    let r = U(e),
        i = await W(r, {
            returnSecureToken: !0,
            email: t,
            password: n,
            clientType: `CLIENT_TYPE_WEB`
        }, `signUpPassword`, Ti, `EMAIL_PASSWORD_PROVIDER`).catch(t => {
            throw t.code === `auth/password-does-not-meet-requirements` && Ui(e), t
        }),
        a = await Ei._fromIdTokenResponse(r, `signIn`, i);
    return await r._updateCurrentUser(a.user), a
}

function Yi(e, t, n) {
    return E(e.app) ? Promise.reject(j(e)) : Ii(v(e), vi.credential(t, n)).catch(async t => {
        throw t.code === `auth/password-does-not-meet-requirements` && Ui(e), t
    })
}
async function Xi(e, t) {
    let n = v(e),
        r = {
            requestType: `VERIFY_EMAIL`,
            idToken: await e.getIdToken()
        };
    t && Hi(n.auth, r, t);
    let {
        email: i
    } = await ri(n.auth, r);
    i !== e.email && await e.reload()
}
async function Zi(e, t) {
    return I(e, `POST`, `/v1/accounts:update`, t)
}
async function Qi(e, {
    displayName: t,
    photoURL: n
}) {
    if (t === void 0 && n === void 0) return;
    let r = v(e),
        i = {
            idToken: await r.getIdToken(),
            displayName: t,
            photoUrl: n,
            returnSecureToken: !0
        },
        a = await R(r, Zi(r.auth, i));
    r.displayName = a.displayName || null, r.photoURL = a.photoUrl || null;
    let o = r.providerData.find(({
        providerId: e
    }) => e === `password`);
    o && (o.displayName = r.displayName, o.photoURL = r.photoURL), await r._updateTokensIfNecessary(a)
}

function $i(e, t) {
    let n = v(e);
    return E(n.auth.app) ? Promise.reject(j(n.auth)) : ea(n, t, null)
}
async function ea(e, t, n) {
    let {
        auth: r
    } = e, i = {
        idToken: await e.getIdToken(),
        returnSecureToken: !0
    };
    t && (i.email = t), n && (i.password = n);
    let a = await R(e, Qr(r, i));
    await e._updateTokensIfNecessary(a, !0)
}

function ta(e) {
    if (!e) return null;
    let {
        providerId: t
    } = e, n = e.rawUserInfo ? JSON.parse(e.rawUserInfo) : {}, r = e.isNewUser || e.kind === `identitytoolkit#SignupNewUserResponse`;
    if (!t && e ?.idToken) {
        let t = Yn(e.idToken) ?.firebase ?.sign_in_provider;
        if (t) return new K(r, t !== `anonymous` && t !== `custom` ? t : null)
    }
    if (!t) return null;
    switch (t) {
        case `facebook.com`:
            return new ra(r, n);
        case `github.com`:
            return new ia(r, n);
        case `google.com`:
            return new aa(r, n);
        case `twitter.com`:
            return new oa(r, n, e.screenName || null);
        case `custom`:
        case `anonymous`:
            return new K(r, null);
        default:
            return new K(r, t, n)
    }
}
var K = class {
        constructor(e, t, n = {}) {
            this.isNewUser = e, this.providerId = t, this.profile = n
        }
    },
    na = class extends K {
        constructor(e, t, n, r) {
            super(e, t, n), this.username = r
        }
    },
    ra = class extends K {
        constructor(e, t) {
            super(e, `facebook.com`, t)
        }
    },
    ia = class extends na {
        constructor(e, t) {
            super(e, `github.com`, t, typeof t ?.login == `string` ? t ?.login : null)
        }
    },
    aa = class extends K {
        constructor(e, t) {
            super(e, `google.com`, t)
        }
    },
    oa = class extends na {
        constructor(e, t, n) {
            super(e, `twitter.com`, t, n)
        }
    };

function sa(e) {
    let {
        user: t,
        _tokenResponse: n
    } = e;
    return t.isAnonymous && !n ? {
        providerId: null,
        isNewUser: !1,
        profile: null
    } : ta(n)
}

function ca(e, t) {
    return v(e).setPersistence(t)
}

function la(e, t, n, r) {
    return v(e).onIdTokenChanged(t, n, r)
}

function ua(e, t, n) {
    return v(e).beforeAuthStateChanged(t, n)
}

function da(e, t, n, r) {
    return v(e).onAuthStateChanged(t, n, r)
}

function fa(e, t) {
    return I(e, `POST`, `/v2/accounts/mfaEnrollment:start`, F(e, t))
}

function pa(e, t) {
    return I(e, `POST`, `/v2/accounts/mfaEnrollment:finalize`, F(e, t))
}

function ma(e, t) {
    return I(e, `POST`, `/v2/accounts/mfaEnrollment:start`, F(e, t))
}

function ha(e, t) {
    return I(e, `POST`, `/v2/accounts/mfaEnrollment:finalize`, F(e, t))
}
var ga = `__sak`,
    _a = class {
        constructor(e, t) {
            this.storageRetriever = e, this.type = t
        }
        _isAvailable() {
            try {
                return this.storage ? (this.storage.setItem(ga, `1`), this.storage.removeItem(ga), Promise.resolve(!0)) : Promise.resolve(!1)
            } catch {
                return Promise.resolve(!1)
            }
        }
        _set(e, t) {
            return this.storage.setItem(e, JSON.stringify(t)), Promise.resolve()
        }
        _get(e) {
            let t = this.storage.getItem(e);
            return Promise.resolve(t ? JSON.parse(t) : null)
        }
        _remove(e) {
            return this.storage.removeItem(e), Promise.resolve()
        }
        get storage() {
            return this.storageRetriever()
        }
    },
    va = 1e3,
    ya = 10,
    ba = class extends _a {
        constructor() {
            super(() => window.localStorage, `LOCAL`), this.boundEventHandler = (e, t) => this.onStorageEvent(e, t), this.listeners = {}, this.localCache = {}, this.pollTimer = null, this.fallbackToPolling = Sr(), this._shouldAllowMigration = !0
        }
        forAllChangedKeys(e) {
            for (let t of Object.keys(this.listeners)) {
                let n = this.storage.getItem(t),
                    r = this.localCache[t];
                n !== r && e(t, r, n)
            }
        }
        onStorageEvent(e, t = !1) {
            if (!e.key) {
                this.forAllChangedKeys((e, t, n) => {
                    this.notifyListeners(e, n)
                });
                return
            }
            let n = e.key;
            t ? this.detachListener() : this.stopPolling();
            let r = () => {
                    let e = this.storage.getItem(n);
                    !t && this.localCache[n] === e || this.notifyListeners(n, e)
                },
                i = this.storage.getItem(n);
            xr() && i !== e.newValue && e.newValue !== e.oldValue ? setTimeout(r, ya) : r()
        }
        notifyListeners(e, t) {
            this.localCache[e] = t;
            let n = this.listeners[e];
            if (n)
                for (let e of Array.from(n)) e(t && JSON.parse(t))
        }
        startPolling() {
            this.stopPolling(), this.pollTimer = setInterval(() => {
                this.forAllChangedKeys((e, t, n) => {
                    this.onStorageEvent(new StorageEvent(`storage`, {
                        key: e,
                        oldValue: t,
                        newValue: n
                    }), !0)
                })
            }, va)
        }
        stopPolling() {
            this.pollTimer &&= (clearInterval(this.pollTimer), null)
        }
        attachListener() {
            window.addEventListener(`storage`, this.boundEventHandler)
        }
        detachListener() {
            window.removeEventListener(`storage`, this.boundEventHandler)
        }
        _addListener(e, t) {
            Object.keys(this.listeners).length === 0 && (this.fallbackToPolling ? this.startPolling() : this.attachListener()), this.listeners[e] || (this.listeners[e] = new Set, this.localCache[e] = this.storage.getItem(e)), this.listeners[e].add(t)
        }
        _removeListener(e, t) {
            this.listeners[e] && (this.listeners[e].delete(t), this.listeners[e].size === 0 && delete this.listeners[e]), Object.keys(this.listeners).length === 0 && (this.detachListener(), this.stopPolling())
        }
        async _set(e, t) {
            await super._set(e, t), this.localCache[e] = JSON.stringify(t)
        }
        async _get(e) {
            let t = await super._get(e);
            return this.localCache[e] = JSON.stringify(t), t
        }
        async _remove(e) {
            await super._remove(e), delete this.localCache[e]
        }
    };
ba.type = `LOCAL`;
var xa = ba,
    Sa = 1e3;

function Ca(e) {
    let t = e.replace(/[\\^$.*+?()[\]{}|]/g, `\\$&`),
        n = RegExp(`${t}=([^;]+)`);
    return document.cookie.match(n) ?.[1] ?? null
}

function wa(e) {
    return `${window.location.protocol===`http:`?`__dev_`:`__HOST-`}FIREBASE_${e.split(`:`)[3]}`
}
var Ta = class {
    constructor() {
        this.type = `COOKIE`, this.listenerUnsubscribes = new Map
    }
    _getFinalTarget(e) {
        let t = new URL(`${window.location.origin}/__cookies__`);
        return t.searchParams.set(`finalTarget`, e), t
    }
    async _isAvailable() {
        return typeof isSecureContext == `boolean` && !isSecureContext || typeof navigator > `u` || typeof document > `u` ? !1 : navigator.cookieEnabled ?? !0
    }
    async _set(e, t) {}
    async _get(e) {
        if (!this._isAvailable()) return null;
        let t = wa(e);
        return window.cookieStore ? (await window.cookieStore.get(t)) ?.value : Ca(t)
    }
    async _remove(e) {
        if (!this._isAvailable() || !await this._get(e)) return;
        let t = wa(e);
        document.cookie = `${t}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`, await fetch(`/__cookies__`, {
            method: `DELETE`
        }).catch(() => void 0)
    }
    _addListener(e, t) {
        if (!this._isAvailable()) return;
        let n = wa(e);
        if (window.cookieStore) {
            let e = (e => {
                let r = e.changed.find(e => e.name === n);
                r && t(r.value), e.deleted.find(e => e.name === n) && t(null)
            });
            return this.listenerUnsubscribes.set(t, () => window.cookieStore.removeEventListener(`change`, e)), window.cookieStore.addEventListener(`change`, e)
        }
        let r = Ca(n),
            i = setInterval(() => {
                let e = Ca(n);
                e !== r && (t(e), r = e)
            }, Sa);
        this.listenerUnsubscribes.set(t, () => clearInterval(i))
    }
    _removeListener(e, t) {
        let n = this.listenerUnsubscribes.get(t);
        n && (n(), this.listenerUnsubscribes.delete(t))
    }
};
Ta.type = `COOKIE`;
var Ea = class extends _a {
    constructor() {
        super(() => window.sessionStorage, `SESSION`)
    }
    _addListener(e, t) {}
    _removeListener(e, t) {}
};
Ea.type = `SESSION`;
var Da = Ea;

function Oa(e) {
    return Promise.all(e.map(async e => {
        try {
            return {
                fulfilled: !0,
                value: await e
            }
        } catch (e) {
            return {
                fulfilled: !1,
                reason: e
            }
        }
    }))
}
var ka = class e {
    constructor(e) {
        this.eventTarget = e, this.handlersMap = {}, this.boundEventHandler = this.handleEvent.bind(this)
    }
    static _getInstance(t) {
        let n = this.receivers.find(e => e.isListeningto(t));
        if (n) return n;
        let r = new e(t);
        return this.receivers.push(r), r
    }
    isListeningto(e) {
        return this.eventTarget === e
    }
    async handleEvent(e) {
        let t = e,
            {
                eventId: n,
                eventType: r,
                data: i
            } = t.data,
            a = this.handlersMap[r];
        if (!a ?.size) return;
        t.ports[0].postMessage({
            status: `ack`,
            eventId: n,
            eventType: r
        });
        let o = await Oa(Array.from(a).map(async e => e(t.origin, i)));
        t.ports[0].postMessage({
            status: `done`,
            eventId: n,
            eventType: r,
            response: o
        })
    }
    _subscribe(e, t) {
        Object.keys(this.handlersMap).length === 0 && this.eventTarget.addEventListener(`message`, this.boundEventHandler), this.handlersMap[e] || (this.handlersMap[e] = new Set), this.handlersMap[e].add(t)
    }
    _unsubscribe(e, t) {
        this.handlersMap[e] && t && this.handlersMap[e].delete(t), (!t || this.handlersMap[e].size === 0) && delete this.handlersMap[e], Object.keys(this.handlersMap).length === 0 && this.eventTarget.removeEventListener(`message`, this.boundEventHandler)
    }
};
ka.receivers = [];

function Aa(e = ``, t = 10) {
    let n = ``;
    for (let e = 0; e < t; e++) n += Math.floor(Math.random() * 10);
    return e + n
}
var ja = class {
    constructor(e) {
        this.target = e, this.handlers = new Set
    }
    removeMessageHandler(e) {
        e.messageChannel && (e.messageChannel.port1.removeEventListener(`message`, e.onMessage), e.messageChannel.port1.close()), this.handlers.delete(e)
    }
    async _send(e, t, n = 50) {
        let r = typeof MessageChannel < `u` ? new MessageChannel : null;
        if (!r) throw Error(`connection_unavailable`);
        let i, a;
        return new Promise((o, s) => {
            let c = Aa(``, 20);
            r.port1.start();
            let l = setTimeout(() => {
                s(Error(`unsupported_event`))
            }, n);
            a = {
                messageChannel: r,
                onMessage(e) {
                    let t = e;
                    if (t.data.eventId === c) switch (t.data.status) {
                        case `ack`:
                            clearTimeout(l), i = setTimeout(() => {
                                s(Error(`timeout`))
                            }, 3e3);
                            break;
                        case `done`:
                            clearTimeout(i), o(t.data.response);
                            break;
                        default:
                            clearTimeout(l), clearTimeout(i), s(Error(`invalid_response`));
                            break
                    }
                }
            }, this.handlers.add(a), r.port1.addEventListener(`message`, a.onMessage), this.target.postMessage({
                eventType: e,
                eventId: c,
                data: t
            }, [r.port2])
        }).finally(() => {
            a && this.removeMessageHandler(a)
        })
    }
};

function q() {
    return window
}

function Ma(e) {
    q().location.href = e
}

function Na() {
    return q().WorkerGlobalScope !== void 0 && typeof q().importScripts == `function`
}
async function Pa() {
    if (!navigator ?.serviceWorker) return null;
    try {
        return (await navigator.serviceWorker.ready).active
    } catch {
        return null
    }
}

function Fa() {
    return navigator ?.serviceWorker ?.controller || null
}

function Ia() {
    return Na() ? self : null
}
var La = `firebaseLocalStorageDb`,
    Ra = 1,
    za = `firebaseLocalStorage`,
    Ba = `fbase_key`,
    Va = class {
        constructor(e) {
            this.request = e
        }
        toPromise() {
            return new Promise((e, t) => {
                this.request.addEventListener(`success`, () => {
                    e(this.request.result)
                }), this.request.addEventListener(`error`, () => {
                    t(this.request.error)
                })
            })
        }
    };

function Ha(e, t) {
    return e.transaction([za], t ? `readwrite` : `readonly`).objectStore(za)
}

function Ua() {
    return new Va(indexedDB.deleteDatabase(La)).toPromise()
}

function Wa() {
    let e = indexedDB.open(La, Ra);
    return new Promise((t, n) => {
        e.addEventListener(`error`, () => {
            n(e.error)
        }), e.addEventListener(`upgradeneeded`, () => {
            let t = e.result;
            try {
                t.createObjectStore(za, {
                    keyPath: Ba
                })
            } catch (e) {
                n(e)
            }
        }), e.addEventListener(`success`, async () => {
            let n = e.result;
            n.objectStoreNames.contains(za) ? t(n) : (n.close(), await Ua(), t(await Wa()))
        })
    })
}
async function Ga(e, t, n) {
    return new Va(Ha(e, !0).put({
        [Ba]: t,
        value: n
    })).toPromise()
}
async function Ka(e, t) {
    let n = await new Va(Ha(e, !1).get(t)).toPromise();
    return n === void 0 ? null : n.value
}

function qa(e, t) {
    return new Va(Ha(e, !0).delete(t)).toPromise()
}
var Ja = 800,
    Ya = 3,
    Xa = class {
        constructor() {
            this.type = `LOCAL`, this._shouldAllowMigration = !0, this.listeners = {}, this.localCache = {}, this.pollTimer = null, this.pendingWrites = 0, this.receiver = null, this.sender = null, this.serviceWorkerReceiverAvailable = !1, this.activeServiceWorker = null, this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {}, () => {})
        }
        async _openDb() {
            return this.db ||= await Wa(), this.db
        }
        async _withRetries(e) {
            let t = 0;
            for (;;) try {
                return await e(await this._openDb())
            } catch (e) {
                if (t++ > Ya) throw e;
                this.db &&= (this.db.close(), void 0)
            }
        }
        async initializeServiceWorkerMessaging() {
            return Na() ? this.initializeReceiver() : this.initializeSender()
        }
        async initializeReceiver() {
            this.receiver = ka._getInstance(Ia()), this.receiver._subscribe(`keyChanged`, async (e, t) => ({
                keyProcessed: (await this._poll()).includes(t.key)
            })), this.receiver._subscribe(`ping`, async (e, t) => [`keyChanged`])
        }
        async initializeSender() {
            if (this.activeServiceWorker = await Pa(), !this.activeServiceWorker) return;
            this.sender = new ja(this.activeServiceWorker);
            let e = await this.sender._send(`ping`, {}, 800);
            e && e[0] ?.fulfilled && e[0] ?.value.includes(`keyChanged`) && (this.serviceWorkerReceiverAvailable = !0)
        }
        async notifyServiceWorker(e) {
            if (!(!this.sender || !this.activeServiceWorker || Fa() !== this.activeServiceWorker)) try {
                await this.sender._send(`keyChanged`, {
                    key: e
                }, this.serviceWorkerReceiverAvailable ? 800 : 50)
            } catch {}
        }
        async _isAvailable() {
            try {
                if (!indexedDB) return !1;
                let e = await Wa();
                return await Ga(e, ga, `1`), await qa(e, ga), !0
            } catch {}
            return !1
        }
        async _withPendingWrite(e) {
            this.pendingWrites++;
            try {
                await e()
            } finally {
                this.pendingWrites--
            }
        }
        async _set(e, t) {
            return this._withPendingWrite(async () => (await this._withRetries(n => Ga(n, e, t)), this.localCache[e] = t, this.notifyServiceWorker(e)))
        }
        async _get(e) {
            let t = await this._withRetries(t => Ka(t, e));
            return this.localCache[e] = t, t
        }
        async _remove(e) {
            return this._withPendingWrite(async () => (await this._withRetries(t => qa(t, e)), delete this.localCache[e], this.notifyServiceWorker(e)))
        }
        async _poll() {
            let e = await this._withRetries(e => new Va(Ha(e, !1).getAll()).toPromise());
            if (!e || this.pendingWrites !== 0) return [];
            let t = [],
                n = new Set;
            if (e.length !== 0)
                for (let {
                        fbase_key: r,
                        value: i
                    } of e) n.add(r), JSON.stringify(this.localCache[r]) !== JSON.stringify(i) && (this.notifyListeners(r, i), t.push(r));
            for (let e of Object.keys(this.localCache)) this.localCache[e] && !n.has(e) && (this.notifyListeners(e, null), t.push(e));
            return t
        }
        notifyListeners(e, t) {
            this.localCache[e] = t;
            let n = this.listeners[e];
            if (n)
                for (let e of Array.from(n)) e(t)
        }
        startPolling() {
            this.stopPolling(), this.pollTimer = setInterval(async () => this._poll(), Ja)
        }
        stopPolling() {
            this.pollTimer &&= (clearInterval(this.pollTimer), null)
        }
        _addListener(e, t) {
            Object.keys(this.listeners).length === 0 && this.startPolling(), this.listeners[e] || (this.listeners[e] = new Set, this._get(e)), this.listeners[e].add(t)
        }
        _removeListener(e, t) {
            this.listeners[e] && (this.listeners[e].delete(t), this.listeners[e].size === 0 && delete this.listeners[e]), Object.keys(this.listeners).length === 0 && this.stopPolling()
        }
    };
Xa.type = `LOCAL`;
var Za = Xa;

function Qa(e, t) {
    return I(e, `POST`, `/v2/accounts/mfaSignIn:start`, F(e, t))
}

function $a(e, t) {
    return I(e, `POST`, `/v2/accounts/mfaSignIn:finalize`, F(e, t))
}

function eo(e, t) {
    return I(e, `POST`, `/v2/accounts/mfaSignIn:finalize`, F(e, t))
}
Fr(`rcb`), new On(3e4, 6e4);
var to = `recaptcha`;
async function no(e, t, n) {
    if (!e._getRecaptchaConfig()) try {
        await Hr(e)
    } catch {
        console.log(`Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.`)
    }
    try {
        let r;
        if (r = typeof t == `string` ? {
                phoneNumber: t
            } : t, `session` in r) {
            let t = r.session;
            if (`phoneNumber` in r) return M(t.type === `enroll`, e, `internal-error`), (await W(e, {
                idToken: t.credential,
                phoneEnrollmentInfo: {
                    phoneNumber: r.phoneNumber,
                    clientType: `CLIENT_TYPE_WEB`
                }
            }, `mfaSmsEnrollment`, async (e, t) => t.phoneEnrollmentInfo.captchaResponse === zr ? (M(n ?.type === to, e, `argument-error`), fa(e, await ro(e, t, n))) : fa(e, t), `PHONE_PROVIDER`).catch(e => Promise.reject(e))).phoneSessionInfo.sessionInfo; {
                M(t.type === `signin`, e, `internal-error`);
                let i = r.multiFactorHint ?.uid || r.multiFactorUid;
                return M(i, e, `missing-multi-factor-info`), (await W(e, {
                    mfaPendingCredential: t.credential,
                    mfaEnrollmentId: i,
                    phoneSignInInfo: {
                        clientType: `CLIENT_TYPE_WEB`
                    }
                }, `mfaSmsSignIn`, async (e, t) => t.phoneSignInInfo.captchaResponse === zr ? (M(n ?.type === to, e, `argument-error`), Qa(e, await ro(e, t, n))) : Qa(e, t), `PHONE_PROVIDER`).catch(e => Promise.reject(e))).phoneResponseInfo.sessionInfo
            }
        } else return (await W(e, {
            phoneNumber: r.phoneNumber,
            clientType: `CLIENT_TYPE_WEB`
        }, `sendVerificationCode`, async (e, t) => t.captchaResponse === zr ? (M(n ?.type === to, e, `argument-error`), li(e, await ro(e, t, n))) : li(e, t), `PHONE_PROVIDER`).catch(e => Promise.reject(e))).sessionInfo
    } finally {
        n ?._reset()
    }
}
async function ro(e, t, n) {
    M(n.type === to, e, `argument-error`);
    let r = await n.verify();
    M(typeof r == `string`, e, `argument-error`);
    let i = { ...t
    };
    if (`phoneEnrollmentInfo` in i) {
        let e = i.phoneEnrollmentInfo.phoneNumber,
            t = i.phoneEnrollmentInfo.captchaResponse,
            n = i.phoneEnrollmentInfo.clientType,
            a = i.phoneEnrollmentInfo.recaptchaVersion;
        return Object.assign(i, {
            phoneEnrollmentInfo: {
                phoneNumber: e,
                recaptchaToken: r,
                captchaResponse: t,
                clientType: n,
                recaptchaVersion: a
            }
        }), i
    } else if (`phoneSignInInfo` in i) {
        let e = i.phoneSignInInfo.captchaResponse,
            t = i.phoneSignInInfo.clientType,
            n = i.phoneSignInInfo.recaptchaVersion;
        return Object.assign(i, {
            phoneSignInInfo: {
                recaptchaToken: r,
                captchaResponse: e,
                clientType: t,
                recaptchaVersion: n
            }
        }), i
    } else return Object.assign(i, {
        recaptchaToken: r
    }), i
}
var io = class e {
    constructor(t) {
        this.providerId = e.PROVIDER_ID, this.auth = U(t)
    }
    verifyPhoneNumber(e, t) {
        return no(this.auth, e, v(t))
    }
    static credential(e, t) {
        return mi._fromVerification(e, t)
    }
    static credentialFromResult(t) {
        let n = t;
        return e.credentialFromTaggedObject(n)
    }
    static credentialFromError(t) {
        return e.credentialFromTaggedObject(t.customData || {})
    }
    static credentialFromTaggedObject({
        _tokenResponse: e
    }) {
        if (!e) return null;
        let {
            phoneNumber: t,
            temporaryProof: n
        } = e;
        return t && n ? mi._fromTokenResponse(t, n) : null
    }
};
io.PROVIDER_ID = `phone`, io.PHONE_SIGN_IN_METHOD = `phone`;

function ao(e, t) {
    return t ? H(t) : (M(e._popupRedirectResolver, e, `argument-error`), e._popupRedirectResolver)
}
var oo = class extends Xr {
    constructor(e) {
        super(`custom`, `custom`), this.params = e
    }
    _getIdTokenResponse(e) {
        return G(e, this._buildIdpRequest())
    }
    _linkToIdToken(e, t) {
        return G(e, this._buildIdpRequest(t))
    }
    _getReauthenticationResolver(e) {
        return G(e, this._buildIdpRequest())
    }
    _buildIdpRequest(e) {
        let t = {
            requestUri: this.params.requestUri,
            sessionId: this.params.sessionId,
            postBody: this.params.postBody,
            tenantId: this.params.tenantId,
            pendingToken: this.params.pendingToken,
            returnSecureToken: !0,
            returnIdpCredential: !0
        };
        return e && (t.idToken = e), t
    }
};

function so(e) {
    return Fi(e.auth, new oo(e), e.bypassAuthState)
}

function co(e) {
    let {
        auth: t,
        user: n
    } = e;
    return M(n, t, `internal-error`), Pi(n, new oo(e), e.bypassAuthState)
}
async function lo(e) {
    let {
        auth: t,
        user: n
    } = e;
    return M(n, t, `internal-error`), Mi(n, new oo(e), e.bypassAuthState)
}
var uo = class {
        constructor(e, t, n, r, i = !1) {
            this.auth = e, this.resolver = n, this.user = r, this.bypassAuthState = i, this.pendingPromise = null, this.eventManager = null, this.filter = Array.isArray(t) ? t : [t]
        }
        execute() {
            return new Promise(async (e, t) => {
                this.pendingPromise = {
                    resolve: e,
                    reject: t
                };
                try {
                    this.eventManager = await this.resolver._initialize(this.auth), await this.onExecution(), this.eventManager.registerConsumer(this)
                } catch (e) {
                    this.reject(e)
                }
            })
        }
        async onAuthEvent(e) {
            let {
                urlResponse: t,
                sessionId: n,
                postBody: r,
                tenantId: i,
                error: a,
                type: o
            } = e;
            if (a) {
                this.reject(a);
                return
            }
            let s = {
                auth: this.auth,
                requestUri: t,
                sessionId: n,
                tenantId: i || void 0,
                postBody: r || void 0,
                user: this.user,
                bypassAuthState: this.bypassAuthState
            };
            try {
                this.resolve(await this.getIdpTask(o)(s))
            } catch (e) {
                this.reject(e)
            }
        }
        onError(e) {
            this.reject(e)
        }
        getIdpTask(e) {
            switch (e) {
                case `signInViaPopup`:
                case `signInViaRedirect`:
                    return so;
                case `linkViaPopup`:
                case `linkViaRedirect`:
                    return lo;
                case `reauthViaPopup`:
                case `reauthViaRedirect`:
                    return co;
                default:
                    k(this.auth, `internal-error`)
            }
        }
        resolve(e) {
            P(this.pendingPromise, `Pending promise was never set`), this.pendingPromise.resolve(e), this.unregisterAndCleanUp()
        }
        reject(e) {
            P(this.pendingPromise, `Pending promise was never set`), this.pendingPromise.reject(e), this.unregisterAndCleanUp()
        }
        unregisterAndCleanUp() {
            this.eventManager && this.eventManager.unregisterConsumer(this), this.pendingPromise = null, this.cleanUp()
        }
    },
    fo = new On(2e3, 1e4);
async function po(e, t, n) {
    if (E(e.app)) return Promise.reject(A(e, `operation-not-supported-in-this-environment`));
    let r = U(e);
    return xn(e, t, yi), new go(r, `signInViaPopup`, t, ao(r, n)).executeNotNull()
}
async function mo(e, t, n) {
    let r = v(e);
    if (E(r.auth.app)) return Promise.reject(A(r.auth, `operation-not-supported-in-this-environment`));
    xn(r.auth, t, yi);
    let i = ao(r.auth, n);
    return new go(r.auth, `reauthViaPopup`, t, i, r).executeNotNull()
}
async function ho(e, t, n) {
    let r = v(e);
    xn(r.auth, t, yi);
    let i = ao(r.auth, n);
    return new go(r.auth, `linkViaPopup`, t, i, r).executeNotNull()
}
var go = class e extends uo {
    constructor(t, n, r, i, a) {
        super(t, n, i, a), this.provider = r, this.authWindow = null, this.pollId = null, e.currentPopupAction && e.currentPopupAction.cancel(), e.currentPopupAction = this
    }
    async executeNotNull() {
        let e = await this.execute();
        return M(e, this.auth, `internal-error`), e
    }
    async onExecution() {
        P(this.filter.length === 1, `Popup operations only handle one event`);
        let e = Aa();
        this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], e), this.authWindow.associatedEvent = e, this.resolver._originValidation(this.auth).catch(e => {
            this.reject(e)
        }), this.resolver._isIframeWebStorageSupported(this.auth, e => {
            e || this.reject(A(this.auth, `web-storage-unsupported`))
        }), this.pollUserCancellation()
    }
    get eventId() {
        return this.authWindow ?.associatedEvent || null
    }
    cancel() {
        this.reject(A(this.auth, `cancelled-popup-request`))
    }
    cleanUp() {
        this.authWindow && this.authWindow.close(), this.pollId && window.clearTimeout(this.pollId), this.authWindow = null, this.pollId = null, e.currentPopupAction = null
    }
    pollUserCancellation() {
        let e = () => {
            if (this.authWindow ?.window ?.closed) {
                this.pollId = window.setTimeout(() => {
                    this.pollId = null, this.reject(A(this.auth, `popup-closed-by-user`))
                }, 8e3);
                return
            }
            this.pollId = window.setTimeout(e, fo.get())
        };
        e()
    }
};
go.currentPopupAction = null;
var _o = `pendingRedirect`,
    vo = new Map,
    yo = class extends uo {
        constructor(e, t, n = !1) {
            super(e, [`signInViaRedirect`, `linkViaRedirect`, `reauthViaRedirect`, `unknown`], t, void 0, n), this.eventId = null
        }
        async execute() {
            let e = vo.get(this.auth._key());
            if (!e) {
                try {
                    let t = await bo(this.resolver, this.auth) ? await super.execute() : null;
                    e = () => Promise.resolve(t)
                } catch (t) {
                    e = () => Promise.reject(t)
                }
                vo.set(this.auth._key(), e)
            }
            return this.bypassAuthState || vo.set(this.auth._key(), () => Promise.resolve(null)), e()
        }
        async onAuthEvent(e) {
            if (e.type === `signInViaRedirect`) return super.onAuthEvent(e);
            if (e.type === `unknown`) {
                this.resolve(null);
                return
            }
            if (e.eventId) {
                let t = await this.auth._redirectUserForId(e.eventId);
                if (t) return this.user = t, super.onAuthEvent(e);
                this.resolve(null)
            }
        }
        async onExecution() {}
        cleanUp() {}
    };
async function bo(e, t) {
    let n = Co(t),
        r = So(e);
    if (!await r._isAvailable()) return !1;
    let i = await r._get(n) === `true`;
    return await r._remove(n), i
}

function xo(e, t) {
    vo.set(e._key(), t)
}

function So(e) {
    return H(e._redirectPersistence)
}

function Co(e) {
    return lr(_o, e.config.apiKey, e.name)
}
async function wo(e, t, n = !1) {
    if (E(e.app)) return Promise.reject(j(e));
    let r = U(e),
        i = await new yo(r, ao(r, t), n).execute();
    return i && !n && (delete i.user._redirectEventId, await r._persistUserIfCurrent(i.user), await r._setRedirectUser(null, t)), i
}
var To = 600 * 1e3,
    Eo = class {
        constructor(e) {
            this.auth = e, this.cachedEventUids = new Set, this.consumers = new Set, this.queuedRedirectEvent = null, this.hasHandledPotentialRedirect = !1, this.lastProcessedEventTime = Date.now()
        }
        registerConsumer(e) {
            this.consumers.add(e), this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, e) && (this.sendToConsumer(this.queuedRedirectEvent, e), this.saveEventToCache(this.queuedRedirectEvent), this.queuedRedirectEvent = null)
        }
        unregisterConsumer(e) {
            this.consumers.delete(e)
        }
        onEvent(e) {
            if (this.hasEventBeenHandled(e)) return !1;
            let t = !1;
            return this.consumers.forEach(n => {
                this.isEventForConsumer(e, n) && (t = !0, this.sendToConsumer(e, n), this.saveEventToCache(e))
            }), this.hasHandledPotentialRedirect || !ko(e) ? t : (this.hasHandledPotentialRedirect = !0, t ||= (this.queuedRedirectEvent = e, !0), t)
        }
        sendToConsumer(e, t) {
            if (e.error && !Oo(e)) {
                let n = e.error.code ?.split(`auth/`)[1] || `internal-error`;
                t.onError(A(this.auth, n))
            } else t.onAuthEvent(e)
        }
        isEventForConsumer(e, t) {
            let n = t.eventId === null || !!e.eventId && e.eventId === t.eventId;
            return t.filter.includes(e.type) && n
        }
        hasEventBeenHandled(e) {
            return Date.now() - this.lastProcessedEventTime >= To && this.cachedEventUids.clear(), this.cachedEventUids.has(Do(e))
        }
        saveEventToCache(e) {
            this.cachedEventUids.add(Do(e)), this.lastProcessedEventTime = Date.now()
        }
    };

function Do(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter(e => e).join(`-`)
}

function Oo({
    type: e,
    error: t
}) {
    return e === `unknown` && t ?.code === `auth/no-auth-event`
}

function ko(e) {
    switch (e.type) {
        case `signInViaRedirect`:
        case `linkViaRedirect`:
        case `reauthViaRedirect`:
            return !0;
        case `unknown`:
            return Oo(e);
        default:
            return !1
    }
}
async function Ao(e, t = {}) {
    return I(e, `GET`, `/v1/projects`, t)
}
var jo = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    Mo = /^https?/;
async function No(e) {
    if (e.config.emulator) return;
    let {
        authorizedDomains: t
    } = await Ao(e);
    for (let e of t) try {
        if (Po(e)) return
    } catch {}
    k(e, `unauthorized-domain`)
}

function Po(e) {
    let t = Cn(),
        {
            protocol: n,
            hostname: r
        } = new URL(t);
    if (e.startsWith(`chrome-extension://`)) {
        let i = new URL(e);
        return i.hostname === `` && r === `` ? n === `chrome-extension:` && e.replace(`chrome-extension://`, ``) === t.replace(`chrome-extension://`, ``) : n === `chrome-extension:` && i.hostname === r
    }
    if (!Mo.test(n)) return !1;
    if (jo.test(e)) return r === e;
    let i = e.replace(/\./g, `\\.`);
    return RegExp(`^(.+\\.` + i + `|` + i + `)$`, `i`).test(r)
}
var Fo = new On(3e4, 6e4);

function Io() {
    let e = q().___jsl;
    if (e ?.H) {
        for (let t of Object.keys(e.H))
            if (e.H[t].r = e.H[t].r || [], e.H[t].L = e.H[t].L || [], e.H[t].r = [...e.H[t].L], e.CP)
                for (let t = 0; t < e.CP.length; t++) e.CP[t] = null
    }
}

function Lo(e) {
    return new Promise((t, n) => {
        function r() {
            Io(), gapi.load(`gapi.iframes`, {
                callback: () => {
                    t(gapi.iframes.getContext())
                },
                ontimeout: () => {
                    Io(), n(A(e, `network-request-failed`))
                },
                timeout: Fo.get()
            })
        }
        if (q().gapi ?.iframes ?.Iframe) t(gapi.iframes.getContext());
        else if (q().gapi ?.load) r();
        else {
            let t = Fr(`iframefcb`);
            return q()[t] = () => {
                gapi.load ? r() : n(A(e, `network-request-failed`))
            }, Mr(`${Pr()}?onload=${t}`).catch(e => n(e))
        }
    }).catch(e => {
        throw Ro = null, e
    })
}
var Ro = null;

function zo(e) {
    return Ro ||= Lo(e), Ro
}
var Bo = new On(5e3, 15e3),
    Vo = `__/auth/iframe`,
    Ho = `emulator/auth/iframe`,
    Uo = {
        style: {
            position: `absolute`,
            top: `-100px`,
            width: `1px`,
            height: `1px`
        },
        "aria-hidden": `true`,
        tabindex: `-1`
    },
    Wo = new Map([
        [`identitytoolkit.googleapis.com`, `p`],
        [`staging-identitytoolkit.sandbox.googleapis.com`, `s`],
        [`test-identitytoolkit.sandbox.googleapis.com`, `t`]
    ]);

function Go(e) {
    let t = e.config;
    M(t.authDomain, e, `auth-domain-config-required`);
    let n = t.emulator ? kn(t, Ho) : `https://${e.config.authDomain}/${Vo}`,
        r = {
            apiKey: t.apiKey,
            appName: e.name,
            v: Kt
        },
        i = Wo.get(e.config.apiHost);
    i && (r.eid = i);
    let a = e._getFrameworks();
    return a.length && (r.fw = a.join(`,`)), `${n}?${_e(r).slice(1)}`
}
async function Ko(e) {
    let t = await zo(e),
        n = q().gapi;
    return M(n, e, `internal-error`), t.open({
        where: document.body,
        url: Go(e),
        messageHandlersFilter: n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
        attributes: Uo,
        dontclear: !0
    }, t => new Promise(async (n, r) => {
        await t.restyle({
            setHideOnLeave: !1
        });
        let i = A(e, `network-request-failed`),
            a = q().setTimeout(() => {
                r(i)
            }, Bo.get());

        function o() {
            q().clearTimeout(a), n(t)
        }
        t.ping(o).then(o, () => {
            r(i)
        })
    }))
}
var qo = {
        location: `yes`,
        resizable: `yes`,
        statusbar: `yes`,
        toolbar: `no`
    },
    Jo = 500,
    Yo = 600,
    Xo = `_blank`,
    Zo = `http://localhost`,
    Qo = class {
        constructor(e) {
            this.window = e, this.associatedEvent = null
        }
        close() {
            if (this.window) try {
                this.window.close()
            } catch {}
        }
    };

function $o(e, t, n, r = Jo, i = Yo) {
    let a = Math.max((window.screen.availHeight - i) / 2, 0).toString(),
        o = Math.max((window.screen.availWidth - r) / 2, 0).toString(),
        s = ``,
        c = { ...qo,
            width: r.toString(),
            height: i.toString(),
            top: a,
            left: o
        },
        l = p().toLowerCase();
    n && (s = mr(l) ? Xo : n), fr(l) && (t ||= Zo, c.scrollbars = `yes`);
    let u = Object.entries(c).reduce((e, [t, n]) => `${e}${t}=${n},`, ``);
    if (br(l) && s !== `_self`) return es(t || ``, s), new Qo(null);
    let d = window.open(t || ``, s, u);
    M(d, e, `popup-blocked`);
    try {
        d.focus()
    } catch {}
    return new Qo(d)
}

function es(e, t) {
    let n = document.createElement(`a`);
    n.href = e, n.target = t;
    let r = document.createEvent(`MouseEvent`);
    r.initMouseEvent(`click`, !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 1, null), n.dispatchEvent(r)
}
var ts = `__/auth/handler`,
    ns = `emulator/auth/handler`,
    rs = `fac`;
async function is(e, t, n, r, i, a) {
    M(e.config.authDomain, e, `auth-domain-config-required`), M(e.config.apiKey, e, `invalid-api-key`);
    let o = {
        apiKey: e.config.apiKey,
        appName: e.name,
        authType: n,
        redirectUrl: r,
        v: Kt,
        eventId: i
    };
    if (t instanceof yi) {
        t.setDefaultLanguage(e.languageCode), o.providerId = t.providerId || ``, he(t.getCustomParameters()) || (o.customParameters = JSON.stringify(t.getCustomParameters()));
        for (let [e, t] of Object.entries(a || {})) o[e] = t
    }
    if (t instanceof bi) {
        let e = t.getScopes().filter(e => e !== ``);
        e.length > 0 && (o.scopes = e.join(`,`))
    }
    e.tenantId && (o.tid = e.tenantId);
    let s = o;
    for (let e of Object.keys(s)) s[e] === void 0 && delete s[e];
    let c = await e._getAppCheckToken(),
        l = c ? `#${rs}=${encodeURIComponent(c)}` : ``;
    return `${as(e)}?${_e(s).slice(1)}${l}`
}

function as({
    config: e
}) {
    return e.emulator ? kn(e, ns) : `https://${e.authDomain}/${ts}`
}
var os = `webStorageSupport`,
    ss = class {
        constructor() {
            this.eventManagers = {}, this.iframes = {}, this.originValidationPromises = {}, this._redirectPersistence = Da, this._completeRedirectFn = wo, this._overrideRedirectResult = xo
        }
        async _openPopup(e, t, n, r) {
            return P(this.eventManagers[e._key()] ?.manager, `_initialize() not called before _openPopup()`), $o(e, await is(e, t, n, Cn(), r), Aa())
        }
        async _openRedirect(e, t, n, r) {
            return await this._originValidation(e), Ma(await is(e, t, n, Cn(), r)), new Promise(() => {})
        }
        _initialize(e) {
            let t = e._key();
            if (this.eventManagers[t]) {
                let {
                    manager: e,
                    promise: n
                } = this.eventManagers[t];
                return e ? Promise.resolve(e) : (P(n, `If manager is not set, promise should be`), n)
            }
            let n = this.initAndGetManager(e);
            return this.eventManagers[t] = {
                promise: n
            }, n.catch(() => {
                delete this.eventManagers[t]
            }), n
        }
        async initAndGetManager(e) {
            let t = await Ko(e),
                n = new Eo(e);
            return t.register(`authEvent`, t => (M(t ?.authEvent, e, `invalid-auth-event`), {
                status: n.onEvent(t.authEvent) ? `ACK` : `ERROR`
            }), gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER), this.eventManagers[e._key()] = {
                manager: n
            }, this.iframes[e._key()] = t, n
        }
        _isIframeWebStorageSupported(e, t) {
            this.iframes[e._key()].send(os, {
                type: os
            }, n => {
                let r = n ?.[0] ?.[os];
                r !== void 0 && t(!!r), k(e, `internal-error`)
            }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)
        }
        _originValidation(e) {
            let t = e._key();
            return this.originValidationPromises[t] || (this.originValidationPromises[t] = No(e)), this.originValidationPromises[t]
        }
        get _shouldInitProactively() {
            return Sr() || pr() || yr()
        }
    },
    cs = class {
        constructor(e) {
            this.factorId = e
        }
        _process(e, t, n) {
            switch (t.type) {
                case `enroll`:
                    return this._finalizeEnroll(e, t.credential, n);
                case `signin`:
                    return this._finalizeSignIn(e, t.credential);
                default:
                    return N(`unexpected MultiFactorSessionType`)
            }
        }
    },
    ls = class e extends cs {
        constructor(e) {
            super(`phone`), this.credential = e
        }
        static _fromCredential(t) {
            return new e(t)
        }
        _finalizeEnroll(e, t, n) {
            return pa(e, {
                idToken: t,
                displayName: n,
                phoneVerificationInfo: this.credential._makeVerificationRequest()
            })
        }
        _finalizeSignIn(e, t) {
            return $a(e, {
                mfaPendingCredential: t,
                phoneVerificationInfo: this.credential._makeVerificationRequest()
            })
        }
    },
    us = class {
        constructor() {}
        static assertion(e) {
            return ls._fromCredential(e)
        }
    };
us.FACTOR_ID = `phone`;
var ds = class {
    static assertionForEnrollment(e, t) {
        return fs._fromSecret(e, t)
    }
    static assertionForSignIn(e, t) {
        return fs._fromEnrollmentId(e, t)
    }
    static async generateSecret(e) {
        let t = e;
        M(t.user ?.auth !== void 0, `internal-error`);
        let n = await ma(t.user.auth, {
            idToken: t.credential,
            totpEnrollmentInfo: {}
        });
        return ps._fromStartTotpMfaEnrollmentResponse(n, t.user.auth)
    }
};
ds.FACTOR_ID = `totp`;
var fs = class e extends cs {
        constructor(e, t, n) {
            super(`totp`), this.otp = e, this.enrollmentId = t, this.secret = n
        }
        static _fromSecret(t, n) {
            return new e(n, void 0, t)
        }
        static _fromEnrollmentId(t, n) {
            return new e(n, t)
        }
        async _finalizeEnroll(e, t, n) {
            return M(this.secret !== void 0, e, `argument-error`), ha(e, {
                idToken: t,
                displayName: n,
                totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
            })
        }
        async _finalizeSignIn(e, t) {
            M(this.enrollmentId !== void 0 && this.otp !== void 0, e, `argument-error`);
            let n = {
                verificationCode: this.otp
            };
            return eo(e, {
                mfaPendingCredential: t,
                mfaEnrollmentId: this.enrollmentId,
                totpVerificationInfo: n
            })
        }
    },
    ps = class e {
        constructor(e, t, n, r, i, a, o) {
            this.sessionInfo = a, this.auth = o, this.secretKey = e, this.hashingAlgorithm = t, this.codeLength = n, this.codeIntervalSeconds = r, this.enrollmentCompletionDeadline = i
        }
        static _fromStartTotpMfaEnrollmentResponse(t, n) {
            return new e(t.totpSessionInfo.sharedSecretKey, t.totpSessionInfo.hashingAlgorithm, t.totpSessionInfo.verificationCodeLength, t.totpSessionInfo.periodSec, new Date(t.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), t.totpSessionInfo.sessionInfo, n)
        }
        _makeTotpVerificationInfo(e) {
            return {
                sessionInfo: this.sessionInfo,
                verificationCode: e
            }
        }
        generateQrCodeUrl(e, t) {
            let n = !1;
            return (ms(e) || ms(t)) && (n = !0), n && (ms(e) && (e = this.auth.currentUser ?.email || `unknownuser`), ms(t) && (t = this.auth.name)), `otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`
        }
    };

function ms(e) {
    return e === void 0 || e ?.length === 0
}
var hs = `@firebase/auth`,
    gs = `1.13.1`,
    _s = class {
        constructor(e) {
            this.auth = e, this.internalListeners = new Map
        }
        getUid() {
            return this.assertAuthConfigured(), this.auth.currentUser ?.uid || null
        }
        async getToken(e) {
            return this.assertAuthConfigured(), await this.auth._initializationPromise, this.auth.currentUser ? {
                accessToken: await this.auth.currentUser.getIdToken(e)
            } : null
        }
        addAuthTokenListener(e) {
            if (this.assertAuthConfigured(), this.internalListeners.has(e)) return;
            let t = this.auth.onIdTokenChanged(t => {
                e(t ?.stsTokenManager.accessToken || null)
            });
            this.internalListeners.set(e, t), this.updateProactiveRefresh()
        }
        removeAuthTokenListener(e) {
            this.assertAuthConfigured();
            let t = this.internalListeners.get(e);
            t && (this.internalListeners.delete(e), t(), this.updateProactiveRefresh())
        }
        assertAuthConfigured() {
            M(this.auth._initializationPromise, `dependent-sdk-initialized-before-auth`)
        }
        updateProactiveRefresh() {
            this.internalListeners.size > 0 ? this.auth._startProactiveRefresh() : this.auth._stopProactiveRefresh()
        }
    };

function vs(e) {
    switch (e) {
        case `Node`:
            return `node`;
        case `ReactNative`:
            return `rn`;
        case `Worker`:
            return `webworker`;
        case `Cordova`:
            return `cordova`;
        case `WebExtension`:
            return `web-extension`;
        default:
            return
    }
}

function ys(e) {
    w(new y(`auth`, (t, {
        options: n
    }) => {
        let r = t.getProvider(`app`).getImmediate(),
            i = t.getProvider(`heartbeat`),
            a = t.getProvider(`app-check-internal`),
            {
                apiKey: o,
                authDomain: s
            } = r.options;
        M(o && !o.includes(`:`), `invalid-api-key`, {
            appName: r.name
        });
        let c = new Or(r, i, a, {
            apiKey: o,
            authDomain: s,
            clientPlatform: e,
            apiHost: `identitytoolkit.googleapis.com`,
            tokenApiHost: `securetoken.googleapis.com`,
            apiScheme: `https`,
            sdkClientVersion: Cr(e)
        });
        return Wr(c, n), c
    }, `PUBLIC`).setInstantiationMode(`EXPLICIT`).setInstanceCreatedCallback((e, t, n) => {
        e.getProvider(`auth-internal`).initialize()
    })), w(new y(`auth-internal`, e => (e => new _s(e))(U(e.getProvider(`auth`).getImmediate())), `PRIVATE`).setInstantiationMode(`EXPLICIT`)), O(hs, gs, vs(e)), O(hs, gs, `esm2020`)
}
var bs = ne(`authIdTokenMaxAge`) || 300,
    xs = null,
    Ss = e => async t => {
        let n = t && await t.getIdTokenResult(),
            r = n && (new Date().getTime() - Date.parse(n.issuedAtTime)) / 1e3;
        if (r && r > bs) return;
        let i = n ?.token;
        xs !== i && (xs = i, await fetch(e, {
            method: i ? `POST` : `DELETE`,
            headers: i ? {
                Authorization: `Bearer ${i}`
            } : {}
        }))
    };

function Cs(e = Jt()) {
    let t = T(e, `auth`);
    if (t.isInitialized()) return t.getImmediate();
    let n = Ur(e, {
            popupRedirectResolver: ss,
            persistence: [Za, xa, Da]
        }),
        r = ne(`authTokenSyncURL`);
    if (r && typeof isSecureContext == `boolean` && isSecureContext) {
        let e = new URL(r, location.origin);
        if (location.origin === e.origin) {
            let t = Ss(e.toString());
            ua(n, t, () => t(n.currentUser)), la(n, e => t(e))
        }
    }
    let i = ee(`auth`);
    return i && Gr(n, `http://${i}`), n
}

function ws() {
    return document.getElementsByTagName(`head`) ?.[0] ?? document
}
jr({
    loadJS(e) {
        return new Promise((t, n) => {
            let r = document.createElement(`script`);
            r.setAttribute(`src`, e), r.onload = t, r.onerror = e => {
                let t = A(`internal-error`);
                t.customData = e, n(t)
            }, r.type = `text/javascript`, r.charset = `UTF-8`, ws().appendChild(r)
        })
    },
    gapiScript: `https://apis.google.com/js/api.js`,
    recaptchaV2Script: `https://www.google.com/recaptcha/api.js`,
    recaptchaEnterpriseScript: `https://www.google.com/recaptcha/enterprise.js?render=`
}), ys(`Browser`);
var Ts = `@firebase/installations`,
    Es = `0.6.22`,
    Ds = 1e4,
    Os = `w:${Es}`,
    ks = `FIS_v2`,
    As = `https://firebaseinstallations.googleapis.com/v1`,
    js = 3600 * 1e3,
    J = new h(`installations`, `Installations`, {
        "missing-app-config-values": `Missing App configuration value: "{$valueName}"`,
        "not-registered": `Firebase Installation is not registered.`,
        "installation-not-found": `Firebase Installation not found.`,
        "request-failed": `{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"`,
        "app-offline": `Could not process request. Application offline.`,
        "delete-pending-registration": `Can't delete installation while there is a pending registration request.`
    });

function Ms(e) {
    return e instanceof m && e.code.includes(`request-failed`)
}

function Ns({
    projectId: e
}) {
    return `${As}/projects/${e}/installations`
}

function Ps(e) {
    return {
        token: e.token,
        requestStatus: 2,
        expiresIn: zs(e.expiresIn),
        creationTime: Date.now()
    }
}
async function Fs(e, t) {
    let n = (await t.json()).error;
    return J.create(`request-failed`, {
        requestName: e,
        serverCode: n.code,
        serverMessage: n.message,
        serverStatus: n.status
    })
}

function Is({
    apiKey: e
}) {
    return new Headers({
        "Content-Type": `application/json`,
        Accept: `application/json`,
        "x-goog-api-key": e
    })
}

function Ls(e, {
    refreshToken: t
}) {
    let n = Is(e);
    return n.append(`Authorization`, Bs(t)), n
}
async function Rs(e) {
    let t = await e();
    return t.status >= 500 && t.status < 600 ? e() : t
}

function zs(e) {
    return Number(e.replace(`s`, `000`))
}

function Bs(e) {
    return `${ks} ${e}`
}
async function Vs({
    appConfig: e,
    heartbeatServiceProvider: t
}, {
    fid: n
}) {
    let r = Ns(e),
        i = Is(e),
        a = t.getImmediate({
            optional: !0
        });
    if (a) {
        let e = await a.getHeartbeatsHeader();
        e && i.append(`x-firebase-client`, e)
    }
    let o = {
            fid: n,
            authVersion: ks,
            appId: e.appId,
            sdkVersion: Os
        },
        s = {
            method: `POST`,
            headers: i,
            body: JSON.stringify(o)
        },
        c = await Rs(() => fetch(r, s));
    if (c.ok) {
        let e = await c.json();
        return {
            fid: e.fid || n,
            registrationStatus: 2,
            refreshToken: e.refreshToken,
            authToken: Ps(e.authToken)
        }
    } else throw await Fs(`Create Installation`, c)
}

function Hs(e) {
    return new Promise(t => {
        setTimeout(t, e)
    })
}

function Us(e) {
    return btoa(String.fromCharCode(...e)).replace(/\+/g, `-`).replace(/\//g, `_`)
}
var Ws = /^[cdef][\w-]{21}$/,
    Gs = ``;

function Ks() {
    try {
        let e = new Uint8Array(17);
        (self.crypto || self.msCrypto).getRandomValues(e), e[0] = 112 + e[0] % 16;
        let t = qs(e);
        return Ws.test(t) ? t : Gs
    } catch {
        return Gs
    }
}

function qs(e) {
    return Us(e).substr(0, 22)
}

function Js(e) {
    return `${e.appName}!${e.appId}`
}
var Ys = new Map;

function Xs(e, t) {
    let n = Js(e);
    Zs(n, t), Qs(n, t)
}

function Zs(e, t) {
    let n = Ys.get(e);
    if (n)
        for (let e of n) e(t)
}

function Qs(e, t) {
    let n = $s();
    n && n.postMessage({
        key: e,
        fid: t
    }), ec()
}
var Y = null;

function $s() {
    return !Y && `BroadcastChannel` in self && (Y = new BroadcastChannel(`[Firebase] FID Change`), Y.onmessage = e => {
        Zs(e.data.key, e.data.fid)
    }), Y
}

function ec() {
    Ys.size === 0 && Y && (Y.close(), Y = null)
}
var tc = `firebase-installations-database`,
    nc = 1,
    X = `firebase-installations-store`,
    rc = null;

function ic() {
    return rc ||= rt(tc, nc, {
        upgrade: (e, t) => {
            switch (t) {
                case 0:
                    e.createObjectStore(X)
            }
        }
    }), rc
}
async function ac(e, t) {
    let n = Js(e),
        r = (await ic()).transaction(X, `readwrite`),
        i = r.objectStore(X),
        a = await i.get(n);
    return await i.put(t, n), await r.done, (!a || a.fid !== t.fid) && Xs(e, t.fid), t
}
async function oc(e) {
    let t = Js(e),
        n = (await ic()).transaction(X, `readwrite`);
    await n.objectStore(X).delete(t), await n.done
}
async function sc(e, t) {
    let n = Js(e),
        r = (await ic()).transaction(X, `readwrite`),
        i = r.objectStore(X),
        a = await i.get(n),
        o = t(a);
    return o === void 0 ? await i.delete(n) : await i.put(o, n), await r.done, o && (!a || a.fid !== o.fid) && Xs(e, o.fid), o
}
async function cc(e) {
    let t, n = await sc(e.appConfig, n => {
        let r = uc(e, lc(n));
        return t = r.registrationPromise, r.installationEntry
    });
    return n.fid === Gs ? {
        installationEntry: await t
    } : {
        installationEntry: n,
        registrationPromise: t
    }
}

function lc(e) {
    return mc(e || {
        fid: Ks(),
        registrationStatus: 0
    })
}

function uc(e, t) {
    if (t.registrationStatus === 0) {
        if (!navigator.onLine) return {
            installationEntry: t,
            registrationPromise: Promise.reject(J.create(`app-offline`))
        };
        let n = {
            fid: t.fid,
            registrationStatus: 1,
            registrationTime: Date.now()
        };
        return {
            installationEntry: n,
            registrationPromise: dc(e, n)
        }
    } else if (t.registrationStatus === 1) return {
        installationEntry: t,
        registrationPromise: fc(e)
    };
    else return {
        installationEntry: t
    }
}
async function dc(e, t) {
    try {
        let n = await Vs(e, t);
        return ac(e.appConfig, n)
    } catch (n) {
        throw Ms(n) && n.customData.serverCode === 409 ? await oc(e.appConfig) : await ac(e.appConfig, {
            fid: t.fid,
            registrationStatus: 0
        }), n
    }
}
async function fc(e) {
    let t = await pc(e.appConfig);
    for (; t.registrationStatus === 1;) await Hs(100), t = await pc(e.appConfig);
    if (t.registrationStatus === 0) {
        let {
            installationEntry: t,
            registrationPromise: n
        } = await cc(e);
        return n || t
    }
    return t
}

function pc(e) {
    return sc(e, e => {
        if (!e) throw J.create(`installation-not-found`);
        return mc(e)
    })
}

function mc(e) {
    return hc(e) ? {
        fid: e.fid,
        registrationStatus: 0
    } : e
}

function hc(e) {
    return e.registrationStatus === 1 && e.registrationTime + Ds < Date.now()
}
async function gc({
    appConfig: e,
    heartbeatServiceProvider: t
}, n) {
    let r = _c(e, n),
        i = Ls(e, n),
        a = t.getImmediate({
            optional: !0
        });
    if (a) {
        let e = await a.getHeartbeatsHeader();
        e && i.append(`x-firebase-client`, e)
    }
    let o = {
            installation: {
                sdkVersion: Os,
                appId: e.appId
            }
        },
        s = {
            method: `POST`,
            headers: i,
            body: JSON.stringify(o)
        },
        c = await Rs(() => fetch(r, s));
    if (c.ok) return Ps(await c.json());
    throw await Fs(`Generate Auth Token`, c)
}

function _c(e, {
    fid: t
}) {
    return `${Ns(e)}/${t}/authTokens:generate`
}
async function vc(e, t = !1) {
    let n, r = await sc(e.appConfig, r => {
        if (!Sc(r)) throw J.create(`not-registered`);
        let i = r.authToken;
        if (!t && Cc(i)) return r;
        if (i.requestStatus === 1) return n = yc(e, t), r; {
            if (!navigator.onLine) throw J.create(`app-offline`);
            let t = Tc(r);
            return n = xc(e, t), t
        }
    });
    return n ? await n : r.authToken
}
async function yc(e, t) {
    let n = await bc(e.appConfig);
    for (; n.authToken.requestStatus === 1;) await Hs(100), n = await bc(e.appConfig);
    let r = n.authToken;
    return r.requestStatus === 0 ? vc(e, t) : r
}

function bc(e) {
    return sc(e, e => {
        if (!Sc(e)) throw J.create(`not-registered`);
        let t = e.authToken;
        return Ec(t) ? { ...e,
            authToken: {
                requestStatus: 0
            }
        } : e
    })
}
async function xc(e, t) {
    try {
        let n = await gc(e, t),
            r = { ...t,
                authToken: n
            };
        return await ac(e.appConfig, r), n
    } catch (n) {
        if (Ms(n) && (n.customData.serverCode === 401 || n.customData.serverCode === 404)) await oc(e.appConfig);
        else {
            let n = { ...t,
                authToken: {
                    requestStatus: 0
                }
            };
            await ac(e.appConfig, n)
        }
        throw n
    }
}

function Sc(e) {
    return e !== void 0 && e.registrationStatus === 2
}

function Cc(e) {
    return e.requestStatus === 2 && !wc(e)
}

function wc(e) {
    let t = Date.now();
    return t < e.creationTime || e.creationTime + e.expiresIn < t + js
}

function Tc(e) {
    let t = {
        requestStatus: 1,
        requestTime: Date.now()
    };
    return { ...e,
        authToken: t
    }
}

function Ec(e) {
    return e.requestStatus === 1 && e.requestTime + Ds < Date.now()
}
async function Dc(e) {
    let t = e,
        {
            installationEntry: n,
            registrationPromise: r
        } = await cc(t);
    return r ? r.catch(console.error) : vc(t).catch(console.error), n.fid
}
async function Oc(e, t = !1) {
    let n = e;
    return await kc(n), (await vc(n, t)).token
}
async function kc(e) {
    let {
        registrationPromise: t
    } = await cc(e);
    t && await t
}

function Ac(e) {
    if (!e || !e.options) throw jc(`App Configuration`);
    if (!e.name) throw jc(`App Name`);
    for (let t of [`projectId`, `apiKey`, `appId`])
        if (!e.options[t]) throw jc(t);
    return {
        appName: e.name,
        projectId: e.options.projectId,
        apiKey: e.options.apiKey,
        appId: e.options.appId
    }
}

function jc(e) {
    return J.create(`missing-app-config-values`, {
        valueName: e
    })
}
var Mc = `installations`,
    Nc = `installations-internal`,
    Pc = e => {
        let t = e.getProvider(`app`).getImmediate();
        return {
            app: t,
            appConfig: Ac(t),
            heartbeatServiceProvider: T(t, `heartbeat`),
            _delete: () => Promise.resolve()
        }
    },
    Fc = e => {
        let t = T(e.getProvider(`app`).getImmediate(), Mc).getImmediate();
        return {
            getId: () => Dc(t),
            getToken: e => Oc(t, e)
        }
    };

function Ic() {
    w(new y(Mc, Pc, `PUBLIC`)), w(new y(Nc, Fc, `PRIVATE`))
}
Ic(), O(Ts, Es), O(Ts, Es, `esm2020`);
var Lc = `analytics`,
    Rc = `firebase_id`,
    zc = `origin`,
    Bc = 60 * 1e3,
    Vc = `https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig`,
    Hc = `https://www.googletagmanager.com/gtag/js`,
    Z = new ze(`@firebase/analytics`),
    Q = new h(`analytics`, `Analytics`, {
        "already-exists": `A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.`,
        "already-initialized": `initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.`,
        "already-initialized-settings": `Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.`,
        "interop-component-reg-failed": `Firebase Analytics Interop Component failed to instantiate: {$reason}`,
        "invalid-analytics-context": `Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}`,
        "indexeddb-unavailable": `IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}`,
        "fetch-throttle": `The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.`,
        "config-fetch-failed": `Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}`,
        "no-api-key": `The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.`,
        "no-app-id": `The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.`,
        "no-client-id": `The "client_id" field is empty.`,
        "invalid-gtag-resource": `Trusted Types detected an invalid gtag resource: {$gtagURL}.`
    });

function Uc(e) {
    if (!e.startsWith(Hc)) {
        let t = Q.create(`invalid-gtag-resource`, {
            gtagURL: e
        });
        return Z.warn(t.message), ``
    }
    return e
}

function Wc(e) {
    return Promise.all(e.map(e => e.catch(e => e)))
}

function Gc(e, t) {
    let n;
    return window.trustedTypes && (n = window.trustedTypes.createPolicy(e, t)), n
}

function Kc(e, t) {
    let n = Gc(`firebase-js-sdk-policy`, {
            createScriptURL: Uc
        }),
        r = document.createElement(`script`),
        i = `${Hc}?l=${e}&id=${t}`;
    r.src = n ? n ?.createScriptURL(i) : i, r.async = !0, document.head.appendChild(r)
}

function qc(e) {
    let t = [];
    return Array.isArray(window[e]) ? t = window[e] : window[e] = t, t
}
async function Jc(e, t, n, r, i, a) {
    let o = r[i];
    try {
        if (o) await t[o];
        else {
            let e = (await Wc(n)).find(e => e.measurementId === i);
            e && await t[e.appId]
        }
    } catch (e) {
        Z.error(e)
    }
    e(`config`, i, a)
}
async function Yc(e, t, n, r, i) {
    try {
        let a = [];
        if (i && i.send_to) {
            let e = i.send_to;
            Array.isArray(e) || (e = [e]);
            let r = await Wc(n);
            for (let n of e) {
                let e = r.find(e => e.measurementId === n),
                    i = e && t[e.appId];
                if (i) a.push(i);
                else {
                    a = [];
                    break
                }
            }
        }
        a.length === 0 && (a = Object.values(t)), await Promise.all(a), e(`event`, r, i || {})
    } catch (e) {
        Z.error(e)
    }
}

function Xc(e, t, n, r) {
    async function i(i, ...a) {
        try {
            if (i === `event`) {
                let [r, i] = a;
                await Yc(e, t, n, r, i)
            } else if (i === `config`) {
                let [i, o] = a;
                await Jc(e, t, n, r, i, o)
            } else if (i === `consent`) {
                let [t, n] = a;
                e(`consent`, t, n)
            } else if (i === `get`) {
                let [t, n, r] = a;
                e(`get`, t, n, r)
            } else if (i === `set`) {
                let [t] = a;
                e(`set`, t)
            } else e(i, ...a)
        } catch (e) {
            Z.error(e)
        }
    }
    return i
}

function Zc(e, t, n, r, i) {
    let a = function(...e) {
        window[r].push(arguments)
    };
    return window[i] && typeof window[i] == `function` && (a = window[i]), window[i] = Xc(a, e, t, n), {
        gtagCore: a,
        wrappedGtag: window[i]
    }
}

function Qc(e) {
    let t = window.document.getElementsByTagName(`script`);
    for (let n of Object.values(t))
        if (n.src && n.src.includes(Hc) && n.src.includes(e)) return n;
    return null
}
var $c = 30,
    el = 1e3,
    tl = new class {
        constructor(e = {}, t = el) {
            this.throttleMetadata = e, this.intervalMillis = t
        }
        getThrottleMetadata(e) {
            return this.throttleMetadata[e]
        }
        setThrottleMetadata(e, t) {
            this.throttleMetadata[e] = t
        }
        deleteThrottleMetadata(e) {
            delete this.throttleMetadata[e]
        }
    };

function nl(e) {
    return new Headers({
        Accept: `application/json`,
        "x-goog-api-key": e
    })
}
async function rl(e) {
    let {
        appId: t,
        apiKey: n
    } = e, r = {
        method: `GET`,
        headers: nl(n)
    }, i = Vc.replace(`{app-id}`, t), a = await fetch(i, r);
    if (a.status !== 200 && a.status !== 304) {
        let e = ``;
        try {
            let t = await a.json();
            t.error ?.message && (e = t.error.message)
        } catch {}
        throw Q.create(`config-fetch-failed`, {
            httpStatus: a.status,
            responseMessage: e
        })
    }
    return a.json()
}
async function il(e, t = tl, n) {
    let {
        appId: r,
        apiKey: i,
        measurementId: a
    } = e.options;
    if (!r) throw Q.create(`no-app-id`);
    if (!i) {
        if (a) return {
            measurementId: a,
            appId: r
        };
        throw Q.create(`no-api-key`)
    }
    let o = t.getThrottleMetadata(r) || {
            backoffCount: 0,
            throttleEndTimeMillis: Date.now()
        },
        s = new cl;
    return setTimeout(async () => {
        s.abort()
    }, n === void 0 ? Bc : n), al({
        appId: r,
        apiKey: i,
        measurementId: a
    }, o, s, t)
}
async function al(e, {
    throttleEndTimeMillis: t,
    backoffCount: n
}, r, i = tl) {
    let {
        appId: a,
        measurementId: o
    } = e;
    try {
        await ol(r, t)
    } catch (e) {
        if (o) return Z.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${e?.message}]`), {
            appId: a,
            measurementId: o
        };
        throw e
    }
    try {
        let t = await rl(e);
        return i.deleteThrottleMetadata(a), t
    } catch (t) {
        let s = t;
        if (!sl(s)) {
            if (i.deleteThrottleMetadata(a), o) return Z.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${s?.message}]`), {
                appId: a,
                measurementId: o
            };
            throw t
        }
        let c = Number(s ?.customData ?.httpStatus) === 503 ? De(n, i.intervalMillis, $c) : De(n, i.intervalMillis),
            l = {
                throttleEndTimeMillis: Date.now() + c,
                backoffCount: n + 1
            };
        return i.setThrottleMetadata(a, l), Z.debug(`Calling attemptFetch again in ${c} millis`), al(e, l, r, i)
    }
}

function ol(e, t) {
    return new Promise((n, r) => {
        let i = Math.max(t - Date.now(), 0),
            a = setTimeout(n, i);
        e.addEventListener(() => {
            clearTimeout(a), r(Q.create(`fetch-throttle`, {
                throttleEndTimeMillis: t
            }))
        })
    })
}

function sl(e) {
    if (!(e instanceof m) || !e.customData) return !1;
    let t = Number(e.customData.httpStatus);
    return t === 429 || t === 500 || t === 503 || t === 504
}
var cl = class {
        constructor() {
            this.listeners = []
        }
        addEventListener(e) {
            this.listeners.push(e)
        }
        abort() {
            this.listeners.forEach(e => e())
        }
    },
    ll;
async function ul(e, t, n, r, i) {
    if (i && i.global) {
        e(`event`, n, r);
        return
    } else {
        let i = await t;
        e(`event`, n, { ...r,
            send_to: i
        })
    }
}
async function dl(e, t, n, r) {
    if (r && r.global) {
        let t = {};
        for (let e of Object.keys(n)) t[`user_properties.${e}`] = n[e];
        return e(`set`, t), Promise.resolve()
    } else e(`config`, await t, {
        update: !0,
        user_properties: n
    })
}
async function fl(e, t) {
    let n = await e;
    window[`ga-disable-${n}`] = !t
}
var pl;

function ml(e) {
    pl = e
}

function hl(e) {
    ll = e
}
async function gl() {
    if (le()) try {
        await ue()
    } catch (e) {
        return Z.warn(Q.create(`indexeddb-unavailable`, {
            errorInfo: e ?.toString()
        }).message), !1
    } else return Z.warn(Q.create(`indexeddb-unavailable`, {
        errorInfo: `IndexedDB is not available in this environment.`
    }).message), !1;
    return !0
}
async function _l(e, t, n, r, i, a, o) {
    let s = il(e);
    s.then(t => {
        n[t.measurementId] = t.appId, e.options.measurementId && t.measurementId !== e.options.measurementId && Z.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${t.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)
    }).catch(e => Z.error(e)), t.push(s);
    let c = gl().then(e => {
            if (e) return r.getId()
        }),
        [l, u] = await Promise.all([s, c]);
    Qc(a) || Kc(a, l.measurementId), pl && (i(`consent`, `default`, pl), ml(void 0)), i(`js`, new Date);
    let d = o ?.config ?? {};
    return d[zc] = `firebase`, d.update = !0, u != null && (d[Rc] = u), i(`config`, l.measurementId, d), ll && (i(`set`, ll), hl(void 0)), l.measurementId
}
var vl = class {
        constructor(e) {
            this.app = e
        }
        _delete() {
            return delete $[this.app.options.appId], Promise.resolve()
        }
    },
    $ = {},
    yl = [],
    bl = {},
    xl = `dataLayer`,
    Sl = `gtag`,
    Cl, wl, Tl = !1;

function El() {
    let e = [];
    if (oe() && e.push(`This is a browser extension environment.`), de() || e.push(`Cookies are not available.`), e.length > 0) {
        let t = e.map((e, t) => `(${t+1}) ${e}`).join(` `),
            n = Q.create(`invalid-analytics-context`, {
                errorInfo: t
            });
        Z.warn(n.message)
    }
}

function Dl(e, t, n) {
    El();
    let r = e.options.appId;
    if (!r) throw Q.create(`no-app-id`);
    if (!e.options.apiKey)
        if (e.options.measurementId) Z.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);
        else throw Q.create(`no-api-key`);
    if ($[r] != null) throw Q.create(`already-exists`, {
        id: r
    });
    if (!Tl) {
        qc(xl);
        let {
            wrappedGtag: e,
            gtagCore: t
        } = Zc($, yl, bl, xl, Sl);
        wl = e, Cl = t, Tl = !0
    }
    return $[r] = _l(e, yl, bl, t, Cl, xl, n), new vl(e)
}

function Ol(e = Jt()) {
    e = v(e);
    let t = T(e, Lc);
    return t.isInitialized() ? t.getImmediate() : kl(e)
}

function kl(e, t = {}) {
    let n = T(e, Lc);
    if (n.isInitialized()) {
        let e = n.getImmediate();
        if (g(t, n.getOptions())) return e;
        throw Q.create(`already-initialized`)
    }
    return n.initialize({
        options: t
    })
}

function Al(e, t, n) {
    e = v(e), dl(wl, $[e.app.options.appId], t, n).catch(e => Z.error(e))
}

function jl(e, t) {
    e = v(e), fl($[e.app.options.appId], t).catch(e => Z.error(e))
}

function Ml(e, t, n, r) {
    e = v(e), ul(wl, $[e.app.options.appId], t, n, r).catch(e => Z.error(e))
}
var Nl = `@firebase/analytics`,
    Pl = `0.10.22`;

function Fl() {
    w(new y(Lc, (e, {
        options: t
    }) => Dl(e.getProvider(`app`).getImmediate(), e.getProvider(`installations-internal`).getImmediate(), t), `PUBLIC`)), w(new y(`analytics-internal`, e, `PRIVATE`)), O(Nl, Pl), O(Nl, Pl, `esm2020`);

    function e(e) {
        try {
            let t = e.getProvider(Lc).getImmediate();
            return {
                logEvent: (e, n, r) => Ml(t, e, n, r),
                setUserProperties: (e, n) => Al(t, e, n)
            }
        } catch (e) {
            throw Q.create(`interop-component-reg-failed`, {
                reason: e
            })
        }
    }
}
Fl();
export {
    Yt as A, Yi as C, Qi as D, $i as E, O as M, m as N, qi as O, ca as S, ji as T, ho as _, Ci as a, mo as b, Da as c, Ji as d, sa as f, Li as g, Za as h, vi as i, qt as j, Jt as k, Ki as l, Kn as m, Ml as n, Si as o, Cs as p, jl as r, Gi as s, Ol as t, Wi as u, da as v, po as w, Xi as x, Ri as y
};
//#sourceMappingURL=vendor-firebase.277Ts-og.js.map