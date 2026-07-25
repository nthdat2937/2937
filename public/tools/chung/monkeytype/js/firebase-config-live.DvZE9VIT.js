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
        t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = `77eb63b4-7303-4c85-8d3e-f63b35cb0f25`, e._sentryDebugIdIdentifier = `sentry-dbid-77eb63b4-7303-4c85-8d3e-f63b35cb0f25`)
    } catch {}
})();
import {
    r as e
} from "./rolldown-runtime.CC5CxxlI.js";
var t = e({
        firebaseConfig: () => n
    }),
    n = {
        apiKey: `AIzaSyB5m_AnO575kvWriahcF1SFIWp8Fj3gQno`,
        authDomain: `auth.monkeytype.com`,
        databaseURL: `https://monkey-type.firebaseio.com`,
        projectId: `monkey-type`,
        storageBucket: `monkey-type.appspot.com`,
        messagingSenderId: `789788471140`,
        appId: `1:789788471140:web:7e31b15959d68ac0a51471`,
        measurementId: `G-PFV65WPEWF`
    };
export {
    t as n, n as t
};
//#sourceMappingURL=firebase-config-live.DvZE9VIT.js.map