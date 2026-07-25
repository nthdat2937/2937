// Catch & gracefully handle IndexedDB backing store errors
(function() {
  try {
    if (window.indexedDB) {
      var origOpen = window.indexedDB.open;
      window.indexedDB.open = function() {
        try {
          var req = origOpen.apply(this, arguments);
          req.addEventListener('error', function(e) {
            console.warn('[IndexedDB Warning] Backing store error handled:', e);
          });
          return req;
        } catch(err) {
          console.warn('[IndexedDB Warning] indexedDB.open failed:', err);
          return { addEventListener: function(){}, onsuccess: null, onerror: null, result: null };
        }
      };
    }
  } catch(e) {}

  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && (event.reason.name === 'UnknownError' || (event.reason.message && event.reason.message.includes('indexedDB')))) {
      console.warn('[Suppressed IndexedDB Rejection]', event.reason);
      event.preventDefault();
    }
  });
})();

const SUPABASE_URL = 'https://mhjqautyydjaoiskisls.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oanFhdXR5eWRqYW9pc2tpc2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NDE5ODAsImV4cCI6MjEwMDAxNzk4MH0.nZeH6Pfgld5eDkrZuVCog5LRcmspgxDdrojUFW-7EZA';

(function () {
  'use strict';

  // Initialize Supabase client
  const { createClient } = window.supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  // Expose globally
  window.__supabase = supabaseClient;
  window.__SUPABASE_URL = SUPABASE_URL;

  // Vietnamese Telex character disassembly map for fair WPM & keystroke counting
  const VIETNAMESE_TELEX_MAP = {
    'á': 'as', 'à': 'af', 'ả': 'ar', 'ã': 'ax', 'ạ': 'aj',
    'â': 'aa', 'ấ': 'aas', 'ầ': 'aaf', 'ẩ': 'aar', 'ẫ': 'aax', 'ậ': 'aaj',
    'ă': 'aw', 'ắ': 'aws', 'ằ': 'awf', 'ẳ': 'awr', 'ẵ': 'awx', 'ặ': 'awj',
    'đ': 'dd', 'Đ': 'Dd',
    'é': 'es', 'è': 'ef', 'ẻ': 'er', 'ẽ': 'ex', 'ẹ': 'ej',
    'ê': 'ee', 'ế': 'ees', 'ề': 'eef', 'ể': 'eer', 'ễ': 'eex', 'ệ': 'eej',
    'í': 'is', 'ì': 'if', 'ỉ': 'ir', 'ĩ': 'ix', 'ị': 'ij',
    'ó': 'os', 'ò': 'of', 'ỏ': 'or', 'õ': 'ox', 'ọ': 'oj',
    'ô': 'oo', 'ố': 'oos', 'ồ': 'oof', 'ổ': 'oor', 'ỗ': 'oox', 'ộ': 'ooj',
    'ơ': 'ow', 'ớ': 'ows', 'ờ': 'owf', 'ở': 'owr', 'ỡ': 'owx', 'ợ': 'owj',
    'ú': 'us', 'ù': 'uf', 'ủ': 'ur', 'ũ': 'ux', 'ụ': 'uj',
    'ư': 'uw', 'ứ': 'uws', 'ừ': 'uwf', 'ử': 'uwr', 'ữ': 'uwx', 'ự': 'uwj',
    'ý': 'ys', 'ỳ': 'yf', 'ỷ': 'yr', 'ỹ': 'yx', 'ỵ': 'yj',
    'Á': 'As', 'À': 'Af', 'Ả': 'Ar', 'Ã': 'Ax', 'Ạ': 'Aj',
    'Â': 'Aa', 'Ấ': 'Aas', 'Ầ': 'Aaf', 'Ẩ': 'Aar', 'Ẫ': 'Aax', 'Ậ': 'Aaj',
    'Ă': 'Aw', 'Ắ': 'Aws', 'Ằ': 'Awf', 'Ẳ': 'Awr', 'Ẵ': 'Awx', 'Ặ': 'Awj',
    'É': 'Es', 'È': 'Ef', 'Ẻ': 'Er', 'Ẽ': 'Ex', 'Ẹ': 'Ej',
    'Ê': 'Ee', 'Ế': 'Ees', 'Ề': 'Eef', 'Ể': 'Eer', 'Ễ': 'Eex', 'Ệ': 'Eej',
    'Í': 'Is', 'Ì': 'If', 'Ỉ': 'Ir', 'Ĩ': 'Ix', 'Ị': 'Ij',
    'Ó': 'Os', 'Ò': 'Of', 'Ỏ': 'Or', 'Õ': 'Ox', 'Ọ': 'Oj',
    'Ô': 'Oo', 'Ố': 'Oos', 'Ồ': 'Oof', 'Ổ': 'Oor', 'Ỗ': 'Oox', 'Ộ': 'Ooj',
    'Ơ': 'Ow', 'Ớ': 'Ows', 'Ờ': 'Owf', 'Ở': 'Owr', 'Ỡ': 'Owx', 'Ợ': 'Owj',
    'Ú': 'Us', 'Ù': 'Uf', 'Ủ': 'Ur', 'Ũ': 'Ux', 'Ụ': 'Uj',
    'Ư': 'Uw', 'Ứ': 'Uws', 'Ừ': 'Uwf', 'Ử': 'Uwr', 'Ữ': 'Uwx', 'Ự': 'Uwj',
    'Ý': 'Ys', 'Ỳ': 'Yf', 'Ỷ': 'Yr', 'Ỹ': 'Yx', 'Ỵ': 'Yj',
  };

  window.__disassembleVietnamese = function (str) {
    if (!str) return str;
    return str.split('').map(c => VIETNAMESE_TELEX_MAP[c] || c).join('');
  };

  console.log('[MonkeyType-Supabase] Client initialized');
})();
