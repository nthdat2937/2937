async function load_list_text(page, lang, mode) {
    if (typeof window.sp === 'undefined') {
        setTimeout(() => load_list_text(page, lang, mode), 500);
        return;
    }

    let query = window.sp.from('practice_texts').select('*', { count: 'exact' });

    if (lang && lang !== 'all' && lang !== '') {
        query = query.eq('lang', lang);
    }
    
    // Default to public texts only for the public feed
    query = query.eq('is_private', false);

    if (mode === 1) {
        query = query.order('completions', { ascending: false, nullsFirst: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const limit = 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end);

    const { data, error, count } = await query;

    if (error) {
        console.error('Lỗi khi tải danh sách văn bản:', error);
        return;
    }

    let html = '';
    if (data && data.length > 0) {
        data.forEach((item, index) => {
            const rank = start + index + 1;
            const d = new Date(item.created_at);
            const timeStr = !isNaN(d) ? d.toLocaleDateString('vi-VN') : '';
            let practiceUrl = window.location.pathname.includes('/text-practice/') ? '../practice.html' : './practice.html';
            html += `
                <tr>
                    <td>${rank}</td>
                    <td>⭐ ${item.rating || '5.0'}</td>
                    <td><a href="${practiceUrl}?id=${item.id}" style="color: #007bff; font-weight: bold; text-decoration: none;">${item.title || 'Văn bản luyện tập'}</a></td>
                    <td>${item.length || (item.content ? item.content.length : 0)} ký tự</td>
                    <td>${item.completions || 0} lần</td>
                    <td>${timeStr}</td>
                </tr>
            `;
        });
    } else {
        html = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Không có văn bản nào.</td></tr>';
    }

    if (page == 1) {
        $('#tableListText tbody').html(html);
    } else {
        $('#tableListText tbody').append(html);
    }

    if (count > end + 1) {
        $('.pagination').html('<button class="btn btn-primary btn-more-result">Xem thêm</button>');
    } else {
        $('.pagination').html('');
    }
}