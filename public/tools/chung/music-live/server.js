const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const https = require('https');
const ytSearch = require('yt-search');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const SUPABASE_URL = 'https://wnioetdrphkdylkoybsu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_p0VSduH3epzQVUdvAf2kPQ_aoWk_l1T';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function logMusicHistory(videoId, title, addedBy) {
    try {
        const { error } = await supabase.from('music_history').insert([{
            video_id: videoId,
            title: title,
            added_by: addedBy,
            played_at: new Date().toISOString()
        }]);
        if (error) {
            console.error('Supabase Error (music_history):', error.message);
        } else {
            console.log('Đã lưu lịch sử bài hát:', title);
        }
    } catch (err) {
        console.error('Supabase Exception:', err.message);
    }
}

const userAvatars = new Map();

async function saveMessageToSupabase(msgObj) {
    if (!supabase) return;
    if (msgObj.role === 'system') return; // Do not save system notifications
    try {
        const payload = {
            id: String(msgObj.id),
            sender_id: msgObj.senderId ? String(msgObj.senderId) : null,
            user_id: msgObj.userId ? String(msgObj.userId) : null,
            name: msgObj.name || null,
            name_color: msgObj.nameColor || null,
            text: msgObj.text || null,
            type: msgObj.type || 'text',
            audio_url: msgObj.audioUrl || null,
            duration: msgObj.duration ? parseFloat(msgObj.duration) : null,
            gif_url: msgObj.gifUrl || null,
            file_url: msgObj.fileUrl || null,
            avatar_url: msgObj.avatarUrl || null,
            role: msgObj.role || 'member',
            reply_to: msgObj.replyTo ? JSON.stringify(msgObj.replyTo) : null,
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('chat_messages').insert([payload]);
        if (error) {
            if (error.message && error.message.includes('user_id')) {
                delete payload.user_id;
                const { error: e2 } = await supabase.from('chat_messages').insert([payload]);
                if (e2 && e2.message && e2.message.includes('avatar_url')) {
                    delete payload.avatar_url;
                    await supabase.from('chat_messages').insert([payload]);
                }
            } else if (error.message && error.message.includes('avatar_url')) {
                delete payload.avatar_url;
                await supabase.from('chat_messages').insert([payload]);
            } else {
                console.error('❌ Supabase Save Chat Error:', error.message, error.details || '');
            }
        } else {
            console.log('✅ Đã lưu tin nhắn vào Supabase:', msgObj.text || msgObj.type);
        }
    } catch (err) {
        console.error('❌ Supabase Save Chat Exception:', err.message);
    }
}

async function getRecentChatHistory() {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) {
            console.error('❌ Supabase Fetch Chat History Error:', error.message);
            return [];
        }
        if (!data) return [];
        return data.reverse().map(m => {
            const cleanMName = (m.name || '').replace(' 😎', '').trim().toLowerCase();
            return {
                id: m.id,
                senderId: m.sender_id,
                userId: m.user_id || '',
                name: m.name,
                nameColor: m.name_color,
                text: m.text,
                type: m.type,
                audioUrl: m.audio_url,
                duration: m.duration,
                gifUrl: m.gif_url,
                fileUrl: m.file_url,
                avatarUrl: m.avatar_url || userAvatars.get(cleanMName) || '',
                role: m.role,
                replyTo: typeof m.reply_to === 'string' ? JSON.parse(m.reply_to) : m.reply_to
            };
        });
    } catch (err) {
        console.error('❌ Supabase Fetch Chat Exception:', err.message);
        return [];
    }
}

async function deleteMessageFromSupabase(msgId) {
    if (!supabase) return;
    try {
        const { error } = await supabase
            .from('chat_messages')
            .delete()
            .eq('id', String(msgId));
        if (error) {
            console.error('❌ Supabase Delete Chat Error:', error.message);
        } else {
            console.log('🗑️ Đã xóa tin nhắn khỏi Supabase, id:', msgId);
        }
    } catch (err) {
        console.error('❌ Supabase Delete Exception:', err.message);
    }
}

async function getUserBackgroundsFromSupabase(username) {
    if (!supabase || !username) return null;
    try {
        const cleanName = String(username).replace(' 😎', '').trim();
        const { data, error } = await supabase
            .from('user_backgrounds')
            .select('*')
            .eq('username', cleanName)
            .maybeSingle();
        if (error) {
            console.error('❌ Supabase Get Backgrounds Error:', error.message);
            return null;
        }
        return data;
    } catch (err) {
        console.error('❌ Supabase Get Backgrounds Exception:', err.message);
        return null;
    }
}

async function saveUserBackgroundsToSupabase(bgObj) {
    if (!supabase || !bgObj.username) return;
    try {
        const cleanName = String(bgObj.username).replace(' 😎', '').trim();
        const { error } = await supabase
            .from('user_backgrounds')
            .upsert([{
                username: cleanName,
                web_bg: bgObj.web_bg || null,
                chat_bg: bgObj.chat_bg || null,
                lyric_bg: bgObj.lyric_bg || null,
                top_tab_type: bgObj.top_tab_type || 'default',
                top_tab_url: bgObj.top_tab_url || null,
                updated_at: new Date().toISOString()
            }], { onConflict: 'username' });
        
        if (error) {
            if (error.message && error.message.includes('top_tab_type')) {
                // Fallback if top_tab_type column does not exist yet in Supabase schema
                await supabase
                    .from('user_backgrounds')
                    .upsert([{
                        username: cleanName,
                        web_bg: bgObj.web_bg || null,
                        chat_bg: bgObj.chat_bg || null,
                        lyric_bg: bgObj.lyric_bg || null,
                        updated_at: new Date().toISOString()
                    }], { onConflict: 'username' });
                console.warn('⚠️ Supabase table `user_backgrounds` chưa có cột `top_tab_type`. Vui lòng chạy SQL migration.');
            } else {
                console.error('❌ Supabase Save Backgrounds Error:', error.message);
            }
        } else {
            console.log('✅ Đã lưu cài đặt giao diện Supabase cho user:', cleanName);
        }
    } catch (err) {
        console.error('❌ Supabase Save Backgrounds Exception:', err.message);
    }
}

// ==========================================
// --- MESSENGER & FRIENDSHIP BACKEND ---
// ==========================================

const memoryFriendships = new Map(); // id -> { id, user_id, friend_id, status, created_at, updated_at }
const memoryDirectMessages = []; // { id, sender_id, receiver_id, text, media_url, media_type, is_read, created_at }
const userSockets = new Map(); // userId -> Set<socket.id>

function isUserOnline(userId) {
    if (!userId) return false;
    return userSockets.has(String(userId)) && userSockets.get(String(userId)).size > 0;
}

function getOnlineUserIds() {
    return Array.from(userSockets.keys());
}

async function getProfileById(userId) {
    if (!userId) return null;
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, display_name, avatar_url, name_color, role, email')
                .eq('id', userId)
                .maybeSingle();
            if (!error && data) {
                let resolvedRole = data.role || 'member';
                for (const [sId, u] of connectedUsers.entries()) {
                    const sock = io ? io.sockets.sockets.get(sId) : null;
                    if (sock && String(sock.userId) === String(userId)) {
                        if (sock.role === 'admin' || u.role === 'admin' || (u.name && u.name.includes('😎'))) {
                            resolvedRole = 'admin';
                        }
                    }
                }
                return {
                    id: data.id,
                    username: data.username || 'Người dùng',
                    displayName: data.display_name || data.username || 'Người dùng',
                    avatarUrl: data.avatar_url || '',
                    nameColor: data.name_color || '#3ea6ff',
                    role: resolvedRole,
                    email: data.email || ''
                };
            }
        } catch (e) { }
    }
    for (const [sId, u] of connectedUsers.entries()) {
        const sock = io ? io.sockets.sockets.get(sId) : null;
        if (sock && String(sock.userId) === String(userId)) {
            const isAdm = (sock.role === 'admin') || (u.role === 'admin') || (u.name && u.name.includes('😎'));
            return {
                id: userId,
                username: u.name ? u.name.replace(' 😎', '') : 'Người dùng',
                displayName: u.name ? u.name.replace(' 😎', '') : 'Người dùng',
                avatarUrl: u.avatarUrl || '',
                nameColor: u.nameColor || '#3ea6ff',
                role: isAdm ? 'admin' : (u.role || 'member'),
                email: ''
            };
        }
    }
    return {
        id: userId,
        username: 'Người dùng',
        displayName: 'Người dùng',
        avatarUrl: '',
        nameColor: '#3ea6ff',
        role: 'member',
        email: ''
    };
}

async function getUserRelationships(userId) {
    const relMap = new Map();
    if (!userId) return relMap;

    let rows = [];
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('friendships')
                .select('*')
                .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
            if (!error && data) {
                rows = data;
            }
        } catch (e) { }
    }

    for (const f of memoryFriendships.values()) {
        if (String(f.user_id) === String(userId) || String(f.friend_id) === String(userId)) {
            if (!rows.some(r => String(r.id) === String(f.id))) {
                rows.push(f);
            }
        }
    }

    rows.forEach(r => {
        const isSender = String(r.user_id) === String(userId);
        const otherId = String(isSender ? r.friend_id : r.user_id);
        if (r.status === 'accepted') {
            relMap.set(otherId, { id: r.id, status: 'friends' });
        } else if (r.status === 'pending') {
            relMap.set(otherId, {
                id: r.id,
                status: isSender ? 'pending_sent' : 'pending_received'
            });
        }
    });

    return relMap;
}

async function searchMessengerUsers(query, currentUserId) {
    const q = (query || '').trim();
    if (!q) return [];
    let list = [];

    if (supabase) {
        try {
            // Try searching with email column first
            let data = null, error = null;
            const result1 = await supabase
                .from('profiles')
                .select('id, username, display_name, avatar_url, name_color, role, email')
                .neq('id', currentUserId)
                .or(`username.ilike.%${q}%,display_name.ilike.%${q}%,email.ilike.%${q}%`)
                .limit(25);
            data = result1.data;
            error = result1.error;

            // If query failed (e.g. email column doesn't exist), retry without email
            if (error) {
                console.warn('searchMessengerUsers: email column query failed, retrying without email:', error.message);
                const result2 = await supabase
                    .from('profiles')
                    .select('id, username, display_name, avatar_url, name_color, role')
                    .neq('id', currentUserId)
                    .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
                    .limit(25);
                data = result2.data;
                error = result2.error;
            }

            if (!error && data) {
                list = data.map(u => ({
                    id: u.id,
                    username: u.username || '',
                    displayName: u.display_name || u.username || 'Người dùng',
                    avatarUrl: u.avatar_url || '',
                    nameColor: u.name_color || '#3ea6ff',
                    role: u.role || 'member',
                    email: u.email || ''
                }));
                // Check if any in list are currently connected as admin
                for (const item of list) {
                    for (const [sId, u] of connectedUsers.entries()) {
                        const sock = io ? io.sockets.sockets.get(sId) : null;
                        if (sock && String(sock.userId) === String(item.id)) {
                            if (sock.role === 'admin' || u.role === 'admin' || (u.name && u.name.includes('😎'))) {
                                item.role = 'admin';
                            }
                        }
                    }
                }
            } else if (error) {
                console.error('searchMessengerUsers Supabase error (both attempts):', error.message);
            }
        } catch (err) {
            console.error('searchMessengerUsers Supabase error:', err.message);
        }
    }

    for (const [sId, u] of connectedUsers.entries()) {
        const sock = io ? io.sockets.sockets.get(sId) : null;
        if (sock && sock.userId && String(sock.userId) !== String(currentUserId)) {
            const clean = (u.name || '').replace(' 😎', '').toLowerCase();
            const isAdm = (sock.role === 'admin') || (u.role === 'admin') || (u.name && u.name.includes('😎'));
            if (clean.includes(q.toLowerCase()) && !list.some(x => String(x.id) === String(sock.userId))) {
                list.push({
                    id: sock.userId,
                    username: clean,
                    displayName: clean,
                    avatarUrl: u.avatarUrl || '',
                    nameColor: u.nameColor || '#3ea6ff',
                    role: isAdm ? 'admin' : (u.role || 'member'),
                    email: ''
                });
            }
        }
    }

    const relationships = await getUserRelationships(currentUserId);
    return list.map(user => {
        const rel = relationships.get(String(user.id)) || { status: 'none' };
        return {
            ...user,
            online: isUserOnline(user.id),
            relationship: rel.status,
            friendshipId: rel.id || null
        };
    });
}

async function getLatestDirectMessage(u1, u2) {
    let latest = null;

    const msgs = memoryDirectMessages.filter(m =>
        (String(m.sender_id) === String(u1) && String(m.receiver_id) === String(u2)) ||
        (String(m.sender_id) === String(u2) && String(m.receiver_id) === String(u1))
    );
    if (msgs.length > 0) {
        const last = msgs[msgs.length - 1];
        latest = {
            id: last.id,
            senderId: last.sender_id,
            receiverId: last.receiver_id,
            text: last.text,
            mediaUrl: last.media_url,
            mediaType: last.media_type,
            isRead: last.is_read,
            createdAt: last.created_at
        };
    }

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('direct_messages')
                .select('*')
                .or(`and(sender_id.eq.${u1},receiver_id.eq.${u2}),and(sender_id.eq.${u2},receiver_id.eq.${u1})`)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            if (!error && data) {
                const sbMsg = {
                    id: data.id,
                    senderId: data.sender_id,
                    receiverId: data.receiver_id,
                    text: data.text,
                    mediaUrl: data.media_url,
                    mediaType: data.media_type,
                    isRead: data.is_read,
                    createdAt: data.created_at
                };
                if (!latest || new Date(sbMsg.createdAt) >= new Date(latest.createdAt)) {
                    latest = sbMsg;
                }
            }
        } catch (e) { }
    }

    return latest;
}

async function getUnreadDirectMessageCount(senderId, receiverId) {
    if (supabase) {
        try {
            const { count, error } = await supabase
                .from('direct_messages')
                .select('*', { count: 'exact', head: true })
                .eq('sender_id', senderId)
                .eq('receiver_id', receiverId)
                .eq('is_read', false);
            if (!error && count !== null) return count;
        } catch (e) { }
    }

    return memoryDirectMessages.filter(m =>
        String(m.sender_id) === String(senderId) &&
        String(m.receiver_id) === String(receiverId) &&
        !m.is_read
    ).length;
}

async function getMessengerOverview(userId) {
    if (!userId) return { friends: [], pendingRequests: [], sentRequests: [], conversations: [], onlineUserIds: getOnlineUserIds() };

    let rows = [];
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('friendships')
                .select('*')
                .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
            if (!error && data) {
                rows = data;
            }
        } catch (e) { }
    }

    for (const f of memoryFriendships.values()) {
        if (String(f.user_id) === String(userId) || String(f.friend_id) === String(userId)) {
            if (!rows.some(r => String(r.id) === String(f.id))) {
                rows.push(f);
            }
        }
    }

    const acceptedFriends = [];
    const pendingRequests = [];
    const sentRequests = [];

    for (const r of rows) {
        const isSender = String(r.user_id) === String(userId);
        const otherId = String(isSender ? r.friend_id : r.user_id);
        const profile = await getProfileById(otherId);

        if (r.status === 'accepted') {
            acceptedFriends.push({
                friendshipId: r.id,
                friend: {
                    ...profile,
                    online: isUserOnline(otherId)
                },
                createdAt: r.created_at
            });
        } else if (r.status === 'pending') {
            if (isSender) {
                sentRequests.push({
                    friendshipId: r.id,
                    receiver: profile,
                    createdAt: r.created_at
                });
            } else {
                pendingRequests.push({
                    friendshipId: r.id,
                    sender: profile,
                    createdAt: r.created_at
                });
            }
        }
    }

    const conversations = [];
    const addedFriendIds = new Set();

    for (const item of acceptedFriends) {
        const friendId = item.friend.id;
        addedFriendIds.add(String(friendId));
        const lastMsg = await getLatestDirectMessage(userId, friendId);
        const unreadCount = await getUnreadDirectMessageCount(friendId, userId);

        conversations.push({
            friend: item.friend,
            lastMessage: lastMsg,
            unreadCount: unreadCount,
            updatedAt: lastMsg ? lastMsg.createdAt : item.createdAt
        });
    }

    const otherUserIds = new Set();
    for (const m of memoryDirectMessages) {
        if (String(m.sender_id) === String(userId) && !addedFriendIds.has(String(m.receiver_id))) {
            otherUserIds.add(String(m.receiver_id));
        } else if (String(m.receiver_id) === String(userId) && !addedFriendIds.has(String(m.sender_id))) {
            otherUserIds.add(String(m.sender_id));
        }
    }

    for (const otherId of otherUserIds) {
        const profile = await getProfileById(otherId);
        const friendObj = {
            ...profile,
            online: isUserOnline(otherId)
        };
        const lastMsg = await getLatestDirectMessage(userId, otherId);
        const unreadCount = await getUnreadDirectMessageCount(otherId, userId);
        conversations.push({
            friend: friendObj,
            lastMessage: lastMsg,
            unreadCount: unreadCount,
            updatedAt: lastMsg ? lastMsg.createdAt : new Date().toISOString()
        });
    }

    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return {
        friends: acceptedFriends.map(f => f.friend),
        pendingRequests,
        sentRequests,
        conversations,
        onlineUserIds: getOnlineUserIds()
    };
}

async function sendFriendRequestDb(senderId, targetUserId) {
    if (!senderId || !targetUserId || String(senderId) === String(targetUserId)) {
        return { success: false, error: 'Không thể kết bạn với chính mình' };
    }

    const existing = await getUserRelationships(senderId);
    const rel = existing.get(String(targetUserId));
    if (rel) {
        if (rel.status === 'friends') return { success: false, error: 'Hai bạn đã là bạn bè' };
        if (rel.status === 'pending_sent') return { success: false, error: 'Bạn đã gửi lời mời kết bạn rồi' };
        if (rel.status === 'pending_received') {
            return await respondFriendRequestDb(rel.id, 'accept', senderId);
        }
    }

    const row = {
        id: 'fr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        user_id: senderId,
        friend_id: targetUserId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    memoryFriendships.set(row.id, row);

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('friendships')
                .insert([{
                    user_id: senderId,
                    friend_id: targetUserId,
                    status: 'pending',
                    created_at: row.created_at,
                    updated_at: row.updated_at
                }])
                .select()
                .maybeSingle();
            if (!error && data) {
                row.id = data.id;
                memoryFriendships.set(String(data.id), data);
            }
        } catch (err) {
            console.error('sendFriendRequestDb Supabase insert error:', err.message);
        }
    }

    const senderProfile = await getProfileById(senderId);
    return { success: true, friendship: row, sender: senderProfile };
}

async function respondFriendRequestDb(friendshipId, action, userId) {
    let friendship = null;

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('friendships')
                .select('*')
                .eq('id', friendshipId)
                .maybeSingle();
            if (!error && data) friendship = data;
        } catch (e) { }
    }

    if (!friendship && memoryFriendships.has(String(friendshipId))) {
        friendship = memoryFriendships.get(String(friendshipId));
    }

    if (!friendship) {
        return { success: false, error: 'Không tìm thấy lời mời kết bạn' };
    }

    if (action === 'accept') {
        const updatedAt = new Date().toISOString();
        if (supabase) {
            try {
                await supabase
                    .from('friendships')
                    .update({ status: 'accepted', updated_at: updatedAt })
                    .eq('id', friendship.id);
            } catch (e) { }
        }
        friendship.status = 'accepted';
        friendship.updated_at = updatedAt;
        memoryFriendships.set(String(friendship.id), friendship);

        const user1Profile = await getProfileById(friendship.user_id);
        const user2Profile = await getProfileById(friendship.friend_id);

        return {
            success: true,
            action: 'accept',
            friendship,
            user1: user1Profile,
            user2: user2Profile
        };
    } else {
        if (supabase) {
            try {
                await supabase
                    .from('friendships')
                    .delete()
                    .eq('id', friendship.id);
            } catch (e) { }
        }
        memoryFriendships.delete(String(friendship.id));
        return {
            success: true,
            action: 'decline',
            friendship
        };
    }
}

async function unfriendDb(userId, friendId) {
    if (!userId || !friendId) return { success: false, error: 'Dữ liệu không hợp lệ' };

    if (supabase) {
        try {
            await supabase
                .from('friendships')
                .delete()
                .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);
        } catch (e) { }
    }

    for (const [id, f] of memoryFriendships.entries()) {
        if ((String(f.user_id) === String(userId) && String(f.friend_id) === String(friendId)) ||
            (String(f.user_id) === String(friendId) && String(f.friend_id) === String(userId))) {
            memoryFriendships.delete(id);
        }
    }

    return { success: true, userId, friendId };
}

async function saveDirectMessageDb(senderId, receiverId, text, mediaUrl, mediaType) {
    const row = {
        id: 'dm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
        sender_id: senderId,
        receiver_id: receiverId,
        text: text || '',
        media_url: mediaUrl || null,
        media_type: mediaType || 'text',
        is_read: false,
        created_at: new Date().toISOString()
    };

    memoryDirectMessages.push(row);

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('direct_messages')
                .insert([{
                    sender_id: senderId,
                    receiver_id: receiverId,
                    text: row.text,
                    media_url: row.media_url,
                    media_type: row.media_type,
                    is_read: false,
                    created_at: row.created_at
                }])
                .select()
                .maybeSingle();
            if (!error && data) {
                row.id = data.id;
            }
        } catch (err) {
            console.error('saveDirectMessageDb Supabase error:', err.message);
        }
    }

    return {
        id: row.id,
        senderId: row.sender_id,
        receiverId: row.receiver_id,
        text: row.text,
        mediaUrl: row.media_url,
        mediaType: row.media_type,
        isRead: row.is_read,
        createdAt: row.created_at
    };
}

async function getDirectMessagesDb(userId1, userId2, limit = 60) {
    const map = new Map();

    const memMsgs = memoryDirectMessages.filter(m =>
        (String(m.sender_id) === String(userId1) && String(m.receiver_id) === String(userId2)) ||
        (String(m.sender_id) === String(userId2) && String(m.receiver_id) === String(userId1))
    );
    for (const m of memMsgs) {
        map.set(String(m.id), {
            id: m.id,
            senderId: m.sender_id,
            receiverId: m.receiver_id,
            text: m.text,
            mediaUrl: m.media_url,
            mediaType: m.media_type,
            isRead: m.is_read,
            createdAt: m.created_at
        });
    }

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('direct_messages')
                .select('*')
                .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
                .order('created_at', { ascending: false })
                .limit(limit);
            if (!error && Array.isArray(data)) {
                for (const m of data) {
                    if (map.has(String(m.id))) {
                        map.set(String(m.id), {
                            id: m.id,
                            senderId: m.sender_id,
                            receiverId: m.receiver_id,
                            text: m.text,
                            mediaUrl: m.media_url,
                            mediaType: m.media_type,
                            isRead: m.is_read,
                            createdAt: m.created_at
                        });
                    } else {
                        let foundKey = null;
                        for (const [k, v] of map.entries()) {
                            if (String(v.senderId) === String(m.sender_id) &&
                                String(v.receiverId) === String(m.receiver_id) &&
                                v.text === m.text &&
                                Math.abs(new Date(v.createdAt) - new Date(m.created_at)) < 2000) {
                                foundKey = k;
                                break;
                            }
                        }
                        if (foundKey) {
                            map.delete(foundKey);
                        }
                        map.set(String(m.id), {
                            id: m.id,
                            senderId: m.sender_id,
                            receiverId: m.receiver_id,
                            text: m.text,
                            mediaUrl: m.media_url,
                            mediaType: m.media_type,
                            isRead: m.is_read,
                            createdAt: m.created_at
                        });
                    }
                }
            }
        } catch (e) { }
    }

    const all = Array.from(map.values());
    all.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return all.slice(-limit);
}

async function markDirectMessagesReadDb(userId, friendId) {
    if (supabase) {
        try {
            await supabase
                .from('direct_messages')
                .update({ is_read: true })
                .eq('sender_id', friendId)
                .eq('receiver_id', userId)
                .eq('is_read', false);
        } catch (e) { }
    }

    memoryDirectMessages.forEach(m => {
        if (String(m.sender_id) === String(friendId) && String(m.receiver_id) === String(userId)) {
            m.is_read = true;
        }
    });

    return { success: true };
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 50 * 1024 * 1024
});

app.use(express.static('public'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

let playlist = [];
let currentVideoId = '';
let currentVideoTitle = 'Chưa có bài hát nào';
let pinnedMessage = null;
let loopMode = false;
let isPlayerIdle = true;
let lastGlobalVideoEndedTime = 0;


let connectedUsers = new Map();
let typingUsers = new Map(); // socket.id -> { id, name, nameColor, timer }

function broadcastTypingUsers() {
    const list = Array.from(typingUsers.values()).map(u => ({
        id: u.id,
        name: u.name,
        nameColor: u.nameColor
    }));
    io.emit('typingUsersUpdate', list);
}

let drawGame = {
    active: false, state: 'inactive', drawerId: null, drawerName: '',
    word: '', scores: {}, timeLeft: 90, timer: null,
    guessedPlayers: [], canvasHistory: []
};

let caroGame = {
    board: Array(15).fill(null).map(() => Array(15).fill(null)),
    playerX: null, playerO: null,
    playerXName: '', playerOName: '',
    turn: 'X', winner: null
};

let chessGame = {
    playerW: null, playerB: null, playerWName: '', playerBName: '',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', turn: 'w', winner: null
};

// --- XIANGQI STATE & RULES ---
function initXiangqiBoard() {
    const b = Array(10).fill(null).map(() => Array(9).fill(null));
    b[0] = ['b_r', 'b_h', 'b_e', 'b_a', 'b_k', 'b_a', 'b_e', 'b_h', 'b_r'];
    b[2][1] = 'b_c'; b[2][7] = 'b_c';
    b[3][0] = 'b_p'; b[3][2] = 'b_p'; b[3][4] = 'b_p'; b[3][6] = 'b_p'; b[3][8] = 'b_p';
    b[9] = ['r_r', 'r_h', 'r_e', 'r_a', 'r_k', 'r_a', 'r_e', 'r_h', 'r_r'];
    b[7][1] = 'r_c'; b[7][7] = 'r_c';
    b[6][0] = 'r_p'; b[6][2] = 'r_p'; b[6][4] = 'r_p'; b[6][6] = 'r_p'; b[6][8] = 'r_p';
    return b;
}

function checkFlyingGeneral(board) {
    let r_k, b_k;
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 'r_k') r_k = { r, c };
            if (board[r][c] === 'b_k') b_k = { r, c };
        }
    }
    if (r_k && b_k && r_k.c === b_k.c) {
        let count = 0;
        for (let r = b_k.r + 1; r < r_k.r; r++) {
            if (board[r][r_k.c]) count++;
        }
        if (count === 0) return true; // invalid state
    }
    return false;
}

function isValidXiangqiMove(board, piece, from, to) {
    const isRed = piece.startsWith('r_');
    const type = piece.split('_')[1];

    const dr = to.r - from.r;
    const dc = to.c - from.c;
    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    if (dr === 0 && dc === 0) return false;

    const targetPiece = board[to.r][to.c];
    if (targetPiece && targetPiece.startsWith(isRed ? 'r_' : 'b_')) return false;

    const countPiecesBetween = () => {
        if (dr !== 0 && dc !== 0) return -1;
        let count = 0;
        if (dr === 0) {
            const minC = Math.min(from.c, to.c) + 1;
            const maxC = Math.max(from.c, to.c) - 1;
            for (let c = minC; c <= maxC; c++) if (board[from.r][c]) count++;
        } else {
            const minR = Math.min(from.r, to.r) + 1;
            const maxR = Math.max(from.r, to.r) - 1;
            for (let r = minR; r <= maxR; r++) if (board[r][from.c]) count++;
        }
        return count;
    };

    const isRedPalace = (r, c) => r >= 7 && r <= 9 && c >= 3 && c <= 5;
    const isBlackPalace = (r, c) => r >= 0 && r <= 2 && c >= 3 && c <= 5;

    switch (type) {
        case 'p':
            if (isRed) {
                if (from.r >= 5) return dr === -1 && dc === 0;
                return (dr === -1 && dc === 0) || (dr === 0 && absDc === 1);
            } else {
                if (from.r <= 4) return dr === 1 && dc === 0;
                return (dr === 1 && dc === 0) || (dr === 0 && absDc === 1);
            }
        case 'c':
            const cBetween = countPiecesBetween();
            if (cBetween === -1) return false;
            return targetPiece ? cBetween === 1 : cBetween === 0;
        case 'r':
            return countPiecesBetween() === 0;
        case 'h':
            if (absDr === 2 && absDc === 1) return !board[from.r + (dr > 0 ? 1 : -1)][from.c];
            if (absDr === 1 && absDc === 2) return !board[from.r][from.c + (dc > 0 ? 1 : -1)];
            return false;
        case 'e':
            if (absDr !== 2 || absDc !== 2) return false;
            if (isRed && to.r <= 4) return false;
            if (!isRed && to.r >= 5) return false;
            return !board[from.r + dr / 2][from.c + dc / 2];
        case 'a':
            if (absDr !== 1 || absDc !== 1) return false;
            return isRed ? isRedPalace(to.r, to.c) : isBlackPalace(to.r, to.c);
        case 'k':
            if (absDr + absDc !== 1) return false;
            return isRed ? isRedPalace(to.r, to.c) : isBlackPalace(to.r, to.c);
    }
    return false;
}

let xiangqiGame = {
    playerR: null, playerB: null, playerRName: '', playerBName: '',
    board: initXiangqiBoard(), turn: 'R', winner: null
};

// --- UNO STATE ---
let unoGame = {
    players: [], deck: [], discardPile: [], turnIndex: 0, direction: 1,
    active: false, currentColor: '', winner: null
};
let unoHands = {}; // socket.id -> array of cards

function initUnoDeck() {
    let deck = [];
    for (const color of ['red', 'green', 'blue', 'yellow']) {
        deck.push({ color, value: '0' });
        for (let i = 1; i <= 9; i++) { deck.push({ color, value: i.toString() }); deck.push({ color, value: i.toString() }); }
        deck.push({ color, value: 'skip' }); deck.push({ color, value: 'skip' });
        deck.push({ color, value: 'reverse' }); deck.push({ color, value: 'reverse' });
        deck.push({ color, value: '+2' }); deck.push({ color, value: '+2' });
    }
    for (let i = 0; i < 4; i++) deck.push({ color: 'black', value: 'wild' });
    return deck.sort(() => Math.random() - 0.5);
}
function nextUnoTurn() {
    unoGame.turnIndex += unoGame.direction;
    if (unoGame.turnIndex >= unoGame.players.length) unoGame.turnIndex = 0;
    if (unoGame.turnIndex < 0) unoGame.turnIndex = unoGame.players.length - 1;
}
function drawCardsForPlayer(id, count) {
    const p = unoGame.players.find(x => x.id === id);
    if (!p) return;
    for (let i = 0; i < count; i++) {
        if (unoGame.deck.length === 0 && unoGame.discardPile.length > 1) {
            const topCard = unoGame.discardPile.pop();
            unoGame.deck = unoGame.discardPile.sort(() => Math.random() - 0.5);
            unoGame.discardPile = [topCard];
        }
        if (unoGame.deck.length > 0) {
            unoHands[id].push(unoGame.deck.shift());
            p.handCount++;
        }
    }
}
function getPublicUnoState() {
    return {
        players: unoGame.players, turnIndex: unoGame.turnIndex, currentColor: unoGame.currentColor,
        topDiscard: unoGame.discardPile.length ? unoGame.discardPile[unoGame.discardPile.length - 1] : null,
        active: unoGame.active, winner: unoGame.winner, deckCount: unoGame.deck.length
    };
}

// --- PICTURE QUIZ (GAME ĐOÁN TỪ THEO HÌNH) STORAGE & HELPERS ---
const DATA_DIR = path.join(__dirname, 'data');
const QUIZ_FILE = path.join(DATA_DIR, 'picture_quiz_packs.json');

const DEFAULT_QUIZ_PACKS = [
    {
        id: 'co-cac-nuoc',
        name: 'Bộ câu hỏi Cờ Các Nước 🚩',
        description: 'Đoán tên quốc gia dựa trên hình ảnh lá cờ.',
        items: [
            { id: 'flag-1', name: 'Cờ Việt Nam', imageUrl: 'https://flagcdn.com/w640/vn.png' },
            { id: 'flag-2', name: 'Cờ Nhật Bản', imageUrl: 'https://flagcdn.com/w640/jp.png' },
            { id: 'flag-3', name: 'Cờ Hàn Quốc', imageUrl: 'https://flagcdn.com/w640/kr.png' },
            { id: 'flag-4', name: 'Cờ Mỹ', imageUrl: 'https://flagcdn.com/w640/us.png' },
            { id: 'flag-5', name: 'Cờ Pháp', imageUrl: 'https://flagcdn.com/w640/fr.png' }
        ]
    },
    {
        id: 'dong-vat',
        name: 'Bộ câu hỏi Động Vật 🦁',
        description: 'Đoán tên các loài động vật qua hình ảnh.',
        items: [
            { id: 'animal-1', name: 'Con Mèo', imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80' },
            { id: 'animal-2', name: 'Con Chó', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80' },
            { id: 'animal-3', name: 'Sư Tử', imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&q=80' },
            { id: 'animal-4', name: 'Chim Cánh Cụt', imageUrl: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=600&q=80' }
        ]
    }
];

function isQuizPackComplete(pack) {
    if (!pack || !Array.isArray(pack.items)) return false;
    const validItems = pack.items.filter(item => item && item.name && item.name.trim() !== '' && item.imageUrl && item.imageUrl.trim() !== '');
    return validItems.length >= 4;
}

// --- Supabase-backed Quiz Pack Persistence ---
let cachedQuizPacks = null;

async function loadQuizPacksFromSupabase() {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from('picture_quiz_packs')
            .select('*')
            .order('created_at', { ascending: true });
        if (error) {
            console.error('❌ Supabase Load Quiz Packs Error:', error.message);
            return null;
        }
        if (!data || data.length === 0) return null;
        return data.map(row => ({
            id: row.id,
            name: row.name || '',
            description: row.description || '',
            items: (typeof row.items === 'string' ? JSON.parse(row.items) : row.items) || []
        }));
    } catch (err) {
        console.error('❌ Supabase Load Quiz Packs Exception:', err.message);
        return null;
    }
}

async function saveQuizPacksToSupabase(packs) {
    if (!supabase) return;
    try {
        // Delete all existing packs then re-insert
        await supabase.from('picture_quiz_packs').delete().neq('id', '___never___');
        if (packs.length > 0) {
            const rows = packs.map(p => ({
                id: p.id,
                name: (p.name || '').trim(),
                description: (p.description || '').trim(),
                items: JSON.stringify(p.items || []),
                updated_at: new Date().toISOString()
            }));
            const { error } = await supabase.from('picture_quiz_packs').upsert(rows, { onConflict: 'id' });
            if (error) {
                console.error('❌ Supabase Save Quiz Packs Error:', error.message);
            } else {
                console.log('✅ Đã lưu', packs.length, 'bộ câu hỏi lên Supabase.');
            }
        }
    } catch (err) {
        console.error('❌ Supabase Save Quiz Packs Exception:', err.message);
    }
}

function loadQuizPacksFromFile() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(QUIZ_FILE)) {
            fs.writeFileSync(QUIZ_FILE, JSON.stringify(DEFAULT_QUIZ_PACKS, null, 2), 'utf8');
            return DEFAULT_QUIZ_PACKS;
        }
        const raw = fs.readFileSync(QUIZ_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
    } catch (err) {
        console.error('Lỗi khi đọc picture_quiz_packs.json:', err.message);
    }
    return DEFAULT_QUIZ_PACKS;
}

function saveQuizPacksToFile(packs) {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(QUIZ_FILE, JSON.stringify(packs, null, 2), 'utf8');
    } catch (err) {
        console.error('Lỗi khi ghi picture_quiz_packs.json:', err.message);
    }
}

function loadQuizPacks() {
    if (cachedQuizPacks) {
        return cachedQuizPacks.map(p => ({ ...p, isComplete: isQuizPackComplete(p) }));
    }
    const filePacks = loadQuizPacksFromFile();
    cachedQuizPacks = filePacks;
    return filePacks.map(p => ({ ...p, isComplete: isQuizPackComplete(p) }));
}

function saveQuizPacks(packs) {
    const cleanedPacks = packs.map(p => {
        const items = (p.items || []).map(it => ({
            id: it.id || 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            name: (it.name || '').trim(),
            imageUrl: (it.imageUrl || '').trim()
        }));
        return {
            id: p.id || 'pack-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            name: (p.name || 'Bộ câu hỏi mới').trim(),
            description: (p.description || '').trim(),
            items: items
        };
    });
    cachedQuizPacks = cleanedPacks;
    saveQuizPacksToFile(cleanedPacks);
    saveQuizPacksToSupabase(cleanedPacks);
    return cleanedPacks.map(p => ({ ...p, isComplete: isQuizPackComplete(p) }));
}

// On startup: try Supabase first, fallback to local file
(async function initQuizPacks() {
    const supabasePacks = await loadQuizPacksFromSupabase();
    if (supabasePacks && supabasePacks.length > 0) {
        cachedQuizPacks = supabasePacks;
        saveQuizPacksToFile(supabasePacks);
        console.log('✅ Đã tải', supabasePacks.length, 'bộ câu hỏi từ Supabase.');
    } else {
        const filePacks = loadQuizPacksFromFile();
        cachedQuizPacks = filePacks;
        // Sync defaults to Supabase if empty
        saveQuizPacksToSupabase(filePacks);
        console.log('📂 Đã tải', filePacks.length, 'bộ câu hỏi từ file local (đồng bộ lên Supabase).');
    }
})();

function generateQuestionsForPack(pack, allPacks) {
    if (!pack || !Array.isArray(pack.items)) return [];
    const validItems = pack.items.filter(it => it.name && it.name.trim() && it.imageUrl && it.imageUrl.trim());
    if (validItems.length < 4) return [];

    const allItemNames = [];
    (allPacks || []).forEach(p => {
        (p.items || []).forEach(it => {
            if (it.name && it.name.trim()) allItemNames.push(it.name.trim());
        });
    });

    return validItems.map(targetItem => {
        const correct = targetItem.name.trim();
        let pool = validItems.map(it => it.name.trim()).filter(n => n !== correct);
        if (pool.length < 3) {
            const extra = allItemNames.filter(n => n !== correct && !pool.includes(n));
            pool = pool.concat(extra);
        }
        pool = pool.sort(() => Math.random() - 0.5);
        const distractors = pool.slice(0, 3);
        const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
        const correctOptionIndex = options.indexOf(correct);

        return {
            id: targetItem.id,
            imageUrl: targetItem.imageUrl,
            correctAnswer: correct,
            correctOptionIndex: correctOptionIndex,
            options: options
        };
    });
}

// --- MULTIPLAYER QUIZ ROOM SERVER ENGINE (SHARED GLOBAL STATE) ---
let quizRoomState = {
    active: false,
    hostId: null,
    hostName: '',
    hostToken: null,
    packId: null,
    packName: '',
    questions: [],
    currentIndex: 0,
    gameSessionId: null,
    state: 'lobby', // 'lobby' | 'question' | 'reveal' | 'finished'
    timerSeconds: 15,
    timeLeft: 15,
    questionStartTime: 0,
    answers: {}, // { [userKey]: { optionIndex, isCorrect, scoreAdded, timeTaken } }
    optionCounts: [0, 0, 0, 0],
    players: {} // { [userKey]: { id, name, color, score, correctCount } }
};
let quizRoomTimer = null;
let quizRevealTimeout = null;

function clearQuizTimers() {
    if (quizRoomTimer) {
        clearInterval(quizRoomTimer);
        quizRoomTimer = null;
    }
    if (quizRevealTimeout) {
        clearTimeout(quizRevealTimeout);
        quizRevealTimeout = null;
    }
}

function getQuizUserKey(socket) {
    if (socket && socket.username && socket.username.trim()) {
        return socket.username.replace(/😎/g, '').trim().toLowerCase();
    }
    return socket ? socket.id : 'unknown';
}

function getPublicQuizState() {
    const currentQ = quizRoomState.questions[quizRoomState.currentIndex];
    const leaderboard = Object.values(quizRoomState.players)
        .sort((a, b) => b.score - a.score);
    return {
        active: quizRoomState.active,
        hostId: quizRoomState.hostId,
        hostName: quizRoomState.hostName,
        packId: quizRoomState.packId,
        packName: quizRoomState.packName,
        gameSessionId: quizRoomState.gameSessionId,
        totalQuestions: quizRoomState.questions.length,
        currentIndex: quizRoomState.currentIndex,
        state: quizRoomState.state,
        timeLeft: quizRoomState.timeLeft,
        timerSeconds: quizRoomState.timerSeconds,
        question: currentQ ? {
            id: currentQ.id,
            imageUrl: currentQ.imageUrl,
            options: currentQ.options,
            correctOptionIndex: (quizRoomState.state === 'reveal' || quizRoomState.state === 'finished')
                ? currentQ.options.indexOf(currentQ.correctAnswer)
                : null,
            correctAnswer: (quizRoomState.state === 'reveal' || quizRoomState.state === 'finished')
                ? currentQ.correctAnswer
                : null
        } : null,
        answeredCount: Object.keys(quizRoomState.answers).length,
        totalPlayersCount: Math.max(io.engine ? io.engine.clientsCount : 1, connectedUsers.size, Object.keys(quizRoomState.players).length, 1),
        optionCounts: (quizRoomState.state === 'reveal' || quizRoomState.state === 'finished')
            ? quizRoomState.optionCounts
            : [0, 0, 0, 0],
        leaderboard: leaderboard
    };
}

function startQuizQuestionTimer() {
    clearQuizTimers();
    quizRoomState.answers = {};
    quizRoomState.optionCounts = [0, 0, 0, 0];
    quizRoomState.state = 'question';
    quizRoomState.timeLeft = quizRoomState.timerSeconds;
    quizRoomState.questionStartTime = Date.now();

    // Ensure all connected sockets are registered in players map
    connectedUsers.forEach((user, sid) => {
        const key = (user.name && user.name.trim()) ? user.name.replace(/😎/g, '').trim().toLowerCase() : sid;
        if (!quizRoomState.players[key]) {
            quizRoomState.players[key] = {
                id: sid,
                name: user.name || 'Người chơi',
                color: user.nameColor || '#ff75a0',
                score: 0,
                correctCount: 0
            };
        } else {
            quizRoomState.players[key].id = sid;
            if (user.name) quizRoomState.players[key].name = user.name;
            if (user.nameColor) quizRoomState.players[key].color = user.nameColor;
        }
    });

    io.emit('quizRoomUpdate', getPublicQuizState());

    quizRoomTimer = setInterval(() => {
        quizRoomState.timeLeft--;
        if (quizRoomState.timeLeft <= 0) {
            clearQuizTimers();
            revealQuizQuestionResult();
        } else {
            const totalP = Math.max(io.engine ? io.engine.clientsCount : 1, connectedUsers.size, Object.keys(quizRoomState.players).length, 1);
            const answeredP = Object.keys(quizRoomState.answers).length;
            io.emit('quizRoomTimerTick', {
                timeLeft: quizRoomState.timeLeft,
                answeredCount: answeredP,
                totalPlayersCount: totalP
            });
        }
    }, 1000);
}

function revealQuizQuestionResult() {
    clearQuizTimers();
    quizRoomState.state = 'reveal';
    io.emit('quizRoomUpdate', getPublicQuizState());

    // Wait 5 seconds on reveal screen, then move to next question or end
    quizRevealTimeout = setTimeout(() => {
        quizRevealTimeout = null;
        if (!quizRoomState.active) return;
        if (quizRoomState.currentIndex + 1 < quizRoomState.questions.length) {
            quizRoomState.currentIndex++;
            startQuizQuestionTimer();
        } else {
            quizRoomState.state = 'finished';
            io.emit('quizRoomUpdate', getPublicQuizState());
            io.emit('newMessage', {
                id: 'sys-' + Date.now(),
                name: 'Đoán Hình 🧩',
                text: `🏆 Trò chơi Đoán Hình đã kết thúc! Tới bảng xếp hạng tổng để xem quán quân!`,
                role: 'system'
            });
        }
    }, 5000);
}

function checkCaroWinner(row, col, player) {
    const board = caroGame.board;
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let [dr, dc] of dirs) {
        let count = 1;
        for (let i = 1; i <= 4; i++) {
            const r = row + dr * i, c = col + dc * i;
            if (r < 0 || r >= 15 || c < 0 || c >= 15 || board[r][c] !== player) break;
            count++;
        }
        for (let i = 1; i <= 4; i++) {
            const r = row - dr * i, c = col - dc * i;
            if (r < 0 || r >= 15 || c < 0 || c >= 15 || board[r][c] !== player) break;
            count++;
        }
        if (count >= 5) return true;
    }
    return false;
}
const DRAW_WORDS = [
    'con mèo', 'con chó', 'ngôi nhà', 'cái cây', 'mặt trời', 'mặt trăng', 'con cá', 'bông hoa',
    'xe đạp', 'ô tô', 'máy bay', 'con bướm', 'quả táo', 'cái bàn', 'cái ghế', 'con gà', 'con voi',
    'con rắn', 'cầu vồng', 'ngôi sao', 'trái tim', 'con ong', 'pizza', 'kem', 'guitar', 'điện thoại',
    'cái kéo', 'con nhện', 'người tuyết', 'tên lửa', 'cây dừa', 'quả dưa hấu', 'con khỉ', 'con thỏ',
    'con rùa', 'cái ô', 'đồng hồ', 'cái nón', 'đôi giày', 'con mắt', 'bàn tay', 'ngọn núi',
    'con sông', 'cái cầu', 'chiếc thuyền', 'xe buýt', 'xe lửa', 'robot', 'khủng long', 'siêu nhân',
    'cái ly', 'cái chìa khóa', 'bóng đèn', 'cái quạt', 'cây bút', 'cuốn sách', 'cái bánh', 'con ếch',
    'con cua', 'con sứa', 'cá heo', 'chim cánh cụt', 'con gấu', 'hoa hướng dương', 'cây nấm', 'quả chuối'
];
function getRandomWord() { return DRAW_WORDS[Math.floor(Math.random() * DRAW_WORDS.length)]; }
function generateHint(word) {
    return word.split(' ').map(w => w.split('').map(() => '_').join(' ')).join('   ');
}
function getDrawUserList() {
    const users = [];
    connectedUsers.forEach((u, id) => users.push({ id, name: u.name, nameColor: u.nameColor, avatarUrl: u.avatarUrl || '' }));
    return users;
}
function endDrawRound() {
    if (drawGame.timer) { clearInterval(drawGame.timer); drawGame.timer = null; }
    drawGame.state = 'waiting';
    io.emit('drawRoundEnd', { word: drawGame.word, scores: drawGame.scores });
    setTimeout(() => {
        if (drawGame.active) io.emit('drawWaitingForDrawer', { users: getDrawUserList(), scores: drawGame.scores });
    }, 3000);
}

// Mẹ mày tính ăn cắp pass của tao à?
const ADMIN_PASSWORD = 'Dat-la.ai?123';

function getYoutubeInfo(videoId) {
    return new Promise((resolve) => {
        https.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ id: videoId, title: parsed.title, thumbnail: parsed.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` });
                } catch {
                    resolve({ id: videoId, title: 'Video ' + videoId, thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` });
                }
            });
        }).on('error', () => resolve({ id: videoId, title: 'Video ' + videoId, thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }));
    });
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

async function quickWebSearch(query) {
    try {
        const currentYear = new Date().getFullYear();
        const lowerQuery = query.toLowerCase();

        const needsYear = lowerQuery.includes('mới') || lowerQuery.includes('gần đây') || lowerQuery.includes('hiện tại');
        const searchQuery = (!query.includes(currentYear.toString()) && needsYear) ? query + ' ' + currentYear : query;

        const res = await fetch('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(searchQuery), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const html = await res.text();
        const regex = /<a class="result__snippet[^>]*>(.*?)<\/a>/gs;
        let match;
        let results = [];
        let count = 0;
        while ((match = regex.exec(html)) !== null && count < 4) {
            results.push("- " + match[1].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<'));
            count++;
        }
        return results.join('\n');
    } catch (e) {
        return '';
    }
}

async function callGroqAI(query, userName) {
    try {

        const webContext = await quickWebSearch(query);
        const currentDate = new Date().toLocaleDateString('vi-VN');
        const sysPrompt = `Bạn là trợ lý AI âm nhạc siêu việt. Hôm nay: ${currentDate}. Người hỏi: ${userName}.
Nhiệm vụ: Trả lời ngắn gọn, thân thiện (dưới 100 từ).
Luật lệ:
1. Nếu yêu cầu gợi ý bài hát của ca sĩ/chủ đề: PHẢI liệt kê những bài hát HAY NHẤT, HOT NHẤT và NỔI TIẾNG NHẤT của họ.
2. Tuyệt đối KHÔNG BỊA TÊN bài hát. Phải khớp đúng 100% tên bài hát với ca sĩ ngoài đời thực.
3. Nếu là tin tức mới, dùng "Kết quả web". Nếu gợi ý nhạc, cứ tự tin dùng kiến thức nội bộ để chọn bài hay nhất, không bị phụ thuộc vào web nếu web trả về kết quả rác.

Kết quả tìm kiếm web:
${webContext}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: sysPrompt },
                    { role: 'user', content: query }
                ],
                max_tokens: 1024,
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            let aiMsg = data.choices[0].message.content;
            if (!aiMsg || aiMsg.trim() === '') {
                aiMsg = '*(AI đã suy nghĩ quá lâu và quên mất câu trả lời)* 😅';
            }

            io.emit('newMessage', {
                id: 'ai-' + Date.now(),
                senderId: 'ai-bot',
                name: 'AI Assistant 🤖',
                nameColor: '#10a37f',
                text: aiMsg,
                role: 'system'
            });
        } else {
            console.error('Groq AI Error:', data);
            io.emit('newMessage', {
                id: 'ai-err-' + Date.now(),
                senderId: 'ai-bot',
                name: 'AI Assistant 🤖',
                nameColor: '#ff6b6b',
                text: 'Xin lỗi, AI đang gặp lỗi hoặc tên model không hỗ trợ! (' + (data.error?.message || 'Lỗi không xác định') + ')',
                role: 'system'
            });
        }
    } catch (err) {
        console.error('Groq API catch error:', err);
    }
}

io.on('connection', (socket) => {
    console.log('🔌 Một kết nối mới: ' + socket.id);
    io.emit('viewersUpdate', io.engine.clientsCount);

    socket.on('joinRoom', async (data) => {
        const { name, isAdmin, password, nameColor, userId, role: clientRole } = data || {};
        let username = (name || '').trim() || 'Người dùng';
        let resolvedDisplayName = '';
        let resolvedRole = 'member';
        let resolvedColor = nameColor || '#3ea6ff';
        let resolvedAvatar = '';
        socket.userId = userId || null;
        if (socket.userId) {
            socket.join('user:' + socket.userId);
            if (!userSockets.has(String(socket.userId))) {
                userSockets.set(String(socket.userId), new Set());
            }
            userSockets.get(String(socket.userId)).add(socket.id);
            io.emit('messenger:userOnline', { userId: socket.userId, online: true });
        }
        const chatHistory = await getRecentChatHistory();

        // Check Supabase profiles table if userId is provided
        if (userId) {
            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('role, username, display_name, name_color, avatar_url')
                    .eq('id', userId)
                    .maybeSingle();

                if (profile) {
                    if (profile.role) resolvedRole = profile.role.toLowerCase().trim();
                    if (profile.display_name && profile.display_name.trim()) resolvedDisplayName = profile.display_name.trim();
                    if (profile.username && profile.username.trim()) username = profile.username.trim();
                    if (profile.name_color) resolvedColor = profile.name_color;
                    if (profile.avatar_url) resolvedAvatar = profile.avatar_url;
                }
            } catch (err) {
                console.error('Supabase profile query error in joinRoom:', err.message);
            }
        }

        // Support password fallback for admin
        if (isAdmin || clientRole === 'admin') {
            if (password === ADMIN_PASSWORD || password === '16082009' || /^[0-9]{8}$/.test(password)) {
                resolvedRole = 'admin';
            }
        }

        const isUserAdmin = (resolvedRole === 'admin');
        const chosenName = resolvedDisplayName || username;

        if (isUserAdmin) {
            socket.username = chosenName.includes('😎') ? chosenName : (chosenName + ' 😎');
            socket.role = 'admin';
            socket.nameColor = resolvedColor || '#fbbc04';
            socket.avatarUrl = resolvedAvatar;
            userAvatars.set(username.toLowerCase(), resolvedAvatar);
            if (resolvedDisplayName) userAvatars.set(resolvedDisplayName.toLowerCase(), resolvedAvatar);
            connectedUsers.set(socket.id, { id: socket.id, name: socket.username, role: 'admin', nameColor: socket.nameColor, avatarUrl: socket.avatarUrl });
            if (quizRoomState.active) {
                const uKey = getQuizUserKey(socket);
                quizRoomState.players[uKey] = {
                    id: socket.id,
                    name: socket.username,
                    color: socket.nameColor || '#ff75a0',
                    score: (quizRoomState.players[uKey] ? quizRoomState.players[uKey].score : 0),
                    correctCount: (quizRoomState.players[uKey] ? quizRoomState.players[uKey].correctCount : 0)
                };
            }
            socket.emit('authResult', {
                success: true,
                role: 'admin',
                userProfile: { username, displayName: resolvedDisplayName, avatarUrl: resolvedAvatar, nameColor: socket.nameColor, role: 'admin' },
                currentVideoId, currentVideoTitle, playlist, pinnedMessage, loopMode,
                drawGame: drawGame.active ? { active: true, state: drawGame.state, scores: drawGame.scores } : null,
                caroGame, chessGame, xiangqiGame, unoPublicState: getPublicUnoState(),
                quizPublicState: quizRoomState.active ? getPublicQuizState() : null, chatHistory
            });
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: `👑 Admin [${socket.username}] đã lên sàn điều khiển nhạc!`, role: 'system' });
            io.emit('activeUsersList', getDrawUserList());
        } else {
            socket.username = chosenName.replace(/😎/g, '').trim();
            socket.role = 'member';
            socket.nameColor = resolvedColor || '#3ea6ff';
            socket.avatarUrl = resolvedAvatar;
            userAvatars.set(username.toLowerCase(), resolvedAvatar);
            if (resolvedDisplayName) userAvatars.set(resolvedDisplayName.toLowerCase(), resolvedAvatar);
            connectedUsers.set(socket.id, { id: socket.id, name: socket.username, role: 'member', nameColor: socket.nameColor, avatarUrl: socket.avatarUrl });
            if (quizRoomState.active) {
                const uKey = getQuizUserKey(socket);
                quizRoomState.players[uKey] = {
                    id: socket.id,
                    name: socket.username,
                    color: socket.nameColor || '#ff75a0',
                    score: (quizRoomState.players[uKey] ? quizRoomState.players[uKey].score : 0),
                    correctCount: (quizRoomState.players[uKey] ? quizRoomState.players[uKey].correctCount : 0)
                };
            }
            socket.emit('authResult', {
                success: true,
                role: 'member',
                userProfile: { username, displayName: resolvedDisplayName, avatarUrl: resolvedAvatar, nameColor: socket.nameColor, role: 'member' },
                currentVideoId, currentVideoTitle, playlist, pinnedMessage, loopMode,
                drawGame: drawGame.active ? { active: true, state: drawGame.state, scores: drawGame.scores } : null,
                caroGame, chessGame, xiangqiGame, unoPublicState: getPublicUnoState(),
                quizPublicState: quizRoomState.active ? getPublicQuizState() : null, chatHistory
            });
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: `👋 Chào mừng [${socket.username}] đã tham gia phòng nhạc!`, role: 'system' });
            io.emit('activeUsersList', getDrawUserList());
        }
        if (drawGame.active) io.emit('drawUsersUpdate', getDrawUserList());
    });

    socket.on('updateUserProfile', async (data) => {
        const { displayName, username, phone, avatarUrl, nameColor } = data || {};
        const cleanName = (displayName || username || socket.username || '').replace(' 😎', '').trim();
        const isAdmin = (socket.role === 'admin') || (socket.username && socket.username.includes('😎'));

        socket.username = isAdmin ? (cleanName + ' 😎') : cleanName;
        if (nameColor) socket.nameColor = nameColor;
        if (avatarUrl !== undefined) socket.avatarUrl = avatarUrl;

        userAvatars.set(cleanName.toLowerCase(), socket.avatarUrl || '');
        if (username) userAvatars.set(username.toLowerCase(), socket.avatarUrl || '');

        connectedUsers.set(socket.id, {
            id: socket.id,
            name: socket.username,
            role: socket.role,
            nameColor: socket.nameColor,
            avatarUrl: socket.avatarUrl
        });

        io.emit('activeUsersList', getDrawUserList());
        if (drawGame.active) io.emit('drawUsersUpdate', getDrawUserList());
    });

    socket.on('getUserBackgrounds', async (data, callback) => {
        const username = socket.username || data?.username;
        if (!username) return;
        const bgData = await getUserBackgroundsFromSupabase(username);
        if (typeof callback === 'function') callback(bgData);
        else socket.emit('userBackgroundsResult', bgData);
    });

    socket.on('saveUserBackgrounds', async (data, callback) => {
        const username = socket.username || data?.username;
        if (!username) return;
        const bgObj = {
            username: username,
            web_bg: data.web_bg,
            chat_bg: data.chat_bg,
            lyric_bg: data.lyric_bg,
            top_tab_type: data.top_tab_type,
            top_tab_url: data.top_tab_url
        };
        await saveUserBackgroundsToSupabase(bgObj);
        if (typeof callback === 'function') callback({ success: true });
    });


    socket.on('userTyping', (isTyping) => {
        const existing = typingUsers.get(socket.id);
        if (existing && existing.timer) clearTimeout(existing.timer);

        if (isTyping) {
            const timer = setTimeout(() => {
                if (typingUsers.has(socket.id)) {
                    typingUsers.delete(socket.id);
                    broadcastTypingUsers();
                }
            }, 4500);

            typingUsers.set(socket.id, {
                id: socket.id,
                name: socket.username || 'Người dùng',
                nameColor: socket.nameColor || '#3ea6ff',
                timer: timer
            });
        } else {
            typingUsers.delete(socket.id);
        }
        broadcastTypingUsers();
    });

    socket.on('sendMessage', async (msg) => {
        if (typingUsers.has(socket.id)) {
            const existing = typingUsers.get(socket.id);
            if (existing && existing.timer) clearTimeout(existing.timer);
            typingUsers.delete(socket.id);
            broadcastTypingUsers();
        }
        const msgId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const senderName = socket.username || 'Ẩn danh';
        const senderRole = socket.role || 'member';
        const senderColor = socket.nameColor || '#aaaaaa';
        const senderAvatar = socket.avatarUrl || '';
        const senderUserId = socket.userId || '';
        const replyTo = (typeof msg === 'object' && msg.replyTo) ? msg.replyTo : null;

        if (typeof msg === 'object' && msg.type === 'gif' && msg.gifUrl) {
            const gifMsgObj = {
                id: msgId,
                senderId: socket.id,
                userId: senderUserId,
                name: senderName,
                nameColor: senderColor,
                avatarUrl: senderAvatar,
                text: '[GIF]',
                type: 'gif',
                gifUrl: msg.gifUrl,
                role: senderRole
            };
            io.emit('newMessage', gifMsgObj);
            saveMessageToSupabase(gifMsgObj);
            return;
        }

        if (typeof msg === 'object' && msg.type === 'voice' && msg.audioUrl) {
            const voiceMsgObj = {
                id: msgId,
                senderId: socket.id,
                userId: senderUserId,
                name: senderName,
                nameColor: senderColor,
                avatarUrl: senderAvatar,
                text: '[Tin nhắn thoại]',
                type: 'voice',
                audioUrl: msg.audioUrl,
                duration: msg.duration || 0,
                role: senderRole,
                replyTo: replyTo
            };
            io.emit('newMessage', voiceMsgObj);
            saveMessageToSupabase(voiceMsgObj);
            return;
        }

        if (typeof msg === 'object' && (msg.type === 'image' || msg.type === 'video') && msg.fileUrl) {
            const mediaMsgObj = {
                id: msgId,
                senderId: socket.id,
                userId: senderUserId,
                name: senderName,
                nameColor: senderColor,
                avatarUrl: senderAvatar,
                text: msg.type === 'image' ? '[Hình ảnh]' : '[Video]',
                type: msg.type,
                fileUrl: msg.fileUrl,
                role: senderRole,
                replyTo: replyTo
            };
            io.emit('newMessage', mediaMsgObj);
            saveMessageToSupabase(mediaMsgObj);
            return;
        }

        let textMsg = typeof msg === 'string' ? msg : (msg.type === 'text' ? msg.text : '');

        if (textMsg && textMsg.trim() !== '') {

            if (drawGame.active && drawGame.state === 'playing' && socket.id !== drawGame.drawerId && !drawGame.guessedPlayers.includes(socket.id)) {
                const guess = textMsg.trim().toLowerCase();
                if (guess === drawGame.word.toLowerCase()) {
                    drawGame.guessedPlayers.push(socket.id);
                    const pts = Math.max(10, Math.ceil(drawGame.timeLeft / 90 * 100));
                    if (!drawGame.scores[socket.id]) drawGame.scores[socket.id] = { name: senderName, score: 0, nameColor: senderColor };
                    drawGame.scores[socket.id].score += pts;
                    if (!drawGame.scores[drawGame.drawerId]) {
                        const dr = connectedUsers.get(drawGame.drawerId);
                        drawGame.scores[drawGame.drawerId] = { name: dr?.name || '', score: 0, nameColor: dr?.nameColor || '#aaa' };
                    }
                    drawGame.scores[drawGame.drawerId].score += 25;
                    io.emit('newMessage', { id: 'draw-' + Date.now(), name: 'Trò chơi 🎨', text: `🎉 ${senderName} đã đoán đúng! (+${pts} điểm)`, role: 'system' });
                    io.emit('drawScoreUpdate', drawGame.scores);
                    const playersCanGuess = Array.from(connectedUsers.keys()).filter(id => id !== drawGame.drawerId);
                    if (drawGame.guessedPlayers.length >= playersCanGuess.length) setTimeout(() => endDrawRound(), 2000);
                    return;
                }
            }

            const textLower = textMsg.trim().toLowerCase();

            let isTbNotification = false;
            let tbContent = '';
            if (textLower.startsWith('/tb ') || textLower === '/tb') {
                if (socket.role !== 'admin') {
                    socket.emit('newMessage', {
                        id: 'sys-' + Date.now(),
                        name: 'Hệ thống ❌',
                        text: 'Lệnh **/tb** chỉ dành cho Quản trị viên!',
                        role: 'system'
                    });
                    return;
                }
                isTbNotification = true;
                tbContent = textMsg.trim().replace(/^\/tb\s*/i, '').trim();
                if (!tbContent) {
                    socket.emit('newMessage', {
                        id: 'sys-' + Date.now(),
                        name: 'Hệ thống ⚠️',
                        text: 'Vui lòng nhập nội dung thông báo! Cú pháp: **/tb <nội dung>**',
                        role: 'system'
                    });
                    return;
                }
                textMsg = tbContent;
            }

            if (textLower.startsWith('/') && !textLower.startsWith('/ai')) {
                if (socket.role !== 'admin') {
                    socket.emit('newMessage', {
                        id: 'sys-' + Date.now(),
                        name: 'Hệ thống ❌',
                        text: `Lệnh **${textLower.split(' ')[0]}** chỉ dành cho Quản trị viên!`,
                        role: 'system'
                    });
                    return;
                }
            }

            const textMsgObj = {
                id: msgId, senderId: socket.id, userId: senderUserId, name: senderName,
                nameColor: senderColor, avatarUrl: senderAvatar, text: textMsg, role: senderRole,
                replyTo: replyTo, type: 'text'
            };
            io.emit('newMessage', textMsgObj);
            saveMessageToSupabase(textMsgObj);

            if (isTbNotification && tbContent) {
                io.emit('fullscreenNotification', {
                    id: msgId,
                    senderName: senderName,
                    senderColor: senderColor,
                    text: tbContent
                });
            }

            if (textLower === '/skip') {
                if (playlist.length > 0) {
                    const nextSong = playlist.shift();
                    currentVideoId = nextSong.id;
                    currentVideoTitle = nextSong.title;
                    io.emit('changeVideo', { id: currentVideoId, title: currentVideoTitle });
                    io.emit('updatePlaylist', playlist);
                    io.emit('newMessage', {
                        id: 'sys-' + Date.now(),
                        name: 'Hệ thống 🎵',
                        text: `⏭️ **${senderName}** đã chuyển bài. Đang phát: **${currentVideoTitle}**`,
                        role: 'system'
                    });
                    isPlayerIdle = false;
                    logMusicHistory(currentVideoId, currentVideoTitle, nextSong.addedBy || 'Người dùng');
                } else {
                    currentVideoId = '';
                    currentVideoTitle = 'Chưa có bài hát nào';
                    isPlayerIdle = true;
                    io.emit('stopVideo');
                    io.emit('newMessage', {
                        id: 'sys-' + Date.now(),
                        name: 'Hệ thống 🎵',
                        text: `⏭️ **${senderName}** đã chuyển bài. Đã hết danh sách phát.`,
                        role: 'system'
                    });
                }
                return;
            }

            if (textLower === '/repeat') {
                loopMode = !loopMode;
                io.emit('loopModeUpdate', loopMode);
                io.emit('newMessage', {
                    id: 'sys-' + Date.now(),
                    name: 'Hệ thống 🎵',
                    text: `🔁 **${senderName}** đã ${loopMode ? 'BẬT' : 'TẮT'} chế độ lặp lại.`,
                    role: 'system'
                });
                return;
            }

            if (textLower.startsWith('/move ')) {
                const args = textLower.substring(6).trim().split(/\s+/);
                if (args.length === 2) {
                    const idx1 = parseInt(args[0]) - 1;
                    const idx2 = parseInt(args[1]) - 1;
                    if (!isNaN(idx1) && !isNaN(idx2) && idx1 >= 0 && idx2 >= 0 && idx1 < playlist.length && idx2 < playlist.length) {
                        const temp = playlist[idx1];
                        playlist[idx1] = playlist[idx2];
                        playlist[idx2] = temp;
                        io.emit('updatePlaylist', playlist);
                        io.emit('newMessage', {
                            id: 'sys-' + Date.now(),
                            name: 'Hệ thống 🎵',
                            text: `🔄 **${senderName}** đã đổi vị trí bài số ${idx1 + 1} và ${idx2 + 1}.`,
                            role: 'system'
                        });
                    } else {
                        socket.emit('newMessage', {
                            id: 'sys-' + Date.now(),
                            name: 'Hệ thống 🎵',
                            text: `❌ Số thứ tự không hợp lệ. Vui lòng nhập từ 1 đến ${playlist.length}.`,
                            role: 'system'
                        });
                    }
                } else {
                    socket.emit('newMessage', {
                        id: 'sys-' + Date.now(),
                        name: 'Hệ thống 🎵',
                        text: `❌ Cú pháp sai. Hãy dùng: /move <số 1> <số 2> (ví dụ: /move 1 3)`,
                        role: 'system'
                    });
                }
                return;
            }

            if (textLower.startsWith('/remove ')) {
                const idxStr = textLower.substring(8).trim();
                const idx = parseInt(idxStr) - 1;
                if (!isNaN(idx) && idx >= 0 && idx < playlist.length) {
                    const removed = playlist.splice(idx, 1)[0];
                    io.emit('updatePlaylist', playlist);
                    io.emit('newMessage', {
                        id: 'sys-' + Date.now(),
                        name: 'Hệ thống 🎵',
                        text: `🗑️ **${senderName}** đã xóa bài **${removed.title}** khỏi danh sách chờ.`,
                        role: 'system'
                    });
                } else {
                    socket.emit('newMessage', {
                        id: 'sys-' + Date.now(),
                        name: 'Hệ thống 🎵',
                        text: `❌ Số thứ tự không hợp lệ. Vui lòng nhập từ 1 đến ${playlist.length}.`,
                        role: 'system'
                    });
                }
                return;
            }

            if (textLower.startsWith('/add ')) {
                const query = textMsg.trim().substring(5).trim();
                if (query) {
                    try {
                        let videoId = query;
                        if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                            const r = await ytSearch(videoId);
                            if (r && r.videos.length > 0) {
                                videoId = r.videos[0].videoId;
                            } else {
                                throw new Error('Not found');
                            }
                        }

                        const info = await getYoutubeInfo(videoId);
                        info.addedBy = senderName;
                        info.addedByColor = senderColor;
                        playlist.push(info);
                        io.emit('updatePlaylist', playlist);
                        io.emit('newMessage', {
                            id: 'sys-' + Date.now(),
                            name: 'Hệ thống 🎵',
                            text: `✅ Đã thêm **${info.title}** vào danh sách chờ.`,
                            role: 'system'
                        });

                        if (isPlayerIdle) {
                            const nextSong = playlist.shift();
                            currentVideoId = nextSong.id;
                            currentVideoTitle = nextSong.title;
                            io.emit('changeVideo', { id: currentVideoId, title: currentVideoTitle });
                            io.emit('updatePlaylist', playlist);
                            isPlayerIdle = false;
                            logMusicHistory(currentVideoId, currentVideoTitle, nextSong.addedBy || 'Groq AI');
                        }
                    } catch (err) {
                        socket.emit('newMessage', {
                            id: 'sys-' + Date.now(),
                            name: 'Hệ thống ❌',
                            text: `Không tìm thấy bài hát "${query}".`,
                            role: 'system'
                        });
                    }
                }
                return;
            }

            if (textMsg.trim().toLowerCase().startsWith('/ai ')) {
                const query = textMsg.trim().substring(4).trim();
                if (query) callGroqAI(query, senderName);
            }
        }
    });



    socket.on('submitFeedback', async (data) => {
        if (!data || !data.content) return;
        try {
            const { error } = await supabase.from('web_feedback').insert([{
                username: data.username || socket.username || 'Ẩn danh',
                type: data.type || 'gop_y',
                content: data.content,
                created_at: new Date().toISOString()
            }]);
            if (error) {
                console.error('Supabase Error (web_feedback):', error.message);
            } else {
                console.log('Đã lưu đóng góp ý kiến:', data.content);
            }
        } catch (e) {
            console.error('Feedback Exception:', e.message);
        }
    });

    socket.on('adminPinMessage', (msgObj) => {
        if (socket.role === 'admin') {
            pinnedMessage = msgObj;
            io.emit('updatePinnedMessage', pinnedMessage);
        }
    });

    socket.on('adminUnpinMessage', () => {
        if (socket.role === 'admin') {
            pinnedMessage = null;
            io.emit('updatePinnedMessage', null);
        }
    });

    socket.on('adminDeleteMessage', (msgId) => {
        if (socket.role === 'admin') {
            io.emit('messageDeleted', msgId);
            deleteMessageFromSupabase(msgId);
        }
    });


    socket.on('requestSync', () => {
        socket.broadcast.emit('memberRequestSync');
    });

    socket.on('addSong', async (inputData, callback) => {
        let videoId = inputData.trim();
        let success = false;
        try {
            if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                const r = await ytSearch(videoId);
                if (r && r.videos.length > 0) {
                    videoId = r.videos[0].videoId;
                }
            }


            if (videoId === currentVideoId || playlist.some(song => song.id === videoId)) {
                if (typeof callback === 'function') {
                    callback({ success: false, message: 'Bài hát đã có trong hàng đợi hoặc đang phát!' });
                }
                return;
            }

            const info = await getYoutubeInfo(videoId);
            info.addedBy = socket.username || 'Ẩn danh';
            info.addedByColor = socket.nameColor || '#aaaaaa';
            playlist.push(info);
            io.emit('updatePlaylist', playlist);
            io.emit('newMessage', {
                id: 'sys-' + Date.now(),
                name: 'Hệ thống 🤖',
                text: `**${socket.username || 'Thành viên'}** đã thêm bài **${info.title}** vào danh sách chờ!`,
                role: 'system'
            });

            if (isPlayerIdle) {
                const nextSong = playlist.shift();
                currentVideoId = nextSong.id;
                currentVideoTitle = nextSong.title;
                io.emit('changeVideo', { id: currentVideoId, title: currentVideoTitle });
                io.emit('updatePlaylist', playlist);
                isPlayerIdle = false;
                logMusicHistory(currentVideoId, currentVideoTitle, nextSong.addedBy || 'Người dùng');
            }

            success = true;
        } catch (err) {
            console.error('Lỗi khi thêm bài hát:', err);
        }
        if (typeof callback === 'function') {
            callback({ success });
        }
    });

    socket.on('searchSuggestions', async (query, callback) => {
        if (typeof callback !== 'function') return;
        if (!query || typeof query !== 'string' || !query.trim()) {
            return callback([]);
        }
        const q = query.trim();
        if (q.length < 2) {
            return callback([]);
        }
        try {
            const r = await ytSearch(q);
            const videos = (r && r.videos ? r.videos : []).slice(0, 5).map(v => ({
                id: v.videoId,
                title: v.title,
                author: v.author ? v.author.name : '',
                timestamp: v.timestamp || v.duration?.timestamp || '',
                thumbnail: v.thumbnail || v.image || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
            }));
            callback(videos);
        } catch (err) {
            console.error('Lỗi searchSuggestions:', err);
            callback([]);
        }
    });

    socket.on('adminReorderPlaylist', (newPlaylist) => {
        if (socket.role === 'admin') {
            playlist = newPlaylist;
            io.emit('updatePlaylist', playlist);
        }
    });

    socket.on('adminRemoveSong', (index) => {
        if (socket.role === 'admin') {
            playlist.splice(index, 1);
            io.emit('updatePlaylist', playlist);
        }
    });

    socket.on('adminNextSong', () => {
        if (socket.role === 'admin') {
            if (playlist.length > 0) {
                const nextSong = playlist.shift();
                currentVideoId = nextSong.id;
                currentVideoTitle = nextSong.title;
                io.emit('changeVideo', { id: currentVideoId, title: currentVideoTitle });
                io.emit('updatePlaylist', playlist);
                isPlayerIdle = false;
                logMusicHistory(currentVideoId, currentVideoTitle, nextSong.addedBy || 'Admin');
            } else {
                currentVideoId = '';
                currentVideoTitle = 'Chưa có bài hát nào';
                isPlayerIdle = true;
                io.emit('stopVideo');
                isPlayerIdle = true;
            }
        }
    });


    socket.on('adminToggleLoop', () => {
        if (socket.role === 'admin') {
            loopMode = !loopMode;
            io.emit('loopModeUpdate', loopMode);
        }
    });


    socket.on('videoEnded', (clientVideoId) => {
        if (socket.role === 'admin') {

            if (clientVideoId && clientVideoId !== currentVideoId) return;


            const now = Date.now();
            if (now - lastGlobalVideoEndedTime < 3000) return;
            lastGlobalVideoEndedTime = now;

            if (loopMode) {

                io.emit('changeVideo', { id: currentVideoId, title: currentVideoTitle });
                isPlayerIdle = false;
            } else if (playlist.length > 0) {

                const nextSong = playlist.shift();
                currentVideoId = nextSong.id;
                currentVideoTitle = nextSong.title;
                io.emit('changeVideo', { id: currentVideoId, title: currentVideoTitle });
                io.emit('updatePlaylist', playlist);
                isPlayerIdle = false;
                logMusicHistory(currentVideoId, currentVideoTitle, nextSong.addedBy || 'Hệ thống');
            } else {
                isPlayerIdle = true;
            }
        }
    });

    socket.on('adminPlay', (time) => { if (socket.role === 'admin') socket.broadcast.emit('memberPlay', time); });
    socket.on('adminPause', () => { if (socket.role === 'admin') socket.broadcast.emit('memberPause'); });


    socket.on('adminStartDrawGame', () => {
        if (socket.role !== 'admin') return;
        drawGame.active = true; drawGame.state = 'waiting'; drawGame.scores = {}; drawGame.canvasHistory = [];
        io.emit('drawGameStarted', { users: getDrawUserList(), scores: {} });
    });
    function startDrawRound(drawerId) {
        if (!connectedUsers.has(drawerId)) return;
        const user = connectedUsers.get(drawerId);
        drawGame.state = 'playing'; drawGame.drawerId = drawerId; drawGame.drawerName = user.name;
        drawGame.word = getRandomWord(); drawGame.timeLeft = 90; drawGame.guessedPlayers = []; drawGame.canvasHistory = [];
        if (drawGame.timer) clearInterval(drawGame.timer);
        drawGame.timer = setInterval(() => { drawGame.timeLeft--; io.emit('drawTimerUpdate', drawGame.timeLeft); if (drawGame.timeLeft <= 0) endDrawRound(); }, 1000);
        io.emit('drawRoundStart', { drawerId, drawerName: user.name, hint: generateHint(drawGame.word), timeLeft: 90 });

        setTimeout(() => {
            io.to(drawerId).emit('drawYourWord', drawGame.word);
        }, 100);
    }

    socket.on('adminPickDrawer', (drawerId) => {
        if (socket.role !== 'admin') return;
        startDrawRound(drawerId);
    });

    socket.on('adminRandomPickDrawer', () => {
        if (socket.role !== 'admin') return;
        const users = Array.from(connectedUsers.keys());
        if (users.length === 0) return;
        const winnerId = users[Math.floor(Math.random() * users.length)];

        io.emit('drawRandomPickAnimation', { winnerId, users: getDrawUserList() });

        setTimeout(() => {
            startDrawRound(winnerId);
        }, 3000);
    });
    socket.on('drawStroke', (data) => { if (socket.id === drawGame.drawerId) { drawGame.canvasHistory.push(data); socket.broadcast.emit('drawStroke', data); } });
    socket.on('drawClear', () => { if (socket.id === drawGame.drawerId) { drawGame.canvasHistory = []; socket.broadcast.emit('drawClear'); } });
    socket.on('adminEndDrawGame', () => {
        if (socket.role !== 'admin') return;
        if (drawGame.timer) { clearInterval(drawGame.timer); drawGame.timer = null; }
        drawGame.active = false; drawGame.state = 'inactive';
        io.emit('drawGameEnded');
    });
    socket.on('skipWord', () => {
        if (drawGame.state !== 'playing') return;
        if (socket.id !== drawGame.drawerId) return;
        drawGame.word = getRandomWord(); drawGame.canvasHistory = []; drawGame.guessedPlayers = []; drawGame.timeLeft = 90;
        io.to(drawGame.drawerId).emit('drawYourWord', drawGame.word);
        io.emit('drawNewWord', { hint: generateHint(drawGame.word), timeLeft: 90 });
        io.emit('drawClear');
    });
    socket.on('requestCanvasHistory', () => {
        if (drawGame.canvasHistory.length > 0) socket.emit('drawCanvasHistory', drawGame.canvasHistory);
    });


    socket.on('caroChallenge', (targetId) => {
        if (!connectedUsers.has(targetId) || targetId === socket.id) return;
        if (caroGame.playerX || caroGame.playerO) return;

        io.to(targetId).emit('caroChallengeReceived', {
            challengerId: socket.id,
            challengerName: socket.username
        });
        socket.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: `Đã gửi lời thách đấu Cờ Caro đến **${connectedUsers.get(targetId).name}**. Đang chờ phản hồi...`, role: 'system' });
    });

    socket.on('caroChallengeRespond', ({ challengerId, accept }) => {
        if (!connectedUsers.has(challengerId)) {
            socket.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: 'Người thách đấu đã rời phòng!', role: 'system' });
            return;
        }

        if (accept) {
            if (caroGame.playerX || caroGame.playerO) {
                socket.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: 'Bàn cờ hiện đã có người chơi!', role: 'system' });
                return;
            }

            const challengerX = Math.random() < 0.5;
            const challengerName = connectedUsers.get(challengerId).name;

            if (challengerX) {
                caroGame.playerX = challengerId;
                caroGame.playerXName = challengerName;
                caroGame.playerO = socket.id;
                caroGame.playerOName = socket.username;
            } else {
                caroGame.playerO = challengerId;
                caroGame.playerOName = challengerName;
                caroGame.playerX = socket.id;
                caroGame.playerXName = socket.username;
            }
            caroGame.board = Array(15).fill(null).map(() => Array(15).fill(null));
            caroGame.turn = 'X';
            caroGame.winner = null;

            io.emit('caroUpdate', caroGame);
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Caro ❌⭕', text: `⚔️ **${socket.username}** đã chấp nhận thách đấu của **${challengerName}**! Ván cờ bắt đầu!`, role: 'system' });
        } else {
            io.to(challengerId).emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Caro ❌⭕', text: `❌ **${socket.username}** đã từ chối lời thách đấu cờ caro của bạn!`, role: 'system' });
        }
    });

    socket.on('caroLeave', () => {
        if (caroGame.playerX === socket.id) { caroGame.playerX = null; caroGame.playerXName = ''; }
        if (caroGame.playerO === socket.id) { caroGame.playerO = null; caroGame.playerOName = ''; }
        if (!caroGame.playerX && !caroGame.playerO) {
            caroGame.board = Array(15).fill(null).map(() => Array(15).fill(null));
            caroGame.turn = 'X';
            caroGame.winner = null;
        }
        io.emit('caroUpdate', caroGame);
    });

    socket.on('caroMove', ({ row, col }) => {
        if (caroGame.winner) return;
        if (row < 0 || row >= 15 || col < 0 || col >= 15) return;
        if (caroGame.board[row][col] !== null) return;

        let playerSide = null;
        if (socket.id === caroGame.playerX) playerSide = 'X';
        if (socket.id === caroGame.playerO) playerSide = 'O';

        if (!playerSide || playerSide !== caroGame.turn) return;

        caroGame.board[row][col] = playerSide;
        if (checkCaroWinner(row, col, playerSide)) {
            caroGame.winner = playerSide;
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Caro ❌⭕', text: `🎉 Người chơi **${playerSide === 'X' ? caroGame.playerXName : caroGame.playerOName} (${playerSide})** đã thắng ván Caro!`, role: 'system' });
        } else {
            caroGame.turn = caroGame.turn === 'X' ? 'O' : 'X';
        }
        io.emit('caroUpdate', caroGame);
    });


    socket.on('chessChallenge', (targetId) => {
        if (!connectedUsers.has(targetId) || targetId === socket.id) return;
        if (chessGame.playerW || chessGame.playerB) return;

        io.to(targetId).emit('chessChallengeReceived', {
            challengerId: socket.id,
            challengerName: socket.username
        });
        socket.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: `Đã gửi lời thách đấu Cờ Vua đến **${connectedUsers.get(targetId).name}**. Đang chờ phản hồi...`, role: 'system' });
    });

    socket.on('chessChallengeRespond', ({ challengerId, accept }) => {
        if (!connectedUsers.has(challengerId)) {
            socket.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: 'Người thách đấu đã rời phòng!', role: 'system' });
            return;
        }

        if (accept) {
            if (chessGame.playerW || chessGame.playerB) {
                socket.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: 'Bàn cờ hiện đã có người chơi!', role: 'system' });
                return;
            }

            const challengerW = Math.random() < 0.5;
            const challengerName = connectedUsers.get(challengerId).name;

            if (challengerW) {
                chessGame.playerW = challengerId;
                chessGame.playerWName = challengerName;
                chessGame.playerB = socket.id;
                chessGame.playerBName = socket.username;
            } else {
                chessGame.playerB = challengerId;
                chessGame.playerBName = challengerName;
                chessGame.playerW = socket.id;
                chessGame.playerWName = socket.username;
            }
            chessGame.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            chessGame.winner = null;

            io.emit('chessUpdate', chessGame);
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Vua ♔♛', text: `⚔️ **${socket.username}** đã chấp nhận thách đấu của **${challengerName}**! Ván cờ bắt đầu!`, role: 'system' });
        } else {
            io.to(challengerId).emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Vua ♔♛', text: `❌ **${socket.username}** đã từ chối lời thách đấu cờ vua của bạn!`, role: 'system' });
        }
    });

    socket.on('chessLeave', () => {
        if (chessGame.playerW === socket.id) { chessGame.playerW = null; chessGame.playerWName = ''; }
        if (chessGame.playerB === socket.id) { chessGame.playerB = null; chessGame.playerBName = ''; }
        if (!chessGame.playerW && !chessGame.playerB) {
            chessGame.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            chessGame.winner = null;
        }
        io.emit('chessUpdate', chessGame);
    });

    socket.on('chessMove', ({ fen, winner }) => {
        if (chessGame.winner) return;
        let playerSide = null;
        if (socket.id === chessGame.playerW) playerSide = 'w';
        if (socket.id === chessGame.playerB) playerSide = 'b';
        if (!playerSide) return;

        chessGame.fen = fen;
        if (winner) {
            chessGame.winner = winner;
            let msg = '';
            if (winner === 'd') msg = 'Cờ hòa! 🤝';
            else msg = `🎉 Người chơi **${winner === 'w' ? chessGame.playerWName : chessGame.playerBName} (${winner === 'w' ? 'Trắng' : 'Đen'})** đã chiến thắng ván Cờ Vua!`;
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Vua ♔♛', text: msg, role: 'system' });
        }
        io.emit('chessUpdate', chessGame);
    });

    socket.on('xiangqiChallenge', (targetId) => {
        if (!connectedUsers.has(targetId) || targetId === socket.id) return;
        io.to(targetId).emit('xiangqiChallengeReceived', {
            challengerId: socket.id,
            challengerName: socket.username
        });
        socket.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: `Đã gửi lời thách đấu Cờ Tướng đến **${connectedUsers.get(targetId).name}**. Đang chờ phản hồi...`, role: 'system' });
    });

    socket.on('xiangqiChallengeRespond', ({ challengerId, accept }) => {
        if (!connectedUsers.has(challengerId)) return;
        if (accept) {
            xiangqiGame.playerR = challengerId;
            xiangqiGame.playerRName = connectedUsers.get(challengerId).name;
            xiangqiGame.playerB = socket.id;
            xiangqiGame.playerBName = socket.username;
            xiangqiGame.board = initXiangqiBoard();
            xiangqiGame.turn = 'R';
            xiangqiGame.winner = null;
            io.emit('xiangqiUpdate', xiangqiGame);
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Tướng 🀄', text: `⚔️ **${socket.username}** đã chấp nhận thách đấu của **${connectedUsers.get(challengerId).name}**!`, role: 'system' });
        } else {
            io.to(challengerId).emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Tướng 🀄', text: `❌ **${socket.username}** đã từ chối lời thách đấu Cờ Tướng của bạn!`, role: 'system' });
        }
    });

    socket.on('xiangqiMove', ({ from, to }) => {
        if (!xiangqiGame.playerR || !xiangqiGame.playerB || xiangqiGame.winner) return;
        const isRed = xiangqiGame.playerR === socket.id;
        const isBlack = xiangqiGame.playerB === socket.id;
        if (!isRed && !isBlack) return;
        if ((isRed && xiangqiGame.turn !== 'R') || (isBlack && xiangqiGame.turn !== 'B')) return;

        const piece = xiangqiGame.board[from.r][from.c];
        if (!piece || (isRed && !piece.startsWith('r_')) || (isBlack && !piece.startsWith('b_'))) return;

        if (!isValidXiangqiMove(xiangqiGame.board, piece, from, to)) return;

        const targetPiece = xiangqiGame.board[to.r][to.c];

        // Check flying general
        const tempBoard = xiangqiGame.board.map(row => [...row]);
        tempBoard[to.r][to.c] = piece;
        tempBoard[from.r][from.c] = null;
        if (checkFlyingGeneral(tempBoard)) return;

        if (targetPiece === 'r_k') xiangqiGame.winner = 'B';
        else if (targetPiece === 'b_k') xiangqiGame.winner = 'R';

        xiangqiGame.board[to.r][to.c] = piece;
        xiangqiGame.board[from.r][from.c] = null;
        xiangqiGame.turn = xiangqiGame.turn === 'R' ? 'B' : 'R';
        io.emit('xiangqiUpdate', xiangqiGame);
    });

    socket.on('xiangqiLeave', () => {
        if (xiangqiGame.playerR === socket.id || xiangqiGame.playerB === socket.id) {
            xiangqiGame.playerR = null; xiangqiGame.playerB = null;
            xiangqiGame.winner = null;
            xiangqiGame.board = initXiangqiBoard();
            io.emit('xiangqiUpdate', xiangqiGame);
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Cờ Tướng 🀄', text: `🏃 **${socket.username}** đã rời bàn Cờ Tướng.`, role: 'system' });
        }
    });

    socket.on('unoJoin', () => {
        if (unoGame.active) return;
        if (!unoGame.players.find(p => p.id === socket.id)) {
            unoGame.players.push({ id: socket.id, name: socket.username, handCount: 0 });
            unoHands[socket.id] = [];
            io.emit('unoUpdate', getPublicUnoState());
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'UNO 🃏', text: `🎮 **${socket.username}** đã tham gia bàn UNO.`, role: 'system' });
        }
    });

    socket.on('unoStart', () => {
        if (unoGame.active || unoGame.players.length < 2) return;
        unoGame.active = true;
        unoGame.deck = initUnoDeck();
        unoGame.discardPile = [];
        unoGame.turnIndex = 0;
        unoGame.direction = 1;
        unoGame.winner = null;

        unoGame.players.forEach(p => {
            unoHands[p.id] = unoGame.deck.splice(0, 7);
            p.handCount = 7;
        });

        let firstCard = unoGame.deck.shift();
        while (firstCard.color === 'black') {
            unoGame.deck.push(firstCard);
            firstCard = unoGame.deck.shift();
        }
        unoGame.discardPile.push(firstCard);
        unoGame.currentColor = firstCard.color;

        unoGame.players.forEach(p => io.to(p.id).emit('unoHand', unoHands[p.id]));
        io.emit('unoUpdate', getPublicUnoState());
        io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'UNO 🃏', text: `🚀 Ván UNO đã được bắt đầu!`, role: 'system' });
    });

    socket.on('unoPlayCard', (cardIndex) => {
        if (!unoGame.active || unoGame.winner) return;
        const p = unoGame.players[unoGame.turnIndex];
        if (p.id !== socket.id) return;
        const hand = unoHands[socket.id];
        const card = hand[cardIndex];
        if (!card) return;
        const topCard = unoGame.discardPile[unoGame.discardPile.length - 1];

        if (card.color !== 'black' && card.color !== unoGame.currentColor && card.value !== topCard.value) return;

        hand.splice(cardIndex, 1);
        unoGame.discardPile.push(card);
        unoGame.currentColor = card.color === 'black' ? ['red', 'green', 'blue', 'yellow'][Math.floor(Math.random() * 4)] : card.color;
        p.handCount = hand.length;

        if (hand.length === 0) {
            unoGame.winner = socket.username;
            unoGame.active = false;
        } else {
            if (card.value === 'reverse') unoGame.direction *= -1;
            nextUnoTurn();
            if (card.value === 'skip') nextUnoTurn();
            if (card.value === '+2') {
                drawCardsForPlayer(unoGame.players[unoGame.turnIndex].id, 2);
                nextUnoTurn();
            }
        }
        io.to(socket.id).emit('unoHand', hand);
        io.emit('unoUpdate', getPublicUnoState());
    });

    socket.on('unoDraw', () => {
        if (!unoGame.active || unoGame.winner) return;
        if (unoGame.players[unoGame.turnIndex].id !== socket.id) return;
        drawCardsForPlayer(socket.id, 1);
        io.to(socket.id).emit('unoHand', unoHands[socket.id]);
        io.emit('unoUpdate', getPublicUnoState());
    });

    socket.on('unoPass', () => {
        if (!unoGame.active || unoGame.winner) return;
        if (unoGame.players[unoGame.turnIndex].id !== socket.id) return;
        nextUnoTurn();
        io.emit('unoUpdate', getPublicUnoState());
    });

    socket.on('getQuizPacks', (callback) => {
        const packs = loadQuizPacks();
        if (typeof callback === 'function') callback(packs);
        else socket.emit('quizPacksResult', packs);
    });

    socket.on('getQuizState', (callback) => {
        const st = getPublicQuizState();
        if (typeof callback === 'function') callback(st);
        else socket.emit('quizRoomUpdate', st);
    });

    socket.on('startMultiplayerQuiz', (data, callback) => {
        let cb = (typeof data === 'function') ? data : callback;
        let packId = (data && typeof data === 'object') ? data.packId : data;
        let starterName = (data && typeof data === 'object') ? data.starterName : '';

        clearQuizTimers();
        const allPacks = loadQuizPacks();
        const pack = allPacks.find(p => p.id === packId);
        if (!pack || !isQuizPackComplete(pack)) {
            if (typeof cb === 'function') cb({ success: false, message: 'Bộ câu hỏi không hợp lệ hoặc chưa đủ 4 item!' });
            return;
        }

        const questions = generateQuestionsForPack(pack, allPacks);
        if (questions.length === 0) {
            if (typeof cb === 'function') cb({ success: false, message: 'Không thể tạo danh sách câu hỏi!' });
            return;
        }

        const hostToken = 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        const resolvedHostName = (socket.username && socket.username.trim()) ? socket.username : (starterName || 'Người chơi');

        // Initialize multiplayer room state
        quizRoomState.active = true;
        quizRoomState.hostId = socket.id;
        quizRoomState.hostName = resolvedHostName;
        quizRoomState.hostToken = hostToken;
        quizRoomState.packId = pack.id;
        quizRoomState.packName = pack.name;
        quizRoomState.questions = questions;
        quizRoomState.currentIndex = 0;
        quizRoomState.gameSessionId = Date.now();
        quizRoomState.players = {};
        quizRoomState.answers = {};
        quizRoomState.optionCounts = [0, 0, 0, 0];

        // Register all currently connected active users into players map
        connectedUsers.forEach((user, sid) => {
            const key = (user.name && user.name.trim()) ? user.name.replace(/😎/g, '').trim().toLowerCase() : sid;
            quizRoomState.players[key] = {
                id: sid,
                name: user.name || 'Người chơi',
                color: user.nameColor || '#ff75a0',
                score: 0,
                correctCount: 0
            };
        });

        if (typeof cb === 'function') cb({ success: true, hostToken: hostToken });

        io.emit('newMessage', {
            id: 'sys-' + Date.now(),
            name: 'Đoán Hình 🧩',
            text: `🔥 **[${resolvedHostName}]** đã khởi chạy trò chơi **Đoán Hình Multiplayer**: *${pack.name}*! Mọi người cùng tham gia trả lời nào!`,
            role: 'system'
        });

        startQuizQuestionTimer();
    });

    socket.on('submitQuizAnswer', ({ optionIndex }, callback) => {
        if (!quizRoomState.active || quizRoomState.state !== 'question') {
            if (typeof callback === 'function') callback({ success: false, message: 'Lượt trả lời đã kết thúc!' });
            return;
        }

        const uKey = getQuizUserKey(socket);

        if (quizRoomState.answers[uKey]) {
            if (typeof callback === 'function') callback({ success: false, message: 'Bạn đã chọn đáp án rồi!' });
            return;
        }

        const currentQ = quizRoomState.questions[quizRoomState.currentIndex];
        if (!currentQ || optionIndex < 0 || optionIndex >= currentQ.options.length) return;

        const isCorrect = (optionIndex === currentQ.correctOptionIndex) || 
                          (currentQ.options[optionIndex] && currentQ.correctAnswer && 
                           String(currentQ.options[optionIndex]).trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase());
        const timeTaken = (Date.now() - quizRoomState.questionStartTime) / 1000;
        // Kahoot scoring: Base 1000 pts + up to 500 bonus pts for fast response
        const timeBonus = Math.max(0, Math.round(500 * (1 - timeTaken / quizRoomState.timerSeconds)));
        const scoreAdded = isCorrect ? (1000 + timeBonus) : 0;

        if (!quizRoomState.players[uKey]) {
            quizRoomState.players[uKey] = {
                id: socket.id,
                name: socket.username || 'Người chơi',
                color: socket.nameColor || '#ff75a0',
                score: 0,
                correctCount: 0
            };
        } else {
            quizRoomState.players[uKey].id = socket.id;
            if (socket.username) quizRoomState.players[uKey].name = socket.username;
            if (socket.nameColor) quizRoomState.players[uKey].color = socket.nameColor;
        }

        quizRoomState.players[uKey].score += scoreAdded;
        if (isCorrect) quizRoomState.players[uKey].correctCount += 1;

        quizRoomState.answers[uKey] = {
            optionIndex: optionIndex,
            isCorrect: isCorrect,
            scoreAdded: scoreAdded,
            timeTaken: timeTaken
        };

        quizRoomState.optionCounts[optionIndex] = (quizRoomState.optionCounts[optionIndex] || 0) + 1;

        const totalP = Math.max(io.engine ? io.engine.clientsCount : 1, connectedUsers.size, Object.keys(quizRoomState.players).length, 1);
        const answeredP = Object.keys(quizRoomState.answers).length;

        if (typeof callback === 'function') {
            callback({
                success: true,
                isCorrect: isCorrect,
                scoreAdded: scoreAdded,
                totalScore: quizRoomState.players[uKey].score
            });
        }

        io.emit('quizAnswerProgress', {
            answeredCount: answeredP,
            totalPlayersCount: totalP
        });

        // Broadcast updated room state so all clients get real-time live score updates
        io.emit('quizRoomUpdate', getPublicQuizState());

        // Only reveal early if EVERY connected player in room has answered
        if (answeredP >= totalP && totalP > 0) {
            revealQuizQuestionResult();
        }
    });

    socket.on('endMultiplayerQuiz', (data, callback) => {
        let cb = (typeof data === 'function') ? data : callback;
        let token = (data && typeof data === 'object') ? data.hostToken : null;

        const cleanHostName = (quizRoomState.hostName || '').replace(' 😎', '').trim().toLowerCase();
        const cleanUsername = (socket.username || '').replace(' 😎', '').trim().toLowerCase();
        
        const isTokenMatch = !!(token && quizRoomState.hostToken && token === quizRoomState.hostToken);
        const isIdMatch = !!(quizRoomState.hostId && quizRoomState.hostId === socket.id);
        const isNameMatch = !!(cleanHostName && cleanUsername && cleanHostName === cleanUsername);
        const isAdmin = (socket.role === 'admin') || (socket.username && socket.username.includes('😎'));

        if (!isAdmin && !isTokenMatch && !isIdMatch && !isNameMatch) {
            if (typeof cb === 'function') cb({ success: false, message: 'Chỉ Người khởi tạo hoặc Admin mới có quyền kết thúc trò chơi!' });
            return;
        }

        clearQuizTimers();
        quizRoomState.active = false;
        quizRoomState.state = 'lobby';
        quizRoomState.hostToken = null;
        quizRoomState.questions = [];
        quizRoomState.currentIndex = 0;
        quizRoomState.answers = {};
        quizRoomState.players = {};

        io.emit('quizRoomUpdate', getPublicQuizState());
        io.emit('newMessage', {
            id: 'sys-' + Date.now(),
            name: 'Đoán Hình 🧩',
            text: `🛑 Trò chơi Đoán Hình đã bị kết thúc bởi **[${socket.username || quizRoomState.hostName || 'Admin/Host'}]**!`,
            role: 'system'
        });
        if (typeof cb === 'function') cb({ success: true });
    });

    socket.on('adminSaveQuizPacks', (newPacks, callback) => {
        if (socket.role !== 'admin') {
            if (typeof callback === 'function') callback({ success: false, message: 'Chỉ Admin mới có quyền quản lý kho câu hỏi!' });
            return;
        }
        const updatedPacks = saveQuizPacks(newPacks);
        if (typeof callback === 'function') callback({ success: true, packs: updatedPacks });
    });

    // --- Messenger & 1-on-1 Chat Socket Events ---
    socket.on('messenger:init', async (data, callback) => {
        const uId = data?.userId || socket.userId;
        if (uId) {
            socket.userId = uId;
            socket.join('user:' + uId);
            if (!userSockets.has(String(uId))) {
                userSockets.set(String(uId), new Set());
            }
            userSockets.get(String(uId)).add(socket.id);
        }
        const overview = await getMessengerOverview(uId);
        if (typeof callback === 'function') callback(overview);
        else socket.emit('messenger:initResult', overview);
    });

    socket.on('messenger:searchUsers', async (data, callback) => {
        const { query, currentUserId } = data || {};
        const uId = currentUserId || socket.userId;
        const results = await searchMessengerUsers(query, uId);
        if (typeof callback === 'function') callback({ results });
        else socket.emit('messenger:searchUsersResult', { results });
    });

    socket.on('messenger:sendFriendRequest', async (data, callback) => {
        const { senderId, targetUserId } = data || {};
        const sId = senderId || socket.userId;
        const res = await sendFriendRequestDb(sId, targetUserId);
        if (res.success) {
            io.to('user:' + targetUserId).emit('messenger:friendRequestReceived', {
                friendshipId: res.friendship.id,
                sender: res.sender,
                createdAt: res.friendship.created_at
            });
        }
        if (typeof callback === 'function') callback(res);
    });

    socket.on('messenger:respondFriendRequest', async (data, callback) => {
        const { friendshipId, action, userId } = data || {};
        const uId = userId || socket.userId;
        const res = await respondFriendRequestDb(friendshipId, action, uId);
        if (res.success) {
            if (action === 'accept') {
                io.to('user:' + res.friendship.user_id).emit('messenger:friendRequestAccepted', {
                    friendshipId: res.friendship.id,
                    friend: res.user2
                });
                io.to('user:' + res.friendship.friend_id).emit('messenger:friendRequestAccepted', {
                    friendshipId: res.friendship.id,
                    friend: res.user1
                });
            } else {
                io.to('user:' + res.friendship.user_id).emit('messenger:friendRequestDeclined', { friendshipId });
                io.to('user:' + res.friendship.friend_id).emit('messenger:friendRequestDeclined', { friendshipId });
            }
        }
        if (typeof callback === 'function') callback(res);
    });

    socket.on('messenger:unfriend', async (data, callback) => {
        const { userId, friendId } = data || {};
        const uId = userId || socket.userId;
        const res = await unfriendDb(uId, friendId);
        if (res.success) {
            io.to('user:' + uId).emit('messenger:unfriended', { friendId });
            io.to('user:' + friendId).emit('messenger:unfriended', { friendId: uId });
        }
        if (typeof callback === 'function') callback(res);
    });

    socket.on('messenger:sendMessage', async (data, callback) => {
        const { senderId, receiverId, text, mediaUrl, mediaType } = data || {};
        const sId = senderId || socket.userId;
        if (!sId || !receiverId || (!text && !mediaUrl)) {
            if (typeof callback === 'function') callback({ success: false, error: 'Tin nhắn không hợp lệ' });
            return;
        }
        const msg = await saveDirectMessageDb(sId, receiverId, text, mediaUrl, mediaType);
        io.to('user:' + receiverId).emit('messenger:receiveMessage', msg);
        socket.to('user:' + sId).emit('messenger:messageSent', msg);
        if (typeof callback === 'function') {
            callback({ success: true, message: msg });
        } else {
            socket.emit('messenger:messageSent', msg);
        }
    });

    socket.on('messenger:getHistory', async (data, callback) => {
        const { userId, friendId, limit } = data || {};
        const uId = userId || socket.userId;
        const messages = await getDirectMessagesDb(uId, friendId, limit || 60);
        if (typeof callback === 'function') callback({ messages });
        else socket.emit('messenger:historyResult', { friendId, messages });
    });

    socket.on('messenger:markRead', async (data, callback) => {
        const { userId, friendId } = data || {};
        const uId = userId || socket.userId;
        const res = await markDirectMessagesReadDb(uId, friendId);
        io.to('user:' + friendId).emit('messenger:messagesRead', { readerId: uId, friendId });
        if (typeof callback === 'function') callback(res);
    });

    socket.on('messenger:typing', (data) => {
        const { senderId, receiverId, isTyping } = data || {};
        const sId = senderId || socket.userId;
        if (receiverId) {
            io.to('user:' + receiverId).emit('messenger:userTyping', { senderId: sId, isTyping });
        }
    });

    socket.on('disconnect', () => {
        if (socket.userId && userSockets.has(String(socket.userId))) {
            const sSet = userSockets.get(String(socket.userId));
            sSet.delete(socket.id);
            if (sSet.size === 0) {
                userSockets.delete(String(socket.userId));
                io.emit('messenger:userOnline', { userId: socket.userId, online: false });
            }
        }
        if (typingUsers.has(socket.id)) {
            const existing = typingUsers.get(socket.id);
            if (existing && existing.timer) clearTimeout(existing.timer);
            typingUsers.delete(socket.id);
            broadcastTypingUsers();
        }
        connectedUsers.delete(socket.id);
        io.emit('activeUsersList', getDrawUserList());
        io.emit('viewersUpdate', io.engine.clientsCount);
        if (drawGame.active && socket.id === drawGame.drawerId && drawGame.state === 'playing') {
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Trò chơi 🎨', text: `😢 Người vẽ đã rời phòng! Kết thúc lượt.`, role: 'system' });
            endDrawRound();
        }
        if (drawGame.active) io.emit('drawUsersUpdate', getDrawUserList());
        if (socket.username) {
            io.emit('newMessage', { id: 'sys-' + Date.now(), name: 'Hệ thống 🤖', text: `🏃‍♂️ [${socket.username}] đã rời phòng.`, role: 'system' });
        }

        if (caroGame.playerX === socket.id || caroGame.playerO === socket.id) {
            if (caroGame.playerX === socket.id) { caroGame.playerX = null; caroGame.playerXName = ''; }
            if (caroGame.playerO === socket.id) { caroGame.playerO = null; caroGame.playerOName = ''; }
            if (!caroGame.playerX && !caroGame.playerO) {
                caroGame.board = Array(15).fill(null).map(() => Array(15).fill(null));
                caroGame.turn = 'X';
                caroGame.winner = null;
            }
            io.emit('caroUpdate', caroGame);
        }

        if (chessGame.playerW === socket.id || chessGame.playerB === socket.id) {
            if (chessGame.playerW === socket.id) { chessGame.playerW = null; chessGame.playerWName = ''; }
            if (chessGame.playerB === socket.id) { chessGame.playerB = null; chessGame.playerBName = ''; }
            if (!chessGame.playerW && !chessGame.playerB) {
                chessGame.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
                chessGame.winner = null;
            }
            io.emit('chessUpdate', chessGame);
        }
        if (xiangqiGame.playerR === socket.id || xiangqiGame.playerB === socket.id) {
            xiangqiGame.playerR = null; xiangqiGame.playerB = null;
            xiangqiGame.winner = null;
            xiangqiGame.board = initXiangqiBoard();
            io.emit('xiangqiUpdate', xiangqiGame);
        }

        const unoPlayerIdx = unoGame.players.findIndex(p => p.id === socket.id);
        if (unoPlayerIdx !== -1) {
            unoGame.players.splice(unoPlayerIdx, 1);
            if (unoGame.players.length < 2) unoGame.active = false;
            io.emit('unoUpdate', getPublicUnoState());
        }

        if (quizRoomState.active) {
            const totalP = Math.max(io.engine ? io.engine.clientsCount : 1, connectedUsers.size, Object.keys(quizRoomState.players).length, 1);
            const answeredP = Object.keys(quizRoomState.answers).length;
            io.emit('quizAnswerProgress', {
                answeredCount: answeredP,
                totalPlayersCount: totalP
            });
            if (quizRoomState.state === 'question' && answeredP >= totalP && totalP > 0) {
                revealQuizQuestionResult();
            }
        }
        if (io.engine && io.engine.clientsCount === 0 && quizRoomState.active) {
            clearQuizTimers();
            quizRoomState.active = false;
            quizRoomState.state = 'lobby';
        }
    });
});

// Phục vụ Web tĩnh Monkeytype
const monkeytypePath = path.join(__dirname, '../monkeytype');

// Tự động thêm / ở cuối nếu thiếu (tránh lỗi relative path /js/, /languages/)
app.use((req, res, next) => {
    if (req.path === '/monkeytype' || req.path === '/tools/chung/monkeytype') {
        return res.redirect(301, req.path + '/');
    }
    next();
});

app.use('/monkeytype', express.static(monkeytypePath));
app.use('/tools/chung/monkeytype', express.static(monkeytypePath));

// Fallback các thư mục tài nguyên tĩnh nếu trình duyệt gọi trực tiếp từ root /
app.use('/js', express.static(path.join(monkeytypePath, 'js')));
app.use('/css', express.static(path.join(monkeytypePath, 'css')));
app.use('/languages', express.static(path.join(monkeytypePath, 'languages')));
app.use('/layouts', express.static(path.join(monkeytypePath, 'layouts')));
app.use('/webfonts', express.static(path.join(monkeytypePath, 'webfonts')));

app.get(['/monkeytype/*', '/tools/chung/monkeytype/*'], (req, res) => {
    res.sendFile(path.join(monkeytypePath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server chạy tại port ${PORT}`);
});

