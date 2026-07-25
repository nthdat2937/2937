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
        t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = `b1bb8c31-fd50-47d7-9677-06ee493d93b3`, e._sentryDebugIdIdentifier = `sentry-dbid-b1bb8c31-fd50-47d7-9677-06ee493d93b3`)
    } catch {}
})();
var e = Math.random,
    t = Math.ceil,
    n = Math.floor;

function r(e) {
    return Math.round((e + 2 ** -52) * 10) / 10
}

function i(e) {
    return Math.round((e + 2 ** -52) * 100) / 100
}

function a(e) {
    try {
        return e.reduce((e, t) => t += e) / e.length
    } catch {
        return 0
    }
}

function o(e) {
    try {
        let t = e.length,
            n = a(e);
        return Math.sqrt(e.map(e => (e - n) ** 2).reduce((e, t) => e + t) / t)
    } catch {
        return 0
    }
}

function s(e) {
    return 100 * (1 - Math.tanh(e + e ** 3 / 3 + e ** 5 / 5))
}

function c(r, i) {
    let a = t(r),
        o = n(i);
    return n(e() * (o - a + 1) + a)
}

function ee(e, t, n, r, i, a = !0) {
    if (t === n) return r;
    let o = (e - t) * (i - r) / (n - t) + r;
    return a ? r < i ? Math.min(Math.max(o, r), i) : Math.max(Math.min(o, r), i) : o
}

function te(e) {
    return typeof e == `number` ? !isNaN(e) && isFinite(e) : !1
}

function ne(e) {
    if (te(e)) return e
}
var l;
(function(e) {
    e.assertEqual = e => e;

    function t(e) {}
    e.assertIs = t;

    function n(e) {
        throw Error()
    }
    e.assertNever = n, e.arrayToEnum = e => {
        let t = {};
        for (let n of e) t[n] = n;
        return t
    }, e.getValidEnumValues = t => {
        let n = e.objectKeys(t).filter(e => typeof t[t[e]] != `number`),
            r = {};
        for (let e of n) r[e] = t[e];
        return e.objectValues(r)
    }, e.objectValues = t => e.objectKeys(t).map(function(e) {
        return t[e]
    }), e.objectKeys = typeof Object.keys == `function` ? e => Object.keys(e) : e => {
        let t = [];
        for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
        return t
    }, e.find = (e, t) => {
        for (let n of e)
            if (t(n)) return n
    }, e.isInteger = typeof Number.isInteger == `function` ? e => Number.isInteger(e) : e => typeof e == `number` && isFinite(e) && Math.floor(e) === e;

    function r(e, t = ` | `) {
        return e.map(e => typeof e == `string` ? `'${e}'` : e).join(t)
    }
    e.joinValues = r, e.jsonStringifyReplacer = (e, t) => typeof t == `bigint` ? t.toString() : t
})(l ||= {});
var re;
(function(e) {
    e.mergeShapes = (e, t) => ({ ...e,
        ...t
    })
})(re ||= {});
var u = l.arrayToEnum([`string`, `nan`, `number`, `integer`, `float`, `boolean`, `date`, `bigint`, `symbol`, `function`, `undefined`, `null`, `array`, `object`, `unknown`, `promise`, `void`, `never`, `map`, `set`]),
    ie = e => {
        switch (typeof e) {
            case `undefined`:
                return u.undefined;
            case `string`:
                return u.string;
            case `number`:
                return isNaN(e) ? u.nan : u.number;
            case `boolean`:
                return u.boolean;
            case `function`:
                return u.function;
            case `bigint`:
                return u.bigint;
            case `symbol`:
                return u.symbol;
            case `object`:
                return Array.isArray(e) ? u.array : e === null ? u.null : e.then && typeof e.then == `function` && e.catch && typeof e.catch == `function` ? u.promise : typeof Map < `u` && e instanceof Map ? u.map : typeof Set < `u` && e instanceof Set ? u.set : typeof Date < `u` && e instanceof Date ? u.date : u.object;
            default:
                return u.unknown
        }
    },
    d = l.arrayToEnum([`invalid_type`, `invalid_literal`, `custom`, `invalid_union`, `invalid_union_discriminator`, `invalid_enum_value`, `unrecognized_keys`, `invalid_arguments`, `invalid_return_type`, `invalid_date`, `invalid_string`, `too_small`, `too_big`, `invalid_intersection_types`, `not_multiple_of`, `not_finite`]),
    ae = e => JSON.stringify(e, null, 2).replace(/"([^"]+)":/g, `$1:`),
    f = class e extends Error {
        constructor(e) {
            super(), this.issues = [], this.addIssue = e => {
                this.issues = [...this.issues, e]
            }, this.addIssues = (e = []) => {
                this.issues = [...this.issues, ...e]
            };
            let t = new.target.prototype;
            Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = `ZodError`, this.issues = e
        }
        get errors() {
            return this.issues
        }
        format(e) {
            let t = e || function(e) {
                    return e.message
                },
                n = {
                    _errors: []
                },
                r = e => {
                    for (let i of e.issues)
                        if (i.code === `invalid_union`) i.unionErrors.map(r);
                        else if (i.code === `invalid_return_type`) r(i.returnTypeError);
                    else if (i.code === `invalid_arguments`) r(i.argumentsError);
                    else if (i.path.length === 0) n._errors.push(t(i));
                    else {
                        let e = n,
                            r = 0;
                        for (; r < i.path.length;) {
                            let n = i.path[r];
                            r === i.path.length - 1 ? (e[n] = e[n] || {
                                _errors: []
                            }, e[n]._errors.push(t(i))) : e[n] = e[n] || {
                                _errors: []
                            }, e = e[n], r++
                        }
                    }
                };
            return r(this), n
        }
        static assert(t) {
            if (!(t instanceof e)) throw Error(`Not a ZodError: ${t}`)
        }
        toString() {
            return this.message
        }
        get message() {
            return JSON.stringify(this.issues, l.jsonStringifyReplacer, 2)
        }
        get isEmpty() {
            return this.issues.length === 0
        }
        flatten(e = e => e.message) {
            let t = {},
                n = [];
            for (let r of this.issues) r.path.length > 0 ? (t[r.path[0]] = t[r.path[0]] || [], t[r.path[0]].push(e(r))) : n.push(e(r));
            return {
                formErrors: n,
                fieldErrors: t
            }
        }
        get formErrors() {
            return this.flatten()
        }
    };
f.create = e => new f(e);
var oe = (e, t) => {
        let n;
        switch (e.code) {
            case d.invalid_type:
                n = e.received === u.undefined ? `Required` : `Expected ${e.expected}, received ${e.received}`;
                break;
            case d.invalid_literal:
                n = `Invalid literal value, expected ${JSON.stringify(e.expected,l.jsonStringifyReplacer)}`;
                break;
            case d.unrecognized_keys:
                n = `Unrecognized key(s) in object: ${l.joinValues(e.keys,`, `)}`;
                break;
            case d.invalid_union:
                n = `Invalid input`;
                break;
            case d.invalid_union_discriminator:
                n = `Invalid discriminator value. Expected ${l.joinValues(e.options)}`;
                break;
            case d.invalid_enum_value:
                n = `Invalid enum value. Expected ${l.joinValues(e.options)}, received '${e.received}'`;
                break;
            case d.invalid_arguments:
                n = `Invalid function arguments`;
                break;
            case d.invalid_return_type:
                n = `Invalid function return type`;
                break;
            case d.invalid_date:
                n = `Invalid date`;
                break;
            case d.invalid_string:
                typeof e.validation == `object` ? `includes` in e.validation ? (n = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == `number` && (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`)) : `startsWith` in e.validation ? n = `Invalid input: must start with "${e.validation.startsWith}"` : `endsWith` in e.validation ? n = `Invalid input: must end with "${e.validation.endsWith}"` : l.assertNever(e.validation) : n = e.validation === `regex` ? `Invalid` : `Invalid ${e.validation}`;
                break;
            case d.too_small:
                n = e.type === `array` ? `Array must contain ${e.exact?`exactly`:e.inclusive?`at least`:`more than`} ${e.minimum} element(s)` : e.type === `string` ? `String must contain ${e.exact?`exactly`:e.inclusive?`at least`:`over`} ${e.minimum} character(s)` : e.type === `number` ? `Number must be ${e.exact?`exactly equal to `:e.inclusive?`greater than or equal to `:`greater than `}${e.minimum}` : e.type === `date` ? `Date must be ${e.exact?`exactly equal to `:e.inclusive?`greater than or equal to `:`greater than `}${new Date(Number(e.minimum))}` : `Invalid input`;
                break;
            case d.too_big:
                n = e.type === `array` ? `Array must contain ${e.exact?`exactly`:e.inclusive?`at most`:`less than`} ${e.maximum} element(s)` : e.type === `string` ? `String must contain ${e.exact?`exactly`:e.inclusive?`at most`:`under`} ${e.maximum} character(s)` : e.type === `number` ? `Number must be ${e.exact?`exactly`:e.inclusive?`less than or equal to`:`less than`} ${e.maximum}` : e.type === `bigint` ? `BigInt must be ${e.exact?`exactly`:e.inclusive?`less than or equal to`:`less than`} ${e.maximum}` : e.type === `date` ? `Date must be ${e.exact?`exactly`:e.inclusive?`smaller than or equal to`:`smaller than`} ${new Date(Number(e.maximum))}` : `Invalid input`;
                break;
            case d.custom:
                n = `Invalid input`;
                break;
            case d.invalid_intersection_types:
                n = `Intersection results could not be merged`;
                break;
            case d.not_multiple_of:
                n = `Number must be a multiple of ${e.multipleOf}`;
                break;
            case d.not_finite:
                n = `Number must be finite`;
                break;
            default:
                n = t.defaultError, l.assertNever(e)
        }
        return {
            message: n
        }
    },
    se = oe;

function ce(e) {
    se = e
}

function le() {
    return se
}
var ue = e => {
        let {
            data: t,
            path: n,
            errorMaps: r,
            issueData: i
        } = e, a = [...n, ...i.path || []], o = { ...i,
            path: a
        };
        if (i.message !== void 0) return { ...i,
            path: a,
            message: i.message
        };
        let s = ``,
            c = r.filter(e => !!e).slice().reverse();
        for (let e of c) s = e(o, {
            data: t,
            defaultError: s
        }).message;
        return { ...i,
            path: a,
            message: s
        }
    },
    de = [];

function p(e, t) {
    let n = le(),
        r = ue({
            issueData: t,
            data: e.data,
            path: e.path,
            errorMaps: [e.common.contextualErrorMap, e.schemaErrorMap, n, n === oe ? void 0 : oe].filter(e => !!e)
        });
    e.common.issues.push(r)
}
var m = class e {
        constructor() {
            this.value = `valid`
        }
        dirty() {
            this.value === `valid` && (this.value = `dirty`)
        }
        abort() {
            this.value !== `aborted` && (this.value = `aborted`)
        }
        static mergeArray(e, t) {
            let n = [];
            for (let r of t) {
                if (r.status === `aborted`) return h;
                r.status === `dirty` && e.dirty(), n.push(r.value)
            }
            return {
                status: e.value,
                value: n
            }
        }
        static async mergeObjectAsync(t, n) {
            let r = [];
            for (let e of n) {
                let t = await e.key,
                    n = await e.value;
                r.push({
                    key: t,
                    value: n
                })
            }
            return e.mergeObjectSync(t, r)
        }
        static mergeObjectSync(e, t) {
            let n = {};
            for (let r of t) {
                let {
                    key: t,
                    value: i
                } = r;
                if (t.status === `aborted` || i.status === `aborted`) return h;
                t.status === `dirty` && e.dirty(), i.status === `dirty` && e.dirty(), t.value !== `__proto__` && (i.value !== void 0 || r.alwaysSet) && (n[t.value] = i.value)
            }
            return {
                status: e.value,
                value: n
            }
        }
    },
    h = Object.freeze({
        status: `aborted`
    }),
    fe = e => ({
        status: `dirty`,
        value: e
    }),
    g = e => ({
        status: `valid`,
        value: e
    }),
    pe = e => e.status === `aborted`,
    me = e => e.status === `dirty`,
    he = e => e.status === `valid`,
    ge = e => typeof Promise < `u` && e instanceof Promise;

function _e(e, t, n, r) {
    if (n === `a` && !r) throw TypeError(`Private accessor was defined without a getter`);
    if (typeof t == `function` ? e !== t || !r : !t.has(e)) throw TypeError(`Cannot read private member from an object whose class did not declare it`);
    return n === `m` ? r : n === `a` ? r.call(e) : r ? r.value : t.get(e)
}

function ve(e, t, n, r, i) {
    if (r === `m`) throw TypeError(`Private method is not writable`);
    if (r === `a` && !i) throw TypeError(`Private accessor was defined without a setter`);
    if (typeof t == `function` ? e !== t || !i : !t.has(e)) throw TypeError(`Cannot write private member to an object whose class did not declare it`);
    return r === `a` ? i.call(e, n) : i ? i.value = n : t.set(e, n), n
}
var _;
(function(e) {
    e.errToObj = e => typeof e == `string` ? {
        message: e
    } : e || {}, e.toString = e => typeof e == `string` ? e : e ?.message
})(_ ||= {});
var ye, be, v = class {
        constructor(e, t, n, r) {
            this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r
        }
        get path() {
            return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath
        }
    },
    xe = (e, t) => {
        if (he(t)) return {
            success: !0,
            data: t.value
        };
        if (!e.common.issues.length) throw Error(`Validation failed but no issues detected.`);
        return {
            success: !1,
            get error() {
                return this._error ||= new f(e.common.issues), this._error
            }
        }
    };

function y(e) {
    if (!e) return {};
    let {
        errorMap: t,
        invalid_type_error: n,
        required_error: r,
        description: i
    } = e;
    if (t && (n || r)) throw Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    return t ? {
        errorMap: t,
        description: i
    } : {
        errorMap: (t, i) => {
            let {
                message: a
            } = e;
            return t.code === `invalid_enum_value` ? {
                message: a ?? i.defaultError
            } : i.data === void 0 ? {
                message: a ?? r ?? i.defaultError
            } : t.code === `invalid_type` ? {
                message: a ?? n ?? i.defaultError
            } : {
                message: i.defaultError
            }
        },
        description: i
    }
}
var b = class {
        constructor(e) {
            this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this)
        }
        get description() {
            return this._def.description
        }
        _getType(e) {
            return ie(e.data)
        }
        _getOrReturnCtx(e, t) {
            return t || {
                common: e.parent.common,
                data: e.data,
                parsedType: ie(e.data),
                schemaErrorMap: this._def.errorMap,
                path: e.path,
                parent: e.parent
            }
        }
        _processInputParams(e) {
            return {
                status: new m,
                ctx: {
                    common: e.parent.common,
                    data: e.data,
                    parsedType: ie(e.data),
                    schemaErrorMap: this._def.errorMap,
                    path: e.path,
                    parent: e.parent
                }
            }
        }
        _parseSync(e) {
            let t = this._parse(e);
            if (ge(t)) throw Error(`Synchronous parse encountered promise.`);
            return t
        }
        _parseAsync(e) {
            let t = this._parse(e);
            return Promise.resolve(t)
        }
        parse(e, t) {
            let n = this.safeParse(e, t);
            if (n.success) return n.data;
            throw n.error
        }
        safeParse(e, t) {
            let n = {
                common: {
                    issues: [],
                    async: t ?.async ?? !1,
                    contextualErrorMap: t ?.errorMap
                },
                path: t ?.path || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data: e,
                parsedType: ie(e)
            };
            return xe(n, this._parseSync({
                data: e,
                path: n.path,
                parent: n
            }))
        }
        async parseAsync(e, t) {
            let n = await this.safeParseAsync(e, t);
            if (n.success) return n.data;
            throw n.error
        }
        async safeParseAsync(e, t) {
            let n = {
                    common: {
                        issues: [],
                        contextualErrorMap: t ?.errorMap,
                        async: !0
                    },
                    path: t ?.path || [],
                    schemaErrorMap: this._def.errorMap,
                    parent: null,
                    data: e,
                    parsedType: ie(e)
                },
                r = this._parse({
                    data: e,
                    path: n.path,
                    parent: n
                });
            return xe(n, await (ge(r) ? r : Promise.resolve(r)))
        }
        refine(e, t) {
            let n = e => typeof t == `string` || t === void 0 ? {
                message: t
            } : typeof t == `function` ? t(e) : t;
            return this._refinement((t, r) => {
                let i = e(t),
                    a = () => r.addIssue({
                        code: d.custom,
                        ...n(t)
                    });
                return typeof Promise < `u` && i instanceof Promise ? i.then(e => e ? !0 : (a(), !1)) : i ? !0 : (a(), !1)
            })
        }
        refinement(e, t) {
            return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == `function` ? t(n, r) : t), !1))
        }
        _refinement(e) {
            return new C({
                schema: this,
                typeName: E.ZodEffects,
                effect: {
                    type: `refinement`,
                    refinement: e
                }
            })
        }
        superRefine(e) {
            return this._refinement(e)
        }
        optional() {
            return w.create(this, this._def)
        }
        nullable() {
            return T.create(this, this._def)
        }
        nullish() {
            return this.nullable().optional()
        }
        array() {
            return Qe.create(this, this._def)
        }
        promise() {
            return ht.create(this, this._def)
        }
        or(e) {
            return et.create([this, e], this._def)
        }
        and(e) {
            return it.create(this, e, this._def)
        }
        transform(e) {
            return new C({ ...y(this._def),
                schema: this,
                typeName: E.ZodEffects,
                effect: {
                    type: `transform`,
                    transform: e
                }
            })
        }
        default (e) {
            let t = typeof e == `function` ? e : () => e;
            return new gt({ ...y(this._def),
                innerType: this,
                defaultValue: t,
                typeName: E.ZodDefault
            })
        }
        brand() {
            return new bt({
                typeName: E.ZodBranded,
                type: this,
                ...y(this._def)
            })
        } catch (e) {
            let t = typeof e == `function` ? e : () => e;
            return new _t({ ...y(this._def),
                innerType: this,
                catchValue: t,
                typeName: E.ZodCatch
            })
        }
        describe(e) {
            let t = this.constructor;
            return new t({ ...this._def,
                description: e
            })
        }
        pipe(e) {
            return xt.create(this, e)
        }
        readonly() {
            return St.create(this)
        }
        isOptional() {
            return this.safeParse(void 0).success
        }
        isNullable() {
            return this.safeParse(null).success
        }
    },
    Se = /^c[^\s-]{8,}$/i,
    Ce = /^[0-9a-z]+$/,
    we = /^[0-9A-HJKMNP-TV-Z]{26}$/,
    Te = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
    Ee = /^[a-z0-9_-]{21}$/i,
    De = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
    Oe = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
    ke = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`,
    Ae, je = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    Me = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    Ne = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    Pe = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`,
    Fe = RegExp(`^${Pe}$`);

function Ie(e) {
    let t = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
    return e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision ?? (t = `${t}(\\.\\d+)?`), t
}

function Le(e) {
    return RegExp(`^${Ie(e)}$`)
}

function Re(e) {
    let t = `${Pe}T${Ie(e)}`,
        n = [];
    return n.push(e.local ? `Z?` : `Z`), e.offset && n.push(`([+-]\\d{2}:?\\d{2})`), t = `${t}(${n.join(`|`)})`, RegExp(`^${t}$`)
}

function ze(e, t) {
    return !!((t === `v4` || !t) && je.test(e) || (t === `v6` || !t) && Me.test(e))
}
var Be = class e extends b {
    _parse(e) {
        if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== u.string) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.string,
                received: t.parsedType
            }), h
        }
        let t = new m,
            n;
        for (let r of this._def.checks)
            if (r.kind === `min`) e.data.length < r.value && (n = this._getOrReturnCtx(e, n), p(n, {
                code: d.too_small,
                minimum: r.value,
                type: `string`,
                inclusive: !0,
                exact: !1,
                message: r.message
            }), t.dirty());
            else if (r.kind === `max`) e.data.length > r.value && (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.too_big,
            maximum: r.value,
            type: `string`,
            inclusive: !0,
            exact: !1,
            message: r.message
        }), t.dirty());
        else if (r.kind === `length`) {
            let i = e.data.length > r.value,
                a = e.data.length < r.value;
            (i || a) && (n = this._getOrReturnCtx(e, n), i ? p(n, {
                code: d.too_big,
                maximum: r.value,
                type: `string`,
                inclusive: !0,
                exact: !0,
                message: r.message
            }) : a && p(n, {
                code: d.too_small,
                minimum: r.value,
                type: `string`,
                inclusive: !0,
                exact: !0,
                message: r.message
            }), t.dirty())
        } else if (r.kind === `email`) Oe.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `email`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty());
        else if (r.kind === `emoji`) Ae ||= new RegExp(ke, `u`), Ae.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `emoji`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty());
        else if (r.kind === `uuid`) Te.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `uuid`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty());
        else if (r.kind === `nanoid`) Ee.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `nanoid`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty());
        else if (r.kind === `cuid`) Se.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `cuid`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty());
        else if (r.kind === `cuid2`) Ce.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `cuid2`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty());
        else if (r.kind === `ulid`) we.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `ulid`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty());
        else if (r.kind === `url`) try {
            new URL(e.data)
        } catch {
            n = this._getOrReturnCtx(e, n), p(n, {
                validation: `url`,
                code: d.invalid_string,
                message: r.message
            }), t.dirty()
        } else r.kind === `regex` ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `regex`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty())) : r.kind === `trim` ? e.data = e.data.trim() : r.kind === `includes` ? e.data.includes(r.value, r.position) || (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.invalid_string,
            validation: {
                includes: r.value,
                position: r.position
            },
            message: r.message
        }), t.dirty()) : r.kind === `toLowerCase` ? e.data = e.data.toLowerCase() : r.kind === `toUpperCase` ? e.data = e.data.toUpperCase() : r.kind === `startsWith` ? e.data.startsWith(r.value) || (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.invalid_string,
            validation: {
                startsWith: r.value
            },
            message: r.message
        }), t.dirty()) : r.kind === `endsWith` ? e.data.endsWith(r.value) || (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.invalid_string,
            validation: {
                endsWith: r.value
            },
            message: r.message
        }), t.dirty()) : r.kind === `datetime` ? Re(r).test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.invalid_string,
            validation: `datetime`,
            message: r.message
        }), t.dirty()) : r.kind === `date` ? Fe.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.invalid_string,
            validation: `date`,
            message: r.message
        }), t.dirty()) : r.kind === `time` ? Le(r).test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.invalid_string,
            validation: `time`,
            message: r.message
        }), t.dirty()) : r.kind === `duration` ? De.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `duration`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty()) : r.kind === `ip` ? ze(e.data, r.version) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `ip`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty()) : r.kind === `base64` ? Ne.test(e.data) || (n = this._getOrReturnCtx(e, n), p(n, {
            validation: `base64`,
            code: d.invalid_string,
            message: r.message
        }), t.dirty()) : l.assertNever(r);
        return {
            status: t.value,
            value: e.data
        }
    }
    _regex(e, t, n) {
        return this.refinement(t => e.test(t), {
            validation: t,
            code: d.invalid_string,
            ..._.errToObj(n)
        })
    }
    _addCheck(t) {
        return new e({ ...this._def,
            checks: [...this._def.checks, t]
        })
    }
    email(e) {
        return this._addCheck({
            kind: `email`,
            ..._.errToObj(e)
        })
    }
    url(e) {
        return this._addCheck({
            kind: `url`,
            ..._.errToObj(e)
        })
    }
    emoji(e) {
        return this._addCheck({
            kind: `emoji`,
            ..._.errToObj(e)
        })
    }
    uuid(e) {
        return this._addCheck({
            kind: `uuid`,
            ..._.errToObj(e)
        })
    }
    nanoid(e) {
        return this._addCheck({
            kind: `nanoid`,
            ..._.errToObj(e)
        })
    }
    cuid(e) {
        return this._addCheck({
            kind: `cuid`,
            ..._.errToObj(e)
        })
    }
    cuid2(e) {
        return this._addCheck({
            kind: `cuid2`,
            ..._.errToObj(e)
        })
    }
    ulid(e) {
        return this._addCheck({
            kind: `ulid`,
            ..._.errToObj(e)
        })
    }
    base64(e) {
        return this._addCheck({
            kind: `base64`,
            ..._.errToObj(e)
        })
    }
    ip(e) {
        return this._addCheck({
            kind: `ip`,
            ..._.errToObj(e)
        })
    }
    datetime(e) {
        return typeof e == `string` ? this._addCheck({
            kind: `datetime`,
            precision: null,
            offset: !1,
            local: !1,
            message: e
        }) : this._addCheck({
            kind: `datetime`,
            precision: e ?.precision === void 0 ? null : e ?.precision,
            offset: e ?.offset ?? !1,
            local: e ?.local ?? !1,
            ..._.errToObj(e ?.message)
        })
    }
    date(e) {
        return this._addCheck({
            kind: `date`,
            message: e
        })
    }
    time(e) {
        return typeof e == `string` ? this._addCheck({
            kind: `time`,
            precision: null,
            message: e
        }) : this._addCheck({
            kind: `time`,
            precision: e ?.precision === void 0 ? null : e ?.precision,
            ..._.errToObj(e ?.message)
        })
    }
    duration(e) {
        return this._addCheck({
            kind: `duration`,
            ..._.errToObj(e)
        })
    }
    regex(e, t) {
        return this._addCheck({
            kind: `regex`,
            regex: e,
            ..._.errToObj(t)
        })
    }
    includes(e, t) {
        return this._addCheck({
            kind: `includes`,
            value: e,
            position: t ?.position,
            ..._.errToObj(t ?.message)
        })
    }
    startsWith(e, t) {
        return this._addCheck({
            kind: `startsWith`,
            value: e,
            ..._.errToObj(t)
        })
    }
    endsWith(e, t) {
        return this._addCheck({
            kind: `endsWith`,
            value: e,
            ..._.errToObj(t)
        })
    }
    min(e, t) {
        return this._addCheck({
            kind: `min`,
            value: e,
            ..._.errToObj(t)
        })
    }
    max(e, t) {
        return this._addCheck({
            kind: `max`,
            value: e,
            ..._.errToObj(t)
        })
    }
    length(e, t) {
        return this._addCheck({
            kind: `length`,
            value: e,
            ..._.errToObj(t)
        })
    }
    nonempty(e) {
        return this.min(1, _.errToObj(e))
    }
    trim() {
        return new e({ ...this._def,
            checks: [...this._def.checks, {
                kind: `trim`
            }]
        })
    }
    toLowerCase() {
        return new e({ ...this._def,
            checks: [...this._def.checks, {
                kind: `toLowerCase`
            }]
        })
    }
    toUpperCase() {
        return new e({ ...this._def,
            checks: [...this._def.checks, {
                kind: `toUpperCase`
            }]
        })
    }
    get isDatetime() {
        return !!this._def.checks.find(e => e.kind === `datetime`)
    }
    get isDate() {
        return !!this._def.checks.find(e => e.kind === `date`)
    }
    get isTime() {
        return !!this._def.checks.find(e => e.kind === `time`)
    }
    get isDuration() {
        return !!this._def.checks.find(e => e.kind === `duration`)
    }
    get isEmail() {
        return !!this._def.checks.find(e => e.kind === `email`)
    }
    get isURL() {
        return !!this._def.checks.find(e => e.kind === `url`)
    }
    get isEmoji() {
        return !!this._def.checks.find(e => e.kind === `emoji`)
    }
    get isUUID() {
        return !!this._def.checks.find(e => e.kind === `uuid`)
    }
    get isNANOID() {
        return !!this._def.checks.find(e => e.kind === `nanoid`)
    }
    get isCUID() {
        return !!this._def.checks.find(e => e.kind === `cuid`)
    }
    get isCUID2() {
        return !!this._def.checks.find(e => e.kind === `cuid2`)
    }
    get isULID() {
        return !!this._def.checks.find(e => e.kind === `ulid`)
    }
    get isIP() {
        return !!this._def.checks.find(e => e.kind === `ip`)
    }
    get isBase64() {
        return !!this._def.checks.find(e => e.kind === `base64`)
    }
    get minLength() {
        let e = null;
        for (let t of this._def.checks) t.kind === `min` && (e === null || t.value > e) && (e = t.value);
        return e
    }
    get maxLength() {
        let e = null;
        for (let t of this._def.checks) t.kind === `max` && (e === null || t.value < e) && (e = t.value);
        return e
    }
};
Be.create = e => new Be({
    checks: [],
    typeName: E.ZodString,
    coerce: e ?.coerce ?? !1,
    ...y(e)
});

function Ve(e, t) {
    let n = (e.toString().split(`.`)[1] || ``).length,
        r = (t.toString().split(`.`)[1] || ``).length,
        i = n > r ? n : r;
    return parseInt(e.toFixed(i).replace(`.`, ``)) % parseInt(t.toFixed(i).replace(`.`, ``)) / 10 ** i
}
var He = class e extends b {
    constructor() {
        super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf
    }
    _parse(e) {
        if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== u.number) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.number,
                received: t.parsedType
            }), h
        }
        let t, n = new m;
        for (let r of this._def.checks) r.kind === `int` ? l.isInteger(e.data) || (t = this._getOrReturnCtx(e, t), p(t, {
            code: d.invalid_type,
            expected: `integer`,
            received: `float`,
            message: r.message
        }), n.dirty()) : r.kind === `min` ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), p(t, {
            code: d.too_small,
            minimum: r.value,
            type: `number`,
            inclusive: r.inclusive,
            exact: !1,
            message: r.message
        }), n.dirty()) : r.kind === `max` ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), p(t, {
            code: d.too_big,
            maximum: r.value,
            type: `number`,
            inclusive: r.inclusive,
            exact: !1,
            message: r.message
        }), n.dirty()) : r.kind === `multipleOf` ? Ve(e.data, r.value) !== 0 && (t = this._getOrReturnCtx(e, t), p(t, {
            code: d.not_multiple_of,
            multipleOf: r.value,
            message: r.message
        }), n.dirty()) : r.kind === `finite` ? Number.isFinite(e.data) || (t = this._getOrReturnCtx(e, t), p(t, {
            code: d.not_finite,
            message: r.message
        }), n.dirty()) : l.assertNever(r);
        return {
            status: n.value,
            value: e.data
        }
    }
    gte(e, t) {
        return this.setLimit(`min`, e, !0, _.toString(t))
    }
    gt(e, t) {
        return this.setLimit(`min`, e, !1, _.toString(t))
    }
    lte(e, t) {
        return this.setLimit(`max`, e, !0, _.toString(t))
    }
    lt(e, t) {
        return this.setLimit(`max`, e, !1, _.toString(t))
    }
    setLimit(t, n, r, i) {
        return new e({ ...this._def,
            checks: [...this._def.checks, {
                kind: t,
                value: n,
                inclusive: r,
                message: _.toString(i)
            }]
        })
    }
    _addCheck(t) {
        return new e({ ...this._def,
            checks: [...this._def.checks, t]
        })
    }
    int(e) {
        return this._addCheck({
            kind: `int`,
            message: _.toString(e)
        })
    }
    positive(e) {
        return this._addCheck({
            kind: `min`,
            value: 0,
            inclusive: !1,
            message: _.toString(e)
        })
    }
    negative(e) {
        return this._addCheck({
            kind: `max`,
            value: 0,
            inclusive: !1,
            message: _.toString(e)
        })
    }
    nonpositive(e) {
        return this._addCheck({
            kind: `max`,
            value: 0,
            inclusive: !0,
            message: _.toString(e)
        })
    }
    nonnegative(e) {
        return this._addCheck({
            kind: `min`,
            value: 0,
            inclusive: !0,
            message: _.toString(e)
        })
    }
    multipleOf(e, t) {
        return this._addCheck({
            kind: `multipleOf`,
            value: e,
            message: _.toString(t)
        })
    }
    finite(e) {
        return this._addCheck({
            kind: `finite`,
            message: _.toString(e)
        })
    }
    safe(e) {
        return this._addCheck({
            kind: `min`,
            inclusive: !0,
            value: -(2 ** 53 - 1),
            message: _.toString(e)
        })._addCheck({
            kind: `max`,
            inclusive: !0,
            value: 2 ** 53 - 1,
            message: _.toString(e)
        })
    }
    get minValue() {
        let e = null;
        for (let t of this._def.checks) t.kind === `min` && (e === null || t.value > e) && (e = t.value);
        return e
    }
    get maxValue() {
        let e = null;
        for (let t of this._def.checks) t.kind === `max` && (e === null || t.value < e) && (e = t.value);
        return e
    }
    get isInt() {
        return !!this._def.checks.find(e => e.kind === `int` || e.kind === `multipleOf` && l.isInteger(e.value))
    }
    get isFinite() {
        let e = null,
            t = null;
        for (let n of this._def.checks)
            if (n.kind === `finite` || n.kind === `int` || n.kind === `multipleOf`) return !0;
            else n.kind === `min` ? (t === null || n.value > t) && (t = n.value) : n.kind === `max` && (e === null || n.value < e) && (e = n.value);
        return Number.isFinite(t) && Number.isFinite(e)
    }
};
He.create = e => new He({
    checks: [],
    typeName: E.ZodNumber,
    coerce: e ?.coerce || !1,
    ...y(e)
});
var Ue = class e extends b {
    constructor() {
        super(...arguments), this.min = this.gte, this.max = this.lte
    }
    _parse(e) {
        if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== u.bigint) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.bigint,
                received: t.parsedType
            }), h
        }
        let t, n = new m;
        for (let r of this._def.checks) r.kind === `min` ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), p(t, {
            code: d.too_small,
            type: `bigint`,
            minimum: r.value,
            inclusive: r.inclusive,
            message: r.message
        }), n.dirty()) : r.kind === `max` ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), p(t, {
            code: d.too_big,
            type: `bigint`,
            maximum: r.value,
            inclusive: r.inclusive,
            message: r.message
        }), n.dirty()) : r.kind === `multipleOf` ? e.data % r.value !== BigInt(0) && (t = this._getOrReturnCtx(e, t), p(t, {
            code: d.not_multiple_of,
            multipleOf: r.value,
            message: r.message
        }), n.dirty()) : l.assertNever(r);
        return {
            status: n.value,
            value: e.data
        }
    }
    gte(e, t) {
        return this.setLimit(`min`, e, !0, _.toString(t))
    }
    gt(e, t) {
        return this.setLimit(`min`, e, !1, _.toString(t))
    }
    lte(e, t) {
        return this.setLimit(`max`, e, !0, _.toString(t))
    }
    lt(e, t) {
        return this.setLimit(`max`, e, !1, _.toString(t))
    }
    setLimit(t, n, r, i) {
        return new e({ ...this._def,
            checks: [...this._def.checks, {
                kind: t,
                value: n,
                inclusive: r,
                message: _.toString(i)
            }]
        })
    }
    _addCheck(t) {
        return new e({ ...this._def,
            checks: [...this._def.checks, t]
        })
    }
    positive(e) {
        return this._addCheck({
            kind: `min`,
            value: BigInt(0),
            inclusive: !1,
            message: _.toString(e)
        })
    }
    negative(e) {
        return this._addCheck({
            kind: `max`,
            value: BigInt(0),
            inclusive: !1,
            message: _.toString(e)
        })
    }
    nonpositive(e) {
        return this._addCheck({
            kind: `max`,
            value: BigInt(0),
            inclusive: !0,
            message: _.toString(e)
        })
    }
    nonnegative(e) {
        return this._addCheck({
            kind: `min`,
            value: BigInt(0),
            inclusive: !0,
            message: _.toString(e)
        })
    }
    multipleOf(e, t) {
        return this._addCheck({
            kind: `multipleOf`,
            value: e,
            message: _.toString(t)
        })
    }
    get minValue() {
        let e = null;
        for (let t of this._def.checks) t.kind === `min` && (e === null || t.value > e) && (e = t.value);
        return e
    }
    get maxValue() {
        let e = null;
        for (let t of this._def.checks) t.kind === `max` && (e === null || t.value < e) && (e = t.value);
        return e
    }
};
Ue.create = e => new Ue({
    checks: [],
    typeName: E.ZodBigInt,
    coerce: e ?.coerce ?? !1,
    ...y(e)
});
var We = class extends b {
    _parse(e) {
        if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== u.boolean) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.boolean,
                received: t.parsedType
            }), h
        }
        return g(e.data)
    }
};
We.create = e => new We({
    typeName: E.ZodBoolean,
    coerce: e ?.coerce || !1,
    ...y(e)
});
var Ge = class e extends b {
    _parse(e) {
        if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== u.date) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.date,
                received: t.parsedType
            }), h
        }
        if (isNaN(e.data.getTime())) return p(this._getOrReturnCtx(e), {
            code: d.invalid_date
        }), h;
        let t = new m,
            n;
        for (let r of this._def.checks) r.kind === `min` ? e.data.getTime() < r.value && (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.too_small,
            message: r.message,
            inclusive: !0,
            exact: !1,
            minimum: r.value,
            type: `date`
        }), t.dirty()) : r.kind === `max` ? e.data.getTime() > r.value && (n = this._getOrReturnCtx(e, n), p(n, {
            code: d.too_big,
            message: r.message,
            inclusive: !0,
            exact: !1,
            maximum: r.value,
            type: `date`
        }), t.dirty()) : l.assertNever(r);
        return {
            status: t.value,
            value: new Date(e.data.getTime())
        }
    }
    _addCheck(t) {
        return new e({ ...this._def,
            checks: [...this._def.checks, t]
        })
    }
    min(e, t) {
        return this._addCheck({
            kind: `min`,
            value: e.getTime(),
            message: _.toString(t)
        })
    }
    max(e, t) {
        return this._addCheck({
            kind: `max`,
            value: e.getTime(),
            message: _.toString(t)
        })
    }
    get minDate() {
        let e = null;
        for (let t of this._def.checks) t.kind === `min` && (e === null || t.value > e) && (e = t.value);
        return e == null ? null : new Date(e)
    }
    get maxDate() {
        let e = null;
        for (let t of this._def.checks) t.kind === `max` && (e === null || t.value < e) && (e = t.value);
        return e == null ? null : new Date(e)
    }
};
Ge.create = e => new Ge({
    checks: [],
    coerce: e ?.coerce || !1,
    typeName: E.ZodDate,
    ...y(e)
});
var Ke = class extends b {
    _parse(e) {
        if (this._getType(e) !== u.symbol) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.symbol,
                received: t.parsedType
            }), h
        }
        return g(e.data)
    }
};
Ke.create = e => new Ke({
    typeName: E.ZodSymbol,
    ...y(e)
});
var qe = class extends b {
    _parse(e) {
        if (this._getType(e) !== u.undefined) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.undefined,
                received: t.parsedType
            }), h
        }
        return g(e.data)
    }
};
qe.create = e => new qe({
    typeName: E.ZodUndefined,
    ...y(e)
});
var Je = class extends b {
    _parse(e) {
        if (this._getType(e) !== u.null) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.null,
                received: t.parsedType
            }), h
        }
        return g(e.data)
    }
};
Je.create = e => new Je({
    typeName: E.ZodNull,
    ...y(e)
});
var Ye = class extends b {
    constructor() {
        super(...arguments), this._any = !0
    }
    _parse(e) {
        return g(e.data)
    }
};
Ye.create = e => new Ye({
    typeName: E.ZodAny,
    ...y(e)
});
var Xe = class extends b {
    constructor() {
        super(...arguments), this._unknown = !0
    }
    _parse(e) {
        return g(e.data)
    }
};
Xe.create = e => new Xe({
    typeName: E.ZodUnknown,
    ...y(e)
});
var x = class extends b {
    _parse(e) {
        let t = this._getOrReturnCtx(e);
        return p(t, {
            code: d.invalid_type,
            expected: u.never,
            received: t.parsedType
        }), h
    }
};
x.create = e => new x({
    typeName: E.ZodNever,
    ...y(e)
});
var Ze = class extends b {
    _parse(e) {
        if (this._getType(e) !== u.undefined) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.void,
                received: t.parsedType
            }), h
        }
        return g(e.data)
    }
};
Ze.create = e => new Ze({
    typeName: E.ZodVoid,
    ...y(e)
});
var Qe = class e extends b {
    _parse(e) {
        let {
            ctx: t,
            status: n
        } = this._processInputParams(e), r = this._def;
        if (t.parsedType !== u.array) return p(t, {
            code: d.invalid_type,
            expected: u.array,
            received: t.parsedType
        }), h;
        if (r.exactLength !== null) {
            let e = t.data.length > r.exactLength.value,
                i = t.data.length < r.exactLength.value;
            (e || i) && (p(t, {
                code: e ? d.too_big : d.too_small,
                minimum: i ? r.exactLength.value : void 0,
                maximum: e ? r.exactLength.value : void 0,
                type: `array`,
                inclusive: !0,
                exact: !0,
                message: r.exactLength.message
            }), n.dirty())
        }
        if (r.minLength !== null && t.data.length < r.minLength.value && (p(t, {
                code: d.too_small,
                minimum: r.minLength.value,
                type: `array`,
                inclusive: !0,
                exact: !1,
                message: r.minLength.message
            }), n.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (p(t, {
                code: d.too_big,
                maximum: r.maxLength.value,
                type: `array`,
                inclusive: !0,
                exact: !1,
                message: r.maxLength.message
            }), n.dirty()), t.common.async) return Promise.all([...t.data].map((e, n) => r.type._parseAsync(new v(t, e, t.path, n)))).then(e => m.mergeArray(n, e));
        let i = [...t.data].map((e, n) => r.type._parseSync(new v(t, e, t.path, n)));
        return m.mergeArray(n, i)
    }
    get element() {
        return this._def.type
    }
    min(t, n) {
        return new e({ ...this._def,
            minLength: {
                value: t,
                message: _.toString(n)
            }
        })
    }
    max(t, n) {
        return new e({ ...this._def,
            maxLength: {
                value: t,
                message: _.toString(n)
            }
        })
    }
    length(t, n) {
        return new e({ ...this._def,
            exactLength: {
                value: t,
                message: _.toString(n)
            }
        })
    }
    nonempty(e) {
        return this.min(1, e)
    }
};
Qe.create = (e, t) => new Qe({
    type: e,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: E.ZodArray,
    ...y(t)
});

function $e(e) {
    if (e instanceof S) {
        let t = {};
        for (let n in e.shape) {
            let r = e.shape[n];
            t[n] = w.create($e(r))
        }
        return new S({ ...e._def,
            shape: () => t
        })
    } else if (e instanceof Qe) return new Qe({ ...e._def,
        type: $e(e.element)
    });
    else if (e instanceof w) return w.create($e(e.unwrap()));
    else if (e instanceof T) return T.create($e(e.unwrap()));
    else if (e instanceof at) return at.create(e.items.map(e => $e(e)));
    else return e
}
var S = class e extends b {
    constructor() {
        super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend
    }
    _getCached() {
        if (this._cached !== null) return this._cached;
        let e = this._def.shape();
        return this._cached = {
            shape: e,
            keys: l.objectKeys(e)
        }
    }
    _parse(e) {
        if (this._getType(e) !== u.object) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.object,
                received: t.parsedType
            }), h
        }
        let {
            status: t,
            ctx: n
        } = this._processInputParams(e), {
            shape: r,
            keys: i
        } = this._getCached(), a = [];
        if (!(this._def.catchall instanceof x && this._def.unknownKeys === `strip`))
            for (let e in n.data) i.includes(e) || a.push(e);
        let o = [];
        for (let e of i) {
            let t = r[e],
                i = n.data[e];
            o.push({
                key: {
                    status: `valid`,
                    value: e
                },
                value: t._parse(new v(n, i, n.path, e)),
                alwaysSet: e in n.data
            })
        }
        if (this._def.catchall instanceof x) {
            let e = this._def.unknownKeys;
            if (e === `passthrough`)
                for (let e of a) o.push({
                    key: {
                        status: `valid`,
                        value: e
                    },
                    value: {
                        status: `valid`,
                        value: n.data[e]
                    }
                });
            else if (e === `strict`) a.length > 0 && (p(n, {
                code: d.unrecognized_keys,
                keys: a
            }), t.dirty());
            else if (e !== `strip`) throw Error(`Internal ZodObject error: invalid unknownKeys value.`)
        } else {
            let e = this._def.catchall;
            for (let t of a) {
                let r = n.data[t];
                o.push({
                    key: {
                        status: `valid`,
                        value: t
                    },
                    value: e._parse(new v(n, r, n.path, t)),
                    alwaysSet: t in n.data
                })
            }
        }
        return n.common.async ? Promise.resolve().then(async () => {
            let e = [];
            for (let t of o) {
                let n = await t.key,
                    r = await t.value;
                e.push({
                    key: n,
                    value: r,
                    alwaysSet: t.alwaysSet
                })
            }
            return e
        }).then(e => m.mergeObjectSync(t, e)) : m.mergeObjectSync(t, o)
    }
    get shape() {
        return this._def.shape()
    }
    strict(t) {
        return _.errToObj, new e({ ...this._def,
            unknownKeys: `strict`,
            ...t === void 0 ? {} : {
                errorMap: (e, n) => {
                    var r;
                    let i = (r = this._def).errorMap ?.call(r, e, n).message ?? n.defaultError;
                    return e.code === `unrecognized_keys` ? {
                        message: _.errToObj(t).message ?? i
                    } : {
                        message: i
                    }
                }
            }
        })
    }
    strip() {
        return new e({ ...this._def,
            unknownKeys: `strip`
        })
    }
    passthrough() {
        return new e({ ...this._def,
            unknownKeys: `passthrough`
        })
    }
    extend(t) {
        return new e({ ...this._def,
            shape: () => ({ ...this._def.shape(),
                ...t
            })
        })
    }
    merge(t) {
        return new e({
            unknownKeys: t._def.unknownKeys,
            catchall: t._def.catchall,
            shape: () => ({ ...this._def.shape(),
                ...t._def.shape()
            }),
            typeName: E.ZodObject
        })
    }
    setKey(e, t) {
        return this.augment({
            [e]: t
        })
    }
    catchall(t) {
        return new e({ ...this._def,
            catchall: t
        })
    }
    pick(t) {
        let n = {};
        return l.objectKeys(t).forEach(e => {
            t[e] && this.shape[e] && (n[e] = this.shape[e])
        }), new e({ ...this._def,
            shape: () => n
        })
    }
    omit(t) {
        let n = {};
        return l.objectKeys(this.shape).forEach(e => {
            t[e] || (n[e] = this.shape[e])
        }), new e({ ...this._def,
            shape: () => n
        })
    }
    deepPartial() {
        return $e(this)
    }
    partial(t) {
        let n = {};
        return l.objectKeys(this.shape).forEach(e => {
            let r = this.shape[e];
            t && !t[e] ? n[e] = r : n[e] = r.optional()
        }), new e({ ...this._def,
            shape: () => n
        })
    }
    required(t) {
        let n = {};
        return l.objectKeys(this.shape).forEach(e => {
            if (t && !t[e]) n[e] = this.shape[e];
            else {
                let t = this.shape[e];
                for (; t instanceof w;) t = t._def.innerType;
                n[e] = t
            }
        }), new e({ ...this._def,
            shape: () => n
        })
    }
    keyof() {
        return ft(l.objectKeys(this.shape))
    }
};
S.create = (e, t) => new S({
    shape: () => e,
    unknownKeys: `strip`,
    catchall: x.create(),
    typeName: E.ZodObject,
    ...y(t)
}), S.strictCreate = (e, t) => new S({
    shape: () => e,
    unknownKeys: `strict`,
    catchall: x.create(),
    typeName: E.ZodObject,
    ...y(t)
}), S.lazycreate = (e, t) => new S({
    shape: e,
    unknownKeys: `strip`,
    catchall: x.create(),
    typeName: E.ZodObject,
    ...y(t)
});
var et = class extends b {
    _parse(e) {
        let {
            ctx: t
        } = this._processInputParams(e), n = this._def.options;

        function r(e) {
            for (let t of e)
                if (t.result.status === `valid`) return t.result;
            for (let n of e)
                if (n.result.status === `dirty`) return t.common.issues.push(...n.ctx.common.issues), n.result;
            let n = e.map(e => new f(e.ctx.common.issues));
            return p(t, {
                code: d.invalid_union,
                unionErrors: n
            }), h
        }
        if (t.common.async) return Promise.all(n.map(async e => {
            let n = { ...t,
                common: { ...t.common,
                    issues: []
                },
                parent: null
            };
            return {
                result: await e._parseAsync({
                    data: t.data,
                    path: t.path,
                    parent: n
                }),
                ctx: n
            }
        })).then(r); {
            let e, r = [];
            for (let i of n) {
                let n = { ...t,
                        common: { ...t.common,
                            issues: []
                        },
                        parent: null
                    },
                    a = i._parseSync({
                        data: t.data,
                        path: t.path,
                        parent: n
                    });
                if (a.status === `valid`) return a;
                a.status === `dirty` && !e && (e = {
                    result: a,
                    ctx: n
                }), n.common.issues.length && r.push(n.common.issues)
            }
            if (e) return t.common.issues.push(...e.ctx.common.issues), e.result;
            let i = r.map(e => new f(e));
            return p(t, {
                code: d.invalid_union,
                unionErrors: i
            }), h
        }
    }
    get options() {
        return this._def.options
    }
};
et.create = (e, t) => new et({
    options: e,
    typeName: E.ZodUnion,
    ...y(t)
});
var tt = e => e instanceof ut ? tt(e.schema) : e instanceof C ? tt(e.innerType()) : e instanceof dt ? [e.value] : e instanceof pt ? e.options : e instanceof mt ? l.objectValues(e.enum) : e instanceof gt ? tt(e._def.innerType) : e instanceof qe ? [void 0] : e instanceof Je ? [null] : e instanceof w ? [void 0, ...tt(e.unwrap())] : e instanceof T ? [null, ...tt(e.unwrap())] : e instanceof bt || e instanceof St ? tt(e.unwrap()) : e instanceof _t ? tt(e._def.innerType) : [],
    nt = class e extends b {
        _parse(e) {
            let {
                ctx: t
            } = this._processInputParams(e);
            if (t.parsedType !== u.object) return p(t, {
                code: d.invalid_type,
                expected: u.object,
                received: t.parsedType
            }), h;
            let n = this.discriminator,
                r = t.data[n],
                i = this.optionsMap.get(r);
            return i ? t.common.async ? i._parseAsync({
                data: t.data,
                path: t.path,
                parent: t
            }) : i._parseSync({
                data: t.data,
                path: t.path,
                parent: t
            }) : (p(t, {
                code: d.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [n]
            }), h)
        }
        get discriminator() {
            return this._def.discriminator
        }
        get options() {
            return this._def.options
        }
        get optionsMap() {
            return this._def.optionsMap
        }
        static create(t, n, r) {
            let i = new Map;
            for (let e of n) {
                let n = tt(e.shape[t]);
                if (!n.length) throw Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
                for (let r of n) {
                    if (i.has(r)) throw Error(`Discriminator property ${String(t)} has duplicate value ${String(r)}`);
                    i.set(r, e)
                }
            }
            return new e({
                typeName: E.ZodDiscriminatedUnion,
                discriminator: t,
                options: n,
                optionsMap: i,
                ...y(r)
            })
        }
    };

function rt(e, t) {
    let n = ie(e),
        r = ie(t);
    if (e === t) return {
        valid: !0,
        data: e
    };
    if (n === u.object && r === u.object) {
        let n = l.objectKeys(t),
            r = l.objectKeys(e).filter(e => n.indexOf(e) !== -1),
            i = { ...e,
                ...t
            };
        for (let n of r) {
            let r = rt(e[n], t[n]);
            if (!r.valid) return {
                valid: !1
            };
            i[n] = r.data
        }
        return {
            valid: !0,
            data: i
        }
    } else if (n === u.array && r === u.array) {
        if (e.length !== t.length) return {
            valid: !1
        };
        let n = [];
        for (let r = 0; r < e.length; r++) {
            let i = e[r],
                a = t[r],
                o = rt(i, a);
            if (!o.valid) return {
                valid: !1
            };
            n.push(o.data)
        }
        return {
            valid: !0,
            data: n
        }
    } else if (n === u.date && r === u.date && +e == +t) return {
        valid: !0,
        data: e
    };
    else return {
        valid: !1
    }
}
var it = class extends b {
    _parse(e) {
        let {
            status: t,
            ctx: n
        } = this._processInputParams(e), r = (e, r) => {
            if (pe(e) || pe(r)) return h;
            let i = rt(e.value, r.value);
            return i.valid ? ((me(e) || me(r)) && t.dirty(), {
                status: t.value,
                value: i.data
            }) : (p(n, {
                code: d.invalid_intersection_types
            }), h)
        };
        return n.common.async ? Promise.all([this._def.left._parseAsync({
            data: n.data,
            path: n.path,
            parent: n
        }), this._def.right._parseAsync({
            data: n.data,
            path: n.path,
            parent: n
        })]).then(([e, t]) => r(e, t)) : r(this._def.left._parseSync({
            data: n.data,
            path: n.path,
            parent: n
        }), this._def.right._parseSync({
            data: n.data,
            path: n.path,
            parent: n
        }))
    }
};
it.create = (e, t, n) => new it({
    left: e,
    right: t,
    typeName: E.ZodIntersection,
    ...y(n)
});
var at = class e extends b {
    _parse(e) {
        let {
            status: t,
            ctx: n
        } = this._processInputParams(e);
        if (n.parsedType !== u.array) return p(n, {
            code: d.invalid_type,
            expected: u.array,
            received: n.parsedType
        }), h;
        if (n.data.length < this._def.items.length) return p(n, {
            code: d.too_small,
            minimum: this._def.items.length,
            inclusive: !0,
            exact: !1,
            type: `array`
        }), h;
        !this._def.rest && n.data.length > this._def.items.length && (p(n, {
            code: d.too_big,
            maximum: this._def.items.length,
            inclusive: !0,
            exact: !1,
            type: `array`
        }), t.dirty());
        let r = [...n.data].map((e, t) => {
            let r = this._def.items[t] || this._def.rest;
            return r ? r._parse(new v(n, e, n.path, t)) : null
        }).filter(e => !!e);
        return n.common.async ? Promise.all(r).then(e => m.mergeArray(t, e)) : m.mergeArray(t, r)
    }
    get items() {
        return this._def.items
    }
    rest(t) {
        return new e({ ...this._def,
            rest: t
        })
    }
};
at.create = (e, t) => {
    if (!Array.isArray(e)) throw Error(`You must pass an array of schemas to z.tuple([ ... ])`);
    return new at({
        items: e,
        typeName: E.ZodTuple,
        rest: null,
        ...y(t)
    })
};
var ot = class e extends b {
        get keySchema() {
            return this._def.keyType
        }
        get valueSchema() {
            return this._def.valueType
        }
        _parse(e) {
            let {
                status: t,
                ctx: n
            } = this._processInputParams(e);
            if (n.parsedType !== u.object) return p(n, {
                code: d.invalid_type,
                expected: u.object,
                received: n.parsedType
            }), h;
            let r = [],
                i = this._def.keyType,
                a = this._def.valueType;
            for (let e in n.data) r.push({
                key: i._parse(new v(n, e, n.path, e)),
                value: a._parse(new v(n, n.data[e], n.path, e)),
                alwaysSet: e in n.data
            });
            return n.common.async ? m.mergeObjectAsync(t, r) : m.mergeObjectSync(t, r)
        }
        get element() {
            return this._def.valueType
        }
        static create(t, n, r) {
            return n instanceof b ? new e({
                keyType: t,
                valueType: n,
                typeName: E.ZodRecord,
                ...y(r)
            }) : new e({
                keyType: Be.create(),
                valueType: t,
                typeName: E.ZodRecord,
                ...y(n)
            })
        }
    },
    st = class extends b {
        get keySchema() {
            return this._def.keyType
        }
        get valueSchema() {
            return this._def.valueType
        }
        _parse(e) {
            let {
                status: t,
                ctx: n
            } = this._processInputParams(e);
            if (n.parsedType !== u.map) return p(n, {
                code: d.invalid_type,
                expected: u.map,
                received: n.parsedType
            }), h;
            let r = this._def.keyType,
                i = this._def.valueType,
                a = [...n.data.entries()].map(([e, t], a) => ({
                    key: r._parse(new v(n, e, n.path, [a, `key`])),
                    value: i._parse(new v(n, t, n.path, [a, `value`]))
                }));
            if (n.common.async) {
                let e = new Map;
                return Promise.resolve().then(async () => {
                    for (let n of a) {
                        let r = await n.key,
                            i = await n.value;
                        if (r.status === `aborted` || i.status === `aborted`) return h;
                        (r.status === `dirty` || i.status === `dirty`) && t.dirty(), e.set(r.value, i.value)
                    }
                    return {
                        status: t.value,
                        value: e
                    }
                })
            } else {
                let e = new Map;
                for (let n of a) {
                    let r = n.key,
                        i = n.value;
                    if (r.status === `aborted` || i.status === `aborted`) return h;
                    (r.status === `dirty` || i.status === `dirty`) && t.dirty(), e.set(r.value, i.value)
                }
                return {
                    status: t.value,
                    value: e
                }
            }
        }
    };
st.create = (e, t, n) => new st({
    valueType: t,
    keyType: e,
    typeName: E.ZodMap,
    ...y(n)
});
var ct = class e extends b {
    _parse(e) {
        let {
            status: t,
            ctx: n
        } = this._processInputParams(e);
        if (n.parsedType !== u.set) return p(n, {
            code: d.invalid_type,
            expected: u.set,
            received: n.parsedType
        }), h;
        let r = this._def;
        r.minSize !== null && n.data.size < r.minSize.value && (p(n, {
            code: d.too_small,
            minimum: r.minSize.value,
            type: `set`,
            inclusive: !0,
            exact: !1,
            message: r.minSize.message
        }), t.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (p(n, {
            code: d.too_big,
            maximum: r.maxSize.value,
            type: `set`,
            inclusive: !0,
            exact: !1,
            message: r.maxSize.message
        }), t.dirty());
        let i = this._def.valueType;

        function a(e) {
            let n = new Set;
            for (let r of e) {
                if (r.status === `aborted`) return h;
                r.status === `dirty` && t.dirty(), n.add(r.value)
            }
            return {
                status: t.value,
                value: n
            }
        }
        let o = [...n.data.values()].map((e, t) => i._parse(new v(n, e, n.path, t)));
        return n.common.async ? Promise.all(o).then(e => a(e)) : a(o)
    }
    min(t, n) {
        return new e({ ...this._def,
            minSize: {
                value: t,
                message: _.toString(n)
            }
        })
    }
    max(t, n) {
        return new e({ ...this._def,
            maxSize: {
                value: t,
                message: _.toString(n)
            }
        })
    }
    size(e, t) {
        return this.min(e, t).max(e, t)
    }
    nonempty(e) {
        return this.min(1, e)
    }
};
ct.create = (e, t) => new ct({
    valueType: e,
    minSize: null,
    maxSize: null,
    typeName: E.ZodSet,
    ...y(t)
});
var lt = class e extends b {
        constructor() {
            super(...arguments), this.validate = this.implement
        }
        _parse(e) {
            let {
                ctx: t
            } = this._processInputParams(e);
            if (t.parsedType !== u.function) return p(t, {
                code: d.invalid_type,
                expected: u.function,
                received: t.parsedType
            }), h;

            function n(e, n) {
                return ue({
                    data: e,
                    path: t.path,
                    errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, le(), oe].filter(e => !!e),
                    issueData: {
                        code: d.invalid_arguments,
                        argumentsError: n
                    }
                })
            }

            function r(e, n) {
                return ue({
                    data: e,
                    path: t.path,
                    errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, le(), oe].filter(e => !!e),
                    issueData: {
                        code: d.invalid_return_type,
                        returnTypeError: n
                    }
                })
            }
            let i = {
                    errorMap: t.common.contextualErrorMap
                },
                a = t.data;
            if (this._def.returns instanceof ht) {
                let e = this;
                return g(async function(...t) {
                    let o = new f([]),
                        s = await e._def.args.parseAsync(t, i).catch(e => {
                            throw o.addIssue(n(t, e)), o
                        }),
                        c = await Reflect.apply(a, this, s);
                    return await e._def.returns._def.type.parseAsync(c, i).catch(e => {
                        throw o.addIssue(r(c, e)), o
                    })
                })
            } else {
                let e = this;
                return g(function(...t) {
                    let o = e._def.args.safeParse(t, i);
                    if (!o.success) throw new f([n(t, o.error)]);
                    let s = Reflect.apply(a, this, o.data),
                        c = e._def.returns.safeParse(s, i);
                    if (!c.success) throw new f([r(s, c.error)]);
                    return c.data
                })
            }
        }
        parameters() {
            return this._def.args
        }
        returnType() {
            return this._def.returns
        }
        args(...t) {
            return new e({ ...this._def,
                args: at.create(t).rest(Xe.create())
            })
        }
        returns(t) {
            return new e({ ...this._def,
                returns: t
            })
        }
        implement(e) {
            return this.parse(e)
        }
        strictImplement(e) {
            return this.parse(e)
        }
        static create(t, n, r) {
            return new e({
                args: t || at.create([]).rest(Xe.create()),
                returns: n || Xe.create(),
                typeName: E.ZodFunction,
                ...y(r)
            })
        }
    },
    ut = class extends b {
        get schema() {
            return this._def.getter()
        }
        _parse(e) {
            let {
                ctx: t
            } = this._processInputParams(e);
            return this._def.getter()._parse({
                data: t.data,
                path: t.path,
                parent: t
            })
        }
    };
ut.create = (e, t) => new ut({
    getter: e,
    typeName: E.ZodLazy,
    ...y(t)
});
var dt = class extends b {
    _parse(e) {
        if (e.data !== this._def.value) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                received: t.data,
                code: d.invalid_literal,
                expected: this._def.value
            }), h
        }
        return {
            status: `valid`,
            value: e.data
        }
    }
    get value() {
        return this._def.value
    }
};
dt.create = (e, t) => new dt({
    value: e,
    typeName: E.ZodLiteral,
    ...y(t)
});

function ft(e, t) {
    return new pt({
        values: e,
        typeName: E.ZodEnum,
        ...y(t)
    })
}
var pt = class e extends b {
    constructor() {
        super(...arguments), ye.set(this, void 0)
    }
    _parse(e) {
        if (typeof e.data != `string`) {
            let t = this._getOrReturnCtx(e),
                n = this._def.values;
            return p(t, {
                expected: l.joinValues(n),
                received: t.parsedType,
                code: d.invalid_type
            }), h
        }
        if (_e(this, ye, `f`) || ve(this, ye, new Set(this._def.values), `f`), !_e(this, ye, `f`).has(e.data)) {
            let t = this._getOrReturnCtx(e),
                n = this._def.values;
            return p(t, {
                received: t.data,
                code: d.invalid_enum_value,
                options: n
            }), h
        }
        return g(e.data)
    }
    get options() {
        return this._def.values
    }
    get enum() {
        let e = {};
        for (let t of this._def.values) e[t] = t;
        return e
    }
    get Values() {
        let e = {};
        for (let t of this._def.values) e[t] = t;
        return e
    }
    get Enum() {
        let e = {};
        for (let t of this._def.values) e[t] = t;
        return e
    }
    extract(t, n = this._def) {
        return e.create(t, { ...this._def,
            ...n
        })
    }
    exclude(t, n = this._def) {
        return e.create(this.options.filter(e => !t.includes(e)), { ...this._def,
            ...n
        })
    }
};
ye = new WeakMap, pt.create = ft;
var mt = class extends b {
    constructor() {
        super(...arguments), be.set(this, void 0)
    }
    _parse(e) {
        let t = l.getValidEnumValues(this._def.values),
            n = this._getOrReturnCtx(e);
        if (n.parsedType !== u.string && n.parsedType !== u.number) {
            let e = l.objectValues(t);
            return p(n, {
                expected: l.joinValues(e),
                received: n.parsedType,
                code: d.invalid_type
            }), h
        }
        if (_e(this, be, `f`) || ve(this, be, new Set(l.getValidEnumValues(this._def.values)), `f`), !_e(this, be, `f`).has(e.data)) {
            let e = l.objectValues(t);
            return p(n, {
                received: n.data,
                code: d.invalid_enum_value,
                options: e
            }), h
        }
        return g(e.data)
    }
    get enum() {
        return this._def.values
    }
};
be = new WeakMap, mt.create = (e, t) => new mt({
    values: e,
    typeName: E.ZodNativeEnum,
    ...y(t)
});
var ht = class extends b {
    unwrap() {
        return this._def.type
    }
    _parse(e) {
        let {
            ctx: t
        } = this._processInputParams(e);
        return t.parsedType !== u.promise && t.common.async === !1 ? (p(t, {
            code: d.invalid_type,
            expected: u.promise,
            received: t.parsedType
        }), h) : g((t.parsedType === u.promise ? t.data : Promise.resolve(t.data)).then(e => this._def.type.parseAsync(e, {
            path: t.path,
            errorMap: t.common.contextualErrorMap
        })))
    }
};
ht.create = (e, t) => new ht({
    type: e,
    typeName: E.ZodPromise,
    ...y(t)
});
var C = class extends b {
    innerType() {
        return this._def.schema
    }
    sourceType() {
        return this._def.schema._def.typeName === E.ZodEffects ? this._def.schema.sourceType() : this._def.schema
    }
    _parse(e) {
        let {
            status: t,
            ctx: n
        } = this._processInputParams(e), r = this._def.effect || null, i = {
            addIssue: e => {
                p(n, e), e.fatal ? t.abort() : t.dirty()
            },
            get path() {
                return n.path
            }
        };
        if (i.addIssue = i.addIssue.bind(i), r.type === `preprocess`) {
            let e = r.transform(n.data, i);
            if (n.common.async) return Promise.resolve(e).then(async e => {
                if (t.value === `aborted`) return h;
                let r = await this._def.schema._parseAsync({
                    data: e,
                    path: n.path,
                    parent: n
                });
                return r.status === `aborted` ? h : r.status === `dirty` || t.value === `dirty` ? fe(r.value) : r
            }); {
                if (t.value === `aborted`) return h;
                let r = this._def.schema._parseSync({
                    data: e,
                    path: n.path,
                    parent: n
                });
                return r.status === `aborted` ? h : r.status === `dirty` || t.value === `dirty` ? fe(r.value) : r
            }
        }
        if (r.type === `refinement`) {
            let e = e => {
                let t = r.refinement(e, i);
                if (n.common.async) return Promise.resolve(t);
                if (t instanceof Promise) throw Error(`Async refinement encountered during synchronous parse operation. Use .parseAsync instead.`);
                return e
            };
            if (n.common.async === !1) {
                let r = this._def.schema._parseSync({
                    data: n.data,
                    path: n.path,
                    parent: n
                });
                return r.status === `aborted` ? h : (r.status === `dirty` && t.dirty(), e(r.value), {
                    status: t.value,
                    value: r.value
                })
            } else return this._def.schema._parseAsync({
                data: n.data,
                path: n.path,
                parent: n
            }).then(n => n.status === `aborted` ? h : (n.status === `dirty` && t.dirty(), e(n.value).then(() => ({
                status: t.value,
                value: n.value
            }))))
        }
        if (r.type === `transform`)
            if (n.common.async === !1) {
                let e = this._def.schema._parseSync({
                    data: n.data,
                    path: n.path,
                    parent: n
                });
                if (!he(e)) return e;
                let a = r.transform(e.value, i);
                if (a instanceof Promise) throw Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                return {
                    status: t.value,
                    value: a
                }
            } else return this._def.schema._parseAsync({
                data: n.data,
                path: n.path,
                parent: n
            }).then(e => he(e) ? Promise.resolve(r.transform(e.value, i)).then(e => ({
                status: t.value,
                value: e
            })) : e);
        l.assertNever(r)
    }
};
C.create = (e, t, n) => new C({
    schema: e,
    typeName: E.ZodEffects,
    effect: t,
    ...y(n)
}), C.createWithPreprocess = (e, t, n) => new C({
    schema: t,
    effect: {
        type: `preprocess`,
        transform: e
    },
    typeName: E.ZodEffects,
    ...y(n)
});
var w = class extends b {
    _parse(e) {
        return this._getType(e) === u.undefined ? g(void 0) : this._def.innerType._parse(e)
    }
    unwrap() {
        return this._def.innerType
    }
};
w.create = (e, t) => new w({
    innerType: e,
    typeName: E.ZodOptional,
    ...y(t)
});
var T = class extends b {
    _parse(e) {
        return this._getType(e) === u.null ? g(null) : this._def.innerType._parse(e)
    }
    unwrap() {
        return this._def.innerType
    }
};
T.create = (e, t) => new T({
    innerType: e,
    typeName: E.ZodNullable,
    ...y(t)
});
var gt = class extends b {
    _parse(e) {
        let {
            ctx: t
        } = this._processInputParams(e), n = t.data;
        return t.parsedType === u.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
            data: n,
            path: t.path,
            parent: t
        })
    }
    removeDefault() {
        return this._def.innerType
    }
};
gt.create = (e, t) => new gt({
    innerType: e,
    typeName: E.ZodDefault,
    defaultValue: typeof t.default == `function` ? t.default : () => t.default,
    ...y(t)
});
var _t = class extends b {
    _parse(e) {
        let {
            ctx: t
        } = this._processInputParams(e), n = { ...t,
            common: { ...t.common,
                issues: []
            }
        }, r = this._def.innerType._parse({
            data: n.data,
            path: n.path,
            parent: { ...n
            }
        });
        return ge(r) ? r.then(e => ({
            status: `valid`,
            value: e.status === `valid` ? e.value : this._def.catchValue({
                get error() {
                    return new f(n.common.issues)
                },
                input: n.data
            })
        })) : {
            status: `valid`,
            value: r.status === `valid` ? r.value : this._def.catchValue({
                get error() {
                    return new f(n.common.issues)
                },
                input: n.data
            })
        }
    }
    removeCatch() {
        return this._def.innerType
    }
};
_t.create = (e, t) => new _t({
    innerType: e,
    typeName: E.ZodCatch,
    catchValue: typeof t.catch == `function` ? t.catch : () => t.catch,
    ...y(t)
});
var vt = class extends b {
    _parse(e) {
        if (this._getType(e) !== u.nan) {
            let t = this._getOrReturnCtx(e);
            return p(t, {
                code: d.invalid_type,
                expected: u.nan,
                received: t.parsedType
            }), h
        }
        return {
            status: `valid`,
            value: e.data
        }
    }
};
vt.create = e => new vt({
    typeName: E.ZodNaN,
    ...y(e)
});
var yt = Symbol(`zod_brand`),
    bt = class extends b {
        _parse(e) {
            let {
                ctx: t
            } = this._processInputParams(e), n = t.data;
            return this._def.type._parse({
                data: n,
                path: t.path,
                parent: t
            })
        }
        unwrap() {
            return this._def.type
        }
    },
    xt = class e extends b {
        _parse(e) {
            let {
                status: t,
                ctx: n
            } = this._processInputParams(e);
            if (n.common.async) return (async () => {
                let e = await this._def.in._parseAsync({
                    data: n.data,
                    path: n.path,
                    parent: n
                });
                return e.status === `aborted` ? h : e.status === `dirty` ? (t.dirty(), fe(e.value)) : this._def.out._parseAsync({
                    data: e.value,
                    path: n.path,
                    parent: n
                })
            })(); {
                let e = this._def.in._parseSync({
                    data: n.data,
                    path: n.path,
                    parent: n
                });
                return e.status === `aborted` ? h : e.status === `dirty` ? (t.dirty(), {
                    status: `dirty`,
                    value: e.value
                }) : this._def.out._parseSync({
                    data: e.value,
                    path: n.path,
                    parent: n
                })
            }
        }
        static create(t, n) {
            return new e({ in: t,
                out: n,
                typeName: E.ZodPipeline
            })
        }
    },
    St = class extends b {
        _parse(e) {
            let t = this._def.innerType._parse(e),
                n = e => (he(e) && (e.value = Object.freeze(e.value)), e);
            return ge(t) ? t.then(e => n(e)) : n(t)
        }
        unwrap() {
            return this._def.innerType
        }
    };
St.create = (e, t) => new St({
    innerType: e,
    typeName: E.ZodReadonly,
    ...y(t)
});

function Ct(e, t = {}, n) {
    return e ? Ye.create().superRefine((r, i) => {
        if (!e(r)) {
            let e = typeof t == `function` ? t(r) : typeof t == `string` ? {
                    message: t
                } : t,
                a = e.fatal ?? n ?? !0,
                o = typeof e == `string` ? {
                    message: e
                } : e;
            i.addIssue({
                code: `custom`,
                ...o,
                fatal: a
            })
        }
    }) : Ye.create()
}
var wt = {
        object: S.lazycreate
    },
    E;
(function(e) {
    e.ZodString = `ZodString`, e.ZodNumber = `ZodNumber`, e.ZodNaN = `ZodNaN`, e.ZodBigInt = `ZodBigInt`, e.ZodBoolean = `ZodBoolean`, e.ZodDate = `ZodDate`, e.ZodSymbol = `ZodSymbol`, e.ZodUndefined = `ZodUndefined`, e.ZodNull = `ZodNull`, e.ZodAny = `ZodAny`, e.ZodUnknown = `ZodUnknown`, e.ZodNever = `ZodNever`, e.ZodVoid = `ZodVoid`, e.ZodArray = `ZodArray`, e.ZodObject = `ZodObject`, e.ZodUnion = `ZodUnion`, e.ZodDiscriminatedUnion = `ZodDiscriminatedUnion`, e.ZodIntersection = `ZodIntersection`, e.ZodTuple = `ZodTuple`, e.ZodRecord = `ZodRecord`, e.ZodMap = `ZodMap`, e.ZodSet = `ZodSet`, e.ZodFunction = `ZodFunction`, e.ZodLazy = `ZodLazy`, e.ZodLiteral = `ZodLiteral`, e.ZodEnum = `ZodEnum`, e.ZodEffects = `ZodEffects`, e.ZodNativeEnum = `ZodNativeEnum`, e.ZodOptional = `ZodOptional`, e.ZodNullable = `ZodNullable`, e.ZodDefault = `ZodDefault`, e.ZodCatch = `ZodCatch`, e.ZodPromise = `ZodPromise`, e.ZodBranded = `ZodBranded`, e.ZodPipeline = `ZodPipeline`, e.ZodReadonly = `ZodReadonly`
})(E ||= {});
var Tt = (e, t = {
        message: `Input not instance of ${e.name}`
    }) => Ct(t => t instanceof e, t),
    Et = Be.create,
    Dt = He.create,
    Ot = vt.create,
    kt = Ue.create,
    At = We.create,
    jt = Ge.create,
    Mt = Ke.create,
    Nt = qe.create,
    Pt = Je.create,
    Ft = Ye.create,
    It = Xe.create,
    Lt = x.create,
    Rt = Ze.create,
    zt = Qe.create,
    Bt = S.create,
    Vt = S.strictCreate,
    Ht = et.create,
    Ut = nt.create,
    Wt = it.create,
    Gt = at.create,
    Kt = ot.create,
    qt = st.create,
    Jt = ct.create,
    Yt = lt.create,
    Xt = ut.create,
    D = dt.create,
    Zt = pt.create,
    Qt = mt.create,
    $t = ht.create,
    en = C.create,
    tn = w.create,
    nn = T.create,
    rn = C.createWithPreprocess,
    an = xt.create,
    O = Object.freeze({
        __proto__: null,
        defaultErrorMap: oe,
        setErrorMap: ce,
        getErrorMap: le,
        makeIssue: ue,
        EMPTY_PATH: de,
        addIssueToContext: p,
        ParseStatus: m,
        INVALID: h,
        DIRTY: fe,
        OK: g,
        isAborted: pe,
        isDirty: me,
        isValid: he,
        isAsync: ge,
        get util() {
            return l
        },
        get objectUtil() {
            return re
        },
        ZodParsedType: u,
        getParsedType: ie,
        ZodType: b,
        datetimeRegex: Re,
        ZodString: Be,
        ZodNumber: He,
        ZodBigInt: Ue,
        ZodBoolean: We,
        ZodDate: Ge,
        ZodSymbol: Ke,
        ZodUndefined: qe,
        ZodNull: Je,
        ZodAny: Ye,
        ZodUnknown: Xe,
        ZodNever: x,
        ZodVoid: Ze,
        ZodArray: Qe,
        ZodObject: S,
        ZodUnion: et,
        ZodDiscriminatedUnion: nt,
        ZodIntersection: it,
        ZodTuple: at,
        ZodRecord: ot,
        ZodMap: st,
        ZodSet: ct,
        ZodFunction: lt,
        ZodLazy: ut,
        ZodLiteral: dt,
        ZodEnum: pt,
        ZodNativeEnum: mt,
        ZodPromise: ht,
        ZodEffects: C,
        ZodTransformer: C,
        ZodOptional: w,
        ZodNullable: T,
        ZodDefault: gt,
        ZodCatch: _t,
        ZodNaN: vt,
        BRAND: yt,
        ZodBranded: bt,
        ZodPipeline: xt,
        ZodReadonly: St,
        custom: Ct,
        Schema: b,
        ZodSchema: b,
        late: wt,
        get ZodFirstPartyTypeKind() {
            return E
        },
        coerce: {
            string: (e => Be.create({ ...e,
                coerce: !0
            })),
            number: (e => He.create({ ...e,
                coerce: !0
            })),
            boolean: (e => We.create({ ...e,
                coerce: !0
            })),
            bigint: (e => Ue.create({ ...e,
                coerce: !0
            })),
            date: (e => Ge.create({ ...e,
                coerce: !0
            }))
        },
        any: Ft,
        array: zt,
        bigint: kt,
        boolean: At,
        date: jt,
        discriminatedUnion: Ut,
        effect: en,
        enum: Zt,
        function: Yt,
        instanceof: Tt,
        intersection: Wt,
        lazy: Xt,
        literal: D,
        map: qt,
        nan: Ot,
        nativeEnum: Qt,
        never: Lt,
        null: Pt,
        nullable: nn,
        number: Dt,
        object: Bt,
        oboolean: () => At().optional(),
        onumber: () => Dt().optional(),
        optional: tn,
        ostring: () => Et().optional(),
        pipeline: an,
        preprocess: rn,
        promise: $t,
        record: Kt,
        set: Jt,
        strictObject: Vt,
        string: Et,
        symbol: Mt,
        transformer: en,
        tuple: Gt,
        undefined: Nt,
        union: Ht,
        unknown: It,
        void: Rt,
        NEVER: h,
        ZodIssueCode: d,
        quotelessJson: ae,
        ZodError: f
    });

function on(e) {
    return e instanceof Error ? !!(e instanceof f || e.constructor.name === `ZodError` || `issues` in e && Array.isArray(e.issues)) : !1
}
var sn = (e, t, n) => new Promise((r, i) => {
    var a = e => {
            try {
                s(n.next(e))
            } catch (e) {
                i(e)
            }
        },
        o = e => {
            try {
                s(n.throw(e))
            } catch (e) {
                i(e)
            }
        },
        s = e => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
    s((n = n.apply(e, t)).next())
});

function cn(e) {
    return sn(this, null, function*() {
        try {
            return {
                data: yield e, error: null
            }
        } catch (e) {
            return {
                data: null,
                error: e
            }
        }
    })
}

function ln(e) {
    try {
        return {
            data: e(),
            error: null
        }
    } catch (e) {
        return {
            data: null,
            error: e
        }
    }
}

function un(e) {
    try {
        return {
            data: e(),
            error: null
        }
    } catch (e) {
        return {
            data: null,
            error: e
        }
    }
}

function dn(e) {
    return e === void 0 ? `` : `${e.path.length>0?`"${e.path.join(`.`)}" `:``}${e.message.toLowerCase()}`
}

function fn(e, t, n) {
    let {
        fallback: r,
        migrate: i
    } = n ?? {}, {
        data: a,
        error: o
    } = un(() => JSON.parse(e));
    if (o) {
        if (r === void 0) throw Error(`Invalid JSON: ${o.message}`);
        return r
    }
    let s = t.safeParse(a);
    if (s.success) return s.data;
    if (i === void 0) throw Error(`JSON does not match schema: ${s.error.issues.map(dn).join(`, `)}`);
    let c = i(a, s.error.issues),
        ee = t.safeParse(c);
    if (!ee.success) {
        if (r === void 0) throw Error(`Migrated value does not match schema: ${ee.error.issues.map(dn).join(`, `)}`);
        return r
    }
    return ee.data
}
var pn = O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String)),
    mn = () => O.string().regex(/^[a-zA-Z0-9_]+$/);
mn(), mn().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);

function hn(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var gn = O.enum(`Roboto_Mono.Noto_Naskh_Arabic.Source_Code_Pro.IBM_Plex_Sans.Inconsolata.Fira_Code.JetBrains_Mono.Roboto.Montserrat.Titillium_Web.Lexend_Deca.Comic_Sans_MS.Oxygen.Nunito.Itim.Courier.Comfortaa.Coming_Soon.Atkinson_Hyperlegible.Lato.Lalezar.Boon.Open_Dyslexic.Ubuntu.Ubuntu_Mono.Georgia.Cascadia_Mono.IBM_Plex_Mono.Overpass_Mono.Hack.CommitMono.Mononoki.Parkinsans.Geist.Sarabun.Kanit.Geist_Mono.Iosevka.Proto.Adwaita_Mono.Inter_Tight.Space_Grotesk.Noto_Sans_Lao`.split(`.`), {
        errorMap: hn(`Must be a known font family`)
    }),
    _n = gn.or(O.string().max(50).regex(/^[a-zA-Z0-9_\-+.]+$/)),
    vn = O.enum(`english.english_1k.english_5k.english_10k.english_25k.english_450k.english_commonly_misspelled.english_contractions.english_doubleletter.english_shakespearean.english_old.english_medical.spanish.spanish_1k.spanish_10k.spanish_650k.french.french_1k.french_2k.french_10k.french_600k.french_bitoduc.nepali.nepali_1k.nepali_romanized.sanskrit.sanskrit_roman.santali.azerbaijani.azerbaijani_1k.arabic.arabic_10k.arabic_egypt.arabic_egypt_1k.arabic_morocco.malagasy.malagasy_1k.malay.malay_1k.mongolian.mongolian_10k.kannada.korean.korean_1k.korean_5k.khmer.chinese_simplified.chinese_simplified_1k.chinese_simplified_5k.chinese_simplified_10k.chinese_simplified_50k.chinese_traditional.chinese_traditional_1k.chinese_traditional_5k.chinese_traditional_10k.chinese_traditional_50k.russian.russian_1k.russian_5k.russian_10k.russian_25k.russian_50k.russian_375k.russian_contractions.russian_contractions_1k.russian_abbreviations.ukrainian.ukrainian_1k.ukrainian_10k.ukrainian_50k.ukrainian_endings.ukrainian_latynka.ukrainian_latynka_1k.ukrainian_latynka_10k.ukrainian_latynka_50k.ukrainian_latynka_endings.portuguese.portuguese_acentos_e_cedilha.portuguese_1k.portuguese_3k.portuguese_5k.portuguese_320k.portuguese_550k.indonesian.indonesian_1k.indonesian_10k.kurdish_central.kurdish_central_2k.kurdish_central_4k.german.german_1k.german_10k.german_250k.swiss_german.swiss_german_1k.swiss_german_2k.afrikaans.afrikaans_1k.afrikaans_10k.georgian.tamil.tamil_1k.tanglish.tamil_old.telugu.telugu_1k.greek.greek_1k.greek_5k.greek_10k.greek_25k.greek_koine.greeklish.greeklish_1k.greeklish_5k.greeklish_10k.greeklish_25k.turkish.turkish_1k.turkish_5k.irish.irish_1k.italian.italian_1k.italian_7k.italian_60k.italian_280k.friulian.latin.galician.thai.thai_1k.thai_5k.thai_10k.thai_20k.thai_50k.thai_60k.polish.polish_2k.polish_5k.polish_10k.polish_20k.polish_40k.polish_200k.czech.czech_1k.czech_10k.slovak.slovak_1k.slovak_10k.slovenian.slovenian_1k.slovenian_5k.croatian.croatian_1k.dutch.dutch_1k.dutch_10k.filipino.filipino_1k.danish.danish_1k.danish_10k.hungarian.hungarian_1k.hungarian_2k.norwegian_bokmal.norwegian_bokmal_1k.norwegian_bokmal_5k.norwegian_bokmal_10k.norwegian_bokmal_150k.norwegian_bokmal_600k.norwegian_nynorsk.norwegian_nynorsk_1k.norwegian_nynorsk_5k.norwegian_nynorsk_10k.norwegian_nynorsk_100k.norwegian_nynorsk_400k.hebrew.hebrew_1k.hebrew_5k.hebrew_10k.icelandic.icelandic_1k.romanian.romanian_1k.romanian_5k.romanian_10k.romanian_25k.romanian_50k.romanian_100k.romanian_200k.lorem_ipsum.finnish.finnish_1k.finnish_10k.estonian.estonian_1k.estonian_5k.estonian_10k.udmurt.welsh.welsh_1k.persian.persian_1k.persian_5k.persian_20k.persian_romanized.marathi.kazakh.kazakh_1k.vietnamese.vietnamese_1k.vietnamese_5k.jyutping.pinyin.pinyin_1k.pinyin_10k.hausa.hausa_1k.bemba.bemba_1k.bemba_10k.swedish.swedish_1k.swedish_diacritics.serbian_latin.serbian_latin_10k.serbian.serbian_10k.yoruba_1k.swahili_1k.maori_1k.catalan.catalan_1k.lojban_gismu.lojban_cmavo.lithuanian.lithuanian_1k.lithuanian_3k.bulgarian.bulgarian_1k.bulgarian_latin.bulgarian_latin_1k.bangla.bangla_letters.bangla_10k.bosnian.bosnian_4k.toki_pona.toki_pona_ku_suli.toki_pona_ku_lili.esperanto.esperanto_1k.esperanto_10k.esperanto_25k.esperanto_36k.esperanto_x_sistemo.esperanto_x_sistemo_1k.esperanto_x_sistemo_10k.esperanto_x_sistemo_25k.esperanto_x_sistemo_36k.esperanto_h_sistemo.esperanto_h_sistemo_1k.esperanto_h_sistemo_10k.esperanto_h_sistemo_25k.esperanto_h_sistemo_36k.kyrgyz.kyrgyz_1k.urdu.urdu_1k.urdu_5k.urdu_roman.urdish.albanian.albanian_1k.shona.shona_1k.armenian.armenian_1k.armenian_western.armenian_western_1k.myanmar_burmese.japanese_hiragana.japanese_katakana.japanese_romaji.japanese_romaji_1k.sinhala.latvian.latvian_1k.maltese.maltese_1k.twitch_emotes.git.pig_latin.hindi.hindi_1k.hinglish.gujarati.gujarati_1k.macedonian.macedonian_1k.macedonian_10k.macedonian_75k.belarusian.belarusian_1k.belarusian_5k.belarusian_10k.belarusian_25k.belarusian_50k.belarusian_100k.belarusian_lacinka.belarusian_lacinka_1k.tatar.tatar_1k.tatar_5k.tatar_9k.tatar_crimean.tatar_crimean_1k.tatar_crimean_5k.tatar_crimean_10k.tatar_crimean_15k.tatar_crimean_cyrillic.tatar_crimean_cyrillic_1k.tatar_crimean_cyrillic_5k.tatar_crimean_cyrillic_10k.tatar_crimean_cyrillic_15k.uzbek.uzbek_1k.uzbek_70k.malayalam.amharic.amharic_1k.amharic_5k.oromo.oromo_1k.oromo_5k.wordle.league_of_legends.wordle_1k.typing_of_the_dead.yiddish.frisian.frisian_1k.pashto.euskera.klingon.klingon_1k.quenya.occitan.occitan_1k.occitan_2k.occitan_5k.occitan_10k.bashkir.zulu.kabyle.kabyle_1k.kabyle_2k.kabyle_5k.kabyle_10k.hawaiian.hawaiian_1k.code_python.code_python_1k.code_python_2k.code_python_5k.code_fsharp.code_c.code_csharp.code_css.code_c++.code_dart.code_brainfck.code_javascript.code_javascript_1k.code_javascript_react.code_jule.code_julia.code_haskell.code_html.code_nim.code_nix.code_pascal.code_java.code_kotlin.code_go.code_rockstar.code_rust.code_ruby.code_r.code_r_2k.code_swift.code_scala.code_bash.code_powershell.code_lua.code_luau.code_latex.code_typst.code_matlab.code_sql.code_perl.code_php.code_vim.code_vimscript.code_opencl.code_visual_basic.code_arduino.code_systemverilog.code_elixir.code_gleam.code_zig.code_gdscript.code_gdscript_2.code_assembly.code_v.code_ook.code_typescript.code_ocaml.code_odin.xhosa.xhosa_3k.tibetan.tibetan_1k.code_cobol.code_clojure.code_common_lisp.code_erlang.docker_file.code_fortran.viossa.viossa_njutro.code_abap.code_abap_1k.code_yoptascript.code_cuda.kinyarwanda.pokemon_1k.kokanu.likanu.code_vhdl.lao.code_6502_assembly.english_legal.sindhi`.split(`.`), {
        errorMap: hn(`Must be a supported language`)
    });
O.object({
    name: vn,
    rightToLeft: O.boolean().optional(),
    noLazyMode: O.boolean().optional(),
    joiningScript: O.boolean().optional(),
    orderedByFrequency: O.boolean().optional(),
    words: O.array(O.string()).min(1),
    additionalAccents: O.array(O.tuple([O.string().min(1), O.string().min(1)])).optional(),
    bcp47: O.string().optional(),
    preferredFont: gn.optional(),
    originalPunctuation: O.boolean().optional()
}).strict();
var yn = O.enum([`normal`, `expert`, `master`]),
    bn = O.object({
        acc: O.number().nonnegative().max(100),
        consistency: O.number().nonnegative().max(100),
        difficulty: yn,
        lazyMode: O.boolean().optional(),
        language: vn,
        punctuation: O.boolean().optional(),
        numbers: O.boolean().optional(),
        raw: O.number().nonnegative(),
        wpm: O.number().nonnegative(),
        timestamp: O.number().nonnegative()
    }),
    xn = O.object({
        time: O.record(pn.describe(`Number of seconds as string`), O.array(bn)),
        words: O.record(pn.describe(`Number of words as string`), O.array(bn)),
        quote: O.record(pn, O.array(bn)),
        custom: O.record(O.literal(`custom`), O.array(bn)),
        zen: O.record(O.literal(`zen`), O.array(bn))
    });
O.union([O.literal(`10`), O.literal(`25`), O.literal(`50`), O.literal(`100`)]), O.union([O.literal(`15`), O.literal(`30`), O.literal(`60`), O.literal(`120`)]), O.union([O.literal(`short`), O.literal(`medium`), O.literal(`long`), O.literal(`thicc`)]);
var Sn = xn.keyof();
O.union([pn, D(`zen`), D(`custom`)], {
    errorMap: () => ({
        message: `Needs to be either a number, "zen" or "custom".`
    })
});
var Cn = O.enum(`8008.80s_after_dark.9009.aether.alduin.alpine.anti_hero.arch.aurora.beach.bento.bingsu.bliss.blue_dolphin.blueberry_dark.blueberry_light.botanical.bouquet.breeze.bushido.cafe.camping.carbon.catppuccin.chaos_theory.cheesecake.cherry_blossom.comfy.copper.creamsicle.cy_red.cyberspace.dark.dark_magic_girl.dark_note.darling.deku.desert_oasis.dev.diner.dino.discord.dmg.dollar.dots.dracula.drowning.dualshot.earthsong.everblush.evil_eye.ez_mode.fire.fledgling.fleuriste.floret.froyo.frozen_llama.fruit_chew.fundamentals.future_funk.github.godspeed.graen.grand_prix.grape.gruvbox_dark.gruvbox_light.hammerhead.hanok.hedge.honey.horizon.husqy.iceberg_dark.iceberg_light.incognito.ishtar.iv_clover.iv_spade.joker.laser.lavender.leather.lil_dragon.lilac_mist.lime.luna.macroblank.magic_girl.mashu.matcha_moccha.material.matrix.menthol.metaverse.metropolis.mexican.miami.miami_nights.midnight.milkshake.mint.mizu.modern_dolch.modern_dolch_light.modern_ink.monokai.moonlight.mountain.mr_sleeves.ms_cupcakes.muted.nautilus.nebula.night_runner.nord.nord_light.norse.oblivion.olive.olivia.onedark.our_theme.paper.passion_fruit.pastel.peach_blossom.peaches.phantom.pink_lemonade.pulse.purpleish.rainbow_trail.red_dragon.red_samurai.repose_dark.repose_light.retro.retrocast.rgb.rose_pine.rose_pine_dawn.rose_pine_moon.rudy.ryujinscales.serika.serika_dark.sewing_tin.sewing_tin_light.shadow.shoko.slambook.snes.soaring_skies.solarized_dark.solarized_light.solarized_osaka.sonokai.stealth.strawberry.striker.suisei.sunset.superuser.sweden.tangerine.taro.terminal.terra.terrazzo.terror_below.tiramisu.trackday.trance.tron_orange.vaporwave.vesper.vesper_light.viridescent.voc.vscode.watermelon.wavez.witch_girl.pale_nimbus.spiderman`.split(`.`), {
        errorMap: hn(`Must be a known theme`)
    }),
    wn = O.enum(`qwerty.dvorak.colemak.colemak_angle.colemak_wide.colemak_dh.colemak_dh_iso.colemak_dh_wide.colemak_dh_iso_wide.colemak_dhk.colemak_dh_matrix.colemak_dhk_iso.colemak_dhv.qwertz.swiss_german.swiss_french.workman.prog_workman.turkish_q.turkish_f.turkish_e.MTGAP_ASRT.norman.halmak.QGMLWB.QGMLWY.qwpr.uk_qwerty.spanish_qwerty.italian_qwerty.latam_qwerty.prog_dvorak.prog_dvorak_prime.german_dvorak.german_dvorak_imp.spanish_dvorak.swedish_colemak.swedish_dvorak.dvorak_L.dvorak_R.dvorak_fr.azerty.azerty_AFNOR.bepo.bepo_AFNOR.alpha.handsdown.hungarian.handsdown_alt.handsdown_promethium.handsdown_neu.handsdown_neu_inverted.typehack.MTGAP.MTGAP_full.ina.soul.niro.mongolian.JCUKEN.statica_3x5.Vestnik.Diktor.Diktor_VoronovMod.Redaktor.JUIYAF.Zubachev.ISRT.ISRT_Angle.colemak_Qix.colemak_Qi.colemaQ.colemaQ_F.engram.engrammer.semimak.semimak_jq.semimak_jqc.canary.canary_matrix.japanese_hiragana.boo.boo_mangle.APT.APT_angle.middlemak.middlemak-nh.hindi_inscript.thai_kedmanee.thai_pattachote.thai_manoonchai.persian_standard.persian_farsi.arabic_101.arabic_102.arabic_mac.hebrew.urdu_phonetic.brasileiro_nativo.Foalmak.quartz.arensito.ARTS.beakl_15.beakl_19.beakl_19_bis.capewell_dvorak.colman.heart.klauser.oneproduct.pine.pine_v4.real.rolll.stndc.three.uciea.asset.dwarf.flaw.whorf.whorf6.whorfmax.whorfmax_ortho.sertain.ctgap.octa8.polish_programmers.bulgarian.bulgarian_phonetic_traditional.belarusian.ukrainian.russian.neo.bone.AdNW.mine.noted.koy.3l.korean.ekverto_b.nerps.sturdy_angle_ansi.sturdy_angle_iso.sturdy_ortho.ABNT2.HiYou.xenia.xenia_alt.burmese.gallium.gallium_angle.gallium_v2.gallium_v2_matrix.gallium_nl.maya.gallaya_angle_ansi.gallaya_angle_iso.gallaya_matrix.nila.minimak_4k.minimak_8k.minimak_12k.optimot.norwegian_qwerty.portuguese_pt_qwerty_iso.portuguese_pt_qwerty_ansi.swedish_qwerty.danish_qwerty.noctum.graphite.graphite_angle.graphite_angle_vc.graphite_angle_kp.graphite_matrix.macedonian.UGJRMV.pashto.ORNATE.estonian.stronk.dhorf.gust.recurva.seht-drai.ints.rollla.wreathy.saiga.saiga-e.krai.mir.ergol.cascade.vylet.hyperroll.romak.scythe.inqwerted.rain.night.night_stic.whix2.haruka.kuntum.anishtro.Kuntem.kuntem-jq.BEAKL_Zi.snorkle.MALTRON.PRSTEN.RSTHD.dusk.zenith.focal.panini.panini_wide.ergopti.sword.opy.tarmak_1.tarmak_2.tarmak_3.tarmak_4.rulemak.persian_farsi_colemak.persian_standard_colemak.ergo_split46.tamil99.Gralmak.GralmakS.vitrimak.miligram.nokwts.vylet_v4.armenian_hm_qwerty`.split(`.`), {
        errorMap: hn(`Must be a supported layout`)
    }),
    k = O.array(O.string().length(1)).min(1).max(4),
    Tn = O.object({
        keymapShowTopRow: O.boolean(),
        matrixShowRightColumn: O.boolean().optional()
    }).strict(),
    En = Tn.extend({
        type: O.literal(`ansi`),
        keys: O.object({
            row1: O.array(k).length(13),
            row2: O.array(k).length(13),
            row3: O.array(k).length(11),
            row4: O.array(k).length(10),
            row5: O.array(k).min(1).max(2)
        }).strict()
    }).strict(),
    Dn = Tn.extend({
        type: O.literal(`iso`),
        keys: O.object({
            row1: O.array(k).length(13),
            row2: O.array(k).length(12),
            row3: O.array(k).length(12),
            row4: O.array(k).length(11),
            row5: O.array(k).min(1).max(2)
        }).strict()
    }).strict();
En.or(Dn);
var On = O.enum([`off`, `slow`, `medium`, `fast`]),
    kn = O.enum([`off`, `esc`, `tab`, `enter`]),
    An = O.union([O.literal(-3), O.literal(-2), O.literal(0), O.literal(1), O.literal(2), O.literal(3)]),
    jn = O.array(An).describe([`|value|description|
|-|-|`, `|-3|Favorite quotes|`, `|-2|Quote search|`, `|0|Short quotes|`, `|1|Medium quotes|`, `|2|Long quotes|`, `|3|Thicc quotes|`].join(`
`)),
    Mn = O.enum([`off`, `default`, `block`, `outline`, `underline`, `carrot`, `banana`, `monkey`]),
    Nn = O.enum([`off`, `on`, `max`]),
    Pn = O.enum([`off`, `below`, `replace`, `both`]),
    Fn = O.enum([`off`, `below`, `replace`]),
    In = O.enum([`off`, `bar`, `text`, `mini`, `flash_text`, `flash_mini`]),
    Ln = O.enum([`off`, `text`, `mini`]),
    Rn = O.enum([`off`, `on`, `fav`, `light`, `dark`, `custom`, `auto`]),
    zn = O.enum([`black`, `sub`, `text`, `main`]),
    Bn = O.enum([`0.25`, `0.5`, `0.75`, `1`]),
    Vn = O.enum([`off`, `word`, `letter`]),
    Hn = O.enum([`off`, `static`, `react`, `next`]),
    Un = O.enum([`staggered`, `alice`, `matrix`, `split`, `split_matrix`, `steno`, `steno_matrix`]),
    Wn = O.enum([`lowercase`, `uppercase`, `blank`, `dynamic`]),
    Gn = O.enum([`minimal`, `minimal_numrow`, `full`]),
    Kn = O.number().min(.5).max(3.5).step(.1),
    qn = O.enum([`manual`, `on`]),
    Jn = O.enum([`off`, `1`, `2`, `3`, `4`]),
    Yn = O.enum(`off.1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20.21.22.23.24.25.26`.split(`.`)),
    Xn = O.number().min(0).max(1),
    Zn = O.enum([`off`, `average`, `pb`, `tagPb`, `last`, `custom`, `daily`]),
    Qn = O.tuple([O.enum([`on`, `off`]), O.enum([`on`, `off`]), O.enum([`on`, `off`]), O.enum([`on`, `off`])]),
    $n = O.enum([`off`, `custom`]),
    er = O.enum([`off`, `letter`, `word`, `next_word`, `next_two_words`, `next_three_words`]),
    tr = O.enum([`keep`, `hide`, `fade`, `dots`]),
    nr = O.enum([`off`, `letter`, `word`]),
    rr = O.number().min(10).max(90),
    ir = O.enum([`wpm`, `cpm`, `wps`, `cps`, `wph`]),
    ar = O.enum([`off`, `result`, `on`, `sellout`]),
    or = O.enum([`off`, `custom`]),
    sr = O.enum([`off`, `typing`]),
    cr = O.enum([`off`, `on`, `keymap`]),
    lr = O.enum([`cover`, `contain`, `max`]),
    ur = O.tuple([O.number(), O.number(), O.number(), O.number()]),
    dr = O.array(wn).min(2).max(15),
    fr = O.array(vn).min(2),
    pr = O.enum([`off`, `1`, `2`, `3`, `4`]),
    mr = O.enum([`off`, `fixed`, `flex`]),
    hr = O.enum([`off`, `speed`, `acc`, `both`]),
    gr = O.boolean(),
    A = O.string().regex(/^#([\da-f]{3}){1,2}$/i),
    _r = yn,
    vr = O.tuple([A, A, A, A, A, A, A, A, A, A]),
    yr = Cn,
    br = O.array(yr),
    xr = O.enum(`58008.mirror.upside_down.nausea.round_round_baby.simon_says.tts.choo_choo.arrows.rAnDoMcAsE.sPoNgEcAsE.capitals.layout_mirror.layoutfluid.earthquake.space_balls.gibberish.ascii.specials.plus_zero.plus_one.plus_two.plus_three.read_ahead_easy.read_ahead.read_ahead_hard.memory.nospace.poetry.wikipedia.weakspot.pseudolang.IPv4.IPv6.binary.hexadecimal.zipf.morse.crt.backwards.ddoouubblleedd.instant_messaging.underscore_spaces.ALL_CAPS.polyglot.asl.rot13.no_quit`.split(`.`)),
    Sr = O.array(xr).max(15),
    Cr = O.number().nonnegative(),
    wr = O.number().nonnegative(),
    Tr = O.number().nonnegative().max(100),
    Er = O.number().nonnegative(),
    Dr = O.number().int().nonnegative(),
    Or = O.number().int().nonnegative(),
    kr = O.literal(`overrideSync`).or(wn),
    Ar = O.literal(`default`).or(wn),
    jr = O.number().positive(),
    Mr = O.number().min(20).max(1e3).or(O.literal(0)),
    Nr = O.string().url(`Needs to be an URI`).regex(/^(https|http):\/\/.*/, `Unsupported protocol`).regex(/^[^`'"]*$/, `May not contain quotes`).regex(/.+(\.png|\.gif|\.jpeg|\.jpg|\.webp)/gi, `Unsupported image format`).max(2048, `URL is too long`).or(O.literal(``)),
    Pr = O.enum([`off`, `1`, `3`, `5`, `10`]).describe(`How many seconds before the end of the test to play a warning sound.`),
    Fr = O.object({
        punctuation: O.boolean(),
        numbers: O.boolean(),
        words: Or,
        time: Dr,
        mode: Sn,
        quoteLength: jn,
        language: vn,
        burstHeatmap: O.boolean(),
        difficulty: _r,
        quickRestart: kn,
        repeatQuotes: sr,
        resultSaving: O.boolean(),
        blindMode: O.boolean(),
        alwaysShowWordsHistory: O.boolean(),
        singleListCommandLine: qn,
        minWpm: $n,
        minWpmCustomSpeed: wr,
        minAcc: or,
        minAccCustom: Tr,
        minBurst: mr,
        minBurstCustomSpeed: Er,
        britishEnglish: O.boolean(),
        funbox: Sr,
        customLayoutfluid: dr,
        customPolyglot: fr,
        freedomMode: O.boolean(),
        strictSpace: O.boolean(),
        oppositeShiftMode: cr,
        stopOnError: Vn,
        confidenceMode: Nn,
        quickEnd: O.boolean(),
        indicateTypos: Pn,
        compositionDisplay: Fn,
        hideExtraLetters: O.boolean(),
        lazyMode: O.boolean(),
        layout: Ar,
        codeUnindentOnBackspace: O.boolean(),
        soundVolume: Xn,
        playSoundOnClick: Yn,
        playSoundOnError: Jn,
        playTimeWarning: Pr,
        smoothCaret: On,
        caretStyle: Mn,
        paceCaret: Zn,
        paceCaretCustomSpeed: Cr,
        paceCaretStyle: Mn,
        repeatedPace: O.boolean(),
        timerStyle: In,
        liveSpeedStyle: Ln,
        liveAccStyle: Ln,
        liveBurstStyle: Ln,
        timerColor: zn,
        timerOpacity: Bn,
        highlightMode: er,
        typedEffect: tr,
        tapeMode: nr,
        tapeMargin: rr,
        smoothLineScroll: O.boolean(),
        showAllLines: O.boolean(),
        alwaysShowDecimalPlaces: O.boolean(),
        typingSpeedUnit: ir,
        startGraphsAtZero: O.boolean(),
        maxLineWidth: Mr,
        fontSize: jr,
        fontFamily: _n,
        keymapMode: Hn,
        keymapLayout: kr,
        keymapStyle: Un,
        keymapLegendStyle: Wn,
        keymapKeys: Gn,
        keymapSize: Kn,
        flipTestColors: O.boolean(),
        colorfulMode: O.boolean(),
        customBackground: Nr,
        customBackgroundSize: lr,
        customBackgroundFilter: ur,
        autoSwitchTheme: O.boolean(),
        themeLight: yr,
        themeDark: yr,
        randomTheme: Rn,
        favThemes: br,
        theme: yr,
        customTheme: O.boolean(),
        customThemeColors: vr,
        showKeyTips: O.boolean(),
        showOutOfFocusWarning: O.boolean(),
        capsLockWarning: O.boolean(),
        showAverage: hr,
        showPb: gr,
        accountChart: Qn,
        monkey: O.boolean(),
        monkeyPowerLevel: pr,
        ads: ar
    }).strict();
Fr.keyof();
var Ir = Fr.partial(),
    Lr = O.enum([`test`, `behavior`, `input`, `sound`, `caret`, `appearance`, `theme`, `hideElements`, `hidden`, `ads`]),
    Rr = e => typeof e ?.safeParse == `function`,
    zr = e => typeof e ?.passthrough == `function`,
    Br = (e, t) => zr(e) ? zr(t) ? e.merge(t) : e : zr(t) ? t : Object.assign({}, e, t);
O.object({
    name: O.literal(`ZodError`),
    issues: O.array(O.object({
        path: O.array(O.union([O.string(), O.number()])),
        message: O.string().optional(),
        code: O.nativeEnum(O.ZodIssueCode)
    }).catchall(O.any()))
});
var Vr = Symbol(`ContractNoBody`),
    Hr = e => `method` in e && `path` in e,
    Ur = (e, t) => Object.fromEntries(Object.entries(e).map(([e, n]) => Hr(n) ? [e, { ...n,
        path: t ?.pathPrefix ? t.pathPrefix + n.path : n.path,
        headers: Br(t ?.baseHeaders, n.headers),
        strictStatusCodes: n.strictStatusCodes ?? t ?.strictStatusCodes,
        validateResponseOnClient: n.validateResponseOnClient ?? t ?.validateResponseOnClient,
        responses: { ...t ?.commonResponses,
            ...n.responses
        },
        metadata: t ?.metadata ? { ...t ?.metadata,
            ...n.metadata ?? {}
        } : n.metadata
    }] : [e, Ur(n, t)])),
    Wr = Symbol(`ContractPlainType`),
    j = () => ({
        router: (e, t) => Ur(e, t),
        query: e => e,
        mutation: e => e,
        responses: e => e,
        response: () => Wr,
        body: () => Wr,
        type: () => Wr,
        otherResponse: ({
            contentType: e,
            body: t
        }) => ({
            contentType: e,
            body: t
        }),
        noBody: () => Vr
    }),
    Gr = ({
        path: e,
        params: t
    }) => {
        let n = t;
        return e.replace(/\/?:([^/?]+)\??/g, (e, t) => n[t] ? `${e.startsWith(`/`)?`/`:``}${n[t]}` : ``)
    },
    Kr = (e, t = !1) => {
        let n = t ? qr(e) : Jr(e);
        return n ?.length > 0 ? `?` + n : ``
    },
    qr = e => e ? Object.entries(e).filter(([, e]) => e !== void 0).map(([e, t]) => {
        let n;
        return n = typeof t == `string` && ![`true`, `false`, `null`].includes(t.trim()) && isNaN(Number(t)) ? t : JSON.stringify(t), `${encodeURIComponent(e)}=${encodeURIComponent(n)}`
    }).join(`&`) : ``,
    Jr = e => e ? Object.keys(e).flatMap(t => Yr(t, e[t])).map(([e, t]) => `${encodeURIComponent(e)}=${encodeURIComponent(t)}`).join(`&`) : ``,
    Yr = (e, t) => Array.isArray(t) ? t.flatMap((t, n) => Yr(`${e}[${n}]`, t)) : t instanceof Date ? [
        [`${e}`, t.toISOString()]
    ] : t === null ? [
        [`${e}`, ``]
    ] : t === void 0 ? [] : typeof t == `object` ? Object.keys(t).flatMap(n => Yr(`${e}[${n}]`, t[n])) : [
        [`${e}`, `${t}`]
    ],
    Xr = class extends Error {
        constructor(e, t) {
            let n = t.join(`,`);
            super(`Server returned unexpected response. Expected one of: ${n} got: ${e.status}`), this.response = e
        }
    },
    Zr = async ({
        route: e,
        path: t,
        method: n,
        headers: r,
        body: i,
        validateResponse: a,
        fetchOptions: o
    }) => {
        let s = await fetch(t, { ...o,
                method: n,
                headers: r,
                body: i
            }),
            c = s.headers.get(`content-type`);
        if (c ?.includes(`application/`) && c ?.includes(`json`)) {
            let t = {
                    status: s.status,
                    body: await s.json(),
                    headers: s.headers
                },
                n = e.responses[t.status];
            return (a ?? e.validateResponseOnClient) && Rr(n) ? { ...t,
                body: n.parse(t.body)
            } : t
        }
        return c ?.includes(`text/`) ? {
            status: s.status,
            body: await s.text(),
            headers: s.headers
        } : {
            status: s.status,
            body: await s.blob(),
            headers: s.headers
        }
    },
    Qr = e => {
        let t = new FormData,
            n = (e, n) => {
                n instanceof File ? t.append(e, n) : t.append(e, JSON.stringify(n))
            };
        return Object.entries(e).forEach(([e, t]) => {
            if (Array.isArray(t))
                for (let r of t) n(e, r);
            else n(e, t)
        }), t
    },
    $r = e => Object.fromEntries(Object.entries(e).map(([e, t]) => [e.toLowerCase(), t])),
    ei = e => {
        let {
            path: t,
            clientArgs: n,
            route: r,
            body: i,
            query: a,
            extraInputArgs: o,
            headers: s,
            fetchOptions: c
        } = e, ee = n.api || Zr, te = n.baseHeaders && Object.fromEntries(Object.entries(n.baseHeaders).map(([t, n]) => typeof n == `function` ? [t, n(e)] : [t, n])), ne = { ...te && $r(te),
            ...$r(s)
        };
        Object.keys(ne).forEach(e => {
            ne[e] === void 0 && delete ne[e]
        });
        let l = {
            route: r,
            path: t,
            method: r.method,
            headers: ne,
            body: void 0,
            rawBody: i,
            rawQuery: a,
            contentType: void 0,
            validateResponse: n.validateResponse,
            fetchOptions: { ...n.credentials && {
                    credentials: n.credentials
                },
                ...c
            },
            ...c ?.signal && {
                signal: c.signal
            },
            ...c ?.cache && {
                cache: c.cache
            },
            ...c && `next` in c && !!c ?.next && {
                next: c.next
            }
        };
        return r.method !== `GET` && (`contentType` in r && r.contentType === `multipart/form-data` ? l = { ...l,
            contentType: `multipart/form-data`,
            body: i instanceof FormData ? i : Qr(i)
        } : `contentType` in r && r.contentType === `application/x-www-form-urlencoded` ? l = { ...l,
            contentType: `application/x-www-form-urlencoded`,
            headers: {
                "content-type": `application/x-www-form-urlencoded`,
                ...l.headers
            },
            body: typeof i == `string` ? i : new URLSearchParams(i)
        } : i != null && (l = { ...l,
            contentType: `application/json`,
            headers: {
                "content-type": `application/json`,
                ...l.headers
            },
            body: JSON.stringify(i)
        })), ee({ ...l,
            ...o
        })
    },
    ti = (e, t, n) => {
        let {
            query: r,
            params: i,
            body: a,
            headers: o,
            extraHeaders: s,
            overrideClientOptions: c,
            fetchOptions: ee,
            cache: te,
            next: ne,
            ...l
        } = n || {}, re = { ...t,
            ...c
        };
        return {
            path: ni(r, re.baseUrl, i, e, !!re.jsonQuery),
            clientArgs: re,
            route: e,
            body: a,
            query: r,
            extraInputArgs: l,
            fetchOptions: { ...te && {
                    cache: te
                },
                ...ne && {
                    next: ne
                },
                ...ee
            },
            headers: { ...s,
                ...o
            }
        }
    },
    ni = (e, t, n, r, i) => `${t}${Gr({path:r.path,params:n})}${Kr(e,i)}`,
    ri = (e, t) => {
        let n = Object.keys(e.responses);
        return async r => {
            let i = await ei(ti(e, t, r));
            if (!t.throwOnUnknownStatus || n.includes(i.status.toString())) return i;
            throw new Xr(i, n)
        }
    },
    ii = (e, t) => Object.fromEntries(Object.entries(e).map(([e, n]) => Hr(n) ? [e, ri(n, t)] : [e, ii(n, t)])),
    ai = O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String)),
    oi = () => O.string().regex(/^[a-zA-Z0-9_]+$/),
    M = oi();
oi().max(50);
var si = O.string().nullable().optional().transform(e => e ?? void 0);
O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);
var ci = O.number().int().safe().nonnegative().default(0);
O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String));
var li = () => O.string().regex(/^[a-zA-Z0-9_]+$/),
    ui = () => O.string().regex(/^[0-9a-zA-Z_.-]+$/, `Only letters, numbers, underscores, dots and hyphens allowed`).regex(/^[^.].*$/, `Cannot start with a dot`),
    di = li();
li().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]), O.number().int().safe().nonnegative().default(0);
var fi = ui().max(20),
    pi = O.object({
        name: fi,
        enabled: O.boolean()
    }),
    mi = pi.extend({
        createdOn: O.number().min(0),
        modifiedOn: O.number().min(0),
        lastUsedOn: O.number().min(0).or(O.literal(-1))
    }),
    hi = O.record(di, mi),
    gi = O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String)),
    _i = () => O.string().regex(/^[a-zA-Z0-9_]+$/),
    vi = () => O.string().regex(/^[0-9a-zA-Z_-]+$/, `Only letters, numbers, underscores and hyphens allowed`).regex(/^[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*$/, `Separators cannot be at the start or end, or appear multiple times in a row`),
    yi = _i(),
    bi = _i().max(50);
O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);

function xi(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var Si = O.enum(`Roboto_Mono.Noto_Naskh_Arabic.Source_Code_Pro.IBM_Plex_Sans.Inconsolata.Fira_Code.JetBrains_Mono.Roboto.Montserrat.Titillium_Web.Lexend_Deca.Comic_Sans_MS.Oxygen.Nunito.Itim.Courier.Comfortaa.Coming_Soon.Atkinson_Hyperlegible.Lato.Lalezar.Boon.Open_Dyslexic.Ubuntu.Ubuntu_Mono.Georgia.Cascadia_Mono.IBM_Plex_Mono.Overpass_Mono.Hack.CommitMono.Mononoki.Parkinsans.Geist.Sarabun.Kanit.Geist_Mono.Iosevka.Proto.Adwaita_Mono.Inter_Tight.Space_Grotesk.Noto_Sans_Lao`.split(`.`), {
        errorMap: xi(`Must be a known font family`)
    }),
    Ci = Si.or(O.string().max(50).regex(/^[a-zA-Z0-9_\-+.]+$/)),
    wi = O.enum(`english.english_1k.english_5k.english_10k.english_25k.english_450k.english_commonly_misspelled.english_contractions.english_doubleletter.english_shakespearean.english_old.english_medical.spanish.spanish_1k.spanish_10k.spanish_650k.french.french_1k.french_2k.french_10k.french_600k.french_bitoduc.nepali.nepali_1k.nepali_romanized.sanskrit.sanskrit_roman.santali.azerbaijani.azerbaijani_1k.arabic.arabic_10k.arabic_egypt.arabic_egypt_1k.arabic_morocco.malagasy.malagasy_1k.malay.malay_1k.mongolian.mongolian_10k.kannada.korean.korean_1k.korean_5k.khmer.chinese_simplified.chinese_simplified_1k.chinese_simplified_5k.chinese_simplified_10k.chinese_simplified_50k.chinese_traditional.chinese_traditional_1k.chinese_traditional_5k.chinese_traditional_10k.chinese_traditional_50k.russian.russian_1k.russian_5k.russian_10k.russian_25k.russian_50k.russian_375k.russian_contractions.russian_contractions_1k.russian_abbreviations.ukrainian.ukrainian_1k.ukrainian_10k.ukrainian_50k.ukrainian_endings.ukrainian_latynka.ukrainian_latynka_1k.ukrainian_latynka_10k.ukrainian_latynka_50k.ukrainian_latynka_endings.portuguese.portuguese_acentos_e_cedilha.portuguese_1k.portuguese_3k.portuguese_5k.portuguese_320k.portuguese_550k.indonesian.indonesian_1k.indonesian_10k.kurdish_central.kurdish_central_2k.kurdish_central_4k.german.german_1k.german_10k.german_250k.swiss_german.swiss_german_1k.swiss_german_2k.afrikaans.afrikaans_1k.afrikaans_10k.georgian.tamil.tamil_1k.tanglish.tamil_old.telugu.telugu_1k.greek.greek_1k.greek_5k.greek_10k.greek_25k.greek_koine.greeklish.greeklish_1k.greeklish_5k.greeklish_10k.greeklish_25k.turkish.turkish_1k.turkish_5k.irish.irish_1k.italian.italian_1k.italian_7k.italian_60k.italian_280k.friulian.latin.galician.thai.thai_1k.thai_5k.thai_10k.thai_20k.thai_50k.thai_60k.polish.polish_2k.polish_5k.polish_10k.polish_20k.polish_40k.polish_200k.czech.czech_1k.czech_10k.slovak.slovak_1k.slovak_10k.slovenian.slovenian_1k.slovenian_5k.croatian.croatian_1k.dutch.dutch_1k.dutch_10k.filipino.filipino_1k.danish.danish_1k.danish_10k.hungarian.hungarian_1k.hungarian_2k.norwegian_bokmal.norwegian_bokmal_1k.norwegian_bokmal_5k.norwegian_bokmal_10k.norwegian_bokmal_150k.norwegian_bokmal_600k.norwegian_nynorsk.norwegian_nynorsk_1k.norwegian_nynorsk_5k.norwegian_nynorsk_10k.norwegian_nynorsk_100k.norwegian_nynorsk_400k.hebrew.hebrew_1k.hebrew_5k.hebrew_10k.icelandic.icelandic_1k.romanian.romanian_1k.romanian_5k.romanian_10k.romanian_25k.romanian_50k.romanian_100k.romanian_200k.lorem_ipsum.finnish.finnish_1k.finnish_10k.estonian.estonian_1k.estonian_5k.estonian_10k.udmurt.welsh.welsh_1k.persian.persian_1k.persian_5k.persian_20k.persian_romanized.marathi.kazakh.kazakh_1k.vietnamese.vietnamese_1k.vietnamese_5k.jyutping.pinyin.pinyin_1k.pinyin_10k.hausa.hausa_1k.bemba.bemba_1k.bemba_10k.swedish.swedish_1k.swedish_diacritics.serbian_latin.serbian_latin_10k.serbian.serbian_10k.yoruba_1k.swahili_1k.maori_1k.catalan.catalan_1k.lojban_gismu.lojban_cmavo.lithuanian.lithuanian_1k.lithuanian_3k.bulgarian.bulgarian_1k.bulgarian_latin.bulgarian_latin_1k.bangla.bangla_letters.bangla_10k.bosnian.bosnian_4k.toki_pona.toki_pona_ku_suli.toki_pona_ku_lili.esperanto.esperanto_1k.esperanto_10k.esperanto_25k.esperanto_36k.esperanto_x_sistemo.esperanto_x_sistemo_1k.esperanto_x_sistemo_10k.esperanto_x_sistemo_25k.esperanto_x_sistemo_36k.esperanto_h_sistemo.esperanto_h_sistemo_1k.esperanto_h_sistemo_10k.esperanto_h_sistemo_25k.esperanto_h_sistemo_36k.kyrgyz.kyrgyz_1k.urdu.urdu_1k.urdu_5k.urdu_roman.urdish.albanian.albanian_1k.shona.shona_1k.armenian.armenian_1k.armenian_western.armenian_western_1k.myanmar_burmese.japanese_hiragana.japanese_katakana.japanese_romaji.japanese_romaji_1k.sinhala.latvian.latvian_1k.maltese.maltese_1k.twitch_emotes.git.pig_latin.hindi.hindi_1k.hinglish.gujarati.gujarati_1k.macedonian.macedonian_1k.macedonian_10k.macedonian_75k.belarusian.belarusian_1k.belarusian_5k.belarusian_10k.belarusian_25k.belarusian_50k.belarusian_100k.belarusian_lacinka.belarusian_lacinka_1k.tatar.tatar_1k.tatar_5k.tatar_9k.tatar_crimean.tatar_crimean_1k.tatar_crimean_5k.tatar_crimean_10k.tatar_crimean_15k.tatar_crimean_cyrillic.tatar_crimean_cyrillic_1k.tatar_crimean_cyrillic_5k.tatar_crimean_cyrillic_10k.tatar_crimean_cyrillic_15k.uzbek.uzbek_1k.uzbek_70k.malayalam.amharic.amharic_1k.amharic_5k.oromo.oromo_1k.oromo_5k.wordle.league_of_legends.wordle_1k.typing_of_the_dead.yiddish.frisian.frisian_1k.pashto.euskera.klingon.klingon_1k.quenya.occitan.occitan_1k.occitan_2k.occitan_5k.occitan_10k.bashkir.zulu.kabyle.kabyle_1k.kabyle_2k.kabyle_5k.kabyle_10k.hawaiian.hawaiian_1k.code_python.code_python_1k.code_python_2k.code_python_5k.code_fsharp.code_c.code_csharp.code_css.code_c++.code_dart.code_brainfck.code_javascript.code_javascript_1k.code_javascript_react.code_jule.code_julia.code_haskell.code_html.code_nim.code_nix.code_pascal.code_java.code_kotlin.code_go.code_rockstar.code_rust.code_ruby.code_r.code_r_2k.code_swift.code_scala.code_bash.code_powershell.code_lua.code_luau.code_latex.code_typst.code_matlab.code_sql.code_perl.code_php.code_vim.code_vimscript.code_opencl.code_visual_basic.code_arduino.code_systemverilog.code_elixir.code_gleam.code_zig.code_gdscript.code_gdscript_2.code_assembly.code_v.code_ook.code_typescript.code_ocaml.code_odin.xhosa.xhosa_3k.tibetan.tibetan_1k.code_cobol.code_clojure.code_common_lisp.code_erlang.docker_file.code_fortran.viossa.viossa_njutro.code_abap.code_abap_1k.code_yoptascript.code_cuda.kinyarwanda.pokemon_1k.kokanu.likanu.code_vhdl.lao.code_6502_assembly.english_legal.sindhi`.split(`.`), {
        errorMap: xi(`Must be a supported language`)
    });
O.object({
    name: wi,
    rightToLeft: O.boolean().optional(),
    noLazyMode: O.boolean().optional(),
    joiningScript: O.boolean().optional(),
    orderedByFrequency: O.boolean().optional(),
    words: O.array(O.string()).min(1),
    additionalAccents: O.array(O.tuple([O.string().min(1), O.string().min(1)])).optional(),
    bcp47: O.string().optional(),
    preferredFont: Si.optional(),
    originalPunctuation: O.boolean().optional()
}).strict();
var Ti = O.enum([`normal`, `expert`, `master`]),
    Ei = O.object({
        acc: O.number().nonnegative().max(100),
        consistency: O.number().nonnegative().max(100),
        difficulty: Ti,
        lazyMode: O.boolean().optional(),
        language: wi,
        punctuation: O.boolean().optional(),
        numbers: O.boolean().optional(),
        raw: O.number().nonnegative(),
        wpm: O.number().nonnegative(),
        timestamp: O.number().nonnegative()
    }),
    Di = O.object({
        time: O.record(gi.describe(`Number of seconds as string`), O.array(Ei)),
        words: O.record(gi.describe(`Number of words as string`), O.array(Ei)),
        quote: O.record(gi, O.array(Ei)),
        custom: O.record(O.literal(`custom`), O.array(Ei)),
        zen: O.record(O.literal(`zen`), O.array(Ei))
    });
O.union([O.literal(`10`), O.literal(`25`), O.literal(`50`), O.literal(`100`)]), O.union([O.literal(`15`), O.literal(`30`), O.literal(`60`), O.literal(`120`)]), O.union([O.literal(`short`), O.literal(`medium`), O.literal(`long`), O.literal(`thicc`)]);
var Oi = Di.keyof();
O.union([gi, D(`zen`), D(`custom`)], {
    errorMap: () => ({
        message: `Needs to be either a number, "zen" or "custom".`
    })
});
var ki = O.enum(`8008.80s_after_dark.9009.aether.alduin.alpine.anti_hero.arch.aurora.beach.bento.bingsu.bliss.blue_dolphin.blueberry_dark.blueberry_light.botanical.bouquet.breeze.bushido.cafe.camping.carbon.catppuccin.chaos_theory.cheesecake.cherry_blossom.comfy.copper.creamsicle.cy_red.cyberspace.dark.dark_magic_girl.dark_note.darling.deku.desert_oasis.dev.diner.dino.discord.dmg.dollar.dots.dracula.drowning.dualshot.earthsong.everblush.evil_eye.ez_mode.fire.fledgling.fleuriste.floret.froyo.frozen_llama.fruit_chew.fundamentals.future_funk.github.godspeed.graen.grand_prix.grape.gruvbox_dark.gruvbox_light.hammerhead.hanok.hedge.honey.horizon.husqy.iceberg_dark.iceberg_light.incognito.ishtar.iv_clover.iv_spade.joker.laser.lavender.leather.lil_dragon.lilac_mist.lime.luna.macroblank.magic_girl.mashu.matcha_moccha.material.matrix.menthol.metaverse.metropolis.mexican.miami.miami_nights.midnight.milkshake.mint.mizu.modern_dolch.modern_dolch_light.modern_ink.monokai.moonlight.mountain.mr_sleeves.ms_cupcakes.muted.nautilus.nebula.night_runner.nord.nord_light.norse.oblivion.olive.olivia.onedark.our_theme.paper.passion_fruit.pastel.peach_blossom.peaches.phantom.pink_lemonade.pulse.purpleish.rainbow_trail.red_dragon.red_samurai.repose_dark.repose_light.retro.retrocast.rgb.rose_pine.rose_pine_dawn.rose_pine_moon.rudy.ryujinscales.serika.serika_dark.sewing_tin.sewing_tin_light.shadow.shoko.slambook.snes.soaring_skies.solarized_dark.solarized_light.solarized_osaka.sonokai.stealth.strawberry.striker.suisei.sunset.superuser.sweden.tangerine.taro.terminal.terra.terrazzo.terror_below.tiramisu.trackday.trance.tron_orange.vaporwave.vesper.vesper_light.viridescent.voc.vscode.watermelon.wavez.witch_girl.pale_nimbus.spiderman`.split(`.`), {
        errorMap: xi(`Must be a known theme`)
    }),
    Ai = O.enum(`qwerty.dvorak.colemak.colemak_angle.colemak_wide.colemak_dh.colemak_dh_iso.colemak_dh_wide.colemak_dh_iso_wide.colemak_dhk.colemak_dh_matrix.colemak_dhk_iso.colemak_dhv.qwertz.swiss_german.swiss_french.workman.prog_workman.turkish_q.turkish_f.turkish_e.MTGAP_ASRT.norman.halmak.QGMLWB.QGMLWY.qwpr.uk_qwerty.spanish_qwerty.italian_qwerty.latam_qwerty.prog_dvorak.prog_dvorak_prime.german_dvorak.german_dvorak_imp.spanish_dvorak.swedish_colemak.swedish_dvorak.dvorak_L.dvorak_R.dvorak_fr.azerty.azerty_AFNOR.bepo.bepo_AFNOR.alpha.handsdown.hungarian.handsdown_alt.handsdown_promethium.handsdown_neu.handsdown_neu_inverted.typehack.MTGAP.MTGAP_full.ina.soul.niro.mongolian.JCUKEN.statica_3x5.Vestnik.Diktor.Diktor_VoronovMod.Redaktor.JUIYAF.Zubachev.ISRT.ISRT_Angle.colemak_Qix.colemak_Qi.colemaQ.colemaQ_F.engram.engrammer.semimak.semimak_jq.semimak_jqc.canary.canary_matrix.japanese_hiragana.boo.boo_mangle.APT.APT_angle.middlemak.middlemak-nh.hindi_inscript.thai_kedmanee.thai_pattachote.thai_manoonchai.persian_standard.persian_farsi.arabic_101.arabic_102.arabic_mac.hebrew.urdu_phonetic.brasileiro_nativo.Foalmak.quartz.arensito.ARTS.beakl_15.beakl_19.beakl_19_bis.capewell_dvorak.colman.heart.klauser.oneproduct.pine.pine_v4.real.rolll.stndc.three.uciea.asset.dwarf.flaw.whorf.whorf6.whorfmax.whorfmax_ortho.sertain.ctgap.octa8.polish_programmers.bulgarian.bulgarian_phonetic_traditional.belarusian.ukrainian.russian.neo.bone.AdNW.mine.noted.koy.3l.korean.ekverto_b.nerps.sturdy_angle_ansi.sturdy_angle_iso.sturdy_ortho.ABNT2.HiYou.xenia.xenia_alt.burmese.gallium.gallium_angle.gallium_v2.gallium_v2_matrix.gallium_nl.maya.gallaya_angle_ansi.gallaya_angle_iso.gallaya_matrix.nila.minimak_4k.minimak_8k.minimak_12k.optimot.norwegian_qwerty.portuguese_pt_qwerty_iso.portuguese_pt_qwerty_ansi.swedish_qwerty.danish_qwerty.noctum.graphite.graphite_angle.graphite_angle_vc.graphite_angle_kp.graphite_matrix.macedonian.UGJRMV.pashto.ORNATE.estonian.stronk.dhorf.gust.recurva.seht-drai.ints.rollla.wreathy.saiga.saiga-e.krai.mir.ergol.cascade.vylet.hyperroll.romak.scythe.inqwerted.rain.night.night_stic.whix2.haruka.kuntum.anishtro.Kuntem.kuntem-jq.BEAKL_Zi.snorkle.MALTRON.PRSTEN.RSTHD.dusk.zenith.focal.panini.panini_wide.ergopti.sword.opy.tarmak_1.tarmak_2.tarmak_3.tarmak_4.rulemak.persian_farsi_colemak.persian_standard_colemak.ergo_split46.tamil99.Gralmak.GralmakS.vitrimak.miligram.nokwts.vylet_v4.armenian_hm_qwerty`.split(`.`), {
        errorMap: xi(`Must be a supported layout`)
    }),
    N = O.array(O.string().length(1)).min(1).max(4),
    ji = O.object({
        keymapShowTopRow: O.boolean(),
        matrixShowRightColumn: O.boolean().optional()
    }).strict(),
    Mi = ji.extend({
        type: O.literal(`ansi`),
        keys: O.object({
            row1: O.array(N).length(13),
            row2: O.array(N).length(13),
            row3: O.array(N).length(11),
            row4: O.array(N).length(10),
            row5: O.array(N).min(1).max(2)
        }).strict()
    }).strict(),
    Ni = ji.extend({
        type: O.literal(`iso`),
        keys: O.object({
            row1: O.array(N).length(13),
            row2: O.array(N).length(12),
            row3: O.array(N).length(12),
            row4: O.array(N).length(11),
            row5: O.array(N).min(1).max(2)
        }).strict()
    }).strict();
Mi.or(Ni);
var Pi = O.enum([`off`, `slow`, `medium`, `fast`]),
    Fi = O.enum([`off`, `esc`, `tab`, `enter`]),
    Ii = O.union([O.literal(-3), O.literal(-2), O.literal(0), O.literal(1), O.literal(2), O.literal(3)]),
    Li = O.array(Ii).describe([`|value|description|
|-|-|`, `|-3|Favorite quotes|`, `|-2|Quote search|`, `|0|Short quotes|`, `|1|Medium quotes|`, `|2|Long quotes|`, `|3|Thicc quotes|`].join(`
`)),
    Ri = O.enum([`off`, `default`, `block`, `outline`, `underline`, `carrot`, `banana`, `monkey`]),
    zi = O.enum([`off`, `on`, `max`]),
    Bi = O.enum([`off`, `below`, `replace`, `both`]),
    Vi = O.enum([`off`, `below`, `replace`]),
    Hi = O.enum([`off`, `bar`, `text`, `mini`, `flash_text`, `flash_mini`]),
    Ui = O.enum([`off`, `text`, `mini`]),
    Wi = O.enum([`off`, `on`, `fav`, `light`, `dark`, `custom`, `auto`]),
    Gi = O.enum([`black`, `sub`, `text`, `main`]),
    Ki = O.enum([`0.25`, `0.5`, `0.75`, `1`]),
    qi = O.enum([`off`, `word`, `letter`]),
    Ji = O.enum([`off`, `static`, `react`, `next`]),
    Yi = O.enum([`staggered`, `alice`, `matrix`, `split`, `split_matrix`, `steno`, `steno_matrix`]),
    Xi = O.enum([`lowercase`, `uppercase`, `blank`, `dynamic`]),
    Zi = O.enum([`minimal`, `minimal_numrow`, `full`]),
    Qi = O.number().min(.5).max(3.5).step(.1),
    $i = O.enum([`manual`, `on`]),
    ea = O.enum([`off`, `1`, `2`, `3`, `4`]),
    ta = O.enum(`off.1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20.21.22.23.24.25.26`.split(`.`)),
    na = O.number().min(0).max(1),
    ra = O.enum([`off`, `average`, `pb`, `tagPb`, `last`, `custom`, `daily`]),
    ia = O.tuple([O.enum([`on`, `off`]), O.enum([`on`, `off`]), O.enum([`on`, `off`]), O.enum([`on`, `off`])]),
    aa = O.enum([`off`, `custom`]),
    oa = O.enum([`off`, `letter`, `word`, `next_word`, `next_two_words`, `next_three_words`]),
    sa = O.enum([`keep`, `hide`, `fade`, `dots`]),
    ca = O.enum([`off`, `letter`, `word`]),
    la = O.number().min(10).max(90),
    ua = O.enum([`wpm`, `cpm`, `wps`, `cps`, `wph`]),
    da = O.enum([`off`, `result`, `on`, `sellout`]),
    fa = O.enum([`off`, `custom`]),
    pa = O.enum([`off`, `typing`]),
    ma = O.enum([`off`, `on`, `keymap`]),
    ha = O.enum([`cover`, `contain`, `max`]),
    ga = O.tuple([O.number(), O.number(), O.number(), O.number()]),
    _a = O.array(Ai).min(2).max(15),
    va = O.array(wi).min(2),
    ya = O.enum([`off`, `1`, `2`, `3`, `4`]),
    ba = O.enum([`off`, `fixed`, `flex`]),
    xa = O.enum([`off`, `speed`, `acc`, `both`]),
    Sa = O.boolean(),
    P = O.string().regex(/^#([\da-f]{3}){1,2}$/i),
    Ca = Ti,
    wa = O.tuple([P, P, P, P, P, P, P, P, P, P]),
    Ta = ki,
    Ea = O.array(Ta),
    Da = O.enum(`58008.mirror.upside_down.nausea.round_round_baby.simon_says.tts.choo_choo.arrows.rAnDoMcAsE.sPoNgEcAsE.capitals.layout_mirror.layoutfluid.earthquake.space_balls.gibberish.ascii.specials.plus_zero.plus_one.plus_two.plus_three.read_ahead_easy.read_ahead.read_ahead_hard.memory.nospace.poetry.wikipedia.weakspot.pseudolang.IPv4.IPv6.binary.hexadecimal.zipf.morse.crt.backwards.ddoouubblleedd.instant_messaging.underscore_spaces.ALL_CAPS.polyglot.asl.rot13.no_quit`.split(`.`)),
    Oa = O.array(Da).max(15),
    ka = O.number().nonnegative(),
    Aa = O.number().nonnegative(),
    ja = O.number().nonnegative().max(100),
    Ma = O.number().nonnegative(),
    Na = O.number().int().nonnegative(),
    Pa = O.number().int().nonnegative(),
    Fa = O.literal(`overrideSync`).or(Ai),
    Ia = O.literal(`default`).or(Ai),
    La = O.number().positive(),
    Ra = O.number().min(20).max(1e3).or(O.literal(0)),
    za = O.string().url(`Needs to be an URI`).regex(/^(https|http):\/\/.*/, `Unsupported protocol`).regex(/^[^`'"]*$/, `May not contain quotes`).regex(/.+(\.png|\.gif|\.jpeg|\.jpg|\.webp)/gi, `Unsupported image format`).max(2048, `URL is too long`).or(O.literal(``)),
    Ba = O.enum([`off`, `1`, `3`, `5`, `10`]).describe(`How many seconds before the end of the test to play a warning sound.`),
    Va = O.object({
        punctuation: O.boolean(),
        numbers: O.boolean(),
        words: Pa,
        time: Na,
        mode: Oi,
        quoteLength: Li,
        language: wi,
        burstHeatmap: O.boolean(),
        difficulty: Ca,
        quickRestart: Fi,
        repeatQuotes: pa,
        resultSaving: O.boolean(),
        blindMode: O.boolean(),
        alwaysShowWordsHistory: O.boolean(),
        singleListCommandLine: $i,
        minWpm: aa,
        minWpmCustomSpeed: Aa,
        minAcc: fa,
        minAccCustom: ja,
        minBurst: ba,
        minBurstCustomSpeed: Ma,
        britishEnglish: O.boolean(),
        funbox: Oa,
        customLayoutfluid: _a,
        customPolyglot: va,
        freedomMode: O.boolean(),
        strictSpace: O.boolean(),
        oppositeShiftMode: ma,
        stopOnError: qi,
        confidenceMode: zi,
        quickEnd: O.boolean(),
        indicateTypos: Bi,
        compositionDisplay: Vi,
        hideExtraLetters: O.boolean(),
        lazyMode: O.boolean(),
        layout: Ia,
        codeUnindentOnBackspace: O.boolean(),
        soundVolume: na,
        playSoundOnClick: ta,
        playSoundOnError: ea,
        playTimeWarning: Ba,
        smoothCaret: Pi,
        caretStyle: Ri,
        paceCaret: ra,
        paceCaretCustomSpeed: ka,
        paceCaretStyle: Ri,
        repeatedPace: O.boolean(),
        timerStyle: Hi,
        liveSpeedStyle: Ui,
        liveAccStyle: Ui,
        liveBurstStyle: Ui,
        timerColor: Gi,
        timerOpacity: Ki,
        highlightMode: oa,
        typedEffect: sa,
        tapeMode: ca,
        tapeMargin: la,
        smoothLineScroll: O.boolean(),
        showAllLines: O.boolean(),
        alwaysShowDecimalPlaces: O.boolean(),
        typingSpeedUnit: ua,
        startGraphsAtZero: O.boolean(),
        maxLineWidth: Ra,
        fontSize: La,
        fontFamily: Ci,
        keymapMode: Ji,
        keymapLayout: Fa,
        keymapStyle: Yi,
        keymapLegendStyle: Xi,
        keymapKeys: Zi,
        keymapSize: Qi,
        flipTestColors: O.boolean(),
        colorfulMode: O.boolean(),
        customBackground: za,
        customBackgroundSize: ha,
        customBackgroundFilter: ga,
        autoSwitchTheme: O.boolean(),
        themeLight: Ta,
        themeDark: Ta,
        randomTheme: Wi,
        favThemes: Ea,
        theme: Ta,
        customTheme: O.boolean(),
        customThemeColors: wa,
        showKeyTips: O.boolean(),
        showOutOfFocusWarning: O.boolean(),
        capsLockWarning: O.boolean(),
        showAverage: xa,
        showPb: Sa,
        accountChart: ia,
        monkey: O.boolean(),
        monkeyPowerLevel: ya,
        ads: da
    }).strict();
Va.keyof();
var Ha = Va.partial(),
    Ua = O.enum([`test`, `behavior`, `input`, `sound`, `caret`, `appearance`, `theme`, `hideElements`, `hidden`, `ads`]),
    Wa = vi().max(16).min(1);
O.enum([`full`, `partial`]);
var Ga = O.array(Ua).min(1).superRefine((e, t) => {
        Ua.options.forEach(n => {
            e.filter(e => e === n).length > 1 && t.addIssue({
                code: O.ZodIssueCode.custom,
                message: `No duplicates allowed.`
            })
        })
    }),
    Ka = O.object({
        _id: yi,
        name: Wa,
        settingGroups: Ga.nullable().optional(),
        config: Ha.extend({
            tags: O.array(bi).optional()
        })
    }),
    qa = Ka.partial({
        config: !0,
        settingGroups: !0
    });
O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String));
var Ja = () => O.string().regex(/^[a-zA-Z0-9_]+$/),
    Ya = Ja();
Ja().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]), O.number().int().safe().nonnegative().default(0);
var Xa = O.object({
        _id: Ya,
        message: O.string(),
        date: O.number().int().min(0).optional(),
        level: O.number().int().optional(),
        sticky: O.boolean().optional()
    }),
    Za = O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String)),
    Qa = () => O.string().regex(/^[a-zA-Z0-9_]+$/);
Qa(), Qa().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]), O.number().int().safe().nonnegative().default(0);
var $a = O.record(Za, O.number().int()),
    eo = O.object({
        timeTyping: O.number().nonnegative(),
        testsCompleted: O.number().int().nonnegative(),
        testsStarted: O.number().int().nonnegative()
    }),
    to = O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String)),
    no = () => O.string().regex(/^[a-zA-Z0-9_]+$/);
no(), no().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);

function ro(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var io = O.enum(`Roboto_Mono.Noto_Naskh_Arabic.Source_Code_Pro.IBM_Plex_Sans.Inconsolata.Fira_Code.JetBrains_Mono.Roboto.Montserrat.Titillium_Web.Lexend_Deca.Comic_Sans_MS.Oxygen.Nunito.Itim.Courier.Comfortaa.Coming_Soon.Atkinson_Hyperlegible.Lato.Lalezar.Boon.Open_Dyslexic.Ubuntu.Ubuntu_Mono.Georgia.Cascadia_Mono.IBM_Plex_Mono.Overpass_Mono.Hack.CommitMono.Mononoki.Parkinsans.Geist.Sarabun.Kanit.Geist_Mono.Iosevka.Proto.Adwaita_Mono.Inter_Tight.Space_Grotesk.Noto_Sans_Lao`.split(`.`), {
    errorMap: ro(`Must be a known font family`)
});
io.or(O.string().max(50).regex(/^[a-zA-Z0-9_\-+.]+$/));
var ao = O.enum(`english.english_1k.english_5k.english_10k.english_25k.english_450k.english_commonly_misspelled.english_contractions.english_doubleletter.english_shakespearean.english_old.english_medical.spanish.spanish_1k.spanish_10k.spanish_650k.french.french_1k.french_2k.french_10k.french_600k.french_bitoduc.nepali.nepali_1k.nepali_romanized.sanskrit.sanskrit_roman.santali.azerbaijani.azerbaijani_1k.arabic.arabic_10k.arabic_egypt.arabic_egypt_1k.arabic_morocco.malagasy.malagasy_1k.malay.malay_1k.mongolian.mongolian_10k.kannada.korean.korean_1k.korean_5k.khmer.chinese_simplified.chinese_simplified_1k.chinese_simplified_5k.chinese_simplified_10k.chinese_simplified_50k.chinese_traditional.chinese_traditional_1k.chinese_traditional_5k.chinese_traditional_10k.chinese_traditional_50k.russian.russian_1k.russian_5k.russian_10k.russian_25k.russian_50k.russian_375k.russian_contractions.russian_contractions_1k.russian_abbreviations.ukrainian.ukrainian_1k.ukrainian_10k.ukrainian_50k.ukrainian_endings.ukrainian_latynka.ukrainian_latynka_1k.ukrainian_latynka_10k.ukrainian_latynka_50k.ukrainian_latynka_endings.portuguese.portuguese_acentos_e_cedilha.portuguese_1k.portuguese_3k.portuguese_5k.portuguese_320k.portuguese_550k.indonesian.indonesian_1k.indonesian_10k.kurdish_central.kurdish_central_2k.kurdish_central_4k.german.german_1k.german_10k.german_250k.swiss_german.swiss_german_1k.swiss_german_2k.afrikaans.afrikaans_1k.afrikaans_10k.georgian.tamil.tamil_1k.tanglish.tamil_old.telugu.telugu_1k.greek.greek_1k.greek_5k.greek_10k.greek_25k.greek_koine.greeklish.greeklish_1k.greeklish_5k.greeklish_10k.greeklish_25k.turkish.turkish_1k.turkish_5k.irish.irish_1k.italian.italian_1k.italian_7k.italian_60k.italian_280k.friulian.latin.galician.thai.thai_1k.thai_5k.thai_10k.thai_20k.thai_50k.thai_60k.polish.polish_2k.polish_5k.polish_10k.polish_20k.polish_40k.polish_200k.czech.czech_1k.czech_10k.slovak.slovak_1k.slovak_10k.slovenian.slovenian_1k.slovenian_5k.croatian.croatian_1k.dutch.dutch_1k.dutch_10k.filipino.filipino_1k.danish.danish_1k.danish_10k.hungarian.hungarian_1k.hungarian_2k.norwegian_bokmal.norwegian_bokmal_1k.norwegian_bokmal_5k.norwegian_bokmal_10k.norwegian_bokmal_150k.norwegian_bokmal_600k.norwegian_nynorsk.norwegian_nynorsk_1k.norwegian_nynorsk_5k.norwegian_nynorsk_10k.norwegian_nynorsk_100k.norwegian_nynorsk_400k.hebrew.hebrew_1k.hebrew_5k.hebrew_10k.icelandic.icelandic_1k.romanian.romanian_1k.romanian_5k.romanian_10k.romanian_25k.romanian_50k.romanian_100k.romanian_200k.lorem_ipsum.finnish.finnish_1k.finnish_10k.estonian.estonian_1k.estonian_5k.estonian_10k.udmurt.welsh.welsh_1k.persian.persian_1k.persian_5k.persian_20k.persian_romanized.marathi.kazakh.kazakh_1k.vietnamese.vietnamese_1k.vietnamese_5k.jyutping.pinyin.pinyin_1k.pinyin_10k.hausa.hausa_1k.bemba.bemba_1k.bemba_10k.swedish.swedish_1k.swedish_diacritics.serbian_latin.serbian_latin_10k.serbian.serbian_10k.yoruba_1k.swahili_1k.maori_1k.catalan.catalan_1k.lojban_gismu.lojban_cmavo.lithuanian.lithuanian_1k.lithuanian_3k.bulgarian.bulgarian_1k.bulgarian_latin.bulgarian_latin_1k.bangla.bangla_letters.bangla_10k.bosnian.bosnian_4k.toki_pona.toki_pona_ku_suli.toki_pona_ku_lili.esperanto.esperanto_1k.esperanto_10k.esperanto_25k.esperanto_36k.esperanto_x_sistemo.esperanto_x_sistemo_1k.esperanto_x_sistemo_10k.esperanto_x_sistemo_25k.esperanto_x_sistemo_36k.esperanto_h_sistemo.esperanto_h_sistemo_1k.esperanto_h_sistemo_10k.esperanto_h_sistemo_25k.esperanto_h_sistemo_36k.kyrgyz.kyrgyz_1k.urdu.urdu_1k.urdu_5k.urdu_roman.urdish.albanian.albanian_1k.shona.shona_1k.armenian.armenian_1k.armenian_western.armenian_western_1k.myanmar_burmese.japanese_hiragana.japanese_katakana.japanese_romaji.japanese_romaji_1k.sinhala.latvian.latvian_1k.maltese.maltese_1k.twitch_emotes.git.pig_latin.hindi.hindi_1k.hinglish.gujarati.gujarati_1k.macedonian.macedonian_1k.macedonian_10k.macedonian_75k.belarusian.belarusian_1k.belarusian_5k.belarusian_10k.belarusian_25k.belarusian_50k.belarusian_100k.belarusian_lacinka.belarusian_lacinka_1k.tatar.tatar_1k.tatar_5k.tatar_9k.tatar_crimean.tatar_crimean_1k.tatar_crimean_5k.tatar_crimean_10k.tatar_crimean_15k.tatar_crimean_cyrillic.tatar_crimean_cyrillic_1k.tatar_crimean_cyrillic_5k.tatar_crimean_cyrillic_10k.tatar_crimean_cyrillic_15k.uzbek.uzbek_1k.uzbek_70k.malayalam.amharic.amharic_1k.amharic_5k.oromo.oromo_1k.oromo_5k.wordle.league_of_legends.wordle_1k.typing_of_the_dead.yiddish.frisian.frisian_1k.pashto.euskera.klingon.klingon_1k.quenya.occitan.occitan_1k.occitan_2k.occitan_5k.occitan_10k.bashkir.zulu.kabyle.kabyle_1k.kabyle_2k.kabyle_5k.kabyle_10k.hawaiian.hawaiian_1k.code_python.code_python_1k.code_python_2k.code_python_5k.code_fsharp.code_c.code_csharp.code_css.code_c++.code_dart.code_brainfck.code_javascript.code_javascript_1k.code_javascript_react.code_jule.code_julia.code_haskell.code_html.code_nim.code_nix.code_pascal.code_java.code_kotlin.code_go.code_rockstar.code_rust.code_ruby.code_r.code_r_2k.code_swift.code_scala.code_bash.code_powershell.code_lua.code_luau.code_latex.code_typst.code_matlab.code_sql.code_perl.code_php.code_vim.code_vimscript.code_opencl.code_visual_basic.code_arduino.code_systemverilog.code_elixir.code_gleam.code_zig.code_gdscript.code_gdscript_2.code_assembly.code_v.code_ook.code_typescript.code_ocaml.code_odin.xhosa.xhosa_3k.tibetan.tibetan_1k.code_cobol.code_clojure.code_common_lisp.code_erlang.docker_file.code_fortran.viossa.viossa_njutro.code_abap.code_abap_1k.code_yoptascript.code_cuda.kinyarwanda.pokemon_1k.kokanu.likanu.code_vhdl.lao.code_6502_assembly.english_legal.sindhi`.split(`.`), {
    errorMap: ro(`Must be a supported language`)
});
O.object({
    name: ao,
    rightToLeft: O.boolean().optional(),
    noLazyMode: O.boolean().optional(),
    joiningScript: O.boolean().optional(),
    orderedByFrequency: O.boolean().optional(),
    words: O.array(O.string()).min(1),
    additionalAccents: O.array(O.tuple([O.string().min(1), O.string().min(1)])).optional(),
    bcp47: O.string().optional(),
    preferredFont: io.optional(),
    originalPunctuation: O.boolean().optional()
}).strict();
var oo = O.enum([`normal`, `expert`, `master`]),
    so = O.object({
        acc: O.number().nonnegative().max(100),
        consistency: O.number().nonnegative().max(100),
        difficulty: oo,
        lazyMode: O.boolean().optional(),
        language: ao,
        punctuation: O.boolean().optional(),
        numbers: O.boolean().optional(),
        raw: O.number().nonnegative(),
        wpm: O.number().nonnegative(),
        timestamp: O.number().nonnegative()
    }),
    co = O.object({
        time: O.record(to.describe(`Number of seconds as string`), O.array(so)),
        words: O.record(to.describe(`Number of words as string`), O.array(so)),
        quote: O.record(to, O.array(so)),
        custom: O.record(O.literal(`custom`), O.array(so)),
        zen: O.record(O.literal(`zen`), O.array(so))
    });
O.union([O.literal(`10`), O.literal(`25`), O.literal(`50`), O.literal(`100`)]), O.union([O.literal(`15`), O.literal(`30`), O.literal(`60`), O.literal(`120`)]), O.union([O.literal(`short`), O.literal(`medium`), O.literal(`long`), O.literal(`thicc`)]);
var lo = co.keyof(),
    uo = O.union([to, D(`zen`), D(`custom`)], {
        errorMap: () => ({
            message: `Needs to be either a number, "zen" or "custom".`
        })
    });
O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String));
var fo = () => O.string().regex(/^[a-zA-Z0-9_]+$/);
fo(), fo().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);

function po(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var mo = O.enum(`Roboto_Mono.Noto_Naskh_Arabic.Source_Code_Pro.IBM_Plex_Sans.Inconsolata.Fira_Code.JetBrains_Mono.Roboto.Montserrat.Titillium_Web.Lexend_Deca.Comic_Sans_MS.Oxygen.Nunito.Itim.Courier.Comfortaa.Coming_Soon.Atkinson_Hyperlegible.Lato.Lalezar.Boon.Open_Dyslexic.Ubuntu.Ubuntu_Mono.Georgia.Cascadia_Mono.IBM_Plex_Mono.Overpass_Mono.Hack.CommitMono.Mononoki.Parkinsans.Geist.Sarabun.Kanit.Geist_Mono.Iosevka.Proto.Adwaita_Mono.Inter_Tight.Space_Grotesk.Noto_Sans_Lao`.split(`.`), {
    errorMap: po(`Must be a known font family`)
});
mo.or(O.string().max(50).regex(/^[a-zA-Z0-9_\-+.]+$/));
var F = O.enum(`english.english_1k.english_5k.english_10k.english_25k.english_450k.english_commonly_misspelled.english_contractions.english_doubleletter.english_shakespearean.english_old.english_medical.spanish.spanish_1k.spanish_10k.spanish_650k.french.french_1k.french_2k.french_10k.french_600k.french_bitoduc.nepali.nepali_1k.nepali_romanized.sanskrit.sanskrit_roman.santali.azerbaijani.azerbaijani_1k.arabic.arabic_10k.arabic_egypt.arabic_egypt_1k.arabic_morocco.malagasy.malagasy_1k.malay.malay_1k.mongolian.mongolian_10k.kannada.korean.korean_1k.korean_5k.khmer.chinese_simplified.chinese_simplified_1k.chinese_simplified_5k.chinese_simplified_10k.chinese_simplified_50k.chinese_traditional.chinese_traditional_1k.chinese_traditional_5k.chinese_traditional_10k.chinese_traditional_50k.russian.russian_1k.russian_5k.russian_10k.russian_25k.russian_50k.russian_375k.russian_contractions.russian_contractions_1k.russian_abbreviations.ukrainian.ukrainian_1k.ukrainian_10k.ukrainian_50k.ukrainian_endings.ukrainian_latynka.ukrainian_latynka_1k.ukrainian_latynka_10k.ukrainian_latynka_50k.ukrainian_latynka_endings.portuguese.portuguese_acentos_e_cedilha.portuguese_1k.portuguese_3k.portuguese_5k.portuguese_320k.portuguese_550k.indonesian.indonesian_1k.indonesian_10k.kurdish_central.kurdish_central_2k.kurdish_central_4k.german.german_1k.german_10k.german_250k.swiss_german.swiss_german_1k.swiss_german_2k.afrikaans.afrikaans_1k.afrikaans_10k.georgian.tamil.tamil_1k.tanglish.tamil_old.telugu.telugu_1k.greek.greek_1k.greek_5k.greek_10k.greek_25k.greek_koine.greeklish.greeklish_1k.greeklish_5k.greeklish_10k.greeklish_25k.turkish.turkish_1k.turkish_5k.irish.irish_1k.italian.italian_1k.italian_7k.italian_60k.italian_280k.friulian.latin.galician.thai.thai_1k.thai_5k.thai_10k.thai_20k.thai_50k.thai_60k.polish.polish_2k.polish_5k.polish_10k.polish_20k.polish_40k.polish_200k.czech.czech_1k.czech_10k.slovak.slovak_1k.slovak_10k.slovenian.slovenian_1k.slovenian_5k.croatian.croatian_1k.dutch.dutch_1k.dutch_10k.filipino.filipino_1k.danish.danish_1k.danish_10k.hungarian.hungarian_1k.hungarian_2k.norwegian_bokmal.norwegian_bokmal_1k.norwegian_bokmal_5k.norwegian_bokmal_10k.norwegian_bokmal_150k.norwegian_bokmal_600k.norwegian_nynorsk.norwegian_nynorsk_1k.norwegian_nynorsk_5k.norwegian_nynorsk_10k.norwegian_nynorsk_100k.norwegian_nynorsk_400k.hebrew.hebrew_1k.hebrew_5k.hebrew_10k.icelandic.icelandic_1k.romanian.romanian_1k.romanian_5k.romanian_10k.romanian_25k.romanian_50k.romanian_100k.romanian_200k.lorem_ipsum.finnish.finnish_1k.finnish_10k.estonian.estonian_1k.estonian_5k.estonian_10k.udmurt.welsh.welsh_1k.persian.persian_1k.persian_5k.persian_20k.persian_romanized.marathi.kazakh.kazakh_1k.vietnamese.vietnamese_1k.vietnamese_5k.jyutping.pinyin.pinyin_1k.pinyin_10k.hausa.hausa_1k.bemba.bemba_1k.bemba_10k.swedish.swedish_1k.swedish_diacritics.serbian_latin.serbian_latin_10k.serbian.serbian_10k.yoruba_1k.swahili_1k.maori_1k.catalan.catalan_1k.lojban_gismu.lojban_cmavo.lithuanian.lithuanian_1k.lithuanian_3k.bulgarian.bulgarian_1k.bulgarian_latin.bulgarian_latin_1k.bangla.bangla_letters.bangla_10k.bosnian.bosnian_4k.toki_pona.toki_pona_ku_suli.toki_pona_ku_lili.esperanto.esperanto_1k.esperanto_10k.esperanto_25k.esperanto_36k.esperanto_x_sistemo.esperanto_x_sistemo_1k.esperanto_x_sistemo_10k.esperanto_x_sistemo_25k.esperanto_x_sistemo_36k.esperanto_h_sistemo.esperanto_h_sistemo_1k.esperanto_h_sistemo_10k.esperanto_h_sistemo_25k.esperanto_h_sistemo_36k.kyrgyz.kyrgyz_1k.urdu.urdu_1k.urdu_5k.urdu_roman.urdish.albanian.albanian_1k.shona.shona_1k.armenian.armenian_1k.armenian_western.armenian_western_1k.myanmar_burmese.japanese_hiragana.japanese_katakana.japanese_romaji.japanese_romaji_1k.sinhala.latvian.latvian_1k.maltese.maltese_1k.twitch_emotes.git.pig_latin.hindi.hindi_1k.hinglish.gujarati.gujarati_1k.macedonian.macedonian_1k.macedonian_10k.macedonian_75k.belarusian.belarusian_1k.belarusian_5k.belarusian_10k.belarusian_25k.belarusian_50k.belarusian_100k.belarusian_lacinka.belarusian_lacinka_1k.tatar.tatar_1k.tatar_5k.tatar_9k.tatar_crimean.tatar_crimean_1k.tatar_crimean_5k.tatar_crimean_10k.tatar_crimean_15k.tatar_crimean_cyrillic.tatar_crimean_cyrillic_1k.tatar_crimean_cyrillic_5k.tatar_crimean_cyrillic_10k.tatar_crimean_cyrillic_15k.uzbek.uzbek_1k.uzbek_70k.malayalam.amharic.amharic_1k.amharic_5k.oromo.oromo_1k.oromo_5k.wordle.league_of_legends.wordle_1k.typing_of_the_dead.yiddish.frisian.frisian_1k.pashto.euskera.klingon.klingon_1k.quenya.occitan.occitan_1k.occitan_2k.occitan_5k.occitan_10k.bashkir.zulu.kabyle.kabyle_1k.kabyle_2k.kabyle_5k.kabyle_10k.hawaiian.hawaiian_1k.code_python.code_python_1k.code_python_2k.code_python_5k.code_fsharp.code_c.code_csharp.code_css.code_c++.code_dart.code_brainfck.code_javascript.code_javascript_1k.code_javascript_react.code_jule.code_julia.code_haskell.code_html.code_nim.code_nix.code_pascal.code_java.code_kotlin.code_go.code_rockstar.code_rust.code_ruby.code_r.code_r_2k.code_swift.code_scala.code_bash.code_powershell.code_lua.code_luau.code_latex.code_typst.code_matlab.code_sql.code_perl.code_php.code_vim.code_vimscript.code_opencl.code_visual_basic.code_arduino.code_systemverilog.code_elixir.code_gleam.code_zig.code_gdscript.code_gdscript_2.code_assembly.code_v.code_ook.code_typescript.code_ocaml.code_odin.xhosa.xhosa_3k.tibetan.tibetan_1k.code_cobol.code_clojure.code_common_lisp.code_erlang.docker_file.code_fortran.viossa.viossa_njutro.code_abap.code_abap_1k.code_yoptascript.code_cuda.kinyarwanda.pokemon_1k.kokanu.likanu.code_vhdl.lao.code_6502_assembly.english_legal.sindhi`.split(`.`), {
    errorMap: po(`Must be a supported language`)
});
O.object({
    name: F,
    rightToLeft: O.boolean().optional(),
    noLazyMode: O.boolean().optional(),
    joiningScript: O.boolean().optional(),
    orderedByFrequency: O.boolean().optional(),
    words: O.array(O.string()).min(1),
    additionalAccents: O.array(O.tuple([O.string().min(1), O.string().min(1)])).optional(),
    bcp47: O.string().optional(),
    preferredFont: mo.optional(),
    originalPunctuation: O.boolean().optional()
}).strict();
var ho = O.number().nonnegative().int().optional().describe(`only available on friendsOnly leaderboard`),
    go = O.object({
        wpm: O.number().nonnegative(),
        acc: O.number().nonnegative().min(0).max(100),
        timestamp: O.number().int().nonnegative(),
        raw: O.number().nonnegative(),
        consistency: O.number().nonnegative().optional(),
        uid: O.string(),
        name: O.string(),
        discordId: O.string().optional(),
        discordAvatar: O.string().optional(),
        rank: O.number().nonnegative().int(),
        friendsRank: ho,
        badgeId: O.number().int().optional(),
        isPremium: O.boolean().optional()
    });
go.omit({
    rank: !0,
    friendsRank: !0
});
var _o = O.object({
        uid: O.string(),
        name: O.string(),
        lastActivityTimestamp: O.number().int().nonnegative(),
        timeTypedSeconds: O.number().nonnegative(),
        discordId: O.string().optional().or(O.null().transform(e => {})),
        discordAvatar: O.string().optional(),
        badgeId: O.number().int().optional(),
        isPremium: O.boolean().optional()
    }),
    vo = O.number().int().nonnegative(),
    yo = _o.extend({
        totalXp: vo,
        rank: O.number().nonnegative().int(),
        friendsRank: ho
    }),
    bo = O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String)),
    xo = () => O.string().regex(/^[a-zA-Z0-9_]+$/),
    So = xo();
xo().max(50), O.string().nullable().optional().transform(e => e ?? void 0);
var Co = O.number().nonnegative().max(100),
    wo = O.number().nonnegative().max(420),
    To = O.enum([`repeat`, `random`, `shuffle`]),
    Eo = O.enum([`word`, `time`, `section`]);

function Do(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var Oo = O.enum(`Roboto_Mono.Noto_Naskh_Arabic.Source_Code_Pro.IBM_Plex_Sans.Inconsolata.Fira_Code.JetBrains_Mono.Roboto.Montserrat.Titillium_Web.Lexend_Deca.Comic_Sans_MS.Oxygen.Nunito.Itim.Courier.Comfortaa.Coming_Soon.Atkinson_Hyperlegible.Lato.Lalezar.Boon.Open_Dyslexic.Ubuntu.Ubuntu_Mono.Georgia.Cascadia_Mono.IBM_Plex_Mono.Overpass_Mono.Hack.CommitMono.Mononoki.Parkinsans.Geist.Sarabun.Kanit.Geist_Mono.Iosevka.Proto.Adwaita_Mono.Inter_Tight.Space_Grotesk.Noto_Sans_Lao`.split(`.`), {
        errorMap: Do(`Must be a known font family`)
    }),
    ko = Oo.or(O.string().max(50).regex(/^[a-zA-Z0-9_\-+.]+$/)),
    Ao = O.enum(`english.english_1k.english_5k.english_10k.english_25k.english_450k.english_commonly_misspelled.english_contractions.english_doubleletter.english_shakespearean.english_old.english_medical.spanish.spanish_1k.spanish_10k.spanish_650k.french.french_1k.french_2k.french_10k.french_600k.french_bitoduc.nepali.nepali_1k.nepali_romanized.sanskrit.sanskrit_roman.santali.azerbaijani.azerbaijani_1k.arabic.arabic_10k.arabic_egypt.arabic_egypt_1k.arabic_morocco.malagasy.malagasy_1k.malay.malay_1k.mongolian.mongolian_10k.kannada.korean.korean_1k.korean_5k.khmer.chinese_simplified.chinese_simplified_1k.chinese_simplified_5k.chinese_simplified_10k.chinese_simplified_50k.chinese_traditional.chinese_traditional_1k.chinese_traditional_5k.chinese_traditional_10k.chinese_traditional_50k.russian.russian_1k.russian_5k.russian_10k.russian_25k.russian_50k.russian_375k.russian_contractions.russian_contractions_1k.russian_abbreviations.ukrainian.ukrainian_1k.ukrainian_10k.ukrainian_50k.ukrainian_endings.ukrainian_latynka.ukrainian_latynka_1k.ukrainian_latynka_10k.ukrainian_latynka_50k.ukrainian_latynka_endings.portuguese.portuguese_acentos_e_cedilha.portuguese_1k.portuguese_3k.portuguese_5k.portuguese_320k.portuguese_550k.indonesian.indonesian_1k.indonesian_10k.kurdish_central.kurdish_central_2k.kurdish_central_4k.german.german_1k.german_10k.german_250k.swiss_german.swiss_german_1k.swiss_german_2k.afrikaans.afrikaans_1k.afrikaans_10k.georgian.tamil.tamil_1k.tanglish.tamil_old.telugu.telugu_1k.greek.greek_1k.greek_5k.greek_10k.greek_25k.greek_koine.greeklish.greeklish_1k.greeklish_5k.greeklish_10k.greeklish_25k.turkish.turkish_1k.turkish_5k.irish.irish_1k.italian.italian_1k.italian_7k.italian_60k.italian_280k.friulian.latin.galician.thai.thai_1k.thai_5k.thai_10k.thai_20k.thai_50k.thai_60k.polish.polish_2k.polish_5k.polish_10k.polish_20k.polish_40k.polish_200k.czech.czech_1k.czech_10k.slovak.slovak_1k.slovak_10k.slovenian.slovenian_1k.slovenian_5k.croatian.croatian_1k.dutch.dutch_1k.dutch_10k.filipino.filipino_1k.danish.danish_1k.danish_10k.hungarian.hungarian_1k.hungarian_2k.norwegian_bokmal.norwegian_bokmal_1k.norwegian_bokmal_5k.norwegian_bokmal_10k.norwegian_bokmal_150k.norwegian_bokmal_600k.norwegian_nynorsk.norwegian_nynorsk_1k.norwegian_nynorsk_5k.norwegian_nynorsk_10k.norwegian_nynorsk_100k.norwegian_nynorsk_400k.hebrew.hebrew_1k.hebrew_5k.hebrew_10k.icelandic.icelandic_1k.romanian.romanian_1k.romanian_5k.romanian_10k.romanian_25k.romanian_50k.romanian_100k.romanian_200k.lorem_ipsum.finnish.finnish_1k.finnish_10k.estonian.estonian_1k.estonian_5k.estonian_10k.udmurt.welsh.welsh_1k.persian.persian_1k.persian_5k.persian_20k.persian_romanized.marathi.kazakh.kazakh_1k.vietnamese.vietnamese_1k.vietnamese_5k.jyutping.pinyin.pinyin_1k.pinyin_10k.hausa.hausa_1k.bemba.bemba_1k.bemba_10k.swedish.swedish_1k.swedish_diacritics.serbian_latin.serbian_latin_10k.serbian.serbian_10k.yoruba_1k.swahili_1k.maori_1k.catalan.catalan_1k.lojban_gismu.lojban_cmavo.lithuanian.lithuanian_1k.lithuanian_3k.bulgarian.bulgarian_1k.bulgarian_latin.bulgarian_latin_1k.bangla.bangla_letters.bangla_10k.bosnian.bosnian_4k.toki_pona.toki_pona_ku_suli.toki_pona_ku_lili.esperanto.esperanto_1k.esperanto_10k.esperanto_25k.esperanto_36k.esperanto_x_sistemo.esperanto_x_sistemo_1k.esperanto_x_sistemo_10k.esperanto_x_sistemo_25k.esperanto_x_sistemo_36k.esperanto_h_sistemo.esperanto_h_sistemo_1k.esperanto_h_sistemo_10k.esperanto_h_sistemo_25k.esperanto_h_sistemo_36k.kyrgyz.kyrgyz_1k.urdu.urdu_1k.urdu_5k.urdu_roman.urdish.albanian.albanian_1k.shona.shona_1k.armenian.armenian_1k.armenian_western.armenian_western_1k.myanmar_burmese.japanese_hiragana.japanese_katakana.japanese_romaji.japanese_romaji_1k.sinhala.latvian.latvian_1k.maltese.maltese_1k.twitch_emotes.git.pig_latin.hindi.hindi_1k.hinglish.gujarati.gujarati_1k.macedonian.macedonian_1k.macedonian_10k.macedonian_75k.belarusian.belarusian_1k.belarusian_5k.belarusian_10k.belarusian_25k.belarusian_50k.belarusian_100k.belarusian_lacinka.belarusian_lacinka_1k.tatar.tatar_1k.tatar_5k.tatar_9k.tatar_crimean.tatar_crimean_1k.tatar_crimean_5k.tatar_crimean_10k.tatar_crimean_15k.tatar_crimean_cyrillic.tatar_crimean_cyrillic_1k.tatar_crimean_cyrillic_5k.tatar_crimean_cyrillic_10k.tatar_crimean_cyrillic_15k.uzbek.uzbek_1k.uzbek_70k.malayalam.amharic.amharic_1k.amharic_5k.oromo.oromo_1k.oromo_5k.wordle.league_of_legends.wordle_1k.typing_of_the_dead.yiddish.frisian.frisian_1k.pashto.euskera.klingon.klingon_1k.quenya.occitan.occitan_1k.occitan_2k.occitan_5k.occitan_10k.bashkir.zulu.kabyle.kabyle_1k.kabyle_2k.kabyle_5k.kabyle_10k.hawaiian.hawaiian_1k.code_python.code_python_1k.code_python_2k.code_python_5k.code_fsharp.code_c.code_csharp.code_css.code_c++.code_dart.code_brainfck.code_javascript.code_javascript_1k.code_javascript_react.code_jule.code_julia.code_haskell.code_html.code_nim.code_nix.code_pascal.code_java.code_kotlin.code_go.code_rockstar.code_rust.code_ruby.code_r.code_r_2k.code_swift.code_scala.code_bash.code_powershell.code_lua.code_luau.code_latex.code_typst.code_matlab.code_sql.code_perl.code_php.code_vim.code_vimscript.code_opencl.code_visual_basic.code_arduino.code_systemverilog.code_elixir.code_gleam.code_zig.code_gdscript.code_gdscript_2.code_assembly.code_v.code_ook.code_typescript.code_ocaml.code_odin.xhosa.xhosa_3k.tibetan.tibetan_1k.code_cobol.code_clojure.code_common_lisp.code_erlang.docker_file.code_fortran.viossa.viossa_njutro.code_abap.code_abap_1k.code_yoptascript.code_cuda.kinyarwanda.pokemon_1k.kokanu.likanu.code_vhdl.lao.code_6502_assembly.english_legal.sindhi`.split(`.`), {
        errorMap: Do(`Must be a supported language`)
    });
O.object({
    name: Ao,
    rightToLeft: O.boolean().optional(),
    noLazyMode: O.boolean().optional(),
    joiningScript: O.boolean().optional(),
    orderedByFrequency: O.boolean().optional(),
    words: O.array(O.string()).min(1),
    additionalAccents: O.array(O.tuple([O.string().min(1), O.string().min(1)])).optional(),
    bcp47: O.string().optional(),
    preferredFont: Oo.optional(),
    originalPunctuation: O.boolean().optional()
}).strict();
var jo = O.enum([`normal`, `expert`, `master`]),
    Mo = O.object({
        acc: O.number().nonnegative().max(100),
        consistency: O.number().nonnegative().max(100),
        difficulty: jo,
        lazyMode: O.boolean().optional(),
        language: Ao,
        punctuation: O.boolean().optional(),
        numbers: O.boolean().optional(),
        raw: O.number().nonnegative(),
        wpm: O.number().nonnegative(),
        timestamp: O.number().nonnegative()
    }),
    No = O.object({
        time: O.record(bo.describe(`Number of seconds as string`), O.array(Mo)),
        words: O.record(bo.describe(`Number of words as string`), O.array(Mo)),
        quote: O.record(bo, O.array(Mo)),
        custom: O.record(O.literal(`custom`), O.array(Mo)),
        zen: O.record(O.literal(`zen`), O.array(Mo))
    });
O.union([O.literal(`10`), O.literal(`25`), O.literal(`50`), O.literal(`100`)]), O.union([O.literal(`15`), O.literal(`30`), O.literal(`60`), O.literal(`120`)]), O.union([O.literal(`short`), O.literal(`medium`), O.literal(`long`), O.literal(`thicc`)]);
var Po = No.keyof(),
    Fo = O.union([bo, D(`zen`), D(`custom`)], {
        errorMap: () => ({
            message: `Needs to be either a number, "zen" or "custom".`
        })
    }),
    Io = O.enum(`8008.80s_after_dark.9009.aether.alduin.alpine.anti_hero.arch.aurora.beach.bento.bingsu.bliss.blue_dolphin.blueberry_dark.blueberry_light.botanical.bouquet.breeze.bushido.cafe.camping.carbon.catppuccin.chaos_theory.cheesecake.cherry_blossom.comfy.copper.creamsicle.cy_red.cyberspace.dark.dark_magic_girl.dark_note.darling.deku.desert_oasis.dev.diner.dino.discord.dmg.dollar.dots.dracula.drowning.dualshot.earthsong.everblush.evil_eye.ez_mode.fire.fledgling.fleuriste.floret.froyo.frozen_llama.fruit_chew.fundamentals.future_funk.github.godspeed.graen.grand_prix.grape.gruvbox_dark.gruvbox_light.hammerhead.hanok.hedge.honey.horizon.husqy.iceberg_dark.iceberg_light.incognito.ishtar.iv_clover.iv_spade.joker.laser.lavender.leather.lil_dragon.lilac_mist.lime.luna.macroblank.magic_girl.mashu.matcha_moccha.material.matrix.menthol.metaverse.metropolis.mexican.miami.miami_nights.midnight.milkshake.mint.mizu.modern_dolch.modern_dolch_light.modern_ink.monokai.moonlight.mountain.mr_sleeves.ms_cupcakes.muted.nautilus.nebula.night_runner.nord.nord_light.norse.oblivion.olive.olivia.onedark.our_theme.paper.passion_fruit.pastel.peach_blossom.peaches.phantom.pink_lemonade.pulse.purpleish.rainbow_trail.red_dragon.red_samurai.repose_dark.repose_light.retro.retrocast.rgb.rose_pine.rose_pine_dawn.rose_pine_moon.rudy.ryujinscales.serika.serika_dark.sewing_tin.sewing_tin_light.shadow.shoko.slambook.snes.soaring_skies.solarized_dark.solarized_light.solarized_osaka.sonokai.stealth.strawberry.striker.suisei.sunset.superuser.sweden.tangerine.taro.terminal.terra.terrazzo.terror_below.tiramisu.trackday.trance.tron_orange.vaporwave.vesper.vesper_light.viridescent.voc.vscode.watermelon.wavez.witch_girl.pale_nimbus.spiderman`.split(`.`), {
        errorMap: Do(`Must be a known theme`)
    }),
    Lo = O.enum(`qwerty.dvorak.colemak.colemak_angle.colemak_wide.colemak_dh.colemak_dh_iso.colemak_dh_wide.colemak_dh_iso_wide.colemak_dhk.colemak_dh_matrix.colemak_dhk_iso.colemak_dhv.qwertz.swiss_german.swiss_french.workman.prog_workman.turkish_q.turkish_f.turkish_e.MTGAP_ASRT.norman.halmak.QGMLWB.QGMLWY.qwpr.uk_qwerty.spanish_qwerty.italian_qwerty.latam_qwerty.prog_dvorak.prog_dvorak_prime.german_dvorak.german_dvorak_imp.spanish_dvorak.swedish_colemak.swedish_dvorak.dvorak_L.dvorak_R.dvorak_fr.azerty.azerty_AFNOR.bepo.bepo_AFNOR.alpha.handsdown.hungarian.handsdown_alt.handsdown_promethium.handsdown_neu.handsdown_neu_inverted.typehack.MTGAP.MTGAP_full.ina.soul.niro.mongolian.JCUKEN.statica_3x5.Vestnik.Diktor.Diktor_VoronovMod.Redaktor.JUIYAF.Zubachev.ISRT.ISRT_Angle.colemak_Qix.colemak_Qi.colemaQ.colemaQ_F.engram.engrammer.semimak.semimak_jq.semimak_jqc.canary.canary_matrix.japanese_hiragana.boo.boo_mangle.APT.APT_angle.middlemak.middlemak-nh.hindi_inscript.thai_kedmanee.thai_pattachote.thai_manoonchai.persian_standard.persian_farsi.arabic_101.arabic_102.arabic_mac.hebrew.urdu_phonetic.brasileiro_nativo.Foalmak.quartz.arensito.ARTS.beakl_15.beakl_19.beakl_19_bis.capewell_dvorak.colman.heart.klauser.oneproduct.pine.pine_v4.real.rolll.stndc.three.uciea.asset.dwarf.flaw.whorf.whorf6.whorfmax.whorfmax_ortho.sertain.ctgap.octa8.polish_programmers.bulgarian.bulgarian_phonetic_traditional.belarusian.ukrainian.russian.neo.bone.AdNW.mine.noted.koy.3l.korean.ekverto_b.nerps.sturdy_angle_ansi.sturdy_angle_iso.sturdy_ortho.ABNT2.HiYou.xenia.xenia_alt.burmese.gallium.gallium_angle.gallium_v2.gallium_v2_matrix.gallium_nl.maya.gallaya_angle_ansi.gallaya_angle_iso.gallaya_matrix.nila.minimak_4k.minimak_8k.minimak_12k.optimot.norwegian_qwerty.portuguese_pt_qwerty_iso.portuguese_pt_qwerty_ansi.swedish_qwerty.danish_qwerty.noctum.graphite.graphite_angle.graphite_angle_vc.graphite_angle_kp.graphite_matrix.macedonian.UGJRMV.pashto.ORNATE.estonian.stronk.dhorf.gust.recurva.seht-drai.ints.rollla.wreathy.saiga.saiga-e.krai.mir.ergol.cascade.vylet.hyperroll.romak.scythe.inqwerted.rain.night.night_stic.whix2.haruka.kuntum.anishtro.Kuntem.kuntem-jq.BEAKL_Zi.snorkle.MALTRON.PRSTEN.RSTHD.dusk.zenith.focal.panini.panini_wide.ergopti.sword.opy.tarmak_1.tarmak_2.tarmak_3.tarmak_4.rulemak.persian_farsi_colemak.persian_standard_colemak.ergo_split46.tamil99.Gralmak.GralmakS.vitrimak.miligram.nokwts.vylet_v4.armenian_hm_qwerty`.split(`.`), {
        errorMap: Do(`Must be a supported layout`)
    }),
    I = O.array(O.string().length(1)).min(1).max(4),
    Ro = O.object({
        keymapShowTopRow: O.boolean(),
        matrixShowRightColumn: O.boolean().optional()
    }).strict(),
    zo = Ro.extend({
        type: O.literal(`ansi`),
        keys: O.object({
            row1: O.array(I).length(13),
            row2: O.array(I).length(13),
            row3: O.array(I).length(11),
            row4: O.array(I).length(10),
            row5: O.array(I).min(1).max(2)
        }).strict()
    }).strict(),
    Bo = Ro.extend({
        type: O.literal(`iso`),
        keys: O.object({
            row1: O.array(I).length(13),
            row2: O.array(I).length(12),
            row3: O.array(I).length(12),
            row4: O.array(I).length(11),
            row5: O.array(I).min(1).max(2)
        }).strict()
    }).strict();
zo.or(Bo);
var Vo = O.enum([`off`, `slow`, `medium`, `fast`]),
    Ho = O.enum([`off`, `esc`, `tab`, `enter`]),
    Uo = O.union([O.literal(-3), O.literal(-2), O.literal(0), O.literal(1), O.literal(2), O.literal(3)]),
    Wo = O.array(Uo).describe([`|value|description|
|-|-|`, `|-3|Favorite quotes|`, `|-2|Quote search|`, `|0|Short quotes|`, `|1|Medium quotes|`, `|2|Long quotes|`, `|3|Thicc quotes|`].join(`
`)),
    Go = O.enum([`off`, `default`, `block`, `outline`, `underline`, `carrot`, `banana`, `monkey`]),
    Ko = O.enum([`off`, `on`, `max`]),
    qo = O.enum([`off`, `below`, `replace`, `both`]),
    Jo = O.enum([`off`, `below`, `replace`]),
    Yo = O.enum([`off`, `bar`, `text`, `mini`, `flash_text`, `flash_mini`]),
    Xo = O.enum([`off`, `text`, `mini`]),
    Zo = O.enum([`off`, `on`, `fav`, `light`, `dark`, `custom`, `auto`]),
    Qo = O.enum([`black`, `sub`, `text`, `main`]),
    $o = O.enum([`0.25`, `0.5`, `0.75`, `1`]),
    es = O.enum([`off`, `word`, `letter`]),
    ts = O.enum([`off`, `static`, `react`, `next`]),
    ns = O.enum([`staggered`, `alice`, `matrix`, `split`, `split_matrix`, `steno`, `steno_matrix`]),
    rs = O.enum([`lowercase`, `uppercase`, `blank`, `dynamic`]),
    is = O.enum([`minimal`, `minimal_numrow`, `full`]),
    as = O.number().min(.5).max(3.5).step(.1),
    os = O.enum([`manual`, `on`]),
    ss = O.enum([`off`, `1`, `2`, `3`, `4`]),
    cs = O.enum(`off.1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20.21.22.23.24.25.26`.split(`.`)),
    ls = O.number().min(0).max(1),
    us = O.enum([`off`, `average`, `pb`, `tagPb`, `last`, `custom`, `daily`]),
    ds = O.tuple([O.enum([`on`, `off`]), O.enum([`on`, `off`]), O.enum([`on`, `off`]), O.enum([`on`, `off`])]),
    fs = O.enum([`off`, `custom`]),
    ps = O.enum([`off`, `letter`, `word`, `next_word`, `next_two_words`, `next_three_words`]),
    ms = O.enum([`keep`, `hide`, `fade`, `dots`]),
    hs = O.enum([`off`, `letter`, `word`]),
    gs = O.number().min(10).max(90),
    _s = O.enum([`wpm`, `cpm`, `wps`, `cps`, `wph`]),
    vs = O.enum([`off`, `result`, `on`, `sellout`]),
    ys = O.enum([`off`, `custom`]),
    bs = O.enum([`off`, `typing`]),
    xs = O.enum([`off`, `on`, `keymap`]),
    Ss = O.enum([`cover`, `contain`, `max`]),
    Cs = O.tuple([O.number(), O.number(), O.number(), O.number()]),
    ws = O.array(Lo).min(2).max(15),
    Ts = O.array(Ao).min(2),
    Es = O.enum([`off`, `1`, `2`, `3`, `4`]),
    Ds = O.enum([`off`, `fixed`, `flex`]),
    Os = O.enum([`off`, `speed`, `acc`, `both`]),
    ks = O.boolean(),
    L = O.string().regex(/^#([\da-f]{3}){1,2}$/i),
    As = jo,
    js = O.tuple([L, L, L, L, L, L, L, L, L, L]),
    Ms = Io,
    Ns = O.array(Ms),
    Ps = O.enum(`58008.mirror.upside_down.nausea.round_round_baby.simon_says.tts.choo_choo.arrows.rAnDoMcAsE.sPoNgEcAsE.capitals.layout_mirror.layoutfluid.earthquake.space_balls.gibberish.ascii.specials.plus_zero.plus_one.plus_two.plus_three.read_ahead_easy.read_ahead.read_ahead_hard.memory.nospace.poetry.wikipedia.weakspot.pseudolang.IPv4.IPv6.binary.hexadecimal.zipf.morse.crt.backwards.ddoouubblleedd.instant_messaging.underscore_spaces.ALL_CAPS.polyglot.asl.rot13.no_quit`.split(`.`)),
    Fs = O.array(Ps).max(15),
    Is = O.number().nonnegative(),
    Ls = O.number().nonnegative(),
    Rs = O.number().nonnegative().max(100),
    zs = O.number().nonnegative(),
    Bs = O.number().int().nonnegative(),
    Vs = O.number().int().nonnegative(),
    Hs = O.literal(`overrideSync`).or(Lo),
    Us = O.literal(`default`).or(Lo),
    Ws = O.number().positive(),
    Gs = O.number().min(20).max(1e3).or(O.literal(0)),
    Ks = O.string().url(`Needs to be an URI`).regex(/^(https|http):\/\/.*/, `Unsupported protocol`).regex(/^[^`'"]*$/, `May not contain quotes`).regex(/.+(\.png|\.gif|\.jpeg|\.jpg|\.webp)/gi, `Unsupported image format`).max(2048, `URL is too long`).or(O.literal(``)),
    qs = O.enum([`off`, `1`, `3`, `5`, `10`]).describe(`How many seconds before the end of the test to play a warning sound.`),
    Js = O.object({
        punctuation: O.boolean(),
        numbers: O.boolean(),
        words: Vs,
        time: Bs,
        mode: Po,
        quoteLength: Wo,
        language: Ao,
        burstHeatmap: O.boolean(),
        difficulty: As,
        quickRestart: Ho,
        repeatQuotes: bs,
        resultSaving: O.boolean(),
        blindMode: O.boolean(),
        alwaysShowWordsHistory: O.boolean(),
        singleListCommandLine: os,
        minWpm: fs,
        minWpmCustomSpeed: Ls,
        minAcc: ys,
        minAccCustom: Rs,
        minBurst: Ds,
        minBurstCustomSpeed: zs,
        britishEnglish: O.boolean(),
        funbox: Fs,
        customLayoutfluid: ws,
        customPolyglot: Ts,
        freedomMode: O.boolean(),
        strictSpace: O.boolean(),
        oppositeShiftMode: xs,
        stopOnError: es,
        confidenceMode: Ko,
        quickEnd: O.boolean(),
        indicateTypos: qo,
        compositionDisplay: Jo,
        hideExtraLetters: O.boolean(),
        lazyMode: O.boolean(),
        layout: Us,
        codeUnindentOnBackspace: O.boolean(),
        soundVolume: ls,
        playSoundOnClick: cs,
        playSoundOnError: ss,
        playTimeWarning: qs,
        smoothCaret: Vo,
        caretStyle: Go,
        paceCaret: us,
        paceCaretCustomSpeed: Is,
        paceCaretStyle: Go,
        repeatedPace: O.boolean(),
        timerStyle: Yo,
        liveSpeedStyle: Xo,
        liveAccStyle: Xo,
        liveBurstStyle: Xo,
        timerColor: Qo,
        timerOpacity: $o,
        highlightMode: ps,
        typedEffect: ms,
        tapeMode: hs,
        tapeMargin: gs,
        smoothLineScroll: O.boolean(),
        showAllLines: O.boolean(),
        alwaysShowDecimalPlaces: O.boolean(),
        typingSpeedUnit: _s,
        startGraphsAtZero: O.boolean(),
        maxLineWidth: Gs,
        fontSize: Ws,
        fontFamily: ko,
        keymapMode: ts,
        keymapLayout: Hs,
        keymapStyle: ns,
        keymapLegendStyle: rs,
        keymapKeys: is,
        keymapSize: as,
        flipTestColors: O.boolean(),
        colorfulMode: O.boolean(),
        customBackground: Ks,
        customBackgroundSize: Ss,
        customBackgroundFilter: Cs,
        autoSwitchTheme: O.boolean(),
        themeLight: Ms,
        themeDark: Ms,
        randomTheme: Zo,
        favThemes: Ns,
        theme: Ms,
        customTheme: O.boolean(),
        customThemeColors: js,
        showKeyTips: O.boolean(),
        showOutOfFocusWarning: O.boolean(),
        capsLockWarning: O.boolean(),
        showAverage: Os,
        showPb: ks,
        accountChart: ds,
        monkey: O.boolean(),
        monkeyPowerLevel: Es,
        ads: vs
    }).strict();
Js.keyof(), Js.partial(), O.enum([`test`, `behavior`, `input`, `sound`, `caret`, `appearance`, `theme`, `hideElements`, `hidden`, `ads`]);
var Ys = O.enum(`oneHourWarrior.doubleDown.tripleTrouble.quad.8Ball.theBig12.1Day.trueSimp.bigramSalad.simp.simpLord.antidiseWhat.whatsThisWebsiteCalledAgain.developd.slowAndSteady.speedSpacer.iveGotThePower.accuracyExpert.accuracyMaster.accuracyGod.inAGalaxyFarFarAway.beepBoop.whosYourDaddy.itsATrap.jolly.gottaCatchEmAll.rapGod.navySeal.littleChef.crosstalk.bees.getOffMySwamp.lookAtMeIAmTheDeveloperNow.beLikeWater.rollercoaster.oneHourMirror.chooChoo.mnemonist.earfquake.simonSez.accountant.hidden.iCanSeeTheFuture.whatAreWordsAtThisPoint.iKiNdAlIkEhOwInEfFiCiEnTqWeRtYiS.specials.aeiou.asciiWarrior.oneNauseousMonkey.thumbWarrior.mouseWarrior.mobileWarrior.69.upsideDown.oneArmedBandit.englishMaster.feetWarrior.wingdings`.split(`.`), {
        errorMap: Do(`Must be a known challenge name`)
    }),
    Xs = O.object({
        acc: Co,
        seconds: O.number().nonnegative()
    });
O.object({
    wpm: O.array(O.number().nonnegative()).max(122),
    raw: O.array(O.number().int().nonnegative()).max(122),
    err: O.array(O.number().nonnegative()).max(122)
});
var Zs = O.object({
        wpm: O.array(O.number().nonnegative()).max(122),
        burst: O.array(O.number().int().nonnegative()).max(122),
        err: O.array(O.number().nonnegative()).max(122)
    }),
    Qs = O.object({
        average: O.number().nonnegative(),
        sd: O.number().nonnegative()
    }),
    $s = O.object({
        textLen: O.number().int().nonnegative(),
        mode: To,
        pipeDelimiter: O.boolean(),
        limit: O.object({
            mode: Eo,
            value: O.number().nonnegative()
        })
    }),
    ec = $s.omit({
        textLen: !0
    }).extend({
        text: O.array(O.string()).min(1)
    }),
    tc = O.tuple([O.number().int().nonnegative(), O.number().int().nonnegative(), O.number().int().nonnegative(), O.number().int().nonnegative()]),
    nc = O.object({
        wpm: wo,
        rawWpm: wo,
        charStats: tc,
        acc: Co.min(50),
        mode: Po,
        mode2: Fo,
        quoteLength: O.number().int().nonnegative().max(3).optional(),
        timestamp: O.number().int().nonnegative(),
        testDuration: O.number().min(1),
        consistency: Co,
        keyConsistency: Co,
        chartData: Zs.or(O.literal(`toolong`)),
        uid: So,
        restartCount: O.number().int().nonnegative().optional(),
        incompleteTestSeconds: O.number().nonnegative().optional(),
        afkDuration: O.number().nonnegative().optional(),
        tags: O.array(So).optional(),
        bailedOut: O.boolean().optional(),
        blindMode: O.boolean().optional(),
        lazyMode: O.boolean().optional(),
        funbox: Fs.optional(),
        language: Ao.optional(),
        difficulty: As.optional(),
        numbers: O.boolean().optional(),
        punctuation: O.boolean().optional()
    }),
    rc = nc.extend({
        _id: So,
        keySpacingStats: Qs.optional(),
        keyDurationStats: Qs.optional(),
        name: O.string(),
        isPb: O.boolean().optional()
    }),
    ic = rc.omit({
        name: !0,
        keySpacingStats: !0,
        keyDurationStats: !0,
        chartData: !0
    }),
    ac = nc.required({
        restartCount: !0,
        incompleteTestSeconds: !0,
        afkDuration: !0,
        tags: !0,
        bailedOut: !0,
        blindMode: !0,
        lazyMode: !0,
        funbox: !0,
        language: !0,
        difficulty: !0,
        numbers: !0,
        punctuation: !0
    }).extend({
        charTotal: O.number().int().nonnegative(),
        challenge: Ys.optional(),
        customText: $s.optional(),
        hash: xo().max(100),
        keyDuration: O.array(O.number().nonnegative()).or(O.literal(`toolong`)),
        keySpacing: O.array(O.number().nonnegative()).or(O.literal(`toolong`)),
        keyOverlap: O.number().nonnegative(),
        lastKeyToEnd: O.number().nonnegative(),
        startToFirstKey: O.number().nonnegative(),
        wpmConsistency: Co,
        stopOnLetter: O.boolean(),
        incompleteTests: O.array(Xs)
    }).strict(),
    oc = O.object({
        base: O.number().int().optional(),
        fullAccuracy: O.number().int().optional(),
        quote: O.number().int().optional(),
        corrected: O.number().int().optional(),
        punctuation: O.number().int().optional(),
        numbers: O.number().int().optional(),
        funbox: O.number().int().optional(),
        streak: O.number().int().optional(),
        incomplete: O.number().int().optional(),
        daily: O.number().int().optional(),
        accPenalty: O.number().int().optional(),
        configMultiplier: O.number().int().optional()
    }),
    sc = O.object({
        insertedId: So,
        isPb: O.boolean(),
        tagPbs: O.array(So),
        dailyLeaderboardRank: O.number().int().nonnegative().optional(),
        weeklyXpLeaderboardRank: O.number().int().nonnegative().optional(),
        xp: O.number().int().nonnegative(),
        dailyXpBonus: O.boolean(),
        xpBreakdown: oc,
        streak: O.number().int().nonnegative()
    }),
    cc = O.object({
        language: O.string(),
        mode: O.string(),
        mode2: O.string()
    }).strict(),
    lc = O.object({
        minRank: O.number().int().nonnegative(),
        maxRank: O.number().int().nonnegative(),
        minReward: O.number().int().nonnegative(),
        maxReward: O.number().int().nonnegative()
    }).strict(),
    uc = O.object({
        maintenance: O.boolean(),
        dev: O.object({
            responseSlowdownMs: O.number().int().nonnegative()
        }),
        quotes: O.object({
            reporting: O.object({
                enabled: O.boolean(),
                maxReports: O.number().int().nonnegative(),
                contentReportLimit: O.number().int().nonnegative()
            }),
            submissionsEnabled: O.boolean(),
            maxFavorites: O.number().int().nonnegative()
        }),
        results: O.object({
            savingEnabled: O.boolean(),
            objectHashCheckEnabled: O.boolean(),
            filterPresets: O.object({
                enabled: O.boolean(),
                maxPresetsPerUser: O.number().int().nonnegative()
            }),
            limits: O.object({
                regularUser: O.number().int().nonnegative(),
                premiumUser: O.number().int().nonnegative()
            }),
            maxBatchSize: O.number().int().nonnegative()
        }),
        users: O.object({
            signUp: O.boolean(),
            lastHashesCheck: O.object({
                enabled: O.boolean(),
                maxHashes: O.number().int().nonnegative()
            }),
            autoBan: O.object({
                enabled: O.boolean(),
                maxCount: O.number().int().nonnegative(),
                maxHours: O.number().int().nonnegative()
            }),
            profiles: O.object({
                enabled: O.boolean()
            }),
            discordIntegration: O.object({
                enabled: O.boolean()
            }),
            xp: O.object({
                enabled: O.boolean(),
                funboxBonus: O.number(),
                gainMultiplier: O.number(),
                maxDailyBonus: O.number(),
                minDailyBonus: O.number(),
                streak: O.object({
                    enabled: O.boolean(),
                    maxStreakDays: O.number().nonnegative(),
                    maxStreakMultiplier: O.number()
                })
            }),
            inbox: O.object({
                enabled: O.boolean(),
                maxMail: O.number().int().nonnegative()
            }),
            premium: O.object({
                enabled: O.boolean()
            })
        }),
        admin: O.object({
            endpointsEnabled: O.boolean()
        }),
        apeKeys: O.object({
            endpointsEnabled: O.boolean(),
            acceptKeys: O.boolean(),
            maxKeysPerUser: O.number().int().nonnegative(),
            apeKeyBytes: O.number().int().nonnegative(),
            apeKeySaltRounds: O.number().int().nonnegative()
        }),
        rateLimiting: O.object({
            badAuthentication: O.object({
                enabled: O.boolean(),
                penalty: O.number(),
                flaggedStatusCodes: O.array(O.number().int().nonnegative())
            })
        }),
        dailyLeaderboards: O.object({
            enabled: O.boolean(),
            leaderboardExpirationTimeInDays: O.number().nonnegative(),
            maxResults: O.number().int().nonnegative(),
            validModeRules: O.array(cc),
            scheduleRewardsModeRules: O.array(cc),
            topResultsToAnnounce: O.number().int().positive(),
            xpRewardBrackets: O.array(lc)
        }),
        leaderboards: O.object({
            minTimeTyping: O.number().min(0).describe(`Minimum typing time (in seconds) the user needs to get on a leaderboard`),
            weeklyXp: O.object({
                enabled: O.boolean(),
                expirationTimeInDays: O.number().nonnegative(),
                xpRewardBrackets: O.array(lc)
            })
        }),
        connections: O.object({
            enabled: O.boolean(),
            maxPerUser: O.number().int().nonnegative()
        })
    });

function dc(e) {
    return e === void 0 || e === `` ? e : e.replace(/[\u0300-\u036F]/g, ``).trim().replace(/\n{3,}/g, `

`).replace(/[^\S\r\n]{3,}/g, `  `)
}
var fc = O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String)),
    pc = () => O.string().regex(/^[a-zA-Z0-9_]+$/),
    mc = () => O.string().regex(/^[0-9a-zA-Z_.-]+$/, `Only letters, numbers, underscores, dots and hyphens allowed`).regex(/^[^.].*$/, `Cannot start with a dot`),
    hc = () => O.string().regex(/^[0-9a-zA-Z_-]+$/, `Only letters, numbers, underscores and hyphens allowed`).regex(/^[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*$/, `Separators cannot be at the start or end, or appear multiple times in a row`),
    R = pc();
pc().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);

function gc(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var _c = O.enum(`Roboto_Mono.Noto_Naskh_Arabic.Source_Code_Pro.IBM_Plex_Sans.Inconsolata.Fira_Code.JetBrains_Mono.Roboto.Montserrat.Titillium_Web.Lexend_Deca.Comic_Sans_MS.Oxygen.Nunito.Itim.Courier.Comfortaa.Coming_Soon.Atkinson_Hyperlegible.Lato.Lalezar.Boon.Open_Dyslexic.Ubuntu.Ubuntu_Mono.Georgia.Cascadia_Mono.IBM_Plex_Mono.Overpass_Mono.Hack.CommitMono.Mononoki.Parkinsans.Geist.Sarabun.Kanit.Geist_Mono.Iosevka.Proto.Adwaita_Mono.Inter_Tight.Space_Grotesk.Noto_Sans_Lao`.split(`.`), {
        errorMap: gc(`Must be a known font family`)
    }),
    vc = _c.or(O.string().max(50).regex(/^[a-zA-Z0-9_\-+.]+$/)),
    z = O.enum(`english.english_1k.english_5k.english_10k.english_25k.english_450k.english_commonly_misspelled.english_contractions.english_doubleletter.english_shakespearean.english_old.english_medical.spanish.spanish_1k.spanish_10k.spanish_650k.french.french_1k.french_2k.french_10k.french_600k.french_bitoduc.nepali.nepali_1k.nepali_romanized.sanskrit.sanskrit_roman.santali.azerbaijani.azerbaijani_1k.arabic.arabic_10k.arabic_egypt.arabic_egypt_1k.arabic_morocco.malagasy.malagasy_1k.malay.malay_1k.mongolian.mongolian_10k.kannada.korean.korean_1k.korean_5k.khmer.chinese_simplified.chinese_simplified_1k.chinese_simplified_5k.chinese_simplified_10k.chinese_simplified_50k.chinese_traditional.chinese_traditional_1k.chinese_traditional_5k.chinese_traditional_10k.chinese_traditional_50k.russian.russian_1k.russian_5k.russian_10k.russian_25k.russian_50k.russian_375k.russian_contractions.russian_contractions_1k.russian_abbreviations.ukrainian.ukrainian_1k.ukrainian_10k.ukrainian_50k.ukrainian_endings.ukrainian_latynka.ukrainian_latynka_1k.ukrainian_latynka_10k.ukrainian_latynka_50k.ukrainian_latynka_endings.portuguese.portuguese_acentos_e_cedilha.portuguese_1k.portuguese_3k.portuguese_5k.portuguese_320k.portuguese_550k.indonesian.indonesian_1k.indonesian_10k.kurdish_central.kurdish_central_2k.kurdish_central_4k.german.german_1k.german_10k.german_250k.swiss_german.swiss_german_1k.swiss_german_2k.afrikaans.afrikaans_1k.afrikaans_10k.georgian.tamil.tamil_1k.tanglish.tamil_old.telugu.telugu_1k.greek.greek_1k.greek_5k.greek_10k.greek_25k.greek_koine.greeklish.greeklish_1k.greeklish_5k.greeklish_10k.greeklish_25k.turkish.turkish_1k.turkish_5k.irish.irish_1k.italian.italian_1k.italian_7k.italian_60k.italian_280k.friulian.latin.galician.thai.thai_1k.thai_5k.thai_10k.thai_20k.thai_50k.thai_60k.polish.polish_2k.polish_5k.polish_10k.polish_20k.polish_40k.polish_200k.czech.czech_1k.czech_10k.slovak.slovak_1k.slovak_10k.slovenian.slovenian_1k.slovenian_5k.croatian.croatian_1k.dutch.dutch_1k.dutch_10k.filipino.filipino_1k.danish.danish_1k.danish_10k.hungarian.hungarian_1k.hungarian_2k.norwegian_bokmal.norwegian_bokmal_1k.norwegian_bokmal_5k.norwegian_bokmal_10k.norwegian_bokmal_150k.norwegian_bokmal_600k.norwegian_nynorsk.norwegian_nynorsk_1k.norwegian_nynorsk_5k.norwegian_nynorsk_10k.norwegian_nynorsk_100k.norwegian_nynorsk_400k.hebrew.hebrew_1k.hebrew_5k.hebrew_10k.icelandic.icelandic_1k.romanian.romanian_1k.romanian_5k.romanian_10k.romanian_25k.romanian_50k.romanian_100k.romanian_200k.lorem_ipsum.finnish.finnish_1k.finnish_10k.estonian.estonian_1k.estonian_5k.estonian_10k.udmurt.welsh.welsh_1k.persian.persian_1k.persian_5k.persian_20k.persian_romanized.marathi.kazakh.kazakh_1k.vietnamese.vietnamese_1k.vietnamese_5k.jyutping.pinyin.pinyin_1k.pinyin_10k.hausa.hausa_1k.bemba.bemba_1k.bemba_10k.swedish.swedish_1k.swedish_diacritics.serbian_latin.serbian_latin_10k.serbian.serbian_10k.yoruba_1k.swahili_1k.maori_1k.catalan.catalan_1k.lojban_gismu.lojban_cmavo.lithuanian.lithuanian_1k.lithuanian_3k.bulgarian.bulgarian_1k.bulgarian_latin.bulgarian_latin_1k.bangla.bangla_letters.bangla_10k.bosnian.bosnian_4k.toki_pona.toki_pona_ku_suli.toki_pona_ku_lili.esperanto.esperanto_1k.esperanto_10k.esperanto_25k.esperanto_36k.esperanto_x_sistemo.esperanto_x_sistemo_1k.esperanto_x_sistemo_10k.esperanto_x_sistemo_25k.esperanto_x_sistemo_36k.esperanto_h_sistemo.esperanto_h_sistemo_1k.esperanto_h_sistemo_10k.esperanto_h_sistemo_25k.esperanto_h_sistemo_36k.kyrgyz.kyrgyz_1k.urdu.urdu_1k.urdu_5k.urdu_roman.urdish.albanian.albanian_1k.shona.shona_1k.armenian.armenian_1k.armenian_western.armenian_western_1k.myanmar_burmese.japanese_hiragana.japanese_katakana.japanese_romaji.japanese_romaji_1k.sinhala.latvian.latvian_1k.maltese.maltese_1k.twitch_emotes.git.pig_latin.hindi.hindi_1k.hinglish.gujarati.gujarati_1k.macedonian.macedonian_1k.macedonian_10k.macedonian_75k.belarusian.belarusian_1k.belarusian_5k.belarusian_10k.belarusian_25k.belarusian_50k.belarusian_100k.belarusian_lacinka.belarusian_lacinka_1k.tatar.tatar_1k.tatar_5k.tatar_9k.tatar_crimean.tatar_crimean_1k.tatar_crimean_5k.tatar_crimean_10k.tatar_crimean_15k.tatar_crimean_cyrillic.tatar_crimean_cyrillic_1k.tatar_crimean_cyrillic_5k.tatar_crimean_cyrillic_10k.tatar_crimean_cyrillic_15k.uzbek.uzbek_1k.uzbek_70k.malayalam.amharic.amharic_1k.amharic_5k.oromo.oromo_1k.oromo_5k.wordle.league_of_legends.wordle_1k.typing_of_the_dead.yiddish.frisian.frisian_1k.pashto.euskera.klingon.klingon_1k.quenya.occitan.occitan_1k.occitan_2k.occitan_5k.occitan_10k.bashkir.zulu.kabyle.kabyle_1k.kabyle_2k.kabyle_5k.kabyle_10k.hawaiian.hawaiian_1k.code_python.code_python_1k.code_python_2k.code_python_5k.code_fsharp.code_c.code_csharp.code_css.code_c++.code_dart.code_brainfck.code_javascript.code_javascript_1k.code_javascript_react.code_jule.code_julia.code_haskell.code_html.code_nim.code_nix.code_pascal.code_java.code_kotlin.code_go.code_rockstar.code_rust.code_ruby.code_r.code_r_2k.code_swift.code_scala.code_bash.code_powershell.code_lua.code_luau.code_latex.code_typst.code_matlab.code_sql.code_perl.code_php.code_vim.code_vimscript.code_opencl.code_visual_basic.code_arduino.code_systemverilog.code_elixir.code_gleam.code_zig.code_gdscript.code_gdscript_2.code_assembly.code_v.code_ook.code_typescript.code_ocaml.code_odin.xhosa.xhosa_3k.tibetan.tibetan_1k.code_cobol.code_clojure.code_common_lisp.code_erlang.docker_file.code_fortran.viossa.viossa_njutro.code_abap.code_abap_1k.code_yoptascript.code_cuda.kinyarwanda.pokemon_1k.kokanu.likanu.code_vhdl.lao.code_6502_assembly.english_legal.sindhi`.split(`.`), {
        errorMap: gc(`Must be a supported language`)
    });
O.object({
    name: z,
    rightToLeft: O.boolean().optional(),
    noLazyMode: O.boolean().optional(),
    joiningScript: O.boolean().optional(),
    orderedByFrequency: O.boolean().optional(),
    words: O.array(O.string()).min(1),
    additionalAccents: O.array(O.tuple([O.string().min(1), O.string().min(1)])).optional(),
    bcp47: O.string().optional(),
    preferredFont: _c.optional(),
    originalPunctuation: O.boolean().optional()
}).strict();
var yc = O.enum([`normal`, `expert`, `master`]),
    bc = O.object({
        acc: O.number().nonnegative().max(100),
        consistency: O.number().nonnegative().max(100),
        difficulty: yc,
        lazyMode: O.boolean().optional(),
        language: z,
        punctuation: O.boolean().optional(),
        numbers: O.boolean().optional(),
        raw: O.number().nonnegative(),
        wpm: O.number().nonnegative(),
        timestamp: O.number().nonnegative()
    }),
    xc = O.object({
        time: O.record(fc.describe(`Number of seconds as string`), O.array(bc)),
        words: O.record(fc.describe(`Number of words as string`), O.array(bc)),
        quote: O.record(fc, O.array(bc)),
        custom: O.record(O.literal(`custom`), O.array(bc)),
        zen: O.record(O.literal(`zen`), O.array(bc))
    }),
    Sc = O.union([O.literal(`10`), O.literal(`25`), O.literal(`50`), O.literal(`100`)]),
    Cc = O.union([O.literal(`15`), O.literal(`30`), O.literal(`60`), O.literal(`120`)]),
    wc = O.union([O.literal(`short`), O.literal(`medium`), O.literal(`long`), O.literal(`thicc`)]),
    Tc = xc.keyof(),
    Ec = O.union([fc, D(`zen`), D(`custom`)], {
        errorMap: () => ({
            message: `Needs to be either a number, "zen" or "custom".`
        })
    }),
    Dc = O.enum(`8008.80s_after_dark.9009.aether.alduin.alpine.anti_hero.arch.aurora.beach.bento.bingsu.bliss.blue_dolphin.blueberry_dark.blueberry_light.botanical.bouquet.breeze.bushido.cafe.camping.carbon.catppuccin.chaos_theory.cheesecake.cherry_blossom.comfy.copper.creamsicle.cy_red.cyberspace.dark.dark_magic_girl.dark_note.darling.deku.desert_oasis.dev.diner.dino.discord.dmg.dollar.dots.dracula.drowning.dualshot.earthsong.everblush.evil_eye.ez_mode.fire.fledgling.fleuriste.floret.froyo.frozen_llama.fruit_chew.fundamentals.future_funk.github.godspeed.graen.grand_prix.grape.gruvbox_dark.gruvbox_light.hammerhead.hanok.hedge.honey.horizon.husqy.iceberg_dark.iceberg_light.incognito.ishtar.iv_clover.iv_spade.joker.laser.lavender.leather.lil_dragon.lilac_mist.lime.luna.macroblank.magic_girl.mashu.matcha_moccha.material.matrix.menthol.metaverse.metropolis.mexican.miami.miami_nights.midnight.milkshake.mint.mizu.modern_dolch.modern_dolch_light.modern_ink.monokai.moonlight.mountain.mr_sleeves.ms_cupcakes.muted.nautilus.nebula.night_runner.nord.nord_light.norse.oblivion.olive.olivia.onedark.our_theme.paper.passion_fruit.pastel.peach_blossom.peaches.phantom.pink_lemonade.pulse.purpleish.rainbow_trail.red_dragon.red_samurai.repose_dark.repose_light.retro.retrocast.rgb.rose_pine.rose_pine_dawn.rose_pine_moon.rudy.ryujinscales.serika.serika_dark.sewing_tin.sewing_tin_light.shadow.shoko.slambook.snes.soaring_skies.solarized_dark.solarized_light.solarized_osaka.sonokai.stealth.strawberry.striker.suisei.sunset.superuser.sweden.tangerine.taro.terminal.terra.terrazzo.terror_below.tiramisu.trackday.trance.tron_orange.vaporwave.vesper.vesper_light.viridescent.voc.vscode.watermelon.wavez.witch_girl.pale_nimbus.spiderman`.split(`.`), {
        errorMap: gc(`Must be a known theme`)
    }),
    Oc = O.enum(`qwerty.dvorak.colemak.colemak_angle.colemak_wide.colemak_dh.colemak_dh_iso.colemak_dh_wide.colemak_dh_iso_wide.colemak_dhk.colemak_dh_matrix.colemak_dhk_iso.colemak_dhv.qwertz.swiss_german.swiss_french.workman.prog_workman.turkish_q.turkish_f.turkish_e.MTGAP_ASRT.norman.halmak.QGMLWB.QGMLWY.qwpr.uk_qwerty.spanish_qwerty.italian_qwerty.latam_qwerty.prog_dvorak.prog_dvorak_prime.german_dvorak.german_dvorak_imp.spanish_dvorak.swedish_colemak.swedish_dvorak.dvorak_L.dvorak_R.dvorak_fr.azerty.azerty_AFNOR.bepo.bepo_AFNOR.alpha.handsdown.hungarian.handsdown_alt.handsdown_promethium.handsdown_neu.handsdown_neu_inverted.typehack.MTGAP.MTGAP_full.ina.soul.niro.mongolian.JCUKEN.statica_3x5.Vestnik.Diktor.Diktor_VoronovMod.Redaktor.JUIYAF.Zubachev.ISRT.ISRT_Angle.colemak_Qix.colemak_Qi.colemaQ.colemaQ_F.engram.engrammer.semimak.semimak_jq.semimak_jqc.canary.canary_matrix.japanese_hiragana.boo.boo_mangle.APT.APT_angle.middlemak.middlemak-nh.hindi_inscript.thai_kedmanee.thai_pattachote.thai_manoonchai.persian_standard.persian_farsi.arabic_101.arabic_102.arabic_mac.hebrew.urdu_phonetic.brasileiro_nativo.Foalmak.quartz.arensito.ARTS.beakl_15.beakl_19.beakl_19_bis.capewell_dvorak.colman.heart.klauser.oneproduct.pine.pine_v4.real.rolll.stndc.three.uciea.asset.dwarf.flaw.whorf.whorf6.whorfmax.whorfmax_ortho.sertain.ctgap.octa8.polish_programmers.bulgarian.bulgarian_phonetic_traditional.belarusian.ukrainian.russian.neo.bone.AdNW.mine.noted.koy.3l.korean.ekverto_b.nerps.sturdy_angle_ansi.sturdy_angle_iso.sturdy_ortho.ABNT2.HiYou.xenia.xenia_alt.burmese.gallium.gallium_angle.gallium_v2.gallium_v2_matrix.gallium_nl.maya.gallaya_angle_ansi.gallaya_angle_iso.gallaya_matrix.nila.minimak_4k.minimak_8k.minimak_12k.optimot.norwegian_qwerty.portuguese_pt_qwerty_iso.portuguese_pt_qwerty_ansi.swedish_qwerty.danish_qwerty.noctum.graphite.graphite_angle.graphite_angle_vc.graphite_angle_kp.graphite_matrix.macedonian.UGJRMV.pashto.ORNATE.estonian.stronk.dhorf.gust.recurva.seht-drai.ints.rollla.wreathy.saiga.saiga-e.krai.mir.ergol.cascade.vylet.hyperroll.romak.scythe.inqwerted.rain.night.night_stic.whix2.haruka.kuntum.anishtro.Kuntem.kuntem-jq.BEAKL_Zi.snorkle.MALTRON.PRSTEN.RSTHD.dusk.zenith.focal.panini.panini_wide.ergopti.sword.opy.tarmak_1.tarmak_2.tarmak_3.tarmak_4.rulemak.persian_farsi_colemak.persian_standard_colemak.ergo_split46.tamil99.Gralmak.GralmakS.vitrimak.miligram.nokwts.vylet_v4.armenian_hm_qwerty`.split(`.`), {
        errorMap: gc(`Must be a supported layout`)
    }),
    B = O.array(O.string().length(1)).min(1).max(4),
    kc = O.object({
        keymapShowTopRow: O.boolean(),
        matrixShowRightColumn: O.boolean().optional()
    }).strict(),
    Ac = kc.extend({
        type: O.literal(`ansi`),
        keys: O.object({
            row1: O.array(B).length(13),
            row2: O.array(B).length(13),
            row3: O.array(B).length(11),
            row4: O.array(B).length(10),
            row5: O.array(B).min(1).max(2)
        }).strict()
    }).strict(),
    jc = kc.extend({
        type: O.literal(`iso`),
        keys: O.object({
            row1: O.array(B).length(13),
            row2: O.array(B).length(12),
            row3: O.array(B).length(12),
            row4: O.array(B).length(11),
            row5: O.array(B).min(1).max(2)
        }).strict()
    }).strict();
Ac.or(jc);
var Mc = O.enum([`off`, `slow`, `medium`, `fast`]),
    Nc = O.enum([`off`, `esc`, `tab`, `enter`]),
    Pc = O.union([O.literal(-3), O.literal(-2), O.literal(0), O.literal(1), O.literal(2), O.literal(3)]),
    Fc = O.array(Pc).describe([`|value|description|
|-|-|`, `|-3|Favorite quotes|`, `|-2|Quote search|`, `|0|Short quotes|`, `|1|Medium quotes|`, `|2|Long quotes|`, `|3|Thicc quotes|`].join(`
`)),
    Ic = O.enum([`off`, `default`, `block`, `outline`, `underline`, `carrot`, `banana`, `monkey`]),
    Lc = O.enum([`off`, `on`, `max`]),
    Rc = O.enum([`off`, `below`, `replace`, `both`]),
    zc = O.enum([`off`, `below`, `replace`]),
    Bc = O.enum([`off`, `bar`, `text`, `mini`, `flash_text`, `flash_mini`]),
    Vc = O.enum([`off`, `text`, `mini`]),
    Hc = O.enum([`off`, `on`, `fav`, `light`, `dark`, `custom`, `auto`]),
    Uc = O.enum([`black`, `sub`, `text`, `main`]),
    Wc = O.enum([`0.25`, `0.5`, `0.75`, `1`]),
    Gc = O.enum([`off`, `word`, `letter`]),
    Kc = O.enum([`off`, `static`, `react`, `next`]),
    qc = O.enum([`staggered`, `alice`, `matrix`, `split`, `split_matrix`, `steno`, `steno_matrix`]),
    Jc = O.enum([`lowercase`, `uppercase`, `blank`, `dynamic`]),
    Yc = O.enum([`minimal`, `minimal_numrow`, `full`]),
    Xc = O.number().min(.5).max(3.5).step(.1),
    Zc = O.enum([`manual`, `on`]),
    Qc = O.enum([`off`, `1`, `2`, `3`, `4`]),
    $c = O.enum(`off.1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20.21.22.23.24.25.26`.split(`.`)),
    el = O.number().min(0).max(1),
    tl = O.enum([`off`, `average`, `pb`, `tagPb`, `last`, `custom`, `daily`]),
    nl = O.tuple([O.enum([`on`, `off`]), O.enum([`on`, `off`]), O.enum([`on`, `off`]), O.enum([`on`, `off`])]),
    rl = O.enum([`off`, `custom`]),
    il = O.enum([`off`, `letter`, `word`, `next_word`, `next_two_words`, `next_three_words`]),
    al = O.enum([`keep`, `hide`, `fade`, `dots`]),
    ol = O.enum([`off`, `letter`, `word`]),
    sl = O.number().min(10).max(90),
    cl = O.enum([`wpm`, `cpm`, `wps`, `cps`, `wph`]),
    ll = O.enum([`off`, `result`, `on`, `sellout`]),
    ul = O.enum([`off`, `custom`]),
    dl = O.enum([`off`, `typing`]),
    fl = O.enum([`off`, `on`, `keymap`]),
    pl = O.enum([`cover`, `contain`, `max`]),
    ml = O.tuple([O.number(), O.number(), O.number(), O.number()]),
    hl = O.array(Oc).min(2).max(15),
    gl = O.array(z).min(2),
    _l = O.enum([`off`, `1`, `2`, `3`, `4`]),
    vl = O.enum([`off`, `fixed`, `flex`]),
    yl = O.enum([`off`, `speed`, `acc`, `both`]),
    bl = O.boolean(),
    V = O.string().regex(/^#([\da-f]{3}){1,2}$/i),
    xl = yc,
    Sl = O.tuple([V, V, V, V, V, V, V, V, V, V]),
    Cl = Dc,
    wl = O.array(Cl),
    Tl = O.enum(`58008.mirror.upside_down.nausea.round_round_baby.simon_says.tts.choo_choo.arrows.rAnDoMcAsE.sPoNgEcAsE.capitals.layout_mirror.layoutfluid.earthquake.space_balls.gibberish.ascii.specials.plus_zero.plus_one.plus_two.plus_three.read_ahead_easy.read_ahead.read_ahead_hard.memory.nospace.poetry.wikipedia.weakspot.pseudolang.IPv4.IPv6.binary.hexadecimal.zipf.morse.crt.backwards.ddoouubblleedd.instant_messaging.underscore_spaces.ALL_CAPS.polyglot.asl.rot13.no_quit`.split(`.`)),
    El = O.array(Tl).max(15),
    Dl = O.number().nonnegative(),
    Ol = O.number().nonnegative(),
    kl = O.number().nonnegative().max(100),
    Al = O.number().nonnegative(),
    jl = O.number().int().nonnegative(),
    Ml = O.number().int().nonnegative(),
    Nl = O.literal(`overrideSync`).or(Oc),
    Pl = O.literal(`default`).or(Oc),
    Fl = O.number().positive(),
    Il = O.number().min(20).max(1e3).or(O.literal(0)),
    Ll = O.string().url(`Needs to be an URI`).regex(/^(https|http):\/\/.*/, `Unsupported protocol`).regex(/^[^`'"]*$/, `May not contain quotes`).regex(/.+(\.png|\.gif|\.jpeg|\.jpg|\.webp)/gi, `Unsupported image format`).max(2048, `URL is too long`).or(O.literal(``)),
    Rl = O.enum([`off`, `1`, `3`, `5`, `10`]).describe(`How many seconds before the end of the test to play a warning sound.`),
    zl = O.object({
        punctuation: O.boolean(),
        numbers: O.boolean(),
        words: Ml,
        time: jl,
        mode: Tc,
        quoteLength: Fc,
        language: z,
        burstHeatmap: O.boolean(),
        difficulty: xl,
        quickRestart: Nc,
        repeatQuotes: dl,
        resultSaving: O.boolean(),
        blindMode: O.boolean(),
        alwaysShowWordsHistory: O.boolean(),
        singleListCommandLine: Zc,
        minWpm: rl,
        minWpmCustomSpeed: Ol,
        minAcc: ul,
        minAccCustom: kl,
        minBurst: vl,
        minBurstCustomSpeed: Al,
        britishEnglish: O.boolean(),
        funbox: El,
        customLayoutfluid: hl,
        customPolyglot: gl,
        freedomMode: O.boolean(),
        strictSpace: O.boolean(),
        oppositeShiftMode: fl,
        stopOnError: Gc,
        confidenceMode: Lc,
        quickEnd: O.boolean(),
        indicateTypos: Rc,
        compositionDisplay: zc,
        hideExtraLetters: O.boolean(),
        lazyMode: O.boolean(),
        layout: Pl,
        codeUnindentOnBackspace: O.boolean(),
        soundVolume: el,
        playSoundOnClick: $c,
        playSoundOnError: Qc,
        playTimeWarning: Rl,
        smoothCaret: Mc,
        caretStyle: Ic,
        paceCaret: tl,
        paceCaretCustomSpeed: Dl,
        paceCaretStyle: Ic,
        repeatedPace: O.boolean(),
        timerStyle: Bc,
        liveSpeedStyle: Vc,
        liveAccStyle: Vc,
        liveBurstStyle: Vc,
        timerColor: Uc,
        timerOpacity: Wc,
        highlightMode: il,
        typedEffect: al,
        tapeMode: ol,
        tapeMargin: sl,
        smoothLineScroll: O.boolean(),
        showAllLines: O.boolean(),
        alwaysShowDecimalPlaces: O.boolean(),
        typingSpeedUnit: cl,
        startGraphsAtZero: O.boolean(),
        maxLineWidth: Il,
        fontSize: Fl,
        fontFamily: vc,
        keymapMode: Kc,
        keymapLayout: Nl,
        keymapStyle: qc,
        keymapLegendStyle: Jc,
        keymapKeys: Yc,
        keymapSize: Xc,
        flipTestColors: O.boolean(),
        colorfulMode: O.boolean(),
        customBackground: Ll,
        customBackgroundSize: pl,
        customBackgroundFilter: ml,
        autoSwitchTheme: O.boolean(),
        themeLight: Cl,
        themeDark: Cl,
        randomTheme: Hc,
        favThemes: wl,
        theme: Cl,
        customTheme: O.boolean(),
        customThemeColors: Sl,
        showKeyTips: O.boolean(),
        showOutOfFocusWarning: O.boolean(),
        capsLockWarning: O.boolean(),
        showAverage: yl,
        showPb: bl,
        accountChart: nl,
        monkey: O.boolean(),
        monkeyPowerLevel: _l,
        ads: ll
    }).strict();
zl.keyof(), zl.partial(), O.enum([`test`, `behavior`, `input`, `sound`, `caret`, `appearance`, `theme`, `hideElements`, `hidden`, `ads`]);
var Bl = {
    a: [`а`, `à`, `á`, `ạ`, `ą`],
    c: [`с`, `ƈ`, `ċ`],
    d: [`ԁ`, `ɗ`],
    e: [`е`, `ẹ`, `ė`, `ė`, `é`, `è`],
    g: [`ġ`],
    h: [`һ`],
    i: [`і`, `í`, `ì`, `ï`],
    j: [`ј`, `ʝ`],
    k: [`κ`],
    l: [`ӏ`, `ḷ`],
    n: [`ո`],
    o: [`о`, `ο`, `օ`, `ȯ`, `ọ`, `ỏ`, `ơ`, `ö`, `ó`, `ò`],
    p: [`р`],
    q: [`զ`],
    s: [`ʂ`],
    u: [`υ`, `ս`, `ü`, `ú`, `ù`],
    v: [`ν`, `ѵ`],
    x: [`х`, `ҳ`],
    y: [`у`, `ý`],
    z: [`ʐ`, `ż`]
};

function Vl(e) {
    for (let t in Bl) Bl[t].forEach(n => {
        e = e.replace(n, t)
    });
    return e
}
var Hl = `miodec,bitly,niqqa,niqqer,ni99a,ni99er,niggas,niga,niger,retard,ahole,anus,ash0le,asholes,assh0le,assh0lez,asshole,assholes,assholz,asswipe,azzhole,bassterds,bastard,bastards,bastardz,basterds,basterdz,biatch,bitch,bitches,blow job,boffing,butthole,buttwipe,c0ck,c0cks,c0k,carpet muncher,cawk,cawks,clit,cnts,cntz,cock,cockhead,cock-head,cocks,cocksucker,cock-sucker,crap,cum,cunt,cunts,cuntz,dick,dild0,dild0s,dildo,dildos,dilld0,dilld0s,dominatricks,dominatrics,dominatrix,dyke,enema,f u c k,f u c k e r,fag,fag1t,faget,fagg1t,faggit,faggot,fagit,fags,fagz,faigs,flipping the bird,fudge packer,fukah,fuken,fuker,fukin,fukk,fukkah,fukken,fukker,fukkin,g00k,gayboy,gaygirl,gayz,god-damned,h00r,h0ar,h0re,jackoff,japs,jerk-off,jisim,jiss,jizm,jizz,knob,knobs,knobz,kunt,kunts,kuntz,lezzian,lipshits,lipshitz,masochist,masokist,massterbait,masstrbait,masstrbate,masterbaiter,masterbate,masterbates,n1gr,nastt,nigger;,nigur;,niiger;,niigr;,orafis,orgasim;,orgasm,orgasum,oriface,orifice,orifiss,peeenus,peeenusss,peenus,peinus,pen1s,penas,penis,penis-breath,penus,penuus,phuc,phuck,phuk,phuker,phukker,poonani,pr1c,pr1ck,pr1k,puss,pussee,pussy,puuke,puuker,qweers,qweerz,qweir,recktum,rectum,retard,sadist,scank,schlong,semen,sex,sexy,sh!t,sh1t,sh1ter,sh1ts,sh1tter,sh1tz,shit,shits,shitter,shitty,shity,shitz,shyt,shyte,shytty,shyty,skanck,skank,skankee,skankey,skanks,skanky,slut,sluts,slutty,slutz,son-of-a-bitch,turd,va1jina,vag1na,vagiina,vagina,vaj1na,vajina,vullva,vulva,wh00r,wh0re,whore,xrated,b!+ch,bitch,blowjob,clit,arschloch,shit,asshole,b!tch,b17ch,b1tch,bastard,bi+ch,boiolas,buceta,c0ck,cawk,chink,cipa,clits,cum,cunt,dildo,dirsa,ejakulate,fatass,fcuk,fux0r,hoer,hore,jism,kawk,l3itch,l3i+ch,masturbate,masterbat,masterbat3,motherfucker,s.o.b.,mofo,nazi,nigga,nigger,nutsack,phuck,pimpis,pusse,pussy,scrotum,sh!t,shemale,shi+,sh!+,slut,smut,teets,tits,boobs,b00bs,teez,testical,testicle,titt,w00se,jackoff,wank,whoar,whore,dyke,fuck,shit,amcik,andskota,arse,assrammer,ayir,bi7ch,bitch,bollock,breasts,butt-pirate,cabron,cazzo,chraa,chuj,cunt,daygo,dego,dick,dike,dupa,dziwka,ejackulate,ekrem,enculer,fag,fanculo,fanny,feces,felcher,ficken,flikker,foreskin,fotze,futkretzn,gook,guiena,h4x0r,helvete,hoer,honkey,huevon,injun,jizz,kanker,klootzak,kraut,knulle,kuksuger,kurac,kurwa,kyrpa,lesbo,mamhoon,masturbat,merd,mibun,monkleigh,mouliewop,muie,mulkku,muschi,nazis,nepesaurio,nigger,orospu,paska,perse,picka,pierdol,pillu,pimmel,piss,pizda,poontsee,porn,p0rn,pr0n,preteen,pula,pule,puta,puto,qahbeh,queef,rautenberg,schaffer,scheiss,schlampe,schmuck,sh!t,sharmuta,sharmute,skurwysyn,sphencter,spierdalaj,splooge,suka,b00b,testicle,titt,twat,vittu,wank,wetback,wichser,zabourah`.split(`,`);

function Ul(e, t) {
    let n = e.toLowerCase().split(/[.,"/#!?$%^&*;:{}=\-_`~()\s\n]+/g).map(e => Vl(dc(e) ?? ``));
    return Hl.some(e => n.some(n => t === `word` ? n.startsWith(e) : n.includes(e)))
}

function Wl(e, t) {
    return t.refine(t => !Ul(t, e), e => ({
        message: `Disallowed word detected. Please remove it. If you believe this is a mistake, please contact us (${e}).`
    }))
}
var Gl = O.enum([`pending`, `accepted`, `blocked`]);
O.enum([`incoming`, `outgoing`]);
var Kl = O.object({
        _id: R,
        initiatorUid: R,
        initiatorName: O.string(),
        receiverUid: R,
        receiverName: O.string(),
        lastModified: O.number().int().nonnegative(),
        status: Gl
    }),
    ql = mc().max(16),
    Jl = O.literal(`none`),
    Yl = O.object({
        _id: R,
        name: ql,
        pb: O.object({
            no: O.boolean(),
            yes: O.boolean()
        }).strict(),
        difficulty: O.record(yc, O.boolean()),
        mode: O.record(Tc, O.boolean()),
        words: O.record(Sc.or(O.literal(`custom`)), O.boolean()),
        time: O.record(Cc.or(O.literal(`custom`)), O.boolean()),
        quoteLength: O.record(wc, O.boolean()),
        punctuation: O.object({
            on: O.boolean(),
            off: O.boolean()
        }).strict(),
        numbers: O.object({
            on: O.boolean(),
            off: O.boolean()
        }).strict(),
        date: O.object({
            last_day: O.boolean(),
            last_week: O.boolean(),
            last_month: O.boolean(),
            last_3months: O.boolean(),
            all: O.boolean()
        }).strict(),
        tags: O.record(R.or(Jl), O.boolean()),
        language: O.record(z, O.boolean()),
        funbox: O.record(Tl.or(Jl), O.boolean())
    }),
    Xl = O.number().min(-11).max(12).step(.5),
    Zl = O.object({
        lastResultTimestamp: O.number().int().nonnegative(),
        length: O.number().int().nonnegative(),
        maxLength: O.number().int().nonnegative(),
        hourOffset: Xl.optional()
    }).strict(),
    Ql = hc().max(16),
    $l = O.object({
        _id: R,
        name: Ql,
        personalBests: xc
    }).strict();

function eu(e) {
    return Wl(`word`, e).optional().transform(e => e === null ? void 0 : e)
}
var tu = eu(mc().max(15)).or(O.literal(``)),
    nu = eu(mc().max(39)).or(O.literal(``)),
    ru = eu(O.string().url().max(200).startsWith(`https://`)).or(O.literal(``)),
    iu = O.object({
        bio: eu(O.string().max(250)).or(O.literal(``)),
        keyboard: eu(O.string().max(75)).or(O.literal(``)),
        socialProfiles: O.object({
            twitter: tu,
            github: nu,
            website: ru
        }).strict().optional(),
        showActivityOnPublicProfile: O.boolean().optional()
    }).strict(),
    au = hc().max(16),
    ou = O.object({
        _id: R,
        name: au,
        colors: Sl
    }).strict(),
    su = O.object({
        startTimestamp: O.number().int().nonnegative(),
        expirationTimestamp: O.number().int().nonnegative().or(O.literal(-1).describe(`lifetime premium`))
    }),
    cu = O.record(z, O.record(fc.describe(`quoteId as string`), O.number().nonnegative())),
    lu = O.record(Tc, O.record(Ec, O.record(z, O.number().int().nonnegative()))),
    uu = O.object({
        rank: O.number().int().nonnegative().optional(),
        count: O.number().int().nonnegative()
    }),
    du = O.object({
        time: O.record(Ec, O.record(z, uu.optional()))
    }),
    fu = O.object({
        id: O.number().int().nonnegative(),
        selected: O.boolean().optional()
    }).strict(),
    pu = O.object({
        badges: O.array(fu)
    }).strict(),
    mu = O.boolean().describe(`Admin for all languages if true`).or(z.describe(`Admin for the given language`)),
    hu = O.object({
        testsByDays: O.array(O.number().int().nonnegative().or(O.null())).describe("Number of tests by day. Last element of the array is on the date `lastDay`. `null` means no tests on that day."),
        lastDay: O.number().int().nonnegative().describe(`Timestamp of the last day included in the test activity`)
    }).strict(),
    gu = O.record(fc.describe(`year`), O.array(O.number().int().nonnegative().nullable().describe(`number of tests, position in the array is the day of the year`))),
    _u = O.record(z, O.array(fc)),
    H = O.string().email(),
    vu = mc().min(1).max(16),
    yu = Wl(`substring`, vu),
    bu = O.object({
        name: yu,
        email: H,
        uid: O.string(),
        addedAt: O.number().int().nonnegative(),
        personalBests: xc,
        lastReultHashes: O.array(O.string()).optional(),
        completedTests: O.number().int().nonnegative().optional(),
        startedTests: O.number().int().nonnegative().optional(),
        timeTyping: O.number().nonnegative().optional().describe(`time typing in seconds`),
        streak: Zl.optional(),
        xp: O.number().int().nonnegative().optional(),
        discordId: O.string().optional(),
        discordAvatar: O.string().optional(),
        tags: O.array($l).optional(),
        profileDetails: iu.optional(),
        customThemes: O.array(ou).optional(),
        premium: su.optional(),
        isPremium: O.boolean().optional(),
        quoteRatings: cu.optional(),
        favoriteQuotes: _u.optional(),
        lbMemory: lu.optional(),
        allTimeLbs: du,
        inventory: pu.optional(),
        banned: O.boolean().optional(),
        lbOptOut: O.boolean().optional(),
        verified: O.boolean().optional(),
        needsToChangeName: O.boolean().optional(),
        quoteMod: mu.optional(),
        resultFilterPresets: O.array(Yl).optional(),
        testActivity: hu.optional()
    }),
    xu = O.object({
        completedTests: O.number().int().nonnegative().optional(),
        startedTests: O.number().int().nonnegative().optional(),
        timeTyping: O.number().int().nonnegative().optional()
    }),
    Su = bu.pick({
        uid: !0,
        name: !0,
        banned: !0,
        addedAt: !0,
        discordId: !0,
        discordAvatar: !0,
        xp: !0,
        lbOptOut: !0,
        isPremium: !0,
        inventory: !0,
        allTimeLbs: !0,
        testActivity: !0
    }).extend({
        typingStats: xu,
        personalBests: xc.pick({
            time: !0,
            words: !0
        }),
        streak: O.number().int().nonnegative(),
        maxStreak: O.number().int().nonnegative(),
        details: iu
    }).partial({
        inventory: !0,
        details: !0,
        allTimeLbs: !0,
        uid: !0
    }),
    Cu = O.enum([`xp`, `badge`]),
    wu = O.object({
        type: O.literal(Cu.enum.xp),
        item: O.number().int()
    }),
    Tu = O.object({
        type: O.literal(Cu.enum.badge),
        item: fu
    }),
    Eu = wu.or(Tu),
    Du = O.object({
        id: R,
        subject: O.string(),
        body: O.string(),
        timestamp: O.number().int().nonnegative(),
        read: O.boolean(),
        rewards: O.array(Eu)
    }),
    Ou = O.enum([`Inappropriate name`, `Inappropriate bio`, `Inappropriate social links`, `Suspected cheating`]),
    ku = O.string().min(8, {
        message: `must be at least 8 characters`
    }).max(64, {
        message: `must be at most 64 characters`
    }).regex(/[A-Z]/, {
        message: `must contain at least one capital letter`
    }).regex(/[\d]/, {
        message: `must contain at least one number`
    }).regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: `must contain at least one special character`
    }),
    Au = O.string().min(1, `Required`),
    ju = bu.pick({
        uid: !0,
        name: !0,
        discordId: !0,
        discordAvatar: !0,
        startedTests: !0,
        completedTests: !0,
        timeTyping: !0,
        xp: !0,
        banned: !0,
        lbOptOut: !0
    }).extend({
        connectionId: R.optional(),
        top15: bc.optional(),
        top60: bc.optional(),
        badgeId: O.number().int().optional(),
        isPremium: O.boolean().optional(),
        streak: Zl.pick({
            length: !0,
            maxLength: !0
        }).optional()
    }).merge(Kl.pick({
        lastModified: !0
    }).partial());
O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String));
var Mu = () => O.string().regex(/^[a-zA-Z0-9_]+$/),
    Nu = Mu();
Mu().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);

function Pu(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var Fu = O.enum(`Roboto_Mono.Noto_Naskh_Arabic.Source_Code_Pro.IBM_Plex_Sans.Inconsolata.Fira_Code.JetBrains_Mono.Roboto.Montserrat.Titillium_Web.Lexend_Deca.Comic_Sans_MS.Oxygen.Nunito.Itim.Courier.Comfortaa.Coming_Soon.Atkinson_Hyperlegible.Lato.Lalezar.Boon.Open_Dyslexic.Ubuntu.Ubuntu_Mono.Georgia.Cascadia_Mono.IBM_Plex_Mono.Overpass_Mono.Hack.CommitMono.Mononoki.Parkinsans.Geist.Sarabun.Kanit.Geist_Mono.Iosevka.Proto.Adwaita_Mono.Inter_Tight.Space_Grotesk.Noto_Sans_Lao`.split(`.`), {
    errorMap: Pu(`Must be a known font family`)
});
Fu.or(O.string().max(50).regex(/^[a-zA-Z0-9_\-+.]+$/));
var Iu = O.enum(`english.english_1k.english_5k.english_10k.english_25k.english_450k.english_commonly_misspelled.english_contractions.english_doubleletter.english_shakespearean.english_old.english_medical.spanish.spanish_1k.spanish_10k.spanish_650k.french.french_1k.french_2k.french_10k.french_600k.french_bitoduc.nepali.nepali_1k.nepali_romanized.sanskrit.sanskrit_roman.santali.azerbaijani.azerbaijani_1k.arabic.arabic_10k.arabic_egypt.arabic_egypt_1k.arabic_morocco.malagasy.malagasy_1k.malay.malay_1k.mongolian.mongolian_10k.kannada.korean.korean_1k.korean_5k.khmer.chinese_simplified.chinese_simplified_1k.chinese_simplified_5k.chinese_simplified_10k.chinese_simplified_50k.chinese_traditional.chinese_traditional_1k.chinese_traditional_5k.chinese_traditional_10k.chinese_traditional_50k.russian.russian_1k.russian_5k.russian_10k.russian_25k.russian_50k.russian_375k.russian_contractions.russian_contractions_1k.russian_abbreviations.ukrainian.ukrainian_1k.ukrainian_10k.ukrainian_50k.ukrainian_endings.ukrainian_latynka.ukrainian_latynka_1k.ukrainian_latynka_10k.ukrainian_latynka_50k.ukrainian_latynka_endings.portuguese.portuguese_acentos_e_cedilha.portuguese_1k.portuguese_3k.portuguese_5k.portuguese_320k.portuguese_550k.indonesian.indonesian_1k.indonesian_10k.kurdish_central.kurdish_central_2k.kurdish_central_4k.german.german_1k.german_10k.german_250k.swiss_german.swiss_german_1k.swiss_german_2k.afrikaans.afrikaans_1k.afrikaans_10k.georgian.tamil.tamil_1k.tanglish.tamil_old.telugu.telugu_1k.greek.greek_1k.greek_5k.greek_10k.greek_25k.greek_koine.greeklish.greeklish_1k.greeklish_5k.greeklish_10k.greeklish_25k.turkish.turkish_1k.turkish_5k.irish.irish_1k.italian.italian_1k.italian_7k.italian_60k.italian_280k.friulian.latin.galician.thai.thai_1k.thai_5k.thai_10k.thai_20k.thai_50k.thai_60k.polish.polish_2k.polish_5k.polish_10k.polish_20k.polish_40k.polish_200k.czech.czech_1k.czech_10k.slovak.slovak_1k.slovak_10k.slovenian.slovenian_1k.slovenian_5k.croatian.croatian_1k.dutch.dutch_1k.dutch_10k.filipino.filipino_1k.danish.danish_1k.danish_10k.hungarian.hungarian_1k.hungarian_2k.norwegian_bokmal.norwegian_bokmal_1k.norwegian_bokmal_5k.norwegian_bokmal_10k.norwegian_bokmal_150k.norwegian_bokmal_600k.norwegian_nynorsk.norwegian_nynorsk_1k.norwegian_nynorsk_5k.norwegian_nynorsk_10k.norwegian_nynorsk_100k.norwegian_nynorsk_400k.hebrew.hebrew_1k.hebrew_5k.hebrew_10k.icelandic.icelandic_1k.romanian.romanian_1k.romanian_5k.romanian_10k.romanian_25k.romanian_50k.romanian_100k.romanian_200k.lorem_ipsum.finnish.finnish_1k.finnish_10k.estonian.estonian_1k.estonian_5k.estonian_10k.udmurt.welsh.welsh_1k.persian.persian_1k.persian_5k.persian_20k.persian_romanized.marathi.kazakh.kazakh_1k.vietnamese.vietnamese_1k.vietnamese_5k.jyutping.pinyin.pinyin_1k.pinyin_10k.hausa.hausa_1k.bemba.bemba_1k.bemba_10k.swedish.swedish_1k.swedish_diacritics.serbian_latin.serbian_latin_10k.serbian.serbian_10k.yoruba_1k.swahili_1k.maori_1k.catalan.catalan_1k.lojban_gismu.lojban_cmavo.lithuanian.lithuanian_1k.lithuanian_3k.bulgarian.bulgarian_1k.bulgarian_latin.bulgarian_latin_1k.bangla.bangla_letters.bangla_10k.bosnian.bosnian_4k.toki_pona.toki_pona_ku_suli.toki_pona_ku_lili.esperanto.esperanto_1k.esperanto_10k.esperanto_25k.esperanto_36k.esperanto_x_sistemo.esperanto_x_sistemo_1k.esperanto_x_sistemo_10k.esperanto_x_sistemo_25k.esperanto_x_sistemo_36k.esperanto_h_sistemo.esperanto_h_sistemo_1k.esperanto_h_sistemo_10k.esperanto_h_sistemo_25k.esperanto_h_sistemo_36k.kyrgyz.kyrgyz_1k.urdu.urdu_1k.urdu_5k.urdu_roman.urdish.albanian.albanian_1k.shona.shona_1k.armenian.armenian_1k.armenian_western.armenian_western_1k.myanmar_burmese.japanese_hiragana.japanese_katakana.japanese_romaji.japanese_romaji_1k.sinhala.latvian.latvian_1k.maltese.maltese_1k.twitch_emotes.git.pig_latin.hindi.hindi_1k.hinglish.gujarati.gujarati_1k.macedonian.macedonian_1k.macedonian_10k.macedonian_75k.belarusian.belarusian_1k.belarusian_5k.belarusian_10k.belarusian_25k.belarusian_50k.belarusian_100k.belarusian_lacinka.belarusian_lacinka_1k.tatar.tatar_1k.tatar_5k.tatar_9k.tatar_crimean.tatar_crimean_1k.tatar_crimean_5k.tatar_crimean_10k.tatar_crimean_15k.tatar_crimean_cyrillic.tatar_crimean_cyrillic_1k.tatar_crimean_cyrillic_5k.tatar_crimean_cyrillic_10k.tatar_crimean_cyrillic_15k.uzbek.uzbek_1k.uzbek_70k.malayalam.amharic.amharic_1k.amharic_5k.oromo.oromo_1k.oromo_5k.wordle.league_of_legends.wordle_1k.typing_of_the_dead.yiddish.frisian.frisian_1k.pashto.euskera.klingon.klingon_1k.quenya.occitan.occitan_1k.occitan_2k.occitan_5k.occitan_10k.bashkir.zulu.kabyle.kabyle_1k.kabyle_2k.kabyle_5k.kabyle_10k.hawaiian.hawaiian_1k.code_python.code_python_1k.code_python_2k.code_python_5k.code_fsharp.code_c.code_csharp.code_css.code_c++.code_dart.code_brainfck.code_javascript.code_javascript_1k.code_javascript_react.code_jule.code_julia.code_haskell.code_html.code_nim.code_nix.code_pascal.code_java.code_kotlin.code_go.code_rockstar.code_rust.code_ruby.code_r.code_r_2k.code_swift.code_scala.code_bash.code_powershell.code_lua.code_luau.code_latex.code_typst.code_matlab.code_sql.code_perl.code_php.code_vim.code_vimscript.code_opencl.code_visual_basic.code_arduino.code_systemverilog.code_elixir.code_gleam.code_zig.code_gdscript.code_gdscript_2.code_assembly.code_v.code_ook.code_typescript.code_ocaml.code_odin.xhosa.xhosa_3k.tibetan.tibetan_1k.code_cobol.code_clojure.code_common_lisp.code_erlang.docker_file.code_fortran.viossa.viossa_njutro.code_abap.code_abap_1k.code_yoptascript.code_cuda.kinyarwanda.pokemon_1k.kokanu.likanu.code_vhdl.lao.code_6502_assembly.english_legal.sindhi`.split(`.`), {
    errorMap: Pu(`Must be a supported language`)
});
O.object({
    name: Iu,
    rightToLeft: O.boolean().optional(),
    noLazyMode: O.boolean().optional(),
    joiningScript: O.boolean().optional(),
    orderedByFrequency: O.boolean().optional(),
    words: O.array(O.string()).min(1),
    additionalAccents: O.array(O.tuple([O.string().min(1), O.string().min(1)])).optional(),
    bcp47: O.string().optional(),
    preferredFont: Fu.optional(),
    originalPunctuation: O.boolean().optional()
}).strict();
var Lu = O.number().int().nonnegative().or(O.string().regex(/^\d+$/).transform(Number)),
    Ru = O.object({
        id: Lu,
        text: O.string(),
        source: O.string(),
        length: O.number().int().positive(),
        approvedBy: O.string().describe(`The approvers name`)
    }),
    zu = O.object({
        _id: Nu,
        text: O.string(),
        source: O.string(),
        language: Iu,
        submittedBy: Nu.describe(`uid of the submitter`),
        timestamp: O.number().int().nonnegative(),
        approved: O.boolean()
    }),
    Bu = O.object({
        _id: Nu,
        language: Iu,
        quoteId: Lu,
        average: O.number().nonnegative(),
        ratings: O.number().int().nonnegative(),
        totalRating: O.number().nonnegative()
    }),
    Vu = O.enum([`Grammatical error`, `Duplicate quote`, `Inappropriate content`, `Low quality content`, `Incorrect source`]),
    Hu = O.object({
        id: O.number(),
        text: O.string(),
        britishText: O.string().optional(),
        source: O.string(),
        length: O.number(),
        approvedBy: O.string().optional()
    }).strict();
O.object({
    language: Iu,
    groups: O.array(O.tuple([O.number(), O.number()])).length(4),
    quotes: O.array(Hu)
}).strict(), O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String));
var Uu = () => O.string().regex(/^[a-zA-Z0-9_]+$/),
    Wu = Uu();
Uu().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]), O.number().int().safe().nonnegative().default(0);
var Gu = O.enum([`pending`, `accepted`, `blocked`]),
    Ku = O.enum([`incoming`, `outgoing`]),
    qu = O.object({
        _id: Wu,
        initiatorUid: Wu,
        initiatorName: O.string(),
        receiverUid: Wu,
        receiverName: O.string(),
        lastModified: O.number().int().nonnegative(),
        status: Gu
    }),
    U = O.object({
        message: O.string()
    }),
    Ju = U.extend({
        validationErrors: O.array(O.string())
    }),
    W = U,
    Yu = W.extend({
        errorId: O.string(),
        uid: O.string().optional()
    });

function G(e) {
    return U.extend({
        data: e.nullable()
    })
}

function K(e) {
    return U.extend({
        data: e
    })
}
var q = {
        400: W.describe(`Generic client error`),
        401: W.describe(`Authentication required but not provided or invalid`),
        403: W.describe(`Operation not permitted`),
        422: Ju.describe(`Request validation failed`),
        429: W.describe(`Rate limit exceeded`),
        470: W.describe(`Invalid ApeKey`),
        471: W.describe(`ApeKey is inactive`),
        472: W.describe(`ApeKey is malformed`),
        479: W.describe(`ApeKey rate limit exceeded`),
        500: Yu.describe(`Generic server error`),
        503: Yu.describe(`Endpoint disabled or server is under maintenance`)
    },
    Xu = O.object({
        uid: M
    }).strict(),
    Zu = O.object({
        uid: M
    }).strict(),
    Qu = K(O.object({
        banned: O.boolean()
    })).strict(),
    $u = O.object({
        reports: O.array(O.object({
            reportId: O.string()
        }).strict()).nonempty()
    }).strict(),
    ed = O.object({
        reports: O.array(O.object({
            reportId: O.string(),
            reason: O.string().optional()
        }).strict()).nonempty()
    }).strict(),
    td = O.object({
        email: O.string().email()
    }).strict(),
    nd = j().router({
        test: {
            summary: `test permission`,
            description: `Check for admin permission for the current user`,
            method: `GET`,
            path: ``,
            responses: {
                200: U
            }
        },
        toggleBan: {
            summary: `toggle user ban`,
            description: `Ban an unbanned user or unban a banned user.`,
            method: `POST`,
            path: `/toggleBan`,
            body: Xu,
            responses: {
                200: Qu
            }
        },
        clearStreakHourOffset: {
            summary: `clear streak hour offset`,
            description: `Clear the streak hour offset for a user`,
            method: `POST`,
            path: `/clearStreakHourOffset`,
            body: Zu,
            responses: {
                200: U
            }
        },
        acceptReports: {
            summary: `accept reports`,
            description: `Accept one or many reports`,
            method: `POST`,
            path: `/report/accept`,
            body: $u,
            responses: {
                200: U
            }
        },
        rejectReports: {
            summary: `reject reports`,
            description: `Reject one or many reports`,
            method: `POST`,
            path: `/report/reject`,
            body: ed,
            responses: {
                200: U
            }
        },
        sendForgotPasswordEmail: {
            summary: `send forgot password email`,
            description: `Send a forgot password email to the given user email`,
            method: `POST`,
            path: `/sendForgotPasswordEmail`,
            body: td,
            responses: {
                200: U
            }
        }
    }, {
        pathPrefix: `/admin`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `admin`,
            authenticationOptions: {
                noCache: !0
            },
            rateLimit: `adminLimit`,
            requirePermission: `admin`,
            requireConfiguration: {
                path: `admin.endpointsEnabled`,
                invalidMessage: `Admin endpoints are currently disabled.`
            }
        },
        commonResponses: q
    }),
    rd = K(hi),
    id = pi,
    ad = K(O.object({
        apeKeyId: M,
        apeKey: O.string().base64(),
        apeKeyDetails: mi
    })),
    od = id.partial(),
    sd = O.object({
        apeKeyId: M
    }),
    cd = j(),
    ld = cd.router({
        get: {
            summary: `get ape keys`,
            description: `Get ape keys of the current user.`,
            method: `GET`,
            path: ``,
            responses: {
                200: rd
            },
            metadata: {
                rateLimit: `apeKeysGet`
            }
        },
        add: {
            summary: `add ape key`,
            description: `Add an ape key for the current user.`,
            method: `POST`,
            path: ``,
            body: id.strict(),
            responses: {
                200: ad
            },
            metadata: {
                rateLimit: `apeKeysGenerate`
            }
        },
        save: {
            summary: `update ape key`,
            description: `Update an existing ape key for the current user.`,
            method: `PATCH`,
            path: `/:apeKeyId`,
            pathParams: sd,
            body: od.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `apeKeysGenerate`
            }
        },
        delete: {
            summary: `delete ape key`,
            description: `Delete ape key by id.`,
            method: `DELETE`,
            path: `/:apeKeyId`,
            pathParams: sd,
            body: cd.noBody(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `apeKeysGenerate`
            }
        }
    }, {
        pathPrefix: `/ape-keys`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `ape-keys`,
            requirePermission: `canManageApeKeys`,
            requireConfiguration: {
                path: `apeKeys.endpointsEnabled`,
                invalidMessage: `ApeKeys are currently disabled.`
            }
        },
        commonResponses: q
    }),
    ud = G(Ir),
    dd = j(),
    fd = dd.router({
        get: {
            summary: `get config`,
            description: `Get config of the current user.`,
            method: `GET`,
            path: ``,
            responses: {
                200: ud
            },
            metadata: {
                rateLimit: `configGet`
            }
        },
        save: {
            summary: `update config`,
            description: `Update the config of the current user. Only provided values will be updated while the missing values will be unchanged.`,
            method: `PATCH`,
            path: ``,
            body: Ir.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `configUpdate`
            }
        },
        delete: {
            summary: `delete config`,
            description: `Delete/reset the config for the current user.`,
            method: `DELETE`,
            path: ``,
            body: dd.noBody(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `configDelete`
            }
        }
    }, {
        pathPrefix: `/configs`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `configs`
        },
        commonResponses: q
    }),
    pd = K(O.array(Ka)),
    md = Ka.omit({
        _id: !0
    }),
    hd = K(O.object({
        presetId: M
    })),
    gd = O.object({
        presetId: M
    }),
    _d = j(),
    vd = _d.router({
        get: {
            summary: `get presets`,
            description: `Get presets of the current user.`,
            method: `GET`,
            path: ``,
            responses: {
                200: pd
            },
            metadata: {
                rateLimit: `presetsGet`
            }
        },
        add: {
            summary: `add preset`,
            description: `Add a new preset for the current user.`,
            method: `POST`,
            path: ``,
            body: md.strict(),
            responses: {
                200: hd
            },
            metadata: {
                rateLimit: `presetsAdd`
            }
        },
        save: {
            summary: `update preset`,
            description: `Update an existing preset for the current user.`,
            method: `PATCH`,
            path: ``,
            body: qa.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `presetsEdit`
            }
        },
        delete: {
            summary: `delete preset`,
            description: `Delete preset by id.`,
            method: `DELETE`,
            path: `/:presetId`,
            pathParams: gd,
            body: _d.noBody(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `presetsRemove`
            }
        }
    }, {
        pathPrefix: `/presets`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `presets`
        },
        commonResponses: q
    }),
    yd = K(O.array(Xa)),
    bd = j().router({
        get: {
            summary: `get psas`,
            description: `Get list of public service announcements`,
            method: `GET`,
            path: ``,
            responses: {
                200: yd
            }
        }
    }, {
        pathPrefix: `/psas`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `psas`,
            authenticationOptions: {
                isPublic: !0
            },
            rateLimit: `psaGet`
        },
        commonResponses: q
    }),
    xd = O.object({
        language: F,
        mode: lo,
        mode2: uo
    }).strict(),
    Sd = K($a),
    Cd = K(eo),
    wd = j().router({
        getSpeedHistogram: {
            summary: `get speed histogram`,
            description: `get number of users personal bests grouped by wpm level (multiples of ten)`,
            method: `GET`,
            path: `/speedHistogram`,
            query: xd,
            responses: {
                200: Sd
            }
        },
        getTypingStats: {
            summary: `get typing stats`,
            description: `get number of tests and time users spend typing.`,
            method: `GET`,
            path: `/typingStats`,
            responses: {
                200: Cd
            }
        }
    }, {
        pathPrefix: `/public`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `public`,
            authenticationOptions: {
                isPublic: !0
            },
            rateLimit: `publicStatsGet`
        },
        commonResponses: q
    }),
    Td = O.object({
        language: F,
        mode: lo,
        mode2: uo
    }),
    Ed = O.object({
        page: ci,
        pageSize: O.number().int().safe().positive().min(10).max(200).default(50)
    }),
    Dd = O.object({
        friendsOnly: O.boolean().optional().describe(`include only users from your friends list, defaults to false.`)
    }),
    Od = O.object({
        count: O.number().int().nonnegative(),
        pageSize: O.number().int().positive()
    }),
    kd = Td.merge(Ed).merge(Dd),
    Ad = K(Od.extend({
        entries: O.array(go)
    })),
    jd = Td.merge(Dd),
    Md = G(go),
    Nd = Td.extend({
        daysBefore: O.literal(1).optional()
    }).merge(Dd),
    Pd = Nd.merge(Ed),
    Fd = K(Od.extend({
        entries: O.array(go),
        minWpm: O.number().nonnegative()
    })),
    Id = Nd,
    Ld = G(go),
    Rd = O.object({
        weeksBefore: O.literal(1).optional()
    }).merge(Dd),
    zd = Rd.merge(Ed),
    Bd = K(Od.extend({
        entries: O.array(yo)
    })),
    Vd = Rd,
    Hd = G(yo),
    Ud = j().router({
        get: {
            summary: `get leaderboard`,
            description: `Get all-time leaderboard.`,
            method: `GET`,
            path: ``,
            query: kd.strict(),
            responses: {
                200: Ad,
                404: W
            },
            metadata: {
                authenticationOptions: {
                    isPublic: !0
                }
            }
        },
        getRank: {
            summary: `get leaderboard rank`,
            description: `Get the rank of the current user on the all-time leaderboard`,
            method: `GET`,
            path: `/rank`,
            query: jd.strict(),
            responses: {
                200: Md
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                }
            }
        },
        getDaily: {
            summary: `get daily leaderboard`,
            description: `Get daily leaderboard.`,
            method: `GET`,
            path: `/daily`,
            query: Pd.strict(),
            responses: {
                200: Fd
            },
            metadata: {
                authenticationOptions: {
                    isPublic: !0
                },
                requireConfiguration: {
                    path: `dailyLeaderboards.enabled`,
                    invalidMessage: `Daily leaderboards are not available at this time.`
                }
            }
        },
        getDailyRank: {
            summary: `get daily leaderboard rank`,
            description: `Get the rank of the current user on the daily leaderboard`,
            method: `GET`,
            path: `/daily/rank`,
            query: Id.strict(),
            responses: {
                200: Ld
            },
            metadata: {
                requireConfiguration: {
                    path: `dailyLeaderboards.enabled`,
                    invalidMessage: `Daily leaderboards are not available at this time.`
                }
            }
        },
        getWeeklyXp: {
            summary: `get weekly xp leaderboard`,
            description: `Get weekly xp leaderboard`,
            method: `GET`,
            path: `/xp/weekly`,
            query: zd.strict(),
            responses: {
                200: Bd
            },
            metadata: {
                authenticationOptions: {
                    isPublic: !0
                },
                requireConfiguration: {
                    path: `leaderboards.weeklyXp.enabled`,
                    invalidMessage: `Weekly XP leaderboards are not available at this time.`
                }
            }
        },
        getWeeklyXpRank: {
            summary: `get weekly xp leaderboard rank`,
            description: `Get the rank of the current user on the weekly xp leaderboard`,
            method: `GET`,
            path: `/xp/weekly/rank`,
            query: Vd.strict(),
            responses: {
                200: Hd
            },
            metadata: {
                requireConfiguration: {
                    path: `leaderboards.weeklyXp.enabled`,
                    invalidMessage: `Weekly XP leaderboards are not available at this time.`
                }
            }
        }
    }, {
        pathPrefix: `/leaderboards`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `leaderboards`,
            rateLimit: `leaderboardsGet`
        },
        commonResponses: q
    }),
    Wd = O.object({
        onOrAfterTimestamp: O.number().int().min(15894288e5).optional().describe(`Timestamp of the earliest result to fetch. If omitted the most recent results are fetched.`),
        offset: O.number().int().nonnegative().optional().describe(`Offset of the item at which to begin the response.`),
        limit: O.number().int().nonnegative().max(1e3).optional().describe(`Limit results to the given amount.`)
    }),
    Gd = K(O.array(ic)),
    Kd = O.object({
        resultId: M
    }),
    qd = K(rc),
    Jd = O.object({
        result: ac
    }),
    Yd = K(sc),
    Xd = O.object({
        tagIds: O.array(M),
        resultId: M
    }),
    Zd = K(O.object({
        tagPbs: O.array(M)
    })),
    Qd = K(rc),
    $d = j(),
    ef = $d.router({
        get: {
            summary: `get results`,
            description: `Gets up to 1000 results`,
            method: `GET`,
            path: ``,
            query: Wd.strict(),
            responses: {
                200: Gd
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                },
                rateLimit: {
                    normal: `resultsGet`,
                    apeKey: `resultsGetApe`
                }
            }
        },
        getById: {
            summary: `get result by id`,
            description: `Get result by id`,
            method: `GET`,
            path: `/id/:resultId`,
            pathParams: Kd,
            responses: {
                200: qd
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                },
                rateLimit: {
                    normal: `resultByIdGet`,
                    apeKey: `resultByIdGetApe`
                }
            }
        },
        add: {
            summary: `add result`,
            description: `Add a test result for the current user`,
            method: `POST`,
            path: ``,
            body: Jd.strict(),
            responses: {
                200: Yd,
                460: W.describe(`Test too short`),
                461: W.describe(`Result hash invalid`),
                462: W.describe(`Result spacing invalid`),
                463: W.describe(`Result data invalid`),
                464: W.describe(`Missing key data`),
                465: W.describe(`Bot detected`),
                466: W.describe(`Duplicate result`)
            },
            metadata: {
                rateLimit: `resultsAdd`,
                requireConfiguration: {
                    path: `results.savingEnabled`,
                    invalidMessage: `Results are not being saved at this time.`
                }
            }
        },
        updateTags: {
            summary: `update result tags`,
            description: `Labels a result with the specified tags`,
            method: `PATCH`,
            path: `/tags`,
            body: Xd.strict(),
            responses: {
                200: Zd
            },
            metadata: {
                rateLimit: `resultsTagsUpdate`
            }
        },
        deleteAll: {
            summary: `delete all results`,
            description: `Delete all results for the current user`,
            method: `DELETE`,
            path: ``,
            body: $d.noBody(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0
                },
                rateLimit: `resultsDeleteAll`
            }
        },
        getLast: {
            summary: `get last result`,
            description: `Gets a user's last saved result`,
            path: `/last`,
            method: `GET`,
            responses: {
                200: Qd
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                },
                rateLimit: `resultsGet`
            }
        }
    }, {
        pathPrefix: `/results`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `results`
        },
        commonResponses: q
    }),
    tf = K(uc),
    nf = uc.deepPartial(),
    rf = O.object({
        configuration: nf.strict()
    }).strict(),
    af = K(O.object({})),
    of = j().router({
        get: {
            summary: `get configuration`,
            description: `Get server configuration`,
            method: `GET`,
            path: ``,
            responses: {
                200: tf
            },
            metadata: {
                authenticationOptions: {
                    isPublic: !0
                }
            }
        },
        update: {
            summary: `update configuration`,
            description: `Update the server configuration. Only provided values will be updated while the missing values will be unchanged.`,
            method: `PATCH`,
            path: ``,
            body: rf,
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    noCache: !0,
                    isPublicOnDev: !0
                },
                rateLimit: `adminLimit`,
                requirePermission: `admin`
            }
        },
        getSchema: {
            summary: `get configuration schema`,
            description: `Get schema definition of the server configuration.`,
            method: `GET`,
            path: `/schema`,
            responses: {
                200: af
            },
            metadata: {
                authenticationOptions: {
                    isPublicOnDev: !0,
                    noCache: !0
                },
                rateLimit: `adminLimit`,
                requirePermission: `admin`
            }
        }
    }, {
        pathPrefix: `/configuration`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `configuration`
        },
        commonResponses: q
    }),
    sf = O.object({
        username: O.string(),
        createUser: O.boolean().optional().describe("If `true` create user with <username>@example.com and password `password`. If false user has to exist."),
        firstTestTimestamp: O.number().int().nonnegative().optional(),
        lastTestTimestamp: O.number().int().nonnegative().optional(),
        minTestsPerDay: O.number().int().nonnegative().optional(),
        maxTestsPerDay: O.number().int().nonnegative().optional()
    }),
    cf = K(O.object({
        uid: M,
        email: O.string().email()
    })),
    lf = O.object({
        rewardType: O.enum([`xp`, `badge`, `none`])
    }),
    uf = j().router({
        generateData: {
            summary: `generate data`,
            description: `Generate test results for the given user.`,
            method: `POST`,
            path: `/generateData`,
            body: sf.strict(),
            responses: {
                200: cf
            }
        },
        addDebugInboxItem: {
            summary: `add debug inbox item`,
            description: `Add a debug inbox item with optional reward.`,
            method: `POST`,
            path: `/addDebugInboxItem`,
            body: lf.strict(),
            responses: {
                200: U
            },
            metadata: {
                openApiTags: `development`
            }
        }
    }, {
        pathPrefix: `/dev`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `development`,
            authenticationOptions: {
                isPublicOnDev: !0
            }
        },
        commonResponses: q
    }),
    df = K(bu.extend({
        inboxUnreadSize: O.number().int().nonnegative()
    })),
    ff = O.object({
        email: H.optional(),
        name: yu,
        uid: O.string().optional(),
        captcha: O.string()
    }),
    pf = O.object({
        name: yu
    }),
    mf = K(O.object({
        available: O.boolean()
    })),
    hf = O.object({
        name: yu
    }),
    gf = O.object({
        mode: lo,
        mode2: uo,
        language: F,
        rank: O.number().int().nonnegative()
    }),
    _f = O.object({
        newEmail: H,
        previousEmail: H
    }),
    vf = O.object({
        newPassword: O.string().min(6)
    }),
    yf = O.object({
        mode: lo,
        mode2: uo.optional()
    }),
    bf = G(so),
    xf = Yl,
    Sf = K(M.describe(`Id of the created result filter preset`)),
    Cf = O.object({
        presetId: M
    }),
    wf = K(O.array($l)),
    Tf = O.object({
        tagName: Ql
    }),
    Ef = K($l),
    Df = O.object({
        tagId: M,
        newName: Ql
    }),
    Of = O.object({
        tagId: M
    }),
    kf = K(O.array(ou)),
    Af = O.object({
        name: au,
        colors: vr
    }),
    jf = K(ou.pick({
        _id: !0,
        name: !0
    })),
    Mf = O.object({
        themeId: M
    }),
    Nf = O.object({
        themeId: M,
        theme: ou.pick({
            name: !0,
            colors: !0
        })
    }),
    Pf = K(O.object({
        url: O.string().url()
    })),
    Ff = O.object({
        tokenType: O.string(),
        accessToken: O.string(),
        state: O.string().length(20)
    }),
    If = K(bu.pick({
        discordId: !0,
        discordAvatar: !0
    })),
    Lf = K(bu.pick({
        completedTests: !0,
        startedTests: !0,
        timeTyping: !0
    })),
    Rf = O.object({
        hourOffset: Xl
    }),
    zf = K(_u),
    Bf = O.object({
        language: F,
        quoteId: ai
    }),
    Vf = O.object({
        language: F,
        quoteId: ai
    }),
    Hf = O.object({
        uidOrName: O.string()
    }),
    Uf = O.object({
        isUid: O.string().length(0).transform(e => e === ``).or(O.boolean()).default(!1)
    }),
    Wf = K(Su),
    Gf = iu.extend({
        selectedBadgeId: O.number().int().nonnegative().optional().or(O.literal(-1).describe(`no badge selected`))
    }),
    Kf = K(iu),
    qf = K(O.object({
        inbox: O.array(Du),
        maxMail: O.number().int()
    })),
    Jf = O.object({
        mailIdsToDelete: O.array(O.string().uuid()).min(1).optional(),
        mailIdsToMarkRead: O.array(O.string().uuid()).min(1).optional()
    }),
    Yf = O.string().regex(/^([.]|[^/<>])+$/).max(250).optional().or(O.string().length(0)),
    Xf = O.object({
        uid: O.string(),
        reason: Ou,
        comment: Yf,
        captcha: O.string()
    }),
    Zf = O.object({
        captcha: O.string(),
        email: H
    }),
    Qf = G(gu),
    $f = G(hu),
    ep = G(Zl),
    tp = K(O.array(ju)),
    J = j(),
    np = J.router({
        get: {
            summary: `get user`,
            description: `Get a user's data.`,
            method: `GET`,
            path: ``,
            responses: {
                200: df
            },
            metadata: {
                rateLimit: `userGet`
            }
        },
        create: {
            summary: `create user`,
            description: `Creates a new user`,
            method: `POST`,
            path: `/signup`,
            body: ff.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userSignup`,
                requireConfiguration: {
                    path: `users.signUp`,
                    invalidMessage: `Sign up is temporarily disabled`
                }
            }
        },
        getNameAvailability: {
            summary: `check name`,
            description: `Checks to see if a username is available`,
            method: `GET`,
            path: `/checkName/:name`,
            pathParams: pf.strict(),
            responses: {
                200: mf
            },
            metadata: {
                authenticationOptions: {
                    isPublic: !0
                },
                rateLimit: `userCheckName`
            }
        },
        delete: {
            summary: `delete user`,
            description: `Deletes a user's account`,
            method: `DELETE`,
            path: ``,
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0
                },
                rateLimit: `userDelete`
            }
        },
        reset: {
            summary: `reset user`,
            description: `Completely resets a user's account to a blank state`,
            method: `PATCH`,
            path: `/reset`,
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0
                },
                rateLimit: `userReset`
            }
        },
        updateName: {
            summary: `update username`,
            description: `Updates a user's name`,
            method: `PATCH`,
            path: `/name`,
            body: hf.strict(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0
                },
                rateLimit: `userUpdateName`
            }
        },
        updateLeaderboardMemory: {
            summary: `update lbMemory`,
            description: `Updates a user's cached leaderboard state`,
            method: `PATCH`,
            path: `/leaderboardMemory`,
            body: gf.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userUpdateLBMemory`
            }
        },
        updateEmail: {
            summary: `update email`,
            description: `Updates a user's email`,
            method: `PATCH`,
            path: `/email`,
            body: _f.strict(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0
                },
                rateLimit: `userUpdateEmail`
            }
        },
        updatePassword: {
            summary: `update password`,
            description: `Updates a user's password`,
            method: `PATCH`,
            path: `/password`,
            body: vf.strict(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0
                },
                rateLimit: `userUpdateEmail`
            }
        },
        getPersonalBests: {
            summary: `get personal bests`,
            description: `Get user's personal bests`,
            method: `GET`,
            path: `/personalBests`,
            query: yf.strict(),
            responses: {
                200: bf
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                },
                rateLimit: `userGet`
            }
        },
        deletePersonalBests: {
            summary: `delete personal bests`,
            description: `Deletes a user's personal bests`,
            method: `DELETE`,
            path: `/personalBests`,
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0
                },
                rateLimit: `userClearPB`
            }
        },
        optOutOfLeaderboards: {
            summary: `leaderboards opt out`,
            description: `Opt out of the leaderboards`,
            method: `POST`,
            path: `/optOutOfLeaderboards`,
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0
                },
                rateLimit: `userOptOutOfLeaderboards`
            }
        },
        addResultFilterPreset: {
            summary: `add result filter preset`,
            description: `Add a result filter preset`,
            method: `POST`,
            path: `/resultFilterPresets`,
            body: xf.strict(),
            responses: {
                200: Sf
            },
            metadata: {
                rateLimit: `userCustomFilterAdd`,
                requireConfiguration: {
                    path: `results.filterPresets.enabled`,
                    invalidMessage: `Result filter presets are not available at this time.`
                }
            }
        },
        removeResultFilterPreset: {
            summary: `remove result filter preset`,
            description: `Remove a result filter preset`,
            method: `DELETE`,
            path: `/resultFilterPresets/:presetId`,
            pathParams: Cf.strict(),
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userCustomFilterRemove`,
                requireConfiguration: {
                    path: `results.filterPresets.enabled`,
                    invalidMessage: `Result filter presets are not available at this time.`
                }
            }
        },
        getTags: {
            summary: `get tags`,
            description: `Get the users tags`,
            method: `GET`,
            path: `/tags`,
            responses: {
                200: wf
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                },
                rateLimit: `userTagsGet`
            }
        },
        createTag: {
            summary: `add tag`,
            description: `Add a tag for the current user`,
            method: `POST`,
            path: `/tags`,
            body: Tf.strict(),
            responses: {
                200: Ef
            },
            metadata: {
                rateLimit: `userTagsAdd`
            }
        },
        editTag: {
            summary: `edit tag`,
            description: `Edit a tag`,
            method: `PATCH`,
            path: `/tags`,
            body: Df.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userTagsEdit`
            }
        },
        deleteTag: {
            summary: `delete tag`,
            description: `Delete a tag`,
            method: `DELETE`,
            path: `/tags/:tagId`,
            pathParams: Of.strict(),
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userTagsRemove`
            }
        },
        deleteTagPersonalBest: {
            summary: `delete tag PBs`,
            description: `Delete personal bests of a tag`,
            method: `DELETE`,
            path: `/tags/:tagId/personalBest`,
            pathParams: Of.strict(),
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userTagsClearPB`
            }
        },
        getCustomThemes: {
            summary: `get custom themes`,
            description: `Get custom themes for the current user`,
            method: `GET`,
            path: `/customThemes`,
            responses: {
                200: kf
            },
            metadata: {
                rateLimit: `userCustomThemeGet`
            }
        },
        addCustomTheme: {
            summary: `add custom themes`,
            description: `Add a custom theme for the current user`,
            method: `POST`,
            path: `/customThemes`,
            body: Af.strict(),
            responses: {
                200: jf
            },
            metadata: {
                rateLimit: `userCustomThemeAdd`
            }
        },
        deleteCustomTheme: {
            summary: `delete custom themes`,
            description: `Delete a custom theme`,
            method: `DELETE`,
            path: `/customThemes`,
            body: Mf.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userCustomThemeRemove`
            }
        },
        editCustomTheme: {
            summary: `edit custom themes`,
            description: `Edit a custom theme`,
            method: `PATCH`,
            path: `/customThemes`,
            body: Nf.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userCustomThemeEdit`
            }
        },
        getDiscordOAuth: {
            summary: `discord oauth`,
            description: `Start OAuth authentication with discord`,
            method: `GET`,
            path: `/discord/oauth`,
            responses: {
                200: Pf
            },
            metadata: {
                rateLimit: `userDiscordLink`,
                requireConfiguration: {
                    path: `users.discordIntegration.enabled`,
                    invalidMessage: `Discord integration is not available at this time`
                }
            }
        },
        linkDiscord: {
            summary: `link with discord`,
            description: `Links a user's account with a discord account`,
            method: `POST`,
            path: `/discord/link`,
            body: Ff.strict(),
            responses: {
                200: If
            },
            metadata: {
                rateLimit: `userDiscordLink`,
                requireConfiguration: {
                    path: `users.discordIntegration.enabled`,
                    invalidMessage: `Discord integration is not available at this time`
                }
            }
        },
        unlinkDiscord: {
            summary: `unlink discord`,
            description: `Unlinks a user's account with a discord account`,
            method: `POST`,
            path: `/discord/unlink`,
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userDiscordUnlink`
            }
        },
        getStats: {
            summary: `get stats`,
            description: `Gets a user's typing stats data`,
            method: `GET`,
            path: `/stats`,
            responses: {
                200: Lf
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                },
                rateLimit: `userGet`
            }
        },
        setStreakHourOffset: {
            summary: `set streak hour offset`,
            description: `Sets a user's streak hour offset`,
            method: `POST`,
            path: `/setStreakHourOffset`,
            body: Rf.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `setStreakHourOffset`
            }
        },
        getFavoriteQuotes: {
            summary: `get favorite quotes`,
            description: `Gets a user's favorite quotes`,
            method: `GET`,
            path: `/favoriteQuotes`,
            responses: {
                200: zf
            },
            metadata: {
                rateLimit: `quoteFavoriteGet`
            }
        },
        addQuoteToFavorites: {
            summary: `add favorite quotes`,
            description: `Add a quote to the user's favorite quotes`,
            method: `POST`,
            path: `/favoriteQuotes`,
            body: Bf.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `quoteFavoritePost`
            }
        },
        removeQuoteFromFavorites: {
            summary: `remove favorite quotes`,
            description: `Remove a quote to the user's favorite quotes`,
            method: `DELETE`,
            path: `/favoriteQuotes`,
            body: Vf.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `quoteFavoriteDelete`
            }
        },
        getProfile: {
            summary: `get profile`,
            description: `Gets a user's profile`,
            method: `GET`,
            path: `/:uidOrName/profile`,
            pathParams: Hf.strict(),
            query: Uf.strict(),
            responses: {
                200: Wf,
                404: W.describe(`User not found`)
            },
            metadata: {
                authenticationOptions: {
                    isPublic: !0
                },
                rateLimit: `userProfileGet`,
                requireConfiguration: {
                    path: `users.profiles.enabled`,
                    invalidMessage: `Profiles are not available at this time`
                }
            }
        },
        updateProfile: {
            summary: `update profile`,
            description: `Update a user's profile`,
            method: `PATCH`,
            path: `/profile`,
            body: Gf.strict(),
            responses: {
                200: Kf
            },
            metadata: {
                rateLimit: `userProfileUpdate`,
                requireConfiguration: {
                    path: `users.profiles.enabled`,
                    invalidMessage: `Profiles are not available at this time`
                }
            }
        },
        getInbox: {
            summary: `get inbox`,
            description: `Gets the user's inbox`,
            method: `GET`,
            path: `/inbox`,
            responses: {
                200: qf
            },
            metadata: {
                rateLimit: `userMailGet`,
                requireConfiguration: {
                    path: `users.inbox.enabled`,
                    invalidMessage: `Your inbox is not available at this time.`
                }
            }
        },
        updateInbox: {
            summary: `update inbox`,
            description: `Updates the user's inbox`,
            method: `PATCH`,
            body: Jf.strict(),
            path: `/inbox`,
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `userMailUpdate`,
                requireConfiguration: {
                    path: `users.inbox.enabled`,
                    invalidMessage: `Your inbox is not available at this time.`
                }
            }
        },
        report: {
            summary: `report user`,
            description: `Report a user`,
            method: `POST`,
            path: `/report`,
            body: Xf.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `quoteReportSubmit`,
                requirePermission: `canReport`,
                requireConfiguration: {
                    path: `quotes.reporting.enabled`,
                    invalidMessage: `User reporting is unavailable.`
                }
            }
        },
        verificationEmail: {
            summary: `send verification email`,
            description: `Send a verification email`,
            method: `GET`,
            path: `/verificationEmail`,
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    noCache: !0
                },
                rateLimit: `userRequestVerificationEmail`
            }
        },
        forgotPasswordEmail: {
            summary: `send forgot password email`,
            description: `Send a forgot password email`,
            method: `POST`,
            path: `/forgotPasswordEmail`,
            body: Zf.strict(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    isPublic: !0
                },
                rateLimit: `userForgotPasswordEmail`
            }
        },
        revokeAllTokens: {
            summary: `revoke all tokens`,
            description: `Revoke all tokens for the current user.`,
            method: `POST`,
            path: `/revokeAllTokens`,
            body: J.noBody(),
            responses: {
                200: U
            },
            metadata: {
                authenticationOptions: {
                    requireFreshToken: !0,
                    noCache: !0
                },
                rateLimit: `userRevokeAllTokens`
            }
        },
        getTestActivity: {
            summary: `get test activity`,
            description: `Get user's test activity`,
            method: `GET`,
            path: `/testActivity`,
            responses: {
                200: Qf
            },
            metadata: {
                rateLimit: `userTestActivity`
            }
        },
        getCurrentTestActivity: {
            summary: `get current test activity`,
            description: `Get test activity for the last up to 372 days for the current user `,
            method: `GET`,
            path: `/currentTestActivity`,
            responses: {
                200: $f
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                },
                rateLimit: `userCurrentTestActivity`
            }
        },
        getStreak: {
            summary: `get streak`,
            description: `Get user's streak data`,
            method: `GET`,
            path: `/streak`,
            responses: {
                200: ep
            },
            metadata: {
                authenticationOptions: {
                    acceptApeKeys: !0
                },
                rateLimit: `userStreak`
            }
        },
        getFriends: {
            summary: `get friends`,
            description: `get friends list`,
            method: `GET`,
            path: `/friends`,
            responses: {
                200: tp
            },
            metadata: {
                rateLimit: `userFriendGet`,
                requireConfiguration: {
                    path: `connections.enabled`,
                    invalidMessage: `Connections are not available at this time.`
                }
            }
        }
    }, {
        pathPrefix: `/users`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `users`
        },
        commonResponses: q
    }),
    rp = K(O.array(zu)),
    ip = K(O.object({
        isEnabled: O.boolean()
    })),
    ap = O.string().min(60),
    op = O.object({
        text: ap,
        source: O.string(),
        language: F,
        captcha: O.string()
    }),
    sp = O.object({
        quoteId: M,
        editText: si,
        editSource: si
    }),
    cp = K(Ru),
    lp = O.object({
        quoteId: M
    }),
    up = O.object({
        quoteId: Lu,
        language: F
    }),
    dp = G(Bu),
    fp = O.object({
        quoteId: Lu,
        language: F,
        rating: O.number().int().min(1).max(5)
    }),
    pp = O.object({
        quoteId: Lu,
        quoteLanguage: F,
        reason: Vu,
        comment: O.string().regex(/^([.]|[^/<>])+$/).max(250).optional().or(O.string().length(0)),
        captcha: O.string()
    }),
    mp = j().router({
        get: {
            summary: `get quote submissions`,
            description: `Get list of quote submissions`,
            method: `GET`,
            path: ``,
            responses: {
                200: rp
            },
            metadata: {
                rateLimit: `newQuotesGet`,
                requirePermission: `quoteMod`
            }
        },
        isSubmissionEnabled: {
            summary: `is submission enabled`,
            description: `Check if submissions are enabled.`,
            method: `GET`,
            path: `/isSubmissionEnabled`,
            responses: {
                200: ip
            },
            metadata: {
                authenticationOptions: {
                    isPublic: !0
                },
                rateLimit: `newQuotesIsSubmissionEnabled`
            }
        },
        add: {
            summary: `submit quote`,
            description: `Add a quote submission`,
            method: `POST`,
            path: ``,
            body: op.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `newQuotesAdd`,
                requireConfiguration: {
                    path: `quotes.submissionsEnabled`,
                    invalidMessage: `Quote submission is disabled temporarily. The queue is quite long and we need some time to catch up.`
                }
            }
        },
        approveSubmission: {
            summary: `submit quote`,
            description: `Add a quote submission`,
            method: `POST`,
            path: `/approve`,
            body: sp.strict(),
            responses: {
                200: cp
            },
            metadata: {
                rateLimit: `newQuotesAction`,
                requirePermission: `quoteMod`
            }
        },
        rejectSubmission: {
            summary: `reject quote`,
            description: `Reject a quote submission`,
            method: `POST`,
            path: `/reject`,
            body: lp.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `newQuotesAction`,
                requirePermission: `quoteMod`
            }
        },
        getRating: {
            summary: `get rating`,
            description: `Get quote rating`,
            method: `GET`,
            path: `/rating`,
            query: up.strict(),
            responses: {
                200: dp
            },
            metadata: {
                rateLimit: `quoteRatingsGet`
            }
        },
        addRating: {
            summary: `add rating`,
            description: `Add a quote rating`,
            method: `POST`,
            path: `/rating`,
            body: fp.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `quoteRatingsSubmit`
            }
        },
        report: {
            summary: `report quote`,
            description: `Report a quote`,
            method: `POST`,
            path: `/report`,
            body: pp.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `quoteReportSubmit`,
                requirePermission: `canReport`,
                requireConfiguration: {
                    path: `quotes.reporting.enabled`,
                    invalidMessage: `Quote reporting is unavailable.`
                }
            }
        }
    }, {
        pathPrefix: `/quotes`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `quotes`
        },
        commonResponses: q
    }),
    hp = O.object({
        action: O.literal(`published`).or(O.string()),
        release: O.object({
            id: O.string().or(O.number().transform(String))
        }).optional()
    });
K(O.array(Xa));
var gp = j().router({
        postGithubRelease: {
            summary: `Github release`,
            description: `Announce github release.`,
            method: `POST`,
            path: `/githubRelease`,
            body: hp,
            headers: O.object({
                "x-hub-signature-256": O.string()
            }),
            responses: {
                200: U
            }
        }
    }, {
        pathPrefix: `/webhooks`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `webhooks`,
            authenticationOptions: {
                isGithubWebhook: !0
            },
            rateLimit: `webhookLimit`
        },
        commonResponses: q
    }),
    _p = j(),
    vp = K(O.array(qu)),
    yp = O.object({
        status: O.array(Gu).or(Gu.transform(e => [e])).optional(),
        type: O.array(Ku).or(Ku.transform(e => [e])).optional()
    }),
    bp = qu.pick({
        receiverName: !0
    }),
    xp = K(qu),
    Sp = O.object({
        id: M
    }),
    Cp = O.object({
        status: Gu.exclude([`pending`])
    }),
    wp = _p.router({
        get: {
            summary: `get connections`,
            description: `Get connections of the current user`,
            method: `GET`,
            path: `/`,
            query: yp.strict(),
            responses: {
                200: vp
            },
            metadata: {
                rateLimit: `connectionGet`
            }
        },
        create: {
            summary: `create connection`,
            description: `Request a connection to a user `,
            method: `POST`,
            path: `/`,
            body: bp.strict(),
            responses: {
                200: xp,
                404: U.describe(`ReceiverUid unknown`),
                409: U.describe(`Duplicate connection, blocked or max connections reached`)
            },
            metadata: {
                rateLimit: `connectionCreate`
            }
        },
        delete: {
            summary: `delete connection`,
            description: `Delete a connection`,
            method: `DELETE`,
            path: `/:id`,
            pathParams: Sp.strict(),
            body: _p.noBody(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `connectionDelete`
            }
        },
        update: {
            summary: `update connection`,
            description: `Update a connection status`,
            method: `PATCH`,
            path: `/:id`,
            pathParams: Sp.strict(),
            body: Cp.strict(),
            responses: {
                200: U
            },
            metadata: {
                rateLimit: `connectionUpdate`
            }
        }
    }, {
        pathPrefix: `/connections`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `connections`,
            requireConfiguration: {
                path: `connections.enabled`,
                invalidMessage: `Connections are not available at this time.`
            }
        },
        commonResponses: q
    }),
    Tp = j().router({
        admin: nd,
        apeKeys: ld,
        configs: fd,
        presets: vd,
        psas: bd,
        public: wd,
        leaderboards: Ud,
        results: ef,
        configuration: of ,
        dev: uf,
        users: np,
        quotes: mp,
        webhooks: gp,
        connections: wp
    }),
    Ep = `X-Compatibility-Check`,
    Dp = O.object({
        message: O.string()
    }),
    Op = Dp.extend({
        validationErrors: O.array(O.string())
    }),
    kp = Dp,
    Ap = kp.extend({
        errorId: O.string(),
        uid: O.string().optional()
    });

function jp(e) {
    return Dp.extend({
        data: e
    })
}
var Mp = {
        400: kp.describe(`Generic client error`),
        401: kp.describe(`Authentication required but not provided or invalid`),
        403: kp.describe(`Operation not permitted`),
        422: Op.describe(`Request validation failed`),
        429: kp.describe(`Rate limit exceeded`),
        470: kp.describe(`Invalid ApeKey`),
        471: kp.describe(`ApeKey is inactive`),
        472: kp.describe(`ApeKey is malformed`),
        479: kp.describe(`ApeKey rate limit exceeded`),
        500: Ap.describe(`Generic server error`),
        503: Ap.describe(`Endpoint disabled or server is under maintenance`)
    },
    Np = O.object({
        username: O.string(),
        createUser: O.boolean().optional().describe("If `true` create user with <username>@example.com and password `password`. If false user has to exist."),
        firstTestTimestamp: O.number().int().nonnegative().optional(),
        lastTestTimestamp: O.number().int().nonnegative().optional(),
        minTestsPerDay: O.number().int().nonnegative().optional(),
        maxTestsPerDay: O.number().int().nonnegative().optional()
    }),
    Pp = jp(O.object({
        uid: M,
        email: O.string().email()
    })),
    Fp = O.object({
        rewardType: O.enum([`xp`, `badge`, `none`])
    }),
    Ip = j().router({
        generateData: {
            summary: `generate data`,
            description: `Generate test results for the given user.`,
            method: `POST`,
            path: `/generateData`,
            body: Np.strict(),
            responses: {
                200: Pp
            }
        },
        addDebugInboxItem: {
            summary: `add debug inbox item`,
            description: `Add a debug inbox item with optional reward.`,
            method: `POST`,
            path: `/addDebugInboxItem`,
            body: Fp.strict(),
            responses: {
                200: Dp
            },
            metadata: {
                openApiTags: `development`
            }
        }
    }, {
        pathPrefix: `/dev`,
        strictStatusCodes: !0,
        metadata: {
            openApiTags: `development`,
            authenticationOptions: {
                isPublicOnDev: !0
            }
        },
        commonResponses: Mp
    });

function Lp(e) {
    return Object.keys(e)
}

function Rp(e) {
    return Object.entries(e)
}

function zp(e, t, n = !1) {
    t.length > e.length && ([e, t] = [t, e]);
    let r = e.filter(function(e) {
        return t.includes(e)
    });
    return n ? [...new Set(r)] : r
}
var Bp = {
    58008: {
        description: `A special mode for accountants.`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `ignoresLayout`, `noLetters`],
        frontendForcedConfig: {
            numbers: [!1]
        },
        frontendFunctions: [`getWord`, `punctuateWord`, `rememberSettings`, `getEmulatedChar`],
        name: `58008`,
        alias: `numbers`
    },
    mirror: {
        name: `mirror`,
        description: `Everything is mirrored!`,
        properties: [`hasCssFile`],
        canGetPb: !0,
        difficultyLevel: 3,
        cssModifications: [`main`]
    },
    upside_down: {
        name: `upside_down`,
        description: `Everything is upside down!`,
        properties: [`hasCssFile`],
        canGetPb: !0,
        difficultyLevel: 3,
        cssModifications: [`main`]
    },
    nausea: {
        name: `nausea`,
        description: `I think I'm gonna be sick.`,
        canGetPb: !0,
        difficultyLevel: 2,
        properties: [`hasCssFile`, `ignoreReducedMotion`],
        cssModifications: [`typingTest`]
    },
    round_round_baby: {
        name: `round_round_baby`,
        description: `...right round, like a record baby. Right, round round round.`,
        canGetPb: !0,
        difficultyLevel: 3,
        properties: [`hasCssFile`, `ignoreReducedMotion`],
        cssModifications: [`typingTest`]
    },
    simon_says: {
        name: `simon_says`,
        description: `Type what simon says.`,
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [`hasCssFile`, `changesWordsVisibility`, `usesLayout`],
        frontendForcedConfig: {
            highlightMode: [`letter`, `off`]
        },
        frontendFunctions: [`applyConfig`, `rememberSettings`]
    },
    tts: {
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [`hasCssFile`, `changesWordsVisibility`, `speaks`],
        frontendForcedConfig: {
            highlightMode: [`letter`, `off`]
        },
        frontendFunctions: [`applyConfig`, `rememberSettings`, `toggleScript`],
        name: `tts`,
        description: `Listen closely.`,
        cssModifications: [`words`]
    },
    choo_choo: {
        canGetPb: !0,
        difficultyLevel: 2,
        properties: [`hasCssFile`, `noJoiningScript`, `conflictsWithSymmetricChars`, `ignoreReducedMotion`],
        name: `choo_choo`,
        description: `All the letters are spinning!`,
        cssModifications: [`words`]
    },
    arrows: {
        description: `Play it on a pad!`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `ignoresLayout`, `nospace`, `noLetters`, `symmetricChars`],
        frontendForcedConfig: {
            punctuation: [!1],
            numbers: [!1],
            highlightMode: [`letter`, `off`]
        },
        frontendFunctions: [`getWord`, `rememberSettings`, `getEmulatedChar`, `getWordHtml`],
        name: `arrows`
    },
    rAnDoMcAsE: {
        description: `raNdomIze ThE CApitaLizatIon Of EveRY LeTtEr.`,
        canGetPb: !1,
        difficultyLevel: 2,
        properties: [`changesCapitalisation`],
        frontendFunctions: [`alterText`],
        name: `rAnDoMcAsE`
    },
    sPoNgEcAsE: {
        description: `I kInDa LiKe HoW iNeFfIcIeNt QwErTy Is.`,
        canGetPb: !1,
        difficultyLevel: 2,
        properties: [`changesCapitalisation`],
        frontendFunctions: [`alterText`],
        name: `sPoNgEcAsE`
    },
    capitals: {
        description: `Capitalize Every Word.`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`changesCapitalisation`],
        frontendFunctions: [`alterText`],
        name: `capitals`
    },
    layout_mirror: {
        description: `Mirror the keyboard layout`,
        canGetPb: !0,
        difficultyLevel: 3,
        properties: [`changesLayout`],
        frontendFunctions: [`applyConfig`, `rememberSettings`],
        name: `layout_mirror`
    },
    layoutfluid: {
        description: `Switch between layouts specified below proportionately to the length of the test.`,
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [`changesLayout`, `noInfiniteDuration`],
        frontendFunctions: [`applyConfig`, `rememberSettings`, `handleSpace`, `getResultContent`],
        name: `layoutfluid`
    },
    earthquake: {
        description: `Everybody get down! The words are shaking!`,
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [`hasCssFile`, `noJoiningScript`, `ignoreReducedMotion`],
        name: `earthquake`,
        cssModifications: [`words`]
    },
    space_balls: {
        description: `In a galaxy far far away.`,
        canGetPb: !0,
        difficultyLevel: 0,
        properties: [`hasCssFile`, `ignoreReducedMotion`],
        name: `space_balls`,
        cssModifications: [`body`]
    },
    gibberish: {
        description: `Anvbuefl dizzs eoos alsb?`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `unspeakable`],
        frontendFunctions: [`getWord`],
        name: `gibberish`
    },
    ascii: {
        description: `Where was the ampersand again?. Only ASCII characters.`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `noLetters`, `unspeakable`],
        frontendForcedConfig: {
            punctuation: [!1],
            numbers: [!1]
        },
        frontendFunctions: [`getWord`],
        name: `ascii`
    },
    specials: {
        description: `!@#$%^&*. Only special characters.`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `noLetters`, `unspeakable`],
        frontendForcedConfig: {
            punctuation: [!1],
            numbers: [!1]
        },
        frontendFunctions: [`getWord`],
        name: `specials`
    },
    plus_zero: {
        description: `React quickly! Only the current word is visible.`,
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [`changesWordsVisibility`, `toPush:1`, `noInfiniteDuration`],
        name: `plus_zero`
    },
    plus_one: {
        description: `Only one future word is visible.`,
        canGetPb: !0,
        difficultyLevel: 0,
        properties: [`changesWordsVisibility`, `toPush:2`, `noInfiniteDuration`],
        name: `plus_one`
    },
    plus_two: {
        description: `Only two future words are visible.`,
        canGetPb: !0,
        difficultyLevel: 0,
        properties: [`changesWordsVisibility`, `toPush:3`, `noInfiniteDuration`],
        name: `plus_two`
    },
    plus_three: {
        description: `Only three future words are visible.`,
        canGetPb: !0,
        difficultyLevel: 0,
        properties: [`changesWordsVisibility`, `toPush:4`, `noInfiniteDuration`],
        name: `plus_three`
    },
    read_ahead_easy: {
        description: `Only the current word is invisible.`,
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [`changesWordsVisibility`, `hasCssFile`],
        frontendForcedConfig: {
            highlightMode: [`letter`, `off`]
        },
        frontendFunctions: [`rememberSettings`, `handleKeydown`],
        name: `read_ahead_easy`
    },
    read_ahead: {
        description: `Current and the next word are invisible!`,
        canGetPb: !0,
        difficultyLevel: 2,
        properties: [`changesWordsVisibility`, `hasCssFile`],
        frontendForcedConfig: {
            highlightMode: [`letter`, `off`]
        },
        frontendFunctions: [`rememberSettings`, `handleKeydown`],
        name: `read_ahead`
    },
    read_ahead_hard: {
        description: `Current and the next two words are invisible!`,
        canGetPb: !0,
        difficultyLevel: 3,
        properties: [`changesWordsVisibility`, `hasCssFile`],
        frontendForcedConfig: {
            highlightMode: [`letter`, `off`]
        },
        frontendFunctions: [`rememberSettings`, `handleKeydown`],
        name: `read_ahead_hard`
    },
    memory: {
        description: `Test your memory. Remember the words and type them blind.`,
        canGetPb: !0,
        difficultyLevel: 3,
        properties: [`changesWordsVisibility`, `noInfiniteDuration`],
        frontendForcedConfig: {
            mode: [`words`, `quote`, `custom`]
        },
        frontendFunctions: [`applyConfig`, `rememberSettings`, `start`, `restart`],
        name: `memory`
    },
    nospace: {
        description: `Whoneedsspacesanyway?`,
        canGetPb: !1,
        difficultyLevel: 0,
        properties: [`nospace`],
        frontendForcedConfig: {
            highlightMode: [`letter`, `off`]
        },
        frontendFunctions: [`rememberSettings`],
        name: `nospace`
    },
    poetry: {
        description: `Practice typing some beautiful prose.`,
        canGetPb: !1,
        difficultyLevel: 0,
        properties: [`noInfiniteDuration`, `ignoresLanguage`],
        frontendForcedConfig: {
            punctuation: [!1],
            numbers: [!1]
        },
        frontendFunctions: [`pullSection`],
        name: `poetry`
    },
    wikipedia: {
        description: `Practice typing wikipedia sections.`,
        canGetPb: !1,
        difficultyLevel: 0,
        properties: [`noInfiniteDuration`, `ignoresLanguage`],
        frontendForcedConfig: {
            punctuation: [!1],
            numbers: [!1]
        },
        frontendFunctions: [`pullSection`],
        name: `wikipedia`
    },
    weakspot: {
        description: `Focus on slow and mistyped letters.`,
        canGetPb: !1,
        difficultyLevel: 0,
        properties: [`changesWordsFrequency`],
        frontendFunctions: [`getWord`],
        name: `weakspot`
    },
    pseudolang: {
        description: `Nonsense words that look like the current language.`,
        canGetPb: !1,
        difficultyLevel: 0,
        properties: [`unspeakable`, `ignoresLanguage`],
        frontendFunctions: [`withWords`],
        name: `pseudolang`
    },
    IPv4: {
        alias: `network`,
        description: `For sysadmins.`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `ignoresLayout`, `noLetters`],
        frontendForcedConfig: {
            numbers: [!1]
        },
        frontendFunctions: [`getWord`, `punctuateWord`, `rememberSettings`],
        name: `IPv4`
    },
    IPv6: {
        alias: `network`,
        description: `For sysadmins with a long beard.`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `ignoresLayout`, `noLetters`],
        frontendForcedConfig: {
            numbers: [!1]
        },
        frontendFunctions: [`getWord`, `punctuateWord`, `rememberSettings`],
        name: `IPv6`
    },
    binary: {
        description: `01000010 01100101 01100101 01110000 00100000 01100010 01101111 01101111 01110000 00101110`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `ignoresLayout`, `noLetters`],
        frontendForcedConfig: {
            numbers: [!1],
            punctuation: [!1]
        },
        frontendFunctions: [`getWord`],
        name: `binary`
    },
    hexadecimal: {
        description: `0x38 0x20 0x74 0x69 0x6D 0x65 0x73 0x20 0x6D 0x6F 0x72 0x65 0x20 0x62 0x6F 0x6F 0x70 0x21`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `ignoresLayout`, `noLetters`],
        frontendForcedConfig: {
            numbers: [!1]
        },
        frontendFunctions: [`getWord`, `punctuateWord`, `rememberSettings`],
        name: `hexadecimal`
    },
    zipf: {
        description: `Words are generated according to Zipf's law. (not all languages will produce Zipfy results, use with caution)`,
        canGetPb: !1,
        difficultyLevel: 0,
        properties: [`changesWordsFrequency`],
        frontendFunctions: [`getWordsFrequencyMode`],
        name: `zipf`
    },
    morse: {
        description: `-.../././.--./ -.../---/---/.--./-.-.--/ `,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `ignoresLayout`, `noLetters`, `nospace`],
        frontendFunctions: [`alterText`],
        name: `morse`
    },
    crt: {
        description: `Go back to the 1980s`,
        canGetPb: !0,
        difficultyLevel: 0,
        properties: [`hasCssFile`, `noJoiningScript`],
        frontendFunctions: [`applyGlobalCSS`, `clearGlobal`],
        name: `crt`,
        cssModifications: [`body`]
    },
    backwards: {
        description: `...sdrawkcab epyt ot yrt woN`,
        name: `backwards`,
        properties: [`hasCssFile`, `conflictsWithSymmetricChars`, `wordOrder:reverse`, `reverseDirection`],
        canGetPb: !0,
        frontendFunctions: [`alterText`],
        difficultyLevel: 3,
        cssModifications: [`words`]
    },
    ddoouubblleedd: {
        description: `TTyyppee eevveerryytthhiinngg ttwwiiccee..`,
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [`noJoiningScript`],
        frontendFunctions: [`alterText`],
        name: `ddoouubblleedd`
    },
    instant_messaging: {
        description: `Who needs shift anyway?`,
        canGetPb: !1,
        difficultyLevel: 0,
        properties: [`changesCapitalisation`],
        frontendFunctions: [`alterText`],
        name: `instant_messaging`
    },
    underscore_spaces: {
        description: `Underscores_are_better.`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`, `ignoresLayout`, `nospace`],
        frontendFunctions: [`alterText`],
        name: `underscore_spaces`
    },
    ALL_CAPS: {
        description: `WHY ARE WE SHOUTING?`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`changesCapitalisation`],
        frontendFunctions: [`alterText`],
        name: `ALL_CAPS`
    },
    polyglot: {
        description: `Use words from multiple languages in a single test.`,
        canGetPb: !1,
        difficultyLevel: 1,
        properties: [`ignoresLanguage`],
        frontendFunctions: [`withWords`],
        name: `polyglot`
    },
    asl: {
        description: `Practice american sign language.`,
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [`hasCssFile`, `noJoiningScript`],
        name: `asl`,
        cssModifications: [`words`]
    },
    rot13: {
        description: `Vg znl abg or frpher, ohg vg vf sha gb glcr!`,
        canGetPb: !0,
        difficultyLevel: 1,
        properties: [],
        frontendFunctions: [`alterText`],
        name: `rot13`
    },
    no_quit: {
        description: `You can't restart the test.`,
        canGetPb: !0,
        difficultyLevel: 0,
        name: `no_quit`
    }
};

function Vp() {
    return Bp
}

function Hp() {
    return Object.keys(Bp)
}

function Up() {
    let e = [];
    for (let t of Hp()) e.push(Bp[t]);
    return e
}

function Wp(e) {
    if (e === void 0) return [];
    if (Array.isArray(e)) {
        let t = e.map(e => Vp()[e]);
        if (t.includes(void 0)) throw Error(`One of the funboxes is invalid: ${e.toString()}`);
        return t
    } else {
        let t = Vp()[e];
        if (t === void 0) throw Error(`Invalid funbox name: ${e}`);
        return t
    }
}

function Gp(e, t, n) {
    if (n.length === 0) return {
        result: !0
    };
    if (e === `words` || e === `time`) return t === 0 && n.filter(e => e.properties ?.includes(`noInfiniteDuration`)).length > 0 ? {
        result: !1,
        forcedConfigs: [e === `words` ? 10 : 15]
    } : {
        result: !0
    }; {
        let r = {};
        for (let e of n)
            if (e.frontendForcedConfig)
                for (let t in e.frontendForcedConfig) r[t] === void 0 ? r[t] = e.frontendForcedConfig[t] : r[t] = zp(r[t], e.frontendForcedConfig[t], !0);
        if (r[e] === void 0) return {
            result: !0
        };
        if (r[e] ?.length === 0) throw Error(`No intersection of forced configs`);
        return {
            result: (r[e] ?? []).includes(t),
            forcedConfigs: r[e]
        }
    }
}

function Kp(e, t) {
    if (e.length === 0) return !0;
    let n;
    try {
        if (n = Wp(e), t !== void 0) {
            let e = Wp(t);
            n = n.concat(e)
        }
    } catch (e) {
        return console.error(`Error when getting funboxes for a compatibility check:`, e), !1
    }
    if (!n.every(e => e !== void 0)) return !1;
    let r = n.filter(e => e.frontendFunctions ?.includes(`getWord`) === !0 || e.frontendFunctions ?.includes(`pullSection`) === !0 || e.frontendFunctions ?.includes(`withWords`) === !0).length <= 1,
        i = n.filter(e => e.properties ?.find(e => e.startsWith(`wordOrder`)) !== void 0).length <= 1,
        a = n.filter(e => e.properties ?.find(e => e === `changesLayout`)).length === 0 || n.filter(e => e.properties ?.find(e => e === `ignoresLayout` || e === `usesLayout`)).length === 0,
        o = n.filter(e => e.properties ?.find(e => e === `nospace` || e.startsWith(`toPush`)) !== void 0).length <= 1,
        s = n.filter(e => e.properties ?.find(e => e === `changesWordsVisibility`)).length <= 1,
        c = n.filter(e => e.properties ?.find(e => e === `changesWordsFrequency`)).length <= 1,
        ee = n.filter(e => e.properties ?.find(e => e === `changesWordsFrequency`)).length === 0 || n.filter(e => e.properties ?.find(e => e === `ignoresLanguage`)).length === 0,
        te = n.filter(e => e.properties ?.find(e => e === `noLetters`)).length === 0 || n.filter(e => e.properties ?.find(e => e === `changesCapitalisation`)).length === 0,
        l = n.filter(e => e.properties ?.find(e => e === `conflictsWithSymmetricChars`)).length === 0 || n.filter(e => e.properties ?.find(e => e === `symmetricChars`)).length === 0,
        re = n.filter(e => e.properties ?.find(e => e === `speaks`)).length <= 1,
        u = n.filter(e => e.properties ?.find(e => e === `speaks`)).length === 0 || n.filter(e => e.properties ?.find(e => e === `speaks`)).length === 1 && n.filter(e => e.properties ?.find(e => e === `unspeakable`)).length === 0 || n.filter(e => e.properties ?.find(e => e === `ignoresLanguage`)).length === 0,
        ie = n.filter(e => e.properties ?.find(e => e.startsWith(`toPush:`)) !== void 0 || e.frontendFunctions ?.includes(`pullSection`)).length <= 1,
        d = n.filter(e => e.frontendFunctions ?.includes(`punctuateWord`)).length <= 1,
        ae = n.filter(e => e.frontendFunctions ?.includes(`getEmulatedChar`)).length <= 1,
        f = n.filter(e => e.frontendFunctions ?.includes(`getWordHtml`)).length <= 1,
        oe = n.filter(e => e.properties ?.find(e => e === `changesCapitalisation`)).length <= 1,
        se = Object.values(n.map(e => e.cssModifications).filter(e => e !== void 0).flat().reduce((e, t) => (e[t] = (ne(e[t]) ?? 0) + 1, e), {})).every(e => e <= 1),
        ce = {},
        le = !0;
    for (let e of n)
        if (e.frontendForcedConfig)
            for (let t in e.frontendForcedConfig)
                if (ce[t]) {
                    if (zp(ce[t], e.frontendForcedConfig[t], !0).length === 0) {
                        le = !1;
                        break
                    }
                } else ce[t] = e.frontendForcedConfig[t];
    return r && a && o && s && c && ee && te && l && re && u && ie && d && ae && f && oe && se && le && i
}

function qp() {
    return Up()
}

function Jp() {
    return Vp()
}
var Yp = Object.defineProperty,
    Xp = Object.defineProperties,
    Zp = Object.getOwnPropertyDescriptors,
    Qp = Object.getOwnPropertySymbols,
    $p = Object.prototype.hasOwnProperty,
    em = Object.prototype.propertyIsEnumerable,
    tm = (e, t, n) => t in e ? Yp(e, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n
    }) : e[t] = n,
    nm = (e, t) => {
        for (var n in t ||= {}) $p.call(t, n) && tm(e, n, t[n]);
        if (Qp)
            for (var n of Qp(t)) em.call(t, n) && tm(e, n, t[n]);
        return e
    },
    rm = (e, t) => Xp(e, Zp(t)),
    im = Object.fromEntries(Object.entries({
        69: {
            display: `6969696969`,
            discordRoleId: `749505965174292511`,
            category: `other`,
            description: `Complete a 69-second test and achieve 69 WPM, 69 raw, 69% accuracy, and 69% consistency.`,
            settings: {
                autoRole: !0,
                type: `customTime`,
                message: `You need to achieve 69 wpm, 69 raw, 69% accuracy and 69% consistency.`,
                parameters: {
                    time: 69
                },
                requirements: {
                    wpm: {
                        exact: 69
                    },
                    raw: {
                        exact: 69
                    },
                    acc: {
                        exact: 69
                    },
                    con: {
                        exact: 69
                    }
                }
            }
        },
        oneHourWarrior: {
            display: `One Hour Warrior`,
            discordRoleId: `728371749737201855`,
            category: `endurance`,
            description: `Complete a one-hour test.`,
            settings: {
                autoRole: !0,
                type: `customTime`,
                parameters: {
                    time: 3600
                },
                requirements: {
                    time: {
                        min: 3600
                    }
                }
            }
        },
        doubleDown: {
            display: `Double Down`,
            discordRoleId: `732008008514535544`,
            category: `endurance`,
            description: `Complete a two-hour test.`,
            settings: {
                autoRole: !0,
                type: `customTime`,
                parameters: {
                    time: 7200
                },
                requirements: {
                    time: {
                        min: 7200
                    }
                }
            }
        },
        tripleTrouble: {
            display: `Triple Trouble`,
            discordRoleId: `732008047618293762`,
            category: `endurance`,
            description: `Complete a three-hour test.`,
            settings: {
                autoRole: !0,
                type: `customTime`,
                parameters: {
                    time: 10800
                },
                requirements: {
                    time: {
                        min: 10800
                    }
                }
            }
        },
        quad: {
            display: `Quaaaaad`,
            discordRoleId: `736215666352455801`,
            category: `endurance`,
            description: `Complete a four-hour test.`,
            settings: {
                autoRole: !0,
                type: `customTime`,
                parameters: {
                    time: 14400
                },
                requirements: {
                    time: {
                        min: 14400
                    }
                }
            }
        },
        "8Ball": {
            display: `8 Ball`,
            discordRoleId: `736528159956271126`,
            category: `endurance`,
            description: `Complete an eight-hour test.`,
            settings: {
                type: `customTime`,
                parameters: {
                    time: 28800
                },
                requirements: {
                    time: {
                        min: 28800
                    }
                }
            }
        },
        theBig12: {
            display: `The Big 12`,
            discordRoleId: `740532256388546581`,
            category: `endurance`,
            description: `Complete a twelve-hour test.`,
            settings: {
                type: `customTime`,
                parameters: {
                    time: 43200
                },
                requirements: {
                    time: {
                        min: 43200
                    }
                }
            }
        },
        "1Day": {
            display: `1 Day`,
            discordRoleId: `751801958511149057`,
            category: `endurance`,
            description: `Complete a twenty-four-hour test.`,
            settings: {
                type: `customTime`,
                parameters: {
                    time: 86400
                },
                requirements: {
                    time: {
                        min: 86400
                    }
                }
            }
        },
        trueSimp: {
            display: `True Simp`,
            discordRoleId: `744328648211038359`,
            category: `script`,
            description: `Type miodec ten thousand times.`,
            settings: {
                autoRole: !0,
                type: `customText`,
                parameters: {
                    text: `miodec`,
                    mode: `repeat`,
                    limit: 1e4,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                }
            }
        },
        bigramSalad: {
            display: `Bigram Salad`,
            discordRoleId: `818535054145093652`,
            category: `speed`,
            description: `Get 100 WPM on a randomized, 100-word custom test with the words list: to of in it is as at be we he so on an or do if up by my go.`,
            settings: {
                autoRole: !0,
                type: `customText`,
                parameters: {
                    text: `to of in it is as at be we he so on an or do if up by my go`,
                    mode: `random`,
                    limit: 100,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                },
                requirements: {
                    wpm: {
                        min: 100
                    }
                }
            }
        },
        simp: {
            display: `Simp`,
            discordRoleId: `743854992699687023`,
            category: `script`,
            description: `Type miodec one thousand times.`,
            settings: {
                autoRole: !0,
                type: `customText`,
                parameters: {
                    text: `miodec`,
                    mode: `repeat`,
                    limit: 1e3,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                }
            }
        },
        simpLord: {
            display: `Simp Lord`,
            discordRoleId: `984911956949479445`,
            category: `script`,
            description: `Type miodec one hundred thousand times.`,
            settings: {
                type: `customText`,
                parameters: {
                    text: `miodec`,
                    mode: `repeat`,
                    limit: 1e5,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                }
            }
        },
        antidiseWhat: {
            display: `Antidise-what?`,
            discordRoleId: `782006507360616449`,
            category: `script`,
            description: `Get at least 200 wpm typing antidisestablishmentarianism.`,
            settings: {
                autoRole: !0,
                type: `customText`,
                parameters: {
                    text: `antidisestablishmentarianism`,
                    mode: `repeat`,
                    limit: 1,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                },
                requirements: {
                    wpm: {
                        min: 200
                    }
                }
            }
        },
        whatsThisWebsiteCalledAgain: {
            display: `What's this website called again?`,
            discordRoleId: `739276161603076116`,
            category: `script`,
            description: `Type monkeytype one thousand times.`,
            settings: {
                autoRole: !0,
                type: `customText`,
                parameters: {
                    text: `monkeytype`,
                    mode: `repeat`,
                    limit: 1e3,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                }
            }
        },
        developd: {
            display: `Develop'd`,
            discordRoleId: `735964917877964932`,
            category: `script`,
            description: `Type develop one thousand times.`,
            settings: {
                autoRole: !0,
                type: `customText`,
                parameters: {
                    text: `develop`,
                    mode: `repeat`,
                    limit: 1e3,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                }
            }
        },
        slowAndSteady: {
            display: `Slow and Steady`,
            discordRoleId: `782005061935956008`,
            category: `speed`,
            description: `Complete a 5-minute test with exactly 60 WPM without using the live WPM or pace caret.`,
            settings: {
                autoRole: !0,
                type: `customTime`,
                parameters: {
                    time: 300
                },
                requirements: {
                    wpm: {
                        exact: 60
                    },
                    config: {
                        liveSpeedStyle: `off`,
                        paceCaret: `off`
                    }
                }
            }
        },
        speedSpacer: {
            display: `Speed Spacer`,
            discordRoleId: `755244049446731856`,
            category: `speed`,
            description: `Get 100 wpm on a randomised custom test with the input: a b c d e f g h i j k l m n o p q r s t u v w x y z (the alphabet) and a word count of 100.`,
            settings: {
                autoRole: !0,
                type: `customText`,
                parameters: {
                    text: `a b c d e f g h i j k l m n o p q r s t u v w x y z`,
                    mode: `random`,
                    limit: 100,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                },
                requirements: {
                    wpm: {
                        min: 100
                    }
                }
            }
        },
        iveGotThePower: {
            display: `I've got the POWER`,
            discordRoleId: `764879734873915402`,
            category: `speed`,
            description: `Get 400 WPM while typing power 10 times.`,
            settings: {
                autoRole: !0,
                type: `customText`,
                parameters: {
                    text: `power`,
                    mode: `repeat`,
                    limit: 10,
                    limitMode: `word`,
                    isPipeDelimiter: !1
                },
                requirements: {
                    wpm: {
                        min: 400
                    }
                }
            }
        },
        accuracyExpert: {
            display: `Accuracy Expert`,
            discordRoleId: `751168451263070259`,
            category: `accuracy`,
            description: `Complete a 10-minute Master mode test.`,
            settings: {
                autoRole: !0,
                type: `accuracy`,
                message: `Minimum 60wpm and 100% accuracy required.`,
                requirements: {
                    wpm: {
                        min: 60
                    },
                    acc: {
                        exact: 100
                    },
                    afk: {
                        max: 5
                    },
                    time: {
                        min: 600
                    }
                }
            }
        },
        accuracyMaster: {
            display: `Accuracy Master`,
            discordRoleId: `751168567432708239`,
            category: `accuracy`,
            description: `Complete a 20-minute Master mode test.`,
            settings: {
                autoRole: !0,
                type: `accuracy`,
                message: `Minimum 60wpm and 100% accuracy required.`,
                requirements: {
                    wpm: {
                        min: 60
                    },
                    acc: {
                        exact: 100
                    },
                    afk: {
                        max: 5
                    },
                    time: {
                        min: 1200
                    }
                }
            }
        },
        accuracyGod: {
            display: `Accuracy God`,
            discordRoleId: `751168657626890361`,
            category: `accuracy`,
            description: `Complete a 30-minute Master mode test.`,
            settings: {
                autoRole: !0,
                type: `accuracy`,
                message: `Minimum 60wpm and 100% accuracy required.`,
                requirements: {
                    wpm: {
                        min: 60
                    },
                    acc: {
                        exact: 100
                    },
                    afk: {
                        max: 5
                    },
                    time: {
                        min: 1800
                    }
                }
            }
        },
        inAGalaxyFarFarAway: {
            display: `In a galaxy far, far away`,
            discordRoleId: `740004324301602907`,
            category: `script`,
            description: `Type out the entire Star Wars Episode 4 script with punctuation while watching the movie simultaneously.`,
            settings: {
                type: `script`,
                parameters: {
                    script: `episode4.txt`,
                    funboxes: [`space_balls`]
                },
                requirements: {
                    config: {
                        tapeMode: `off`
                    }
                }
            }
        },
        beepBoop: {
            display: `Beep Boop`,
            discordRoleId: `813076265145729024`,
            category: `script`,
            description: `Type the beepboop script with 100% accuracy and at least 45 WPM.`,
            settings: {
                type: `script`,
                message: `Minimum 45 WPM and 100% accuracy required.`,
                parameters: {
                    script: `beepboop.txt`,
                    funboxes: [`nospace`]
                },
                requirements: {
                    wpm: {
                        min: 45
                    },
                    acc: {
                        min: 100
                    },
                    funbox: {
                        exact: [`nospace`]
                    }
                }
            }
        },
        whosYourDaddy: {
            display: `Who's your daddy?`,
            discordRoleId: `742171915405361204`,
            category: `script`,
            description: `Type out the entire Star Wars Episode 5 script with punctuation while watching the movie simultaneously.`,
            settings: {
                type: `script`,
                parameters: {
                    script: `episode5.txt`,
                    funboxes: [`space_balls`]
                },
                requirements: {
                    config: {
                        tapeMode: `off`
                    }
                }
            }
        },
        itsATrap: {
            display: `It's a trap!!`,
            discordRoleId: `744325174668820550`,
            category: `script`,
            description: `Type out the entire Star Wars Episode 6 script with punctuation while watching the movie simultaneously.`,
            settings: {
                type: `script`,
                parameters: {
                    script: `episode6.txt`,
                    funboxes: [`space_balls`]
                },
                requirements: {
                    config: {
                        tapeMode: `off`
                    }
                }
            }
        },
        jolly: {
            display: `Jolly`,
            discordRoleId: `768497412548329563`,
            category: `script`,
            description: `Type the Jolly script with a minimum of 70 wpm.`,
            settings: {
                autoRole: !0,
                type: `script`,
                message: `Minimum 70wpm required.`,
                parameters: {
                    script: `jolly.txt`
                },
                requirements: {
                    wpm: {
                        min: 70
                    }
                }
            }
        },
        gottaCatchEmAll: {
            display: `Gotta catch 'em all`,
            discordRoleId: `767069340599975998`,
            category: `script`,
            description: `Type out the names of all Pokemon.`,
            settings: {
                autoRole: !0,
                type: `script`,
                parameters: {
                    script: `pokemon.txt`
                }
            }
        },
        rapGod: {
            display: `Rap God`,
            discordRoleId: `743844891045396603`,
            category: `script`,
            description: `Type out the lyrics of Eminem's Rap God at a minimum of 85 WPM and 90% accuracy, including punctuation.`,
            settings: {
                autoRole: !0,
                type: `script`,
                message: `Minimum 85wpm and 90% accuracy required.`,
                parameters: {
                    script: `rapgod.txt`
                },
                requirements: {
                    wpm: {
                        min: 85
                    },
                    acc: {
                        min: 90
                    },
                    afk: {
                        max: 5
                    }
                }
            }
        },
        navySeal: {
            display: `Navy Seal`,
            discordRoleId: `762345535969165342`,
            category: `script`,
            description: `Type out the Navy Seal copy pasta with 100% accuracy and minimum 60 WPM.`,
            settings: {
                autoRole: !0,
                type: `script`,
                message: `Minimum 60wpm and 100% accuracy required.`,
                parameters: {
                    script: `navyseal.txt`
                },
                requirements: {
                    wpm: {
                        min: 60
                    },
                    acc: {
                        exact: 100
                    },
                    afk: {
                        max: 5
                    }
                }
            }
        },
        littleChef: {
            display: `Little Chef`,
            discordRoleId: `763544714028122153`,
            category: `script`,
            description: `Type out the entire Ratatouille script while watching the movie simultaneously.`,
            settings: {
                type: `script`,
                parameters: {
                    script: `littlechef.txt`
                }
            }
        },
        crosstalk: {
            display: `(CROSSTALK)`,
            discordRoleId: `761276009664217129`,
            category: `script`,
            description: `Type out the entire transcript of the first 2020 Presidential Debate.`,
            settings: {
                type: `script`,
                parameters: {
                    script: `crosstalk.txt`
                }
            }
        },
        bees: {
            display: `Bees!!!`,
            discordRoleId: `739636003182084307`,
            category: `script`,
            description: `Type out the entire Bee Movie script while watching the movie simultaneously.`,
            settings: {
                type: `script`,
                parameters: {
                    script: `bees.txt`
                }
            }
        },
        getOffMySwamp: {
            display: `Get off my swamp`,
            discordRoleId: `757346966987342026`,
            category: `script`,
            description: `Type out the entire Shrek script with punctuation while watching the movie simultaneously.`,
            settings: {
                type: `script`,
                parameters: {
                    script: `shrek.txt`
                }
            }
        },
        lookAtMeIAmTheDeveloperNow: {
            display: `Look at me. I am the developer now.`,
            discordRoleId: `937358772635074600`,
            category: `script`,
            description: `Type out the entire source code of Monkeytype, as it was in February 2022.`,
            settings: {
                autoRole: !0,
                type: `script`,
                parameters: {
                    script: `sourcecode.txt`
                }
            }
        },
        beLikeWater: {
            display: `Be like water`,
            discordRoleId: `740568679485276201`,
            category: `funbox`,
            description: `Achieve at least 50 WPM in all three layouts in a 60-second time test using the layoutfluid mode. Layouts must be unique (e.g., QWERTY, Colemak, Dvorak).`,
            settings: {
                type: `funbox`,
                message: `Remember: You need to achieve at least 50 wpm in each layout.`,
                parameters: {
                    funbox: `layoutfluid`,
                    mode: `time`,
                    mode2: 60
                }
            }
        },
        rollercoaster: {
            display: `Rollercoaster`,
            discordRoleId: `736032495526740001`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the round round baby mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `round_round_baby`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 3600
                    },
                    funbox: {
                        exact: [`round_round_baby`]
                    }
                }
            }
        },
        oneHourMirror: {
            display: `ɿoɿɿim ɿυoʜ ɘno`,
            discordRoleId: `737385182998429757`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the mirror mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `mirror`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 3600
                    },
                    funbox: {
                        exact: [`mirror`]
                    }
                }
            }
        },
        chooChoo: {
            display: `Choo choo`,
            discordRoleId: `739306439574683710`,
            category: `funbox`,
            description: `Complete at least a one-hour test using choo choo mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `choo_choo`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 3600
                    },
                    funbox: {
                        exact: [`choo_choo`]
                    }
                }
            }
        },
        mnemonist: {
            display: `Mnemonist`,
            discordRoleId: `782005606852067328`,
            category: `funbox`,
            description: `Achieve 100+ WPM with 100% accuracy on a 25-word test using the memory funbox.`,
            settings: {
                type: `funbox`,
                parameters: {
                    funbox: `memory`,
                    mode: `words`,
                    mode2: 25,
                    difficulty: `master`
                },
                requirements: {
                    config: {
                        tapeMode: `off`
                    }
                }
            }
        },
        earfquake: {
            display: `Earfquake`,
            discordRoleId: `740730587429601291`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the earthquake funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `earthquake`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 3600
                    },
                    funbox: {
                        exact: [`earthquake`]
                    }
                }
            }
        },
        simonSez: {
            display: `Simon Sez`,
            discordRoleId: `742128871825997914`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the simon says funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `simon_says`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 3600
                    },
                    funbox: {
                        exact: [`simon_says`]
                    }
                }
            }
        },
        accountant: {
            display: `Accountant`,
            discordRoleId: `743962178821816391`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the 58008 funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `58008`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 3600
                    },
                    funbox: {
                        exact: [`58008`]
                    }
                }
            }
        },
        hidden: {
            display: `Hidden`,
            discordRoleId: `782006137742557194`,
            category: `funbox`,
            description: `Achieve 100+ WPM using the read ahead funbox on a 60-second test.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `read_ahead`,
                    mode: `time`,
                    mode2: 60
                },
                requirements: {
                    wpm: {
                        min: 100
                    },
                    time: {
                        min: 60
                    },
                    funbox: {
                        exact: [`read_ahead`]
                    },
                    config: {
                        tapeMode: `off`
                    }
                }
            }
        },
        iCanSeeTheFuture: {
            display: `I can see the future`,
            discordRoleId: `814877508008411226`,
            category: `funbox`,
            description: `Achieve 100+ WPM using the read ahead hard funbox on a 60-second test.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `read_ahead_hard`,
                    mode: `time`,
                    mode2: 60
                },
                requirements: {
                    wpm: {
                        min: 100
                    },
                    time: {
                        min: 60
                    },
                    funbox: {
                        exact: [`read_ahead_hard`]
                    },
                    config: {
                        tapeMode: `off`
                    }
                }
            }
        },
        whatAreWordsAtThisPoint: {
            display: `What are words at this point?`,
            discordRoleId: `744209241396740176`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the gibberish funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `gibberish`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 60
                    },
                    funbox: {
                        exact: [`gibberish`]
                    }
                }
            }
        },
        specials: {
            display: `Specials`,
            discordRoleId: `744209452714033162`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the specials funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `specials`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 60
                    },
                    funbox: {
                        exact: [`specials`]
                    }
                }
            }
        },
        aeiou: {
            display: `Aeiou.`,
            discordRoleId: `744318102766092362`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the tts funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `tts`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 60
                    },
                    funbox: {
                        exact: [`tts`]
                    }
                }
            }
        },
        asciiWarrior: {
            display: `ASCII warrior`,
            discordRoleId: `746142791326760980`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the ascii funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `ascii`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 60
                    },
                    funbox: {
                        exact: [`ascii`]
                    }
                }
            }
        },
        iKiNdAlIkEhOwInEfFiCiEnTqWeRtYiS: {
            display: `i KINda LikE HoW inEFFICIeNt QwErtY Is.`,
            discordRoleId: `760999194525171724`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the randomcase funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `sPoNgEcAsE`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 60
                    },
                    funbox: {
                        exact: [`sPoNgEcAsE`]
                    }
                }
            }
        },
        oneNauseousMonkey: {
            display: `One Nauseous Monkey`,
            discordRoleId: `760930262740631633`,
            category: `funbox`,
            description: `Complete at least a one-hour test using the nausea funbox mode.`,
            settings: {
                autoRole: !0,
                type: `funbox`,
                parameters: {
                    funbox: `nausea`,
                    mode: `time`,
                    mode2: 3600
                },
                requirements: {
                    time: {
                        min: 60
                    },
                    funbox: {
                        exact: [`nausea`]
                    }
                }
            }
        },
        thumbWarrior: {
            display: `Thumb warrior`,
            discordRoleId: `761794585109200906`,
            category: `other`,
            description: `Complete a one-hour test using only your thumbs.`,
            settings: {
                type: `customTime`,
                parameters: {
                    time: 3600
                }
            }
        },
        mouseWarrior: {
            display: `Mouse warrior`,
            discordRoleId: `744580294442614790`,
            category: `other`,
            description: `Complete a one-hour test using only the on-screen keyboard. Funbox modes are not allowed.`,
            settings: {
                type: `customTime`,
                parameters: {
                    time: 3600
                }
            }
        },
        mobileWarrior: {
            display: `Mobile warrior`,
            discordRoleId: `744723801526370407`,
            category: `other`,
            description: `Complete a one-hour test on mobile.`,
            settings: {
                type: `customTime`,
                parameters: {
                    time: 3600
                }
            }
        },
        upsideDown: {
            display: `uʍop ǝpᴉsdn`,
            discordRoleId: `782725716114014237`,
            category: `other`,
            description: `Achieve at least 60 WPM on a one-minute test with your keyboard upside down.`,
            settings: {
                type: `customTime`,
                parameters: {
                    time: 60
                }
            }
        },
        oneArmedBandit: {
            display: `One armed bandit`,
            discordRoleId: `765919192557682708`,
            category: `other`,
            description: `Complete a one-hour or 10k words test (whichever comes sooner, using an external timer) using a one-handed words list (either left or right) for your layout.`,
            settings: {
                type: `customWords`,
                parameters: {
                    words: 1e4
                }
            }
        },
        englishMaster: {
            display: `English master`,
            discordRoleId: `751166528824672396`,
            category: `other`,
            description: `Complete a one-hour test using English 10k language with punctuation and numbers enabled.`,
            settings: {
                autoRole: !0,
                type: `customTime`,
                parameters: {
                    time: 3600
                },
                requirements: {
                    time: {
                        min: 3600
                    },
                    config: {
                        language: `english_10k`,
                        punctuation: !0,
                        numbers: !0
                    }
                }
            }
        },
        feetWarrior: {
            display: `Feet warrior`,
            discordRoleId: `751953592860147822`,
            category: `other`,
            description: `Complete a one-hour test using your feet. Don't ask me why.`,
            settings: {
                type: `customTime`,
                parameters: {
                    time: 3600
                }
            }
        },
        wingdings: {
            display: `Ten Words of Pain`,
            discordRoleId: `863192575984140338`,
            category: `other`,
            description: `Complete a 10-word Master mode test using the Wingdings custom font.`,
            settings: {
                type: `other`,
                message: `Complete a 10-word Master mode test using the Wingdings custom font. No keymap allowed. Minimum 60 WPM and 100% accuracy required.`,
                requirements: {
                    acc: {
                        exact: 100
                    }
                }
            }
        }
    }).map(([e, t]) => [e, rm(nm({}, t), {
        name: e
    })])),
    am = Object.values(im);
am.filter(e => e.isHidden !== !0);

function om() {
    return am
}

function sm(e) {
    return im[e]
}
O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String));
var cm = () => O.string().regex(/^[a-zA-Z0-9_]+$/);
cm(), cm().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);

function lm(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var um = O.enum(`qwerty.dvorak.colemak.colemak_angle.colemak_wide.colemak_dh.colemak_dh_iso.colemak_dh_wide.colemak_dh_iso_wide.colemak_dhk.colemak_dh_matrix.colemak_dhk_iso.colemak_dhv.qwertz.swiss_german.swiss_french.workman.prog_workman.turkish_q.turkish_f.turkish_e.MTGAP_ASRT.norman.halmak.QGMLWB.QGMLWY.qwpr.uk_qwerty.spanish_qwerty.italian_qwerty.latam_qwerty.prog_dvorak.prog_dvorak_prime.german_dvorak.german_dvorak_imp.spanish_dvorak.swedish_colemak.swedish_dvorak.dvorak_L.dvorak_R.dvorak_fr.azerty.azerty_AFNOR.bepo.bepo_AFNOR.alpha.handsdown.hungarian.handsdown_alt.handsdown_promethium.handsdown_neu.handsdown_neu_inverted.typehack.MTGAP.MTGAP_full.ina.soul.niro.mongolian.JCUKEN.statica_3x5.Vestnik.Diktor.Diktor_VoronovMod.Redaktor.JUIYAF.Zubachev.ISRT.ISRT_Angle.colemak_Qix.colemak_Qi.colemaQ.colemaQ_F.engram.engrammer.semimak.semimak_jq.semimak_jqc.canary.canary_matrix.japanese_hiragana.boo.boo_mangle.APT.APT_angle.middlemak.middlemak-nh.hindi_inscript.thai_kedmanee.thai_pattachote.thai_manoonchai.persian_standard.persian_farsi.arabic_101.arabic_102.arabic_mac.hebrew.urdu_phonetic.brasileiro_nativo.Foalmak.quartz.arensito.ARTS.beakl_15.beakl_19.beakl_19_bis.capewell_dvorak.colman.heart.klauser.oneproduct.pine.pine_v4.real.rolll.stndc.three.uciea.asset.dwarf.flaw.whorf.whorf6.whorfmax.whorfmax_ortho.sertain.ctgap.octa8.polish_programmers.bulgarian.bulgarian_phonetic_traditional.belarusian.ukrainian.russian.neo.bone.AdNW.mine.noted.koy.3l.korean.ekverto_b.nerps.sturdy_angle_ansi.sturdy_angle_iso.sturdy_ortho.ABNT2.HiYou.xenia.xenia_alt.burmese.gallium.gallium_angle.gallium_v2.gallium_v2_matrix.gallium_nl.maya.gallaya_angle_ansi.gallaya_angle_iso.gallaya_matrix.nila.minimak_4k.minimak_8k.minimak_12k.optimot.norwegian_qwerty.portuguese_pt_qwerty_iso.portuguese_pt_qwerty_ansi.swedish_qwerty.danish_qwerty.noctum.graphite.graphite_angle.graphite_angle_vc.graphite_angle_kp.graphite_matrix.macedonian.UGJRMV.pashto.ORNATE.estonian.stronk.dhorf.gust.recurva.seht-drai.ints.rollla.wreathy.saiga.saiga-e.krai.mir.ergol.cascade.vylet.hyperroll.romak.scythe.inqwerted.rain.night.night_stic.whix2.haruka.kuntum.anishtro.Kuntem.kuntem-jq.BEAKL_Zi.snorkle.MALTRON.PRSTEN.RSTHD.dusk.zenith.focal.panini.panini_wide.ergopti.sword.opy.tarmak_1.tarmak_2.tarmak_3.tarmak_4.rulemak.persian_farsi_colemak.persian_standard_colemak.ergo_split46.tamil99.Gralmak.GralmakS.vitrimak.miligram.nokwts.vylet_v4.armenian_hm_qwerty`.split(`.`), {
        errorMap: lm(`Must be a supported layout`)
    }),
    Y = O.array(O.string().length(1)).min(1).max(4),
    dm = O.object({
        keymapShowTopRow: O.boolean(),
        matrixShowRightColumn: O.boolean().optional()
    }).strict(),
    fm = dm.extend({
        type: O.literal(`ansi`),
        keys: O.object({
            row1: O.array(Y).length(13),
            row2: O.array(Y).length(13),
            row3: O.array(Y).length(11),
            row4: O.array(Y).length(10),
            row5: O.array(Y).min(1).max(2)
        }).strict()
    }).strict(),
    pm = dm.extend({
        type: O.literal(`iso`),
        keys: O.object({
            row1: O.array(Y).length(13),
            row2: O.array(Y).length(12),
            row3: O.array(Y).length(12),
            row4: O.array(Y).length(11),
            row5: O.array(Y).min(1).max(2)
        }).strict()
    }).strict();
fm.or(pm);
var mm = O.object({
        message: O.string()
    }),
    hm = mm.extend({
        validationErrors: O.array(O.string())
    }),
    gm = mm,
    _m = gm.extend({
        errorId: O.string(),
        uid: O.string().optional()
    });

function vm(e) {
    return mm.extend({
        data: e.nullable()
    })
}

function ym(e) {
    return mm.extend({
        data: e
    })
}
var bm = {
        400: gm.describe(`Generic client error`),
        401: gm.describe(`Authentication required but not provided or invalid`),
        403: gm.describe(`Operation not permitted`),
        422: hm.describe(`Request validation failed`),
        429: gm.describe(`Rate limit exceeded`),
        470: gm.describe(`Invalid ApeKey`),
        471: gm.describe(`ApeKey is inactive`),
        472: gm.describe(`ApeKey is malformed`),
        479: gm.describe(`ApeKey rate limit exceeded`),
        500: _m.describe(`Generic server error`),
        503: _m.describe(`Endpoint disabled or server is under maintenance`)
    },
    xm = ym(O.array(zu)),
    Sm = ym(O.object({
        isEnabled: O.boolean()
    })),
    Cm = O.string().min(60),
    wm = O.object({
        text: Cm,
        source: O.string(),
        language: F,
        captcha: O.string()
    }),
    Tm = O.object({
        quoteId: M,
        editText: si,
        editSource: si
    }),
    Em = ym(Ru),
    Dm = O.object({
        quoteId: M
    }),
    Om = O.object({
        quoteId: Lu,
        language: F
    }),
    km = vm(Bu),
    Am = O.object({
        quoteId: Lu,
        language: F,
        rating: O.number().int().min(1).max(5)
    }),
    jm = O.object({
        quoteId: Lu,
        quoteLanguage: F,
        reason: Vu,
        comment: O.string().regex(/^([.]|[^/<>])+$/).max(250).optional().or(O.string().length(0)),
        captcha: O.string()
    });
j().router({
    get: {
        summary: `get quote submissions`,
        description: `Get list of quote submissions`,
        method: `GET`,
        path: ``,
        responses: {
            200: xm
        },
        metadata: {
            rateLimit: `newQuotesGet`,
            requirePermission: `quoteMod`
        }
    },
    isSubmissionEnabled: {
        summary: `is submission enabled`,
        description: `Check if submissions are enabled.`,
        method: `GET`,
        path: `/isSubmissionEnabled`,
        responses: {
            200: Sm
        },
        metadata: {
            authenticationOptions: {
                isPublic: !0
            },
            rateLimit: `newQuotesIsSubmissionEnabled`
        }
    },
    add: {
        summary: `submit quote`,
        description: `Add a quote submission`,
        method: `POST`,
        path: ``,
        body: wm.strict(),
        responses: {
            200: mm
        },
        metadata: {
            rateLimit: `newQuotesAdd`,
            requireConfiguration: {
                path: `quotes.submissionsEnabled`,
                invalidMessage: `Quote submission is disabled temporarily. The queue is quite long and we need some time to catch up.`
            }
        }
    },
    approveSubmission: {
        summary: `submit quote`,
        description: `Add a quote submission`,
        method: `POST`,
        path: `/approve`,
        body: Tm.strict(),
        responses: {
            200: Em
        },
        metadata: {
            rateLimit: `newQuotesAction`,
            requirePermission: `quoteMod`
        }
    },
    rejectSubmission: {
        summary: `reject quote`,
        description: `Reject a quote submission`,
        method: `POST`,
        path: `/reject`,
        body: Dm.strict(),
        responses: {
            200: mm
        },
        metadata: {
            rateLimit: `newQuotesAction`,
            requirePermission: `quoteMod`
        }
    },
    getRating: {
        summary: `get rating`,
        description: `Get quote rating`,
        method: `GET`,
        path: `/rating`,
        query: Om.strict(),
        responses: {
            200: km
        },
        metadata: {
            rateLimit: `quoteRatingsGet`
        }
    },
    addRating: {
        summary: `add rating`,
        description: `Add a quote rating`,
        method: `POST`,
        path: `/rating`,
        body: Am.strict(),
        responses: {
            200: mm
        },
        metadata: {
            rateLimit: `quoteRatingsSubmit`
        }
    },
    report: {
        summary: `report quote`,
        description: `Report a quote`,
        method: `POST`,
        path: `/report`,
        body: jm.strict(),
        responses: {
            200: mm
        },
        metadata: {
            rateLimit: `quoteReportSubmit`,
            requirePermission: `canReport`,
            requireConfiguration: {
                path: `quotes.reporting.enabled`,
                invalidMessage: `Quote reporting is unavailable.`
            }
        }
    }
}, {
    pathPrefix: `/quotes`,
    strictStatusCodes: !0,
    metadata: {
        openApiTags: `quotes`
    },
    commonResponses: bm
});
var X = O.object({
        message: O.string()
    }),
    Mm = X.extend({
        validationErrors: O.array(O.string())
    }),
    Z = X,
    Nm = Z.extend({
        errorId: O.string(),
        uid: O.string().optional()
    });

function Pm(e) {
    return X.extend({
        data: e.nullable()
    })
}

function Q(e) {
    return X.extend({
        data: e
    })
}
var Fm = {
        400: Z.describe(`Generic client error`),
        401: Z.describe(`Authentication required but not provided or invalid`),
        403: Z.describe(`Operation not permitted`),
        422: Mm.describe(`Request validation failed`),
        429: Z.describe(`Rate limit exceeded`),
        470: Z.describe(`Invalid ApeKey`),
        471: Z.describe(`ApeKey is inactive`),
        472: Z.describe(`ApeKey is malformed`),
        479: Z.describe(`ApeKey rate limit exceeded`),
        500: Nm.describe(`Generic server error`),
        503: Nm.describe(`Endpoint disabled or server is under maintenance`)
    },
    Im = Q(bu.extend({
        inboxUnreadSize: O.number().int().nonnegative()
    })),
    Lm = O.object({
        email: H.optional(),
        name: yu,
        uid: O.string().optional(),
        captcha: O.string()
    }),
    Rm = O.object({
        name: yu
    }),
    zm = Q(O.object({
        available: O.boolean()
    })),
    Bm = O.object({
        name: yu
    }),
    Vm = O.object({
        mode: lo,
        mode2: uo,
        language: F,
        rank: O.number().int().nonnegative()
    }),
    Hm = O.object({
        newEmail: H,
        previousEmail: H
    }),
    Um = O.object({
        newPassword: O.string().min(6)
    }),
    Wm = O.object({
        mode: lo,
        mode2: uo.optional()
    }),
    Gm = Pm(so),
    Km = Yl,
    qm = Q(M.describe(`Id of the created result filter preset`)),
    Jm = O.object({
        presetId: M
    }),
    Ym = Q(O.array($l)),
    Xm = O.object({
        tagName: Ql
    }),
    Zm = Q($l),
    Qm = O.object({
        tagId: M,
        newName: Ql
    }),
    $m = O.object({
        tagId: M
    }),
    eh = Q(O.array(ou)),
    th = O.object({
        name: au,
        colors: vr
    }),
    nh = Q(ou.pick({
        _id: !0,
        name: !0
    })),
    rh = O.object({
        themeId: M
    }),
    ih = O.object({
        themeId: M,
        theme: ou.pick({
            name: !0,
            colors: !0
        })
    }),
    ah = Q(O.object({
        url: O.string().url()
    })),
    oh = O.object({
        tokenType: O.string(),
        accessToken: O.string(),
        state: O.string().length(20)
    }),
    sh = Q(bu.pick({
        discordId: !0,
        discordAvatar: !0
    })),
    ch = Q(bu.pick({
        completedTests: !0,
        startedTests: !0,
        timeTyping: !0
    })),
    lh = O.object({
        hourOffset: Xl
    }),
    uh = Q(_u),
    dh = O.object({
        language: F,
        quoteId: ai
    }),
    fh = O.object({
        language: F,
        quoteId: ai
    }),
    ph = O.object({
        uidOrName: O.string()
    }),
    mh = O.object({
        isUid: O.string().length(0).transform(e => e === ``).or(O.boolean()).default(!1)
    }),
    hh = Q(Su),
    gh = iu.extend({
        selectedBadgeId: O.number().int().nonnegative().optional().or(O.literal(-1).describe(`no badge selected`))
    }),
    _h = Q(iu),
    vh = Q(O.object({
        inbox: O.array(Du),
        maxMail: O.number().int()
    })),
    yh = O.object({
        mailIdsToDelete: O.array(O.string().uuid()).min(1).optional(),
        mailIdsToMarkRead: O.array(O.string().uuid()).min(1).optional()
    }),
    bh = O.string().regex(/^([.]|[^/<>])+$/).max(250).optional().or(O.string().length(0)),
    xh = O.object({
        uid: O.string(),
        reason: Ou,
        comment: bh,
        captcha: O.string()
    }),
    Sh = O.object({
        captcha: O.string(),
        email: H
    }),
    Ch = Pm(gu),
    wh = Pm(hu),
    Th = Pm(Zl),
    Eh = Q(O.array(ju)),
    $ = j();
$.router({
    get: {
        summary: `get user`,
        description: `Get a user's data.`,
        method: `GET`,
        path: ``,
        responses: {
            200: Im
        },
        metadata: {
            rateLimit: `userGet`
        }
    },
    create: {
        summary: `create user`,
        description: `Creates a new user`,
        method: `POST`,
        path: `/signup`,
        body: Lm.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userSignup`,
            requireConfiguration: {
                path: `users.signUp`,
                invalidMessage: `Sign up is temporarily disabled`
            }
        }
    },
    getNameAvailability: {
        summary: `check name`,
        description: `Checks to see if a username is available`,
        method: `GET`,
        path: `/checkName/:name`,
        pathParams: Rm.strict(),
        responses: {
            200: zm
        },
        metadata: {
            authenticationOptions: {
                isPublic: !0
            },
            rateLimit: `userCheckName`
        }
    },
    delete: {
        summary: `delete user`,
        description: `Deletes a user's account`,
        method: `DELETE`,
        path: ``,
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                requireFreshToken: !0
            },
            rateLimit: `userDelete`
        }
    },
    reset: {
        summary: `reset user`,
        description: `Completely resets a user's account to a blank state`,
        method: `PATCH`,
        path: `/reset`,
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                requireFreshToken: !0
            },
            rateLimit: `userReset`
        }
    },
    updateName: {
        summary: `update username`,
        description: `Updates a user's name`,
        method: `PATCH`,
        path: `/name`,
        body: Bm.strict(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                requireFreshToken: !0
            },
            rateLimit: `userUpdateName`
        }
    },
    updateLeaderboardMemory: {
        summary: `update lbMemory`,
        description: `Updates a user's cached leaderboard state`,
        method: `PATCH`,
        path: `/leaderboardMemory`,
        body: Vm.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userUpdateLBMemory`
        }
    },
    updateEmail: {
        summary: `update email`,
        description: `Updates a user's email`,
        method: `PATCH`,
        path: `/email`,
        body: Hm.strict(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                requireFreshToken: !0
            },
            rateLimit: `userUpdateEmail`
        }
    },
    updatePassword: {
        summary: `update password`,
        description: `Updates a user's password`,
        method: `PATCH`,
        path: `/password`,
        body: Um.strict(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                requireFreshToken: !0
            },
            rateLimit: `userUpdateEmail`
        }
    },
    getPersonalBests: {
        summary: `get personal bests`,
        description: `Get user's personal bests`,
        method: `GET`,
        path: `/personalBests`,
        query: Wm.strict(),
        responses: {
            200: Gm
        },
        metadata: {
            authenticationOptions: {
                acceptApeKeys: !0
            },
            rateLimit: `userGet`
        }
    },
    deletePersonalBests: {
        summary: `delete personal bests`,
        description: `Deletes a user's personal bests`,
        method: `DELETE`,
        path: `/personalBests`,
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                requireFreshToken: !0
            },
            rateLimit: `userClearPB`
        }
    },
    optOutOfLeaderboards: {
        summary: `leaderboards opt out`,
        description: `Opt out of the leaderboards`,
        method: `POST`,
        path: `/optOutOfLeaderboards`,
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                requireFreshToken: !0
            },
            rateLimit: `userOptOutOfLeaderboards`
        }
    },
    addResultFilterPreset: {
        summary: `add result filter preset`,
        description: `Add a result filter preset`,
        method: `POST`,
        path: `/resultFilterPresets`,
        body: Km.strict(),
        responses: {
            200: qm
        },
        metadata: {
            rateLimit: `userCustomFilterAdd`,
            requireConfiguration: {
                path: `results.filterPresets.enabled`,
                invalidMessage: `Result filter presets are not available at this time.`
            }
        }
    },
    removeResultFilterPreset: {
        summary: `remove result filter preset`,
        description: `Remove a result filter preset`,
        method: `DELETE`,
        path: `/resultFilterPresets/:presetId`,
        pathParams: Jm.strict(),
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userCustomFilterRemove`,
            requireConfiguration: {
                path: `results.filterPresets.enabled`,
                invalidMessage: `Result filter presets are not available at this time.`
            }
        }
    },
    getTags: {
        summary: `get tags`,
        description: `Get the users tags`,
        method: `GET`,
        path: `/tags`,
        responses: {
            200: Ym
        },
        metadata: {
            authenticationOptions: {
                acceptApeKeys: !0
            },
            rateLimit: `userTagsGet`
        }
    },
    createTag: {
        summary: `add tag`,
        description: `Add a tag for the current user`,
        method: `POST`,
        path: `/tags`,
        body: Xm.strict(),
        responses: {
            200: Zm
        },
        metadata: {
            rateLimit: `userTagsAdd`
        }
    },
    editTag: {
        summary: `edit tag`,
        description: `Edit a tag`,
        method: `PATCH`,
        path: `/tags`,
        body: Qm.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userTagsEdit`
        }
    },
    deleteTag: {
        summary: `delete tag`,
        description: `Delete a tag`,
        method: `DELETE`,
        path: `/tags/:tagId`,
        pathParams: $m.strict(),
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userTagsRemove`
        }
    },
    deleteTagPersonalBest: {
        summary: `delete tag PBs`,
        description: `Delete personal bests of a tag`,
        method: `DELETE`,
        path: `/tags/:tagId/personalBest`,
        pathParams: $m.strict(),
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userTagsClearPB`
        }
    },
    getCustomThemes: {
        summary: `get custom themes`,
        description: `Get custom themes for the current user`,
        method: `GET`,
        path: `/customThemes`,
        responses: {
            200: eh
        },
        metadata: {
            rateLimit: `userCustomThemeGet`
        }
    },
    addCustomTheme: {
        summary: `add custom themes`,
        description: `Add a custom theme for the current user`,
        method: `POST`,
        path: `/customThemes`,
        body: th.strict(),
        responses: {
            200: nh
        },
        metadata: {
            rateLimit: `userCustomThemeAdd`
        }
    },
    deleteCustomTheme: {
        summary: `delete custom themes`,
        description: `Delete a custom theme`,
        method: `DELETE`,
        path: `/customThemes`,
        body: rh.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userCustomThemeRemove`
        }
    },
    editCustomTheme: {
        summary: `edit custom themes`,
        description: `Edit a custom theme`,
        method: `PATCH`,
        path: `/customThemes`,
        body: ih.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userCustomThemeEdit`
        }
    },
    getDiscordOAuth: {
        summary: `discord oauth`,
        description: `Start OAuth authentication with discord`,
        method: `GET`,
        path: `/discord/oauth`,
        responses: {
            200: ah
        },
        metadata: {
            rateLimit: `userDiscordLink`,
            requireConfiguration: {
                path: `users.discordIntegration.enabled`,
                invalidMessage: `Discord integration is not available at this time`
            }
        }
    },
    linkDiscord: {
        summary: `link with discord`,
        description: `Links a user's account with a discord account`,
        method: `POST`,
        path: `/discord/link`,
        body: oh.strict(),
        responses: {
            200: sh
        },
        metadata: {
            rateLimit: `userDiscordLink`,
            requireConfiguration: {
                path: `users.discordIntegration.enabled`,
                invalidMessage: `Discord integration is not available at this time`
            }
        }
    },
    unlinkDiscord: {
        summary: `unlink discord`,
        description: `Unlinks a user's account with a discord account`,
        method: `POST`,
        path: `/discord/unlink`,
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userDiscordUnlink`
        }
    },
    getStats: {
        summary: `get stats`,
        description: `Gets a user's typing stats data`,
        method: `GET`,
        path: `/stats`,
        responses: {
            200: ch
        },
        metadata: {
            authenticationOptions: {
                acceptApeKeys: !0
            },
            rateLimit: `userGet`
        }
    },
    setStreakHourOffset: {
        summary: `set streak hour offset`,
        description: `Sets a user's streak hour offset`,
        method: `POST`,
        path: `/setStreakHourOffset`,
        body: lh.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `setStreakHourOffset`
        }
    },
    getFavoriteQuotes: {
        summary: `get favorite quotes`,
        description: `Gets a user's favorite quotes`,
        method: `GET`,
        path: `/favoriteQuotes`,
        responses: {
            200: uh
        },
        metadata: {
            rateLimit: `quoteFavoriteGet`
        }
    },
    addQuoteToFavorites: {
        summary: `add favorite quotes`,
        description: `Add a quote to the user's favorite quotes`,
        method: `POST`,
        path: `/favoriteQuotes`,
        body: dh.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `quoteFavoritePost`
        }
    },
    removeQuoteFromFavorites: {
        summary: `remove favorite quotes`,
        description: `Remove a quote to the user's favorite quotes`,
        method: `DELETE`,
        path: `/favoriteQuotes`,
        body: fh.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `quoteFavoriteDelete`
        }
    },
    getProfile: {
        summary: `get profile`,
        description: `Gets a user's profile`,
        method: `GET`,
        path: `/:uidOrName/profile`,
        pathParams: ph.strict(),
        query: mh.strict(),
        responses: {
            200: hh,
            404: Z.describe(`User not found`)
        },
        metadata: {
            authenticationOptions: {
                isPublic: !0
            },
            rateLimit: `userProfileGet`,
            requireConfiguration: {
                path: `users.profiles.enabled`,
                invalidMessage: `Profiles are not available at this time`
            }
        }
    },
    updateProfile: {
        summary: `update profile`,
        description: `Update a user's profile`,
        method: `PATCH`,
        path: `/profile`,
        body: gh.strict(),
        responses: {
            200: _h
        },
        metadata: {
            rateLimit: `userProfileUpdate`,
            requireConfiguration: {
                path: `users.profiles.enabled`,
                invalidMessage: `Profiles are not available at this time`
            }
        }
    },
    getInbox: {
        summary: `get inbox`,
        description: `Gets the user's inbox`,
        method: `GET`,
        path: `/inbox`,
        responses: {
            200: vh
        },
        metadata: {
            rateLimit: `userMailGet`,
            requireConfiguration: {
                path: `users.inbox.enabled`,
                invalidMessage: `Your inbox is not available at this time.`
            }
        }
    },
    updateInbox: {
        summary: `update inbox`,
        description: `Updates the user's inbox`,
        method: `PATCH`,
        body: yh.strict(),
        path: `/inbox`,
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `userMailUpdate`,
            requireConfiguration: {
                path: `users.inbox.enabled`,
                invalidMessage: `Your inbox is not available at this time.`
            }
        }
    },
    report: {
        summary: `report user`,
        description: `Report a user`,
        method: `POST`,
        path: `/report`,
        body: xh.strict(),
        responses: {
            200: X
        },
        metadata: {
            rateLimit: `quoteReportSubmit`,
            requirePermission: `canReport`,
            requireConfiguration: {
                path: `quotes.reporting.enabled`,
                invalidMessage: `User reporting is unavailable.`
            }
        }
    },
    verificationEmail: {
        summary: `send verification email`,
        description: `Send a verification email`,
        method: `GET`,
        path: `/verificationEmail`,
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                noCache: !0
            },
            rateLimit: `userRequestVerificationEmail`
        }
    },
    forgotPasswordEmail: {
        summary: `send forgot password email`,
        description: `Send a forgot password email`,
        method: `POST`,
        path: `/forgotPasswordEmail`,
        body: Sh.strict(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                isPublic: !0
            },
            rateLimit: `userForgotPasswordEmail`
        }
    },
    revokeAllTokens: {
        summary: `revoke all tokens`,
        description: `Revoke all tokens for the current user.`,
        method: `POST`,
        path: `/revokeAllTokens`,
        body: $.noBody(),
        responses: {
            200: X
        },
        metadata: {
            authenticationOptions: {
                requireFreshToken: !0,
                noCache: !0
            },
            rateLimit: `userRevokeAllTokens`
        }
    },
    getTestActivity: {
        summary: `get test activity`,
        description: `Get user's test activity`,
        method: `GET`,
        path: `/testActivity`,
        responses: {
            200: Ch
        },
        metadata: {
            rateLimit: `userTestActivity`
        }
    },
    getCurrentTestActivity: {
        summary: `get current test activity`,
        description: `Get test activity for the last up to 372 days for the current user `,
        method: `GET`,
        path: `/currentTestActivity`,
        responses: {
            200: wh
        },
        metadata: {
            authenticationOptions: {
                acceptApeKeys: !0
            },
            rateLimit: `userCurrentTestActivity`
        }
    },
    getStreak: {
        summary: `get streak`,
        description: `Get user's streak data`,
        method: `GET`,
        path: `/streak`,
        responses: {
            200: Th
        },
        metadata: {
            authenticationOptions: {
                acceptApeKeys: !0
            },
            rateLimit: `userStreak`
        }
    },
    getFriends: {
        summary: `get friends`,
        description: `get friends list`,
        method: `GET`,
        path: `/friends`,
        responses: {
            200: Eh
        },
        metadata: {
            rateLimit: `userFriendGet`,
            requireConfiguration: {
                path: `connections.enabled`,
                invalidMessage: `Connections are not available at this time.`
            }
        }
    }
}, {
    pathPrefix: `/users`,
    strictStatusCodes: !0,
    metadata: {
        openApiTags: `users`
    },
    commonResponses: Fm
});

function Dh(e, t = 0) {
    return e - (e - t) % 864e5
}

function Oh(e = 0) {
    let t = e * 36e5;
    return Dh(Date.now(), t)
}

function kh(e, t = 0) {
    let n = t * 36e5;
    return Dh(Date.now() - 864e5, n) === Dh(e, n)
}

function Ah(e, t = 0) {
    let n = t * 36e5;
    return Dh(Date.now(), n) === Dh(e, n)
}
O.string().regex(/^\d+$/, `Needs to be a number or a number represented as a string e.g. "10".`).or(O.number().transform(String));
var jh = () => O.string().regex(/^[a-zA-Z0-9_]+$/);
jh(), jh().max(50), O.string().nullable().optional().transform(e => e ?? void 0), O.number().nonnegative().max(100), O.number().nonnegative().max(420), O.enum([`repeat`, `random`, `shuffle`]), O.enum([`word`, `time`, `section`]);

function Mh(e) {
    return (t, n) => ({
        message: t.code === `invalid_enum_value` ? `Invalid enum value. ${e}` : t.message ?? `Required`
    })
}
O.number().int().safe().nonnegative().default(0);
var Nh = O.enum(`Roboto_Mono.Noto_Naskh_Arabic.Source_Code_Pro.IBM_Plex_Sans.Inconsolata.Fira_Code.JetBrains_Mono.Roboto.Montserrat.Titillium_Web.Lexend_Deca.Comic_Sans_MS.Oxygen.Nunito.Itim.Courier.Comfortaa.Coming_Soon.Atkinson_Hyperlegible.Lato.Lalezar.Boon.Open_Dyslexic.Ubuntu.Ubuntu_Mono.Georgia.Cascadia_Mono.IBM_Plex_Mono.Overpass_Mono.Hack.CommitMono.Mononoki.Parkinsans.Geist.Sarabun.Kanit.Geist_Mono.Iosevka.Proto.Adwaita_Mono.Inter_Tight.Space_Grotesk.Noto_Sans_Lao`.split(`.`), {
    errorMap: Mh(`Must be a known font family`)
}).or(O.string().max(50).regex(/^[a-zA-Z0-9_\-+.]+$/));

function Ph(e) {
    return (...t) => !e(...t)
}
export {
    lr as $, Xl as A, oo as B, vu as C, te as Ct, iu as D, yu as E, tu as F, Zr as G, fi as H, ec as I, Fr as J, Nr as K, F as L, ru as M, Yl as N, Ql as O, H as P, ur as Q, lo as R, Ep as S, s as St, Au as T, M as U, Wa as V, ii as W, Er as X, Cr as Y, Tr as Z, zp as _, o as _t, kh as a, fn as at, Ip as b, r as bt, um as c, on as ct, Kp as d, C as dt, Mr as et, Jp as f, E as ft, Wp as g, c as gt, Hp as h, O as ht, Oh as i, Lr as it, nu as j, au as k, sm as l, bt as lt, qp as m, w as mt, Nh as n, Ir as nt, bh as o, ln as ot, Gp as p, T as pt, wr as q, Ah as r, vr as rt, Cm as s, cn as st, Ph as t, Sr as tt, om as u, gt as ut, Rp as v, a as vt, ku as w, ee as wt, Tp as x, i as xt, Lp as y, ne as yt, uo as z
};
//#sourceMappingURL=monkeytype-packages.BmEtDlnt.js.map