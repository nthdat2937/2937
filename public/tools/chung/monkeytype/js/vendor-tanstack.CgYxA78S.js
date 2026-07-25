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
        t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = `58ada889-e7db-4acd-8a8b-c7882ef69e42`, e._sentryDebugIdIdentifier = `sentry-dbid-58ada889-e7db-4acd-8a8b-c7882ef69e42`)
    } catch {}
})();
var e = 1,
    t = !1,
    n = !1,
    r = [],
    i = null,
    a = null,
    o = 5,
    s = 0,
    c = 300,
    l = 0,
    u = null,
    d = null,
    f = 1073741823;

function p() {
    let e = new MessageChannel,
        t = e.port1,
        n = e.port2;
    if (typeof t.unref == `function` && t.unref(), typeof n.unref == `function` && n.unref(), u = () => n.postMessage(null), t.onmessage = () => {
            if (d !== null) {
                let e = performance.now();
                s = e + o, l = e + c;
                try {
                    d(e) ? n.postMessage(null) : d = null
                } catch (e) {
                    throw n.postMessage(null), e
                }
            }
        }, navigator && navigator.scheduling && navigator.scheduling.isInputPending) {
        let e = navigator.scheduling;
        a = () => {
            let t = performance.now();
            return t >= s ? e.isInputPending() ? !0 : t >= l : !1
        }
    } else a = () => performance.now() >= s
}

function m(e, t) {
    function n() {
        let n = 0,
            r = e.length - 1;
        for (; n <= r;) {
            let i = r + n >> 1,
                a = t.expirationTime - e[i].expirationTime;
            if (a > 0) n = i + 1;
            else if (a < 0) r = i - 1;
            else return i
        }
        return n
    }
    e.splice(n(), 0, t)
}

function h(i, a) {
    u || p();
    let o = performance.now(),
        s = f;
    a && a.timeout && (s = a.timeout);
    let c = {
        id: e++,
        fn: i,
        startTime: o,
        expirationTime: o + s
    };
    return m(r, c), !t && !n && (t = !0, d = g, u()), c
}

function g(e) {
    t = !1, n = !0;
    try {
        return _(e)
    } finally {
        i = null, n = !1
    }
}

function _(e) {
    let t = e;
    for (i = r[0] || null; i !== null && !(i.expirationTime > t && a());) {
        let e = i.fn;
        e === null ? r.shift() : (i.fn = null, e(i.expirationTime <= t), t = performance.now(), i === r[0] && r.shift()), i = r[0] || null
    }
    return i !== null
}
var v = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
        return y(this.context.count)
    },
    getNextContextId() {
        return y(this.context.count++)
    }
};

function y(e) {
    let t = String(e),
        n = t.length - 1;
    return v.context.id + (n ? String.fromCharCode(96 + n) : ``) + t
}

function b(e) {
    v.context = e
}

function x() {
    return { ...v.context,
        id: v.getNextContextId(),
        count: 0
    }
}
var S = (e, t) => e === t,
    C = Symbol(`solid-proxy`),
    w = typeof Proxy == `function`,
    T = Symbol(`solid-track`),
    E = {
        equals: S
    },
    D = null,
    ee = Ie,
    O = 1,
    te = 2,
    ne = {
        owned: null,
        cleanups: null,
        context: null,
        owner: null
    },
    re = {},
    k = null,
    A = null,
    ie = null,
    ae = null,
    j = null,
    M = null,
    N = null,
    oe = 0;

function se(e, t) {
    let n = j,
        r = k,
        i = e.length === 0,
        a = t === void 0 ? r : t,
        o = i ? ne : {
            owned: null,
            cleanups: null,
            context: a ? a.context : null,
            owner: a
        },
        s = i ? e : () => e(() => I(() => Ve(o)));
    k = o, j = null;
    try {
        return Pe(s, !0)
    } finally {
        j = n, k = r
    }
}

function P(e, t) {
    t = t ? Object.assign({}, E, t) : E;
    let n = {
        value: e,
        observers: null,
        observerSlots: null,
        comparator: t.equals || void 0
    };
    return [Oe.bind(n), e => (typeof e == `function` && (e = A && A.running && A.sources.has(n) ? e(n.tValue) : e(n.value)), ke(n, e))]
}

function ce(e, t, n) {
    let r = Me(e, t, !0, O);
    ie && A && A.running ? M.push(r) : Ae(r)
}

function le(e, t, n) {
    let r = Me(e, t, !1, O);
    ie && A && A.running ? M.push(r) : Ae(r)
}

function ue(e, t, n) {
    ee = Re;
    let r = Me(e, t, !1, O),
        i = De && Te(De);
    i && (r.suspense = i), (!n || !n.render) && (r.user = !0), N ? N.push(r) : Ae(r)
}

function F(e, t, n) {
    n = n ? Object.assign({}, E, n) : E;
    let r = Me(e, t, !0, 0);
    return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, ie && A && A.running ? (r.tState = O, M.push(r)) : Ae(r), Oe.bind(r)
}

function de(e) {
    return e && typeof e == `object` && `then` in e
}

function fe(e, t, n) {
    let r, i, a;
    typeof t == `function` ? (r = e, i = t, a = n || {}) : (r = !0, i = e, a = t || {});
    let o = null,
        s = re,
        c = null,
        l = !1,
        u = !1,
        d = `initialValue` in a,
        f = typeof r == `function` && F(r),
        p = new Set,
        [m, h] = (a.storage || P)(a.initialValue),
        [g, _] = P(void 0),
        [y, b] = P(void 0, {
            equals: !1
        }),
        [x, S] = P(d ? `ready` : `unresolved`);
    v.context && (c = v.getNextContextId(), a.ssrLoadFrom === `initial` ? s = a.initialValue : v.load && v.has(c) && (s = v.load(c)));

    function C(e, t, n, r) {
        return o === e && (o = null, r !== void 0 && (d = !0), (e === s || t === s) && a.onHydrated && queueMicrotask(() => a.onHydrated(r, {
            value: t
        })), s = re, A && e && l ? (A.promises.delete(e), l = !1, Pe(() => {
            A.running = !0, w(t, n)
        }, !1)) : w(t, n)), t
    }

    function w(e, t) {
        Pe(() => {
            t === void 0 && h(() => e), S(t === void 0 ? d ? `ready` : `unresolved` : `errored`), _(t);
            for (let e of p.keys()) e.decrement();
            p.clear()
        }, !1)
    }

    function T() {
        let e = De && Te(De),
            t = m(),
            n = g();
        if (n !== void 0 && !o) throw n;
        return j && !j.user && e && ce(() => {
            y(), o && (e.resolved && A && l ? A.promises.add(o) : p.has(e) || (e.increment(), p.add(e)))
        }), t
    }

    function E(e = !0) {
        if (e !== !1 && u) return;
        u = !1;
        let t = f ? f() : r;
        if (l = A && A.running, t == null || t === !1) {
            C(o, I(m));
            return
        }
        A && o && A.promises.delete(o);
        let n, a = s === re ? I(() => {
            try {
                return i(t, {
                    value: m(),
                    refetching: e
                })
            } catch (e) {
                n = e
            }
        }) : s;
        if (n !== void 0) {
            C(o, void 0, Ue(n), t);
            return
        } else if (!de(a)) return C(o, a, void 0, t), a;
        return o = a, `v` in a ? (a.s === 1 ? C(o, a.v, void 0, t) : C(o, void 0, Ue(a.v), t), a) : (u = !0, queueMicrotask(() => u = !1), Pe(() => {
            S(d ? `refreshing` : `pending`), b()
        }, !1), a.then(e => C(a, e, void 0, t), e => C(a, void 0, Ue(e), t)))
    }
    Object.defineProperties(T, {
        state: {
            get: () => x()
        },
        error: {
            get: () => g()
        },
        loading: {
            get() {
                let e = x();
                return e === `pending` || e === `refreshing`
            }
        },
        latest: {
            get() {
                if (!d) return T();
                let e = g();
                if (e && !o) throw e;
                return m()
            }
        }
    });
    let D = k;
    return f ? ce(() => (D = k, E(!1))) : E(!1), [T, {
        refetch: e => ye(D, () => E(e)),
        mutate: h
    }]
}

function pe(e, t) {
    let n, r = t ? t.timeoutMs : void 0,
        i = Me(() => ((!n || !n.fn) && (n = h(() => o(() => i.value), r === void 0 ? void 0 : {
            timeout: r
        })), e()), void 0, !0),
        [a, o] = P(A && A.running && A.sources.has(i) ? i.tValue : i.value, t);
    return Ae(i), o(() => A && A.running && A.sources.has(i) ? i.tValue : i.value), a
}

function me(e) {
    return Pe(e, !1)
}

function I(e) {
    if (!ae && j === null) return e();
    let t = j;
    j = null;
    try {
        return ae ? ae.untrack(e) : e()
    } finally {
        j = t
    }
}

function he(e, t, n) {
    let r = Array.isArray(e),
        i, a = n && n.defer;
    return n => {
        let o;
        if (r) {
            o = Array(e.length);
            for (let t = 0; t < e.length; t++) o[t] = e[t]()
        } else o = e();
        if (a) return a = !1, n;
        let s = I(() => t(o, i, n));
        return i = o, s
    }
}

function ge(e) {
    ue(() => I(e))
}

function L(e) {
    return k === null || (k.cleanups === null ? k.cleanups = [e] : k.cleanups.push(e)), e
}

function _e(e, t) {
    D ||= Symbol(`error`), k = Me(void 0, void 0, !0), k.context = { ...k.context,
        [D]: [t]
    }, A && A.running && A.sources.add(k);
    try {
        return e()
    } catch (e) {
        Ge(e)
    } finally {
        k = k.owner
    }
}

function ve() {
    return j
}

function ye(e, t) {
    let n = k,
        r = j;
    k = e, j = null;
    try {
        return Pe(t, !0)
    } catch (e) {
        Ge(e)
    } finally {
        k = n, j = r
    }
}

function be(e) {
    if (A && A.running) return e(), A.done;
    let t = j,
        n = k;
    return Promise.resolve().then(() => {
        j = t, k = n;
        let r;
        return (ie || De) && (r = A ||= {
            sources: new Set,
            effects: [],
            promises: new Set,
            disposed: new Set,
            queue: new Set,
            running: !0
        }, r.done ||= new Promise(e => r.resolve = e), r.running = !0), Pe(e, !1), j = k = null, r ? r.done : void 0
    })
}
var [xe, Se] = P(!1);

function Ce() {
    return [xe, be]
}

function we(e, t) {
    let n = Symbol(`context`);
    return {
        id: n,
        Provider: qe(n),
        defaultValue: e
    }
}

function Te(e) {
    let t;
    return k && k.context && (t = k.context[e.id]) !== void 0 ? t : e.defaultValue
}

function Ee(e) {
    let t = F(e),
        n = F(() => Ke(t()));
    return n.toArray = () => {
        let e = n();
        return Array.isArray(e) ? e : e == null ? [] : [e]
    }, n
}
var De;

function Oe() {
    let e = A && A.running;
    if (this.sources && (e ? this.tState : this.state))
        if ((e ? this.tState : this.state) === O) Ae(this);
        else {
            let e = M;
            M = null, Pe(() => ze(this), !1), M = e
        }
    if (j) {
        let e = this.observers;
        if (!e || e[e.length - 1] !== j) {
            let t = e ? e.length : 0;
            j.sources ? (j.sources.push(this), j.sourceSlots.push(t)) : (j.sources = [this], j.sourceSlots = [t]), e ? (e.push(j), this.observerSlots.push(j.sources.length - 1)) : (this.observers = [j], this.observerSlots = [j.sources.length - 1])
        }
    }
    return e && A.sources.has(this) ? this.tValue : this.value
}

function ke(e, t, n) {
    let r = A && A.running && A.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
        if (A) {
            let r = A.running;
            (r || !n && A.sources.has(e)) && (A.sources.add(e), e.tValue = t), r || (e.value = t)
        } else e.value = t;
        e.observers && e.observers.length && Pe(() => {
            for (let t = 0; t < e.observers.length; t += 1) {
                let n = e.observers[t],
                    r = A && A.running;
                r && A.disposed.has(n) || ((r ? !n.tState : !n.state) && (n.pure ? M.push(n) : N.push(n), n.observers && Be(n)), r ? n.tState = O : n.state = O)
            }
            if (M.length > 1e6) throw M = [], Error()
        }, !1)
    }
    return t
}

function Ae(e) {
    if (!e.fn) return;
    Ve(e);
    let t = oe;
    je(e, A && A.running && A.sources.has(e) ? e.tValue : e.value, t), A && !A.running && A.sources.has(e) && queueMicrotask(() => {
        Pe(() => {
            A && (A.running = !0), j = k = e, je(e, e.tValue, t), j = k = null
        }, !1)
    })
}

function je(e, t, n) {
    let r, i = k,
        a = j;
    j = k = e;
    try {
        r = e.fn(t)
    } catch (t) {
        return e.pure && (A && A.running ? (e.tState = O, e.tOwned && e.tOwned.forEach(Ve), e.tOwned = void 0) : (e.state = O, e.owned && e.owned.forEach(Ve), e.owned = null)), e.updatedAt = n + 1, Ge(t)
    } finally {
        j = a, k = i
    }(!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && `observers` in e ? ke(e, r, !0) : A && A.running && e.pure ? (A.sources.has(e) || (e.value = r), A.sources.add(e), e.tValue = r) : e.value = r, e.updatedAt = n)
}

function Me(e, t, n, r = O, i) {
    let a = {
        fn: e,
        state: r,
        updatedAt: null,
        owned: null,
        sources: null,
        sourceSlots: null,
        cleanups: null,
        value: t,
        owner: k,
        context: k ? k.context : null,
        pure: n
    };
    if (A && A.running && (a.state = 0, a.tState = r), k === null || k !== ne && (A && A.running && k.pure ? k.tOwned ? k.tOwned.push(a) : k.tOwned = [a] : k.owned ? k.owned.push(a) : k.owned = [a]), ae && a.fn) {
        let e = a.fn,
            [t, n] = P(void 0, {
                equals: !1
            }),
            r = ae.factory(e, n);
        L(() => r.dispose());
        let i, o = () => be(n).then(() => {
            i &&= (i.dispose(), void 0)
        });
        a.fn = n => (t(), A && A.running ? (i ||= ae.factory(e, o), i.track(n)) : r.track(n))
    }
    return a
}

function Ne(e) {
    let t = A && A.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === te) return ze(e);
    if (e.suspense && I(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (;
        (e = e.owner) && (!e.updatedAt || e.updatedAt < oe);) {
        if (t && A.disposed.has(e)) return;
        (t ? e.tState : e.state) && n.push(e)
    }
    for (let r = n.length - 1; r >= 0; r--) {
        if (e = n[r], t) {
            let t = e,
                i = n[r + 1];
            for (;
                (t = t.owner) && t !== i;)
                if (A.disposed.has(t)) return
        }
        if ((t ? e.tState : e.state) === O) Ae(e);
        else if ((t ? e.tState : e.state) === te) {
            let t = M;
            M = null, Pe(() => ze(e, n[0]), !1), M = t
        }
    }
}

function Pe(e, t) {
    if (M) return e();
    let n = !1;
    t || (M = []), N ? n = !0 : N = [], oe++;
    try {
        let t = e();
        return Fe(n), t
    } catch (e) {
        n || (N = null), M = null, Ge(e)
    }
}

function Fe(e) {
    if (M &&= (ie && A && A.running ? Le(M) : Ie(M), null), e) return;
    let t;
    if (A) {
        if (!A.promises.size && !A.queue.size) {
            let e = A.sources,
                n = A.disposed;
            N.push.apply(N, A.effects), t = A.resolve;
            for (let e of N) `tState` in e && (e.state = e.tState), delete e.tState;
            A = null, Pe(() => {
                for (let e of n) Ve(e);
                for (let t of e) {
                    if (t.value = t.tValue, t.owned)
                        for (let e = 0, n = t.owned.length; e < n; e++) Ve(t.owned[e]);
                    t.tOwned && (t.owned = t.tOwned), delete t.tValue, delete t.tOwned, t.tState = 0
                }
                Se(!1)
            }, !1)
        } else if (A.running) {
            A.running = !1, A.effects.push.apply(A.effects, N), N = null, Se(!0);
            return
        }
    }
    let n = N;
    N = null, n.length && Pe(() => ee(n), !1), t && t()
}

function Ie(e) {
    for (let t = 0; t < e.length; t++) Ne(e[t])
}

function Le(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t],
            r = A.queue;
        r.has(n) || (r.add(n), ie(() => {
            r.delete(n), Pe(() => {
                A.running = !0, Ne(n)
            }, !1), A && (A.running = !1)
        }))
    }
}

function Re(e) {
    let t, n = 0;
    for (t = 0; t < e.length; t++) {
        let r = e[t];
        r.user ? e[n++] = r : Ne(r)
    }
    if (v.context) {
        if (v.count) {
            v.effects ||= [], v.effects.push(...e.slice(0, n));
            return
        }
        b()
    }
    for (v.effects && (v.done || !v.count) && (e = [...v.effects, ...e], n += v.effects.length, delete v.effects), t = 0; t < n; t++) Ne(e[t])
}

function ze(e, t) {
    let n = A && A.running;
    n ? e.tState = 0 : e.state = 0;
    for (let r = 0; r < e.sources.length; r += 1) {
        let i = e.sources[r];
        if (i.sources) {
            let e = n ? i.tState : i.state;
            e === O ? i !== t && (!i.updatedAt || i.updatedAt < oe) && Ne(i) : e === te && ze(i, t)
        }
    }
}

function Be(e) {
    let t = A && A.running;
    for (let n = 0; n < e.observers.length; n += 1) {
        let r = e.observers[n];
        (t ? !r.tState : !r.state) && (t ? r.tState = te : r.state = te, r.pure ? M.push(r) : N.push(r), r.observers && Be(r))
    }
}

function Ve(e) {
    let t;
    if (e.sources)
        for (; e.sources.length;) {
            let t = e.sources.pop(),
                n = e.sourceSlots.pop(),
                r = t.observers;
            if (r && r.length) {
                let e = r.pop(),
                    i = t.observerSlots.pop();
                n < r.length && (e.sourceSlots[i] = n, r[n] = e, t.observerSlots[n] = i)
            }
        }
    if (e.tOwned) {
        for (t = e.tOwned.length - 1; t >= 0; t--) Ve(e.tOwned[t]);
        delete e.tOwned
    }
    if (A && A.running && e.pure) He(e, !0);
    else if (e.owned) {
        for (t = e.owned.length - 1; t >= 0; t--) Ve(e.owned[t]);
        e.owned = null
    }
    if (e.cleanups) {
        for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
        e.cleanups = null
    }
    A && A.running ? e.tState = 0 : e.state = 0
}

function He(e, t) {
    if (t || (e.tState = 0, A.disposed.add(e)), e.owned)
        for (let t = 0; t < e.owned.length; t++) He(e.owned[t])
}

function Ue(e) {
    return e instanceof Error ? e : Error(typeof e == `string` ? e : `Unknown error`, {
        cause: e
    })
}

function We(e, t, n) {
    try {
        for (let n of t) n(e)
    } catch (e) {
        Ge(e, n && n.owner || null)
    }
}

function Ge(e, t = k) {
    let n = D && t && t.context && t.context[D],
        r = Ue(e);
    if (!n) throw r;
    N ? N.push({
        fn() {
            We(r, n, t)
        },
        state: O
    }) : We(r, n, t)
}

function Ke(e) {
    if (typeof e == `function` && !e.length) return Ke(e());
    if (Array.isArray(e)) {
        let t = [];
        for (let n = 0; n < e.length; n++) {
            let r = Ke(e[n]);
            if (Array.isArray(r))
                if (r.length < 32768) t.push.apply(t, r);
                else
                    for (let e = 0; e < r.length; e++) t.push(r[e]);
            else t.push(r)
        }
        return t
    }
    return e
}

function qe(e, t) {
    return function(t) {
        let n;
        return le(() => n = I(() => (k.context = { ...k.context,
            [e]: t.value
        }, Ee(() => t.children))), void 0), n
    }
}
var Je = Symbol(`fallback`);

function Ye(e) {
    for (let t = 0; t < e.length; t++) e[t]()
}

function Xe(e, t, n = {}) {
    let r = [],
        i = [],
        a = [],
        o = 0,
        s = t.length > 1 ? [] : null;
    return L(() => Ye(a)), () => {
        let c = e() || [],
            l = c.length,
            u, d;
        return c[T], I(() => {
            let e, t, p, m, h, g, _, v, y;
            if (l === 0) o !== 0 && (Ye(a), a = [], r = [], i = [], o = 0, s &&= []), n.fallback && (r = [Je], i[0] = se(e => (a[0] = e, n.fallback())), o = 1);
            else if (o === 0) {
                for (i = Array(l), d = 0; d < l; d++) r[d] = c[d], i[d] = se(f);
                o = l
            } else {
                for (p = Array(l), m = Array(l), s && (h = Array(l)), g = 0, _ = Math.min(o, l); g < _ && r[g] === c[g]; g++);
                for (_ = o - 1, v = l - 1; _ >= g && v >= g && r[_] === c[v]; _--, v--) p[v] = i[_], m[v] = a[_], s && (h[v] = s[_]);
                for (e = new Map, t = Array(v + 1), d = v; d >= g; d--) y = c[d], u = e.get(y), t[d] = u === void 0 ? -1 : u, e.set(y, d);
                for (u = g; u <= _; u++) y = r[u], d = e.get(y), d !== void 0 && d !== -1 ? (p[d] = i[u], m[d] = a[u], s && (h[d] = s[u]), d = t[d], e.set(y, d)) : a[u]();
                for (d = g; d < l; d++) d in p ? (i[d] = p[d], a[d] = m[d], s && (s[d] = h[d], s[d](d))) : i[d] = se(f);
                i = i.slice(0, o = l), r = c.slice(0)
            }
            return i
        });

        function f(e) {
            if (a[d] = e, s) {
                let [e, n] = P(d);
                return s[d] = n, t(c[d], e)
            }
            return t(c[d])
        }
    }
}

function Ze(e, t, n = {}) {
    let r = [],
        i = [],
        a = [],
        o = [],
        s = 0,
        c;
    return L(() => Ye(a)), () => {
        let l = e() || [],
            u = l.length;
        return l[T], I(() => {
            if (u === 0) return s !== 0 && (Ye(a), a = [], r = [], i = [], s = 0, o = []), n.fallback && (r = [Je], i[0] = se(e => (a[0] = e, n.fallback())), s = 1), i;
            for (r[0] === Je && (a[0](), a = [], r = [], i = [], s = 0), c = 0; c < u; c++) c < r.length && r[c] !== l[c] ? o[c](() => l[c]) : c >= r.length && (i[c] = se(d));
            for (; c < r.length; c++) a[c]();
            return s = o.length = a.length = u, r = l.slice(0), i = i.slice(0, s)
        });

        function d(e) {
            a[c] = e;
            let [n, r] = P(l[c]);
            return o[c] = r, t(n, c)
        }
    }
}
var Qe = !1;

function $e(e, t) {
    if (Qe && v.context) {
        let n = v.context;
        b(x());
        let r = I(() => e(t || {}));
        return b(n), r
    }
    return I(() => e(t || {}))
}

function et() {
    return !0
}
var tt = {
    get(e, t, n) {
        return t === C ? n : e.get(t)
    },
    has(e, t) {
        return t === C ? !0 : e.has(t)
    },
    set: et,
    deleteProperty: et,
    getOwnPropertyDescriptor(e, t) {
        return {
            configurable: !0,
            enumerable: !0,
            get() {
                return e.get(t)
            },
            set: et,
            deleteProperty: et
        }
    },
    ownKeys(e) {
        return e.keys()
    }
};

function nt(e) {
    return (e = typeof e == `function` ? e() : e) ? e : {}
}

function rt() {
    for (let e = 0, t = this.length; e < t; ++e) {
        let t = this[e]();
        if (t !== void 0) return t
    }
}

function it(...e) {
    let t = !1;
    for (let n = 0; n < e.length; n++) {
        let r = e[n];
        t ||= !!r && C in r, e[n] = typeof r == `function` ? (t = !0, F(r)) : r
    }
    if (w && t) return new Proxy({
        get(t) {
            for (let n = e.length - 1; n >= 0; n--) {
                let r = nt(e[n])[t];
                if (r !== void 0) return r
            }
        },
        has(t) {
            for (let n = e.length - 1; n >= 0; n--)
                if (t in nt(e[n])) return !0;
            return !1
        },
        keys() {
            let t = [];
            for (let n = 0; n < e.length; n++) t.push(...Object.keys(nt(e[n])));
            return [...new Set(t)]
        }
    }, tt);
    let n = {},
        r = Object.create(null);
    for (let t = e.length - 1; t >= 0; t--) {
        let i = e[t];
        if (!i) continue;
        let a = Object.getOwnPropertyNames(i);
        for (let e = a.length - 1; e >= 0; e--) {
            let t = a[e];
            if (t === `__proto__` || t === `constructor`) continue;
            let o = Object.getOwnPropertyDescriptor(i, t);
            if (!r[t]) r[t] = o.get ? {
                enumerable: !0,
                configurable: !0,
                get: rt.bind(n[t] = [o.get.bind(i)])
            } : o.value === void 0 ? void 0 : o;
            else {
                let e = n[t];
                e && (o.get ? e.push(o.get.bind(i)) : o.value !== void 0 && e.push(() => o.value))
            }
        }
    }
    let i = {},
        a = Object.keys(r);
    for (let e = a.length - 1; e >= 0; e--) {
        let t = a[e],
            n = r[t];
        n && n.get ? Object.defineProperty(i, t, n) : i[t] = n ? n.value : void 0
    }
    return i
}

function at(e, ...t) {
    let n = t.length;
    if (w && C in e) {
        let r = n > 1 ? t.flat() : t[0],
            i = t.map(t => new Proxy({
                get(n) {
                    return t.includes(n) ? e[n] : void 0
                },
                has(n) {
                    return t.includes(n) && n in e
                },
                keys() {
                    return t.filter(t => t in e)
                }
            }, tt));
        return i.push(new Proxy({
            get(t) {
                return r.includes(t) ? void 0 : e[t]
            },
            has(t) {
                return r.includes(t) ? !1 : t in e
            },
            keys() {
                return Object.keys(e).filter(e => !r.includes(e))
            }
        }, tt)), i
    }
    let r = [];
    for (let e = 0; e <= n; e++) r[e] = {};
    for (let i of Object.getOwnPropertyNames(e)) {
        let a = n;
        for (let e = 0; e < t.length; e++)
            if (t[e].includes(i)) {
                a = e;
                break
            }
        let o = Object.getOwnPropertyDescriptor(e, i);
        !o.get && !o.set && o.enumerable && o.writable && o.configurable ? r[a][i] = o.value : Object.defineProperty(r[a], i, o)
    }
    return r
}
var ot = 0;

function st() {
    return v.context ? v.getNextContextId() : `cl-${ot++}`
}
var ct = e => `Stale read from <${e}>.`;

function lt(e) {
    let t = `fallback` in e && {
        fallback: () => e.fallback
    };
    return F(Xe(() => e.each, e.children, t || void 0))
}

function ut(e) {
    let t = `fallback` in e && {
        fallback: () => e.fallback
    };
    return F(Ze(() => e.each, e.children, t || void 0))
}

function dt(e) {
    let t = e.keyed,
        n = F(() => e.when, void 0, void 0),
        r = t ? n : F(n, void 0, {
            equals: (e, t) => !e == !t
        });
    return F(() => {
        let i = r();
        if (i) {
            let a = e.children;
            return typeof a == `function` && a.length > 0 ? I(() => a(t ? i : () => {
                if (!I(r)) throw ct(`Show`);
                return n()
            })) : a
        }
        return e.fallback
    }, void 0, void 0)
}

function ft(e) {
    let t = Ee(() => e.children),
        n = F(() => {
            let e = t(),
                n = Array.isArray(e) ? e : [e],
                r = () => void 0;
            for (let e = 0; e < n.length; e++) {
                let t = e,
                    i = n[e],
                    a = r,
                    o = F(() => a() ? void 0 : i.when, void 0, void 0),
                    s = i.keyed ? o : F(o, void 0, {
                        equals: (e, t) => !e == !t
                    });
                r = () => a() || (s() ? [t, o, i] : void 0)
            }
            return r
        });
    return F(() => {
        let t = n()();
        if (!t) return e.fallback;
        let [r, i, a] = t, o = a.children;
        return typeof o == `function` && o.length > 0 ? I(() => o(a.keyed ? i() : () => {
            if (I(n)() ?.[0] !== r) throw ct(`Match`);
            return i()
        })) : o
    }, void 0, void 0)
}

function pt(e) {
    return e
}
var mt;

function ht(e) {
    let t;
    v.context && v.load && (t = v.load(v.getContextId()));
    let [n, r] = P(t, void 0);
    return mt ||= new Set, mt.add(r), L(() => mt.delete(r)), F(() => {
        let t;
        if (t = n()) {
            let n = e.fallback;
            return typeof n == `function` && n.length ? I(() => n(t, () => r())) : n
        }
        return _e(() => e.children, r)
    }, void 0, void 0)
}
var gt = Symbol(`store-raw`),
    _t = Symbol(`store-node`),
    vt = Symbol(`store-has`),
    yt = Symbol(`store-self`);

function bt(e) {
    let t = e[C];
    if (!t && (Object.defineProperty(e, C, {
            value: t = new Proxy(e, Ot)
        }), !Array.isArray(e))) {
        let n = Object.keys(e),
            r = Object.getOwnPropertyDescriptors(e),
            i = Object.getPrototypeOf(e),
            a = i !== null && typeof e == `object` && !!e && !Array.isArray(e) && i !== Object.prototype;
        if (a) {
            let e = Object.getOwnPropertyDescriptors(i);
            n.push(...Object.keys(e)), Object.assign(r, e)
        }
        for (let i = 0, o = n.length; i < o; i++) {
            let o = n[i];
            a && o === `constructor` || r[o].get && Object.defineProperty(e, o, {
                configurable: !0,
                enumerable: r[o].enumerable,
                get: r[o].get.bind(t)
            })
        }
    }
    return t
}

function xt(e) {
    let t;
    return typeof e == `object` && !!e && (e[C] || !(t = Object.getPrototypeOf(e)) || t === Object.prototype || Array.isArray(e))
}

function St(e, t = new Set) {
    let n, r, i, a;
    if (n = e != null && e[gt]) return n;
    if (!xt(e) || t.has(e)) return e;
    if (Array.isArray(e)) {
        Object.isFrozen(e) ? e = e.slice(0) : t.add(e);
        for (let n = 0, a = e.length; n < a; n++) i = e[n], (r = St(i, t)) !== i && (e[n] = r)
    } else {
        Object.isFrozen(e) ? e = Object.assign({}, e) : t.add(e);
        let n = Object.keys(e),
            o = Object.getOwnPropertyDescriptors(e);
        for (let s = 0, c = n.length; s < c; s++) a = n[s], !o[a].get && (i = e[a], (r = St(i, t)) !== i && (e[a] = r))
    }
    return e
}

function Ct(e, t) {
    let n = e[t];
    return n || Object.defineProperty(e, t, {
        value: n = Object.create(null)
    }), n
}

function wt(e, t, n) {
    if (e[t]) return e[t];
    let [r, i] = P(n, {
        equals: !1,
        internal: !0
    });
    return r.$ = i, e[t] = r
}

function Tt(e, t) {
    let n = Reflect.getOwnPropertyDescriptor(e, t);
    return !n || n.get || !n.configurable || t === C || t === _t ? n : (delete n.value, delete n.writable, n.get = () => e[C][t], n)
}

function Et(e) {
    ve() && wt(Ct(e, _t), yt)()
}

function Dt(e) {
    return Et(e), Reflect.ownKeys(e)
}
var Ot = {
    get(e, t, n) {
        if (t === gt) return e;
        if (t === C) return n;
        if (t === T) return Et(e), n;
        let r = Ct(e, _t),
            i = r[t],
            a = i ? i() : e[t];
        if (t === _t || t === vt || t === `__proto__`) return a;
        if (!i) {
            let n = Object.getOwnPropertyDescriptor(e, t);
            ve() && (typeof a != `function` || e.hasOwnProperty(t)) && !(n && n.get) && (a = wt(r, t, a)())
        }
        return xt(a) ? bt(a) : a
    },
    has(e, t) {
        return t === gt || t === C || t === T || t === _t || t === vt || t === `__proto__` ? !0 : (ve() && wt(Ct(e, vt), t)(), t in e)
    },
    set() {
        return !0
    },
    deleteProperty() {
        return !0
    },
    ownKeys: Dt,
    getOwnPropertyDescriptor: Tt
};

function kt(e, t, n, r = !1) {
    if (t === `__proto__` || !r && e[t] === n) return;
    let i = e[t],
        a = e.length;
    n === void 0 ? (delete e[t], e[vt] && e[vt][t] && i !== void 0 && e[vt][t].$()) : (e[t] = n, e[vt] && e[vt][t] && i === void 0 && e[vt][t].$());
    let o = Ct(e, _t),
        s;
    if ((s = wt(o, t, i)) && s.$(() => n), Array.isArray(e) && e.length !== a) {
        for (let t = e.length; t < a; t++)(s = o[t]) && s.$();
        (s = wt(o, `length`, a)) && s.$(e.length)
    }(s = o[yt]) && s.$()
}

function At(e, t) {
    let n = Object.keys(t);
    for (let r = 0; r < n.length; r += 1) {
        let i = n[r];
        jt(i) || kt(e, i, t[i])
    }
}

function jt(e) {
    return e === `__proto__` || e === `constructor` || e === `prototype`
}

function Mt(e, t) {
    if (typeof t == `function` && (t = t(e)), t = St(t), Array.isArray(t)) {
        if (e === t) return;
        let n = 0,
            r = t.length;
        for (; n < r; n++) {
            let r = t[n];
            e[n] !== r && kt(e, n, r)
        }
        kt(e, `length`, r)
    } else At(e, t)
}

function Nt(e, t, n = []) {
    let r, i = e;
    if (t.length > 1) {
        r = t.shift();
        let a = typeof r,
            o = Array.isArray(e);
        if (a === `string` && (r === `__proto__` || t.length > 1 && jt(r))) return;
        if (Array.isArray(r)) {
            for (let i = 0; i < r.length; i++) Nt(e, [r[i]].concat(t), n);
            return
        } else if (o && a === `function`) {
            for (let i = 0; i < e.length; i++) r(e[i], i) && Nt(e, [i].concat(t), n);
            return
        } else if (o && a === `object`) {
            let {
                from: i = 0,
                to: a = e.length - 1,
                by: o = 1
            } = r;
            for (let r = i; r <= a; r += o) Nt(e, [r].concat(t), n);
            return
        } else if (t.length > 1) {
            Nt(e[r], t, [r].concat(n));
            return
        }
        i = e[r], n = [r].concat(n)
    }
    let a = t[0];
    typeof a == `function` && (a = a(i, n), a === i) || r === void 0 && a == null || (a = St(a), r === void 0 || xt(i) && xt(a) && !Array.isArray(a) ? At(i, a) : kt(e, r, a))
}

function Pt(...[e, t]) {
    let n = St(e || {}),
        r = Array.isArray(n),
        i = bt(n);

    function a(...e) {
        me(() => {
            r && e.length === 1 ? Mt(n, e[0]) : Nt(n, e)
        })
    }
    return [i, a]
}
var Ft = Symbol(`store-root`);

function It(e) {
    return e === `__proto__` || e === `constructor` || e === `prototype`
}

function Lt(e, t, n, r, i) {
    if (It(n)) return;
    let a = t[n];
    if (e === a) return;
    let o = Array.isArray(e);
    if (n !== Ft && (!xt(e) || !xt(a) || o !== Array.isArray(a) || i && e[i] !== a[i])) {
        kt(t, n, e);
        return
    }
    if (o) {
        if (e.length && a.length && (!r || i && e[0] && e[0][i] != null)) {
            let t, n, o, s, c, l, u, d;
            for (o = 0, s = Math.min(a.length, e.length); o < s && (a[o] === e[o] || i && a[o] && e[o] && a[o][i] && a[o][i] === e[o][i]); o++) Lt(e[o], a, o, r, i);
            let f = Array(e.length),
                p = new Map;
            for (s = a.length - 1, c = e.length - 1; s >= o && c >= o && (a[s] === e[c] || i && a[s] && e[c] && a[s][i] && a[s][i] === e[c][i]); s--, c--) f[c] = a[s];
            if (o > c || o > s) {
                for (n = o; n <= c; n++) kt(a, n, e[n]);
                for (; n < e.length; n++) kt(a, n, f[n]), Lt(e[n], a, n, r, i);
                a.length > e.length && kt(a, `length`, e.length);
                return
            }
            for (u = Array(c + 1), n = c; n >= o; n--) l = e[n], d = i && l ? l[i] : l, t = p.get(d), u[n] = t === void 0 ? -1 : t, p.set(d, n);
            for (t = o; t <= s; t++) l = a[t], d = i && l ? l[i] : l, n = p.get(d), n !== void 0 && n !== -1 && (f[n] = a[t], n = u[n], p.set(d, n));
            for (n = o; n < e.length; n++) n in f ? (kt(a, n, f[n]), Lt(e[n], a, n, r, i)) : kt(a, n, e[n])
        } else
            for (let t = 0, n = e.length; t < n; t++) Lt(e[t], a, t, r, i);
        a.length > e.length && kt(a, `length`, e.length);
        return
    }
    let s = Object.keys(e);
    for (let t = 0, n = s.length; t < n; t++) It(s[t]) || Lt(e[s[t]], a, s[t], r, i);
    let c = Object.keys(a);
    for (let t = 0, n = c.length; t < n; t++) e[c[t]] === void 0 && kt(a, c[t], void 0)
}

function Rt(e, t = {}) {
    let {
        merge: n,
        key: r = `id`
    } = t, i = St(e);
    return e => {
        if (!xt(e) || !xt(i)) return i;
        let t = Lt(i, {
            [Ft]: e
        }, Ft, n, r);
        return t === void 0 ? e : t
    }
}
var zt = class {
        constructor() {
            this.listeners = new Set, this.subscribe = this.subscribe.bind(this)
        }
        subscribe(e) {
            return this.listeners.add(e), this.onSubscribe(), () => {
                this.listeners.delete(e), this.onUnsubscribe()
            }
        }
        hasListeners() {
            return this.listeners.size > 0
        }
        onSubscribe() {}
        onUnsubscribe() {}
    },
    Bt = new class extends zt {#e;#t;#n;
        constructor() {
            super(), this.#n = e => {
                if (typeof window < `u` && window.addEventListener) {
                    let t = () => e();
                    return window.addEventListener(`visibilitychange`, t, !1), () => {
                        window.removeEventListener(`visibilitychange`, t)
                    }
                }
            }
        }
        onSubscribe() {
            this.#t || this.setEventListener(this.#n)
        }
        onUnsubscribe() {
            this.hasListeners() || (this.#t ?.(), this.#t = void 0)
        }
        setEventListener(e) {
            this.#n = e, this.#t ?.(), this.#t = e(e => {
                typeof e == `boolean` ? this.setFocused(e) : this.onFocus()
            })
        }
        setFocused(e) {
            this.#e !== e && (this.#e = e, this.onFocus())
        }
        onFocus() {
            let e = this.isFocused();
            this.listeners.forEach(t => {
                t(e)
            })
        }
        isFocused() {
            return typeof this.#e == `boolean` ? this.#e : globalThis.document ?.visibilityState !== `hidden`
        }
    },
    Vt = {
        setTimeout: (e, t) => setTimeout(e, t),
        clearTimeout: e => clearTimeout(e),
        setInterval: (e, t) => setInterval(e, t),
        clearInterval: e => clearInterval(e)
    },
    Ht = new class {#e = Vt;
        setTimeoutProvider(e) {
            this.#e = e
        }
        setTimeout(e, t) {
            return this.#e.setTimeout(e, t)
        }
        clearTimeout(e) {
            this.#e.clearTimeout(e)
        }
        setInterval(e, t) {
            return this.#e.setInterval(e, t)
        }
        clearInterval(e) {
            this.#e.clearInterval(e)
        }
    };

function Ut(e) {
    setTimeout(e, 0)
}
var Wt = typeof window > `u` || `Deno` in globalThis;

function Gt() {}

function Kt(e, t) {
    return typeof e == `function` ? e(t) : e
}

function qt(e) {
    return typeof e == `number` && e >= 0 && e !== 1 / 0
}

function Jt(e, t) {
    return Math.max(e + (t || 0) - Date.now(), 0)
}

function Yt(e, t) {
    return typeof e == `function` ? e(t) : e
}

function Xt(e, t) {
    return typeof e == `function` ? e(t) : e
}

function Zt(e, t) {
    let {
        type: n = `all`,
        exact: r,
        fetchStatus: i,
        predicate: a,
        queryKey: o,
        stale: s
    } = e;
    if (o) {
        if (r) {
            if (t.queryHash !== $t(o, t.options)) return !1
        } else if (!tn(t.queryKey, o)) return !1
    }
    if (n !== `all`) {
        let e = t.isActive();
        if (n === `active` && !e || n === `inactive` && e) return !1
    }
    return !(typeof s == `boolean` && t.isStale() !== s || i && i !== t.state.fetchStatus || a && !a(t))
}

function Qt(e, t) {
    let {
        exact: n,
        status: r,
        predicate: i,
        mutationKey: a
    } = e;
    if (a) {
        if (!t.options.mutationKey) return !1;
        if (n) {
            if (en(t.options.mutationKey) !== en(a)) return !1
        } else if (!tn(t.options.mutationKey, a)) return !1
    }
    return !(r && t.state.status !== r || i && !i(t))
}

function $t(e, t) {
    return (t ?.queryKeyHashFn || en)(e)
}

function en(e) {
    return JSON.stringify(e, (e, t) => sn(t) ? Object.keys(t).sort().reduce((e, n) => (e[n] = t[n], e), {}) : t)
}

function tn(e, t) {
    return e === t ? !0 : typeof e == typeof t && e && t && typeof e == `object` && typeof t == `object` ? Object.keys(t).every(n => tn(e[n], t[n])) : !1
}
var nn = Object.prototype.hasOwnProperty;

function rn(e, t, n = 0) {
    if (e === t) return e;
    if (n > 500) return t;
    let r = on(e) && on(t);
    if (!r && !(sn(e) && sn(t))) return t;
    let i = (r ? e : Object.keys(e)).length,
        a = r ? t : Object.keys(t),
        o = a.length,
        s = r ? Array(o) : {},
        c = 0;
    for (let l = 0; l < o; l++) {
        let o = r ? l : a[l],
            u = e[o],
            d = t[o];
        if (u === d) {
            s[o] = u, (r ? l < i : nn.call(e, o)) && c++;
            continue
        }
        if (u === null || d === null || typeof u != `object` || typeof d != `object`) {
            s[o] = d;
            continue
        }
        let f = rn(u, d, n + 1);
        s[o] = f, f === u && c++
    }
    return i === o && c === i ? e : s
}

function an(e, t) {
    if (!t || Object.keys(e).length !== Object.keys(t).length) return !1;
    for (let n in e)
        if (e[n] !== t[n]) return !1;
    return !0
}

function on(e) {
    return Array.isArray(e) && e.length === Object.keys(e).length
}

function sn(e) {
    if (!cn(e)) return !1;
    let t = e.constructor;
    if (t === void 0) return !0;
    let n = t.prototype;
    return !(!cn(n) || !n.hasOwnProperty(`isPrototypeOf`) || Object.getPrototypeOf(e) !== Object.prototype)
}

function cn(e) {
    return Object.prototype.toString.call(e) === `[object Object]`
}

function ln(e) {
    return new Promise(t => {
        Ht.setTimeout(t, e)
    })
}

function un(e, t, n) {
    return typeof n.structuralSharing == `function` ? n.structuralSharing(e, t) : n.structuralSharing === !1 ? t : rn(e, t)
}

function dn(e, t, n = 0) {
    let r = [...e, t];
    return n && r.length > n ? r.slice(1) : r
}

function fn(e, t, n = 0) {
    let r = [t, ...e];
    return n && r.length > n ? r.slice(0, -1) : r
}
var pn = Symbol();

function mn(e, t) {
    return !e.queryFn && t ?.initialPromise ? () => t.initialPromise : !e.queryFn || e.queryFn === pn ? () => Promise.reject(Error(`Missing queryFn: '${e.queryHash}'`)) : e.queryFn
}

function hn(e, t) {
    return typeof e == `function` ? e(...t) : !!e
}

function gn(e, t, n) {
    let r = !1,
        i;
    return Object.defineProperty(e, `signal`, {
        enumerable: !0,
        get: () => (i ??= t(), r ? i : (r = !0, i.aborted ? n() : i.addEventListener(`abort`, n, {
            once: !0
        }), i))
    }), e
}
var _n = (() => {
    let e = () => Wt;
    return {
        isServer() {
            return e()
        },
        setIsServer(t) {
            e = t
        }
    }
})();

function vn() {
    let e, t, n = new Promise((n, r) => {
        e = n, t = r
    });
    n.status = `pending`, n.catch(() => {});

    function r(e) {
        Object.assign(n, e), delete n.resolve, delete n.reject
    }
    return n.resolve = t => {
        r({
            status: `fulfilled`,
            value: t
        }), e(t)
    }, n.reject = e => {
        r({
            status: `rejected`,
            reason: e
        }), t(e)
    }, n
}

function yn(e) {
    let t;
    if (e.then(e => (t = e, e), Gt) ?.catch(Gt), t !== void 0) return {
        data: t
    }
}

function bn(e) {
    return e
}

function xn(e, t, n) {
    if (typeof t != `object` || !t) return;
    let r = e.getMutationCache(),
        i = e.getQueryCache(),
        a = n ?.defaultOptions ?.deserializeData ?? e.getDefaultOptions().hydrate ?.deserializeData ?? bn,
        o = t.mutations || [],
        s = t.queries || [];
    o.forEach(({
        state: t,
        ...i
    }) => {
        r.build(e, { ...e.getDefaultOptions().hydrate ?.mutations,
            ...n ?.defaultOptions ?.mutations,
            ...i
        }, t)
    }), s.forEach(({
        queryKey: t,
        state: r,
        queryHash: o,
        meta: s,
        promise: c,
        dehydratedAt: l,
        queryType: u
    }) => {
        let d = c ? yn(c) : void 0,
            f = r.data === void 0 ? d ?.data : r.data,
            p = f === void 0 ? f : a(f),
            m = i.get(o),
            h = m ?.state.status === `pending`,
            g = m ?.state.fetchStatus === `fetching`;
        if (m) {
            let e = d && l !== void 0 && l > m.state.dataUpdatedAt;
            if (r.dataUpdatedAt > m.state.dataUpdatedAt || e) {
                let {
                    fetchStatus: e,
                    ...t
                } = r;
                m.setState({ ...t,
                    data: p,
                    ...r.status === `pending` && p !== void 0 && {
                        status: `success`,
                        ...!g && {
                            fetchStatus: `idle`
                        }
                    }
                })
            }
        } else m = i.build(e, { ...e.getDefaultOptions().hydrate ?.queries,
            ...n ?.defaultOptions ?.queries,
            queryKey : t,
            queryHash : o,
            meta : s,
            _type: u
        }, { ...r,
            data: p,
            fetchStatus: `idle`,
            status: r.status === `pending` && p !== void 0 ? `success` : r.status
        });
        c && !d && !h && !g && (l === void 0 || l > m.state.dataUpdatedAt) && m.fetch(void 0, {
            initialPromise: Promise.resolve(c).then(a)
        }).catch(Gt)
    })
}
var Sn = Ut;

function Cn() {
    let e = [],
        t = 0,
        n = e => {
            e()
        },
        r = e => {
            e()
        },
        i = Sn,
        a = r => {
            t ? e.push(r) : i(() => {
                n(r)
            })
        },
        o = () => {
            let t = e;
            e = [], t.length && i(() => {
                r(() => {
                    t.forEach(e => {
                        n(e)
                    })
                })
            })
        };
    return {
        batch: e => {
            let n;
            t++;
            try {
                n = e()
            } finally {
                t--, t || o()
            }
            return n
        },
        batchCalls: e => (...t) => {
            a(() => {
                e(...t)
            })
        },
        schedule: a,
        setNotifyFunction: e => {
            n = e
        },
        setBatchNotifyFunction: e => {
            r = e
        },
        setScheduler: e => {
            i = e
        }
    }
}
var R = Cn(),
    wn = new class extends zt {#e = !0;#t;#n;
        constructor() {
            super(), this.#n = e => {
                if (typeof window < `u` && window.addEventListener) {
                    let t = () => e(!0),
                        n = () => e(!1);
                    return window.addEventListener(`online`, t, !1), window.addEventListener(`offline`, n, !1), () => {
                        window.removeEventListener(`online`, t), window.removeEventListener(`offline`, n)
                    }
                }
            }
        }
        onSubscribe() {
            this.#t || this.setEventListener(this.#n)
        }
        onUnsubscribe() {
            this.hasListeners() || (this.#t ?.(), this.#t = void 0)
        }
        setEventListener(e) {
            this.#n = e, this.#t ?.(), this.#t = e(this.setOnline.bind(this))
        }
        setOnline(e) {
            this.#e !== e && (this.#e = e, this.listeners.forEach(t => {
                t(e)
            }))
        }
        isOnline() {
            return this.#e
        }
    };

function Tn(e) {
    return Math.min(1e3 * 2 ** e, 3e4)
}

function En(e) {
    return (e ?? `online`) === `online` ? wn.isOnline() : !0
}
var Dn = class extends Error {
    constructor(e) {
        super(`CancelledError`), this.revert = e ?.revert, this.silent = e ?.silent
    }
};

function On(e) {
    let t = !1,
        n = 0,
        r, i = vn(),
        a = () => i.status !== `pending`,
        o = t => {
            if (!a()) {
                let n = new Dn(t);
                f(n), e.onCancel ?.(n)
            }
        },
        s = () => {
            t = !0
        },
        c = () => {
            t = !1
        },
        l = () => Bt.isFocused() && (e.networkMode === `always` || wn.isOnline()) && e.canRun(),
        u = () => En(e.networkMode) && e.canRun(),
        d = e => {
            a() || (r ?.(), i.resolve(e))
        },
        f = e => {
            a() || (r ?.(), i.reject(e))
        },
        p = () => new Promise(t => {
            r = e => {
                (a() || l()) && t(e)
            }, e.onPause ?.()
        }).then(() => {
            r = void 0, a() || e.onContinue ?.()
        }),
        m = () => {
            if (a()) return;
            let r, i = n === 0 ? e.initialPromise : void 0;
            try {
                r = i ?? e.fn()
            } catch (e) {
                r = Promise.reject(e)
            }
            Promise.resolve(r).then(d).catch(r => {
                if (a()) return;
                let i = e.retry ?? (_n.isServer() ? 0 : 3),
                    o = e.retryDelay ?? Tn,
                    s = typeof o == `function` ? o(n, r) : o,
                    c = i === !0 || typeof i == `number` && n < i || typeof i == `function` && i(n, r);
                if (t || !c) {
                    f(r);
                    return
                }
                n++, e.onFail ?.(n, r), ln(s).then(() => l() ? void 0 : p()).then(() => {
                    t ? f(r) : m()
                })
            })
        };
    return {
        promise: i,
        status: () => i.status,
        cancel: o,
        continue: () => (r ?.(), i),
        cancelRetry: s,
        continueRetry: c,
        canStart: u,
        start: () => (u() ? m() : p().then(m), i)
    }
}
var kn = class {#e;
    destroy() {
        this.clearGcTimeout()
    }
    scheduleGc() {
        this.clearGcTimeout(), qt(this.gcTime) && (this.#e = Ht.setTimeout(() => {
            this.optionalRemove()
        }, this.gcTime))
    }
    updateGcTime(e) {
        this.gcTime = Math.max(this.gcTime || 0, e ?? (_n.isServer() ? 1 / 0 : 300 * 1e3))
    }
    clearGcTimeout() {
        this.#e !== void 0 && (Ht.clearTimeout(this.#e), this.#e = void 0)
    }
};

function An(e) {
    return {
        onFetch: (t, n) => {
            let r = t.options,
                i = t.fetchOptions ?.meta ?.fetchMore ?.direction,
                a = t.state.data ?.pages || [],
                o = t.state.data ?.pageParams || [],
                s = {
                    pages: [],
                    pageParams: []
                },
                c = 0,
                l = async () => {
                    let n = !1,
                        l = e => {
                            gn(e, () => t.signal, () => n = !0)
                        },
                        u = mn(t.options, t.fetchOptions),
                        d = async (e, r, i) => {
                            if (n) return Promise.reject(t.signal.reason);
                            if (r == null && e.pages.length) return Promise.resolve(e);
                            let a = await u((() => {
                                    let e = {
                                        client: t.client,
                                        queryKey: t.queryKey,
                                        pageParam: r,
                                        direction: i ? `backward` : `forward`,
                                        meta: t.options.meta
                                    };
                                    return l(e), e
                                })()),
                                {
                                    maxPages: o
                                } = t.options,
                                s = i ? fn : dn;
                            return {
                                pages: s(e.pages, a, o),
                                pageParams: s(e.pageParams, r, o)
                            }
                        };
                    if (i && a.length) {
                        let e = i === `backward`,
                            t = e ? Mn : jn,
                            n = {
                                pages: a,
                                pageParams: o
                            };
                        s = await d(n, t(r, n), e)
                    } else {
                        let t = e ?? a.length;
                        do {
                            let e = c === 0 ? o[0] ?? r.initialPageParam : jn(r, s);
                            if (c > 0 && e == null) break;
                            s = await d(s, e), c++
                        } while (c < t)
                    }
                    return s
                };
            t.options.persister ? t.fetchFn = () => t.options.persister ?.(l, {
                client: t.client,
                queryKey: t.queryKey,
                meta: t.options.meta,
                signal: t.signal
            }, n) : t.fetchFn = l
        }
    }
}

function jn(e, {
    pages: t,
    pageParams: n
}) {
    let r = t.length - 1;
    return t.length > 0 ? e.getNextPageParam(t[r], t, n[r], n) : void 0
}

function Mn(e, {
    pages: t,
    pageParams: n
}) {
    return t.length > 0 ? e.getPreviousPageParam ?.(t[0], t, n[0], n) : void 0
}

function Nn(e, t) {
    return t ? jn(e, t) != null : !1
}

function Pn(e, t) {
    return !t || !e.getPreviousPageParam ? !1 : Mn(e, t) != null
}
var Fn = class extends kn {#e;#t;#n;#r;#i;#a;#o;#s;
    constructor(e) {
        super(), this.#s = !1, this.#o = e.defaultOptions, this.setOptions(e.options), this.observers = [], this.#i = e.client, this.#r = this.#i.getQueryCache(), this.queryKey = e.queryKey, this.queryHash = e.queryHash, this.#t = Rn(this.options), this.state = e.state ?? this.#t, this.scheduleGc()
    }
    get meta() {
        return this.options.meta
    }
    get queryType() {
        return this.#e
    }
    get promise() {
        return this.#a ?.promise
    }
    setOptions(e) {
        if (this.options = { ...this.#o,
                ...e
            }, e ?._type && (this.#e = e._type), this.updateGcTime(this.options.gcTime), this.state && this.state.data === void 0) {
            let e = Rn(this.options);
            e.data !== void 0 && (this.setState(Ln(e.data, e.dataUpdatedAt)), this.#t = e)
        }
    }
    optionalRemove() {
        !this.observers.length && this.state.fetchStatus === `idle` && this.#r.remove(this)
    }
    setData(e, t) {
        let n = un(this.state.data, e, this.options);
        return this.#l({
            data: n,
            type: `success`,
            dataUpdatedAt: t ?.updatedAt,
            manual: t ?.manual
        }), n
    }
    setState(e) {
        this.#l({
            type: `setState`,
            state: e
        })
    }
    cancel(e) {
        let t = this.#a ?.promise;
        return this.#a ?.cancel(e), t ? t.then(Gt).catch(Gt) : Promise.resolve()
    }
    destroy() {
        super.destroy(), this.cancel({
            silent: !0
        })
    }
    get resetState() {
        return this.#t
    }
    reset() {
        this.destroy(), this.setState(this.resetState)
    }
    isActive() {
        return this.observers.some(e => Xt(e.options.enabled, this) !== !1)
    }
    isDisabled() {
        return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === pn || !this.isFetched()
    }
    isFetched() {
        return this.state.dataUpdateCount + this.state.errorUpdateCount > 0
    }
    isStatic() {
        return this.getObserversCount() > 0 ? this.observers.some(e => Yt(e.options.staleTime, this) === `static`) : !1
    }
    isStale() {
        return this.getObserversCount() > 0 ? this.observers.some(e => e.getCurrentResult().isStale) : this.state.data === void 0 || this.state.isInvalidated
    }
    isStaleByTime(e = 0) {
        return this.state.data === void 0 ? !0 : e === `static` ? !1 : this.state.isInvalidated ? !0 : !Jt(this.state.dataUpdatedAt, e)
    }
    onFocus() {
        this.observers.find(e => e.shouldFetchOnWindowFocus()) ?.refetch({
            cancelRefetch: !1
        }), this.#a ?.continue()
    }
    onOnline() {
        this.observers.find(e => e.shouldFetchOnReconnect()) ?.refetch({
            cancelRefetch: !1
        }), this.#a ?.continue()
    }
    addObserver(e) {
        this.observers.includes(e) || (this.observers.push(e), this.clearGcTimeout(), this.#r.notify({
            type: `observerAdded`,
            query: this,
            observer: e
        }))
    }
    removeObserver(e) {
        this.observers.includes(e) && (this.observers = this.observers.filter(t => t !== e), this.observers.length || (this.#a && (this.#s || this.#c() ? this.#a.cancel({
            revert: !0
        }) : this.#a.cancelRetry()), this.scheduleGc()), this.#r.notify({
            type: `observerRemoved`,
            query: this,
            observer: e
        }))
    }
    getObserversCount() {
        return this.observers.length
    }#c() {
        return this.state.fetchStatus === `paused` && this.state.status === `pending`
    }
    invalidate() {
        this.state.isInvalidated || this.#l({
            type: `invalidate`
        })
    }
    async fetch(e, t) {
        if (this.state.fetchStatus !== `idle` && this.#a ?.status() !== `rejected`) {
            if (this.state.data !== void 0 && t ?.cancelRefetch) this.cancel({
                silent: !0
            });
            else if (this.#a) return this.#a.continueRetry(), this.#a.promise
        }
        if (e && this.setOptions(e), !this.options.queryFn) {
            let e = this.observers.find(e => e.options.queryFn);
            e && this.setOptions(e.options)
        }
        let n = new AbortController,
            r = e => {
                Object.defineProperty(e, `signal`, {
                    enumerable: !0,
                    get: () => (this.#s = !0, n.signal)
                })
            },
            i = () => {
                let e = mn(this.options, t),
                    n = (() => {
                        let e = {
                            client: this.#i,
                            queryKey: this.queryKey,
                            meta: this.meta
                        };
                        return r(e), e
                    })();
                return this.#s = !1, this.options.persister ? this.options.persister(e, n, this) : e(n)
            },
            a = (() => {
                let e = {
                    fetchOptions: t,
                    options: this.options,
                    queryKey: this.queryKey,
                    client: this.#i,
                    state: this.state,
                    fetchFn: i
                };
                return r(e), e
            })();
        (this.#e === `infinite` ? An(this.options.pages) : this.options.behavior) ?.onFetch(a, this), this.#n = this.state, (this.state.fetchStatus === `idle` || this.state.fetchMeta !== a.fetchOptions ?.meta) && this.#l({
            type: `fetch`,
            meta: a.fetchOptions ?.meta
        }), this.#a = On({
            initialPromise: t ?.initialPromise,
            fn: a.fetchFn,
            onCancel: e => {
                e instanceof Dn && e.revert && this.setState({ ...this.#n,
                    fetchStatus: `idle`
                }), n.abort()
            },
            onFail: (e, t) => {
                this.#l({
                    type: `failed`,
                    failureCount: e,
                    error: t
                })
            },
            onPause: () => {
                this.#l({
                    type: `pause`
                })
            },
            onContinue: () => {
                this.#l({
                    type: `continue`
                })
            },
            retry: a.options.retry,
            retryDelay: a.options.retryDelay,
            networkMode: a.options.networkMode,
            canRun: () => !0
        });
        try {
            let e = await this.#a.start();
            if (e === void 0) throw Error(`${this.queryHash} data is undefined`);
            return this.setData(e), this.#r.config.onSuccess ?.(e, this), this.#r.config.onSettled ?.(e, this.state.error, this), e
        } catch (e) {
            if (e instanceof Dn) {
                if (e.silent) return this.#a.promise;
                if (e.revert) {
                    if (this.state.data === void 0) throw e;
                    return this.state.data
                }
            }
            throw this.#l({
                type: `error`,
                error: e
            }), this.#r.config.onError ?.(e, this), this.#r.config.onSettled ?.(this.state.data, e, this), e
        } finally {
            this.scheduleGc()
        }
    }#l(e) {
        this.state = (t => {
            switch (e.type) {
                case `failed`:
                    return { ...t,
                        fetchFailureCount: e.failureCount,
                        fetchFailureReason: e.error
                    };
                case `pause`:
                    return { ...t,
                        fetchStatus: `paused`
                    };
                case `continue`:
                    return { ...t,
                        fetchStatus: `fetching`
                    };
                case `fetch`:
                    return { ...t,
                        ...In(t.data, this.options),
                        fetchMeta: e.meta ?? null
                    };
                case `success`:
                    let n = { ...t,
                        ...Ln(e.data, e.dataUpdatedAt),
                        dataUpdateCount: t.dataUpdateCount + 1,
                        ...!e.manual && {
                            fetchStatus: `idle`,
                            fetchFailureCount: 0,
                            fetchFailureReason: null
                        }
                    };
                    return this.#n = e.manual ? n : void 0, n;
                case `error`:
                    let r = e.error;
                    return { ...t,
                        error: r,
                        errorUpdateCount: t.errorUpdateCount + 1,
                        errorUpdatedAt: Date.now(),
                        fetchFailureCount: t.fetchFailureCount + 1,
                        fetchFailureReason: r,
                        fetchStatus: `idle`,
                        status: `error`,
                        isInvalidated: !0
                    };
                case `invalidate`:
                    return { ...t,
                        isInvalidated: !0
                    };
                case `setState`:
                    return { ...t,
                        ...e.state
                    }
            }
        })(this.state), R.batch(() => {
            this.observers.forEach(e => {
                e.onQueryUpdate()
            }), this.#r.notify({
                query: this,
                type: `updated`,
                action: e
            })
        })
    }
};

function In(e, t) {
    return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: En(t.networkMode) ? `fetching` : `paused`,
        ...e === void 0 && {
            error: null,
            status: `pending`
        }
    }
}

function Ln(e, t) {
    return {
        data: e,
        dataUpdatedAt: t ?? Date.now(),
        error: null,
        isInvalidated: !1,
        status: `success`
    }
}

function Rn(e) {
    let t = typeof e.initialData == `function` ? e.initialData() : e.initialData,
        n = t !== void 0,
        r = n ? typeof e.initialDataUpdatedAt == `function` ? e.initialDataUpdatedAt() : e.initialDataUpdatedAt : 0;
    return {
        data: t,
        dataUpdateCount: 0,
        dataUpdatedAt: n ? r ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: !1,
        status: n ? `success` : `pending`,
        fetchStatus: `idle`
    }
}
var zn = class extends zt {
    constructor(e, t) {
        super(), this.options = t, this.#e = e, this.#s = null, this.#o = vn(), this.bindMethods(), this.setOptions(t)
    }#e;#t = void 0;#n = void 0;#r = void 0;#i;#a;#o;#s;#c;#l;#u;#d;#f;#p;#m = new Set;
    bindMethods() {
        this.refetch = this.refetch.bind(this)
    }
    onSubscribe() {
        this.listeners.size === 1 && (this.#t.addObserver(this), Vn(this.#t, this.options) ? this.#h() : this.updateResult(), this.#y())
    }
    onUnsubscribe() {
        this.hasListeners() || this.destroy()
    }
    shouldFetchOnReconnect() {
        return Hn(this.#t, this.options, this.options.refetchOnReconnect)
    }
    shouldFetchOnWindowFocus() {
        return Hn(this.#t, this.options, this.options.refetchOnWindowFocus)
    }
    destroy() {
        this.listeners = new Set, this.#b(), this.#x(), this.#t.removeObserver(this)
    }
    setOptions(e) {
        let t = this.options,
            n = this.#t;
        if (this.options = this.#e.defaultQueryOptions(e), this.options.enabled !== void 0 && typeof this.options.enabled != `boolean` && typeof this.options.enabled != `function` && typeof Xt(this.options.enabled, this.#t) != `boolean`) throw Error(`Expected enabled to be a boolean or a callback that returns a boolean`);
        this.#S(), this.#t.setOptions(this.options), t._defaulted && !an(this.options, t) && this.#e.getQueryCache().notify({
            type: `observerOptionsUpdated`,
            query: this.#t,
            observer: this
        });
        let r = this.hasListeners();
        r && Un(this.#t, n, this.options, t) && this.#h(), this.updateResult(), r && (this.#t !== n || Xt(this.options.enabled, this.#t) !== Xt(t.enabled, this.#t) || Yt(this.options.staleTime, this.#t) !== Yt(t.staleTime, this.#t)) && this.#g();
        let i = this.#_();
        r && (this.#t !== n || Xt(this.options.enabled, this.#t) !== Xt(t.enabled, this.#t) || i !== this.#p) && this.#v(i)
    }
    getOptimisticResult(e) {
        let t = this.#e.getQueryCache().build(this.#e, e),
            n = this.createResult(t, e);
        return Gn(this, n) && (this.#r = n, this.#a = this.options, this.#i = this.#t.state), n
    }
    getCurrentResult() {
        return this.#r
    }
    trackResult(e, t) {
        return new Proxy(e, {
            get: (e, n) => (this.trackProp(n), t ?.(n), n === `promise` && (this.trackProp(`data`), !this.options.experimental_prefetchInRender && this.#o.status === `pending` && this.#o.reject(Error(`experimental_prefetchInRender feature flag is not enabled`))), Reflect.get(e, n))
        })
    }
    trackProp(e) {
        this.#m.add(e)
    }
    getCurrentQuery() {
        return this.#t
    }
    refetch({ ...e
    } = {}) {
        return this.fetch({ ...e
        })
    }
    fetchOptimistic(e) {
        let t = this.#e.defaultQueryOptions(e),
            n = this.#e.getQueryCache().build(this.#e, t);
        return n.fetch().then(() => this.createResult(n, t))
    }
    fetch(e) {
        return this.#h({ ...e,
            cancelRefetch: e.cancelRefetch ?? !0
        }).then(() => (this.updateResult(), this.#r))
    }#h(e) {
        this.#S();
        let t = this.#t.fetch(this.options, e);
        return e ?.throwOnError || (t = t.catch(Gt)), t
    }#g() {
        this.#b();
        let e = Yt(this.options.staleTime, this.#t);
        if (_n.isServer() || this.#r.isStale || !qt(e)) return;
        let t = Jt(this.#r.dataUpdatedAt, e) + 1;
        this.#d = Ht.setTimeout(() => {
            this.#r.isStale || this.updateResult()
        }, t)
    }#_() {
        return (typeof this.options.refetchInterval == `function` ? this.options.refetchInterval(this.#t) : this.options.refetchInterval) ?? !1
    }#v(e) {
        this.#x(), this.#p = e, !(_n.isServer() || Xt(this.options.enabled, this.#t) === !1 || !qt(this.#p) || this.#p === 0) && (this.#f = Ht.setInterval(() => {
            (this.options.refetchIntervalInBackground || Bt.isFocused()) && this.#h()
        }, this.#p))
    }#y() {
        this.#g(), this.#v(this.#_())
    }#b() {
        this.#d !== void 0 && (Ht.clearTimeout(this.#d), this.#d = void 0)
    }#x() {
        this.#f !== void 0 && (Ht.clearInterval(this.#f), this.#f = void 0)
    }
    createResult(e, t) {
        let n = this.#t,
            r = this.options,
            i = this.#r,
            a = this.#i,
            o = this.#a,
            s = e === n ? this.#n : e.state,
            {
                state: c
            } = e,
            l = { ...c
            },
            u = !1,
            d;
        if (t._optimisticResults) {
            let i = this.hasListeners(),
                a = !i && Vn(e, t),
                o = i && Un(e, n, t, r);
            (a || o) && (l = { ...l,
                ...In(c.data, e.options)
            }), t._optimisticResults === `isRestoring` && (l.fetchStatus = `idle`)
        }
        let {
            error: f,
            errorUpdatedAt: p,
            status: m
        } = l;
        d = l.data;
        let h = !1;
        if (t.placeholderData !== void 0 && d === void 0 && m === `pending`) {
            let e;
            i ?.isPlaceholderData && t.placeholderData === o ?.placeholderData ? (e = i.data, h = !0) : e = typeof t.placeholderData == `function` ? t.placeholderData(this.#u ?.state.data, this.#u) : t.placeholderData, e !== void 0 && (m = `success`, d = un(i ?.data, e, t), u = !0)
        }
        if (t.select && d !== void 0 && !h)
            if (i && d === a ?.data && t.select === this.#c) d = this.#l;
            else try {
                this.#c = t.select, d = t.select(d), d = un(i ?.data, d, t), this.#l = d, this.#s = null
            } catch (e) {
                this.#s = e
            }
        this.#s && (f = this.#s, d = this.#l, p = Date.now(), m = `error`);
        let g = l.fetchStatus === `fetching`,
            _ = m === `pending`,
            v = m === `error`,
            y = _ && g,
            b = d !== void 0,
            x = {
                status: m,
                fetchStatus: l.fetchStatus,
                isPending: _,
                isSuccess: m === `success`,
                isError: v,
                isInitialLoading: y,
                isLoading: y,
                data: d,
                dataUpdatedAt: l.dataUpdatedAt,
                error: f,
                errorUpdatedAt: p,
                failureCount: l.fetchFailureCount,
                failureReason: l.fetchFailureReason,
                errorUpdateCount: l.errorUpdateCount,
                isFetched: e.isFetched(),
                isFetchedAfterMount: l.dataUpdateCount > s.dataUpdateCount || l.errorUpdateCount > s.errorUpdateCount,
                isFetching: g,
                isRefetching: g && !_,
                isLoadingError: v && !b,
                isPaused: l.fetchStatus === `paused`,
                isPlaceholderData: u,
                isRefetchError: v && b,
                isStale: Wn(e, t),
                refetch: this.refetch,
                promise: this.#o,
                isEnabled: Xt(t.enabled, e) !== !1
            };
        if (this.options.experimental_prefetchInRender) {
            let t = x.data !== void 0,
                r = x.status === `error` && !t,
                i = e => {
                    r ? e.reject(x.error) : t && e.resolve(x.data)
                },
                a = () => {
                    i(this.#o = x.promise = vn())
                },
                o = this.#o;
            switch (o.status) {
                case `pending`:
                    e.queryHash === n.queryHash && i(o);
                    break;
                case `fulfilled`:
                    (r || x.data !== o.value) && a();
                    break;
                case `rejected`:
                    (!r || x.error !== o.reason) && a();
                    break
            }
        }
        return x
    }
    updateResult() {
        let e = this.#r,
            t = this.createResult(this.#t, this.options);
        this.#i = this.#t.state, this.#a = this.options, this.#i.data !== void 0 && (this.#u = this.#t), !an(t, e) && (this.#r = t, this.#C({
            listeners: (() => {
                if (!e) return !0;
                let {
                    notifyOnChangeProps: t
                } = this.options, n = typeof t == `function` ? t() : t;
                if (n === `all` || !n && !this.#m.size) return !0;
                let r = new Set(n ?? this.#m);
                return this.options.throwOnError && r.add(`error`), Object.keys(this.#r).some(t => {
                    let n = t;
                    return this.#r[n] !== e[n] && r.has(n)
                })
            })()
        }))
    }#S() {
        let e = this.#e.getQueryCache().build(this.#e, this.options);
        if (e === this.#t) return;
        let t = this.#t;
        this.#t = e, this.#n = e.state, this.hasListeners() && (t ?.removeObserver(this), e.addObserver(this))
    }
    onQueryUpdate() {
        this.updateResult(), this.hasListeners() && this.#y()
    }#C(e) {
        R.batch(() => {
            e.listeners && this.listeners.forEach(e => {
                e(this.#r)
            }), this.#e.getQueryCache().notify({
                query: this.#t,
                type: `observerResultsUpdated`
            })
        })
    }
};

function Bn(e, t) {
    return Xt(t.enabled, e) !== !1 && e.state.data === void 0 && !(e.state.status === `error` && Xt(t.retryOnMount, e) === !1)
}

function Vn(e, t) {
    return Bn(e, t) || e.state.data !== void 0 && Hn(e, t, t.refetchOnMount)
}

function Hn(e, t, n) {
    if (Xt(t.enabled, e) !== !1 && Yt(t.staleTime, e) !== `static`) {
        let r = typeof n == `function` ? n(e) : n;
        return r === `always` || r !== !1 && Wn(e, t)
    }
    return !1
}

function Un(e, t, n, r) {
    return (e !== t || Xt(r.enabled, e) === !1) && (!n.suspense || e.state.status !== `error`) && Wn(e, n)
}

function Wn(e, t) {
    return Xt(t.enabled, e) !== !1 && e.isStaleByTime(Yt(t.staleTime, e))
}

function Gn(e, t) {
    return !an(e.getCurrentResult(), t)
}
var Kn = class extends zn {
        constructor(e, t) {
            super(e, t)
        }
        bindMethods() {
            super.bindMethods(), this.fetchNextPage = this.fetchNextPage.bind(this), this.fetchPreviousPage = this.fetchPreviousPage.bind(this)
        }
        setOptions(e) {
            e._type = `infinite`, super.setOptions(e)
        }
        getOptimisticResult(e) {
            return e._type = `infinite`, super.getOptimisticResult(e)
        }
        fetchNextPage(e) {
            return this.fetch({ ...e,
                meta: {
                    fetchMore: {
                        direction: `forward`
                    }
                }
            })
        }
        fetchPreviousPage(e) {
            return this.fetch({ ...e,
                meta: {
                    fetchMore: {
                        direction: `backward`
                    }
                }
            })
        }
        createResult(e, t) {
            let {
                state: n
            } = e, r = super.createResult(e, t), {
                isFetching: i,
                isRefetching: a,
                isError: o,
                isRefetchError: s
            } = r, c = n.fetchMeta ?.fetchMore ?.direction, l = o && c === `forward`, u = i && c === `forward`, d = o && c === `backward`, f = i && c === `backward`;
            return { ...r,
                fetchNextPage: this.fetchNextPage,
                fetchPreviousPage: this.fetchPreviousPage,
                hasNextPage: Nn(t, n.data),
                hasPreviousPage: Pn(t, n.data),
                isFetchNextPageError: l,
                isFetchingNextPage: u,
                isFetchPreviousPageError: d,
                isFetchingPreviousPage: f,
                isRefetchError: s && !l && !d,
                isRefetching: a && !u && !f
            }
        }
    },
    qn = class extends kn {#e;#t;#n;#r;
        constructor(e) {
            super(), this.#e = e.client, this.mutationId = e.mutationId, this.#n = e.mutationCache, this.#t = [], this.state = e.state || Jn(), this.setOptions(e.options), this.scheduleGc()
        }
        setOptions(e) {
            this.options = e, this.updateGcTime(this.options.gcTime)
        }
        get meta() {
            return this.options.meta
        }
        addObserver(e) {
            this.#t.includes(e) || (this.#t.push(e), this.clearGcTimeout(), this.#n.notify({
                type: `observerAdded`,
                mutation: this,
                observer: e
            }))
        }
        removeObserver(e) {
            this.#t = this.#t.filter(t => t !== e), this.scheduleGc(), this.#n.notify({
                type: `observerRemoved`,
                mutation: this,
                observer: e
            })
        }
        optionalRemove() {
            this.#t.length || (this.state.status === `pending` ? this.scheduleGc() : this.#n.remove(this))
        }
        continue () {
            return this.#r ?.continue() ?? this.execute(this.state.variables)
        }
        async execute(e) {
            let t = () => {
                    this.#i({
                        type: `continue`
                    })
                },
                n = {
                    client: this.#e,
                    meta: this.options.meta,
                    mutationKey: this.options.mutationKey
                };
            this.#r = On({
                fn: () => this.options.mutationFn ? this.options.mutationFn(e, n) : Promise.reject(Error(`No mutationFn found`)),
                onFail: (e, t) => {
                    this.#i({
                        type: `failed`,
                        failureCount: e,
                        error: t
                    })
                },
                onPause: () => {
                    this.#i({
                        type: `pause`
                    })
                },
                onContinue: t,
                retry: this.options.retry ?? 0,
                retryDelay: this.options.retryDelay,
                networkMode: this.options.networkMode,
                canRun: () => this.#n.canRun(this)
            });
            let r = this.state.status === `pending`,
                i = !this.#r.canStart();
            try {
                if (r) t();
                else {
                    this.#i({
                        type: `pending`,
                        variables: e,
                        isPaused: i
                    }), this.#n.config.onMutate && await this.#n.config.onMutate(e, this, n);
                    let t = await this.options.onMutate ?.(e, n);
                    t !== this.state.context && this.#i({
                        type: `pending`,
                        context: t,
                        variables: e,
                        isPaused: i
                    })
                }
                let a = await this.#r.start();
                return await this.#n.config.onSuccess ?.(a, e, this.state.context, this, n), await this.options.onSuccess ?.(a, e, this.state.context, n), await this.#n.config.onSettled ?.(a, null, this.state.variables, this.state.context, this, n), await this.options.onSettled ?.(a, null, e, this.state.context, n), this.#i({
                    type: `success`,
                    data: a
                }), a
            } catch (t) {
                try {
                    await this.#n.config.onError ?.(t, e, this.state.context, this, n)
                } catch (e) {
                    Promise.reject(e)
                }
                try {
                    await this.options.onError ?.(t, e, this.state.context, n)
                } catch (e) {
                    Promise.reject(e)
                }
                try {
                    await this.#n.config.onSettled ?.(void 0, t, this.state.variables, this.state.context, this, n)
                } catch (e) {
                    Promise.reject(e)
                }
                try {
                    await this.options.onSettled ?.(void 0, t, e, this.state.context, n)
                } catch (e) {
                    Promise.reject(e)
                }
                throw this.#i({
                    type: `error`,
                    error: t
                }), t
            } finally {
                this.#n.runNext(this)
            }
        }#i(e) {
            this.state = (t => {
                switch (e.type) {
                    case `failed`:
                        return { ...t,
                            failureCount: e.failureCount,
                            failureReason: e.error
                        };
                    case `pause`:
                        return { ...t,
                            isPaused: !0
                        };
                    case `continue`:
                        return { ...t,
                            isPaused: !1
                        };
                    case `pending`:
                        return { ...t,
                            context: e.context,
                            data: void 0,
                            failureCount: 0,
                            failureReason: null,
                            error: null,
                            isPaused: e.isPaused,
                            status: `pending`,
                            variables: e.variables,
                            submittedAt: Date.now()
                        };
                    case `success`:
                        return { ...t,
                            data: e.data,
                            failureCount: 0,
                            failureReason: null,
                            error: null,
                            status: `success`,
                            isPaused: !1
                        };
                    case `error`:
                        return { ...t,
                            data: void 0,
                            error: e.error,
                            failureCount: t.failureCount + 1,
                            failureReason: e.error,
                            isPaused: !1,
                            status: `error`
                        }
                }
            })(this.state), R.batch(() => {
                this.#t.forEach(t => {
                    t.onMutationUpdate(e)
                }), this.#n.notify({
                    mutation: this,
                    type: `updated`,
                    action: e
                })
            })
        }
    };

function Jn() {
    return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: !1,
        status: `idle`,
        variables: void 0,
        submittedAt: 0
    }
}
var Yn = class extends zt {
    constructor(e = {}) {
        super(), this.config = e, this.#e = new Set, this.#t = new Map, this.#n = 0
    }#e;#t;#n;
    build(e, t, n) {
        let r = new qn({
            client: e,
            mutationCache: this,
            mutationId: ++this.#n,
            options: e.defaultMutationOptions(t),
            state: n
        });
        return this.add(r), r
    }
    add(e) {
        this.#e.add(e);
        let t = Xn(e);
        if (typeof t == `string`) {
            let n = this.#t.get(t);
            n ? n.push(e) : this.#t.set(t, [e])
        }
        this.notify({
            type: `added`,
            mutation: e
        })
    }
    remove(e) {
        if (this.#e.delete(e)) {
            let t = Xn(e);
            if (typeof t == `string`) {
                let n = this.#t.get(t);
                if (n)
                    if (n.length > 1) {
                        let t = n.indexOf(e);
                        t !== -1 && n.splice(t, 1)
                    } else n[0] === e && this.#t.delete(t)
            }
        }
        this.notify({
            type: `removed`,
            mutation: e
        })
    }
    canRun(e) {
        let t = Xn(e);
        if (typeof t == `string`) {
            let n = this.#t.get(t) ?.find(e => e.state.status === `pending`);
            return !n || n === e
        } else return !0
    }
    runNext(e) {
        let t = Xn(e);
        return typeof t == `string` ? (this.#t.get(t) ?.find(t => t !== e && t.state.isPaused)) ?.continue() ?? Promise.resolve() : Promise.resolve()
    }
    clear() {
        R.batch(() => {
            this.#e.forEach(e => {
                this.notify({
                    type: `removed`,
                    mutation: e
                })
            }), this.#e.clear(), this.#t.clear()
        })
    }
    getAll() {
        return Array.from(this.#e)
    }
    find(e) {
        let t = {
            exact: !0,
            ...e
        };
        return this.getAll().find(e => Qt(t, e))
    }
    findAll(e = {}) {
        return this.getAll().filter(t => Qt(e, t))
    }
    notify(e) {
        R.batch(() => {
            this.listeners.forEach(t => {
                t(e)
            })
        })
    }
    resumePausedMutations() {
        let e = this.getAll().filter(e => e.state.isPaused);
        return R.batch(() => Promise.all(e.map(e => e.continue().catch(Gt))))
    }
};

function Xn(e) {
    return e.options.scope ?.id
}
var Zn = class extends zt {
        constructor(e = {}) {
            super(), this.config = e, this.#e = new Map
        }#e;
        build(e, t, n) {
            let r = t.queryKey,
                i = t.queryHash ?? $t(r, t),
                a = this.get(i);
            return a || (a = new Fn({
                client: e,
                queryKey: r,
                queryHash: i,
                options: e.defaultQueryOptions(t),
                state: n,
                defaultOptions: e.getQueryDefaults(r)
            }), this.add(a)), a
        }
        add(e) {
            this.#e.has(e.queryHash) || (this.#e.set(e.queryHash, e), this.notify({
                type: `added`,
                query: e
            }))
        }
        remove(e) {
            let t = this.#e.get(e.queryHash);
            t && (e.destroy(), t === e && this.#e.delete(e.queryHash), this.notify({
                type: `removed`,
                query: e
            }))
        }
        clear() {
            R.batch(() => {
                this.getAll().forEach(e => {
                    this.remove(e)
                })
            })
        }
        get(e) {
            return this.#e.get(e)
        }
        getAll() {
            return [...this.#e.values()]
        }
        find(e) {
            let t = {
                exact: !0,
                ...e
            };
            return this.getAll().find(e => Zt(t, e))
        }
        findAll(e = {}) {
            let t = this.getAll();
            return Object.keys(e).length > 0 ? t.filter(t => Zt(e, t)) : t
        }
        notify(e) {
            R.batch(() => {
                this.listeners.forEach(t => {
                    t(e)
                })
            })
        }
        onFocus() {
            R.batch(() => {
                this.getAll().forEach(e => {
                    e.onFocus()
                })
            })
        }
        onOnline() {
            R.batch(() => {
                this.getAll().forEach(e => {
                    e.onOnline()
                })
            })
        }
    },
    Qn = class {#e;#t;#n;#r;#i;#a;#o;#s;
        constructor(e = {}) {
            this.#e = e.queryCache || new Zn, this.#t = e.mutationCache || new Yn, this.#n = e.defaultOptions || {}, this.#r = new Map, this.#i = new Map, this.#a = 0
        }
        mount() {
            this.#a++, this.#a === 1 && (this.#o = Bt.subscribe(async e => {
                e && (await this.resumePausedMutations(), this.#e.onFocus())
            }), this.#s = wn.subscribe(async e => {
                e && (await this.resumePausedMutations(), this.#e.onOnline())
            }))
        }
        unmount() {
            this.#a--, this.#a === 0 && (this.#o ?.(), this.#o = void 0, this.#s ?.(), this.#s = void 0)
        }
        isFetching(e) {
            return this.#e.findAll({ ...e,
                fetchStatus: `fetching`
            }).length
        }
        isMutating(e) {
            return this.#t.findAll({ ...e,
                status: `pending`
            }).length
        }
        getQueryData(e) {
            let t = this.defaultQueryOptions({
                queryKey: e
            });
            return this.#e.get(t.queryHash) ?.state.data
        }
        ensureQueryData(e) {
            let t = this.defaultQueryOptions(e),
                n = this.#e.build(this, t),
                r = n.state.data;
            return r === void 0 ? this.fetchQuery(e) : (e.revalidateIfStale && n.isStaleByTime(Yt(t.staleTime, n)) && this.prefetchQuery(t), Promise.resolve(r))
        }
        getQueriesData(e) {
            return this.#e.findAll(e).map(({
                queryKey: e,
                state: t
            }) => [e, t.data])
        }
        setQueryData(e, t, n) {
            let r = this.defaultQueryOptions({
                    queryKey: e
                }),
                i = this.#e.get(r.queryHash) ?.state.data,
                a = Kt(t, i);
            if (a !== void 0) return this.#e.build(this, r).setData(a, { ...n,
                manual: !0
            })
        }
        setQueriesData(e, t, n) {
            return R.batch(() => this.#e.findAll(e).map(({
                queryKey: e
            }) => [e, this.setQueryData(e, t, n)]))
        }
        getQueryState(e) {
            let t = this.defaultQueryOptions({
                queryKey: e
            });
            return this.#e.get(t.queryHash) ?.state
        }
        removeQueries(e) {
            let t = this.#e;
            R.batch(() => {
                t.findAll(e).forEach(e => {
                    t.remove(e)
                })
            })
        }
        resetQueries(e, t) {
            let n = this.#e;
            return R.batch(() => (n.findAll(e).forEach(e => {
                e.reset()
            }), this.refetchQueries({
                type: `active`,
                ...e
            }, t)))
        }
        cancelQueries(e, t = {}) {
            let n = {
                    revert: !0,
                    ...t
                },
                r = R.batch(() => this.#e.findAll(e).map(e => e.cancel(n)));
            return Promise.all(r).then(Gt).catch(Gt)
        }
        invalidateQueries(e, t = {}) {
            return R.batch(() => (this.#e.findAll(e).forEach(e => {
                e.invalidate()
            }), e ?.refetchType === `none` ? Promise.resolve() : this.refetchQueries({ ...e,
                type: e ?.refetchType ?? e ?.type ?? `active`
            }, t)))
        }
        refetchQueries(e, t = {}) {
            let n = { ...t,
                    cancelRefetch: t.cancelRefetch ?? !0
                },
                r = R.batch(() => this.#e.findAll(e).filter(e => !e.isDisabled() && !e.isStatic()).map(e => {
                    let t = e.fetch(void 0, n);
                    return n.throwOnError || (t = t.catch(Gt)), e.state.fetchStatus === `paused` ? Promise.resolve() : t
                }));
            return Promise.all(r).then(Gt)
        }
        fetchQuery(e) {
            let t = this.defaultQueryOptions(e);
            t.retry === void 0 && (t.retry = !1);
            let n = this.#e.build(this, t);
            return n.isStaleByTime(Yt(t.staleTime, n)) ? n.fetch(t) : Promise.resolve(n.state.data)
        }
        prefetchQuery(e) {
            return this.fetchQuery(e).then(Gt).catch(Gt)
        }
        fetchInfiniteQuery(e) {
            return e._type = `infinite`, this.fetchQuery(e)
        }
        prefetchInfiniteQuery(e) {
            return this.fetchInfiniteQuery(e).then(Gt).catch(Gt)
        }
        ensureInfiniteQueryData(e) {
            return e._type = `infinite`, this.ensureQueryData(e)
        }
        resumePausedMutations() {
            return wn.isOnline() ? this.#t.resumePausedMutations() : Promise.resolve()
        }
        getQueryCache() {
            return this.#e
        }
        getMutationCache() {
            return this.#t
        }
        getDefaultOptions() {
            return this.#n
        }
        setDefaultOptions(e) {
            this.#n = e
        }
        setQueryDefaults(e, t) {
            this.#r.set(en(e), {
                queryKey: e,
                defaultOptions: t
            })
        }
        getQueryDefaults(e) {
            let t = [...this.#r.values()],
                n = {};
            return t.forEach(t => {
                tn(e, t.queryKey) && Object.assign(n, t.defaultOptions)
            }), n
        }
        setMutationDefaults(e, t) {
            this.#i.set(en(e), {
                mutationKey: e,
                defaultOptions: t
            })
        }
        getMutationDefaults(e) {
            let t = [...this.#i.values()],
                n = {};
            return t.forEach(t => {
                tn(e, t.mutationKey) && Object.assign(n, t.defaultOptions)
            }), n
        }
        defaultQueryOptions(e) {
            if (e._defaulted) return e;
            let t = { ...this.#n.queries,
                ...this.getQueryDefaults(e.queryKey),
                ...e,
                _defaulted: !0
            };
            return t.queryHash ||= $t(t.queryKey, t), t.refetchOnReconnect === void 0 && (t.refetchOnReconnect = t.networkMode !== `always`), t.throwOnError === void 0 && (t.throwOnError = !!t.suspense), !t.networkMode && t.persister && (t.networkMode = `offlineFirst`), t.queryFn === pn && (t.enabled = !1), t
        }
        defaultMutationOptions(e) {
            return e ?._defaulted ? e : { ...this.#n.mutations,
                ...e ?.mutationKey && this.getMutationDefaults(e.mutationKey),
                ...e,
                _defaulted : !0
            }
        }
        clear() {
            this.#e.clear(), this.#t.clear()
        }
    },
    $n = `__includes_scalar__`,
    er = class {},
    tr = class extends er {
        constructor(e, t) {
            super(), this.collection = e, this.alias = t, this.type = `collectionRef`
        }
    },
    nr = class extends er {
        constructor(e, t) {
            super(), this.query = e, this.alias = t, this.type = `queryRef`
        }
    },
    rr = class extends er {
        constructor(e) {
            super(), this.sources = e, this.type = `unionFrom`
        }
        get alias() {
            return this.sources[0] ?.alias ?? ``
        }
    },
    ir = class extends er {
        constructor(e) {
            super(), this.queries = e, this.type = `unionAll`
        }
        get alias() {
            return ``
        }
    },
    z = class extends er {
        constructor(e) {
            super(), this.path = e, this.type = `ref`
        }
    },
    B = class extends er {
        constructor(e) {
            super(), this.value = e, this.type = `val`
        }
    },
    V = class extends er {
        constructor(e, t) {
            super(), this.name = e, this.args = t, this.type = `func`
        }
    },
    ar = class extends er {
        constructor(e, t) {
            super(), this.name = e, this.args = t, this.type = `agg`
        }
    },
    or = class extends er {
        constructor(e, t, n, r, i, a, o = `collection`, s) {
            super(), this.query = e, this.correlationField = t, this.childCorrelationField = n, this.fieldName = r, this.parentFilters = i, this.parentProjection = a, this.materialization = o, this.scalarField = s, this.type = `includesSubquery`
        }
    },
    H = class extends er {
        constructor(e, t) {
            super(), this.branches = e, this.defaultValue = t, this.type = `conditionalSelect`
        }
    };

function sr(e) {
    return e instanceof ar || e instanceof H || e instanceof V || e instanceof z || e instanceof B || e instanceof or ? !0 : !e || typeof e != `object` ? !1 : e.type === `conditionalSelect` ? Array.isArray(e.branches) : e.type === `agg` || e.type === `func` ? typeof e.name == `string` && Array.isArray(e.args) : e.type === `ref` ? Array.isArray(e.path) : e.type === `val` ? `value` in e : e.type === `includesSubquery` ? `query` in e && `fieldName` in e : !1
}

function cr(e) {
    return typeof e == `object` && `expression` in e ? e.expression : e
}

function lr(e) {
    return typeof e == `object` && `expression` in e ? e.expression : e
}

function ur(e) {
    return typeof e == `object` && `expression` in e && e.residual === !0
}

function dr(e) {
    return {
        expression: e,
        residual: !0
    }
}

function fr(e, t) {
    if (e.from.type === `unionFrom`) {
        for (let n of e.from.sources)
            if (n.alias === t) return n
    } else if (e.from.type !== `unionAll` && e.from.alias === t) return e.from;
    for (let n of e.join || [])
        if (n.from.alias === t) return n.from
}

function pr(e, t, n) {
    if (t.path.length !== 0) {
        if (t.path.length === 1) {
            let r = t.path[0];
            if (e.select) {
                let t = e.select[r];
                if (t && t.type === `ref`) return pr(e, t, n)
            }
            return {
                collection: n,
                path: [r]
            }
        }
        if (t.path.length > 1) {
            let [r, ...i] = t.path, a = fr(e, r);
            return a ? a.type === `queryRef` ? pr(a.query, new z(i), n) : {
                collection: a.collection,
                path: i
            } : void 0
        }
    }
}
var mr = class extends Error {
        constructor(e) {
            super(e), this.name = `TanStackDBError`
        }
    },
    hr = class extends mr {
        constructor(e, t, n) {
            let r = `${e===`insert`?`Insert`:`Update`} validation failed: ${t.map(e=>`
- ${e.message} - path: ${e.path}`).join(``)}`;
            super(n || r), this.name = `SchemaValidationError`, this.type = e, this.issues = t
        }
    },
    gr = class extends mr {
        constructor(e) {
            super(e), this.name = `CollectionConfigurationError`
        }
    },
    _r = class extends gr {
        constructor() {
            super(`Collection requires a config`)
        }
    },
    vr = class extends gr {
        constructor() {
            super(`Collection requires a sync config`)
        }
    },
    yr = class extends gr {
        constructor() {
            super(`Schema must implement the standard-schema interface`)
        }
    },
    br = class extends gr {
        constructor() {
            super(`Schema validation must be synchronous`)
        }
    },
    xr = class extends mr {
        constructor(e) {
            super(e), this.name = `CollectionStateError`
        }
    },
    Sr = class extends xr {
        constructor(e, t) {
            super(`Cannot perform ${e} on collection "${t}" - collection is in error state. Try calling cleanup() and restarting the collection.`)
        }
    },
    Cr = class extends xr {
        constructor(e, t, n) {
            super(`Invalid collection status transition from "${e}" to "${t}" for collection "${n}"`)
        }
    },
    wr = class extends xr {
        constructor() {
            super(`Collection is in error state`)
        }
    },
    Tr = class extends xr {
        constructor() {
            super(`Active subscribers count is negative - this should never happen`)
        }
    },
    Er = class extends mr {
        constructor(e) {
            super(e), this.name = `CollectionOperationError`
        }
    },
    Dr = class extends Er {
        constructor(e) {
            super(`An object was created without a defined key: ${JSON.stringify(e)}`)
        }
    },
    Or = class extends Er {
        constructor(e, t) {
            super(`getKey returned an invalid key type. Expected string or number, but got ${e===null?`null`:typeof e}: ${JSON.stringify(e)}. Item: ${JSON.stringify(t)}`)
        }
    },
    kr = class extends Er {
        constructor(e) {
            super(`Cannot insert document with ID "${e}" because it already exists in the collection`)
        }
    },
    Ar = class extends Er {
        constructor(e, t, n) {
            let r = `Cannot insert document with key "${e}" from sync because it already exists in the collection "${t}"`;
            n ?.hasCustomGetKey && n.hasDistinct ? super(`${r}. This collection uses a custom getKey with .distinct(). The .distinct() operator deduplicates by the ENTIRE selected object (standard SQL behavior), but your custom getKey extracts only a subset of fields. This causes multiple distinct rows (with different values in non-key fields) to receive the same key. To fix this, either: (1) ensure your SELECT only includes fields that uniquely identify each row, (2) use .groupBy() with min()/max() aggregates to select one value per group, or (3) remove the custom getKey to use the default key behavior.`) : n ?.hasCustomGetKey && n.hasJoins ? super(`${r}. This collection uses a custom getKey with joined queries. Joined queries can produce multiple rows with the same key when relationships are not 1:1. Consider: (1) using a composite key in your getKey function (e.g., \`\${item.key1}-\${item.key2}\`), (2) ensuring your join produces unique rows per key, or (3) removing the custom getKey to use the default composite key behavior.`) : super(r)
        }
    },
    jr = class extends Er {
        constructor() {
            super(`The first argument to update is missing`)
        }
    },
    Mr = class extends Er {
        constructor() {
            super(`No keys were passed to update`)
        }
    },
    Nr = class extends Er {
        constructor(e) {
            super(`The key "${e}" was passed to update but an object for this key was not found in the collection`)
        }
    },
    Pr = class extends Er {
        constructor(e, t) {
            super(`Updating the key of an item is not allowed. Original key: "${e}", Attempted new key: "${t}". Please delete the old item and create a new one if a key change is necessary.`)
        }
    },
    Fr = class extends Er {
        constructor() {
            super(`No keys were passed to delete`)
        }
    },
    Ir = class extends Er {
        constructor(e) {
            super(`Collection.delete was called with key '${e}' but there is no item in the collection with this key`)
        }
    },
    Lr = class extends mr {
        constructor(e) {
            super(e), this.name = `MissingHandlerError`
        }
    },
    Rr = class extends Lr {
        constructor() {
            super(`Collection.insert called directly (not within an explicit transaction) but no 'onInsert' handler is configured.`)
        }
    },
    zr = class extends Lr {
        constructor() {
            super(`Collection.update called directly (not within an explicit transaction) but no 'onUpdate' handler is configured.`)
        }
    },
    Br = class extends Lr {
        constructor() {
            super(`Collection.delete called directly (not within an explicit transaction) but no 'onDelete' handler is configured.`)
        }
    },
    Vr = class extends mr {
        constructor(e) {
            super(e), this.name = `TransactionError`
        }
    },
    Hr = class extends Vr {
        constructor() {
            super(`mutationFn is required when creating a transaction`)
        }
    },
    Ur = class extends Vr {
        constructor() {
            super(`onMutate must be synchronous and cannot return a promise. Remove async/await or returned promises from onMutate.`), this.name = `OnMutateMustBeSynchronousError`
        }
    },
    Wr = class extends Vr {
        constructor() {
            super(`You can no longer call .mutate() as the transaction is no longer pending`)
        }
    },
    Gr = class extends Vr {
        constructor() {
            super(`You can no longer call .rollback() as the transaction is already completed`)
        }
    },
    Kr = class extends Vr {
        constructor() {
            super(`You can no longer call .commit() as the transaction is no longer pending`)
        }
    },
    qr = class extends Vr {
        constructor() {
            super(`No pending sync transaction to write to`)
        }
    },
    Jr = class extends Vr {
        constructor() {
            super(`The pending sync transaction is already committed, you can't still write to it.`)
        }
    },
    Yr = class extends Vr {
        constructor() {
            super(`No pending sync transaction to commit`)
        }
    },
    Xr = class extends Vr {
        constructor() {
            super(`The pending sync transaction is already committed, you can't commit it again.`)
        }
    },
    Zr = class extends mr {
        constructor(e) {
            super(e), this.name = `QueryBuilderError`
        }
    },
    Qr = class extends Zr {
        constructor(e) {
            super(`Only one source is allowed in the ${e}`)
        }
    },
    $r = class extends Zr {
        constructor(e) {
            super(`A sub query passed to a ${e} must have a from clause itself`)
        }
    },
    ei = class extends Zr {
        constructor(e) {
            super(`Invalid source for live query: The value provided for alias "${e}" is not a Collection or subquery. Live queries only accept Collection instances or subqueries. Please ensure you're passing a valid Collection or QueryBuilder, not a plain array or other data type.`)
        }
    },
    ti = class extends Zr {
        constructor(e, t) {
            super(`Invalid source for ${e}: Expected ${e===`unionAll clause`?`an object with one or more key-value pairs like { alias: collection }`:`an object with a single key-value pair like { alias: collection }`}. For example: ${e===`unionAll clause`?`.unionAll({ todos: todosCollection, events: eventsCollection })`:e===`join clause`?`.join({ todos: todosCollection }, ({ todo, todos }) => eq(todo.id, todos.id))`:`.from({ todos: todosCollection })`}. Got: ${t}`)
        }
    },
    ni = class extends Zr {
        constructor() {
            super(`Join condition must be an equality expression`)
        }
    },
    ri = class extends Zr {
        constructor() {
            super(`Query must have a from clause`)
        }
    },
    ii = class extends Zr {
        constructor(e) {
            super(`Invalid where() expression: Expected a query expression, but received a ${e}. This usually happens when using JavaScript's comparison operators (===, !==, <, >, etc.) directly. Instead, use the query builder functions:

  ❌ .where(({ user }) => user.id === 'abc')
  ✅ .where(({ user }) => eq(user.id, 'abc'))

Available comparison functions: eq, gt, gte, lt, lte, and, or, not, like, ilike, isNull, isUndefined`)
        }
    },
    ai = class extends mr {
        constructor(e) {
            super(e), this.name = `QueryCompilationError`
        }
    },
    oi = class extends ai {
        constructor() {
            super(`DISTINCT requires a SELECT clause.`)
        }
    },
    si = class extends ai {
        constructor() {
            super(`fn.select() cannot be used with groupBy(). groupBy requires the compiler to statically analyze aggregate functions (count, sum, max, etc.) in the SELECT clause, which is not possible with fn.select() since it is an opaque function. Use .select() instead of .fn.select() when combining with groupBy().`)
        }
    },
    ci = class extends ai {
        constructor() {
            super(`Top-level scalar select() is not supported by createLiveQueryCollection() or queryOnce(). Return an object from .select(), or use the scalar query inside toArray(...) or concat(toArray(...)).`)
        }
    },
    li = class extends ai {
        constructor() {
            super(`HAVING clause requires GROUP BY clause`)
        }
    },
    ui = class extends ai {
        constructor() {
            super(`LIMIT and OFFSET require an ORDER BY clause to ensure deterministic results`)
        }
    },
    di = class extends ai {
        constructor(e, t, n) {
            let r = t ? `alias "${e}" (collection "${t}")` : `collection "${e}"`,
                i = n ?.length ? `. Available keys: ${n.join(`, `)}` : ``;
            super(`Input for ${r} not found in inputs map${i}`)
        }
    },
    fi = class extends ai {
        constructor(e, t) {
            super(`Subquery uses alias "${e}" which is already used in the parent query. Each alias must be unique across parent and subquery contexts. Parent query aliases: ${t.join(`, `)}. Please rename "${e}" in either the parent query or subquery to avoid conflicts.`)
        }
    },
    pi = class extends ai {
        constructor(e) {
            super(`Unsupported FROM type: ${e}`)
        }
    },
    mi = class extends ai {
        constructor(e) {
            super(`Unknown expression type: ${e}`)
        }
    },
    hi = class extends ai {
        constructor() {
            super(`Reference path cannot be empty`)
        }
    },
    gi = class extends ai {
        constructor(e) {
            super(`Unknown function: ${e}`)
        }
    },
    _i = class extends ai {
        constructor(e) {
            super(`Collection "${e}" not found during compilation of join`)
        }
    },
    vi = class extends mr {
        constructor(e) {
            super(e), this.name = `JoinError`
        }
    },
    yi = class extends vi {
        constructor(e) {
            super(`Unsupported join type: ${e}`)
        }
    },
    bi = class extends vi {
        constructor(e) {
            super(`Invalid join condition: both expressions refer to the same source "${e}"`)
        }
    },
    xi = class extends vi {
        constructor() {
            super(`Invalid join condition: expressions must reference source aliases`)
        }
    },
    Si = class extends vi {
        constructor(e) {
            super(`Invalid join condition: left expression refers to an unavailable source "${e}"`)
        }
    },
    Ci = class extends vi {
        constructor(e) {
            super(`Invalid join condition: right expression does not refer to the joined source "${e}"`)
        }
    },
    wi = class extends vi {
        constructor() {
            super(`Invalid join condition`)
        }
    },
    Ti = class extends vi {
        constructor(e) {
            super(`Unsupported join source type: ${e}`)
        }
    },
    Ei = class extends mr {
        constructor(e) {
            super(e), this.name = `GroupByError`
        }
    },
    Di = class extends Ei {
        constructor(e) {
            super(`Non-aggregate expression '${e}' in SELECT must also appear in GROUP BY clause`)
        }
    },
    Oi = class extends Ei {
        constructor(e) {
            super(`Unsupported aggregate function: ${e}`)
        }
    },
    ki = class extends Ei {
        constructor(e) {
            super(`Aggregate function in HAVING clause must also be in SELECT clause: ${e}`)
        }
    },
    Ai = class extends Ei {
        constructor(e) {
            super(`Unknown expression type in HAVING clause: ${e}`)
        }
    },
    ji = class extends mr {
        constructor(e, t) {
            let n = t instanceof Error ? t.message : String(t);
            super(`Collection "${e}" sync cleanup function threw an error: ${n}`), this.name = `SyncCleanupError`
        }
    },
    Mi = class extends mr {
        constructor(e) {
            super(e), this.name = `QueryOptimizerError`
        }
    },
    Ni = class extends Mi {
        constructor() {
            super(`Cannot combine empty expression list`)
        }
    },
    Pi = class extends ai {
        constructor(e, t, n, r) {
            super(`Internal error: subscription for alias '${e}' (remapped from '${t}', collection '${n}') is missing in join pipeline. Available aliases: ${r.join(`, `)}. This indicates a bug in alias tracking.`)
        }
    },
    Fi = class extends ai {
        constructor(e) {
            super(`Internal error: compiler returned aliases without inputs: ${e.join(`, `)}. This indicates a bug in query compilation. Please report this issue.`)
        }
    },
    Ii = class extends ai {
        constructor() {
            super(`setWindow() can only be called on collections with an ORDER BY clause. Add .orderBy() to your query to enable window movement.`)
        }
    };

function Li(e, t) {
    return Ri(e, t, new Map)
}

function Ri(e, t, n) {
    if (e === t) return !0;
    if (e == null || t == null || typeof e != typeof t) return !1;
    if (e instanceof Date) return t instanceof Date ? e.getTime() === t.getTime() : !1;
    if (t instanceof Date) return !1;
    if (e instanceof RegExp) return t instanceof RegExp ? e.source === t.source && e.flags === t.flags : !1;
    if (t instanceof RegExp) return !1;
    if (e instanceof Map) {
        if (!(t instanceof Map) || e.size !== t.size) return !1;
        if (n.has(e)) return n.get(e) === t;
        n.set(e, t);
        let r = Array.from(e.entries()).every(([e, r]) => t.has(e) && Ri(r, t.get(e), n));
        return n.delete(e), r
    }
    if (t instanceof Map) return !1;
    if (e instanceof Set) {
        if (!(t instanceof Set) || e.size !== t.size) return !1;
        if (n.has(e)) return n.get(e) === t;
        n.set(e, t);
        let r = Array.from(e),
            i = Array.from(t);
        if (r.every(e => typeof e != `object`)) return n.delete(e), r.every(e => t.has(e));
        let a = r.length === i.length;
        return n.delete(e), a
    }
    if (t instanceof Set) return !1;
    if (ArrayBuffer.isView(e) && ArrayBuffer.isView(t) && !(e instanceof DataView) && !(t instanceof DataView)) {
        let n = e,
            r = t;
        if (n.length !== r.length) return !1;
        for (let e = 0; e < n.length; e++)
            if (n[e] !== r[e]) return !1;
        return !0
    }
    if (ArrayBuffer.isView(t) && !(t instanceof DataView) && !ArrayBuffer.isView(e)) return !1;
    if (Bi(e) && Bi(t)) return e[Symbol.toStringTag] === t[Symbol.toStringTag] ? typeof e.equals == `function` ? e.equals(t) : e.toString() === t.toString() : !1;
    if (Bi(t)) return !1;
    if (Array.isArray(e)) {
        if (!Array.isArray(t) || e.length !== t.length) return !1;
        if (n.has(e)) return n.get(e) === t;
        n.set(e, t);
        let r = e.every((e, r) => Ri(e, t[r], n));
        return n.delete(e), r
    }
    if (Array.isArray(t)) return !1;
    if (typeof e == `object`) {
        if (n.has(e)) return n.get(e) === t;
        n.set(e, t);
        let r = Object.keys(e),
            i = Object.keys(t);
        if (r.length !== i.length) return n.delete(e), !1;
        let a = r.every(r => r in t && Ri(e[r], t[r], n));
        return n.delete(e), a
    }
    return !1
}
var zi = new Set([`Temporal.Duration`, `Temporal.Instant`, `Temporal.PlainDate`, `Temporal.PlainDateTime`, `Temporal.PlainMonthDay`, `Temporal.PlainTime`, `Temporal.PlainYearMonth`, `Temporal.ZonedDateTime`]);

function Bi(e) {
    if (typeof e != `object` || !e) return !1;
    let t = e[Symbol.toStringTag];
    return typeof t == `string` && zi.has(t)
}
var Vi = {
        direction: `asc`,
        nulls: `first`,
        stringSort: `locale`
    },
    Hi = new WeakMap,
    Ui = 1;

function Wi(e) {
    if (Hi.has(e)) return Hi.get(e);
    let t = Ui++;
    return Hi.set(e, t), t
}
var Gi = (e, t, n) => {
        let {
            nulls: r
        } = n;
        if (e == null && t == null) return 0;
        if (e == null) return r === `first` ? -1 : 1;
        if (t == null) return r === `first` ? 1 : -1;
        if (typeof e == `string` && typeof t == `string` && n.stringSort === `locale`) return e.localeCompare(t, n.locale, n.localeOptions);
        if (Array.isArray(e) && Array.isArray(t)) {
            for (let r = 0; r < Math.min(e.length, t.length); r++) {
                let i = Gi(e[r], t[r], n);
                if (i !== 0) return i
            }
            return e.length - t.length
        }
        if (e instanceof Date && t instanceof Date) return e.getTime() - t.getTime();
        if (Bi(e) && Bi(t)) {
            let n = e.toString(),
                r = t.toString();
            return n < r ? -1 : n > r ? 1 : 0
        }
        let i = typeof e == `object`,
            a = typeof t == `object`;
        if (i || a) {
            if (i && a) return Wi(e) - Wi(t);
            if (i) return 1;
            if (a) return -1
        }
        return e < t ? -1 : e > t ? 1 : 0
    },
    Ki = (e, t, n) => Gi(t, e, { ...n,
        nulls: n.nulls === `first` ? `last` : `first`
    });

function qi(e) {
    return (t, n) => e.direction === `asc` ? Gi(t, n, e) : Ki(t, n, e)
}
var Ji = qi({
    direction: `asc`,
    nulls: `first`,
    stringSort: `locale`
});

function Yi(e, t) {
    if (e.byteLength !== t.byteLength) return !1;
    for (let n = 0; n < e.byteLength; n++)
        if (e[n] !== t[n]) return !1;
    return !0
}
var Xi = 128,
    Zi = `__TS_DB_BTREE_UNDEFINED_VALUE__`;

function Qi(e) {
    return e instanceof Date ? e.getTime() : Bi(e) ? `__temporal__${e[Symbol.toStringTag]}__${e.toString()}` : (typeof Buffer < `u` && e instanceof Buffer || e instanceof Uint8Array) && e.byteLength <= Xi ? `__u8__${Array.from(e).join(`,`)}` : e
}

function $i(e) {
    return e === void 0 ? Zi : Qi(e)
}

function ea(e) {
    if (e !== Zi) return e
}

function ta(e, t) {
    if (e === t) return !0;
    let n = typeof Buffer < `u` && e instanceof Buffer || e instanceof Uint8Array,
        r = typeof Buffer < `u` && t instanceof Buffer || t instanceof Uint8Array;
    return n && r ? Yi(e, t) : !1
}

function U(e) {
    return e == null
}

function na(e) {
    if (e instanceof Date) return Number.isNaN(e.getTime()) ? null : e;
    if (typeof e == `string` || typeof e == `number`) {
        let t = new Date(e);
        return Number.isNaN(t.getTime()) ? null : t
    }
    return null
}

function ra(e, t) {
    return e === `%Y-%m-%d` ? t.toISOString().slice(0, 10) : t.toISOString()
}

function ia(e) {
    return e === !0
}

function W(e, t = !1) {
    return oa(e, t)
}

function aa(e) {
    return oa(e, !0)
}

function oa(e, t) {
    switch (e.type) {
        case `val`:
            {
                let t = e.value;
                return () => t
            }
        case `ref`:
            return t ? ca(e) : sa(e);
        case `func`:
            return la(e, t);
        default:
            throw new mi(e.type)
    }
}

function sa(e) {
    let [t, ...n] = e.path;
    if (!t) throw new hi;
    if (t === `$selected`) {
        if (n.length === 0) return e => e.$selected;
        if (n.length === 1) {
            let e = n[0];
            return t => t.$selected ?.[e]
        } else return e => {
            let t = e.$selected;
            if (t === void 0) return;
            let r = t;
            for (let e of n) {
                if (r == null) return r;
                r = r[e]
            }
            return r
        }
    }
    let r = t;
    if (n.length === 0) return e => e[r];
    if (n.length === 1) {
        let e = n[0];
        return t => t[r] ?.[e]
    } else return e => {
        let t = e[r];
        if (t === void 0) return;
        let i = t;
        for (let e of n) {
            if (i == null) return i;
            i = i[e]
        }
        return i
    }
}

function ca(e) {
    let t = e.path;
    return e => {
        let n = e;
        for (let e of t) {
            if (n == null) return n;
            n = n[e]
        }
        return n
    }
}

function la(e, t) {
    let n = e.args.map(e => oa(e, t));
    switch (e.name) {
        case `eq`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = Qi(e(n)),
                        i = Qi(t(n));
                    return U(r) || U(i) ? null : ta(r, i)
                }
            }
        case `gt`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return U(r) || U(i) ? null : r > i
                }
            }
        case `gte`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return U(r) || U(i) ? null : r >= i
                }
            }
        case `lt`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return U(r) || U(i) ? null : r < i
                }
            }
        case `lte`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return U(r) || U(i) ? null : r <= i
                }
            }
        case `and`:
            return e => {
                let t = !1;
                for (let r of n) {
                    let n = r(e);
                    if (n === !1) return !1;
                    U(n) && (t = !0)
                }
                return t ? null : !0
            };
        case `or`:
            return e => {
                let t = !1;
                for (let r of n) {
                    let n = r(e);
                    if (n === !0) return !0;
                    U(n) && (t = !0)
                }
                return t ? null : !1
            };
        case `not`:
            {
                let e = n[0];
                return t => {
                    let n = e(t);
                    return U(n) ? null : !n
                }
            }
        case `in`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = Qi(e(n)),
                        i = t(n);
                    return U(r) ? null : Array.isArray(i) ? i.some(e => Qi(e) === r) : !1
                }
            }
        case `like`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return U(r) || U(i) ? null : da(r, i, !1)
                }
            }
        case `ilike`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return U(r) || U(i) ? null : da(r, i, !0)
                }
            }
        case `upper`:
            {
                let e = n[0];
                return t => {
                    let n = e(t);
                    return typeof n == `string` ? n.toUpperCase() : n
                }
            }
        case `lower`:
            {
                let e = n[0];
                return t => {
                    let n = e(t);
                    return typeof n == `string` ? n.toLowerCase() : n
                }
            }
        case `length`:
            {
                let e = n[0];
                return t => {
                    let n = e(t);
                    return typeof n == `string` || Array.isArray(n) ? n.length : 0
                }
            }
        case `concat`:
            return e => n.map(t => {
                let n = t(e);
                try {
                    return String(n ?? ``)
                } catch {
                    try {
                        return JSON.stringify(n) || ``
                    } catch {
                        return `[object]`
                    }
                }
            }).join(``);
        case `coalesce`:
            return e => {
                for (let t of n) {
                    let n = t(e);
                    if (n != null) return n
                }
                return null
            };
        case `caseWhen`:
            {
                let e = n.length % 2 == 1,
                    t = Math.floor(n.length / 2);
                if (n.length < 2) throw Error(`caseWhen() requires at least two arguments`);
                return r => {
                    for (let e = 0; e < t; e++) {
                        let t = n[e * 2];
                        if (ua(t(r))) {
                            let t = n[e * 2 + 1];
                            return t(r)
                        }
                    }
                    return e ? n[n.length - 1](r) : null
                }
            }
        case `add`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return (r ?? 0) + (i ?? 0)
                }
            }
        case `subtract`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return (r ?? 0) - (i ?? 0)
                }
            }
        case `multiply`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n);
                    return (r ?? 0) * (i ?? 0)
                }
            }
        case `divide`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n),
                        i = t(n) ?? 0;
                    return i === 0 ? null : (r ?? 0) / i
                }
            }
        case `date`:
            {
                let e = n[0];
                return t => {
                    let n = na(e(t));
                    return n ? n.toISOString().slice(0, 10) : null
                }
            }
        case `datetime`:
            {
                let e = n[0];
                return t => {
                    let n = na(e(t));
                    return n ? n.toISOString() : null
                }
            }
        case `strftime`:
            {
                let e = n[0],
                    t = n[1];
                return n => {
                    let r = e(n);
                    if (typeof r != `string`) return null;
                    let i = na(t(n));
                    return i ? ra(r, i) : null
                }
            }
        case `isUndefined`:
            {
                let e = n[0];
                return t => e(t) === void 0
            }
        case `isNull`:
            {
                let e = n[0];
                return t => e(t) === null
            }
        default:
            throw new gi(e.name)
    }
}

function ua(e) {
    return e == null || e === !1 ? !1 : e === !0 ? !0 : typeof e == `number` ? e !== 0 && !Number.isNaN(e) : typeof e == `bigint` ? e !== 0n : !!e
}

function da(e, t, n) {
    if (typeof e != `string` || typeof t != `string`) return !1;
    let r = n ? e.toLowerCase() : e,
        i = (n ? t.toLowerCase() : t).replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    return i = i.replace(/%/g, `.*`), i = i.replace(/_/g, `.`), RegExp(`^${i}$`, `s`).test(r)
}
var fa = class {
    constructor(e) {
        this.originalIndex = e
    }
    lookup(e, t) {
        let n = e === `gt` ? `lt` : e === `gte` ? `lte` : e === `lt` ? `gt` : e === `lte` ? `gte` : e;
        return this.originalIndex.lookup(n, t)
    }
    rangeQuery(e = {}) {
        return this.originalIndex.rangeQueryReversed(e)
    }
    rangeQueryReversed(e = {}) {
        return this.originalIndex.rangeQuery(e)
    }
    take(e, t, n) {
        return this.originalIndex.takeReversed(e, t, n)
    }
    takeFromStart(e, t) {
        return this.originalIndex.takeReversedFromEnd(e, t)
    }
    takeReversed(e, t, n) {
        return this.originalIndex.take(e, t, n)
    }
    takeReversedFromEnd(e, t) {
        return this.originalIndex.takeFromStart(e, t)
    }
    get orderedEntriesArray() {
        return this.originalIndex.orderedEntriesArrayReversed
    }
    get orderedEntriesArrayReversed() {
        return this.originalIndex.orderedEntriesArray
    }
    supports(e) {
        return this.originalIndex.supports(e)
    }
    matchesField(e) {
        return this.originalIndex.matchesField(e)
    }
    matchesCompareOptions(e) {
        return this.originalIndex.matchesCompareOptions(e)
    }
    matchesDirection(e) {
        return this.originalIndex.matchesDirection(e)
    }
    getStats() {
        return this.originalIndex.getStats()
    }
    add(e, t) {
        this.originalIndex.add(e, t)
    }
    remove(e, t) {
        this.originalIndex.remove(e, t)
    }
    update(e, t, n) {
        this.originalIndex.update(e, t, n)
    }
    build(e) {
        this.originalIndex.build(e)
    }
    clear() {
        this.originalIndex.clear()
    }
    get keyCount() {
        return this.originalIndex.keyCount
    }
    equalityLookup(e) {
        return this.originalIndex.equalityLookup(e)
    }
    inArrayLookup(e) {
        return this.originalIndex.inArrayLookup(e)
    }
    get indexedKeysSet() {
        return this.originalIndex.indexedKeysSet
    }
    get valueMapData() {
        return this.originalIndex.valueMapData
    }
};

function pa(e, t, n, r, i) {
    let a = e;
    return { ...e,
        $synced: a.$synced ?? r(),
        $origin: a.$origin ?? i(),
        $key: a.$key ?? t,
        $collectionId: a.$collectionId ?? n
    }
}
var ma = [`$synced`, `$origin`, `$key`, `$collectionId`];

function ha(e) {
    return ma.includes(e)
}

function ga(e) {
    return e.some(e => ha(e))
}

function _a(e, t, n) {
    if (ga(t)) return;
    let r = n ?? { ...Vi,
        ...e.compareOptions
    };
    for (let n of e.indexes.values())
        if (n.matchesField(t) && n.matchesCompareOptions(r)) return n.matchesDirection(r.direction) ? n : new fa(n)
}

function va(e) {
    if (e.length === 0) return new Set;
    if (e.length === 1) return new Set(e[0]);
    let t = new Set(e[0]);
    for (let n = 1; n < e.length; n++) {
        let r = new Set;
        for (let i of t) e[n].has(i) && r.add(i);
        t = r
    }
    return t
}

function ya(e) {
    let t = new Set;
    for (let n of e)
        for (let e of n) t.add(e);
    return t
}

function ba(e, t) {
    return xa(e, t)
}

function xa(e, t) {
    if (e.type === `func`) switch (e.name) {
        case `eq`:
        case `gt`:
        case `gte`:
        case `lt`:
        case `lte`:
            return Ca(e, t);
        case `and`:
            return wa(e, t);
        case `or`:
            return Ta(e, t);
        case `in`:
            return Ea(e, t)
    }
    return {
        canOptimize: !1,
        matchingKeys: new Set
    }
}

function Sa(e, t) {
    if (e.type !== `func` || e.args.length < 2) return {
        canOptimize: !1,
        matchingKeys: new Set
    };
    let n = new Map;
    for (let t of e.args)
        if (t.type === `func` && [`gt`, `gte`, `lt`, `lte`].includes(t.name)) {
            let e = t;
            if (e.args.length === 2) {
                let t = e.args[0],
                    r = e.args[1],
                    i = null,
                    a = null,
                    o = e.name;
                if (t.type === `ref` && r.type === `val`) i = t, a = r;
                else if (t.type === `val` && r.type === `ref`) switch (i = r, a = t, o) {
                    case `gt`:
                        o = `lt`;
                        break;
                    case `gte`:
                        o = `lte`;
                        break;
                    case `lt`:
                        o = `gt`;
                        break;
                    case `lte`:
                        o = `gte`;
                        break
                }
                if (i && a) {
                    let e = i.path.join(`.`),
                        t = a.value;
                    n.has(e) || n.set(e, []), n.get(e).push({
                        operation: o,
                        value: t
                    })
                }
            }
        }
    for (let [e, r] of n)
        if (r.length >= 2) {
            let n = _a(t, e.split(`.`));
            if (n && n.supports(`gt`) && n.supports(`lt`)) {
                let e, t, i = !0,
                    a = !0;
                for (let {
                        operation: n,
                        value: o
                    } of r) switch (n) {
                    case `gt`:
                        (e === void 0 || o > e) && (e = o, i = !1);
                        break;
                    case `gte`:
                        (e === void 0 || o > e) && (e = o, i = !0);
                        break;
                    case `lt`:
                        (t === void 0 || o < t) && (t = o, a = !1);
                        break;
                    case `lte`:
                        (t === void 0 || o < t) && (t = o, a = !0);
                        break
                }
                return {
                    canOptimize: !0,
                    matchingKeys: n.rangeQuery({
                        from: e,
                        to: t,
                        fromInclusive: i,
                        toInclusive: a
                    })
                }
            }
        }
    return {
        canOptimize: !1,
        matchingKeys: new Set
    }
}

function Ca(e, t) {
    if (e.type !== `func` || e.args.length !== 2) return {
        canOptimize: !1,
        matchingKeys: new Set
    };
    let n = e.args[0],
        r = e.args[1],
        i = null,
        a = null,
        o = e.name;
    if (n.type === `ref` && r.type === `val`) i = n, a = r;
    else if (n.type === `val` && r.type === `ref`) switch (i = r, a = n, o) {
        case `gt`:
            o = `lt`;
            break;
        case `gte`:
            o = `lte`;
            break;
        case `lt`:
            o = `gt`;
            break;
        case `lte`:
            o = `gte`;
            break
    }
    if (i && a) {
        let e = i.path,
            n = _a(t, e);
        if (n) {
            let e = a.value,
                t = o;
            return n.supports(t) ? {
                canOptimize: !0,
                matchingKeys: n.lookup(t, e)
            } : {
                canOptimize: !1,
                matchingKeys: new Set
            }
        }
    }
    return {
        canOptimize: !1,
        matchingKeys: new Set
    }
}

function wa(e, t) {
    if (e.type !== `func` || e.args.length < 2) return {
        canOptimize: !1,
        matchingKeys: new Set
    };
    let n = Sa(e, t);
    if (n.canOptimize) return n;
    let r = [];
    for (let n of e.args) {
        let e = xa(n, t);
        e.canOptimize && r.push(e)
    }
    return r.length > 0 ? {
        canOptimize: !0,
        matchingKeys: va(r.map(e => e.matchingKeys))
    } : {
        canOptimize: !1,
        matchingKeys: new Set
    }
}

function Ta(e, t) {
    if (e.type !== `func` || e.args.length < 2) return {
        canOptimize: !1,
        matchingKeys: new Set
    };
    let n = [];
    for (let r of e.args) {
        let e = xa(r, t);
        e.canOptimize && n.push(e)
    }
    return n.length > 0 ? {
        canOptimize: !0,
        matchingKeys: ya(n.map(e => e.matchingKeys))
    } : {
        canOptimize: !1,
        matchingKeys: new Set
    }
}

function Ea(e, t) {
    if (e.type !== `func` || e.args.length !== 2) return {
        canOptimize: !1,
        matchingKeys: new Set
    };
    let n = e.args[0],
        r = e.args[1];
    if (n.type === `ref` && r.type === `val` && Array.isArray(r.value)) {
        let e = n.path,
            i = r.value,
            a = _a(t, e);
        if (a) {
            if (a.supports(`in`)) return {
                canOptimize: !0,
                matchingKeys: a.lookup(`in`, i)
            };
            if (a.supports(`eq`)) {
                let e = new Set;
                for (let t of i) {
                    let n = a.lookup(`eq`, t);
                    for (let t of n) e.add(t)
                }
                return {
                    canOptimize: !0,
                    matchingKeys: e
                }
            }
        }
    }
    return {
        canOptimize: !1,
        matchingKeys: new Set
    }
}
var Da = {
    enabled: !0,
    collectionSizeThreshold: 1e3,
    slowQueryThresholdMs: 10,
    onSuggestion: null
};

function Oa() {
    return Da.enabled && !1
}

function ka(e) {
    if (Oa())
        if (Da.onSuggestion) try {
            Da.onSuggestion(e)
        } catch {} else console.warn(`[TanStack DB] Index suggestion for "${e.collectionId}":
  ${e.message}
  Field: ${e.fieldPath.join(`.`)}
  Add index: collection.createIndex((row) => row.${e.fieldPath.join(`.`)})`)
}

function Aa(e, t, n) {
    Oa() && t > Da.collectionSizeThreshold && ka({
        type: `collection-size`,
        collectionId: e,
        fieldPath: n,
        message: `Collection has ${t} items. Queries on "${n.join(`.`)}" may benefit from an index.`,
        collectionSize: t
    })
}

function ja(e) {
    return e.config.autoIndex === `eager`
}

function Ma(e, t, n, r, i) {
    if (ga(t) || !ja(n)) return;
    let a = r ?? { ...Vi,
        ...n.compareOptions
    };
    if (!Array.from(n.indexes.values()).find(e => e.matchesField(t) && e.matchesCompareOptions(a))) {
        Oa() && Aa(n.id || `unknown`, n.size, t);
        try {
            n.createIndex(e => {
                let n = e;
                for (let e of t) n = n[e];
                return n
            }, {
                name: `auto:${t.join(`.`)}`,
                options: i ? {
                    compareFn: i,
                    compareOptions: a
                } : {}
            })
        } catch (e) {
            console.warn(`${n.id?`[${n.id}] `:``}Failed to create auto-index for field path "${t.join(`.`)}":`, e)
        }
    }
}

function Na(e, t) {
    if (!ja(t)) return;
    let n = Pa(e);
    for (let {
            fieldName: e,
            fieldPath: r
        } of n) Ma(e, r, t)
}

function Pa(e) {
    let t = [];

    function n(e) {
        if (e.type !== `func`) return;
        let r = e;
        if (r.name === `and`) {
            for (let e of r.args) n(e);
            return
        }
        if (![`eq`, `gt`, `gte`, `lt`, `lte`, `in`].includes(r.name) || r.args.length < 1 || r.args[0].type !== `ref`) return;
        let i = r.args[0].path;
        if (i.length === 0) return;
        let a = i.join(`_`);
        t.push({
            fieldName: a,
            fieldPath: i
        })
    }
    return n(e), t
}
var Fa = class extends Map {
        constructor(e, t) {
            super(t), this.defaultValue = e
        }
        get(e) {
            return this.has(e) ? super.get(e) : this.defaultValue()
        }
        update(e, t) {
            let n = t(this.get(e));
            return this.set(e, n), n
        }
    },
    Ia = 3e4;

function La(e, t) {
    if (t.length <= Ia) e.push(...t);
    else
        for (let n = 0; n < t.length; n += Ia) {
            let r = t.slice(n, n + Ia);
            e.push(...r)
        }
}

function Ra(e, t, n) {
    let r = 0,
        i = e.length;
    for (; r < i;) {
        let a = Math.floor((r + i) / 2),
            o = n(e[a], t);
        if (o < 0) r = a + 1;
        else if (o > 0) i = a;
        else return a
    }
    return r
}
var za = new class {
    constructor() {
        this.objectIds = new WeakMap, this.nextId = 0
    }
    getId(e) {
        if (typeof e != `object` || !e) {
            let t = String(e),
                n = 0;
            for (let e = 0; e < t.length; e++) {
                let r = t.charCodeAt(e);
                n = (n << 5) - n + r, n &= n
            }
            return n
        }
        return this.objectIds.has(e) || this.objectIds.set(e, this.nextId++), this.objectIds.get(e)
    }
    getStringId(e) {
        return e === null ? `null` : e === void 0 ? `undefined` : typeof e == `object` ? `obj_${this.getId(e)}` : `str_${String(e)}`
    }
};

function Ba(e, t) {
    let [n, r] = e, [i, a] = t;
    return {
        onlyInA: [...Va(n, Math.min(r, i)), ...Va(Math.max(n, a), r)],
        onlyInB: [...Va(i, Math.min(a, n)), ...Va(Math.max(i, r), a)]
    }
}

function Va(e, t) {
    let n = [];
    for (let r = e; r < t; r++) n.push(r);
    return n
}

function Ha(e, t) {
    return typeof e == typeof t ? e < t ? -1 : e > t ? 1 : 0 : typeof e == `string` ? -1 : 1
}

function Ua(e) {
    return JSON.stringify(e, (e, t) => typeof t == `bigint` ? t.toString() : t instanceof Date ? t.toISOString() : t)
}
var Wa = G(),
    Ga = G(),
    Ka = G(),
    qa = G(),
    Ja = G();

function G() {
    return Math.random() * (2 ** 31 - 1) >>> 0
}
var Ya = new ArrayBuffer(8),
    Xa = new DataView(Ya),
    Za = new Uint8Array(Ya),
    Qa = class {
        constructor() {
            this.hash = Wa, this.length = 0, this.carry = 0, this.carryBytes = 0
        }
        _mix(e) {
            e = Math.imul(e, 3432918353), e = e << 15 | e >>> 17, e = Math.imul(e, 461845907), this.hash ^= e, this.hash = this.hash << 13 | this.hash >>> 19, this.hash = Math.imul(this.hash, 5) + 3864292196
        }
        writeByte(e) {
            this.carry |= (e & 255) << 8 * this.carryBytes, this.carryBytes++, this.length++, this.carryBytes === 4 && (this._mix(this.carry >>> 0), this.carry = 0, this.carryBytes = 0)
        }
        update(e) {
            switch (typeof e) {
                case `symbol`:
                    {
                        this.update(Ja);
                        let t = e.description;
                        if (!t) return;
                        for (let e = 0; e < t.length; e++) {
                            let n = t.charCodeAt(e);
                            this.writeByte(n & 255), this.writeByte(n >>> 8 & 255)
                        }
                        return
                    }
                case `string`:
                    this.update(Ga);
                    for (let t = 0; t < e.length; t++) {
                        let n = e.charCodeAt(t);
                        this.writeByte(n & 255), this.writeByte(n >>> 8 & 255)
                    }
                    return;
                case `number`:
                    Xa.setFloat64(0, e, !0), this.writeByte(Za[0]), this.writeByte(Za[1]), this.writeByte(Za[2]), this.writeByte(Za[3]), this.writeByte(Za[4]), this.writeByte(Za[5]), this.writeByte(Za[6]), this.writeByte(Za[7]);
                    return;
                case `bigint`:
                    {
                        let t = e;
                        for (t < 0n ? (t = -t, this.update(qa)) : this.update(Ka); t > 0n;) this.writeByte(Number(t & 255n)),
                        t >>= 8n;e === 0n && this.writeByte(0);
                        return
                    }
                default:
                    throw TypeError(`Unsupported input type: ${typeof e}`)
            }
        }
        digest() {
            if (this.carryBytes > 0) {
                let e = this.carry >>> 0;
                e = Math.imul(e, 3432918353), e = e << 15 | e >>> 17, e = Math.imul(e, 461845907), this.hash ^= e
            }
            return this.hash ^= this.length, this.hash ^= this.hash >>> 16, this.hash = Math.imul(this.hash, 2246822507), this.hash ^= this.hash >>> 13, this.hash = Math.imul(this.hash, 3266489909), this.hash ^= this.hash >>> 16, this.hash >>> 0
        }
    },
    $a = G(),
    eo = G(),
    to = G(),
    no = G(),
    ro = G(),
    io = G(),
    ao = G(),
    oo = G(),
    so = G(),
    co = G(),
    lo = G(),
    uo = G(),
    fo = G(),
    po = new Set([`Temporal.Duration`, `Temporal.Instant`, `Temporal.PlainDate`, `Temporal.PlainDateTime`, `Temporal.PlainMonthDay`, `Temporal.PlainTime`, `Temporal.PlainYearMonth`, `Temporal.ZonedDateTime`]);

function mo(e) {
    let t = e[Symbol.toStringTag];
    return typeof t == `string` && po.has(t)
}
var ho = 128,
    go = new WeakMap;

function _o(e) {
    let t = new Qa;
    return Co(t, e), t.digest()
}

function vo(e) {
    let t = go.get(e);
    if (t !== void 0) return t;
    let n;
    if (e instanceof Date) n = yo(e);
    else if (typeof Buffer < `u` && e instanceof Buffer || e instanceof Uint8Array)
        if (e.byteLength <= ho) n = bo(e);
        else return Eo(e);
    else if (e instanceof File) return Eo(e);
    else if (mo(e)) n = xo(e);
    else {
        let t = e,
            r = oo;
        e instanceof Array && (r = so), e instanceof Map && (r = co, t = [...e.entries()]), e instanceof Set && (r = lo, t = [...e.entries()]), n = So(t, r)
    }
    return go.set(e, n), n
}

function yo(e) {
    let t = new Qa;
    return t.update(ao), t.update(e.getTime()), t.digest()
}

function bo(e) {
    let t = new Qa;
    t.update(uo), t.update(e.byteLength);
    for (let n = 0; n < e.byteLength; n++) t.writeByte(e[n]);
    return t.digest()
}

function xo(e) {
    let t = new Qa;
    return t.update(fo), t.update(e[Symbol.toStringTag]), t.update(e.toString()), t.digest()
}

function So(e, t) {
    let n = new Qa;
    n.update(t);
    let r = Object.keys(e);
    r.sort(Do);
    for (let t of r) n.update(ro), n.update(t), Co(n, e[t]);
    return n.digest()
}

function Co(e, t) {
    if (t === null) {
        e.update(to);
        return
    }
    switch (typeof t) {
        case `undefined`:
            e.update(no);
            return;
        case `boolean`:
            e.update(t ? $a : eo);
            return;
        case `number`:
            e.update(isNaN(t) ? NaN : t === 0 ? 0 : t);
            return;
        case `bigint`:
        case `string`:
        case `symbol`:
            e.update(t);
            return;
        case `object`:
            e.update(wo(t));
            return;
        case `function`:
            e.update(Eo(t));
            return;
        default:
            console.warn(`Ignored input during hashing because it is of type ${typeof t} which is not supported`)
    }
}

function wo(e) {
    let t = go.get(e);
    return t === void 0 && (t = vo(e)), t
}
var To = 1;

function Eo(e) {
    let t = go.get(e);
    return t === void 0 && (t = To ^ io, To++, go.set(e, t)), t
}

function Do(e, t) {
    return e.localeCompare(t)
}
var Oo = class e {#e;
        constructor(e = []) {
            this.#e = e
        }
        toString(e = !1) {
            return `MultiSet(${JSON.stringify(this.#e,null,e?2:void 0)})`
        }
        toJSON() {
            return JSON.stringify(Array.from(this.getInner()))
        }
        static fromJSON(t) {
            return new e(JSON.parse(t))
        }
        map(t) {
            return new e(this.#e.map(([e, n]) => [t(e), n]))
        }
        filter(t) {
            return new e(this.#e.filter(([e, n]) => t(e)))
        }
        negate() {
            return new e(this.#e.map(([e, t]) => [e, -t]))
        }
        concat(t) {
            let n = [];
            return La(n, this.#e), La(n, t.getInner()), new e(n)
        }
        consolidate() {
            if (this.#e.length > 0) {
                let e = this.#e[0] ?.[0];
                if (Array.isArray(e) && e.length === 2) return this.#t()
            }
            return this.#n()
        }#t() {
            let t = new Map,
                n = new Map,
                r = e => {
                    if (e.length !== 2) throw Error(`Expected tuple of length 2`);
                    let [t, n] = e;
                    return `${za.getStringId(t)}|${za.getStringId(n)}`
                };
            for (let [e, i] of this.#e) {
                if (!Array.isArray(e) || e.length !== 2) return this.#n();
                let [a, o] = e;
                if (typeof a != `string` && typeof a != `number`) return this.#n();
                let s;
                s = Array.isArray(o) && o.length === 2 ? r(o) : za.getStringId(o);
                let c = a + `|` + s;
                t.set(c, (t.get(c) || 0) + i), n.has(c) || n.set(c, e)
            }
            let i = [];
            for (let [e, r] of t) r !== 0 && i.push([n.get(e), r]);
            return new e(i)
        }#n() {
            let t = new Fa(() => 0),
                n = new Map,
                r = !1,
                i = !1,
                a = !1;
            for (let [e, t] of this.#e)
                if (typeof e == `string`) r = !0;
                else if (typeof e == `number`) i = !0;
            else {
                a = !0;
                break
            }
            let o = a || r && i;
            for (let [e, r] of this.#e) {
                let i = o ? _o(e) : e;
                o && !n.has(i) && n.set(i, e), t.update(i, e => e + r)
            }
            let s = [];
            for (let [e, r] of t.entries())
                if (r !== 0) {
                    let t = o ? n.get(e) : e;
                    s.push([t, r])
                }
            return new e(s)
        }
        extend(t) {
            let n = t instanceof e ? t.getInner() : t;
            La(this.#e, n)
        }
        add(e, t) {
            t !== 0 && this.#e.push([e, t])
        }
        getInner() {
            return this.#e
        }
    },
    ko = class {#e;
        constructor(e) {
            this.#e = e
        }
        drain() {
            let e = [...this.#e].reverse();
            return this.#e.length = 0, e
        }
        isEmpty() {
            return this.#e.length === 0
        }
    },
    Ao = class {#e = [];
        sendData(e) {
            e instanceof Oo || (e = new Oo(e));
            for (let t of this.#e) t.unshift(e)
        }
        newReader() {
            let e = [];
            return this.#e.push(e), new ko(e)
        }
    },
    jo = class {
        constructor(e, t, n) {
            this.id = e, this.inputs = t, this.output = n
        }
        hasPendingWork() {
            return this.inputs.some(e => !e.isEmpty())
        }
    },
    Mo = class extends jo {
        constructor(e, t, n) {
            super(e, [t], n), this.id = e
        }
        inputMessages() {
            return this.inputs[0].drain()
        }
    },
    No = class extends jo {
        constructor(e, t, n, r) {
            super(e, [t, n], r), this.id = e
        }
        inputAMessages() {
            return this.inputs[0].drain()
        }
        inputBMessages() {
            return this.inputs[1].drain()
        }
    },
    Po = class extends Mo {
        run() {
            for (let e of this.inputMessages()) this.output.sendData(this.inner(e))
        }
    },
    Fo = class {#e = [];#t = 0;#n = !1;
        constructor() {}#r() {
            if (this.#n) throw Error(`Graph already finalized`)
        }
        getNextOperatorId() {
            return this.#r(), this.#t++
        }
        newInput() {
            this.#r();
            let e = new Ao;
            return new Lo(this, e)
        }
        addOperator(e) {
            this.#r(), this.#e.push(e)
        }
        finalize() {
            this.#r(), this.#n = !0
        }
        step() {
            if (!this.#n) throw Error(`Graph not finalized`);
            for (let e of this.#e) e.run()
        }
        pendingWork() {
            return this.#e.some(e => e.hasPendingWork())
        }
        run() {
            for (; this.pendingWork();) this.step()
        }
    },
    Io = class {#e;#t;
        constructor(e, t) {
            this.#e = e, this.#t = t
        }
        connectReader() {
            return this.#t.newReader()
        }
        get writer() {
            return this.#t
        }
        get graph() {
            return this.#e
        }
        pipe(...e) {
            return e.reduce((e, t) => t(e), this)
        }
    },
    Lo = class extends Io {
        sendData(e) {
            this.writer.sendData(e)
        }
    },
    Ro = class extends No {
        run() {
            for (let e of this.inputAMessages()) this.output.sendData(e);
            for (let e of this.inputBMessages()) this.output.sendData(e)
        }
    };

function zo(e) {
    return t => {
        if (t.graph !== e.graph) throw Error(`Cannot concat streams from different graphs`);
        let n = new Io(t.graph, new Ao),
            r = new Ro(t.graph.getNextOperatorId(), t.connectReader(), e.connectReader(), n.writer);
        return t.graph.addOperator(r), n
    }
}
var Bo = class extends Mo {
    run() {
        let e = this.inputMessages();
        if (e.length === 0) return;
        let t = new Oo;
        for (let n of e) t.extend(n);
        let n = t.consolidate();
        n.getInner().length > 0 && this.output.sendData(n)
    }
};

function Vo() {
    return e => {
        let t = new Io(e.graph, new Ao),
            n = new Bo(e.graph.getNextOperatorId(), e.connectReader(), t.writer);
        return e.graph.addOperator(n), t
    }
}
var Ho = Symbol(`NO_PREFIX`),
    Uo = class extends Map {
        addValue(e, t) {
            if (t === 0) return this.size === 0;
            let n = Ko(e),
                r = this.get(n);
            if (qo(r)) {
                let [i, a] = r;
                if (Ko(i) !== n) throw Error(`Mismatching prefixes, this should never happen`);
                if (i === e || _o(i) === _o(e)) {
                    let r = a + t;
                    r === 0 ? this.delete(n) : this.set(n, [e, r])
                } else {
                    let a = new Wo;
                    a.set(_o(i), r), a.set(_o(e), [e, t]), this.set(n, a)
                }
            } else r === void 0 ? this.set(n, [e, t]) : r.addValue(e, t) && this.delete(n);
            return this.size === 0
        }
    },
    Wo = class extends Map {
        addValue(e, t) {
            if (t === 0) return this.size === 0;
            let n = _o(e),
                r = this.get(n);
            if (r) {
                let [, i] = r, a = i + t;
                a === 0 ? this.delete(n) : this.set(n, [e, a])
            } else this.set(n, [e, t]);
            return this.size === 0
        }
    },
    Go = class e {#e;#t = new Map;
        constructor() {
            this.#e = new Map
        }
        static fromMultiSets(t) {
            let n = new e;
            for (let e of t)
                for (let [t, r] of e.getInner()) {
                    let [e, i] = t;
                    n.addValue(e, [i, r])
                }
            return n
        }
        toString(e = !1) {
            return `Index(${JSON.stringify([...this.entries()],void 0,e?2:void 0)})`
        }
        get size() {
            return this.#e.size
        }
        has(e) {
            return this.#e.has(e)
        }
        hasPresence(e) {
            return (this.#t.get(e) || 0) !== 0
        }
        getConsolidatedMultiplicity(e) {
            return this.#t.get(e) || 0
        }
        getPresenceKeys() {
            return this.#t.keys()
        }
        get(e) {
            return [...this.getIterator(e)]
        }* getIterator(e) {
            let t = this.#e.get(e);
            if (qo(t)) yield t;
            else if (t === void 0) return;
            else if (t instanceof Wo)
                for (let e of t.values()) yield e;
            else
                for (let e of t.values())
                    if (qo(e)) yield e;
                    else
                        for (let t of e.values()) yield t
        }* entries() {
            for (let e of this.#e.keys())
                for (let t of this.getIterator(e)) yield [e, t]
        }* entriesIterators() {
            for (let e of this.#e.keys()) yield [e, this.getIterator(e)]
        }
        addValue(e, t) {
            let [n, r] = t;
            if (r === 0) return;
            let i = (this.#t.get(e) || 0) + r;
            i === 0 ? this.#t.delete(e) : this.#t.set(e, i);
            let a = this.#e.get(e);
            if (a === void 0) {
                this.#e.set(e, t);
                return
            }
            if (qo(a)) {
                this.#n(e, a, n, r);
                return
            }
            if (a instanceof Wo) {
                let i = Ko(n);
                if (i !== Ho) {
                    let n = new Uo;
                    n.set(Ho, a), n.set(i, t), this.#e.set(e, n)
                } else a.addValue(n, r) && this.#e.delete(e)
            } else a.addValue(n, r) && this.#e.delete(e)
        }#n(e, t, n, r) {
            let [i, a] = t;
            if (i === n) {
                let t = a + r;
                t === 0 ? this.#e.delete(e) : this.#e.set(e, [n, t]);
                return
            }
            let o = Ko(n),
                s = Ko(i);
            if (s === o && (i === n || _o(i) === _o(n))) {
                let t = a + r;
                t === 0 ? this.#e.delete(e) : this.#e.set(e, [n, t]);
                return
            }
            if (s === Ho && o === Ho) {
                let a = new Wo;
                a.set(_o(i), t), a.set(_o(n), [n, r]), this.#e.set(e, a)
            } else {
                let a = new Uo;
                if (s === o) {
                    let e = new Wo;
                    e.set(_o(i), t), e.set(_o(n), [n, r]), a.set(s, e)
                } else a.set(s, t), a.set(o, [n, r]);
                this.#e.set(e, a)
            }
        }
        append(e) {
            for (let [t, n] of e.entries()) this.addValue(t, n)
        }
        join(e) {
            let t = [];
            if (this.size <= e.size)
                for (let [n, r] of this.entriesIterators()) {
                    if (!e.has(n)) continue;
                    let i = e.get(n);
                    for (let [e, a] of r)
                        for (let [r, o] of i) a !== 0 && o !== 0 && t.push([
                            [n, [e, r]], a * o
                        ])
                } else
                    for (let [n, r] of e.entriesIterators()) {
                        if (!this.has(n)) continue;
                        let e = this.get(n);
                        for (let [i, a] of r)
                            for (let [r, o] of e) o !== 0 && a !== 0 && t.push([
                                [n, [r, i]], o * a
                            ])
                    }
            return new Oo(t)
        }
    };

function Ko(e) {
    return Array.isArray(e) && (typeof e[0] == `string` || typeof e[0] == `number` || typeof e[0] == `bigint`) ? e[0] : Ho
}

function qo(e) {
    return Array.isArray(e)
}
var Jo = class extends Mo {#e = new Go;#t = new Go;#n;
    constructor(e, t, n, r) {
        super(e, t, n), this.#n = r
    }
    run() {
        let e = new Set;
        for (let t of this.inputMessages())
            for (let [n, r] of t.getInner()) {
                let [t, i] = n;
                this.#e.addValue(t, [i, r]), e.add(t)
            }
        let t = [];
        for (let n of e) {
            let e = this.#e.get(n),
                r = this.#t.get(n),
                i = this.#n(e),
                a = new Map,
                o = new Map;
            for (let [e, t] of i) {
                let n = a.get(e) ?? 0;
                a.set(e, n + t)
            }
            for (let [e, t] of r) {
                let n = o.get(e) ?? 0;
                o.set(e, n + t)
            }
            for (let [e, r] of o) a.has(e) || (t.push([
                [n, e], -r
            ]), this.#t.addValue(n, [e, -r]));
            for (let [e, r] of a) o.has(e) || r !== 0 && (t.push([
                [n, e], r
            ]), this.#t.addValue(n, [e, r]));
            for (let [e, r] of a) {
                let i = o.get(e);
                if (i !== void 0) {
                    let a = r - i;
                    a !== 0 && (t.push([
                        [n, e], a
                    ]), this.#t.addValue(n, [e, a]))
                }
            }
        }
        t.length > 0 && this.output.sendData(new Oo(t))
    }
};

function Yo(e) {
    return t => {
        let n = new Io(t.graph, new Ao),
            r = new Jo(t.graph.getNextOperatorId(), t.connectReader(), n.writer, e);
        return t.graph.addOperator(r), n
    }
}
var Xo = class extends Mo {#e;#t;
    constructor(e, t, n, r = e => e) {
        super(e, t, n), this.#e = r, this.#t = new Map
    }
    run() {
        let e = new Map;
        for (let t of this.inputMessages())
            for (let [n, r] of t.getInner()) {
                let t = _o(this.#e(n)),
                    i = (e.get(t) ?.[0] ?? this.#t.get(t) ?? 0) + r;
                e.set(t, [i, n])
            }
        let t = [];
        for (let [n, [r, i]] of e.entries()) {
            let e = this.#t.get(n) ?? 0;
            r === 0 ? this.#t.delete(n) : this.#t.set(n, r), e <= 0 && r > 0 ? t.push([
                [_o(this.#e(i)), i[1]], 1
            ]) : e > 0 && r <= 0 && t.push([
                [_o(this.#e(i)), i[1]], -1
            ])
        }
        t.length > 0 && this.output.sendData(new Oo(t))
    }
};

function Zo(e = e => e) {
    return t => {
        let n = new Io(t.graph, new Ao),
            r = new Xo(t.graph.getNextOperatorId(), t.connectReader(), n.writer, e);
        return t.graph.addOperator(r), n
    }
}
var Qo = class extends Po {#e;
    constructor(e, t, n, r) {
        super(e, t, n), this.#e = r
    }
    inner(e) {
        return e.filter(this.#e)
    }
};

function $o(e) {
    return t => {
        let n = new Io(t.graph, new Ao),
            r = new Qo(t.graph.getNextOperatorId(), t.connectReader(), n.writer, e);
        return t.graph.addOperator(r), n
    }
}
var es = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`;

function ts(e, t, n) {
    let r = n[0];
    if (t != null && e >= t) throw Error(e + ` >= ` + t);
    if (e.slice(-1) === r || t && t.slice(-1) === r) throw Error(`trailing zero`);
    if (t) {
        let i = 0;
        for (;
            (e[i] || r) === t[i];) i++;
        if (i > 0) return t.slice(0, i) + ts(e.slice(i), t.slice(i), n)
    }
    let i = e ? n.indexOf(e[0]) : 0,
        a = t == null ? n.length : n.indexOf(t[0]);
    return a - i > 1 ? n[Math.round(.5 * (i + a))] : t && t.length > 1 ? t.slice(0, 1) : n[i] + ts(e.slice(1), null, n)
}

function ns(e) {
    if (e.length !== rs(e[0])) throw Error(`invalid integer part of order key: ` + e)
}

function rs(e) {
    if (e >= `a` && e <= `z`) return e.charCodeAt(0) - 97 + 2;
    if (e >= `A` && e <= `Z`) return 90 - e.charCodeAt(0) + 2;
    throw Error(`invalid order key head: ` + e)
}

function is(e) {
    let t = rs(e[0]);
    if (t > e.length) throw Error(`invalid order key: ` + e);
    return e.slice(0, t)
}

function as(e, t) {
    if (e === `A` + t[0].repeat(26)) throw Error(`invalid order key: ` + e);
    let n = is(e);
    if (e.slice(n.length).slice(-1) === t[0]) throw Error(`invalid order key: ` + e)
}

function os(e, t) {
    ns(e);
    let [n, ...r] = e.split(``), i = !0;
    for (let e = r.length - 1; i && e >= 0; e--) {
        let n = t.indexOf(r[e]) + 1;
        n === t.length ? r[e] = t[0] : (r[e] = t[n], i = !1)
    }
    if (i) {
        if (n === `Z`) return `a` + t[0];
        if (n === `z`) return null;
        let e = String.fromCharCode(n.charCodeAt(0) + 1);
        return e > `a` ? r.push(t[0]) : r.pop(), e + r.join(``)
    } else return n + r.join(``)
}

function ss(e, t) {
    ns(e);
    let [n, ...r] = e.split(``), i = !0;
    for (let e = r.length - 1; i && e >= 0; e--) {
        let n = t.indexOf(r[e]) - 1;
        n === -1 ? r[e] = t.slice(-1) : (r[e] = t[n], i = !1)
    }
    if (i) {
        if (n === `a`) return `Z` + t.slice(-1);
        if (n === `A`) return null;
        let e = String.fromCharCode(n.charCodeAt(0) - 1);
        return e < `Z` ? r.push(t.slice(-1)) : r.pop(), e + r.join(``)
    } else return n + r.join(``)
}

function cs(e, t, n = es) {
    if (e != null && as(e, n), t != null && as(t, n), e != null && t != null && e >= t) throw Error(e + ` >= ` + t);
    if (e == null) {
        if (t == null) return `a` + n[0];
        let e = is(t),
            r = t.slice(e.length);
        if (e === `A` + n[0].repeat(26)) return e + ts(``, r, n);
        if (e < t) return e;
        let i = ss(e, n);
        if (i == null) throw Error(`cannot decrement any more`);
        return i
    }
    if (t == null) {
        let t = is(e),
            r = e.slice(t.length);
        return os(t, n) ?? t + ts(r, null, n)
    }
    let r = is(e),
        i = e.slice(r.length),
        a = is(t),
        o = t.slice(a.length);
    if (r === a) return r + ts(i, o, n);
    let s = os(r, n);
    if (s == null) throw Error(`cannot increment any more`);
    return s < t ? s : r + ts(i, null, n)
}

function ls(e, t) {
    return [e, t]
}

function us(e) {
    return e[0]
}

function ds(e) {
    return e[1]
}

function fs(e) {
    return ([t, n], [r, i]) => {
        let a = e(n, i);
        return a === 0 ? Ha(t, r) : a
    }
}
var ps = class {#e = [];#t;#n;#r;
        constructor(e, t, n) {
            this.#n = e, this.#r = e + t, this.#t = n
        }
        get size() {
            let e = this.#n,
                t = this.#r - this.#n,
                n = this.#e.length - e;
            return Math.max(0, Math.min(t, n))
        }
        move({
            offset: e,
            limit: t
        }) {
            let n = this.#n,
                r = this.#r - this.#n,
                i = [this.#n, this.#r === 1 / 0 ? this.#n + this.size : this.#r];
            this.#n = e ?? n, this.#r = this.#n + (t ?? r);
            let {
                onlyInA: a,
                onlyInB: o
            } = Ba(i, [this.#n, this.#r === 1 / 0 ? Math.max(this.#n + this.size, i[1]) : this.#r]), s = [];
            o.forEach(e => {
                let t = this.#e[e];
                t && s.push(t)
            });
            let c = [];
            return a.forEach(e => {
                let t = this.#e[e];
                t && c.push(t)
            }), {
                moveIns: s,
                moveOuts: c,
                changes: a.length + o.length > 0
            }
        }
        insert(e) {
            let t = {
                    moveIn: null,
                    moveOut: null
                },
                n = this.#i(e),
                r = ls(e, cs(n === 0 ? null : ds(this.#e[n - 1]), n === this.#e.length ? null : ds(this.#e[n])));
            if (this.#e.splice(n, 0, r), n < this.#r) {
                let e = Math.max(n, this.#n);
                e < this.#e.length && (t.moveIn = this.#e[e], this.#r < this.#e.length && (t.moveOut = this.#e[this.#r]))
            }
            return t
        }
        delete(e) {
            let t = {
                    moveIn: null,
                    moveOut: null
                },
                n = this.#i(e),
                [r] = this.#e.splice(n, 1);
            if (n < this.#r) {
                if (t.moveOut = r, n < this.#n) {
                    let e = this.#n - 1;
                    e < this.#e.length ? t.moveOut = this.#e[e] : t.moveOut = null
                }
                let e = this.#r - 1;
                e < this.#e.length && (t.moveIn = this.#e[e])
            }
            return t
        }#i(e) {
            return Ra(this.#e, ls(e, ``), (e, t) => this.#t(us(e), us(t)))
        }
    },
    ms = class {#e = new Map;#t;
        constructor(e) {
            this.#t = e
        }
        get size() {
            return this.#t.size
        }
        get isEmpty() {
            return this.#e.size === 0 && this.#t.size === 0
        }
        processElement(e, t, n) {
            let {
                oldMultiplicity: r,
                newMultiplicity: i
            } = this.#n(e, n);
            return r <= 0 && i > 0 ? this.#t.insert([e, t]) : r > 0 && i <= 0 ? this.#t.delete([e, t]) : {
                moveIn: null,
                moveOut: null
            }
        }
        move(e) {
            if (!(this.#t instanceof ps)) throw Error(`Cannot move B+-tree implementation of TopK with fractional index`);
            return this.#t.move(e)
        }#n(e, t) {
            if (t === 0) {
                let t = this.#e.get(e) ?? 0;
                return {
                    oldMultiplicity: t,
                    newMultiplicity: t
                }
            }
            let n = this.#e.get(e) ?? 0,
                r = n + t;
            return r === 0 ? this.#e.delete(e) : this.#e.set(e, r), {
                oldMultiplicity: n,
                newMultiplicity: r
            }
        }
    };

function hs(e, t) {
    if (e) {
        let [
            [n, r], i
        ] = e;
        t.push([
            [n, [r, i]], 1
        ])
    }
}

function gs(e, t) {
    if (e) {
        let [
            [n, r], i
        ] = e;
        t.push([
            [n, [r, i]], -1
        ])
    }
}
var _s = class extends Mo {#e = new Map;#t;#n;#r;#i;
    constructor(e, t, n, r, i) {
        super(e, t, n), this.#t = i.groupKeyFn, this.#i = i.limit ?? 1 / 0, this.#r = i.offset ?? 0, this.#n = fs(r), i.setSizeCallback ?.(() => this.#a()), i.setWindowFn ?.(this.#c.bind(this))
    }
    createTopK(e, t, n) {
        return new ps(e, t, n)
    }#a() {
        let e = 0;
        for (let t of this.#e.values()) e += t.size;
        return e
    }#o(e) {
        let t = this.#e.get(e);
        return t || (t = new ms(this.createTopK(this.#r, this.#i, this.#n)), this.#e.set(e, t)), t
    }#s(e, t) {
        t.isEmpty && this.#e.delete(e)
    }#c({
        offset: e,
        limit: t
    }) {
        e !== void 0 && (this.#r = e), t !== void 0 && (this.#i = t);
        let n = [],
            r = !1;
        for (let e of this.#e.values()) {
            let t = e.move({
                offset: this.#r,
                limit: this.#i
            });
            t.moveIns.forEach(e => hs(e, n)), t.moveOuts.forEach(e => gs(e, n)), t.changes && (r = !0)
        }
        r && this.output.sendData(new Oo(n))
    }
    run() {
        let e = [];
        for (let t of this.inputMessages())
            for (let [n, r] of t.getInner()) {
                let [t, i] = n;
                this.#l(t, i, r, e)
            }
        e.length > 0 && this.output.sendData(new Oo(e))
    }#l(e, t, n, r) {
        let i = this.#t(e, t),
            a = this.#o(i),
            o = a.processElement(e, t, n);
        hs(o.moveIn, r), gs(o.moveOut, r), this.#s(i, a)
    }
};

function vs(e, t) {
    return n => {
        let r = new Io(n.graph, new Ao),
            i = new _s(n.graph.getNextOperatorId(), n.connectReader(), r.writer, e, t);
        return n.graph.addOperator(i), r
    }
}
var ys = class extends No {#e = new Go;#t = new Go;#n;
    constructor(e, t, n, r, i = `inner`) {
        super(e, t, n, r), this.#n = i
    }
    run() {
        let e = Go.fromMultiSets(this.inputAMessages()),
            t = Go.fromMultiSets(this.inputBMessages());
        if (e.size === 0 && t.size === 0) return;
        let n = new Oo;
        this.#n !== `anti` && this.emitInnerResults(e, t, n), (this.#n === `left` || this.#n === `full` || this.#n === `anti`) && this.emitLeftOuterResults(e, t, n), (this.#n === `right` || this.#n === `full`) && this.emitRightOuterResults(e, t, n), this.#e.append(e), this.#t.append(t), n.getInner().length > 0 && this.output.sendData(n)
    }
    emitInnerResults(e, t, n) {
        e.size > 0 && n.extend(e.join(this.#t)), t.size > 0 && n.extend(this.#e.join(t)), e.size > 0 && t.size > 0 && n.extend(e.join(t))
    }
    emitLeftOuterResults(e, t, n) {
        if (e.size > 0) {
            for (let [r, i] of e.entriesIterators())
                if (this.#t.getConsolidatedMultiplicity(r) + t.getConsolidatedMultiplicity(r) === 0)
                    for (let [e, t] of i) t !== 0 && n.add([r, [e, null]], t)
        }
        if (t.size > 0)
            for (let e of t.getPresenceKeys()) {
                let r = this.#t.getConsolidatedMultiplicity(e),
                    i = t.getConsolidatedMultiplicity(e);
                if (i === 0) continue;
                let a = r + i;
                if (r === 0 == (a === 0)) continue;
                let o = r === 0;
                for (let [t, r] of this.#e.getIterator(e)) r !== 0 && n.add([e, [t, null]], o ? -r : +r)
            }
    }
    emitRightOuterResults(e, t, n) {
        if (t.size > 0) {
            for (let [r, i] of t.entriesIterators())
                if (this.#e.getConsolidatedMultiplicity(r) + e.getConsolidatedMultiplicity(r) === 0)
                    for (let [e, t] of i) t !== 0 && n.add([r, [null, e]], t)
        }
        if (e.size > 0)
            for (let t of e.getPresenceKeys()) {
                let r = this.#e.getConsolidatedMultiplicity(t),
                    i = e.getConsolidatedMultiplicity(t);
                if (i === 0) continue;
                let a = r + i;
                if (r === 0 == (a === 0)) continue;
                let o = r === 0;
                for (let [e, r] of this.#t.getIterator(t)) r !== 0 && n.add([t, [null, e]], o ? -r : +r)
            }
    }
};

function bs(e, t = `inner`) {
    return n => {
        if (n.graph !== e.graph) throw Error(`Cannot join streams from different graphs`);
        let r = new Io(n.graph, new Ao),
            i = new ys(n.graph.getNextOperatorId(), n.connectReader(), e.connectReader(), r.writer, t);
        return n.graph.addOperator(i), r
    }
}
var xs = class extends Po {#e;
    constructor(e, t, n, r) {
        super(e, t, n), this.#e = r
    }
    inner(e) {
        return e.map(this.#e)
    }
};

function K(e) {
    return t => {
        let n = new Io(t.graph, new Ao),
            r = new xs(t.graph.getNextOperatorId(), t.connectReader(), n.writer, e);
        return t.graph.addOperator(r), n
    }
}
var Ss = class extends Mo {#e;
    constructor(e, t, n, r) {
        super(e, t, n), this.#e = r
    }
    run() {
        for (let e of this.inputMessages()) this.#e(e), this.output.sendData(e)
    }
};

function Cs(e) {
    return t => {
        let n = new Io(t.graph, new Ao),
            r = new Ss(t.graph.getNextOperatorId(), t.connectReader(), n.writer, e);
        return t.graph.addOperator(r), n
    }
}
var ws = class extends Po {#e;
    constructor(e, t, n, r) {
        super(e, t, n), this.#e = r
    }
    inner(e) {
        return this.#e(e), e
    }
};

function Ts(e) {
    return t => {
        let n = new Io(t.graph, new Ao),
            r = new ws(t.graph.getNextOperatorId(), t.connectReader(), n.writer, e);
        return t.graph.addOperator(r), n
    }
}
var Es = class extends Mo {#e;
    constructor(e, t, n, r, i) {
        super(e, t, n);
        let a = i.limit ?? 1 / 0,
            o = i.offset ?? 0;
        this.#e = new ms(this.createTopK(o, a, fs(r))), i.setSizeCallback ?.(() => this.#e.size), i.setWindowFn ?.(this.moveTopK.bind(this))
    }
    createTopK(e, t, n) {
        return new ps(e, t, n)
    }
    moveTopK({
        offset: e,
        limit: t
    }) {
        let n = [],
            r = this.#e.move({
                offset: e,
                limit: t
            });
        r.moveIns.forEach(e => hs(e, n)), r.moveOuts.forEach(e => gs(e, n)), r.changes && this.output.sendData(new Oo(n))
    }
    run() {
        let e = [];
        for (let t of this.inputMessages())
            for (let [n, r] of t.getInner()) {
                let [t, i] = n;
                this.processElement(t, i, r, e)
            }
        e.length > 0 && this.output.sendData(new Oo(e))
    }
    processElement(e, t, n, r) {
        let i = this.#e.processElement(e, t, n);
        hs(i.moveIn, r), gs(i.moveOut, r)
    }
};

function Ds(e, t) {
    let n = t || {};
    return t => {
        let r = new Io(t.graph, new Ao),
            i = new Es(t.graph.getNextOperatorId(), t.connectReader(), r.writer, e, n);
        return t.graph.addOperator(i), r
    }
}

function Os(e) {
    return `pipe` in e
}

function ks(e, t = {}) {
    let n = Object.fromEntries(Object.entries(t).filter(([e, t]) => !Os(t)));
    return Object.fromEntries(Object.entries(t).filter(([e, t]) => Os(t))), t => {
        let r = `__original_key__`;
        return t.pipe(K(t => {
            let i = e(t),
                a = Ua(i),
                o = {};
            o[r] = i;
            for (let [e, r] of Object.entries(n)) o[e] = r.preMap(t);
            return [a, o]
        })).pipe(Yo(e => {
            let t = 0;
            for (let [n, r] of e) t += r;
            if (t <= 0) return [];
            let i = {};
            i[r] = e[0] ?.[0] ?.[r];
            for (let [t, r] of Object.entries(n)) {
                let n = e.map(([e, n]) => [e[t], n]);
                i[t] = r.reduce(n)
            }
            return [
                [i, 1]
            ]
        })).pipe(K(([e, t]) => {
            let i = t[r],
                a = {};
            Object.assign(a, i);
            for (let [e, r] of Object.entries(n)) r.postMap ? a[e] = r.postMap(t[e]) : a[e] = t[e];
            return [e, a]
        }))
    }
}

function As(e = e => e) {
    return {
        preMap: t => e(t),
        reduce: e => {
            let t = 0;
            for (let [n, r] of e) t += n * r;
            return t
        }
    }
}

function js(e = e => e) {
    return {
        preMap: t => e(t) == null ? 0 : 1,
        reduce: e => {
            let t = 0;
            for (let [n, r] of e) t += n * r;
            return t
        }
    }
}

function Ms(e = e => e) {
    return {
        preMap: t => ({
            sum: e(t),
            count: 0
        }),
        reduce: e => {
            let t = 0,
                n = 0;
            for (let [r, i] of e) t += r.sum * i, n += i;
            return {
                sum: t,
                count: n
            }
        },
        postMap: e => e.sum / e.count
    }
}

function Ns(e) {
    let t = e ?? (e => e);
    return {
        preMap: e => t(e),
        reduce: e => {
            let t;
            for (let [n, r] of e)(!t || n && n < t) && (t = n);
            return t
        }
    }
}

function Ps(e) {
    let t = e ?? (e => e);
    return {
        preMap: e => t(e),
        reduce: e => {
            let t;
            for (let [n, r] of e)(!t || n && n > t) && (t = n);
            return t
        }
    }
}

function Fs(e = e => e) {
    return {
        preMap: t => [e(t)],
        reduce: e => {
            let t = [];
            for (let [n, r] of e)
                for (let e of n)
                    for (let n = 0; n < r; n++) t.push(e);
            return t.length === 0 ? [] : (t.sort((e, t) => e - t), t)
        },
        postMap: e => {
            if (e.length === 0) return 0;
            let t = Math.floor(e.length / 2);
            return e.length % 2 == 0 ? (e[t - 1] + e[t]) / 2 : e[t]
        }
    }
}

function Is(e = e => e) {
    return {
        preMap: t => {
            let n = e(t),
                r = new Map;
            return r.set(n, 1), r
        },
        reduce: e => {
            let t = new Map;
            for (let [n, r] of e)
                for (let [e, i] of n.entries()) {
                    let n = t.get(e) || 0;
                    t.set(e, n + i * r)
                }
            return t
        },
        postMap: e => {
            if (e.size === 0) return 0;
            let t = 0,
                n = 0;
            for (let [r, i] of e.entries()) i > n && (n = i, t = r);
            return t
        }
    }
}
var Ls = {
    sum: As,
    count: js,
    avg: Ms,
    min: Ns,
    max: Ps,
    median: Fs,
    mode: Is
};

function Rs(e, t) {
    let n = t.limit ?? 1 / 0,
        r = t.offset ?? 0,
        i = t.setSizeCallback,
        a = t.setWindowFn,
        o = t.groupKeyFn,
        s = t.comparator ?? ((e, t) => e === t ? 0 : e < t ? -1 : 1);
    return t => t.pipe(vs((t, n) => s(e(t), e(n)), {
        limit: n,
        offset: r,
        setSizeCallback: i,
        setWindowFn: a,
        groupKeyFn: o
    }), Vo())
}

function zs(e, t, n) {
    let r = n ?.limit ?? 1 / 0,
        i = n ?.offset ?? 0,
        a = n ?.setSizeCallback,
        o = n ?.setWindowFn,
        s = n ?.comparator ?? ((e, t) => e === t ? 0 : e < t ? -1 : 1);
    return n => n.pipe(e((e, n) => s(t(e), t(n)), {
        limit: r,
        offset: i,
        setSizeCallback: a,
        setWindowFn: o
    }), Vo())
}

function Bs(e, t) {
    return zs(Ds, e, t)
}
var Vs = `__virtual_synced__`,
    Hs = `__virtual_has_local__`,
    Us = `__group_key_`;

function Ws(e) {
    let t = !1,
        n = !0,
        r = !1;
    for (let [i, a] of Object.entries(e)) {
        if (i === `$selected` || typeof a != `object` || !a) continue;
        let e = a,
            o = `$synced` in e,
            s = `$origin` in e;
        !o && !s || (t = !0, e.$synced === !1 && (n = !1), e.$origin === `local` && (r = !0))
    }
    return {
        synced: t ? n : !0,
        hasLocal: r
    }
}
var {
    sum: Gs,
    count: Ks,
    avg: qs,
    min: Js,
    max: Ys
} = Ls;

function Xs(e, t) {
    let n = new Map,
        r = [...e];
    if (!t) return {
        selectToGroupByIndex: n,
        groupByExpressions: r
    };
    for (let [e, i] of Object.entries(t)) {
        if (i.type === `agg` || nc(i)) continue;
        let t = r.findIndex(e => Qs(i, e));
        if (t === -1) throw new Di(e);
        n.set(e, t)
    }
    return {
        selectToGroupByIndex: n,
        groupByExpressions: r
    }
}

function Zs(e, t, n, r, i, a, o) {
    let s = {
        [Vs]: {
            preMap: ([, e]) => Ws(e).synced,
            reduce: e => {
                for (let [t, n] of e)
                    if (!t && n > 0) return !1;
                return !0
            }
        },
        [Hs]: {
            preMap: ([, e]) => Ws(e).hasLocal,
            reduce: e => {
                for (let [t, n] of e)
                    if (t && n > 0) return !0;
                return !1
            }
        }
    };
    if (t.length === 0) {
        let t = s,
            c = {},
            l = {
                value: 0
            };
        if (r) {
            for (let [e, n] of Object.entries(r))
                if (n.type === `agg`) t[e] = $s(n);
                else if (nc(n)) {
                let {
                    transformed: r,
                    extracted: i
                } = rc(n, l);
                for (let [e, n] of Object.entries(i)) t[e] = $s(n);
                c[e] = oc(r)
            }
        }
        let u = o ? ([, e]) => ({
            __singleGroup: !0,
            __correlationKey: e ?.[o] ?.__correlationKey
        }) : () => ({
            __singleGroup: !0
        });
        if (e = e.pipe(ks(u, t)), e = e.pipe(K(([, e]) => {
                let t = { ...e.$selected || {}
                };
                if (r) {
                    for (let [n, i] of Object.entries(r)) i.type === `agg` && (t[n] = e[n]);
                    tc(t, e, c)
                }
                let n = o ? e.__correlationKey : void 0,
                    i = n === void 0 ? `single_group` : `single_group_${Ua(n)}`,
                    s = { ...e,
                        $selected: t
                    },
                    l = e[Vs],
                    u = e[Hs];
                return s.$synced = l ?? !0, s.$origin = u ? `local` : `remote`, s.$key = i, s.$collectionId = a ?? s.$collectionId, o && n !== void 0 && (s[o] = {
                    __correlationKey: n
                }), [i, s]
            })), n && n.length > 0)
            for (let t of n) {
                let n = W(ec(lr(t), r || {}, `$selected`));
                e = e.pipe($o(([, e]) => ia(n({
                    $selected: e.$selected
                }))))
            }
        if (i && i.length > 0)
            for (let t of i) e = e.pipe($o(([, e]) => ia(t({
                $selected: e.$selected
            }))));
        return e
    }
    let c = Xs(t, r),
        l = t.map(e => W(e)),
        u = ([, e]) => {
            let n = { ...e
            };
            delete n.$selected;
            let r = {};
            for (let e = 0; e < t.length; e++) {
                let t = l[e],
                    i = t(n);
                r[`__key_${e}`] = i
            }
            return o && (r.__correlationKey = e ?.[o] ?.__correlationKey), r
        },
        d = s,
        f = {},
        p = {
            value: 0
        };
    if (r) {
        for (let [e, n] of Object.entries(r))
            if (n.type === `agg`) d[e] = $s(n);
            else if (nc(n)) {
            let {
                transformed: r,
                extracted: i
            } = rc(n, p);
            for (let [e, t] of Object.entries(i)) d[e] = $s(t);
            f[e] = oc(ic(r, t))
        }
    }
    if (e = e.pipe(ks(u, d)), e = e.pipe(K(([, e]) => {
            let n = e.$selected || {},
                i = {};
            if (r) {
                for (let [t, a] of Object.entries(r))
                    if (a.type === `agg`) i[t] = e[t];
                    else if (!f[t]) {
                    let r = c.selectToGroupByIndex.get(t);
                    r === void 0 ? i[t] = n[t] : i[t] = e[`__key_${r}`]
                }
                tc(i, e, f, t.length)
            } else
                for (let n = 0; n < t.length; n++) i[`__key_${n}`] = e[`__key_${n}`];
            let s = o ? e.__correlationKey : void 0,
                l = [];
            for (let n = 0; n < t.length; n++) l.push(e[`__key_${n}`]);
            s !== void 0 && l.push(s);
            let u = l.length === 1 ? l[0] : Ua(l),
                d = { ...e,
                    $selected: i
                },
                p = e[Vs],
                m = e[Hs];
            return d.$synced = p ?? !0, d.$origin = m ? `local` : `remote`, d.$key = u, d.$collectionId = a ?? d.$collectionId, o && s !== void 0 && (d[o] = {
                __correlationKey: s
            }), [u, d]
        })), n && n.length > 0)
        for (let t of n) {
            let n = W(ec(lr(t), r || {}));
            e = e.pipe($o(([, e]) => n({
                $selected: e.$selected
            })))
        }
    if (i && i.length > 0)
        for (let t of i) e = e.pipe($o(([, e]) => ia(t({
            $selected: e.$selected
        }))));
    return e
}

function Qs(e, t) {
    if (!e || !t || e.type !== t.type) return !1;
    switch (e.type) {
        case `ref`:
            return !e.path || !t.path || e.path.length !== t.path.length ? !1 : e.path.every((e, n) => e === t.path[n]);
        case `val`:
            return e.value === t.value;
        case `func`:
            return e.name === t.name && e.args ?.length === t.args ?.length && (e.args || []).every((e, n) => Qs(e, t.args[n]));
        case `agg`:
            return e.name === t.name && e.args ?.length === t.args ?.length && (e.args || []).every((e, n) => Qs(e, t.args[n]));
        default:
            return !1
    }
}

function $s(e) {
    let t = W(e.args[0]),
        n = ([, e]) => {
            let n = t(e);
            return typeof n == `number` ? n : n == null ? 0 : Number(n)
        },
        r = ([, e]) => {
            let n = t(e);
            return typeof n == `number` || typeof n == `string` || typeof n == `bigint` || n instanceof Date ? n : n == null ? 0 : Number(n)
        },
        i = ([, e]) => t(e);
    switch (e.name.toLowerCase()) {
        case `sum`:
            return Gs(n);
        case `count`:
            return Ks(i);
        case `avg`:
            return qs(n);
        case `min`:
            return Js(r);
        case `max`:
            return Ys(r);
        default:
            throw new Oi(e.name)
    }
}

function ec(e, t, n = `$selected`) {
    switch (e.type) {
        case `agg`:
            {
                let r = e;
                for (let [e, i] of Object.entries(t))
                    if (i.type === `agg` && dc(r, i)) return new z([n, e]);
                throw new ki(r.name)
            }
        case `func`:
            {
                let n = e,
                    r = n.args.map(e => ec(e, t));
                return new V(n.name, r)
            }
        case `ref`:
            return e;
        case `val`:
            return e;
        default:
            throw new Ai(e.type)
    }
}

function tc(e, t, n, r = 0) {
    for (let n of Object.keys(t)) n.startsWith(`__agg_`) && (e[n] = t[n]);
    for (let n = 0; n < r; n++) e[`${Us}${n}`] = t[`__key_${n}`];
    for (let [t, r] of Object.entries(n)) e[t] = r({
        $selected: e
    });
    for (let t of Object.keys(e))(t.startsWith(`__agg_`) || t.startsWith(Us)) && delete e[t]
}

function nc(e) {
    return uc(e) ? e.branches.some(e => nc(e.condition) || nc(e.value)) || e.defaultValue !== void 0 && nc(e.defaultValue) : lc(e) ? Object.values(e).some(e => nc(e)) : sr(e) ? e.type === `agg` ? !0 : e.type === `func` && `args` in e ? e.args.some(e => nc(e)) : !1 : !1
}

function rc(e, t) {
    if (e.type === `includesSubquery`) return {
        transformed: e,
        extracted: {}
    };
    if (e.type === `agg`) {
        let n = `__agg_${t.value++}`;
        return {
            transformed: new z([`$selected`, n]),
            extracted: {
                [n]: e
            }
        }
    }
    if (e.type === `func`) {
        let n = {},
            r = e.args.map(e => {
                let r = rc(e, t);
                return Object.assign(n, r.extracted), r.transformed
            });
        return {
            transformed: new V(e.name, r),
            extracted: n
        }
    }
    if (uc(e)) {
        let n = {},
            r = e.branches.map(e => {
                let r = rc(e.condition, t),
                    i = rc(e.value, t);
                return Object.assign(n, r.extracted, i.extracted), {
                    condition: r.transformed,
                    value: i.transformed
                }
            }),
            i = e.defaultValue === void 0 ? void 0 : rc(e.defaultValue, t);
        return i && Object.assign(n, i.extracted), {
            transformed: new H(r, i ?.transformed),
            extracted: n
        }
    }
    if (lc(e)) {
        let n = {},
            r = {};
        for (let [i, a] of Object.entries(e)) {
            let e = rc(a, t);
            Object.assign(n, e.extracted), r[i] = e.transformed
        }
        return {
            transformed: r,
            extracted: n
        }
    }
    return {
        transformed: e,
        extracted: {}
    }
}

function ic(e, t) {
    if (uc(e)) return new H(e.branches.map(e => ({
        condition: ac(e.condition, t),
        value: ic(e.value, t)
    })), e.defaultValue === void 0 ? void 0 : ic(e.defaultValue, t));
    if (lc(e)) {
        let n = {};
        for (let [r, i] of Object.entries(e)) n[r] = ic(i, t);
        return n
    }
    return !sr(e) || e.type === `includesSubquery` || e.type === `agg` ? e : ac(e, t)
}

function ac(e, t) {
    if (e.type === `ref`) {
        let n = t.findIndex(t => Qs(e, t));
        return n === -1 ? e : new z([`$selected`, `${Us}${n}`])
    }
    return e.type === `func` ? new V(e.name, e.args.map(e => ac(e, t))) : e
}

function oc(e) {
    return uc(e) ? cc(e) : e.type === `includesSubquery` ? () => null : lc(e) ? sc(e) : sr(e) ? W(e) : () => e
}

function sc(e) {
    let t = Object.entries(e).map(([e, t]) => {
        if (e.startsWith(`__SPREAD_SENTINEL__`)) {
            let n = e.slice(19),
                r = n.lastIndexOf(`__`),
                i = r >= 0 ? n.slice(0, r) : n;
            return {
                key: e,
                spread: !0,
                value: W(typeof t == `object` && `type` in t && t.type === `ref` ? t : new z(i.split(`.`)))
            }
        }
        return {
            key: e,
            spread: !1,
            value: oc(t)
        }
    });
    return e => {
        let n = {};
        for (let r of t) {
            let t = r.value(e);
            r.spread ? t && typeof t == `object` && Object.assign(n, t) : n[r.key] = t
        }
        return n
    }
}

function cc(e) {
    let t = e.branches.map(e => ({
            condition: W(e.condition),
            value: oc(e.value)
        })),
        n = e.defaultValue === void 0 ? void 0 : oc(e.defaultValue);
    return e => {
        for (let n of t)
            if (ua(n.condition(e))) return n.value(e);
        return n === void 0 ? null : n(e)
    }
}

function lc(e) {
    return typeof e == `object` && !!e && !Array.isArray(e) && !e.__refProxy && !sr(e)
}

function uc(e) {
    return e instanceof H || typeof e == `object` && !!e && e.type === `conditionalSelect`
}

function dc(e, t) {
    return e.name === t.name && e.args.length === t.args.length && e.args.every((e, n) => Qs(e, t.args[n]))
}

function fc(e, t, n, r, i, a, o, s, c, l) {
    let u = n.map(e => ({
            compiledExpression: W(ec(e.expression, r, `$selected`)),
            compareOptions: pc(e, i)
        })),
        d = e => {
            let t = e;
            return n.length > 1 ? u.map(e => e.compiledExpression(t)) : n.length === 1 ? u[0].compiledExpression(t) : null
        },
        f = (e, t) => {
            if (n.length > 1) {
                let r = e,
                    i = t;
                for (let e = 0; e < n.length; e++) {
                    let t = u[e],
                        n = qi(t.compareOptions)(r[e], i[e]);
                    if (n !== 0) return n
                }
                return r.length - i.length
            }
            if (n.length === 1) {
                let n = u[0];
                return qi(n.compareOptions)(e, t)
            }
            return Ji(e, t)
        },
        p, m;
    if (s && !l && e.from.type !== `unionFrom` && e.from.type !== `unionAll`) {
        let t, r, o, l = e.from.alias,
            u = n[0],
            d = u.expression;
        if (d.type === `ref`) {
            let n = pr(e, d, i);
            if (n) {
                r = n.collection;
                let i = n.path[0],
                    a = pc(u, r);
                if (i) {
                    let e = qi(a);
                    Ma(i, n.path, r, a, e)
                }
                if (o = W(new z(n.path), !0), t = _a(r, n.path, a), t ?.supports(`gt`) || (t = void 0), !t) {
                    let e = r.id,
                        t = n.path.join(`.`);
                    console.warn(`[TanStack DB]${e?` [${e}]`:``} orderBy with limit requires an index on "${t}" for efficient lazy loading. Falling back to loading all data. Consider creating an index on the collection with collection.createIndex((row) => row.${t}) or enable auto-indexing with autoIndex: 'eager' and a defaultIndexType.`)
                }
                l = d.path.length > 1 ? String(d.path[0]) : e.from.alias
            }
        }
        if (o) {
            let u = n.every(e => e.expression.type === `ref`) ? n.map(t => {
                let n = t.expression,
                    r = pr(e, n, i);
                return W(r ? new z(r.path) : t.expression, !0)
            }) : void 0;
            m = {
                alias: l,
                offset: c ?? 0,
                limit: s,
                comparator: (e, t) => {
                    if (n.length === 1) return f(e && o(e), t && o(t));
                    if (u) {
                        let n = e => e && u.map(t => t(e));
                        return f(n(e), n(t))
                    }
                    return 0
                },
                valueExtractorForRawRow: e => {
                    if (n.length === 1) return o(e);
                    if (u) return u.map(t => t(e))
                },
                firstColumnValueExtractor: o,
                index: t,
                orderBy: n
            };
            let d = r ?.id ?? i.id;
            a[d] = m, t && (p = e => {
                a[d].dataNeeded = () => {
                    let t = e();
                    return Math.max(0, m.limit - t)
                }
            })
        }
    }
    return l ? t.pipe(Rs(d, {
        limit: s,
        offset: c,
        comparator: f,
        setSizeCallback: p,
        groupKeyFn: l,
        setWindowFn: e => {
            o(t => {
                e(t), m && (m.offset = t.offset ?? m.offset, m.limit = t.limit ?? m.limit)
            })
        }
    })) : t.pipe(Bs(d, {
        limit: s,
        offset: c,
        comparator: f,
        setSizeCallback: p,
        setWindowFn: e => {
            o(t => {
                e(t), m && (m.offset = t.offset ?? m.offset, m.limit = t.limit ?? m.limit)
            })
        }
    }))
}

function pc(e, t) {
    return e.compareOptions.stringSort === void 0 ? { ...t.compareOptions,
        direction: e.compareOptions.direction,
        nulls: e.compareOptions.nulls
    } : e.compareOptions
}

function mc(e, t = {}) {
    let n = t => {
        let n = [];
        for (let [r, i] of e.entries())(t ?.(i) ?? !0) && n.push({
            type: `insert`,
            key: r,
            value: i
        });
        return n
    };
    if (t.limit !== void 0 && !t.orderBy) throw Error(`limit cannot be used without orderBy`);
    if (t.orderBy) {
        let n = t.where ? hc(t.where) : void 0,
            r = _c(e, t.orderBy, t.limit, n, t.optimizedOnly);
        if (r === void 0) return;
        let i = [];
        for (let t of r) {
            let n = e.get(t);
            n !== void 0 && i.push({
                type: `insert`,
                key: t,
                value: n
            })
        }
        return i
    }
    if (!t.where) return n();
    try {
        let r = t.where,
            i = ba(r, e);
        if (i.canOptimize) {
            let t = [];
            for (let n of i.matchingKeys) {
                let r = e.get(n);
                r !== void 0 && t.push({
                    type: `insert`,
                    key: n,
                    value: r
                })
            }
            return t
        } else return t.optimizedOnly ? void 0 : n(hc(r))
    } catch (r) {
        console.warn(`${e.id?`[${e.id}] `:``}Error processing where clause, falling back to full scan:`, r);
        let i = hc(t.where);
        return t.optimizedOnly ? void 0 : n(i)
    }
}

function hc(e) {
    let t = aa(e);
    return e => {
        try {
            return ia(t(e))
        } catch {
            return !1
        }
    }
}

function gc(e, t) {
    let n = hc(t.whereExpression);
    return t => {
        let r = [];
        for (let e of t)
            if (e.type === `insert`) n(e.value) && r.push(e);
            else if (e.type === `update`) {
            let t = n(e.value),
                i = e.previousValue ? n(e.previousValue) : !1;
            t && i ? r.push(e) : t && !i ? r.push({ ...e,
                type: `insert`
            }) : !t && i && r.push({ ...e,
                type: `delete`,
                value: e.previousValue
            })
        } else n(e.value) && r.push(e);
        (r.length > 0 || t.length === 0) && e(r)
    }
}

function _c(e, t, n, r, i) {
    if (t.length === 1) {
        let i = t[0],
            a = i.expression;
        if (a.type === `ref`) {
            let t = a.path,
                o = pc(i, e);
            Ma(t[0], t, e, o);
            let s = _a(e, t, o);
            if (s && s.supports(`gt`)) return s.takeFromStart(n ?? s.keyCount, t => {
                let n = e.get(t);
                return n === void 0 ? !1 : r ?.(n) ?? !0
            })
        }
    }
    if (i) return;
    let a = [];
    for (let [t, n] of e.entries())(r ?.(n) ?? !0) && a.push({
        key: t,
        value: n
    });
    a.sort((e, n) => {
        for (let r of t) {
            let t = qi(r.compareOptions)(vc(e.value, r.expression), vc(n.value, r.expression));
            if (t !== 0) return t
        }
        return 0
    });
    let o = a.map(e => e.key);
    return n === void 0 ? o : o.slice(0, n)
}

function vc(e, t) {
    if (t.type === `ref`) {
        let n = t,
            r = e;
        for (let e of n.path) r = r ?.[e];
        return r
    } else if (t.type === `val`) return t.value;
    else return aa(t)(e)
}
var yc = class {
        constructor(e) {
            this.map = new Map, this.sortedKeys = [], this.comparator = e
        }
        indexOf(e, t) {
            let n = 0,
                r = this.sortedKeys.length;
            if (!this.comparator) {
                for (; n < r;) {
                    let t = Math.floor((n + r) / 2),
                        i = this.sortedKeys[t],
                        a = Ha(e, i);
                    if (a < 0) r = t;
                    else if (a > 0) n = t + 1;
                    else return t
                }
                return n
            }
            for (; n < r;) {
                let i = Math.floor((n + r) / 2),
                    a = this.sortedKeys[i],
                    o = this.map.get(a),
                    s = this.comparator(t, o);
                if (s < 0) r = i;
                else if (s > 0) n = i + 1;
                else {
                    let t = Ha(e, a);
                    if (t < 0) r = i;
                    else if (t > 0) n = i + 1;
                    else return i
                }
            }
            return n
        }
        set(e, t) {
            if (this.map.has(e)) {
                let t = this.map.get(e),
                    n = this.indexOf(e, t);
                this.sortedKeys.splice(n, 1)
            }
            let n = this.indexOf(e, t);
            return this.sortedKeys.splice(n, 0, e), this.map.set(e, t), this
        }
        get(e) {
            return this.map.get(e)
        }
        delete(e) {
            if (this.map.has(e)) {
                let t = this.map.get(e),
                    n = this.indexOf(e, t);
                return this.sortedKeys.splice(n, 1), this.map.delete(e)
            }
            return !1
        }
        has(e) {
            return this.map.has(e)
        }
        clear() {
            this.map.clear(), this.sortedKeys = []
        }
        get size() {
            return this.map.size
        }*[Symbol.iterator]() {
            for (let e of this.sortedKeys) yield [e, this.map.get(e)]
        }
        entries() {
            return this[Symbol.iterator]()
        }
        keys() {
            return this.sortedKeys[Symbol.iterator]()
        }
        values() {
            return (function*() {
                for (let e of this.sortedKeys) yield this.map.get(e)
            }).call(this)
        }
        forEach(e) {
            for (let t of this.sortedKeys) e(this.map.get(t), t, this.map)
        }
    },
    bc = `__tanstack_db_direct`,
    xc = class {
        constructor(e) {
            this.pendingSyncedTransactions = [], this.syncedMetadata = new Map, this.syncedCollectionMetadata = new Map, this.optimisticUpserts = new Map, this.optimisticDeletes = new Set, this.pendingOptimisticUpserts = new Map, this.pendingOptimisticDeletes = new Set, this.pendingOptimisticDirectUpserts = new Set, this.pendingOptimisticDirectDeletes = new Set, this.rowOrigins = new Map, this.pendingLocalChanges = new Set, this.pendingLocalOrigins = new Set, this.virtualPropsCache = new WeakMap, this.size = 0, this.syncedKeys = new Set, this.preSyncVisibleState = new Map, this.recentlySyncedKeys = new Set, this.hasReceivedFirstCommit = !1, this.isCommittingSyncTransactions = !1, this.isLocalOnly = !1, this.commitPendingTransactions = () => {
                let e = !1;
                for (let t of this.transactions.values())
                    if (t.state === `persisting`) {
                        e = !0;
                        break
                    }
                let {
                    committedSyncedTransactions: t,
                    uncommittedSyncedTransactions: n,
                    hasTruncateSync: r,
                    hasImmediateSync: i
                } = this.pendingSyncedTransactions.reduce((e, t) => (t.committed ? (e.committedSyncedTransactions.push(t), t.truncate && (e.hasTruncateSync = !0), t.immediate && (e.hasImmediateSync = !0)) : e.uncommittedSyncedTransactions.push(t), e), {
                    committedSyncedTransactions: [],
                    uncommittedSyncedTransactions: [],
                    hasTruncateSync: !1,
                    hasImmediateSync: !1
                });
                if (!e || r || i) {
                    this.isCommittingSyncTransactions = !0;
                    let e = new Map(this.rowOrigins),
                        i = new Map(this.optimisticUpserts),
                        a = new Set(this.optimisticDeletes),
                        o = r ? t.find(e => e.truncate) ?.optimisticSnapshot : null,
                        s, c, l = new Set;
                    for (let e of t) {
                        for (let t of e.operations) l.add(t.key);
                        for (let [t] of e.rowMetadataWrites) l.add(t)
                    }
                    let u = this.preSyncVisibleState;
                    if (u.size === 0) {
                        u = new Map;
                        for (let e of l) {
                            let t = this.get(e);
                            t !== void 0 && u.set(e, t)
                        }
                    }
                    let d = [],
                        f = this.config.sync.rowUpdateMode || `partial`,
                        p = new Map;
                    for (let e of this.transactions.values())
                        if (e.state === `completed`)
                            for (let t of e.mutations) this.isThisCollection(t.collection) && t.optimistic && p.set(t.key, {
                                type: t.type,
                                value: t.modified
                            });
                    for (let e of t) {
                        if (e.truncate) {
                            let e = new Set([...this.syncedData.keys(), ...o ?.upserts.keys() || []]);
                            for (let t of e) {
                                if (o ?.deletes.has(t)) continue;
                                let e = o ?.upserts.get(t) || this.syncedData.get(t);
                                e !== void 0 && d.push({
                                    type: `delete`,
                                    key: t,
                                    value: e
                                })
                            }
                            s = new Set(this.pendingLocalChanges), c = new Set(this.pendingLocalOrigins), this.syncedData.clear(), this.syncedMetadata.clear(), this.syncedKeys.clear(), this.clearOriginTrackingState();
                            for (let e of l) u.delete(e);
                            this._events.emit(`truncate`, {
                                type: `truncate`,
                                collection: this.collection
                            })
                        }
                        for (let t of e.operations) {
                            let e = t.key;
                            this.syncedKeys.add(e);
                            let n = this.isLocalOnly || this.pendingLocalChanges.has(e) || this.pendingLocalOrigins.has(e) || s ?.has(e) === !0 || c ?.has(e) === !0 ? `local` : `remote`;
                            switch (t.type) {
                                case `insert`:
                                    this.syncedData.set(e, t.value), this.rowOrigins.set(e, n), this.pendingLocalChanges.delete(e), this.pendingLocalOrigins.delete(e), this.pendingOptimisticUpserts.delete(e), this.pendingOptimisticDeletes.delete(e), this.pendingOptimisticDirectUpserts.delete(e), this.pendingOptimisticDirectDeletes.delete(e);
                                    break;
                                case `update`:
                                    if (f === `partial`) {
                                        let n = Object.assign({}, this.syncedData.get(e), t.value);
                                        this.syncedData.set(e, n)
                                    } else this.syncedData.set(e, t.value);
                                    this.rowOrigins.set(e, n), this.pendingLocalChanges.delete(e), this.pendingLocalOrigins.delete(e), this.pendingOptimisticUpserts.delete(e), this.pendingOptimisticDeletes.delete(e), this.pendingOptimisticDirectUpserts.delete(e), this.pendingOptimisticDirectDeletes.delete(e);
                                    break;
                                case `delete`:
                                    this.syncedData.delete(e), this.syncedMetadata.delete(e), this.rowOrigins.delete(e), this.pendingLocalChanges.delete(e), this.pendingLocalOrigins.delete(e), this.pendingOptimisticUpserts.delete(e), this.pendingOptimisticDeletes.delete(e), this.pendingOptimisticDirectUpserts.delete(e), this.pendingOptimisticDirectDeletes.delete(e);
                                    break
                            }
                        }
                        for (let [t, n] of e.rowMetadataWrites) {
                            if (n.type === `delete`) {
                                this.syncedMetadata.delete(t);
                                continue
                            }
                            this.syncedMetadata.set(t, n.value)
                        }
                        for (let [t, n] of e.collectionMetadataWrites) {
                            if (n.type === `delete`) {
                                this.syncedCollectionMetadata.delete(t);
                                continue
                            }
                            this.syncedCollectionMetadata.set(t, n.value)
                        }
                    }
                    if (r) {
                        let e = new Set;
                        for (let n of t)
                            for (let t of n.operations)(t.type === `insert` || t.type === `update`) && e.add(t.key);
                        let n = new Map(o.upserts),
                            r = new Set(o.deletes);
                        for (let [t, i] of n)
                            if (!r.has(t))
                                if (e.has(t)) {
                                    let e = !1;
                                    for (let n = d.length - 1; n >= 0; n--) {
                                        let r = d[n];
                                        if (r.key === t && r.type === `insert`) {
                                            r.value = i, e = !0;
                                            break
                                        }
                                    }
                                    e || d.push({
                                        type: `insert`,
                                        key: t,
                                        value: i
                                    })
                                } else d.push({
                                    type: `insert`,
                                    key: t,
                                    value: i
                                });
                        if (d.length > 0 && r.size > 0) {
                            let e = [];
                            for (let t of d) t.type === `insert` && r.has(t.key) || e.push(t);
                            d.length = 0, d.push(...e)
                        }
                        this.lifecycle.status !== `ready` && this.lifecycle.markReady()
                    }
                    if (this.optimisticUpserts.clear(), this.optimisticDeletes.clear(), this.isCommittingSyncTransactions = !1, r && o) {
                        for (let [e, t] of o.upserts) this.optimisticUpserts.set(e, t);
                        for (let e of o.deletes) this.optimisticDeletes.add(e)
                    }
                    for (let e of this.transactions.values())
                        if (![`completed`, `failed`].includes(e.state)) {
                            for (let t of e.mutations)
                                if (this.isThisCollection(t.collection) && t.optimistic) switch (t.type) {
                                    case `insert`:
                                    case `update`:
                                        this.optimisticUpserts.set(t.key, t.modified), this.optimisticDeletes.delete(t.key);
                                        break;
                                    case `delete`:
                                        this.optimisticUpserts.delete(t.key), this.optimisticDeletes.add(t.key);
                                        break
                                }
                        }
                    for (let e of this.pendingOptimisticDirectUpserts)
                        if (!l.has(e)) {
                            if (l.add(e), !u.has(e)) {
                                let t = i.get(e);
                                t !== void 0 && u.set(e, t)
                            }
                            this.pendingOptimisticUpserts.delete(e), this.pendingLocalOrigins.delete(e)
                        }
                    for (let e of this.pendingOptimisticDirectDeletes) l.has(e) || l.add(e), this.pendingOptimisticDeletes.delete(e), this.pendingLocalOrigins.delete(e);
                    this.pendingOptimisticDirectUpserts.clear(), this.pendingOptimisticDirectDeletes.clear();
                    for (let t of l) {
                        let n = u.get(t),
                            r = this.get(t),
                            o = this.getVirtualPropsSnapshotForState(t, {
                                rowOrigins: e,
                                optimisticUpserts: i,
                                optimisticDeletes: a,
                                completedOptimisticKeys: p
                            }),
                            s = this.getVirtualPropsSnapshotForState(t),
                            c = o.$synced !== s.$synced || o.$origin !== s.$origin,
                            l = n === void 0 ? void 0 : pa(n, t, this.collection.id, () => o.$synced, () => o.$origin),
                            f = p.get(t),
                            m = !1;
                        f && (f.type === `delete` && n !== void 0 && r === void 0 && Li(f.value, n) || r !== void 0 && Li(f.value, r)) && (m = !0);
                        let h = c && n !== void 0 && r !== void 0 && Li(n, r);
                        if (!(m && !h))
                            if (n === void 0 && r !== void 0) {
                                let e = p.get(t);
                                if (e) {
                                    let n = e.value,
                                        i = pa(n, t, this.collection.id, () => o.$synced, () => o.$origin);
                                    d.push({
                                        type: `update`,
                                        key: t,
                                        value: r,
                                        previousValue: i
                                    })
                                } else d.push({
                                    type: `insert`,
                                    key: t,
                                    value: r
                                })
                            } else n !== void 0 && r === void 0 ? d.push({
                                type: `delete`,
                                key: t,
                                value: l ?? n
                            }) : n !== void 0 && r !== void 0 && (!Li(n, r) || h) && d.push({
                                type: `update`,
                                key: t,
                                value: r,
                                previousValue: l ?? n
                            })
                    }
                    this.size = this.calculateSize(), d.length > 0 && this.indexes.updateIndexes(d), this.changes.emitEvents(d, !0), this.pendingSyncedTransactions = n, this.preSyncVisibleState.clear(), Promise.resolve().then(() => {
                        this.recentlySyncedKeys.clear()
                    }), this.hasReceivedFirstCommit ||= !0
                }
            }, this.config = e, this.transactions = new yc((e, t) => e.compareCreatedAt(t)), this.syncedData = new yc(e.compare)
        }
        setDeps(e) {
            this.collection = e.collection, this.lifecycle = e.lifecycle, this.changes = e.changes, this.indexes = e.indexes, this._events = e.events
        }
        isRowSynced(e) {
            return this.isLocalOnly ? !0 : !this.optimisticUpserts.has(e) && !this.optimisticDeletes.has(e)
        }
        getRowOrigin(e) {
            return this.isLocalOnly || this.optimisticUpserts.has(e) || this.optimisticDeletes.has(e) ? `local` : this.rowOrigins.get(e) ?? `remote`
        }
        createVirtualPropsSnapshot(e, t) {
            return {
                $synced: t ?.$synced ?? this.isRowSynced(e),
                $origin: t ?.$origin ?? this.getRowOrigin(e),
                $key: t ?.$key ?? e,
                $collectionId: t ?.$collectionId ?? this.collection.id
            }
        }
        getVirtualPropsSnapshotForState(e, t) {
            if (this.isLocalOnly) return this.createVirtualPropsSnapshot(e, {
                $synced: !0,
                $origin: `local`
            });
            let n = t ?.optimisticUpserts ?? this.optimisticUpserts,
                r = t ?.optimisticDeletes ?? this.optimisticDeletes,
                i = n.has(e) || r.has(e) || t ?.completedOptimisticKeys ?.has(e) === !0;
            return this.createVirtualPropsSnapshot(e, {
                $synced: !i,
                $origin: i ? `local` : (t ?.rowOrigins ?? this.rowOrigins).get(e) ?? `remote`
            })
        }
        enrichWithVirtualPropsSnapshot(e, t) {
            let n = e,
                r = n.$synced ?? t.$synced,
                i = n.$origin ?? t.$origin,
                a = n.$key ?? t.$key,
                o = n.$collectionId ?? t.$collectionId,
                s = this.virtualPropsCache.get(e);
            if (s && s.synced === r && s.origin === i && s.key === a && s.collectionId === o) return s.enriched;
            let c = { ...e,
                $synced: r,
                $origin: i,
                $key: a,
                $collectionId: o
            };
            return this.virtualPropsCache.set(e, {
                synced: r,
                origin: i,
                key: a,
                collectionId: o,
                enriched: c
            }), c
        }
        clearOriginTrackingState() {
            this.rowOrigins.clear(), this.pendingLocalChanges.clear(), this.pendingLocalOrigins.clear()
        }
        enrichWithVirtualProps(e, t) {
            return this.enrichWithVirtualPropsSnapshot(e, this.createVirtualPropsSnapshot(t))
        }
        enrichChangeMessage(e) {
            let {
                __virtualProps: t
            } = e, n = t ?.value ? this.enrichWithVirtualPropsSnapshot(e.value, t.value) : this.enrichWithVirtualProps(e.value, e.key), r = e.previousValue ? t ?.previousValue ? this.enrichWithVirtualPropsSnapshot(e.previousValue, t.previousValue) : this.enrichWithVirtualProps(e.previousValue, e.key) : void 0;
            return {
                key: e.key,
                type: e.type,
                value: n,
                previousValue: r,
                metadata: e.metadata
            }
        }
        getWithVirtualProps(e) {
            let t = this.get(e);
            if (t !== void 0) return this.enrichWithVirtualProps(t, e)
        }
        get(e) {
            let {
                optimisticDeletes: t,
                optimisticUpserts: n,
                syncedData: r
            } = this;
            if (!t.has(e)) return n.has(e) ? n.get(e) : r.get(e)
        }
        has(e) {
            let {
                optimisticDeletes: t,
                optimisticUpserts: n,
                syncedData: r
            } = this;
            return t.has(e) ? !1 : n.has(e) ? !0 : r.has(e)
        }* keys() {
            let {
                syncedData: e,
                optimisticDeletes: t,
                optimisticUpserts: n
            } = this;
            for (let n of e.keys()) t.has(n) || (yield n);
            for (let r of n.keys()) !e.has(r) && !t.has(r) && (yield r)
        }* values() {
            for (let e of this.keys()) {
                let t = this.get(e);
                t !== void 0 && (yield t)
            }
        }* entries() {
            for (let e of this.keys()) {
                let t = this.get(e);
                t !== void 0 && (yield [e, t])
            }
        }*[Symbol.iterator]() {
            for (let [e, t] of this.entries()) yield [e, t]
        }
        forEach(e) {
            let t = 0;
            for (let [n, r] of this.entries()) e(r, n, t++)
        }
        map(e) {
            let t = [],
                n = 0;
            for (let [r, i] of this.entries()) t.push(e(i, r, n++));
            return t
        }
        isThisCollection(e) {
            return e === this.collection
        }
        recomputeOptimisticState(e = !1) {
            if (this.isCommittingSyncTransactions && !e) return;
            let t = new Map(this.optimisticUpserts),
                n = new Set(this.optimisticDeletes),
                r = new Map(this.rowOrigins);
            for (let e of this.transactions.values()) {
                let t = e.metadata[bc] === !0;
                if (e.state === `completed`) {
                    for (let n of e.mutations)
                        if (this.isThisCollection(n.collection) && (this.pendingLocalOrigins.add(n.key), n.optimistic)) switch (n.type) {
                            case `insert`:
                            case `update`:
                                this.pendingOptimisticUpserts.set(n.key, n.modified), this.pendingOptimisticDeletes.delete(n.key), t ? (this.pendingOptimisticDirectUpserts.add(n.key), this.pendingOptimisticDirectDeletes.delete(n.key)) : (this.pendingOptimisticDirectUpserts.delete(n.key), this.pendingOptimisticDirectDeletes.delete(n.key));
                                break;
                            case `delete`:
                                this.pendingOptimisticUpserts.delete(n.key), this.pendingOptimisticDeletes.add(n.key), t ? (this.pendingOptimisticDirectUpserts.delete(n.key), this.pendingOptimisticDirectDeletes.add(n.key)) : (this.pendingOptimisticDirectUpserts.delete(n.key), this.pendingOptimisticDirectDeletes.delete(n.key));
                                break
                        }
                } else if (e.state === `failed`)
                    for (let t of e.mutations) this.isThisCollection(t.collection) && (this.pendingLocalOrigins.delete(t.key), t.optimistic && (this.pendingOptimisticUpserts.delete(t.key), this.pendingOptimisticDeletes.delete(t.key), this.pendingOptimisticDirectUpserts.delete(t.key), this.pendingOptimisticDirectDeletes.delete(t.key)))
            }
            this.optimisticUpserts.clear(), this.optimisticDeletes.clear(), this.pendingLocalChanges.clear();
            let i = new Set;
            for (let e of this.pendingSyncedTransactions)
                for (let t of e.operations) i.add(t.key);
            let a = [];
            for (let [e, t] of this.pendingOptimisticUpserts) i.has(e) || this.pendingOptimisticDirectUpserts.has(e) ? this.optimisticUpserts.set(e, t) : a.push(e);
            for (let e of a) this.pendingOptimisticUpserts.delete(e), this.pendingLocalOrigins.delete(e);
            let o = [];
            for (let e of this.pendingOptimisticDeletes) i.has(e) || this.pendingOptimisticDirectDeletes.has(e) ? this.optimisticDeletes.add(e) : o.push(e);
            for (let e of o) this.pendingOptimisticDeletes.delete(e), this.pendingLocalOrigins.delete(e);
            let s = [];
            for (let e of this.transactions.values())[`completed`, `failed`].includes(e.state) || s.push(e);
            for (let e of s)
                for (let t of e.mutations)
                    if (this.isThisCollection(t.collection) && (this.pendingLocalChanges.add(t.key), t.optimistic)) switch (t.type) {
                        case `insert`:
                        case `update`:
                            this.optimisticUpserts.set(t.key, t.modified), this.optimisticDeletes.delete(t.key);
                            break;
                        case `delete`:
                            this.optimisticUpserts.delete(t.key), this.optimisticDeletes.add(t.key);
                            break
                    }
            this.size = this.calculateSize();
            let c = [];
            this.collectOptimisticChanges(t, n, r, c);
            let l = c.filter(t => !!(!this.recentlySyncedKeys.has(t.key) || e));
            if (this.pendingSyncedTransactions.length > 0 && !e) {
                let t = new Set;
                for (let e of this.pendingSyncedTransactions)
                    for (let n of e.operations) t.add(n.key);
                let n = l.filter(e => !(e.type === `delete` && t.has(e.key) && !s.some(t => t.mutations.some(t => this.isThisCollection(t.collection) && t.key === e.key))));
                n.length > 0 && this.indexes.updateIndexes(n), this.changes.emitEvents(n, e)
            } else l.length > 0 && this.indexes.updateIndexes(l), this.changes.emitEvents(l, e)
        }
        calculateSize() {
            let e = this.syncedData.size,
                t = Array.from(this.optimisticDeletes).filter(e => this.syncedData.has(e) && !this.optimisticUpserts.has(e)).length,
                n = Array.from(this.optimisticUpserts.keys()).filter(e => !this.syncedData.has(e)).length;
            return e - t + n
        }
        collectOptimisticChanges(e, t, n, r) {
            let i = new Set([...e.keys(), ...this.optimisticUpserts.keys(), ...t, ...this.optimisticDeletes]);
            for (let a of i) {
                let i = this.get(a),
                    o = this.getPreviousValue(a, e, t),
                    s = this.getVirtualPropsSnapshotForState(a, {
                        rowOrigins: n,
                        optimisticUpserts: e,
                        optimisticDeletes: t
                    }),
                    c = this.getVirtualPropsSnapshotForState(a);
                o !== void 0 && i === void 0 ? r.push({
                    type: `delete`,
                    key: a,
                    value: o,
                    __virtualProps: {
                        value: s
                    }
                }) : o === void 0 && i !== void 0 ? r.push({
                    type: `insert`,
                    key: a,
                    value: i,
                    __virtualProps: {
                        value: c
                    }
                }) : o !== void 0 && i !== void 0 && o !== i && r.push({
                    type: `update`,
                    key: a,
                    value: i,
                    previousValue: o,
                    __virtualProps: {
                        value: c,
                        previousValue: s
                    }
                })
            }
        }
        getPreviousValue(e, t, n) {
            if (!n.has(e)) return t.has(e) ? t.get(e) : this.syncedData.get(e)
        }
        scheduleTransactionCleanup(e) {
            if (e.state === `completed`) {
                this.transactions.delete(e.id);
                return
            }
            e.isPersisted.promise.then(() => {
                this.transactions.delete(e.id)
            }).catch(() => {})
        }
        capturePreSyncVisibleState() {
            if (this.pendingSyncedTransactions.length === 0) return;
            let e = new Set;
            for (let t of this.pendingSyncedTransactions)
                for (let n of t.operations) e.add(n.key);
            for (let t of e) this.recentlySyncedKeys.add(t);
            for (let t of e)
                if (!this.preSyncVisibleState.has(t)) {
                    let e = this.get(t);
                    e !== void 0 && this.preSyncVisibleState.set(t, e)
                }
        }
        onTransactionStateChange() {
            this.changes.shouldBatchEvents = this.pendingSyncedTransactions.length > 0, this.capturePreSyncVisibleState(), this.recomputeOptimisticState(!1)
        }
        cleanup() {
            this.syncedData.clear(), this.syncedMetadata.clear(), this.syncedCollectionMetadata.clear(), this.optimisticUpserts.clear(), this.optimisticDeletes.clear(), this.pendingOptimisticUpserts.clear(), this.pendingOptimisticDeletes.clear(), this.pendingOptimisticDirectUpserts.clear(), this.pendingOptimisticDirectDeletes.clear(), this.clearOriginTrackingState(), this.isLocalOnly = !1, this.size = 0, this.pendingSyncedTransactions = [], this.syncedKeys.clear(), this.hasReceivedFirstCommit = !1
        }
    };

function Sc() {
    let e = new Map;

    function t(n) {
        let r = n.join(`.`);
        if (e.has(r)) return e.get(r);
        let i = new Proxy({}, {
            get(e, r, i) {
                if (r === `__refProxy`) return !0;
                if (r === `__path`) return n;
                if (r !== `__type`) return typeof r == `symbol` ? Reflect.get(e, r, i) : t([...n, String(r)])
            },
            has(e, t) {
                return t === `__refProxy` || t === `__path` || t === `__type` ? !0 : Reflect.has(e, t)
            },
            ownKeys(e) {
                return Reflect.ownKeys(e)
            },
            getOwnPropertyDescriptor(e, t) {
                return t === `__refProxy` || t === `__path` || t === `__type` ? {
                    enumerable: !1,
                    configurable: !0
                } : Reflect.getOwnPropertyDescriptor(e, t)
            }
        });
        return e.set(r, i), i
    }
    return t([])
}

function Cc(e) {
    let t = new Map,
        n = 0;

    function r(e) {
        let i = e.join(`.`);
        if (t.has(i)) return t.get(i);
        let a = new Proxy({}, {
            get(t, n, i) {
                if (n === `__refProxy`) return !0;
                if (n === `__path`) return e;
                if (n !== `__type`) return typeof n == `symbol` ? Reflect.get(t, n, i) : r([...e, String(n)])
            },
            has(e, t) {
                return t === `__refProxy` || t === `__path` || t === `__type` ? !0 : Reflect.has(e, t)
            },
            ownKeys(t) {
                let r = ++n,
                    i = `__SPREAD_SENTINEL__${e.join(`.`)}__${r}`;
                return Object.prototype.hasOwnProperty.call(t, i) || Object.defineProperty(t, i, {
                    enumerable: !0,
                    configurable: !0,
                    value: !0
                }), Reflect.ownKeys(t)
            },
            getOwnPropertyDescriptor(e, t) {
                return t === `__refProxy` || t === `__path` || t === `__type` ? {
                    enumerable: !1,
                    configurable: !0
                } : Reflect.getOwnPropertyDescriptor(e, t)
            }
        });
        return t.set(i, a), a
    }
    return new Proxy({}, {
        get(t, n, i) {
            if (n === `__refProxy`) return !0;
            if (n === `__path`) return [];
            if (n === `__type`) return;
            if (typeof n == `symbol`) return Reflect.get(t, n, i);
            let a = String(n);
            if (e.includes(a) || e.includes(`*`)) return r([a])
        },
        has(t, n) {
            return n === `__refProxy` || n === `__path` || n === `__type` || typeof n == `string` && e.includes(n) ? !0 : Reflect.has(t, n)
        },
        ownKeys(t) {
            return [...e, `__refProxy`, `__path`, `__type`]
        },
        getOwnPropertyDescriptor(t, n) {
            if (n === `__refProxy` || n === `__path` || n === `__type`) return {
                enumerable: !1,
                configurable: !0
            };
            if (typeof n == `string` && e.includes(n)) return {
                enumerable: !0,
                configurable: !0
            }
        }
    })
}

function wc(e) {
    let t = Cc(e),
        n = new Map;

    function r(e) {
        let t = e.join(`.`);
        if (n.has(t)) return n.get(t);
        let i = new Proxy({}, {
            get(t, n, i) {
                if (n === `__refProxy`) return !0;
                if (n === `__path`) return [`$selected`, ...e];
                if (n !== `__type`) return typeof n == `symbol` ? Reflect.get(t, n, i) : r([...e, String(n)])
            },
            has(e, t) {
                return t === `__refProxy` || t === `__path` || t === `__type` ? !0 : Reflect.has(e, t)
            },
            ownKeys(e) {
                return Reflect.ownKeys(e)
            },
            getOwnPropertyDescriptor(e, t) {
                return t === `__refProxy` || t === `__path` || t === `__type` ? {
                    enumerable: !1,
                    configurable: !0
                } : Reflect.getOwnPropertyDescriptor(e, t)
            }
        });
        return n.set(t, i), i
    }
    let i = r([]);
    return new Proxy(t, {
        get(e, t, n) {
            return t === `$selected` ? i : Reflect.get(e, t, n)
        },
        has(e, t) {
            return t === `$selected` ? !0 : Reflect.has(e, t)
        },
        ownKeys(e) {
            return [...Reflect.ownKeys(e), `$selected`]
        },
        getOwnPropertyDescriptor(e, t) {
            return t === `$selected` ? {
                enumerable: !0,
                configurable: !0,
                value: i
            } : Reflect.getOwnPropertyDescriptor(e, t)
        }
    })
}

function q(e) {
    if (Tc(e)) return new z(e.__path);
    if (e && typeof e == `object` && (e.__brand === `ToArrayWrapper` || e.__brand === `ConcatToArrayWrapper` || e.__brand === `CaseWhenWrapper` || e.__brand === `MaterializeWrapper`)) {
        let t = e.__brand === `ToArrayWrapper` ? `toArray()` : e.__brand === `ConcatToArrayWrapper` ? `concat(toArray())` : e.__brand === `CaseWhenWrapper` ? `caseWhen()` : `materialize()`;
        throw Error(`${t} cannot be used inside expressions (e.g., coalesce(), eq(), not()). Use ${t} directly as a select field value instead.`)
    }
    return e && typeof e == `object` && `type` in e && (e.type === `func` || e.type === `ref` || e.type === `val` || e.type === `agg`) ? e : new B(e)
}

function Tc(e) {
    return e && typeof e == `object` && e.__refProxy === !0
}

function Ec(e, t) {
    return new V(`eq`, [q(e), q(t)])
}

function Dc(e, t) {
    return new V(`gt`, [q(e), q(t)])
}

function Oc(e, t) {
    return new V(`gte`, [q(e), q(t)])
}

function kc(e, t) {
    return new V(`lt`, [q(e), q(t)])
}

function Ac(e, t, ...n) {
    return new V(`and`, [e, t, ...n].map(e => q(e)))
}

function jc(e, t, ...n) {
    return new V(`or`, [e, t, ...n].map(e => q(e)))
}

function Mc(e) {
    return new V(`not`, [q(e)])
}

function Nc(e, t) {
    return new V(`in`, [q(e), q(t)])
}

function Pc(e) {
    return new V(`length`, [q(e)])
}

function Fc(e) {
    return new ar(`count`, [q(e)])
}

function Ic(e) {
    return new ar(`avg`, [q(e)])
}

function Lc(e) {
    return new ar(`sum`, [q(e)])
}

function Rc(e) {
    return new ar(`max`, [q(e)])
}
var zc = class {
        constructor(e) {
            this.query = e, this.__brand = `ToArrayWrapper`
        }
    },
    Bc = class {
        constructor(e) {
            this.query = e, this.__brand = `ConcatToArrayWrapper`
        }
    },
    Vc = class {
        constructor(e) {
            this.args = e, this.__brand = `CaseWhenWrapper`
        }
    },
    Hc = class {
        constructor(e) {
            this.query = e, this.__brand = `MaterializeWrapper`
        }
    },
    Uc = class {
        constructor() {
            this.listeners = new Map
        }
        on(e, t) {
            return this.listeners.has(e) || this.listeners.set(e, new Set), this.listeners.get(e).add(t), () => {
                this.listeners.get(e) ?.delete(t)
            }
        }
        once(e, t) {
            let n = this.on(e, e => {
                t(e), n()
            });
            return n
        }
        off(e, t) {
            this.listeners.get(e) ?.delete(t)
        }
        waitFor(e, t) {
            return new Promise((n, r) => {
                let i, a = this.on(e, e => {
                    i &&= (clearTimeout(i), void 0), n(e), a()
                });
                t && (i = setTimeout(() => {
                    i = void 0, a(), r(Error(`Timeout waiting for event ${String(e)}`))
                }, t))
            })
        }
        emitInner(e, t) {
            this.listeners.get(e) ?.forEach(e => {
                try {
                    e(t)
                } catch (e) {
                    queueMicrotask(() => {
                        throw e
                    })
                }
            })
        }
        clearListeners() {
            this.listeners.clear()
        }
    };

function Wc(e, t) {
    if (t.length === 0 || e.length === 0) return;
    if (e.length === 1) {
        let {
            expression: n,
            compareOptions: r
        } = e[0];
        return (r.direction === `asc` ? Dc : kc)(n, new B(t[0]))
    }
    let n = [];
    for (let r = 0; r < e.length && r < t.length; r++) {
        let i = e[r],
            a = t[r],
            o = [];
        for (let n = 0; n < r; n++) {
            let r = e[n],
                i = t[n];
            o.push(Ec(r.expression, new B(i)))
        }
        let s = (i.compareOptions.direction === `asc` ? Dc : kc)(i.expression, new B(a));
        if (o.length === 0) n.push(s);
        else {
            let e = [...o, s];
            n.push(e.reduce((e, t) => Ac(e, t)))
        }
    }
    return n.length === 1 ? n[0] : n.reduce((e, t) => jc(e, t))
}
var Gc = class extends Uc {
        constructor(e, t, n) {
            super(), this.collection = e, this.callback = t, this.options = n, this.loadedInitialState = !1, this.skipFiltering = !1, this.snapshotSent = !1, this.loadedSubsets = [], this.sentKeys = new Set, this.limitedSnapshotRowCount = 0, this._status = `ready`, this.pendingLoadSubsetPromises = new Set, this.isBufferingForTruncate = !1, this.truncateBuffer = [], this.pendingTruncateRefetches = new Set, n.onUnsubscribe && this.on(`unsubscribed`, e => n.onUnsubscribe(e)), n.whereExpression && Na(n.whereExpression, this.collection), this.callback = e => {
                t(e), this.trackSentKeys(e)
            }, this.filteredCallback = n.whereExpression ? gc(this.callback, n) : this.callback, this.truncateCleanup = this.collection.on(`truncate`, () => {
                this.handleTruncate()
            })
        }
        get status() {
            return this._status
        }
        handleTruncate() {
            let e = [...this.loadedSubsets],
                t = this.collection._sync.syncLoadSubsetFn !== null;
            if (e.length === 0 || !t) {
                this.snapshotSent = !1, this.loadedInitialState = !1, this.limitedSnapshotRowCount = 0, this.lastSentKey = void 0, this.loadedSubsets = [];
                return
            }
            this.isBufferingForTruncate = !0, this.truncateBuffer = [], this.pendingTruncateRefetches.clear(), this.snapshotSent = !1, this.loadedInitialState = !1, this.limitedSnapshotRowCount = 0, this.lastSentKey = void 0, this.loadedSubsets = [], queueMicrotask(() => {
                if (this.isBufferingForTruncate) {
                    for (let t of e) {
                        let e = this.collection._sync.loadSubset(t);
                        this.loadedSubsets.push(t), this.trackLoadSubsetPromise(e), e instanceof Promise && (this.pendingTruncateRefetches.add(e), e.catch(() => {}).finally(() => {
                            this.pendingTruncateRefetches.delete(e), this.checkTruncateRefetchComplete()
                        }))
                    }
                    this.pendingTruncateRefetches.size === 0 && this.flushTruncateBuffer()
                }
            })
        }
        checkTruncateRefetchComplete() {
            this.pendingTruncateRefetches.size === 0 && this.isBufferingForTruncate && this.flushTruncateBuffer()
        }
        flushTruncateBuffer() {
            this.isBufferingForTruncate = !1;
            let e = this.truncateBuffer.flat();
            e.length > 0 && this.filteredCallback(e), this.truncateBuffer = []
        }
        setOrderByIndex(e) {
            this.orderByIndex = e
        }
        hasOrderByIndex() {
            return this.orderByIndex !== void 0
        }
        setStatus(e) {
            if (this._status === e) return;
            let t = this._status;
            this._status = e, this.emitInner(`status:change`, {
                type: `status:change`,
                subscription: this,
                previousStatus: t,
                status: e
            });
            let n = `status:${e}`;
            this.emitInner(n, {
                type: n,
                subscription: this,
                previousStatus: t,
                status: e
            })
        }
        trackLoadSubsetPromise(e) {
            e instanceof Promise && (this.pendingLoadSubsetPromises.add(e), this.setStatus(`loadingSubset`), e.finally(() => {
                this.pendingLoadSubsetPromises.delete(e), this.pendingLoadSubsetPromises.size === 0 && this.setStatus(`ready`)
            }))
        }
        hasLoadedInitialState() {
            return this.loadedInitialState
        }
        hasSentAtLeastOneSnapshot() {
            return this.snapshotSent
        }
        emitEvents(e) {
            let t = this.filterAndFlipChanges(e);
            this.isBufferingForTruncate ? t.length > 0 && this.truncateBuffer.push(t) : this.filteredCallback(t)
        }
        requestSnapshot(e) {
            if (this.loadedInitialState) return !1;
            let t = {
                where: this.options.whereExpression,
                optimizedOnly: e ?.optimizedOnly ?? !1
            };
            if (e) {
                if (`where` in e) {
                    let n = e.where;
                    if (t.where) {
                        let e = t.where;
                        t.where = Ac(e, n)
                    } else t.where = n
                }
            } else this.loadedInitialState = !0;
            let n = {
                    where: t.where,
                    subscription: this,
                    orderBy: e ?.orderBy,
                    limit: e ?.limit
                },
                r = this.collection._sync.loadSubset(n);
            e ?.onLoadSubsetResult ?.(r), this.loadedSubsets.push(n), (e ?.trackLoadSubsetPromise ?? !0) && this.trackLoadSubsetPromise(r);
            let i = this.collection.currentStateAsChanges(t);
            if (i === void 0) return !1;
            let a = i.filter(e => !this.sentKeys.has(e.key));
            for (let e of a) this.sentKeys.add(e.key);
            return this.snapshotSent = !0, this.callback(a), !0
        }
        requestLimitedSnapshot({
            orderBy: e,
            limit: t,
            minValues: n,
            offset: r,
            trackLoadSubsetPromise: i = !0,
            onLoadSubsetResult: a
        }) {
            if (!t) throw Error(`limit is required`);
            if (!this.orderByIndex) throw Error(`Ordered snapshot was requested but no index was found. You have to call setOrderByIndex before requesting an ordered snapshot.`);
            let o = n !== void 0 && n.length > 0,
                s = n ?.[0],
                c = this.orderByIndex,
                l = this.options.whereExpression,
                u = l ? hc(l) : void 0,
                d = e => {
                    if (e !== void 0 && this.sentKeys.has(e)) return !1;
                    let t = this.collection.get(e);
                    return t === void 0 ? !1 : u ?.(t) ?? !0
                },
                f = s,
                p = [],
                m = [];
            if (o) {
                let {
                    expression: n
                } = e[0], r = this.collection.currentStateAsChanges({
                    where: Ec(n, new B(s))
                });
                if (r) {
                    let e = r.map(e => e.key).filter(e => !this.sentKeys.has(e) && d(e));
                    m.push(...e);
                    let n = c.take(t - m.length, s, d);
                    m.push(...n)
                } else m = c.take(t, s, d)
            } else m = c.takeFromStart(t, d);
            let h = () => Math.max(t - p.length, 0),
                g = () => m.length === 0,
                _ = e[0].expression,
                v = _.type === `ref` ? W(new z(_.path), !0) : null;
            for (; h() > 0 && !g();) {
                let e = new Set;
                for (let t of m) {
                    let n = this.collection.get(t);
                    p.push({
                        type: `insert`,
                        key: t,
                        value: n
                    }), f = v ? v(n) : n, e.add(t)
                }
                m = c.take(h(), f, d)
            }
            let y = this.limitedSnapshotRowCount;
            for (let e of p) this.sentKeys.add(e.key);
            this.callback(p), this.limitedSnapshotRowCount += p.length, p.length > 0 && (this.lastSentKey = p[p.length - 1].key);
            let b;
            if (n !== void 0 && n.length > 0) {
                let t = Wc(e, n);
                if (t) {
                    let {
                        expression: r
                    } = e[0], i = n[0], a;
                    if (i instanceof Date) {
                        let e = new Date(i.getTime() + 1);
                        a = Ac(Oc(r, new B(i)), kc(r, new B(e)))
                    } else a = Ec(r, new B(i));
                    b = {
                        whereFrom: t,
                        whereCurrent: a,
                        lastKey: this.lastSentKey
                    }
                }
            }
            let x = {
                    where: l,
                    limit: t,
                    orderBy: e,
                    cursor: b,
                    offset: r ?? y,
                    subscription: this
                },
                S = this.collection._sync.loadSubset(x);
            a ?.(S), this.loadedSubsets.push(x), i && this.trackLoadSubsetPromise(S)
        }
        filterAndFlipChanges(e) {
            if (this.loadedInitialState || this.skipFiltering) return e;
            let t = this.isBufferingForTruncate,
                n = [];
            for (let r of e) {
                let e = r;
                if (!this.sentKeys.has(r.key)) {
                    if (r.type === `update`) e = { ...r,
                        type: `insert`,
                        previousValue: void 0
                    };
                    else if (r.type === `delete` && !t) continue;
                    this.sentKeys.add(r.key)
                } else if (r.type === `insert`) continue;
                else r.type === `delete` && this.sentKeys.delete(r.key);
                n.push(e)
            }
            return n
        }
        trackSentKeys(e) {
            if (!(this.loadedInitialState || this.skipFiltering)) {
                for (let t of e) t.type === `delete` ? this.sentKeys.delete(t.key) : this.sentKeys.add(t.key);
                this.orderByIndex && (this.limitedSnapshotRowCount = Math.max(this.limitedSnapshotRowCount, this.sentKeys.size))
            }
        }
        markAllStateAsSeen() {
            this.skipFiltering = !0
        }
        unsubscribe() {
            this.truncateCleanup ?.(), this.truncateCleanup = void 0, this.isBufferingForTruncate = !1, this.truncateBuffer = [], this.pendingTruncateRefetches.clear();
            for (let e of this.loadedSubsets) this.collection._sync.unloadSubset(e);
            this.loadedSubsets = [], this.emitInner(`unsubscribed`, {
                type: `unsubscribed`,
                subscription: this
            }), this.clearListeners()
        }
    },
    Kc = class {
        constructor() {
            this.activeSubscribersCount = 0, this.changeSubscriptions = new Set, this.batchedEvents = [], this.shouldBatchEvents = !1
        }
        setDeps(e) {
            this.lifecycle = e.lifecycle, this.sync = e.sync, this.events = e.events, this.collection = e.collection, this.state = e.state
        }
        emitEmptyReadyEvent() {
            for (let e of this.changeSubscriptions) e.emitEvents([])
        }
        enrichChangeWithVirtualProps(e) {
            return this.state.enrichChangeMessage(e)
        }
        emitEvents(e, t = !1) {
            if (this.shouldBatchEvents && !t) {
                this.batchedEvents.push(...e);
                return
            }
            let n = e;
            if (t && (this.batchedEvents.length > 0 && (n = [...this.batchedEvents, ...e]), this.batchedEvents = [], this.shouldBatchEvents = !1), n.length === 0) return;
            let r = n.map(e => this.enrichChangeWithVirtualProps(e));
            for (let e of this.changeSubscriptions) e.emitEvents(r)
        }
        subscribeChanges(e, t = {}) {
            if (this.addSubscriber(), t.where && t.whereExpression) throw Error(`Cannot specify both 'where' and 'whereExpression' options. Use one or the other.`);
            let {
                where: n,
                ...r
            } = t, i = r.whereExpression;
            n && (i = q(n(Sc())));
            let a = new Gc(this.collection, e, { ...r,
                whereExpression: i,
                onUnsubscribe: () => {
                    this.removeSubscriber(), this.changeSubscriptions.delete(a)
                }
            });
            return t.onStatusChange && a.on(`status:change`, t.onStatusChange), t.includeInitialState ? a.requestSnapshot({
                trackLoadSubsetPromise: !1,
                orderBy: t.orderBy,
                limit: t.limit,
                onLoadSubsetResult: t.onLoadSubsetResult
            }) : t.includeInitialState === !1 && a.markAllStateAsSeen(), this.changeSubscriptions.add(a), a
        }
        addSubscriber() {
            let e = this.activeSubscribersCount;
            this.activeSubscribersCount++, this.lifecycle.cancelGCTimer(), (this.lifecycle.status === `cleaned-up` || this.lifecycle.status === `idle`) && this.sync.startSync(), this.events.emitSubscribersChange(this.activeSubscribersCount, e)
        }
        removeSubscriber() {
            let e = this.activeSubscribersCount;
            if (this.activeSubscribersCount--, this.activeSubscribersCount === 0) this.lifecycle.startGCTimer();
            else if (this.activeSubscribersCount < 0) throw new Tr;
            this.events.emitSubscribersChange(this.activeSubscribersCount, e)
        }
        cleanup() {
            this.batchedEvents = [], this.shouldBatchEvents = !1
        }
    },
    qc = e => setTimeout(() => {
        e({
            didTimeout: !0,
            timeRemaining: () => 50
        })
    }, 0),
    Jc = e => {
        clearTimeout(e)
    },
    Yc = typeof window < `u` && `requestIdleCallback` in window ? (e, t) => window.requestIdleCallback(e, t) : (e, t) => qc(e),
    Xc = typeof window < `u` && `cancelIdleCallback` in window ? e => window.cancelIdleCallback(e) : Jc,
    Zc = class e {
        constructor() {
            this.tasks = new Map, this.timeoutId = null, this.microtaskScheduled = !1
        }
        static getInstance() {
            return e.instance ||= new e, e.instance
        }
        schedule(e, t, n) {
            let r = Date.now() + t;
            this.tasks.set(e, {
                executeAt: r,
                callback: n
            }), this.microtaskScheduled || (this.microtaskScheduled = !0, Promise.resolve().then(() => {
                this.microtaskScheduled = !1, this.updateTimeout()
            }))
        }
        cancel(e) {
            this.tasks.delete(e)
        }
        updateTimeout() {
            if (this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null), this.tasks.size === 0) return;
            let e = 1 / 0;
            for (let t of this.tasks.values()) t.executeAt < e && (e = t.executeAt);
            let t = Math.max(0, e - Date.now());
            this.timeoutId = setTimeout(() => this.process(), t)
        }
        process() {
            this.timeoutId = null;
            let e = Date.now();
            for (let [t, n] of this.tasks.entries())
                if (e >= n.executeAt) {
                    this.tasks.delete(t);
                    try {
                        n.callback()
                    } catch (e) {
                        console.error(`Error in CleanupQueue task:`, e)
                    }
                }
            this.tasks.size > 0 && this.updateTimeout()
        }
        static resetInstance() {
            e.instance &&= (e.instance.timeoutId !== null && clearTimeout(e.instance.timeoutId), null)
        }
    };
Zc.instance = null;
var Qc = Zc,
    $c = class {
        constructor(e, t) {
            this.status = `idle`, this.hasBeenReady = !1, this.hasReceivedFirstCommit = !1, this.onFirstReadyCallbacks = [], this.idleCallbackId = null, this.config = e, this.id = t
        }
        setDeps(e) {
            this.indexes = e.indexes, this.events = e.events, this.changes = e.changes, this.sync = e.sync, this.state = e.state
        }
        validateStatusTransition(e, t) {
            if (e !== t && !{
                    idle: [`loading`, `error`, `cleaned-up`],
                    loading: [`ready`, `error`, `cleaned-up`],
                    ready: [`cleaned-up`, `error`],
                    error: [`cleaned-up`, `idle`],
                    "cleaned-up": [`loading`, `error`]
                }[e].includes(t)) throw new Cr(e, t, this.id)
        }
        setStatus(e, t = !1) {
            if (e === `ready` && !t) throw new xr(`You can't directly call "setStatus('ready'). You must use markReady instead.`);
            this.validateStatusTransition(this.status, e);
            let n = this.status;
            this.status = e, this.events.emitStatusChange(e, n)
        }
        validateCollectionUsable(e) {
            switch (this.status) {
                case `error`:
                    throw new Sr(e, this.id);
                case `cleaned-up`:
                    this.sync.startSync();
                    break
            }
        }
        markReady() {
            if (this.validateStatusTransition(this.status, `ready`), this.status === `loading`) {
                if (this.setStatus(`ready`, !0), !this.hasBeenReady) {
                    this.hasBeenReady = !0, this.hasReceivedFirstCommit ||= !0;
                    let e = [...this.onFirstReadyCallbacks];
                    this.onFirstReadyCallbacks = [], e.forEach(e => e())
                }
                this.changes.changeSubscriptions.size > 0 && this.changes.emitEmptyReadyEvent()
            }
        }
        startGCTimer() {
            let e = this.config.gcTime ?? 3e5;
            e <= 0 || !Number.isFinite(e) || Qc.getInstance().schedule(this, e, () => {
                this.changes.activeSubscribersCount === 0 && this.scheduleIdleCleanup()
            })
        }
        cancelGCTimer() {
            Qc.getInstance().cancel(this), this.idleCallbackId !== null && (Xc(this.idleCallbackId), this.idleCallbackId = null)
        }
        scheduleIdleCleanup() {
            this.idleCallbackId !== null && Xc(this.idleCallbackId), this.idleCallbackId = Yc(e => {
                this.changes.activeSubscribersCount === 0 ? this.performCleanup(e) && (this.idleCallbackId = null) : this.idleCallbackId = null
            }, {
                timeout: 1e3
            })
        }
        performCleanup(e) {
            if (!e || e.timeRemaining() > 0 || e.didTimeout) {
                this.sync.cleanup(), this.state.cleanup(), this.changes.cleanup(), this.indexes.cleanup(), Qc.getInstance().cancel(this), this.hasBeenReady = !1;
                let e = [...this.onFirstReadyCallbacks];
                return this.onFirstReadyCallbacks = [], e.forEach(e => {
                    try {
                        e()
                    } catch (e) {
                        console.error(`${this.config.id?`[${this.config.id}] `:``}Error in onFirstReady callback during cleanup:`, e)
                    }
                }), this.setStatus(`cleaned-up`), this.events.cleanup(), !0
            } else return this.scheduleIdleCleanup(), !1
        }
        onFirstReady(e) {
            if (this.hasBeenReady) {
                e();
                return
            }
            this.onFirstReadyCallbacks.push(e)
        }
        cleanup() {
            this.idleCallbackId !== null && (Xc(this.idleCallbackId), this.idleCallbackId = null), this.performCleanup()
        }
    },
    el = Symbol(`liveQueryInternal`),
    tl = class {
        constructor(e, t) {
            this.preloadPromise = null, this.syncCleanupFn = null, this.syncLoadSubsetFn = null, this.syncUnloadSubsetFn = null, this.pendingLoadSubsetPromises = new Set, this.config = e, this.id = t, this.syncMode = e.syncMode ?? `eager`
        }
        setDeps(e) {
            this.collection = e.collection, this.state = e.state, this.lifecycle = e.lifecycle, this._events = e.events
        }
        startSync() {
            if (!(this.lifecycle.status !== `idle` && this.lifecycle.status !== `cleaned-up`)) {
                this.lifecycle.setStatus(`loading`);
                try {
                    let e = nl(this.config.sync.sync({
                        collection: this.collection,
                        begin: e => {
                            this.state.pendingSyncedTransactions.push({
                                committed: !1,
                                operations: [],
                                deletedKeys: new Set,
                                rowMetadataWrites: new Map,
                                collectionMetadataWrites: new Map,
                                immediate: e ?.immediate
                            })
                        },
                        write: e => {
                            let t = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
                            if (!t) throw new qr;
                            if (t.committed) throw new Jr;
                            let n;
                            n = `key` in e ? e.key : this.config.getKey(e.value), this.state.pendingLocalChanges.has(n) && this.state.pendingLocalOrigins.add(n);
                            let r = e.type;
                            if (e.type === `insert`) {
                                let i = this.state.syncedData.has(n),
                                    a = t.deletedKeys.has(n),
                                    o = t.truncate === !0;
                                if (i && !a && !o) {
                                    let t = this.state.syncedData.get(n);
                                    if (t !== void 0 && Li(t, e.value)) r = `update`;
                                    else {
                                        let e = this.config.utils[el];
                                        throw new Ar(n, this.id, {
                                            hasCustomGetKey: e ?.hasCustomGetKey ?? !1,
                                            hasJoins: e ?.hasJoins ?? !1,
                                            hasDistinct: e ?.hasDistinct ?? !1
                                        })
                                    }
                                }
                            }
                            let i = { ...e,
                                type: r,
                                key: n
                            };
                            t.operations.push(i), r === `delete` ? (t.deletedKeys.add(n), t.rowMetadataWrites.set(n, {
                                type: `delete`
                            })) : r === `insert` ? i.metadata === void 0 ? t.rowMetadataWrites.set(n, {
                                type: `delete`
                            }) : t.rowMetadataWrites.set(n, {
                                type: `set`,
                                value: i.metadata
                            }) : i.metadata !== void 0 && t.rowMetadataWrites.set(n, {
                                type: `set`,
                                value: i.metadata
                            })
                        },
                        commit: () => {
                            let e = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
                            if (!e) throw new Yr;
                            if (e.committed) throw new Xr;
                            e.committed = !0, this.state.commitPendingTransactions()
                        },
                        markReady: () => {
                            this.lifecycle.markReady()
                        },
                        truncate: () => {
                            let e = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
                            if (!e) throw new qr;
                            if (e.committed) throw new Jr;
                            e.operations = [], e.deletedKeys.clear(), e.rowMetadataWrites.clear(), e.truncate = !0, e.optimisticSnapshot = {
                                upserts: new Map(this.state.optimisticUpserts),
                                deletes: new Set(this.state.optimisticDeletes)
                            }
                        },
                        metadata: this.createSyncMetadataApi()
                    }));
                    if (this.syncCleanupFn = e ?.cleanup ?? null, this.syncLoadSubsetFn = e ?.loadSubset ?? null, this.syncUnloadSubsetFn = e ?.unloadSubset ?? null, this.syncMode === `on-demand` && !this.syncLoadSubsetFn) throw new gr(`Collection "${this.id}" is configured with syncMode "on-demand" but the sync function did not return a loadSubset handler. Either provide a loadSubset handler or use syncMode "eager".`)
                } catch (e) {
                    throw this.lifecycle.setStatus(`error`), e
                }
            }
        }
        getActivePendingSyncTransaction() {
            let e = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
            if (!e) throw new qr;
            if (e.committed) throw new Jr;
            return e
        }
        createSyncMetadataApi() {
            return {
                row: {
                    get: e => {
                        let t = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1],
                            n = t ?.rowMetadataWrites.get(e);
                        if (n) return n.type === `delete` ? void 0 : n.value;
                        if (!t ?.truncate) return this.state.syncedMetadata.get(e)
                    },
                    set: (e, t) => {
                        this.getActivePendingSyncTransaction().rowMetadataWrites.set(e, {
                            type: `set`,
                            value: t
                        })
                    },
                    delete: e => {
                        this.getActivePendingSyncTransaction().rowMetadataWrites.set(e, {
                            type: `delete`
                        })
                    }
                },
                collection: {
                    get: e => {
                        let t = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1] ?.collectionMetadataWrites.get(e);
                        return t ? t.type === `delete` ? void 0 : t.value : this.state.syncedCollectionMetadata.get(e)
                    },
                    set: (e, t) => {
                        this.getActivePendingSyncTransaction().collectionMetadataWrites.set(e, {
                            type: `set`,
                            value: t
                        })
                    },
                    delete: e => {
                        this.getActivePendingSyncTransaction().collectionMetadataWrites.set(e, {
                            type: `delete`
                        })
                    },
                    list: e => {
                        let t = new Map(this.state.syncedCollectionMetadata),
                            n = this.state.pendingSyncedTransactions[this.state.pendingSyncedTransactions.length - 1];
                        if (n)
                            for (let [e, r] of n.collectionMetadataWrites) r.type === `delete` ? t.delete(e) : t.set(e, r.value);
                        return Array.from(t.entries()).filter(([t]) => e ? t.startsWith(e) : !0).map(([e, t]) => ({
                            key: e,
                            value: t
                        }))
                    }
                }
            }
        }
        preload() {
            return this.preloadPromise ? this.preloadPromise : (this.syncMode === `on-demand` && console.warn(`${this.id?`[${this.id}] `:``}Calling .preload() on a collection with syncMode "on-demand" is a no-op. In on-demand mode, data is only loaded when queries request it. Instead, create a live query and call .preload() on that to load the specific data you need. See https://tanstack.com/blog/tanstack-db-0.5-query-driven-sync for more details.`), this.preloadPromise = new Promise((e, t) => {
                if (this.lifecycle.status === `ready`) {
                    e();
                    return
                }
                if (this.lifecycle.status === `error`) {
                    t(new wr);
                    return
                }
                if (this.lifecycle.onFirstReady(() => {
                        e()
                    }), this.lifecycle.status === `idle` || this.lifecycle.status === `cleaned-up`) try {
                    this.startSync()
                } catch (e) {
                    t(e);
                    return
                }
            }), this.preloadPromise)
        }
        get isLoadingSubset() {
            return this.pendingLoadSubsetPromises.size > 0
        }
        trackLoadPromise(e) {
            let t = !this.isLoadingSubset;
            this.pendingLoadSubsetPromises.add(e), t && this._events.emit(`loadingSubset:change`, {
                type: `loadingSubset:change`,
                collection: this.collection,
                isLoadingSubset: !0,
                previousIsLoadingSubset: !1,
                loadingSubsetTransition: `start`
            }), e.finally(() => {
                let t = this.pendingLoadSubsetPromises.size === 1 && this.pendingLoadSubsetPromises.has(e);
                this.pendingLoadSubsetPromises.delete(e), t && this._events.emit(`loadingSubset:change`, {
                    type: `loadingSubset:change`,
                    collection: this.collection,
                    isLoadingSubset: !1,
                    previousIsLoadingSubset: !0,
                    loadingSubsetTransition: `end`
                })
            })
        }
        loadSubset(e) {
            if (this.syncMode === `eager`) return !0;
            if (this.syncLoadSubsetFn) {
                let t = this.syncLoadSubsetFn(e);
                if (t instanceof Promise) return this.trackLoadPromise(t), t
            }
            return !0
        }
        unloadSubset(e) {
            this.syncUnloadSubsetFn && this.syncUnloadSubsetFn(e)
        }
        cleanup() {
            try {
                this.syncCleanupFn &&= (this.syncCleanupFn(), null)
            } catch (e) {
                queueMicrotask(() => {
                    if (e instanceof Error) {
                        let t = new ji(this.id, e);
                        throw t.cause = e, t.stack = e.stack, t
                    } else throw new ji(this.id, e)
                })
            }
            this.preloadPromise = null
        }
    };

function nl(e) {
    if (typeof e == `function`) return {
        cleanup: e
    };
    if (typeof e == `object`) return e
}
var rl = 1;

function il(e, t) {
    return e === t ? 0 : e < t ? -1 : 1
}

function al(e) {
    return {
        kind: `constructor`,
        ...e.name ? {
            name: e.name
        } : {}
    }
}

function ol(e) {
    if (e == null) return e;
    switch (typeof e) {
        case `string`:
        case `boolean`:
            return e;
        case `number`:
            return Number.isFinite(e) ? e : null;
        case `bigint`:
            return {
                __type: `bigint`,
                value: e.toString()
            };
        case `function`:
        case `symbol`:
            return;
        case `undefined`:
            return
    }
    if (Array.isArray(e)) return e.map(e => ol(e) ?? null);
    if (e instanceof Date) return {
        __type: `date`,
        value: e.toISOString()
    };
    if (e instanceof Set) return {
        __type: `set`,
        values: Array.from(e).map(e => ol(e) ?? null).sort((e, t) => il(sl(e), sl(t)))
    };
    if (e instanceof Map) return {
        __type: `map`,
        entries: Array.from(e.entries()).map(([e, t]) => ({
            key: ol(e) ?? null,
            value: ol(t) ?? null
        })).sort((e, t) => il(sl(e.key), sl(t.key)))
    };
    if (e instanceof RegExp) return {
        __type: `regexp`,
        value: e.toString()
    };
    let t = {},
        n = Object.entries(e).sort(([e], [t]) => il(e, t));
    for (let [e, r] of n) {
        let n = ol(r);
        n !== void 0 && (t[e] = n)
    }
    return t
}

function sl(e) {
    return e === null ? `null` : Array.isArray(e) ? `[${e.map(sl).join(`,`)}]` : typeof e == `object` ? `{${Object.keys(e).sort((e,t)=>il(e,t)).map(t=>`${JSON.stringify(t)}:${sl(e[t])}`).join(`,`)}}` : JSON.stringify(e)
}

function cl(e, t, n, r, i) {
    let a = al(r),
        o = ol(t) ?? null,
        s = ol(i);
    return {
        signatureVersion: rl,
        signature: sl(ol({
            signatureVersion: rl,
            expression: o,
            options: s ?? null
        }) ?? null),
        indexId: e,
        name: n,
        expression: t,
        resolver: a,
        ...s === void 0 ? {} : {
            options: s
        }
    }
}

function ll(e) {
    if (typeof e != `object` || !e) return e;
    if (Array.isArray(e)) return e.map(e => ll(e));
    let t = {};
    for (let [n, r] of Object.entries(e)) t[n] = ll(r);
    return t
}

function ul(e) {
    return JSON.parse(JSON.stringify(e))
}
var dl = class {
        constructor() {
            this.indexes = new Map, this.indexMetadata = new Map, this.indexCounter = 0
        }
        setDeps(e) {
            this.state = e.state, this.lifecycle = e.lifecycle, this.defaultIndexType = e.defaultIndexType, this.events = e.events
        }
        createIndex(e, t = {}) {
            this.lifecycle.validateCollectionUsable(`createIndex`);
            let n = ++this.indexCounter,
                r = q(e(Sc())),
                i = t.indexType ?? this.defaultIndexType;
            if (!i) throw new gr(`No index type specified and no defaultIndexType set on collection. Either pass indexType in config, or set defaultIndexType on the collection:
  import { BasicIndex } from '@tanstack/db'
  createCollection({ defaultIndexType: BasicIndex, ... })`);
            let a = new i(n, r, t.name, t.options);
            a.build(this.state.entries()), this.indexes.set(n, a);
            let o = cl(n, r, t.name, i, t.options);
            return this.indexMetadata.set(n, o), this.events.emitIndexAdded(o), a
        }
        removeIndex(e) {
            this.lifecycle.validateCollectionUsable(`removeIndex`);
            let t = typeof e == `number` ? e : e.id,
                n = this.indexes.get(t);
            if (!n || typeof e != `number` && n !== e) return !1;
            this.indexes.delete(t);
            let r = this.indexMetadata.get(t);
            return this.indexMetadata.delete(t), r && this.events.emitIndexRemoved(r), !0
        }
        getIndexMetadataSnapshot() {
            return Array.from(this.indexMetadata.values()).sort((e, t) => e.indexId - t.indexId).map(e => ({ ...e,
                expression: ul(e.expression),
                resolver: { ...e.resolver
                },
                ...e.options === void 0 ? {} : {
                    options: ll(e.options)
                }
            }))
        }
        updateIndexes(e) {
            for (let t of this.indexes.values())
                for (let n of e) switch (n.type) {
                    case `insert`:
                        t.add(n.key, n.value);
                        break;
                    case `update`:
                        n.previousValue ? t.update(n.key, n.previousValue, n.value) : t.add(n.key, n.value);
                        break;
                    case `delete`:
                        t.remove(n.key, n.value);
                        break
                }
        }
        cleanup() {
            this.indexes.clear(), this.indexMetadata.clear()
        }
    },
    fl = new Set([`find`, `findLast`, `findIndex`, `findLastIndex`, `filter`, `map`, `flatMap`, `forEach`, `some`, `every`, `reduce`, `reduceRight`]),
    pl = new Set([`pop`, `push`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`]),
    ml = new Set([`set`, `delete`, `clear`, `add`]),
    hl = new Set([`entries`, `keys`, `values`, `forEach`]);

function gl(e) {
    return typeof e == `object` && !!e && !(e instanceof Date) && !(e instanceof RegExp) && !Bi(e)
}

function _l(e, t, n, r) {
    if (fl.has(e)) return function(...i) {
        let a = i[0];
        if (typeof a != `function`) return t.apply(n.copy_, i);
        let o = (e, t) => {
                if (gl(e)) {
                    let {
                        proxy: i
                    } = r(e, {
                        tracker: n,
                        prop: String(t)
                    });
                    return i
                }
                return e
            },
            s = function(e, t, n) {
                let r = o(e, t);
                return a.call(this, r, t, n)
            };
        if (e === `reduce` || e === `reduceRight`) return t.apply(n.copy_, [function(e, t, n, r) {
            let i = o(t, n);
            return a.call(this, e, i, n, r)
        }, ...i.slice(1)]);
        let c = t.apply(n.copy_, [s, ...i.slice(1)]);
        if ((e === `find` || e === `findLast`) && c && typeof c == `object`) {
            let e = n.copy_.indexOf(c);
            if (e !== -1) return o(c, e)
        }
        return e === `filter` && Array.isArray(c) ? c.map(e => {
            let t = n.copy_.indexOf(e);
            return t === -1 ? e : o(e, t)
        }) : c
    }
}

function vl(e, t) {
    return function() {
        let n = e.copy_,
            r = 0;
        return {
            next() {
                if (r >= n.length) return {
                    done: !0,
                    value: void 0
                };
                let i = n[r],
                    a = i;
                if (gl(i)) {
                    let {
                        proxy: n
                    } = t(i, {
                        tracker: e,
                        prop: String(r)
                    });
                    a = n
                }
                return r++, {
                    done: !1,
                    value: a
                }
            },
            [Symbol.iterator]() {
                return this
            }
        }
    }
}

function yl(e, t, n) {
    return function(...r) {
        let i = e.apply(t.copy_, r);
        return n(t), i
    }
}

function bl(e, t, n, r, i, a, o) {
    if (hl.has(e) || t === Symbol.iterator) return function(...s) {
        let c = n.apply(i.copy_, s);
        if (e === `forEach`) {
            let e = s[0];
            if (typeof e == `function`) return n.apply(r, [function(t, n, r) {
                let a = e.call(this, t, n, r);
                return o(i), a
            }, ...s.slice(1)])
        }
        if (e === `entries` || e === `values` || e === Symbol.iterator.toString() || t === Symbol.iterator) {
            let n = c,
                o = new Map;
            if (e === `values` && r instanceof Map)
                for (let [e, t] of i.copy_.entries()) o.set(t, e);
            let s = new Map;
            if (r instanceof Set)
                for (let e of i.copy_.values()) s.set(e, e);
            return {
                next() {
                    let c = n.next();
                    if (!c.done && c.value && typeof c.value == `object`) {
                        if (e === `entries` && Array.isArray(c.value) && c.value.length === 2) {
                            if (c.value[1] && typeof c.value[1] == `object`) {
                                let e = c.value[0],
                                    t = {
                                        tracker: i,
                                        prop: e,
                                        updateMap: t => {
                                            i.copy_ instanceof Map && i.copy_.set(e, t)
                                        }
                                    },
                                    {
                                        proxy: n
                                    } = a(c.value[1], t);
                                c.value[1] = n
                            }
                        } else if (e === `values` || e === Symbol.iterator.toString() || t === Symbol.iterator)
                            if (e === `values` && r instanceof Map) {
                                let e = o.get(c.value);
                                if (e !== void 0) {
                                    let t = {
                                            tracker: i,
                                            prop: e,
                                            updateMap: t => {
                                                i.copy_ instanceof Map && i.copy_.set(e, t)
                                            }
                                        },
                                        {
                                            proxy: n
                                        } = a(c.value, t);
                                    c.value = n
                                }
                            } else if (r instanceof Set) {
                            let e = c.value,
                                t = {
                                    tracker: i,
                                    prop: e,
                                    updateSet: t => {
                                        i.copy_ instanceof Set && (i.copy_.delete(e), i.copy_.add(t), s.set(e, t))
                                    }
                                },
                                {
                                    proxy: n
                                } = a(c.value, t);
                            c.value = n
                        } else {
                            let e = Symbol(`iterator-value`),
                                {
                                    proxy: t
                                } = a(c.value, {
                                    tracker: i,
                                    prop: e
                                });
                            c.value = t
                        }
                    }
                    return c
                },
                [Symbol.iterator]() {
                    return this
                }
            }
        }
        return c
    }
}

function J(...e) {
    let t = typeof window < `u` && typeof localStorage < `u`;
    (t && localStorage.getItem(`DEBUG`) === `true` || !t && typeof process < `u` && {}.DEBUG === `true`) && console.log(`[proxy]`, ...e)
}

function xl(e, t = new WeakMap) {
    if (typeof e != `object` || !e) return e;
    if (t.has(e)) return t.get(e);
    if (e instanceof Date) return new Date(e.getTime());
    if (e instanceof RegExp) return new RegExp(e.source, e.flags);
    if (Array.isArray(e)) {
        let n = [];
        return t.set(e, n), e.forEach((e, r) => {
            n[r] = xl(e, t)
        }), n
    }
    if (ArrayBuffer.isView(e) && !(e instanceof DataView)) {
        let n = Object.getPrototypeOf(e).constructor,
            r = new n(e.length);
        t.set(e, r);
        for (let t = 0; t < e.length; t++) r[t] = e[t];
        return r
    }
    if (e instanceof Map) {
        let n = new Map;
        return t.set(e, n), e.forEach((e, r) => {
            n.set(r, xl(e, t))
        }), n
    }
    if (e instanceof Set) {
        let n = new Set;
        return t.set(e, n), e.forEach(e => {
            n.add(xl(e, t))
        }), n
    }
    if (Bi(e)) return e;
    let n = {};
    t.set(e, n);
    for (let r in e) Object.prototype.hasOwnProperty.call(e, r) && (n[r] = xl(e[r], t));
    let r = Object.getOwnPropertySymbols(e);
    for (let i of r) n[i] = xl(e[i], t);
    return n
}
var Sl = 0;

function Cl() {
    return Sl += 1, Sl
}

function wl(e, t) {
    let n = new Map;

    function r(e, t) {
        if (J(`Object ID:`, e.constructor.name), n.has(e)) return n.get(e); {
            let r = wl(e, t);
            return n.set(e, r), r
        }
    }
    let i = new Map,
        a = {
            copy_: xl(e),
            originalObject: xl(e),
            proxyCount: Cl(),
            modified: !1,
            assigned_: {},
            parent: t,
            target: e
        };
    J(`createChangeProxy called for target`, e, a.proxyCount);

    function o(e) {
        e.modified ||= !0, e.parent && (J(`propagating change to parent`), `updateMap` in e.parent ? e.parent.updateMap(e.copy_) : `updateSet` in e.parent ? e.parent.updateSet(e.copy_) : (e.parent.tracker.copy_[e.parent.prop] = e.copy_, e.parent.tracker.assigned_[e.parent.prop] = !0), o(e.parent.tracker))
    }

    function s(e) {
        if (J(`checkIfReverted called with assigned keys:`, Object.keys(e.assigned_)), Object.keys(e.assigned_).length === 0 && Object.getOwnPropertySymbols(e.assigned_).length === 0) return J(`No assigned properties, returning true`), !0;
        for (let t in e.assigned_)
            if (e.assigned_[t] === !0) {
                let n = e.copy_[t],
                    r = e.originalObject[t];
                if (J(`Checking property ${String(t)}, current:`, n, `original:`, r), !Li(n, r)) return J(`Property ${String(t)} is different, returning false`), !1
            } else if (e.assigned_[t] === !1) return J(`Property ${String(t)} was deleted, returning false`), !1;
        let t = Object.getOwnPropertySymbols(e.assigned_);
        for (let n of t)
            if (e.assigned_[n] === !0) {
                let t = e.copy_[n],
                    r = e.originalObject[n];
                if (!Li(t, r)) return J(`Symbol property is different, returning false`), !1
            } else if (e.assigned_[n] === !1) return J(`Symbol property was deleted, returning false`), !1;
        return J(`All properties match original values, returning true`), !0
    }

    function c(e, t) {
        J(`checkParentStatus called for child prop:`, t);
        let n = s(e);
        J(`Parent checkIfReverted returned:`, n), n && (J(`Parent is fully reverted, clearing tracking`), e.modified = !1, e.assigned_ = {}, e.parent && (J(`Continuing up the parent chain`), c(e.parent.tracker, e.parent.prop)))
    }

    function l(e) {
        if (J(`createObjectProxy`, e), i.has(e)) return J(`proxyCache found match`), i.get(e);
        let n = new Proxy(e, {
            get(e, t) {
                J(`get`, e, t);
                let n = a.copy_[t] ?? a.originalObject[t],
                    s = a.originalObject[t];
                if (J(`value (at top of proxy get)`, n), Object.getOwnPropertyDescriptor(e, t) ?.get) return n;
                if (typeof n == `function`) {
                    if (Array.isArray(e)) {
                        let e = t.toString();
                        if (pl.has(e)) return yl(n, a, o);
                        let i = _l(e, n, a, r);
                        if (i) return i;
                        if (t === Symbol.iterator) return vl(a, r)
                    }
                    if (e instanceof Map || e instanceof Set) {
                        let i = t.toString();
                        if (ml.has(i)) return yl(n, a, o);
                        let s = bl(i, t, n, e, a, r, o);
                        if (s) return s
                    }
                    return n.bind(e)
                }
                if (gl(n)) {
                    let {
                        proxy: e
                    } = r(s, {
                        tracker: a,
                        prop: String(t)
                    });
                    return i.set(n, e), e
                }
                return n
            },
            set(e, n, r) {
                let i = a.copy_[n];
                if (J(`set called for property ${String(n)}, current:`, i, `new:`, r), Li(i, r)) J(`Value unchanged, not tracking`);
                else {
                    let e = a.originalObject[n],
                        i = Li(r, e);
                    if (J(`value:`, r, `original:`, e, `isRevertToOriginal:`, i), i) {
                        J(`Reverting property ${String(n)} to original value`), delete a.assigned_[n.toString()], J(`Updating copy with original value for ${String(n)}`), a.copy_[n] = xl(e), J(`Checking if all properties reverted`);
                        let r = s(a);
                        J(`All reverted:`, r), r ? (J(`All properties reverted, clearing tracking`), a.modified = !1, a.assigned_ = {}, t && (J(`Updating parent for property:`, t.prop), c(t.tracker, t.prop))) : (J(`Some properties still changed, keeping modified flag`), a.modified = !0)
                    } else J(`Setting new value for property ${String(n)}`), a.copy_[n] = r, a.assigned_[n.toString()] = !0, J(`Marking object and ancestors as modified`, a), o(a)
                }
                return !0
            },
            defineProperty(e, t, n) {
                let r = Reflect.defineProperty(e, t, n);
                return r && `value` in n && (a.copy_[t] = xl(n.value), a.assigned_[t.toString()] = !0, o(a)), r
            },
            getOwnPropertyDescriptor(e, t) {
                return Reflect.getOwnPropertyDescriptor(e, t)
            },
            preventExtensions(e) {
                return Reflect.preventExtensions(e)
            },
            isExtensible(e) {
                return Reflect.isExtensible(e)
            },
            deleteProperty(e, t) {
                J(`deleteProperty`, e, t);
                let n = typeof t == `symbol` ? t.toString() : t;
                if (n in e) {
                    let r = n in a.originalObject,
                        i = Reflect.deleteProperty(e, t);
                    return i && (r ? (a.assigned_[n] = !1, o(a)) : (delete a.assigned_[n], Object.keys(a.assigned_).length === 0 && Object.getOwnPropertySymbols(a.assigned_).length === 0 ? a.modified = !1 : a.modified = !0)), i
                }
                return !0
            }
        });
        return i.set(e, n), n
    }
    return {
        proxy: l(a.copy_),
        getChanges: () => {
            if (J(`getChanges called, modified:`, a.modified), J(a), !a.modified) return J(`Object not modified, returning empty object`), {};
            if (typeof a.copy_ != `object` || Array.isArray(a.copy_) || Object.keys(a.assigned_).length === 0) return a.copy_;
            let e = {};
            for (let t in a.copy_) a.assigned_[t] === !0 && t in a.copy_ && (e[t] = a.copy_[t]);
            return J(`Returning copy:`, e), e
        }
    }
}

function Tl(e) {
    let t = e.map(e => wl(e));
    return {
        proxies: t.map(e => e.proxy),
        getChanges: () => t.map(e => e.getChanges())
    }
}

function El(e, t) {
    let {
        proxy: n,
        getChanges: r
    } = wl(e);
    return t(n), r()
}

function Dl(e, t) {
    let {
        proxies: n,
        getChanges: r
    } = Tl(e);
    return t(n), r()
}

function Ol() {
    let e, t, n = !0;
    return {
        promise: new Promise((r, i) => {
            e = e => {
                n = !1, r(e)
            }, t = e => {
                n = !1, i(e)
            }
        }),
        resolve: e,
        reject: t,
        isPending: () => n
    }
}

function kl(e) {
    return typeof e == `object` && !!e && typeof e.hasPendingGraphRun == `function`
}
var Al = new class {
        constructor() {
            this.contexts = new Map, this.clearListeners = new Set
        }
        getOrCreateContext(e) {
            let t = this.contexts.get(e);
            return t || (t = {
                queue: [],
                jobs: new Map,
                dependencies: new Map,
                completed: new Set
            }, this.contexts.set(e, t)), t
        }
        schedule({
            contextId: e,
            jobId: t,
            dependencies: n,
            run: r
        }) {
            if (e === void 0) {
                r();
                return
            }
            let i = this.getOrCreateContext(e);
            if (i.jobs.has(t) || i.queue.push(t), i.jobs.set(t, r), n) {
                let e = new Set(n);
                e.delete(t), i.dependencies.set(t, e)
            } else i.dependencies.has(t) || i.dependencies.set(t, new Set);
            i.completed.delete(t)
        }
        flush(e) {
            let t = this.contexts.get(e);
            if (!t) return;
            let {
                queue: n,
                jobs: r,
                dependencies: i,
                completed: a
            } = t;
            for (; n.length > 0;) {
                let t = !1,
                    o = n.length;
                for (let s = 0; s < o; s++) {
                    let o = n.shift(),
                        s = r.get(o);
                    if (!s) {
                        i.delete(o), a.delete(o);
                        continue
                    }
                    let c = i.get(o),
                        l = !c;
                    if (c) {
                        l = !0;
                        for (let t of c) {
                            if (t === o) continue;
                            let n = kl(t) && t.hasPendingGraphRun(e);
                            if (r.has(t) && !a.has(t) || !r.has(t) && n) {
                                l = !1;
                                break
                            }
                        }
                    }
                    l ? (r.delete(o), i.delete(o), s(), a.add(o), t = !0) : n.push(o)
                }
                if (!t) throw Error(`Scheduler detected unresolved dependencies for context ${String(e)}.`)
            }
            this.contexts.delete(e)
        }
        flushAll() {
            for (let e of Array.from(this.contexts.keys())) this.flush(e)
        }
        clear(e) {
            this.contexts.delete(e), this.clearListeners.forEach(t => t(e))
        }
        onClear(e) {
            return this.clearListeners.add(e), () => this.clearListeners.delete(e)
        }
        hasPendingJobs(e) {
            let t = this.contexts.get(e);
            return !!t && t.jobs.size > 0
        }
        clearJob(e, t) {
            let n = this.contexts.get(e);
            n && (n.jobs.delete(t), n.dependencies.delete(t), n.completed.delete(t), n.queue = n.queue.filter(e => e !== t), n.jobs.size === 0 && this.contexts.delete(e))
        }
    },
    jl = [],
    Ml = [],
    Nl = 0;

function Pl(e, t) {
    switch (`${e.type}-${t.type}`) {
        case `insert-update`:
            return { ...e,
                type: `insert`,
                original: {},
                modified: t.modified,
                changes: { ...e.changes,
                    ...t.changes
                },
                key: e.key,
                globalKey: e.globalKey,
                metadata: t.metadata ?? e.metadata,
                syncMetadata: { ...e.syncMetadata,
                    ...t.syncMetadata
                },
                mutationId: t.mutationId,
                updatedAt: t.updatedAt
            };
        case `insert-delete`:
            return null;
        case `update-delete`:
            return t;
        case `update-update`:
            return { ...t,
                original: e.original,
                changes: { ...e.changes,
                    ...t.changes
                },
                metadata: t.metadata ?? e.metadata,
                syncMetadata: { ...e.syncMetadata,
                    ...t.syncMetadata
                }
            };
        case `delete-delete`:
        case `insert-insert`:
            return t;
        default:
            {
                let n = `${e.type}-${t.type}`;
                throw Error(`Unhandled mutation combination: ${n}`)
            }
    }
}

function Fl(e) {
    let t = new Bl(e);
    return jl.push(t), t
}

function Il() {
    if (Ml.length > 0) return Ml.slice(-1)[0]
}

function Ll(e) {
    Al.clear(e.id), Ml.push(e)
}

function Rl(e) {
    try {
        Al.flush(e.id)
    } finally {
        Ml = Ml.filter(t => t.id !== e.id)
    }
}

function zl(e) {
    let t = jl.findIndex(t => t.id === e.id);
    t !== -1 && jl.splice(t, 1)
}
var Bl = class {
        constructor(e) {
            if (e.mutationFn === void 0) throw new Hr;
            this.id = e.id ?? crypto.randomUUID(), this.mutationFn = e.mutationFn, this.state = `pending`, this.mutations = [], this.isPersisted = Ol(), this.autoCommit = e.autoCommit ?? !0, this.createdAt = new Date, this.sequenceNumber = Nl++, this.metadata = e.metadata ?? {}
        }
        setState(e) {
            this.state = e, (e === `completed` || e === `failed`) && zl(this)
        }
        mutate(e) {
            if (this.state !== `pending`) throw new Wr;
            Ll(this);
            try {
                e()
            } finally {
                Rl(this)
            }
            return this.autoCommit && this.commit().catch(() => {}), this
        }
        applyMutations(e) {
            for (let t of e) {
                let e = this.mutations.findIndex(e => e.globalKey === t.globalKey);
                if (e >= 0) {
                    let n = this.mutations[e],
                        r = Pl(n, t);
                    r === null ? this.mutations.splice(e, 1) : this.mutations[e] = r
                } else this.mutations.push(t)
            }
        }
        rollback(e) {
            let t = e ?.isSecondaryRollback ?? !1;
            if (this.state === `completed`) throw new Gr;
            if (this.setState(`failed`), !t) {
                let e = new Set;
                this.mutations.forEach(t => e.add(t.globalKey));
                for (let t of jl) t.state === `pending` && t.mutations.some(t => e.has(t.globalKey)) && t.rollback({
                    isSecondaryRollback: !0
                })
            }
            return this.isPersisted.reject(this.error ?.error), this.touchCollection(), this
        }
        touchCollection() {
            let e = new Set;
            for (let t of this.mutations) e.has(t.collection.id) || (t.collection._state.onTransactionStateChange(), t.collection._state.pendingSyncedTransactions.length > 0 && t.collection._state.commitPendingTransactions(), e.add(t.collection.id))
        }
        async commit() {
            if (this.state !== `pending`) throw new Kr;
            if (this.setState(`persisting`), this.mutations.length === 0) return this.setState(`completed`), this.isPersisted.resolve(this), this;
            try {
                await this.mutationFn({
                    transaction: this
                }), this.setState(`completed`), this.touchCollection(), this.isPersisted.resolve(this)
            } catch (e) {
                let t = e instanceof Error ? e : Error(String(e));
                throw this.error = {
                    message: t.message,
                    error: t
                }, this.rollback(), t
            }
            return this
        }
        compareCreatedAt(e) {
            let t = this.createdAt.getTime() - e.createdAt.getTime();
            return t === 0 ? this.sequenceNumber - e.sequenceNumber : t
        }
    },
    Vl = class {
        constructor(e, t) {
            this.insert = (e, t) => {
                this.lifecycle.validateCollectionUsable(`insert`);
                let n = this.state,
                    r = Il();
                if (!r && !this.config.onInsert) throw new Rr;
                let i = Array.isArray(e) ? e : [e],
                    a = [],
                    o = new Set;
                if (i.forEach(e => {
                        let n = this.validateData(e, `insert`),
                            r = this.config.getKey(n);
                        if (this.state.has(r) || o.has(r)) throw new kr(r);
                        o.add(r);
                        let i = this.generateGlobalKey(r, e),
                            s = {
                                mutationId: crypto.randomUUID(),
                                original: {},
                                modified: n,
                                changes: Object.fromEntries(Object.keys(e).map(e => [e, n[e]])),
                                globalKey: i,
                                key: r,
                                metadata: t ?.metadata,
                                syncMetadata: this.config.sync.getSyncMetadata ?.() || {},
                                optimistic: t ?.optimistic ?? !0,
                                type: `insert`,
                                createdAt: new Date,
                                updatedAt: new Date,
                                collection: this.collection
                            };
                        a.push(s)
                    }), r) return r.applyMutations(a), n.transactions.set(r.id, r), n.scheduleTransactionCleanup(r), n.recomputeOptimisticState(!0), r; {
                    let e = Fl({
                        metadata: {
                            [bc]: !0
                        },
                        mutationFn: async e => await this.config.onInsert({
                            transaction: e.transaction,
                            collection: this.collection
                        })
                    });
                    return e.applyMutations(a), this.markPendingLocalOrigins(a), e.commit().catch(() => void 0), n.transactions.set(e.id, e), n.scheduleTransactionCleanup(e), n.recomputeOptimisticState(!0), e
                }
            }, this.delete = (e, t) => {
                let n = this.state;
                this.lifecycle.validateCollectionUsable(`delete`);
                let r = Il();
                if (!r && !this.config.onDelete) throw new Br;
                if (Array.isArray(e) && e.length === 0) throw new Fr;
                let i = Array.isArray(e) ? e : [e],
                    a = [];
                for (let e of i) {
                    if (!this.state.has(e)) throw new Ir(e);
                    let r = this.generateGlobalKey(e, this.state.get(e)),
                        i = {
                            mutationId: crypto.randomUUID(),
                            original: this.state.get(e),
                            modified: this.state.get(e),
                            changes: this.state.get(e),
                            globalKey: r,
                            key: e,
                            metadata: t ?.metadata,
                            syncMetadata: n.syncedMetadata.get(e) || {},
                            optimistic: t ?.optimistic ?? !0,
                            type: `delete`,
                            createdAt: new Date,
                            updatedAt: new Date,
                            collection: this.collection
                        };
                    a.push(i)
                }
                if (r) return r.applyMutations(a), n.transactions.set(r.id, r), n.scheduleTransactionCleanup(r), n.recomputeOptimisticState(!0), r;
                let o = Fl({
                    autoCommit: !0,
                    metadata: {
                        [bc]: !0
                    },
                    mutationFn: async e => this.config.onDelete({
                        transaction: e.transaction,
                        collection: this.collection
                    })
                });
                return o.applyMutations(a), this.markPendingLocalOrigins(a), o.commit().catch(() => void 0), n.transactions.set(o.id, o), n.scheduleTransactionCleanup(o), n.recomputeOptimisticState(!0), o
            }, this.id = t, this.config = e
        }
        setDeps(e) {
            this.lifecycle = e.lifecycle, this.state = e.state, this.collection = e.collection
        }
        ensureStandardSchema(e) {
            if (e && `~standard` in e) return e;
            throw new yr
        }
        validateData(e, t, n) {
            if (!this.config.schema) return e;
            let r = this.ensureStandardSchema(this.config.schema);
            if (t === `update` && n) {
                let i = this.state.get(n);
                if (i && e && typeof e == `object` && typeof i == `object`) {
                    let n = Object.assign({}, i, e),
                        a = r[`~standard`].validate(n);
                    if (a instanceof Promise) throw new br;
                    if (`issues` in a && a.issues) throw new hr(t, a.issues.map(e => ({
                        message: e.message,
                        path: e.path ?.map(e => String(e))
                    })));
                    let o = a.value;
                    return Object.fromEntries(Object.keys(e).map(e => [e, o[e]]))
                }
            }
            let i = r[`~standard`].validate(e);
            if (i instanceof Promise) throw new br;
            if (`issues` in i && i.issues) throw new hr(t, i.issues.map(e => ({
                message: e.message,
                path: e.path ?.map(e => String(e))
            })));
            return i.value
        }
        generateGlobalKey(e, t) {
            if (typeof e != `string` && typeof e != `number`) throw e === void 0 ? new Dr(t) : new Or(e, t);
            return `KEY::${this.id}/${e}`
        }
        markPendingLocalOrigins(e) {
            for (let t of e) this.state.pendingLocalOrigins.add(t.key)
        }
        update(e, t, n) {
            if (e === void 0) throw new jr;
            let r = this.state;
            this.lifecycle.validateCollectionUsable(`update`);
            let i = Il();
            if (!i && !this.config.onUpdate) throw new zr;
            let a = Array.isArray(e),
                o = a ? e : [e];
            if (a && o.length === 0) throw new Mr;
            let s = typeof t == `function` ? t : n,
                c = typeof t == `function` ? {} : t,
                l = o.map(e => {
                    let t = this.state.get(e);
                    if (!t) throw new Nr(e);
                    return t
                }),
                u;
            u = a ? Dl(l, s) : [El(l[0], s)];
            let d = o.map((e, t) => {
                let n = u[t];
                if (!n || Object.keys(n).length === 0) return null;
                let i = l[t],
                    a = this.validateData(n, `update`, e),
                    o = Object.assign({}, i, a),
                    s = this.config.getKey(i),
                    d = this.config.getKey(o);
                if (s !== d) throw new Pr(s, d);
                let f = this.generateGlobalKey(d, o);
                return {
                    mutationId: crypto.randomUUID(),
                    original: i,
                    modified: o,
                    changes: Object.fromEntries(Object.keys(n).map(e => [e, o[e]])),
                    globalKey: f,
                    key: e,
                    metadata: c.metadata,
                    syncMetadata: r.syncedMetadata.get(e) || {},
                    optimistic: c.optimistic ?? !0,
                    type: `update`,
                    createdAt: new Date,
                    updatedAt: new Date,
                    collection: this.collection
                }
            }).filter(Boolean);
            if (d.length === 0) {
                let e = Fl({
                    mutationFn: async () => {}
                });
                return e.commit().catch(() => void 0), r.scheduleTransactionCleanup(e), e
            }
            if (i) return i.applyMutations(d), r.transactions.set(i.id, i), r.scheduleTransactionCleanup(i), r.recomputeOptimisticState(!0), i;
            let f = Fl({
                metadata: {
                    [bc]: !0
                },
                mutationFn: async e => this.config.onUpdate({
                    transaction: e.transaction,
                    collection: this.collection
                })
            });
            return f.applyMutations(d), this.markPendingLocalOrigins(d), f.commit().catch(() => void 0), r.transactions.set(f.id, f), r.scheduleTransactionCleanup(f), r.recomputeOptimisticState(!0), f
        }
    },
    Hl = class extends Uc {
        constructor() {
            super()
        }
        setDeps(e) {
            this.collection = e.collection
        }
        emit(e, t) {
            this.emitInner(e, t)
        }
        emitStatusChange(e, t) {
            this.emit(`status:change`, {
                type: `status:change`,
                collection: this.collection,
                previousStatus: t,
                status: e
            });
            let n = `status:${e}`;
            this.emit(n, {
                type: n,
                collection: this.collection,
                previousStatus: t,
                status: e
            })
        }
        emitSubscribersChange(e, t) {
            this.emit(`subscribers:change`, {
                type: `subscribers:change`,
                collection: this.collection,
                previousSubscriberCount: t,
                subscriberCount: e
            })
        }
        emitIndexAdded(e) {
            this.emit(`index:added`, {
                type: `index:added`,
                collection: this.collection,
                index: e
            })
        }
        emitIndexRemoved(e) {
            this.emit(`index:removed`, {
                type: `index:removed`,
                collection: this.collection,
                index: e
            })
        }
        cleanup() {
            this.clearListeners()
        }
    };

function Ul(e) {
    let t = new Wl(e);
    return e.utils ? t.utils = e.utils : t.utils = {}, t
}
var Wl = class {
    constructor(e) {
        if (this.utils = {}, this.deferDataRefresh = null, this.insert = (e, t) => this._mutations.insert(e, t), this.delete = (e, t) => this._mutations.delete(e, t), !e) throw new _r;
        if (!e.sync) throw new vr;
        if (e.id ? this.id = e.id : this.id = crypto.randomUUID(), this.config = { ...e,
                autoIndex: e.autoIndex ?? `off`
            }, this.config.autoIndex === `eager` && !e.defaultIndexType) throw new gr(`autoIndex: 'eager' requires defaultIndexType to be set. Import an index type and set it:
  import { BasicIndex } from '@tanstack/db'
  createCollection({ defaultIndexType: BasicIndex, autoIndex: 'eager', ... })`);
        this._changes = new Kc, this._events = new Hl, this._indexes = new dl, this._lifecycle = new $c(e, this.id), this._mutations = new Vl(e, this.id), this._state = new xc(e), this._sync = new tl(e, this.id), this.comparisonOpts = Gl(e), this._changes.setDeps({
            collection: this,
            lifecycle: this._lifecycle,
            sync: this._sync,
            events: this._events,
            state: this._state
        }), this._events.setDeps({
            collection: this
        }), this._indexes.setDeps({
            state: this._state,
            lifecycle: this._lifecycle,
            defaultIndexType: e.defaultIndexType,
            events: this._events
        }), this._lifecycle.setDeps({
            changes: this._changes,
            events: this._events,
            indexes: this._indexes,
            state: this._state,
            sync: this._sync
        }), this._mutations.setDeps({
            collection: this,
            lifecycle: this._lifecycle,
            state: this._state
        }), this._state.setDeps({
            collection: this,
            lifecycle: this._lifecycle,
            changes: this._changes,
            indexes: this._indexes,
            events: this._events
        }), this._sync.setDeps({
            collection: this,
            state: this._state,
            lifecycle: this._lifecycle,
            events: this._events
        }), e.startSync === !0 && this._sync.startSync()
    }
    get status() {
        return this._lifecycle.status
    }
    get subscriberCount() {
        return this._changes.activeSubscribersCount
    }
    onFirstReady(e) {
        return this._lifecycle.onFirstReady(e)
    }
    isReady() {
        return this._lifecycle.status === `ready`
    }
    get isLoadingSubset() {
        return this._sync.isLoadingSubset
    }
    startSyncImmediate() {
        this._sync.startSync()
    }
    preload() {
        return this._sync.preload()
    }
    get(e) {
        return this._state.getWithVirtualProps(e)
    }
    has(e) {
        return this._state.has(e)
    }
    get size() {
        return this._state.size
    }* keys() {
        yield* this._state.keys()
    }* values() {
        for (let e of this._state.keys()) {
            let t = this.get(e);
            t !== void 0 && (yield t)
        }
    }* entries() {
        for (let e of this._state.keys()) {
            let t = this.get(e);
            t !== void 0 && (yield [e, t])
        }
    }*[Symbol.iterator]() {
        yield* this.entries()
    }
    forEach(e) {
        let t = 0;
        for (let [n, r] of this.entries()) e(r, n, t++)
    }
    map(e) {
        let t = [],
            n = 0;
        for (let [r, i] of this.entries()) t.push(e(i, r, n++));
        return t
    }
    getKeyFromItem(e) {
        return this.config.getKey(e)
    }
    createIndex(e, t = {}) {
        return this._indexes.createIndex(e, t)
    }
    removeIndex(e) {
        return this._indexes.removeIndex(e)
    }
    getIndexMetadata() {
        return this._indexes.getIndexMetadataSnapshot()
    }
    get indexes() {
        return this._indexes.indexes
    }
    validateData(e, t, n) {
        return this._mutations.validateData(e, t, n)
    }
    get compareOptions() {
        return { ...this.comparisonOpts
        }
    }
    update(e, t, n) {
        return this._mutations.update(e, t, n)
    }
    get state() {
        let e = new Map;
        for (let [t, n] of this.entries()) e.set(t, n);
        return e
    }
    stateWhenReady() {
        return this.size > 0 || this.isReady() ? Promise.resolve(this.state) : this.preload().then(() => this.state)
    }
    get toArray() {
        return Array.from(this.values())
    }
    toArrayWhenReady() {
        return this.size > 0 || this.isReady() ? Promise.resolve(this.toArray) : this.preload().then(() => this.toArray)
    }
    currentStateAsChanges(e = {}) {
        return mc(this, e)
    }
    subscribeChanges(e, t = {}) {
        return this._changes.subscribeChanges(e, t)
    }
    on(e, t) {
        return this._events.on(e, t)
    }
    once(e, t) {
        return this._events.once(e, t)
    }
    off(e, t) {
        this._events.off(e, t)
    }
    waitFor(e, t) {
        return this._events.waitFor(e, t)
    }
    async cleanup() {
        return this._lifecycle.cleanup(), Promise.resolve()
    }
};

function Gl(e) {
    if (e.defaultStringCollation) {
        let t = e.defaultStringCollation;
        return {
            stringSort: t.stringSort ?? `locale`,
            locale: t.stringSort === `locale` ? t.locale : void 0,
            localeOptions: t.stringSort === `locale` ? t.localeOptions : void 0
        }
    } else return {
        stringSort: `locale`
    }
}

function Kl(e) {
    return !!e && (typeof e == `object` || typeof e == `function`) && typeof e.then == `function`
}

function ql(e) {
    let {
        mutationFn: t,
        onMutate: n,
        ...r
    } = e;
    return e => {
        let i = Fl({ ...r,
            mutationFn: async n => await t(e, n)
        });
        return i.mutate(() => {
            if (Kl(n(e))) throw new Ur
        }), i
    }
}

function Jl(e) {
    let {
        onMutate: t,
        mutationFn: n,
        strategy: r,
        ...i
    } = e, a = null, o = () => {
        if (!a) throw Error(`Strategy callback called but no active transaction exists. This indicates a bug in the strategy implementation.`);
        if (a.state !== `pending`) throw Error(`Strategy callback called but active transaction is in state "${a.state}". Expected "pending".`);
        let e = a;
        return a = null, e.commit().catch(() => {}), e
    };

    function s(e) {
        (!a || a.state !== `pending`) && (a = Fl({ ...i,
            mutationFn: n,
            autoCommit: !1
        })), a.mutate(() => {
            t(e)
        });
        let s = a;
        if (r._type === `queue`) {
            let e = a;
            a = null, r.execute(() => (e.commit().catch(() => {}), e))
        } else r.execute(o);
        return s
    }
    return s
}
var Yl = class {
        constructor(e, t, n, r) {
            this.lookupCount = 0, this.totalLookupTime = 0, this.lastUpdated = new Date, this.id = e, this.expression = t, this.compareOptions = Vi, this.name = n, this.initialize(r)
        }
        supports(e) {
            return this.supportedOperations.has(e)
        }
        matchesField(e) {
            return this.expression.type === `ref` && this.expression.path.length === e.length && this.expression.path.every((t, n) => t === e[n])
        }
        matchesCompareOptions(e) {
            return Li({ ...this.compareOptions,
                direction: void 0
            }, { ...e,
                direction: void 0
            })
        }
        matchesDirection(e) {
            return this.compareOptions.direction === e
        }
        getStats() {
            return {
                entryCount: this.keyCount,
                lookupCount: this.lookupCount,
                averageLookupTime: this.lookupCount > 0 ? this.totalLookupTime / this.lookupCount : 0,
                lastUpdated: this.lastUpdated
            }
        }
        evaluateIndexExpression(e) {
            return aa(this.expression)(e)
        }
        trackLookup(e) {
            let t = performance.now() - e;
            this.lookupCount++, this.totalLookupTime += t
        }
        updateTimestamp() {
            this.lastUpdated = new Date
        }
    },
    Xl = class {
        constructor(e, t, n) {
            this._root = tu, this._size = 0, this._maxNodeSize = n >= 4 ? Math.min(n, 256) : 32, this._compare = e, t && this.setPairs(t)
        }
        get size() {
            return this._size
        }
        get length() {
            return this._size
        }
        get isEmpty() {
            return this._size === 0
        }
        clear() {
            this._root = tu, this._size = 0
        }
        get(e, t) {
            return this._root.get(e, t, this)
        }
        set(e, t, n) {
            this._root.isShared && (this._root = this._root.clone());
            let r = this._root.set(e, t, n, this);
            return r === !0 || r === !1 ? r : (this._root = new Ql([this._root, r]), !0)
        }
        has(e) {
            return this.forRange(e, e, !0, void 0) !== 0
        }
        delete(e) {
            return this.editRange(e, e, !0, eu) !== 0
        }
        get maxNodeSize() {
            return this._maxNodeSize
        }
        minKey() {
            return this._root.minKey()
        }
        maxKey() {
            return this._root.maxKey()
        }
        keysArray() {
            let e = [];
            return this._root.forRange(this.minKey(), this.maxKey(), !0, !1, this, 0, (t, n) => {
                e.push(t)
            }), e
        }
        nextHigherPair(e, t) {
            return t ||= [], e === void 0 ? this._root.minPair(t) : this._root.getPairOrNextHigher(e, this._compare, !1, t)
        }
        nextHigherKey(e) {
            let t = this.nextHigherPair(e, nu);
            return t && t[0]
        }
        nextLowerPair(e, t) {
            return t ||= [], e === void 0 ? this._root.maxPair(t) : this._root.getPairOrNextLower(e, this._compare, !1, t)
        }
        nextLowerKey(e) {
            let t = this.nextLowerPair(e, nu);
            return t && t[0]
        }
        setPairs(e, t) {
            let n = 0;
            for (let r of e) this.set(r[0], r[1], t) && n++;
            return n
        }
        forRange(e, t, n, r, i) {
            let a = this._root.forRange(e, t, n, !1, this, i || 0, r);
            return typeof a == `number` ? a : a.break
        }
        editRange(e, t, n, r, i) {
            let a = this._root;
            a.isShared && (this._root = a = a.clone());
            try {
                let o = a.forRange(e, t, n, !0, this, i || 0, r);
                return typeof o == `number` ? o : o.break
            } finally {
                let e;
                for (; a.keys.length <= 1 && !a.isLeaf;) e ||= a.isShared, this._root = a = a.keys.length === 0 ? tu : a.children[0];
                e && (a.isShared = !0)
            }
        }
    },
    Zl = class e {
        get isLeaf() {
            return this.children === void 0
        }
        constructor(e = [], t) {
            this.keys = e, this.values = t || Y, this.isShared = void 0
        }
        maxKey() {
            return this.keys[this.keys.length - 1]
        }
        indexOf(e, t, n) {
            let r = this.keys,
                i = 0,
                a = r.length,
                o = a >> 1;
            for (; i < a;) {
                let t = n(r[o], e);
                if (t < 0) i = o + 1;
                else if (t > 0) a = o;
                else if (t === 0) return o;
                else if (e === e) return r.length;
                else throw Error(`BTree: NaN was used as a key`);
                o = i + a >> 1
            }
            return o ^ t
        }
        minKey() {
            return this.keys[0]
        }
        minPair(e) {
            if (this.keys.length !== 0) return e[0] = this.keys[0], e[1] = this.values[0], e
        }
        maxPair(e) {
            if (this.keys.length === 0) return;
            let t = this.keys.length - 1;
            return e[0] = this.keys[t], e[1] = this.values[t], e
        }
        clone() {
            let t = this.values;
            return new e(this.keys.slice(0), t === Y ? t : t.slice(0))
        }
        get(e, t, n) {
            let r = this.indexOf(e, -1, n._compare);
            return r < 0 ? t : this.values[r]
        }
        getPairOrNextLower(e, t, n, r) {
            let i = this.indexOf(e, -1, t),
                a = i < 0 ? ~i - 1 : n ? i : i - 1;
            if (a >= 0) return r[0] = this.keys[a], r[1] = this.values[a], r
        }
        getPairOrNextHigher(e, t, n, r) {
            let i = this.indexOf(e, -1, t),
                a = i < 0 ? ~i : n ? i : i + 1,
                o = this.keys;
            if (a < o.length) return r[0] = o[a], r[1] = this.values[a], r
        }
        set(e, t, n, r) {
            let i = this.indexOf(e, -1, r._compare);
            if (i < 0) {
                if (i = ~i, r._size++, this.keys.length < r._maxNodeSize) return this.insertInLeaf(i, e, t, r); {
                    let n = this.splitOffRightSide(),
                        a = this;
                    return i > this.keys.length && (i -= this.keys.length, a = n), a.insertInLeaf(i, e, t, r), n
                }
            } else return n !== !1 && (t !== void 0 && this.reifyValues(), this.keys[i] = e, this.values[i] = t), !1
        }
        reifyValues() {
            return this.values === Y ? this.values = this.values.slice(0, this.keys.length) : this.values
        }
        insertInLeaf(e, t, n, r) {
            if (this.keys.splice(e, 0, t), this.values === Y) {
                for (; Y.length < r._maxNodeSize;) Y.push(void 0);
                if (n === void 0) return !0;
                this.values = Y.slice(0, this.keys.length - 1)
            }
            return this.values.splice(e, 0, n), !0
        }
        takeFromRight(e) {
            let t = this.values;
            e.values === Y ? t !== Y && t.push(void 0) : (t = this.reifyValues(), t.push(e.values.shift())), this.keys.push(e.keys.shift())
        }
        takeFromLeft(e) {
            let t = this.values;
            e.values === Y ? t !== Y && t.unshift(void 0) : (t = this.reifyValues(), t.unshift(e.values.pop())), this.keys.unshift(e.keys.pop())
        }
        splitOffRightSide() {
            let t = this.keys.length >> 1;
            return new e(this.keys.splice(t), this.values === Y ? Y : this.values.splice(t))
        }
        forRange(e, t, n, r, i, a, o) {
            let s = i._compare,
                c, l;
            if (t === e) {
                if (!n || (l = (c = this.indexOf(e, -1, s)) + 1, c < 0)) return a
            } else c = this.indexOf(e, 0, s), l = this.indexOf(t, -1, s), l < 0 ? l = ~l : n === !0 && l++;
            let u = this.keys,
                d = this.values;
            if (o !== void 0)
                for (let e = c; e < l; e++) {
                    let t = u[e],
                        n = o(t, d[e], a++);
                    if (n !== void 0) {
                        if (r === !0) {
                            if (t !== u[e] || this.isShared === !0) throw Error(`BTree illegally changed or cloned in editRange`);
                            n.delete ? (this.keys.splice(e, 1), this.values !== Y && this.values.splice(e, 1), i._size--, e--, l--) : n.hasOwnProperty(`value`) && (d[e] = n.value)
                        }
                        if (n.break !== void 0) return n
                    }
                } else a += l - c;
            return a
        }
        mergeSibling(e, t) {
            if (this.keys.push.apply(this.keys, e.keys), this.values === Y) {
                if (e.values === Y) return;
                this.values = this.values.slice(0, this.keys.length)
            }
            this.values.push.apply(this.values, e.reifyValues())
        }
    },
    Ql = class e extends Zl {
        constructor(e, t) {
            if (!t) {
                t = [];
                for (let n = 0; n < e.length; n++) t[n] = e[n].maxKey()
            }
            super(t), this.children = e
        }
        minKey() {
            return this.children[0].minKey()
        }
        minPair(e) {
            return this.children[0].minPair(e)
        }
        maxPair(e) {
            return this.children[this.children.length - 1].maxPair(e)
        }
        get(e, t, n) {
            let r = this.indexOf(e, 0, n._compare),
                i = this.children;
            return r < i.length ? i[r].get(e, t, n) : void 0
        }
        getPairOrNextLower(e, t, n, r) {
            let i = this.indexOf(e, 0, t),
                a = this.children;
            if (i >= a.length) return this.maxPair(r);
            let o = a[i].getPairOrNextLower(e, t, n, r);
            return o === void 0 && i > 0 ? a[i - 1].maxPair(r) : o
        }
        getPairOrNextHigher(e, t, n, r) {
            let i = this.indexOf(e, 0, t),
                a = this.children,
                o = a.length;
            if (i >= o) return;
            let s = a[i].getPairOrNextHigher(e, t, n, r);
            return s === void 0 && i < o - 1 ? a[i + 1].minPair(r) : s
        }
        set(e, t, n, r) {
            let i = this.children,
                a = r._maxNodeSize,
                o = r._compare,
                s = Math.min(this.indexOf(e, 0, o), i.length - 1),
                c = i[s];
            if (c.isShared && (i[s] = c = c.clone()), c.keys.length >= a) {
                let t;
                s > 0 && (t = i[s - 1]).keys.length < a && o(c.keys[0], e) < 0 ? (t.isShared && (i[s - 1] = t = t.clone()), t.takeFromRight(c), this.keys[s - 1] = t.maxKey()) : (t = i[s + 1]) !== void 0 && t.keys.length < a && o(c.maxKey(), e) < 0 && (t.isShared && (i[s + 1] = t = t.clone()), t.takeFromLeft(c), this.keys[s] = i[s].maxKey())
            }
            let l = c.set(e, t, n, r);
            if (l === !1) return !1;
            if (this.keys[s] = c.maxKey(), l === !0) return !0;
            if (this.keys.length < a) return this.insert(s + 1, l), !0; {
                let e = this.splitOffRightSide(),
                    t = this;
                return o(l.maxKey(), this.maxKey()) > 0 && (t = e, s -= this.keys.length), t.insert(s + 1, l), e
            }
        }
        insert(e, t) {
            this.children.splice(e, 0, t), this.keys.splice(e, 0, t.maxKey())
        }
        splitOffRightSide() {
            let t = this.children.length >> 1;
            return new e(this.children.splice(t), this.keys.splice(t))
        }
        takeFromRight(e) {
            this.keys.push(e.keys.shift()), this.children.push(e.children.shift())
        }
        takeFromLeft(e) {
            this.keys.unshift(e.keys.pop()), this.children.unshift(e.children.pop())
        }
        forRange(e, t, n, r, i, a, o) {
            let s = i._compare,
                c = this.keys,
                l = this.children,
                u = this.indexOf(e, 0, s),
                d = u,
                f = Math.min(t === e ? u : this.indexOf(t, 0, s), c.length - 1);
            if (!r)
                for (; d <= f; d++) {
                    let s = l[d].forRange(e, t, n, r, i, a, o);
                    if (typeof s != `number`) return s;
                    a = s
                } else if (d <= f) try {
                    for (; d <= f; d++) {
                        l[d].isShared && (l[d] = l[d].clone());
                        let s = l[d].forRange(e, t, n, r, i, a, o);
                        if (c[d] = l[d].maxKey(), typeof s != `number`) return s;
                        a = s
                    }
                } finally {
                    let e = i._maxNodeSize >> 1;
                    for (u > 0 && u--, d = f; d >= u; d--) l[d].keys.length <= e && (l[d].keys.length === 0 ? (c.splice(d, 1), l.splice(d, 1)) : this.tryMerge(d, i._maxNodeSize));
                    l.length !== 0 && l[0].keys.length === 0 && ru(!1, `emptiness bug`)
                }
            return a
        }
        tryMerge(e, t) {
            let n = this.children;
            return e >= 0 && e + 1 < n.length && n[e].keys.length + n[e + 1].keys.length <= t ? (n[e].isShared && (n[e] = n[e].clone()), n[e].mergeSibling(n[e + 1], t), n.splice(e + 1, 1), this.keys.splice(e + 1, 1), this.keys[e] = n[e].maxKey(), !0) : !1
        }
        mergeSibling(e, t) {
            let n = this.keys.length;
            this.keys.push.apply(this.keys, e.keys);
            let r = e.children;
            if (this.children.push.apply(this.children, r), e.isShared && !this.isShared)
                for (let e of r) e.isShared = !0;
            this.tryMerge(n - 1, t)
        }
    },
    Y = [],
    $l = {
        delete: !0
    },
    eu = () => $l,
    tu = (function() {
        let e = new Zl;
        return e.isShared = !0, e
    })(),
    nu = [];

function ru(e, ...t) {
    throw t.unshift(`B+ tree`), Error(t.join(` `))
}
var iu = class extends Yl {
    constructor(e, t, n, r) {
        super(e, t, n, r), this.supportedOperations = new Set([`eq`, `gt`, `gte`, `lt`, `lte`, `in`]), this.valueMap = new Map, this.indexedKeys = new Set, this.compareFn = Ji;
        let i = r ?.compareFn ?? Ji;
        this.compareFn = (e, t) => i(ea(e), ea(t)), r ?.compareOptions && (this.compareOptions = r.compareOptions), this.orderedEntries = new Xl(this.compareFn)
    }
    initialize(e) {}
    add(e, t) {
        let n;
        try {
            n = this.evaluateIndexExpression(t)
        } catch (t) {
            throw Error(`Failed to evaluate index expression for key ${e}: ${t}`)
        }
        let r = $i(n);
        if (this.valueMap.has(r)) this.valueMap.get(r).add(e);
        else {
            let t = new Set([e]);
            this.valueMap.set(r, t), this.orderedEntries.set(r, void 0)
        }
        this.indexedKeys.add(e), this.updateTimestamp()
    }
    remove(e, t) {
        let n;
        try {
            n = this.evaluateIndexExpression(t)
        } catch (t) {
            console.warn(`Failed to evaluate index expression for key ${e} during removal:`, t);
            return
        }
        let r = $i(n);
        if (this.valueMap.has(r)) {
            let t = this.valueMap.get(r);
            t.delete(e), t.size === 0 && (this.valueMap.delete(r), this.orderedEntries.delete(r))
        }
        this.indexedKeys.delete(e), this.updateTimestamp()
    }
    update(e, t, n) {
        this.remove(e, t), this.add(e, n)
    }
    build(e) {
        this.clear();
        for (let [t, n] of e) this.add(t, n)
    }
    clear() {
        this.orderedEntries.clear(), this.valueMap.clear(), this.indexedKeys.clear(), this.updateTimestamp()
    }
    lookup(e, t) {
        let n = performance.now(),
            r;
        switch (e) {
            case `eq`:
                r = this.equalityLookup(t);
                break;
            case `gt`:
                r = this.rangeQuery({
                    from: t,
                    fromInclusive: !1
                });
                break;
            case `gte`:
                r = this.rangeQuery({
                    from: t,
                    fromInclusive: !0
                });
                break;
            case `lt`:
                r = this.rangeQuery({
                    to: t,
                    toInclusive: !1
                });
                break;
            case `lte`:
                r = this.rangeQuery({
                    to: t,
                    toInclusive: !0
                });
                break;
            case `in`:
                r = this.inArrayLookup(t);
                break;
            default:
                throw Error(`Operation ${e} not supported by BTreeIndex`)
        }
        return this.trackLookup(n), r
    }
    get keyCount() {
        return this.indexedKeys.size
    }
    equalityLookup(e) {
        let t = $i(e);
        return new Set(this.valueMap.get(t) ?? [])
    }
    rangeQuery(e = {}) {
        let {
            from: t,
            to: n,
            fromInclusive: r = !0,
            toInclusive: i = !0
        } = e, a = new Set, o = `from` in e, s = `to` in e, c = o ? $i(t) : this.orderedEntries.minKey(), l = s ? $i(n) : this.orderedEntries.maxKey();
        return this.orderedEntries.forRange(c, l, i, (e, n) => {
            if (!r && this.compareFn(e, t) === 0) return;
            let i = this.valueMap.get(e);
            i && i.forEach(e => a.add(e))
        }), a
    }
    rangeQueryReversed(e = {}) {
        let {
            from: t,
            to: n,
            fromInclusive: r = !0,
            toInclusive: i = !0
        } = e, a = `from` in e, o = `to` in e;
        return this.rangeQuery({
            from: o ? n : this.orderedEntries.maxKey(),
            to: a ? t : this.orderedEntries.minKey(),
            fromInclusive: i,
            toInclusive: r
        })
    }
    takeInternal(e, t, n, r, i = !1) {
        let a = new Set,
            o = [],
            s, c = n;
        for (;
            (s = t(c)) !== void 0 && o.length < e;) {
            c = s[0];
            let t = this.valueMap.get(c);
            if (t && t.size > 0) {
                let n = Array.from(t).sort(Ha);
                i && n.reverse();
                for (let t of n) {
                    if (o.length >= e) break;
                    !a.has(t) && (r ?.(t) ?? !0) && (o.push(t), a.add(t))
                }
            }
        }
        return o
    }
    take(e, t, n) {
        let r = e => this.orderedEntries.nextHigherPair(e),
            i = $i(t);
        return this.takeInternal(e, r, i, n)
    }
    takeFromStart(e, t) {
        return this.takeInternal(e, e => this.orderedEntries.nextHigherPair(e), void 0, t)
    }
    takeReversed(e, t, n) {
        let r = e => this.orderedEntries.nextLowerPair(e),
            i = $i(t);
        return this.takeInternal(e, r, i, n, !0)
    }
    takeReversedFromEnd(e, t) {
        return this.takeInternal(e, e => this.orderedEntries.nextLowerPair(e), void 0, t, !0)
    }
    inArrayLookup(e) {
        let t = new Set;
        for (let n of e) {
            let e = $i(n),
                r = this.valueMap.get(e);
            r && r.forEach(e => t.add(e))
        }
        return t
    }
    get indexedKeysSet() {
        return this.indexedKeys
    }
    get orderedEntriesArray() {
        return this.orderedEntries.keysArray().map(e => [ea(e), this.valueMap.get(e) ?? new Set])
    }
    get orderedEntriesArrayReversed() {
        return this.takeReversedFromEnd(this.orderedEntries.size).map(e => [ea(e), this.valueMap.get(e) ?? new Set])
    }
    get valueMapData() {
        let e = new Map;
        for (let [t, n] of this.valueMap) e.set(ea(t), n);
        return e
    }
};

function au(e) {
    if (e.from.type === `unionAll`) return {
        optimizedQuery: { ...e,
            from: new ir(e.from.queries.map(e => au(e).optimizedQuery))
        },
        sourceWhereClauses: new Map
    };
    let t = ou(e),
        n = e,
        r, i = 0;
    for (; i < 10 && !Li(n, r);) r = n, n = lu(n), i++;
    return {
        optimizedQuery: du(n),
        sourceWhereClauses: t
    }
}

function ou(e) {
    let t = new Map;
    if (!e.where || e.where.length === 0) return t;
    let n = vu(hu(e.where).map(e => _u(e))),
        r = cu(e);
    for (let [i, a] of n.singleSource) su(e, i) && !r.has(i) && t.set(i, a);
    return t
}

function su(e, t) {
    for (let n of wu(e.from))
        if (n.alias === t) return n.type === `collectionRef`;
    if (e.join) {
        for (let n of e.join)
            if (n.from.alias === t) return n.from.type === `collectionRef`
    }
    return !1
}

function cu(e) {
    let t = new Set;
    if (e.join) {
        let n = new Set(wu(e.from).map(e => e.alias));
        for (let r of e.join) {
            let e = r.from.alias;
            if ((r.type === `left` || r.type === `full`) && t.add(e), r.type === `right` || r.type === `full`)
                for (let e of n) t.add(e);
            n.add(e)
        }
    }
    return t
}

function lu(e) {
    return uu({ ...e,
        from: Cu(e.from),
        join: e.join ?.map(e => ({ ...e,
            from: e.from.type === `queryRef` ? new nr(lu(e.from.query), e.from.alias) : e.from
        }))
    })
}

function uu(e) {
    if (!e.where || e.where.length === 0 || e.from.type === `unionFrom`) return e;
    if (!e.join || e.join.length === 0) {
        if (e.where.length > 1) {
            let t = Ru(hu(e.where));
            return { ...e,
                where: [t]
            }
        }
        return e
    }
    let t = yu(e, vu(hu(e.where.filter(e => !ur(e))).map(e => _u(e)))),
        n = e.where.filter(e => ur(e));
    return n.length > 0 && (t.where = [...t.where || [], ...n]), t
}

function du(e) {
    return { ...e,
        from: fu(e.from),
        join: e.join ?.map(e => ({ ...e,
            from: pu(e.from)
        }))
    }
}

function fu(e) {
    if (e.type === `unionFrom`) return new rr(e.sources.map(e => fu(e)));
    if (e.type === `unionAll`) return new ir(e.queries.map(e => du(e)));
    if (e.type === `collectionRef`) return e;
    let t = du(e.query);
    if (mu(t)) {
        let n = fu(t.from);
        if (n.type === `collectionRef`) return new tr(n.collection, e.alias);
        if (n.type === `queryRef`) return new nr(n.query, e.alias)
    }
    return new nr(t, e.alias)
}

function pu(e) {
    return fu(e)
}

function mu(e) {
    return (!e.where || e.where.length === 0) && !e.select && (!e.groupBy || e.groupBy.length === 0) && (!e.having || e.having.length === 0) && (!e.orderBy || e.orderBy.length === 0) && (!e.join || e.join.length === 0) && e.limit === void 0 && e.offset === void 0 && !e.fnSelect && (!e.fnWhere || e.fnWhere.length === 0) && (!e.fnHaving || e.fnHaving.length === 0)
}

function hu(e) {
    let t = [];
    for (let n of e) {
        let e = cr(n);
        t.push(...gu(e))
    }
    return t
}

function gu(e) {
    if (e.type === `func` && e.name === `and`) {
        let t = [];
        for (let n of e.args) t.push(...gu(n));
        return t
    } else return [e]
}

function _u(e) {
    let t = new Set,
        n = !1;

    function r(e) {
        switch (e.type) {
            case `ref`:
                if (e.path && e.path.length > 0) {
                    let r = e.path[0];
                    r && (t.add(r), e.path.length === 1 && (n = !0))
                }
                break;
            case `func`:
                e.args && e.args.forEach(r);
                break;
            case `val`:
                break;
            case `agg`:
                e.args && e.args.forEach(r);
                break
        }
    }
    return r(e), {
        expression: e,
        touchedSources: t,
        hasNamespaceOnlyRef: n
    }
}

function vu(e) {
    let t = new Map,
        n = [];
    for (let r of e)
        if (r.touchedSources.size === 1 && !r.hasNamespaceOnlyRef) {
            let e = Array.from(r.touchedSources)[0];
            t.has(e) || t.set(e, []), t.get(e).push(r.expression)
        } else(r.touchedSources.size > 1 || r.hasNamespaceOnlyRef) && n.push(r.expression);
    let r = new Map;
    for (let [e, n] of t) r.set(e, Ru(n));
    return {
        singleSource: r,
        multiSource: n.length > 0 ? Ru(n) : void 0
    }
}

function yu(e, t) {
    let n = new Set,
        r = cu(e),
        i = new Map;
    for (let [e, n] of t.singleSource) r.has(e) || i.set(e, n);
    let a = Eu(e.from, i, n),
        o = e.join ? e.join.map(e => ({ ...e,
            from: Du(e.from, i, n)
        })) : void 0,
        s = [];
    t.multiSource && s.push(t.multiSource);
    let c = r.size > 0;
    for (let [e, r] of t.singleSource) n.has(e) ? c && s.push(dr(r)) : s.push(r);
    let l = s.length > 1 ? [Ru(s.flatMap(e => gu(cr(e))))] : s;
    return {
        select: e.select,
        groupBy: e.groupBy ? [...e.groupBy] : void 0,
        having: e.having ? [...e.having] : void 0,
        orderBy: e.orderBy ? [...e.orderBy] : void 0,
        limit: e.limit,
        offset: e.offset,
        distinct: e.distinct,
        fnSelect: e.fnSelect,
        fnWhere: e.fnWhere ? [...e.fnWhere] : void 0,
        fnHaving: e.fnHaving ? [...e.fnHaving] : void 0,
        from: a,
        join: o,
        where: l.length > 0 ? l : []
    }
}

function bu(e) {
    return {
        from: xu(e.from),
        select: e.select,
        join: e.join ? e.join.map(e => ({
            type: e.type,
            left: e.left,
            right: e.right,
            from: Su(e.from)
        })) : void 0,
        where: e.where ? [...e.where] : void 0,
        groupBy: e.groupBy ? [...e.groupBy] : void 0,
        having: e.having ? [...e.having] : void 0,
        orderBy: e.orderBy ? [...e.orderBy] : void 0,
        limit: e.limit,
        offset: e.offset,
        fnSelect: e.fnSelect,
        fnWhere: e.fnWhere ? [...e.fnWhere] : void 0,
        fnHaving: e.fnHaving ? [...e.fnHaving] : void 0
    }
}

function xu(e) {
    return e.type === `collectionRef` ? new tr(e.collection, e.alias) : e.type === `queryRef` ? new nr(bu(e.query), e.alias) : e.type === `unionAll` ? new ir(e.queries.map(e => bu(e))) : new rr(e.sources.map(e => xu(e)))
}

function Su(e) {
    return xu(e)
}

function Cu(e) {
    return e.type === `queryRef` ? new nr(lu(e.query), e.alias) : e.type === `unionFrom` ? new rr(e.sources.map(e => Cu(e))) : e.type === `unionAll` ? new ir(e.queries.map(e => lu(e))) : e
}

function wu(e) {
    return e.type === `unionFrom` ? e.sources : e.type === `unionAll` ? [] : [e]
}

function Tu(e) {
    return wu(e.from)[0] ?.alias
}

function Eu(e, t, n) {
    if (e.type === `unionFrom`) return new rr(e.sources.map(e => Du(e, t, n)));
    if (e.type === `unionAll`) return new ir(e.queries.map(e => bu(e)));
    let r = t.get(e.alias);
    if (!r) return e.type === `collectionRef` ? new tr(e.collection, e.alias) : new nr(bu(e.query), e.alias);
    if (e.type === `collectionRef`) {
        let t = {
            from: new tr(e.collection, e.alias),
            where: [r]
        };
        return n.add(e.alias), new nr(t, e.alias)
    }
    if (!Nu(e.query, r, e.alias) || Lu(e.query, r, e.alias)) return new nr(bu(e.query), e.alias);
    let i = e.query.where || [],
        a = { ...bu(e.query),
            where: [...i, r]
        };
    return n.add(e.alias), new nr(a, e.alias)
}

function Du(e, t, n) {
    return Eu(e, t, n)
}

function Ou(e, t, n) {
    return e.select ? Pu(e.select) || Iu(e.select, t, n) : !1
}

function ku(e) {
    return e.groupBy && e.groupBy.length > 0
}

function Au(e) {
    return e.having && e.having.length > 0
}

function ju(e) {
    return e.orderBy && e.orderBy.length > 0 && (e.limit !== void 0 || e.offset !== void 0)
}

function Mu(e) {
    return e.fnSelect || e.fnWhere && e.fnWhere.length > 0 || e.fnHaving && e.fnHaving.length > 0
}

function Nu(e, t, n) {
    return !(Ou(e, t, n) || ku(e) || Au(e) || ju(e) || Mu(e))
}

function Pu(e) {
    for (let t of Object.values(e))
        if (typeof t == `object`) {
            let e = t;
            if (e.type === `agg` || !(`type` in e) && Pu(e)) return !0
        }
    return !1
}

function Fu(e) {
    let t = [];
    if (typeof e != `object` || !e) return t;
    switch (e.type) {
        case `ref`:
            t.push(e);
            break;
        case `func`:
        case `agg`:
            for (let n of e.args ?? []) t.push(...Fu(n));
            break
    }
    return t
}

function Iu(e, t, n) {
    let r = new Set;
    for (let [t, n] of Object.entries(e)) t.startsWith(`__SPREAD_SENTINEL__`) || n instanceof z || r.add(t);
    let i = Fu(t);
    for (let e of i) {
        let t = e.path;
        if (!Array.isArray(t) || t.length < 2) continue;
        let i = t[0],
            a = t[1];
        if (i === n && r.has(a)) return !0
    }
    return !1
}

function Lu(e, t, n) {
    let r = Fu(t);
    if (r.every(e => e.path[0] !== n)) return !1;
    if (e.fnSelect) return !0;
    let i = e.select;
    if (!i) return !1;
    for (let t of r) {
        let r = t.path;
        if (r.length < 2 || r[0] !== n) continue;
        let a = i[r[1]];
        if (!a) continue;
        if (!(a instanceof z) || a.path.length < 2) return !0;
        let [o, s] = a.path, c = Tu(e);
        if (o !== n && o !== c || s !== r[1]) return !0
    }
    return !1
}

function Ru(e) {
    if (e.length === 0) throw new Ni;
    return e.length === 1 ? e[0] : new V(`and`, e)
}

function zu(e, t, n, r, i, a) {
    if (t.type === `unionFrom`) return Hu(e, r);
    if (t.type === `queryRef` && Bu(t.query.from)) return Gu(Vu(t.query, n, r));
    if (!i) return [];
    let o = Ku(r);
    if (!o) return [];
    let s = pr(e, o, i);
    return s ? [{
        alias: a[n] || n,
        collection: s.collection,
        path: s.path
    }] : []
}

function Bu(e) {
    return e.type === `unionFrom` ? !0 : e.type === `queryRef` ? Bu(e.query.from) : e.type === `unionAll` ? e.queries.some(e => Bu(e.from)) : !1
}

function Vu(e, t, n) {
    if (!n || typeof n != `object` || !(`type` in n)) return [];
    let r = n;
    if (r.type === `func` && r.name === `coalesce`) return Gu(r.args.flatMap(n => Vu(e, t, n)));
    let i = Ku(r);
    return !i || i.path[0] !== t ? [] : Uu(e, new z(i.path.slice(1)))
}

function Hu(e, t) {
    if (!t || typeof t != `object` || !(`type` in t)) return [];
    let n = t;
    return n.type === `ref` ? Uu(e, n) : n.type === `func` && n.name === `coalesce` ? Gu(n.args.flatMap(t => Hu(e, t))) : []
}

function Uu(e, t) {
    if (t.path.length === 0) return [];
    if (t.path.length === 1) {
        let n = t.path[0],
            r = e.select ?.[n];
        return r ? Hu(e, r) : []
    }
    let [n, ...r] = t.path, i = Wu(e, n);
    return i ? i.type === `collectionRef` ? [{
        alias: i.alias,
        collection: i.collection,
        path: r
    }] : i.query.limit || i.query.offset ? [] : Vu(i.query, i.alias, t) : []
}

function Wu(e, t) {
    if (e.join) {
        for (let n of e.join)
            if (n.from.alias === t) return n.from
    }
    let n = e.from;
    return (n.type === `unionFrom` ? n.sources : n.type === `unionAll` ? [] : [n]).find(e => e.alias === t)
}

function Gu(e) {
    let t = new Set,
        n = [];
    for (let r of e) {
        let e = `${r.alias}:${r.path.join(`.`)}`;
        t.has(e) || (t.add(e), n.push(r))
    }
    return n
}

function Ku(e) {
    if (e instanceof z) return e;
    if (e && typeof e == `object` && `type` in e && e.type === `ref` && Array.isArray(e.path)) return new z(e.path)
}

function qu(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v) {
    let y = e;
    for (let e of t) y = Ju(y, e, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v);
    return y
}

function Ju(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v) {
    let y = t.from.type === `collectionRef`,
        {
            alias: b,
            input: x,
            collectionId: S
        } = Zu(t.from, a, c, l, u, d, f, p, o, s, h, g, _, v);
    n[b] = x, y && (g[b] = S);
    let C = c[r],
        w = c[S];
    if (!C) throw new _i(r);
    if (!w) throw new _i(S);
    let {
        activeSource: T,
        lazySource: E
    } = ed(t.type, C, w), D = Object.keys(n), {
        mainExpr: ee,
        joinedExpr: O
    } = Yu(t.left, t.right, D, b, m.from.type === `unionAll`), te = W(ee), ne = W(O), re = e.pipe(K(([e, t]) => [Qi(te(t)), [e, t]])), k = x.pipe(K(([e, t]) => {
        let n = {
            [b]: t
        };
        return [Qi(ne(n)), [e, n]]
    }));
    if (![`inner`, `left`, `right`, `full`].includes(t.type)) throw new yi(t.type);
    if (T) {
        let e = T === `main` ? t.from : m.from,
            n = e.type === `queryRef` && (e.query.limit || e.query.offset),
            r = e.type === `unionAll`,
            a = T === `main` ? O : ee,
            o = T === `main` ? b : i,
            s = r ? [] : zu(m, e, o, a, E, _);
        if (!n && s.length > 0) {
            for (let e of s) d.add(e.alias);
            let e = T === `main` ? re : k;
            for (let e of s) {
                let t = e.path[0];
                t && Ma(t, e.path, e.collection)
            }
            let t = e.pipe(Ts(e => {
                let t = [...new Set(e.getInner().map(([
                    [e]
                ]) => e).filter(e => e != null))];
                if (t.length !== 0)
                    for (let e of s) {
                        let n = l[e.alias];
                        if (!n) throw new Pi(e.alias, o, e.collection.id, Object.keys(l));
                        if (n.hasLoadedInitialState()) continue;
                        let r = new z(e.path);
                        if (!n.requestSnapshot({
                                where: Nc(r, t),
                                optimizedOnly: !0
                            })) {
                            let t = e.collection.id,
                                r = e.path.join(`.`);
                            console.warn(`[TanStack DB]${t?` [${t}]`:``} Join requires an index on "${r}" for efficient loading. Falling back to loading all data. Consider creating an index on the collection with collection.createIndex((row) => row.${r}) or enable auto-indexing with autoIndex: 'eager' and a defaultIndexType.`), n.requestSnapshot()
                        }
                    }
            }));
            T === `main` ? re = t : k = t
        }
    }
    return re.pipe(bs(k, t.type), $u(t.type))
}

function Yu(e, t, n, r, i = !1) {
    let a = n.filter(e => e !== r),
        o = Xu(e),
        s = Xu(t),
        c = o.has(r),
        l = s.has(r),
        u = [...o].filter(e => a.includes(e) || i && e !== r),
        d = [...s].filter(e => a.includes(e) || i && e !== r);
    if (u.length > 0 && !c && l && d.length === 0) return {
        mainExpr: e,
        joinedExpr: t
    };
    if (c && u.length === 0 && d.length > 0 && !l) return {
        mainExpr: t,
        joinedExpr: e
    };
    throw o.size === 0 || s.size === 0 ? new xi : o.size === 1 && s.size === 1 && [...o][0] === [...s][0] ? new bi([...o][0]) : u.length === 0 ? new Si([...o][0]) : l ? new wi : new Ci(r)
}

function Xu(e) {
    switch (e.type) {
        case `ref`:
            return new Set(e.path[0] ? [e.path[0]] : []);
        case `func`:
            {
                let t = new Set;
                for (let n of e.args)
                    for (let e of Xu(n)) t.add(e);
                return t
            }
        default:
            return new Set
    }
}

function Zu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
    switch (e.type) {
        case `collectionRef`:
            {
                let n = t[e.alias];
                if (!n) throw new di(e.alias, e.collection.id, Object.keys(t));
                return d[e.alias] = e.collection.id,
                {
                    alias: e.alias,
                    input: n,
                    collectionId: e.collection.id
                }
            }
        case `queryRef`:
            {
                let m = u(l.get(e.query) || e.query, t, n, r, i, a, o, s, c, l);Object.assign(d, m.aliasToCollectionId),
                Object.assign(f, m.aliasRemapping);
                let h = l.has(e.query),
                    g = Qu(e.query);
                if (!(!h && g !== void 0 && e.alias === g))
                    for (let [e, t] of m.sourceWhereClauses) p.set(e, t);
                let _ = Object.keys(m.aliasToCollectionId).find(e => m.aliasToCollectionId[e] === m.collectionId);_ && _ !== e.alias && (f[e.alias] = _);
                let v = m.pipeline.pipe(K(e => {
                    let [t, [n, r]] = e;
                    return [t, n]
                }));
                return {
                    alias: e.alias,
                    input: v,
                    collectionId: m.collectionId
                }
            }
        default:
            throw new Ti(e.type)
    }
}

function Qu(e) {
    if (e.from.type === `unionFrom`) return e.from.sources[0] ?.alias;
    if (e.from.type !== `unionAll`) return e.from.alias
}

function $u(e) {
    return function(t) {
        return t.pipe($o(t => {
            let [n, [r, i]] = t, a = r ?.[1], o = i ?.[1];
            return e === `inner` ? !!(a && o) : e === `left` ? !!a : e === `right` ? !!o : !0
        }), K(e => {
            let [t, [n, r]] = e, i = n ?.[0], a = n ?.[1], o = r ?.[0], s = r ?.[1], c = {};
            return a && Object.assign(c, a), s && Object.assign(c, s), [`[${i},${o}]`, c]
        }))
    }
}

function ed(e, t, n) {
    switch (e) {
        case `left`:
            return {
                activeSource: `main`,
                lazySource: n
            };
        case `right`:
            return {
                activeSource: `joined`,
                lazySource: t
            };
        case `inner`:
            return t.size < n.size ? {
                activeSource: `main`,
                lazySource: n
            } : {
                activeSource: `joined`,
                lazySource: t
            };
        default:
            return {
                activeSource: void 0,
                lazySource: void 0
            }
    }
}

function td(e) {
    return e instanceof B ? e.value : e
}

function nd(e, t, n) {
    let r = e.source(t);
    if (r && typeof r == `object`) {
        let t = n,
            i = e.targetPath;
        if (i.length === 0)
            for (let [e, t] of Object.entries(r)) n[e] = td(t);
        else
            for (let e = 0; e < i.length; e++) {
                let n = i[e];
                if (e === i.length - 1) {
                    let e = t[n] ??= {};
                    if (typeof e == `object`)
                        for (let [t, n] of Object.entries(r)) e[t] = td(n)
                } else {
                    let e = t[n];
                    (typeof e != `object` || !e) && (t[n] = {}), t = t[n]
                }
            }
    }
}

function rd(e, t, n) {
    let r = e.alias.split(`.`);
    if (r.length === 1) n[e.alias] = e.compiled(t);
    else {
        let i = n;
        for (let e = 0; e < r.length - 1; e++) {
            let t = r[e],
                n = i[t];
            (typeof n != `object` || !n) && (i[t] = {}), i = i[t]
        }
        i[r[r.length - 1]] = td(e.compiled(t))
    }
}

function id([e, t], n) {
    let r = {};
    for (let e of n) e.kind === `merge` ? nd(e, t, r) : rd(e, t, r);
    return [e, { ...t,
        $selected: r
    }]
}

function ad(e, t, n) {
    let r = [];
    return dd([], t, r), e.pipe(K(e => id(e, r)))
}

function od(e) {
    let t = [];
    return dd([], e, t), e => {
        let n = {};
        for (let r of t) r.kind === `merge` ? nd(r, e, n) : rd(r, e, n);
        return n
    }
}

function sd(e) {
    return e == null ? () => e : fd(e) ? nc(e) ? () => null : cd(e) : e instanceof B ? () => e.value : e.type === `includesSubquery` ? () => null : ud(e) ? od(e) : ld(e) || nc(e) ? () => null : sr(e) ? W(e) : () => e
}

function cd(e) {
    let t = e.branches.map(e => ({
            condition: W(e.condition),
            value: sd(e.value)
        })),
        n = e.defaultValue === void 0 ? void 0 : sd(e.defaultValue);
    return e => {
        for (let n of t)
            if (ua(n.condition(e))) return n.value(e);
        return n === void 0 ? null : n(e)
    }
}

function ld(e) {
    return e.type === `agg`
}

function ud(e) {
    return e && typeof e == `object` && !sr(e)
}

function dd(e, t, n) {
    for (let [r, i] of Object.entries(t)) {
        if (r.startsWith(`__SPREAD_SENTINEL__`)) {
            let t = r.slice(19),
                a = t.lastIndexOf(`__`),
                o = a >= 0 ? t.slice(0, a) : t,
                s = i && typeof i == `object` && `type` in i && i.type === `ref`;
            if (o.includes(`.`) || s) {
                let t = [...e],
                    r = W(s ? i : new z(o.split(`.`)));
                n.push({
                    kind: `merge`,
                    targetPath: t,
                    source: r
                })
            } else {
                let t = o,
                    r = [...e];
                n.push({
                    kind: `merge`,
                    targetPath: r,
                    source: e => e[t]
                })
            }
            continue
        }
        let t = i;
        if (fd(t)) {
            if (nc(t)) {
                n.push({
                    kind: `field`,
                    alias: [...e, r].join(`.`),
                    compiled: () => null
                });
                continue
            }
            n.push({
                kind: `field`,
                alias: [...e, r].join(`.`),
                compiled: cd(t)
            });
            continue
        }
        if (t && t.type === `includesSubquery`) {
            n.push({
                kind: `field`,
                alias: [...e, r].join(`.`),
                compiled: () => null
            });
            continue
        }
        if (ud(t)) {
            dd([...e, r], t, n);
            continue
        }
        if (ld(t) || nc(t)) n.push({
            kind: `field`,
            alias: [...e, r].join(`.`),
            compiled: () => null
        });
        else {
            if (t === void 0 || !sr(t)) {
                n.push({
                    kind: `field`,
                    alias: [...e, r].join(`.`),
                    compiled: () => t
                });
                continue
            }
            if (t instanceof B) {
                let i = t.value;
                n.push({
                    kind: `field`,
                    alias: [...e, r].join(`.`),
                    compiled: () => i
                })
            } else n.push({
                kind: `field`,
                alias: [...e, r].join(`.`),
                compiled: W(t)
            })
        }
    }
}

function fd(e) {
    return e instanceof H || typeof e == `object` && !!e && e.type === `conditionalSelect` && Array.isArray(e.branches)
}
var pd = Symbol(`includesRouting`),
    md = Symbol(`fnSelectState`),
    hd = Symbol(`skipInclude`);

function gd(e, t, n, r, i, a, o, s, c = new WeakMap, l = new WeakMap, u, d) {
    let f = c.get(e);
    if (f) return f;
    vd(e);
    let {
        optimizedQuery: p,
        sourceWhereClauses: m
    } = au(e), h = p;
    l.set(h, e), Dd(h, e, l);
    let g = { ...t
        },
        _ = {},
        v = {},
        y = {},
        {
            alias: b,
            collectionId: x,
            pipeline: S,
            sources: C,
            sourceIncludes: w,
            directIncludes: T,
            isUnionFrom: E
        } = yd(h.from, g, n, r, i, a, o, s, c, l, _, v, m);
    Object.assign(y, C);
    let D = S;
    if (!E && u && d) {
        let e = y[b],
            t = e,
            n = d.path.slice(1);
        t = e.pipe(K(([e, t]) => [qd(t, n), [e, t]])).pipe(bs(u, `inner`)).pipe($o(([e, [t]]) => t != null), K(([e, [t, n]]) => {
            let [r, i] = t, a = { ...i,
                __correlationKey: e
            };
            return n != null && (a.__parentContext = n), [n == null ? r : `${String(r)}::${JSON.stringify(n)}`, a]
        })), y[b] = t, D = xd(t, b)
    }
    if (h.join && h.join.length > 0 && (D = qu(D, h.join, y, x, b, g, c, l, n, r, i, a, o, s, e, gd, _, v, m)), h.where && h.where.length > 0)
        for (let e of h.where) {
            let t = W(cr(e));
            D = D.pipe($o(([e, n]) => ia(t(n))))
        }
    if (h.fnWhere && h.fnWhere.length > 0)
        for (let e of h.fnWhere) D = D.pipe($o(([t, n]) => ia(e(n))));
    let ee = h.select ? [] : [...T],
        O = [];
    for (let {
            sourceAlias: e,
            include: t
        } of w) {
        let n = h.select == null ? h.fnSelect ? [] : [{
            path: [e, ...t.resultPath],
            guards: []
        }] : jd(h.select, e, t.resultPath);
        if (n.length !== 0)
            for (let {
                    path: r,
                    guards: i
                } of n) {
                let n = Bd(`${e}.${r.join(`.`)}`, O),
                    a = i.map(e => ({
                        condition: W(e.condition),
                        expected: e.expected
                    }));
                ee.push({ ...t,
                    fieldName: n,
                    resultPath: r
                }), O.push({
                    fieldName: n,
                    getRouting: n => Jd(a, n) ? n[e] ?.[pd] ?.[t.fieldName] ?? {
                        correlationKey: null,
                        parentContext: null
                    } : {
                        correlationKey: null,
                        parentContext: null
                    }
                })
            }
    }
    if (h.select && T.length > 0)
        for (let e of T) {
            let t = Md(h.select, e.resultPath);
            for (let {
                    path: n,
                    guards: r
                } of t) {
                let t = Bd(n.join(`.`), O),
                    i = r.map(e => ({
                        condition: W(e.condition),
                        expected: e.expected
                    }));
                ee.push({ ...e,
                    fieldName: t,
                    resultPath: n
                }), O.push({
                    fieldName: t,
                    getRouting: t => Jd(i, t) ? t[pd] ?.[e.fieldName] ?? {
                        correlationKey: null,
                        parentContext: null
                    } : {
                        correlationKey: null,
                        parentContext: null
                    }
                })
            }
        }
    if (h.select) {
        let e = Id(h.select);
        e.length > 0 && (h = { ...h,
            select: { ...h.select
            }
        });
        for (let {
                key: t,
                path: u,
                subquery: d,
                guards: f
            } of e) {
            let e = Bd(t, O),
                p = W(d.correlationField),
                y = f.map(e => ({
                    condition: W(e.condition),
                    expected: e.expected
                })),
                b;
            if (d.parentProjection && d.parentProjection.length > 0) {
                let e = d.parentProjection.map(e => ({
                    alias: e.path[0],
                    field: e.path.slice(1),
                    compiled: W(e)
                }));
                b = D.pipe(K(([t, n]) => {
                    if (!Jd(y, n)) return [hd, null];
                    let r = {};
                    for (let t of e) {
                        r[t.alias] || (r[t.alias] = {});
                        let e = t.compiled(n),
                            i = r[t.alias];
                        for (let e = 0; e < t.field.length - 1; e++) i[t.field[e]] || (i[t.field[e]] = {}), i = i[t.field[e]];
                        i[t.field[t.field.length - 1]] = e
                    }
                    return [p(n), r]
                }))
            } else b = D.pipe(K(([e, t]) => Jd(y, t) ? [p(t), null] : [hd, null]));
            b = b.pipe($o(([e]) => e !== hd)), b = b.pipe(Yo(e => e.map(([e, t]) => [e, t > 0 ? 1 : 0])));
            let x = d.childCorrelationField.path[0],
                S = d.query.from.type === `collectionRef` ? d.query.from.collection : void 0,
                C = zu(d.query, d.query.from, x, d.childCorrelationField, S, v);
            if (C.length > 0) {
                for (let e of C) a.add(e.alias);
                for (let e of C) {
                    let t = e.path[0];
                    t && Ma(t, e.path, e.collection)
                }
                b = b.pipe(Ts(e => {
                    let t = [...new Set(e.getInner().map(([
                        [e]
                    ]) => e).filter(e => e != null))];
                    if (t.length !== 0)
                        for (let e of C) {
                            let n = r[e.alias];
                            if (!n || n.hasLoadedInitialState()) continue;
                            let i = new z(e.path);
                            n.requestSnapshot({
                                where: Nc(i, t)
                            })
                        }
                }))
            }
            let w = gd(d.parentFilters && d.parentFilters.length > 0 ? { ...d.query,
                where: [...d.query.where || [], ...d.parentFilters]
            } : d.query, g, n, r, i, a, o, s, c, l, b, d.childCorrelationField);
            Object.assign(_, w.aliasToCollectionId), Object.assign(v, w.aliasRemapping);
            for (let [e, t] of w.sourceWhereClauses) m.set(e, t);
            if (ee.push({
                    pipeline: w.pipeline,
                    fieldName: e,
                    resultPath: u,
                    correlationField: d.correlationField,
                    childCorrelationField: d.childCorrelationField,
                    hasOrderBy: !!(d.query.orderBy && d.query.orderBy.length > 0),
                    childCompilationResult: w,
                    parentProjection: d.parentProjection,
                    materialization: d.materialization,
                    scalarField: d.scalarField
                }), d.parentProjection && d.parentProjection.length > 0) {
                let t = d.parentProjection.map(e => ({
                        alias: e.path[0],
                        field: e.path.slice(1),
                        compiled: W(e)
                    })),
                    n = p,
                    r = y;
                O.push({
                    fieldName: e,
                    getRouting: e => {
                        if (!Jd(r, e)) return {
                            correlationKey: null,
                            parentContext: null
                        };
                        let i = {};
                        for (let n of t) {
                            i[n.alias] || (i[n.alias] = {});
                            let t = n.compiled(e),
                                r = i[n.alias];
                            for (let e = 0; e < n.field.length - 1; e++) r[n.field[e]] || (r[n.field[e]] = {}), r = r[n.field[e]];
                            r[n.field[n.field.length - 1]] = t
                        }
                        return {
                            correlationKey: n(e),
                            parentContext: i
                        }
                    }
                })
            } else {
                let t = y;
                O.push({
                    fieldName: e,
                    getRouting: e => Jd(t, e) ? {
                        correlationKey: p(e),
                        parentContext: null
                    } : {
                        correlationKey: null,
                        parentContext: null
                    }
                })
            }
            h = { ...h,
                select: Ud(h.select, u)
            }
        }
    }
    if (h.distinct && !h.fnSelect && !h.select && h.from.type !== `unionAll`) throw new oi;
    if (h.fnSelect && h.groupBy && h.groupBy.length > 0) throw new si;
    D = h.fnSelect ? D.pipe(K(([e, t]) => {
        let n = h.fnSelect(t);
        if (n && typeof n == `object`) {
            let e = t[pd];
            e && (n[pd] = e), T.length > 0 && Object.defineProperty(n, md, {
                value: {
                    sourceRow: t,
                    fnSelect: h.fnSelect
                },
                enumerable: !0,
                configurable: !0
            })
        }
        return [e, { ...t,
            $selected: n
        }]
    })) : h.select ? ad(D, h.select) : D.pipe(K(([e, t]) => {
        let n = !E && !h.join && !h.groupBy ? t[b] : t;
        return [e, { ...t,
            $selected: n
        }]
    })), O.length > 0 && (D = D.pipe(K(([e, t]) => {
        let n = {};
        for (let {
                fieldName: e,
                getRouting: r
            } of O) n[e] = r(t);
        return t.$selected[pd] = n, [e, t]
    })));
    let te = u ? b : void 0;
    if (h.groupBy && h.groupBy.length > 0 ? D = Zs(D, h.groupBy, h.having, h.select, h.fnHaving, x, te) : h.select && Object.values(h.select).some(e => e.type === `agg` || nc(e)) && (D = Zs(D, [], h.having, h.select, h.fnHaving, x, te)), h.having && (!h.groupBy || h.groupBy.length === 0) && !(h.select && Object.values(h.select).some(e => e.type === `agg`))) throw new li;
    if (h.fnHaving && h.fnHaving.length > 0 && (!h.groupBy || h.groupBy.length === 0))
        for (let e of h.fnHaving) D = D.pipe($o(([t, n]) => e(n)));
    if (h.distinct && (D = D.pipe(Zo(([e, t]) => t.$selected))), h.orderBy && h.orderBy.length > 0) {
        let t = u && (h.limit !== void 0 || h.offset !== void 0) ? (e, t) => {
                let n = t ?.[b] ?.__correlationKey,
                    r = t ?.__parentContext;
                return r == null ? n : JSON.stringify([n, r])
            } : void 0,
            r = {
                collectionId: x,
                pipeline: fc(e, D, h.orderBy, h.select || {}, n[x], o, s, h.limit, h.offset, t).pipe(K(([e, [t, n]]) => {
                    let r = t.$selected,
                        i = Ed(Td(r), t);
                    if (u) {
                        let r = t[b] ?.__correlationKey,
                            a = t.__parentContext ?? null;
                        return delete i.__correlationKey, delete i.__parentContext, [e, [i, n, r, a]]
                    }
                    return [e, [i, n]]
                })),
                sourceWhereClauses: m,
                aliasToCollectionId: _,
                aliasRemapping: v,
                includes: ee.length > 0 ? ee : void 0
            };
        return c.set(e, r), r
    } else if (h.limit !== void 0 || h.offset !== void 0) throw new ui;
    let ne = {
        collectionId: x,
        pipeline: D.pipe(K(([e, t]) => {
            let n = t.$selected,
                r = Ed(Td(n), t);
            if (u) {
                let n = t[b] ?.__correlationKey,
                    i = t.__parentContext ?? null;
                return delete r.__correlationKey, delete r.__parentContext, [e, [r, void 0, n, i]]
            }
            return [e, [r, void 0]]
        })),
        sourceWhereClauses: m,
        aliasToCollectionId: _,
        aliasRemapping: v,
        includes: ee.length > 0 ? ee : void 0
    };
    return c.set(e, ne), ne
}

function _d(e) {
    let t = new Set;
    for (let n of Od(e.from)) n.type === `collectionRef` && t.add(n.alias);
    if (e.join)
        for (let n of e.join) n.from.type === `collectionRef` && t.add(n.from.alias);
    return t
}

function vd(e, t = new Set) {
    let n = _d(e);
    for (let e of n)
        if (t.has(e)) throw new fi(e, Array.from(t));
    let r = new Set([...t, ...n]);
    if (e.from.type === `unionAll`)
        for (let t of e.from.queries) vd(t, r);
    else
        for (let t of Od(e.from)) t.type === `queryRef` && vd(t.query, r);
    if (e.join)
        for (let t of e.join) t.from.type === `queryRef` && vd(t.from.query, r)
}

function yd(e, t, n, r, i, a, o, s, c, l, u, d, f) {
    if (e.type === `unionAll`) return bd(e, t, n, r, i, a, o, s, c, l, u, d, f);
    if (e.type !== `unionFrom`) {
        let {
            alias: p,
            input: m,
            collectionId: h,
            sourceIncludes: g
        } = Cd(e, t, n, r, i, a, o, s, c, l, u, d, f);
        return {
            alias: p,
            pipeline: xd(m, p),
            collectionId: h,
            sources: {
                [p]: m
            },
            sourceIncludes: g,
            directIncludes: [],
            isUnionFrom: !1
        }
    }
    if (e.sources.length === 0) throw new pi(`empty unionFrom`);
    let p = {},
        m = [],
        h, g = ``,
        _ = ``;
    for (let v of e.sources) {
        let {
            alias: e,
            input: y,
            collectionId: b,
            sourceIncludes: x
        } = Cd(v, t, n, r, i, a, o, s, c, l, u, d, f);
        g || (g = e, _ = b), p[e] = y, m.push(...x);
        let S = xd(y, e).pipe(K(([t, n]) => [`${e}:${Sd(t)}`, n]));
        h = h ? h.pipe(zo(S)) : S
    }
    return {
        alias: g,
        pipeline: h,
        collectionId: _,
        sources: p,
        sourceIncludes: m,
        directIncludes: [],
        isUnionFrom: !0
    }
}

function bd(e, t, n, r, i, a, o, s, c, l, u, d, f) {
    if (e.queries.length === 0) throw new pi(`empty unionAll`);
    let p = {},
        m = [],
        h = [],
        g, _ = ``,
        v = new Set;
    for (let m = 0; m < e.queries.length; m++) {
        let y = e.queries[m];
        for (let e of kd(y)) {
            if (v.has(e.alias)) throw Error(`Duplicate source alias "${e.alias}" in unionAll query branches. Use distinct aliases in each branch before passing them to unionAll().`);
            v.add(e.alias)
        }
        let b = gd(y, t, n, r, i, a, o, s, c, l);
        _ ||= b.collectionId, Object.assign(u, b.aliasToCollectionId), Object.assign(d, b.aliasRemapping), h.push(...b.includes ?? []), Object.assign(p, t);
        for (let [e, t] of b.sourceWhereClauses) f.set(e, t);
        let x = b.pipeline.pipe(K(([e, [t]]) => [`${m}:${Sd(e)}`, t]));
        g = g ? g.pipe(zo(x)) : x
    }
    return {
        alias: ``,
        pipeline: g,
        collectionId: _,
        sources: p,
        sourceIncludes: m,
        directIncludes: h,
        isUnionFrom: !0
    }
}

function xd(e, t) {
    return e.pipe(K(([e, n]) => {
        let {
            __parentContext: r,
            ...i
        } = n, a = {
            [t]: i
        };
        return r && (Object.assign(a, r), a.__parentContext = r), [e, a]
    }))
}

function Sd(e) {
    return typeof e == `string` ? `string:${e}` : typeof e == `number` ? `number:${String(e)}` : typeof e == `bigint` ? `bigint:${String(e)}` : `${typeof e}:${JSON.stringify(e)}`
}

function Cd(e, t, n, r, i, a, o, s, c, l, u, d, f) {
    switch (e.type) {
        case `collectionRef`:
            {
                let n = t[e.alias];
                if (!n) throw new di(e.alias, e.collection.id, Object.keys(t));
                return u[e.alias] = e.collection.id,
                {
                    alias: e.alias,
                    input: n,
                    collectionId: e.collection.id,
                    sourceIncludes: []
                }
            }
        case `queryRef`:
            {
                let p = gd(l.get(e.query) || e.query, t, n, r, i, a, o, s, c, l);Object.assign(u, p.aliasToCollectionId),
                Object.assign(d, p.aliasRemapping);
                let m = l.has(e.query),
                    h = Ad(e.query.from);
                if (!(!m && e.alias === h))
                    for (let [e, t] of p.sourceWhereClauses) f.set(e, t);
                let g = Object.keys(p.aliasToCollectionId).find(e => p.aliasToCollectionId[e] === p.collectionId);g && g !== e.alias && (d[e.alias] = g);
                let _ = p.pipeline.pipe(K(e => {
                    let [t, [n, r]] = e;
                    return [t, Td(n)]
                }));
                return {
                    alias: e.alias,
                    input: _,
                    collectionId: p.collectionId,
                    sourceIncludes: p.includes ?.map(t => ({
                        sourceAlias: e.alias,
                        include: t
                    })) ?? []
                }
            }
        default:
            throw new pi(e.type)
    }
}

function wd(e) {
    return e instanceof B || e && typeof e == `object` && `type` in e && e.type === `val`
}

function Td(e) {
    return wd(e) ? e.value : e
}

function Ed(e, t) {
    if (!e || typeof e != `object`) return e;
    let n = !1;
    for (let r of ma)
        if (e[r] == null && r in t) {
            n = !0;
            break
        }
    if (!n) return e;
    for (let n of ma) e[n] == null && n in t && (e[n] = t[n]);
    return e
}

function Dd(e, t, n) {
    if (Fd(e.from, t.from, n), e.join && t.join)
        for (let r = 0; r < e.join.length && r < t.join.length; r++) {
            let i = e.join[r],
                a = t.join[r];
            i.from.type === `queryRef` && a.from.type === `queryRef` && (n.set(i.from.query, a.from.query), Dd(i.from.query, a.from.query, n))
        }
}

function Od(e) {
    return e.type === `unionFrom` ? e.sources : e.type === `unionAll` ? [] : [e]
}

function kd(e) {
    return [...Od(e.from), ...e.join ?.map(e => e.from) ?? []]
}

function Ad(e) {
    return Od(e)[0] ?.alias ?? ``
}

function jd(e, t, n) {
    return Nd(e, [t, ...n])
}

function Md(e, t) {
    return Nd(e, t)
}

function Nd(e, t) {
    let n = [],
        r = (e, t, n) => {
            for (let [r, o] of Object.entries(e)) {
                if (r.startsWith(`__SPREAD_SENTINEL__`)) {
                    i(r, o, t, n);
                    continue
                }
                a(o, [...t, r], n)
            }
        },
        i = (e, r, i, a) => {
            let o = e.slice(19),
                s = o.lastIndexOf(`__`),
                c = s >= 0 ? o.slice(0, s) : o,
                l = r && typeof r == `object` && `type` in r && r.type === `ref` ? r.path : c.split(`.`).filter(Boolean);
            Pd(t, l) && n.push({
                path: [...i, ...t.slice(l.length)],
                guards: a
            })
        },
        a = (e, i, o) => {
            if (e instanceof z && Pd(t, e.path)) {
                n.push({
                    path: [...i, ...t.slice(e.path.length)],
                    guards: o
                });
                return
            }
            if (e instanceof H) {
                let t = [];
                for (let n of e.branches) a(n.value, i, [...o, ...t, {
                    condition: n.condition,
                    expected: !0
                }]), t.push({
                    condition: n.condition,
                    expected: !1
                });
                e.defaultValue !== void 0 && a(e.defaultValue, i, [...o, ...t]);
                return
            }
            Vd(e) && r(e, i, o)
        };
    return r(e, [], []), n
}

function Pd(e, t) {
    return t.length <= e.length && t.every((t, n) => e[n] === t)
}

function Fd(e, t, n) {
    if (e.type === `unionAll` && t.type === `unionAll`) {
        for (let r = 0; r < e.queries.length && r < t.queries.length; r++) {
            let i = e.queries[r],
                a = t.queries[r];
            n.set(i, a), Dd(i, a, n)
        }
        return
    }
    let r = Od(e),
        i = Od(t);
    for (let e = 0; e < r.length && e < i.length; e++) {
        let t = r[e],
            a = i[e];
        t.type === `queryRef` && a.type === `queryRef` && (n.set(t.query, a.query), Dd(t.query, a.query, n))
    }
}

function Id(e) {
    let t = [];
    for (let [n, r] of Object.entries(e)) n.startsWith(`__SPREAD_SENTINEL__`) || (r instanceof or ? t.push({
        key: zd([n], t),
        path: [n],
        subquery: r,
        guards: []
    }) : r instanceof H ? Ld(r, [n], [], t) : Vd(r) && Hd(r, n));
    return t
}

function Ld(e, t, n, r) {
    let i = [];
    for (let a of e.branches) Rd(a.value, t, [...n, ...i, {
        condition: a.condition,
        expected: !0
    }], r), i.push({
        condition: a.condition,
        expected: !1
    });
    e.defaultValue !== void 0 && Rd(e.defaultValue, t, [...n, ...i], r)
}

function Rd(e, t, n, r) {
    if (e instanceof or) {
        let i = zd(t, r);
        r.push({
            key: i,
            path: t,
            subquery: e,
            guards: n
        });
        return
    }
    if (e instanceof H) {
        Ld(e, t, n, r);
        return
    }
    if (Vd(e))
        for (let [i, a] of Object.entries(e)) i.startsWith(`__SPREAD_SENTINEL__`) || Rd(a, [...t, i], n, r)
}

function zd(e, t) {
    return Bd(e.join(`.`), t)
}

function Bd(e, t) {
    let n = e => t.some(t => (t.key ?? t.fieldName) === e);
    if (!n(e)) return e;
    let r = t.length,
        i = `${e}#${r}`;
    for (; n(i);) r++, i = `${e}#${r}`;
    return i
}

function Vd(e) {
    return typeof e == `object` && !!e && !Array.isArray(e) && !sr(e)
}

function Hd(e, t) {
    for (let [n, r] of Object.entries(e))
        if (!n.startsWith(`__SPREAD_SENTINEL__`)) {
            if (r instanceof or) throw Error(`Includes subqueries must be at the top level of select(). Found nested includes at "${t}.${n}".`);
            Vd(r) && Hd(r, `${t}.${n}`)
        }
}

function Ud(e, t) {
    return Wd(e, t, new B(null)).value
}

function Wd(e, t, n) {
    if (t.length === 0) return Gd(e, n);
    if (e instanceof H) return Kd(e, t, n);
    if (!Vd(e)) return {
        value: e,
        replaced: !1
    };
    if (t.length === 1) {
        let r = t[0],
            i = Gd(e[r], n);
        return i.replaced ? {
            value: { ...e,
                [r]: i.value
            },
            replaced: !0
        } : {
            value: e,
            replaced: !1
        }
    }
    let [r, ...i] = t, a = Wd(e[r], i, n);
    return a.replaced ? {
        value: { ...e,
            [r]: a.value
        },
        replaced: !0
    } : {
        value: e,
        replaced: !1
    }
}

function Gd(e, t) {
    return e instanceof or ? {
        value: t,
        replaced: !0
    } : e instanceof H ? Kd(e, [], t) : {
        value: e,
        replaced: !1
    }
}

function Kd(e, t, n) {
    let r = !1,
        i = e.branches.map(e => {
            let i = t.length === 0 ? Gd(e.value, n) : Wd(e.value, t, n);
            return i.replaced ? (r = !0, { ...e,
                value: i.value
            }) : e
        }),
        a = e.defaultValue;
    if (e.defaultValue !== void 0) {
        let i = t.length === 0 ? Gd(e.defaultValue, n) : Wd(e.defaultValue, t, n);
        i.replaced && (r = !0, a = i.value)
    }
    return r ? {
        value: new H(i, a),
        replaced: !0
    } : {
        value: e,
        replaced: !1
    }
}

function qd(e, t) {
    let n = e;
    for (let e of t) {
        if (n == null) return n;
        n = n[e]
    }
    return n
}

function Jd(e, t) {
    return e.every(e => ua(e.condition(t)) === e.expected)
}

function Yd(e, t) {
    let n = e.type;
    if (n === `val`) return new B(e.value);
    if (n === `ref`) {
        let n = e.path;
        if (Array.isArray(n)) {
            if (n[0] === t && n.length > 1) return new z(n.slice(1));
            if (n.length === 1 && n[0] !== void 0) return new z([n[0]])
        }
        return new z(Array.isArray(n) ? n : [String(n)])
    } else {
        let n = [];
        for (let r of e.args) {
            let e = Yd(r, t);
            n.push(e)
        }
        return new V(e.name, n)
    }
}

function Xd(e, t) {
    return e.map(e => {
        let n = Yd(e.expression, t);
        return { ...e,
            expression: n
        }
    })
}
var Zd = new WeakMap;

function Qd(e) {
    return e.utils ?.[el] ?.getBuilder ?.()
}

function $d(e, t) {
    Zd.set(e, t)
}

function ef(e) {
    return Zd.get(e)
}
var tf = `unionAll clause`,
    nf = class e {
        constructor(e = {}) {
            this.query = {}, this.query = { ...e
            }
        }
        _createRefForSource(e, t) {
            let n = this._createRefsForSource(e, t);
            if (n.length !== 1) throw new Qr(t);
            return n[0]
        }
        _createRefsForSource(t, n) {
            if (typeof t == `string`) throw new ti(n, `string`);
            let r;
            try {
                r = Object.keys(t)
            } catch {
                throw new ti(n, t === null ? `null` : `undefined`)
            }
            if (Array.isArray(t)) throw new ti(n, `array`);
            if (r.length === 0) throw new ti(n, `empty object`);
            if (n !== tf && r.length !== 1) throw new Qr(n);
            let i = [];
            for (let a of r) {
                let r = t[a],
                    o;
                if (r instanceof Wl) o = new tr(r, a);
                else if (r instanceof e) {
                    let e = r._getQuery();
                    if (!e.from) throw new $r(n);
                    o = new nr(e, a)
                } else throw new ei(a);
                i.push([a, o])
            }
            return i
        }
        from(t) {
            let [, n] = this._createRefForSource(t, `from clause`);
            return new e({ ...this.query,
                from: n
            })
        }
        unionAll(t, ...n) {
            if (t instanceof e) return new e({ ...this.query,
                from: new ir([t, ...n].map(e => e._getQuery()))
            });
            let r = this._createRefsForSource(t, tf),
                i = r.length === 1 ? r[0][1] : new rr(r.map(e => e[1]));
            return new e({ ...this.query,
                from: i
            })
        }
        join(t, n, r = `left`) {
            let [i, a] = this._createRefForSource(t, `join clause`), o = n(Cc([...this._getCurrentAliases(), i])), s, c;
            if (o.type === `func` && o.name === `eq` && o.args.length === 2) s = o.args[0], c = o.args[1];
            else throw new ni;
            let l = {
                    from: a,
                    type: r,
                    left: s,
                    right: c
                },
                u = this.query.join || [];
            return new e({ ...this.query,
                join: [...u, l]
            })
        }
        leftJoin(e, t) {
            return this.join(e, t, `left`)
        }
        rightJoin(e, t) {
            return this.join(e, t, `right`)
        }
        innerJoin(e, t) {
            return this.join(e, t, `inner`)
        }
        fullJoin(e, t) {
            return this.join(e, t, `full`)
        }
        where(t) {
            let n = t(Cc(this._getCurrentAliases())),
                r = Tc(n) ? q(n) : n;
            if (!sr(r)) throw new ii(rf(r));
            let i = this.query.where || [];
            return new e({ ...this.query,
                where: [...i, r]
            })
        }
        having(t) {
            let n = this._getCurrentAliases(),
                r = t(this.query.select || this.query.fnSelect ? wc(n) : Cc(n)),
                i = Tc(r) ? q(r) : r;
            if (!sr(i)) throw new ii(rf(i));
            let a = this.query.having || [];
            return new e({ ...this.query,
                having: [...a, i]
            })
        }
        select(t) {
            let n = this._getCurrentAliases(),
                r = t(Cc(n));
            Tc(r) && r.__path.length === 1 && (r = {
                [`__SPREAD_SENTINEL__${r.__path[0]}__0`]: !0
            });
            let i = sf(r, n);
            return new e({ ...this.query,
                select: i,
                fnSelect: void 0
            })
        }
        orderBy(t, n = `asc`) {
            let r = this._getCurrentAliases(),
                i = t(this.query.select || this.query.fnSelect ? wc(r) : Cc(r)),
                a = typeof n == `string` ? {
                    direction: n,
                    nulls: `first`
                } : {
                    direction: n.direction ?? `asc`,
                    nulls: n.nulls ?? `first`,
                    stringSort: n.stringSort,
                    locale: n.stringSort === `locale` ? n.locale : void 0,
                    localeOptions: n.stringSort === `locale` ? n.localeOptions : void 0
                },
                o = e => ({
                    expression: q(e),
                    compareOptions: a
                }),
                s = Array.isArray(i) ? i.map(e => o(e)) : [o(i)],
                c = this.query.orderBy || [];
            return new e({ ...this.query,
                orderBy: [...c, ...s]
            })
        }
        groupBy(t) {
            let n = t(Cc(this._getCurrentAliases())),
                r = Array.isArray(n) ? n.map(e => q(e)) : [q(n)],
                i = this.query.groupBy || [];
            return new e({ ...this.query,
                groupBy: [...i, ...r]
            })
        }
        limit(t) {
            return new e({ ...this.query,
                limit: t
            })
        }
        offset(t) {
            return new e({ ...this.query,
                offset: t
            })
        }
        distinct() {
            return new e({ ...this.query,
                distinct: !0
            })
        }
        findOne() {
            return new e({ ...this.query,
                singleResult: !0
            })
        }
        _getCurrentAliases() {
            let e = [];
            if (this.query.from && (this.query.from.type === `unionFrom` ? e.push(...this.query.from.sources.map(e => e.alias)) : this.query.from.type === `unionAll` ? e.push(`*`) : e.push(this.query.from.alias)), this.query.join)
                for (let t of this.query.join) e.push(t.from.alias);
            return e
        }
        get fn() {
            let t = this;
            return {
                select(n) {
                    return new e({ ...t.query,
                        select: void 0,
                        fnSelect: n
                    })
                },
                where(n) {
                    return new e({ ...t.query,
                        fnWhere: [...t.query.fnWhere || [], n]
                    })
                },
                having(n) {
                    return new e({ ...t.query,
                        fnHaving: [...t.query.fnHaving || [], n]
                    })
                }
            }
        }
        _getQuery() {
            if (!this.query.from) throw new ri;
            return this.query
        }
    };

function rf(e) {
    return e === null ? `null` : e === void 0 ? `undefined` : typeof e == `object` ? `object` : typeof e
}

function af(e) {
    return e === void 0 ? q(null) : e instanceof ar || e instanceof V || e instanceof z || e instanceof B ? e : q(e)
}

function of (e) {
    return typeof e == `object` && !!e && !sr(e) && !e.__refProxy
}

function sf(e, t = [], n) {
    if (e instanceof nf) {
        if (!n) throw Error(`Conditional include branch is missing a field name`);
        return df(e, n, t, `collection`)
    }
    if (e instanceof zc) {
        if (!(e.query instanceof nf)) throw Error(`toArray() must wrap a subquery builder`);
        if (!n) throw Error(`Conditional toArray() branch is missing a field name`);
        return df(e.query, n, t, `array`)
    }
    if (e instanceof Bc) {
        if (!(e.query instanceof nf)) throw Error(`concat(toArray(...)) must wrap a subquery builder`);
        if (!n) throw Error(`Conditional concat(toArray(...)) branch is missing a field name`);
        return df(e.query, n, t, `concat`)
    }
    if (e instanceof Vc) return cf(e, t, n);
    if (! of (e)) return af(e);
    let r = {};
    for (let [n, i] of Object.entries(e)) {
        if (typeof n == `string` && n.startsWith(`__SPREAD_SENTINEL__`)) {
            r[n] = i;
            continue
        }
        if (i instanceof nf) {
            r[n] = df(i, n, t, `collection`);
            continue
        }
        if (i instanceof zc) {
            if (!(i.query instanceof nf)) throw Error(`toArray() must wrap a subquery builder`);
            r[n] = df(i.query, n, t, `array`);
            continue
        }
        if (i instanceof Bc) {
            if (!(i.query instanceof nf)) throw Error(`concat(toArray(...)) must wrap a subquery builder`);
            r[n] = df(i.query, n, t, `concat`);
            continue
        }
        if (i instanceof Hc) {
            if (!(i.query instanceof nf)) throw Error(`materialize() must wrap a subquery builder`);
            let e = i.query._getQuery().singleResult ? `singleton` : `array`;
            r[n] = df(i.query, n, t, e);
            continue
        }
        if (i instanceof Vc) {
            r[n] = cf(i, t, n);
            continue
        }
        r[n] = sf(i, t, n)
    }
    return r
}

function cf(e, t, n) {
    let r = e.args;
    if (r.length < 2) throw Error(`caseWhen() requires at least two arguments`);
    let i = r.length % 2 == 1,
        a = Math.floor(r.length / 2),
        o = [];
    for (let e = 0; e < a; e++) o.push({
        condition: q(r[e * 2]),
        value: sf(r[e * 2 + 1], t, n)
    });
    return new H(o, i ? sf(r[r.length - 1], t, n) : void 0)
}

function lf(e) {
    let t = [];
    switch (e.type) {
        case `ref`:
            t.push(e);
            break;
        case `func`:
            for (let n of e.args ?? []) t.push(...lf(n));
            break
    }
    return t
}

function uf(e, t) {
    return lf(typeof e == `object` && `expression` in e ? e.expression : e).some(e => e.path[0] != null && t.includes(e.path[0]))
}

function df(e, t, n, r) {
    let i = e._getQuery(),
        a = ff(i),
        o, s, c = -1,
        l = -1;
    if (i.where)
        for (let e = 0; e < i.where.length; e++) {
            let t = i.where[e],
                r = typeof t == `object` && `expression` in t ? t.expression : t;
            if (r.type === `func` && r.name === `eq` && r.args.length === 2) {
                let t = mf(r.args[0], r.args[1], n, a);
                if (t) {
                    o = t.parentRef, s = t.childRef, c = e;
                    break
                }
            }
            if (r.type === `func` && r.name === `and` && r.args.length >= 2) {
                for (let t = 0; t < r.args.length; t++) {
                    let i = r.args[t];
                    if (i.type === `func` && i.name === `eq` && i.args.length === 2) {
                        let r = mf(i.args[0], i.args[1], n, a);
                        if (r) {
                            o = r.parentRef, s = r.childRef, c = e, l = t;
                            break
                        }
                    }
                }
                if (o) break
            }
        }
    if (!o || !s || c === -1) throw Error(`Includes subquery for "${t}" must have a WHERE clause with an eq() condition that correlates a parent field with a child field. Example: .where(({child}) => eq(child.parentId, parent.id))`);
    let u = [...i.where];
    if (l >= 0) {
        let e = u[c],
            t = (typeof e == `object` && `expression` in e ? e.expression : e).args.filter((e, t) => t !== l);
        if (t.length === 1) u[c] = typeof e == `object` && `expression` in e && e.residual ? {
            expression: t[0],
            residual: !0
        } : t[0];
        else {
            let n = new V(`and`, t);
            u[c] = typeof e == `object` && `expression` in e && e.residual ? {
                expression: n,
                residual: !0
            } : n
        }
    } else u.splice(c, 1);
    let d = [],
        f = [];
    for (let e of u) uf(e, n) ? f.push(e) : d.push(e);
    let p;
    if (f.length > 0) {
        let e = new Set;
        p = [];
        for (let t of f) {
            let r = typeof t == `object` && `expression` in t ? t.expression : t;
            for (let t of lf(r)) t.path[0] != null && n.includes(t.path[0]) && !e.has(t.path.join(`.`)) && (e.add(t.path.join(`.`)), p.push(t))
        }
    }
    let m = { ...i,
            where: d.length > 0 ? d : void 0
        },
        h = m.select,
        g = h === void 0 || of (h),
        _ = m,
        v;
    if (r === `concat` && (h === void 0 || g)) throw Error(`concat(toArray(...)) for "${t}" requires the subquery to select a scalar value`);
    if (!g) {
        if (r === `collection`) throw Error(`Includes subquery for "${t}" must select an object when materializing as a Collection`);
        v = $n, _ = { ...m,
            select: {
                [v]: h
            }
        }
    }
    return new or(_, o, s, t, f.length > 0 ? f : void 0, p, r, v)
}

function ff(e) {
    let t = new Set(pf(e.from));
    if (e.join)
        for (let n of e.join) t.add(n.from.alias);
    return [...t]
}

function pf(e) {
    return e.type === `unionFrom` ? e.sources.map(e => e.alias) : e.type === `unionAll` ? e.queries.flatMap(e => ff(e)) : [e.alias]
}

function mf(e, t, n, r) {
    if (e.type === `ref` && t.type === `ref`) {
        let i = e.path[0],
            a = t.path[0];
        if (i && a && n.includes(i) && r.includes(a)) return {
            parentRef: e,
            childRef: t
        };
        if (i && a && n.includes(a) && r.includes(i)) return {
            parentRef: t,
            childRef: e
        }
    }
}

function hf(e) {
    return gf(e(new nf))
}

function gf(e) {
    return e._getQuery()
}
var _f = nf;

function vf(e) {
    let t = {};

    function n(e) {
        if (e.type === `collectionRef`) t[e.collection.id] = e.collection;
        else if (e.type === `queryRef`) r(e.query);
        else if (e.type === `unionFrom`)
            for (let t of e.sources) n(t);
        else if (e.type === `unionAll`)
            for (let t of e.queries) r(t)
    }

    function r(e) {
        if (e.from && n(e.from), e.join && Array.isArray(e.join))
            for (let t of e.join) t.from && n(t.from);
        e.select && i(e.select)
    }

    function i(e) {
        for (let [t, n] of Object.entries(e)) typeof t == `string` && t.startsWith(`__SPREAD_SENTINEL__`) || (n instanceof or ? r(n.query) : n instanceof H ? a(n) : xf(n) && i(n))
    }

    function a(e) {
        for (let t of e.branches) o(t.value);
        e.defaultValue !== void 0 && o(e.defaultValue)
    }

    function o(e) {
        e instanceof or ? r(e.query) : e instanceof H ? a(e) : xf(e) && i(e)
    }
    return r(e), t
}

function yf(e) {
    let t = e.from;
    if (t.type === `collectionRef`) return t.collection;
    if (t.type === `queryRef`) return yf(t.query);
    if (t.type === `unionFrom`) return yf({
        from: t.sources[0]
    });
    if (t.type === `unionAll`) return yf(t.queries[0]);
    throw Error(`Failed to extract collection. Invalid FROM clause: ${JSON.stringify(e)}`)
}

function bf(e) {
    let t = new Map;

    function n(e) {
        if (e) {
            if (e.type === `collectionRef`) {
                let {
                    id: n
                } = e.collection, r = t.get(n);
                r ? r.add(e.alias) : t.set(n, new Set([e.alias]))
            } else if (e.type === `queryRef`) o(e.query);
            else if (e.type === `unionFrom`)
                for (let t of e.sources) n(t);
            else if (e.type === `unionAll`)
                for (let t of e.queries) o(t)
        }
    }

    function r(e) {
        for (let [t, n] of Object.entries(e)) typeof t == `string` && t.startsWith(`__SPREAD_SENTINEL__`) || (n instanceof or ? o(n.query) : n instanceof H ? i(n) : xf(n) && r(n))
    }

    function i(e) {
        for (let t of e.branches) a(t.value);
        e.defaultValue !== void 0 && a(e.defaultValue)
    }

    function a(e) {
        e instanceof or ? o(e.query) : e instanceof H ? i(e) : xf(e) && r(e)
    }

    function o(e) {
        if (e) {
            if (n(e.from), e.join)
                for (let t of e.join) n(t.from);
            e.select && r(e.select)
        }
    }
    return o(e), t
}

function xf(e) {
    return !(typeof e != `object` || !e || e instanceof or || sr(e) || e.__refProxy)
}

function Sf(e) {
    let t = typeof e.query == `function` ? hf(e.query) : gf(e.query);
    if (e.requireObjectResult && t.select && !xf(t.select)) throw new ci;
    return t
}

function Cf(e, t) {
    let n = [];
    for (let e of t) {
        let t = e.key;
        e.type === `insert` ? n.push([
            [t, e.value], 1
        ]) : e.type === `update` ? (n.push([
            [t, e.previousValue], -1
        ]), n.push([
            [t, e.value], 1
        ])) : n.push([
            [t, e.value], -1
        ])
    }
    return n.length !== 0 && e.sendData(new Oo(n)), n.length
}

function* wf(e) {
    for (let t of e) t.type === `update` ? (yield {
        type: `delete`,
        key: t.key,
        value: t.previousValue
    }, yield {
        type: `insert`,
        key: t.key,
        value: t.value
    }) : yield t
}

function Tf(e, t) {
    let n = [];
    for (let r of e) {
        if (r.type === `insert`) {
            if (t.has(r.key)) continue;
            t.add(r.key)
        } else r.type === `delete` && t.delete(r.key);
        n.push(r)
    }
    return n
}

function Ef(e, t, n, r) {
    let i = t,
        a = !1;
    for (let t of e) {
        if (t.type === `delete`) continue;
        let e = !n.has(t.key);
        i === void 0 || r(i, t.value) < 0 ? (i = t.value, a = !0) : e && (a = !0)
    }
    return {
        biggest: i,
        shouldResetLoadKey: a
    }
}

function Df(e, t) {
    let {
        orderBy: n,
        limit: r,
        offset: i
    } = e, a = r !== void 0 && i !== void 0 ? r + i : r, o = n ? Xd(n, t) : void 0, s = o ?.every(e => {
        let t = e.expression;
        if (t.type !== `ref`) return !1;
        let n = t.path;
        return Array.isArray(n) && n.length === 1
    }) ?? !1;
    return {
        orderBy: s ? o : void 0,
        limit: s ? a : void 0
    }
}

function Of(e, t, n, r, i) {
    let {
        orderBy: a,
        valueExtractorForRawRow: o,
        offset: s
    } = e, c = t ? o(t) : void 0, l;
    c !== void 0 && (l = Array.isArray(c) ? c : [c]);
    let u = Ua({
        minValues: l ?? null,
        offset: s,
        limit: i
    });
    if (n === u) return;
    let d = Xd(a, r);
    return {
        minValues: l,
        normalizedOrderBy: d,
        loadRequestKey: u
    }
}
var kf = Symbol.for(`@tanstack/db.collection-config-builder`),
    Af = class {
        constructor(e, t, n, r) {
            this.alias = e, this.collectionId = t, this.collection = n, this.collectionConfigBuilder = r, this.biggest = void 0, this.subscriptionLoadingPromises = new Map, this.sentToD2Keys = new Set
        }
        subscribe() {
            let e = this.getWhereClauseForAlias();
            if (e) {
                let t = Yd(e, this.alias);
                return this.subscribeToChanges(t)
            }
            return this.subscribeToChanges()
        }
        subscribeToChanges(e) {
            let t = this.getOrderByInfo(),
                n = e => {
                    e instanceof Promise && this.collectionConfigBuilder.liveQueryCollection._sync.trackLoadPromise(e)
                },
                r = e => {
                    let t = e.subscription;
                    if (e.status === `loadingSubset`) this.ensureLoadingPromise(t);
                    else {
                        let e = this.subscriptionLoadingPromises.get(t);
                        e && (this.subscriptionLoadingPromises.delete(t), e.resolve())
                    }
                },
                i;
            if (t) i = this.subscribeToOrderedChanges(e, t, r, n);
            else {
                let t = !this.collectionConfigBuilder.isLazyAlias(this.alias);
                i = this.subscribeToMatchingChanges(e, t, r)
            }
            return i.status === `loadingSubset` && this.ensureLoadingPromise(i), this.collectionConfigBuilder.currentSyncState.unsubscribeCallbacks.add(() => {
                let e = this.subscriptionLoadingPromises.get(i);
                e && (this.subscriptionLoadingPromises.delete(i), e.resolve()), i.unsubscribe()
            }), i
        }
        sendChangesToPipeline(e, t) {
            let n = Tf(Array.isArray(e) ? e : [...e], this.sentToD2Keys),
                r = this.collectionConfigBuilder.currentSyncState.inputs[this.alias],
                i = Cf(r, n) > 0 ? t : void 0;
            this.collectionConfigBuilder.scheduleGraphRun(i, {
                alias: this.alias
            })
        }
        subscribeToMatchingChanges(e, t, n) {
            let r = e => {
                    this.sendChangesToPipeline(e)
                },
                i = Df(this.collectionConfigBuilder.query, this.alias),
                a = t ? e => {
                    e instanceof Promise && this.collectionConfigBuilder.liveQueryCollection._sync.trackLoadPromise(e)
                } : void 0;
            return this.collection.subscribeChanges(r, { ...t && {
                    includeInitialState: t
                },
                whereExpression: e,
                onStatusChange: n,
                orderBy: i.orderBy,
                limit: i.limit,
                onLoadSubsetResult: a
            })
        }
        subscribeToOrderedChanges(e, t, n, r) {
            let {
                orderBy: i,
                offset: a,
                limit: o,
                index: s
            } = t, c = e => {
                e instanceof Promise && (this.pendingOrderedLoadPromise = e, e.finally(() => {
                    this.pendingOrderedLoadPromise === e && (this.pendingOrderedLoadPromise = void 0)
                })), r(e)
            };
            this.orderedLoadSubsetResult = c;
            let l = {},
                u = this.collection.subscribeChanges(e => {
                    let n = Array.isArray(e) ? e : [...e];
                    this.trackSentValues(n, t.comparator);
                    let r = wf(n);
                    this.sendChangesToPipelineWithTracking(r, l.current)
                }, {
                    whereExpression: e,
                    onStatusChange: n
                });
            l.current = u;
            let d = this.collection.on(`truncate`, () => {
                this.biggest = void 0, this.lastLoadRequestKey = void 0, this.pendingOrderedLoadPromise = void 0, this.sentToD2Keys.clear()
            });
            u.on(`unsubscribed`, () => {
                d()
            });
            let f = Xd(i, this.alias);
            return s ? (u.setOrderByIndex(s), u.requestLimitedSnapshot({
                limit: a + o,
                orderBy: f,
                trackLoadSubsetPromise: !1,
                onLoadSubsetResult: c
            })) : u.requestSnapshot({
                orderBy: f,
                limit: a + o,
                trackLoadSubsetPromise: !1,
                onLoadSubsetResult: c
            }), u
        }
        loadMoreIfNeeded(e) {
            let t = this.getOrderByInfo();
            if (!t) return !0;
            let {
                dataNeeded: n,
                index: r
            } = t;
            if (!n || !r || this.pendingOrderedLoadPromise) return !0;
            let i = n();
            return i > 0 && this.loadNextItems(i, e), !0
        }
        sendChangesToPipelineWithTracking(e, t) {
            if (!this.getOrderByInfo()) {
                this.sendChangesToPipeline(e);
                return
            }
            let n = t;
            n[kf] ??= this.loadMoreIfNeeded.bind(this, t), this.sendChangesToPipeline(e, n[kf])
        }
        loadNextItems(e, t) {
            let n = this.getOrderByInfo();
            if (!n) return;
            let r = Of(n, this.biggest, this.lastLoadRequestKey, this.alias, e);
            r && (this.lastLoadRequestKey = r.loadRequestKey, t.requestLimitedSnapshot({
                orderBy: r.normalizedOrderBy,
                limit: e,
                minValues: r.minValues,
                trackLoadSubsetPromise: !1,
                onLoadSubsetResult: this.orderedLoadSubsetResult
            }))
        }
        getWhereClauseForAlias() {
            let e = this.collectionConfigBuilder.sourceWhereClausesCache;
            if (e) return e.get(this.alias)
        }
        getOrderByInfo() {
            let e = this.collectionConfigBuilder.optimizableOrderByCollections[this.collectionId];
            if (e && e.alias === this.alias) return e
        }
        trackSentValues(e, t) {
            let n = Ef(e, this.biggest, this.sentToD2Keys, t);
            this.biggest = n.biggest, n.shouldResetLoadKey && (this.lastLoadRequestKey = void 0)
        }
        ensureLoadingPromise(e) {
            if (this.subscriptionLoadingPromises.has(e)) return;
            let t, n = new Promise(e => {
                t = e
            });
            this.subscriptionLoadingPromises.set(e, {
                resolve: t
            }), this.collectionConfigBuilder.liveQueryCollection._sync.trackLoadPromise(n)
        }
    },
    jf = 0,
    Mf = class {
        constructor(e) {
            this.config = e, this.compiledAliasToCollectionId = {}, this.resultKeys = new WeakMap, this.orderByIndices = new WeakMap, this.isGraphRunning = !1, this.runCount = 0, this.isInErrorState = !1, this.aliasDependencies = {}, this.builderDependencies = new Set, this.pendingGraphRuns = new Map, this.subscriptions = {}, this.lazySourcesCallbacks = {}, this.lazySources = new Set, this.optimizableOrderByCollections = {}, this.id = e.id || `live-query-${++jf}`, this.query = Sf({
                query: e.query,
                requireObjectResult: !0
            }), this.collections = vf(this.query);
            let t = bf(this.query);
            this.collectionByAlias = {};
            for (let [e, n] of t.entries()) {
                let t = this.collections[e];
                if (t)
                    for (let e of n) this.collectionByAlias[e] = t
            }
            this.query.orderBy && this.query.orderBy.length > 0 && (this.compare = Nf(this.orderByIndices)), this.compareOptions = this.config.defaultStringCollation ?? yf(this.query).compareOptions, this.compileBasePipeline()
        }
        hasJoins(e) {
            if (e.join && e.join.length > 0) return !0;
            if (e.from.type === `queryRef`) {
                if (this.hasJoins(e.from.query)) return !0
            } else if (e.from.type === `unionFrom`) {
                for (let t of e.from.sources)
                    if (t.type === `queryRef` && this.hasJoins(t.query)) return !0
            } else if (e.from.type === `unionAll`) {
                for (let t of e.from.queries)
                    if (this.hasJoins(t)) return !0
            }
            return !1
        }
        getConfig() {
            return {
                id: this.id,
                getKey: this.config.getKey || (e => this.resultKeys.get(e) ?? e.$key),
                sync: this.getSyncConfig(),
                compare: this.compare,
                defaultStringCollation: this.compareOptions,
                gcTime: this.config.gcTime || 5e3,
                schema: this.config.schema,
                onInsert: this.config.onInsert,
                onUpdate: this.config.onUpdate,
                onDelete: this.config.onDelete,
                startSync: this.config.startSync,
                singleResult: this.query.singleResult,
                utils: {
                    getRunCount: this.getRunCount.bind(this),
                    setWindow: this.setWindow.bind(this),
                    getWindow: this.getWindow.bind(this),
                    [el]: {
                        getBuilder: () => this,
                        hasCustomGetKey: !!this.config.getKey,
                        hasJoins: this.hasJoins(this.query),
                        hasDistinct: !!this.query.distinct
                    }
                }
            }
        }
        setWindow(e) {
            if (!this.windowFn) throw new Ii;
            return this.currentWindow = e, this.windowFn(e), this.maybeRunGraphFn ?.(), this.liveQueryCollection ?.isLoadingSubset ? new Promise(e => {
                let t = this.liveQueryCollection.on(`loadingSubset:change`, n => {
                    n.isLoadingSubset || (t(), e())
                })
            }) : !0
        }
        getWindow() {
            if (!(!this.windowFn || !this.currentWindow)) return {
                offset: this.currentWindow.offset ?? 0,
                limit: this.currentWindow.limit ?? 0
            }
        }
        getCollectionIdForAlias(e) {
            let t = this.compiledAliasToCollectionId[e];
            if (t) return t;
            let n = this.collectionByAlias[e];
            if (n) return n.id;
            throw Error(`Unknown source alias "${e}"`)
        }
        isLazyAlias(e) {
            return this.lazySources.has(e)
        }
        maybeRunGraph(e) {
            if (!this.isGraphRunning) {
                if (!this.currentSyncConfig || !this.currentSyncState) throw Error(`maybeRunGraph called without active sync session. This should not happen.`);
                this.isGraphRunning = !0;
                try {
                    let {
                        begin: t,
                        commit: n
                    } = this.currentSyncConfig, r = this.currentSyncState;
                    if (this.isInErrorState) return;
                    if (r.subscribedToAllCollections) {
                        let i = !1;
                        for (; r.graph.pendingWork();) r.graph.run(), r.flushPendingChanges ?.(), e ?.(), i = !0;
                        i || e ?.(), r.messagesCount === 0 && (t(), n()), this.updateLiveQueryStatus(this.currentSyncConfig)
                    }
                } finally {
                    this.isGraphRunning = !1
                }
            }
        }
        scheduleGraphRun(e, t) {
            let n = t ?.contextId ?? Il() ?.id,
                r = t ?.jobId ?? this,
                i = (() => {
                    if (t ?.dependencies) return t.dependencies;
                    let e = new Set(this.builderDependencies);
                    if (t ?.alias) {
                        let n = this.aliasDependencies[t.alias];
                        if (n)
                            for (let t of n) e.add(t)
                    }
                    return e.delete(this), Array.from(e)
                })();
            if (n)
                for (let e of i) typeof e.scheduleGraphRun == `function` && e.scheduleGraphRun(void 0, {
                    contextId: n
                });
            if (!this.currentSyncConfig || !this.currentSyncState) throw Error(`scheduleGraphRun called without active sync session. This should not happen.`);
            let a = n ? this.pendingGraphRuns.get(n) : void 0;
            a || (a = {
                loadCallbacks: new Set
            }, n && this.pendingGraphRuns.set(n, a)), e && a.loadCallbacks.add(e);
            let o = n ? void 0 : a;
            Al.schedule({
                contextId: n,
                jobId: r,
                dependencies: i,
                run: () => this.executeGraphRun(n, o)
            })
        }
        clearPendingGraphRun(e) {
            this.pendingGraphRuns.delete(e)
        }
        hasPendingGraphRun(e) {
            return this.pendingGraphRuns.has(e)
        }
        executeGraphRun(e, t) {
            let n = t ?? (e ? this.pendingGraphRuns.get(e) : void 0);
            e && this.pendingGraphRuns.delete(e), !(!n || !this.currentSyncConfig || !this.currentSyncState) && (this.incrementRunCount(), this.maybeRunGraph(() => {
                let e = !0,
                    t;
                if (n.loadCallbacks.forEach(n => {
                        try {
                            e = n() && e
                        } catch (n) {
                            e = !1, t ??= n
                        }
                    }), t) throw t;
                return e
            }))
        }
        getSyncConfig() {
            return {
                rowUpdateMode: `full`,
                sync: this.syncFn.bind(this)
            }
        }
        incrementRunCount() {
            this.runCount++
        }
        getRunCount() {
            return this.runCount
        }
        syncFn(e) {
            this.liveQueryCollection = e.collection, this.currentSyncConfig = e;
            let t = {
                    messagesCount: 0,
                    subscribedToAllCollections: !1,
                    unsubscribeCallbacks: new Set
                },
                n = this.extendPipelineWithChangeProcessing(e, t);
            this.currentSyncState = n, this.unsubscribeFromSchedulerClears = Al.onClear(e => {
                this.clearPendingGraphRun(e)
            });
            let r = e.collection.on(`loadingSubset:change`, t => {
                t.isLoadingSubset || this.updateLiveQueryStatus(e)
            });
            t.unsubscribeCallbacks.add(r);
            let i = this.subscribeToAllCollections(e, n);
            return this.maybeRunGraphFn = () => this.scheduleGraphRun(i), this.scheduleGraphRun(i), () => {
                t.unsubscribeCallbacks.forEach(e => e()), this.currentSyncConfig = void 0, this.currentSyncState = void 0, this.pendingGraphRuns.clear(), this.graphCache = void 0, this.inputsCache = void 0, this.pipelineCache = void 0, this.sourceWhereClausesCache = void 0, this.includesCache = void 0, this.lazySources.clear(), this.optimizableOrderByCollections = {}, this.lazySourcesCallbacks = {}, Object.keys(this.subscriptions).forEach(e => delete this.subscriptions[e]), this.compiledAliasToCollectionId = {}, this.unsubscribeFromSchedulerClears ?.(), this.unsubscribeFromSchedulerClears = void 0
            }
        }
        compileBasePipeline() {
            this.graphCache = new Fo, this.inputsCache = Object.fromEntries(Object.keys(this.collectionByAlias).map(e => [e, this.graphCache.newInput()]));
            let e = gd(this.query, this.inputsCache, this.collections, this.subscriptions, this.lazySourcesCallbacks, this.lazySources, this.optimizableOrderByCollections, e => {
                this.windowFn = e
            });
            this.pipelineCache = e.pipeline, this.sourceWhereClausesCache = e.sourceWhereClauses, this.compiledAliasToCollectionId = e.aliasToCollectionId, this.includesCache = e.includes;
            let t = Object.keys(this.compiledAliasToCollectionId).filter(e => !Object.hasOwn(this.inputsCache, e));
            if (t.length > 0) throw new Fi(t)
        }
        maybeCompileBasePipeline() {
            return (!this.graphCache || !this.inputsCache || !this.pipelineCache) && this.compileBasePipeline(), {
                graph: this.graphCache,
                inputs: this.inputsCache,
                pipeline: this.pipelineCache
            }
        }
        extendPipelineWithChangeProcessing(e, t) {
            let {
                begin: n,
                commit: r
            } = e, {
                graph: i,
                inputs: a,
                pipeline: o
            } = this.maybeCompileBasePipeline(), s = new Map;
            o.pipe(Cs(e => {
                let n = e.getInner();
                t.messagesCount += n.length, n.reduce($f, s)
            }));
            let c = this.setupIncludesOutput(this.includesCache, t);
            return t.flushPendingChanges = () => {
                let t = s.size > 0,
                    i = Gf(c);
                if (!t && !i) return;
                let a = s;
                if (this.config.getKey) {
                    let e = new Map;
                    for (let [, t] of s) {
                        let n = this.config.getKey(t.value),
                            r = e.get(n);
                        r ? (r.inserts += t.inserts, r.deletes += t.deletes, t.inserts > 0 && (r.value = t.value, t.orderByIndex !== void 0 && (r.orderByIndex = t.orderByIndex))) : e.set(n, { ...t
                        })
                    }
                    a = e
                }
                t && (n(), a.forEach(this.applyChanges.bind(this, e)), r()), s = new Map, Wf(c, e.collection, this.id, t ? a : null, e)
            }, i.finalize(), t.graph = i, t.inputs = a, t.pipeline = o, t
        }
        setupIncludesOutput(e, t) {
            return !e || e.length === 0 ? [] : e.map(e => {
                let n = {
                    fieldName: e.fieldName,
                    resultPath: e.resultPath,
                    childCorrelationField: e.childCorrelationField,
                    hasOrderBy: e.hasOrderBy,
                    materialization: e.materialization,
                    scalarField: e.scalarField,
                    childRegistry: new Map,
                    pendingChildChanges: new Map,
                    correlationToParentKeys: new Map
                };
                return e.pipeline.pipe(Cs(e => {
                    let r = e.getInner();
                    t.messagesCount += r.length;
                    for (let [
                            [e, t], i
                        ] of r) {
                        let [r, a, o, s] = t, c = Hf(o, s), l = n.pendingChildChanges.get(c);
                        l || (l = new Map, n.pendingChildChanges.set(c, l));
                        let u = l.get(e) || {
                            deletes: 0,
                            inserts: 0,
                            value: r,
                            orderByIndex: a
                        };
                        i < 0 ? u.deletes += Math.abs(i) : i > 0 && (u.inserts += i, u.value = r), l.set(e, u)
                    }
                })), e.childCompilationResult.includes && (n.nestedSetups = If(e.childCompilationResult.includes, t), n.nestedRoutingIndex = new Map, n.nestedRoutingReverseIndex = new Map), n
            })
        }
        applyChanges(e, t, n) {
            let {
                write: r,
                collection: i
            } = e, {
                deletes: a,
                inserts: o,
                value: s,
                orderByIndex: c
            } = t;
            if (this.resultKeys.set(s, n), c !== void 0 && this.orderByIndices.set(s, c), o && a === 0) r({
                value: s,
                type: `insert`
            });
            else if (o > a || o === a && i.has(i.getKeyFromItem(s))) r({
                value: s,
                type: `update`
            });
            else if (a > 0) r({
                value: s,
                type: `delete`
            });
            else throw Error(`Could not apply changes: ${JSON.stringify(t)}. This should never happen.`)
        }
        handleSourceStatusChange(e, t, n) {
            let {
                status: r
            } = n;
            if (r === `error`) {
                this.transitionToError(`Source collection '${t}' entered error state`);
                return
            }
            if (r === `cleaned-up`) {
                this.transitionToError(`Source collection '${t}' was manually cleaned up while live query '${this.id}' depends on it. Live queries prevent automatic GC, so this was likely a manual cleanup() call.`);
                return
            }
            this.updateLiveQueryStatus(e)
        }
        updateLiveQueryStatus(e) {
            let {
                markReady: t
            } = e;
            if (this.isInErrorState) return;
            let n = this.currentSyncState ?.subscribedToAllCollections,
                r = this.allCollectionsReady(),
                i = this.liveQueryCollection ?.isLoadingSubset;
            n && r && !i && t()
        }
        transitionToError(e) {
            this.isInErrorState = !0, console.error(`[Live Query Error] ${e}`), this.liveQueryCollection ?._lifecycle.setStatus(`error`)
        }
        allCollectionsReady() {
            return Object.values(this.collections).every(e => e.isReady())
        }
        subscribeToAllCollections(e, t) {
            let n = Object.entries(this.compiledAliasToCollectionId);
            if (n.length === 0) throw Error(`Compiler returned no alias metadata for query '${this.id}'. This should not happen; please report.`);
            let r = n.map(([n, r]) => {
                let i = this.collectionByAlias[n] ?? this.collections[r],
                    a = ef(i);
                a && a !== this ? (this.aliasDependencies[n] = [a], this.builderDependencies.add(a)) : this.aliasDependencies[n] = [];
                let o = new Af(n, r, i, this),
                    s = i.on(`status:change`, t => {
                        this.handleSourceStatusChange(e, r, t)
                    });
                t.unsubscribeCallbacks.add(s);
                let c = o.subscribe();
                return this.subscriptions[n] = c, o.loadMoreIfNeeded.bind(o, c)
            });
            return t.subscribedToAllCollections = !0, () => (r.map(e => e()), !0)
        }
    };

function Nf(e) {
    return (t, n) => {
        let r = e.get(t),
            i = e.get(n);
        return r && i ? r < i ? -1 : r > i ? 1 : 0 : 0
    }
}

function Pf(e) {
    return e.materialization !== `collection`
}

function Ff(e, t) {
    if (!t) return e.materialization === `array` ? [] : e.materialization === `concat` ? `` : void 0;
    if (e.materialization === `collection`) return t.collection;
    let n = [...t.collection.toArray],
        r = e.scalarField ? n.map(t => t ?.[e.scalarField]) : n;
    return e.materialization === `array` ? r : e.materialization === `singleton` ? r[0] : r.map(e => String(e ?? ``)).join(``)
}

function If(e, t) {
    return e.map(e => {
        let n = new Map;
        e.pipeline.pipe(Cs(e => {
            let r = e.getInner();
            t.messagesCount += r.length;
            for (let [
                    [e, t], i
                ] of r) {
                let [r, a, o, s] = t, c = Hf(o, s), l = n.get(c);
                l || (l = new Map, n.set(c, l));
                let u = l.get(e) || {
                    deletes: 0,
                    inserts: 0,
                    value: r,
                    orderByIndex: a
                };
                i < 0 ? u.deletes += Math.abs(i) : i > 0 && (u.inserts += i, u.value = r), l.set(e, u)
            }
        }));
        let r = {
            compilationResult: e,
            buffer: n
        };
        return e.childCompilationResult.includes && (r.nestedSetups = If(e.childCompilationResult.includes, t)), r
    })
}

function Lf(e) {
    return e.map(e => {
        let t = {
            fieldName: e.compilationResult.fieldName,
            resultPath: e.compilationResult.resultPath,
            childCorrelationField: e.compilationResult.childCorrelationField,
            hasOrderBy: e.compilationResult.hasOrderBy,
            materialization: e.compilationResult.materialization,
            scalarField: e.compilationResult.scalarField,
            childRegistry: new Map,
            pendingChildChanges: new Map,
            correlationToParentKeys: new Map
        };
        return e.nestedSetups && (t.nestedSetups = e.nestedSetups, t.nestedRoutingIndex = new Map, t.nestedRoutingReverseIndex = new Map), t
    })
}

function Rf(e) {
    let t = new Set;
    if (!e.nestedSetups) return t;
    for (let n = 0; n < e.nestedSetups.length; n++) {
        let r = e.nestedSetups[n],
            i = [];
        for (let [a, o] of r.buffer) {
            let r = e.nestedRoutingIndex.get(a);
            if (r === void 0) continue;
            let s = e.childRegistry.get(r);
            if (!s || !s.includesStates) continue;
            let c = s.includesStates[n];
            for (let [e, t] of o) {
                let n = c.pendingChildChanges.get(a);
                n || (n = new Map, c.pendingChildChanges.set(a, n));
                let r = n.get(e);
                r ? (r.inserts += t.inserts, r.deletes += t.deletes, t.inserts > 0 && (r.value = t.value, t.orderByIndex !== void 0 && (r.orderByIndex = t.orderByIndex))) : n.set(e, { ...t
                })
            }
            t.add(r), i.push(a)
        }
        for (let e of i) r.buffer.delete(e)
    }
    return t
}

function zf(e, t, n) {
    if (e.nestedSetups) {
        for (let r of e.nestedSetups)
            for (let [, i] of n)
                if (i.inserts > 0) {
                    let n = i.value[pd] ?.[r.compilationResult.fieldName],
                        a = n ?.correlationKey,
                        o = Hf(a, n ?.parentContext ?? null);
                    if (a != null) {
                        e.nestedRoutingIndex.set(o, t);
                        let n = e.nestedRoutingReverseIndex.get(t);
                        n || (n = new Set, e.nestedRoutingReverseIndex.set(t, n)), n.add(o)
                    }
                } else if (i.deletes > 0 && i.inserts === 0) {
            let n = i.value[pd] ?.[r.compilationResult.fieldName],
                a = n ?.correlationKey,
                o = Hf(a, n ?.parentContext ?? null);
            if (a != null) {
                e.nestedRoutingIndex.delete(o);
                let n = e.nestedRoutingReverseIndex.get(t);
                n && (n.delete(o), n.size === 0 && e.nestedRoutingReverseIndex.delete(t))
            }
        }
    }
}

function Bf(e, t) {
    if (!e.nestedRoutingReverseIndex) return;
    let n = e.nestedRoutingReverseIndex.get(t);
    if (n) {
        for (let t of n) e.nestedRoutingIndex.delete(t);
        e.nestedRoutingReverseIndex.delete(t)
    }
}

function Vf(e) {
    for (let t of e)
        if (t.buffer.size > 0 || t.nestedSetups && Vf(t.nestedSetups)) return !0;
    return !1
}

function Hf(e, t) {
    return t == null ? e : JSON.stringify([e, t])
}

function Uf(e, t, n, r, i) {
    let a = new WeakMap,
        o = r ? new WeakMap : null,
        s = null,
        c = o ? Nf(o) : void 0,
        l = {
            collection: Ul({
                id: `__child-collection:${e}-${t}-${Ua(n)}`,
                getKey: e => a.get(e),
                compare: c,
                sync: {
                    rowUpdateMode: `full`,
                    sync: e => (s = e, () => {
                        s = null
                    })
                },
                startSync: !0,
                gcTime: 0
            }),
            get syncMethods() {
                return s
            },
            resultKeys: a,
            orderByIndices: o
        };
    return i && (l.includesStates = Lf(i)), l
}

function Wf(e, t, n, r, i) {
    for (let a of e) {
        if (r) {
            for (let [e, i] of r)
                if (i.inserts > 0) {
                    let r = i.value,
                        o = r[pd] ?.[a.fieldName],
                        s = o ?.correlationKey,
                        c = Hf(s, o ?.parentContext ?? null);
                    if (s != null) {
                        if (!a.childRegistry.has(c)) {
                            let e = Uf(n, a.fieldName, c, a.hasOrderBy, a.nestedSetups);
                            a.childRegistry.set(c, e)
                        }
                        let i = a.correlationToParentKeys.get(c);
                        i || (i = new Set, a.correlationToParentKeys.set(c, i)), i.add(e);
                        let o = Ff(a, a.childRegistry.get(c));
                        qf(r, a.resultPath, o);
                        let s = t.get(e);
                        s && s !== r && qf(s, a.resultPath, o)
                    }
                }
        }
        let e = Pf(a) ? new Set(a.pendingChildChanges.keys()) : null,
            o = new Map;
        if (a.pendingChildChanges.size > 0) {
            for (let [e, r] of a.pendingChildChanges) {
                let i = a.childRegistry.get(e);
                if (i || (i = Uf(n, a.fieldName, e, a.hasOrderBy, a.nestedSetups), a.childRegistry.set(e, i)), a.materialization === `collection` && Kf(t, a.resultPath, e, a.correlationToParentKeys, i.collection), i.syncMethods) {
                    i.syncMethods.begin();
                    for (let [e, t] of r) i.resultKeys.set(t.value, e), i.orderByIndices && t.orderByIndex !== void 0 && i.orderByIndices.set(t.value, t.orderByIndex), t.inserts > 0 && t.deletes === 0 ? i.syncMethods.write({
                        value: t.value,
                        type: `insert`
                    }) : t.inserts > t.deletes || t.inserts === t.deletes && i.syncMethods.collection.has(i.syncMethods.collection.getKeyFromItem(t.value)) ? i.syncMethods.write({
                        value: t.value,
                        type: `update`
                    }) : t.deletes > 0 && i.syncMethods.write({
                        value: t.value,
                        type: `delete`
                    });
                    i.syncMethods.commit()
                }
                zf(a, e, r), o.set(e, {
                    entry: i,
                    childChanges: r
                })
            }
            a.pendingChildChanges.clear()
        }
        let s = Rf(a);
        for (let [, {
                entry: e,
                childChanges: t
            }] of o) e.includesStates && Wf(e.includesStates, e.collection, e.collection.id, t, e.syncMethods);
        for (let e of s) {
            if (o.has(e)) continue;
            let t = a.childRegistry.get(e);
            t ?.includesStates && Wf(t.includesStates, t.collection, t.collection.id, null, t.syncMethods)
        }
        let c = new Set;
        if (a.nestedSetups)
            for (let [e, t] of a.childRegistry) o.has(e) || s.has(e) || t.includesStates && Gf(t.includesStates) && (Wf(t.includesStates, t.collection, t.collection.id, null, t.syncMethods), c.add(e));
        let l = Pf(a) ? new Set([...e || [], ...s, ...c]) : null;
        if (i && l && l.size > 0) {
            let e = [];
            for (let n of l) {
                let r = a.correlationToParentKeys.get(n);
                if (!r) continue;
                let i = a.childRegistry.get(n);
                for (let n of r) {
                    let r = t.get(n);
                    if (r) {
                        let t = Zf(r, a.resultPath);
                        qf(r, a.resultPath, Ff(a, i));
                        let o = Zf(r, a.resultPath);
                        e.push({
                            type: `update`,
                            key: n,
                            value: o,
                            previousValue: t
                        })
                    }
                }
            }
            e.length > 0 && t._changes.emitEvents(e, !0)
        }
        if (r) {
            for (let [e, t] of r)
                if (t.deletes > 0 && t.inserts === 0) {
                    let n = t.value[pd] ?.[a.fieldName],
                        r = n ?.correlationKey,
                        i = Hf(r, n ?.parentContext ?? null);
                    if (r != null) {
                        let t = a.correlationToParentKeys.get(i);
                        t && (t.delete(e), t.size === 0 && (Bf(a, i), a.childRegistry.delete(i), a.correlationToParentKeys.delete(i)))
                    }
                }
        }
    }
    if (r)
        for (let [, e] of r) delete e.value[pd]
}

function Gf(e) {
    for (let t of e)
        if (t.pendingChildChanges.size > 0 || t.nestedSetups && Vf(t.nestedSetups)) return !0;
    return !1
}

function Kf(e, t, n, r, i) {
    let a = r.get(n);
    if (a)
        for (let n of a) {
            let r = e.get(n);
            r && qf(r, t, i)
        }
}

function qf(e, t, n) {
    let r = Jf(e);
    if (!r) {
        Xf(e, t, n);
        return
    }
    Xf(r.sourceRow, t, n), Yf(e, r)
}

function Jf(e) {
    return e[md]
}

function Yf(e, t) {
    let n = e,
        r = t.sourceRow,
        i = n[pd] ?? r[pd],
        a = t.fnSelect(t.sourceRow);
    if (!(!a || typeof a != `object`)) {
        for (let t of Object.keys(e)) delete e[t];
        Object.assign(e, a), i && (n[pd] = i), Object.defineProperty(e, md, {
            value: t,
            enumerable: !0,
            configurable: !0
        })
    }
}

function Xf(e, t, n) {
    if (t.length === 0) return;
    let r = e;
    for (let e = 0; e < t.length - 1; e++) {
        let n = t[e],
            i = r[n];
        (typeof i != `object` || !i) && (r[n] = {}), r = r[n]
    }
    r[t[t.length - 1]] = n
}

function Zf(e, t) {
    return Jf(e) ? { ...e
    } : Qf(e, t)
}

function Qf(e, t) {
    let n = { ...e
        },
        r = e,
        i = n;
    for (let e = 0; e < t.length - 1; e++) {
        let a = t[e],
            o = r ?.[a];
        if (typeof o != `object` || !o) return n;
        let s = Array.isArray(o) ? [...o] : { ...o
        };
        i[a] = s, r = o, i = s
    }
    return n
}

function $f(e, [
    [t, n], r
]) {
    let [i, a] = n, o = e.get(t) || {
        deletes: 0,
        inserts: 0,
        value: i,
        orderByIndex: a
    };
    return r < 0 ? o.deletes += Math.abs(r) : r > 0 && (o.inserts += r, o.value = i, a !== void 0 && (o.orderByIndex = a)), e.set(t, o), e
}

function ep(e) {
    return new Mf(e).getConfig()
}

function tp(e) {
    if (typeof e == `function`) return np(ep({
        query: e
    })); {
        let t = e,
            n = ep(t);
        return t.utils && (n.utils = { ...n.utils,
            ...t.utils
        }), np(n)
    }
}

function np(e) {
    let t = Ul(e),
        n = Qd(e);
    return n && $d(t, n), t
}
async function rp(e) {
    let t = typeof e == `function` ? {
            query: e
        } : e,
        n = tp({
            query: e => {
                let n = t.query;
                return typeof n == `function` ? n(e) : n
            },
            gcTime: 1
        });
    try {
        return await n.preload(), n.config.singleResult === !0 ? n.values().next().value : n.toArray
    } finally {
        await n.cleanup()
    }
}
var ip = class {
        constructor(e, t) {
            this.fn = e, this.options = t, this.canLeadingExecute = !0, this.maybeExecute = (...e) => {
                let t = !1;
                this.options.leading && this.canLeadingExecute && (this.canLeadingExecute = !1, t = !0, this.fn(...e), this.options.onExecute ?.(e, this)), this.lastArgs = e, this.timeoutId && clearTimeout(this.timeoutId), this.timeoutId = setTimeout(() => {
                    this.canLeadingExecute = !0, this.options.trailing && !t && this.lastArgs && (this.fn(...this.lastArgs), this.options.onExecute ?.(this.lastArgs, this)), this.lastArgs = void 0
                }, this.options.wait)
            }, this.flush = () => {
                if (this.timeoutId && this.lastArgs) {
                    clearTimeout(this.timeoutId), this.timeoutId = void 0;
                    let e = this.lastArgs;
                    this.fn(...e), this.options.onExecute ?.(e, this), this.lastArgs = void 0, this.canLeadingExecute = !0
                }
            }, this.cancel = () => {
                this.timeoutId &&= (clearTimeout(this.timeoutId), void 0), this.lastArgs = void 0, this.canLeadingExecute = !0
            }, this.options.leading === void 0 && this.options.trailing === void 0 && (this.options.trailing = !0)
        }
    },
    ap = class extends mr {
        constructor(e) {
            super(e), this.name = `QueryCollectionError`
        }
    },
    op = class extends ap {
        constructor() {
            super(`[QueryCollection] queryKey must be provided.`), this.name = `QueryKeyRequiredError`
        }
    },
    sp = class extends ap {
        constructor() {
            super(`[QueryCollection] queryFn must be provided.`), this.name = `QueryFnRequiredError`
        }
    },
    cp = class extends ap {
        constructor() {
            super(`[QueryCollection] queryClient must be provided.`), this.name = `QueryClientRequiredError`
        }
    },
    lp = class extends ap {
        constructor() {
            super(`[QueryCollection] getKey must be provided.`), this.name = `GetKeyRequiredError`
        }
    },
    up = class extends ap {
        constructor() {
            super(`Collection must be in 'ready' state for manual sync operations. Sync not initialized yet.`), this.name = `SyncNotInitializedError`
        }
    },
    dp = class extends ap {
        constructor(e) {
            super(`Duplicate key '${e}' found within batch operations`), this.name = `DuplicateKeyInBatchError`
        }
    },
    fp = class extends ap {
        constructor(e) {
            super(`Update operation: Item with key '${e}' does not exist`), this.name = `UpdateOperationItemNotFoundError`
        }
    },
    pp = class extends ap {
        constructor(e) {
            super(`Delete operation: Item with key '${e}' does not exist`), this.name = `DeleteOperationItemNotFoundError`
        }
    },
    mp = new WeakMap;

function hp(e, t) {
    let n = Array.isArray(e) ? e : [e],
        r = [];
    for (let e of n)
        if (e.type === `delete`) {
            let t = Array.isArray(e.key) ? e.key : [e.key];
            for (let e of t) r.push({
                type: `delete`,
                key: e
            })
        } else {
            let n = Array.isArray(e.data) ? e.data : [e.data];
            for (let i of n) {
                let n;
                if (e.type === `update`) n = t.getKey(i);
                else {
                    let r = t.collection.validateData(i, e.type === `upsert` ? `insert` : e.type);
                    n = t.getKey(r)
                }
                r.push({
                    type: e.type,
                    key: n,
                    data: i
                })
            }
        }
    return r
}

function gp(e, t) {
    let n = new Set;
    for (let r of e) {
        if (n.has(r.key)) throw new dp(r.key);
        if (n.add(r.key), r.type === `update`) {
            if (!t.collection._state.syncedData.has(r.key)) throw new fp(r.key)
        } else if (r.type === `delete` && !t.collection._state.syncedData.has(r.key)) throw new pp(r.key)
    }
}

function _p(e, t) {
    let n = hp(e, t);
    gp(n, t), t.begin({
        immediate: !0
    });
    for (let e of n) switch (e.type) {
        case `insert`:
            {
                let n = t.collection.validateData(e.data, `insert`);t.write({
                    type: `insert`,
                    value: n
                });
                break
            }
        case `update`:
            {
                let n = { ...t.collection._state.syncedData.get(e.key),
                        ...e.data
                    },
                    r = t.collection.validateData(n, `update`, e.key);t.write({
                    type: `update`,
                    value: r
                });
                break
            }
        case `delete`:
            {
                let n = t.collection._state.syncedData.get(e.key);t.write({
                    type: `delete`,
                    value: n
                });
                break
            }
        case `upsert`:
            {
                let n = t.collection._state.syncedData.has(e.key),
                    r = t.collection.validateData(e.data, n ? `update` : `insert`, e.key);n ? t.write({
                    type: `update`,
                    value: r
                }) : t.write({
                    type: `insert`,
                    value: r
                });
                break
            }
    }
    t.commit();
    let r = Array.from(t.collection._state.syncedData.values());
    t.updateCacheData ? t.updateCacheData(r) : t.queryClient.setQueryData(t.queryKey, r)
}

function vp(e) {
    function t() {
        let t = e();
        if (!t) throw new up;
        return t
    }
    return {
        writeInsert(e) {
            let n = {
                    type: `insert`,
                    data: e
                },
                r = t(),
                i = mp.get(r);
            if (i ?.isActive) {
                i.operations.push(n);
                return
            }
            _p(n, r)
        },
        writeUpdate(e) {
            let n = {
                    type: `update`,
                    data: e
                },
                r = t(),
                i = mp.get(r);
            if (i ?.isActive) {
                i.operations.push(n);
                return
            }
            _p(n, r)
        },
        writeDelete(e) {
            let n = {
                    type: `delete`,
                    key: e
                },
                r = t(),
                i = mp.get(r);
            if (i ?.isActive) {
                i.operations.push(n);
                return
            }
            _p(n, r)
        },
        writeUpsert(e) {
            let n = {
                    type: `upsert`,
                    data: e
                },
                r = t(),
                i = mp.get(r);
            if (i ?.isActive) {
                i.operations.push(n);
                return
            }
            _p(n, r)
        },
        writeBatch(e) {
            let n = t();
            if (mp.get(n) ?.isActive) throw Error(`Cannot nest writeBatch calls. Complete the current batch before starting a new one.`);
            let r = {
                operations: [],
                isActive: !0
            };
            mp.set(n, r);
            try {
                let t = e();
                if (t && typeof t == `object` && `then` in t && typeof t.then == `function`) throw Error(`writeBatch does not support async callbacks. The callback must be synchronous.`);
                r.operations.length > 0 && _p(r.operations, n)
            } finally {
                r.isActive = !1, mp.delete(n)
            }
        }
    }
}

function yp(e) {
    if (!e) return;
    let t = {};
    return e.where && (t.where = bp(e.where)), e.orderBy ?.length && (t.orderBy = e.orderBy.map(e => {
        let t = {
            expression: bp(e.expression),
            direction: e.compareOptions.direction,
            nulls: e.compareOptions.nulls,
            stringSort: e.compareOptions.stringSort
        };
        return e.compareOptions.stringSort === `locale` ? { ...t,
            locale: e.compareOptions.locale,
            localeOptions: e.compareOptions.localeOptions
        } : t
    })), e.limit !== void 0 && (t.limit = e.limit), e.offset !== void 0 && (t.offset = e.offset), Object.keys(t).length === 0 ? void 0 : JSON.stringify(t)
}

function bp(e) {
    if (!e) return null;
    switch (e.type) {
        case `val`:
            return {
                type: `val`,
                value: xp(e.value)
            };
        case `ref`:
            return {
                type: `ref`,
                path: [...e.path]
            };
        case `func`:
            return {
                type: `func`,
                name: e.name,
                args: e.args.map(e => bp(e))
            };
        default:
            return null
    }
}

function xp(e) {
    if (e === void 0) return {
        __type: `undefined`
    };
    if (typeof e == `number`) {
        if (Number.isNaN(e)) return {
            __type: `nan`
        };
        if (e === 1 / 0) return {
            __type: `infinity`,
            sign: 1
        };
        if (e === -1 / 0) return {
            __type: `infinity`,
            sign: -1
        }
    }
    return e === null || typeof e == `string` || typeof e == `number` || typeof e == `boolean` ? e : e instanceof Date ? {
        __type: `date`,
        value: e.toJSON()
    } : Array.isArray(e) ? e.map(e => xp(e)) : typeof e == `object` ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, xp(t)])) : e
}
var Sp = `queryCollection:gc:`,
    Cp = class {
        constructor(e, t, n) {
            this.state = e, this.refetchFn = t, this.refetch = t, this.writeInsert = n.writeInsert, this.writeUpdate = n.writeUpdate, this.writeDelete = n.writeDelete, this.writeUpsert = n.writeUpsert, this.writeBatch = n.writeBatch
        }
        async clearError() {
            this.state.lastError = void 0, this.state.errorCount = 0, this.state.lastErrorUpdatedAt = 0, await this.refetchFn({
                throwOnError: !0
            })
        }
        get lastError() {
            return this.state.lastError
        }
        get isError() {
            return !!this.state.lastError
        }
        get errorCount() {
            return this.state.errorCount
        }
        get isFetching() {
            return Array.from(this.state.observers.values()).some(e => e.getCurrentResult().isFetching)
        }
        get isRefetching() {
            return Array.from(this.state.observers.values()).some(e => e.getCurrentResult().isRefetching)
        }
        get isLoading() {
            return Array.from(this.state.observers.values()).some(e => e.getCurrentResult().isLoading)
        }
        get dataUpdatedAt() {
            return Math.max(0, ...Array.from(this.state.observers.values()).map(e => e.getCurrentResult().dataUpdatedAt))
        }
        get fetchStatus() {
            return Array.from(this.state.observers.values()).map(e => e.getCurrentResult().fetchStatus)
        }
    };

function wp(e) {
    let {
        queryKey: t,
        queryFn: n,
        select: r,
        queryClient: i,
        enabled: a,
        refetchInterval: o,
        retry: s,
        retryDelay: c,
        staleTime: l,
        gcTime: u,
        persistedGcTime: d,
        getKey: f,
        onInsert: p,
        onUpdate: m,
        onDelete: h,
        meta: g,
        ..._
    } = e, v = _.syncMode ?? `eager`, y = typeof t == `function` ? t({}) : t, b = e => {
        typeof t == `function` && (e.length >= y.length && y.every((t, n) => Li(t, e[n])) || console.warn(`[QueryCollection] queryKey function must return keys that extend the base key prefix. Base: ${JSON.stringify(y)}, Got: ${JSON.stringify(e)}. This can cause stale cache issues.`))
    };
    if (!t) throw new op;
    if (!n) throw new sp;
    if (!i) throw new cp;
    if (!f) throw new lp;
    let x = {
            lastError: void 0,
            errorCount: 0,
            lastErrorUpdatedAt: 0,
            observers: new Map
        },
        S = new Map,
        C = new Map,
        w = new Map,
        T = new Map,
        E = new Map,
        D = (e, t) => {
            let n = w.get(e) || new Set;
            n.add(t), w.set(e, n);
            let r = C.get(t) || new Set;
            r.add(e), C.set(t, r)
        },
        ee = (e, t) => {
            let n = w.get(e) || new Set;
            n.delete(t), w.set(e, n);
            let r = C.get(t) || new Set;
            return r.delete(e), C.set(t, r), n.size === 0
        },
        O = e => {
            let {
                begin: p,
                write: m,
                commit: h,
                markReady: _,
                collection: y,
                metadata: O
            } = e, te = O, ne = !1, re = !1, k = new Set, A = new Map, ie = new Map, ae = Promise.resolve(), j = e => O ?.row.get(e) ?? y._state.syncedMetadata.get(e), M = e => {
                let t = j(e) ?.queryCollection;
                if (!t || typeof t != `object`) return new Set;
                let n = t.owners;
                return !n || typeof n != `object` ? new Set : new Set(Object.keys(n))
            }, N = (e, t) => {
                if (!O) return;
                let n = { ...j(e) ?? {}
                };
                if (t.size === 0) {
                    delete n.queryCollection, Object.keys(n).length === 0 ? O.row.delete(e) : O.row.set(e, n);
                    return
                }
                O.row.set(e, { ...n,
                    queryCollection: {
                        owners: Object.fromEntries(Array.from(t.values()).map(e => [e, !0]))
                    }
                })
            }, oe = (e, t) => {
                if (!e || typeof e != `object`) return;
                let n = e;
                if (n.queryHash === t) {
                    if (n.mode === `until-revalidated`) return {
                        queryHash: t,
                        mode: `until-revalidated`
                    };
                    if (n.mode === `ttl` && typeof n.expiresAt == `number` && Number.isFinite(n.expiresAt)) return {
                        queryHash: t,
                        mode: `ttl`,
                        expiresAt: n.expiresAt
                    }
                }
            }, se = e => (ae = ae.then(e, e), ae), P = e => {
                let t = ie.get(e);
                t && (clearTimeout(t), ie.delete(e))
            }, ce = e => {
                let t = C.get(e);
                if (t) return new Set(t);
                let n = new Set;
                for (let [t] of y._state.syncedData.entries()) {
                    let r = M(t);
                    r.size !== 0 && (w.set(t, new Set(r)), r.forEach(e => {
                        let n = C.get(e) || new Set;
                        n.add(t), C.set(e, n)
                    }), r.has(e) && n.add(t))
                }
                return n
            }, le = async e => {
                let t = C.get(e);
                if (t && Array.from(t).every(e => y.has(e))) {
                    let e = new Map;
                    return t.forEach(t => {
                        let n = y.get(t),
                            r = w.get(t);
                        n && r && e.set(t, {
                            value: n,
                            owners: new Set(r)
                        })
                    }), e
                }
                let n = te ?.row.scanPersisted;
                if (!n) {
                    let t = new Map;
                    return ce(e).forEach(e => {
                        let n = y.get(e),
                            r = w.get(e);
                        n && r && t.set(e, {
                            value: n,
                            owners: new Set(r)
                        })
                    }), t
                }
                let r = new Map;
                return (await n()).forEach(t => {
                    let n = t.metadata ?.queryCollection;
                    if (!n || typeof n != `object`) return;
                    let i = n.owners;
                    if (!i || typeof i != `object`) return;
                    let a = new Set(Object.keys(i));
                    a.size !== 0 && (w.set(t.key, new Set(a)), a.forEach(e => {
                        let n = C.get(e) || new Set;
                        n.add(t.key), C.set(e, n)
                    }), a.has(e) && r.set(t.key, {
                        value: t.value,
                        owners: a
                    }))
                }), r
            }, ue = async e => {
                if (!O) return;
                let t = await le(e),
                    n = [];
                p(), t.forEach(({
                    value: t,
                    owners: r
                }, i) => {
                    r.delete(e), N(i, r), ee(i, e) && n.push(t)
                }), n.forEach(e => {
                    m({
                        type: `delete`,
                        value: e
                    })
                }), O.collection.delete(`${Sp}${e}`), h()
            }, F = e => {
                if (e.mode !== `ttl`) return;
                P(e.queryHash);
                let t = Math.max(0, e.expiresAt - Date.now()),
                    n = setTimeout(() => {
                        ie.delete(e.queryHash), se(async () => {
                            let t = O ?.collection.get(`${Sp}${e.queryHash}`),
                                n = oe(t, e.queryHash);
                            !n || n.mode !== `ttl` || n.expiresAt > Date.now() || await ue(e.queryHash)
                        })
                    }, t);
                ie.set(e.queryHash, n)
            }, de = async () => {
                if (!O) return;
                let e = O.collection.list(Sp),
                    t = Date.now();
                for (let {
                        key: n,
                        value: r
                    } of e) {
                    let e = oe(r, n.slice(Sp.length));
                    e && (e.mode === `ttl` && e.expiresAt <= t ? await ue(e.queryHash) : e.mode === `ttl` && F(e))
                }
            }, fe = e => {
                if (typeof t == `function`) return t(e);
                if (v === `on-demand`) {
                    let n = yp(e);
                    return n === void 0 ? t : [...t, n]
                } else return t
            }, pe = O ?.collection.list(Sp), me = !pe || pe.length === 0 ? (re = !0, Promise.resolve()) : se(async () => {
                try {
                    await de()
                } finally {
                    re = !0
                }
            }), I = (e = {}, t = n) => {
                if (!re) return me.then(() => {
                    let n = I(e, t);
                    return n === !0 ? void 0 : n
                });
                let r = fe(e),
                    f = en(r),
                    p = { ...g,
                        loadSubsetOptions: e
                    },
                    m = O ?.collection.get(`${Sp}${f}`);
                if (oe(m, f) !== void 0 && k.add(f), P(f), b(r), x.observers.has(f)) {
                    E.set(f, (E.get(f) || 0) + 1);
                    let e = x.observers.get(f),
                        t = e.getCurrentResult();
                    return t.isSuccess ? !0 : t.isError ? Promise.reject(t.error) : i.getQueryData(r) === void 0 ? new Promise((t, n) => {
                        let r = e.subscribe(e => {
                            queueMicrotask(() => {
                                e.isSuccess ? (r(), t()) : e.isError && (r(), n(e.error))
                            })
                        })
                    }) : !0
                }
                let h = new zn(i, {
                        queryKey: r,
                        queryFn: t,
                        meta: p,
                        structuralSharing: !0,
                        notifyOnChangeProps: `all`,
                        ...a !== void 0 && {
                            enabled: a
                        },
                        ...o !== void 0 && {
                            refetchInterval: o
                        },
                        ...s !== void 0 && {
                            retry: s
                        },
                        ...c !== void 0 && {
                            retryDelay: c
                        },
                        ...l !== void 0 && {
                            staleTime: l
                        },
                        ...u !== void 0 && {
                            gcTime: u
                        }
                    }),
                    _ = i.getQueryCache().find({
                        queryKey: r,
                        exact: !0
                    }) ?.gcTime,
                    v = d ?? _;
                if (S.set(f, r), x.observers.set(f, h), v === void 0 ? A.delete(f) : A.set(f, v), E.set(f, (E.get(f) || 0) + 1), i.getQueryData(r) !== void 0) return (ne || y.subscriberCount > 0) && ve(h, f), !0;
                let C = new Promise((e, t) => {
                    let n = h.subscribe(r => {
                        queueMicrotask(() => {
                            r.isSuccess ? (n(), e()) : r.isError && (n(), t(r.error))
                        })
                    })
                });
                return (ne || y.subscriberCount > 0) && ve(h, f), C
            }, he = (e, t, n) => {
                let i = en(e);
                if (y.status === `cleaned-up`) return;
                x.lastError = void 0, x.errorCount = 0;
                let a = t.data,
                    o = r ? r(a) : a;
                if (!Array.isArray(o) || o.some(e => typeof e != `object`)) {
                    let t = r ? `@tanstack/query-db-collection: select() must return an array of objects. Got: ${typeof o} for queryKey ${JSON.stringify(e)}` : `@tanstack/query-db-collection: queryFn must return an array of objects. Got: ${typeof o} for queryKey ${JSON.stringify(e)}`;
                    console.error(t);
                    return
                }
                let s = new Map(y._state.syncedData.entries()),
                    c = n !== void 0,
                    l = c ? new Set(n.keys()) : ce(i),
                    u = new Map;
                o.forEach(e => {
                    let t = f(e);
                    u.set(t, e)
                }), p(), O && O.collection.delete(`${Sp}${i}`), l.forEach(e => {
                    let t = c ? n.get(e) ?.value : s.get(e);
                    if (!t) return;
                    let r = u.get(e);
                    if (r) Li(t, r) || m({
                        type: `update`,
                        value: r
                    });
                    else {
                        let n = M(e);
                        n.delete(i), N(e, n), ee(e, i) && m({
                            type: `delete`,
                            value: t
                        })
                    }
                }), u.forEach((e, t) => {
                    let n = M(t);
                    n.has(i) || (n.add(i), N(t, n)), D(t, i), s.has(t) || m({
                        type: `insert`,
                        value: e
                    })
                }), h(), k.delete(i), P(i), _()
            }, ge = async (e, t) => {
                let n = await le(en(e));
                y.status !== `cleaned-up` && he(e, t, n)
            }, L = e => {
                let t = en(e);
                return n => {
                    if (n.isSuccess) {
                        if (y.deferDataRefresh) {
                            y.deferDataRefresh.then(() => {
                                let e = x.observers.get(t);
                                e && e.refetch().catch(() => {})
                            });
                            return
                        }
                        k.has(t) ? ge(e, n).catch(t => {
                            console.error(`[QueryCollection] Error reconciling query ${String(e)}:`, t)
                        }) : he(e, n)
                    } else n.isError && ((n.errorUpdatedAt !== x.lastErrorUpdatedAt || n.error !== x.lastError) && (x.lastError = n.error, x.errorCount++, x.lastErrorUpdatedAt = n.errorUpdatedAt), console.error(`[QueryCollection] Error observing query ${String(e)}:`, n.error), _())
                }
            }, _e = e => T.has(e), ve = (e, t) => {
                if (!_e(t)) {
                    let n = L(S.get(t)),
                        r = e.subscribe(n);
                    T.set(t, r);
                    let i = e.getCurrentResult();
                    (i.isSuccess || i.isError) && n(i)
                }
            }, ye = () => {
                x.observers.forEach(ve)
            }, be = () => {
                T.forEach(e => {
                    e()
                }), T.clear()
            };
            ne = !0;
            let xe = y.on(`subscribers:change`, ({
                subscriberCount: e
            }) => {
                e > 0 ? ye() : e === 0 && be()
            });
            if (v === `eager`) {
                let e = I({});
                e instanceof Promise && e.catch(() => {})
            } else re ? _() : me.then(() => {
                _()
            });
            ye(), x.observers.forEach((e, t) => {
                L(S.get(t))(e.getCurrentResult())
            });
            let Se = e => {
                    T.get(e) ?.(), T.delete(e), P(e), k.delete(e);
                    let t = C.get(e) ?? new Set,
                        n = new Map,
                        r = [];
                    t.forEach(t => {
                        let i = w.get(t);
                        if (!i) return;
                        let a = new Set(i);
                        a.delete(e), n.set(t, a), a.size === 0 && y.has(t) && r.push(y.get(t))
                    });
                    let i = O !== void 0 && n.size > 0,
                        a = i || r.length > 0;
                    a && p(), n.forEach((e, t) => {
                        e.size === 0 ? w.delete(t) : w.set(t, e), i && N(t, e)
                    }), r.length > 0 && r.forEach(e => {
                        m({
                            type: `delete`,
                            value: e
                        })
                    }), a && h(), x.observers.delete(e), C.delete(e), S.delete(e), E.delete(e), A.delete(e)
                },
                Ce = e => {
                    let t = E.get(e) || 0,
                        n = x.observers.get(e),
                        r = A.get(e);
                    if (t <= 0 && (T.get(e) ?.(), T.delete(e)), n ?.hasListeners() ?? !1) {
                        E.set(e, 0);
                        return
                    }
                    if (t > 0 && console.warn(`[cleanupQueryIfIdle] Invariant violation: refcount=${t} but no listeners. Cleaning up to prevent leak.`, {
                            hashedQueryKey: e
                        }), r !== void 0 && O && te ?.row.scanPersisted) {
                        p(), O.collection.set(`${Sp}${e}`, {
                            queryHash: e,
                            mode: r === 1 / 0 ? `until-revalidated` : `ttl`,
                            ...r === 1 / 0 ? {} : {
                                expiresAt: Date.now() + r
                            }
                        }), h(), r !== 1 / 0 && F({
                            queryHash: e,
                            mode: `ttl`,
                            expiresAt: Date.now() + r
                        }), T.get(e) ?.(), T.delete(e), x.observers.delete(e), S.delete(e), E.set(e, 0);
                        return
                    }
                    Se(e)
                },
                we = e => {
                    Se(e)
                },
                Te = i.getQueryCache().subscribe(e => {
                    let t = e.query.queryHash;
                    e.type === `removed` && S.has(t) && Ce(t)
                });
            return {
                loadSubset: v === `eager` ? void 0 : I,
                unloadSubset: v === `eager` ? void 0 : e => {
                    let t = en(fe(e)),
                        n = (E.get(t) || 0) - 1;
                    n <= 0 ? (E.set(t, 0), Ce(t)) : E.set(t, n)
                },
                cleanup: async () => {
                    xe(), be(), ie.forEach(e => {
                        clearTimeout(e)
                    }), ie.clear();
                    let e = [...S.values()],
                        t = [...x.observers.keys()];
                    for (let e of t) we(e);
                    Te(), await Promise.all(e.map(async e => {
                        await i.cancelQueries({
                            queryKey: e,
                            exact: !0
                        }), i.removeQueries({
                            queryKey: e,
                            exact: !0
                        })
                    }))
                }
            }
        },
        te = async e => {
            let t = [...S.values()].map(t => x.observers.get(en(t)).refetch({
                throwOnError: e ?.throwOnError
            }));
            return Promise.all(t)
        },
        ne = (e, t) => {
            r ? i.setQueryData(e, e => {
                if (!e || typeof e != `object`) return e;
                if (Array.isArray(e)) return t;
                let n = r(e);
                if (Array.isArray(n)) {
                    for (let r of Object.keys(e))
                        if (e[r] === n) return { ...e,
                            [r]: t
                        }
                }
                if (Array.isArray(e.data)) return { ...e,
                    data: t
                };
                if (Array.isArray(e.items)) return { ...e,
                    items: t
                };
                if (Array.isArray(e.results)) return { ...e,
                    results: t
                };
                for (let n of Object.keys(e))
                    if (Array.isArray(e[n])) return { ...e,
                        [n]: t
                    };
                return e
            }) : i.setQueryData(e, t)
        },
        re = e => {
            let t = i.getQueryCache().findAll({
                queryKey: y
            });
            if (t.length > 0)
                for (let n of t) ne(n.queryKey, e);
            else ne(y, e)
        },
        k = null,
        A = e => {
            let {
                begin: n,
                write: r,
                commit: a,
                collection: o
            } = e;
            return k = {
                collection: o,
                queryClient: i,
                queryKey: typeof t == `function` ? t({}) : t,
                getKey: f,
                begin: n,
                write: r,
                commit: a,
                updateCacheData: re
            }, O(e)
        },
        ie = vp(() => k),
        ae = p ? async e => {
            let t = await p(e) ?? {};
            return t.refetch !== !1 && await te(), t
        } : void 0,
        j = m ? async e => {
            let t = await m(e) ?? {};
            return t.refetch !== !1 && await te(), t
        } : void 0,
        M = h ? async e => {
            let t = await h(e) ?? {};
            return t.refetch !== !1 && await te(), t
        } : void 0,
        N = new Cp(x, te, ie);
    return { ..._,
        getKey: f,
        syncMode: v,
        sync: {
            sync: A
        },
        onInsert: ae,
        onUpdate: j,
        onDelete: M,
        utils: N
    }
}
var Tp = new Set([`className`, `value`, `readOnly`, `noValidate`, `formNoValidate`, `isMap`, `noModule`, `playsInline`, `adAuctionHeaders`, `allowFullscreen`, `browsingTopics`, `defaultChecked`, `defaultMuted`, `defaultSelected`, `disablePictureInPicture`, `disableRemotePlayback`, `preservesPitch`, `shadowRootClonable`, `shadowRootCustomElementRegistry`, `shadowRootDelegatesFocus`, `shadowRootSerializable`, `sharedStorageWritable`, ...`allowfullscreen.async.alpha.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.hidden.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.adauctionheaders.browsingtopics.credentialless.defaultchecked.defaultmuted.defaultselected.defer.disablepictureinpicture.disableremoteplayback.preservespitch.shadowrootclonable.shadowrootcustomelementregistry.shadowrootdelegatesfocus.shadowrootserializable.sharedstoragewritable`.split(`.`)]),
    Ep = new Set([`innerHTML`, `textContent`, `innerText`, `children`]),
    Dp = Object.assign(Object.create(null), {
        className: `class`,
        htmlFor: `for`
    }),
    Op = Object.assign(Object.create(null), {
        class: `className`,
        novalidate: {
            $: `noValidate`,
            FORM: 1
        },
        formnovalidate: {
            $: `formNoValidate`,
            BUTTON: 1,
            INPUT: 1
        },
        ismap: {
            $: `isMap`,
            IMG: 1
        },
        nomodule: {
            $: `noModule`,
            SCRIPT: 1
        },
        playsinline: {
            $: `playsInline`,
            VIDEO: 1
        },
        readonly: {
            $: `readOnly`,
            INPUT: 1,
            TEXTAREA: 1
        },
        adauctionheaders: {
            $: `adAuctionHeaders`,
            IFRAME: 1
        },
        allowfullscreen: {
            $: `allowFullscreen`,
            IFRAME: 1
        },
        browsingtopics: {
            $: `browsingTopics`,
            IMG: 1
        },
        defaultchecked: {
            $: `defaultChecked`,
            INPUT: 1
        },
        defaultmuted: {
            $: `defaultMuted`,
            AUDIO: 1,
            VIDEO: 1
        },
        defaultselected: {
            $: `defaultSelected`,
            OPTION: 1
        },
        disablepictureinpicture: {
            $: `disablePictureInPicture`,
            VIDEO: 1
        },
        disableremoteplayback: {
            $: `disableRemotePlayback`,
            AUDIO: 1,
            VIDEO: 1
        },
        preservespitch: {
            $: `preservesPitch`,
            AUDIO: 1,
            VIDEO: 1
        },
        shadowrootclonable: {
            $: `shadowRootClonable`,
            TEMPLATE: 1
        },
        shadowrootdelegatesfocus: {
            $: `shadowRootDelegatesFocus`,
            TEMPLATE: 1
        },
        shadowrootserializable: {
            $: `shadowRootSerializable`,
            TEMPLATE: 1
        },
        sharedstoragewritable: {
            $: `sharedStorageWritable`,
            IFRAME: 1,
            IMG: 1
        }
    });

function kp(e, t) {
    let n = Op[e];
    return typeof n == `object` ? n[t] ? n.$ : void 0 : n
}
var Ap = new Set([`beforeinput`, `click`, `dblclick`, `contextmenu`, `focusin`, `focusout`, `input`, `keydown`, `keyup`, `mousedown`, `mousemove`, `mouseout`, `mouseover`, `mouseup`, `pointerdown`, `pointermove`, `pointerout`, `pointerover`, `pointerup`, `touchend`, `touchmove`, `touchstart`]),
    jp = new Set(`altGlyph.altGlyphDef.altGlyphItem.animate.animateColor.animateMotion.animateTransform.circle.clipPath.color-profile.cursor.defs.desc.ellipse.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feDropShadow.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.filter.font.font-face.font-face-format.font-face-name.font-face-src.font-face-uri.foreignObject.g.glyph.glyphRef.hkern.image.line.linearGradient.marker.mask.metadata.missing-glyph.mpath.path.pattern.polygon.polyline.radialGradient.rect.set.stop.svg.switch.symbol.text.textPath.tref.tspan.use.view.vkern`.split(`.`)),
    Mp = {
        xlink: `http://www.w3.org/1999/xlink`,
        xml: `http://www.w3.org/XML/1998/namespace`
    },
    Np = e => F(() => e());

function Pp(e, t, n) {
    let r = n.length,
        i = t.length,
        a = r,
        o = 0,
        s = 0,
        c = t[i - 1].nextSibling,
        l = null;
    for (; o < i || s < a;) {
        if (t[o] === n[s]) {
            o++, s++;
            continue
        }
        for (; t[i - 1] === n[a - 1];) i--, a--;
        if (i === o) {
            let t = a < r ? s ? n[s - 1].nextSibling : n[a - s] : c;
            for (; s < a;) e.insertBefore(n[s++], t)
        } else if (a === s)
            for (; o < i;)(!l || !l.has(t[o])) && t[o].remove(), o++;
        else if (t[o] === n[a - 1] && n[s] === t[i - 1]) {
            let r = t[--i].nextSibling;
            e.insertBefore(n[s++], t[o++].nextSibling), e.insertBefore(n[--a], r), t[i] = n[a]
        } else {
            if (!l) {
                l = new Map;
                let e = s;
                for (; e < a;) l.set(n[e], e++)
            }
            let r = l.get(t[o]);
            if (r != null)
                if (s < r && r < a) {
                    let c = o,
                        u = 1,
                        d;
                    for (; ++c < i && c < a && !((d = l.get(t[c])) == null || d !== r + u);) u++;
                    if (u > r - s) {
                        let i = t[o];
                        for (; s < r;) e.insertBefore(n[s++], i)
                    } else e.replaceChild(n[s++], t[o++])
                } else o++;
            else t[o++].remove()
        }
    }
}
var Fp = `_$DX_DELEGATE`;

function Ip(e, t, n, r = {}) {
    let i;
    return se(r => {
        i = r, t === document ? e() : Yp(t, e(), t.firstChild ? null : void 0, n)
    }, r.owner), () => {
        i(), t.textContent = ``
    }
}

function Lp(e, t, n, r) {
    let i, a = () => {
            let t = r ? document.createElementNS(`http://www.w3.org/1998/Math/MathML`, `template`) : document.createElement(`template`);
            return t.innerHTML = e, n ? t.content.firstChild.firstChild : r ? t.firstChild : t.content.firstChild
        },
        o = t ? () => I(() => document.importNode(i ||= a(), !0)) : () => (i ||= a()).cloneNode(!0);
    return o.cloneNode = o, o
}

function Rp(e, t = window.document) {
    let n = t[Fp] || (t[Fp] = new Set);
    for (let r = 0, i = e.length; r < i; r++) {
        let i = e[r];
        n.has(i) || (n.add(i), t.addEventListener(i, nm))
    }
}

function zp(e, t, n) {
    Qp(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n))
}

function Bp(e, t, n, r) {
    Qp(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r))
}

function Vp(e, t, n) {
    Qp(e) || (n ? e.setAttribute(t, ``) : e.removeAttribute(t))
}

function Hp(e, t) {
    Qp(e) || (t == null ? e.removeAttribute(`class`) : e.className = t)
}

function Up(e, t, n, r) {
    if (r) Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
    else if (Array.isArray(n)) {
        let r = n[0];
        e.addEventListener(t, n[0] = t => r.call(e, n[1], t))
    } else e.addEventListener(t, n, typeof n != `function` && n)
}

function Wp(e, t, n = {}) {
    let r = Object.keys(t || {}),
        i = Object.keys(n),
        a, o;
    for (a = 0, o = i.length; a < o; a++) {
        let r = i[a];
        !r || r === `undefined` || t[r] || (em(e, r, !1), delete n[r])
    }
    for (a = 0, o = r.length; a < o; a++) {
        let i = r[a],
            o = !!t[i];
        !i || i === `undefined` || n[i] === o || !o || (em(e, i, !0), n[i] = o)
    }
    return n
}

function Gp(e, t, n) {
    if (!t) return n ? zp(e, `style`) : t;
    let r = e.style;
    if (typeof t == `string`) return r.cssText = t;
    typeof n == `string` && (r.cssText = n = void 0), n ||= {}, t ||= {};
    let i, a;
    for (a in n) t[a] ?? r.removeProperty(a), delete n[a];
    for (a in t) i = t[a], i !== n[a] && (r.setProperty(a, i), n[a] = i);
    return n
}

function Kp(e, t, n) {
    n == null ? e.style.removeProperty(t) : e.style.setProperty(t, n)
}

function qp(e, t = {}, n, r) {
    let i = {};
    return r || le(() => i.children = rm(e, t.children, i.children)), le(() => typeof t.ref == `function` && Jp(t.ref, e)), le(() => Xp(e, t, n, !0, i, !0)), i
}

function Jp(e, t, n) {
    return I(() => e(t, n))
}

function Yp(e, t, n, r) {
    if (n !== void 0 && !r && (r = []), typeof t != `function`) return rm(e, t, r, n);
    le(r => rm(e, t(), r, n), r)
}

function Xp(e, t, n, r, i = {}, a = !1) {
    t ||= {};
    for (let r in i)
        if (!(r in t)) {
            if (r === `children`) continue;
            i[r] = tm(e, r, null, i[r], n, a, t)
        }
    for (let o in t) {
        if (o === `children`) {
            r || rm(e, t.children);
            continue
        }
        let s = t[o];
        i[o] = tm(e, o, s, i[o], n, a, t)
    }
}

function Zp(e) {
    let t, n;
    return !Qp() || !(t = v.registry.get(n = sm())) ? e() : (v.completed && v.completed.add(t), v.registry.delete(n), t)
}

function Qp(e) {
    return !!v.context && !v.done && (!e || e.isConnected)
}

function $p(e) {
    return e.toLowerCase().replace(/-([a-z])/g, (e, t) => t.toUpperCase())
}

function em(e, t, n) {
    let r = t.trim().split(/\s+/);
    for (let t = 0, i = r.length; t < i; t++) e.classList.toggle(r[t], n)
}

function tm(e, t, n, r, i, a, o) {
    let s, c, l, u, d;
    if (t === `style`) return Gp(e, n, r);
    if (t === `classList`) return Wp(e, n, r);
    if (n === r) return r;
    if (t === `ref`) a || n(e);
    else if (t.slice(0, 3) === `on:`) {
        let i = t.slice(3);
        r && e.removeEventListener(i, r, typeof r != `function` && r), n && e.addEventListener(i, n, typeof n != `function` && n)
    } else if (t.slice(0, 10) === `oncapture:`) {
        let i = t.slice(10);
        r && e.removeEventListener(i, r, !0), n && e.addEventListener(i, n, !0)
    } else if (t.slice(0, 2) === `on`) {
        let i = t.slice(2).toLowerCase(),
            a = Ap.has(i);
        if (!a && r) {
            let t = Array.isArray(r) ? r[0] : r;
            e.removeEventListener(i, t)
        }(a || n) && (Up(e, i, n, a), a && Rp([i]))
    } else if (t.slice(0, 5) === `attr:`) zp(e, t.slice(5), n);
    else if (t.slice(0, 5) === `bool:`) Vp(e, t.slice(5), n);
    else if ((d = t.slice(0, 5) === `prop:`) || (l = Ep.has(t)) || !i && ((u = kp(t, e.tagName)) || (c = Tp.has(t))) || (s = e.nodeName.includes(`-`) || `is` in o)) {
        if (d) t = t.slice(5), c = !0;
        else if (Qp(e)) return n;
        t === `class` || t === `className` ? Hp(e, n) : s && !c && !l ? e[$p(t)] = n : e[u || t] = n
    } else {
        let r = i && t.indexOf(`:`) > -1 && Mp[t.split(`:`)[0]];
        r ? Bp(e, r, t, n) : zp(e, Dp[t] || t, n)
    }
    return n
}

function nm(e) {
    if (v.registry && v.events && v.events.find(([t, n]) => n === e)) return;
    let t = e.target,
        n = `$$${e.type}`,
        r = e.target,
        i = e.currentTarget,
        a = t => Object.defineProperty(e, `target`, {
            configurable: !0,
            value: t
        }),
        o = () => {
            let r = t[n];
            if (r && !t.disabled) {
                let i = t[`${n}Data`];
                if (i === void 0 ? r.call(t, e) : r.call(t, i, e), e.cancelBubble) return
            }
            return t.host && typeof t.host != `string` && !t.host._$host && t.contains(e.target) && a(t.host), !0
        },
        s = () => {
            for (; o() && (t = t._$host || t.parentNode || t.host););
        };
    if (Object.defineProperty(e, `currentTarget`, {
            configurable: !0,
            get() {
                return t || document
            }
        }), v.registry && !v.done && (v.done = _$HY.done = !0), e.composedPath) {
        let n = e.composedPath();
        a(n[0]);
        for (let e = 0; e < n.length - 2 && (t = n[e], o()); e++) {
            if (t._$host) {
                t = t._$host, s();
                break
            }
            if (t.parentNode === i) break
        }
    } else s();
    a(r)
}

function rm(e, t, n, r, i) {
    let a = Qp(e);
    if (a) {
        !n && (n = [...e.childNodes]);
        let t = [];
        for (let e = 0; e < n.length; e++) {
            let r = n[e];
            r.nodeType === 8 && r.data.slice(0, 2) === `!$` ? r.remove() : t.push(r)
        }
        n = t
    }
    for (; typeof n == `function`;) n = n();
    if (t === n) return n;
    let o = typeof t,
        s = r !== void 0;
    if (e = s && n[0] && n[0].parentNode || e, o === `string` || o === `number`) {
        if (a || o === `number` && (t = t.toString(), t === n)) return n;
        if (s) {
            let i = n[0];
            i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = om(e, n, r, i)
        } else n = n !== `` && typeof n == `string` ? e.firstChild.data = t : e.textContent = t
    } else if (t == null || o === `boolean`) {
        if (a) return n;
        n = om(e, n, r)
    } else if (o === `function`) return le(() => {
        let i = t();
        for (; typeof i == `function`;) i = i();
        n = rm(e, i, n, r)
    }), () => n;
    else if (Array.isArray(t)) {
        let o = [],
            c = n && Array.isArray(n);
        if (im(o, t, n, i)) return le(() => n = rm(e, o, n, r, !0)), () => n;
        if (a) {
            if (!o.length) return n;
            if (r === void 0) return n = [...e.childNodes];
            let t = o[0];
            if (t.parentNode !== e) return n;
            let i = [t];
            for (;
                (t = t.nextSibling) !== r;) i.push(t);
            return n = i
        }
        if (o.length === 0) {
            if (n = om(e, n, r), s) return n
        } else c ? n.length === 0 ? am(e, o, r) : Pp(e, n, o) : (n && om(e), am(e, o));
        n = o
    } else if (t.nodeType) {
        if (a && t.parentNode) return n = s ? [t] : t;
        if (Array.isArray(n)) {
            if (s) return n = om(e, n, r, t);
            om(e, n, null, t)
        } else n == null || n === `` || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
        n = t
    }
    return n
}

function im(e, t, n, r) {
    let i = !1;
    for (let a = 0, o = t.length; a < o; a++) {
        let o = t[a],
            s = n && n[e.length],
            c;
        if (!(o == null || o === !0 || o === !1))
            if ((c = typeof o) == `object` && o.nodeType) e.push(o);
            else if (Array.isArray(o)) i = im(e, o, s) || i;
        else if (c === `function`)
            if (r) {
                for (; typeof o == `function`;) o = o();
                i = im(e, Array.isArray(o) ? o : [o], Array.isArray(s) ? s : [s]) || i
            } else e.push(o), i = !0;
        else {
            let t = String(o);
            s && s.nodeType === 3 && s.data === t ? e.push(s) : e.push(document.createTextNode(t))
        }
    }
    return i
}

function am(e, t, n = null) {
    for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n)
}

function om(e, t, n, r) {
    if (n === void 0) return e.textContent = ``;
    let i = r || document.createTextNode(``);
    if (t.length) {
        let r = !1;
        for (let a = t.length - 1; a >= 0; a--) {
            let o = t[a];
            if (i !== o) {
                let t = o.parentNode === e;
                !r && !a ? t ? e.replaceChild(i, o) : e.insertBefore(i, n) : t && o.remove()
            } else r = !0
        }
    } else e.insertBefore(i, n);
    return [i]
}

function sm() {
    return v.getNextContextId()
}
var cm = () => void 0;

function lm(e, ...t) {}

function um(e) {}
var dm = `http://www.w3.org/2000/svg`;

function fm(e, t = !1, n = void 0) {
    return t ? document.createElementNS(dm, e) : document.createElement(e, {
        is: n
    })
}

function pm(e, t) {
    let n = F(e);
    return F(() => {
        let e = n();
        switch (typeof e) {
            case `function`:
                return I(() => e(t));
            case `string`:
                let n = jp.has(e),
                    r = v.context ? Zp() : fm(e, n, I(() => t.is));
                return qp(r, t, n), r
        }
    })
}

function mm(e) {
    let [, t] = at(e, [`component`]);
    return pm(() => e.component, t)
}
var hm = {
        equals: !1
    },
    gm = class {#e;
        constructor(e = Map) {
            this.#e = new e
        }
        dirty(e) {
            this.#e.get(e) ?.$$()
        }
        dirtyAll() {
            for (let e of this.#e.values()) e.$$()
        }
        track(e) {
            if (!ve()) return;
            let t = this.#e.get(e);
            if (t) t.n++;
            else {
                let [n, r] = P(void 0, hm);
                this.#e.set(e, t = {
                    $: n,
                    $$: r,
                    n: 1
                })
            }
            L(() => {
                --t.n === 0 && queueMicrotask(() => t.n === 0 && this.#e.delete(e))
            }), t.$()
        }
    },
    _m = Symbol(`track-object`),
    vm = class extends Map {#e = new gm;#t = new gm;
        [Symbol.iterator]() {
            return this.entries()
        }
        constructor(e) {
            if (super(), e)
                for (let t of e) super.set(...t)
        }
        get size() {
            return this.#e.track(_m), super.size
        }* keys() {
            this.#e.track(_m);
            for (let e of super.keys()) yield e
        }* values() {
            this.#t.track(_m);
            for (let e of super.values()) yield e
        }* entries() {
            this.#e.track(_m), this.#t.track(_m);
            for (let e of super.entries()) yield e
        }
        forEach(e, t) {
            this.#e.track(_m), this.#t.track(_m), super.forEach(e, t)
        }
        has(e) {
            return this.#e.track(e), super.has(e)
        }
        get(e) {
            return this.#t.track(e), super.get(e)
        }
        set(e, t) {
            let n = !super.has(e),
                r = super.get(e) !== t,
                i = super.set(e, t);
            return (r || n) && me(() => {
                n && (this.#e.dirty(_m), this.#e.dirty(e)), r && (this.#t.dirty(_m), this.#t.dirty(e))
            }), i
        }
        delete(e) {
            let t = super.get(e) !== void 0,
                n = super.delete(e);
            return n && me(() => {
                this.#e.dirty(_m), this.#t.dirty(_m), this.#e.dirty(e), t && this.#t.dirty(e)
            }), n
        }
        clear() {
            super.size !== 0 && me(() => {
                this.#e.dirty(_m), this.#t.dirty(_m);
                for (let e of super.keys()) this.#e.dirty(e), this.#t.dirty(e);
                super.clear()
            })
        }
    };

function ym(e) {
    let t = F(() => {
            if (e.length === 1) return e(new nf) == null ? null : tp({
                query: e,
                startSync: !0
            });
            let t = e();
            return t == null ? null : t instanceof Wl ? (t.startSyncImmediate(), t) : tp({ ...t,
                startSync: !0
            })
        }, void 0, {
            name: `TanstackDBCollectionMemo`
        }),
        n = new vm,
        [r, i] = Pt([], {
            name: `TanstackDBData`
        }),
        [a, o] = P(t() ? t().status : `disabled`, {
            name: `TanstackDBStatus`
        }),
        s = e => {
            i(t => Rt(Array.from(e.values()))(t).filter(Boolean))
        },
        [c] = fe(() => ({
            currentCollection: t()
        }), async ({
            currentCollection: e
        }) => {
            if (!e) return [];
            o(e.status);
            try {
                await e.toArrayWhenReady()
            } catch (e) {
                throw o(`error`), e
            }
            return me(() => {
                n.clear();
                for (let [t, r] of e.entries()) n.set(t, r);
                s(e), o(e.status)
            }), r
        }, {
            name: `TanstackDBData`,
            deferStream: !1,
            initialValue: r
        });
    ue(() => {
        let e = t();
        if (!e) {
            o(`disabled`), n.clear(), i([]);
            return
        }
        let r = e.subscribeChanges(t => {
            me(() => {
                for (let e of t) switch (e.type) {
                    case `insert`:
                    case `update`:
                        n.set(e.key, e.value);
                        break;
                    case `delete`:
                        n.delete(e.key);
                        break
                }
                s(e), o(e.status)
            })
        }, {
            includeInitialState: !0
        });
        L(() => {
            r.unsubscribe()
        })
    });

    function l() {
        let e = t();
        return e && e.config.singleResult ? (c(), r[0]) : c()
    }
    return Object.defineProperties(l, {
        data: {
            get() {
                return l()
            }
        },
        status: {
            get() {
                return a()
            }
        },
        collection: {
            get() {
                return t()
            }
        },
        state: {
            get() {
                return n
            }
        },
        isLoading: {
            get() {
                return a() === `loading`
            }
        },
        isReady: {
            get() {
                return a() === `ready` || a() === `disabled`
            }
        },
        isIdle: {
            get() {
                return a() === `idle`
            }
        },
        isError: {
            get() {
                return a() === `error`
            }
        },
        isCleanedUp: {
            get() {
                return a() === `cleaned-up`
            }
        }
    }), l
}
var bm = we(void 0),
    xm = e => {
        if (e) return e;
        let t = Te(bm);
        if (!t) throw Error(`No QueryClient set, use QueryClientProvider to set one`);
        return t()
    },
    Sm = e => (le(t => (t ?.(), e.client.mount(), e.client.unmount.bind(e.client))), L(() => e.client.unmount()), $e(bm.Provider, {
        value: () => e.client,
        get children() {
            return e.children
        }
    })),
    Cm = we(() => !1),
    wm = () => Te(Cm);
Cm.Provider;

function Tm(e, t, n, r) {
    if (n === !1) return t;
    if (typeof n == `function`) {
        let r = n(e.data, t.data);
        return { ...t,
            data: r
        }
    }
    let i = t.data;
    if (e.data === void 0) try {
        i = structuredClone(i)
    } catch {}
    let a = Rt(i, {
        key: n
    })(e.data);
    return { ...t,
        data: a
    }
}
var Em = (e, t) => t;

function Dm(e, t, n) {
    let r = F(() => xm(n ?.())),
        i = wm(),
        a = F(() => {
            let t = r().defaultQueryOptions(e());
            return t._optimisticResults = i() ? `isRestoring` : `optimistic`, t.structuralSharing = !1, t
        }),
        o = a(),
        [s, c] = P(new t(r(), a())),
        l = s().getOptimisticResult(a()),
        [u, d] = Pt(l),
        f = () => s().subscribe(e => {
            l = e, queueMicrotask(() => {
                h && v()
            })
        });

    function p(e) {
        let t = s().options,
            n = t.reconcile;
        d(r => Tm(r, e, n === void 0 ? !1 : n, t.queryHash))
    }

    function m() {
        return [() => u, e => {
            let t = St(u);
            if (typeof e == `function` && (e = e(t)), e ?.hydrationData) {
                let {
                    hydrationData: t,
                    ...n
                } = e;
                e = n
            }
            p(e)
        }]
    }
    let h = null,
        g = null,
        [_, {
            refetch: v
        }] = fe(() => {
            let e = s();
            return new Promise((t, n) => {
                if (g = t, !h && !i() && (h = f()), e.updateResult(), l.isError && !l.isFetching && !i() && hn(e.options.throwOnError, [l.error, e.getCurrentQuery()])) return p(l), n(l.error);
                if (!l.isLoading) return g = null, t(Em(e.getCurrentQuery(), l));
                p(l)
            })
        }, {
            storage: m,
            get deferStream() {
                return e().deferStream
            },
            onHydrated(e, t) {
                if (t.value && `hydrationData` in t.value && xn(r(), {
                        queries: [{ ...t.value.hydrationData
                        }]
                    }), h) return;
                let n = { ...o
                };
                (o.staleTime || !o.initialData) && t.value && (n.refetchOnMount = !1), s().setOptions(n), p(s().getOptimisticResult(n)), h = f()
            }
        });
    return ce(he(r, e => {
        h && h();
        let n = new t(e, a());
        h = f(), c(n)
    }, {
        defer: !0
    })), ce(he(i, e => {
        e || v()
    }, {
        defer: !0
    })), L(() => {
        h &&= (h(), null), g &&= (g(l), null)
    }), ce(he([s, a], ([e, t]) => {
        e.setOptions(t), p(e.getOptimisticResult(t)), v()
    }, {
        defer: !0
    })), new Proxy(u, {
        get(e, t) {
            return t === `data` ? u.data === void 0 ? _() ?.data : _.latest ?.data : Reflect.get(e, t)
        }
    })
}

function Om(e, t) {
    return Dm(F(() => e()), zn, t)
}

function km(e, t) {
    return Dm(F(() => e()), Kn, t)
}
var Am = class extends Qn {
    constructor(e = {}) {
        super(e)
    }
};

function jm(e) {
    return e
}

function Mm(e) {
    return e
}
var Nm = we(null);

function Pm() {
    return Te(Nm) ?.defaultOptions ?? {}
}

function Fm() {
    if (typeof navigator > `u`) return `linux`;
    let e = navigator.platform ?.toLowerCase() ?? ``,
        t = navigator.userAgent ?.toLowerCase() ?? ``;
    return e.includes(`mac`) || t.includes(`mac`) ? `mac` : e.includes(`win`) || t.includes(`win`) ? `windows` : `linux`
}
var Im = [`Control`, `Alt`, `Shift`, `Meta`];
new Set(Im);
var Lm = {
    Control: `Control`,
    Ctrl: `Control`,
    control: `Control`,
    ctrl: `Control`,
    Shift: `Shift`,
    shift: `Shift`,
    Alt: `Alt`,
    Option: `Alt`,
    alt: `Alt`,
    option: `Alt`,
    Command: `Meta`,
    Cmd: `Meta`,
    Meta: `Meta`,
    command: `Meta`,
    cmd: `Meta`,
    meta: `Meta`,
    OS: `Meta`,
    os: `Meta`,
    Win: `Meta`,
    win: `Meta`,
    CommandOrControl: `Mod`,
    Mod: `Mod`,
    commandorcontrol: `Mod`,
    mod: `Mod`
};

function Rm(e, t = Fm()) {
    return e === `Mod` ? t === `mac` ? `Meta` : `Control` : e
}
var zm = new Set(`ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split(``)),
    Bm = new Set([`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]),
    Vm = new Set([`F1`, `F2`, `F3`, `F4`, `F5`, `F6`, `F7`, `F8`, `F9`, `F10`, `F11`, `F12`]),
    Hm = new Set([`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`]),
    Um = new Set([`Enter`, `Escape`, `Space`, `Tab`, `Backspace`, `Delete`]),
    Wm = new Set([`/`, `[`, `]`, `\\`, `=`, `-`, `,`, `.`, `;`, "`"]),
    Gm = {
        Backquote: "`",
        Backslash: `\\`,
        BracketLeft: `[`,
        BracketRight: `]`,
        Comma: `,`,
        Equal: `=`,
        Minus: `-`,
        Period: `.`,
        Semicolon: `;`,
        Slash: `/`
    };
new Set([...zm, ...Bm, ...Vm, ...Hm, ...Um, ...Wm]);
var Km = {
    Esc: `Escape`,
    esc: `Escape`,
    escape: `Escape`,
    Return: `Enter`,
    return: `Enter`,
    enter: `Enter`,
    " ": `Space`,
    space: `Space`,
    Spacebar: `Space`,
    spacebar: `Space`,
    tab: `Tab`,
    backspace: `Backspace`,
    Del: `Delete`,
    del: `Delete`,
    delete: `Delete`,
    Up: `ArrowUp`,
    up: `ArrowUp`,
    arrowup: `ArrowUp`,
    Down: `ArrowDown`,
    down: `ArrowDown`,
    arrowdown: `ArrowDown`,
    Left: `ArrowLeft`,
    left: `ArrowLeft`,
    arrowleft: `ArrowLeft`,
    Right: `ArrowRight`,
    right: `ArrowRight`,
    arrowright: `ArrowRight`,
    home: `Home`,
    end: `End`,
    pageup: `PageUp`,
    pagedown: `PageDown`,
    PgUp: `PageUp`,
    PgDn: `PageDown`,
    pgup: `PageUp`,
    pgdn: `PageDown`
};

function qm(e) {
    return /^\p{Letter}$/u.test(e)
}

function Jm(e) {
    if (!e) return ``;
    if (e in Km) return Km[e];
    if (qm(e)) {
        let t = e.toUpperCase();
        return t.length === 1 ? t : e
    }
    let t = e.toUpperCase();
    return /^F([1-9]|1[0-2])$/.test(t) ? t : e
}
var Ym = {
        Control: `⌃`,
        Alt: `⌥`,
        Shift: `⇧`,
        Meta: `⌘`,
        Mod: `⌘`
    },
    Xm = {
        Control: `Control`,
        Alt: `Option`,
        Shift: `Shift`,
        Meta: `Cmd`,
        Mod: `Cmd`
    },
    Zm = {
        Control: `Ctrl`,
        Alt: `Alt`,
        Shift: `Shift`,
        Meta: `Win`,
        Mod: `Ctrl`
    },
    Qm = { ...Zm,
        Meta: `Super`
    },
    $m = {
        "`": `Backquote`,
        "\\": `Backslash`,
        "[": `Left Bracket`,
        "]": `Right Bracket`,
        ",": `Comma`,
        "=": `Equal`,
        "-": `Minus`,
        ".": `Period`,
        ";": `Semicolon`
    },
    eh = {
        ArrowUp: `↑`,
        ArrowDown: `↓`,
        ArrowLeft: `←`,
        ArrowRight: `→`,
        Enter: `↵`,
        Escape: `Esc`,
        Backspace: `⌫`,
        Delete: `⌦`,
        Tab: `⇥`,
        Space: `␣`
    };

function th(e, t = Fm()) {
    let n = e.split(`+`),
        r = new Set,
        i = ``;
    for (let e = 0; e < n.length; e++) {
        let a = n[e].trim();
        if (e === n.length - 1) i = Jm(a);
        else {
            let e = Lm[a] ?? Lm[a.toLowerCase()];
            if (e) {
                let n = Rm(e, t);
                r.add(n)
            } else n.length === 1 && (i = Jm(a))
        }
    }
    return !i && n.length > 0 && (i = Jm(n[n.length - 1].trim())), {
        key: i,
        ctrl: r.has(`Control`),
        shift: r.has(`Shift`),
        alt: r.has(`Alt`),
        meta: r.has(`Meta`),
        modifiers: Im.filter(e => r.has(e))
    }
}

function nh(e, t = Fm()) {
    let n = e.ctrl ?? !1,
        r = e.shift ?? !1,
        i = e.alt ?? !1,
        a = e.meta ?? !1;
    e.mod && (Rm(`Mod`, t) === `Control` ? n = !0 : a = !0);
    let o = Im.filter(e => {
        switch (e) {
            case `Control`:
                return n;
            case `Shift`:
                return r;
            case `Alt`:
                return i;
            case `Meta`:
                return a;
            default:
                return !1
        }
    });
    return {
        key: e.key,
        ctrl: n,
        shift: r,
        alt: i,
        meta: a,
        modifiers: o
    }
}

function rh(e, t) {
    let n = t === `mac` ? e.meta && !e.ctrl : e.ctrl && !e.meta,
        r = [];
    if (n) r.push(`Mod`), e.alt && r.push(`Alt`), e.shift && r.push(`Shift`);
    else
        for (let t of Im) e.modifiers.includes(t) && r.push(t);
    return r.push(Jm(e.key)), r.join(`+`)
}

function ih(e, t = Fm()) {
    return rh(th(e, t), t)
}

function ah(e, t = Fm()) {
    return rh(e, t)
}

function oh(e, t = Fm()) {
    return typeof e == `string` ? ih(e, t) : ah(nh(e, t), t)
}

function sh(e) {
    return e in Lm || e.toLowerCase() in Lm
}

function ch(e) {
    return e.join(` `)
}

function lh(e) {
    let t = [];
    for (let n of Im) e.modifiers.includes(n) && t.push(n);
    return t.push(e.key), t.join(`+`)
}

function uh(e, t = {}) {
    let n = t.platform ?? Fm(),
        r = t.useSymbols ?? !0,
        i = t.separatorToken ?? (n === `mac` && r ? ` ` : `+`);
    return oh(e, n).split(`+`).map(e => {
        if (sh(e)) {
            let t = Lm[e] ?? Lm[e.toLowerCase()];
            return n === `mac` ? r ? Ym[t] : Xm[t] : n === `windows` ? Zm[t] : Qm[t]
        } else return r && eh[e] || !r && $m[e] || e
    }).join(i)
}

function dh(e, t, n = Fm()) {
    let r = typeof t == `string` ? th(t, n) : t;
    if (e.ctrlKey !== r.ctrl || e.shiftKey !== r.shift || e.altKey !== r.alt || e.metaKey !== r.meta) return !1;
    let i = Jm(e.key),
        a = r.key;
    if (i !== `Dead` && i.length === 1 && a.length === 1) {
        if (i.toUpperCase() === a.toUpperCase()) return !0;
        if (qm(i) && (/^[A-Za-z]$/.test(i) || !e.altKey)) return !1
    }
    if (e.code && (i === `Dead` || i.length === 1 && a.length === 1)) {
        if (e.code.startsWith(`Key`)) {
            let t = e.code.slice(3);
            if (t.length === 1 && /^[A-Za-z]$/.test(t)) return t.toUpperCase() === a.toUpperCase()
        }
        if (e.code.startsWith(`Digit`)) {
            let t = e.code.slice(5);
            if (t.length === 1 && /^[0-9]$/.test(t)) return t === a
        }
        return e.code in Gm ? Gm[e.code] === a : !1
    }
    return i === a
}
var fh = {
    preventDefault: !0,
    stopPropagation: !0,
    eventType: `keydown`,
    enabled: !0,
    ignoreInputs: !0,
    conflictBehavior: `warn`
};

function ph(e) {
    return !(e.ctrl || e.meta || e.key === `Escape`)
}

function mh(e) {
    if (!e) return !1;
    if (e instanceof HTMLInputElement) {
        let t = e.type.toLowerCase();
        return !(t === `button` || t === `submit` || t === `reset`)
    }
    return !!(e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement || e instanceof HTMLElement && e.isContentEditable)
}

function hh(e) {
    return typeof document > `u` ? null : typeof Document < `u` && e instanceof Document || typeof Node < `u` && e.nodeType === Node.DOCUMENT_NODE ? e.activeElement : typeof HTMLElement < `u` && e instanceof HTMLElement ? e.ownerDocument.activeElement ?? null : e.document.activeElement ?? null
}

function gh(e, t, n) {
    let r = hh(t);
    return r && mh(r) && r !== n || e.composedPath().some(e => mh(e) && e !== n) ? !0 : mh(e.target) && e.target !== n
}

function _h(e, t) {
    return t === document || t === window ? e.currentTarget === t || e.currentTarget === document.documentElement : t === window ? e.currentTarget === window || e.currentTarget === document || e.currentTarget === document.documentElement : !!(t instanceof HTMLElement && (e.currentTarget === t || e.target instanceof Node && t.contains(e.target)))
}

function vh(e, t, n, r) {
    if (n !== `allow`) {
        if (n === `warn`) {
            console.warn(`'${t}' is already registered. Multiple handlers will be triggered. Use conflictBehavior: 'replace' to replace the existing handler, or conflictBehavior: 'allow' to suppress this warning.`);
            return
        }
        if (n === `error`) throw Error(`'${t}' is already registered. Use conflictBehavior: 'replace' to replace the existing handler, or conflictBehavior: 'allow' to allow multiple registrations.`);
        r(e)
    }
}
var X = function(e) {
    return e[e.None = 0] = `None`, e[e.Mutable = 1] = `Mutable`, e[e.Watching = 2] = `Watching`, e[e.RecursedCheck = 4] = `RecursedCheck`, e[e.Recursed = 8] = `Recursed`, e[e.Dirty = 16] = `Dirty`, e[e.Pending = 32] = `Pending`, e
}({});

function yh({
    update: e,
    notify: t,
    unwatched: n
}) {
    return {
        link: r,
        unlink: i,
        propagate: a,
        checkDirty: o,
        shallowPropagate: s
    };

    function r(e, t, n) {
        let r = t.depsTail;
        if (r !== void 0 && r.dep === e) return;
        let i = r === void 0 ? t.deps : r.nextDep;
        if (i !== void 0 && i.dep === e) {
            i.version = n, t.depsTail = i;
            return
        }
        let a = e.subsTail;
        if (a !== void 0 && a.version === n && a.sub === t) return;
        let o = t.depsTail = e.subsTail = {
            version: n,
            dep: e,
            sub: t,
            prevDep: r,
            nextDep: i,
            prevSub: a,
            nextSub: void 0
        };
        i !== void 0 && (i.prevDep = o), r === void 0 ? t.deps = o : r.nextDep = o, a === void 0 ? e.subs = o : a.nextSub = o
    }

    function i(e, t = e.sub) {
        let r = e.dep,
            i = e.prevDep,
            a = e.nextDep,
            o = e.nextSub,
            s = e.prevSub;
        return a === void 0 ? t.depsTail = i : a.prevDep = i, i === void 0 ? t.deps = a : i.nextDep = a, o === void 0 ? r.subsTail = s : o.prevSub = s, s === void 0 ? (r.subs = o) === void 0 && n(r) : s.nextSub = o, a
    }

    function a(e) {
        let n = e.nextSub,
            r;
        top: do {
            let i = e.sub,
                a = i.flags;
            if (a & (X.RecursedCheck | X.Recursed | X.Dirty | X.Pending) ? a & (X.RecursedCheck | X.Recursed) ? a & X.RecursedCheck ? !(a & (X.Dirty | X.Pending)) && c(e, i) ? (i.flags = a | (X.Recursed | X.Pending), a &= X.Mutable) : a = X.None : i.flags = a & ~X.Recursed | X.Pending : a = X.None : i.flags = a | X.Pending, a & X.Watching && t(i), a & X.Mutable) {
                let t = i.subs;
                if (t !== void 0) {
                    let i = (e = t).nextSub;
                    i !== void 0 && (r = {
                        value: n,
                        prev: r
                    }, n = i);
                    continue
                }
            }
            if ((e = n) !== void 0) {
                n = e.nextSub;
                continue
            }
            for (; r !== void 0;)
                if (e = r.value, r = r.prev, e !== void 0) {
                    n = e.nextSub;
                    continue top
                }
            break
        } while (!0)
    }

    function o(t, n) {
        let r, i = 0,
            a = !1;
        top: do {
            let o = t.dep,
                c = o.flags;
            if (n.flags & X.Dirty) a = !0;
            else if ((c & (X.Mutable | X.Dirty)) === (X.Mutable | X.Dirty)) {
                if (e(o)) {
                    let e = o.subs;
                    e.nextSub !== void 0 && s(e), a = !0
                }
            } else if ((c & (X.Mutable | X.Pending)) === (X.Mutable | X.Pending)) {
                (t.nextSub !== void 0 || t.prevSub !== void 0) && (r = {
                    value: t,
                    prev: r
                }), t = o.deps, n = o, ++i;
                continue
            }
            if (!a) {
                let e = t.nextDep;
                if (e !== void 0) {
                    t = e;
                    continue
                }
            }
            for (; i--;) {
                let i = n.subs,
                    o = i.nextSub !== void 0;
                if (o ? (t = r.value, r = r.prev) : t = i, a) {
                    if (e(n)) {
                        o && s(i), n = t.sub;
                        continue
                    }
                    a = !1
                } else n.flags &= ~X.Pending;
                n = t.sub;
                let c = t.nextDep;
                if (c !== void 0) {
                    t = c;
                    continue top
                }
            }
            return a
        } while (!0)
    }

    function s(e) {
        do {
            let n = e.sub,
                r = n.flags;
            (r & (X.Pending | X.Dirty)) === X.Pending && (n.flags = r | X.Dirty, (r & (X.Watching | X.RecursedCheck)) === X.Watching && t(n))
        } while ((e = e.nextSub) !== void 0)
    }

    function c(e, t) {
        let n = t.depsTail;
        for (; n !== void 0;) {
            if (n === e) return !0;
            n = n.prevDep
        }
        return !1
    }
}

function bh(e, t, n) {
    let r = typeof e == `object`,
        i = r ? e : void 0;
    return {
        next: (r ? e.next : e) ?.bind(i),
        error: (r ? e.error : t) ?.bind(i),
        complete: (r ? e.complete : n) ?.bind(i)
    }
}
var xh = [],
    Sh = 0,
    {
        link: Ch,
        unlink: wh,
        propagate: Th,
        checkDirty: Eh,
        shallowPropagate: Dh
    } = yh({
        update(e) {
            return e._update()
        },
        notify(e) {
            xh[kh++] = e, e.flags &= ~X.Watching
        },
        unwatched(e) {
            e.depsTail !== void 0 && (e.depsTail = void 0, e.flags = X.Mutable | X.Dirty, Nh(e))
        }
    }),
    Oh = 0,
    kh = 0,
    Ah, jh = 0;

function Mh(e) {
    try {
        ++jh, e()
    } finally {
        --jh || Ph()
    }
}

function Nh(e) {
    let t = e.depsTail,
        n = t === void 0 ? e.deps : t.nextDep;
    for (; n !== void 0;) n = wh(n, e)
}

function Ph() {
    if (!(jh > 0)) {
        for (; Oh < kh;) {
            let e = xh[Oh];
            xh[Oh++] = void 0, e.notify()
        }
        Oh = 0, kh = 0
    }
}

function Fh(e, t) {
    let n = typeof e == `function`,
        r = e,
        i = {
            _snapshot: n ? void 0 : e,
            subs: void 0,
            subsTail: void 0,
            deps: void 0,
            depsTail: void 0,
            flags: n ? X.None : X.Mutable,
            get() {
                return Ah !== void 0 && Ch(i, Ah, Sh), i._snapshot
            },
            subscribe(e) {
                let t = bh(e),
                    n = {
                        current: !1
                    },
                    r = Ih(() => {
                        i.get(), n.current ? t.next ?.(i._snapshot) : n.current = !0
                    });
                return {
                    unsubscribe: () => {
                        r.stop()
                    }
                }
            },
            _update(e) {
                let a = Ah,
                    o = t ?.compare ?? Object.is;
                if (n) Ah = i, ++Sh, i.depsTail = void 0;
                else if (e === void 0) return !1;
                n && (i.flags = X.Mutable | X.RecursedCheck);
                try {
                    let t = i._snapshot,
                        a = typeof e == `function` ? e(t) : e === void 0 && n ? r(t) : e;
                    return t === void 0 || !o(t, a) ? (i._snapshot = a, !0) : !1
                } finally {
                    Ah = a, n && (i.flags &= ~X.RecursedCheck), Nh(i)
                }
            }
        };
    return n ? (i.flags = X.Mutable | X.Dirty, i.get = function() {
        let e = i.flags;
        if (e & X.Dirty || e & X.Pending && Eh(i.deps, i)) {
            if (i._update()) {
                let e = i.subs;
                e !== void 0 && Dh(e)
            }
        } else e & X.Pending && (i.flags = e & ~X.Pending);
        return Ah !== void 0 && Ch(i, Ah, Sh), i._snapshot
    }) : i.set = function(e) {
        if (i._update(e)) {
            let e = i.subs;
            e !== void 0 && (Th(e), Dh(e), Ph())
        }
    }, i
}

function Ih(e) {
    let t = () => {
            let t = Ah;
            Ah = n, ++Sh, n.depsTail = void 0, n.flags = X.Watching | X.RecursedCheck;
            try {
                return e()
            } finally {
                Ah = t, n.flags &= ~X.RecursedCheck, Nh(n)
            }
        },
        n = {
            deps: void 0,
            depsTail: void 0,
            subs: void 0,
            subsTail: void 0,
            flags: X.Watching | X.RecursedCheck,
            notify() {
                let e = this.flags;
                e & X.Dirty || e & X.Pending && Eh(this.deps, this) ? t() : this.flags = X.Watching
            },
            stop() {
                this.flags = X.None, this.depsTail = void 0, Nh(this)
            }
        };
    return t(), n
}
var Lh = class {
        constructor(e, t) {
            this.atom = Fh(e), this.get = this.get.bind(this), this.setState = this.setState.bind(this), this.subscribe = this.subscribe.bind(this), t && (this.actions = t(this))
        }
        setState(e) {
            this.atom.set(e)
        }
        get state() {
            return this.atom.get()
        }
        get() {
            return this.state
        }
        subscribe(e) {
            return this.atom.subscribe(bh(e))
        }
    },
    Rh = class {
        constructor(e) {
            this.atom = Fh(e)
        }
        get state() {
            return this.atom.get()
        }
        get() {
            return this.state
        }
        subscribe(e) {
            return this.atom.subscribe(bh(e))
        }
    };

function zh(e, t) {
    return typeof e == `function` ? new Rh(e) : t ? new Lh(e, t) : new Lh(e)
}
var Bh = 0;

function Vh() {
    return `hotkey_${++Bh}`
}
var Hh = class e {
    static#e = null;#t;#n = new Map;#r = new Map;
    constructor() {
        this.registrations = new Lh(new Map), this.#t = Fm()
    }
    static getInstance() {
        return e.#e ||= new e, e.#e
    }
    static resetInstance() {
        e.#e &&= (e.#e.destroy(), null)
    }
    register(e, t, n = {}) {
        if (typeof document > `u` && !n.target) {
            let e = t;
            return {
                id: Vh(),
                unregister: () => {},
                get callback() {
                    return e
                },
                set callback(t) {
                    e = t
                },
                setOptions: () => {},
                get isActive() {
                    return !1
                }
            }
        }
        let r = Vh(),
            i = n.platform ?? this.#t,
            a = typeof e == `string` ? th(e, i) : nh(e, i),
            o = typeof e == `string` ? e : lh(a),
            s = n.target ?? document,
            c = n.conflictBehavior ?? `warn`,
            l = this.#d(o, s);
        l && vh(l.id, o, c, e => this.#i(e));
        let u = n.ignoreInputs ?? ph(a),
            d = {
                id: r,
                hotkey: o,
                parsedHotkey: a,
                callback: t,
                options: { ...fh,
                    requireReset: !1,
                    ...n,
                    platform: i,
                    ignoreInputs: u
                },
                hasFired: !1,
                triggerCount: 0,
                target: s
            };
        this.registrations.setState(e => new Map(e).set(r, d)), this.#r.has(s) || this.#r.set(s, new Set), this.#r.get(s).add(r), this.#a(s);
        let f = this;
        return {
            get id() {
                return r
            },
            unregister: () => {
                f.#i(r)
            },
            get callback() {
                return f.registrations.state.get(r) ?.callback ?? t
            },
            set callback(e) {
                let t = f.registrations.state.get(r);
                t && (t.callback = e)
            },
            setOptions: e => {
                f.registrations.setState(t => {
                    let n = t.get(r);
                    if (n) {
                        let i = new Map(t);
                        return i.set(r, { ...n,
                            options: { ...n.options,
                                ...e
                            }
                        }), i
                    }
                    return t
                })
            },
            get isActive() {
                return f.registrations.state.has(r)
            }
        }
    }#i(e) {
        let t = this.registrations.state.get(e);
        if (!t) return;
        let n = t.target;
        this.registrations.setState(t => {
            let n = new Map(t);
            return n.delete(e), n
        });
        let r = this.#r.get(n);
        r && (r.delete(e), r.size === 0 && this.#o(n))
    }#a(e) {
        if (typeof document > `u` || this.#n.has(e)) return;
        let t = this.#l(e),
            n = this.#u(e);
        e.addEventListener(`keydown`, t), e.addEventListener(`keyup`, n), this.#n.set(e, {
            keydown: t,
            keyup: n
        })
    }#o(e) {
        if (typeof document > `u`) return;
        let t = this.#n.get(e);
        t && (e.removeEventListener(`keydown`, t.keydown), e.removeEventListener(`keyup`, t.keyup), this.#n.delete(e), this.#r.delete(e))
    }#s(e, t, n) {
        let r = this.#r.get(t);
        if (r)
            for (let i of r) {
                let r = this.registrations.state.get(i);
                if (r && _h(e, t) && r.options.enabled && !(r.options.ignoreInputs !== !1 && gh(e, t, r.target)))
                    if (n === `keydown`) {
                        if (r.options.eventType !== `keydown`) continue;
                        dh(e, r.parsedHotkey, r.options.platform) && (r.options.preventDefault && e.preventDefault(), r.options.stopPropagation && e.stopPropagation(), (!r.options.requireReset || !r.hasFired) && (this.#c(r, e), r.options.requireReset && (r.hasFired = !0)))
                    } else r.options.eventType === `keyup` && dh(e, r.parsedHotkey, r.options.platform) && this.#c(r, e), r.options.requireReset && r.hasFired && this.#f(r, e) && (r.hasFired = !1)
            }
    }#c(e, t) {
        e.options.preventDefault && t.preventDefault(), e.options.stopPropagation && t.stopPropagation(), e.triggerCount++, this.registrations.setState(e => new Map(e));
        let n = {
            hotkey: e.hotkey,
            parsedHotkey: e.parsedHotkey
        };
        e.callback(t, n)
    }#l(e) {
        return t => {
            this.#s(t, e, `keydown`)
        }
    }#u(e) {
        return t => {
            this.#s(t, e, `keyup`)
        }
    }#d(e, t) {
        for (let n of this.registrations.state.values())
            if (n.hotkey === e && n.target === t) return n;
        return null
    }#f(e, t) {
        let n = e.parsedHotkey,
            r = Jm(t.key),
            i = n.key.length === 1 ? n.key.toUpperCase() : n.key;
        return !!((r.length === 1 ? r.toUpperCase() : r) === i || n.ctrl && r === `Control` || n.shift && r === `Shift` || n.alt && r === `Alt` || n.meta && r === `Meta`)
    }
    triggerRegistration(e) {
        let t = this.registrations.state.get(e);
        if (!t) return !1;
        let n = t.parsedHotkey,
            r = new KeyboardEvent(t.options.eventType ?? `keydown`, {
                key: n.key,
                ctrlKey: n.ctrl,
                shiftKey: n.shift,
                altKey: n.alt,
                metaKey: n.meta,
                bubbles: !0,
                cancelable: !0
            });
        return t.triggerCount++, this.registrations.setState(e => new Map(e)), t.callback(r, {
            hotkey: t.hotkey,
            parsedHotkey: t.parsedHotkey
        }), !0
    }
    getRegistrationCount() {
        return this.registrations.state.size
    }
    isRegistered(e, t) {
        for (let n of this.registrations.state.values())
            if (n.hotkey === e && (t === void 0 || n.target === t)) return !0;
        return !1
    }
    destroy() {
        for (let e of this.#n.keys()) this.#o(e);
        this.registrations.setState(() => new Map), this.#n.clear(), this.#r.clear()
    }
};

function Uh() {
    return Hh.getInstance()
}
var Wh = 1e3,
    Gh = 0;

function Kh() {
    return `sequence_${++Gh}`
}

function qh(e) {
    return e.join(`|`)
}

function Jh(e) {
    let t = e.parsedSequence.length,
        n = e.currentIndex > 0 && e.currentIndex < t;
    return {
        id: e.id,
        sequence: e.sequence,
        options: e.options,
        target: e.target,
        triggerCount: e.triggerCount,
        hasFired: e.hasFired,
        matchedStepCount: n ? e.currentIndex : 0,
        partialMatchLastKeyTime: n ? e.lastKeyTime : 0
    }
}
var Yh = class e {
    static#e = null;#t = new Map;#n = new Map;#r = new Map;#i;
    constructor() {
        this.registrations = new Lh(new Map), this.#i = Fm()
    }
    static getInstance() {
        return e.#e ||= new e, e.#e
    }
    static resetInstance() {
        e.#e &&= (e.#e.destroy(), null)
    }#a(e) {
        this.registrations.setState(t => new Map(t).set(e.id, Jh(e)))
    }
    register(e, t, n = {}) {
        if (e.length === 0) throw Error(`Sequence must contain at least one hotkey`);
        let r = Kh(),
            i = n.platform ?? this.#i,
            a = e.map(e => th(e, i)),
            o = n.target ?? (typeof document < `u` ? document : {}),
            s = n.conflictBehavior ?? `warn`,
            c = this.#f(e, o);
        c && vh(c.id, ch(e), s, e => this.#o(e));
        let l = a[0],
            u = n.ignoreInputs ?? ph(l),
            d = {
                id: r,
                sequence: e,
                parsedSequence: a,
                callback: t,
                options: { ...fh,
                    timeout: Wh,
                    ...n,
                    platform: i,
                    ignoreInputs: u
                },
                target: o,
                currentIndex: 0,
                lastKeyTime: 0,
                triggerCount: 0,
                hasFired: !1
            };
        this.#t.set(r, d), this.registrations.setState(e => new Map(e).set(r, Jh(d))), this.#r.has(o) || this.#r.set(o, new Set), this.#r.get(o).add(r), this.#s(o);
        let f = this;
        return {
            get id() {
                return r
            },
            get isActive() {
                return f.#t.has(r)
            },
            get callback() {
                return f.#t.get(r) ?.callback ?? t
            },
            set callback(e) {
                let t = f.#t.get(r);
                t && (t.callback = e)
            },
            setOptions: e => {
                let t = f.#t.get(r);
                t && (t.options = { ...t.options,
                    ...e
                }, f.registrations.setState(e => new Map(e).set(r, Jh(t))))
            },
            unregister: () => {
                f.#o(r)
            }
        }
    }#o(e) {
        let t = this.#t.get(e);
        if (!t) return;
        let n = t.target;
        this.#t.delete(e), this.registrations.setState(t => {
            let n = new Map(t);
            return n.delete(e), n
        });
        let r = this.#r.get(n);
        r && (r.delete(e), r.size === 0 && this.#c(n))
    }#s(e) {
        if (typeof document > `u` || this.#n.has(e)) return;
        let t = this.#l(e),
            n = this.#u(e);
        e.addEventListener(`keydown`, t), e.addEventListener(`keyup`, n), this.#n.set(e, {
            keydown: t,
            keyup: n
        })
    }#c(e) {
        if (typeof document > `u`) return;
        let t = this.#n.get(e);
        t && (e.removeEventListener(`keydown`, t.keydown), e.removeEventListener(`keyup`, t.keyup), this.#n.delete(e), this.#r.delete(e))
    }#l(e) {
        return t => {
            this.#d(t, e, `keydown`)
        }
    }#u(e) {
        return t => {
            this.#d(t, e, `keyup`)
        }
    }#d(e, t, n) {
        if (sh(Jm(e.key))) return;
        let r = this.#r.get(t);
        if (!r) return;
        let i = Date.now();
        registrationIds: for (let a of r) {
            let r = this.#t.get(a);
            if (!r || !_h(e, t) || !r.options.enabled) continue;
            if (r.options.ignoreInputs !== !1 && gh(e, t, r.target)) continue registrationIds;
            if (r.options.eventType !== n) continue;
            let o = r.options.timeout ?? 1e3;
            r.currentIndex > 0 && i - r.lastKeyTime > o && (r.currentIndex = 0, this.#a(r));
            let s = r.parsedSequence[r.currentIndex];
            if (s) {
                if (dh(e, s, r.options.platform))
                    if (r.lastKeyTime = i, r.currentIndex++, r.currentIndex >= r.parsedSequence.length) {
                        r.options.preventDefault && e.preventDefault(), r.options.stopPropagation && e.stopPropagation();
                        let t = {
                            hotkey: r.sequence.join(` `),
                            parsedHotkey: r.parsedSequence[r.parsedSequence.length - 1]
                        };
                        r.triggerCount++, r.hasFired = !0, r.currentIndex = 0, this.#a(r), r.callback(e, t)
                    } else this.#a(r);
                else if (r.currentIndex > 0) {
                    let t = r.parsedSequence[0];
                    dh(e, t, r.options.platform) ? (r.currentIndex = 1, r.lastKeyTime = i) : r.currentIndex = 0, this.#a(r)
                }
            }
        }
    }#f(e, t) {
        let n = qh(e);
        for (let e of this.#t.values())
            if (qh(e.sequence) === n && e.target === t) return e;
        return null
    }
    resetAll() {
        for (let e of this.#t.values()) e.currentIndex = 0, e.lastKeyTime = 0, this.#a(e)
    }
    triggerSequence(e) {
        let t = this.#t.get(e);
        if (!t) return !1;
        let n = t.parsedSequence[t.parsedSequence.length - 1];
        if (!n) return !1;
        let r = new KeyboardEvent(t.options.eventType ?? `keydown`, {
            key: n.key,
            ctrlKey: n.ctrl,
            shiftKey: n.shift,
            altKey: n.alt,
            metaKey: n.meta,
            bubbles: !0,
            cancelable: !0
        });
        t.triggerCount++, t.hasFired = !0, this.#a(t);
        let i = {
            hotkey: t.sequence.join(` `),
            parsedHotkey: n
        };
        return t.callback(r, i), !0
    }
    getRegistrationCount() {
        return this.#t.size
    }
    destroy() {
        for (let e of this.#n.keys()) this.#c(e);
        this.#t.clear(), this.registrations.setState(() => new Map)
    }
};

function Xh() {
    return Yh.getInstance()
}

function Zh(e, t, n = {}) {
    let r = Pm(),
        i = Uh(),
        a = null,
        o = null,
        s = null;
    L(() => {
        a ?.isActive && (a.unregister(), a = null), o = null, s = null
    }), ue(() => {
        let c = typeof e == `function` ? e() : e,
            l = typeof n == `function` ? n() : n,
            u = { ...r.hotkey,
                ...l
            },
            d = oh(c, u.platform ?? Fm()),
            f = `target` in u ? u.target ?? null : typeof document < `u` ? document : null;
        if (!f) {
            a ?.isActive && (a.unregister(), a = null), o = null, s = null;
            return
        }
        let {
            target: p,
            ...m
        } = u;
        I(() => {
            if (a ?.isActive && o === d && s === f) {
                a.callback = t, a.setOptions(m);
                return
            }
            a ?.isActive && (a.unregister(), a = null), a = i.register(d, t, { ...m,
                target: f
            }), a.isActive && (a.callback = t, a.setOptions(m)), o = d, s = f
        })
    })
}

function Qh(e, t) {
    return e === t
}

function $h(e, t = e => e, n) {
    let r = n ?.compare ?? Qh,
        [i, a] = P(t(e.get()), {
            equals: r
        }),
        o = e.subscribe(e => {
            a(() => t(e))
        }).unsubscribe;
    return L(() => {
        o()
    }), i
}
var eg = (e, t = e => e, n) => $h(e, t, {
    compare: n
});

function tg(e, t, n = {}) {
    let r = Pm(),
        i = Xh(),
        a = null,
        o = null,
        s = null;
    L(() => {
        a ?.isActive && (a.unregister(), a = null), o = null, s = null
    }), ue(() => {
        let c = typeof e == `function` ? e() : e,
            l = typeof n == `function` ? n() : n,
            u = { ...r.hotkeySequence,
                ...l
            },
            {
                target: d,
                ...f
            } = u,
            p = `target` in u ? u.target ?? null : typeof document < `u` ? document : null;
        if (c.length === 0 || !p) {
            a ?.isActive && (a.unregister(), a = null), o = null, s = null;
            return
        }
        let m = ch(c);
        I(() => {
            if (a ?.isActive && o === m && s === p) {
                a.callback = t, a.setOptions(f);
                return
            }
            a ?.isActive && (a.unregister(), a = null), a = i.register(c, t, { ...u,
                target: p
            }), a.isActive && (a.callback = t, a.setOptions(f)), o = m, s = p
        })
    })
}
var ng = class {
    constructor(e, t) {
        this.fn = e, this.options = t, this.lastExecutionTime = 0, this.isPending = !1, this.maybeExecute = (...e) => {
            let t = Date.now() - this.lastExecutionTime;
            if (this.options.leading && t >= this.options.wait) this.execute(...e);
            else if (this.lastArgs = e, !this.timeoutId && this.options.trailing) {
                let e = this.options.wait - t;
                this.isPending = !0, this.timeoutId = setTimeout(() => {
                    this.lastArgs !== void 0 && this.execute(...this.lastArgs)
                }, e)
            }
        }, this.execute = (...e) => {
            this.fn(...e), this.options.onExecute ?.(e, this), this.lastExecutionTime = Date.now(), this.clearTimeout(), this.lastArgs = void 0, this.isPending = !1
        }, this.flush = () => {
            this.isPending && this.lastArgs && this.execute(...this.lastArgs)
        }, this.cancel = () => {
            this.clearTimeout(), this.lastArgs = void 0, this.isPending = !1
        }, this.clearTimeout = () => {
            this.timeoutId &&= (clearTimeout(this.timeoutId), void 0)
        }, this.options.leading === void 0 && this.options.trailing === void 0 && (this.options.leading = !0, this.options.trailing = !0)
    }
};

function rg(e, t) {
    return new ng(e, t).maybeExecute
}
var ig = class {#e = !0;#t;#n;#r;#i;#a;#o;#s;#c = 0;#l = 5;#u = !1;#d = !1;#f = null;#p = () => {
            this.debugLog(`Connected to event bus`), this.#a = !0, this.#u = !1, this.debugLog(`Emitting queued events`, this.#i), this.#i.forEach(e => this.emitEventToBus(e)), this.#i = [], this.stopConnectLoop(), this.#n().removeEventListener(`tanstack-connect-success`, this.#p)
        };#m = () => {
            if (this.#c < this.#l) {
                this.#c++, this.dispatchCustomEvent(`tanstack-connect`, {});
                return
            }
            this.#n().removeEventListener(`tanstack-connect`, this.#m), this.#d = !0, this.debugLog(`Max retries reached, giving up on connection`), this.stopConnectLoop()
        };#h = () => {
            this.#u || (this.#u = !0, this.#n().addEventListener(`tanstack-connect-success`, this.#p), this.#m())
        };
        constructor({
            pluginId: e,
            debug: t = !1,
            enabled: n = !0,
            reconnectEveryMs: r = 300
        }) {
            this.#t = e, this.#e = n, this.#n = this.getGlobalTarget, this.#r = t, this.debugLog(` Initializing event subscription for plugin`, this.#t), this.#i = [], this.#a = !1, this.#d = !1, this.#o = null, this.#s = r
        }
        startConnectLoop() {
            this.#o !== null || this.#a || (this.debugLog(`Starting connect loop (every ${this.#s}ms)`), this.#o = setInterval(this.#m, this.#s))
        }
        stopConnectLoop() {
            this.#u = !1, this.#o !== null && (clearInterval(this.#o), this.#o = null, this.#i = [], this.debugLog(`Stopped connect loop`))
        }
        debugLog(...e) {
            this.#r && console.log(`🌴 [tanstack-devtools:${this.#t}-plugin]`, ...e)
        }
        getGlobalTarget() {
            if (typeof globalThis < `u` && globalThis.__TANSTACK_EVENT_TARGET__) return this.debugLog(`Using global event target`), globalThis.__TANSTACK_EVENT_TARGET__;
            if (typeof window < `u` && window.addEventListener !== void 0) return this.debugLog(`Using window as event target`), window;
            let e = typeof EventTarget < `u` ? new EventTarget : void 0;
            return e === void 0 || e.addEventListener === void 0 ? (this.debugLog(`No event mechanism available, running in non-web environment`), {
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => !1
            }) : (this.debugLog(`Using new EventTarget as fallback`), e)
        }
        getPluginId() {
            return this.#t
        }
        dispatchCustomEventShim(e, t) {
            try {
                let n = new Event(e, {
                    detail: t
                });
                this.#n().dispatchEvent(n)
            } catch {
                this.debugLog(`Failed to dispatch shim event`)
            }
        }
        dispatchCustomEvent(e, t) {
            try {
                this.#n().dispatchEvent(new CustomEvent(e, {
                    detail: t
                }))
            } catch {
                this.dispatchCustomEventShim(e, t)
            }
        }
        emitEventToBus(e) {
            this.debugLog(`Emitting event to client bus`, e), this.dispatchCustomEvent(`tanstack-dispatch-event`, e)
        }
        createEventPayload(e, t) {
            return {
                type: `${this.#t}:${e}`,
                payload: t,
                pluginId: this.#t
            }
        }
        emit(e, t) {
            if (!this.#e) {
                this.debugLog(`Event bus client is disabled, not emitting event`, e, t);
                return
            }
            if (this.#f && (this.debugLog(`Emitting event to internal event target`, e, t), this.#f.dispatchEvent(new CustomEvent(`${this.#t}:${e}`, {
                    detail: this.createEventPayload(e, t)
                }))), this.#d) {
                this.debugLog(`Previously failed to connect, not emitting to bus`);
                return
            }
            if (!this.#a) {
                this.debugLog(`Bus not available, will be pushed as soon as connected`), this.#i.push(this.createEventPayload(e, t)), typeof CustomEvent < `u` && !this.#u && (this.#h(), this.startConnectLoop());
                return
            }
            return this.emitEventToBus(this.createEventPayload(e, t))
        }
        on(e, t, n) {
            let r = n ?.withEventTarget ?? !1,
                i = `${this.#t}:${e}`;
            if (r && (this.#f ||= new EventTarget, this.#f.addEventListener(i, e => {
                    t(e.detail)
                })), !this.#e) return this.debugLog(`Event bus client is disabled, not registering event`, i), () => {};
            let a = e => {
                this.debugLog(`Received event from bus`, e.detail), t(e.detail)
            };
            return this.#n().addEventListener(i, a), this.debugLog(`Registered event to bus`, i), () => {
                r && this.#f ?.removeEventListener(i, a), this.#n().removeEventListener(i, a)
            }
        }
        onAll(e) {
            if (!this.#e) return this.debugLog(`Event bus client is disabled, not registering event`), () => {};
            let t = t => {
                let n = t.detail;
                e(n)
            };
            return this.#n().addEventListener(`tanstack-devtools-global`, t), () => this.#n().removeEventListener(`tanstack-devtools-global`, t)
        }
        onAllPluginEvents(e) {
            if (!this.#e) return this.debugLog(`Event bus client is disabled, not registering event`), () => {};
            let t = t => {
                let n = t.detail;
                this.#t && n.pluginId !== this.#t || e(n)
            };
            return this.#n().addEventListener(`tanstack-devtools-global`, t), () => this.#n().removeEventListener(`tanstack-devtools-global`, t)
        }
    },
    ag = new class extends ig {
        constructor() {
            super({
                pluginId: `form-devtools`,
                reconnectEveryMs: 1e3
            })
        }
    };

function og(e, t) {
    return typeof e == `function` ? e(t) : e
}

function sg(e, t) {
    return hg(t).reduce((e, t) => {
        if (e === null) return null;
        if (e !== void 0) return e[t]
    }, e)
}

function cg(e, t, n) {
    let r = hg(t);

    function i(e) {
        if (!r.length) return og(n, e);
        let t = r.shift();
        if (typeof t == `string` || typeof t == `number` && !Array.isArray(e)) return typeof e == `object` ? (e === null && (e = {}), { ...e,
            [t]: i(e[t])
        }) : {
            [t]: i()
        };
        if (Array.isArray(e) && typeof t == `number`) {
            let n = e.slice(0, t);
            return [...n.length ? n : Array(t), i(e[t]), ...e.slice(t + 1)]
        }
        return [...Array(t), i()]
    }
    return i(e)
}

function lg(e, t) {
    let n = hg(t);

    function r(e) {
        if (!e) return;
        if (n.length === 1) {
            let t = n[0];
            if (Array.isArray(e) && typeof t == `number`) return e.filter((e, n) => n !== t);
            let {
                [t]: r, ...i
            } = e;
            return i
        }
        let t = n.shift();
        if ((typeof t == `string` || typeof t == `number` && !Array.isArray(e)) && typeof e == `object`) return { ...e,
            [t]: r(e[t])
        };
        if (typeof t == `number` && Array.isArray(e)) {
            if (t >= e.length) return e;
            let n = e.slice(0, t);
            return [...n.length ? n : Array(t), r(e[t]), ...e.slice(t + 1)]
        }
        throw Error(`It seems we have created an infinite loop in deleteBy. `)
    }
    return r(e)
}
var ug = 46,
    dg = 91,
    fg = 93,
    pg = 48,
    mg = 57;

function hg(e) {
    if (Array.isArray(e)) return [...e];
    if (typeof e != `string`) throw Error(`Path must be a string.`);
    let t = e.length,
        n = [],
        r = t > 0 && e.charCodeAt(0) === dg ? 1 : 0,
        i = !0,
        a = -1;
    for (let o = r; o <= t; o++) {
        let s = o < t ? e.charCodeAt(o) : -1;
        if (o === t || s === ug || s === dg || s === fg) {
            let t = o - r;
            if (t > 0) {
                let a = i && (t === 1 || e.charCodeAt(r) !== pg),
                    s = e.slice(r, o);
                if (a) {
                    let e = parseInt(s, 10);
                    t <= 15 || String(e) === s ? n.push(e) : n.push(s)
                } else n.push(s)
            } else a !== fg && !(a === -1 && s === fg) && !(a === s && (s === ug || s === dg)) && n.push(``);
            r = o + 1, i = !0
        } else(s < pg || s > mg) && (i = !1);
        a = s
    }
    return n.length || n.push(``), n
}

function gg(e) {
    return !(Array.isArray(e) && e.length === 0)
}

function _g(e, t) {
    return t.validationLogic({
        form: t.form,
        group: t.group,
        validators: t.validators,
        event: {
            type: e,
            fieldName: t.fieldName,
            async: !1
        },
        runValidation: e => e.validators.filter(Boolean).map(e => ({
            cause: e.cause,
            validate: e.fn
        }))
    })
}

function vg(e, t) {
    let {
        asyncDebounceMs: n
    } = t, {
        onBlurAsyncDebounceMs: r,
        onChangeAsyncDebounceMs: i,
        onDynamicAsyncDebounceMs: a
    } = t.validators || {}, o = n ?? 0;
    return t.validationLogic({
        form: t.form,
        group: t.group,
        validators: t.validators,
        event: {
            type: e,
            fieldName: t.fieldName,
            async: !0
        },
        runValidation: t => t.validators.filter(Boolean).map(t => {
            let n = t ?.cause || e,
                s = o;
            switch (n) {
                case `change`:
                    s = i ?? o;
                    break;
                case `blur`:
                    s = r ?? o;
                    break;
                case `dynamic`:
                    s = a ?? o;
                    break;
                case `submit`:
                    s = 0;
                    break
            }
            return e === `submit` && (s = 0), {
                cause: n,
                validate: t.fn,
                debounceMs: s
            }
        })
    })
}
var yg = e => !!e && typeof e == `object` && `fields` in e;

function bg(e, t) {
    if (Object.is(e, t)) return !0;
    if (typeof e != `object` || !e || typeof t != `object` || !t) return !1;
    if (e instanceof Date && t instanceof Date) return e.getTime() === t.getTime();
    if (e instanceof Map && t instanceof Map) {
        if (e.size !== t.size) return !1;
        for (let [n, r] of e)
            if (!t.has(n) || !Object.is(r, t.get(n))) return !1;
        return !0
    }
    if (e instanceof Set && t instanceof Set) {
        if (e.size !== t.size) return !1;
        for (let n of e)
            if (!t.has(n)) return !1;
        return !0
    }
    let n = Object.keys(e),
        r = Object.keys(t);
    if (n.length !== r.length || n.length === 0 && !Array.isArray(e) && !Array.isArray(t) && (Object.getPrototypeOf(e) !== Object.prototype || Object.getPrototypeOf(t) !== Object.prototype)) return !1;
    for (let i of n)
        if (!r.includes(i) || !bg(e[i], t[i])) return !1;
    return !0
}
var xg = ({
        newFormValidatorError: e,
        isPreviousErrorFromFormValidator: t,
        previousErrorValue: n
    }) => e ? {
        newErrorValue: e,
        newSource: `form`
    } : t ? {
        newErrorValue: void 0,
        newSource: void 0
    } : n ? {
        newErrorValue: n,
        newSource: `field`
    } : {
        newErrorValue: void 0,
        newSource: void 0
    },
    Sg = ({
        formLevelError: e,
        fieldLevelError: t
    }) => t ? {
        newErrorValue: t,
        newSource: `field`
    } : e ? {
        newErrorValue: e,
        newSource: `form`
    } : {
        newErrorValue: void 0,
        newSource: void 0
    };

function Cg(e, t) {
    return e == null ? t : { ...e,
        ...t
    }
}
for (var wg = 256, Tg = [], Eg; wg--;) Tg[wg] = (wg + 256).toString(16).substring(1);

function Dg() {
    let e = 0,
        t, n = ``;
    if (!Eg || wg + 16 > 256) {
        for (Eg = Array(256), e = 256; e--;) Eg[e] = 256 * Math.random() | 0;
        e = 0, wg = 0
    }
    for (; e < 16; e++) t = Eg[wg + e], e === 6 ? n += Tg[t & 15 | 64] : e === 8 ? n += Tg[t & 63 | 128] : n += Tg[t], e & 1 && e > 1 && e < 11 && (n += `-`);
    return wg++, n
}
var Og = rg(e => ag.emit(`form-state`, {
    id: e.formId,
    state: e.store.state
}), {
    wait: 300
});

function kg(e, t) {
    return t === e || t.startsWith(`${e}.`) || t.startsWith(`${e}[`)
}
var Ag = e => {
    if (!e.validators) return e.runValidation({
        validators: [],
        form: e.form
    });
    let t = e.event.async,
        n = t ? void 0 : {
            fn: e.validators.onMount,
            cause: `mount`
        },
        r = {
            fn: t ? e.validators.onChangeAsync : e.validators.onChange,
            cause: `change`
        },
        i = {
            fn: t ? e.validators.onBlurAsync : e.validators.onBlur,
            cause: `blur`
        },
        a = {
            fn: t ? e.validators.onSubmitAsync : e.validators.onSubmit,
            cause: `submit`
        },
        o = t ? void 0 : {
            fn: () => void 0,
            cause: `server`
        };
    switch (e.event.type) {
        case `mount`:
            return e.runValidation({
                validators: [n],
                form: e.form
            });
        case `submit`:
            return e.runValidation({
                validators: [r, i, a, o],
                form: e.form
            });
        case `server`:
            return e.runValidation({
                validators: [],
                form: e.form
            });
        case `blur`:
            return e.runValidation({
                validators: [i, o],
                form: e.form
            });
        case `change`:
            return e.runValidation({
                validators: [r, o],
                form: e.form
            });
        default:
            throw Error(`Unknown validation event type: ${e.event.type}`)
    }
};

function jg(e, t) {
    let n = new Map;
    for (let r of e) {
        let e = r.path ?? [],
            i = t,
            a = ``;
        for (let t = 0; t < e.length; t++) {
            let n = e[t];
            if (n === void 0) continue;
            let r = typeof n == `object` ? n.key : n,
                o = Number(r);
            Array.isArray(i) && !Number.isNaN(o) ? a += `[${o}]` : a += (t > 0 ? `.` : ``) + String(r), i = typeof i == `object` && i ? i[r] : void 0
        }
        n.set(a, (n.get(a) ?? []).concat(r))
    }
    return Object.fromEntries(n)
}
var Mg = (e, t) => {
        let n = jg(e, t);
        return {
            form: n,
            fields: n
        }
    },
    Ng = {
        validate({
            value: e,
            validationSource: t
        }, n) {
            let r = n[`~standard`].validate(e);
            if (r instanceof Promise) throw Error(`async function passed to sync validator`);
            if (r.issues) return t === `field` ? r.issues : Mg(r.issues, e)
        },
        async validateAsync({
            value: e,
            validationSource: t
        }, n) {
            let r = await n[`~standard`].validate(e);
            if (r.issues) return t === `field` ? r.issues : Mg(r.issues, e)
        }
    },
    Pg = e => !!e && `~standard` in e,
    Fg = {
        isValidating: !1,
        isTouched: !1,
        isBlurred: !1,
        isDirty: !1,
        isPristine: !0,
        isValid: !0,
        isDefaultValue: !0,
        errors: [],
        errorMap: {},
        errorSourceMap: {},
        _arrayVersion: 0
    };

function Ig(e) {
    function t(t) {
        let n = e.getFieldMeta(t) ?? Fg;
        e.setFieldMeta(t, { ...n,
            _arrayVersion: (n._arrayVersion || 0) + 1
        })
    }

    function n(n, r, i) {
        t(n);
        let a = s(n, r, `move`, i),
            c = Math.min(r, i),
            u = Math.max(r, i);
        for (let e = c; e <= u; e++) a.push(o(n, e));
        let d = Object.keys(e.fieldInfo).reduce((t, i) => (i.startsWith(o(n, r)) && t.set(i, e.getFieldMeta(i)), t), new Map);
        l(a, r < i ? `up` : `down`), Object.keys(e.fieldInfo).filter(e => e.startsWith(o(n, i))).forEach(t => {
            let a = t.replace(o(n, i), o(n, r)),
                s = d.get(a);
            s && e.setFieldMeta(t, s)
        })
    }

    function r(e, n) {
        t(e), l(s(e, n, `remove`), `up`)
    }

    function i(n, r, i) {
        t(n), s(n, r, `swap`, i).forEach(t => {
            if (!t.toString().startsWith(o(n, r))) return;
            let a = t.toString().replace(o(n, r), o(n, i)),
                [s, c] = [e.getFieldMeta(t), e.getFieldMeta(a)];
            s && e.setFieldMeta(a, s), c && e.setFieldMeta(t, c)
        })
    }

    function a(n, r) {
        t(n);
        let i = s(n, r, `insert`);
        l(i, `down`), i.forEach(t => {
            t.toString().startsWith(o(n, r)) && e.setFieldMeta(t, u())
        })
    }

    function o(e, t) {
        return `${e}[${t}]`
    }

    function s(t, n, r, i) {
        let a = [o(t, n)];
        switch (r) {
            case `swap`:
                a.push(o(t, i));
                break;
            case `move`:
                {
                    let [e, r] = [Math.min(n, i), Math.max(n, i)];
                    for (let n = e; n <= r; n++) a.push(o(t, n));
                    break
                }
            default:
                {
                    let r = e.getFieldValue(t),
                        i = Array.isArray(r) ? r.length : 0;
                    for (let e = n + 1; e < i; e++) a.push(o(t, e));
                    break
                }
        }
        return Object.keys(e.fieldInfo).filter(e => a.some(t => e.startsWith(t)))
    }

    function c(e, t) {
        return e.replace(/\[(\d+)\]/, (e, n) => {
            let r = parseInt(n, 10);
            return `[${t===`up`?r+1:Math.max(0,r-1)}]`
        })
    }

    function l(t, n) {
        (n === `up` ? t : [...t].reverse()).forEach(t => {
            let r = c(t.toString(), n),
                i = e.getFieldMeta(r);
            i ? e.setFieldMeta(t, i) : e.setFieldMeta(t, u())
        })
    }
    let u = () => Fg;
    return {
        bumpArrayVersion: t,
        handleArrayMove: n,
        handleArrayRemove: r,
        handleArraySwap: i,
        handleArrayInsert: a
    }
}

function Lg(e) {
    return {
        values: e.values ?? {},
        errorMap: e.errorMap ?? {},
        fieldMetaBase: e.fieldMetaBase ?? {},
        formGroupStateBase: e.formGroupStateBase ?? {},
        isSubmitted: e.isSubmitted ?? !1,
        isSubmitting: e.isSubmitting ?? !1,
        isValidating: e.isValidating ?? !1,
        submissionAttempts: e.submissionAttempts ?? 0,
        isSubmitSuccessful: e.isSubmitSuccessful ?? !1,
        validationMetaMap: e.validationMetaMap ?? {
            onChange: void 0,
            onBlur: void 0,
            onSubmit: void 0,
            onMount: void 0,
            onServer: void 0,
            onDynamic: void 0
        }
    }
}
var Rg = class {
    constructor(e) {
        this.options = {}, this.fieldInfo = {}, this.formGroupApis = new Set, this.mount = () => {
            let e = this.store.subscribe(() => {
                    Og(this)
                }),
                t = ag.on(`request-form-state`, e => {
                    e.payload.id === this._formId && ag.emit(`form-api`, {
                        id: this._formId,
                        state: this.store.state,
                        options: this.options
                    })
                }),
                n = ag.on(`request-form-reset`, e => {
                    e.payload.id === this._formId && this.reset()
                }),
                r = ag.on(`request-form-force-submit`, e => {
                    e.payload.id === this._formId && (this._devtoolsSubmissionOverride = !0, this.handleSubmit(), this._devtoolsSubmissionOverride = !1)
                }),
                i = () => {
                    r(), n(), t(), e.unsubscribe(), ag.emit(`form-unmounted`, {
                        id: this._formId
                    })
                };
            this.options.listeners ?.onMount ?.({
                formApi: this
            });
            let {
                onMount: a
            } = this.options.validators || {};
            return ag.emit(`form-api`, {
                id: this._formId,
                state: this.store.state,
                options: this.options
            }), a && this.validateSync(`mount`), i
        }, this.update = e => {
            if (!e) return;
            let t = this.options;
            this.options = e;
            let n = e.defaultValues && !bg(e.defaultValues, t.defaultValues) && !this.state.isTouched,
                r = !bg(e.defaultState, t.defaultState) && !this.state.isTouched;
            if (!(!n && !r)) {
                if (Mh(() => {
                        this.baseStore.setState(() => Lg(Object.assign({}, this.state, r ? e.defaultState : {}, n ? {
                            values: e.defaultValues
                        } : {})))
                    }), n) {
                    let e = Ig(this);
                    for (let t of Object.keys(this.fieldInfo)) Array.isArray(this.getFieldValue(t)) && e.bumpArrayVersion(t)
                }
                ag.emit(`form-api`, {
                    id: this._formId,
                    state: this.store.state,
                    options: this.options
                })
            }
        }, this.reset = (e, t) => {
            let {
                fieldMeta: n
            } = this.state, r = this.resetFieldMeta(n);
            e && !t ?.keepDefaultValues && (this.options = { ...this.options,
                defaultValues: e
            }), this.baseStore.setState(() => {
                let t = e ?? this.options.defaultValues ?? this.options.defaultState ?.values;
                return e || Object.values(this.fieldInfo).forEach(e => {
                    e.instance && e.instance.options.defaultValue !== void 0 && (t = cg(t, e.instance.name, e.instance.options.defaultValue))
                }), Lg({ ...this.options.defaultState,
                    values: t,
                    fieldMetaBase: r
                })
            })
        }, this.validateAllFields = async e => {
            let t = [];
            return Mh(() => {
                Object.values(this.fieldInfo).forEach(n => {
                    if (!n.instance) return;
                    let r = n.instance;
                    t.push(Promise.resolve().then(() => r.validate(e, {
                        skipFormValidation: !0,
                        skipGroupValidation: !0
                    }))), n.instance.store.state.meta.isTouched || n.instance.setMeta(e => ({ ...e,
                        isTouched: !0
                    }))
                })
            }), (await Promise.all(t)).flat()
        }, this.validateArrayFieldsStartingFrom = async (e, t, n) => {
            let r = this.getFieldValue(e),
                i = Array.isArray(r) ? Math.max(r.length - 1, 0) : null,
                a = [`${e}[${t}]`];
            for (let n = t + 1; n <= (i ?? 0); n++) a.push(`${e}[${n}]`);
            let o = Object.keys(this.fieldInfo).filter(e => a.some(t => e.startsWith(t))),
                s = [];
            return Mh(() => {
                o.forEach(e => {
                    s.push(Promise.resolve().then(() => this.validateField(e, n)))
                })
            }), (await Promise.all(s)).flat()
        }, this.validateField = (e, t) => {
            let n = this.fieldInfo[e] ?.instance;
            if (!n) {
                let {
                    hasErrored: n
                } = this.validateSync(t);
                return n && !this.options.asyncAlways ? this.getFieldMeta(e) ?.errors ?? [] : this.validateAsync(t).then(() => this.getFieldMeta(e) ?.errors ?? [])
            }
            return n.store.state.meta.isTouched || n.setMeta(e => ({ ...e,
                isTouched: !0
            })), n.validate(t)
        }, this.validateSync = (e, t) => {
            let n = _g(e, { ...this.options,
                    form: this,
                    group: t ?.group,
                    validationLogic: this.options.validationLogic || Ag
                }),
                r = !1,
                i = {};
            return Mh(() => {
                for (let e of n) {
                    if (!e.validate) continue;
                    let {
                        formError: n,
                        fieldErrors: a
                    } = zg(this.runValidator({
                        validate: e.validate,
                        value: {
                            value: this.state.values,
                            formApi: this,
                            validationSource: `form`
                        },
                        type: `validate`
                    })), o = Bg(e.cause), s = new Set([...Object.keys(this.state.fieldMeta), ...Object.keys(a || {})]);
                    t ?.filterFieldNames && (s = new Set([...s].filter(t.filterFieldNames)));
                    for (let e of s) {
                        if (this.baseStore.state.fieldMetaBase[e] === void 0 && !a ?.[e]) continue;
                        let {
                            errorMap: t,
                            errorSourceMap: n
                        } = this.getFieldMeta(e) ?? Fg, r = a ?.[e], {
                            newErrorValue: s,
                            newSource: c
                        } = xg({
                            newFormValidatorError: r,
                            isPreviousErrorFromFormValidator: n ?.[o] === `form`,
                            previousErrorValue: t ?.[o]
                        });
                        c === `form` && (i[e] = { ...i[e],
                            [o]: r
                        }), t ?.[o] !== s && this.setFieldMeta(e, (e = Fg) => ({ ...e,
                            errorMap: { ...e.errorMap,
                                [o]: s
                            },
                            errorSourceMap: { ...e.errorSourceMap,
                                [o]: c
                            }
                        }))
                    }
                    t ?.dontUpdateFormErrorMap || this.state.errorMap ?.[o] !== n && this.baseStore.setState(e => ({ ...e,
                        errorMap: { ...e.errorMap,
                            [o]: n
                        }
                    })), (n || a) && (r = !0)
                }
                if (t ?.dontUpdateFormErrorMap) return;
                let a = Bg(`submit`);
                this.state.errorMap ?.[a] && e !== `submit` && !r && this.baseStore.setState(e => ({ ...e,
                    errorMap: { ...e.errorMap,
                        [a]: void 0
                    }
                }));
                let o = Bg(`server`);
                this.state.errorMap ?.[o] && e !== `server` && !r && this.baseStore.setState(e => ({ ...e,
                    errorMap: { ...e.errorMap,
                        [o]: void 0
                    }
                }))
            }), {
                hasErrored: r,
                fieldsErrorMap: i
            }
        }, this.validateAsync = async (e, t) => {
            let n = vg(e, { ...this.options,
                form: this,
                group: t ?.group,
                validationLogic: this.options.validationLogic || Ag
            });
            this.state.isFormValidating || this.baseStore.setState(e => ({ ...e,
                isFormValidating: !0
            }));
            let r = [],
                i;
            for (let e of n) {
                if (!e.validate) continue;
                let n = Bg(e.cause);
                this.state.validationMetaMap[n] ?.lastAbortController.abort();
                let a = new AbortController;
                this.state.validationMetaMap[n] = {
                    lastAbortController: a
                }, r.push(new Promise(async n => {
                    let r;
                    try {
                        r = await new Promise((t, n) => {
                            setTimeout(async () => {
                                if (a.signal.aborted) return t(void 0);
                                try {
                                    t(await this.runValidator({
                                        validate: e.validate,
                                        value: {
                                            value: this.state.values,
                                            formApi: this,
                                            validationSource: `form`,
                                            signal: a.signal
                                        },
                                        type: `validateAsync`
                                    }))
                                } catch (e) {
                                    n(e)
                                }
                            }, e.debounceMs)
                        })
                    } catch (e) {
                        r = e
                    }
                    let {
                        formError: o,
                        fieldErrors: s
                    } = zg(r);
                    s && (i = i ? { ...i,
                        ...s
                    } : s);
                    let c = Bg(e.cause),
                        l = Object.keys(this.state.fieldMeta);
                    t ?.filterFieldNames && (l = l.filter(t.filterFieldNames));
                    for (let e of l) {
                        if (this.baseStore.state.fieldMetaBase[e] === void 0) continue;
                        let t = this.getFieldMeta(e);
                        if (!t) continue;
                        let {
                            errorMap: n,
                            errorSourceMap: r
                        } = t, a = i ?.[e], {
                            newErrorValue: o,
                            newSource: s
                        } = xg({
                            newFormValidatorError: a,
                            isPreviousErrorFromFormValidator: r ?.[c] === `form`,
                            previousErrorValue: n ?.[c]
                        });
                        n ?.[c] !== o && this.setFieldMeta(e, e => ({ ...e,
                            errorMap: { ...e.errorMap,
                                [c]: o
                            },
                            errorSourceMap: { ...e.errorSourceMap,
                                [c]: s
                            }
                        }))
                    }
                    t ?.dontUpdateFormErrorMap || this.baseStore.setState(e => ({ ...e,
                        errorMap: { ...e.errorMap,
                            [c]: o
                        }
                    })), n(i ? {
                        fieldErrors: i,
                        errorMapKey: c
                    } : void 0)
                }))
            }
            let a = [],
                o = {};
            if (r.length) {
                a = await Promise.all(r);
                for (let e of a)
                    if (e ?.fieldErrors) {
                        let {
                            errorMapKey: t
                        } = e;
                        for (let [n, r] of Object.entries(e.fieldErrors)) o[n] = { ...o[n] || {},
                            [t]: r
                        }
                    }
            }
            return this.baseStore.setState(e => ({ ...e,
                isFormValidating: !1
            })), o
        }, this.validate = (e, t) => {
            let {
                hasErrored: n,
                fieldsErrorMap: r
            } = this.validateSync(e, t);
            return n && !this.options.asyncAlways ? r : this.validateAsync(e, t)
        }, this._handleSubmit = async e => {
            this.baseStore.setState(e => ({ ...e,
                isSubmitted: !1,
                submissionAttempts: e.submissionAttempts + 1,
                isSubmitSuccessful: !1
            })), Mh(() => {
                Object.values(this.fieldInfo).forEach(e => {
                    e.instance && (e.instance.store.state.meta.isTouched || e.instance.setMeta(e => ({ ...e,
                        isTouched: !0
                    })))
                })
            });
            let t = e ?? this.options.onSubmitMeta;
            if (!this.state.canSubmit && !this._devtoolsSubmissionOverride) {
                this.options.onSubmitInvalid ?.({
                    value: this.state.values,
                    formApi: this,
                    meta: t
                });
                return
            }
            this.baseStore.setState(e => ({ ...e,
                isSubmitting: !0
            }));
            let n = () => {
                this.baseStore.setState(e => ({ ...e,
                    isSubmitting: !1
                }))
            };
            if (await this.validateAllFields(`submit`), !this.state.isFieldsValid) {
                n(), this.options.onSubmitInvalid ?.({
                    value: this.state.values,
                    formApi: this,
                    meta: t
                }), ag.emit(`form-submission`, {
                    id: this._formId,
                    submissionAttempt: this.state.submissionAttempts,
                    successful: !1,
                    stage: `validateAllFields`,
                    errors: Object.values(this.state.fieldMeta).map(e => e.errors).flat()
                });
                return
            }
            if (await this.validate(`submit`), !this.state.isValid) {
                n(), this.options.onSubmitInvalid ?.({
                    value: this.state.values,
                    formApi: this,
                    meta: t
                }), ag.emit(`form-submission`, {
                    id: this._formId,
                    submissionAttempt: this.state.submissionAttempts,
                    successful: !1,
                    stage: `validate`,
                    errors: this.state.errors
                });
                return
            }
            Mh(() => {
                Object.values(this.fieldInfo).forEach(e => {
                    e.instance ?.triggerOnSubmitListener()
                })
            }), this.options.listeners ?.onSubmit ?.({
                formApi: this,
                meta: t
            });
            try {
                await this.options.onSubmit ?.({
                    value: this.state.values,
                    formApi: this,
                    meta: t
                }), Mh(() => {
                    this.baseStore.setState(e => ({ ...e,
                        isSubmitted: !0,
                        isSubmitSuccessful: !0
                    })), ag.emit(`form-submission`, {
                        id: this._formId,
                        submissionAttempt: this.state.submissionAttempts,
                        successful: !0
                    }), n()
                })
            } catch (e) {
                throw this.baseStore.setState(e => ({ ...e,
                    isSubmitSuccessful: !1
                })), ag.emit(`form-submission`, {
                    id: this._formId,
                    submissionAttempt: this.state.submissionAttempts,
                    successful: !1,
                    stage: `inflight`,
                    onError: e
                }), n(), e
            }
        }, this.getFieldValue = e => sg(this.state.values, e), this.getFieldMeta = e => this.state.fieldMeta[e], this.getFormGroupMeta = e => this.formGroupMetaDerived.state[e], this.getFieldInfo = e => this.fieldInfo[e] ||= {
            instance: null,
            validationMetaMap: {
                onChange: void 0,
                onBlur: void 0,
                onSubmit: void 0,
                onMount: void 0,
                onServer: void 0,
                onDynamic: void 0
            }
        }, this.setFieldMeta = (e, t) => {
            this.baseStore.setState(n => ({ ...n,
                fieldMetaBase: { ...n.fieldMetaBase,
                    [e]: og(t, n.fieldMetaBase[e])
                }
            }))
        }, this.resetFieldMeta = e => Object.keys(e).reduce((e, t) => {
            let n = t;
            return e[n] = Fg, e
        }, {}), this.setFieldValue = (e, t, n) => {
            let r = n ?.dontUpdateMeta ?? !1,
                i = n ?.dontRunListeners ?? !1,
                a = n ?.dontValidate ?? !1;
            Mh(() => {
                r || this.setFieldMeta(e, e => ({ ...e,
                    isTouched: !0,
                    isDirty: !0,
                    errorMap: { ...e ?.errorMap,
                        onMount : void 0
                    }
                })), this.baseStore.setState(n => ({ ...n,
                    values: cg(n.values, e, t)
                }))
            }), i || this.getFieldInfo(e).instance ?.triggerOnChangeListener(), a || this.validateField(e, `change`)
        }, this.deleteField = e => {
            let t = [...Object.keys(this.fieldInfo).filter(t => {
                let n = e.toString();
                return t !== n && t.startsWith(n)
            }), e];
            this.baseStore.setState(e => {
                let n = { ...e
                };
                return t.forEach(e => {
                    n.values = lg(n.values, e), delete this.fieldInfo[e], delete n.fieldMetaBase[e]
                }), n
            })
        }, this.pushFieldValue = (e, t, n) => {
            this.setFieldValue(e, e => [...Array.isArray(e) ? e : [], t], n), Ig(this).bumpArrayVersion(e)
        }, this.insertFieldValue = async (e, t, n, r) => {
            this.setFieldValue(e, e => [...e.slice(0, t), n, ...e.slice(t)], Cg(r, {
                dontValidate: !0
            }));
            let i = r ?.dontValidate ?? !1;
            i || await this.validateField(e, `change`), Ig(this).handleArrayInsert(e, t), i || await this.validateArrayFieldsStartingFrom(e, t, `change`)
        }, this.replaceFieldValue = async (e, t, n, r) => {
            this.setFieldValue(e, e => e.map((e, r) => r === t ? n : e), Cg(r, {
                dontValidate: !0
            })), Ig(this).bumpArrayVersion(e), (r ?.dontValidate ?? !1) || (await this.validateField(e, `change`), await this.validateArrayFieldsStartingFrom(e, t, `change`))
        }, this.removeFieldValue = async (e, t, n) => {
            let r = this.getFieldValue(e),
                i = Array.isArray(r) ? Math.max(r.length - 1, 0) : null;
            if (this.setFieldValue(e, e => e.filter((e, n) => n !== t), Cg(n, {
                    dontValidate: !0
                })), Ig(this).handleArrayRemove(e, t), i !== null) {
                let t = `${e}[${i}]`;
                this.deleteField(t)
            }(n ?.dontValidate ?? !1) || (await this.validateField(e, `change`), await this.validateArrayFieldsStartingFrom(e, t, `change`))
        }, this.swapFieldValues = (e, t, n, r) => {
            this.setFieldValue(e, e => {
                let r = e[t],
                    i = e[n];
                return cg(cg(e, `${t}`, i), `${n}`, r)
            }, Cg(r, {
                dontValidate: !0
            })), Ig(this).handleArraySwap(e, t, n), (r ?.dontValidate ?? !1) || (this.validateField(e, `change`), this.validateField(`${e}[${t}]`, `change`), this.validateField(`${e}[${n}]`, `change`))
        }, this.moveFieldValues = (e, t, n, r) => {
            this.setFieldValue(e, e => {
                let r = [...e];
                return r.splice(n, 0, r.splice(t, 1)[0]), r
            }, Cg(r, {
                dontValidate: !0
            })), Ig(this).handleArrayMove(e, t, n), (r ?.dontValidate ?? !1) || (this.validateField(e, `change`), this.validateField(`${e}[${t}]`, `change`), this.validateField(`${e}[${n}]`, `change`))
        }, this.clearFieldValues = (e, t) => {
            let n = this.getFieldValue(e),
                r = Array.isArray(n) ? Math.max(n.length - 1, 0) : null;
            if (this.setFieldValue(e, [], Cg(t, {
                    dontValidate: !0
                })), Ig(this).bumpArrayVersion(e), r !== null)
                for (let t = 0; t <= r; t++) {
                    let n = `${e}[${t}]`;
                    this.deleteField(n)
                }(t ?.dontValidate ?? !1) || this.validateField(e, `change`)
        }, this.resetField = e => {
            this.baseStore.setState(t => {
                let n = this.getFieldInfo(e).instance ?.options.defaultValue,
                    r = sg(this.options.defaultValues, e),
                    i = n ?? r;
                return { ...t,
                    fieldMetaBase: { ...t.fieldMetaBase,
                        [e]: Fg
                    },
                    values: i === void 0 ? t.values : cg(t.values, e, i)
                }
            })
        }, this.setErrorMap = e => {
            Mh(() => {
                Object.entries(e).forEach(([e, t]) => {
                    let n = e;
                    if (yg(t)) {
                        let {
                            formError: e,
                            fieldErrors: r
                        } = zg(t);
                        for (let e of Object.keys(this.fieldInfo)) this.getFieldMeta(e) && this.setFieldMeta(e, t => ({ ...t,
                            errorMap: { ...t.errorMap,
                                [n]: r ?.[e]
                            },
                            errorSourceMap: { ...t.errorSourceMap,
                                [n]: `form`
                            }
                        }));
                        this.baseStore.setState(t => ({ ...t,
                            errorMap: { ...t.errorMap,
                                [n]: e
                            }
                        }))
                    } else this.baseStore.setState(e => ({ ...e,
                        errorMap: { ...e.errorMap,
                            [n]: t
                        }
                    }))
                })
            })
        }, this.getAllErrors = () => ({
            form: {
                errors: this.state.errors,
                errorMap: this.state.errorMap
            },
            fields: Object.entries(this.state.fieldMeta).reduce((e, [t, n]) => (Object.keys(n).length && n.errors.length && (e[t] = {
                errors: n.errors,
                errorMap: n.errorMap
            }), e), {})
        }), this.parseValuesWithSchema = e => Ng.validate({
            value: this.state.values,
            validationSource: `form`
        }, e), this.parseValuesWithSchemaAsync = e => Ng.validateAsync({
            value: this.state.values,
            validationSource: `form`
        }, e), this.timeoutIds = {
            validations: {},
            listeners: {},
            formListeners: {}
        }, this._formId = e ?.formId ?? Dg(), this._devtoolsSubmissionOverride = !1;
        let t = Lg({ ...e ?.defaultState,
            values : e ?.defaultValues ?? e ?.defaultState ?.values
        });
        if (e ?.transform) {
            t = e.transform({
                state: t
            }).state;
            for (let e of Object.keys(t.errorMap)) {
                let n = t.errorMap[e];
                if (!(n === void 0 || !yg(n)))
                    for (let r of Object.keys(n.fields)) {
                        let i = n.fields[r];
                        if (i === void 0) continue;
                        let a = t.fieldMetaBase[r];
                        t.fieldMetaBase[r] = {
                            isTouched: !1,
                            isValidating: !1,
                            isBlurred: !1,
                            isDirty: !1,
                            _arrayVersion: 0,
                            ...a ?? {},
                            errorSourceMap : { ...a ?.errorSourceMap ?? {},
                                onChange : `form`
                            },
                            errorMap : { ...a ?.errorMap ?? {},
                                [e] : i
                            }
                        }
                    }
            }
        }
        this.baseStore = zh(t);
        let n;
        this.fieldMetaDerived = zh(e => {
            let t = this.baseStore.get(),
                r = 0,
                i = {};
            for (let a of Object.keys(t.fieldMetaBase)) {
                let o = t.fieldMetaBase[a],
                    s = n ?.fieldMetaBase[a],
                    c = e ?.[a],
                    l = sg(t.values, a),
                    u = c ?.errors;
                if (!s || o.errorMap !== s.errorMap) {
                    u = Object.values(o.errorMap ?? {}).filter(e => e !== void 0);
                    let e = this.getFieldInfo(a) ?.instance;
                    (!e || !e.options.disableErrorFlat) && (u = u.flat(1))
                }
                let d = !gg(u),
                    f = !o.isDirty,
                    p = bg(l, this.getFieldInfo(a) ?.instance ?.options.defaultValue ?? sg(this.options.defaultValues, a));
                if (c && c.isPristine === f && c.isValid === d && c.isDefaultValue === p && c.errors === u && o === s) {
                    i[a] = c, r++;
                    continue
                }
                i[a] = { ...o,
                    errors: u ?? [],
                    isPristine: f,
                    isValid: d,
                    isDefaultValue: p
                }
            }
            return Object.keys(t.fieldMetaBase).length ? e && r === Object.keys(t.fieldMetaBase).length ? e : (n = this.baseStore.get(), i) : i
        }), this.formGroupMetaDerived = zh(e => {
            let t = this.baseStore.get(),
                n = this.fieldMetaDerived.get(),
                r = {};
            for (let i of this.formGroupApis) {
                let a = i.name,
                    o = t.formGroupStateBase[a] ?? {
                        isSubmitted: !1,
                        isSubmitting: !1,
                        isValidating: !1,
                        submissionAttempts: 0,
                        isSubmitSuccessful: !1
                    },
                    s = n[a],
                    c = !1,
                    l = !0,
                    u = !1,
                    d = !1,
                    f = !0,
                    p = !1;
                for (let e in n) {
                    if (e === a || !kg(a, e)) continue;
                    let t = n[e];
                    t && (t.isValidating && (c = !0), t.isValid || (l = !1), t.isTouched && (u = !0), t.isBlurred && (d = !0), t.isDefaultValue || (f = !1), t.isDirty && (p = !0))
                }
                let m = !p,
                    h = !!c || o.isValidating,
                    g = s ?.errorMap ?? {},
                    _ = s ?.errorSourceMap ?? {},
                    v = !!(g.onMount || Object.entries(n).some(([e, t]) => t && e !== a && kg(a, e) && t.errorMap.onMount)),
                    y = e ?.[a],
                    b = y ?.errors ?? [];
                (!y || y.__srcErrorMap !== g) && (b = Object.values(g).reduce((e, t) => {
                    if (t === void 0) return e;
                    if (t && typeof t == `object` && `fields` in t) {
                        let n = t.group;
                        return n !== void 0 && e.push(n), e
                    }
                    return e.push(t), e
                }, []));
                let x = b.length === 0,
                    S = l && x,
                    C = i.options.canSubmitWhenInvalid ?? !1,
                    w = o.submissionAttempts === 0 && !u && !v || !h && !o.isSubmitting && S || C;
                if (y && y.errorMap === g && y.errorSourceMap === _ && y.errors === b && y.isFieldsValidating === c && y.isFieldsValid === l && y.isGroupValid === x && y.isValid === S && y.canSubmit === w && y.isTouched === u && y.isBlurred === d && y.isPristine === m && y.isDefaultValue === f && y.isDirty === p && y.isValidating === h && y.isSubmitting === o.isSubmitting && y.isSubmitted === o.isSubmitted && y.submissionAttempts === o.submissionAttempts && y.isSubmitSuccessful === o.isSubmitSuccessful) {
                    r[a] = y;
                    continue
                }
                let T = { ...o,
                    errorMap: g,
                    errorSourceMap: _,
                    _arrayVersion: s ?._arrayVersion ?? 0,
                    isTouched: u,
                    isBlurred: d,
                    isDirty: p,
                    isPristine: m,
                    isDefaultValue: f,
                    isValid: S,
                    errors: b,
                    isValidating: h,
                    isFieldsValidating: c,
                    isFieldsValid: l,
                    isGroupValid: x,
                    canSubmit: w
                };
                Object.defineProperty(T, `__srcErrorMap`, {
                    value: g,
                    enumerable: !1,
                    configurable: !0
                }), r[a] = T
            }
            return r
        });
        let r;
        this.store = zh(e => {
            let t = this.baseStore.get(),
                n = this.fieldMetaDerived.get(),
                i = Object.values(n).filter(Boolean),
                a = i.some(e => e.isValidating),
                o = i.every(e => e.isValid),
                s = i.some(e => e.isTouched),
                c = i.some(e => e.isBlurred),
                l = i.every(e => e.isDefaultValue),
                u = s && t.errorMap ?.onMount,
                d = i.some(e => e.isDirty),
                f = !d,
                p = !!(t.errorMap ?.onMount || i.some(e => e ?.errorMap ?.onMount)),
                m = !!a,
                h = e ?.errors ?? [];
            (!r || t.errorMap !== r.errorMap) && (h = Object.values(t.errorMap).reduce((e, t) => t === void 0 ? e : t && yg(t) ? (e.push(t.form), e) : (e.push(t), e), []));
            let g = h.length === 0,
                _ = o && g,
                v = this.options.canSubmitWhenInvalid ?? !1,
                y = t.submissionAttempts === 0 && !s && !p || !m && !t.isSubmitting && _ || v,
                b = t.errorMap;
            if (u && (h = h.filter(e => e !== t.errorMap.onMount), b = Object.assign(b, {
                    onMount: void 0
                })), e && r && e.errorMap === b && e.fieldMeta === this.fieldMetaDerived.state && e.errors === h && e.isFieldsValidating === a && e.isFieldsValid === o && e.isFormValid === g && e.isValid === _ && e.canSubmit === y && e.isTouched === s && e.isBlurred === c && e.isPristine === f && e.isDefaultValue === l && e.isDirty === d && bg(r, t)) return e;
            let x = { ...t,
                errorMap: b,
                fieldMeta: this.fieldMetaDerived.state,
                errors: h,
                isFieldsValidating: a,
                isFieldsValid: o,
                isFormValid: g,
                isValid: _,
                canSubmit: y,
                isTouched: s,
                isBlurred: c,
                isPristine: f,
                isDefaultValue: l,
                isDirty: d
            };
            return r = this.baseStore.get(), x
        }), this.handleSubmit = this.handleSubmit.bind(this), this.update(e || {})
    }
    get state() {
        return this.store.state
    }
    get formId() {
        return this._formId
    }
    runValidator(e) {
        return Pg(e.validate) ? Ng[e.type](e.value, e.validate) : e.validate(e.value)
    }
    handleSubmit(e) {
        return this._handleSubmit(e)
    }
};

function zg(e) {
    return e ? yg(e) ? {
        formError: zg(e.form).formError,
        fieldErrors: e.fields
    } : {
        formError: e
    } : {
        formError: void 0
    }
}

function Bg(e) {
    switch (e) {
        case `submit`:
            return `onSubmit`;
        case `blur`:
            return `onBlur`;
        case `mount`:
            return `onMount`;
        case `server`:
            return `onServer`;
        case `dynamic`:
            return `onDynamic`;
        default:
            return `onChange`
    }
}
var Vg = class e {
    constructor(t) {
        this.options = {}, this.mount = () => {
            this.options.defaultValue !== void 0 && !this.getMeta().isTouched && this.form.setFieldValue(this.name, this.options.defaultValue, {
                dontUpdateMeta: !0
            });
            let e = this.getInfo();
            e.instance = this, this.update(this.options);
            let {
                onMount: t
            } = this.options.validators || {};
            if (t) {
                let e = this.runValidator({
                    validate: t,
                    value: {
                        value: this.state.value,
                        fieldApi: this,
                        validationSource: `field`
                    },
                    type: `validate`
                });
                e && this.setMeta(t => ({ ...t,
                    errorMap: { ...t ?.errorMap,
                        onMount : e
                    },
                    errorSourceMap: { ...t ?.errorSourceMap,
                        onMount : `field`
                    }
                }))
            }
            return this.options.listeners ?.onMount ?.({
                value: this.state.value,
                fieldApi: this
            }), () => {
                for (let [e, t] of Object.entries(this.timeoutIds.validations)) t && (clearTimeout(t), this.timeoutIds.validations[e] = null);
                for (let [e, t] of Object.entries(this.timeoutIds.listeners)) t && (clearTimeout(t), this.timeoutIds.listeners[e] = null);
                for (let [e, t] of Object.entries(this.timeoutIds.formListeners)) t && (clearTimeout(t), this.timeoutIds.formListeners[e] = null);
                let e = this.form.fieldInfo[this.name];
                if (e && e.instance === this) {
                    for (let [t, n] of Object.entries(e.validationMetaMap)) n ?.lastAbortController.abort(), e.validationMetaMap[t] = void 0;
                    this.form.baseStore.setState(e => ({ ...e,
                        fieldMetaBase: { ...e.fieldMetaBase,
                            [this.name]: { ...Fg,
                                isTouched: e.fieldMetaBase[this.name] ?.isTouched ?? Fg.isTouched,
                                isBlurred: e.fieldMetaBase[this.name] ?.isBlurred ?? Fg.isBlurred,
                                isDirty: e.fieldMetaBase[this.name] ?.isDirty ?? Fg.isDirty
                            }
                        }
                    })), e.instance = null, this.options.listeners ?.onUnmount ?.({
                        value: this.state.value,
                        fieldApi: this
                    }), this.form.options.listeners ?.onFieldUnmount ?.({
                        formApi: this.form,
                        fieldApi: this
                    })
                }
            }
        }, this.update = e => {
            this.options = e, this.name = e.name, !this.state.meta.isTouched && this.options.defaultValue !== void 0 && (bg(this.form.getFieldValue(this.name), e.defaultValue) || this.form.setFieldValue(this.name, e.defaultValue, {
                dontUpdateMeta: !0,
                dontValidate: !0,
                dontRunListeners: !0
            })), this.form.getFieldMeta(this.name) || this.form.setFieldMeta(this.name, this.state.meta)
        }, this.getValue = () => this.form.getFieldValue(this.name), this.setValue = (e, t) => {
            this.form.setFieldValue(this.name, e, Cg(t, {
                dontRunListeners: !0,
                dontValidate: !0
            })), t ?.dontRunListeners || this.triggerOnChangeListener(), t ?.dontValidate || this.validate(`change`)
        }, this.getMeta = () => this.store.state.meta, this.setMeta = e => this.form.setFieldMeta(this.name, e), this.getInfo = () => this.form.getFieldInfo(this.name), this.pushValue = (e, t) => {
            this.form.pushFieldValue(this.name, e, Cg(t, {
                dontRunListeners: !0
            })), t ?.dontRunListeners || this.triggerOnChangeListener()
        }, this.insertValue = (e, t, n) => {
            this.form.insertFieldValue(this.name, e, t, Cg(n, {
                dontRunListeners: !0
            })), n ?.dontRunListeners || this.triggerOnChangeListener()
        }, this.replaceValue = (e, t, n) => {
            this.form.replaceFieldValue(this.name, e, t, Cg(n, {
                dontRunListeners: !0
            })), n ?.dontRunListeners || this.triggerOnChangeListener()
        }, this.removeValue = (e, t) => {
            this.form.removeFieldValue(this.name, e, Cg(t, {
                dontRunListeners: !0
            })), t ?.dontRunListeners || this.triggerOnChangeListener()
        }, this.swapValues = (e, t, n) => {
            this.form.swapFieldValues(this.name, e, t, Cg(n, {
                dontRunListeners: !0
            })), n ?.dontRunListeners || this.triggerOnChangeListener()
        }, this.moveValue = (e, t, n) => {
            this.form.moveFieldValues(this.name, e, t, Cg(n, {
                dontRunListeners: !0
            })), n ?.dontRunListeners || this.triggerOnChangeListener()
        }, this.clearValues = e => {
            this.form.clearFieldValues(this.name, Cg(e, {
                dontRunListeners: !0
            })), e ?.dontRunListeners || this.triggerOnChangeListener()
        }, this.getLinkedFields = t => {
            let n = Object.values(this.form.fieldInfo),
                r = [];
            for (let i of n) {
                if (!i.instance || !(i.instance instanceof e)) continue;
                let {
                    onChangeListenTo: n,
                    onBlurListenTo: a
                } = i.instance.options.validators || {};
                t === `change` && n ?.includes(this.name) && r.push(i.instance), t === `blur` && a ?.includes(this.name) && r.push(i.instance)
            }
            return r
        }, this.validateSync = (e, t) => {
            let n = _g(e, { ...this.options,
                    form: this.form,
                    fieldName: this.name,
                    validationLogic: this.form.options.validationLogic || Ag
                }),
                r = this.getLinkedFields(e).reduce((t, n) => {
                    let r = _g(e, { ...n.options,
                        form: n.form,
                        fieldName: n.name,
                        validationLogic: n.form.options.validationLogic || Ag
                    });
                    return r.forEach(e => {
                        e.field = n
                    }), t.concat(r)
                }, []),
                i = !1;
            Mh(() => {
                let e = (e, n) => {
                    let r = Ug(n.cause),
                        a = n.validate ? Hg(e.runValidator({
                            validate: n.validate,
                            value: {
                                value: e.store.state.value,
                                validationSource: `field`,
                                fieldApi: e
                            },
                            type: `validate`
                        })) : void 0,
                        o = t[r],
                        {
                            newErrorValue: s,
                            newSource: c
                        } = Sg({
                            formLevelError: o,
                            fieldLevelError: a
                        });
                    e.state.meta.errorMap ?.[r] !== s && e.setMeta(e => ({ ...e,
                        errorMap: { ...e.errorMap,
                            [r]: s
                        },
                        errorSourceMap: { ...e.errorSourceMap,
                            [r]: c
                        }
                    })), s && (i = !0)
                };
                for (let t of n) e(this, t);
                for (let t of r) t.validate && e(t.field, t)
            });
            let a = Ug(`submit`);
            return this.state.meta.errorMap ?.[a] && e !== `submit` && !i && this.setMeta(e => ({ ...e,
                errorMap: { ...e.errorMap,
                    [a]: void 0
                },
                errorSourceMap: { ...e.errorSourceMap,
                    [a]: void 0
                }
            })), {
                hasErrored: i
            }
        }, this.validateAsync = async (e, t) => {
            let n = vg(e, { ...this.options,
                    form: this.form,
                    fieldName: this.name,
                    validationLogic: this.form.options.validationLogic || Ag
                }),
                r = await t,
                i = this.getLinkedFields(e),
                a = i.reduce((t, n) => {
                    let r = vg(e, { ...n.options,
                        form: n.form,
                        fieldName: n.name,
                        validationLogic: n.form.options.validationLogic || Ag
                    });
                    return r.forEach(e => {
                        e.field = n
                    }), t.concat(r)
                }, []),
                o = [],
                s = [],
                c = n.some(e => e.validate) || a.some(e => e.validate);
            if (c) {
                this.state.meta.isValidating || this.setMeta(e => ({ ...e,
                    isValidating: !0
                }));
                for (let e of i) e.setMeta(e => ({ ...e,
                    isValidating: !0
                }))
            }
            let l = (e, t, n) => {
                let i = Ug(t.cause),
                    a = e.getInfo();
                a.validationMetaMap[i] ?.lastAbortController.abort();
                let o = new AbortController;
                a.validationMetaMap[i] = {
                    lastAbortController: o
                }, n.push(new Promise(async n => {
                    let a;
                    try {
                        a = await new Promise((n, r) => {
                            e.timeoutIds.validations[t.cause] && clearTimeout(e.timeoutIds.validations[t.cause]), e.timeoutIds.validations[t.cause] = setTimeout(async () => {
                                if (o.signal.aborted) return n(void 0);
                                try {
                                    n(await this.runValidator({
                                        validate: t.validate,
                                        value: {
                                            value: e.store.state.value,
                                            fieldApi: e,
                                            signal: o.signal,
                                            validationSource: `field`
                                        },
                                        type: `validateAsync`
                                    }))
                                } catch (e) {
                                    r(e)
                                }
                            }, t.debounceMs)
                        })
                    } catch (e) {
                        a = e
                    }
                    if (o.signal.aborted) return n(void 0);
                    let s = Hg(a),
                        c = r[e.name] ?.[i],
                        {
                            newErrorValue: l,
                            newSource: u
                        } = Sg({
                            formLevelError: c,
                            fieldLevelError: s
                        });
                    if (e.getInfo().instance !== e) return n(void 0);
                    e.setMeta(e => ({ ...e,
                        errorMap: { ...e ?.errorMap,
                            [i] : l
                        },
                        errorSourceMap: { ...e.errorSourceMap,
                            [i]: u
                        }
                    })), n(l)
                }))
            };
            for (let e of n) e.validate && l(this, e, o);
            for (let e of a) e.validate && l(e.field, e, s);
            let u = [];
            if ((o.length || s.length) && (u = await Promise.all(o), await Promise.all(s)), c) {
                this.setMeta(e => ({ ...e,
                    isValidating: !1
                }));
                for (let e of i) e.setMeta(e => ({ ...e,
                    isValidating: !1
                }))
            }
            return u.filter(Boolean)
        }, this.validate = (e, t) => {
            if (!this.state.meta.isTouched) return [];
            let n = t ?.skipGroupValidation ? [] : Array.from(this.form.formGroupApis).filter(e => this.name.startsWith(e.name)),
                r = (t ?.skipFormValidation ? {
                    fieldsErrorMap: {}
                } : this.form.validateSync(e)).fieldsErrorMap[this.name] ?? {};
            if (!t ?.skipFormValidation)
                for (let t of n) {
                    if (t.state.meta.submissionAttempts === 0) continue;
                    let {
                        fieldsErrorMap: n
                    } = this.form.validateSync(e, {
                        group: t,
                        dontUpdateFormErrorMap: !0,
                        filterFieldNames: e => kg(t.name, e)
                    });
                    r = { ...r,
                        ...n[this.name] ?? {}
                    }
                }
            let {
                hasErrored: i
            } = this.validateSync(e, r), a = new WeakMap;
            for (let t of n) {
                let {
                    hasErrored: n
                } = t.validateSync(e, {}, {
                    skipRelatedFieldValidation: !0
                });
                a.set(t, n)
            }
            if (i && !this.options.asyncAlways) {
                this.getInfo().validationMetaMap[Ug(e)] ?.lastAbortController.abort();
                let t = [];
                for (let r of n) r.getInfo().validationMetaMap[Ug(e)] ?.lastAbortController.abort(), t.push(r.state.meta.errors);
                return [...this.state.meta.errors, ...t.flat()]
            }
            let o = t ?.skipFormValidation ? Promise.resolve({}) : this.form.validateAsync(e),
                s = this.validateAsync(e, o),
                c = [];
            for (let t of n) a.get(t) && !t.options.asyncAlways || c.push(t.validateAsync(e, o, {
                skipRelatedFieldValidation: !0
            }));
            return c.length === 0 ? s : Promise.all([s, ...c]).then(e => e.flat())
        }, this.handleChange = e => {
            this.setValue(e)
        }, this.handleBlur = () => {
            this.state.meta.isTouched || this.setMeta(e => ({ ...e,
                isTouched: !0
            })), this.state.meta.isBlurred || this.setMeta(e => ({ ...e,
                isBlurred: !0
            })), this.validate(`blur`), this.triggerOnBlurListener()
        }, this.setErrorMap = e => {
            this.setMeta(t => ({ ...t,
                errorMap: { ...t.errorMap,
                    ...e
                }
            }))
        }, this.parseValueWithSchema = e => Ng.validate({
            value: this.state.value,
            validationSource: `field`
        }, e), this.parseValueWithSchemaAsync = e => Ng.validateAsync({
            value: this.state.value,
            validationSource: `field`
        }, e), this.triggerOnBlurListener = () => {
            let e = this.form.options.listeners ?.onBlurDebounceMs;
            e && e > 0 ? (this.timeoutIds.formListeners.blur && clearTimeout(this.timeoutIds.formListeners.blur), this.timeoutIds.formListeners.blur = setTimeout(() => {
                this.form.options.listeners ?.onBlur ?.({
                    formApi: this.form,
                    fieldApi: this
                })
            }, e)) : this.form.options.listeners ?.onBlur ?.({
                formApi: this.form,
                fieldApi: this
            });
            let t = this.options.listeners ?.onBlurDebounceMs;
            t && t > 0 ? (this.timeoutIds.listeners.blur && clearTimeout(this.timeoutIds.listeners.blur), this.timeoutIds.listeners.blur = setTimeout(() => {
                this.options.listeners ?.onBlur ?.({
                    value: this.state.value,
                    fieldApi: this
                })
            }, t)) : this.options.listeners ?.onBlur ?.({
                value: this.state.value,
                fieldApi: this
            })
        }, this.triggerOnChangeListener = () => {
            let e = this.form.options.listeners ?.onChangeDebounceMs;
            e && e > 0 ? (this.timeoutIds.formListeners.change && clearTimeout(this.timeoutIds.formListeners.change), this.timeoutIds.formListeners.change = setTimeout(() => {
                this.form.options.listeners ?.onChange ?.({
                    formApi: this.form,
                    fieldApi: this
                })
            }, e)) : this.form.options.listeners ?.onChange ?.({
                formApi: this.form,
                fieldApi: this
            });
            let t = this.options.listeners ?.onChangeDebounceMs;
            t && t > 0 ? (this.timeoutIds.listeners.change && clearTimeout(this.timeoutIds.listeners.change), this.timeoutIds.listeners.change = setTimeout(() => {
                this.options.listeners ?.onChange ?.({
                    value: this.state.value,
                    fieldApi: this
                })
            }, t)) : this.options.listeners ?.onChange ?.({
                value: this.state.value,
                fieldApi: this
            });
            for (let e of this.form.formGroupApis) kg(e.name, this.name) && e.triggerOnChangeListener()
        }, this.triggerOnSubmitListener = () => {
            this.options.listeners ?.onSubmit ?.({
                value: this.state.value,
                fieldApi: this
            })
        }, this.form = t.form, this.name = t.name, this.options = t, this.timeoutIds = {
            validations: {},
            listeners: {},
            formListeners: {}
        }, this.store = zh(e => {
            this.form.store.get();
            let n = this.form.getFieldMeta(this.name) ?? { ...Fg,
                    ...t.defaultMeta
                },
                r = this.form.getFieldValue(this.name);
            return !n.isTouched && r === void 0 && this.options.defaultValue !== void 0 && !bg(r, this.options.defaultValue) && (r = this.options.defaultValue), e && e.value === r && e.meta === n ? e : {
                value: r,
                meta: n
            }
        })
    }
    get state() {
        return this.store.state
    }
    runValidator(e) {
        return Pg(e.validate) ? Ng[e.type](e.value, e.validate) : e.validate(e.value)
    }
};

function Hg(e) {
    if (e) return e
}

function Ug(e) {
    switch (e) {
        case `submit`:
            return `onSubmit`;
        case `blur`:
            return `onBlur`;
        case `mount`:
            return `onMount`;
        case `server`:
            return `onServer`;
        case `dynamic`:
            return `onDynamic`;
        default:
            return `onChange`
    }
}

function Wg(e) {
    return {
        isSubmitted: e.isSubmitted ?? !1,
        isSubmitting: e.isSubmitting ?? !1,
        isValidating: e.isValidating ?? !1,
        submissionAttempts: e.submissionAttempts ?? 0,
        isSubmitSuccessful: e.isSubmitSuccessful ?? !1
    }
}

function Gg(e) {
    return { ...Fg,
        ...e,
        errors: [],
        isPristine: !0,
        isValid: !0,
        isDefaultValue: !0,
        isFieldsValidating: !1,
        isFieldsValid: !0,
        isGroupValid: !0,
        canSubmit: !0,
        isSubmitting: !1,
        isSubmitted: !1,
        isValidating: !1,
        submissionAttempts: 0,
        isSubmitSuccessful: !1
    }
}
var Kg = class e {
    constructor(t) {
        this.options = {}, this.setFormGroupState = e => {
            this.form.baseStore.setState(t => {
                let n = t.formGroupStateBase[this.name] ?? Wg({});
                return { ...t,
                    formGroupStateBase: { ...t.formGroupStateBase,
                        [this.name]: e(n)
                    }
                }
            })
        }, this._lastDistributedFieldNames = {}, this.update = e => {
            this.options = e, this.name = e.name, !this.state.meta.isTouched && this.options.defaultValue !== void 0 && (bg(this.form.getFieldValue(this.name), e.defaultValue) || this.form.setFieldValue(this.name, e.defaultValue, {
                dontUpdateMeta: !0,
                dontValidate: !0,
                dontRunListeners: !0
            })), this.form.getFieldMeta(this.name) || this.form.setFieldMeta(this.name, { ...Fg,
                ...this.options.defaultMeta
            })
        }, this.mount = () => {
            this.update(this.options), this.form.formGroupApis.add(this), this.fieldInfo.instance = this, this.form.baseStore.setState(e => ({ ...e,
                formGroupStateBase: { ...e.formGroupStateBase,
                    [this.name]: e.formGroupStateBase[this.name] ?? Wg({ ...this.options.defaultState
                    })
                }
            }));
            let {
                onMount: e
            } = this.options.validators || {};
            if (e) {
                let t = this.runValidator({
                        validate: e,
                        value: {
                            value: this.state.value,
                            groupApi: this,
                            validationSource: `form`
                        },
                        type: `validate`
                    }),
                    n = t,
                    r;
                Jg(t) && (n = t.group, r = t.fields);
                let i = qg(n);
                i && this.setMeta(e => ({ ...e,
                    errorMap: { ...e.errorMap,
                        onMount: i
                    },
                    errorSourceMap: { ...e.errorSourceMap,
                        onMount: `field`
                    }
                })), this.distributeFieldErrors(`onMount`, r)
            }
            return this.options.listeners ?.onMount ?.({
                value: this.state.value,
                groupApi: this
            }), () => {
                for (let [e, t] of Object.entries(this.timeoutIds.validations)) t && (clearTimeout(t), this.timeoutIds.validations[e] = null);
                for (let [e, t] of Object.entries(this.timeoutIds.listeners)) t && (clearTimeout(t), this.timeoutIds.listeners[e] = null);
                for (let [e, t] of Object.entries(this.timeoutIds.formListeners)) t && (clearTimeout(t), this.timeoutIds.formListeners[e] = null);
                if (this.fieldInfo.instance === this) {
                    for (let [e, t] of Object.entries(this.fieldInfo.validationMetaMap)) t ?.lastAbortController.abort(), this.fieldInfo.validationMetaMap[e] = void 0;
                    this.form.formGroupApis.delete(this), this.form.baseStore.setState(e => ({ ...e,
                        formGroupStateBase: { ...e.formGroupStateBase,
                            [this.name]: Wg({})
                        }
                    })), this.fieldInfo.instance = null, this.options.listeners ?.onUnmount ?.({
                        value: this.state.value,
                        groupApi: this
                    })
                }
            }
        }, this.setValue = (e, t) => {
            this.form.setFieldValue(this.name, e, Cg(t, {
                dontRunListeners: !0,
                dontValidate: !0
            })), t ?.dontRunListeners || this.triggerOnChangeListener(), t ?.dontValidate || this.validate(`change`)
        }, this.getMeta = () => this.store.state.meta, this.setMeta = e => this.form.setFieldMeta(this.name, e), this.getInfo = () => this.fieldInfo, this.getRelatedFields = () => {
            let e = Object.values(this.form.fieldInfo),
                t = [];
            for (let n of e) n.instance && n.instance instanceof Vg && n.instance.name.startsWith(this.name) && t.push(n.instance);
            return t
        }, this.getRelatedFieldMetasDerived = () => {
            let e = Object.entries(this.form.fieldMetaDerived.state),
                t = [];
            for (let [n, r] of e) n !== this.name && kg(this.name, n) && t.push({ ...r,
                name: n
            });
            return t
        }, this.buildChildFieldName = e => e === `` ? this.name : e.startsWith(`[`) ? `${this.name}${e}` : `${this.name}.${e}`, this.distributeFieldErrors = (e, t) => {
            let n = this._lastDistributedFieldNames[e] ?? new Set,
                r = new Set;
            if (t)
                for (let [e, n] of Object.entries(t)) n == null || n === !1 || r.add(this.buildChildFieldName(e));
            let i = new Set([...n, ...r]),
                a = !1;
            for (let n of i) {
                let r = n.startsWith(this.name + `[`) ? n.slice(this.name.length) : n.slice(this.name.length + 1),
                    i = t ?.[r],
                    o = this.form.getFieldMeta(n);
                if (!o && !i) continue;
                let s = o ?.errorMap[e],
                    {
                        newErrorValue: c,
                        newSource: l
                    } = xg({
                        newFormValidatorError: i,
                        isPreviousErrorFromFormValidator: o ?.errorSourceMap[e] === `form`,
                        previousErrorValue: s
                    });
                c && (a = !0), !(s === c && o ?.errorSourceMap[e] === l) && this.form.setFieldMeta(n, t => ({ ...t,
                    errorMap: { ...t.errorMap,
                        [e]: c
                    },
                    errorSourceMap: { ...t.errorSourceMap,
                        [e]: l
                    }
                }))
            }
            return this._lastDistributedFieldNames[e] = r, a
        }, this.validateSync = (t, n, r = {}) => {
            let i = _g(t, { ...this.options,
                    form: this.form,
                    group: this,
                    validationLogic: this.options.validationLogic || this.form.options.validationLogic || Ag
                }),
                a = (r.skipRelatedFieldValidation ? [] : this.getRelatedFields()).reduce((e, n) => {
                    let r = _g(t, { ...n.options,
                        form: n.form,
                        validationLogic: n.form.options.validationLogic || Ag
                    });
                    return r.forEach(e => {
                        e.field = n
                    }), e.concat(r)
                }, []),
                o = !1;
            Mh(() => {
                let t = (t, r) => {
                    let i = Xg(r.cause),
                        a = t === this,
                        s;
                    r.validate && (s = t.runValidator({
                        validate: r.validate,
                        value: {
                            value: t.store.state.value,
                            validationSource: a ? `form` : `field`,
                            ...t instanceof e ? {
                                groupApi: t
                            } : {
                                fieldApi: t
                            }
                        },
                        type: `validate`
                    }));
                    let c = s,
                        l;
                    a && Jg(s) && (c = s.group, l = s.fields);
                    let u = qg(c),
                        d = n[i],
                        {
                            newErrorValue: f,
                            newSource: p
                        } = Sg({
                            formLevelError: d,
                            fieldLevelError: u
                        });
                    t.state.meta.errorMap ?.[i] !== f && t.setMeta(e => ({ ...e,
                        errorMap: { ...e.errorMap,
                            [i]: f
                        },
                        errorSourceMap: { ...e.errorSourceMap,
                            [i]: p
                        }
                    })), f && (o = !0), a && this.distributeFieldErrors(i, l) && (o = !0)
                };
                for (let e of i) t(this, e);
                for (let e of a) e.validate && t(e.field, e)
            });
            let s = Xg(`submit`);
            return this.state.meta.errorMap ?.[s] && t !== `submit` && !o && this.setMeta(e => ({ ...e,
                errorMap: { ...e.errorMap,
                    [s]: void 0
                },
                errorSourceMap: { ...e.errorSourceMap,
                    [s]: void 0
                }
            })), {
                hasErrored: o
            }
        }, this.validateAsync = async (t, n, r = {}) => {
            let i = vg(t, { ...this.options,
                    form: this.form,
                    group: this,
                    validationLogic: this.options.validationLogic || this.form.options.validationLogic || Ag
                }),
                a = await n,
                o = r.skipRelatedFieldValidation ? [] : this.getRelatedFields(),
                s = o.reduce((e, n) => {
                    let r = vg(t, { ...n.options,
                        form: n.form,
                        validationLogic: n.form.options.validationLogic || Ag
                    });
                    return r.forEach(e => {
                        e.field = n
                    }), e.concat(r)
                }, []),
                c = [],
                l = [],
                u = i.some(e => e.validate) || s.some(e => e.validate);
            if (u) {
                this.state.meta.isValidating || this.setMeta(e => ({ ...e,
                    isValidating: !0
                }));
                for (let e of o) e.setMeta(e => ({ ...e,
                    isValidating: !0
                }))
            }
            let d = (t, n, r) => {
                let i = Xg(n.cause),
                    o = t.getInfo();
                o.validationMetaMap[i] ?.lastAbortController.abort();
                let s = new AbortController;
                o.validationMetaMap[i] = {
                    lastAbortController: s
                };
                let c = t === this;
                r.push(new Promise(async r => {
                    let o;
                    try {
                        o = await new Promise((r, i) => {
                            t.timeoutIds.validations[n.cause] && clearTimeout(t.timeoutIds.validations[n.cause]), t.timeoutIds.validations[n.cause] = setTimeout(async () => {
                                if (s.signal.aborted) return r(void 0);
                                try {
                                    r(await this.runValidator({
                                        validate: n.validate,
                                        value: {
                                            value: t.store.state.value,
                                            signal: s.signal,
                                            validationSource: c ? `form` : `field`,
                                            ...t instanceof e ? {
                                                groupApi: t
                                            } : {
                                                fieldApi: t
                                            }
                                        },
                                        type: `validateAsync`
                                    }))
                                } catch (e) {
                                    i(e)
                                }
                            }, n.debounceMs)
                        })
                    } catch (e) {
                        o = e
                    }
                    if (s.signal.aborted) return r(void 0);
                    let l = o,
                        u;
                    c && Jg(o) && (l = o.group, u = o.fields);
                    let d = qg(l),
                        f = a[t.name] ?.[i],
                        {
                            newErrorValue: p,
                            newSource: m
                        } = Sg({
                            formLevelError: f,
                            fieldLevelError: d
                        });
                    if (t.getInfo().instance !== t) return r(void 0);
                    t.setMeta(e => ({ ...e,
                        errorMap: { ...e ?.errorMap,
                            [i] : p
                        },
                        errorSourceMap: { ...e.errorSourceMap,
                            [i]: m
                        }
                    })), c && this.distributeFieldErrors(i, u), r(p)
                }))
            };
            for (let e of i) e.validate && d(this, e, c);
            for (let e of s) e.validate && d(e.field, e, l);
            let f = [];
            if ((c.length || l.length) && (f = await Promise.all(c), await Promise.all(l)), u) {
                this.setMeta(e => ({ ...e,
                    isValidating: !1
                }));
                for (let e of o) e.setMeta(e => ({ ...e,
                    isValidating: !1
                }))
            }
            return f.filter(Boolean)
        }, this.validateAllFields = async e => {
            let t = [];
            return Mh(() => {
                Object.values(this.getRelatedFields()).forEach(n => {
                    t.push(Promise.resolve().then(() => n.validate(e, {
                        skipFormValidation: !0,
                        skipGroupValidation: !0
                    }))), n.store.state.meta.isTouched || n.setMeta(e => ({ ...e,
                        isTouched: !0
                    }))
                })
            }), (await Promise.all(t)).flat()
        }, this.validateArrayFieldsStartingFrom = (e, t, n) => this.form.validateArrayFieldsStartingFrom(e, t, n), this.validateField = (e, t) => this.form.validateField(e, t), this.getFieldValue = e => this.form.getFieldValue(e), this.getFieldMeta = e => this.form.getFieldMeta(e), this.setFieldMeta = (e, t) => this.form.setFieldMeta(e, t), this.setFieldValue = (e, t) => this.form.setFieldValue(e, t), this.deleteField = e => this.form.deleteField(e), this.pushFieldValue = (e, t) => this.form.pushFieldValue(e, t), this.insertFieldValue = (e, t, n) => this.form.insertFieldValue(e, t, n), this.replaceFieldValue = (e, t, n) => this.form.replaceFieldValue(e, t, n), this.swapFieldValues = (e, t, n) => this.form.swapFieldValues(e, t, n), this.moveFieldValues = (e, t, n) => this.form.moveFieldValues(e, t, n), this.clearFieldValues = e => this.form.clearFieldValues(e), this.resetField = e => this.form.resetField(e), this.removeFieldValue = (e, t) => this.form.removeFieldValue(e, t), this.areRelatedFieldsValid = () => Object.values(this.getRelatedFields()).every(e => e.state.meta.isValid), this.validate = (e, t) => {
            let {
                fieldsErrorMap: n
            } = t ?.skipFormValidation ? {
                fieldsErrorMap: {}
            } : this.form.validateSync(e, {
                dontUpdateFormErrorMap: !0,
                filterFieldNames: e => kg(this.name, e)
            }), {
                hasErrored: r
            } = this.validateSync(e, n[this.name] ?? {}, {
                skipRelatedFieldValidation: t ?.skipRelatedFieldValidation
            });
            if (r && !this.options.asyncAlways) return this.getInfo().validationMetaMap[Xg(e)] ?.lastAbortController.abort(), this.state.meta.errors;
            let i = t ?.skipFormValidation ? Promise.resolve({}) : this.form.validateAsync(e, {
                dontUpdateFormErrorMap: !0,
                filterFieldNames: e => kg(this.name, e)
            });
            return this.validateAsync(e, i, {
                skipRelatedFieldValidation: t ?.skipRelatedFieldValidation
            })
        }, this.triggerOnChangeListener = () => {
            let e = this.form.options.listeners ?.onChangeGroupDebounceMs;
            e && e > 0 ? (this.timeoutIds.formListeners.change && clearTimeout(this.timeoutIds.formListeners.change), this.timeoutIds.formListeners.change = setTimeout(() => {
                this.form.options.listeners ?.onChangeGroup ?.({
                    formApi: this.form,
                    groupApi: this
                })
            }, e)) : this.form.options.listeners ?.onChangeGroup ?.({
                formApi: this.form,
                groupApi: this
            });
            let t = this.options.listeners ?.onChangeDebounceMs;
            t && t > 0 ? (this.timeoutIds.listeners.change && clearTimeout(this.timeoutIds.listeners.change), this.timeoutIds.listeners.change = setTimeout(() => {
                this.options.listeners ?.onChange ?.({
                    value: this.state.value,
                    groupApi: this
                })
            }, t)) : this.options.listeners ?.onChange ?.({
                value: this.state.value,
                groupApi: this
            })
        }, this.triggerOnSubmitListener = () => {
            this.options.listeners ?.onSubmit ?.({
                value: this.state.value,
                groupApi: this
            })
        }, this._handleSubmit = async e => {
            this.setFormGroupState(e => ({ ...e,
                isSubmitted: !1,
                submissionAttempts: e.submissionAttempts + 1,
                isSubmitSuccessful: !1
            })), Mh(() => {
                Object.values(this.getRelatedFields()).forEach(e => {
                    e.state.meta.isTouched || e.setMeta(e => ({ ...e,
                        isTouched: !0
                    }))
                })
            });
            let t = e ?? this.options.onSubmitMeta;
            this.setFormGroupState(e => ({ ...e,
                isSubmitting: !0
            }));
            let n = () => {
                this.setFormGroupState(e => ({ ...e,
                    isSubmitting: !1
                }))
            };
            if (await this.validateAllFields(`submit`), !this.areRelatedFieldsValid()) {
                n(), this.options.onGroupSubmitInvalid ?.({
                    value: this.state.value,
                    groupApi: this,
                    meta: t
                });
                return
            }
            if (await this.validate(`submit`, {
                    skipRelatedFieldValidation: !0
                }), !this.areRelatedFieldsValid() || !this.state.meta.isValid) {
                n(), this.options.onGroupSubmitInvalid ?.({
                    value: this.state.value,
                    groupApi: this,
                    meta: t
                });
                return
            }
            Mh(() => {
                Object.values(this.getRelatedFields()).forEach(e => {
                    e.options.listeners ?.onGroupSubmit ?.({
                        value: e.state.value,
                        fieldApi: e
                    })
                })
            }), this.options.listeners ?.onSubmit ?.({
                groupApi: this,
                value: this.state.value
            });
            try {
                await this.options.onGroupSubmit ?.({
                    value: this.state.value,
                    groupApi: this,
                    meta: t
                }), Mh(() => {
                    this.setFormGroupState(e => ({ ...e,
                        isSubmitted: !0,
                        isSubmitSuccessful: !0
                    })), n()
                })
            } catch (e) {
                throw this.setFormGroupState(e => ({ ...e,
                    isSubmitSuccessful: !1
                })), n(), e
            }
        }, this.form = t.form, this.name = t.name, this.options = t, this.timeoutIds = {
            validations: {},
            listeners: {},
            formListeners: {}
        }, this.fieldInfo = {
            instance: null,
            validationMetaMap: {
                onChange: void 0,
                onBlur: void 0,
                onSubmit: void 0,
                onMount: void 0,
                onServer: void 0,
                onDynamic: void 0
            }
        }, this.store = zh(e => {
            this.form.formGroupMetaDerived.get(), this.form.baseStore.get();
            let n = this.form.getFormGroupMeta(this.name) ?? Gg(t.defaultMeta),
                r = this.form.getFieldValue(this.name);
            return !n.isTouched && r === void 0 && this.options.defaultValue !== void 0 && !bg(r, this.options.defaultValue) && (r = this.options.defaultValue), e && e.value === r && e.meta === n ? e : {
                value: r,
                meta: n
            }
        }), this.handleSubmit = this.handleSubmit.bind(this)
    }
    get state() {
        return this.store.state
    }
    runValidator(e) {
        if (Pg(e.validate)) {
            let t = Ng[e.type](e.value, e.validate);
            return e.type === `validate` ? Yg(t) : t.then(Yg)
        }
        return e.validate(e.value)
    }
    handleSubmit(e) {
        return this._handleSubmit(e)
    }
};

function qg(e) {
    if (e) return e
}

function Jg(e) {
    return !!e && typeof e == `object` && `fields` in e
}

function Yg(e) {
    if (!e || typeof e != `object` || !(`form` in e) && !(`fields` in e)) return e;
    let {
        form: t,
        fields: n,
        ...r
    } = e;
    return { ...r,
        group: t,
        fields: n
    }
}

function Xg(e) {
    switch (e) {
        case `submit`:
            return `onSubmit`;
        case `blur`:
            return `onBlur`;
        case `mount`:
            return `onMount`;
        case `server`:
            return `onServer`;
        case `dynamic`:
            return `onDynamic`;
        default:
            return `onChange`
    }
}

function Zg(e, {
    mode: t
}) {
    let [n, r] = P(e, {
        equals: !1
    }), i = eg(e.store, e => t === `array` ? e.meta._arrayVersion || 0 : e.value), a = eg(e.store, e => e.meta.isTouched), o = eg(e.store, e => e.meta.isBlurred), s = eg(e.store, e => e.meta.isDirty), c = eg(e.store, e => e.meta.errorMap), l = eg(e.store, e => e.meta.errorSourceMap), u = eg(e.store, e => e.meta.isValidating);
    return ce(() => {
        i(), a(), o(), s(), c(), l(), u(), r(e)
    }), n
}

function Qg(e) {
    let t = e(),
        n = new Vg(t),
        r = n,
        i = !1;
    return ge(() => {
        let e = n.mount();
        i = !0, L(() => {
            e(), i = !1
        })
    }), ce(() => {
        i && n.update(e())
    }), Zg(r, {
        mode: t.mode
    })
}

function $g(e) {
    let t = Qg(() => {
        let {
            children: t,
            ...n
        } = e;
        return n
    });
    return Np(() => $e(() => e.children(t), {}))
}

function e_(e) {
    let [t, n] = P(e, {
        equals: !1
    }), r = eg(e.store, e => e);
    return ce(() => {
        r(), n(e)
    }), t
}

function t_(e) {
    let t = new Kg(e()),
        n = !1;
    return ge(() => {
        let e = t.mount();
        n = !0, L(() => {
            e(), n = !1
        })
    }), ce(() => {
        n && t.update(e())
    }), e_(t)
}

function n_(e) {
    let t = t_(() => {
        let {
            children: t,
            ...n
        } = e;
        return n
    });
    return Np(() => $e(() => e.children(t), {}))
}

function r_(e) {
    let t = e ?.(),
        n = new Rg(t),
        r = n;
    return r.Field = e => $e($g, it(e, {
        form: n
    })), r.FormGroup = e => $e(n_, it(e, {
        form: n
    })), r.useStore = e => eg(n.store, e), r.Subscribe = e => og(e.children, eg(n.store, e.selector)), ge(n.mount), ce(() => n.update(e ?.())), r
}

function i_() {
    return {
        accessor: (e, t) => typeof e == `function` ? { ...t,
            accessorFn: e
        } : { ...t,
            accessorKey: e
        },
        display: e => e,
        group: e => e
    }
}

function a_(e, t) {
    return typeof e == `function` ? e(t) : e
}

function o_(e, t) {
    return n => {
        t.setState(t => ({ ...t,
            [e]: a_(n, t[e])
        }))
    }
}

function s_(e) {
    return e instanceof Function
}

function c_(e) {
    return Array.isArray(e) && e.every(e => typeof e == `number`)
}

function l_(e, t) {
    let n = [],
        r = e => {
            e.forEach(e => {
                n.push(e);
                let i = t(e);
                i != null && i.length && r(i)
            })
        };
    return r(e), n
}

function Z(e, t, n) {
    let r = [],
        i;
    return a => {
        let o;
        n.key && n.debug && (o = Date.now());
        let s = e(a);
        if (!(s.length !== r.length || s.some((e, t) => r[t] !== e))) return i;
        r = s;
        let c;
        if (n.key && n.debug && (c = Date.now()), i = t(...s), n == null || n.onChange == null || n.onChange(i), n.key && n.debug && n != null && n.debug()) {
            let e = Math.round((Date.now() - o) * 100) / 100,
                t = Math.round((Date.now() - c) * 100) / 100,
                r = t / 16,
                i = (e, t) => {
                    for (e = String(e); e.length < t;) e = ` ` + e;
                    return e
                };
            console.info(`%c⏱ ${i(t,5)} /${i(e,5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0,Math.min(120-120*r,120))}deg 100% 31%);`, n ?.key)
        }
        return i
    }
}

function Q(e, t, n, r) {
    return {
        debug: () => e ?.debugAll ?? e[t],
        key: !1,
        onChange: r
    }
}

function u_(e, t, n, r) {
    let i = {
        id: `${t.id}_${n.id}`,
        row: t,
        column: n,
        getValue: () => t.getValue(r),
        renderValue: () => i.getValue() ?? e.options.renderFallbackValue,
        getContext: Z(() => [e, n, t, i], (e, t, n, r) => ({
            table: e,
            column: t,
            row: n,
            cell: r,
            getValue: r.getValue,
            renderValue: r.renderValue
        }), Q(e.options, `debugCells`, `cell.getContext`))
    };
    return e._features.forEach(r => {
        r.createCell == null || r.createCell(i, n, t, e)
    }, {}), i
}

function d_(e, t, n, r) {
    let i = { ...e._getDefaultColumnDef(),
            ...t
        },
        a = i.accessorKey,
        o = i.id ?? (a ? typeof String.prototype.replaceAll == `function` ? a.replaceAll(`.`, `_`) : a.replace(/\./g, `_`) : void 0) ?? (typeof i.header == `string` ? i.header : void 0),
        s;
    if (i.accessorFn ? s = i.accessorFn : a && (s = a.includes(`.`) ? e => {
            let t = e;
            for (let e of a.split(`.`)) t = t ?.[e];
            return t
        } : e => e[i.accessorKey]), !o) throw Error();
    let c = {
        id: `${String(o)}`,
        accessorFn: s,
        parent: r,
        depth: n,
        columnDef: i,
        columns: [],
        getFlatColumns: Z(() => [!0], () => [c, ...c.columns ?.flatMap(e => e.getFlatColumns())], Q(e.options, `debugColumns`, `column.getFlatColumns`)),
        getLeafColumns: Z(() => [e._getOrderColumnsFn()], e => {
            var t;
            return (t = c.columns) != null && t.length ? e(c.columns.flatMap(e => e.getLeafColumns())) : [c]
        }, Q(e.options, `debugColumns`, `column.getLeafColumns`))
    };
    for (let t of e._features) t.createColumn == null || t.createColumn(c, e);
    return c
}
var $ = `debugHeaders`;

function f_(e, t, n) {
    let r = {
        id: n.id ?? t.id,
        column: t,
        index: n.index,
        isPlaceholder: !!n.isPlaceholder,
        placeholderId: n.placeholderId,
        depth: n.depth,
        subHeaders: [],
        colSpan: 0,
        rowSpan: 0,
        headerGroup: null,
        getLeafHeaders: () => {
            let e = [],
                t = n => {
                    n.subHeaders && n.subHeaders.length && n.subHeaders.map(t), e.push(n)
                };
            return t(r), e
        },
        getContext: () => ({
            table: e,
            header: r,
            column: t
        })
    };
    return e._features.forEach(t => {
        t.createHeader == null || t.createHeader(r, e)
    }), r
}
var p_ = {
    createTable: e => {
        e.getHeaderGroups = Z(() => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left, e.getState().columnPinning.right], (t, n, r, i) => {
            let a = r ?.map(e => n.find(t => t.id === e)).filter(Boolean) ?? [],
                o = i ?.map(e => n.find(t => t.id === e)).filter(Boolean) ?? [],
                s = n.filter(e => !(r != null && r.includes(e.id)) && !(i != null && i.includes(e.id)));
            return m_(t, [...a, ...s, ...o], e)
        }, Q(e.options, $, `getHeaderGroups`)), e.getCenterHeaderGroups = Z(() => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left, e.getState().columnPinning.right], (t, n, r, i) => (n = n.filter(e => !(r != null && r.includes(e.id)) && !(i != null && i.includes(e.id))), m_(t, n, e, `center`)), Q(e.options, $, `getCenterHeaderGroups`)), e.getLeftHeaderGroups = Z(() => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left], (t, n, r) => m_(t, r ?.map(e => n.find(t => t.id === e)).filter(Boolean) ?? [], e, `left`), Q(e.options, $, `getLeftHeaderGroups`)), e.getRightHeaderGroups = Z(() => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.right], (t, n, r) => m_(t, r ?.map(e => n.find(t => t.id === e)).filter(Boolean) ?? [], e, `right`), Q(e.options, $, `getRightHeaderGroups`)), e.getFooterGroups = Z(() => [e.getHeaderGroups()], e => [...e].reverse(), Q(e.options, $, `getFooterGroups`)), e.getLeftFooterGroups = Z(() => [e.getLeftHeaderGroups()], e => [...e].reverse(), Q(e.options, $, `getLeftFooterGroups`)), e.getCenterFooterGroups = Z(() => [e.getCenterHeaderGroups()], e => [...e].reverse(), Q(e.options, $, `getCenterFooterGroups`)), e.getRightFooterGroups = Z(() => [e.getRightHeaderGroups()], e => [...e].reverse(), Q(e.options, $, `getRightFooterGroups`)), e.getFlatHeaders = Z(() => [e.getHeaderGroups()], e => e.map(e => e.headers).flat(), Q(e.options, $, `getFlatHeaders`)), e.getLeftFlatHeaders = Z(() => [e.getLeftHeaderGroups()], e => e.map(e => e.headers).flat(), Q(e.options, $, `getLeftFlatHeaders`)), e.getCenterFlatHeaders = Z(() => [e.getCenterHeaderGroups()], e => e.map(e => e.headers).flat(), Q(e.options, $, `getCenterFlatHeaders`)), e.getRightFlatHeaders = Z(() => [e.getRightHeaderGroups()], e => e.map(e => e.headers).flat(), Q(e.options, $, `getRightFlatHeaders`)), e.getCenterLeafHeaders = Z(() => [e.getCenterFlatHeaders()], e => e.filter(e => {
            var t;
            return !((t = e.subHeaders) != null && t.length)
        }), Q(e.options, $, `getCenterLeafHeaders`)), e.getLeftLeafHeaders = Z(() => [e.getLeftFlatHeaders()], e => e.filter(e => {
            var t;
            return !((t = e.subHeaders) != null && t.length)
        }), Q(e.options, $, `getLeftLeafHeaders`)), e.getRightLeafHeaders = Z(() => [e.getRightFlatHeaders()], e => e.filter(e => {
            var t;
            return !((t = e.subHeaders) != null && t.length)
        }), Q(e.options, $, `getRightLeafHeaders`)), e.getLeafHeaders = Z(() => [e.getLeftHeaderGroups(), e.getCenterHeaderGroups(), e.getRightHeaderGroups()], (e, t, n) => [...e[0] ?.headers ?? [], ...t[0] ?.headers ?? [], ...n[0] ?.headers ?? []].map(e => e.getLeafHeaders()).flat(), Q(e.options, $, `getLeafHeaders`))
    }
};

function m_(e, t, n, r) {
    let i = 0,
        a = function(e, t) {
            t === void 0 && (t = 1), i = Math.max(i, t), e.filter(e => e.getIsVisible()).forEach(e => {
                var n;
                (n = e.columns) != null && n.length && a(e.columns, t + 1)
            }, 0)
        };
    a(e);
    let o = [],
        s = (e, t) => {
            let i = {
                    depth: t,
                    id: [r, `${t}`].filter(Boolean).join(`_`),
                    headers: []
                },
                a = [];
            e.forEach(e => {
                let o = [...a].reverse()[0],
                    s = e.column.depth === i.depth,
                    c, l = !1;
                if (s && e.column.parent ? c = e.column.parent : (c = e.column, l = !0), o && o ?.column === c) o.subHeaders.push(e);
                else {
                    let i = f_(n, c, {
                        id: [r, t, c.id, e ?.id].filter(Boolean).join(`_`),
                        isPlaceholder: l,
                        placeholderId: l ? `${a.filter(e=>e.column===c).length}` : void 0,
                        depth: t,
                        index: a.length
                    });
                    i.subHeaders.push(e), a.push(i)
                }
                i.headers.push(e), e.headerGroup = i
            }), o.push(i), t > 0 && s(a, t - 1)
        };
    s(t.map((e, t) => f_(n, e, {
        depth: i,
        index: t
    })), i - 1), o.reverse();
    let c = e => e.filter(e => e.column.getIsVisible()).map(e => {
        let t = 0,
            n = 0,
            r = [0];
        e.subHeaders && e.subHeaders.length ? (r = [], c(e.subHeaders).forEach(e => {
            let {
                colSpan: n,
                rowSpan: i
            } = e;
            t += n, r.push(i)
        })) : t = 1;
        let i = Math.min(...r);
        return n += i, e.colSpan = t, e.rowSpan = n, {
            colSpan: t,
            rowSpan: n
        }
    });
    return c(o[0] ?.headers ?? []), o
}
var h_ = (e, t, n, r, i, a, o) => {
        let s = {
            id: t,
            index: r,
            original: n,
            depth: i,
            parentId: o,
            _valuesCache: {},
            _uniqueValuesCache: {},
            getValue: t => {
                if (s._valuesCache.hasOwnProperty(t)) return s._valuesCache[t];
                let n = e.getColumn(t);
                if (n != null && n.accessorFn) return s._valuesCache[t] = n.accessorFn(s.original, r), s._valuesCache[t]
            },
            getUniqueValues: t => {
                if (s._uniqueValuesCache.hasOwnProperty(t)) return s._uniqueValuesCache[t];
                let n = e.getColumn(t);
                if (n != null && n.accessorFn) return n.columnDef.getUniqueValues ? (s._uniqueValuesCache[t] = n.columnDef.getUniqueValues(s.original, r), s._uniqueValuesCache[t]) : (s._uniqueValuesCache[t] = [s.getValue(t)], s._uniqueValuesCache[t])
            },
            renderValue: t => s.getValue(t) ?? e.options.renderFallbackValue,
            subRows: a ?? [],
            getLeafRows: () => l_(s.subRows, e => e.subRows),
            getParentRow: () => s.parentId ? e.getRow(s.parentId, !0) : void 0,
            getParentRows: () => {
                let e = [],
                    t = s;
                for (;;) {
                    let n = t.getParentRow();
                    if (!n) break;
                    e.push(n), t = n
                }
                return e.reverse()
            },
            getAllCells: Z(() => [e.getAllLeafColumns()], t => t.map(t => u_(e, s, t, t.id)), Q(e.options, `debugRows`, `getAllCells`)),
            _getAllCellsByColumnId: Z(() => [s.getAllCells()], e => e.reduce((e, t) => (e[t.column.id] = t, e), {}), Q(e.options, `debugRows`, `getAllCellsByColumnId`))
        };
        for (let t = 0; t < e._features.length; t++) {
            let n = e._features[t];
            n == null || n.createRow == null || n.createRow(s, e)
        }
        return s
    },
    g_ = {
        createColumn: (e, t) => {
            e._getFacetedRowModel = t.options.getFacetedRowModel && t.options.getFacetedRowModel(t, e.id), e.getFacetedRowModel = () => e._getFacetedRowModel ? e._getFacetedRowModel() : t.getPreFilteredRowModel(), e._getFacetedUniqueValues = t.options.getFacetedUniqueValues && t.options.getFacetedUniqueValues(t, e.id), e.getFacetedUniqueValues = () => e._getFacetedUniqueValues ? e._getFacetedUniqueValues() : new Map, e._getFacetedMinMaxValues = t.options.getFacetedMinMaxValues && t.options.getFacetedMinMaxValues(t, e.id), e.getFacetedMinMaxValues = () => {
                if (e._getFacetedMinMaxValues) return e._getFacetedMinMaxValues()
            }
        }
    },
    __ = (e, t, n) => {
        var r, i;
        let a = n == null || (r = n.toString()) == null ? void 0 : r.toLowerCase();
        return !!(!((i = e.getValue(t)) == null || (i = i.toString()) == null || (i = i.toLowerCase()) == null) && i.includes(a))
    };
__.autoRemove = e => D_(e);
var v_ = (e, t, n) => {
    var r;
    return !!(!((r = e.getValue(t)) == null || (r = r.toString()) == null) && r.includes(n))
};
v_.autoRemove = e => D_(e);
var y_ = (e, t, n) => {
    var r;
    return ((r = e.getValue(t)) == null || (r = r.toString()) == null ? void 0 : r.toLowerCase()) === n ?.toLowerCase()
};
y_.autoRemove = e => D_(e);
var b_ = (e, t, n) => e.getValue(t) ?.includes(n);
b_.autoRemove = e => D_(e);
var x_ = (e, t, n) => !n.some(n => {
    var r;
    return !((r = e.getValue(t)) != null && r.includes(n))
});
x_.autoRemove = e => D_(e) || !(e != null && e.length);
var S_ = (e, t, n) => n.some(n => e.getValue(t) ?.includes(n));
S_.autoRemove = e => D_(e) || !(e != null && e.length);
var C_ = (e, t, n) => e.getValue(t) === n;
C_.autoRemove = e => D_(e);
var w_ = (e, t, n) => e.getValue(t) == n;
w_.autoRemove = e => D_(e);
var T_ = (e, t, n) => {
    let [r, i] = n, a = e.getValue(t);
    return a >= r && a <= i
};
T_.resolveFilterValue = e => {
    let [t, n] = e, r = typeof t == `number` ? t : parseFloat(t), i = typeof n == `number` ? n : parseFloat(n), a = t === null || Number.isNaN(r) ? -1 / 0 : r, o = n === null || Number.isNaN(i) ? 1 / 0 : i;
    if (a > o) {
        let e = a;
        a = o, o = e
    }
    return [a, o]
}, T_.autoRemove = e => D_(e) || D_(e[0]) && D_(e[1]);
var E_ = {
    includesString: __,
    includesStringSensitive: v_,
    equalsString: y_,
    arrIncludes: b_,
    arrIncludesAll: x_,
    arrIncludesSome: S_,
    equals: C_,
    weakEquals: w_,
    inNumberRange: T_
};

function D_(e) {
    return e == null || e === ``
}
var O_ = {
    getDefaultColumnDef: () => ({
        filterFn: `auto`
    }),
    getInitialState: e => ({
        columnFilters: [],
        ...e
    }),
    getDefaultOptions: e => ({
        onColumnFiltersChange: o_(`columnFilters`, e),
        filterFromLeafRows: !1,
        maxLeafRowFilterDepth: 100
    }),
    createColumn: (e, t) => {
        e.getAutoFilterFn = () => {
            let n = t.getCoreRowModel().flatRows[0] ?.getValue(e.id);
            return typeof n == `string` ? E_.includesString : typeof n == `number` ? E_.inNumberRange : typeof n == `boolean` || typeof n == `object` && n ? E_.equals : Array.isArray(n) ? E_.arrIncludes : E_.weakEquals
        }, e.getFilterFn = () => s_(e.columnDef.filterFn) ? e.columnDef.filterFn : e.columnDef.filterFn === `auto` ? e.getAutoFilterFn() : t.options.filterFns ?.[e.columnDef.filterFn] ?? E_[e.columnDef.filterFn], e.getCanFilter = () => (e.columnDef.enableColumnFilter ?? !0) && (t.options.enableColumnFilters ?? !0) && (t.options.enableFilters ?? !0) && !!e.accessorFn, e.getIsFiltered = () => e.getFilterIndex() > -1, e.getFilterValue = () => {
            var n;
            return (n = t.getState().columnFilters) == null || (n = n.find(t => t.id === e.id)) == null ? void 0 : n.value
        }, e.getFilterIndex = () => t.getState().columnFilters ?.findIndex(t => t.id === e.id) ?? -1, e.setFilterValue = n => {
            t.setColumnFilters(t => {
                let r = e.getFilterFn(),
                    i = t ?.find(t => t.id === e.id),
                    a = a_(n, i ? i.value : void 0);
                if (k_(r, a, e)) return t ?.filter(t => t.id !== e.id) ?? [];
                let o = {
                    id: e.id,
                    value: a
                };
                return i ? t ?.map(t => t.id === e.id ? o : t) ?? [] : t != null && t.length ? [...t, o] : [o]
            })
        }
    },
    createRow: (e, t) => {
        e.columnFilters = {}, e.columnFiltersMeta = {}
    },
    createTable: e => {
        e.setColumnFilters = t => {
            let n = e.getAllLeafColumns();
            e.options.onColumnFiltersChange == null || e.options.onColumnFiltersChange(e => a_(t, e) ?.filter(e => {
                let t = n.find(t => t.id === e.id);
                return !(t && k_(t.getFilterFn(), e.value, t))
            }))
        }, e.resetColumnFilters = t => {
            e.setColumnFilters(t ? [] : e.initialState ?.columnFilters ?? [])
        }, e.getPreFilteredRowModel = () => e.getCoreRowModel(), e.getFilteredRowModel = () => (!e._getFilteredRowModel && e.options.getFilteredRowModel && (e._getFilteredRowModel = e.options.getFilteredRowModel(e)), e.options.manualFiltering || !e._getFilteredRowModel ? e.getPreFilteredRowModel() : e._getFilteredRowModel())
    }
};

function k_(e, t, n) {
    return (e && e.autoRemove ? e.autoRemove(t, n) : !1) || t === void 0 || typeof t == `string` && !t
}
var A_ = {
        sum: (e, t, n) => n.reduce((t, n) => {
            let r = n.getValue(e);
            return t + (typeof r == `number` ? r : 0)
        }, 0),
        min: (e, t, n) => {
            let r;
            return n.forEach(t => {
                let n = t.getValue(e);
                n != null && (r > n || r === void 0 && n >= n) && (r = n)
            }), r
        },
        max: (e, t, n) => {
            let r;
            return n.forEach(t => {
                let n = t.getValue(e);
                n != null && (r < n || r === void 0 && n >= n) && (r = n)
            }), r
        },
        extent: (e, t, n) => {
            let r, i;
            return n.forEach(t => {
                let n = t.getValue(e);
                n != null && (r === void 0 ? n >= n && (r = i = n) : (r > n && (r = n), i < n && (i = n)))
            }), [r, i]
        },
        mean: (e, t) => {
            let n = 0,
                r = 0;
            if (t.forEach(t => {
                    let i = t.getValue(e);
                    i != null && (i = +i) >= i && (++n, r += i)
                }), n) return r / n
        },
        median: (e, t) => {
            if (!t.length) return;
            let n = t.map(t => t.getValue(e));
            if (!c_(n)) return;
            if (n.length === 1) return n[0];
            let r = Math.floor(n.length / 2),
                i = n.sort((e, t) => e - t);
            return n.length % 2 == 0 ? (i[r - 1] + i[r]) / 2 : i[r]
        },
        unique: (e, t) => Array.from(new Set(t.map(t => t.getValue(e))).values()),
        uniqueCount: (e, t) => new Set(t.map(t => t.getValue(e))).size,
        count: (e, t) => t.length
    },
    j_ = {
        getDefaultColumnDef: () => ({
            aggregatedCell: e => {
                var t;
                return ((t = e.getValue()) == null || t.toString == null ? void 0 : t.toString()) ?? null
            },
            aggregationFn: `auto`
        }),
        getInitialState: e => ({
            grouping: [],
            ...e
        }),
        getDefaultOptions: e => ({
            onGroupingChange: o_(`grouping`, e),
            groupedColumnMode: `reorder`
        }),
        createColumn: (e, t) => {
            e.toggleGrouping = () => {
                t.setGrouping(t => t != null && t.includes(e.id) ? t.filter(t => t !== e.id) : [...t ?? [], e.id])
            }, e.getCanGroup = () => (e.columnDef.enableGrouping ?? !0) && (t.options.enableGrouping ?? !0) && (!!e.accessorFn || !!e.columnDef.getGroupingValue), e.getIsGrouped = () => t.getState().grouping ?.includes(e.id), e.getGroupedIndex = () => t.getState().grouping ?.indexOf(e.id), e.getToggleGroupingHandler = () => {
                let t = e.getCanGroup();
                return () => {
                    t && e.toggleGrouping()
                }
            }, e.getAutoAggregationFn = () => {
                let n = t.getCoreRowModel().flatRows[0] ?.getValue(e.id);
                if (typeof n == `number`) return A_.sum;
                if (Object.prototype.toString.call(n) === `[object Date]`) return A_.extent
            }, e.getAggregationFn = () => {
                if (!e) throw Error();
                return s_(e.columnDef.aggregationFn) ? e.columnDef.aggregationFn : e.columnDef.aggregationFn === `auto` ? e.getAutoAggregationFn() : t.options.aggregationFns ?.[e.columnDef.aggregationFn] ?? A_[e.columnDef.aggregationFn]
            }
        },
        createTable: e => {
            e.setGrouping = t => e.options.onGroupingChange == null ? void 0 : e.options.onGroupingChange(t), e.resetGrouping = t => {
                e.setGrouping(t ? [] : e.initialState ?.grouping ?? [])
            }, e.getPreGroupedRowModel = () => e.getFilteredRowModel(), e.getGroupedRowModel = () => (!e._getGroupedRowModel && e.options.getGroupedRowModel && (e._getGroupedRowModel = e.options.getGroupedRowModel(e)), e.options.manualGrouping || !e._getGroupedRowModel ? e.getPreGroupedRowModel() : e._getGroupedRowModel())
        },
        createRow: (e, t) => {
            e.getIsGrouped = () => !!e.groupingColumnId, e.getGroupingValue = n => {
                if (e._groupingValuesCache.hasOwnProperty(n)) return e._groupingValuesCache[n];
                let r = t.getColumn(n);
                return r != null && r.columnDef.getGroupingValue ? (e._groupingValuesCache[n] = r.columnDef.getGroupingValue(e.original), e._groupingValuesCache[n]) : e.getValue(n)
            }, e._groupingValuesCache = {}
        },
        createCell: (e, t, n, r) => {
            e.getIsGrouped = () => t.getIsGrouped() && t.id === n.groupingColumnId, e.getIsPlaceholder = () => !e.getIsGrouped() && t.getIsGrouped(), e.getIsAggregated = () => {
                var t;
                return !e.getIsGrouped() && !e.getIsPlaceholder() && !!((t = n.subRows) != null && t.length)
            }
        }
    };

function M_(e, t, n) {
    if (!(t != null && t.length) || !n) return e;
    let r = e.filter(e => !t.includes(e.id));
    return n === `remove` ? r : [...t.map(t => e.find(e => e.id === t)).filter(Boolean), ...r]
}
var N_ = {
        getInitialState: e => ({
            columnOrder: [],
            ...e
        }),
        getDefaultOptions: e => ({
            onColumnOrderChange: o_(`columnOrder`, e)
        }),
        createColumn: (e, t) => {
            e.getIndex = Z(e => [W_(t, e)], t => t.findIndex(t => t.id === e.id), Q(t.options, `debugColumns`, `getIndex`)), e.getIsFirstColumn = n => W_(t, n)[0] ?.id === e.id, e.getIsLastColumn = n => {
                let r = W_(t, n);
                return r[r.length - 1] ?.id === e.id
            }
        },
        createTable: e => {
            e.setColumnOrder = t => e.options.onColumnOrderChange == null ? void 0 : e.options.onColumnOrderChange(t), e.resetColumnOrder = t => {
                e.setColumnOrder(t ? [] : e.initialState.columnOrder ?? [])
            }, e._getOrderColumnsFn = Z(() => [e.getState().columnOrder, e.getState().grouping, e.options.groupedColumnMode], (e, t, n) => r => {
                let i = [];
                if (!(e != null && e.length)) i = r;
                else {
                    let t = [...e],
                        n = [...r];
                    for (; n.length && t.length;) {
                        let e = t.shift(),
                            r = n.findIndex(t => t.id === e);
                        r > -1 && i.push(n.splice(r, 1)[0])
                    }
                    i = [...i, ...n]
                }
                return M_(i, t, n)
            }, Q(e.options, `debugTable`, `_getOrderColumnsFn`))
        }
    },
    P_ = () => ({
        left: [],
        right: []
    }),
    F_ = {
        getInitialState: e => ({
            columnPinning: P_(),
            ...e
        }),
        getDefaultOptions: e => ({
            onColumnPinningChange: o_(`columnPinning`, e)
        }),
        createColumn: (e, t) => {
            e.pin = n => {
                let r = e.getLeafColumns().map(e => e.id).filter(Boolean);
                t.setColumnPinning(e => n === `right` ? {
                    left: (e ?.left ?? []).filter(e => !(r != null && r.includes(e))),
                    right: [...(e ?.right ?? []).filter(e => !(r != null && r.includes(e))), ...r]
                } : n === `left` ? {
                    left: [...(e ?.left ?? []).filter(e => !(r != null && r.includes(e))), ...r],
                    right: (e ?.right ?? []).filter(e => !(r != null && r.includes(e)))
                } : {
                    left: (e ?.left ?? []).filter(e => !(r != null && r.includes(e))),
                    right: (e ?.right ?? []).filter(e => !(r != null && r.includes(e)))
                })
            }, e.getCanPin = () => e.getLeafColumns().some(e => (e.columnDef.enablePinning ?? !0) && (t.options.enableColumnPinning ?? t.options.enablePinning ?? !0)), e.getIsPinned = () => {
                let n = e.getLeafColumns().map(e => e.id),
                    {
                        left: r,
                        right: i
                    } = t.getState().columnPinning,
                    a = n.some(e => r ?.includes(e)),
                    o = n.some(e => i ?.includes(e));
                return a ? `left` : o ? `right` : !1
            }, e.getPinnedIndex = () => {
                var n;
                let r = e.getIsPinned();
                return r ? ((n = t.getState().columnPinning) == null || (n = n[r]) == null ? void 0 : n.indexOf(e.id)) ?? -1 : 0
            }
        },
        createRow: (e, t) => {
            e.getCenterVisibleCells = Z(() => [e._getAllVisibleCells(), t.getState().columnPinning.left, t.getState().columnPinning.right], (e, t, n) => {
                let r = [...t ?? [], ...n ?? []];
                return e.filter(e => !r.includes(e.column.id))
            }, Q(t.options, `debugRows`, `getCenterVisibleCells`)), e.getLeftVisibleCells = Z(() => [e._getAllVisibleCells(), t.getState().columnPinning.left], (e, t) => (t ?? []).map(t => e.find(e => e.column.id === t)).filter(Boolean).map(e => ({ ...e,
                position: `left`
            })), Q(t.options, `debugRows`, `getLeftVisibleCells`)), e.getRightVisibleCells = Z(() => [e._getAllVisibleCells(), t.getState().columnPinning.right], (e, t) => (t ?? []).map(t => e.find(e => e.column.id === t)).filter(Boolean).map(e => ({ ...e,
                position: `right`
            })), Q(t.options, `debugRows`, `getRightVisibleCells`))
        },
        createTable: e => {
            e.setColumnPinning = t => e.options.onColumnPinningChange == null ? void 0 : e.options.onColumnPinningChange(t), e.resetColumnPinning = t => e.setColumnPinning(t ? P_() : e.initialState ?.columnPinning ?? P_()), e.getIsSomeColumnsPinned = t => {
                let n = e.getState().columnPinning;
                return t ? !!n[t] ?.length : !!(n.left ?.length || n.right ?.length)
            }, e.getLeftLeafColumns = Z(() => [e.getAllLeafColumns(), e.getState().columnPinning.left], (e, t) => (t ?? []).map(t => e.find(e => e.id === t)).filter(Boolean), Q(e.options, `debugColumns`, `getLeftLeafColumns`)), e.getRightLeafColumns = Z(() => [e.getAllLeafColumns(), e.getState().columnPinning.right], (e, t) => (t ?? []).map(t => e.find(e => e.id === t)).filter(Boolean), Q(e.options, `debugColumns`, `getRightLeafColumns`)), e.getCenterLeafColumns = Z(() => [e.getAllLeafColumns(), e.getState().columnPinning.left, e.getState().columnPinning.right], (e, t, n) => {
                let r = [...t ?? [], ...n ?? []];
                return e.filter(e => !r.includes(e.id))
            }, Q(e.options, `debugColumns`, `getCenterLeafColumns`))
        }
    };

function I_(e) {
    return e || (typeof document < `u` ? document : null)
}
var L_ = {
        size: 150,
        minSize: 20,
        maxSize: 2 ** 53 - 1
    },
    R_ = () => ({
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        isResizingColumn: !1,
        columnSizingStart: []
    }),
    z_ = {
        getDefaultColumnDef: () => L_,
        getInitialState: e => ({
            columnSizing: {},
            columnSizingInfo: R_(),
            ...e
        }),
        getDefaultOptions: e => ({
            columnResizeMode: `onEnd`,
            columnResizeDirection: `ltr`,
            onColumnSizingChange: o_(`columnSizing`, e),
            onColumnSizingInfoChange: o_(`columnSizingInfo`, e)
        }),
        createColumn: (e, t) => {
            e.getSize = () => {
                let n = t.getState().columnSizing[e.id];
                return Math.min(Math.max(e.columnDef.minSize ?? L_.minSize, n ?? e.columnDef.size ?? L_.size), e.columnDef.maxSize ?? L_.maxSize)
            }, e.getStart = Z(e => [e, W_(t, e), t.getState().columnSizing], (t, n) => n.slice(0, e.getIndex(t)).reduce((e, t) => e + t.getSize(), 0), Q(t.options, `debugColumns`, `getStart`)), e.getAfter = Z(e => [e, W_(t, e), t.getState().columnSizing], (t, n) => n.slice(e.getIndex(t) + 1).reduce((e, t) => e + t.getSize(), 0), Q(t.options, `debugColumns`, `getAfter`)), e.resetSize = () => {
                t.setColumnSizing(t => {
                    let {
                        [e.id]: n, ...r
                    } = t;
                    return r
                })
            }, e.getCanResize = () => (e.columnDef.enableResizing ?? !0) && (t.options.enableColumnResizing ?? !0), e.getIsResizing = () => t.getState().columnSizingInfo.isResizingColumn === e.id
        },
        createHeader: (e, t) => {
            e.getSize = () => {
                let t = 0,
                    n = e => {
                        e.subHeaders.length ? e.subHeaders.forEach(n) : t += e.column.getSize() ?? 0
                    };
                return n(e), t
            }, e.getStart = () => {
                if (e.index > 0) {
                    let t = e.headerGroup.headers[e.index - 1];
                    return t.getStart() + t.getSize()
                }
                return 0
            }, e.getResizeHandler = n => {
                let r = t.getColumn(e.column.id),
                    i = r ?.getCanResize();
                return a => {
                    if (!r || !i || (a.persist == null || a.persist(), H_(a) && a.touches && a.touches.length > 1)) return;
                    let o = e.getSize(),
                        s = e ? e.getLeafHeaders().map(e => [e.column.id, e.column.getSize()]) : [
                            [r.id, r.getSize()]
                        ],
                        c = H_(a) ? Math.round(a.touches[0].clientX) : a.clientX,
                        l = {},
                        u = (e, n) => {
                            typeof n == `number` && (t.setColumnSizingInfo(e => {
                                let r = t.options.columnResizeDirection === `rtl` ? -1 : 1,
                                    i = (n - (e ?.startOffset ?? 0)) * r,
                                    a = Math.max(i / (e ?.startSize ?? 0), -.999999);
                                return e.columnSizingStart.forEach(e => {
                                    let [t, n] = e;
                                    l[t] = Math.round(Math.max(n + n * a, 0) * 100) / 100
                                }), { ...e,
                                    deltaOffset: i,
                                    deltaPercentage: a
                                }
                            }), (t.options.columnResizeMode === `onChange` || e === `end`) && t.setColumnSizing(e => ({ ...e,
                                ...l
                            })))
                        },
                        d = e => u(`move`, e),
                        f = e => {
                            u(`end`, e), t.setColumnSizingInfo(e => ({ ...e,
                                isResizingColumn: !1,
                                startOffset: null,
                                startSize: null,
                                deltaOffset: null,
                                deltaPercentage: null,
                                columnSizingStart: []
                            }))
                        },
                        p = I_(n),
                        m = {
                            moveHandler: e => d(e.clientX),
                            upHandler: e => {
                                p ?.removeEventListener(`mousemove`, m.moveHandler), p ?.removeEventListener(`mouseup`, m.upHandler), f(e.clientX)
                            }
                        },
                        h = {
                            moveHandler: e => (e.cancelable && (e.preventDefault(), e.stopPropagation()), d(e.touches[0].clientX), !1),
                            upHandler: e => {
                                p ?.removeEventListener(`touchmove`, h.moveHandler), p ?.removeEventListener(`touchend`, h.upHandler), e.cancelable && (e.preventDefault(), e.stopPropagation()), f(e.touches[0] ?.clientX)
                            }
                        },
                        g = V_() ? {
                            passive: !1
                        } : !1;
                    H_(a) ? (p ?.addEventListener(`touchmove`, h.moveHandler, g), p ?.addEventListener(`touchend`, h.upHandler, g)) : (p ?.addEventListener(`mousemove`, m.moveHandler, g), p ?.addEventListener(`mouseup`, m.upHandler, g)), t.setColumnSizingInfo(e => ({ ...e,
                        startOffset: c,
                        startSize: o,
                        deltaOffset: 0,
                        deltaPercentage: 0,
                        columnSizingStart: s,
                        isResizingColumn: r.id
                    }))
                }
            }
        },
        createTable: e => {
            e.setColumnSizing = t => e.options.onColumnSizingChange == null ? void 0 : e.options.onColumnSizingChange(t), e.setColumnSizingInfo = t => e.options.onColumnSizingInfoChange == null ? void 0 : e.options.onColumnSizingInfoChange(t), e.resetColumnSizing = t => {
                e.setColumnSizing(t ? {} : e.initialState.columnSizing ?? {})
            }, e.resetHeaderSizeInfo = t => {
                e.setColumnSizingInfo(t ? R_() : e.initialState.columnSizingInfo ?? R_())
            }, e.getTotalSize = () => e.getHeaderGroups()[0] ?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getLeftTotalSize = () => e.getLeftHeaderGroups()[0] ?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getCenterTotalSize = () => e.getCenterHeaderGroups()[0] ?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getRightTotalSize = () => e.getRightHeaderGroups()[0] ?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0
        }
    },
    B_ = null;

function V_() {
    if (typeof B_ == `boolean`) return B_;
    let e = !1;
    try {
        let t = {
                get passive() {
                    return e = !0, !1
                }
            },
            n = () => {};
        window.addEventListener(`test`, n, t), window.removeEventListener(`test`, n)
    } catch {
        e = !1
    }
    return B_ = e, B_
}

function H_(e) {
    return e.type === `touchstart`
}
var U_ = {
    getInitialState: e => ({
        columnVisibility: {},
        ...e
    }),
    getDefaultOptions: e => ({
        onColumnVisibilityChange: o_(`columnVisibility`, e)
    }),
    createColumn: (e, t) => {
        e.toggleVisibility = n => {
            e.getCanHide() && t.setColumnVisibility(t => ({ ...t,
                [e.id]: n ?? !e.getIsVisible()
            }))
        }, e.getIsVisible = () => {
            let n = e.columns;
            return (n.length ? n.some(e => e.getIsVisible()) : t.getState().columnVisibility ?.[e.id]) ?? !0
        }, e.getCanHide = () => (e.columnDef.enableHiding ?? !0) && (t.options.enableHiding ?? !0), e.getToggleVisibilityHandler = () => t => {
            e.toggleVisibility == null || e.toggleVisibility(t.target.checked)
        }
    },
    createRow: (e, t) => {
        e._getAllVisibleCells = Z(() => [e.getAllCells(), t.getState().columnVisibility], e => e.filter(e => e.column.getIsVisible()), Q(t.options, `debugRows`, `_getAllVisibleCells`)), e.getVisibleCells = Z(() => [e.getLeftVisibleCells(), e.getCenterVisibleCells(), e.getRightVisibleCells()], (e, t, n) => [...e, ...t, ...n], Q(t.options, `debugRows`, `getVisibleCells`))
    },
    createTable: e => {
        let t = (t, n) => Z(() => [n(), n().filter(e => e.getIsVisible()).map(e => e.id).join(`_`)], e => e.filter(e => e.getIsVisible == null ? void 0 : e.getIsVisible()), Q(e.options, `debugColumns`, t));
        e.getVisibleFlatColumns = t(`getVisibleFlatColumns`, () => e.getAllFlatColumns()), e.getVisibleLeafColumns = t(`getVisibleLeafColumns`, () => e.getAllLeafColumns()), e.getLeftVisibleLeafColumns = t(`getLeftVisibleLeafColumns`, () => e.getLeftLeafColumns()), e.getRightVisibleLeafColumns = t(`getRightVisibleLeafColumns`, () => e.getRightLeafColumns()), e.getCenterVisibleLeafColumns = t(`getCenterVisibleLeafColumns`, () => e.getCenterLeafColumns()), e.setColumnVisibility = t => e.options.onColumnVisibilityChange == null ? void 0 : e.options.onColumnVisibilityChange(t), e.resetColumnVisibility = t => {
            e.setColumnVisibility(t ? {} : e.initialState.columnVisibility ?? {})
        }, e.toggleAllColumnsVisible = t => {
            t ??= !e.getIsAllColumnsVisible(), e.setColumnVisibility(e.getAllLeafColumns().reduce((e, n) => ({ ...e,
                [n.id]: t || !(n.getCanHide != null && n.getCanHide())
            }), {}))
        }, e.getIsAllColumnsVisible = () => !e.getAllLeafColumns().some(e => !(e.getIsVisible != null && e.getIsVisible())), e.getIsSomeColumnsVisible = () => e.getAllLeafColumns().some(e => e.getIsVisible == null ? void 0 : e.getIsVisible()), e.getToggleAllColumnsVisibilityHandler = () => t => {
            e.toggleAllColumnsVisible(t.target ?.checked)
        }
    }
};

function W_(e, t) {
    return t ? t === `center` ? e.getCenterVisibleLeafColumns() : t === `left` ? e.getLeftVisibleLeafColumns() : e.getRightVisibleLeafColumns() : e.getVisibleLeafColumns()
}
var G_ = {
        createTable: e => {
            e._getGlobalFacetedRowModel = e.options.getFacetedRowModel && e.options.getFacetedRowModel(e, `__global__`), e.getGlobalFacetedRowModel = () => e.options.manualFiltering || !e._getGlobalFacetedRowModel ? e.getPreFilteredRowModel() : e._getGlobalFacetedRowModel(), e._getGlobalFacetedUniqueValues = e.options.getFacetedUniqueValues && e.options.getFacetedUniqueValues(e, `__global__`), e.getGlobalFacetedUniqueValues = () => e._getGlobalFacetedUniqueValues ? e._getGlobalFacetedUniqueValues() : new Map, e._getGlobalFacetedMinMaxValues = e.options.getFacetedMinMaxValues && e.options.getFacetedMinMaxValues(e, `__global__`), e.getGlobalFacetedMinMaxValues = () => {
                if (e._getGlobalFacetedMinMaxValues) return e._getGlobalFacetedMinMaxValues()
            }
        }
    },
    K_ = {
        getInitialState: e => ({
            globalFilter: void 0,
            ...e
        }),
        getDefaultOptions: e => ({
            onGlobalFilterChange: o_(`globalFilter`, e),
            globalFilterFn: `auto`,
            getColumnCanGlobalFilter: t => {
                var n;
                let r = (n = e.getCoreRowModel().flatRows[0]) == null || (n = n._getAllCellsByColumnId()[t.id]) == null ? void 0 : n.getValue();
                return typeof r == `string` || typeof r == `number`
            }
        }),
        createColumn: (e, t) => {
            e.getCanGlobalFilter = () => (e.columnDef.enableGlobalFilter ?? !0) && (t.options.enableGlobalFilter ?? !0) && (t.options.enableFilters ?? !0) && ((t.options.getColumnCanGlobalFilter == null ? void 0 : t.options.getColumnCanGlobalFilter(e)) ?? !0) && !!e.accessorFn
        },
        createTable: e => {
            e.getGlobalAutoFilterFn = () => E_.includesString, e.getGlobalFilterFn = () => {
                let {
                    globalFilterFn: t
                } = e.options;
                return s_(t) ? t : t === `auto` ? e.getGlobalAutoFilterFn() : e.options.filterFns ?.[t] ?? E_[t]
            }, e.setGlobalFilter = t => {
                e.options.onGlobalFilterChange == null || e.options.onGlobalFilterChange(t)
            }, e.resetGlobalFilter = t => {
                e.setGlobalFilter(t ? void 0 : e.initialState.globalFilter)
            }
        }
    },
    q_ = {
        getInitialState: e => ({
            expanded: {},
            ...e
        }),
        getDefaultOptions: e => ({
            onExpandedChange: o_(`expanded`, e),
            paginateExpandedRows: !0
        }),
        createTable: e => {
            let t = !1,
                n = !1;
            e._autoResetExpanded = () => {
                if (!t) {
                    e._queue(() => {
                        t = !0
                    });
                    return
                }
                if (e.options.autoResetAll ?? e.options.autoResetExpanded ?? !e.options.manualExpanding) {
                    if (n) return;
                    n = !0, e._queue(() => {
                        e.resetExpanded(), n = !1
                    })
                }
            }, e.setExpanded = t => e.options.onExpandedChange == null ? void 0 : e.options.onExpandedChange(t), e.toggleAllRowsExpanded = t => {
                t ?? !e.getIsAllRowsExpanded() ? e.setExpanded(!0) : e.setExpanded({})
            }, e.resetExpanded = t => {
                e.setExpanded(t ? {} : e.initialState ?.expanded ?? {})
            }, e.getCanSomeRowsExpand = () => e.getPrePaginationRowModel().flatRows.some(e => e.getCanExpand()), e.getToggleAllRowsExpandedHandler = () => t => {
                t.persist == null || t.persist(), e.toggleAllRowsExpanded()
            }, e.getIsSomeRowsExpanded = () => {
                let t = e.getState().expanded;
                return t === !0 || Object.values(t).some(Boolean)
            }, e.getIsAllRowsExpanded = () => {
                let t = e.getState().expanded;
                return typeof t == `boolean` ? t === !0 : !(!Object.keys(t).length || e.getRowModel().flatRows.some(e => !e.getIsExpanded()))
            }, e.getExpandedDepth = () => {
                let t = 0;
                return (e.getState().expanded === !0 ? Object.keys(e.getRowModel().rowsById) : Object.keys(e.getState().expanded)).forEach(e => {
                    let n = e.split(`.`);
                    t = Math.max(t, n.length)
                }), t
            }, e.getPreExpandedRowModel = () => e.getSortedRowModel(), e.getExpandedRowModel = () => (!e._getExpandedRowModel && e.options.getExpandedRowModel && (e._getExpandedRowModel = e.options.getExpandedRowModel(e)), e.options.manualExpanding || !e._getExpandedRowModel ? e.getPreExpandedRowModel() : e._getExpandedRowModel())
        },
        createRow: (e, t) => {
            e.toggleExpanded = n => {
                t.setExpanded(r => {
                    let i = r === !0 ? !0 : !!(r != null && r[e.id]),
                        a = {};
                    if (r === !0 ? Object.keys(t.getRowModel().rowsById).forEach(e => {
                            a[e] = !0
                        }) : a = r, n ??= !i, !i && n) return { ...a,
                        [e.id]: !0
                    };
                    if (i && !n) {
                        let {
                            [e.id]: t, ...n
                        } = a;
                        return n
                    }
                    return r
                })
            }, e.getIsExpanded = () => {
                let n = t.getState().expanded;
                return !!((t.options.getIsRowExpanded == null ? void 0 : t.options.getIsRowExpanded(e)) ?? (n === !0 || n ?.[e.id]))
            }, e.getCanExpand = () => {
                var n;
                return (t.options.getRowCanExpand == null ? void 0 : t.options.getRowCanExpand(e)) ?? ((t.options.enableExpanding ?? !0) && !!((n = e.subRows) != null && n.length))
            }, e.getIsAllParentsExpanded = () => {
                let n = !0,
                    r = e;
                for (; n && r.parentId;) r = t.getRow(r.parentId, !0), n = r.getIsExpanded();
                return n
            }, e.getToggleExpandedHandler = () => {
                let t = e.getCanExpand();
                return () => {
                    t && e.toggleExpanded()
                }
            }
        }
    },
    J_ = 0,
    Y_ = 10,
    X_ = () => ({
        pageIndex: J_,
        pageSize: Y_
    }),
    Z_ = {
        getInitialState: e => ({ ...e,
            pagination: { ...X_(),
                ...e ?.pagination
            }
        }),
        getDefaultOptions: e => ({
            onPaginationChange: o_(`pagination`, e)
        }),
        createTable: e => {
            let t = !1,
                n = !1;
            e._autoResetPageIndex = () => {
                if (!t) {
                    e._queue(() => {
                        t = !0
                    });
                    return
                }
                if (e.options.autoResetAll ?? e.options.autoResetPageIndex ?? !e.options.manualPagination) {
                    if (n) return;
                    n = !0, e._queue(() => {
                        e.resetPageIndex(), n = !1
                    })
                }
            }, e.setPagination = t => e.options.onPaginationChange == null ? void 0 : e.options.onPaginationChange(e => a_(t, e)), e.resetPagination = t => {
                e.setPagination(t ? X_() : e.initialState.pagination ?? X_())
            }, e.setPageIndex = t => {
                e.setPagination(n => {
                    let r = a_(t, n.pageIndex),
                        i = e.options.pageCount === void 0 || e.options.pageCount === -1 ? 2 ** 53 - 1 : e.options.pageCount - 1;
                    return r = Math.max(0, Math.min(r, i)), { ...n,
                        pageIndex: r
                    }
                })
            }, e.resetPageIndex = t => {
                var n;
                e.setPageIndex(t ? J_ : ((n = e.initialState) == null || (n = n.pagination) == null ? void 0 : n.pageIndex) ?? J_)
            }, e.resetPageSize = t => {
                var n;
                e.setPageSize(t ? Y_ : ((n = e.initialState) == null || (n = n.pagination) == null ? void 0 : n.pageSize) ?? Y_)
            }, e.setPageSize = t => {
                e.setPagination(e => {
                    let n = Math.max(1, a_(t, e.pageSize)),
                        r = e.pageSize * e.pageIndex,
                        i = Math.floor(r / n);
                    return { ...e,
                        pageIndex: i,
                        pageSize: n
                    }
                })
            }, e.setPageCount = t => e.setPagination(n => {
                let r = a_(t, e.options.pageCount ?? -1);
                return typeof r == `number` && (r = Math.max(-1, r)), { ...n,
                    pageCount: r
                }
            }), e.getPageOptions = Z(() => [e.getPageCount()], e => {
                let t = [];
                return e && e > 0 && (t = [...Array(e)].fill(null).map((e, t) => t)), t
            }, Q(e.options, `debugTable`, `getPageOptions`)), e.getCanPreviousPage = () => e.getState().pagination.pageIndex > 0, e.getCanNextPage = () => {
                let {
                    pageIndex: t
                } = e.getState().pagination, n = e.getPageCount();
                return n === -1 ? !0 : n === 0 ? !1 : t < n - 1
            }, e.previousPage = () => e.setPageIndex(e => e - 1), e.nextPage = () => e.setPageIndex(e => e + 1), e.firstPage = () => e.setPageIndex(0), e.lastPage = () => e.setPageIndex(e.getPageCount() - 1), e.getPrePaginationRowModel = () => e.getExpandedRowModel(), e.getPaginationRowModel = () => (!e._getPaginationRowModel && e.options.getPaginationRowModel && (e._getPaginationRowModel = e.options.getPaginationRowModel(e)), e.options.manualPagination || !e._getPaginationRowModel ? e.getPrePaginationRowModel() : e._getPaginationRowModel()), e.getPageCount = () => e.options.pageCount ?? Math.ceil(e.getRowCount() / e.getState().pagination.pageSize), e.getRowCount = () => e.options.rowCount ?? e.getPrePaginationRowModel().rows.length
        }
    },
    Q_ = () => ({
        top: [],
        bottom: []
    }),
    $_ = {
        getInitialState: e => ({
            rowPinning: Q_(),
            ...e
        }),
        getDefaultOptions: e => ({
            onRowPinningChange: o_(`rowPinning`, e)
        }),
        createRow: (e, t) => {
            e.pin = (n, r, i) => {
                let a = r ? e.getLeafRows().map(e => {
                        let {
                            id: t
                        } = e;
                        return t
                    }) : [],
                    o = i ? e.getParentRows().map(e => {
                        let {
                            id: t
                        } = e;
                        return t
                    }) : [],
                    s = new Set([...o, e.id, ...a]);
                t.setRowPinning(e => n === `bottom` ? {
                    top: (e ?.top ?? []).filter(e => !(s != null && s.has(e))),
                    bottom: [...(e ?.bottom ?? []).filter(e => !(s != null && s.has(e))), ...Array.from(s)]
                } : n === `top` ? {
                    top: [...(e ?.top ?? []).filter(e => !(s != null && s.has(e))), ...Array.from(s)],
                    bottom: (e ?.bottom ?? []).filter(e => !(s != null && s.has(e)))
                } : {
                    top: (e ?.top ?? []).filter(e => !(s != null && s.has(e))),
                    bottom: (e ?.bottom ?? []).filter(e => !(s != null && s.has(e)))
                })
            }, e.getCanPin = () => {
                let {
                    enableRowPinning: n,
                    enablePinning: r
                } = t.options;
                return typeof n == `function` ? n(e) : n ?? r ?? !0
            }, e.getIsPinned = () => {
                let n = [e.id],
                    {
                        top: r,
                        bottom: i
                    } = t.getState().rowPinning,
                    a = n.some(e => r ?.includes(e)),
                    o = n.some(e => i ?.includes(e));
                return a ? `top` : o ? `bottom` : !1
            }, e.getPinnedIndex = () => {
                let n = e.getIsPinned();
                return n ? ((n === `top` ? t.getTopRows() : t.getBottomRows()) ?.map(e => {
                    let {
                        id: t
                    } = e;
                    return t
                })) ?.indexOf(e.id) ?? -1 : -1
            }
        },
        createTable: e => {
            e.setRowPinning = t => e.options.onRowPinningChange == null ? void 0 : e.options.onRowPinningChange(t), e.resetRowPinning = t => e.setRowPinning(t ? Q_() : e.initialState ?.rowPinning ?? Q_()), e.getIsSomeRowsPinned = t => {
                let n = e.getState().rowPinning;
                return t ? !!n[t] ?.length : !!(n.top ?.length || n.bottom ?.length)
            }, e._getPinnedRows = (t, n, r) => (e.options.keepPinnedRows ?? !0 ? (n ?? []).map(t => {
                let n = e.getRow(t, !0);
                return n.getIsAllParentsExpanded() ? n : null
            }) : (n ?? []).map(e => t.find(t => t.id === e))).filter(Boolean).map(e => ({ ...e,
                position: r
            })), e.getTopRows = Z(() => [e.getRowModel().rows, e.getState().rowPinning.top], (t, n) => e._getPinnedRows(t, n, `top`), Q(e.options, `debugRows`, `getTopRows`)), e.getBottomRows = Z(() => [e.getRowModel().rows, e.getState().rowPinning.bottom], (t, n) => e._getPinnedRows(t, n, `bottom`), Q(e.options, `debugRows`, `getBottomRows`)), e.getCenterRows = Z(() => [e.getRowModel().rows, e.getState().rowPinning.top, e.getState().rowPinning.bottom], (e, t, n) => {
                let r = new Set([...t ?? [], ...n ?? []]);
                return e.filter(e => !r.has(e.id))
            }, Q(e.options, `debugRows`, `getCenterRows`))
        }
    },
    ev = {
        getInitialState: e => ({
            rowSelection: {},
            ...e
        }),
        getDefaultOptions: e => ({
            onRowSelectionChange: o_(`rowSelection`, e),
            enableRowSelection: !0,
            enableMultiRowSelection: !0,
            enableSubRowSelection: !0
        }),
        createTable: e => {
            e.setRowSelection = t => e.options.onRowSelectionChange == null ? void 0 : e.options.onRowSelectionChange(t), e.resetRowSelection = t => e.setRowSelection(t ? {} : e.initialState.rowSelection ?? {}), e.toggleAllRowsSelected = t => {
                e.setRowSelection(n => {
                    t = t === void 0 ? !e.getIsAllRowsSelected() : t;
                    let r = { ...n
                        },
                        i = e.getPreGroupedRowModel().flatRows;
                    return t ? i.forEach(e => {
                        e.getCanSelect() && (r[e.id] = !0)
                    }) : i.forEach(e => {
                        delete r[e.id]
                    }), r
                })
            }, e.toggleAllPageRowsSelected = t => e.setRowSelection(n => {
                let r = t === void 0 ? !e.getIsAllPageRowsSelected() : t,
                    i = { ...n
                    };
                return e.getRowModel().rows.forEach(t => {
                    tv(i, t.id, r, !0, e)
                }), i
            }), e.getPreSelectedRowModel = () => e.getCoreRowModel(), e.getSelectedRowModel = Z(() => [e.getState().rowSelection, e.getCoreRowModel()], (t, n) => Object.keys(t).length ? nv(e, n) : {
                rows: [],
                flatRows: [],
                rowsById: {}
            }, Q(e.options, `debugTable`, `getSelectedRowModel`)), e.getFilteredSelectedRowModel = Z(() => [e.getState().rowSelection, e.getFilteredRowModel()], (t, n) => Object.keys(t).length ? nv(e, n) : {
                rows: [],
                flatRows: [],
                rowsById: {}
            }, Q(e.options, `debugTable`, `getFilteredSelectedRowModel`)), e.getGroupedSelectedRowModel = Z(() => [e.getState().rowSelection, e.getSortedRowModel()], (t, n) => Object.keys(t).length ? nv(e, n) : {
                rows: [],
                flatRows: [],
                rowsById: {}
            }, Q(e.options, `debugTable`, `getGroupedSelectedRowModel`)), e.getIsAllRowsSelected = () => {
                let t = e.getFilteredRowModel().flatRows,
                    {
                        rowSelection: n
                    } = e.getState(),
                    r = !!(t.length && Object.keys(n).length);
                return r && t.some(e => e.getCanSelect() && !n[e.id]) && (r = !1), r
            }, e.getIsAllPageRowsSelected = () => {
                let t = e.getPaginationRowModel().flatRows.filter(e => e.getCanSelect()),
                    {
                        rowSelection: n
                    } = e.getState(),
                    r = !!t.length;
                return r && t.some(e => !n[e.id]) && (r = !1), r
            }, e.getIsSomeRowsSelected = () => {
                let t = Object.keys(e.getState().rowSelection ?? {}).length;
                return t > 0 && t < e.getFilteredRowModel().flatRows.length
            }, e.getIsSomePageRowsSelected = () => {
                let t = e.getPaginationRowModel().flatRows;
                return e.getIsAllPageRowsSelected() ? !1 : t.filter(e => e.getCanSelect()).some(e => e.getIsSelected() || e.getIsSomeSelected())
            }, e.getToggleAllRowsSelectedHandler = () => t => {
                e.toggleAllRowsSelected(t.target.checked)
            }, e.getToggleAllPageRowsSelectedHandler = () => t => {
                e.toggleAllPageRowsSelected(t.target.checked)
            }
        },
        createRow: (e, t) => {
            e.toggleSelected = (n, r) => {
                let i = e.getIsSelected();
                t.setRowSelection(a => {
                    if (n = n === void 0 ? !i : n, e.getCanSelect() && i === n) return a;
                    let o = { ...a
                    };
                    return tv(o, e.id, n, r ?.selectChildren ?? !0, t), o
                })
            }, e.getIsSelected = () => {
                let {
                    rowSelection: n
                } = t.getState();
                return rv(e, n)
            }, e.getIsSomeSelected = () => {
                let {
                    rowSelection: n
                } = t.getState();
                return iv(e, n) === `some`
            }, e.getIsAllSubRowsSelected = () => {
                let {
                    rowSelection: n
                } = t.getState();
                return iv(e, n) === `all`
            }, e.getCanSelect = () => typeof t.options.enableRowSelection == `function` ? t.options.enableRowSelection(e) : t.options.enableRowSelection ?? !0, e.getCanSelectSubRows = () => typeof t.options.enableSubRowSelection == `function` ? t.options.enableSubRowSelection(e) : t.options.enableSubRowSelection ?? !0, e.getCanMultiSelect = () => typeof t.options.enableMultiRowSelection == `function` ? t.options.enableMultiRowSelection(e) : t.options.enableMultiRowSelection ?? !0, e.getToggleSelectedHandler = () => {
                let t = e.getCanSelect();
                return n => {
                    t && e.toggleSelected(n.target ?.checked)
                }
            }
        }
    },
    tv = (e, t, n, r, i) => {
        var a;
        let o = i.getRow(t, !0);
        n ? (o.getCanMultiSelect() || Object.keys(e).forEach(t => delete e[t]), o.getCanSelect() && (e[t] = !0)) : delete e[t], r && (a = o.subRows) != null && a.length && o.getCanSelectSubRows() && o.subRows.forEach(t => tv(e, t.id, n, r, i))
    };

function nv(e, t) {
    let n = e.getState().rowSelection,
        r = [],
        i = {},
        a = function(e, t) {
            return e.map(e => {
                var t;
                let o = rv(e, n);
                if (o && (r.push(e), i[e.id] = e), (t = e.subRows) != null && t.length && (e = { ...e,
                        subRows: a(e.subRows)
                    }), o) return e
            }).filter(Boolean)
        };
    return {
        rows: a(t.rows),
        flatRows: r,
        rowsById: i
    }
}

function rv(e, t) {
    return t[e.id] ?? !1
}

function iv(e, t, n) {
    var r;
    if (!((r = e.subRows) != null && r.length)) return !1;
    let i = !0,
        a = !1;
    return e.subRows.forEach(e => {
        if (!(a && !i) && (e.getCanSelect() && (rv(e, t) ? a = !0 : i = !1), e.subRows && e.subRows.length)) {
            let n = iv(e, t);
            n === `all` ? a = !0 : (n === `some` && (a = !0), i = !1)
        }
    }), i ? `all` : a ? `some` : !1
}
var av = /([0-9]+)/gm,
    ov = (e, t, n) => mv(pv(e.getValue(n)).toLowerCase(), pv(t.getValue(n)).toLowerCase()),
    sv = (e, t, n) => mv(pv(e.getValue(n)), pv(t.getValue(n))),
    cv = (e, t, n) => fv(pv(e.getValue(n)).toLowerCase(), pv(t.getValue(n)).toLowerCase()),
    lv = (e, t, n) => fv(pv(e.getValue(n)), pv(t.getValue(n))),
    uv = (e, t, n) => {
        let r = e.getValue(n),
            i = t.getValue(n);
        return r > i ? 1 : r < i ? -1 : 0
    },
    dv = (e, t, n) => fv(e.getValue(n), t.getValue(n));

function fv(e, t) {
    return e === t ? 0 : e > t ? 1 : -1
}

function pv(e) {
    return typeof e == `number` ? isNaN(e) || e === 1 / 0 || e === -1 / 0 ? `` : String(e) : typeof e == `string` ? e : ``
}

function mv(e, t) {
    let n = e.split(av).filter(Boolean),
        r = t.split(av).filter(Boolean);
    for (; n.length && r.length;) {
        let e = n.shift(),
            t = r.shift(),
            i = parseInt(e, 10),
            a = parseInt(t, 10),
            o = [i, a].sort();
        if (isNaN(o[0])) {
            if (e > t) return 1;
            if (t > e) return -1;
            continue
        }
        if (isNaN(o[1])) return isNaN(i) ? -1 : 1;
        if (i > a) return 1;
        if (a > i) return -1
    }
    return n.length - r.length
}
var hv = {
        alphanumeric: ov,
        alphanumericCaseSensitive: sv,
        text: cv,
        textCaseSensitive: lv,
        datetime: uv,
        basic: dv
    },
    gv = [p_, U_, N_, F_, g_, O_, G_, K_, {
        getInitialState: e => ({
            sorting: [],
            ...e
        }),
        getDefaultColumnDef: () => ({
            sortingFn: `auto`,
            sortUndefined: 1
        }),
        getDefaultOptions: e => ({
            onSortingChange: o_(`sorting`, e),
            isMultiSortEvent: e => e.shiftKey
        }),
        createColumn: (e, t) => {
            e.getAutoSortingFn = () => {
                let n = t.getFilteredRowModel().flatRows.slice(10),
                    r = !1;
                for (let t of n) {
                    let n = t ?.getValue(e.id);
                    if (Object.prototype.toString.call(n) === `[object Date]`) return hv.datetime;
                    if (typeof n == `string` && (r = !0, n.split(av).length > 1)) return hv.alphanumeric
                }
                return r ? hv.text : hv.basic
            }, e.getAutoSortDir = () => typeof t.getFilteredRowModel().flatRows[0] ?.getValue(e.id) == `string` ? `asc` : `desc`, e.getSortingFn = () => {
                if (!e) throw Error();
                return s_(e.columnDef.sortingFn) ? e.columnDef.sortingFn : e.columnDef.sortingFn === `auto` ? e.getAutoSortingFn() : t.options.sortingFns ?.[e.columnDef.sortingFn] ?? hv[e.columnDef.sortingFn]
            }, e.toggleSorting = (n, r) => {
                let i = e.getNextSortingOrder(),
                    a = n != null;
                t.setSorting(o => {
                    let s = o ?.find(t => t.id === e.id),
                        c = o ?.findIndex(t => t.id === e.id),
                        l = [],
                        u, d = a ? n : i === `desc`;
                    return u = o != null && o.length && e.getCanMultiSort() && r ? s ? `toggle` : `add` : o != null && o.length && c !== o.length - 1 ? `replace` : s ? `toggle` : `replace`, u === `toggle` && (a || i || (u = `remove`)), u === `add` ? (l = [...o, {
                        id: e.id,
                        desc: d
                    }], l.splice(0, l.length - (t.options.maxMultiSortColCount ?? 2 ** 53 - 1))) : l = u === `toggle` ? o.map(t => t.id === e.id ? { ...t,
                        desc: d
                    } : t) : u === `remove` ? o.filter(t => t.id !== e.id) : [{
                        id: e.id,
                        desc: d
                    }], l
                })
            }, e.getFirstSortDir = () => e.columnDef.sortDescFirst ?? t.options.sortDescFirst ?? e.getAutoSortDir() === `desc` ? `desc` : `asc`, e.getNextSortingOrder = n => {
                let r = e.getFirstSortDir(),
                    i = e.getIsSorted();
                return i ? i !== r && (t.options.enableSortingRemoval ?? !0) && (!n || (t.options.enableMultiRemove ?? !0)) ? !1 : i === `desc` ? `asc` : `desc` : r
            }, e.getCanSort = () => (e.columnDef.enableSorting ?? !0) && (t.options.enableSorting ?? !0) && !!e.accessorFn, e.getCanMultiSort = () => e.columnDef.enableMultiSort ?? t.options.enableMultiSort ?? !!e.accessorFn, e.getIsSorted = () => {
                let n = t.getState().sorting ?.find(t => t.id === e.id);
                return n ? n.desc ? `desc` : `asc` : !1
            }, e.getSortIndex = () => t.getState().sorting ?.findIndex(t => t.id === e.id) ?? -1, e.clearSorting = () => {
                t.setSorting(t => t != null && t.length ? t.filter(t => t.id !== e.id) : [])
            }, e.getToggleSortingHandler = () => {
                let n = e.getCanSort();
                return r => {
                    n && (r.persist == null || r.persist(), e.toggleSorting == null || e.toggleSorting(void 0, e.getCanMultiSort() ? t.options.isMultiSortEvent == null ? void 0 : t.options.isMultiSortEvent(r) : !1))
                }
            }
        },
        createTable: e => {
            e.setSorting = t => e.options.onSortingChange == null ? void 0 : e.options.onSortingChange(t), e.resetSorting = t => {
                e.setSorting(t ? [] : e.initialState ?.sorting ?? [])
            }, e.getPreSortedRowModel = () => e.getGroupedRowModel(), e.getSortedRowModel = () => (!e._getSortedRowModel && e.options.getSortedRowModel && (e._getSortedRowModel = e.options.getSortedRowModel(e)), e.options.manualSorting || !e._getSortedRowModel ? e.getPreSortedRowModel() : e._getSortedRowModel())
        }
    }, j_, q_, Z_, $_, ev, z_];

function _v(e) {
    let t = [...gv, ...e._features ?? []],
        n = {
            _features: t
        },
        r = n._features.reduce((e, t) => Object.assign(e, t.getDefaultOptions == null ? void 0 : t.getDefaultOptions(n)), {}),
        i = e => n.options.mergeOptions ? n.options.mergeOptions(r, e) : { ...r,
            ...e
        },
        a = { ...e.initialState ?? {}
        };
    n._features.forEach(e => {
        a = (e.getInitialState == null ? void 0 : e.getInitialState(a)) ?? a
    });
    let o = [],
        s = !1,
        c = {
            _features: t,
            options: { ...r,
                ...e
            },
            initialState: a,
            _queue: e => {
                o.push(e), s || (s = !0, Promise.resolve().then(() => {
                    for (; o.length;) o.shift()();
                    s = !1
                }).catch(e => setTimeout(() => {
                    throw e
                })))
            },
            reset: () => {
                n.setState(n.initialState)
            },
            setOptions: e => {
                n.options = i(a_(e, n.options))
            },
            getState: () => n.options.state,
            setState: e => {
                n.options.onStateChange == null || n.options.onStateChange(e)
            },
            _getRowId: (e, t, r) => (n.options.getRowId == null ? void 0 : n.options.getRowId(e, t, r)) ?? `${r?[r.id,t].join(`.`):t}`,
            getCoreRowModel: () => (n._getCoreRowModel ||= n.options.getCoreRowModel(n), n._getCoreRowModel()),
            getRowModel: () => n.getPaginationRowModel(),
            getRow: (e, t) => {
                let r = (t ? n.getPrePaginationRowModel() : n.getRowModel()).rowsById[e];
                if (!r && (r = n.getCoreRowModel().rowsById[e], !r)) throw Error();
                return r
            },
            _getDefaultColumnDef: Z(() => [n.options.defaultColumn], e => (e ??= {}, {
                header: e => {
                    let t = e.header.column.columnDef;
                    return t.accessorKey ? t.accessorKey : t.accessorFn ? t.id : null
                },
                cell: e => {
                    var t;
                    return ((t = e.renderValue()) == null || t.toString == null ? void 0 : t.toString()) ?? null
                },
                ...n._features.reduce((e, t) => Object.assign(e, t.getDefaultColumnDef == null ? void 0 : t.getDefaultColumnDef()), {}),
                ...e
            }), Q(e, `debugColumns`, `_getDefaultColumnDef`)),
            _getColumnDefs: () => n.options.columns,
            getAllColumns: Z(() => [n._getColumnDefs()], e => {
                let t = function(e, r, i) {
                    return i === void 0 && (i = 0), e.map(e => {
                        let a = d_(n, e, i, r),
                            o = e;
                        return a.columns = o.columns ? t(o.columns, a, i + 1) : [], a
                    })
                };
                return t(e)
            }, Q(e, `debugColumns`, `getAllColumns`)),
            getAllFlatColumns: Z(() => [n.getAllColumns()], e => e.flatMap(e => e.getFlatColumns()), Q(e, `debugColumns`, `getAllFlatColumns`)),
            _getAllFlatColumnsById: Z(() => [n.getAllFlatColumns()], e => e.reduce((e, t) => (e[t.id] = t, e), {}), Q(e, `debugColumns`, `getAllFlatColumnsById`)),
            getAllLeafColumns: Z(() => [n.getAllColumns(), n._getOrderColumnsFn()], (e, t) => t(e.flatMap(e => e.getLeafColumns())), Q(e, `debugColumns`, `getAllLeafColumns`)),
            getColumn: e => n._getAllFlatColumnsById()[e]
        };
    Object.assign(n, c);
    for (let e = 0; e < n._features.length; e++) {
        let t = n._features[e];
        t == null || t.createTable == null || t.createTable(n)
    }
    return n
}

function vv() {
    return e => Z(() => [e.options.data], t => {
        let n = {
                rows: [],
                flatRows: [],
                rowsById: {}
            },
            r = function(t, i, a) {
                i === void 0 && (i = 0);
                let o = [];
                for (let c = 0; c < t.length; c++) {
                    let l = h_(e, e._getRowId(t[c], c, a), t[c], c, i, void 0, a ?.id);
                    if (n.flatRows.push(l), n.rowsById[l.id] = l, o.push(l), e.options.getSubRows) {
                        var s;
                        l.originalSubRows = e.options.getSubRows(t[c], c), (s = l.originalSubRows) != null && s.length && (l.subRows = r(l.originalSubRows, i + 1, l))
                    }
                }
                return o
            };
        return n.rows = r(t), n
    }, Q(e.options, `debugTable`, `getRowModel`, () => e._autoResetPageIndex()))
}

function yv() {
    return e => Z(() => [e.getState().sorting, e.getPreSortedRowModel()], (t, n) => {
        if (!n.rows.length || !(t != null && t.length)) return n;
        let r = e.getState().sorting,
            i = [],
            a = r.filter(t => e.getColumn(t.id) ?.getCanSort()),
            o = {};
        a.forEach(t => {
            let n = e.getColumn(t.id);
            n && (o[t.id] = {
                sortUndefined: n.columnDef.sortUndefined,
                invertSorting: n.columnDef.invertSorting,
                sortingFn: n.getSortingFn()
            })
        });
        let s = e => {
            let t = e.map(e => ({ ...e
            }));
            return t.sort((e, t) => {
                for (let n = 0; n < a.length; n += 1) {
                    let r = a[n],
                        i = o[r.id],
                        s = i.sortUndefined,
                        c = r ?.desc ?? !1,
                        l = 0;
                    if (s) {
                        let n = e.getValue(r.id),
                            i = t.getValue(r.id),
                            a = n === void 0,
                            o = i === void 0;
                        if (a || o) {
                            if (s === `first`) return a ? -1 : 1;
                            if (s === `last`) return a ? 1 : -1;
                            l = a && o ? 0 : a ? s : -s
                        }
                    }
                    if (l === 0 && (l = i.sortingFn(e, t, r.id)), l !== 0) return c && (l *= -1), i.invertSorting && (l *= -1), l
                }
                return e.index - t.index
            }), t.forEach(e => {
                var t;
                i.push(e), (t = e.subRows) != null && t.length && (e.subRows = s(e.subRows))
            }), t
        };
        return {
            rows: s(n.rows),
            flatRows: i,
            rowsById: n.rowsById
        }
    }, Q(e.options, `debugTable`, `getSortedRowModel`, () => e._autoResetPageIndex()))
}

function bv(e, t) {
    return e ? typeof e == `function` ? $e(e, t) : e : null
}

function xv(e) {
    let t = _v(it({
            state: {},
            onStateChange: () => {},
            renderFallbackValue: null,
            mergeOptions: (e, t) => it(e, t)
        }, e)),
        [n, r] = Pt(t.initialState);
    return ce(() => {
        t.setOptions(t => it(t, e, {
            state: it(n, e.state || {}),
            onStateChange: t => {
                r(t), e.onStateChange == null || e.onStateChange(t)
            }
        }))
    }), t
}
export {
    Rt as $, Lp as A, Ul as B, Np as C, at as Ct, qp as D, Kp as E, Ce as Et, rp as F, Oc as G, Ic as H, _f as I, Rc as J, Nc as K, iu as L, cm as M, wp as N, lm as O, ip as P, Pt as Q, Jl as R, Yp as S, v as St, zp as T, Te as Tt, Fc as U, Ac as V, Ec as W, jc as X, Mc as Y, Lc as Z, mm as _, st as _t, yv as a, dt as at, Rp as b, L as bt, Zh as c, $e as ct, Sm as d, pe as dt, St as et, Mm as f, ue as ft, ym as g, P as gt, Om as h, fe as ht, vv as i, pt as it, Jp as j, Gp as k, uh as l, ce as lt, km as m, le as mt, bv as n, lt as nt, r_ as o, ft as ot, jm as p, F as pt, Pc as q, i_ as r, ut as rt, tg as s, me as st, xv as t, ht as tt, Am as u, we as ut, Up as v, it as vt, Ip as w, I as wt, um as x, ge as xt, Hp as y, he as yt, ql as z
};
//#sourceMappingURL=vendor-tanstack.CgYxA78S.js.map