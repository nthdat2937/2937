(() => {
  let e, t, a = Date.now(),
    n = 0,
    o = 0,
    s = !1,
    r = new Date;

  function i() {
    console.log("Day timer run"), console.log(Date.now(), r), Date.now() > r.getTime() && (console.log("Past midnight"), r = new Date(r.getTime() + 6e4), postMessage({
      type: "midnight"
    }))
  }
  r = new Date(r.getTime() + 6e4), self.addEventListener("message", (r => {
    if ("midnight" == r.data.type && (t = setInterval(i, 1e4)), "timer" === r.data.type) {
      if ("pause" == r.data.action && s) return clearInterval(e), void(s = !1);
      var l;
      "start" == r.data.action && (l = r.data.duration + 150, a = Date.now(), n = 0, o = l), s || (e = setInterval((() => {
        const t = (() => {
          const e = Math.round((Date.now() - a) / 1e3) - n;
          n += e;
          const t = e - (n > o ? n - o : 0);
          return t > 0 ? t : 1
        })();
        if (n >= o) return clearInterval(e), s = !1, void postMessage({
          type: "timer",
          data: "end",
          counted: n,
          countMax: o
        });
        t > 0 && postMessage({
          type: "timer",
          gap: t,
          counted: n,
          countMax: o
        })
      }), 1e3), s = !0)
    }
  })), addEventListener("push", (t => {
    console.log("SW", t, t.data.text()), clearInterval(e), clients.matchAll().then((e => {
      for (const t of e) console.log(e)
    }))
  }))
})();