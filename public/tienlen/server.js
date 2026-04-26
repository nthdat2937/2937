const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));

// ══════════════════════════════════════════════
// CARD LOGIC
// ══════════════════════════════════════════════
const SUITS = ['s', 'c', 'd', 'h'];
const RANKS = ['3','4','5','6','7','8','9','10','J','Q','K','A','2'];

function rankVal(r) { return RANKS.indexOf(r); }
function suitVal(s) { return SUITS.indexOf(s); }
function cardVal(card) { return rankVal(card.rank) * 4 + suitVal(card.suit); }

function createDeck() {
  const deck = [];
  for (const rank of RANKS)
    for (const suit of SUITS)
      deck.push({ rank, suit, id: `${rank}${suit}` });
  return deck;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dealCards(numPlayers) {
  const deck = shuffle(createDeck());
  const hands = Array.from({ length: numPlayers }, (_, i) =>
    deck.slice(i * 13, (i + 1) * 13).sort((a, b) => cardVal(a) - cardVal(b))
  );
  return hands;
}

// ── Identify play type ──
function identifyPlay(cards) {
  if (!cards || cards.length === 0) return null;
  const n = cards.length;
  const sorted = [...cards].sort((a, b) => cardVal(a) - cardVal(b));

  if (n === 1) return { type: 'single', cards: sorted };

  if (n === 2) {
    if (sorted[0].rank === sorted[1].rank) return { type: 'pair', cards: sorted };
    return null;
  }

  if (n === 3) {
    if (sorted.every(c => c.rank === sorted[0].rank)) return { type: 'triple', cards: sorted };
    if (isStraight(sorted)) return { type: 'straight', cards: sorted, length: 3 };
    return null;
  }

  if (n === 4) {
    if (sorted.every(c => c.rank === sorted[0].rank)) return { type: 'quad', cards: sorted };
    if (isStraight(sorted)) return { type: 'straight', cards: sorted, length: 4 };
    return null;
  }

  if (n >= 3 && n <= 12 && isStraight(sorted)) {
    return { type: 'straight', cards: sorted, length: n };
  }

  if (n >= 6 && n % 2 === 0) {
    const pairs = chunkByRank(sorted, 2);
    if (pairs && isPairSequence(pairs)) {
      return { type: 'pair_seq', cards: sorted, pairs: pairs.length };
    }
  }

  if (n >= 6 && n % 3 === 0) {
    const triples = chunkByRank(sorted, 3);
    if (triples && isConsecutiveRanks(triples.map(t => t[0].rank))) {
      return { type: 'triple_seq', cards: sorted, triples: triples.length };
    }
  }

  return null;
}

function isStraight(sorted) {
  if (sorted.some(c => c.rank === '2')) return false;
  for (let i = 1; i < sorted.length; i++) {
    if (rankVal(sorted[i].rank) !== rankVal(sorted[i-1].rank) + 1) return false;
  }
  return true;
}

function chunkByRank(sorted, size) {
  const chunks = [];
  for (let i = 0; i < sorted.length; i += size) {
    const chunk = sorted.slice(i, i + size);
    if (chunk.length !== size) return null;
    if (!chunk.every(c => c.rank === chunk[0].rank)) return null;
    chunks.push(chunk);
  }
  return chunks;
}

function isPairSequence(pairs) {
  if (pairs.some(p => p[0].rank === '2')) return false;
  return isConsecutiveRanks(pairs.map(p => p[0].rank));
}

function isConsecutiveRanks(ranks) {
  for (let i = 1; i < ranks.length; i++) {
    if (rankVal(ranks[i]) !== rankVal(ranks[i-1]) + 1) return false;
  }
  return true;
}

function canBeat(play, table) {
  if (!table) return true;

  if (play.type === 'quad') {
    if (table.type === 'single' && table.cards[0].rank === '2') return true;
    if (table.type === 'quad') return cardVal(play.cards[3]) > cardVal(table.cards[3]);
  }

  if (play.type === 'pair_seq' && play.pairs >= 3) {
    if (table.type === 'single' && table.cards[0].rank === '2') return true;
  }

  if (play.type === 'pair_seq' && play.pairs >= 4) {
    if (table.type === 'pair' && table.cards[0].rank === '2') return true;
  }

  if (play.type !== table.type) return false;

  switch (play.type) {
    case 'single':
    case 'pair':
    case 'triple':
      return cardVal(play.cards[play.cards.length - 1]) > cardVal(table.cards[table.cards.length - 1]);
    case 'quad':
      return cardVal(play.cards[3]) > cardVal(table.cards[3]);
    case 'straight':
      if (play.length !== table.length) return false;
      return cardVal(play.cards[play.cards.length - 1]) > cardVal(table.cards[table.cards.length - 1]);
    case 'pair_seq':
      if (play.pairs !== table.pairs) return false;
      return cardVal(play.cards[play.cards.length - 1]) > cardVal(table.cards[table.cards.length - 1]);
    case 'triple_seq':
      if (play.triples !== table.triples) return false;
      return cardVal(play.cards[play.cards.length - 1]) > cardVal(table.cards[table.cards.length - 1]);
  }
  return false;
}

// ══════════════════════════════════════════════
// ROOM MANAGEMENT
// ══════════════════════════════════════════════
const rooms = {};

function createRoom(roomId, hostId, options = {}) {
  return {
    id: roomId,
    hostId,
    players: [],
    state: 'waiting',                // waiting | playing | paused | finished
    currentTurn: 0,
    table: null,
    tablePlayer: null,
    passedPlayers: new Set(),
    firstTurn: true,
    winners: [],
    roundNum: 0,
    isPrivate: options.isPrivate || false,
    pausedBy: null,
  };
}

function roomInfo(room) {
  return {
    id: room.id,
    hostId: room.hostId,
    players: room.players.map(p => ({
      id: p.id, name: p.name,
      cardCount: p.hand.length,
      score: p.score,
      passed: p.passed,
    })),
    state: room.state,
    currentTurn: room.currentTurn,
    table: room.table,
    tablePlayer: room.tablePlayer,
    firstTurn: room.firstTurn,
    winners: room.winners,
    roundNum: room.roundNum,
    isPrivate: room.isPrivate,
    pausedBy: room.pausedBy,
  };
}

function startGame(room) {
  const n = room.players.length; // chia bài theo số người thực tế
  room.state = 'playing';
  room.roundNum++;
  room.winners = [];
  room.pausedBy = null;
  const hands = dealCards(n);
  room.players.forEach((p, i) => {
    p.hand = hands[i];
    p.passed = false;
  });

  // Người có 3 bích đi trước; nếu không có (ít người) thì lá nhỏ nhất
  let starterIdx = room.players.findIndex(p => p.hand.some(c => c.rank === '3' && c.suit === 's'));
  if (starterIdx < 0) {
    let minVal = Infinity, minIdx = 0;
    room.players.forEach((p, i) => {
      const v = cardVal(p.hand[0]);
      if (v < minVal) { minVal = v; minIdx = i; }
    });
    starterIdx = minIdx;
  }
  room.currentTurn = starterIdx;
  room.table = null;
  room.tablePlayer = null;
  room.passedPlayers = new Set();
  room.firstTurn = true;
}

function nextTurn(room) {
  const n = room.players.length;
  let next = (room.currentTurn + 1) % n;
  let tries = 0;
  while (tries < n) {
    const p = room.players[next];
    if (p.hand.length > 0 && !p.passed) break;
    next = (next + 1) % n;
    tries++;
  }
  room.currentTurn = next;
}

function checkWinner(room, playerIdx) {
  const p = room.players[playerIdx];
  if (p.hand.length === 0) {
    if (!room.winners.includes(p.id)) {
      room.winners.push(p.id);
      p.score = (p.score || 0) + (room.players.length - room.winners.length) + 1;
    }
    return true;
  }
  return false;
}

function activePlayers(room) {
  return room.players.filter(p => p.hand.length > 0).length;
}

// ══════════════════════════════════════════════
// SOCKET EVENTS
// ══════════════════════════════════════════════
io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  // ── Tạo phòng ──
  socket.on('create_room', ({ name, isPrivate }, cb) => {
    const roomId = Math.random().toString(36).slice(2, 7).toUpperCase();
    rooms[roomId] = createRoom(roomId, socket.id, { isPrivate: !!isPrivate });
    const room = rooms[roomId];
    room.players.push({ id: socket.id, name, hand: [], score: 0, passed: false });
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.name = name;
    cb({ ok: true, roomId, playerId: socket.id });
    io.to(roomId).emit('room_update', roomInfo(room));
  });

  // ── Vào phòng ──
  socket.on('join_room', ({ roomId, name }, cb) => {
    const room = rooms[roomId];
    if (!room) return cb({ ok: false, error: 'Phòng không tồn tại' });

    // Rejoin
    const existing = room.players.find(p => p.name === name);
    if (existing) {
      existing.id = socket.id;
      existing.disconnected = false;
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.name = name;
      // Nếu player này là host cũ, cập nhật hostId
      if (room.hostId === existing.id || room.hostWasName === name) {
        room.hostId = socket.id;
      }
      cb({ ok: true, roomId, playerId: socket.id, rejoin: true, isHost: room.hostId === socket.id });
      if ((room.state === 'playing' || room.state === 'paused') && existing.hand.length > 0) {
        socket.emit('deal_hand', { hand: existing.hand });
      }
      io.to(roomId).emit('room_update', roomInfo(room));
      return;
    }

    if (room.state !== 'waiting') return cb({ ok: false, error: 'Phòng đang chơi' });
    if (room.players.length >= 4) return cb({ ok: false, error: 'Phòng đã đủ 4 người' });

    room.players.push({ id: socket.id, name, hand: [], score: 0, passed: false });
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.name = name;
    cb({ ok: true, roomId, playerId: socket.id, isHost: false });
    io.to(roomId).emit('room_update', roomInfo(room));

    // Auto start khi đủ 4 người
    if (room.players.length === 4) {
      startGame(room);
      io.to(room.id).emit('game_start', null);
      room.players.forEach(p => { io.to(p.id).emit('deal_hand', { hand: p.hand }); });
      io.to(room.id).emit('room_update', roomInfo(room));
    }
  });

  // ── Chủ phòng bắt đầu thủ công (khi đã đủ người tối thiểu) ──
  socket.on('host_start', (_, cb) => {
    const room = rooms[socket.data.roomId];
    if (!room) return cb && cb({ ok: false, error: 'Phòng không tồn tại' });
    if (room.hostId !== socket.id) return cb && cb({ ok: false, error: 'Chỉ chủ phòng mới có thể bắt đầu' });
    if (room.state !== 'waiting') return cb && cb({ ok: false, error: 'Ván đang diễn ra' });
    if (room.players.length < 2) return cb && cb({ ok: false, error: 'Cần ít nhất 2 người' });

    startGame(room);
    io.to(room.id).emit('game_start', null);
    room.players.forEach(p => {
      io.to(p.id).emit('deal_hand', { hand: p.hand });
    });
    io.to(room.id).emit('room_update', roomInfo(room));
    cb && cb({ ok: true });
  });

  // ── Pause / Resume (chỉ chủ phòng) ──
  socket.on('pause_game', (_, cb) => {
    const room = rooms[socket.data.roomId];
    if (!room) return cb && cb({ ok: false });
    if (room.hostId !== socket.id) return cb && cb({ ok: false, error: 'Chỉ chủ phòng mới có thể pause' });
    if (room.state !== 'playing') return cb && cb({ ok: false, error: 'Không thể pause lúc này' });

    room.state = 'paused';
    room.pausedBy = socket.data.name;
    io.to(room.id).emit('game_paused', { pausedBy: room.pausedBy });
    io.to(room.id).emit('room_update', roomInfo(room));
    cb && cb({ ok: true });
  });

  socket.on('resume_game', (_, cb) => {
    const room = rooms[socket.data.roomId];
    if (!room) return cb && cb({ ok: false });
    if (room.hostId !== socket.id) return cb && cb({ ok: false, error: 'Chỉ chủ phòng mới có thể tiếp tục' });
    if (room.state !== 'paused') return cb && cb({ ok: false, error: 'Game không đang bị pause' });

    room.state = 'playing';
    room.pausedBy = null;
    io.to(room.id).emit('game_resumed', {});
    io.to(room.id).emit('room_update', roomInfo(room));
    cb && cb({ ok: true });
  });

  // ── Thoát phòng chủ động ──
  socket.on('leave_room', () => {
    const roomId = socket.data.roomId;
    const room = rooms[roomId];
    if (!room) return;
    handleLeave(socket, room, roomId, true);
  });

  // ── Play cards ──
  socket.on('play_cards', ({ cardIds }, cb) => {
    const room = rooms[socket.data.roomId];
    if (!room || room.state !== 'playing') return cb({ ok: false, error: 'Không hợp lệ' });

    const pIdx = room.players.findIndex(p => p.id === socket.id);
    if (pIdx !== room.currentTurn) return cb({ ok: false, error: 'Chưa tới lượt' });
    if (room.players[pIdx].passed) return cb({ ok: false, error: 'Bạn đã bỏ lượt rồi' });

    const player = room.players[pIdx];
    const cards = cardIds.map(id => player.hand.find(c => c.id === id)).filter(Boolean);
    if (cards.length !== cardIds.length) return cb({ ok: false, error: 'Lá bài không hợp lệ' });

    if (room.firstTurn) {
      // Lượt đầu phải có lá nhỏ nhất (3 bích nếu có, hoặc lá nhỏ nhất trong bộ)
      const firstCard = player.hand[0];
      if (!cards.some(c => c.id === firstCard.id)) {
        return cb({ ok: false, error: `Lượt đầu phải có lá ${firstCard.rank}${firstCard.suit === 's' ? '♠' : firstCard.suit === 'c' ? '♣' : firstCard.suit === 'd' ? '♦' : '♥'}` });
      }
    }

    const play = identifyPlay(cards);
    if (!play) return cb({ ok: false, error: 'Bài không hợp lệ' });

    if (room.table && room.tablePlayer !== socket.id) {
      if (!canBeat(play, room.table)) return cb({ ok: false, error: 'Không đủ mạnh để chặt' });
    }

    const playedIds = new Set(cardIds);
    player.hand = player.hand.filter(c => !playedIds.has(c.id));
    player.passed = false;

    room.table = play;
    room.tablePlayer = socket.id;
    room.firstTurn = false;

    cb({ ok: true });

    const won = checkWinner(room, pIdx);
    io.to(room.id).emit('cards_played', {
      playerId: socket.id,
      playerName: player.name,
      play,
      handCount: player.hand.length,
    });
    io.to(socket.id).emit('deal_hand', { hand: player.hand });

    if (activePlayers(room) <= 1) {
      const loser = room.players.find(p => p.hand.length > 0 && !room.winners.includes(p.id));
      if (loser) room.winners.push(loser.id);
      room.state = 'finished';
      io.to(room.id).emit('game_over', { winners: room.winners, players: room.players.map(p => ({ id: p.id, name: p.name, score: p.score })) });
      io.to(room.id).emit('room_update', roomInfo(room));
      return;
    }

    nextTurn(room);
    io.to(room.id).emit('room_update', roomInfo(room));
  });

  // ── Pass ──
  socket.on('pass_turn', (_, cb) => {
    const room = rooms[socket.data.roomId];
    if (!room || room.state !== 'playing') return cb && cb({ ok: false });

    const pIdx = room.players.findIndex(p => p.id === socket.id);
    if (pIdx !== room.currentTurn) return cb && cb({ ok: false, error: 'Chưa tới lượt' });
    if (!room.table) return cb && cb({ ok: false, error: 'Lượt đầu không được bỏ' });

    room.players[pIdx].passed = true;
    room.passedPlayers.add(socket.id);
    cb && cb({ ok: true });

    io.to(room.id).emit('player_passed', { playerId: socket.id, playerName: room.players[pIdx].name });

    const stillPlaying = room.players.filter(p => p.hand.length > 0 && p.id !== room.tablePlayer);
    const allPassed = stillPlaying.length > 0 && stillPlaying.every(p => room.passedPlayers.has(p.id));

    if (allPassed) {
      const tableOwnerIdx = room.players.findIndex(p => p.id === room.tablePlayer);
      room.table = null;
      room.tablePlayer = null;
      room.passedPlayers = new Set();
      room.players.forEach(p => p.passed = false);
      room.currentTurn = tableOwnerIdx >= 0 ? tableOwnerIdx : (room.currentTurn + 1) % room.players.length;
      io.to(room.id).emit('table_cleared', {});
    } else {
      nextTurn(room);
    }

    io.to(room.id).emit('room_update', roomInfo(room));
  });

  // ── Rematch ──
  socket.on('rematch', () => {
    const room = rooms[socket.data.roomId];
    if (!room || room.state !== 'finished') return;
    if (room.players.length < 2) return;
    startGame(room);
    io.to(room.id).emit('game_start', null);
    room.players.forEach(p => {
      io.to(p.id).emit('deal_hand', { hand: p.hand });
    });
    io.to(room.id).emit('room_update', roomInfo(room));
  });

  // ── Disconnect ──
  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    const room = rooms[roomId];
    if (!room) return;

    const p = room.players.find(p => p.id === socket.id);
    if (!p) return;

    p.disconnected = true;
    const name = p.name;
    // Lưu tên host để nhận dạng khi rejoin
    if (room.hostId === socket.id) room.hostWasName = name;

    setTimeout(() => {
      const r = rooms[roomId];
      if (!r) return;
      const stillDc = r.players.find(x => x.name === name && x.disconnected);
      if (!stillDc) return;
      handleLeave(null, r, roomId, false, name);
    }, 10000);
  });
});

function handleLeave(socket, room, roomId, isManual, nameOverride) {
  const name = nameOverride || socket?.data?.name;
  const pIdx = room.players.findIndex(x => x.name === name);
  if (pIdx === -1) return;

  // Nếu chủ phòng thoát, chuyển quyền cho người tiếp theo
  const wasHost = room.hostId === room.players[pIdx].id;

  room.players.splice(pIdx, 1);

  if (room.players.length === 0) { delete rooms[roomId]; return; }

  // Chuyển quyền host nếu cần
  if (wasHost && room.players.length > 0) {
    room.hostId = room.players[0].id;
    io.to(room.players[0].id).emit('you_are_host', {});
  }

  io.to(roomId).emit('player_left', { name });

  if (room.state === 'playing' || room.state === 'paused') {
    if (room.players.length < 2) {
      room.state = 'waiting';
      room.table = null; room.tablePlayer = null;
      room.passedPlayers = new Set();
      room.players.forEach(p => { p.hand = []; p.passed = false; });
      io.to(roomId).emit('game_interrupted', { message: `${name} đã thoát, ván bài bị hủy.` });
    }
  }
  io.to(roomId).emit('room_update', roomInfo(room));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🃏 Tiến lên server chạy tại http://localhost:${PORT}`));
