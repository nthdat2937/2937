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
        t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = `a950ff47-6600-4147-93c3-dc355b09d8b4`, e._sentryDebugIdIdentifier = `sentry-dbid-a950ff47-6600-4147-93c3-dc355b09d8b4`)
    } catch {}
})();
import {
    o as e,
    t
} from "./rolldown-runtime.CC5CxxlI.js";
import {
    at as n,
    ct as r,
    dt as i,
    gt as a,
    ht as o,
    lt as s,
    mt as c,
    ot as l,
    pt as u,
    st as d,
    ut as f,
    xt as p
} from "./monkeytype-packages.BmEtDlnt.js";
import {
    Q as m,
    gt as h
} from "./vendor-tanstack.CgYxA78S.js";
import {
    F as g,
    G as _,
    H as v,
    K as y,
    M as b,
    O as x,
    R as S,
    S as C,
    T as w,
    V as T,
    W as ee,
    _ as te,
    j as E,
    k as D,
    q as O,
    w as k
} from "./vendor-chart.Dhx0-zdQ.js";

function A(e, t, n, r = e => e) {
    let i = r,
        a = [];
    for (let r = 0; r < e.length; r += 1) {
        let o = i(e[r]),
            s = r - t,
            c = s >= 0 ? s : 0,
            l = r + t + 1,
            u = 0,
            d = 0;
        for (let t = c; t < l && t < e.length; t += 1) {
            let r = i(e[t]);
            Math.abs(r - o) <= n && (d += r, u += 1)
        }
        a[r] = u > 0 ? d / u : o
    }
    return a
}

function ne(e) {
    for (let t = e.length - 1; t > 0; --t) {
        let n = a(0, t),
            r = e[n];
        e[n] = e[t], e[t] = r
    }
}

function re(e) {
    return e[e.length - 1]
}

function ie(e, t) {
    return e.length === t.length && e.every(e => t.includes(e))
}

function j(e, t) {
    return e.length === t.length && e.every((e, n) => e === t[n])
}

function ae(e) {
    return e[a(0, e.length - 1)]
}

function M(e, t) {
    return t = t < 0 ? e.length + t : t, e[t]
}
var N = typeof window < `u`,
    oe = N ? window : null,
    P = N ? document : null,
    F = {
        OBJECT: 0,
        ATTRIBUTE: 1,
        CSS: 2,
        TRANSFORM: 3,
        CSS_VAR: 4
    },
    I = {
        NUMBER: 0,
        UNIT: 1,
        COLOR: 2,
        COMPLEX: 3
    },
    L = {
        NONE: 0,
        AUTO: 1,
        FORCE: 2
    },
    R = {
        replace: 0,
        none: 1,
        blend: 2
    },
    se = Symbol(),
    ce = Symbol(),
    le = Symbol(),
    ue = Symbol(),
    de = Symbol(),
    z = 1e-11,
    fe = 0xe8d4a51000,
    pe = 1e3,
    me = (() => {
        let e = new Map;
        return e.set(`x`, `translateX`), e.set(`y`, `translateY`), e.set(`z`, `translateZ`), e
    })(),
    he = [`translateX`, `translateY`, `translateZ`, `rotate`, `rotateX`, `rotateY`, `rotateZ`, `scale`, `scaleX`, `scaleY`, `scaleZ`, `skew`, `skewX`, `skewY`, `matrix`, `matrix3d`, `perspective`],
    ge = he.reduce((e, t) => ({ ...e,
        [t]: t + `(`
    }), {}),
    _e = () => {},
    ve = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i,
    ye = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,
    be = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,
    xe = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i,
    Se = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,
    Ce = /[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi,
    we = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i,
    Te = /([a-z])([A-Z])/g,
    Ee = /(\w+)(\([^)]+\)+)/g,
    De = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/,
    Oe = {
        id: null,
        keyframes: null,
        playbackEase: null,
        playbackRate: 1,
        frameRate: 120,
        loop: 0,
        reversed: !1,
        alternate: !1,
        autoplay: !0,
        persist: !1,
        duration: pe,
        delay: 0,
        loopDelay: 0,
        ease: `out(2)`,
        composition: R.replace,
        modifier: e => e,
        onBegin: _e,
        onBeforeUpdate: _e,
        onUpdate: _e,
        onLoop: _e,
        onPause: _e,
        onComplete: _e,
        onRender: _e
    },
    ke = {
        current: null,
        root: P
    },
    B = {
        defaults: Oe,
        precision: 4,
        timeScale: 1,
        tickThreshold: 200
    },
    Ae = {
        version: `4.2.2`,
        engine: null
    };
N && (oe.AnimeJS ||= [], oe.AnimeJS.push(Ae));
var je = e => e.replace(Te, `$1-$2`).toLowerCase(),
    Me = (e, t) => e.indexOf(t) === 0,
    Ne = Date.now,
    Pe = Array.isArray,
    Fe = e => e && e.constructor === Object,
    Ie = e => typeof e == `number` && !isNaN(e),
    Le = e => typeof e == `string`,
    Re = e => typeof e == `function`,
    V = e => e === void 0,
    ze = e => V(e) || e === null,
    Be = e => N && e instanceof SVGElement,
    Ve = e => ve.test(e),
    He = e => Me(e, `rgb`),
    Ue = e => Me(e, `hsl`),
    We = e => Ve(e) || He(e) || Ue(e),
    Ge = e => !B.defaults.hasOwnProperty(e),
    Ke = [`opacity`, `rotate`, `overflow`, `color`],
    qe = (e, t) => {
        if (Ke.includes(t)) return !1;
        if (e.getAttribute(t) || t in e) {
            if (t === `scale`) {
                let t = e.parentNode;
                return t && t.tagName === `filter`
            }
            return !0
        }
    },
    Je = Math.pow,
    Ye = Math.sqrt,
    Xe = Math.sin,
    Ze = Math.cos,
    Qe = Math.floor,
    $e = Math.asin,
    et = Math.PI,
    tt = Math.round,
    H = (e, t, n) => e < t ? t : e > n ? n : e,
    nt = {},
    U = (e, t) => {
        if (t < 0) return e;
        if (!t) return tt(e);
        let n = nt[t];
        return n ||= nt[t] = 10 ** t, tt(e * n) / n
    },
    rt = (e, t, n) => e + (t - e) * n,
    it = e => e === 1 / 0 ? fe : e === -1 / 0 ? -fe : e,
    at = e => e <= 1e-11 ? z : it(U(e, 11)),
    W = e => Pe(e) ? [...e] : e,
    ot = (e, t) => {
        let n = { ...e
        };
        for (let r in t) {
            let i = e[r];
            n[r] = V(i) ? t[r] : i
        }
        return n
    },
    G = (e, t, n, r = `_prev`, i = `_next`) => {
        let a = e._head,
            o = i;
        for (n && (a = e._tail, o = r); a;) {
            let e = a[o];
            t(a), a = e
        }
    },
    st = (e, t, n = `_prev`, r = `_next`) => {
        let i = t[n],
            a = t[r];
        i ? i[r] = a : e._head = a, a ? a[n] = i : e._tail = i, t[n] = null, t[r] = null
    },
    ct = (e, t, n, r = `_prev`, i = `_next`) => {
        let a = e._tail;
        for (; a && n && n(a, t);) a = a[r];
        let o = a ? a[i] : e._head;
        a ? a[i] = t : e._head = t, o ? o[r] = t : e._tail = t, t[r] = a, t[i] = o
    },
    lt = (e, t, n) => {
        let r = e.style.transform,
            i;
        if (r) {
            let a = e[ue],
                o;
            for (; o = Ee.exec(r);) {
                let e = o[1],
                    r = o[2].slice(1, -1);
                a[e] = r, e === t && (i = r, n && (n[t] = r))
            }
        }
        return r && !V(i) ? i : Me(t, `scale`) ? `1` : Me(t, `rotate`) || Me(t, `skew`) ? `0deg` : `0px`
    },
    ut = e => {
        let t = ye.exec(e) || be.exec(e),
            n = V(t[4]) ? 1 : +t[4];
        return [+t[1], +t[2], +t[3], n]
    },
    dt = e => {
        let t = e.length,
            n = t === 4 || t === 5;
        return [+(`0x` + e[1] + e[n ? 1 : 2]), +(`0x` + e[n ? 2 : 3] + e[n ? 2 : 4]), +(`0x` + e[n ? 3 : 5] + e[n ? 3 : 6]), t === 5 || t === 9 ? +((`0x` + e[n ? 4 : 7] + e[n ? 4 : 8]) / 255).toFixed(3) : 1]
    },
    ft = (e, t, n) => (n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e),
    pt = e => {
        let t = xe.exec(e) || Se.exec(e),
            n = t[1] / 360,
            r = t[2] / 100,
            i = t[3] / 100,
            a = V(t[4]) ? 1 : +t[4],
            o, s, c;
        if (r === 0) o = s = c = i;
        else {
            let e = i < .5 ? i * (1 + r) : i + r - i * r,
                t = 2 * i - e;
            o = U(ft(t, e, n + 1 / 3) * 255, 0), s = U(ft(t, e, n) * 255, 0), c = U(ft(t, e, n - 1 / 3) * 255, 0)
        }
        return [o, s, c, a]
    },
    mt = e => He(e) ? ut(e) : Ve(e) ? dt(e) : Ue(e) ? pt(e) : [0, 0, 0, 1],
    K = (e, t) => V(e) ? t : e,
    ht = (e, t, n, r, i) => {
        let a;
        if (Re(e)) a = () => {
            let i = e(t, n, r);
            return isNaN(+i) ? i || 0 : +i
        };
        else if (Le(e) && Me(e, `var(`)) a = () => {
            let n = e.match(De),
                r = n[1],
                i = n[2],
                a = getComputedStyle(t) ?.getPropertyValue(r);
            return (!a || a.trim() === ``) && i && (a = i.trim()), a || 0
        };
        else return e;
        return i && (i.func = a), a()
    },
    gt = (e, t) => e[ce] ? e[le] && qe(e, t) ? F.ATTRIBUTE : he.includes(t) || me.get(t) ? F.TRANSFORM : Me(t, `--`) ? F.CSS_VAR : t in e.style ? F.CSS : t in e ? F.OBJECT : F.ATTRIBUTE : F.OBJECT,
    _t = (e, t, n) => {
        let r = e.style[t];
        r && n && (n[t] = r);
        let i = r || getComputedStyle(e[de] || e).getPropertyValue(t);
        return i === `auto` ? `0` : i
    },
    vt = (e, t, n, r) => {
        let i = V(n) ? gt(e, t) : n;
        return i === F.OBJECT ? e[t] || 0 : i === F.ATTRIBUTE ? e.getAttribute(t) : i === F.TRANSFORM ? lt(e, t, r) : i === F.CSS_VAR ? _t(e, t, r).trimStart() : _t(e, t, r)
    },
    yt = (e, t, n) => n === `-` ? e - t : n === `+` ? e + t : e * t,
    bt = () => ({
        t: I.NUMBER,
        n: 0,
        u: null,
        o: null,
        d: null,
        s: null
    }),
    xt = (e, t) => {
        if (t.t = I.NUMBER, t.n = 0, t.u = null, t.o = null, t.d = null, t.s = null, !e) return t;
        let n = +e;
        if (isNaN(n)) {
            let n = e;
            n[1] === `=` && (t.o = n[0], n = n.slice(2));
            let r = n.includes(` `) ? !1 : we.exec(n);
            if (r) return t.t = I.UNIT, t.n = +r[1], t.u = r[2], t;
            if (t.o) return t.n = +n, t;
            if (We(n)) return t.t = I.COLOR, t.d = mt(n), t; {
                let e = n.match(Ce);
                return t.t = I.COMPLEX, t.d = e ? e.map(Number) : [], t.s = n.split(Ce) || [], t
            }
        } else return t.n = n, t
    },
    St = (e, t) => (t.t = e._valueType, t.n = e._toNumber, t.u = e._unit, t.o = null, t.d = W(e._toNumbers), t.s = W(e._strings), t),
    Ct = bt(),
    wt = (e, t, n, r, i) => {
        let a = e.parent,
            o = e.duration,
            s = e.completed,
            c = e.iterationDuration,
            l = e.iterationCount,
            u = e._currentIteration,
            d = e._loopDelay,
            f = e._reversed,
            p = e._alternate,
            m = e._hasChildren,
            h = e._delay,
            g = e._currentTime,
            _ = h + c,
            v = t - h,
            y = H(g, -h, o),
            b = H(v, -h, o),
            x = v - g,
            S = b > 0,
            C = b >= o,
            w = o <= z,
            T = i === L.FORCE,
            ee = 0,
            te = v,
            E = 0;
        l > 1 && (e._currentIteration = H(~~(b / (c + (C ? 0 : d))), 0, l), C && e._currentIteration--, ee = e._currentIteration % 2, te = b % (c + d) || 0);
        let D = f ^ (p && ee),
            O = e._ease,
            k = C ? D ? 0 : o : D ? c - te : te;
        O && (k = c * O(k / c) || 0);
        let A = (a ? a.backwards : v < g) ? !D : !!D;
        if (e._currentTime = v, e._iterationTime = k, e.backwards = A, S && !e.began ? (e.began = !0, !n && !(a && (A || !a.began)) && e.onBegin(e)) : v <= 0 && (e.began = !1), !n && !m && S && e._currentIteration !== u && e.onLoop(e), T || i === L.AUTO && (t >= h && t <= _ || t <= h && y > h || t >= _ && y !== o) || k >= _ && y !== o || k <= h && y > 0 || t <= y && y === o && s || C && !s && w) {
            if (S && (e.computeDeltaTime(y), n || e.onBeforeUpdate(e)), !m) {
                let t = T || (A ? x * -1 : x) >= B.tickThreshold,
                    i = e._offset + (a ? a._offset : 0) + h + k,
                    o = e._head,
                    s, c, l, u, d = 0;
                for (; o;) {
                    let e = o._composition,
                        n = o._currentTime,
                        a = o._changeDuration,
                        f = o._absoluteStartTime + o._changeDuration,
                        p = o._nextRep,
                        m = o._prevRep,
                        h = e !== R.none;
                    if ((t || (n !== a || i <= f + (p ? p._delay : 0)) && (n !== 0 || i >= o._absoluteStartTime)) && (!h || !o._isOverridden && (!o._isOverlapped || i <= f) && (!p || p._isOverridden || i <= p._absoluteStartTime) && (!m || m._isOverridden || i >= m._absoluteStartTime + m._changeDuration + o._delay))) {
                        let t = o._currentTime = H(k - o._startTime, 0, a),
                            n = o._ease(t / o._updateDuration),
                            i = o._modifier,
                            f = o._valueType,
                            p = o._tweenType,
                            m = p === F.OBJECT,
                            g = f === I.NUMBER,
                            _ = g && m || n === 0 || n === 1 ? -1 : B.precision,
                            v, y;
                        if (g) v = y = i(U(rt(o._fromNumber, o._toNumber, n), _));
                        else if (f === I.UNIT) y = i(U(rt(o._fromNumber, o._toNumber, n), _)), v = `${y}${o._unit}`;
                        else if (f === I.COLOR) {
                            let e = o._fromNumbers,
                                t = o._toNumbers,
                                r = U(H(i(rt(e[0], t[0], n)), 0, 255), 0),
                                a = U(H(i(rt(e[1], t[1], n)), 0, 255), 0),
                                s = U(H(i(rt(e[2], t[2], n)), 0, 255), 0),
                                c = H(i(U(rt(e[3], t[3], n), _)), 0, 1);
                            if (v = `rgba(${r},${a},${s},${c})`, h) {
                                let e = o._numbers;
                                e[0] = r, e[1] = a, e[2] = s, e[3] = c
                            }
                        } else if (f === I.COMPLEX) {
                            v = o._strings[0];
                            for (let e = 0, t = o._toNumbers.length; e < t; e++) {
                                let t = i(U(rt(o._fromNumbers[e], o._toNumbers[e], n), _)),
                                    r = o._strings[e + 1];
                                v += `${r?t+r:t}`, h && (o._numbers[e] = t)
                            }
                        }
                        if (h && (o._number = y), !r && e !== R.blend) {
                            let e = o.property;
                            s = o.target, m ? s[e] = v : p === F.ATTRIBUTE ? s.setAttribute(e, v) : (c = s.style, p === F.TRANSFORM ? (s !== l && (l = s, u = s[ue]), u[e] = v, d = 1) : p === F.CSS ? c[e] = v : p === F.CSS_VAR && c.setProperty(e, v)), S && (E = 1)
                        } else o._value = v
                    }
                    if (d && o._renderTransforms) {
                        let e = ``;
                        for (let t in u) e += `${ge[t]}${u[t]}) `;
                        c.transform = e, d = 0
                    }
                    o = o._next
                }!n && E && e.onRender(e)
            }!n && S && e.onUpdate(e)
        }
        return a && w ? !n && (a.began && !A && v > 0 && !s || A && v <= 1e-11 && s) && (e.onComplete(e), e.completed = !A) : S && C ? l === 1 / 0 ? e._startTime += e.duration : e._currentIteration >= l - 1 && (e.paused = !0, !s && !m && (e.completed = !0, !n && !(a && (A || !a.began)) && (e.onComplete(e), e._resolve(e)))) : e.completed = !1, E
    },
    Tt = (e, t, n, r, i) => {
        let a = e._currentIteration;
        if (wt(e, t, n, r, i), e._hasChildren) {
            let o = e,
                s = o.backwards,
                c = r ? t : o._iterationTime,
                l = Ne(),
                u = 0,
                d = !0;
            if (!r && o._currentIteration !== a) {
                let e = o.iterationDuration;
                G(o, t => {
                    if (!s) !t.completed && !t.backwards && t._currentTime < t.iterationDuration && wt(t, e, n, 1, L.FORCE), t.began = !1, t.completed = !1;
                    else {
                        let r = t.duration,
                            i = t._offset + t._delay,
                            a = i + r;
                        !n && r <= 1e-11 && (!i || a === e) && t.onComplete(t)
                    }
                }), n || o.onLoop(o)
            }
            G(o, e => {
                let t = U((c - e._offset) * e._speed, 12),
                    a = e._fps < o._fps ? e.requestTick(l) : i;
                u += wt(e, t, n, r, a), !e.completed && d && (d = !1)
            }, s), !n && u && o.onRender(o), (d || s) && o._currentTime >= o.duration && (o.paused = !0, o.completed || (o.completed = !0, n || (o.onComplete(o), o._resolve(o))))
        }
    },
    Et = {},
    Dt = (e, t, n) => {
        if (n === F.TRANSFORM) return me.get(e) || e;
        if (n === F.CSS || n === F.ATTRIBUTE && Be(t) && e in t.style) {
            let t = Et[e];
            if (t) return t; {
                let t = e && je(e);
                return Et[e] = t, t
            }
        } else return e
    },
    Ot = e => {
        if (e._hasChildren) G(e, Ot, !0);
        else {
            let t = e;
            t.pause(), G(t, e => {
                let n = e.property,
                    r = e.target;
                if (r[ce]) {
                    let i = r.style,
                        a = e._inlineValue,
                        o = ze(a) || a === ``;
                    if (e._tweenType === F.TRANSFORM) {
                        let t = r[ue];
                        if (o ? delete t[n] : t[n] = a, e._renderTransforms)
                            if (!Object.keys(t).length) i.removeProperty(`transform`);
                            else {
                                let e = ``;
                                for (let n in t) e += ge[n] + t[n] + `) `;
                                i.transform = e
                            }
                    } else o ? i.removeProperty(je(n)) : i[n] = a;
                    t._tail === e && t.targets.forEach(e => {
                        e.getAttribute && e.getAttribute(`style`) === `` && e.removeAttribute(`style`)
                    })
                }
            })
        }
        return e
    },
    kt = class {
        constructor(e = 0) {
            this.deltaTime = 0, this._currentTime = e, this._elapsedTime = e, this._startTime = e, this._lastTime = e, this._scheduledTime = 0, this._frameDuration = U(pe / 120, 0), this._fps = 120, this._speed = 1, this._hasChildren = !1, this._head = null, this._tail = null
        }
        get fps() {
            return this._fps
        }
        set fps(e) {
            let t = this._frameDuration,
                n = +e,
                r = n < 1e-11 ? z : n,
                i = U(pe / r, 0);
            this._fps = r, this._frameDuration = i, this._scheduledTime += i - t
        }
        get speed() {
            return this._speed
        }
        set speed(e) {
            let t = +e;
            this._speed = t < 1e-11 ? z : t
        }
        requestTick(e) {
            let t = this._scheduledTime,
                n = this._elapsedTime;
            if (this._elapsedTime += e - n, n < t) return L.NONE;
            let r = this._frameDuration,
                i = n - t;
            return this._scheduledTime += i < r ? r : i, L.AUTO
        }
        computeDeltaTime(e) {
            let t = e - this._lastTime;
            return this.deltaTime = t, this._lastTime = e, t
        }
    },
    At = {
        animation: null,
        update: _e
    },
    jt = e => {
        let t = At.animation;
        return t || (t = {
            duration: z,
            computeDeltaTime: _e,
            _offset: 0,
            _delay: 0,
            _head: null,
            _tail: null
        }, At.animation = t, At.update = () => {
            e.forEach(e => {
                for (let t in e) {
                    let n = e[t],
                        r = n._head;
                    if (r) {
                        let e = r._valueType,
                            t = e === I.COMPLEX || e === I.COLOR ? W(r._fromNumbers) : null,
                            i = r._fromNumber,
                            a = n._tail;
                        for (; a && a !== r;) {
                            if (t)
                                for (let e = 0, n = a._numbers.length; e < n; e++) t[e] += a._numbers[e];
                            else i += a._number;
                            a = a._prevAdd
                        }
                        r._toNumber = i, r._toNumbers = t
                    }
                }
            }), wt(t, 1, 1, 0, L.FORCE)
        }), t
    },
    Mt = N ? requestAnimationFrame : setImmediate,
    Nt = N ? cancelAnimationFrame : clearImmediate,
    Pt = class extends kt {
        constructor(e) {
            super(e), this.useDefaultMainLoop = !0, this.pauseOnDocumentHidden = !0, this.defaults = Oe, this.paused = !0, this.reqId = 0
        }
        update() {
            let e = this._currentTime = Ne();
            if (this.requestTick(e)) {
                this.computeDeltaTime(e);
                let t = this._speed,
                    n = this._fps,
                    r = this._head;
                for (; r;) {
                    let i = r._next;
                    r.paused ? (st(this, r), this._hasChildren = !!this._tail, r._running = !1, r.completed && !r._cancelled && r.cancel()) : Tt(r, (e - r._startTime) * r._speed * t, 0, 0, r._fps < n ? r.requestTick(e) : L.AUTO), r = i
                }
                At.update()
            }
        }
        wake() {
            return this.useDefaultMainLoop && !this.reqId && (this.requestTick(Ne()), this.reqId = Mt(Ft)), this
        }
        pause() {
            if (this.reqId) return this.paused = !0, It()
        }
        resume() {
            if (this.paused) return this.paused = !1, G(this, e => e.resetTime()), this.wake()
        }
        get speed() {
            return this._speed * (B.timeScale === 1 ? 1 : pe)
        }
        set speed(e) {
            this._speed = e * B.timeScale, G(this, e => e.speed = e._speed)
        }
        get timeUnit() {
            return B.timeScale === 1 ? `ms` : `s`
        }
        set timeUnit(e) {
            let t = .001,
                n = e === `s`,
                r = n ? t : 1;
            if (B.timeScale !== r) {
                B.timeScale = r, B.tickThreshold = 200 * r;
                let e = n ? t : pe;
                this.defaults.duration *= e, this._speed *= e
            }
        }
        get precision() {
            return B.precision
        }
        set precision(e) {
            B.precision = e
        }
    },
    q = (() => {
        let e = new Pt(Ne());
        return N && (Ae.engine = e, P.addEventListener(`visibilitychange`, () => {
            e.pauseOnDocumentHidden && (P.hidden ? e.pause() : e.resume())
        })), e
    })(),
    Ft = () => {
        q._head ? (q.reqId = Mt(Ft), q.update()) : q.reqId = 0
    },
    It = () => (Nt(q.reqId), q.reqId = 0, q),
    Lt = {
        _rep: new WeakMap,
        _add: new Map
    },
    Rt = (e, t, n = `_rep`) => {
        let r = Lt[n],
            i = r.get(e);
        return i || (i = {}, r.set(e, i)), i[t] ? i[t] : i[t] = {
            _head: null,
            _tail: null
        }
    },
    zt = (e, t) => e._isOverridden || e._absoluteStartTime > t._absoluteStartTime,
    Bt = e => {
        e._isOverlapped = 1, e._isOverridden = 1, e._changeDuration = z, e._currentTime = z
    },
    Vt = (e, t) => {
        let n = e._composition;
        if (n === R.replace) {
            let n = e._absoluteStartTime;
            ct(t, e, zt, `_prevRep`, `_nextRep`);
            let r = e._prevRep;
            if (r) {
                let t = r.parent,
                    i = r._absoluteStartTime + r._changeDuration;
                if (e.parent.id !== t.id && t.iterationCount > 1 && i + (t.duration - t.iterationDuration) > n) {
                    Bt(r);
                    let e = r._prevRep;
                    for (; e && e.parent.id === t.id;) Bt(e), e = e._prevRep
                }
                let a = n - e._delay;
                if (i > a) {
                    let e = r._startTime,
                        t = U(a - (i - (e + r._updateDuration)) - e, 12);
                    r._changeDuration = t, r._currentTime = t, r._isOverlapped = 1, t < 1e-11 && Bt(r)
                }
                let o = !0;
                if (G(t, e => {
                        e._isOverlapped || (o = !1)
                    }), o) {
                    let e = t.parent;
                    if (e) {
                        let n = !0;
                        G(e, e => {
                            e !== t && G(e, e => {
                                e._isOverlapped || (n = !1)
                            })
                        }), n && e.cancel()
                    } else t.cancel()
                }
            }
        } else if (n === R.blend) {
            let t = Rt(e.target, e.property, `_add`),
                n = jt(Lt._add),
                r = t._head;
            r || (r = { ...e
            }, r._composition = R.replace, r._updateDuration = z, r._startTime = 0, r._numbers = W(e._fromNumbers), r._number = 0, r._next = null, r._prev = null, ct(t, r), ct(n, r));
            let i = e._toNumber;
            if (e._fromNumber = r._fromNumber - i, e._toNumber = 0, e._numbers = W(e._fromNumbers), e._number = 0, r._fromNumber = i, e._toNumbers) {
                let t = W(e._toNumbers);
                t && t.forEach((t, n) => {
                    e._fromNumbers[n] = r._fromNumbers[n] - t, e._toNumbers[n] = 0
                }), r._fromNumbers = t
            }
            ct(t, e, null, `_prevAdd`, `_nextAdd`)
        }
        return e
    },
    Ht = e => {
        let t = e._composition;
        if (t !== R.none) {
            let n = e.target,
                r = e.property,
                i = Lt._rep.get(n)[r];
            if (st(i, e, `_prevRep`, `_nextRep`), t === R.blend) {
                let t = Lt._add,
                    i = t.get(n);
                if (!i) return;
                let a = i[r],
                    o = At.animation;
                st(a, e, `_prevAdd`, `_nextAdd`);
                let s = a._head;
                if (s && s === a._tail) {
                    st(a, s, `_prevAdd`, `_nextAdd`), st(o, s);
                    let e = !0;
                    for (let t in i)
                        if (i[t]._head) {
                            e = !1;
                            break
                        }
                    e && t.delete(n)
                }
            }
        }
        return e
    },
    Ut = e => (e.paused = !0, e.began = !1, e.completed = !1, e),
    Wt = e => e._cancelled ? (e._hasChildren ? G(e, Wt) : G(e, e => {
        e._composition !== R.none && Vt(e, Rt(e.target, e.property))
    }), e._cancelled = 0, e) : e,
    Gt = 0,
    Kt = class extends kt {
        constructor(e = {}, t = null, n = 0) {
            super(0);
            let {
                id: r,
                delay: i,
                duration: a,
                reversed: o,
                alternate: s,
                loop: c,
                loopDelay: l,
                autoplay: u,
                frameRate: d,
                playbackRate: f,
                onComplete: p,
                onLoop: m,
                onPause: h,
                onBegin: g,
                onBeforeUpdate: _,
                onUpdate: v
            } = e;
            ke.current && ke.current.register(this);
            let y = t ? 0 : q._elapsedTime,
                b = t ? t.defaults : B.defaults,
                x = Re(i) || V(i) ? b.delay : +i,
                S = Re(a) || V(a) ? 1 / 0 : +a,
                C = K(c, b.loop),
                w = K(l, b.loopDelay),
                T = C === !0 || C === 1 / 0 || C < 0 ? 1 / 0 : C + 1,
                ee = 0;
            t ? ee = n : (q.reqId || q.requestTick(Ne()), ee = (q._elapsedTime - q._startTime) * B.timeScale), this.id = V(r) ? ++Gt : r, this.parent = t, this.duration = it((S + w) * T - w) || 1e-11, this.backwards = !1, this.paused = !0, this.began = !1, this.completed = !1, this.onBegin = g || b.onBegin, this.onBeforeUpdate = _ || b.onBeforeUpdate, this.onUpdate = v || b.onUpdate, this.onLoop = m || b.onLoop, this.onPause = h || b.onPause, this.onComplete = p || b.onComplete, this.iterationDuration = S, this.iterationCount = T, this._autoplay = t ? !1 : K(u, b.autoplay), this._offset = ee, this._delay = x, this._loopDelay = w, this._iterationTime = 0, this._currentIteration = 0, this._resolve = _e, this._running = !1, this._reversed = +K(o, b.reversed), this._reverse = this._reversed, this._cancelled = 0, this._alternate = K(s, b.alternate), this._prev = null, this._next = null, this._elapsedTime = y, this._startTime = y, this._lastTime = y, this._fps = K(d, b.frameRate), this._speed = K(f, b.playbackRate)
        }
        get cancelled() {
            return !!this._cancelled
        }
        set cancelled(e) {
            e ? this.cancel() : this.reset(!0).play()
        }
        get currentTime() {
            return H(U(this._currentTime, B.precision), -this._delay, this.duration)
        }
        set currentTime(e) {
            let t = this.paused;
            this.pause().seek(+e), t || this.resume()
        }
        get iterationCurrentTime() {
            return U(this._iterationTime, B.precision)
        }
        set iterationCurrentTime(e) {
            this.currentTime = this.iterationDuration * this._currentIteration + e
        }
        get progress() {
            return H(U(this._currentTime / this.duration, 10), 0, 1)
        }
        set progress(e) {
            this.currentTime = this.duration * e
        }
        get iterationProgress() {
            return H(U(this._iterationTime / this.iterationDuration, 10), 0, 1)
        }
        set iterationProgress(e) {
            let t = this.iterationDuration;
            this.currentTime = t * this._currentIteration + t * e
        }
        get currentIteration() {
            return this._currentIteration
        }
        set currentIteration(e) {
            this.currentTime = this.iterationDuration * H(+e, 0, this.iterationCount - 1)
        }
        get reversed() {
            return !!this._reversed
        }
        set reversed(e) {
            e ? this.reverse() : this.play()
        }
        get speed() {
            return super.speed
        }
        set speed(e) {
            super.speed = e, this.resetTime()
        }
        reset(e = !1) {
            return Wt(this), this._reversed && !this._reverse && (this.reversed = !1), this._iterationTime = this.iterationDuration, Tt(this, 0, 1, ~~e, L.FORCE), Ut(this), this._hasChildren && G(this, Ut), this
        }
        init(e = !1) {
            this.fps = this._fps, this.speed = this._speed, !e && this._hasChildren && Tt(this, this.duration, 1, ~~e, L.FORCE), this.reset(e);
            let t = this._autoplay;
            return t === !0 ? this.resume() : t && !V(t.linked) && t.link(this), this
        }
        resetTime() {
            let e = 1 / (this._speed * q._speed);
            return this._startTime = Ne() - (this._currentTime + this._delay) * e, this
        }
        pause() {
            return this.paused ? this : (this.paused = !0, this.onPause(this), this)
        }
        resume() {
            return this.paused ? (this.paused = !1, this.duration <= 1e-11 && !this._hasChildren ? Tt(this, z, 0, 0, L.FORCE) : (this._running ||= (ct(q, this), q._hasChildren = !0, !0), this.resetTime(), this._startTime -= 12, q.wake()), this) : this
        }
        restart() {
            return this.reset().resume()
        }
        seek(e, t = 0, n = 0) {
            Wt(this), this.completed = !1;
            let r = this.paused;
            return this.paused = !0, Tt(this, e + this._delay, ~~t, ~~n, L.AUTO), r ? this : this.resume()
        }
        alternate() {
            let e = this._reversed,
                t = this.iterationCount,
                n = this.iterationDuration,
                r = t === 1 / 0 ? Qe(fe / n) : t;
            return this._reversed = +(this._alternate && !(r % 2) ? e : !e), t === 1 / 0 ? this.iterationProgress = this._reversed ? 1 - this.iterationProgress : this.iterationProgress : this.seek(n * r - this._currentTime), this.resetTime(), this
        }
        play() {
            return this._reversed && this.alternate(), this.resume()
        }
        reverse() {
            return this._reversed || this.alternate(), this.resume()
        }
        cancel() {
            return this._hasChildren ? G(this, e => e.cancel(), !0) : G(this, Ht), this._cancelled = 1, this.pause()
        }
        stretch(e) {
            let t = this.duration,
                n = at(e);
            if (t === n) return this;
            let r = e / t,
                i = e <= z;
            return this.duration = i ? z : n, this.iterationDuration = i ? z : at(this.iterationDuration * r), this._offset *= r, this._delay *= r, this._loopDelay *= r, this
        }
        revert() {
            Tt(this, 0, 1, 0, L.AUTO);
            let e = this._autoplay;
            return e && e.linked && e.linked === this && e.revert(), this.cancel()
        }
        complete() {
            return this.seek(this.duration).cancel()
        }
        then(e = _e) {
            let t = this.then,
                n = () => {
                    this.then = null, e(this), this.then = t, this._resolve = _e
                };
            return new Promise(e => (this._resolve = () => e(n()), this.completed && this._resolve(), this))
        }
    },
    qt = e => new Kt(e, null, 0).init();

function Jt(e) {
    let t = Le(e) ? ke.root.querySelectorAll(e) : e;
    if (t instanceof NodeList || t instanceof HTMLCollection) return t
}

function Yt(e) {
    if (ze(e)) return [];
    if (!N) return Pe(e) && e.flat(1 / 0) || [e];
    if (Pe(e)) {
        let t = e.flat(1 / 0),
            n = [];
        for (let e = 0, r = t.length; e < r; e++) {
            let r = t[e];
            if (!ze(r)) {
                let e = Jt(r);
                if (e)
                    for (let t = 0, r = e.length; t < r; t++) {
                        let r = e[t];
                        if (!ze(r)) {
                            let e = !1;
                            for (let t = 0, i = n.length; t < i; t++)
                                if (n[t] === r) {
                                    e = !0;
                                    break
                                }
                            e || n.push(r)
                        }
                    } else {
                        let e = !1;
                        for (let t = 0, i = n.length; t < i; t++)
                            if (n[t] === r) {
                                e = !0;
                                break
                            }
                        e || n.push(r)
                    }
            }
        }
        return n
    }
    let t = Jt(e);
    return t ? Array.from(t) : [e]
}

function Xt(e) {
    let t = Yt(e),
        n = t.length;
    if (n)
        for (let e = 0; e < n; e++) {
            let n = t[e];
            if (!n[se]) {
                n[se] = !0;
                let e = Be(n);
                (n.nodeType || e) && (n[ce] = !0, n[le] = e, n[ue] = {})
            }
        }
    return t
}
var Zt = {
        deg: 1,
        rad: 180 / et,
        turn: 360
    },
    Qt = {},
    $t = (e, t, n, r = !1) => {
        let i = t.u,
            a = t.n;
        if (t.t === I.UNIT && i === n) return t;
        let o = a + i + n,
            s = Qt[o];
        if (!V(s) && !r) t.n = s;
        else {
            let r;
            if (i in Zt) r = a * Zt[i] / Zt[n];
            else {
                let t = e.cloneNode(),
                    o = e.parentNode,
                    s = o && o !== P ? o : P.body;
                s.appendChild(t);
                let c = t.style;
                c.width = 100 + i;
                let l = t.offsetWidth || 100;
                c.width = 100 + n;
                let u = l / (t.offsetWidth || 100);
                s.removeChild(t), r = u * a
            }
            t.n = r, Qt[o] = r
        }
        return t.t, I.UNIT, t.u = n, t
    },
    en = e => e,
    tn = (e = 1.68) => t => Je(t, +e),
    nn = { in: e => t => e(t),
        out: e => t => 1 - e(1 - t),
        inOut: e => t => t < .5 ? e(t * 2) / 2 : 1 - e(t * -2 + 2) / 2,
        outIn: e => t => t < .5 ? (1 - e(1 - t * 2)) / 2 : (e(t * 2 - 1) + 1) / 2
    },
    rn = et / 2,
    an = et * 2,
    on = {
        "": tn,
        Quad: tn(2),
        Cubic: tn(3),
        Quart: tn(4),
        Quint: tn(5),
        Sine: e => 1 - Ze(e * rn),
        Circ: e => 1 - Ye(1 - e * e),
        Expo: e => e ? Je(2, 10 * e - 10) : 0,
        Bounce: e => {
            let t, n = 4;
            for (; e < ((t = Je(2, --n)) - 1) / 11;);
            return 1 / Je(4, 3 - n) - 7.5625 * Je((t * 3 - 2) / 22 - e, 2)
        },
        Back: (e = 1.7) => t => (+e + 1) * t * t * t - +e * t * t,
        Elastic: (e = 1, t = .3) => {
            let n = H(+e, 1, 10),
                r = H(+t, z, 2),
                i = r / an * $e(1 / n),
                a = an / r;
            return e => e === 0 || e === 1 ? e : -n * Je(2, -10 * (1 - e)) * Xe((1 - e - i) * a)
        }
    },
    sn = (() => {
        let e = {
            linear: en,
            none: en
        };
        for (let t in nn)
            for (let n in on) {
                let r = on[n],
                    i = nn[t];
                e[t + n] = n === `` || n === `Back` || n === `Elastic` ? (e, t) => i(r(e, t)) : i(r)
            }
        return e
    })(),
    cn = {
        linear: en,
        none: en
    },
    ln = e => {
        if (cn[e]) return cn[e];
        if (e.indexOf(`(`) <= -1) {
            let t = nn[e] || e.includes(`Back`) || e.includes(`Elastic`) ? sn[e]() : sn[e];
            return t ? cn[e] = t : en
        } else {
            let t = e.slice(0, -1).split(`(`),
                n = sn[t[0]];
            return n ? cn[e] = n(...t[1].split(`,`)) : en
        }
    },
    un = [`steps(`, `irregular(`, `linear(`, `cubicBezier(`],
    dn = e => {
        if (Le(e)) {
            for (let t = 0, n = un.length; t < n; t++)
                if (Me(e, un[t])) return console.warn(`String syntax for \`ease: "${e}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${e}\``), en
        }
        return Re(e) ? e : Le(e) ? ln(e) : en
    },
    J = bt(),
    Y = bt(),
    fn = {},
    pn = {
        func: null
    },
    mn = [null],
    hn = [null, null],
    gn = {
        to: null
    },
    _n = 0,
    vn, yn, bn = (e, t) => {
        let n = {};
        if (Pe(e)) {
            let t = [].concat(...e.map(e => Object.keys(e))).filter(Ge);
            for (let r = 0, i = t.length; r < i; r++) {
                let i = t[r];
                n[i] = e.map(e => {
                    let t = {};
                    for (let n in e) {
                        let r = e[n];
                        Ge(n) ? n === i && (t.to = r) : t[n] = r
                    }
                    return t
                })
            }
        } else {
            let r = K(t.duration, B.defaults.duration);
            Object.keys(e).map(t => ({
                o: parseFloat(t) / 100,
                p: e[t]
            })).sort((e, t) => e.o - t.o).forEach(e => {
                let t = e.o,
                    i = e.p;
                for (let e in i)
                    if (Ge(e)) {
                        let a = n[e];
                        a ||= n[e] = [];
                        let o = t * r,
                            s = a.length,
                            c = a[s - 1],
                            l = {
                                to: i[e]
                            },
                            u = 0;
                        for (let e = 0; e < s; e++) u += a[e].duration;
                        s === 1 && (l.from = c.to), i.ease && (l.ease = i.ease), l.duration = o - (s ? u : 0), a.push(l)
                    }
                return e
            });
            for (let e in n) {
                let t = n[e],
                    r;
                for (let e = 0, n = t.length; e < n; e++) {
                    let n = t[e],
                        i = n.ease;
                    n.ease = r || void 0, r = i
                }
                t[0].duration || t.shift()
            }
        }
        return n
    },
    xn = class extends Kt {
        constructor(e, t, n, r, i = !1, a = 0, o = 0) {
            super(t, n, r);
            let s = Xt(e),
                c = s.length,
                l = t.keyframes,
                u = l ? ot(bn(l, t), t) : t,
                {
                    delay: d,
                    duration: f,
                    ease: p,
                    playbackEase: m,
                    modifier: h,
                    composition: g,
                    onRender: _
                } = u,
                v = n ? n.defaults : B.defaults,
                y = K(m, v.playbackEase),
                b = y ? dn(y) : null,
                x = !V(p) && !V(p.ease),
                S = x ? p.ease : K(p, b ? `linear` : v.ease),
                C = x ? p.settlingDuration : K(f, v.duration),
                w = K(d, v.delay),
                T = h || v.modifier,
                ee = V(g) && c >= 1e3 ? R.none : V(g) ? v.composition : g,
                te = this._offset + (n ? n._offset : 0);
            x && (p.parent = this);
            let E = NaN,
                D = NaN,
                O = 0,
                k = 0;
            for (let e = 0; e < c; e++) {
                let t = s[e],
                    r = a || e,
                    l = o || c,
                    d = NaN,
                    f = NaN;
                for (let e in u)
                    if (Ge(e)) {
                        let a = gt(t, e),
                            o = Dt(e, t, a),
                            s = u[e],
                            c = Pe(s);
                        if (i && !c && (hn[0] = s, hn[1] = s, s = hn), c) {
                            let e = s.length,
                                t = !Fe(s[0]);
                            e === 2 && t ? (gn.to = s, mn[0] = gn, vn = mn) : e > 2 && t ? (vn = [], s.forEach((e, t) => {
                                t ? t === 1 ? (hn[1] = e, vn.push(hn)) : vn.push(e) : hn[0] = e
                            })) : vn = s
                        } else mn[0] = s, vn = mn;
                        let p = null,
                            m = null,
                            h = NaN,
                            g = 0,
                            _ = 0;
                        for (let e = vn.length; _ < e; _++) {
                            let i = vn[_];
                            Fe(i) ? yn = i : (gn.to = i, yn = gn), pn.func = null;
                            let s = ht(yn.to, t, r, l, pn),
                                c;
                            Fe(s) && !V(s.to) ? (yn = s, c = s.to) : c = s;
                            let u = ht(yn.from, t, r, l),
                                d = yn.ease,
                                f = !V(d) && !V(d.ease),
                                v = f ? d.ease : d || S,
                                y = f ? d.settlingDuration : ht(K(yn.duration, e > 1 ? ht(C, t, r, l) / e : C), t, r, l),
                                b = ht(K(yn.delay, _ ? 0 : w), t, r, l),
                                x = ht(K(yn.composition, ee), t, r, l),
                                E = Ie(x) ? x : R[x],
                                D = yn.modifier || T,
                                A = !V(u),
                                ne = !V(c),
                                re = Pe(c),
                                ie = re || A && ne,
                                j = m ? g + b : b,
                                ae = U(te + j, 12);
                            !k && (A || re) && (k = 1);
                            let M = m;
                            if (E !== R.none) {
                                p ||= Rt(t, o);
                                let e = p._head;
                                for (; e && !e._isOverridden && e._absoluteStartTime <= ae;)
                                    if (M = e, e = e._nextRep, e && e._absoluteStartTime >= ae)
                                        for (; e;) Bt(e), e = e._nextRep
                            }
                            if (ie ? (xt(re ? ht(c[0], t, r, l) : u, J), xt(re ? ht(c[1], t, r, l, pn) : c, Y), J.t === I.NUMBER && (M ? M._valueType === I.UNIT && (J.t = I.UNIT, J.u = M._unit) : (xt(vt(t, o, a, fn), Ct), Ct.t === I.UNIT && (J.t = I.UNIT, J.u = Ct.u)))) : (ne ? xt(c, Y) : m ? St(m, Y) : xt(n && M && M.parent.parent === n ? M._value : vt(t, o, a, fn), Y), A ? xt(u, J) : m ? St(m, J) : xt(n && M && M.parent.parent === n ? M._value : vt(t, o, a, fn), J)), J.o && (J.n = yt(M ? M._toNumber : xt(vt(t, o, a, fn), Ct).n, J.n, J.o)), Y.o && (Y.n = yt(J.n, Y.n, Y.o)), J.t !== Y.t) {
                                if (J.t === I.COMPLEX || Y.t === I.COMPLEX) {
                                    let e = J.t === I.COMPLEX ? J : Y,
                                        t = J.t === I.COMPLEX ? Y : J;
                                    t.t = I.COMPLEX, t.s = W(e.s), t.d = e.d.map(() => t.n)
                                } else if (J.t === I.UNIT || Y.t === I.UNIT) {
                                    let e = J.t === I.UNIT ? J : Y,
                                        t = J.t === I.UNIT ? Y : J;
                                    t.t = I.UNIT, t.u = e.u
                                } else if (J.t === I.COLOR || Y.t === I.COLOR) {
                                    let e = J.t === I.COLOR ? J : Y,
                                        t = J.t === I.COLOR ? Y : J;
                                    t.t = I.COLOR, t.s = e.s, t.d = [0, 0, 0, 1]
                                }
                            }
                            if (J.u !== Y.u) {
                                let e = Y.u ? J : Y;
                                e = $t(t, e, Y.u ? Y.u : J.u, !1)
                            }
                            if (Y.d && J.d && Y.d.length !== J.d.length) {
                                let e = J.d.length > Y.d.length ? J : Y,
                                    t = e === J ? Y : J;
                                t.d = e.d.map((e, n) => V(t.d[n]) ? 0 : t.d[n]), t.s = W(e.s)
                            }
                            let N = U(+y || 1e-11, 12),
                                oe = fn[o];
                            ze(oe) || (fn[o] = null);
                            let P = {
                                parent: this,
                                id: _n++,
                                property: o,
                                target: t,
                                _value: null,
                                _func: pn.func,
                                _ease: dn(v),
                                _fromNumbers: W(J.d),
                                _toNumbers: W(Y.d),
                                _strings: W(Y.s),
                                _fromNumber: J.n,
                                _toNumber: Y.n,
                                _numbers: W(J.d),
                                _number: J.n,
                                _unit: Y.u,
                                _modifier: D,
                                _currentTime: 0,
                                _startTime: j,
                                _delay: +b,
                                _updateDuration: N,
                                _changeDuration: N,
                                _absoluteStartTime: ae,
                                _tweenType: a,
                                _valueType: Y.t,
                                _composition: E,
                                _isOverlapped: 0,
                                _isOverridden: 0,
                                _renderTransforms: 0,
                                _inlineValue: oe,
                                _prevRep: null,
                                _nextRep: null,
                                _prevAdd: null,
                                _nextAdd: null,
                                _prev: null,
                                _next: null
                            };
                            E !== R.none && Vt(P, p), isNaN(h) && (h = P._startTime), g = U(j + N, 12), m = P, O++, ct(this, P)
                        }(isNaN(D) || h < D) && (D = h), (isNaN(E) || g > E) && (E = g), a === F.TRANSFORM && (d = O - _, f = O)
                    }
                if (!isNaN(d)) {
                    let e = 0;
                    G(this, t => {
                        e >= d && e < f && (t._renderTransforms = 1, t._composition === R.blend && G(At.animation, e => {
                            e.id === t.id && (e._renderTransforms = 1)
                        })), e++
                    })
                }
            }
            c || console.warn(`No target found. Make sure the element you're trying to animate is accessible before creating your animation.`), D ? (G(this, e => {
                e._startTime - e._delay || (e._delay -= D), e._startTime -= D
            }), E -= D) : D = 0, E || (E = z, this.iterationCount = 0), this.targets = s, this.duration = E === 1e-11 ? z : it((E + this._loopDelay) * this.iterationCount - this._loopDelay) || 1e-11, this.onRender = _ || v.onRender, this._ease = b, this._delay = D, this.iterationDuration = E, !this._autoplay && k && this.onRender(this)
        }
        stretch(e) {
            let t = this.duration;
            if (t === at(e)) return this;
            let n = e / t;
            return G(this, e => {
                e._updateDuration = at(e._updateDuration * n), e._changeDuration = at(e._changeDuration * n), e._currentTime *= n, e._startTime *= n, e._absoluteStartTime *= n
            }), super.stretch(e)
        }
        refresh() {
            return G(this, e => {
                let t = e._func;
                t && (xt(vt(e.target, e.property, e._tweenType), Ct), xt(t(), Y), e._fromNumbers = W(Ct.d), e._fromNumber = Ct.n, e._toNumbers = W(Y.d), e._strings = W(Y.s), e._toNumber = Y.o ? yt(Ct.n, Y.n, Y.o) : Y.n)
            }), this.duration === 1e-11 && this.restart(), this
        }
        revert() {
            return super.revert(), Ot(this)
        }
        then(e) {
            return super.then(e)
        }
    },
    Sn = (e, t) => new xn(e, t, null, 0, !1).init(),
    Cn = {
        isDevelopment: !1,
        backendUrl: `https://api.monkeytype.com`,
        recaptchaSiteKey: `6Lc-V8McAAAAAJ7s6LGNe7MBZnRiwbsbiWts87aj`,
        clientVersion: `2026.07.15_23.08_7713c8d7a`
    };

function wn() {
    return Cn.isDevelopment
}

function Tn(e, t) {
    return Math.min(e, Math.floor(e * 1.03 ** (-2 * (t - 3))))
}

function En(e) {
    let t = ``;
    for (let n of e) t += `٠١٢٣٤٥٦٧٨٩` [parseInt(n)];
    return t
}

function Dn(e) {
    let t = ``;
    for (let n of e) t += `০১২৩৪৫৬৭৮৯` [parseInt(n)];
    return t
}

function On(e) {
    let t = ``;
    for (let n of e) t += `०१२३४५६७८९` [parseInt(n)];
    return t
}

function kn(e) {
    let t = ``;
    for (let n of e) t += `०१२३४५६७८९` [parseInt(n)];
    return t
}

function An(e, t) {
    let n = null,
        r = [],
        i = location.search;
    return t !== void 0 && t !== `` && (i = t), i.slice(1).split(`&`).forEach(function(t) {
        r = t.split(`=`), r[0] === e && (n = decodeURIComponent(r[1]))
    }), n
}

function jn() {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
}

function Mn(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`)
}

function Nn(e) {
    if (e == null) return e;
    let t = {
        "&": `&amp;`,
        "<": `&lt;`,
        ">": `&gt;`,
        '"': `&quot;`,
        "'": `&#39;`,
        "/": `&#x2F;`,
        "`": `&#x60;`
    };
    return e.replace(/[&<>"'/`]/g, e => t[e])
}

function Pn(e) {
    e.forEach(e => {
        clearTimeout(e)
    })
}
String.prototype.lastIndexOfRegex = function(e) {
    let t = this.match(e);
    return t ? this.lastIndexOf(re(t)) : -1
};

function Fn(e, t) {
    let n = e.mode,
        r;
    if (n === `time`) r = e.time.toString();
    else if (n === `words`) r = e.words.toString();
    else if (n === `custom`) r = `custom`;
    else if (n === `zen`) r = `zen`;
    else if (n === `quote`) r = `${t?.id??-1}`;
    else throw Error(`Invalid mode`);
    return r
}
async function In(e) {
    let t = [
        [`_id`, `isPb`, `wpm`, `acc`, `rawWpm`, `consistency`, `charStats`, `mode`, `mode2`, `quoteLength`, `restartCount`, `testDuration`, `afkDuration`, `incompleteTestSeconds`, `punctuation`, `numbers`, `language`, `funbox`, `difficulty`, `lazyMode`, `blindMode`, `bailedOut`, `tags`, `timestamp`], ...e.map(e => [e._id, e.isPb, e.wpm, e.acc, e.rawWpm, e.consistency, e.charStats.join(`;`), e.mode, e.mode2, e.quoteLength, e.restartCount, e.testDuration, e.afkDuration, e.incompleteTestSeconds, e.punctuation, e.numbers, e.language, e.funbox, e.difficulty, e.lazyMode, e.blindMode, e.bailedOut, e.tags ?.join(`;`), e.timestamp])
    ].map(e => e.join(`,`)).join(`
`);
    Ln({
        filename: `results.csv`,
        data: new Blob([t], {
            type: `text/csv`
        })
    })
}

function Ln(e) {
    let t = URL.createObjectURL(e.data),
        n = document.createElement(`a`);
    n.href = t, n.download = e.filename, document.body.appendChild(n), n.click(), document.body.removeChild(n), URL.revokeObjectURL(t)
}

function Rn(e) {
    let t = document.querySelector(e);
    return t ? !!t.getClientRects().length : !1
}

function zn(e) {
    return Rn(`#popups #${e}`) || Rn(`#solidmodals #${e}`)
}

function Bn() {
    let e = document.querySelectorAll(`#popups .popupWrapper, #popups .backdrop, #popups .modalWrapper, #solidmodals dialog`),
        t = !1;
    for (let n of e)
        if (zn(n.id)) {
            t = !0;
            break
        }
    return t
}
async function Vn(e, t) {
    return new Promise(n => {
        Sn(e, { ...t,
            onComplete: (e, r) => {
                t.onComplete ?.(e, r), n()
            }
        })
    })
}
async function Hn(e) {
    return new Promise(t => setTimeout(t, e))
}

function Un(e) {
    let t = document.createElement(`div`);
    return t.innerHTML = e, t.textContent || t.innerText || ``
}

function Wn(e, t = !1) {
    let n = document.createElement(`link`);
    n.type = `text/css`, n.rel = `stylesheet`, n.href = e;
    let r = document.getElementsByTagName(`head`)[0];
    if (r === void 0) throw Error(`Could not load CSS - head is undefined`);
    t ? r.prepend(n) : r.appendChild(n)
}

function Gn(e) {
    let t = .5772156649015329,
        n = Math.log(e + .5) + t,
        r = Math.exp(Math.random() * n - t) - .5;
    return Math.floor(r)
}

function Kn(e) {
    let t = 1 / 0,
        n = 1 / 0,
        r = -1 / 0,
        i = -1 / 0;
    return e.forEach(e => {
        let a = e.getBoundingClientRect();
        t = Math.min(t, a.left), n = Math.min(n, a.top), r = Math.max(r, a.right), i = Math.max(i, a.bottom)
    }), {
        x: t,
        y: n,
        width: r - t,
        height: i - n,
        top: n,
        right: r,
        bottom: i,
        left: t,
        toJSON: function() {
            return JSON.stringify({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                top: this.top,
                right: this.right,
                bottom: this.bottom,
                left: this.left
            })
        }
    }
}

function qn(e) {
    setTimeout(() => {
        window.location.reload()
    }, e * 1e3)
}

function Jn(e) {
    let t = wn() ? `localhost - ` : ``;
    e === void 0 || e === `` ? document.title = `${t}Monkeytype | A minimalistic, customizable typing test` : document.title = t + e
}

function Yn(e) {
    return typeof e == `object` && !Array.isArray(e) && e !== null
}

function Xn() {
    return matchMedia ?.(`(prefers-reduced-motion)`) ?.matches
}

function Zn(e) {
    return Xn() ? 0 : e
}

function Qn() {
    let e, t, n = new Promise((n, r) => {
        e = n, t = r
    });
    return {
        resolve: t => {
            e(t)
        },
        reject: e => {
            t(e)
        },
        promise: {
            async then(e, t) {
                return n.then(e, t)
            },
            async catch (e) {
                return n.catch(e)
            },
            async finally(e) {
                return n.finally(e)
            },
            [Symbol.toStringTag]: `Promise`
        },
        reset: () => {
            n = new Promise((n, r) => {
                e = n, t = r
            })
        }
    }
}

function $n(e, {
    rejectSkippedCalls: t = !0
} = {}) {
    let n = !1,
        r = null;
    async function i(...t) {
        n = !0;
        try {
            return await Promise.resolve(e(...t))
        } finally {
            n = !1;
            let e = r;
            r = null, e && i(...e.args).then(e.resolve, e.reject)
        }
    }
    return async function(...e) {
        return n ? (r && (t ? r.reject(Error(`skipped call: call was superseded by a more recent one`)) : r.resolve(null)), new Promise((t, n) => {
            r = {
                args: e,
                resolve: t,
                reject: n
            }
        })) : i(...e)
    }
}

function er() {
    window.dispatchEvent(new Event(`resize`))
}

function tr(e) {
    let t = navigator.platform;
    return typeof e == `string` ? t.includes(e) : e.test(t)
}

function nr() {
    return tr(/Mac|iPod|iPhone|iPad/)
}

function rr() {
    return window.navigator.userAgent.toLowerCase().includes(`firefox`)
}

function ir(e) {
    if (!e) return;
    let t = e.offsetHeight,
        n = window.innerHeight;
    e.scrollIntoView({
        block: t < n ? `center` : `start`
    })
}

function ar() {
    window.scrollTo({
        top: 0,
        behavior: `smooth`
    })
}

function or(e) {
    return e === void 0 ? `` : e.rank === void 0 ? `-` : e.rank === 1 ? `GOAT` : `Top ${p(e.rank/e.count*100)}%`
}

function sr(e) {
    return e.completedTests === void 0 || e.startedTests === void 0 || e.startedTests === 0 ? {
        completedPercentage: ``,
        restartRatio: ``
    } : {
        completedPercentage: Math.floor(e.completedTests / e.startedTests * 100).toString(),
        restartRatio: ((e.startedTests - e.completedTests) / e.completedTests).toFixed(1)
    }
}

function cr(e) {
    for (let [t, n] of Object.entries(e)) window[t] = n
}

function lr(e) {
    let t = window.getComputedStyle(e);
    return parseInt(t.marginRight) + parseInt(t.marginLeft)
}

function ur(e) {
    let t = ``;
    if (e instanceof Error ? t = e.message : typeof e == `object` && e && `message` in e && (typeof e.message == `string` || typeof e.message == `number`) ? t = `${e.message}` : typeof e == `string` ? t = e : typeof e == `number` && (t = `${e}`), t !== ``) return t
}

function dr(e, t) {
    let n = ur(e);
    return n === void 0 ? (console.error(`Could not get error message from error`, e), `${t}: Unknown error`) : `${t}: ${n}`
}
var fr = 0,
    [pr, mr] = m([]),
    hr = new Map,
    [gr, _r] = m([]),
    vr = 0;

function yr(e) {
    let t = fr++;
    return mr(n => [{ ...e,
        id: t
    }, ...n]), t
}

function br(e, t = `click`) {
    let n = hr.get(e);
    n !== void 0 && (clearTimeout(n), hr.delete(e));
    let r;
    mr(t => t.filter(t => t.id === e ? (r = t.onDismiss, !1) : !0)), r ?.(t)
}

function xr() {
    for (let [, e] of hr) clearTimeout(e);
    hr.clear();
    let e = [...pr];
    mr([]);
    for (let t of e) try {
        t.onDismiss ?.(`clear`)
    } catch (e) {
        console.error(`onDismiss threw during clearAll`, e)
    }
}

function Sr() {
    return pr
}

function Cr() {
    return gr
}

function wr(e, t, n = {}) {
    let r = n.details;
    n.response !== void 0 && (r = {
        status: n.response.status,
        additionalDetails: n.details,
        validationErrors: n.response.status === 422 ? n.response.body.validationErrors : void 0
    }, e = `${e}: ${n.response.body.message}`), n.error !== void 0 && (e = dr(n.error, e));
    let i = n.customTitle ?? (t === `success` ? `Success` : t === `error` ? `Error` : `Notice`);
    _r(a => {
        let o = [...a, {
            id: (vr++).toString(),
            title: i,
            message: e,
            level: t,
            details: r,
            useInnerHtml: n.useInnerHtml ?? !1
        }];
        return o.length > 25 ? o.slice(-25) : o
    });
    let a = n.durationMs ?? (t === `error` ? 0 : 3e3),
        o = yr({
            message: e,
            level: t,
            important: n.important ?? !1,
            durationMs: a,
            useInnerHtml: n.useInnerHtml ?? !1,
            customTitle: n.customTitle,
            customIcon: n.customIcon,
            onDismiss: n.onDismiss
        });
    if (a > 0) {
        let e = setTimeout(() => {
            hr.delete(o), br(o, `timeout`)
        }, a + 250);
        hr.set(o, e)
    }
    return o
}

function Tr(e, t) {
    return wr(e, `notice`, t)
}

function Er(e, t) {
    return wr(e, `success`, t)
}

function Dr(e, t) {
    return wr(e, `error`, t)
}
var Or = class {
        constructor(e) {
            this.key = e.key, this.schema = e.schema, this.fallback = e.fallback, this.migrate = e.migrate
        }
        get() {
            if (this.cache !== void 0) return structuredClone(this.cache);
            console.debug(`LS ${this.key} Getting value from localStorage`);
            let e = window.localStorage.getItem(this.key);
            if (e === null) return console.debug(`LS ${this.key} No value found, returning fallback`), this.cache = this.fallback, structuredClone(this.cache);
            let t = !1,
                {
                    data: r,
                    error: i
                } = l(() => n(e, this.schema, {
                    fallback: this.fallback,
                    migrate: (e, n) => (console.debug(`LS ${this.key} Schema validation failed`), t = !0, this.migrate ? (console.debug(`LS ${this.key} Migrating from old format to new format`), this.cache = this.migrate(e, n), structuredClone(this.cache)) : (console.debug(`LS ${this.key} No migration function provided, returning fallback`), this.cache = this.fallback, structuredClone(this.cache)))
                }));
            return i ? (console.error(`LS ${this.key} Failed to parse from localStorage: ${i.message}`), window.localStorage.setItem(this.key, JSON.stringify(this.fallback)), this.cache = this.fallback, structuredClone(this.cache)) : ((t || r === this.fallback) && (console.debug(`LS ${this.key} Setting in localStorage`), window.localStorage.setItem(this.key, JSON.stringify(r))), console.debug(`LS ${this.key} Got value:`, r), this.cache = r, structuredClone(this.cache))
        }
        set(e) {
            try {
                console.debug(`LS ${this.key} Parsing to set in localStorage`);
                let t = this.schema.parse(e),
                    n = JSON.stringify(t);
                return n !== JSON.stringify(this.cache) && (console.debug(`LS ${this.key} Setting in localStorage`), window.localStorage.setItem(this.key, n), this.cache = t), !0
            } catch (e) {
                let t = `Unknown error occurred`;
                r(e) ? (console.error(e), t = `Schema validation failed`) : e.message.includes(`exceeded the quota`) && (t = `Local storage is full. Please clear some space and try again.`);
                let n = `Failed to set ${this.key} in localStorage: ${t}`;
                return console.error(n), Dr(n), !1
            }
        }
    },
    kr = new Or({
        key: `profilerMode`,
        schema: o.boolean(),
        fallback: !1
    }),
    Ar = wn() && kr.get();

function jr() {
    return Ar
}
var [Mr, Nr] = m({
    openModals: {},
    modalStack: [],
    pendingModal: null,
    pendingIsChained: !1
});

function Pr(e) {
    let t = Br();
    t !== null && t !== e ? (Nr(n => ({
        modalStack: [...n.modalStack, t],
        pendingModal: e,
        pendingIsChained: !0
    })), Nr(`openModals`, t, {
        visible: !1,
        chained: !0
    })) : Nr(`openModals`, e, {
        visible: !0,
        chained: !1
    })
}

function Fr(e) {
    if (Mr.pendingModal !== null) {
        let e = Mr.pendingModal,
            t = Mr.pendingIsChained;
        Nr({
            pendingModal: null,
            pendingIsChained: !1
        }), Nr(`openModals`, e, {
            visible: !0,
            chained: t
        });
        return
    }
    let t = [...Mr.modalStack],
        n = t.pop();
    n === void 0 ? Nr(`openModals`, e, {
        visible: !1,
        chained: !1
    }) : (Nr({
        modalStack: t,
        pendingModal: n,
        pendingIsChained: !0
    }), Nr(`openModals`, e, {
        visible: !1,
        chained: !0
    }))
}

function Ir(e) {
    Nr({
        modalStack: [],
        pendingModal: null,
        pendingIsChained: !1
    }), Nr(`openModals`, e, {
        visible: !1,
        chained: !1
    })
}

function Lr(e) {
    return Mr.openModals[e] ?? null
}

function Rr(e) {
    return Mr.openModals[e] ?.visible === !0
}

function zr(e) {
    return Mr.openModals[e] ?.chained === !0
}

function Br() {
    for (let [e, t] of Object.entries(Mr.openModals))
        if (t ?.visible) return e;
    return null
}
var Vr = class {
        constructor(e, t, n, r, i) {
            this.unit = e, this.convertFactor = t, this.fullUnitString = n, this.histogramDataBucketSize = r, this.historyStepSize = i
        }
        fromWpm(e) {
            return e * this.convertFactor
        }
        toWpm(e) {
            return e / this.convertFactor
        }
    },
    Hr = {
        wpm: new Vr(`wpm`, 1, `Words per Minute`, 10, 10),
        cpm: new Vr(`cpm`, 5, `Characters per Minute`, 50, 100),
        wps: new Vr(`wps`, 1 / 60, `Words per Second`, .5, 2),
        cps: new Vr(`cps`, 5 / 60, `Characters per Second`, 5, 5),
        wph: new Vr(`wph`, 60, `Words per Hour`, 250, 1e3)
    };

function Ur(e) {
    return Hr[e]
}
var Wr = {
        suffix: ``,
        fallback: `-`,
        showDecimalPlaces: void 0,
        rounding: Math.round
    },
    Gr = class {
        constructor(e) {
            this.config = e
        }
        typingSpeed(e, t = {}) {
            let n = { ...Wr,
                ...t
            };
            if (e == null) return n.fallback ?? ``;
            let r = Ur(this.config.typingSpeedUnit).fromWpm(e);
            return this.number(r, n)
        }
        percentage(e, t = {}) {
            let n = { ...Wr,
                ...t
            };
            return n.suffix = `%${n.suffix??``}`, this.number(e, n)
        }
        accuracy(e, t = {}) {
            return this.percentage(e, {
                rounding: Math.floor,
                ...t
            })
        }
        decimals(e, t = {}) {
            let n = { ...Wr,
                ...t
            };
            return this.number(e, n)
        }
        get typingSpeedUnit() {
            return this.config.typingSpeedUnit
        }
        number(e, t) {
            if (e == null) return t.fallback ?? ``;
            let n = t.suffix ?? ``;
            return t.showDecimalPlaces ?? this.config.alwaysShowDecimalPlaces ? p(e).toFixed(2) + n : (t.rounding ?? Math.round)(e).toString() + n
        }
        rank(e, t = {}) {
            let n = {
                fallback: `-`,
                ...t
            };
            if (e == null) return n.fallback ?? ``;
            let r = `th`,
                i = e % 10,
                a = e % 100;
            return i === 1 && a !== 11 && (r = `st`), i === 2 && a !== 12 && (r = `nd`), i === 3 && a !== 13 && (r = `rd`), e + r
        }
    },
    Kr = 0,
    [qr, Jr] = m([]);

function Yr(e) {
    let t = Kr++;
    return Jr(n => [...n, { ...e,
        id: t
    }]), t
}

function Xr(e) {
    Zr(e) ?.onClose ?.(), Jr(t => t.filter(t => t.id !== e))
}

function Zr(e) {
    return qr.find(t => t.id === e)
}

function Qr() {
    return qr
}

function $r(e, t) {
    if (e !== void 0) {
        if (Array.isArray(e)) return t.length === e.length ? void 0 : e.filter((e, n) => !t.includes(n)); {
            let n = Object.entries(e);
            return t.length === n.length ? void 0 : Object.fromEntries(n.filter(([e]) => !t.includes(e)))
        }
    }
}

function ei(e, t) {
    return t.slice(0, -1).reduce((e, t) => e[t], e)
}

function ti(e, t) {
    let n, r = structuredClone(t);
    for (let t = 0; t <= 2; t++) {
        if (n = e.safeParse(r), n.success) return n.data;
        if (t === 2) break;
        let i = n.error.errors.reduce((e, {
            path: t
        }) => {
            let n = t.slice(0, -1).join(`.`),
                r = t.at(-1);
            return r !== void 0 && e.set(n, [...e.get(n) ?? [], r]), e
        }, new Map);
        for (let [e, t] of i.entries())
            if (e === ``) r = $r(r, t) ?? (Array.isArray(r) ? [] : {});
            else {
                let n = e.split(`.`),
                    i = ei(r, n),
                    a = n.at(-1),
                    o = $r(i[a], t);
                o === void 0 ? delete i[a] : i[a] = o
            }
    }
    let i = n ?.error.errors.map(e => `${e.path.join(`.`)}: ${e.message}`).join(`, `);
    throw Error(`unable to sanitize: ${i}`)
}

function ni(e) {
    return e.normalize(`NFD`).replace(/[\u0300-\u036f]/g, ``)
}

function ri(e) {
    return e.replace(/([A-Z])/g, ` $1`).trim().toLowerCase()
}

function ii(e) {
    return e.toLowerCase().split(/ +/).map((e, t) => t === 0 ? e : e.charAt(0).toUpperCase() + e.slice(1)).join(``)
}

function ai(e) {
    return e === void 0 ? `` : e.charAt(e.length - 1)
}

function oi(e, t, n) {
    return t > e.length - 1 ? e : e.substring(0, t) + n + e.substring(t + 1)
}

function si(e) {
    return e.split(/ +/).map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(` `)
}

function ci(e) {
    return e.charAt(0).toUpperCase() + e.slice(1)
}

function li(e) {
    return e.trim().replace(/\s+/g, `_`)
}

function ui(e, t) {
    if (t = t.filter(e => e !== ``), t.length === 0) return e;
    let n = RegExp(`(?<!\\p{L})(?:${t.join(`|`)})(?!\\p{L})`, `gu`);
    return e.replace(n, `<span class="highlight">$&</span>`)
}

function di(e, t = !1) {
    let n = ``;
    return n = t ? fi(e) : e, Ei(n)
}

function fi(e) {
    return e.replace(/_\d*k$/g, ``)
}

function pi(e) {
    let t = {
        "“": `"`,
        "”": `"`,
        "„": `"`,
        "’": `'`,
        "‘": `'`,
        ",": `,`,
        "—": `-`,
        "…": `...`,
        "«": `<<`,
        "»": `>>`,
        "–": `-`,
        " ": ` `,
        " ": ` `,
        "\xA0": ` `,
        "᾽": `'`
    };
    return e.replace(/[“”’‘—,…«»–\u2007\u202F\u00A0]/g, e => t[e] || ``)
}

function mi(e) {
    let t = [];
    for (let n of e) t.push(n);
    return t
}

function hi(e) {
    return e = e.replace(/(?<!\\)\\t/g, `	`), e = e.replace(/\\n/g, ` 
`), e = e.replace(/([^\\]|^)\\n/gm, `$1
`), e = e.replace(/\\\\t/gm, `\\t`), e = e.replace(/\\\\n/gm, `\\n`), e
}

function gi(e) {
    if (!e || e.length === 0) return [!1, 0];
    let t = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/.exec(e);
    return [t !== null, t ?.[0].length ?? 0]
}
var _i = new Map;

function vi() {
    _i.clear()
}

function yi(e, t, n) {
    if (e === void 0 || e.length === 0) return n ? [!t, !1] : [t, !1];
    let r = e.replace(/^[\p{P}\p{S}\s]+|[\p{P}\p{S}\s]+$/gu, ``);
    if (r.length === 0) return n ? [!t, !1] : [t, !1];
    let i = _i.get(r);
    if (i !== void 0) return n ? [!i[0], !1] : [i[0], i[1] === e.length];
    let a = gi(r);
    return _i.set(r, a), n ? [!a[0], !1] : [a[0], a[1] === e.length]
}
var bi = [new Set([`’`, `‘`, `'`, `ʼ`, `׳`, `ʻ`, `᾽`, `᾽`]), new Set([`"`, `”`, `“`, `„`]), new Set([`–`, `—`, `-`, `‐`, `‑`]), new Set([`,`, `‚`])],
    xi = {
        russian: new Set([`ё`, `е`, `e`])
    };

function Si(e, t, n) {
    if (e === t || (e === ` ` || t === ` `) && Ti(e) && Ti(t)) return !0;
    for (let n of bi)
        if (n.has(e) && n.has(t)) return !0;
    if (n !== void 0) {
        let r = xi[fi(n)];
        if (r !== void 0 && r.has(e) && r.has(t)) return !0
    }
    return !1
}

function Ci(e) {
    let t = new Uint8Array(e);
    return `toHex` in t && typeof t.toHex == `function` ? t.toHex() : Array.from(t).map(e => e.toString(16).padStart(2, `0`)).join(``)
}
var wi = new Set([32, 8194, 8195, 8201, 12288, 160, 5760, 8239, 65279, 8199, 8200, 8196, 8202, 8203]);

function Ti(e) {
    if (e.length !== 1) return !1;
    let t = e.codePointAt(0);
    return t === void 0 ? !1 : wi.has(t)
}

function Ei(e) {
    return e.replace(/_/g, ` `)
}

function Di(e) {
    return e.replace(/ /g, `_`)
}

function Oi(e, t, n) {
    let r = 0,
        i = 0,
        a = 0,
        o = 0,
        s = 0,
        c = e === t,
        l = t.startsWith(e);
    for (let u = 0; u < Math.max(e.length, t.length); u++) {
        let d = e[u],
            f = t[u];
        d === f ? (f === ` ` && !c ? o += 1 : r += 1, (c || n && l) && (i += 1)) : d === void 0 ? n || (s += 1) : f === void 0 || f === ` ` && d !== ` ` && !e.includes(` `) ? o += 1 : a += 1
    }
    return {
        allCorrect: r,
        correctWord: i,
        incorrect: a,
        extra: o,
        missed: s
    }
}

function ki(e) {
    if (e instanceof o.ZodLiteral) return [e.value];
    if (e instanceof o.ZodEnum) return e.options;
    if (e instanceof o.ZodBoolean) return [!1, !0];
    if (e instanceof o.ZodUnion) return e.options.flatMap(ki).filter(e => e !== void 0)
}

function Ai(e) {
    return e._def.typeName
}

function ji(e) {
    let t = e;
    for (;;) {
        if (t instanceof c) {
            t = t.unwrap();
            continue
        }
        if (t instanceof f) {
            t = t.removeDefault();
            continue
        }
        if (t instanceof u) {
            t = t.unwrap();
            continue
        }
        if (t instanceof i) {
            t = t.innerType();
            continue
        }
        if (t instanceof s) {
            t = t.unwrap();
            continue
        }
        break
    }
    return t
}
var Mi = {
        afrikaans: `654f8a7ffe6e9e63b08c568c7cf005968981bb91e05e128c1eff8180f740b2a7`,
        afrikaans_10k: `c1e3361c8ea41d021b9505850a191af51d870631c9a3a03cb35056f0b754c43c`,
        afrikaans_1k: `c7f3d0a9f997d44303af6d0393c69efac5e522298394feeda98f41e2c8c9c1c8`,
        albanian: `b5de15563f7ec674f2d531412dba85d83b60220853d90e765c274cf60abe5856`,
        albanian_1k: `83968465aa0ec5052bb96302adef4f70077aa815219afba41b5595b0b6c37c09`,
        amharic: `d540a35e989bc61619b2f0b2fb0cdf990c5dd78ed13934f50092a37724a14fcc`,
        amharic_1k: `eda8992b3044a3d8164aa9c9a939ab241a842cac34fc2d941c853f9b4d956659`,
        amharic_5k: `6ca8e68d8bcce11140c394588f446138bd32ad4b72650f51761aa97f6727595e`,
        arabic: `aa524ca09602d4cd9580274744515f4f4a4a32ce8a03c43df8c2f963b4b5f106`,
        arabic_10k: `2e4c32dc3984766699bdd42eceb18ac39aad0760065af31cba110606f2c9ad9d`,
        arabic_egypt: `39f5af29d79e63dc51b0c0e734b25b8d9aa6216d97ccbf2d521f5c91f3b8ebc9`,
        arabic_egypt_1k: `963df44859ec262131aa1db5d278ba79551750664f4682bc0a9b35fffb3f9d02`,
        arabic_morocco: `15f673b0200363af9e5c8da4ab001441ac8b7b3fdaaa4ba50236ccfd43367613`,
        armenian: `7a4371ac5f6b7b6ae455ab011bfac51c8e9065174a896b637949aa3153388a5b`,
        armenian_1k: `b08b7ec92dcc2d9b33d004831034ca9a04df10673b863228a60cd53549181d90`,
        armenian_western: `e4ea65d2311a40ec60857820aca4dbb37a3760c258eb5c13209cb39a7f42f980`,
        armenian_western_1k: `ad979ba585678d20cd707108bcc6a7254e16ebbca95eff6b24c659d51a3542b9`,
        azerbaijani: `95f24bf8668df3b1a76dc175fbc29ffb326d7d8e8205ba73f4b71eb7c98a4b48`,
        azerbaijani_1k: `6b4c07b507c8e3c1ee07f699a6effb07c9e34490ecff4cb43b0a3bcdfc290394`,
        bangla: `6e58d94086610a9c7ceffe4531e4681a5d5b14902196a3fed22b00055c1144de`,
        bangla_10k: `cc7f270cd7e1fbe6b7e4d22ca0f4ebd22256f28c7ec3d46b444c9e7ad64d37f7`,
        bangla_letters: `1b774585c6ff71f10be7b58e836f6b9d8336362c49620cba44354db4cb6efd77`,
        bashkir: `dbe83f3f7e97a9fdcf59777f422b3f830a09b93fb638a3a904089dcabb37b913`,
        belarusian: `0b63a4ca1af298b64bdd84990df2aced80ed195fa18399307c76e917d35f7821`,
        belarusian_100k: `8a3887cb8644e42dda0803609e9f1a4b8b383781a06fb8cbeb43f79d6ed9ff65`,
        belarusian_10k: `fcd4adfc487d1405f258ebae17a753aed1fc34da48a1e0ef2501a20c63d7b75d`,
        belarusian_1k: `50742a4854b3fdc198ab0e1da2fdf662d8e3145b5e17a6aedefd25cd522ad426`,
        belarusian_25k: `1ffcd03111f935397f187efdeec0651dbec2bdb452fdc8b0ae5a1bea27c8cb1f`,
        belarusian_50k: `2694fd62f3aa527678b7024f862d4dfed3d655f8161d785d156d3a4df8f71f6b`,
        belarusian_5k: `824b544532e4d40cef933bf3dae36ae5c03541398ba388349bc446205a6cc803`,
        belarusian_lacinka: `3dcf64d002a38001c71d55bc2504c75f4f14f9c86a3c5802a56e0a41f06504e3`,
        belarusian_lacinka_1k: `76f54286481701d3d54747d66eb465d04d005617e7dabcf2481cc368cabd2950`,
        bemba: `d63337deab31b992fbf3f4ae96bdcfd1ed21299aa53dbe00c89f1ac5136a7471`,
        bemba_10k: `ef6041834b0531553cf963d1cc0c5192b8cb556c1f522bc81edc24a51c00fd2f`,
        bemba_1k: `e81ce498417a10f225ac6912a8d8fc856cfd4c94fad31c3353330ac41ed473e4`,
        bosnian: `c1dafd4f50c3d8381ba35bca1c82a3a34234120fa23b890c882110f118b59723`,
        bosnian_4k: `7eafc78c84967c8b14b9e7c26d8cd5e43bd8e36c6c1a2b5b41593815c5770382`,
        bulgarian: `03146d66d6c571c803994ab47201238c9e980baef80b63186f67f6d40e19453a`,
        bulgarian_1k: `3b90dc67f2e03157430c5d46155cd88fb9d70a08ffa0ea54498474f746d8cc3e`,
        bulgarian_latin: `8cee8d30f77b0c7cb35ad889e51f355998060777343b9eb074df73b119b1761b`,
        bulgarian_latin_1k: `db473391725ca122fea08c8d1cdf51f1efd8381229b2146296a8cd20e422805e`,
        catalan: `28bd314b770dfa4c3d84a4ad9d4e509616fcac28824cacbfade94d7b9235cfbd`,
        catalan_1k: `f1b96d32471b7fcf93c2d47e7ba71797daf6d7ad037714d72e89088a8441cc10`,
        chinese_simplified: `be597eff68df1330d5e86b16761adacdfff47b8a1b28636e184ed8f1a55835c3`,
        chinese_simplified_10k: `65c7994307985af7a16867e2edf614a984eccbd6bed109fb864656410cb9436a`,
        chinese_simplified_1k: `3b68f48b4ae562300990d85a979907c5db748380e8a2eb13b509bcbefc265c44`,
        chinese_simplified_50k: `209cae39cf2d1fc961442e71c7b1ccd990e8e52da848a607520ad155e1d81bc4`,
        chinese_simplified_5k: `f67a633c820488e85a7e2c8de2b580258da67f0a177b9d311019514203f9a569`,
        chinese_traditional: `4b9c0627698668e95664d66fc9aaee27d6f331763e09f2b803ab62122fd33629`,
        chinese_traditional_10k: `43a4586bd5a032d6aae8e1190dff8a5de29b94dc8a8cbae9d75a387858c698ae`,
        chinese_traditional_1k: `4332500bc1e7a421d1c19729b63c479b5dfa26510beee0a34be9d50bae3efd85`,
        chinese_traditional_50k: `9d69c4f457a97b5607b742468d3617d74a85be0d7ebd6d1a6f824bfe3cd06f59`,
        chinese_traditional_5k: `659a059b102ed914f0b0509e89d615bf5c7e7900b24457ef23358726c8a9244e`,
        code_6502_assembly: `8784db70d1f063534381123c3422903eff5c084af5e0f31e8aa40239f7d1a024`,
        code_abap: `62e10348c6d76f84ecf67ae87a60794af59f9aa8ef000b751325988225750186`,
        code_abap_1k: `1cf25cdbf953501fc2e0c612d851fb625d57cda5ebe9068cace694f9803322ac`,
        code_arduino: `818a6d0cdb63d3f059343f5f31c979ead5a55ada8570df4822c62fdab9e99179`,
        code_assembly: `b809d8b99cad85bd43d0c340daf35ac2d58e9114609e969f30981db9af568c49`,
        code_bash: `5d995c9e173d2211f8244a763cf474d9d32274f8e02dfa2c90f597343379204e`,
        code_brainfck: `bd48a900aa32c89075d1edc622c13dbac7331bf70d1cd626f5db8ed4c294608e`,
        "code_c++": `8a62cde1ae6572382f9b34fbd031578924eab6fe9197b92975d1ce37937c4016`,
        code_c: `8b8d42d5183a0a113065fc4f03ecf69f317eea5592116f9011bc6260908c7d2d`,
        code_clojure: `3304aa4ca0b1a7021f81c38859dd511871e09044f986fa93fb2c8146e230fa05`,
        code_cobol: `40c79f667c0e2cefcad03225380cceae7476bdc239882115da7db8c1f1b4bb69`,
        code_common_lisp: `5e3fcab70c0abf5b53330d64191a9a8af6962a65b9842745062f2264464a50ba`,
        code_csharp: `299c21929376d776644ce45b4efadb8e461a1d554f842c8807c7355e988b4454`,
        code_css: `9236ee768a90d450a8c0e5c3aee45dd06fea4a86f85f69cc313d9d0a3eb463b9`,
        code_cuda: `38d44b996213b50b4de4c79fe9707436f8e58448d1707ede30de00eebcdf40b5`,
        code_dart: `373fe67b30deca1096f307c33baf9367c67ef3a05e8182e7012416bc8bb078d6`,
        code_elixir: `5066c50d7ce10b88ae1d201033cb852a136e9d32823255e6b084e12f5d0d847a`,
        code_erlang: `9b625ebf83d202c03624226a93c08744170769e95d9ec17ab030755ce0441441`,
        code_fortran: `ae3ae038a8b78ec9aa7c043041a9ff41f12c2e6c0fcdb596080bd57b63895d0a`,
        code_fsharp: `36e4f8d025860e3d137ddddde954fa5d69b47439a36f4256d4090001ede577b6`,
        code_gdscript: `3d3ae4a51bca6f6efa9758d96e7af20a1b0e7b3c92076d9cbf77f2189953807f`,
        code_gdscript_2: `7f9d025966bae20675cb012fdb2e2aa63bf35fc6e79d2ec5b877040808bad973`,
        code_gleam: `b1fcfe7596b77a7135d5f654168b00b5ac29da395b7fff7e84ff73878bf019f8`,
        code_go: `a597626a3bafc95f004bbf7623096eb983b1294670392a20685a2e647a53ad87`,
        code_haskell: `a4e1d753cc9a6bf705c450e61b5daaeaa14e8d3fc9e4145bab45e5404d14ea4f`,
        code_html: `5af5e15e121adb2e90fd13a42a9e2596bf030bb7159471af626cb426736f0bc6`,
        code_java: `92bc6d6bb22ef2867fa9548a8dc87b0aef27bfcaf9ee6e7e080cf0a71ebbec9b`,
        code_javascript: `3270d6e75633480c0f073f27013e66c01edf55abd1f18727c5dd83a231e1c470`,
        code_javascript_1k: `ad484c1db646b70063d2dba29ae7c0618ba643479f02aef8d4ac2425a78b33b0`,
        code_javascript_react: `79f07fa0d6db6586a7e099a00bd14634420242e4b3a165aca8f86ed5d23fd06f`,
        code_jule: `c995fbe6159f72b73ca01585e4c25d5df55a4ba88dc5e96419d1c6b4e93b6121`,
        code_julia: `27d867aa972185984c1823a5effec781559a7830771d7a9f183d97f2b3fcbe1e`,
        code_kotlin: `2a9226a1c3ed297f772ee5f9c7c72b28b29cc5745f4102d6c2be192618bed953`,
        code_latex: `e47a5fe81f8849b28f0ead883fab0bc6ce214b1e667dbc8146c123f3c28ebda5`,
        code_lua: `e11931badfb2ee1c05cd7d55091ed7209597d8d6d9eac1c4c81690e894d01c1d`,
        code_luau: `807f3f29402e8348ab5c089b271712114b51a292e0ad44cbf0d4aa97046258ea`,
        code_matlab: `78a7c0f1f428b6fa6b0dbbaa661bacdd1c3e0107a9a935afa6f03c01e01706d1`,
        code_nim: `b9d2481a91cdac5327ad5c26cbc50f92c6c46177498fd25f495598ce8f96c479`,
        code_nix: `eaccf934d3ed4dce81d325640ad87da422b2c70828b8082bc597f75e7c7f11ce`,
        code_ocaml: `2c0a5af0e007402c8f807e7b0894e65e9ef04774b5f592bd9c2f1276794168d5`,
        code_odin: `e5cdd8c757e0c7389e7979213eacc166f8fa05400fab639b412433eb7472eae7`,
        code_ook: `f255d31297a126aa4b2d21adf3d516448cf71c7e5f56f0539a5e3cb5d235f00e`,
        code_opencl: `410d313f79db1c7b3a24a5c0b0f030e5b1e07c861025e668ed772d765feb2660`,
        code_pascal: `15386a026d290be50678c422c56828c692aa056b4f31fa51190efa44a4865930`,
        code_perl: `cd532175a2bcfd0f0e4a815fc3b88981b42671141a00886b6a625b947dc845fe`,
        code_php: `acf81331fe0e9f269a1d120c392f633a482bd96120b0b41ad82e2778e97309b2`,
        code_powershell: `319628995a9e02d616b2bbaf6cdedb4dc42c468308dbd812fc7d8b383bf29d9d`,
        code_python: `8e99768d1dd7ed0c904b70f36c0647b41bcd7a1a4c98acaba4cb1a2d68f48255`,
        code_python_1k: `382d0d152126eab82aa115ebc866fcc487800d45e62e5b3e603733d31e4df0c1`,
        code_python_2k: `3e28fa8bceffe0eba9319a33a4d11a5ea2473f4997ff290f0607035c2ba4fa56`,
        code_python_5k: `abd33c6158bd8d46b9913a10469742180353580517462823a30729a282682c78`,
        code_r: `6952bfc9ff965470937164b503c489c5491721a059df2033bf6c266be44803c4`,
        code_r_2k: `c996cb36c7f74d70873cbeba703c50482d3fd861762ac3de823bde72f657c56f`,
        code_rockstar: `31c2921ebd37a7d3d1ef2c46f7ed8053fb073210339ef5cd7a54851e34a5a8a8`,
        code_ruby: `fde2951498e30a353f72743eaf27064e00a757e99ef2014bf109dc46a8b2513a`,
        code_rust: `0b4bf199e69b21c40e0a8a00569ced79a27b19f41fc66a08345fd680cd1b182d`,
        code_scala: `b66c9a0f45130c5234866b4176bd817f9cdb7a63f92e2dbe41ef5bfc68f1b0bb`,
        code_sql: `e1351b4ed8be3bd67913684f71e9b6570a1cca98b207162f5a573443cb1c1ce4`,
        code_swift: `95bcdcd2f3e565a767eab720636af945003d0132e5164c312f7b0ff1caa8b38f`,
        code_systemverilog: `840ace018c4d36942f35c8cb734328d08d2ab113d4530b3682ef9f3157bc1367`,
        code_typescript: `8e5c0be961c5517d53657da355ffdc1973d7c868e77dc27c7d49f7a4fab9a4f5`,
        code_typst: `edaa88abceb3b66791d42f849cd6c5ebc6e3f457517007a4704541e7240670a1`,
        code_v: `b85324670125aa9faf7680db0d6160b10b696dc3cf3b60075c17a28c0bb5d702`,
        code_vhdl: `d9be4ff533cecd171dd44497400c01465bd925cb48782ac05043f41366c69965`,
        code_vim: `29d0478f3063068017579a4a00d4dcb622616511475ae5dc4809b46601043fd3`,
        code_vimscript: `900d791be3f89bd80e0c50bea52bcca1a112fed4ac4df514e662662c121acc3c`,
        code_visual_basic: `55133943d956dd775dd8dab21151b1e4c518ff04be6fb2284242bc80de70b303`,
        code_yoptascript: `f53082b3a0fc9dc25404428ca314336720ab78ba2d9d59eb8baf134477b1da90`,
        code_zig: `eaff515e3bb266587e4e19ae32670ddfc7478c6d4d63fb4cbc17965ab975402d`,
        croatian: `c8e909f0e0af57c1c0a2dd6898e7f54c226d0a12c025453a5e130bacabb8ba80`,
        croatian_1k: `a0f89f20806eff9fefc5d5bba7e9c5b25a65c97d86cb87ab6e363ff71fef9145`,
        czech: `6fd0fc8496b0c990f5fe8a3d7172cb618c6b3b0accaa26e0da15e4f5dc25ba29`,
        czech_10k: `967458b65eac13f1fce48ef3321855278b27a1ec95a3f2d80c5815253e2cd8d8`,
        czech_1k: `0340ef2d13fbdf063023cbf5c5477e875e6ba7a4b5a1ffbdee5542b16f73223b`,
        danish: `b7788e52a047250e514acd7eedd14eca8002b788f013c66fd620e06db2559e7b`,
        danish_10k: `67ec967d43b67a8a70308b4fb1ed2f7620b4ac2e1e8fb637cf005767128ce94c`,
        danish_1k: `45077f00fde0988fccf77e0e767c04a57f02b054d4bd069b505ada3ccf6fa66e`,
        docker_file: `443a1bce00fefe90f69ece5742b140ab1024b69f2675671f8ba44cb277e27bcd`,
        dutch: `b45d538903a4bc37a3590dfad23958ee268e9e96c737e8b42ad70cd7514d5ae6`,
        dutch_10k: `59daa737277a50d63fa9043b7907d4e9587ea2ba12f1276e67b897cab083a95f`,
        dutch_1k: `d12d4acd447560c4701ea5a44df573c5cebaf387b65f1210bd3fd69199f374d1`,
        english: `253965d2581f6cbd8f015272f00f01398bcaa069b00e367a7e6a99f0f66bebf0`,
        english_10k: `6b28ea109f72a34d3f9d675e31c3224506409608746de077eaace8e2ff82f3fa`,
        english_1k: `95ddc0c1af383432f228807d6fddbea650c3ec2900c86810acc2659ffbd200ba`,
        english_25k: `888905fd0b746bd1bd027fbc57d53457618cc4bfeaf5b296f897218f5b66cc37`,
        english_450k: `0372fb26b5a8f8fdbd18c10932abbe761509e36ec540010a47fd85a89c2383e4`,
        english_5k: `35d5171879943e85e1c198728ae955da58ceefa90323b0dde2ff789982188cbf`,
        english_commonly_misspelled: `db9371da74c8097a38345914e1f6a658b7bf63a483b0e7255b8a2c0538b9ba0e`,
        english_contractions: `0606074dd1b3a6d21ceb11dfadab37649dec3b21f1ecd4529ce4fa68bd0045a1`,
        english_doubleletter: `d01cf0a461ad7b140db5c325c805eb65424d221c45af542d11e1243400f2fde6`,
        english_legal: `2cc056b908228d8518fda76f4c4583382157f6d73d860c3908d459b2217de1d9`,
        english_medical: `3d63c2fb05b5aea0e63bead76c53566ec7596d46da398d8fcfacd75cdc03d748`,
        english_old: `88a330257fe03d0b0e8ee8327c78d367a885dfc6413bdb2fc2179d1691d67e0b`,
        english_shakespearean: `2cd09c623937ec61391b351f36bf2eb6051fe47d038341d56a57d74f7985a7f2`,
        esperanto: `348ec665b9ada925e13674c8ca0c50db5e5f9887eb8d4bb0bd68fa86217602a7`,
        esperanto_10k: `11d023f3d289f303182373f72486efc06fe4e9b7fd9b4cbc81eaa1274d732ba1`,
        esperanto_1k: `563fb9f5c70f68d10d1df105ffe8092d454092c1355900798a198327e4f757b1`,
        esperanto_25k: `1adebf38bec74ca6fb633a692015ddf8691e9da567be9a5a6281e9d6e1014474`,
        esperanto_36k: `bf89a832c34b8e0ae469afcf86379807a7f04d11828910b2cdfb5fd7cb9661f0`,
        esperanto_h_sistemo: `25cdb560bd673bcb8ace575c7e25057a3d408ff240069ea70b992555b716443b`,
        esperanto_h_sistemo_10k: `4ddacc60dc0dda78d360ff7e5b78403fd44de7e3c2cf88f000f20a2233bbe0e8`,
        esperanto_h_sistemo_1k: `b671cf248d9a8cd7b1d94cf40cba70d26f7c07960be47679cff8eb220e747317`,
        esperanto_h_sistemo_25k: `695861ae01cd877586b7c54063ed82b2823d9b08a936cf412e1ccd9e313f5f37`,
        esperanto_h_sistemo_36k: `4c9fb68fe02745a578dc06296badffcfb17768e3e3cecf4293f75a1ec3c095c1`,
        esperanto_x_sistemo: `9a844890c855a4a6d05073599e5981e6bc63dd4782fe9c8d08ffb40b8e3ab051`,
        esperanto_x_sistemo_10k: `396fa00f80f7cccf326cdaf37fba0598a0d482c141683f955fa41121d6e9f65a`,
        esperanto_x_sistemo_1k: `6136a61ce7e7cb87402afc8ff3d2beaadf26232e691ddb6642af4f603d3ea747`,
        esperanto_x_sistemo_25k: `07f67e10468a4e2c720ef5c355a0a197ec8eb87963da320da6b0fea95845346d`,
        esperanto_x_sistemo_36k: `fad8cacf82eed3a5f90ddc08bdeca5493e2e8bd36ce9e212662039be22cdf894`,
        estonian: `6e0575cb7222eabd972b720a56af4cb260bbb5608609c574a9918dc780e97419`,
        estonian_10k: `50b95590c235b2081cd5ada4c25bd3a3dd714de4cfa839835b10950dc9f3f634`,
        estonian_1k: `77ff7ad7164a0a6fcb1f046a9d55277154966aec16c0ed33ea42820e1f229a56`,
        estonian_5k: `94c98cc7dc638a1fc6d2918326f7608e6cbc6c4044452767a6e2c140908ea0f9`,
        euskera: `33610573cbd66833ac4643fc6e51c7d2581774d5aeb821391288d08f84c120f1`,
        filipino: `fe7cf2e92e29bce0f2ad97202a350c21b4f26a363ecc41ffb2744c6f138311cb`,
        filipino_1k: `bcbc3fed67db5a8c443e2e2642e3020b57bd679ba56840fee769025a9d4668ea`,
        finnish: `97d060729de2fa3eb3ab6f7da6a58153029641a26384a5f9f23385f801fb5a11`,
        finnish_10k: `79217cd7b4ae9c428d26a762d255f53538eee085818aede3fbc171966c05d339`,
        finnish_1k: `c0a3e82e88c8d3c22a1db9924156bdaf4adc328afefe1d729f26967f438221fc`,
        french: `5b53ce8727edbda94cf4955182d91bdc2d2d6f868f0c7186095ca02fe2d3d945`,
        french_10k: `0685d40a3826acd53ff2a5292f7c341ed011e41fd72a7e966421d43dca7d3827`,
        french_1k: `8268e739cf32c43e851e8a30c331070f02dc1739f457bf92e9f1e64f37f3fccf`,
        french_2k: `36a59623461ece740e05fd55beb02373a0c11f67078fa58428f4e7c217f8c6c1`,
        french_600k: `7cbc0f76c9ab63d4aafadfb072be27ade490325473cf32b770531aec08bd8202`,
        french_bitoduc: `7bf2fb5e0f5d4534ac642041f32c361679fce99c4fed4737f22b8b73a4df514e`,
        frisian: `b24430f7b16f2bbf1afae93c0d9b43405135c01b45b05818cd03cdf5c9e48782`,
        frisian_1k: `1c58dd2b506a7affa8f4ac5a537824f31fd1ff0225fe64034986bf32f552c510`,
        friulian: `3f1110210cc868db0045b1dd7d1c5f200d016b7dc13b5bb9f7e4847a4b513b64`,
        galician: `34301e12606ea2e9d65684f810c13e3874e9b9306ae39daf29239d1b936442a0`,
        georgian: `be5d8d4c69a7538141b6b5c96f467e55acea3ba354210f73853ec701e106041b`,
        german: `c2caf567ee18f09aae0ecee6092a6efe439cea1b7d18a2300e99047bcd1f9961`,
        german_10k: `3b9ee1fcbf5082c3e55a542e5150f9fdf0bebefda0e409c3c15a03f6d11e3569`,
        german_1k: `82bcc90cfe49b785d426ab5b0a760165c25da53e25c2979a1fb69c7b8cd04b59`,
        german_250k: `a638ee31ea4dd7cd64b7db1a86d592243edc912fec26c8609b3f133ad0f37a18`,
        git: `dbd7eeb44833bb642da20d772dc672a3e7c0ed09a17437db322b7eb91c8edcac`,
        greek: `fb1bc21c3ee3923e1942bb95394327b70779fd9477e2a05697ad5a000528030e`,
        greek_10k: `6d305831131f85d09ee7e44059fd6abbdf641619974a18257533ed606abfa627`,
        greek_1k: `de81c001f7db19016866f90431c2ac375c08651fd5240c3ce6d287dc0236d6c6`,
        greek_25k: `7d39919392aec67f2d4c025919a627ffb0e471e63583596e6a6622779a1b7ded`,
        greek_5k: `e4439a1c018792273041e04d788dad6f3e02d4ca0aa8449ad046e2d05d146100`,
        greek_koine: `7890b1b901c954499d0a22ce357ccd8daa87039afe4530074dddace0dffdfcae`,
        greeklish: `af60eb28e8e13d6b967e92f00d1a6c088cb19c98ce6d4b3bf25482129d66cc0a`,
        greeklish_10k: `81e050d3a22b76836645ab283105546a9af4eba46169397c8c0eb9f00fb3d9eb`,
        greeklish_1k: `7457452b0db40c432e42298d7fad05341249c3d01a66c90f137e77b91031ee81`,
        greeklish_25k: `c55313d8a3f3b7fa33d6a5aba7a77156c6460b46c51cf225c841a2b0a21edd74`,
        greeklish_5k: `1de8c5ba6cfda13519463ac66c58a6b1f4b40b0ff63ffefe402392ba173701d5`,
        gujarati: `b41e1bceadc636d0f8f131030d6190dfbb4f6bec0a7ffe7acd49cdd60c85dd6a`,
        gujarati_1k: `e162aed5cff6d28c91d0720d1440751d395323b59cde0d6a872e446ea4f086b4`,
        hausa: `12599ee0d7e82d9c189e109e17e325e91c6d843c1f9e45880e3c3ba2bd873655`,
        hausa_1k: `27b79d6e1e47c9a870dbab566f3c74f7a31a811c9f15914b909c7b29ccae70f9`,
        hawaiian: `70c227ac02fa1b37141b3b967c758f116cfe090f8ca6655bde3d745915d0c455`,
        hawaiian_1k: `6715d9c5dc8fbce8e362168d6794702a81b7bdc704bd067e8eb4126433f0310f`,
        hebrew: `c3e280618757e2889f612607353f2190a14d1e4e38850e9710b08ad37a948526`,
        hebrew_10k: `06d4fd82b9e4b0f43564d2edfcb10f248d21ee3702793c697eb537c9fa0747cb`,
        hebrew_1k: `b7d0c44b9a99c19eb2b1ee4b9d348d23ca8875639e69ca047b77c462b0f3198c`,
        hebrew_5k: `3569ac512377042378d6db0316227653e93b7ab64315592109819939ff5e84f3`,
        hindi: `7fa34f3e8f5324d5db0182430692d220f9e741ff3826b6f2e373f224acacf2cb`,
        hindi_1k: `d51d45d6cdd07a5ef19158e0a73477e3e93b1f1d38fb84341039dfaa3fed5108`,
        hinglish: `b7d24f9bbcab8357941f22464c6f678ef71f9b598f08d6ac82a61c2925b0f32e`,
        hungarian: `c3cfe0e30f073f1a8d868c5c8d52f8b02d4d3ad1dbcbbfe231f104468c705231`,
        hungarian_1k: `abd118f6168c93f90304f201abd523c7d29a62485ebf34a90a18215adc515e39`,
        hungarian_2k: `64b2cea7e3ee62dce39a1a50576d09b0eacaa4cd001272e609a2605d8dd61e9b`,
        icelandic: `c353b486606eb13dfdbe4c26c69cb2ae732d0c5303a52f0ff7e55ee51ea3129d`,
        icelandic_1k: `6e7efe95983183268a0b2efdc961be30bdbf5e0d70874f609e38c4cbe1518e32`,
        indonesian: `cc0b723eb64435c4c3be589426d1ec1e76d651e180542c0f03e7da1f3d28e13b`,
        indonesian_10k: `54cc7722c753bf2a10aa29b9c125967ded99c92a39918af549bc4e937ac937c4`,
        indonesian_1k: `b9b4098836e5ff448788c5cd863cb2849cae40505f45b947c67305531b442250`,
        irish: `f95314f5419684bddd666f98c96a97883840fa1c4377b6452e520ddf570f5edf`,
        irish_1k: `118b2d6c24743d7fd1900c7391c20c94334aad2c43cc35fd7499ef83adfa8156`,
        italian: `5a6c3b3afb002d28c6e4535e5758208d8b3117e64b9da99f48d9b76a84ff92c4`,
        italian_1k: `a275c6fb5faef76db524426ddba89172a9d7112be41c7d69db66e532ca3e239a`,
        italian_280k: `db4981e72d2e0e2864039a4cd2fc2c5a8008db3e301bbf2feed24c33586d463b`,
        italian_60k: `37655520e59c9579e3045675c47f424cd007afc9726df6d494655dd1be510109`,
        italian_7k: `4a32cf8e0fc8ad9352bdf25254eabba4ac21aea6d0cc94a9aad48d33e27ad4eb`,
        japanese_hiragana: `a319c93e893af78bc127b12c05c2c2fe220990ba3be6dc37593b379e3bc4fbad`,
        japanese_katakana: `2ee1eba3e2177db9d9c4107b9c6638aca86af7f07f0b2fd835350a8300f707ef`,
        japanese_romaji: `b3d7533ba4948fa39ccddd96bc64e17fc5e60ef84f7d88417bf91109d717eaa8`,
        japanese_romaji_1k: `96092be026fca0735f8d06a5387fffdc249b6ea5a07ade2cc72de6d408ce2020`,
        jyutping: `3de3feedde6938d072f9979ca39d098d93237fdb7c4081825f5dfd6c6d7f7153`,
        kabyle: `947580bb10f0aa66aee44e3f01d946dc9b23fb4bff132d916b2952e5fa0660bc`,
        kabyle_10k: `9901d2d720c735f515da18bc534adc16622e31847f97e45c355445234a0b1424`,
        kabyle_1k: `530eafe3ab575badcee939c9b34631fbfd3554d2b397a802b7c89897a8ad5273`,
        kabyle_2k: `dd58c67529a45d92b8044a4e90d3556eb304932e17938905212a744d0226416a`,
        kabyle_5k: `bfd15adb2df178af1be05feca954e188c9ece5bb500037ac81b70dd738469660`,
        kannada: `049070187ff6b1bfbcc7ffb8c029d7e5a219106f87bc91f7467c7661799a51cf`,
        kazakh: `7eadbcd2133a69c4de8e614917ac044160dbbe18c402a4719a9131e89a675f45`,
        kazakh_1k: `17ab99ad8a7c2e315d8783927c4cf55ac4c3e7d7dfa5d80640333bdef2cd6554`,
        khmer: `3fd70c02e8f5888c64ffa1440cce5361a5c62713aebde6a381097615f053bae5`,
        kinyarwanda: `a5fb92b0147083702651596310fed2c5ab7a40f36c96d8014aa2bb67230144d1`,
        klingon: `efb9b0635ec83a0668e00d382a0c3f571ff2c15719a3e8cc176df8901fa73fac`,
        klingon_1k: `4f27bbfe67b92d2b58e473fd7c89e7ec32d6a8f9e622f59a153aca33a1c239a4`,
        kokanu: `9399762ee52ae6648c92d56a338967df2723721054d1c9236e66aa8a2018b4d8`,
        korean: `e6833d28b29cf417b253a7dc2efeaf6d432863d739a4466867bc40afd19edce9`,
        korean_1k: `fd996863173a9f09ec6517bb754775ac74e659c3f1c7c2e9515d136fe5b8e004`,
        korean_5k: `5c70db15ef7b928e33b798d7f201101a63a28901439b13aff34f0d4c8b01f505`,
        kurdish_central: `1f956a9af55a8dc9a688a3f2050c645ff069801d13a858244d4b52e1f21482ad`,
        kurdish_central_2k: `626462eb6cdf202d466df1c2689f71af934fd1948e27c92d1666e65982ef316e`,
        kurdish_central_4k: `6ce3a7190e7a3e7be25e37109efec72285b15753afd5daf71df260f6e2c6c913`,
        kyrgyz: `6a973be17e44d89867724db8964176d8e8a2b5408b170f725e374232d95d3d46`,
        kyrgyz_1k: `7099ed230b5b51f60cb7c4089a39ec790ca4742af176775d2afaaaf8e13c4ac4`,
        lao: `a72e6d6bea9ace6d58b3dabf44f82a69af1df89e888d39afbf84269159f88b6a`,
        latin: `1ec6b10f6e3e412253abe64b55d686fca1db7fc3cb9445b9ab9e28c9ee80d2d1`,
        latvian: `d8d53303dcf2e46f720f7e55828c7d60815bdaf90fca24b3d921682d88b61c03`,
        latvian_1k: `815b887131e7f3b5d83b46ccbda43eadaee79662a224ea1dd74d2e6c9bbfb63f`,
        league_of_legends: `badd838e6d593653068fc1db197df0fc3ed0052a37895e0508de7f10b798c275`,
        likanu: `855f561223d3ded2d7c41a9e83574af88481fc37572ae000fd7ebc47c736e8b6`,
        lithuanian: `f02455846da11fa4e7386a534f133e1e7f2c306b165ebcdf796fb038676ec6b0`,
        lithuanian_1k: `d95c2e4be4c711472effbf4e95edd57b2be9525502b0152a16e073a37ba011f8`,
        lithuanian_3k: `cc0994bad9182a6a9eea922a208314ef154093384082024a67e69250d378e743`,
        lojban_cmavo: `e9eca6a86147f3c319c26960fbe8fc2eeed17c0861e6fae67a8727a2e27948dd`,
        lojban_gismu: `2f78c532ef5d08959744a2b8797789a519d829c7adb261f062b4d08c7a685968`,
        lorem_ipsum: `587926a1ef5762f62812d0387a292f8aa85d5f415c3694417edd1adae55c4a7f`,
        macedonian: `079eff9ae13ad2b87202c65f08a8e715143a4f5c8a9196f56a526b34d8850462`,
        macedonian_10k: `bbe2aed361bf09781ed23dccb39f4f8465a5850eb0cefe225ae6a7abef81c73d`,
        macedonian_1k: `0d875624ffe073889bfe62fcf3696b7e80e9f599f6556d8f2dde2250920bd485`,
        macedonian_75k: `f603af89735baaaf73dbbaa4a16d915e9d89c0e50d8b03d98bb346475b997ade`,
        malagasy: `3c604d1ff6759e4c1d7d9941388e11401ddd034c60342435fd851f5a135976c3`,
        malagasy_1k: `0bf3ef364fb37976f197280ecfc7d8f70e94ee93249e670cff85dee75cab4bf5`,
        malay: `a4221b9cdf0645f80c6c5453eea4a138eb0d73b970b8ba86e925f809e998b772`,
        malay_1k: `0cd447d24a4ea7e9313e4e36a25273f2242d9bb405d8d57788ea9c5d0d5915e8`,
        malayalam: `34484675dcd6990095603ab0519755d89718a9da93680cf29fbca0f1fb051216`,
        maltese: `ebc9ee99d8423ac3ebb94bc1107ffd924340a861a8e3d8239f5fca09e460af7e`,
        maltese_1k: `1b1d57804970c83d0f0482ab399e7cd5f449cae347c61e418fdd72eeac5bd47e`,
        maori_1k: `b8b6b7d28744625d1f1a93e2a526f25b5ff1fe0dff573cec5431b4f40f2e9b18`,
        marathi: `72886f8b97ed17fcef73ab97546c5701016c0295109cd31513a211a4d6968599`,
        mongolian: `f58382772bc7b5de7bd9568f82a709a743c0c7cd09e099b601a3f5889242c721`,
        mongolian_10k: `b1019361468cc36fd07fb6b4936504e25a3e30aa15bf82a868d2067b56b36443`,
        myanmar_burmese: `8d7e13b99564b9b8c6a00aea081065c3db893b0775bd7e4a14274f485b99fc4c`,
        nepali: `6cffb0e40a02c9284170b16021f0465118b107bc8e1146b6c36632524cacfe58`,
        nepali_1k: `c741dbe16eb1bf531b44e2bc3333dd6caf851d9aa144ea3780c6aa0af1bd874a`,
        nepali_romanized: `36b373f638e37f2c5395167dd20d69fe738db42edcc89e6bb572385aadd8a05a`,
        norwegian_bokmal: `5809762d30068a2a61c2fca49709a79729ea0d5627e788f93548057ca3333fba`,
        norwegian_bokmal_10k: `4d37f68b0d44a4fc55fbfd545b7fbdf6b614febee6dd9a2944cb599464a40dcc`,
        norwegian_bokmal_150k: `db47ba8a239a38d57cd2ea69954fe7160f872c07f193c2c1d8d28b2d15df2786`,
        norwegian_bokmal_1k: `bf14054e03d604d0dcb9a5a07fb3b29e4e20e06c864ec2cffff0c6e414385da4`,
        norwegian_bokmal_5k: `cf53f353c93fdb4ad40a071cb2cb39f2b2168643d8d7684edc7507d36e81163f`,
        norwegian_bokmal_600k: `0e43bf193dde65683076fef88afb6f887a64f7fb278a64a372af383edfa28341`,
        norwegian_nynorsk: `a3c7fd011ebfc658dfabb81a71c10fcab257f346abb4f714abdb93541c2e8ef7`,
        norwegian_nynorsk_100k: `f72e9ad5af12940cfc9788503e7d6ebd46379ab566e0e46ef8471e7dd939d212`,
        norwegian_nynorsk_10k: `21533df997c261e949556aba71ed2408d1c447496d176a2bfa28249d5bc0dddb`,
        norwegian_nynorsk_1k: `5430194b6e33d1e9fc8725fe0573a892787abc5f2952fdd2d87bec4b63dfa9f6`,
        norwegian_nynorsk_400k: `691091b126cb955672fac29bd8e722d3f352b0e655af6fe38fb81b2222055733`,
        norwegian_nynorsk_5k: `0394aa7d1d989c1cf6d91517cdabc4a6f60b897ab74ecb7067018c0653b2657c`,
        occitan: `5ac6f97bcbcbc6bbb43fd874b6bb2081ca9babab0f3e319383b7076b9bb18725`,
        occitan_10k: `0d163ea55456831ab249c762595a3b44a3f4fbd60c40df17527d479c6bf52ca3`,
        occitan_1k: `d8e6b083bf164f9b0dd9efba9ffaa092d59508f8309ba152c2fecf4397313d82`,
        occitan_2k: `0dd8d764ded7fc69d5c7b91e066a5cb7b20a962bd3f845afa35457ce30c939be`,
        occitan_5k: `c52dfb474201b20a65bd3b924aaedc47a1161ef021992ee92b9b240acb6c1bf5`,
        oromo: `29469f91b3f923754e5937729a4fba9eb4fe6fb245749689567961de8c03de9e`,
        oromo_1k: `16d21a555a6c3f8caf003bdf0c11c21a3805cada17efa4cceb1aa009e02d691a`,
        oromo_5k: `3886ec4b53efb0ab00750e4d55863c581ef29e58988c074a821ba3a53b37450c`,
        pashto: `bd3e593fc6fb97c6ce319371a404480b7fa0d5546baa0e8717c04e960f81c293`,
        persian: `c0c951086bce3903860a5d4b5fc8106428efa26d4ebcd2620959f6bf66c4b693`,
        persian_1k: `c40b7d8cb004d84da0110f17d023ac169cdfe4d8b10509f08c880d34386afb87`,
        persian_20k: `28d86cfe5df8ea8298b06af623d13cbcae468254a8fc88ef6b20b5448efada0e`,
        persian_5k: `63e325d7d7637786c673192d906189bfee0191c940f993ac38502178816068d7`,
        persian_romanized: `74071ae256bf0d7790b91b4b1481a54b284f37cec8c9217ce6a4ac02f6886faa`,
        pig_latin: `e0cbaa48295107db1a5a7c681c197431b00db195d5df8396b241c057288a5da6`,
        pinyin: `c2b633966a6b6dbb8c7f259e6fb8ef9b38bf50ddef1631c8291930505a937d1e`,
        pinyin_10k: `bd800567b583c5aba5377dfaacffd737f467c8eadefcf5541f8f062b4d65cbb3`,
        pinyin_1k: `d78c5079213d89d026c960ca8e8b9f36c58737987b65b6f2eae1ff4862ff8c60`,
        pokemon_1k: `e1da93a4148f1e345bb7eb6ee92652acf82ad7b56d04fde6fc3415a97b46652a`,
        polish: `66ed5d2f2e71a058d0d872e8b072b0ca09f0d057275de277e20fafed217ecaba`,
        polish_10k: `bea3dfab31bee37d35eaa7abaecfc9745c2a0eab0349da09e190af29850c3de5`,
        polish_200k: `b8368fd682563941327398428b37b08da096ca03cf1d4fac8f42131b385554fd`,
        polish_20k: `c678e3b10a1a64b30c3a57eebb385ca3641ad95574df73fc76d3e9b5e58bf53f`,
        polish_2k: `d20d4cb9a8eddc2fe4e9f0ce8a3f8a1d9db70380d2dd636f7b981f9be829f605`,
        polish_40k: `32c629230e23338610760a52886d85d4c1e3ed9592e5068a810f016e127be989`,
        polish_5k: `3b2c26c7aaf8c814681df4df5eb902b3bc44bea5ed2eaeaf33d141d887d0b095`,
        portuguese: `349962e64a8581fe38ebedd8235663421939e5c28d1d2ec0a51296add4096d60`,
        portuguese_1k: `9a128edfb342a06ac7e49af7b37a0f6947a1aac70bf06b44fdb4c265ef3160c9`,
        portuguese_320k: `988008783f00a81c031226b4b8924d3fb934638adf7bcddeadbcd553d9abe9a8`,
        portuguese_3k: `eb5e9297e07c919d972d87e03327ec3de1d971626313ec3d801c677e1d5fd6a8`,
        portuguese_550k: `5a88275db7e1e36749e677d35c7f4f3bcddcd57b2050d2d14c2a34efaab92b67`,
        portuguese_5k: `e9eae9f93f322520a39fefb8977b00293043d94bdb3ea155ac5f000cc58dd8f0`,
        portuguese_acentos_e_cedilha: `86296fe834926eda5a27aab2bfbffdc30818016f682885e28ee5d8be265b1f87`,
        quenya: `e2ccaf46e0b41fd6d3e3eb30b09b9d10f4b11286dde758c777d86fb67320e7ef`,
        romanian: `20308ebfc8f574768259bd5b8ba28f3b64d084a99b118eb3ddc1d1a27db498ed`,
        romanian_100k: `34fd28c351f7703ecb0c518d8e370bad882ad4d7852dc9c081fd93aedb9f7f38`,
        romanian_10k: `cccd27f68fd0f385ba7cbba2327bde417f2637fd2bb6c5fc4addfcaf4d6112d5`,
        romanian_1k: `493b83f0fd1e04c43ae0c5ee964d6a40b40b7fc037bf56057710721822b45e98`,
        romanian_200k: `30887183f9b167fd0e1062feff03fb6ab0f269d41ef69e48a19fe5f25e804f55`,
        romanian_25k: `6e4a513369400e61fe8b327f256644b3a047c057e396f7af2e716482c53bcc9a`,
        romanian_50k: `4a14faa54f71818b1e6b4bed3157fcb5dba0e6547ad8bfa84b1a20b7942be200`,
        romanian_5k: `6b5ecfda21c22e8f2fd7dad29cd66733614177189a58a2c80801eefdfa4c61c7`,
        russian: `dac5553f360a6d64c01ed39b39ec8652425425923e0f65cecf951e061721355c`,
        russian_10k: `37747c6876e8b5f2c882a0ad86a28bf61e9d56c56863527536447ed7ebf0fe08`,
        russian_1k: `36a778eed866f750bad2bb404dab8161705f7f46e3a34cc7a604c61fc9ed2942`,
        russian_25k: `12935e4f1f1d4a35ab232184edc0127eb03688662f1ac408022d95868408c40b`,
        russian_375k: `4752fadeb9e25e5c77736d8f78f87d04ee38dd68b513b27251cc8b7cf97410e0`,
        russian_50k: `f90e65f4c9c3b8443b8e4f979eb348c00f02101f3f664bc9940eb14544207b72`,
        russian_5k: `87440b65cfd05aec0725f7289af482312f6e7e043fff1208dd686e3db296031a`,
        russian_abbreviations: `cf28a5a04c4da920da46e954f34691d94d8e3d4dc5c95d97ebc6be8b35a6f61d`,
        russian_contractions: `12f09f8f5350a649de4395d267c4bda1e16cbf29191a1fb3afa606a189947db0`,
        russian_contractions_1k: `3c13320178c0132add8bbc5e6f4f42ed9ea69c28505a0c4cd5e91446260c7328`,
        sanskrit: `a32c95139dde91aaa3e37b48a2b49baef7d5c0c5fabb88a081a5592c8ccba21a`,
        sanskrit_roman: `21cf3516244acdaced67d0378e3bd47ff6ad1b672979d07b18887d5e56131432`,
        santali: `329e38b641d6c2b35cc03d602f300c645517516ee7888b5c5d5b9bb6ce6ecf70`,
        serbian: `92bcf52b826406fb68814429cdf52f4c837017b1cf12f7e9a1bbbb858c2eb1fd`,
        serbian_10k: `a245303452ee1ae306a5e1b97afadef91c2d92fdc96038e137347bd5f25fced8`,
        serbian_latin: `096a03bc34ede476fe4fce8350b4f427365cf6b681ac039f55bb81bd131887cd`,
        serbian_latin_10k: `0b8da881b12ed4ad177f649e061b684b7bf0ab191abeca97b9a24c1b8d8583b3`,
        shona: `a028029f20b7588d1b3d084b7543d0435e8a303b85b760e0842e7238ff486a56`,
        shona_1k: `3790b14dd0469cbf7647aca7e762646f1ac6e2d6efa601430366c1c1c1ba0916`,
        sindhi: `b0e2ae0ba0d7898e30280c098a1cccb7d3d3487c0eeab7a6ee602547b15f4ff1`,
        sinhala: `f6ad3809792fbb77ee5908d22305f15abb3cfe4ba6a16d6316f51cfb60d063e1`,
        slovak: `b4a28738a1c5a7f561899fa4992ac5f676041382dd1229a71515d89caf8bd183`,
        slovak_10k: `1caeebcf033a917ff68b3ff0555ebf7eec21e1baca8b508a16f58ddee24ca681`,
        slovak_1k: `dd3fd5284254ee7abe0b2ba3e62484bca35eb0137553eefd0e933124fe87fb69`,
        slovenian: `b19634ffd1b59bf8a856759a04a9faf4b61b307f54f2ffeb58bdc8c2abb5dfb8`,
        slovenian_1k: `0eddb19672ba2cddc9fe827ffa460aac93bbb8b0ac496550f4826d216d6fae1a`,
        slovenian_5k: `d42d2cfbca696363e0a6d6f077721dd931689c75d9109e2ee97b4252b12f2c7b`,
        spanish: `464f7580531cf85588bd5bc2e0aeed1b6da63e7b686550cb881f4ebfd997528f`,
        spanish_10k: `9d28bf4961aea90c720f5ecb6160d827f989420d8fafd23675e2ba23b2c01f94`,
        spanish_1k: `9da624dcd557e9c87cdf3ca9e7987f84ae9d18ca7300fe8343a31080466aca8c`,
        spanish_650k: `63cfc953f378d615834751a31897ffb54cf06609de0c19137dffaf982058bc01`,
        swahili_1k: `a38b530791f3fa73423e0887622529551324e1ac2bedc309d8860d20181fe005`,
        swedish: `7591eb0b1559038f91128a04963c815217bfd4eae900651dd5a0452a423d2156`,
        swedish_1k: `72cca84c0e5a9307137bf8299a0e612219ca2d0a3244314ae34444c973403f82`,
        swedish_diacritics: `ed9a2bcd829dc734a34ddd55495c2d57de27a096c07e3b5a401b26c19fe4851f`,
        swiss_german: `c1d85c8907605af115d7f5927c40e3ad38dc888ced32261da69704268c3f1c34`,
        swiss_german_1k: `35402875854dd545a9ffaddf339a809a4b5d74232cef463d026905b6b12d6e09`,
        swiss_german_2k: `a8d562d2907a54f0c44e7e7230b3577300fd70ab18119509f1f9dd455b758cf2`,
        tamil: `311bfcdcdeb2c8daf0191c4a0c443bfd9afa3667efb6c2e0d01e1c6b12a201db`,
        tamil_1k: `401da5decc2da21f8d6355fc1c7bd3c6cff3369cf55607f45d6738e24529b4ca`,
        tamil_old: `443d52eebecc0f6049a6e9d8e59f95205989cac68139db4469fee8f98f4d0f7b`,
        tanglish: `2606c5a720b061cb88a9d771161dca4ed4466fdc380b58023980997e33876c06`,
        tatar: `56be46871e14efc1663b8cd5028165859db7cb308c8a24e8c8504a8b9bf90572`,
        tatar_1k: `bb1752f805abc8825149443d498c4b6acfbfbfc0e193b6559aa703afee1c1ed8`,
        tatar_5k: `21732d99bc63cadd62624382a15616d5c643098eaa0270fe4ffc1a221be5ffb9`,
        tatar_9k: `5454d966964cb65fc395abb30498c7f24214fbdbaeac998375ee6c3b4df3e312`,
        tatar_crimean: `a8de360f16e65222db89134ddffc7c44c3f567c1e45817c154acd0f57bc068f1`,
        tatar_crimean_10k: `9acf2f894d5f0ad9626cec17ebc1cafccb4b12511a557ec6bd3e85e4f9c0c463`,
        tatar_crimean_15k: `ef2cefed9315b72be69966861ae4e8d3334f877b038ddafc45ae375d9d232029`,
        tatar_crimean_1k: `fe48d207f4c13f75bafc65dedfed36d94e03ee535218671481ba21af90bb631d`,
        tatar_crimean_5k: `382a618abc5bad9834caf87e3ad9bb51e77734e9f82e006f9375916a68a0c357`,
        tatar_crimean_cyrillic: `499ef50a2e3585fc824781f85fc16891e9904c6a193b8a27de9589c04def759c`,
        tatar_crimean_cyrillic_10k: `83de2484fb1a9a12031b331afaac5c7320dde92666d3649ee0988b252fd21f58`,
        tatar_crimean_cyrillic_15k: `a20e1e977a7b17244b699ba448169ccbf54f3f8aa32640edfebf03cfb2c72f3e`,
        tatar_crimean_cyrillic_1k: `09f5138c012c23987748860531c89fb8b6adab457e5716b59694788a7df25c19`,
        tatar_crimean_cyrillic_5k: `514b71e249cde7272dc026253ff9be632801300d8c1034f7815e969381ddb5d1`,
        telugu: `f7e38c5dad1787217cfd876bb79bd09460c0a51560a01dd58a8303faa8599089`,
        telugu_1k: `22b073e0179b6c2797b59027fa8ba12d56e91382cb385a4b9fccf47fc310bb15`,
        thai: `309d4be5d5a30f0d4f6bf8a1a13a3cbb752c9cf64dcf31c7b24c902ab17335a4`,
        thai_10k: `7ee4dbb7f6cdfac6ec7c239dc99e17e3ca97bcf5793efb5549b3fe4fd468e4da`,
        thai_1k: `dc6dd162bee1f45397d6046d09dd9ee612ebab4ac5f797340d0a4318510d0d43`,
        thai_20k: `68f6ec19ec2b7a641859fbfd113a484ced463b11deb38eb226c33965ba860750`,
        thai_50k: `b9ac5de9640bd450dedff42d752658d5e5e38e0d8a0f784bb202594d9d12611e`,
        thai_5k: `92dcb6812d08ecaeb4b3272b403538301d5cc2f424feeb1ff9bea25114cc2efc`,
        thai_60k: `f27b4e3439addb2f71787e148b650783f8b02639f873fd06240883e9907c1850`,
        tibetan: `5fd8bfef3cfe827ec1503c48309a2185e8fa36e38208c2c9c613529d7ad59fd2`,
        tibetan_1k: `91b72af26c30d5cc8c0109bb567b4eaf4b39ceff1cde23143c34127d38f9c62e`,
        toki_pona: `152137a84bc9ae578bf1a6c3f72850d7b1b372b4a896dc416a87a863ddee7519`,
        toki_pona_ku_lili: `d7ffe36d1433513b68b94d99c3cc962c2b26ca014bf93a20063483eebb1bf602`,
        toki_pona_ku_suli: `ca0d2ebf0ca820cd4d3928a732a30e9853ac08586f43b394d1f465e63a52c183`,
        turkish: `f6f62100c8dd8f06c37c5b9d1e05627b8c03d42fada25fd651b6cb931149179c`,
        turkish_1k: `823e5b5401cd2a71e631d64982ebb7700def55682f0f82019c93468015aef7b4`,
        turkish_5k: `e10a43a4378289b703285112d7dccf8125eda19452c0e4c52b1c0791b87f8832`,
        twitch_emotes: `f73bf670c9c525e3b803a350346c4ee4fb158d6585061e1a4aeed4c771702292`,
        typing_of_the_dead: `b6f2d2f014afa30787f10d1fc7bb99b4ced7ce765fc7af51d5eff1cb51bc1950`,
        udmurt: `2ac88d0b6a1682aad9f917c73f1919c5020e971f04108453d2b258a8f3965586`,
        ukrainian: `e693520ae92b2d4467e85392b5b2fff89c1c2ef22e594e7373f50941175f3876`,
        ukrainian_10k: `106712ce54c94da4fb2ec3f41c389325cf7d3c64ef59d33c7a05f4755df87c81`,
        ukrainian_1k: `dc9fd23dc8229f66d82692c66298a2995ac07573535e13830a761262293316eb`,
        ukrainian_50k: `6cd51bf11243c0652c4559dc37525e9a2145297cad74b82a323e910c70cab4a9`,
        ukrainian_endings: `0e27e0086c862f556ee2120f03a11f22846358400f24b1f810bc58fd173f3609`,
        ukrainian_latynka: `213883c243ea9feb63943603fb8a6b9fce1495c5e96028ca403e87e21255daf6`,
        ukrainian_latynka_10k: `60ea8e418f98272bf6c7313da82fb6056e48c0b9372b0e70e3cb3a911af8d696`,
        ukrainian_latynka_1k: `d278f196a89cdd75b0d3f8f9d4a134c685acfd071497c8cf6f421fbfecb310fa`,
        ukrainian_latynka_50k: `3f3ed559f26918c22cce4e81bf422e79b0ce9225a3603245440b04b3345274c1`,
        ukrainian_latynka_endings: `e22299f87774eb13c663f62386a5138ca8822e13f86a18e95b596e72a19935f5`,
        urdish: `e7b18735773a05eed2fef990f79ad7d464e417135ec6b8d68929b6cf109e1dc8`,
        urdu: `2236c01a8e4881a0a7b3657001a77137dcb872bc29245032c263053824ee220b`,
        urdu_1k: `9dd3b141363bf5fd382e92b8bf98f156a147e2a75169d4e7c6276a82895da181`,
        urdu_5k: `0dfd3253b2dcfa55555130b8fe4cdca12040079860f8049058c3a5e69186310f`,
        urdu_roman: `f6cb0f2947189c3bb8fed6cc415b55fb2451f609389021115606f6176cfe84d3`,
        uzbek: `55135a66a1851aa4352b3bd069264385c2092e3dd5b69bf9714a91d10dc1090f`,
        uzbek_1k: `eb4bdd4e8200c8bce96597c055d19c8d69fa9debcfe04f00905713c2a7724a0b`,
        uzbek_70k: `a1d82aa248c7d083cfeb018bb1200dfe11b6b69d91e3093d5c6cfb7b696f3c69`,
        vietnamese: `2bbb05c3214a6da2371dba81e18584a2c368ac18371d6e032e4207355817a5e4`,
        vietnamese_1k: `b715a183634527d6d152b82df4be3311946607e4c062afd33061c9355cb1a473`,
        vietnamese_5k: `00e944d74899089b73f5e774047cd852693b497b8a67fe5866a02b23291239dc`,
        viossa: `09a2bc7f5c6c9dbc576614d33a9a88d446df8f3f597bb2e18e6ad9bdd0dd1434`,
        viossa_njutro: `6debf62d2035df4b3d9712525836440079488b1f61ed77bbdf7f6430221986b5`,
        welsh: `bfa8a0825f38bcb71f3b5219163ff7490d97e6758dce0964d5090c977e9f0fb8`,
        welsh_1k: `91c5a4ddbed118438f299317c0d8b3624dbf8f8bd70c0cea3ae73feaaee17904`,
        wordle: `dc0b4a38eb6271c16df78c38c9619920a0e4e93c8b89563d5bef3ac9ab7ab245`,
        wordle_1k: `4595d47bc80537b428b9ceda7d9df7b073a5328c18528384d515f0cbbb430515`,
        xhosa: `7666904f656864d30d6d415cc262d3e1a4939e388eb4fd72e7a985d4a6be2a26`,
        xhosa_3k: `cc4569b137f6c6bb1f30a3031dd13b2f5f7f296aa37bfb3593671340f054a0d5`,
        yiddish: `6dfa6dad28643de69ba084c6ffb3153c276078bf127686c1b040a987f2759715`,
        yoruba_1k: `b0acb98309268729daeb80c374be9d4c6a434b8a5a1d127f5ccad93be8fa8e53`,
        zulu: `6f2f46acee77a419f954f63d61d7fd2938fda74845c6df27a9592313588e7503`
    },
    Ni = window.fetch,
    Pi = window.crypto.subtle;
async function Fi(e) {
    try {
        if (!e) throw Error(`No URL`);
        let t = await Ni(e);
        if (t.ok) {
            if (!t.headers.get(`content-type`) ?.startsWith(`application/json`)) throw Error(`Content is not JSON`);
            return await t.json()
        } else throw Error(`${t.status} ${t.statusText}`)
    } catch (t) {
        throw console.error(`Error fetching JSON: ${e}`, t), t
    }
}

function Ii(e, t) {
    let n = new Map;
    return async (...r) => {
        let i = t ? t(...r) : r[0],
            a = n.get(i);
        if (a !== void 0) return a;
        let o = e(...r);
        return n.set(i, o), o
    }
}
var Li = Ii(Fi);
async function Ri(e) {
    return await Li(`./layouts/${e}.json`)
}
var zi, Bi = Ii(async e => {
    let t = await Fi(`./languages/${e}.json`);
    if (!wn()) {
        let n = new TextEncoder().encode(JSON.stringify(t, null, 0));
        if (Ci(await Pi.digest(`SHA-256`, n)) !== Mi[e]) throw Error(`Integrity check failed. Try refreshing the page. If this error persists, please contact support.`)
    }
    return t
});
async function Vi(e) {
    return (zi === void 0 || zi.name !== e) && (zi = await Bi(e)), zi
}
async function Hi(e) {
    let t = await Vi(e);
    return t.orderedByFrequency === !0 ? `yes` : t.orderedByFrequency === !1 ? `no` : `unknown`
}
async function Ui(e) {
    return await Vi(e)
}
var Wi = class {
    constructor(e, t, n) {
        this.title = e, this.author = t, this.words = n
    }
};
async function Gi() {
    return await Fi(`/supporters.json`)
}
async function Ki() {
    return await Fi(`/contributors.json`)
}
async function qi() {
    let e = await Li(`https://api.github.com/repos/monkeytypegame/monkeytype/releases?per_page=1`);
    if (e[0] === void 0 || e[0].name === void 0) throw Error(`No release found`);
    return e[0].name
}
async function Ji(e) {
    return Fi(`https://api.github.com/repos/monkeytypegame/monkeytype/releases?per_page=5&page=${e?.page??1}`)
}
var Yi = [
        [`Backquote`, `Digit1`, `Digit2`, `Digit3`, `Digit4`, `Digit5`, `Digit6`, `Digit7`, `Digit8`, `Digit9`, `Digit0`, `Minus`, `Equal`],
        [`KeyQ`, `KeyW`, `KeyE`, `KeyR`, `KeyT`, `KeyY`, `KeyU`, `KeyI`, `KeyO`, `KeyP`, `BracketLeft`, `BracketRight`, `Backslash`],
        [`KeyA`, `KeyS`, `KeyD`, `KeyF`, `KeyG`, `KeyH`, `KeyJ`, `KeyK`, `KeyL`, `Semicolon`, `Quote`],
        [`KeyZ`, `KeyX`, `KeyC`, `KeyV`, `KeyB`, `KeyN`, `KeyM`, `Comma`, `Period`, `Slash`],
        [`Space`]
    ],
    Xi = new Set(`Backquote.Digit1.Digit2.Digit3.Digit4.Digit5.Digit6.KeyQ.KeyW.KeyE.KeyR.KeyT.KeyY.KeyA.KeyS.KeyD.KeyF.KeyG.ShiftLeft.IntlBackslash.KeyZ.KeyX.KeyC.KeyV.KeyB.Space`.split(`.`)),
    Zi = new Set(`Digit6.Digit7.Digit8.Digit9.Digit0.Minus.Equal.Backspace.KeyY.KeyU.KeyI.KeyO.KeyP.BracketLeft.BracketRight.Backslash.KeyH.KeyJ.KeyK.KeyL.Semicolon.Quote.Enter.KeyB.KeyN.KeyM.Comma.Period.Slash.ShiftRight.ArrowUp.ArrowLeft.ArrowDown.ArrowRight.NumpadMultiply.NumpadSubtract.NumpadAdd.NumpadDecimal.NumpadEqual.NumpadDivide.Numpad0.Numpad1.Numpad2.Numpad3.Numpad4.Numpad5.Numpad6.Numpad7.Numpad8.Numpad9.NumpadEnter.Space`.split(`.`));

function Qi(e, t) {
    let n = Object.values(t.keys),
        r = n.findIndex(t => t.find(t => t.includes(e))),
        i = n[r];
    if (i === void 0) return;
    let a = i.findIndex(t => t.includes(e));
    if (a === -1) return;
    let o = Yi[r] ?.[a];
    return t.type === `iso` && (r === 2 && a === 11 ? o = `Backslash` : r === 3 && a === 0 ? o = `IntlBackslash` : r === 3 && (o = Yi[3] ?.[a - 1])), o
}

function $i(e) {
    return {
        leftSide: Xi.has(e),
        rightSide: Zi.has(e)
    }
}

function ea(e) {
    let t = [11, 10, 10, 10, 10],
        n = {
            row1: [...[...e.keys.row1.slice(0, t[0])].reverse(), ...e.keys.row1.slice(t[0])],
            row2: [...[...e.keys.row2.slice(0, t[1])].reverse(), ...e.keys.row2.slice(t[1])],
            row3: [...[...e.keys.row3.slice(0, t[2])].reverse(), ...e.keys.row3.slice(t[2])],
            row4: [...[...e.keys.row4.slice(0, t[3])].reverse(), ...e.keys.row4.slice(t[3])],
            row5: [...[...e.keys.row5.slice(0, t[4])].reverse(), ...e.keys.row5.slice(t[4])]
        };
    return { ...e,
        keys: n
    }
}

function ta(e, t, n, r, i) {
    let a = e === `words` && (t >= 1e3 || t === 0),
        o = e === `time` && (n >= 900 || n === 0),
        s = e === `custom` && i,
        c = e === `custom` && (r.limit.mode === `word` || r.limit.mode === `section`) && (r.limit.value >= 1e3 || r.limit.value === 0),
        l = e === `custom` && r.limit.mode === `time` && (r.limit.value >= 900 || r.limit.value === 0);
    return !(a || o || s || c || l)
}
var na = new Map;

function ra(e, t) {
    ia(e);
    let n = requestAnimationFrame(() => {
        na.delete(e), t()
    });
    na.set(e, n)
}

function ia(e) {
    let t = na.get(e);
    t !== void 0 && (cancelAnimationFrame(t), na.delete(e))
}

function aa(e) {
    for (let t of na.keys()) t.startsWith(e) && ia(t)
}
var oa, sa = !1;

function ca(e) {
    la(), sa ? setTimeout(e) : oa ?.push(e)
}

function la() {
    oa === void 0 && (oa = [], document.readyState === `loading` ? (document.addEventListener(`DOMContentLoaded`, ua), window.addEventListener(`load`, ua)) : setTimeout(ua))
}

function ua() {
    if (!sa) {
        for (sa = !0, document.removeEventListener(`DOMContentLoaded`, ua), window.removeEventListener(`load`, ua); oa && oa.length;) {
            let e = oa;
            oa = [], e.forEach(e => {
                try {
                    e()
                } catch (e) {
                    setTimeout(() => {
                        throw e
                    })
                }
            })
        }
        oa = void 0
    }
}

function da(e) {
    let t = document.querySelector(e);
    return t ? new ma(t) : null
}

function fa(e) {
    return new ha(...Array.from(document.querySelectorAll(e)).filter(e => e !== null).map(e => new ma(e)))
}

function pa(e) {
    let t = document.querySelector(e);
    if (t === null) throw Error(`Required element not found: ${e}`);
    return new ma(t)
}
var ma = class e {
        constructor(e) {
            this.native = e
        }
        disable() {
            return this.native.setAttribute(`disabled`, `true`), this
        }
        enable() {
            return this.native.removeAttribute(`disabled`), this
        }
        isDisabled() {
            return this.native.hasAttribute(`disabled`)
        }
        getAttribute(e) {
            return this.native.getAttribute(e)
        }
        hasAttribute(e) {
            return this.native.hasAttribute(e)
        }
        setAttribute(e, t) {
            return this.native.setAttribute(e, t), this
        }
        removeAttribute(e) {
            return this.native.removeAttribute(e), this
        }
        isChecked() {
            if (this.native instanceof HTMLInputElement) return this.native.checked
        }
        hide() {
            return this.addClass(`hidden`), this
        }
        show() {
            return this.removeClass(`hidden`), this
        }
        isHidden() {
            return this.hasClass(`hidden`)
        }
        isVisible() {
            return this.native.offsetWidth > 0 || this.native.offsetHeight > 0
        }
        scrollIntoView(e) {
            return this.native.scrollIntoView(e), this
        }
        addClass(e) {
            if (Array.isArray(e)) this.native.classList.add(...e);
            else {
                if (e.includes(` `)) return this.addClass(e.split(` `).filter(e => e.length > 0));
                this.native.classList.add(e)
            }
            return this
        }
        removeClass(e) {
            if (Array.isArray(e)) this.native.classList.remove(...e);
            else {
                if (e.includes(` `)) return this.removeClass(e.split(` `).filter(e => e.length > 0));
                this.native.classList.remove(e)
            }
            return this
        }
        hasClass(e) {
            return e.includes(` `) ? e.split(` `).filter(e => e.length > 0).every(e => this.hasClass(e)) : this.native.classList.contains(e)
        }
        toggleClass(e, t) {
            return this.native.classList.toggle(e, t), this
        }
        on(e, t) {
            return this.native.addEventListener(e, t), this
        }
        onChild(e, t, n) {
            return this.native.addEventListener(e, e => {
                let r = e.target;
                if (r === null) return;
                let i = r.closest(t);
                for (; i !== null && i !== this.native && this.native.contains(i);) typeof n == `function` ? n.call(i, Object.assign(e, {
                    childTarget: i
                })) : n.handleEvent(Object.assign(e, {
                    childTarget: i
                })), i = i.parentElement === null ? null : i.parentElement.closest(t)
            }), this
        }
        setHtml(e) {
            return this.native.innerHTML = e, this
        }
        setText(e) {
            return this.native.textContent = e, this
        }
        remove() {
            this.native.parentNode && this.native.parentNode.removeChild(this.native)
        }
        setStyle(e) {
            let t = Object.entries(e);
            if (t.length === 0) return this.native.style.cssText = ``, this;
            for (let [e, n] of t) n !== void 0 && (this.native.style[e] = n);
            return this
        }
        getStyle() {
            return this.native.style
        }
        isFocused() {
            return this.native === document.activeElement
        }
        qs(t) {
            let n = this.native.querySelector(t);
            return n ? new e(n) : null
        }
        qsa(t) {
            return new ha(...Array.from(this.native.querySelectorAll(t)).filter(e => e !== null).map(t => new e(t)))
        }
        qsr(t) {
            let n = this.native.querySelector(t);
            if (n === null) throw Error(`Required element not found: ${t}`);
            return new e(n)
        }
        empty() {
            return this.native.innerHTML = ``, this
        }
        appendHtml(e) {
            return this.native.insertAdjacentHTML(`beforeend`, e), this
        }
        append(t) {
            if (t instanceof ha) return this.native.append(...t.native), this;
            if (Array.isArray(t)) {
                for (let n of t) n instanceof e ? this.native.append(n.native) : this.native.append(n);
                return this
            }
            return t instanceof e ? this.native.appendChild(t.native) : this.native.append(t), this
        }
        prependHtml(e) {
            return this.native.insertAdjacentHTML(`afterbegin`, e), this
        }
        dispatch(e, t) {
            return this.native.dispatchEvent(new Event(e, t)), this
        }
        screenBounds() {
            let e = this.native.getBoundingClientRect(),
                t = window.pageXOffset || document.documentElement.scrollLeft,
                n = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: e.top + n,
                left: e.left + t,
                width: e.width,
                height: e.height
            }
        }
        wrapWith(t) {
            let n = document.createElement(`div`);
            n.innerHTML = t;
            let r = n.firstElementChild;
            if (r === null) throw Error(`Invalid HTML string provided to wrapWith.`);
            return this.native.parentNode ?.insertBefore(r, this.native), r.appendChild(this.native), new e(r)
        }
        hasValue() {
            return this.native instanceof HTMLInputElement || this.native instanceof HTMLTextAreaElement || this.native instanceof HTMLSelectElement
        }
        hasSelectableValue() {
            return this.native instanceof HTMLInputElement || this.native instanceof HTMLTextAreaElement
        }
        setValue(e) {
            return this.hasValue() && (this.native.value = e), this
        }
        getValue() {
            if (this.hasValue()) return this.native.value
        }
        setChecked(e) {
            return this.native instanceof HTMLInputElement && (this.native.checked = e), this
        }
        getChecked() {
            if (this.native instanceof HTMLInputElement) return this.native.checked
        }
        setSelected(e) {
            return this.native instanceof HTMLOptionElement && (this.native.selected = e), this
        }
        getSelected() {
            if (this.native instanceof HTMLOptionElement) return this.native.selected
        }
        getParent() {
            return this.native.parentElement ? new e(this.native.parentElement) : null
        }
        closestParent(t) {
            let n = this.native.parentElement ?.closest(t);
            return n === null ? null : new e(n)
        }
        matches(e) {
            return this.native.matches(e)
        }
        replaceWith(t) {
            return t instanceof e ? this.native.replaceWith(t.native) : this.native.replaceWith(t), this
        }
        getOuterHeight() {
            let e = getComputedStyle(this.native);
            return this.native.getBoundingClientRect().height + parseFloat(e.marginTop) + parseFloat(e.marginBottom)
        }
        getOuterWidth() {
            let e = getComputedStyle(this.native);
            return this.native.getBoundingClientRect().width + parseFloat(e.marginLeft) + parseFloat(e.marginRight)
        }
        getOffsetWidth() {
            return this.native.offsetWidth
        }
        getOffsetHeight() {
            return this.native.offsetHeight
        }
        getOffsetTop() {
            return this.native.offsetTop
        }
        getOffsetLeft() {
            return this.native.offsetLeft
        }
        getChildren() {
            return new ha(...Array.from(this.native.children).map(t => new e(t)))
        }
        animate(e) {
            return Sn(this.native, e)
        }
        async promiseAnimate(e) {
            return new Promise(t => {
                Sn(this.native, { ...e,
                    onComplete: (n, r) => {
                        e.onComplete ?.(n, r), t()
                    }
                })
            })
        }
        async slideDown(e = 250) {
            this.show().setStyle({
                height: ``,
                overflow: `hidden`,
                marginTop: ``,
                marginBottom: ``,
                paddingTop: ``,
                paddingBottom: ``
            });
            let {
                height: t,
                marginTop: n,
                marginBottom: r,
                paddingTop: i,
                paddingBottom: a
            } = getComputedStyle(this.native);
            this.setStyle({
                height: `0px`,
                marginTop: `0px`,
                marginBottom: `0px`,
                paddingTop: `0px`,
                paddingBottom: `0px`
            }), await this.promiseAnimate({
                height: [0, t],
                marginTop: [0, n],
                marginBottom: [0, r],
                paddingTop: [0, i],
                paddingBottom: [0, a],
                duration: e,
                onComplete: () => {
                    this.setStyle({
                        height: ``,
                        overflow: ``,
                        marginTop: ``,
                        marginBottom: ``
                    })
                }
            })
        }
        async slideUp(e = 250, t) {
            this.show().setStyle({
                overflow: `hidden`,
                height: ``,
                marginTop: ``,
                marginBottom: ``,
                paddingTop: ``,
                paddingBottom: ``
            });
            let {
                height: n,
                marginTop: r,
                marginBottom: i,
                paddingTop: a,
                paddingBottom: o
            } = getComputedStyle(this.native);
            await this.promiseAnimate({
                height: [n, 0],
                marginTop: [r, 0],
                marginBottom: [i, 0],
                paddingTop: [a, 0],
                paddingBottom: [o, 0],
                duration: e,
                onComplete: () => {
                    (t ?.hide ?? !0) && this.hide().setStyle({
                        height: ``,
                        overflow: ``,
                        marginTop: ``,
                        marginBottom: ``,
                        paddingTop: ``,
                        paddingBottom: ``
                    })
                }
            })
        }
        focus(e) {
            return this.native.focus(e), this
        }
        select() {
            this.hasSelectableValue() && this.native.select()
        }
    },
    ha = class e extends Array {
        constructor(...e) {
            super(...e), this.native = e.map(e => e.native)
        }
        remove() {
            for (let e of this) e.remove()
        }
        removeClass(e) {
            for (let t of this) t.removeClass(e);
            return this
        }
        addClass(e) {
            for (let t of this) t.addClass(e);
            return this
        }
        setHtml(e) {
            for (let t of this) t.setHtml(e);
            return this
        }
        disable() {
            for (let e of this) e.disable();
            return this
        }
        enable() {
            for (let e of this) e.enable();
            return this
        }
        hide() {
            for (let e of this) e.hide();
            return this
        }
        show() {
            for (let e of this) e.show();
            return this
        }
        setStyle(e) {
            for (let t of this) t.setStyle(e);
            return this
        }
        setValue(e) {
            for (let t of this) t.setValue(e);
            return this
        }
        qs(t) {
            let n = [];
            for (let e of this) {
                let r = e.native.querySelector(t);
                r && n.push(new ma(r))
            }
            return new e(...n)
        }
        qsa(t) {
            let n = [];
            for (let e of this) {
                let r = Array.from(e.native.querySelectorAll(t));
                for (let e of r) e !== null && n.push(new ma(e))
            }
            return new e(...n)
        }
        on(e, t) {
            for (let n of this) n.on(e, t);
            return this
        }
        setAttribute(e, t) {
            for (let n of this) n.setAttribute(e, t);
            return this
        }
        appendHtml(e) {
            for (let t of this) t.appendHtml(e);
            return this
        }
        indexOf(e) {
            return this.native.indexOf(e.native)
        }
    };

function ga(e, t, n) {
    let r = _a(e),
        i = _a(t);
    if (r && i) {
        let e = r.a ?? 1,
            t = i.a ?? 1,
            a = Math.round(r.r * (1 - n) + i.r * n),
            o = Math.round(r.g * (1 - n) + i.g * n),
            s = Math.round(r.b * (1 - n) + i.b * n),
            c = e * (1 - n) + t * n;
        return r.a !== void 0 || i.a !== void 0 || c !== 1 ? va(a, o, s, c) : va(a, o, s)
    } else return `#ff00ffff`
}

function _a(e) {
    if (e.length !== 4 && e.length !== 5 && e.length !== 7 && e.length !== 9 || !e.startsWith(`#`)) return;
    let t, n, r, i;
    if (e.length === 4) t = Number(`0x${e[1]}${e[1]}`), n = Number(`0x${e[2]}${e[2]}`), r = Number(`0x${e[3]}${e[3]}`);
    else if (e.length === 5) t = Number(`0x${e[1]}${e[1]}`), n = Number(`0x${e[2]}${e[2]}`), r = Number(`0x${e[3]}${e[3]}`), i = Number(`0x${e[4]}${e[4]}`) / 255;
    else if (e.length === 7) t = Number(`0x${e[1]}${e[2]}`), n = Number(`0x${e[3]}${e[4]}`), r = Number(`0x${e[5]}${e[6]}`);
    else if (e.length === 9) t = Number(`0x${e[1]}${e[2]}`), n = Number(`0x${e[3]}${e[4]}`), r = Number(`0x${e[5]}${e[6]}`), i = Number(`0x${e[7]}${e[8]}`) / 255;
    else return;
    let a = {
        r: t,
        g: n,
        b: r
    };
    return i !== void 0 && (a.a = i), a
}

function va(e, t, n, r) {
    let i = Math.round(e).toString(16).padStart(2, `0`),
        a = Math.round(t).toString(16).padStart(2, `0`),
        o = Math.round(n).toString(16).padStart(2, `0`);
    return r === void 0 ? `#${i}${a}${o}` : `#${i}${a}${o}${Math.round(r*255).toString(16).padStart(2,`0`)}`
}

function ya(e) {
    let t, n, r, i;
    e.length === 4 ? (t = `0x${e[1]}${e[1]}`, n = `0x${e[2]}${e[2]}`, r = `0x${e[3]}${e[3]}`) : e.length === 5 ? (t = `0x${e[1]}${e[1]}`, n = `0x${e[2]}${e[2]}`, r = `0x${e[3]}${e[3]}`, i = `0x${e[4]}${e[4]}` / 255) : e.length === 7 ? (t = `0x${e[1]}${e[2]}`, n = `0x${e[3]}${e[4]}`, r = `0x${e[5]}${e[6]}`) : e.length === 9 ? (t = `0x${e[1]}${e[2]}`, n = `0x${e[3]}${e[4]}`, r = `0x${e[5]}${e[6]}`, i = `0x${e[7]}${e[8]}` / 255) : (t = 0, n = 0, r = 0), t /= 255, n /= 255, r /= 255;
    let a = Math.min(t, n, r),
        o = Math.max(t, n, r),
        s = o - a,
        c = 0,
        l = 0,
        u = 0;
    c = s === 0 ? 0 : o === t ? (n - r) / s % 6 : o === n ? (r - t) / s + 2 : (t - n) / s + 4, c = Math.round(c * 60), c < 0 && (c += 360), u = (o + a) / 2, l = s === 0 ? 0 : s / (1 - Math.abs(2 * u - 1)), l = +(l * 100).toFixed(1), u = +(u * 100).toFixed(1);
    let d = {
        hue: c,
        sat: l,
        lgt: u,
        string: i === void 0 ? `hsl(${c}, ${l}%, ${u}%)` : `hsla(${c}, ${l}%, ${u}%, ${i.toFixed(3)})`
    };
    return i !== void 0 && (d.alpha = i), d
}

function ba(e) {
    return ya(e).lgt >= 50
}

function xa(e) {
    return ya(e).lgt < 50
}

function Sa(e) {
    return e * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

function Ca(e) {
    return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `)
}

function wa(e) {
    let t = [``, `thousand`, `million`, `billion`, `trillion`, `quadrillion`, `quintillion`, `sextillion`, `septillion`, `octillion`, `nonillion`, `decillion`],
        n = 0,
        r = e;
    for (; r >= 1e3;) r /= 1e3, n++;
    let i = t[n] ?? `unknown`;
    return {
        rounded: Math.round(r),
        roundedTo2: p(r),
        orderOfMagnitude: i
    }
}

function Ta(e, t = 1) {
    if (e < 1e3) return e.toFixed(t);
    let n = Math.floor(Math.log(e) / Math.log(1e3)),
        r = `kmbtqQsSond`.charAt(n - 1);
    return (e / 1e3 ** n).toFixed(t) + r
}

function Ea(e) {
    let t = 0,
        n = 0,
        r = 0,
        i = 0,
        a = 0,
        o = 0,
        s = 0,
        c = e.length;
    if (c === 0) return null;
    for (let l = 0; l < c; l++) o = l + 1, s = e[l], t += o, n += s, i += o * o, r += o * s, a++;
    let l = (a * r - t * n) / (a * i - t * t),
        u = n / a - l * t / a;
    return [
        [1, 1 * l + u],
        [c, c * l + u]
    ]
}

function Da(e, t = 10) {
    return e == null ? void 0 : parseInt(e, t)
}

function Oa(e, t) {
    return t <= 0 ? 0 : e / 5 / (t / 60)
}

function ka() {
    return Math.floor(Math.random() * 256).toString(2).padStart(8, `0`)
}

function Aa() {
    let e = a(1, 4);
    return Array.from({
        length: e
    }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, `0`)).join(``)
}

function ja(e) {
    let t = {
            a: `.-`,
            b: `-...`,
            c: `-.-.`,
            d: `-..`,
            e: `.`,
            f: `..-.`,
            g: `--.`,
            h: `....`,
            i: `..`,
            j: `.---`,
            k: `-.-`,
            l: `.-..`,
            m: `--`,
            n: `-.`,
            o: `---`,
            p: `.--.`,
            q: `--.-`,
            r: `.-.`,
            s: `...`,
            t: `-`,
            u: `..-`,
            v: `...-`,
            w: `.--`,
            x: `-..-`,
            y: `-.--`,
            z: `--..`,
            0: `-----`,
            1: `.----`,
            2: `..---`,
            3: `...--`,
            4: `....-`,
            5: `.....`,
            6: `-....`,
            7: `--...`,
            8: `---..`,
            9: `----.`,
            ".": `.-.-.-`,
            ",": `--..--`,
            "?": `..--..`,
            "'": `.----.`,
            "/": `-..-.`,
            "(": `-.--.`,
            ")": `-.--.-`,
            "&": `.-...`,
            ":": `---...`,
            ";": `-.-.-.`,
            "=": `-...-`,
            "+": `.-.-.`,
            "-": `-....-`,
            _: `..--.-`,
            '"': `.-..-.`,
            $: `...-..-`,
            "!": `-.-.--`,
            "@": `.--.-.`
        },
        n = ``,
        r = ni(e);
    for (let e = 0; e < r.length; e++) {
        let i = t[r.toLowerCase()[e]];
        n += i === void 0 ? `` : `${i}/`
    }
    return n
}

function Ma() {
    let e = a(1, 7),
        t = ``;
    for (let n = 0; n < e; n++) t += String.fromCharCode(97 + a(0, 25));
    return t
}

function Na() {
    let e = a(1, 10),
        t = ``;
    for (let n = 0; n < e; n++) {
        let e = 33 + a(0, 93);
        t += String.fromCharCode(e)
    }
    return t
}
var Pa = `\`~!@#$%^&*()-_=+{}[]'"/\\|?;:><,.`.split(``);

function Fa() {
    let e = a(1, 7),
        t = ``;
    for (let n = 0; n < e; n++) t += ae(Pa);
    return t
}

function Ia(e) {
    let t = a(1, e),
        n = ``;
    for (let e = 0; e < t; e++) {
        let t;
        t = a(e === 0 ? 1 : 0, 9), n += t.toString()
    }
    return n
}
var La = !1,
    Ra = 0,
    za = 0,
    Ba = 0,
    Va = 3,
    Ha = 0,
    Ua = 0;

function Wa(e) {
    za--;
    let t = Math.round(Math.random()),
        n = Math.round(Math.random() * 5 - .5);
    return e ? (La = !!Math.round(Math.random()), n = La ? 3 : 0) : (La ? (Ba === t ? Ha++ : Ha = 0, (Ha > 1 || Ua > 0 && Ha > 0) && (t = 1 - t, Ha = 0), Ba = t, n = t * (Ra + 1)) : (Va === t ? Ua++ : Ua = 0, (Ua > 1 || Ua > 0 && Ha > 0) && (t = 1 - t, Ua = 0), Va = t, n = 3 - t * (Ra + 1)), La = !La, za < 0 && t === 0 && (Ra = 1 - Ra, za = Math.floor(Math.random() * 3) + 3)), n
}

function Ga(e) {
    let t = [`←`, `↓`, `↑`, `→`],
        n = ``;
    for (let r = 0; r < 4; r++) n += t[Wa(r === 0 && e)];
    return n
}

function Ka(e, t, n, r, i) {
    let o = [],
        s = Math.round(e / t);
    for (let e = 0; e < t; e++) {
        let e = a(0, 2 ** s - 1).toString(n);
        if (r) {
            let t = Math.ceil(s / Math.ceil(Math.log2(n)));
            e = `0`.repeat(Math.max(0, t - e.length)) + e
        }
        o.push(e)
    }
    return o.join(i)
}

function qa(e, t, n, r, i, a) {
    let o = i.split(r).map(e => parseInt(e, n)),
        s = Math.round(e / t),
        c = a;
    for (let e = 0; e < t; e++) c -= s, c < 0 && (-c <= s ? o[e] &= 2 ** s - 1 ^ 2 ** -c - 1 : o[e] = 0);
    return `${o.map(e=>e.toString(n)).join(r)}/${a.toString()}`
}

function Ja() {
    return Ka(32, 4, 10, !1, `.`)
}

function Ya() {
    return Ka(128, 8, 16, !0, `:`)
}

function Xa(e) {
    return e.includes(`:`) ? qa(128, 8, 16, `:`, e, a(16, 32) * 4) : qa(32, 4, 10, `.`, e, a(8, 32))
}

function Za(e) {
    let t = e.split(`/`),
        n = t[0].split(`:`),
        r = ``;
    n = n.map(e => e.replace(/^0+/gm, ``));
    let i = 0,
        a = -1,
        o = -1,
        s = 0,
        c = -1,
        l = -1;
    for (let e = 0; e < n.length; e++) n[e] === `` ? (c === -1 && (c = e), s++) : (l = e - 1, i < s && (i = s, a = c, o = l), s = 0, c = -1, l = -1);
    return i < s && (i = s, a = c, o = n.length - 1), n = n.map((e, t) => e === `` ? t >= a && t <= o && a !== o ? `:` : `0` : e), r = n.join(`:`), r = r.replace(/:{3,}/gm, `::`), t.length > 1 && (r += `/${t[1]}`), r
}
var Qa = class extends Error {
    constructor(e) {
        super(e), this.name = `WordGenError`
    }
};

function $a(e, t) {
    let {
        years: n = 0,
        months: r = 0,
        weeks: i = 0,
        days: a = 0,
        hours: o = 0,
        minutes: s = 0,
        seconds: c = 0
    } = t, l = O(e), u = r || n ? ee(l, r + n * 12) : l, d = a || i ? _(u, a + i * 7) : u, f = (c + (s + o * 60) * 60) * 1e3;
    return y(e, d.getTime() + f)
}

function eo(e) {
    return y(e, Date.now())
}

function to(e, t, n) {
    let r = S(),
        i = n ?.locale ?? r.locale ?? te,
        a = b(e, t);
    if (isNaN(a)) throw RangeError(`Invalid time value`);
    let o = Object.assign({}, n, {
            addSuffix: n ?.addSuffix,
            comparison: a
        }),
        s, c;
    a > 0 ? (s = O(t), c = O(e)) : (s = O(e), c = O(t));
    let l = k(c, s),
        u = (g(c) - g(s)) / 1e3,
        d = Math.round((l - u) / 60),
        f;
    if (d < 2) return n ?.includeSeconds ? l < 5 ? i.formatDistance(`lessThanXSeconds`, 5, o) : l < 10 ? i.formatDistance(`lessThanXSeconds`, 10, o) : l < 20 ? i.formatDistance(`lessThanXSeconds`, 20, o) : l < 40 ? i.formatDistance(`halfAMinute`, 0, o) : l < 60 ? i.formatDistance(`lessThanXMinutes`, 1, o) : i.formatDistance(`xMinutes`, 1, o) : d === 0 ? i.formatDistance(`lessThanXMinutes`, 1, o) : i.formatDistance(`xMinutes`, d, o);
    if (d < 45) return i.formatDistance(`xMinutes`, d, o);
    if (d < 90) return i.formatDistance(`aboutXHours`, 1, o);
    if (d < 1440) {
        let e = Math.round(d / 60);
        return i.formatDistance(`aboutXHours`, e, o)
    } else if (d < 2520) return i.formatDistance(`xDays`, 1, o);
    else if (d < 43200) {
        let e = Math.round(d / T);
        return i.formatDistance(`xDays`, e, o)
    } else if (d < 43200 * 2) return f = Math.round(d / v), i.formatDistance(`aboutXMonths`, f, o);
    if (f = w(c, s), f < 12) {
        let e = Math.round(d / v);
        return i.formatDistance(`xMonths`, e, o)
    } else {
        let e = f % 12,
            t = Math.trunc(f / 12);
        return e < 3 ? i.formatDistance(`aboutXYears`, t, o) : e < 9 ? i.formatDistance(`overXYears`, t, o) : i.formatDistance(`almostXYears`, t + 1, o)
    }
}

function no(e, t) {
    return to(e, eo(e), t)
}
var ro = [`years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`];

function io(e, t) {
    let n = S(),
        r = t ?.locale ?? n.locale ?? te,
        i = t ?.format ?? ro,
        a = t ?.zero ?? !1,
        o = t ?.delimiter ?? ` `;
    return r.formatDistance ? i.reduce((t, n) => {
        let i = `x${n.replace(/(^.)/,e=>e.toUpperCase())}`,
            o = e[n];
        return o !== void 0 && (a || e[n]) ? t.concat(r.formatDistance(i, o)) : t
    }, []).join(o) : ``
}

function ao(e) {
    let t = O(e.start),
        n = O(e.end),
        r = {},
        i = C(n, t);
    i && (r.years = i);
    let a = $a(t, {
            years: r.years
        }),
        o = w(n, a);
    o && (r.months = o);
    let s = $a(a, {
            months: r.months
        }),
        c = E(n, s);
    c && (r.days = c);
    let l = $a(s, {
            days: r.days
        }),
        u = D(n, l);
    u && (r.hours = u);
    let d = $a(l, {
            hours: r.hours
        }),
        f = x(n, d);
    f && (r.minutes = f);
    let p = k(n, $a(d, {
        minutes: r.minutes
    }));
    return p && (r.seconds = p), r
}

function oo(e, t = !1, n = !1, r = `:`, i = !0, a = !1) {
    e = Math.abs(e);
    let o = 0,
        s;
    a ? (o = Math.floor(e / 86400), s = Math.floor(e % 86400 / 3600)) : s = Math.floor(e / 3600);
    let c = Math.floor(e % 3600 / 60),
        l = p(e % 3600 % 60),
        u, d, f, m;
    a && (u = o < 10 && r !== `text` ? `0${o}` : o), d = s < 10 && r !== `text` ? `0${s}` : s, f = c < 10 && r !== `text` ? `0${c}` : c, m = l < 10 && (c > 0 || s > 0 || t) && r !== `text` ? `0${l}` : l;
    let h = ``;
    return o > 0 && a && (h += u, r === `text` ? o === 1 ? h += ` day ` : h += ` days ` : h += r), (s > 0 || n) && (h += d, r === `text` ? s === 1 ? h += ` hour ` : h += ` hours ` : h += r), (c > 0 || s > 0 || t) && (h += f, r === `text` ? c === 1 ? h += ` minute ` : h += ` minutes ` : i && (h += r)), i && (h += m, r === `text` && (l === 1 ? h += ` second` : h += ` seconds`)), s === 0 && c === 0 && !i && r === `text` && (h = `less than 1 minute`), h.trim()
}
var so = {
    af: 0,
    ar: 6,
    arDZ: 0,
    arEG: 0,
    arMA: 1,
    arSA: 0,
    arTN: 1,
    az: 1,
    be: 1,
    beTarask: 1,
    bg: 1,
    bn: 0,
    bs: 1,
    ca: 1,
    ckb: 0,
    cs: 1,
    cy: 0,
    da: 1,
    de: 1,
    deAT: 1,
    el: 1,
    enAU: 1,
    enCA: 0,
    enGB: 1,
    enIE: 1,
    enIN: 1,
    enNZ: 1,
    enUS: 0,
    enZA: 0,
    eo: 1,
    es: 1,
    et: 1,
    eu: 1,
    faIR: 6,
    fi: 1,
    fr: 1,
    frCA: 0,
    frCH: 1,
    fy: 1,
    gd: 0,
    gl: 1,
    gu: 1,
    he: 0,
    hi: 0,
    hr: 1,
    ht: 1,
    hu: 1,
    hy: 1,
    id: 1,
    is: 1,
    it: 1,
    itCH: 1,
    ja: 0,
    jaHira: 0,
    ka: 1,
    kk: 1,
    km: 0,
    kn: 1,
    ko: 0,
    lb: 1,
    lt: 1,
    lv: 1,
    mk: 1,
    mn: 1,
    ms: 1,
    mt: 1,
    nb: 1,
    nl: 1,
    nlBE: 1,
    nn: 1,
    oc: 1,
    pl: 1,
    pt: 1,
    ptBR: 0,
    ro: 1,
    ru: 1,
    se: 1,
    sk: 1,
    sl: 1,
    sq: 1,
    sr: 1,
    srLatn: 1,
    sv: 1,
    ta: 1,
    te: 0,
    th: 0,
    tr: 1,
    ug: 0,
    uk: 1,
    uz: 1,
    uzCyrl: 1,
    vi: 1,
    zhCN: 1,
    zhHK: 0,
    zhTW: 1
};

function co() {
    if (navigator.language === void 0 || navigator.language === null) return 0;
    let e = new Intl.Locale(navigator.language);
    if (e == null) return 0;
    if (`weekInfo` in e) return e.weekInfo.firstDay % 7;
    if (`getWeekInfo` in e) return e.getWeekInfo().firstDay % 7;
    let t = so[navigator.language.replaceAll(`-`, ``)];
    return t !== void 0 || (t = so[navigator.language.split(`-`)[0]], t !== void 0) ? t : 0
}

function lo(e, t) {
    if (e === void 0) return ``;
    let n = ``,
        r = ao({
            start: e,
            end: Date.now()
        });
    return n = t === void 0 || t === `full` ? io(r, {
        format: [`years`, `months`, `days`, `hours`, `minutes`]
    }) : no(e), n === `` ? `less than a minute` : n
}
var uo = class extends Error {
        constructor(e, t) {
            super(e), this.name = `SnapshotInitError`, this.responseCode = t
        }
    },
    fo = (e, t) => t.some(t => e instanceof t),
    po, mo;

function ho() {
    return po ||= [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]
}

function go() {
    return mo ||= [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]
}
var _o = new WeakMap,
    vo = new WeakMap,
    yo = new WeakMap;

function bo(e) {
    let t = new Promise((t, n) => {
        let r = () => {
                e.removeEventListener(`success`, i), e.removeEventListener(`error`, a)
            },
            i = () => {
                t(Eo(e.result)), r()
            },
            a = () => {
                n(e.error), r()
            };
        e.addEventListener(`success`, i), e.addEventListener(`error`, a)
    });
    return yo.set(t, e), t
}

function xo(e) {
    if (_o.has(e)) return;
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
    _o.set(e, t)
}
var So = {
    get(e, t, n) {
        if (e instanceof IDBTransaction) {
            if (t === `done`) return _o.get(e);
            if (t === `store`) return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0])
        }
        return Eo(e[t])
    },
    set(e, t, n) {
        return e[t] = n, !0
    },
    has(e, t) {
        return e instanceof IDBTransaction && (t === `done` || t === `store`) ? !0 : t in e
    }
};

function Co(e) {
    So = e(So)
}

function wo(e) {
    return go().includes(e) ? function(...t) {
        return e.apply(Do(this), t), Eo(this.request)
    } : function(...t) {
        return Eo(e.apply(Do(this), t))
    }
}

function To(e) {
    return typeof e == `function` ? wo(e) : (e instanceof IDBTransaction && xo(e), fo(e, ho()) ? new Proxy(e, So) : e)
}

function Eo(e) {
    if (e instanceof IDBRequest) return bo(e);
    if (vo.has(e)) return vo.get(e);
    let t = To(e);
    return t !== e && (vo.set(e, t), yo.set(t, e)), t
}
var Do = e => yo.get(e);

function Oo(e, t, {
    blocked: n,
    upgrade: r,
    blocking: i,
    terminated: a
} = {}) {
    let o = indexedDB.open(e, t),
        s = Eo(o);
    return r && o.addEventListener(`upgradeneeded`, e => {
        r(Eo(o.result), e.oldVersion, e.newVersion, Eo(o.transaction), e)
    }), n && o.addEventListener(`blocked`, e => n(e.oldVersion, e.newVersion, e)), s.then(e => {
        a && e.addEventListener(`close`, () => a()), i && e.addEventListener(`versionchange`, e => i(e.oldVersion, e.newVersion, e))
    }).catch(() => {}), s
}
var ko = [`get`, `getKey`, `getAll`, `getAllKeys`, `count`],
    Ao = [`put`, `add`, `delete`, `clear`],
    jo = new Map;

function Mo(e, t) {
    if (!(e instanceof IDBDatabase && !(t in e) && typeof t == `string`)) return;
    if (jo.get(t)) return jo.get(t);
    let n = t.replace(/FromIndex$/, ``),
        r = t !== n,
        i = Ao.includes(n);
    if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || ko.includes(n))) return;
    let a = async function(e, ...t) {
        let a = this.transaction(e, i ? `readwrite` : `readonly`),
            o = a.store;
        return r && (o = o.index(t.shift())), (await Promise.all([o[n](...t), i && a.done]))[0]
    };
    return jo.set(t, a), a
}
Co(e => ({ ...e,
    get: (t, n, r) => Mo(t, n) || e.get(t, n, r),
    has: (t, n) => !!Mo(t, n) || e.has(t, n)
}));
var No = [`continue`, `continuePrimaryKey`, `advance`],
    Po = {},
    Fo = new WeakMap,
    Io = new WeakMap,
    Lo = {
        get(e, t) {
            if (!No.includes(t)) return e[t];
            let n = Po[t];
            return n ||= Po[t] = function(...e) {
                Fo.set(this, Io.get(this)[t](...e))
            }, n
        }
    };
async function* Ro(...e) {
    let t = this;
    if (t instanceof IDBCursor || (t = await t.openCursor(...e)), !t) return;
    t = t;
    let n = new Proxy(t, Lo);
    for (Io.set(n, t), yo.set(n, Do(t)); t;) yield n, t = await (Fo.get(n) || t.continue()), Fo.delete(n)
}

function zo(e, t) {
    return t === Symbol.asyncIterator && fo(e, [IDBIndex, IDBObjectStore, IDBCursor]) || t === `iterate` && fo(e, [IDBIndex, IDBObjectStore])
}
Co(e => ({ ...e,
    get(t, n, r) {
        return zo(t, n) ? Ro : e.get(t, n, r)
    },
    has(t, n) {
        return zo(t, n) || e.has(t, n)
    }
}));
var Bo = new class {
        constructor(e = `file-storage-db`) {
            this.signals = new Map, this.dbPromise = Oo(e, 1, {
                upgrade(e) {
                    e.objectStoreNames.contains(`files`) || e.createObjectStore(`files`)
                }
            })
        }
        getSignal(e) {
            let t = this.signals.get(e);
            return t || (t = h(0), this.signals.set(e, t)), t
        }
        notify(e) {
            let t = this.signals.get(e);
            t && t[1](e => e + 1)
        }
        track(e) {
            return this.getSignal(e)[0]()
        }
        async storeFile(e, t) {
            await (await this.dbPromise).put(`files`, t, e), this.notify(e)
        }
        async getFile(e) {
            return (await this.dbPromise).get(`files`, e)
        }
        async deleteFile(e) {
            await (await this.dbPromise).delete(`files`, e), this.notify(e)
        }
        async listFilenames() {
            return (await this.dbPromise).getAllKeys(`files`)
        }
        async hasFile(e) {
            return await this.getFile(e) !== void 0
        }
    },
    Vo = new Map;

function Ho(e, t = !0) {
    let n = document.getElementById(e) ?? void 0;
    if (n === void 0) throw Error(`Element with id ${e} not found`);
    Vo.set(e, n), t && Uo(e)
}

function Uo(e) {
    let t = Vo.get(e);
    t ? t.remove() : Ho(e, !0)
}
var Wo = {
    popups: document.getElementById(`popups`),
    main: document.querySelector(`main`)
};

function Go(e, t) {
    let n = Vo.get(e);
    n === void 0 && console.error(`Skeleton with id ${e} not found`), Wo[t].append(n)
}

function Ko(e) {
    return Vo.has(e)
}
var qo = 125,
    Jo = .75,
    Yo = class {
        constructor(e) {
            this.open = !1, this.setupRan = !1, e.dialogId.startsWith(`#`) && (e.dialogId = e.dialogId.slice(1)), this.skeletonAppendParent = e.appendTo ?? `popups`, Ko(e.dialogId) && Go(e.dialogId, this.skeletonAppendParent);
            let t = da(`#${e.dialogId}`),
                n = da(`#${e.dialogId} > .modal`);
            if (t === null) throw Error(`Dialog element with id ${e.dialogId} not found`);
            if (!(t.native instanceof HTMLDialogElement)) throw Error(`Animated dialog must be an HTMLDialogElement`);
            if (t === null) throw Error(`Dialog element with id ${e.dialogId} not found`);
            if (n === null) throw Error(`Div element inside #${e.dialogId} with class 'modal' not found`);
            this.dialogId = e.dialogId, this.storeId = e.storeId, this.wrapperEl = t, this.modalEl = n, this.customShowAnimations = e.customAnimations ?.show, this.customHideAnimations = e.customAnimations ?.hide, this.previousModalInChain = void 0, this.showOptionsWhenInChain = e.showOptionsWhenInChain, this.customEscapeHandler = e ?.customEscapeHandler, this.customWrapperClickHandler = e ?.customWrapperClickHandler, this.setup = e ?.setup, this.cleanup = e ?.cleanup, Ho(this.dialogId)
        }
        getPreviousModalInChain() {
            return this.previousModalInChain
        }
        async runSetup() {
            this.wrapperEl.on(`keydown`, async e => {
                e.key === `Escape` && zn(this.dialogId) && (e.preventDefault(), e.stopPropagation(), this.customEscapeHandler === void 0 ? this.storeId !== void 0 && Rr(this.storeId) ? (this.wrapperEl.setStyle({
                    pointerEvents: `none`
                }), Fr(this.storeId)) : await this.hide() : (this.customEscapeHandler(e), this.cleanup ?.()))
            }), this.wrapperEl.on(`mousedown`, async e => {
                e.target === this.wrapperEl.native && (this.customWrapperClickHandler === void 0 ? this.storeId !== void 0 && Rr(this.storeId) ? Fr(this.storeId) : await this.hide() : (this.customWrapperClickHandler(e), this.cleanup ?.()))
            }), this.setup !== void 0 && await this.setup(this.modalEl)
        }
        getDialogId() {
            return this.dialogId
        }
        getWrapper() {
            return this.wrapperEl
        }
        getModal() {
            return this.modalEl
        }
        isOpen() {
            return this.open
        }
        focusFirstInput(e) {
            let t = this.modalEl.qsa(`input:not(.hidden)`)[0];
            t == null ? this.wrapperEl.focus() : e === !0 ? t.focus() : e === `focusAndSelect` ? (t.focus(), t.select()) : this.wrapperEl.focus()
        }
        async show(e) {
            return new Promise(async t => {
                if (this.open) {
                    t();
                    return
                }
                if (Go(this.dialogId, this.skeletonAppendParent), this.setupRan ||= (await this.runSetup(), !0), zn(this.dialogId)) {
                    t();
                    return
                }
                let n = this.storeId !== void 0 && zr(this.storeId),
                    r = Zn((e ?.customAnimation ?.modal ?.duration ?? e ?.animationDurationMs ?? this.customShowAnimations ?.modal ?.duration ?? qo) * (e ?.modalChain !== void 0 || n ? Jo : 1));
                e ?.modalChain !== void 0 && (this.previousModalInChain = e.modalChain, await this.previousModalInChain.hide({
                    animationMode: `modalOnly`,
                    animationDurationMs: r,
                    dontShowPreviousModalInchain: e.modalChain.previousModalInChain !== void 0
                })), this.open = !0, e ?.mode === `dialog` ? this.wrapperEl.show() : (e ?.mode === `modal` || e ?.mode === void 0) && this.wrapperEl.native.showModal(), await e ?.beforeAnimation ?.(this.modalEl, e ?.modalChainData), setTimeout(async () => {
                    this.focusFirstInput(e ?.focusFirstInput)
                }, 1);
                let i = (e ?.customAnimation ?.modal ?? this.customHideAnimations ?.modal) !== void 0,
                    a = e ?.customAnimation ?.modal ?? this.customShowAnimations ?.modal ?? {
                        opacity: [0, 1],
                        marginTop: [`1rem`, 0]
                    },
                    o = e ?.customAnimation ?.wrapper ?? this.customShowAnimations ?.wrapper ?? {
                        opacity: [0, 1]
                    },
                    s = Zn(e ?.customAnimation ?.wrapper ?.duration ?? this.customShowAnimations ?.wrapper ?.duration ?? qo),
                    c = this.previousModalInChain !== void 0 || n ? `modalOnly` : e ?.animationMode ?? `both`;
                c === `both` || c === `none` ? (i ? this.modalEl.animate({ ...a,
                    duration: c === `none` ? 0 : r
                }) : this.modalEl.setStyle({
                    opacity: `1`
                }), this.wrapperEl.animate({ ...o,
                    duration: c === `none` ? 0 : s,
                    onBegin: () => {
                        this.wrapperEl.show()
                    },
                    onComplete: async () => {
                        this.focusFirstInput(e ?.focusFirstInput), await e ?.afterAnimation ?.(this.modalEl, e ?.modalChainData), t()
                    }
                })) : c === `modalOnly` && (this.wrapperEl.show().setStyle({
                    opacity: `1`
                }), this.modalEl.animate({ ...a,
                    duration: r,
                    onComplete: async () => {
                        this.focusFirstInput(e ?.focusFirstInput), await e ?.afterAnimation ?.(this.modalEl, e ?.modalChainData), t()
                    }
                }))
            })
        }
        async hide(e) {
            return new Promise(async t => {
                if (!zn(this.dialogId)) {
                    t();
                    return
                }
                e ?.clearModalChain && (this.previousModalInChain = void 0), await e ?.beforeAnimation ?.(this.modalEl);
                let n = (e ?.customAnimation ?.modal ?? this.customHideAnimations ?.modal) !== void 0,
                    r = e ?.customAnimation ?.modal ?? this.customHideAnimations ?.modal ?? {
                        opacity: [1, 0],
                        marginTop: [0, `1rem`]
                    },
                    i = Zn((e ?.customAnimation ?.modal ?.duration ?? e ?.animationDurationMs ?? this.customHideAnimations ?.modal ?.duration ?? qo) * (this.previousModalInChain === void 0 ? 1 : Jo)),
                    a = e ?.customAnimation ?.wrapper ?? this.customHideAnimations ?.wrapper ?? {
                        opacity: [1, 0]
                    },
                    o = Zn(e ?.customAnimation ?.wrapper ?.duration ?? this.customHideAnimations ?.wrapper ?.duration ?? qo),
                    s = this.storeId !== void 0 && zr(this.storeId),
                    c = this.previousModalInChain !== void 0 || s ? `modalOnly` : e ?.animationMode ?? `both`;
                c === `both` || c === `none` ? (n ? this.modalEl.animate({ ...r,
                    duration: c === `none` ? 0 : i
                }) : this.modalEl.setStyle({
                    opacity: `1`
                }), this.wrapperEl.animate({ ...a,
                    duration: c === `none` ? 0 : o,
                    onComplete: async () => {
                        this.wrapperEl.native.close(), this.wrapperEl.hide(), Uo(this.dialogId), this.open = !1, await e ?.afterAnimation ?.(this.modalEl), this.cleanup ?.(), this.storeId !== void 0 && Fr(this.storeId), this.previousModalInChain !== void 0 && !e ?.dontShowPreviousModalInchain && (await this.previousModalInChain.show({
                            animationMode: `modalOnly`,
                            modalChainData: e ?.modalChainData,
                            animationDurationMs: i * Jo,
                            ...this.previousModalInChain.showOptionsWhenInChain
                        }), this.previousModalInChain = void 0), t()
                    }
                })) : c === `modalOnly` && (this.wrapperEl.show().setStyle({
                    opacity: `1`
                }), this.modalEl.animate({ ...r,
                    duration: i,
                    onComplete: async () => {
                        this.wrapperEl.native.close(), this.wrapperEl.hide().setStyle({
                            opacity: `0`
                        }), Uo(this.dialogId), this.open = !1, await e ?.afterAnimation ?.(this.modalEl), this.cleanup ?.(), this.storeId !== void 0 && Fr(this.storeId), this.previousModalInChain !== void 0 && !e ?.dontShowPreviousModalInchain && (await this.previousModalInChain.show({
                            animationMode: `modalOnly`,
                            modalChainData: e ?.modalChainData,
                            animationDurationMs: i * Jo,
                            ...this.previousModalInChain.showOptionsWhenInChain
                        }), this.previousModalInChain = void 0), t()
                    }
                }))
            })
        }
        destroy() {
            this.wrapperEl.native.close(), this.wrapperEl.hide(), this.cleanup ?.(), Uo(this.dialogId), this.open = !1
        }
    },
    Xo = console.log,
    Zo = console.warn,
    Qo = console.error,
    $o = new Or({
        key: `debugLogs`,
        schema: o.boolean(),
        fallback: !1
    }),
    es = $o.get();
jr() ? es = !1 : wn() && (es = !0, as(`Debug logs automatically enabled on localhost`));

function ts() {
    es = !es, ns(`Debug logs ${es?`enabled`:`disabled`}`), $o.set(es)
}

function ns(...e) {
    Xo(`%cINFO`, `background:#4CAF50;color: #111;padding:0 5px;border-radius:10px`, ...e)
}

function rs(...e) {
    Zo(`%cWRN`, `background:#FFC107;color: #111;padding:0 5px;border-radius:10px`, ...e)
}

function is(...e) {
    Qo(`%cERR`, `background:#F44336;color: #111;padding:0 5px;border-radius:10px`, ...e)
}

function as(...e) {
    es && Xo(`%cDEBG`, `background:#2196F3;color: #111;padding:0 5px;border-radius:10px`, ...e)
}
console.log = ns, console.warn = rs, console.error = is, console.debug = as;
var os = new Or({
    key: `lastSeenVersion`,
    schema: o.string(),
    fallback: ``
});

function ss() {
    `caches` in window && caches.keys().then(function(e) {
        for (let t of e) caches.delete(t)
    })
}
async function cs() {
    if (wn()) return null;
    let {
        data: e,
        error: t
    } = await d(qi());
    if (t) {
        let e = dr(t, `Failed to fetch version number from GitHub`);
        return console.error(e), null
    }
    let n = os.get(),
        r = n === `` ? !1 : n !== e;
    return (r || n === ``) && (os.set(e), ss()), {
        text: e,
        isNew: r
    }
}
var ls = (e, t) => {
        let n = Array(e.length + t.length);
        for (let t = 0; t < e.length; t++) n[t] = e[t];
        for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
        return n
    },
    us = (e, t) => ({
        classGroupId: e,
        validator: t
    }),
    ds = (e = new Map, t = null, n) => ({
        nextPart: e,
        validators: t,
        classGroupId: n
    }),
    fs = `-`,
    ps = [],
    ms = `arbitrary..`,
    hs = e => {
        let t = vs(e),
            {
                conflictingClassGroups: n,
                conflictingClassGroupModifiers: r
            } = e;
        return {
            getClassGroupId: e => {
                if (e.startsWith(`[`) && e.endsWith(`]`)) return _s(e);
                let n = e.split(fs);
                return gs(n, n[0] === `` && n.length > 1 ? 1 : 0, t)
            },
            getConflictingClassGroupIds: (e, t) => {
                if (t) {
                    let t = r[e],
                        i = n[e];
                    return t ? i ? ls(i, t) : t : i || ps
                }
                return n[e] || ps
            }
        }
    },
    gs = (e, t, n) => {
        if (e.length - t === 0) return n.classGroupId;
        let r = e[t],
            i = n.nextPart.get(r);
        if (i) {
            let n = gs(e, t + 1, i);
            if (n) return n
        }
        let a = n.validators;
        if (a === null) return;
        let o = t === 0 ? e.join(fs) : e.slice(t).join(fs),
            s = a.length;
        for (let e = 0; e < s; e++) {
            let t = a[e];
            if (t.validator(o)) return t.classGroupId
        }
    },
    _s = e => e.slice(1, -1).indexOf(`:`) === -1 ? void 0 : (() => {
        let t = e.slice(1, -1),
            n = t.indexOf(`:`),
            r = t.slice(0, n);
        return r ? ms + r : void 0
    })(),
    vs = e => {
        let {
            theme: t,
            classGroups: n
        } = e;
        return ys(n, t)
    },
    ys = (e, t) => {
        let n = ds();
        for (let r in e) {
            let i = e[r];
            bs(i, n, r, t)
        }
        return n
    },
    bs = (e, t, n, r) => {
        let i = e.length;
        for (let a = 0; a < i; a++) {
            let i = e[a];
            xs(i, t, n, r)
        }
    },
    xs = (e, t, n, r) => {
        if (typeof e == `string`) {
            Ss(e, t, n);
            return
        }
        if (typeof e == `function`) {
            Cs(e, t, n, r);
            return
        }
        ws(e, t, n, r)
    },
    Ss = (e, t, n) => {
        let r = e === `` ? t : Ts(t, e);
        r.classGroupId = n
    },
    Cs = (e, t, n, r) => {
        if (Es(e)) {
            bs(e(r), t, n, r);
            return
        }
        t.validators === null && (t.validators = []), t.validators.push(us(n, e))
    },
    ws = (e, t, n, r) => {
        let i = Object.entries(e),
            a = i.length;
        for (let e = 0; e < a; e++) {
            let [a, o] = i[e];
            bs(o, Ts(t, a), n, r)
        }
    },
    Ts = (e, t) => {
        let n = e,
            r = t.split(fs),
            i = r.length;
        for (let e = 0; e < i; e++) {
            let t = r[e],
                i = n.nextPart.get(t);
            i || (i = ds(), n.nextPart.set(t, i)), n = i
        }
        return n
    },
    Es = e => `isThemeGetter` in e && e.isThemeGetter === !0,
    Ds = e => {
        if (e < 1) return {
            get: () => void 0,
            set: () => {}
        };
        let t = 0,
            n = Object.create(null),
            r = Object.create(null),
            i = (i, a) => {
                n[i] = a, t++, t > e && (t = 0, r = n, n = Object.create(null))
            };
        return {
            get(e) {
                let t = n[e];
                if (t !== void 0) return t;
                if ((t = r[e]) !== void 0) return i(e, t), t
            },
            set(e, t) {
                e in n ? n[e] = t : i(e, t)
            }
        }
    },
    Os = `!`,
    ks = `:`,
    As = [],
    js = (e, t, n, r, i) => ({
        modifiers: e,
        hasImportantModifier: t,
        baseClassName: n,
        maybePostfixModifierPosition: r,
        isExternal: i
    }),
    Ms = e => {
        let {
            prefix: t,
            experimentalParseClassName: n
        } = e, r = e => {
            let t = [],
                n = 0,
                r = 0,
                i = 0,
                a, o = e.length;
            for (let s = 0; s < o; s++) {
                let o = e[s];
                if (n === 0 && r === 0) {
                    if (o === ks) {
                        t.push(e.slice(i, s)), i = s + 1;
                        continue
                    }
                    if (o === `/`) {
                        a = s;
                        continue
                    }
                }
                o === `[` ? n++ : o === `]` ? n-- : o === `(` ? r++ : o === `)` && r--
            }
            let s = t.length === 0 ? e : e.slice(i),
                c = s,
                l = !1;
            s.endsWith(Os) ? (c = s.slice(0, -1), l = !0) : s.startsWith(Os) && (c = s.slice(1), l = !0);
            let u = a && a > i ? a - i : void 0;
            return js(t, l, c, u)
        };
        if (t) {
            let e = t + ks,
                n = r;
            r = t => t.startsWith(e) ? n(t.slice(e.length)) : js(As, !1, t, void 0, !0)
        }
        if (n) {
            let e = r;
            r = t => n({
                className: t,
                parseClassName: e
            })
        }
        return r
    },
    Ns = e => {
        let t = new Map;
        return e.orderSensitiveModifiers.forEach((e, n) => {
            t.set(e, 1e6 + n)
        }), e => {
            let n = [],
                r = [];
            for (let i = 0; i < e.length; i++) {
                let a = e[i],
                    o = a[0] === `[`,
                    s = t.has(a);
                o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a)
            }
            return r.length > 0 && (r.sort(), n.push(...r)), n
        }
    },
    Ps = e => ({
        cache: Ds(e.cacheSize),
        parseClassName: Ms(e),
        sortModifiers: Ns(e),
        postfixLookupClassGroupIds: Fs(e),
        ...hs(e)
    }),
    Fs = e => {
        let t = Object.create(null),
            n = e.postfixLookupClassGroups;
        if (n)
            for (let e = 0; e < n.length; e++) t[n[e]] = !0;
        return t
    },
    Is = /\s+/,
    Ls = (e, t) => {
        let {
            parseClassName: n,
            getClassGroupId: r,
            getConflictingClassGroupIds: i,
            sortModifiers: a,
            postfixLookupClassGroupIds: o
        } = t, s = [], c = e.trim().split(Is), l = ``;
        for (let e = c.length - 1; e >= 0; --e) {
            let t = c[e],
                {
                    isExternal: u,
                    modifiers: d,
                    hasImportantModifier: f,
                    baseClassName: p,
                    maybePostfixModifierPosition: m
                } = n(t);
            if (u) {
                l = t + (l.length > 0 ? ` ` + l : l);
                continue
            }
            let h = !!m,
                g;
            if (h) {
                g = r(p.substring(0, m));
                let e = g && o[g] ? r(p) : void 0;
                e && e !== g && (g = e, h = !1)
            } else g = r(p);
            if (!g) {
                if (!h) {
                    l = t + (l.length > 0 ? ` ` + l : l);
                    continue
                }
                if (g = r(p), !g) {
                    l = t + (l.length > 0 ? ` ` + l : l);
                    continue
                }
                h = !1
            }
            let _ = d.length === 0 ? `` : d.length === 1 ? d[0] : a(d).join(`:`),
                v = f ? _ + Os : _,
                y = v + g;
            if (s.indexOf(y) > -1) continue;
            s.push(y);
            let b = i(g, h);
            for (let e = 0; e < b.length; ++e) {
                let t = b[e];
                s.push(v + t)
            }
            l = t + (l.length > 0 ? ` ` + l : l)
        }
        return l
    },
    Rs = (...e) => {
        let t = 0,
            n, r, i = ``;
        for (; t < e.length;)(n = e[t++]) && (r = zs(n)) && (i && (i += ` `), i += r);
        return i
    },
    zs = e => {
        if (typeof e == `string`) return e;
        let t, n = ``;
        for (let r = 0; r < e.length; r++) e[r] && (t = zs(e[r])) && (n && (n += ` `), n += t);
        return n
    },
    Bs = (e, ...t) => {
        let n, r, i, a, o = o => (n = Ps(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o)),
            s = e => {
                let t = r(e);
                if (t) return t;
                let a = Ls(e, n);
                return i(e, a), a
            };
        return a = o, (...e) => a(Rs(...e))
    },
    Vs = [],
    X = e => {
        let t = t => t[e] || Vs;
        return t.isThemeGetter = !0, t
    },
    Hs = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
    Us = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
    Ws = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
    Gs = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
    Ks = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
    qs = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
    Js = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
    Ys = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
    Xs = e => Ws.test(e),
    Z = e => !!e && !Number.isNaN(Number(e)),
    Zs = e => !!e && Number.isInteger(Number(e)),
    Qs = e => e.endsWith(`%`) && Z(e.slice(0, -1)),
    $s = e => Gs.test(e),
    ec = () => !0,
    tc = e => Ks.test(e) && !qs.test(e),
    nc = () => !1,
    rc = e => Js.test(e),
    ic = e => Ys.test(e),
    ac = e => !Q(e) && !$(e),
    oc = e => e.startsWith(`@container`) && (e[10] === `/` && e[11] !== void 0 || e[11] === `s` && e[16] !== void 0 && e.startsWith(`-size/`, 10) || e[11] === `n` && e[18] !== void 0 && e.startsWith(`-normal/`, 10)),
    sc = e => Sc(e, Ec, nc),
    Q = e => Hs.test(e),
    cc = e => Sc(e, Dc, tc),
    lc = e => Sc(e, Oc, Z),
    uc = e => Sc(e, Ac, ec),
    dc = e => Sc(e, kc, nc),
    fc = e => Sc(e, wc, nc),
    pc = e => Sc(e, Tc, ic),
    mc = e => Sc(e, jc, rc),
    $ = e => Us.test(e),
    hc = e => Cc(e, Dc),
    gc = e => Cc(e, kc),
    _c = e => Cc(e, wc),
    vc = e => Cc(e, Ec),
    yc = e => Cc(e, Tc),
    bc = e => Cc(e, jc, !0),
    xc = e => Cc(e, Ac, !0),
    Sc = (e, t, n) => {
        let r = Hs.exec(e);
        return r ? r[1] ? t(r[1]) : n(r[2]) : !1
    },
    Cc = (e, t, n = !1) => {
        let r = Us.exec(e);
        return r ? r[1] ? t(r[1]) : n : !1
    },
    wc = e => e === `position` || e === `percentage`,
    Tc = e => e === `image` || e === `url`,
    Ec = e => e === `length` || e === `size` || e === `bg-size`,
    Dc = e => e === `length`,
    Oc = e => e === `number`,
    kc = e => e === `family-name`,
    Ac = e => e === `number` || e === `weight`,
    jc = e => e === `shadow`,
    Mc = Bs(() => {
        let e = X(`color`),
            t = X(`font`),
            n = X(`text`),
            r = X(`font-weight`),
            i = X(`tracking`),
            a = X(`leading`),
            o = X(`breakpoint`),
            s = X(`container`),
            c = X(`spacing`),
            l = X(`radius`),
            u = X(`shadow`),
            d = X(`inset-shadow`),
            f = X(`text-shadow`),
            p = X(`drop-shadow`),
            m = X(`blur`),
            h = X(`perspective`),
            g = X(`aspect`),
            _ = X(`ease`),
            v = X(`animate`),
            y = () => [`auto`, `avoid`, `all`, `avoid-page`, `page`, `left`, `right`, `column`],
            b = () => [`center`, `top`, `bottom`, `left`, `right`, `top-left`, `left-top`, `top-right`, `right-top`, `bottom-right`, `right-bottom`, `bottom-left`, `left-bottom`],
            x = () => [...b(), $, Q],
            S = () => [`auto`, `hidden`, `clip`, `visible`, `scroll`],
            C = () => [`auto`, `contain`, `none`],
            w = () => [$, Q, c],
            T = () => [Xs, `full`, `auto`, ...w()],
            ee = () => [Zs, `none`, `subgrid`, $, Q],
            te = () => [`auto`, {
                span: [`full`, Zs, $, Q]
            }, Zs, $, Q],
            E = () => [Zs, `auto`, $, Q],
            D = () => [`auto`, `min`, `max`, `fr`, $, Q],
            O = () => [`start`, `end`, `center`, `between`, `around`, `evenly`, `stretch`, `baseline`, `center-safe`, `end-safe`],
            k = () => [`start`, `end`, `center`, `stretch`, `center-safe`, `end-safe`],
            A = () => [`auto`, ...w()],
            ne = () => [Xs, `auto`, `full`, `dvw`, `dvh`, `lvw`, `lvh`, `svw`, `svh`, `min`, `max`, `fit`, ...w()],
            re = () => [Xs, `screen`, `full`, `dvw`, `lvw`, `svw`, `min`, `max`, `fit`, ...w()],
            ie = () => [Xs, `screen`, `full`, `lh`, `dvh`, `lvh`, `svh`, `min`, `max`, `fit`, ...w()],
            j = () => [e, $, Q],
            ae = () => [...b(), _c, fc, {
                position: [$, Q]
            }],
            M = () => [`no-repeat`, {
                repeat: [``, `x`, `y`, `space`, `round`]
            }],
            N = () => [`auto`, `cover`, `contain`, vc, sc, {
                size: [$, Q]
            }],
            oe = () => [Qs, hc, cc],
            P = () => [``, `none`, `full`, l, $, Q],
            F = () => [``, Z, hc, cc],
            I = () => [`solid`, `dashed`, `dotted`, `double`],
            L = () => [`normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`],
            R = () => [Z, Qs, _c, fc],
            se = () => [``, `none`, m, $, Q],
            ce = () => [`none`, Z, $, Q],
            le = () => [`none`, Z, $, Q],
            ue = () => [Z, $, Q],
            de = () => [Xs, `full`, ...w()];
        return {
            cacheSize: 500,
            theme: {
                animate: [`spin`, `ping`, `pulse`, `bounce`],
                aspect: [`video`],
                blur: [$s],
                breakpoint: [$s],
                color: [ec],
                container: [$s],
                "drop-shadow": [$s],
                ease: [`in`, `out`, `in-out`],
                font: [ac],
                "font-weight": [`thin`, `extralight`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`],
                "inset-shadow": [$s],
                leading: [`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`],
                perspective: [`dramatic`, `near`, `normal`, `midrange`, `distant`, `none`],
                radius: [$s],
                shadow: [$s],
                spacing: [`px`, Z],
                text: [$s],
                "text-shadow": [$s],
                tracking: [`tighter`, `tight`, `normal`, `wide`, `wider`, `widest`]
            },
            classGroups: {
                aspect: [{
                    aspect: [`auto`, `square`, Xs, Q, $, g]
                }],
                container: [`container`],
                "container-type": [{
                    "@container": [``, `normal`, `size`, $, Q]
                }],
                "container-named": [oc],
                columns: [{
                    columns: [Z, Q, $, s]
                }],
                "break-after": [{
                    "break-after": y()
                }],
                "break-before": [{
                    "break-before": y()
                }],
                "break-inside": [{
                    "break-inside": [`auto`, `avoid`, `avoid-page`, `avoid-column`]
                }],
                "box-decoration": [{
                    "box-decoration": [`slice`, `clone`]
                }],
                box: [{
                    box: [`border`, `content`]
                }],
                display: [`block`, `inline-block`, `inline`, `flex`, `inline-flex`, `table`, `inline-table`, `table-caption`, `table-cell`, `table-column`, `table-column-group`, `table-footer-group`, `table-header-group`, `table-row-group`, `table-row`, `flow-root`, `grid`, `inline-grid`, `contents`, `list-item`, `hidden`],
                sr: [`sr-only`, `not-sr-only`],
                float: [{
                    float: [`right`, `left`, `none`, `start`, `end`]
                }],
                clear: [{
                    clear: [`left`, `right`, `both`, `none`, `start`, `end`]
                }],
                isolation: [`isolate`, `isolation-auto`],
                "object-fit": [{
                    object: [`contain`, `cover`, `fill`, `none`, `scale-down`]
                }],
                "object-position": [{
                    object: x()
                }],
                overflow: [{
                    overflow: S()
                }],
                "overflow-x": [{
                    "overflow-x": S()
                }],
                "overflow-y": [{
                    "overflow-y": S()
                }],
                overscroll: [{
                    overscroll: C()
                }],
                "overscroll-x": [{
                    "overscroll-x": C()
                }],
                "overscroll-y": [{
                    "overscroll-y": C()
                }],
                position: [`static`, `fixed`, `absolute`, `relative`, `sticky`],
                inset: [{
                    inset: T()
                }],
                "inset-x": [{
                    "inset-x": T()
                }],
                "inset-y": [{
                    "inset-y": T()
                }],
                start: [{
                    "inset-s": T(),
                    start: T()
                }],
                end: [{
                    "inset-e": T(),
                    end: T()
                }],
                "inset-bs": [{
                    "inset-bs": T()
                }],
                "inset-be": [{
                    "inset-be": T()
                }],
                top: [{
                    top: T()
                }],
                right: [{
                    right: T()
                }],
                bottom: [{
                    bottom: T()
                }],
                left: [{
                    left: T()
                }],
                visibility: [`visible`, `invisible`, `collapse`],
                z: [{
                    z: [Zs, `auto`, $, Q]
                }],
                basis: [{
                    basis: [Xs, `full`, `auto`, s, ...w()]
                }],
                "flex-direction": [{
                    flex: [`row`, `row-reverse`, `col`, `col-reverse`]
                }],
                "flex-wrap": [{
                    flex: [`nowrap`, `wrap`, `wrap-reverse`]
                }],
                flex: [{
                    flex: [Z, Xs, `auto`, `initial`, `none`, Q]
                }],
                grow: [{
                    grow: [``, Z, $, Q]
                }],
                shrink: [{
                    shrink: [``, Z, $, Q]
                }],
                order: [{
                    order: [Zs, `first`, `last`, `none`, $, Q]
                }],
                "grid-cols": [{
                    "grid-cols": ee()
                }],
                "col-start-end": [{
                    col: te()
                }],
                "col-start": [{
                    "col-start": E()
                }],
                "col-end": [{
                    "col-end": E()
                }],
                "grid-rows": [{
                    "grid-rows": ee()
                }],
                "row-start-end": [{
                    row: te()
                }],
                "row-start": [{
                    "row-start": E()
                }],
                "row-end": [{
                    "row-end": E()
                }],
                "grid-flow": [{
                    "grid-flow": [`row`, `col`, `dense`, `row-dense`, `col-dense`]
                }],
                "auto-cols": [{
                    "auto-cols": D()
                }],
                "auto-rows": [{
                    "auto-rows": D()
                }],
                gap: [{
                    gap: w()
                }],
                "gap-x": [{
                    "gap-x": w()
                }],
                "gap-y": [{
                    "gap-y": w()
                }],
                "justify-content": [{
                    justify: [...O(), `normal`]
                }],
                "justify-items": [{
                    "justify-items": [...k(), `normal`]
                }],
                "justify-self": [{
                    "justify-self": [`auto`, ...k()]
                }],
                "align-content": [{
                    content: [`normal`, ...O()]
                }],
                "align-items": [{
                    items: [...k(), {
                        baseline: [``, `last`]
                    }]
                }],
                "align-self": [{
                    self: [`auto`, ...k(), {
                        baseline: [``, `last`]
                    }]
                }],
                "place-content": [{
                    "place-content": O()
                }],
                "place-items": [{
                    "place-items": [...k(), `baseline`]
                }],
                "place-self": [{
                    "place-self": [`auto`, ...k()]
                }],
                p: [{
                    p: w()
                }],
                px: [{
                    px: w()
                }],
                py: [{
                    py: w()
                }],
                ps: [{
                    ps: w()
                }],
                pe: [{
                    pe: w()
                }],
                pbs: [{
                    pbs: w()
                }],
                pbe: [{
                    pbe: w()
                }],
                pt: [{
                    pt: w()
                }],
                pr: [{
                    pr: w()
                }],
                pb: [{
                    pb: w()
                }],
                pl: [{
                    pl: w()
                }],
                m: [{
                    m: A()
                }],
                mx: [{
                    mx: A()
                }],
                my: [{
                    my: A()
                }],
                ms: [{
                    ms: A()
                }],
                me: [{
                    me: A()
                }],
                mbs: [{
                    mbs: A()
                }],
                mbe: [{
                    mbe: A()
                }],
                mt: [{
                    mt: A()
                }],
                mr: [{
                    mr: A()
                }],
                mb: [{
                    mb: A()
                }],
                ml: [{
                    ml: A()
                }],
                "space-x": [{
                    "space-x": w()
                }],
                "space-x-reverse": [`space-x-reverse`],
                "space-y": [{
                    "space-y": w()
                }],
                "space-y-reverse": [`space-y-reverse`],
                size: [{
                    size: ne()
                }],
                "inline-size": [{
                    inline: [`auto`, ...re()]
                }],
                "min-inline-size": [{
                    "min-inline": [`auto`, ...re()]
                }],
                "max-inline-size": [{
                    "max-inline": [`none`, ...re()]
                }],
                "block-size": [{
                    block: [`auto`, ...ie()]
                }],
                "min-block-size": [{
                    "min-block": [`auto`, ...ie()]
                }],
                "max-block-size": [{
                    "max-block": [`none`, ...ie()]
                }],
                w: [{
                    w: [s, `screen`, ...ne()]
                }],
                "min-w": [{
                    "min-w": [s, `screen`, `none`, ...ne()]
                }],
                "max-w": [{
                    "max-w": [s, `screen`, `none`, `prose`, {
                        screen: [o]
                    }, ...ne()]
                }],
                h: [{
                    h: [`screen`, `lh`, ...ne()]
                }],
                "min-h": [{
                    "min-h": [`screen`, `lh`, `none`, ...ne()]
                }],
                "max-h": [{
                    "max-h": [`screen`, `lh`, ...ne()]
                }],
                "font-size": [{
                    text: [`base`, n, hc, cc]
                }],
                "font-smoothing": [`antialiased`, `subpixel-antialiased`],
                "font-style": [`italic`, `not-italic`],
                "font-weight": [{
                    font: [r, xc, uc]
                }],
                "font-stretch": [{
                    "font-stretch": [`ultra-condensed`, `extra-condensed`, `condensed`, `semi-condensed`, `normal`, `semi-expanded`, `expanded`, `extra-expanded`, `ultra-expanded`, Qs, Q]
                }],
                "font-family": [{
                    font: [gc, dc, t]
                }],
                "font-features": [{
                    "font-features": [Q]
                }],
                "fvn-normal": [`normal-nums`],
                "fvn-ordinal": [`ordinal`],
                "fvn-slashed-zero": [`slashed-zero`],
                "fvn-figure": [`lining-nums`, `oldstyle-nums`],
                "fvn-spacing": [`proportional-nums`, `tabular-nums`],
                "fvn-fraction": [`diagonal-fractions`, `stacked-fractions`],
                tracking: [{
                    tracking: [i, $, Q]
                }],
                "line-clamp": [{
                    "line-clamp": [Z, `none`, $, lc]
                }],
                leading: [{
                    leading: [a, ...w()]
                }],
                "list-image": [{
                    "list-image": [`none`, $, Q]
                }],
                "list-style-position": [{
                    list: [`inside`, `outside`]
                }],
                "list-style-type": [{
                    list: [`disc`, `decimal`, `none`, $, Q]
                }],
                "text-alignment": [{
                    text: [`left`, `center`, `right`, `justify`, `start`, `end`]
                }],
                "placeholder-color": [{
                    placeholder: j()
                }],
                "text-color": [{
                    text: j()
                }],
                "text-decoration": [`underline`, `overline`, `line-through`, `no-underline`],
                "text-decoration-style": [{
                    decoration: [...I(), `wavy`]
                }],
                "text-decoration-thickness": [{
                    decoration: [Z, `from-font`, `auto`, $, cc]
                }],
                "text-decoration-color": [{
                    decoration: j()
                }],
                "underline-offset": [{
                    "underline-offset": [Z, `auto`, $, Q]
                }],
                "text-transform": [`uppercase`, `lowercase`, `capitalize`, `normal-case`],
                "text-overflow": [`truncate`, `text-ellipsis`, `text-clip`],
                "text-wrap": [{
                    text: [`wrap`, `nowrap`, `balance`, `pretty`]
                }],
                indent: [{
                    indent: w()
                }],
                "tab-size": [{
                    tab: [Zs, $, Q]
                }],
                "vertical-align": [{
                    align: [`baseline`, `top`, `middle`, `bottom`, `text-top`, `text-bottom`, `sub`, `super`, $, Q]
                }],
                whitespace: [{
                    whitespace: [`normal`, `nowrap`, `pre`, `pre-line`, `pre-wrap`, `break-spaces`]
                }],
                break: [{
                    break: [`normal`, `words`, `all`, `keep`]
                }],
                wrap: [{
                    wrap: [`break-word`, `anywhere`, `normal`]
                }],
                hyphens: [{
                    hyphens: [`none`, `manual`, `auto`]
                }],
                content: [{
                    content: [`none`, $, Q]
                }],
                "bg-attachment": [{
                    bg: [`fixed`, `local`, `scroll`]
                }],
                "bg-clip": [{
                    "bg-clip": [`border`, `padding`, `content`, `text`]
                }],
                "bg-origin": [{
                    "bg-origin": [`border`, `padding`, `content`]
                }],
                "bg-position": [{
                    bg: ae()
                }],
                "bg-repeat": [{
                    bg: M()
                }],
                "bg-size": [{
                    bg: N()
                }],
                "bg-image": [{
                    bg: [`none`, {
                        linear: [{
                            to: [`t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`]
                        }, Zs, $, Q],
                        radial: [``, $, Q],
                        conic: [Zs, $, Q]
                    }, yc, pc]
                }],
                "bg-color": [{
                    bg: j()
                }],
                "gradient-from-pos": [{
                    from: oe()
                }],
                "gradient-via-pos": [{
                    via: oe()
                }],
                "gradient-to-pos": [{
                    to: oe()
                }],
                "gradient-from": [{
                    from: j()
                }],
                "gradient-via": [{
                    via: j()
                }],
                "gradient-to": [{
                    to: j()
                }],
                rounded: [{
                    rounded: P()
                }],
                "rounded-s": [{
                    "rounded-s": P()
                }],
                "rounded-e": [{
                    "rounded-e": P()
                }],
                "rounded-t": [{
                    "rounded-t": P()
                }],
                "rounded-r": [{
                    "rounded-r": P()
                }],
                "rounded-b": [{
                    "rounded-b": P()
                }],
                "rounded-l": [{
                    "rounded-l": P()
                }],
                "rounded-ss": [{
                    "rounded-ss": P()
                }],
                "rounded-se": [{
                    "rounded-se": P()
                }],
                "rounded-ee": [{
                    "rounded-ee": P()
                }],
                "rounded-es": [{
                    "rounded-es": P()
                }],
                "rounded-tl": [{
                    "rounded-tl": P()
                }],
                "rounded-tr": [{
                    "rounded-tr": P()
                }],
                "rounded-br": [{
                    "rounded-br": P()
                }],
                "rounded-bl": [{
                    "rounded-bl": P()
                }],
                "border-w": [{
                    border: F()
                }],
                "border-w-x": [{
                    "border-x": F()
                }],
                "border-w-y": [{
                    "border-y": F()
                }],
                "border-w-s": [{
                    "border-s": F()
                }],
                "border-w-e": [{
                    "border-e": F()
                }],
                "border-w-bs": [{
                    "border-bs": F()
                }],
                "border-w-be": [{
                    "border-be": F()
                }],
                "border-w-t": [{
                    "border-t": F()
                }],
                "border-w-r": [{
                    "border-r": F()
                }],
                "border-w-b": [{
                    "border-b": F()
                }],
                "border-w-l": [{
                    "border-l": F()
                }],
                "divide-x": [{
                    "divide-x": F()
                }],
                "divide-x-reverse": [`divide-x-reverse`],
                "divide-y": [{
                    "divide-y": F()
                }],
                "divide-y-reverse": [`divide-y-reverse`],
                "border-style": [{
                    border: [...I(), `hidden`, `none`]
                }],
                "divide-style": [{
                    divide: [...I(), `hidden`, `none`]
                }],
                "border-color": [{
                    border: j()
                }],
                "border-color-x": [{
                    "border-x": j()
                }],
                "border-color-y": [{
                    "border-y": j()
                }],
                "border-color-s": [{
                    "border-s": j()
                }],
                "border-color-e": [{
                    "border-e": j()
                }],
                "border-color-bs": [{
                    "border-bs": j()
                }],
                "border-color-be": [{
                    "border-be": j()
                }],
                "border-color-t": [{
                    "border-t": j()
                }],
                "border-color-r": [{
                    "border-r": j()
                }],
                "border-color-b": [{
                    "border-b": j()
                }],
                "border-color-l": [{
                    "border-l": j()
                }],
                "divide-color": [{
                    divide: j()
                }],
                "outline-style": [{
                    outline: [...I(), `none`, `hidden`]
                }],
                "outline-offset": [{
                    "outline-offset": [Z, $, Q]
                }],
                "outline-w": [{
                    outline: [``, Z, hc, cc]
                }],
                "outline-color": [{
                    outline: j()
                }],
                shadow: [{
                    shadow: [``, `none`, u, bc, mc]
                }],
                "shadow-color": [{
                    shadow: j()
                }],
                "inset-shadow": [{
                    "inset-shadow": [`none`, d, bc, mc]
                }],
                "inset-shadow-color": [{
                    "inset-shadow": j()
                }],
                "ring-w": [{
                    ring: F()
                }],
                "ring-w-inset": [`ring-inset`],
                "ring-color": [{
                    ring: j()
                }],
                "ring-offset-w": [{
                    "ring-offset": [Z, cc]
                }],
                "ring-offset-color": [{
                    "ring-offset": j()
                }],
                "inset-ring-w": [{
                    "inset-ring": F()
                }],
                "inset-ring-color": [{
                    "inset-ring": j()
                }],
                "text-shadow": [{
                    "text-shadow": [`none`, f, bc, mc]
                }],
                "text-shadow-color": [{
                    "text-shadow": j()
                }],
                opacity: [{
                    opacity: [Z, $, Q]
                }],
                "mix-blend": [{
                    "mix-blend": [...L(), `plus-darker`, `plus-lighter`]
                }],
                "bg-blend": [{
                    "bg-blend": L()
                }],
                "mask-clip": [{
                    "mask-clip": [`border`, `padding`, `content`, `fill`, `stroke`, `view`]
                }, `mask-no-clip`],
                "mask-composite": [{
                    mask: [`add`, `subtract`, `intersect`, `exclude`]
                }],
                "mask-image-linear-pos": [{
                    "mask-linear": [Z]
                }],
                "mask-image-linear-from-pos": [{
                    "mask-linear-from": R()
                }],
                "mask-image-linear-to-pos": [{
                    "mask-linear-to": R()
                }],
                "mask-image-linear-from-color": [{
                    "mask-linear-from": j()
                }],
                "mask-image-linear-to-color": [{
                    "mask-linear-to": j()
                }],
                "mask-image-t-from-pos": [{
                    "mask-t-from": R()
                }],
                "mask-image-t-to-pos": [{
                    "mask-t-to": R()
                }],
                "mask-image-t-from-color": [{
                    "mask-t-from": j()
                }],
                "mask-image-t-to-color": [{
                    "mask-t-to": j()
                }],
                "mask-image-r-from-pos": [{
                    "mask-r-from": R()
                }],
                "mask-image-r-to-pos": [{
                    "mask-r-to": R()
                }],
                "mask-image-r-from-color": [{
                    "mask-r-from": j()
                }],
                "mask-image-r-to-color": [{
                    "mask-r-to": j()
                }],
                "mask-image-b-from-pos": [{
                    "mask-b-from": R()
                }],
                "mask-image-b-to-pos": [{
                    "mask-b-to": R()
                }],
                "mask-image-b-from-color": [{
                    "mask-b-from": j()
                }],
                "mask-image-b-to-color": [{
                    "mask-b-to": j()
                }],
                "mask-image-l-from-pos": [{
                    "mask-l-from": R()
                }],
                "mask-image-l-to-pos": [{
                    "mask-l-to": R()
                }],
                "mask-image-l-from-color": [{
                    "mask-l-from": j()
                }],
                "mask-image-l-to-color": [{
                    "mask-l-to": j()
                }],
                "mask-image-x-from-pos": [{
                    "mask-x-from": R()
                }],
                "mask-image-x-to-pos": [{
                    "mask-x-to": R()
                }],
                "mask-image-x-from-color": [{
                    "mask-x-from": j()
                }],
                "mask-image-x-to-color": [{
                    "mask-x-to": j()
                }],
                "mask-image-y-from-pos": [{
                    "mask-y-from": R()
                }],
                "mask-image-y-to-pos": [{
                    "mask-y-to": R()
                }],
                "mask-image-y-from-color": [{
                    "mask-y-from": j()
                }],
                "mask-image-y-to-color": [{
                    "mask-y-to": j()
                }],
                "mask-image-radial": [{
                    "mask-radial": [$, Q]
                }],
                "mask-image-radial-from-pos": [{
                    "mask-radial-from": R()
                }],
                "mask-image-radial-to-pos": [{
                    "mask-radial-to": R()
                }],
                "mask-image-radial-from-color": [{
                    "mask-radial-from": j()
                }],
                "mask-image-radial-to-color": [{
                    "mask-radial-to": j()
                }],
                "mask-image-radial-shape": [{
                    "mask-radial": [`circle`, `ellipse`]
                }],
                "mask-image-radial-size": [{
                    "mask-radial": [{
                        closest: [`side`, `corner`],
                        farthest: [`side`, `corner`]
                    }]
                }],
                "mask-image-radial-pos": [{
                    "mask-radial-at": b()
                }],
                "mask-image-conic-pos": [{
                    "mask-conic": [Z]
                }],
                "mask-image-conic-from-pos": [{
                    "mask-conic-from": R()
                }],
                "mask-image-conic-to-pos": [{
                    "mask-conic-to": R()
                }],
                "mask-image-conic-from-color": [{
                    "mask-conic-from": j()
                }],
                "mask-image-conic-to-color": [{
                    "mask-conic-to": j()
                }],
                "mask-mode": [{
                    mask: [`alpha`, `luminance`, `match`]
                }],
                "mask-origin": [{
                    "mask-origin": [`border`, `padding`, `content`, `fill`, `stroke`, `view`]
                }],
                "mask-position": [{
                    mask: ae()
                }],
                "mask-repeat": [{
                    mask: M()
                }],
                "mask-size": [{
                    mask: N()
                }],
                "mask-type": [{
                    "mask-type": [`alpha`, `luminance`]
                }],
                "mask-image": [{
                    mask: [`none`, $, Q]
                }],
                filter: [{
                    filter: [``, `none`, $, Q]
                }],
                blur: [{
                    blur: se()
                }],
                brightness: [{
                    brightness: [Z, $, Q]
                }],
                contrast: [{
                    contrast: [Z, $, Q]
                }],
                "drop-shadow": [{
                    "drop-shadow": [``, `none`, p, bc, mc]
                }],
                "drop-shadow-color": [{
                    "drop-shadow": j()
                }],
                grayscale: [{
                    grayscale: [``, Z, $, Q]
                }],
                "hue-rotate": [{
                    "hue-rotate": [Z, $, Q]
                }],
                invert: [{
                    invert: [``, Z, $, Q]
                }],
                saturate: [{
                    saturate: [Z, $, Q]
                }],
                sepia: [{
                    sepia: [``, Z, $, Q]
                }],
                "backdrop-filter": [{
                    "backdrop-filter": [``, `none`, $, Q]
                }],
                "backdrop-blur": [{
                    "backdrop-blur": se()
                }],
                "backdrop-brightness": [{
                    "backdrop-brightness": [Z, $, Q]
                }],
                "backdrop-contrast": [{
                    "backdrop-contrast": [Z, $, Q]
                }],
                "backdrop-grayscale": [{
                    "backdrop-grayscale": [``, Z, $, Q]
                }],
                "backdrop-hue-rotate": [{
                    "backdrop-hue-rotate": [Z, $, Q]
                }],
                "backdrop-invert": [{
                    "backdrop-invert": [``, Z, $, Q]
                }],
                "backdrop-opacity": [{
                    "backdrop-opacity": [Z, $, Q]
                }],
                "backdrop-saturate": [{
                    "backdrop-saturate": [Z, $, Q]
                }],
                "backdrop-sepia": [{
                    "backdrop-sepia": [``, Z, $, Q]
                }],
                "border-collapse": [{
                    border: [`collapse`, `separate`]
                }],
                "border-spacing": [{
                    "border-spacing": w()
                }],
                "border-spacing-x": [{
                    "border-spacing-x": w()
                }],
                "border-spacing-y": [{
                    "border-spacing-y": w()
                }],
                "table-layout": [{
                    table: [`auto`, `fixed`]
                }],
                caption: [{
                    caption: [`top`, `bottom`]
                }],
                transition: [{
                    transition: [``, `all`, `colors`, `opacity`, `shadow`, `transform`, `none`, $, Q]
                }],
                "transition-behavior": [{
                    transition: [`normal`, `discrete`]
                }],
                duration: [{
                    duration: [Z, `initial`, $, Q]
                }],
                ease: [{
                    ease: [`linear`, `initial`, _, $, Q]
                }],
                delay: [{
                    delay: [Z, $, Q]
                }],
                animate: [{
                    animate: [`none`, v, $, Q]
                }],
                backface: [{
                    backface: [`hidden`, `visible`]
                }],
                perspective: [{
                    perspective: [h, $, Q]
                }],
                "perspective-origin": [{
                    "perspective-origin": x()
                }],
                rotate: [{
                    rotate: ce()
                }],
                "rotate-x": [{
                    "rotate-x": ce()
                }],
                "rotate-y": [{
                    "rotate-y": ce()
                }],
                "rotate-z": [{
                    "rotate-z": ce()
                }],
                scale: [{
                    scale: le()
                }],
                "scale-x": [{
                    "scale-x": le()
                }],
                "scale-y": [{
                    "scale-y": le()
                }],
                "scale-z": [{
                    "scale-z": le()
                }],
                "scale-3d": [`scale-3d`],
                skew: [{
                    skew: ue()
                }],
                "skew-x": [{
                    "skew-x": ue()
                }],
                "skew-y": [{
                    "skew-y": ue()
                }],
                transform: [{
                    transform: [$, Q, ``, `none`, `gpu`, `cpu`]
                }],
                "transform-origin": [{
                    origin: x()
                }],
                "transform-style": [{
                    transform: [`3d`, `flat`]
                }],
                translate: [{
                    translate: de()
                }],
                "translate-x": [{
                    "translate-x": de()
                }],
                "translate-y": [{
                    "translate-y": de()
                }],
                "translate-z": [{
                    "translate-z": de()
                }],
                "translate-none": [`translate-none`],
                zoom: [{
                    zoom: [Zs, $, Q]
                }],
                accent: [{
                    accent: j()
                }],
                appearance: [{
                    appearance: [`none`, `auto`]
                }],
                "caret-color": [{
                    caret: j()
                }],
                "color-scheme": [{
                    scheme: [`normal`, `dark`, `light`, `light-dark`, `only-dark`, `only-light`]
                }],
                cursor: [{
                    cursor: [`auto`, `default`, `pointer`, `wait`, `text`, `move`, `help`, `not-allowed`, `none`, `context-menu`, `progress`, `cell`, `crosshair`, `vertical-text`, `alias`, `copy`, `no-drop`, `grab`, `grabbing`, `all-scroll`, `col-resize`, `row-resize`, `n-resize`, `e-resize`, `s-resize`, `w-resize`, `ne-resize`, `nw-resize`, `se-resize`, `sw-resize`, `ew-resize`, `ns-resize`, `nesw-resize`, `nwse-resize`, `zoom-in`, `zoom-out`, $, Q]
                }],
                "field-sizing": [{
                    "field-sizing": [`fixed`, `content`]
                }],
                "pointer-events": [{
                    "pointer-events": [`auto`, `none`]
                }],
                resize: [{
                    resize: [`none`, ``, `y`, `x`]
                }],
                "scroll-behavior": [{
                    scroll: [`auto`, `smooth`]
                }],
                "scrollbar-thumb-color": [{
                    "scrollbar-thumb": j()
                }],
                "scrollbar-track-color": [{
                    "scrollbar-track": j()
                }],
                "scrollbar-gutter": [{
                    "scrollbar-gutter": [`auto`, `stable`, `both`]
                }],
                "scrollbar-w": [{
                    scrollbar: [`auto`, `thin`, `none`]
                }],
                "scroll-m": [{
                    "scroll-m": w()
                }],
                "scroll-mx": [{
                    "scroll-mx": w()
                }],
                "scroll-my": [{
                    "scroll-my": w()
                }],
                "scroll-ms": [{
                    "scroll-ms": w()
                }],
                "scroll-me": [{
                    "scroll-me": w()
                }],
                "scroll-mbs": [{
                    "scroll-mbs": w()
                }],
                "scroll-mbe": [{
                    "scroll-mbe": w()
                }],
                "scroll-mt": [{
                    "scroll-mt": w()
                }],
                "scroll-mr": [{
                    "scroll-mr": w()
                }],
                "scroll-mb": [{
                    "scroll-mb": w()
                }],
                "scroll-ml": [{
                    "scroll-ml": w()
                }],
                "scroll-p": [{
                    "scroll-p": w()
                }],
                "scroll-px": [{
                    "scroll-px": w()
                }],
                "scroll-py": [{
                    "scroll-py": w()
                }],
                "scroll-ps": [{
                    "scroll-ps": w()
                }],
                "scroll-pe": [{
                    "scroll-pe": w()
                }],
                "scroll-pbs": [{
                    "scroll-pbs": w()
                }],
                "scroll-pbe": [{
                    "scroll-pbe": w()
                }],
                "scroll-pt": [{
                    "scroll-pt": w()
                }],
                "scroll-pr": [{
                    "scroll-pr": w()
                }],
                "scroll-pb": [{
                    "scroll-pb": w()
                }],
                "scroll-pl": [{
                    "scroll-pl": w()
                }],
                "snap-align": [{
                    snap: [`start`, `end`, `center`, `align-none`]
                }],
                "snap-stop": [{
                    snap: [`normal`, `always`]
                }],
                "snap-type": [{
                    snap: [`none`, `x`, `y`, `both`]
                }],
                "snap-strictness": [{
                    snap: [`mandatory`, `proximity`]
                }],
                touch: [{
                    touch: [`auto`, `none`, `manipulation`]
                }],
                "touch-x": [{
                    "touch-pan": [`x`, `left`, `right`]
                }],
                "touch-y": [{
                    "touch-pan": [`y`, `up`, `down`]
                }],
                "touch-pz": [`touch-pinch-zoom`],
                select: [{
                    select: [`none`, `text`, `all`, `auto`]
                }],
                "will-change": [{
                    "will-change": [`auto`, `scroll`, `contents`, `transform`, $, Q]
                }],
                fill: [{
                    fill: [`none`, ...j()]
                }],
                "stroke-w": [{
                    stroke: [Z, hc, cc, lc]
                }],
                stroke: [{
                    stroke: [`none`, ...j()]
                }],
                "forced-color-adjust": [{
                    "forced-color-adjust": [`auto`, `none`]
                }]
            },
            conflictingClassGroups: {
                "container-named": [`container-type`],
                overflow: [`overflow-x`, `overflow-y`],
                overscroll: [`overscroll-x`, `overscroll-y`],
                inset: [`inset-x`, `inset-y`, `inset-bs`, `inset-be`, `start`, `end`, `top`, `right`, `bottom`, `left`],
                "inset-x": [`right`, `left`],
                "inset-y": [`top`, `bottom`],
                flex: [`basis`, `grow`, `shrink`],
                gap: [`gap-x`, `gap-y`],
                p: [`px`, `py`, `ps`, `pe`, `pbs`, `pbe`, `pt`, `pr`, `pb`, `pl`],
                px: [`pr`, `pl`],
                py: [`pt`, `pb`],
                m: [`mx`, `my`, `ms`, `me`, `mbs`, `mbe`, `mt`, `mr`, `mb`, `ml`],
                mx: [`mr`, `ml`],
                my: [`mt`, `mb`],
                size: [`w`, `h`],
                "font-size": [`leading`],
                "fvn-normal": [`fvn-ordinal`, `fvn-slashed-zero`, `fvn-figure`, `fvn-spacing`, `fvn-fraction`],
                "fvn-ordinal": [`fvn-normal`],
                "fvn-slashed-zero": [`fvn-normal`],
                "fvn-figure": [`fvn-normal`],
                "fvn-spacing": [`fvn-normal`],
                "fvn-fraction": [`fvn-normal`],
                "line-clamp": [`display`, `overflow`],
                rounded: [`rounded-s`, `rounded-e`, `rounded-t`, `rounded-r`, `rounded-b`, `rounded-l`, `rounded-ss`, `rounded-se`, `rounded-ee`, `rounded-es`, `rounded-tl`, `rounded-tr`, `rounded-br`, `rounded-bl`],
                "rounded-s": [`rounded-ss`, `rounded-es`],
                "rounded-e": [`rounded-se`, `rounded-ee`],
                "rounded-t": [`rounded-tl`, `rounded-tr`],
                "rounded-r": [`rounded-tr`, `rounded-br`],
                "rounded-b": [`rounded-br`, `rounded-bl`],
                "rounded-l": [`rounded-tl`, `rounded-bl`],
                "border-spacing": [`border-spacing-x`, `border-spacing-y`],
                "border-w": [`border-w-x`, `border-w-y`, `border-w-s`, `border-w-e`, `border-w-bs`, `border-w-be`, `border-w-t`, `border-w-r`, `border-w-b`, `border-w-l`],
                "border-w-x": [`border-w-r`, `border-w-l`],
                "border-w-y": [`border-w-t`, `border-w-b`],
                "border-color": [`border-color-x`, `border-color-y`, `border-color-s`, `border-color-e`, `border-color-bs`, `border-color-be`, `border-color-t`, `border-color-r`, `border-color-b`, `border-color-l`],
                "border-color-x": [`border-color-r`, `border-color-l`],
                "border-color-y": [`border-color-t`, `border-color-b`],
                translate: [`translate-x`, `translate-y`, `translate-none`],
                "translate-none": [`translate`, `translate-x`, `translate-y`, `translate-z`],
                "scroll-m": [`scroll-mx`, `scroll-my`, `scroll-ms`, `scroll-me`, `scroll-mbs`, `scroll-mbe`, `scroll-mt`, `scroll-mr`, `scroll-mb`, `scroll-ml`],
                "scroll-mx": [`scroll-mr`, `scroll-ml`],
                "scroll-my": [`scroll-mt`, `scroll-mb`],
                "scroll-p": [`scroll-px`, `scroll-py`, `scroll-ps`, `scroll-pe`, `scroll-pbs`, `scroll-pbe`, `scroll-pt`, `scroll-pr`, `scroll-pb`, `scroll-pl`],
                "scroll-px": [`scroll-pr`, `scroll-pl`],
                "scroll-py": [`scroll-pt`, `scroll-pb`],
                touch: [`touch-x`, `touch-y`, `touch-pz`],
                "touch-x": [`touch`],
                "touch-y": [`touch`],
                "touch-pz": [`touch`]
            },
            conflictingClassGroupModifiers: {
                "font-size": [`leading`]
            },
            postfixLookupClassGroups: [`container-type`],
            orderSensitiveModifiers: [`*`, `**`, `after`, `backdrop`, `before`, `details-content`, `file`, `first-letter`, `first-line`, `marker`, `placeholder`, `selection`]
        }
    });

function Nc(e) {
    var t, n, r = ``;
    if (typeof e == `string` || typeof e == `number`) r += e;
    else if (typeof e == `object`)
        if (Array.isArray(e)) {
            var i = e.length;
            for (t = 0; t < i; t++) e[t] && (n = Nc(e[t])) && (r && (r += ` `), r += n)
        } else
            for (n in e) e[n] && (r && (r += ` `), r += n);
    return r
}

function Pc() {
    for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++)(e = arguments[n]) && (t = Nc(e)) && (r && (r += ` `), r += t);
    return r
}

function Fc(...e) {
    return Mc(Pc(...e))
}

function Ic(e) {
    return Math.floor((Math.sqrt(392 * e + 22801) - 53) / 98)
}

function Lc(e) {
    return 49 * (e - 1) + 100
}

function Rc(e) {
    return (49 * e ** 2 + 53 * e - 102) / 2
}

function zc(e) {
    let t = Ic(e),
        n = e - Rc(t),
        r = Lc(t),
        i = r > 0 ? n / r : 0;
    return {
        level: t,
        levelFloat: t + i,
        levelCurrentXp: n,
        levelMaxXp: r,
        levelProgressPercent: (i > 1 ? 1 : i) * 100
    }
}

function Bc(e) {
    return e < 1e3 ? Math.round(e).toString() : Ta(e)
}

function Vc(e, t) {
    return ({
        value: n
    }) => {
        let r = t ?.convert ?.(n) ?? n,
            i = e.safeParse(r);
        return i.success ? void 0 : i.error.issues.map(e => e.message)
    }
}

function Hc(e, t) {
    if (t === void 0 || t.length === 0) return;
    let n = Object.groupBy(t, e => e.type);
    if ((n.warning ?.length ?? 0) > 0 && e.setMeta(e => ({ ...e,
            hasWarning: !0,
            warnings: n.warning ?.map(e => e.message)
        })), (n.error ?.length ?? 0) > 0) return n.error ?.map(e => e.message)
}

function Uc() {
    return ({
        value: e
    }) => Object.values(e).some(e => e === void 0 || e === ``) ? `all fields are mandatory` : void 0
}

function Wc(e) {
    return ({
        value: t
    }) => t !== void 0 && t !== `` ? void 0 : e ?? `mandatory`
}

function Gc(e, t) {
    return async n => {
        let r = await e(n);
        if (r.status <= 299) return t ?.check ?.(r.body.data) ?? !0;
        let i;
        return i = r.status <= 499 ? t ?.on4xx ?? (e => e) : t ?.on5xx ?? `Server unavailable. Please try again later.`, typeof i == `function` ? i(r.body.message) : i
    }
}

function Kc(e, t) {
    return async n => {
        let r, i = await e(n.value);
        if (i.status <= 299) r = t ?.check ?.(i.body.data) ?? void 0;
        else {
            let e;
            e = i.status <= 499 ? t ?.on4xx ?? (e => e) : t ?.on5xx ?? `Server unavailable. Please try again later.`, r = typeof e == `function` ? e(i.body.message) : e
        }
        if (!(r === !0 || r === void 0)) return typeof r == `string` ? r : Hc(n.fieldApi, [{
            type: `warning`,
            message: r.warning
        }])
    }
}
var qc = {
        ational: `ate`,
        tional: `tion`,
        enci: `ence`,
        anci: `ance`,
        izer: `ize`,
        bli: `ble`,
        alli: `al`,
        entli: `ent`,
        eli: `e`,
        ousli: `ous`,
        ization: `ize`,
        ation: `ate`,
        ator: `ate`,
        alism: `al`,
        iveness: `ive`,
        fulness: `ful`,
        ousness: `ous`,
        aliti: `al`,
        iviti: `ive`,
        biliti: `ble`,
        logi: `log`
    },
    Jc = {
        icate: `ic`,
        ative: ``,
        alize: `al`,
        iciti: `ic`,
        ical: `ic`,
        ful: ``,
        ness: ``
    },
    Yc = `[^aeiou]`,
    Xc = `[aeiouy]`,
    Zc = `(` + Yc + `[^aeiouy]*)`;
`` + Xc;
var Qc = RegExp(`^` + Zc + `?([aeiouy][aeiou]*)([^aeiou][^aeiouy]*)`),
    $c = RegExp(`^` + Zc + `?([aeiouy][aeiou]*)([^aeiou][^aeiouy]*)([aeiouy][aeiou]*)?$`),
    el = RegExp(`^` + Zc + `?(([aeiouy][aeiou]*)([^aeiou][^aeiouy]*)){2,}`),
    tl = RegExp(`^` + Zc + `?[aeiouy]`),
    nl = RegExp(`^` + Zc + Xc + `[^aeiouwxy]$`),
    rl = /ll$/,
    il = /^(.+?)e$/,
    al = /^(.+?)y$/,
    ol = /^(.+?(s|t))(ion)$/,
    sl = /^(.+?)(ed|ing)$/,
    cl = /(at|bl|iz)$/,
    ll = /^(.+?)eed$/,
    ul = /^.+?[^s]s$/,
    dl = /^.+?(ss|i)es$/,
    fl = /([^aeiouylsz])\1$/,
    pl = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,
    ml = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,
    hl = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;

function gl(e) {
    let t = String(e).toLowerCase();
    if (t.length < 3) return t;
    let n = !1;
    t.codePointAt(0) === 121 && (n = !0, t = `Y` + t.slice(1)), dl.test(t) ? t = t.slice(0, -2) : ul.test(t) && (t = t.slice(0, -1));
    let r;
    return (r = ll.exec(t)) ? Qc.test(r[1]) && (t = t.slice(0, -1)) : (r = sl.exec(t)) && tl.test(r[1]) && (t = r[1], cl.test(t) ? t += `e` : fl.test(t) ? t = t.slice(0, -1) : nl.test(t) && (t += `e`)), (r = al.exec(t)) && tl.test(r[1]) && (t = r[1] + `i`), (r = pl.exec(t)) && Qc.test(r[1]) && (t = r[1] + qc[r[2]]), (r = ml.exec(t)) && Qc.test(r[1]) && (t = r[1] + Jc[r[2]]), (r = hl.exec(t)) ? el.test(r[1]) && (t = r[1]) : (r = ol.exec(t)) && el.test(r[1]) && (t = r[1]), (r = il.exec(t)) && (el.test(r[1]) || $c.test(r[1]) && !nl.test(r[1])) && (t = r[1]), rl.test(t) && el.test(t) && (t = t.slice(0, -1)), n && (t = `y` + t.slice(1)), t
}
var _l = e(t(((e, t) => {
        t.exports = function(e, t, n) {
            var r = e.length,
                i = t.length,
                a = [];
            n = (n || (i > r ? i : r)) + 1;
            for (var o = 0; o < n; o++) a[o] = [o], a[o].length = n;
            for (o = 0; o < n; o++) a[0][o] = o;
            if (Math.abs(r - i) > (n || 100)) return p(n || 100);
            if (r === 0) return p(i);
            if (i === 0) return p(r);
            var s, c, l, u, d, f;
            for (o = 1; o <= r; ++o)
                for (c = e[o - 1], s = 1; s <= i; ++s) {
                    if (o === s && a[o][s] > 4) return p(r);
                    l = t[s - 1], u = c === l ? 0 : 1, d = a[o - 1][s] + 1, (f = a[o][s - 1] + 1) < d && (d = f), (f = a[o - 1][s - 1] + u) < d && (d = f), a[o][s] = o > 1 && s > 1 && c === t[s - 2] && e[o - 2] === l && (f = a[o - 2][s - 2] + u) < d ? f : d
                }
            return p(a[r][i]);

            function p(e) {
                var t = Math.max(r, i),
                    n = t === 0 ? 0 : e / t;
                return {
                    steps: e,
                    relative: n,
                    similarity: 1 - n
                }
            }
        }
    }))(), 1),
    vl = {
        fuzzyMatchSensitivity: .2,
        scoreForSimilarMatch: .5,
        scoreForExactMatch: 1
    };

function yl(e, t) {
    return t === 0 ? 0 : Math.log10(e / t)
}
var bl = .4;

function xl(e, t) {
    return bl + (1 - bl) * (t.termFrequencies[e] / t.maxTermFrequency)
}

function Sl(e) {
    return e.match(/[^\\\][.,"/#!?$%^&*;:{}=\-_`~()\s]+/g) ?? []
}
var Cl = (e, t, n = vl) => {
    let r = {},
        i = {};
    e.forEach((e, n) => {
        let a = Sl(t(e)),
            o = {
                id: n,
                termFrequencies: {},
                maxTermFrequency: 0
            },
            s = 0;
        a.forEach(e => {
            let t = gl(e);
            Object.hasOwn(i, t) || (i[t] = new Set), i[t] ?.add(e), Object.hasOwn(r, t) || (r[t] = new Set), r[t] ?.add(o), t in o.termFrequencies || (o.termFrequencies[t] = 0), o.termFrequencies[t] += 1, s = Math.max(s, o.termFrequencies[t])
        }), o.maxTermFrequency = s
    });
    let a = Object.keys(r);
    return {
        query: (t, o) => {
            let s = {
                    results: [],
                    matchedQueryTerms: []
                },
                c = new Set(Sl(t).map(e => gl(e)));
            if (c.size === 0) return s;
            let l = new Map,
                u = new Set;
            return c.forEach(t => {
                a.forEach(a => {
                    let {
                        similarity: s
                    } = (0, _l.default)(t, a), c = a === t, d = s >= 1 - n.fuzzyMatchSensitivity;
                    if (c || d) {
                        let t = r[a],
                            s = yl(e.length, t.size);
                        t.forEach(t => {
                            let r = l.get(t.id) ?? 0,
                                i = xl(a, t),
                                u = ((c ? n.scoreForExactMatch : 0) + (d ? n.scoreForSimilarMatch : 0)) * s * i,
                                f = e[t.id];
                            (o.length === 0 || o.includes(f ?.id)) && l.set(t.id, r + u)
                        }), i[a] ?.forEach(e => {
                            u.add(e)
                        })
                    }
                })
            }), s.results = [...l].sort((e, t) => t[1] - e[1]).map(t => e[t[0]]), s.matchedQueryTerms = [...u], s
        }
    }
};
export {
    da as $, M as $n, Or as $t, Ja as A, nr as An, Ti as At, Ta as B, jn as Bn, ti as Bt, ao as C, sr as Cn, si as Ct, Qa as D, Un as Dn, di as Dt, eo as E, lr as En, Oi as Et, Ma as F, Qn as Fn, hi as Ft, Ca as G, wn as Gn, Ur as Gt, Sa as H, Jn as Hn, Qr as Ht, Aa as I, qn as In, Di as It, ya as J, qt as Jn, Ir as Jt, Da as K, Cn as Kn, Lr as Kt, ja as L, ir as Ln, Ei as Lt, Ga as M, zn as Mn, li as Mt, Na as N, Wn as Nn, fi as Nt, Xa as O, Bn as On, ai as Ot, ka as P, Vn as Pn, oi as Pt, ca as Q, re as Qn, jr as Qt, Ia as R, ar as Rn, mi as Rt, oo as S, or as Sn, ci as St, no as T, Fn as Tn, vi as Tt, Ea as U, Tn as Un, Xr as Ut, Oa as V, er as Vn, Yr as Vt, wa as W, Gn as Wn, Gr as Wt, ba as X, j as Xn, Rr as Xt, xa as Y, q as Yn, zr as Yt, ma as Z, ie as Zn, Pr as Zt, Ho as _, Ln as _n, ki as _t, Wc as a, Dr as an, $i as at, lo as b, Mn as bn, Si as bt, Bc as c, dr as cn, Wi as ct, Fc as d, Pn as dn, Ki as dt, wr as en, ae as er, fa as et, cs as f, En as fn, Ui as ft, Uo as g, $n as gn, Gi as gt, Go as h, On as hn, Ji as ht, Uc as i, br as in , ta as it, Ya as j, Yn as jn, yi as jt, Za as k, rr as kn, ui as kt, Ic as l, cr as ln, Li as lt, Yo as m, kn as mn, Ri as mt, Gc as n, Cr as nn, A as nr, aa as nt, Vc as o, Tr as on, Qi as ot, ts as p, Dn as pn, Vi as pt, ga as q, Sn as qn, Fr as qt, Kc as r, Sr as rn, ra as rt, Hc as s, Er as sn, ea as st, Cl as t, xr as tn, ne as tr, pa as tt, zc as u, Zn as un, Hi as ut, Bo as v, In as vn, Ai as vt, io as w, Kn as wn, pi as wt, co as x, An as xn, ri as xt, uo as y, Nn as yn, ji as yt, Fa as z, Hn as zn, ii as zt
};
//#sourceMappingURL=monkeytype-utils.1QGe32NE.js.map