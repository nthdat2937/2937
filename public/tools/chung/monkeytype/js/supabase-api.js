/**
 * Supabase API Interceptor for MonkeyType Clone
 * Intercepts fetch() calls to api.monkeytype.com and routes to Supabase
 */
(function () {
  'use strict';

  const sb = () => window.__supabase;
  const API_ORIGIN = 'https://api.monkeytype.com';
  const originalFetch = window.fetch;

  // Route map: [method, pathPattern] -> handler
  const routes = [];

  function route(method, pattern, handler) {
    const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
    routes.push({ method, regex, handler });
  }

  function matchRoute(method, path) {
    for (const r of routes) {
      if (r.method !== method) continue;
      const m = path.match(r.regex);
      if (m) return { handler: r.handler, params: m.slice(1) };
    }
    return null;
  }

  function ok(data, message = 'ok') {
    return new Response(JSON.stringify({ message, data }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  function err(status, message) {
    return new Response(JSON.stringify({ message }), {
      status, headers: { 'Content-Type': 'application/json' }
    });
  }

  // Helper: get current user
  async function getUser() {
    try {
      const { data: { user } } = await sb().auth.getUser();
      if (user) return user;
    } catch (e) {}
    try {
      const { data: { session } } = await sb().auth.getSession();
      if (session?.user) return session.user;
    } catch (e) {}
    if (window.__supabaseAuthSessionUser) {
      return { id: window.__supabaseAuthSessionUser.uid, email: window.__supabaseAuthSessionUser.email };
    }
    return null;
  }

  // ==================== CONFIGURATION ====================
  route('GET', '/configuration', async () => {
    return ok({
      maintenance: false,
      results: { savingEnabled: true, objectHashCheckEnabled: false, filterPresets: { enabled: true, maxPresetsPerUser: 10 } },
      users: { signUp: true, discordIntegration: { enabled: false }, profiles: { enabled: true }, inbox: { enabled: true, maxMail: 100 } },
      admin: { endpointsEnabled: false },
      apeKeys: { endpointsEnabled: false, acceptKeys: false, maxKeysPerUser: 0 },
      rateLimiting: { badAuthentication: { enabled: false } },
      dailyLeaderboards: {
        enabled: true,
        leaderboardExpirationTimeInDays: 1,
        maxResults: 100,
        scheduleRewardsModeEnabled: false,
        topResultsToAnnounce: 10,
        validModeRules: [
          { language: '(english|vietnamese)', mode: 'time', mode2: '15' },
          { language: '(english|vietnamese)', mode: 'time', mode2: '30' },
          { language: '(english|vietnamese)', mode: 'time', mode2: '60' },
          { language: '(english|vietnamese)', mode: 'time', mode2: '120' },
          { language: '(english|vietnamese)', mode: 'words', mode2: '10' },
          { language: '(english|vietnamese)', mode: 'words', mode2: '25' },
          { language: '(english|vietnamese)', mode: 'words', mode2: '50' },
          { language: '(english|vietnamese)', mode: 'words', mode2: '100' },
          { language: '(english|vietnamese)', mode: 'quote', mode2: 'all' }
        ]
      },
      leaderboards: { weeklyXp: { enabled: true } },
      quotes: { reporting: { enabled: false }, submissionsEnabled: false },
      connections: { enabled: false },
    });
  });

  // ==================== USERS ====================
  route('GET', '/users', async () => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');

    let { data: profile } = await sb()
      .from('mt_profiles').select('*').eq('id', user.id).maybeSingle();

    if (!profile) {
      const username = user.user_metadata?.username || user.username || user.email?.split('@')[0] || 'user_' + user.id.substring(0, 8);
      try {
        const { data: created } = await sb().from('mt_profiles').insert({
          id: user.id,
          email: user.email,
          username: username,
        }).select().maybeSingle();
        profile = created;
      } catch (e) {}

      if (!profile) {
        profile = {
          id: user.id,
          username: username,
          email: user.email,
          created_at: new Date().toISOString(),
          completed_tests: 0,
          started_tests: 0,
          time_typing: 0,
          xp: 0,
          is_banned: false,
          is_verified: false,
          lb_opt_out: false,
          is_premium: false,
          streak_length: 0,
          streak_max_length: 0,
          streak_hour_offset: 0,
        };
      }
    }

    const { data: pbs } = await sb()
      .from('mt_personal_bests').select('*').eq('user_id', user.id);

    const { data: tags } = await sb()
      .from('mt_tags').select('*').eq('user_id', user.id);

    // Build personalBests object
    const personalBests = { time: {}, words: {}, quote: {}, zen: {}, custom: {} };
    (pbs || []).forEach(pb => {
      if (!personalBests[pb.mode]) personalBests[pb.mode] = {};
      if (!personalBests[pb.mode][pb.mode2]) personalBests[pb.mode][pb.mode2] = [];
      personalBests[pb.mode][pb.mode2].push({
        acc: pb.accuracy, consistency: pb.consistency, difficulty: pb.difficulty,
        lazyMode: pb.lazy_mode, language: pb.language, punctuation: pb.punctuation,
        numbers: pb.numbers, raw: pb.raw_wpm, wpm: pb.wpm, timestamp: pb.timestamp,
      });
    });

    return ok({
      name: profile.username || 'user', email: profile.email || '', uid: user.id,
      addedAt: profile.created_at ? new Date(profile.created_at).getTime() : Date.now(),
      personalBests, completedTests: profile.completed_tests || 0,
      startedTests: profile.started_tests || 0, timeTyping: profile.time_typing || 0,
      xp: profile.xp || 0, banned: profile.is_banned || false, verified: profile.is_verified || false,
      lbOptOut: profile.lb_opt_out || false, isPremium: profile.is_premium || false,
      needsToChangeName: false, profileDetails: {
        bio: profile.bio || '', keyboard: profile.keyboard || '',
        socialProfiles: { twitter: profile.social_twitter || '', github: profile.social_github || '', website: profile.social_website || '' },
      },
      streak: { length: profile.streak_length || 0, maxLength: profile.streak_max_length || 0, hourOffset: profile.streak_hour_offset || 0 },
      tags: (tags || []).map(t => ({ _id: t.id, name: t.name, personalBests: t.personal_bests || {} })),
      inventory: { badges: [] },
      allTimeLbs: { time: {} },
      favoriteQuotes: {},
      inboxUnreadSize: 0,
    });
  });

  route('POST', '/users/signup', async (_, body) => {
    return ok(null, 'User created');
  });

  route('GET', '/users/checkName/([^/]+)', async (params) => {
    const name = params[0];
    const { data } = await sb()
      .from('mt_profiles').select('id').eq('username', name).maybeSingle();
    return ok({ available: !data });
  });

  route('PATCH', '/users/name', async (_, body) => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    await sb().from('mt_profiles').update({ username: body.name }).eq('id', user.id);
    return ok(null, 'Name updated');
  });

  route('PATCH', '/users/leaderboardMemory', async () => ok(null, 'Updated'));
  route('PATCH', '/users/profile', async (_, body) => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const update = {};
    if (body.bio !== undefined) update.bio = body.bio;
    if (body.keyboard !== undefined) update.keyboard = body.keyboard;
    if (body.socialProfiles) {
      if (body.socialProfiles.twitter !== undefined) update.social_twitter = body.socialProfiles.twitter;
      if (body.socialProfiles.github !== undefined) update.social_github = body.socialProfiles.github;
      if (body.socialProfiles.website !== undefined) update.social_website = body.socialProfiles.website;
    }
    await sb().from('mt_profiles').update(update).eq('id', user.id);
    return ok({ bio: body.bio, keyboard: body.keyboard, socialProfiles: body.socialProfiles }, 'Profile updated');
  });

  route('GET', '/users/([^/]+)/profile', async (params) => {
    const uidOrName = decodeURIComponent(params[0]);
    let query = sb().from('mt_profiles').select('*');
    // Try UUID first, then username
    if (/^[0-9a-f-]{36}$/i.test(uidOrName)) {
      query = query.eq('id', uidOrName);
    } else {
      query = query.eq('username', uidOrName);
    }
    const { data: profile } = await query.maybeSingle();
    if (!profile) return err(404, 'User not found');

    const { data: pbs } = await sb()
      .from('mt_personal_bests').select('*').eq('user_id', profile.id)
      .in('mode', ['time', 'words']).in('mode2', ['15', '30', '60', '120', '10', '25', '50', '100']);

    const personalBests = { time: {}, words: {} };
    (pbs || []).forEach(pb => {
      if (!personalBests[pb.mode]) return;
      if (!personalBests[pb.mode][pb.mode2]) personalBests[pb.mode][pb.mode2] = [];
      personalBests[pb.mode][pb.mode2].push({
        acc: pb.accuracy, consistency: pb.consistency, difficulty: pb.difficulty,
        lazyMode: pb.lazy_mode, language: pb.language, punctuation: pb.punctuation,
        numbers: pb.numbers, raw: pb.raw_wpm, wpm: pb.wpm, timestamp: pb.timestamp,
      });
    });

    return ok({
      uid: profile.id, name: profile.username, addedAt: new Date(profile.created_at).getTime(),
      xp: profile.xp, isPremium: profile.is_premium,
      typingStats: { completedTests: profile.completed_tests, startedTests: profile.started_tests, timeTyping: profile.time_typing },
      personalBests, streak: profile.streak_length, maxStreak: profile.streak_max_length,
      details: { bio: profile.bio, keyboard: profile.keyboard, socialProfiles: { twitter: profile.social_twitter, github: profile.social_github, website: profile.social_website } },
    });
  });

  route('GET', '/users/tags', async () => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const { data } = await sb().from('mt_tags').select('*').eq('user_id', user.id);
    return ok((data || []).map(t => ({ _id: t.id, name: t.name, personalBests: t.personal_bests || {} })));
  });

  route('GET', '/users/stats', async () => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const { data: p } = await sb().from('mt_profiles').select('completed_tests,started_tests,time_typing').eq('id', user.id).single();
    return ok({ completedTests: p?.completed_tests || 0, startedTests: p?.started_tests || 0, timeTyping: p?.time_typing || 0 });
  });

  route('GET', '/users/testActivity', async () => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const { data } = await sb().from('mt_test_activity').select('*').eq('user_id', user.id).order('activity_date', { ascending: true });
    const byYear = {};
    (data || []).forEach(d => {
      const year = d.activity_date.substring(0, 4);
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(d.test_count);
    });
    return ok(byYear);
  });

  route('GET', '/users/currentTestActivity', async () => {
    const user = await getUser();
    if (!user) return ok(null);
    const oneYearAgo = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const { data } = await sb().from('mt_test_activity').select('*').eq('user_id', user.id)
      .gte('activity_date', oneYearAgo.toISOString().split('T')[0]).order('activity_date');
    if (!data || !data.length) return ok(null);
    return ok({ testsByDays: data.map(d => d.test_count), lastDay: new Date(data[data.length - 1].activity_date).getTime() });
  });

  route('GET', '/users/streak', async () => {
    const user = await getUser();
    if (!user) return ok(null);
    const { data: p } = await sb().from('mt_profiles').select('streak_length,streak_max_length,streak_hour_offset').eq('id', user.id).single();
    return ok(p ? { length: p.streak_length, maxLength: p.streak_max_length, hourOffset: p.streak_hour_offset } : null);
  });

  route('GET', '/users/favoriteQuotes', async () => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const { data } = await sb().from('mt_favorite_quotes').select('*').eq('user_id', user.id);
    const result = {};
    (data || []).forEach(fq => {
      if (!result[fq.language]) result[fq.language] = [];
      result[fq.language].push(fq.quote_id);
    });
    return ok(result);
  });

  route('GET', '/users/personalBests', async () => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const { data: pbs } = await sb().from('mt_personal_bests').select('*').eq('user_id', user.id);
    const result = {};
    (pbs || []).forEach(pb => {
      if (!result[pb.mode2]) result[pb.mode2] = [];
      result[pb.mode2].push({
        acc: pb.accuracy, consistency: pb.consistency, difficulty: pb.difficulty,
        lazyMode: pb.lazy_mode, language: pb.language, punctuation: pb.punctuation,
        numbers: pb.numbers, raw: pb.raw_wpm, wpm: pb.wpm, timestamp: pb.timestamp,
      });
    });
    return ok(result);
  });

  route('GET', '/users/inbox', async () => ok({ inbox: [], maxMail: 100 }));
  route('GET', '/users/customThemes', async () => ok([]));
  route('GET', '/users/friends', async () => ok([]));

  // ==================== RESULTS ====================
  route('GET', '/results', async (_, __, url) => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');

    const params = new URL(url).searchParams;
    const limit = Math.min(parseInt(params.get('limit') || '1000'), 1000);
    const offset = parseInt(params.get('offset') || '0');

    const { data } = await sb().from('mt_results').select('*')
      .eq('user_id', user.id).order('timestamp', { ascending: false }).range(offset, offset + limit - 1);

    return ok((data || []).map(r => ({
      _id: r.id, uid: user.id, wpm: r.wpm, rawWpm: r.raw_wpm, acc: r.accuracy,
      consistency: r.consistency, mode: r.mode, mode2: r.mode2, language: r.language,
      difficulty: r.difficulty, punctuation: r.punctuation, numbers: r.numbers,
      lazyMode: r.lazy_mode, blindMode: r.blind_mode, funbox: r.funbox || [],
      charStats: [r.char_correct, r.char_incorrect, r.char_extra, r.char_missed],
      testDuration: r.test_duration, afkDuration: r.afk_duration,
      incompleteTestSeconds: r.incomplete_test_seconds, restartCount: r.restart_count,
      isPb: r.is_pb, bailedOut: r.bailed_out, timestamp: r.timestamp, tags: r.tags || [],
    })));
  });

  route('GET', '/results/last', async () => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const { data } = await sb().from('mt_results').select('*')
      .eq('user_id', user.id).order('timestamp', { ascending: false }).limit(1).maybeSingle();
    if (!data) return ok(null);
    return ok({
      _id: data.id, uid: user.id, wpm: data.wpm, rawWpm: data.raw_wpm, acc: data.accuracy,
      consistency: data.consistency, mode: data.mode, mode2: data.mode2, language: data.language,
      difficulty: data.difficulty, punctuation: data.punctuation, numbers: data.numbers,
      lazyMode: data.lazy_mode, blindMode: data.blind_mode, charStats: [data.char_correct, data.char_incorrect, data.char_extra, data.char_missed],
      testDuration: data.test_duration, timestamp: data.timestamp, chartData: data.chart_data || 'toolong',
      tags: data.tags || [], afkDuration: data.afk_duration, restartCount: data.restart_count,
      incompleteTestSeconds: data.incomplete_test_seconds, isPb: data.is_pb, bailedOut: data.bailed_out,
    });
  });

  route('POST', '/results', async (_, body) => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const r = (body && body.result) ? body.result : (body || {});

    const insertData = {
      user_id: user.id,
      wpm: Number(r.wpm || 0),
      raw_wpm: Number(r.rawWpm || r.raw || 0),
      accuracy: Number(r.acc || r.accuracy || 0),
      consistency: Number(r.consistency || 0),
      mode: String(r.mode || 'time'),
      mode2: String(r.mode2 || '15'),
      language: String(r.language || 'english'),
      difficulty: String(r.difficulty || 'normal'),
      punctuation: Boolean(r.punctuation),
      numbers: Boolean(r.numbers),
      lazy_mode: Boolean(r.lazyMode),
      blind_mode: Boolean(r.blindMode),
      funbox: Array.isArray(r.funbox) ? r.funbox : [],
      char_correct: Number(r.charStats?.[0] ?? r.charTotal ?? 0),
      char_incorrect: Number(r.charStats?.[1] ?? 0),
      char_extra: Number(r.charStats?.[2] ?? 0),
      char_missed: Number(r.charStats?.[3] ?? 0),
      test_duration: Number(r.testDuration || 0),
      afk_duration: Number(r.afkDuration || 0),
      incomplete_test_seconds: Number(r.incompleteTestSeconds || 0),
      restart_count: Number(r.restartCount || 0),
      tags: Array.isArray(r.tags) ? r.tags : [],
      bailed_out: Boolean(r.bailedOut),
      timestamp: Number(r.timestamp || Date.now()),
    };

    console.log('[Supabase API] Saving test result:', insertData);

    // Save result to mt_results table
    const { data: inserted, error: insertErr } = await sb()
      .from('mt_results')
      .insert(insertData)
      .select()
      .maybeSingle();

    if (insertErr) {
      console.error('[Supabase API] Error saving result to mt_results:', insertErr);
    }

    // Check & update Personal Best first to determine PB status for bonus
    let isPb = false;
    if (r.mode !== 'quote') {
      try {
        const { data: existingPb } = await sb().from('mt_personal_bests').select('wpm')
          .eq('user_id', user.id).eq('mode', String(r.mode)).eq('mode2', String(r.mode2))
          .eq('language', String(r.language || 'english')).eq('difficulty', String(r.difficulty || 'normal'))
          .eq('punctuation', Boolean(r.punctuation)).eq('numbers', Boolean(r.numbers))
          .eq('lazy_mode', Boolean(r.lazyMode)).maybeSingle();

        if (!existingPb || Number(r.wpm || 0) > Number(existingPb.wpm || 0)) {
          isPb = true;
          await sb().from('mt_personal_bests').upsert({
            user_id: user.id, mode: String(r.mode), mode2: String(r.mode2),
            language: String(r.language || 'english'), difficulty: String(r.difficulty || 'normal'),
            punctuation: Boolean(r.punctuation), numbers: Boolean(r.numbers),
            lazy_mode: Boolean(r.lazyMode), wpm: Number(r.wpm || 0), raw_wpm: Number(r.rawWpm || r.raw || 0),
            accuracy: Number(r.acc || r.accuracy || 0), consistency: Number(r.consistency || 0), timestamp: Number(r.timestamp || Date.now()),
          }, { onConflict: 'user_id,mode,mode2,language,difficulty,punctuation,numbers,lazy_mode' });
        }
      } catch (e) {
        console.warn('[Supabase API] Personal best update warning:', e);
      }
    }

    // Rewarding EXP Calculation Formula:
    // 1. Base EXP for finishing a test: 50 EXP
    // 2. WPM Bonus: WPM * 3 * (Duration / 15 seconds)
    // 3. Accuracy Multiplier: 100% -> 1.5x, >=98% -> 1.25x, >=95% -> 1.1x
    // 4. PB Bonus: +100 EXP if new Personal Best
    const testSecs = Math.max(5, Number(r.testDuration || 15));
    const wpmVal = Number(r.wpm || 0);
    const accVal = Math.min(100, Math.max(0, Number(r.acc || r.accuracy || 100))) / 100;

    const baseExp = 50 + Math.round(wpmVal * 3 * (testSecs / 15));
    let accMultiplier = accVal;
    if (accVal >= 1.0) accMultiplier = 1.5;
    else if (accVal >= 0.98) accMultiplier = 1.25;
    else if (accVal >= 0.95) accMultiplier = 1.1;

    let gainedXp = Math.round(baseExp * accMultiplier);
    if (isPb) gainedXp += 100;

    // Update user profile typing stats & total XP
    const duration = Number(r.testDuration || 0) + Number(r.incompleteTestSeconds || 0) - Number(r.afkDuration || 0);
    let userStreak = 1;
    try {
      const { data: p } = await sb().from('mt_profiles').select('started_tests,completed_tests,time_typing,xp,streak_length').eq('id', user.id).single();
      if (p) {
        userStreak = p.streak_length || 1;
        const newXp = (Number(p.xp) || 0) + gainedXp;
        await sb().from('mt_profiles').update({
          started_tests: (p.started_tests || 0) + Number(r.restartCount || 0) + 1,
          completed_tests: (p.completed_tests || 0) + 1,
          time_typing: (Number(p.time_typing) || 0) + Math.max(0, duration),
          xp: newXp,
        }).eq('id', user.id);
        console.log(`[Supabase API] Updated user XP: +${gainedXp} -> total: ${newXp}`);
      }
    } catch (e) {
      console.warn('[Supabase API] Profile stat update warning:', e);
    }

    // Update test activity count for calendar heatmap
    const today = new Date().toISOString().split('T')[0];
    try {
      const { data: act } = await sb().from('mt_test_activity').select('*').eq('user_id', user.id).eq('activity_date', today).maybeSingle();
      if (act) {
        await sb().from('mt_test_activity').update({ test_count: act.test_count + 1 }).eq('id', act.id);
      } else {
        await sb().from('mt_test_activity').insert({ user_id: user.id, activity_date: today, test_count: 1 });
      }
    } catch (e) {}

    // Update mt_leaderboards table if user achieved higher score
    try {
      const { data: pProfile } = await sb().from('mt_profiles').select('username').eq('id', user.id).maybeSingle();
      const uname = pProfile?.username || user.email?.split('@')[0] || 'user';
      const { data: existingLb } = await sb().from('mt_leaderboards').select('wpm')
        .eq('user_id', user.id).eq('mode', String(r.mode)).eq('mode2', String(r.mode2)).maybeSingle();

      if (!existingLb || Number(r.wpm || 0) > Number(existingLb.wpm || 0)) {
        await sb().from('mt_leaderboards').upsert({
          user_id: user.id,
          username: uname,
          mode: String(r.mode),
          mode2: String(r.mode2),
          language: String(r.language || 'english'),
          wpm: Number(r.wpm || 0),
          raw_wpm: Number(r.rawWpm || r.raw || 0),
          accuracy: Number(r.acc || r.accuracy || 0),
          consistency: Number(r.consistency || 0),
          timestamp: Number(r.timestamp || Date.now()),
        }, { onConflict: 'user_id,mode,mode2' });
      }
    } catch (e) {
      console.warn('[Supabase API] Leaderboard update warning:', e);
    }

    return ok({
      insertedId: inserted?.id || 'res_' + Date.now(),
      isPb,
      tagPbs: [],
      xp: gainedXp,
      dailyXpBonus: false,
      xpBreakdown: { base: gainedXp },
      streak: userStreak,
    });
  });

  // ==================== CONFIGS ====================
  route('GET', '/configs', async () => {
    const user = await getUser();
    if (!user) return ok(null);
    const { data } = await sb().from('mt_profiles').select('config').eq('id', user.id).single();
    return ok(data?.config || null);
  });

  route('PATCH', '/configs', async (_, body) => {
    const user = await getUser();
    if (!user) return err(401, 'Not authenticated');
    const { data: existing } = await sb().from('mt_profiles').select('config').eq('id', user.id).single();
    const merged = { ...(existing?.config || {}), ...body };
    await sb().from('mt_profiles').update({ config: merged }).eq('id', user.id);
    return ok(null, 'Config updated');
  });

  // ==================== PRESETS ====================
  route('GET', '/presets', async () => {
    const user = await getUser();
    if (!user) return ok([]);
    const { data } = await sb().from('mt_presets').select('*').eq('user_id', user.id);
    return ok((data || []).map(p => ({ _id: p.id, name: p.name, config: p.config })));
  });

  function cleanStr(val) {
    if (!val) return '';
    return String(val).replace(/^["']|["']$/g, '').trim();
  }

  // ==================== LEADERBOARDS ====================
  async function fetchLeaderboardEntries(table, mode, mode2, pageIndex, pageSize) {
    try {
      const cMode = cleanStr(mode);
      const cMode2 = cleanStr(mode2);

      let query = sb().from(table).select('*');
      if (cMode) query = query.eq('mode', cMode);
      if (cMode2) query = query.eq('mode2', cMode2);
      
      const { data, error } = await query.order('wpm', { ascending: false });

      if (error || !data || data.length === 0) {
        return { entries: [], count: 0 };
      }

      // Deduplicate per user: Keep ONLY the highest WPM row for each user
      const userBestMap = new Map();
      for (const row of data) {
        if (row.user_id && !userBestMap.has(row.user_id)) {
          userBestMap.set(row.user_id, row);
        }
      }
      const uniqueUserRows = Array.from(userBestMap.values());
      const paginatedRows = uniqueUserRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

      let profileMap = {};
      try {
        const userIds = [...new Set(paginatedRows.map(d => d.user_id).filter(Boolean))];
        if (userIds.length > 0) {
          const { data: profiles } = await sb().from('mt_profiles').select('id, username, email').in('id', userIds);
          if (profiles) {
            profiles.forEach(p => {
              profileMap[p.id] = p.username || p.email?.split('@')[0] || 'User';
            });
          }
        }
      } catch (pErr) {
        console.warn('[Supabase API] Failed to map profiles:', pErr);
      }

      const entries = paginatedRows.map((e, i) => ({
        wpm: Number(e.wpm || 0),
        acc: Number(e.accuracy !== undefined ? e.accuracy : (e.acc || 0)),
        raw: Number(e.raw_wpm !== undefined ? e.raw_wpm : (e.raw || 0)),
        consistency: Number(e.consistency || 0),
        timestamp: Number(e.timestamp || Date.now()),
        uid: e.user_id,
        name: e.username || profileMap[e.user_id] || 'User ' + String(e.user_id || '').substring(0, 5),
        rank: pageIndex * pageSize + i + 1,
        badgeId: 0,
        language: e.language || 'english',
        mode: e.mode || cMode || 'time',
        mode2: String(e.mode2 || cMode2 || '15'),
      }));

      return { entries, count: uniqueUserRows.length };
    } catch (err) {
      console.error(`[Supabase API] Error fetching from ${table}:`, err);
      return { entries: [], count: 0 };
    }
  }

  route('GET', '/leaderboards', async (_, __, url) => {
    const params = new URL(url).searchParams;
    const mode = cleanStr(params.get('mode')) || 'time';
    const mode2 = cleanStr(params.get('mode2')) || '15';
    const rawPage = parseInt(params.get('page') || '1');
    const pageIndex = Math.max(0, rawPage > 0 ? rawPage - 1 : 0);
    const pageSize = parseInt(params.get('pageSize') || '50');

    // 1. Try mt_results first
    let res = await fetchLeaderboardEntries('mt_results', mode, mode2, pageIndex, pageSize);

    // 2. Fallback to mt_personal_bests
    if (res.entries.length === 0) {
      res = await fetchLeaderboardEntries('mt_personal_bests', mode, mode2, pageIndex, pageSize);
    }

    // 3. Fallback to mt_leaderboards
    if (res.entries.length === 0) {
      res = await fetchLeaderboardEntries('mt_leaderboards', mode, mode2, pageIndex, pageSize);
    }

    console.log(`[Supabase API] GET /leaderboards mode=${mode} mode2=${mode2} => returned ${res.entries.length} unique user entries`);

    return ok({
      count: res.count,
      pageSize,
      entries: res.entries,
    });
  });

  async function getUserRankData(user, mode, mode2) {
    const cMode = cleanStr(mode) || 'time';
    const cMode2 = cleanStr(mode2) || '15';

    let tableName = 'mt_results';
    let { data: userPb } = await sb().from('mt_results').select('*')
      .eq('user_id', user.id).eq('mode', cMode).eq('mode2', cMode2)
      .order('wpm', { ascending: false }).limit(1).maybeSingle();

    if (!userPb) {
      tableName = 'mt_personal_bests';
      const { data: pb } = await sb().from('mt_personal_bests').select('*')
        .eq('user_id', user.id).eq('mode', cMode).eq('mode2', cMode2)
        .order('wpm', { ascending: false }).limit(1).maybeSingle();
      userPb = pb;
    }

    if (!userPb) return ok(null);

    const { data: allRows } = await sb().from(tableName).select('user_id, wpm')
      .eq('mode', cMode).eq('mode2', cMode2).order('wpm', { ascending: false });

    const userBestMap = new Map();
    if (allRows) {
      for (const r of allRows) {
        if (r.user_id && !userBestMap.has(r.user_id)) {
          userBestMap.set(r.user_id, Number(r.wpm || 0));
        }
      }
    }

    let higherUserCount = 0;
    for (const [uid, wpm] of userBestMap.entries()) {
      if (uid !== user.id && wpm > Number(userPb.wpm || 0)) {
        higherUserCount++;
      }
    }

    let name = 'User';
    try {
      const { data: profile } = await sb().from('mt_profiles').select('username, email').eq('id', user.id).maybeSingle();
      if (profile) name = profile.username || profile.email?.split('@')[0] || 'User';
    } catch (e) {}

    return ok({
      wpm: Number(userPb.wpm || 0),
      acc: Number(userPb.accuracy !== undefined ? userPb.accuracy : (userPb.acc || 0)),
      raw: Number(userPb.raw_wpm !== undefined ? userPb.raw_wpm : (userPb.raw || 0)),
      consistency: Number(userPb.consistency || 0),
      timestamp: Number(userPb.timestamp || Date.now()),
      uid: user.id,
      name: name,
      rank: higherUserCount + 1,
      badgeId: 0,
      language: userPb.language || 'english',
      mode: userPb.mode || cMode,
      mode2: String(userPb.mode2 || cMode2),
    });
  }

  route('GET', '/leaderboards/rank', async (_, __, url) => {
    const user = await getUser();
    if (!user) return ok(null);
    const params = new URL(url).searchParams;
    const mode = params.get('mode') || 'time';
    const mode2 = params.get('mode2') || '15';
    return getUserRankData(user, mode, mode2);
  });

  route('GET', '/leaderboards/daily', async (_, __, url) => {
    const params = new URL(url).searchParams;
    const mode = cleanStr(params.get('mode')) || 'time';
    const mode2 = cleanStr(params.get('mode2')) || '15';
    const rawPage = parseInt(params.get('page') || '1');
    const pageIndex = Math.max(0, rawPage > 0 ? rawPage - 1 : 0);
    const pageSize = parseInt(params.get('pageSize') || '50');

    let res = await fetchLeaderboardEntries('mt_results', mode, mode2, pageIndex, pageSize);

    if (res.entries.length === 0) {
      res = await fetchLeaderboardEntries('mt_personal_bests', mode, mode2, pageIndex, pageSize);
    }

    if (res.entries.length === 0) {
      res = await fetchLeaderboardEntries('mt_leaderboards', mode, mode2, pageIndex, pageSize);
    }

    return ok({
      count: res.count,
      pageSize,
      entries: res.entries,
      minWpm: 0,
      minTimeTyping: 0,
      userTimeTyping: 0,
    });
  });

  route('GET', '/leaderboards/daily/rank', async (_, __, url) => {
    const user = await getUser();
    if (!user) return ok(null);
    const params = new URL(url).searchParams;
    const mode = cleanStr(params.get('mode')) || 'time';
    const mode2 = cleanStr(params.get('mode2')) || '15';
    return getUserRankData(user, mode, mode2);
  });

  route('GET', '/leaderboards/xp/weekly', async (_, __, url) => {
    const params = new URL(url).searchParams;
    const rawPage = parseInt(params.get('page') || '1');
    const pageIndex = Math.max(0, rawPage > 0 ? rawPage - 1 : 0);
    const pageSize = parseInt(params.get('pageSize') || '50');

    const { data, count } = await sb()
      .from('mt_profiles')
      .select('id, username, email, xp, time_typing, updated_at', { count: 'exact' })
      .gt('xp', 0)
      .order('xp', { ascending: false })
      .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);

    const entries = (data || []).map((e, i) => {
      const lastActivity = e.updated_at ? new Date(e.updated_at).getTime() : Date.now();
      return {
        uid: e.id,
        name: e.username || e.email?.split('@')[0] || 'User',
        totalXp: Number(e.xp || 0),
        timeTypedSeconds: Number(e.time_typing || 0),
        lastActivityTimestamp: lastActivity,
        rank: pageIndex * pageSize + i + 1,
        badgeId: 0,
      };
    });

    return ok({
      count: count || entries.length,
      pageSize,
      entries,
    });
  });

  route('GET', '/leaderboards/xp/weekly/rank', async () => {
    const user = await getUser();
    if (!user) return ok(null);
    const { data: p } = await sb().from('mt_profiles').select('xp, time_typing, updated_at').eq('id', user.id).maybeSingle();
    if (!p || !p.xp) return ok(null);
    const { count } = await sb().from('mt_profiles').select('*', { count: 'exact', head: true }).gt('xp', p.xp);
    return ok({
      totalXp: Number(p.xp || 0),
      timeTypedSeconds: Number(p.time_typing || 0),
      lastActivityTimestamp: p.updated_at ? new Date(p.updated_at).getTime() : Date.now(),
      rank: (count || 0) + 1,
    });
  });

  // ==================== PSAS ====================
  route('GET', '/psas', async () => ok([]));

  // ==================== PUBLIC ====================
  route('GET', '/public/speedHistogram', async () => ok({}));
  route('GET', '/public/typingStats', async () => {
    const { count } = await sb().from('mt_results').select('*', { count: 'exact', head: true });
    return ok({ testsCompleted: count || 0, testsStarted: count || 0, timeTyping: 0 });
  });

  // ==================== QUOTES ====================
  route('GET', '/quotes/isSubmissionEnabled', async () => ok({ isEnabled: false }));
  route('GET', '/quotes/rating', async () => ok(null));

  // ==================== FETCH INTERCEPTOR ====================
  window.fetch = async function (input, init) {
    let url, method;

    if (input instanceof Request) {
      url = input.url;
      method = input.method;
    } else {
      url = String(input);
      method = init?.method || 'GET';
    }

    // Only intercept api.monkeytype.com calls
    if (!url.includes('api.monkeytype.com')) {
      return originalFetch.call(this, input, init);
    }

    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;
      method = method.toUpperCase();

      console.log(`[Supabase API] ${method} ${path}`);

      const match = matchRoute(method, path);
      if (match) {
        let body = null;
        if (init?.body) {
          try { body = JSON.parse(init.body); } catch { body = init.body; }
        } else if (input instanceof Request) {
          try { body = await input.clone().json(); } catch {}
        }
        return await match.handler(match.params, body, url);
      }

      console.warn(`[Supabase API] Unhandled: ${method} ${path}`);
      return ok(null, 'Not implemented');
    } catch (error) {
      console.error('[Supabase API] Error:', error);
      return err(500, error.message || 'Internal error');
    }
  };

  console.log('[MonkeyType-Supabase] API interceptor active');
})();
