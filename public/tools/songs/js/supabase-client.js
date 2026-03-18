// ===== SHARED SUPABASE CLIENT =====
// File này chứa supabase client dùng chung cho tất cả modules

import {
    createClient
  } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
  
  export const supabase = createClient(
    "https://ktqdzlhvdkerjajffgfi.supabase.co", 
    "sb_publishable_1wm-eXETyu07vl61sY4mBQ_xwYZVOCj"
  );