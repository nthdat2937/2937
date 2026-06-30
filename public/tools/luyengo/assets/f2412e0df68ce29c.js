"use strict";
(self.webpackChunkkeybr_com = self.webpackChunkkeybr_com || []).push([
    [5084], {
        3078(e, s, t) {
            t.d(s, {
                A: () => o,
                K: () => l
            });
            var n = t(4922),
                a = t(1739),
                i = t(7810),
                r = t(5051);
            async function l(e) {
                switch (e) {
                    case r.E3.EN_ALICE_WONDERLAND:
                        return (await t.e(1278).then(t.t.bind(t, 9897, 17))).default;
                    case r.E3.EN_JEKYLL_HYDE:
                        return (await t.e(1607).then(t.t.bind(t, 5740, 17))).default;
                    case r.E3.EN_CALL_WILD:
                        return (await t.e(2810).then(t.t.bind(t, 3927, 17))).default;
                    case r.E3.ES_MARIANELA:
                        return (await t.e(7758).then(t.t.bind(t, 1955, 17))).default;
                    case r.E3.DE_ALICE_WONDERLAND:
                        return (await t.e(3786).then(t.t.bind(t, 4653, 17))).default;
                    case r.E3.FR_ALICE_WONDERLAND:
                        return (await t.e(8417).then(t.t.bind(t, 2984, 17))).default;
                    default:
                        throw new Error
                }
            }

            function o({
                book: e,
                children: s,
                fallback: t
            }) {
                return (0, n.jsx)(d, {
                    book: e,
                    fallback: t,
                    children: s
                }, e.id)
            }

            function d({
                book: e,
                children: s,
                fallback: t
            }) {
                const n = function(e) {
                    const [s, t] = (0, i.useState)(null);
                    return (0, i.useEffect)(() => {
                        let s = !1;
                        return l(e).then(n => {
                            s || t({
                                book: e,
                                content: n
                            })
                        }).catch(a.WL), () => {
                            s = !0
                        }
                    }, [e]), s
                }(e);
                return null == n ? t : s(n)
            }
        },
        1163(e, s, t) {
            t.d(s, {
                u: () => o,
                z: () => a
            });
            var n = t(8892);
            async function a(e) {
                switch (e) {
                    case n.TM.AR:
                        return (await t.e(9374).then(t.t.bind(t, 4474, 17))).default;
                    case n.TM.BE:
                        return (await t.e(3328).then(t.t.bind(t, 444, 17))).default;
                    case n.TM.BR:
                        return (await t.e(3791).then(t.t.bind(t, 3245, 17))).default;
                    case n.TM.CS:
                        return (await t.e(3225).then(t.t.bind(t, 8879, 17))).default;
                    case n.TM.DA:
                        return (await t.e(3858).then(t.t.bind(t, 558, 17))).default;
                    case n.TM.DE:
                        return (await t.e(4454).then(t.t.bind(t, 3042, 17))).default;
                    case n.TM.EL:
                        return (await t.e(140).then(t.t.bind(t, 2795, 17))).default;
                    case n.TM.EN:
                        return (await t.e(5758).then(t.t.bind(t, 762, 17))).default;
                    case n.TM.EN_GB:
                        return (await t.e(8196).then(t.t.bind(t, 7952, 17))).default;
                    case n.TM.ES:
                        return (await t.e(9163).then(t.t.bind(t, 1257, 17))).default;
                    case n.TM.ET:
                        return (await t.e(1972).then(t.t.bind(t, 704, 17))).default;
                    case n.TM.FA:
                        return (await t.e(6952).then(t.t.bind(t, 5892, 17))).default;
                    case n.TM.FI:
                        return (await t.e(3536).then(t.t.bind(t, 4316, 17))).default;
                    case n.TM.FR:
                        return (await t.e(1715).then(t.t.bind(t, 4081, 17))).default;
                    case n.TM.HE:
                        return (await t.e(3090).then(t.t.bind(t, 7630, 17))).default;
                    case n.TM.HR:
                        return (await t.e(1661).then(t.t.bind(t, 6179, 17))).default;
                    case n.TM.HU:
                        return (await t.e(1650).then(t.t.bind(t, 6753, 17))).default;
                    case n.TM.IT:
                        return (await t.e(6800).then(t.t.bind(t, 7500, 17))).default;
                    case n.TM.JA:
                        return (await t.e(316).then(t.t.bind(t, 7576, 17))).default;
                    case n.TM.LT:
                        return (await t.e(2503).then(t.t.bind(t, 4197, 17))).default;
                    case n.TM.LV:
                        return (await t.e(5301).then(t.t.bind(t, 171, 17))).default;
                    case n.TM.NB:
                        return (await t.e(603).then(t.t.bind(t, 7497, 17))).default;
                    case n.TM.NL:
                        return (await t.e(5829).then(t.t.bind(t, 2699, 17))).default;
                    case n.TM.PL:
                        return (await t.e(4571).then(t.t.bind(t, 2697, 17))).default;
                    case n.TM.PT:
                        return (await t.e(4035).then(t.t.bind(t, 609, 17))).default;
                    case n.TM.RO:
                        return (await t.e(330).then(t.t.bind(t, 5590, 17))).default;
                    case n.TM.RU:
                        return (await t.e(1440).then(t.t.bind(t, 6252, 17))).default;
                    case n.TM.SL:
                        return (await t.e(398).then(t.t.bind(t, 4970, 17))).default;
                    case n.TM.SV:
                        return (await t.e(5028).then(t.t.bind(t, 224, 17))).default;
                    case n.TM.TH:
                        return (await t.e(3715).then(t.t.bind(t, 9425, 17))).default;
                    case n.TM.TR:
                        return (await t.e(6281).then(t.t.bind(t, 5599, 17))).default;
                    case n.TM.UK:
                        return (await t.e(5299).then(t.t.bind(t, 2433, 17))).default;
                    case n.TM.VI:
                        return (await t.e(2560).then(t.t.bind(t, 5596, 17))).default;
                    case n.TM.KO:
                        return (await t.e(9999).then(t.t.bind(t, 9999, 17))).default;
                    default:
                        throw new Error
                }
            }
            var i = t(4922),
                r = t(1739),
                l = t(7810);

            function o({
                language: e,
                children: s,
                fallback: t
            }) {
                return (0, i.jsx)(d, {
                    language: e,
                    fallback: t,
                    children: s
                }, e.id)
            }

            function d({
                language: e,
                children: s,
                fallback: t
            }) {
                const n = function(e) {
                    const [s, t] = (0, l.useState)(null);
                    return (0, l.useEffect)(() => {
                        let s = !1;
                        return a(e).then(e => {
                            s || t(e)
                        }).catch(r.WL), () => {
                            s = !0
                        }
                    }, [e]), s
                }(e);
                return null == n ? t : s(n)
            }
        },
        2760(e, s, t) {
            t.r(s), t.d(s, {
                default: () => Ms
            });
            var n = t(4922),
                a = t(8892),
                i = t(3764),
                r = t(1609),
                l = t(1739),
                o = t(8767),
                d = t(3078),
                c = t(1163),
                u = t(3761),
                h = t(2352),
                x = t(6682),
                j = t(7810);

            function p({
                children: e,
                fallback: s = (0, n.jsx)(h.e2, {})
            }) {
                const {
                    settings: t
                } = (0, i.t0)(), r = t.get(u.ls.type), {
                    language: l
                } = a.qD.from(t);
                return (0, n.jsx)(x.Z, {
                    language: l,
                    children: t => (0, n.jsx)(g, {
                        model: t,
                        fallback: s,
                        children: e
                    }, r.id)
                })
            }

            function g({
                model: e,
                children: s,
                fallback: t
            }) {
                const n = function(e) {
                    const {
                        settings: s
                    } = (0, i.t0)(), t = (0, a.de)(), [n, r] = (0, j.useState)(null);
                    return (0, j.useEffect)(() => {
                        let n = !1;
                        return (async () => {
                            switch (s.get(u.ls.type)) {
                                case u.nv.GUIDED:
                                    {
                                        const {
                                            language: i
                                        } = a.qD.from(s),
                                        l = await (0, c.z)(i);n || r(new u.ZC(s, t, e, l));
                                        break
                                    }
                                case u.nv.WORDLIST:
                                    {
                                        const {
                                            language: i
                                        } = a.qD.from(s),
                                        l = await (0, c.z)(i);n || r(new u.PH(s, t, e, l));
                                        break
                                    }
                                case u.nv.BOOKS:
                                    {
                                        const a = s.get(u.ls.books.book),
                                            i = await (0, d.K)(a);n || r(new u.Ni(s, t, e, {
                                            book: a,
                                            content: i
                                        }));
                                        break
                                    }
                                case u.nv.CUSTOM:
                                    n || r(new u.VA(s, t, e));
                                    break;
                                case u.nv.CODE:
                                    n || r(new u.kf(s, t, e));
                                    break;
                                case u.nv.NUMBERS:
                                    n || r(new u.vh(s, t, e));
                                    break;
                                default:
                                    throw new Error
                            }
                        })().catch(l.WL), () => {
                            n = !0
                        }
                    }, [s, t, e]), n
                }(e);
                return null == n ? t : s(n)
            }
            var m = t(5176),
                f = t(6274),
                y = t(1243),
                w = t(6489),
                b = t(673),
                A = t(8200),
                k = t(9364),
                v = t(898),
                S = t(2461),
                L = t(7261),
                M = t(8120),
                D = t(4392),
                T = t(6681),
                K = t(6050),
                C = t(203),
                I = t(5616);
            const E = (0, j.memo)(function({
                onChangeView: e,
                onResetLesson: s,
                onSkipLesson: t,
                onHelp: a
            }) {
                const {
                    formatMessage: l
                } = (0, I.A)(), {
                    settings: o
                } = (0, i.t0)(), {
                    setView: d
                } = (0, r.lQ)(vs);
                return (0, n.jsxs)("div", {
                    id: v.Dy.controls,
                    className: "ckRxMuQo5D",
                    children: [(0, n.jsx)(D.K, {
                        icon: (0, n.jsx)(T.I, {
                            shape: C.ORM
                        }),
                        title: l({
                            id: "426G6pUn"
                        }),
                        onClick: a
                    }), (0, n.jsxs)(M.ig, {
                        swap: "icon",
                        children: [(0, n.jsx)(D.K, {
                            icon: (0, n.jsx)(T.I, {
                                shape: C.P$h
                            }),
                            title: l({
                                id: "ew3YFEl1"
                            }),
                            onClick: s
                        }), (0, n.jsx)(D.K, {
                            icon: (0, n.jsx)(T.I, {
                                shape: C.xJN
                            }),
                            title: l({
                                id: "XHwxCyVt"
                            }),
                            onClick: t
                        })]
                    }), (0, n.jsx)(D.K, {
                        icon: (0, n.jsx)(T.I, {
                            shape: C.Ms
                        }),
                        title: l({
                            id: "EvKMNV57"
                        }),
                        onClick: e
                    }), o.isNew ? (0, n.jsx)(K.$, {
                        icon: (0, n.jsx)(T.I, {
                            shape: C.CZ3
                        }),
                        label: l({
                            id: "K46Qd61f"
                        }),
                        title: l({
                            id: "iOD0KYfU"
                        }),
                        onClick: () => {
                            d("settings")
                        }
                    }) : (0, n.jsx)(D.K, {
                        icon: (0, n.jsx)(T.I, {
                            shape: C.CZ3
                        }),
                        title: l({
                            id: "iOD0KYfU"
                        }),
                        onClick: () => {
                            d("settings")
                        }
                    })]
                })
            });
            var R = t(3439),
                N = t(1019),
                V = t(2877),
                z = t(2739),
                H = t(9071),
                F = t(4661),
                G = t(5595);

            function O({
                lessonKey: e,
                learningRate: s
            }) {
                const {
                    formatNumber: t,
                    formatPercents: a
                } = (0, M.L_)();
                return (e.bestConfidence ?? 0) >= 1 ? (0, n.jsx)(H.l, {
                    align: "center",
                    children: (0, n.jsx)(F.SX, {
                        children: (0, n.jsx)(G.A, {
                            id: "YoZAC3nB"
                        })
                    })
                }) : null != s && s.remainingLessons > 0 && s.certainty > 0 ? (0, n.jsx)(H.l, {
                    align: "center",
                    children: (0, n.jsx)(F.SX, {
                        children: (0, n.jsx)(G.A, {
                            id: "OdKFlRV0",
                            values: {
                                remainingLessons: (0, n.jsx)(F.WT, {
                                    value: t(s.remainingLessons)
                                }),
                                certainty: (0, n.jsx)(F.WT, {
                                    value: a(s.certainty)
                                })
                            }
                        })
                    })
                }) : (0, n.jsx)(H.l, {
                    align: "center",
                    children: (0, n.jsx)(F.SX, {
                        children: (0, n.jsx)(G.A, {
                            id: "mSjUBu0s"
                        })
                    })
                })
            }

            function U({
                lessonKey: e,
                keyStats: s
            }) {
                const {
                    settings: t
                } = (0, i.t0)(), a = new u.We(t), r = u.fL.from(s.samples, a);
                return (0, n.jsxs)("div", {
                    className: "kknqhPomby",
                    children: [(0, n.jsxs)(z.az, {
                        alignItems: "center",
                        justifyContent: "center",
                        children: [(0, n.jsx)(v.Uz, {
                            lessonKey: e,
                            size: "large"
                        }), (0, n.jsx)(v.cY, {
                            lessonKey: e
                        })]
                    }), (0, n.jsx)(O, {
                        lessonKey: e,
                        learningRate: r
                    }), (0, n.jsx)(V.Iu, {
                        lessonKey: e,
                        learningRate: r,
                        width: "50rem",
                        height: "15rem"
                    })]
                })
            }
            const B = (0, j.memo)(function({
                state: {
                    keyStatsMap: e,
                    summaryStats: s,
                    lessonKeys: t,
                    streakList: a,
                    dailyGoal: i
                }
            }) {
                const [r, l] = (0, j.useState)({
                    type: "hidden"
                });
                return (0, j.useEffect)(() => {
                    const e = new o.ZU;
                    switch (r.type) {
                        case "visible-in":
                            e.delayed(300, () => {
                                l({ ...r,
                                    type: "visible"
                                })
                            });
                            break;
                        case "visible-out":
                            e.delayed(300, () => {
                                l({
                                    type: "hidden"
                                })
                            })
                    }
                    return () => {
                        e.cancelAll()
                    }
                }, [r]), (0, n.jsxs)("div", {
                    id: v.Dy.indicators,
                    className: "p8KBocnU4S",
                    children: [(0, n.jsx)(v.I$, {
                        summaryStats: s,
                        names: v.Dy
                    }), (0, n.jsx)(v.ye, {
                        lessonKeys: t,
                        names: v.Dy,
                        onKeyHoverIn: (e, s) => {
                            l({
                                type: "visible-in",
                                key: e,
                                elem: s
                            })
                        },
                        onKeyHoverOut: () => {
                            switch (r.type) {
                                case "visible-in":
                                    l({
                                        type: "hidden"
                                    });
                                    break;
                                case "visible":
                                    l({ ...r,
                                        type: "visible-out"
                                    })
                            }
                        }
                    }), (0, n.jsx)(v.TG, {
                        lessonKeys: t,
                        names: v.Dy
                    }), (0, n.jsx)(v.Dz, {
                        streakList: a,
                        names: v.Dy
                    }), i.goal > 0 && (0, n.jsx)(v.D4, {
                        dailyGoal: i,
                        names: v.Dy
                    }), ("visible" === r.type || "visible-out" === r.type) && (0, n.jsx)(R.Z, {
                        children: (0, n.jsx)(N.z, {
                            anchor: r.elem,
                            onMouseEnter: () => {
                                l({ ...r,
                                    type: "visible"
                                })
                            },
                            onMouseLeave: () => {
                                l({ ...r,
                                    type: "visible-out"
                                })
                            },
                            children: (0, n.jsx)(U, {
                                lessonKey: r.key,
                                keyStats: e.get(r.key.letter)
                            })
                        })
                    })]
                })
            });
            var q = t(4071),
                P = t(4329);
            const W = (0, j.memo)(function({
                    focus: e,
                    depressedKeys: s,
                    toggledKeys: t,
                    suffix: r,
                    lastLesson: l
                }) {
                    const {
                        settings: o
                    } = (0, i.t0)(), d = (0, a.de)(), c = o.get(a.Aw.colors), u = o.get(a.Aw.pointers);
                    return (0, n.jsxs)(q.$1, {
                        keyboard: d,
                        height: "16rem",
                        children: [(0, n.jsx)(q.vj, {
                            depressedKeys: s,
                            toggledKeys: t,
                            showColors: c
                        }), e && u && (0, n.jsx)(q.Mz, {
                            suffix: r
                        }), e && l && (0, n.jsx)(q.iI, {
                            histogram: (0, q.Bq)(l.misses),
                            modifier: "m"
                        }), e && l && (0, n.jsx)(q.iI, {
                            histogram: (0, q.Bq)(l.hits),
                            modifier: "h"
                        }), e && l && (0, n.jsx)(q.oP, {
                            histogram: l.misses2,
                            modifier: "m"
                        }), e && l && (0, n.jsx)(q.oP, {
                            histogram: l.hits2,
                            modifier: "h"
                        }), e || (0, n.jsx)(q.JC, {})]
                    })
                }),
                Q = (0, P.Q)(W);
            var Z = t(3402), $ = t(8618), J = t(4100); J.rP.restrict = (s) => s;

            function Y() {
                const e = (new i.wB).set(u.ls.targetSpeed, 175),
                    s = new u.We(e),
                    t = new u.MZ({
                        letter: new J.rP(97, 1, "A"),
                        samples: [],
                        timeToType: 380,
                        bestTimeToType: 380,
                        confidence: s.confidence(380),
                        bestConfidence: s.confidence(380)
                    }),
                    a = u.fL.example(s);
                return (0, n.jsx)("div", {
                    className: "lhFNV4x3PN",
                    children: (0, n.jsx)(V.Iu, {
                        lessonKey: t,
                        learningRate: a,
                        width: "36rem",
                        height: "15rem"
                    })
                })
            }
            const _ = (0, j.memo)(function({
                onClose: e
            }) {
                return (0, n.jsxs)(Z.p, {
                    onClose: e,
                    children: [(0, n.jsx)($.q, {
                        size: "large",
                        children: (0, n.jsx)(G.A, {
                            id: "TK2AQYE4"
                        })
                    }), (0, n.jsx)($.q, {
                        size: "large",
                        children: (0, n.jsx)(G.A, {
                            id: "L4Q6Jv/m"
                        })
                    }), (0, n.jsx)($.q, {
                        size: "large",
                        children: (0, n.jsx)(G.A, {
                            id: "dcs5GKBr"
                        })
                    }), (0, n.jsx)($.q, {
                        size: "large",
                        children: (0, n.jsx)(G.A, {
                            id: "nlTr2iYv"
                        })
                    }), (0, n.jsx)($.q, {
                        size: "small",
                        anchor: `#${v.Dy.textInput}`,
                        position: "block-end",
                        children: (0, n.jsx)(G.A, {
                            id: "6cimNPP8"
                        })
                    }), (0, n.jsx)($.q, {
                        size: "small",
                        anchor: `#${v.Dy.keyboard}`,
                        position: "block-start",
                        children: (0, n.jsx)(G.A, {
                            id: "N2+AAoje"
                        })
                    }), (0, n.jsx)($.q, {
                        size: "small",
                        anchor: `#${v.Dy.speed}`,
                        position: "block-end",
                        children: (0, n.jsx)(G.A, {
                            id: "g+ABxSvt"
                        })
                    }), (0, n.jsx)($.q, {
                        size: "small",
                        anchor: `#${v.Dy.accuracy}`,
                        position: "block-end",
                        children: (0, n.jsx)(G.A, {
                            id: "ralhBugz"
                        })
                    }), (0, n.jsx)($.q, {
                        size: "small",
                        anchor: `#${v.Dy.score}`,
                        position: "block-end",
                        children: (0, n.jsx)(G.A, {
                            id: "i6Z7Ni8H"
                        })
                    }), (0, n.jsxs)($.q, {
                        size: "small",
                        anchor: `#${v.Dy.keySet}`,
                        position: "block-end",
                        children: [(0, n.jsx)(G.A, {
                            id: "cdwSwrgK"
                        }), (0, n.jsx)(v.Bq, {})]
                    }), (0, n.jsxs)($.q, {
                        size: "small",
                        anchor: `#${v.Dy.keySet}`,
                        position: "block-end",
                        children: [(0, n.jsx)(G.A, {
                            id: "E8lSFrMd"
                        }), (0, n.jsx)(Y, {})]
                    }), (0, n.jsx)($.q, {
                        size: "small",
                        anchor: `#${v.Dy.currentKey}`,
                        position: "block-end",
                        children: (0, n.jsx)(G.A, {
                            id: "U5/lAdu+"
                        })
                    })]
                })
            });
            var X;
            ! function(e) {
                e[e.Normal = 1] = "Normal", e[e.Compact = 2] = "Compact", e[e.Bare = 3] = "Bare"
            }(X || (X = {}));
            const ee = (0, i.Ht)("prefs.practice.view", X, X.Normal);
            class se extends j.PureComponent {
                focusRef = (0, j.createRef)();
                state = {
                    view: i.pm.get(ee),
                    tour: !1,
                    focus: !1
                };
                componentDidMount() {
                    this.props.state.settings.isNew && this.setState({
                        view: X.Normal,
                        tour: !0
                    })
                }
                render() {
                    const {
                        props: {
                            state: e,
                            lines: s,
                            depressedKeys: t
                        },
                        state: {
                            view: a,
                            tour: i,
                            focus: r
                        },
                        handleResetLesson: l,
                        handleSkipLesson: o,
                        handleKeyDown: d,
                        handleKeyUp: c,
                        handleInput: u,
                        handleFocus: h,
                        handleBlur: x,
                        handleChangeView: j,
                        handleHelp: p,
                        handleTourClose: g
                    } = this;
                    switch (a) {
                        case X.Normal:
                            return (0, n.jsx)(te, {
                                state: e,
                                focus: i || r,
                                depressedKeys: t,
                                toggledKeys: f.nt.modifiers,
                                controls: (0, n.jsx)(E, {
                                    onChangeView: j,
                                    onResetLesson: l,
                                    onSkipLesson: o,
                                    onHelp: p
                                }),
                                textInput: (0, n.jsx)(L.j, {
                                    id: "TextArea/Normal",
                                    children: (0, n.jsx)(S.fs, {
                                        focusRef: this.focusRef,
                                        settings: e.textDisplaySettings,
                                        lines: s,
                                        size: "X0",
                                        demo: i,
                                        onFocus: h,
                                        onBlur: x,
                                        onKeyDown: d,
                                        onKeyUp: c,
                                        onInput: u
                                    })
                                }),
                                tour: i && (0, n.jsx)(_, {
                                    onClose: g
                                })
                            });
                        case X.Compact:
                            return (0, n.jsx)(ne, {
                                state: e,
                                focus: i || r,
                                depressedKeys: t,
                                controls: (0, n.jsx)(E, {
                                    onChangeView: j,
                                    onResetLesson: l,
                                    onSkipLesson: o,
                                    onHelp: p
                                }),
                                textInput: (0, n.jsx)(L.j, {
                                    id: "TextArea/Compact",
                                    children: (0, n.jsx)(S.fs, {
                                        focusRef: this.focusRef,
                                        settings: e.textDisplaySettings,
                                        lines: s,
                                        size: "X1",
                                        demo: i,
                                        onFocus: h,
                                        onBlur: x,
                                        onKeyDown: d,
                                        onKeyUp: c,
                                        onInput: u
                                    })
                                })
                            });
                        case X.Bare:
                            return (0, n.jsx)(ae, {
                                state: e,
                                focus: i || r,
                                depressedKeys: t,
                                controls: (0, n.jsx)(E, {
                                    onChangeView: j,
                                    onResetLesson: l,
                                    onSkipLesson: o,
                                    onHelp: p
                                }),
                                textInput: (0, n.jsx)(L.j, {
                                    id: "TextArea/Bare",
                                    children: (0, n.jsx)(S.fs, {
                                        focusRef: this.focusRef,
                                        settings: e.textDisplaySettings,
                                        lines: s,
                                        size: "X2",
                                        demo: i,
                                        onFocus: h,
                                        onBlur: x,
                                        onKeyDown: d,
                                        onKeyUp: c,
                                        onInput: u
                                    })
                                })
                            })
                    }
                }
                handleResetLesson = () => {
                    this.props.onResetLesson(), this.focusRef.current ?.focus()
                };
                handleSkipLesson = () => {
                    this.props.onSkipLesson(), this.focusRef.current ?.focus()
                };
                handleKeyDown = e => {
                    this.state.focus && this.props.onKeyDown(e)
                };
                handleKeyUp = e => {
                    this.state.focus && this.props.onKeyUp(e)
                };
                handleInput = e => {
                    this.state.focus && this.props.onInput(e)
                };
                handleFocus = () => {
                    this.setState({
                        focus: !0
                    }, () => {
                        this.props.onResetLesson()
                    })
                };
                handleBlur = () => {
                    this.setState({
                        focus: !1
                    }, () => {
                        this.props.onResetLesson()
                    })
                };
                handleChangeView = () => {
                    this.setState(({
                        view: e
                    }) => {
                        const s = function(e) {
                            switch (e) {
                                case X.Normal:
                                    return X.Compact;
                                case X.Compact:
                                    return X.Bare;
                                case X.Bare:
                                    return X.Normal
                            }
                        }(e);
                        return i.pm.set(ee, s), {
                            view: s
                        }
                    }, () => {
                        this.props.onResetLesson(), this.focusRef.current ?.focus()
                    })
                };
                handleHelp = () => {
                    this.setState({
                        view: X.Normal,
                        tour: !0
                    }, () => {
                        this.props.onResetLesson(), this.focusRef.current ?.blur()
                    })
                };
                handleTourClose = () => {
                    this.setState({
                        view: X.Normal,
                        tour: !1
                    }, () => {
                        this.props.onResetLesson(), this.focusRef.current ?.focus()
                    })
                }
            }

            function te({
                state: e,
                focus: s,
                depressedKeys: t,
                toggledKeys: a,
                controls: i,
                textInput: r,
                tour: l
            }) {
                return (0, n.jsxs)(h.ff, {
                    children: [(0, n.jsx)(B, {
                        state: e
                    }), (0, n.jsx)("div", {
                        id: v.Dy.textInput,
                        className: "IqZu7kPCNS",
                        children: r
                    }), (0, n.jsx)("div", {
                        id: v.Dy.keyboard,
                        className: "Lp1lw56v1j",
                        children: (0, n.jsx)(L.j, {
                            id: "Keyboard/Normal",
                            children: (0, n.jsx)(Q, {
                                focus: s,
                                depressedKeys: t,
                                toggledKeys: a,
                                suffix: e.suffix,
                                lastLesson: e.lastLesson
                            })
                        })
                    }), i, l]
                })
            }

            function ne({
                state: e,
                controls: s,
                textInput: t
            }) {
                return (0, n.jsxs)(h.ff, {
                    children: [(0, n.jsx)(B, {
                        state: e
                    }), (0, n.jsx)("div", {
                        id: v.Dy.textInput,
                        className: "WVOCThm4I8",
                        children: t
                    }), s]
                })
            }

            function ae({
                state: e,
                controls: s,
                textInput: t
            }) {
                return (0, n.jsxs)(h.ff, {
                    children: [(0, n.jsx)("div", {
                        id: v.Dy.textInput,
                        className: "q14gh_8pl3",
                        children: t
                    }), s]
                })
            }
            var ie = t(8440),
                re = t(4283),
                le = t(4164);

            function oe() {
                return (0, n.jsx)(ce, {
                    shape: C.p2H,
                    className: "imNeEdQkia"
                })
            }

            function de() {
                return (0, n.jsx)(ce, {
                    shape: C.eK5
                })
            }

            function ce({
                shape: e,
                className: s
            }) {
                return (0, n.jsx)("svg", {
                    className: (0, le.$)("dYKzMOycbs", s),
                    viewBox: "0 0 24 24",
                    children: (0, n.jsx)("path", {
                        d: e
                    })
                })
            }

            function ue({
                event: e
            }) {
                switch (e.type) {
                    case "new-letter":
                        return (0, n.jsx)(ie.w, {
                            icon: (0, n.jsx)(v.Uz, {
                                lessonKey: e.lessonKey,
                                size: "announcement"
                            }),
                            children: (0, n.jsx)(G.A, {
                                id: "wTXmuKQk"
                            })
                        });
                    case "top-speed":
                        return (0, n.jsx)(ie.w, {
                            icon: (0, n.jsx)(oe, {}),
                            children: (0, n.jsx)(G.A, {
                                id: "m58JhvzX"
                            })
                        });
                    case "top-score":
                        return (0, n.jsx)(ie.w, {
                            icon: (0, n.jsx)(oe, {}),
                            children: (0, n.jsx)(G.A, {
                                id: "u4sbVJk0"
                            })
                        });
                    case "daily-goal":
                        return (0, n.jsx)(ie.w, {
                            icon: (0, n.jsx)(de, {}),
                            children: (0, n.jsx)(G.A, {
                                id: "QBxXxzWC"
                            })
                        })
                }
            }

            function he(e) {
                (0, re.o)((0, n.jsx)(ue, {
                    event: e
                }), {
                    autoClose: 3e3,
                    closeOnClick: !0,
                    pauseOnHover: !0
                })
            }
            var xe = t(7436);
            var je = t(5283);
            class pe {
#e;
                settings;
                lesson;
                textInputSettings;
                textDisplaySettings;
                keyStatsMap;
                summaryStats;
                streakList;
                dailyGoal;
                lessonKeys;
                lastLesson = null;
                textInput;
                lines;
                suffix;
                depressedKeys = [];
                constructor(e, s) {
                    this.#e = s, this.settings = e.settings, this.lesson = e.lesson, this.textInputSettings = (0, je.u4)(this.settings), this.textDisplaySettings = (0, je.w2)(this.settings), this.keyStatsMap = e.keyStatsMap.copy(), this.summaryStats = e.summaryStats.copy(), this.streakList = e.streakList.copy(), this.dailyGoal = e.dailyGoal.copy(), this.lessonKeys = this.lesson.update(this.keyStatsMap), this.#s(this.lesson.generate(this.lessonKeys, u.Nk.rng))
                }
                resetLesson() {
                    this.#s(this.textInput.text)
                }
                skipLesson() {
                    this.#s(this.lesson.generate(this.lessonKeys, u.Nk.rng))
                }
                onInput(e) {
                    const s = this.textInput.onInput(e);
                    return this.lines = this.textInput.lines, this.suffix = this.textInput.remaining.map(({
                        codePoint: e
                    }) => e), this.textInput.completed && this.#e(this.#t(), this.textInput), s
                }
#s(e) {
                    this.textInput = new je.ks(e, this.textInputSettings), this.lines = this.textInput.lines, this.suffix = this.textInput.remaining.map(({
                        codePoint: e
                    }) => e)
                }
#t(e = Date.now()) {
                    return m.Q7.fromStats(this.settings.get(a.Aw.layout), this.settings.get(u.ls.type).textType, e, (0, je.IE)(this.textInput.steps))
                }
            }
            class ge {
#n;
#a;
                constructor(e) {
                    this.#n = e, this.#a = 0
                }
                append(e, s) {
                    this.#a < 1 && this.#n.value >= 1 && s({
                        type: "daily-goal"
                    }), this.#a = this.#n.value
                }
            }
            class me {
#i;
#r;
#l;
                constructor(e, s) {
                    this.#i = e, this.#r = s, this.#l = new Set;
                    const t = this.#i.update(this.#r);
                    for (const e of t.findIncludedKeys()) this.#l.has(e.letter) || this.#l.add(e.letter)
                }
                append(e, s) {
                    const t = this.#i.update(this.#r);
                    for (const e of t.findIncludedKeys()) this.#l.has(e.letter) || (this.#l.add(e.letter), s({
                        type: "new-letter",
                        lessonKey: e
                    }))
                }
            }
            class fe {
#o = 0;
#d = 0;
                append(e, s) {
                    this.#o += 1;
                    const {
                        score: t
                    } = e;
                    t > this.#d && (this.#o >= 3 && s({
                        type: "top-score",
                        score: t,
                        previous: this.#d
                    }), this.#d = t)
                }
            }
            class ye {
#o = 0;
#c = 0;
                append(e, s) {
                    this.#o += 1;
                    const {
                        speed: t
                    } = e;
                    t > this.#c && (this.#o >= 3 && s({
                        type: "top-speed",
                        speed: t,
                        previous: this.#c
                    }), this.#c = t)
                }
            }
            class we {
#u;
#i;
#h;
#r;
#x;
#j;
#n;
#p;
                constructor(e, s) {
                    this.#u = e, this.#i = s, this.#h = [], this.#r = new m.Hm(this.#i.letters), this.#x = new m.ux, this.#j = new m.$S, this.#n = new u.ts(this.#u);
                    const t = new me(this.#i, this.#r),
                        n = new ye,
                        a = new fe,
                        i = new ge(this.#n);
                    this.#p = new class {
                        append(e, s) {
                            t.append(e, s), n.append(e, s), a.append(e, s), i.append(e, s)
                        }
                    }
                }
                async * seedAsync(e, s = null) {
                    for (;;) {
                        const {
                            length: t
                        } = this.#h;
                        if (!(t < e.length)) break;
                        for (const s of e.slice(t, t + 100)) this.append(s);
                        null != s && s({
                            total: e.length,
                            current: t
                        }), yield null
                    }
                }
                seed(e) {
                    const {
                        length: s
                    } = this.#h;
                    if (s < e.length)
                        for (const t of e.slice(s)) this.append(t)
                }
                append(e, s = () => {}) {
                    this.#h.push(e), this.#r.append(e), this.#x.append(e), this.#j.append(e), this.#n.append(e), this.#p.append(e, s)
                }
                get settings() {
                    return this.#u
                }
                get lesson() {
                    return this.#i
                }
                get keyStatsMap() {
                    return this.#r
                }
                get summaryStats() {
                    return this.#x
                }
                get streakList() {
                    return this.#j
                }
                get dailyGoal() {
                    return this.#n
                }
            }
            const be = (0, j.memo)(function({
                progress: e,
                onResult: s
            }) {
                const {
                    state: t,
                    handleResetLesson: i,
                    handleSkipLesson: r,
                    handleKeyDown: l,
                    handleKeyUp: o,
                    handleInput: d
                } = function(e, s) {
                    const t = (0, a.de)(),
                        n = (0, k.Z)(),
                        [i, r] = (0, j.useState)(0),
                        [, l] = (0, j.useState)({
                            text: "",
                            lines: []
                        }),
                        [, o] = (0, j.useState)([]),
                        d = (0, j.useRef)(null),
                        c = (0, j.useRef)(s);
                    return c.current = s, (0, j.useMemo)(() => {
                        const s = new pe(e, (e, s) => {
                            r(i + 1), d.current = function(e, s) {
                                const t = new xe.wj([]),
                                    n = new xe.dq(t),
                                    i = new xe.dq(t);
                                for (const {
                                        codePoint: s,
                                        hitCount: t,
                                        missCount: a
                                    } of e.histogram) n.set({
                                    codePoint: s
                                }, t), i.set({
                                    codePoint: s
                                }, a);
                                const r = [...new Set(s.map(({
                                        codePoint: e
                                    }) => e))].sort((e, s) => e - s),
                                    l = new a.mA(r),
                                    o = new a.mA(r);
                                for (let e = 0; e < s.length - 1; e++) l.add(s[e].codePoint, s[e + 1].codePoint, 1);
                                return {
                                    result: e,
                                    hits: n,
                                    misses: i,
                                    hits2: l,
                                    misses2: o
                                }
                            }(e, s.steps), c.current(e)
                        });
                        s.lastLesson = d.current, l(s.lines), o(s.depressedKeys);
                        const u = () => {
                                s.resetLesson(), l(s.lines), o(s.depressedKeys = []), n.cancel()
                            },
                            h = () => {
                                s.skipLesson(), l(s.lines), o(s.depressedKeys = []), n.cancel()
                            },
                            x = (0, y.ni)(s.settings),
                            {
                                onKeyDown: j,
                                onKeyUp: p,
                                onInput: g
                            } = (0, f.Ke)(s.settings, t, {
                                onKeyDown: e => {
                                    o(s.depressedKeys = (0, f.Fx)(s.depressedKeys, e.code))
                                },
                                onKeyUp: e => {
                                    o(s.depressedKeys = (0, f.l0)(s.depressedKeys, e.code))
                                },
                                onInput: e => {
                                    s.lastLesson = null;
                                    const t = s.onInput(e);
                                    l(s.lines), x(t), n.schedule(u, 1e4)
                                }
                            });
                        return {
                            state: s,
                            handleResetLesson: u,
                            handleSkipLesson: h,
                            handleKeyDown: j,
                            handleKeyUp: p,
                            handleInput: g
                        }
                    }, [e, t, n, i])
                }(e, s);
                return (0, w.v)({
                    "Ctrl+ArrowLeft": i,
                    "Ctrl+ArrowRight": r,
                    Escape: i
                }), (0, b.M)("focus", i), (0, b.M)("blur", i), (0, A.z)("visibilitychange", i), (0, n.jsx)(se, {
                    state: t,
                    lines: t.lines,
                    depressedKeys: t.depressedKeys,
                    onResetLesson: i,
                    onSkipLesson: r,
                    onKeyDown: l,
                    onKeyUp: o,
                    onInput: d
                })
            });

            function Ae({
                lesson: e
            }) {
                const {
                    results: s,
                    appendResults: t
                } = (0, m.E)(), [a, {
                    total: r,
                    current: d
                }] = function(e, s) {
                    const {
                        settings: t
                    } = (0, i.t0)(), [n, a] = (0, j.useState)(!1), [r, d] = (0, j.useState)({
                        total: 0,
                        current: 0
                    }), c = (0, j.useMemo)(() => new we(t, e), [t, e]);
                    return (0, j.useEffect)(() => {
                        const t = new AbortController,
                            {
                                signal: n
                            } = t;
                        return (0, o._)(c.seedAsync(e.filter(s), d), {
                            signal: n
                        }).then(() => a(!0)).catch(l.WL), () => {
                            t.abort()
                        }
                    }, [c, e, s]), [n ? c : null, r]
                }(e, s);
                return null == a ? (0, n.jsx)(h.e2, {
                    total: r,
                    current: d
                }) : (0, n.jsx)(be, {
                    progress: a,
                    onResult: e => {
                        e.validate() && (a.append(e, he), t([e]))
                    }
                })
            }
            var ke = t(6515),
                ve = t(3227),
                Se = t(6400),
                Le = t(564),
                Me = t(428);
            const De = (0, i.kk)("prefs.settings.explain", !0);

            function Te() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    explainersVisible: s,
                    toggleExplainers: t
                } = (0, Me.V)();
                return (0, j.useLayoutEffect)(() => {
                    t(i.pm.get(De))
                }), (0, n.jsxs)(Le.d, {
                    children: [(0, n.jsx)(Le.D.Filler, {}), (0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(K.$, {
                            onClick: () => {
                                t(!s), i.pm.set(De, !s)
                            },
                            children: s ? `▼ ${e({id:"6TEu+dLp"})}` : `► ${e({id:"liQQqRgL"})}`
                        })
                    })]
                })
            }
            var Ke = t(2572),
                Ce = t(5130),
                Ie = t(8404),
                Ee = t(1641),
                Re = t(6214);

            function Ne() {
                const {
                    formatMessage: e
                } = (0, I.A)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Ke.nV, {
                        legend: e({
                            id: "V3C3iiRy"
                        }),
                        children: (0, n.jsx)(Ve, {})
                    }), (0, n.jsxs)(Ke.nV, {
                        legend: e({
                            id: "9yXbo4CZ"
                        }),
                        children: [(0, n.jsx)(He, {}), (0, n.jsx)(ze, {})]
                    })]
                })
            }

            function Ve() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    formatLanguageName: s,
                    formatLayoutName: t,
                    formatFullLayoutName: r
                } = (0, a.U7)(), {
                    compare: l
                } = (0, M.QM)(), {
                    settings: o,
                    updateSettings: d
                } = (0, i.t0)(), c = a.qD.from(o);
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "HUk1fhkU"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ce.m, {
                                options: c.selectableLanguages().map(e => ({
                                    value: e.id,
                                    name: s(e)
                                })).sort((e, s) => l(e.name, s.name)),
                                value: c.language.id,
                                onSelect: e => {
                                    d(c.withLanguage(a.TM.ALL.get(e)).withGeometry(c.geometry).withZones(c.zones).save(o))
                                }
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "FGTfpnhl"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ce.m, {
                                options: c.selectableLayouts().map(e => ({
                                    value: e.id,
                                    name: e.language.id === c.language.id ? t(e) : r(e)
                                })),
                                value: c.layout.id,
                                onSelect: e => {
                                    d(c.withLayout(a.PE.ALL.get(e)).withGeometry(c.geometry).withZones(c.zones).save(o))
                                }
                            })
                        })]
                    }), (0, n.jsx)(Le.d, {
                        children: (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                checked: o.get(a.Aw.emulation) === a.$K.Forward,
                                disabled: !c.layout.emulate,
                                label: e({
                                    id: "UmVA/yE3"
                                }),
                                onChange: e => {
                                    d(o.set(a.Aw.emulation, e ? a.$K.Forward : a.$K.None))
                                }
                            })
                        })
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "Iy+rnECO"
                            })
                        })
                    }), (0, n.jsx)(Le.d, {
                        children: (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                checked: o.get(a.Aw.emulation) === a.$K.Reverse,
                                disabled: !c.layout.emulate,
                                label: e({
                                    id: "Ptj9Uwc0"
                                }),
                                onChange: e => {
                                    d(o.set(a.Aw.emulation, e ? a.$K.Reverse : a.$K.None))
                                }
                            })
                        })
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "L/KiwSoR"
                            })
                        })
                    })]
                })
            }

            function ze() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)(), r = a.qD.from(s);
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "bhfJXudq"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ce.m, {
                                options: r.selectableGeometries().map(e => ({
                                    value: e.id,
                                    name: e.name
                                })),
                                value: r.geometry.id,
                                onSelect: e => {
                                    t(r.withGeometry(a.V2.ALL.get(e)).withZones(r.zones).save(s))
                                }
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "xmvNu6IC"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ce.m, {
                                options: r.selectableZones().map(e => ({
                                    value: e.id,
                                    name: e.name
                                })),
                                value: r.zones.id,
                                onSelect: e => {
                                    t(r.withZones(a.nJ.ALL.get(e)).save(s))
                                }
                            })
                        })]
                    }), (0, n.jsx)(Le.d, {
                        children: (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                label: e({
                                    id: "CFzvEHuI"
                                }),
                                checked: s.get(a.Aw.colors),
                                onChange: e => {
                                    t(s.set(a.Aw.colors, e))
                                }
                            })
                        })
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "6FL5gSPB"
                            })
                        })
                    }), (0, n.jsx)(Le.d, {
                        children: (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                label: e({
                                    id: "dGrL7OpB"
                                }),
                                checked: s.get(a.Aw.pointers),
                                onChange: e => {
                                    t(s.set(a.Aw.pointers, e))
                                }
                            })
                        })
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "WEiYJw25"
                            })
                        })
                    })]
                })
            }
            const He = (0, j.memo)(function() {
                    const {
                        settings: e
                    } = (0, i.t0)(), s = (0, a.de)(), t = (0, f.X_)(e, s), r = e.get(a.Aw.colors), l = e.get(a.Aw.pointers);
                    return (0, n.jsxs)(q.$1, {
                        keyboard: s,
                        height: "16rem",
                        children: [(0, n.jsx)(q.vj, {
                            depressedKeys: t,
                            toggledKeys: f.nt.modifiers,
                            showColors: r
                        }), l && (0, n.jsx)(Fe, {})]
                    })
                }),
                Fe = (0, j.memo)(function() {
                    const e = (0, a.de)(),
                        [s, t] = (0, j.useState)(0),
                        [i, r] = (0, j.useState)([]);
                    return (0, j.useEffect)(() => {
                        t(0), r(e.getExampleLetters())
                    }, [e]), (0, j.useEffect)(() => {
                        const e = new o.ZU;
                        return e.delayed(1e3, () => {
                            let e = s + 1;
                            e >= i.length && (e = 0), t(e)
                        }), () => {
                            e.cancelAll()
                        }
                    }, [s, i]), (0, n.jsx)(q.Mz, {
                        suffix: i.slice(s),
                        delay: 10
                    })
                });
            var Ge = t(8346),
                Oe = t(5051),
                Ue = t(7351);

            function Be() {
                const {
                    settings: e,
                    updateSettings: s
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "rX9+WeqR"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ue.Q, {
                                size: 16,
                                min: 1,
                                max: 100,
                                step: 1,
                                value: Math.round(100 * e.get(u.ls.length)),
                                onChange: t => {
                                    s(e.set(u.ls.length, t / 100))
                                }
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "Gj3ZMyt0"
                            })
                        })
                    })]
                })
            }

            function qe() {
                const {
                    formatSpeed: e
                } = (0, v.kc)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)(), a = s.get(u.ls.targetSpeed);
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "EddN7iM6"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ue.Q, {
                                size: 16,
                                min: u.ls.targetSpeed.min,
                                max: u.ls.targetSpeed.max,
                                step: 1,
                                value: a,
                                onChange: e => {
                                    t(s.set(u.ls.targetSpeed, e))
                                }
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsxs)(M.ig, {
                                swap: "icon",
                                children: [(0, n.jsx)(D.K, {
                                    icon: (0, n.jsx)(T.I, {
                                        shape: C.z$Y
                                    }),
                                    disabled: a === u.ls.targetSpeed.min,
                                    onClick: () => {
                                        t(s.set(u.ls.targetSpeed, 5 * Math.ceil(a / 5) - 5))
                                    }
                                }), (0, n.jsx)(D.K, {
                                    icon: (0, n.jsx)(T.I, {
                                        shape: C.zre
                                    }),
                                    disabled: a === u.ls.targetSpeed.max,
                                    onClick: () => {
                                        t(s.set(u.ls.targetSpeed, 5 * Math.floor(a / 5) + 5))
                                    }
                                })]
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(F.WT, {
                                value: e(a)
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "3l9Ko227"
                            })
                        })
                    })]
                })
            }

            function Pe({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)(), {
                    settings: t,
                    updateSettings: a
                } = (0, i.t0)(), {
                    book: r,
                    content: l,
                    paragraphs: o,
                    paragraphIndex: d
                } = e;
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "OzP95OZ9"
                            })
                        })
                    }), (0, n.jsxs)(Ke.nV, {
                        legend: s({
                            id: "9/1Gmi8P"
                        }),
                        children: [(0, n.jsx)(Oe.fd, {
                            book: r,
                            onChange: e => {
                                a(t.set(u.ls.books.book, e).set(u.ls.books.paragraphIndex, 0))
                            }
                        }), (0, n.jsx)(Oe.A$, {
                            book: r,
                            content: l
                        }), (0, n.jsx)(Oe.MJ, {
                            paragraphs: o,
                            paragraphIndex: d,
                            onChange: e => {
                                a(t.set(u.ls.books.paragraphIndex, e))
                            }
                        }), (0, n.jsx)(Oe.vg, {
                            paragraphs: o,
                            paragraphIndex: d
                        }), (0, n.jsx)(Se.h, {
                            size: 3
                        }), (0, n.jsx)(We, {}), (0, n.jsx)(qe, {}), (0, n.jsx)(Be, {})]
                    })]
                })
            }

            function We() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(Le.d, {
                    children: [(0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(Ie.o, {
                            checked: s.get(u.ls.books.lettersOnly),
                            label: e({
                                id: "KOHLYY0/"
                            }),
                            title: e({
                                id: "Oq2tIXUs"
                            }),
                            onChange: e => {
                                t(s.set(u.ls.books.lettersOnly, e))
                            }
                        })
                    }), (0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(Ie.o, {
                            checked: s.get(u.ls.books.lowercase),
                            label: e({
                                id: "XQoHNnyU"
                            }),
                            title: e({
                                id: "wX8qiB7v"
                            }),
                            onChange: e => {
                                t(s.set(u.ls.books.lowercase, e))
                            }
                        })
                    })]
                })
            }
            var Qe = t(85);

            function Ze({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)(), {
                    settings: t,
                    updateSettings: a
                } = (0, i.t0)(), r = t.get(u.ls.code.syntax), l = t.get(u.ls.code.flags);
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "P+Q0nQcb"
                            })
                        })
                    }), (0, n.jsxs)(Ke.nV, {
                        legend: s({
                            id: "9/1Gmi8P"
                        }),
                        children: [(0, n.jsxs)(Le.d, {
                            children: [(0, n.jsx)(Le.D, {
                                children: (0, n.jsx)(G.A, {
                                    id: "qrGy2sgQ"
                                })
                            }), (0, n.jsx)(Le.D, {
                                children: (0, n.jsx)(Ce.m, {
                                    options: Qe.w4.ALL.map(e => ({
                                        value: e.id,
                                        name: e.name
                                    })),
                                    value: r.id,
                                    onSelect: e => {
                                        a(t.set(u.ls.code.syntax, Qe.w4.ALL.get(e)))
                                    }
                                })
                            }), [...r.flags].map(e => (0, n.jsx)(Le.D, {
                                children: (0, n.jsx)(Ie.o, {
                                    label: e,
                                    checked: l.includes(e),
                                    onChange: s => {
                                        const n = new Set(l);
                                        s ? n.add(e) : n.delete(e), a(t.set(u.ls.code.flags, [...n]))
                                    }
                                })
                            }, e))]
                        }), (0, n.jsx)(Ee.H, {
                            children: (0, n.jsx)(Re.V, {
                                children: (0, n.jsx)(G.A, {
                                    id: "cJ/yKSqQ"
                                })
                            })
                        })]
                    })]
                })
            }
            var $e = t(2044),
                Je = t(7964),
                Ye = t(5031);
            const _e = [{
                title: "Jabberwocky",
                content: 'Jabberwocky\n\n\'Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe;\nAll mimsy were the borogoves,\nAnd the mome raths outgrabe.\n\n"Beware the Jabberwock, my son!\nThe jaws that bite, the claws that catch!\nBeware the Jubjub bird, and shun\nThe frumious Bandersnatch!"\n\nHe took his vorpal sword in hand:\nLong time the manxome foe he sought-\nSo rested he by the Tumtum tree,\nAnd stood awhile in thought.\n\nAnd as in uffish thought he stood,\nThe Jabberwock, with eyes of flame,\nCame whiffling through the tulgey wood,\nAnd burbled as it came!\n\nOne, two! One, two! and through and through\nThe vorpal blade went snicker-snack!\nHe left it dead, and with its head\nHe went galumphing back.\n\n"And hast thou slain the Jabberwock?\nCome to my arms, my beamish boy!\nO frabjous day! Callooh! Callay!"\nHe chortled in his joy.\n\n\'Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe;\nAll mimsy were the borogoves,\nAnd the mome raths outgrabe.'
            }, {
                title: "Lorem Ipsum",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut egestas libero non laoreet scelerisque. Mauris nec sodales velit. Quisque mattis eu nulla varius accumsan. Sed interdum erat eu justo sodales, vel hendrerit diam pretium. Phasellus lacus libero, scelerisque quis enim eget, tempus elementum massa. Aenean elementum nec magna at fringilla. Nam nisl eros, viverra et luctus eget, placerat non velit. Cras ante velit, mattis quis porttitor nec, pellentesque eu sem. Aenean blandit consectetur metus ut bibendum.Aliquam in suscipit erat. Praesent non vulputate tortor, ac semper diam."
            }, {
                title: "A Short Story",
                content: "Imagine all human beings swept off the face of the earth, excepting one man. Imagine this man in some vast city, New York or London. Imagine him on the third or fourth day of his solitude sitting in a house and hearing a ring at the door-bell!"
            }];

            function Xe({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)(), {
                    settings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "hY8pVzj5"
                            })
                        })
                    }), (0, n.jsxs)(Ke.nV, {
                        legend: s({
                            id: "9/1Gmi8P"
                        }),
                        children: [(0, n.jsx)(es, {}), (0, n.jsx)(ss, {
                            language: e.model.language,
                            customText: t.get(u.ls.customText.content)
                        }), (0, n.jsx)(ts, {}), (0, n.jsx)(qe, {}), (0, n.jsx)(Be, {})]
                    })]
                })
            }

            function es() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(H.l, {
                        children: [(0, n.jsx)(G.A, {
                            id: "I29K90no"
                        }), " ", _e.map(({
                            title: e,
                            content: a
                        }, i) => (0, n.jsxs)("span", {
                            children: [i > 0 ? ", " : null, (0, n.jsx)(Je.z, {
                                onClick: () => {
                                    t(s.set(u.ls.customText.content, a))
                                },
                                children: e
                            })]
                        }, i))]
                    }), (0, n.jsx)(H.l, {
                        children: (0, n.jsx)(Ye.A, {
                            type: "textarea",
                            placeholder: e({
                                id: "ugUpRLHy"
                            }),
                            value: s.get(u.ls.customText.content),
                            onChange: e => {
                                t(s.set(u.ls.customText.content, e))
                            }
                        })
                    })]
                })
            }

            function ss({
                language: e,
                customText: s
            }) {
                const {
                    formatMessage: t
                } = (0, I.A)(), {
                    formatNumber: a
                } = (0, M.L_)(), {
                    numWords: i,
                    numUniqueWords: r,
                    avgWordLength: l
                } = (0, j.useMemo)(() => (0, $e.c5)(e.locale, s), [e, s]);
                return (0, n.jsxs)(Le.d, {
                    children: [(0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(F.js, {
                            name: t({
                                id: "w8njAPka"
                            }),
                            value: a(i)
                        })
                    }), (0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(F.js, {
                            name: t({
                                id: "NjxLHMk1"
                            }),
                            value: a(r)
                        })
                    }), (0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(F.js, {
                            name: t({
                                id: "OGePQIw7"
                            }),
                            value: a(l, 2)
                        })
                    })]
                })
            }

            function ts() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(Le.d, {
                    children: [(0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(Ie.o, {
                            checked: s.get(u.ls.customText.lettersOnly),
                            label: e({
                                id: "KOHLYY0/"
                            }),
                            title: e({
                                id: "Oq2tIXUs"
                            }),
                            onChange: e => {
                                t(s.set(u.ls.customText.lettersOnly, e))
                            }
                        })
                    }), (0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(Ie.o, {
                            checked: s.get(u.ls.customText.lowercase),
                            label: e({
                                id: "XQoHNnyU"
                            }),
                            title: e({
                                id: "wX8qiB7v"
                            }),
                            onChange: e => {
                                t(s.set(u.ls.customText.lowercase, e))
                            }
                        })
                    }), (0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(Ie.o, {
                            checked: s.get(u.ls.customText.randomize),
                            label: e({
                                id: "D0oJEoMS"
                            }),
                            title: e({
                                id: "6+Q5L7Dk"
                            }),
                            onChange: e => {
                                t(s.set(u.ls.customText.randomize, e))
                            }
                        })
                    })]
                })
            }

            function ns() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    formatDuration: s
                } = (0, M.gD)(), {
                    settings: t,
                    updateSettings: a
                } = (0, i.t0)();
                return (0, n.jsxs)(Ke.nV, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "JwdZIDZH"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ue.Q, {
                                size: 16,
                                min: 0,
                                max: 24,
                                step: 1,
                                value: Math.round(t.get(u.ls.dailyGoal) / 5),
                                onChange: e => {
                                    a(t.set(u.ls.dailyGoal, 5 * e))
                                }
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: 0 === t.get(u.ls.dailyGoal) ? e({
                                id: "RZ+BOOX+"
                            }) : (0, n.jsx)(F.WT, {
                                value: s({
                                    minutes: t.get(u.ls.dailyGoal)
                                })
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "K4bR9YDH"
                            })
                        })
                    })]
                })
            }

            function as() {
                const {
                    settings: e,
                    updateSettings: s
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "6YkZy563"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ue.Q, {
                                size: 16,
                                min: 1,
                                max: 100,
                                step: 1,
                                value: Math.round(100 * e.get(u.ls.guided.alphabetSize)),
                                onChange: t => {
                                    s(e.set(u.ls.guided.alphabetSize, t / 100))
                                }
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "2GpTROU+"
                            })
                        })
                    })]
                })
            }

            function is() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Le.d, {
                        children: (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                label: e({
                                    id: "FA9faqOb"
                                }),
                                checked: s.get(u.ls.guided.keyboardOrder),
                                onChange: e => {
                                    t(s.set(u.ls.guided.keyboardOrder, e))
                                }
                            })
                        })
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "3iSUxP83"
                            })
                        })
                    })]
                })
            }

            function rs() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Le.d, {
                        children: (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                label: e({
                                    id: "8SG0WMOC"
                                }),
                                checked: s.get(u.ls.guided.naturalWords),
                                onChange: e => {
                                    t(s.set(u.ls.guided.naturalWords, e))
                                }
                            })
                        })
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "B8IDW7+a"
                            })
                        })
                    })]
                })
            }

            function ls() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "rGCG+f6g"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                label: e({
                                    id: "rfOlciJ2"
                                }),
                                checked: s.get(u.ls.guided.recoverKeys),
                                onChange: e => {
                                    t(s.set(u.ls.guided.recoverKeys, e))
                                }
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "xlxLJra+"
                            })
                        })
                    })]
                })
            }

            function os() {
                const {
                    formatPercents: e
                } = (0, M.L_)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "y0sFnKYc"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ue.Q, {
                                min: u.ls.repeatWords.min,
                                max: u.ls.repeatWords.max,
                                step: 1,
                                value: s.get(u.ls.repeatWords),
                                onChange: e => {
                                    t(s.set(u.ls.repeatWords, e))
                                }
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(F.WT, {
                                value: s.get(u.ls.repeatWords)
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "7s+h4LWG"
                            })
                        })
                    })]
                })
            }

            function ds() {
                const {
                    formatPercents: e
                } = (0, M.L_)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "rQuMcSTI"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ue.Q, {
                                size: 16,
                                min: 0,
                                max: 100,
                                step: 1,
                                value: Math.round(100 * s.get(u.ls.capitals)),
                                onChange: e => {
                                    t(s.set(u.ls.capitals, e / 100))
                                }
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(F.WT, {
                                value: e(s.get(u.ls.capitals))
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "G89OM3rg"
                            })
                        })
                    }), (0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "nzlOrVU3"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ue.Q, {
                                size: 16,
                                min: 0,
                                max: 100,
                                step: 1,
                                value: Math.round(100 * s.get(u.ls.punctuators)),
                                onChange: e => {
                                    t(s.set(u.ls.punctuators, e / 100))
                                }
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(F.WT, {
                                value: e(s.get(u.ls.punctuators))
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "I7DMBapD"
                            })
                        })
                    })]
                })
            }

            function cs({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "WE9Wweak"
                            })
                        })
                    }), (0, n.jsxs)(Ke.nV, {
                        legend: s({
                            id: "9/1Gmi8P"
                        }),
                        children: [(0, n.jsx)(qe, {}), (0, n.jsx)(ls, {}), (0, n.jsx)(is, {}), (0, n.jsx)(rs, {}), (0, n.jsx)(os, {}), (0, n.jsx)(as, {}), (0, n.jsx)(ds, {}), (0, n.jsx)(Be, {})]
                    })]
                })
            }
            var us = t(4968);

            function hs({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)(), {
                    settings: t
                } = (0, i.t0)(), {
                    results: a
                } = (0, m.E)(), {
                    lessonKeys: r,
                    textInput: l
                } = (0, j.useMemo)(() => {
                    const s = e.update((0, m.$r)(e.letters, e.filter(a)));
                    return {
                        lessonKeys: s,
                        textInput: new je.ks(e.generate(s, (0, us.v)(123)), (0, je.u4)(t))
                    }
                }, [t, e, a]);
                return (0, n.jsx)(Ke.nV, {
                    legend: s({
                        id: "4QrUZHom"
                    }),
                    children: (0, n.jsxs)("div", {
                        className: "nRCgCFcpNo",
                        children: [(0, n.jsx)(v.ye, {
                            lessonKeys: r
                        }), (0, n.jsx)(v.TG, {
                            lessonKeys: r
                        }), (0, n.jsx)("div", {
                            className: "oDouJ3_D26",
                            children: (0, n.jsx)(S.ML, {
                                settings: (0, je.w2)(t),
                                lines: l.lines
                            })
                        })]
                    })
                })
            }
            var xs = t(394);

            function js() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Le.d, {
                        children: (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                label: e({
                                    id: "SDPqCC6p"
                                }),
                                checked: s.get(u.ls.numbers.benford),
                                onChange: e => {
                                    t(s.set(u.ls.numbers.benford, e))
                                }
                            })
                        })
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "28myoc+l",
                                values: {
                                    a: e => (0, n.jsx)(xs.N, {
                                        href: "https://en.wikipedia.org/wiki/Benford's_law",
                                        target: "_blank",
                                        children: e
                                    })
                                }
                            })
                        })
                    })]
                })
            }

            function ps({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "FIp3/ZIX"
                            })
                        })
                    }), (0, n.jsx)(Ke.nV, {
                        legend: s({
                            id: "9/1Gmi8P"
                        }),
                        children: (0, n.jsx)(js, {})
                    })]
                })
            }

            function gs({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "fXtBdaI2"
                            })
                        })
                    }), (0, n.jsxs)(Ke.nV, {
                        legend: s({
                            id: "9/1Gmi8P"
                        }),
                        children: [(0, n.jsx)(ms, {
                            lesson: e
                        }), (0, n.jsx)(fs, {
                            lesson: e
                        }), (0, n.jsx)(qe, {}), (0, n.jsx)(os, {}), (0, n.jsx)(ds, {}), (0, n.jsx)(Be, {})]
                    })]
                })
            }

            function ms({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)(), {
                    settings: t,
                    updateSettings: a
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "75JArSkq"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ue.Q, {
                                size: 16,
                                min: u.ls.wordList.wordListSize.min,
                                max: u.ls.wordList.wordListSize.max,
                                step: 1,
                                value: t.get(u.ls.wordList.wordListSize),
                                onChange: e => {
                                    a(t.set(u.ls.wordList.wordListSize, e))
                                }
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ie.o, {
                                label: s({
                                    id: "D+zEGDaW"
                                }),
                                checked: t.get(u.ls.wordList.longWordsOnly),
                                onChange: e => {
                                    a(t.set(u.ls.wordList.longWordsOnly, e))
                                }
                            })
                        })]
                    }), (0, n.jsx)(H.l, {
                        children: (0, n.jsx)(Ye.A, {
                            type: "textarea",
                            value: [...e.wordList].join(", "),
                            readOnly: !0
                        })
                    })]
                })
            }

            function fs({
                lesson: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)(), {
                    formatNumber: t
                } = (0, M.L_)(), {
                    wordCount: a,
                    avgWordLength: i
                } = (0, Oe.yG)(e.wordList);
                return (0, n.jsxs)(Le.d, {
                    children: [(0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(F.js, {
                            name: s({
                                id: "NjxLHMk1"
                            }),
                            value: t(a)
                        })
                    }), (0, n.jsx)(Le.D, {
                        children: (0, n.jsx)(F.js, {
                            name: s({
                                id: "OGePQIw7"
                            }),
                            value: t(i, 2)
                        })
                    })]
                })
            }

            function ys() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Ge.w, {
                        selectedIndex: u.nv.ALL.indexOf(s.get(u.ls.type)),
                        onSelect: e => {
                            t(s.set(u.ls.type, u.nv.ALL.at(e)))
                        },
                        children: [(0, n.jsx)(Ge.o, {
                            label: e({
                                id: "4I754nNd"
                            })
                        }), (0, n.jsx)(Ge.o, {
                            label: e({
                                id: "g34IPT+d"
                            })
                        }), (0, n.jsx)(Ge.o, {
                            label: e({
                                id: "uKjrDcWf"
                            })
                        }), (0, n.jsx)(Ge.o, {
                            label: e({
                                id: "ugUpRLHy"
                            })
                        }), (0, n.jsx)(Ge.o, {
                            label: e({
                                id: "+Eh5Fot4"
                            })
                        }), (0, n.jsx)(Ge.o, {
                            label: e({
                                id: "1uLp4X3X"
                            })
                        })]
                    }), (0, n.jsx)(p, {
                        children: e => (0, n.jsxs)(n.Fragment, {
                            children: [ws(s, e), (0, n.jsx)(hs, {
                                lesson: e
                            }), (0, n.jsx)(ns, {})]
                        })
                    })]
                })
            }

            function ws(e, s) {
                switch (e.get(u.ls.type)) {
                    case u.nv.GUIDED:
                        return (0, n.jsx)(cs, {
                            lesson: s
                        });
                    case u.nv.WORDLIST:
                        return (0, n.jsx)(gs, {
                            lesson: s
                        });
                    case u.nv.BOOKS:
                        return (0, n.jsx)(Pe, {
                            lesson: s
                        });
                    case u.nv.CUSTOM:
                        return (0, n.jsx)(Xe, {
                            lesson: s
                        });
                    case u.nv.CODE:
                        return (0, n.jsx)(Ze, {
                            lesson: s
                        });
                    case u.nv.NUMBERS:
                        return (0, n.jsx)(ps, {
                            lesson: s
                        });
                    default:
                        throw new Error
                }
            }

            function bs() {
                const {
                    formatMessage: e
                } = (0, I.A)();
                return (0, n.jsx)(n.Fragment, {
                    children: (0, n.jsx)(Ke.nV, {
                        legend: e({
                            id: "xtE3n67w"
                        }),
                        children: (0, n.jsx)(As, {})
                    })
                })
            }

            function As() {
                const {
                    formatMessage: e
                } = (0, I.A)(), {
                    settings: s,
                    updateSettings: t
                } = (0, i.t0)();
                return (0, n.jsxs)(n.Fragment, {
                    children: [(0, n.jsxs)(Le.d, {
                        children: [(0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(G.A, {
                                id: "MQqfKoBw"
                            })
                        }), (0, n.jsx)(Le.D, {
                            children: (0, n.jsx)(Ce.m, {
                                options: m.sS.ALL.map(s => ({
                                    value: s.id,
                                    name: e(s.name)
                                })),
                                value: s.get(m.ll.speedUnit).id,
                                onSelect: e => {
                                    t(s.set(m.ll.speedUnit, m.sS.ALL.get(e)))
                                }
                            })
                        })]
                    }), (0, n.jsx)(Ee.H, {
                        children: (0, n.jsx)(Re.V, {
                            children: (0, n.jsx)(G.A, {
                                id: "02ggYADN"
                            })
                        })
                    })]
                })
            }

            function ks({
                onSubmit: e
            }) {
                const {
                    formatMessage: s
                } = (0, I.A)(), {
                    settings: t,
                    updateSettings: a
                } = (0, i.t0)();
                return (0, n.jsx)(h.ff, {
                    children: (0, n.jsxs)(ke.n, {
                        children: [(0, n.jsx)(Te, {}), (0, n.jsx)(ve.Y, {
                            level: 1,
                            children: (0, n.jsx)(G.A, {
                                id: "xotVFYus"
                            })
                        }), (0, n.jsx)(ys, {}), (0, n.jsx)(Se.h, {
                            size: 5
                        }), (0, n.jsx)(ve.Y, {
                            level: 1,
                            children: (0, n.jsx)(G.A, {
                                id: "u+Z2170g"
                            })
                        }), (0, n.jsx)(S.VF, {}), (0, n.jsx)(Se.h, {
                            size: 5
                        }), (0, n.jsx)(ve.Y, {
                            level: 1,
                            children: (0, n.jsx)(G.A, {
                                id: "rLkcGe63"
                            })
                        }), (0, n.jsx)(Ne, {}), (0, n.jsx)(Se.h, {
                            size: 5
                        }), (0, n.jsx)(ve.Y, {
                            level: 1,
                            children: (0, n.jsx)(G.A, {
                                id: "VdwUVPLQ"
                            })
                        }), (0, n.jsx)(bs, {}), (0, n.jsx)("div", {
                            className: "ehRLq09HAG",
                            children: (0, n.jsxs)(Le.d, {
                                children: [(0, n.jsx)(Le.D, {
                                    children: (0, n.jsx)(K.$, {
                                        size: 16,
                                        icon: (0, n.jsx)(T.I, {
                                            shape: C.jq2
                                        }),
                                        label: s({
                                            id: "JuDARK9l"
                                        }),
                                        onClick: () => {
                                            a(t.reset())
                                        }
                                    })
                                }), (0, n.jsx)(Le.D.Filler, {}), (0, n.jsx)(Le.D, {
                                    children: (0, n.jsx)(K.$, {
                                        size: 16,
                                        icon: (0, n.jsx)(T.I, {
                                            shape: C.NG3
                                        }),
                                        label: s({
                                            id: "jmMbHu+6"
                                        }),
                                        onClick: () => {
                                            e()
                                        }
                                    })
                                })]
                            })
                        })]
                    })
                })
            }
            const vs = {
                practice: function() {
                    return (0, n.jsx)(a.JW, {
                        children: (0, n.jsx)(p, {
                            children: e => (0, n.jsx)(Ae, {
                                lesson: e
                            })
                        })
                    })
                },
                settings: function() {
                    const {
                        settings: e,
                        updateSettings: s
                    } = (0, i.t0)(), {
                        setView: t
                    } = (0, r.lQ)(vs), [l, o] = (0, j.useState)(e);
                    return (0, n.jsx)(i.lj.Provider, {
                        value: {
                            settings: l,
                            updateSettings: o
                        },
                        children: (0, n.jsx)(a.JW, {
                            children: (0, n.jsx)(ks, {
                                onSubmit: () => {
                                    s(l), t("practice")
                                }
                            })
                        })
                    })
                }
            };

            function Ss() {
                return (0, n.jsx)(r.my, {
                    views: vs
                })
            }! function(e) {
                const s = a.PE.findLayout(e);
                null != s && i.wB.addDefaults(a.qD.default().withLanguage(s.language).withLayout(s).save(new i.wB))
            }(window.navigator.language);
            var Ls = t(8827);

            function Ms() {
                return (0, n.jsx)(Ls.rc, {
                    children: (0, n.jsx)(Ss, {})
                })
            }
        },
        6682(e, s, t) {
            t.d(s, {
                Z: () => q
            });
            var n = t(4922),
                a = t(1739),
                i = t(2352),
                r = t(4100),
                l = t(7810),
                o = t(9414),
                d = t(8892);
            const c = t.p + "03820b50091ce392.data",
                u = t.p + "703a8bc7a06e3123.data",
                h = t.p + "0cbf3c8137edd4a6.data",
                x = t.p + "d05d6ebd8b21a340.data",
                j = t.p + "568dc5465874795a.data",
                p = t.p + "8b7b60f1c69ccb88.data",
                g = t.p + "7d4058cd4928fb92.data",
                m = t.p + "fee78dd316db2714.data",
                f = t.p + "e6dccd536685a485.data",
                y = t.p + "4e438832f5573e75.data",
                w = t.p + "b39c044e5b01de98.data",
                b = t.p + "22bfcef4a6f7fd9f.data",
                A = t.p + "789d03dbf4a0fa20.data",
                k = t.p + "2b87aa3be2af3e6e.data",
                v = t.p + "fdf0e79475b3cc94.data",
                S = t.p + "3d851961e0c51b56.data",
                L = t.p + "93bfe1b120f492d2.data",
                M = t.p + "540012bd41c926c7.data",
                D = t.p + "5ee9df0059372629.data",
                T = t.p + "b7d60dc33c83b0fc.data",
                K = t.p + "9b5ae2e15edfa9cd.data",
                C = t.p + "17bab8e00a3acac6.data",
                I = t.p + "2d88eb88a47828bd.data",
                E = t.p + "20f30e806698d5bb.data",
                R = t.p + "d15da4c86165308a.data",
                N = t.p + "768bf5c88516c3c5.data",
                V = t.p + "d4871df629be1ac9.data",
                z = t.p + "73f7b71722b7ac4f.data",
                H = t.p + "a69e06e7b9799709.data",
                F = t.p + "b4516a511f0c6c94.data",
                G = t.p + "0778d73bd64c5e57.data",
                O = t.p + "79f04d23ba151bcb.data",
                U = t.p + "1101e1eefbb48ddc.data";
            const B = async e => {
                if (e.id === "ko") {
                    const jamos="ㅇㅏㄴㅓㅁㅣㄹㅗㅎㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔㅋㅌㅊㅍㅠㅜㅡㅃㅉㄸㄲㅆㅒㅖㅘㅙㅚㅝㅞㅟㅢ";
                    const lettersList = [];
                    for (let i = 0; i < jamos.length; i++) {
                        const cp = jamos.codePointAt(i);
                        lettersList.push({
                            codePoint: cp,
                            f: 40 - i,
                            label: jamos[i],
                            toString() { return this.label; }
                        });
                    }
                    const K_INITIAL=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];const K_VOWEL=["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];const K_FINAL=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];const K_FINAL_SPLIT={"ㄳ":["ㄱ","ㅅ"],"ㄵ":["ㄴ","ㅈ"],"ㄶ":["ㄴ","ㅎ"],"ㄺ":["ㄹ","ㄱ"],"ㄻ":["ㄹ","ㅁ"],"ㄼ":["ㄹ","ㅂ"],"ㄽ":["ㄹ","ㅅ"],"ㄾ":["ㄹ","ㅌ"],"ㄿ":["ㄹ","ㅍ"],"ㅀ":["ㄹ","ㅎ"],"ㅄ":["ㅂ","ㅅ"]};const K_VOWEL_SPLIT={"ㅘ":["ㅗ","ㅏ"],"ㅙ":["ㅗ","ㅐ"],"ㅚ":["ㅗ","ㅣ"],"ㅝ":["ㅜ","ㅓ"],"ㅞ":["ㅜ","ㅔ"],"ㅟ":["ㅜ","ㅣ"],"ㅢ":["ㅡ","ㅣ"]};const getReqJamos=w=>{const req=new Set();for(let i=0;i<w.length;i++){const code=w.charCodeAt(i)-44032;if(code<0||code>11171){req.add(w[i]);continue;}const initIdx=Math.floor(code/588);const vowIdx=Math.floor((code-(initIdx*588))/28);const finIdx=code%28;req.add(K_INITIAL[initIdx]);const vow=K_VOWEL[vowIdx];if(K_VOWEL_SPLIT[vow]){req.add(K_VOWEL_SPLIT[vow][0]);req.add(K_VOWEL_SPLIT[vow][1]);}else{req.add(vow);}if(finIdx>0){const f=K_FINAL[finIdx];if(K_FINAL_SPLIT[f]){req.add(K_FINAL_SPLIT[f][0]);req.add(K_FINAL_SPLIT[f][1]);}else{req.add(f);}}}return req;};const K_WORDS=JSON.parse('["사람", "사회", "친구", "가족", "선생님", "학생", "남자", "여자", "아이", "아버지", "어머니", "동생", "가다", "오다", "먹다", "마시다", "보다", "자다", "만나다", "사랑하다", "일하다", "말하다", "듣다", "쓰다", "읽다", "배우다", "가르치다", "생각하다", "공부하다", "좋아하다", "싫어하다", "만들다", "받다", "주다", "사다", "팔다", "찾다", "잃다", "웃다", "울다", "걷다", "달리기", "앉다", "서다", "열다", "닫다", "알다", "모르다", "살다", "죽다", "하다", "되다", "있다", "없다", "크다", "작다", "많다", "적다", "좋다", "나쁘다", "아름답다", "예쁘다", "멋지다", "바쁘다", "아프다", "힘들다", "쉽다", "어렵다", "덥다", "춥다", "따뜻하다", "시원하다", "빠르다", "느리다", "높다", "낮다", "길다", "짧다", "무겁다", "가볍다", "가깝다", "멀다", "새롭다", "오늘", "내일", "어제", "지금", "항상", "자주", "가끔", "정말", "진짜", "아주", "매우", "너무", "조금", "많이", "같이", "함께", "다시", "이미", "바로", "먼저", "서로", "스스로", "갑자기", "전혀", "그냥", "우리", "나라", "세계", "도시", "학교", "회사", "병원", "경찰서", "가게", "시장", "은행", "우체국", "도서관", "박물관", "공원", "산", "바다", "강", "하늘", "해", "달", "별", "비", "눈", "바람", "구름", "날씨", "계절", "봄", "여름", "가을", "겨울", "꽃", "나무", "풀", "과일", "채소", "고기", "물", "우유", "커피", "차", "술", "밥", "빵", "반찬", "라면", "김치", "한국", "미국", "일본", "중국", "영국", "프랑스", "독일", "러시아", "베트남", "태국", "필리핀", "인도", "호주", "서울", "부산", "제주도", "한글", "한국어", "영어", "일어", "중국어", "역사", "문화", "예술", "음악", "미술", "영화", "책", "신문", "잡지", "편지", "이메일", "전화", "컴퓨터", "스마트폰", "텔레비전", "라디오", "시계", "안경", "옷", "모자", "신발", "양말", "가방", "지갑", "돈", "카드", "여권", "열쇠", "우산", "침대", "책상", "의자", "문", "창문", "거울", "방", "부엌", "화장실", "거실", "계단", "마당", "건물", "버스", "지하철", "기차", "비행기", "배", "자전거", "오토바이", "길", "거리", "신호등", "지도", "여행", "사진", "그림", "운동", "축구", "야구", "농구", "배구", "테니스", "수영", "등산", "요리", "청소", "빨래", "쇼핑", "선물", "축하", "약속", "시간", "하루", "아침", "점심", "저녁", "밤", "새벽", "오전", "오후", "모레", "이번", "지난", "다음", "주말", "휴일", "방학", "휴가", "생일", "결혼", "부모", "남편", "아내", "아들", "딸", "형", "누나", "오빠", "언니", "할아버지", "할머니", "삼촌", "이모", "고모", "사촌", "조카", "손자", "손녀", "이웃", "동료", "선배", "후배", "사장", "부장", "과장", "대리", "사원", "의사", "간호사", "약사", "경찰", "소방관", "군인", "공무원", "회사원", "은행원", "가수", "배우", "작가", "화가", "운동선수", "요리사", "기자", "아나운서", "변호사", "검사", "판사", "어부", "농부", "운전사", "비행사", "승무원", "기획자", "디자이너", "개발자", "번역가", "통역사", "교수", "어린이", "청소년", "어른", "노인", "동물", "강아지", "고양이", "새", "물고기", "토끼", "원숭이", "사자", "호랑이", "곰", "여우", "늑대", "돼지", "소", "말", "양", "염소", "닭", "오리", "거북이", "뱀", "개구리", "곤충", "나비", "벌", "거미", "모기", "파리", "개미", "쥐", "들판", "사막", "동굴", "섬", "해변", "계곡", "폭포", "호수", "연못", "온천", "시골", "마을", "수도", "항구", "공항", "기차역", "정류장", "주차장", "주유소", "고속도로", "골목", "다리", "터널", "공장", "사무실", "회의실", "교실", "체육관", "운동장", "수영장", "식당", "카페", "빵집", "약국", "미용실", "세탁소", "서점", "슈퍼마켓", "편의점", "백화점", "쇼핑몰", "극장", "놀이공원", "동물원", "식물원", "사찰", "교회", "성당", "궁전", "성", "탑", "비석", "유적지", "관광지", "호텔", "펜션", "게스트하우스", "캠핑장", "기숙사", "아파트", "빌라", "주택", "나", "너", "그", "그녀", "저", "이것", "그것", "저것", "여기", "거기", "저기", "무엇", "누구", "어디", "언제", "어떻게", "왜", "어떤", "어느", "무슨", "몇", "모두", "다", "더", "덜", "최고", "가장", "제일", "참", "꼭", "혹시", "만약", "설마", "비록", "아무리", "오히려", "차라리", "결국", "마침내", "드디어", "갑자기", "문득", "어느새", "어차피", "도대체", "아마", "거의", "대부분", "조금", "약간", "점점", "더욱", "미리", "벌써", "아직", "방금", "이제", "곧", "나중", "나중에", "가까이", "멀리", "위에", "아래에", "앞에", "뒤에", "옆에", "안에", "밖에", "사이에", "가운데에", "근처에"]');const K_WORD_JAMOS=K_WORDS.map(w=>({word:w,jamos:Array.from(getReqJamos(w))}));
return new class extends r.qJ {
                        constructor() {
                            super(e, lettersList)
                        }
                        nextWord(e, t = Math.random) {
                            const allowedJamos = lettersList.filter(l => e.includes(l.codePoint)).map(l => l.label);
                            if (allowedJamos.length === 0) return "ㅇ";
                            const validWords = K_WORD_JAMOS.filter(item => item.jamos.every(j => allowedJamos.includes(j)));
                            if (validWords.length > 0) {
                                return validWords[Math.floor(t() * validWords.length)].word;
                            }
                            const validInitials = K_INITIAL.filter(j => allowedJamos.includes(j));
                            const validVowels = K_VOWEL.filter(j => allowedJamos.includes(j));
                            const validFinals = K_FINAL.filter(j => j !== "" && (allowedJamos.includes(j) || ((K_FINAL_SPLIT[j]) && (allowedJamos.includes(K_FINAL_SPLIT[j][0]) && allowedJamos.includes(K_FINAL_SPLIT[j][1])))));
                            if (validInitials.length > 0 && validVowels.length > 0) {
                                const len = Math.floor(t() * 3) + 2;
                                let result = "";
                                for (let i = 0; i < len; i++) {
                                    const iIdx = K_INITIAL.indexOf(validInitials[Math.floor(t() * validInitials.length)]);
                                    const vIdx = K_VOWEL.indexOf(validVowels[Math.floor(t() * validVowels.length)]);
                                    let fIdx = 0;
                                    if (validFinals.length > 0 && t() > 0.4) {
                                        fIdx = K_FINAL.indexOf(validFinals[Math.floor(t() * validFinals.length)]);
                                    }
                                    result += String.fromCharCode(44032 + (iIdx * 588) + (vIdx * 28) + fIdx);
                                }
                                return result;
                            }
                            let word = "";
                            const len = Math.floor(t() * 4) + 3;
                            for (let i = 0; i < len; i++) {
                                word += allowedJamos[Math.floor(t() * allowedJamos.length)];
                            }
                            return word;
                        }
                        ngram1() {
                            const codes = lettersList.map(({ codePoint: e }) => e);
                            const s = new d.ti(codes);
                            for (let n = 0; n < codes.length; n++) s.set(codes[n], 1);
                            return s
                        }
                        ngram2() {
                            const codes = lettersList.map(({ codePoint: e }) => e);
                            const s = new d.mA(codes);
                            for (let n = 0; n < codes.length; n++)
                                for (let i = 0; i < codes.length; i++) s.set(codes[n], codes[i], 1);
                            return s
                        }
                    };
                }
                const s = await o.Em.use((0, o.eA)("application/octet-stream")).GET(function(e) {
                        switch (e) {
                            case d.TM.AR:
                                return c;
                            case d.TM.BE:
                                return u;
                            case d.TM.BR:
                                return h;
                            case d.TM.CS:
                                return x;
                            case d.TM.DA:
                                return j;
                            case d.TM.DE:
                                return p;
                            case d.TM.EL:
                                return g;
                            case d.TM.EN:
                                return m;
                            case d.TM.EN_GB:
                                return f;
                            case d.TM.ES:
                                return y;
                            case d.TM.ET:
                                return w;
                            case d.TM.FA:
                                return b;
                            case d.TM.FI:
                                return A;
                            case d.TM.FR:
                                return k;
                            case d.TM.HE:
                                return v;
                            case d.TM.HR:
                                return S;
                            case d.TM.HU:
                                return L;
                            case d.TM.IT:
                                return M;
                            case d.TM.JA:
                                return D;
                            case d.TM.LT:
                                return T;
                            case d.TM.LV:
                                return K;
                            case d.TM.NB:
                                return C;
                            case d.TM.NL:
                                return I;
                            case d.TM.PL:
                                return E;
                            case d.TM.PT:
                                return R;
                            case d.TM.RO:
                                return N;
                            case d.TM.RU:
                                return V;
                            case d.TM.SL:
                                return z;
                            case d.TM.SV:
                                return H;
                            case d.TM.TH:
                                return F;
                            case d.TM.TR:
                                return G;
                            case d.TM.UK:
                                return O;
                            case d.TM.VI:
                                return U;
                            default:
                                throw new Error
                        }
                    }(e)).send(),
                    t = await s.arrayBuffer(),
                    n = (0, r.w9)(e, new Uint8Array(t));
                return (0, r.ZL)(n)
            };

            function q({
                language: e,
                children: s,
                fallback: t = (0, n.jsx)(i.e2, {})
            }) {
                return (0, n.jsx)(P, {
                    language: e,
                    fallback: t,
                    children: s
                }, e.id)
            }

            function P({
                language: e,
                children: s,
                fallback: t
            }) {
                const i = function(e) {
                    const [s, t] = (0, l.useState)(null);
                    return (0, l.useEffect)(() => {
                        let s = !1;
                        return q.loader(e).then(e => {
                            s || t(e)
                        }).catch(a.WL), () => {
                            s = !0
                        }
                    }, [e]), s
                }(e);
                return null == i ? t : (0, n.jsx)(r.Dz.Provider, {
                    value: i,
                    children: s(i)
                })
            }! function(e) {
                e.loader = B
            }(q || (q = {}))
        }
    }
]);
//# sourceMappingURL=f2412e0df68ce29c.js.map