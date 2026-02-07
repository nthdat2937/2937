window.onload = function () {
  // Danh sách nhạc local
  const PLAY_LIST = [
    {
      id: "moiem", // Thêm id để mapping với URL
      title: "MOIEM - DANGRANGTO",
      url: "nhac/moiem.mp3",
      cover: "image/moiem.png",
      lrc: "lyric/moiem.lrc"
    },
    {
      id: "exitsign", // Thêm id cho bài Exit Sign
      title: "Exit Sign - HIEUTHUHAI",
      url: "nhac/exitsign.mp3",
      cover: "image/exitsign.png",
      lrc: "lyric/exitsign.lrc"
    },
    {
      id: "12",
      title: "1/2 - DANGRANGTO",
      url: "nhac/12.mp3",
      cover: "image/12.png",
      lrc: "lyric/12.lrc"
    },
    {
      id: "enjoycaimomentnay",
      title: "Enjoy Cái Moment Này - TEZ",
      url: "nhac/enjoycaimomentnay.mp3",
      cover: "image/enjoycaimomentnay.png",
      lrc: "lyric/enjoycaimomentnay.lrc"
    },
    {
      id: "144",
      title: "144 - Wren Evans",
      url: "nhac/144.mp3",
      cover: "image/144.png",
      lrc: "lyric/144.lrc"
    },
    {
      id: "congidephon",
      title: "Còn Gì Đẹp Hơn - Nguyễn Hùng",
      url: "nhac/congidephon.mp3",
      cover: "image/congidephon.png",
      lrc: "lyric/congidephon.lrc"
    },
    {
      id: "mashuprockthiephong",
      title: "Mashup Rock Thiệp Hồng - Đào Tử, Yeolan, Mười, Maiqueen, Tóc Tiên",
      url: "nhac/mashuprockthiephong.mp3",
      cover: "image/mashuprockthiephong.png",
      lrc: "lyric/mashuprockthiephong.lrc"
    },
    {
      id: "haruharu",
      title: "하루하루 - BIGBANG",
      url: "nhac/하루하루.mp3",
      cover: "image/하루하루.png",
      lrc: "lyric/하루하루.lrc"
    },
    {
      id: "vuatimthaydadanhmat",
      title: "Vừa Tìm Thấy Đã Đánh Mất - Wren Evans",
      url: "nhac/vuatimthaydadanhmat.mp3",
      cover: "image/vuatimthaydadanhmat.png",
      lrc: "lyric/vuatimthaydadanhmat.lrc"
    },
    {
      id: "anhlathangtoi",
      title: "Anh Là Thằng Tồi - Phùng Khánh Linh",
      url: "nhac/anhlathangtoi.mp3",
      cover: "image/anhlathangtoi.png",
      lrc: "lyric/anhlathangtoi.lrc"
    },
    // {
      // id: "*",
      // title: "",
      // url: "nhac/*.mp3",
      // cover: "image/*.png",
      // lrc: "lyric/*.lrc"
    // },
    // Thêm các bài hát khác ở đây với id tương ứng
  ];
  
  if (!PLAY_LIST) return alert('Không thể tải thông tin bài hát!');

  // Hàm lấy tham số từ URL
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Kiểm tra tham số 'data' trong URL
  const songId = getUrlParameter('data');
  let i = 0; // Index mặc định
  
  if (songId) {
    // Tìm bài hát theo id
    const foundIndex = PLAY_LIST.findIndex(song => song.id === songId);
    if (foundIndex !== -1) {
      i = foundIndex;
      console.log(`Phát bài hát: ${PLAY_LIST[i].title} từ URL parameter`);
    } else {
      console.log(`Không tìm thấy bài hát với id: ${songId}, sẽ phát bài ngẫu nhiên`);
      i = Math.floor(Math.random() * PLAY_LIST.length);
    }
  } else {
    // Nếu không có tham số, chọn ngẫu nhiên
    i = Math.floor(Math.random() * PLAY_LIST.length);
  }

  // Thu thập tất cả các cover image
  const coverImages = PLAY_LIST.map(song => song.cover);

  // Khởi tạo hình nền
  dv = new DomVisual(coverImages);
  
  // Khởi tạo Audio
  av = new AudioVisual();
  
  // Biến quản lý chế độ lặp: 'none', 'all', 'one'
  let loopMode = localStorage.getItem('loopMode') || 'none';
  
  // Biến quản lý chế độ shuffle
  let shuffleMode = localStorage.getItem('shuffleMode') === 'true';
  let playHistory = []; // Lịch sử các bài đã phát khi shuffle
  
  // Hàm xử lý khi bài hát kết thúc
  av.onended = function() {
    if (loopMode === 'one') {
      // Lặp lại bài hiện tại
      av.play(PLAY_LIST[i]);
    } else {
      // Chuyển bài tiếp theo (hoặc lặp lại danh sách nếu loopMode = 'all')
      playNext();
    }
  };

  // Đăng ký sự kiện
  eventBus.on('play', () => {
    av.source ? av.togglePlay() : av.play(PLAY_LIST[i], false);
  });
  eventBus.on('prev', playPrev);
  eventBus.on('next', playNext);
  
  // Đăng ký sự kiện cho phím tắt
  eventBus.on('seek', (seconds) => {
    console.log('Event seek nhận được:', seconds);
    if (av && av.started) {
      console.log('Gọi av.seek với:', seconds);
      av.seek(seconds);
    } else {
      console.log('av chưa started:', av?.started);
    }
  });
  
  eventBus.on('volume', (direction) => {
    if (av) {
      av.changeVolume(direction);
    }
  });

  // Phát bài trước
  function playPrev() {
    if (shuffleMode && playHistory.length > 0) {
      // Nếu đang shuffle và có lịch sử, phát bài trước đó
      i = playHistory.pop();
    } else {
      // Phát tuần tự bình thường
      i -= 1;
      if (i < 0) i = PLAY_LIST.length - 1;
    }
    av.play(PLAY_LIST[i]);
    updatePlaylistActive();
  }

  // Phát bài tiếp theo
  function playNext() {
    if (shuffleMode) {
      // Chế độ shuffle
      playHistory.push(i); // Lưu bài hiện tại vào lịch sử
      
      // Tạo danh sách bài chưa phát
      let availableSongs = [];
      for (let idx = 0; idx < PLAY_LIST.length; idx++) {
        if (idx !== i) {
          availableSongs.push(idx);
        }
      }
      
      // Nếu đã phát hết tất cả bài
      if (availableSongs.length === 0) {
        if (loopMode === 'all') {
          // Reset lịch sử và chọn ngẫu nhiên
          playHistory = [];
          i = Math.floor(Math.random() * PLAY_LIST.length);
        } else if (loopMode === 'none') {
          // Dừng phát
          i = 0;
          av.stop();
          return;
        }
      } else {
        // Chọn ngẫu nhiên từ danh sách chưa phát
        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        i = availableSongs[randomIndex];
      }
    } else {
      // Chế độ phát tuần tự bình thường
      i += 1;
      if (i >= PLAY_LIST.length) {
        if (loopMode === 'all') {
          i = 0; // Lặp lại từ đầu
        } else if (loopMode === 'none') {
          i = 0; // Về đầu nhưng không tự động phát
          av.stop();
          return;
        } else {
          i = 0;
        }
      }
    }
    
    av.play(PLAY_LIST[i]);
    updatePlaylistActive();
  }
  
  // Xử lý playlist menu
  const playlistToggle = document.getElementById('playlistToggle');
  const playlistMenu = document.getElementById('playlistMenu');
  const playlistContent = document.getElementById('playlistContent');
  const cardWrap = document.querySelector('.card-wrap');
  
  // Toggle playlist menu
  playlistToggle.addEventListener('click', () => {
    playlistMenu.classList.toggle('show');
    playlistToggle.classList.toggle('active');
    // Toggle class cho card-wrap để thu nhỏ
    cardWrap.classList.toggle('playlist-open');
  });
  
  // Xử lý nút loop
  const loopBtn = document.getElementById('loopBtn');
  
  // Hàm cập nhật UI của nút loop
  function updateLoopButton() {
    loopBtn.classList.remove('loop-all', 'loop-one');
    
    if (loopMode === 'all') {
      loopBtn.classList.add('loop-all');
      loopBtn.title = 'Lặp lại tất cả';
    } else if (loopMode === 'one') {
      loopBtn.classList.add('loop-one');
      loopBtn.title = 'Lặp lại một bài';
    } else {
      loopBtn.title = 'Không lặp lại';
    }
  }
  
  // Khởi tạo UI nút loop
  updateLoopButton();
  
  // Xử lý click nút loop
  loopBtn.addEventListener('click', () => {
    // Chuyển đổi giữa 3 chế độ: none -> all -> one -> none
    if (loopMode === 'none') {
      loopMode = 'all';
    } else if (loopMode === 'all') {
      loopMode = 'one';
    } else {
      loopMode = 'none';
    }
    
    // Lưu vào localStorage
    localStorage.setItem('loopMode', loopMode);
    
    // Cập nhật UI
    updateLoopButton();
    
    console.log('Chế độ lặp:', loopMode);
  });
  
  // Xử lý nút shuffle
  const shuffleBtn = document.getElementById('shuffleBtn');
  
  // Hàm cập nhật UI của nút shuffle
  function updateShuffleButton() {
    if (shuffleMode) {
      shuffleBtn.classList.add('active');
      shuffleBtn.title = 'Tắt phát ngẫu nhiên';
    } else {
      shuffleBtn.classList.remove('active');
      shuffleBtn.title = 'Bật phát ngẫu nhiên';
    }
  }
  
  // Khởi tạo UI nút shuffle
  updateShuffleButton();
  
  // Xử lý click nút shuffle
  shuffleBtn.addEventListener('click', () => {
    shuffleMode = !shuffleMode;
    
    // Lưu vào localStorage
    localStorage.setItem('shuffleMode', shuffleMode);
    
    // Reset lịch sử khi bật/tắt shuffle
    playHistory = [];
    
    // Cập nhật UI
    updateShuffleButton();
    
    console.log('Chế độ shuffle:', shuffleMode);
  });
  
  // Tạo danh sách phát
  function createPlaylist() {
    playlistContent.innerHTML = '';
    PLAY_LIST.forEach((song, index) => {
      const item = document.createElement('div');
      item.className = 'playlist-item';
      if (index === i) {
        item.classList.add('active');
      }
      
      item.innerHTML = `
        <div class="playlist-item-cover" style="background-image: url('${song.cover}')"></div>
        <div class="playlist-item-info">
          <div class="playlist-item-title">${song.title}</div>
          <div class="playlist-item-index">#${index + 1}</div>
        </div>
        ${index === i ? '<div class="playlist-item-playing"><span class="material-icons">equalizer</span></div>' : ''}
      `;
      
      item.addEventListener('click', () => {
        i = index;
        av.play(PLAY_LIST[i]);
        updatePlaylistActive();
      });
      
      playlistContent.appendChild(item);
    });
  }
  
  // Cập nhật bài đang phát trong playlist
  function updatePlaylistActive() {
    const items = playlistContent.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
      if (index === i) {
        item.classList.add('active');
        item.innerHTML = `
          <div class="playlist-item-cover" style="background-image: url('${PLAY_LIST[index].cover}')"></div>
          <div class="playlist-item-info">
            <div class="playlist-item-title">${PLAY_LIST[index].title}</div>
            <div class="playlist-item-index">#${index + 1}</div>
          </div>
          <div class="playlist-item-playing"><span class="material-icons">equalizer</span></div>
        `;
      } else {
        item.classList.remove('active');
        item.innerHTML = `
          <div class="playlist-item-cover" style="background-image: url('${PLAY_LIST[index].cover}')"></div>
          <div class="playlist-item-info">
            <div class="playlist-item-title">${PLAY_LIST[index].title}</div>
            <div class="playlist-item-index">#${index + 1}</div>
          </div>
        `;
      }
    });
  }
  
  // Khởi tạo playlist
  createPlaylist();
  
  // Dự phòng sử dụng HTML5 Audio
  const audioFallback = document.createElement('audio');
  audioFallback.id = 'audio-fallback';
  document.body.appendChild(audioFallback);
  
  audioFallback.addEventListener('error', function(e) {
    // Chỉ hiện lỗi nếu audio element có src (đang cố tải file)
    // Không hiện lỗi khi src bị xóa (đang dọn dẹp)
    if (audioFallback.src && audioFallback.src !== '' && audioFallback.src !== window.location.href) {
      console.error('Lỗi phát nhạc:', e);
      alert('Không thể phát file nhạc. Vui lòng đảm bảo các file nhạc đã được đặt vào thư mục nhac/.');
    }
  });

  // Thêm điều khiển bằng phím tắt
  document.addEventListener('keydown', function(e) {
    // Ngăn chặn hành vi mặc định của các phím
    const keyActions = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
    if (keyActions.includes(e.key)) {
      e.preventDefault();
      console.log('Phím được nhấn:', e.key, 'Ctrl:', e.ctrlKey);
    }

    // Shift - Toggle danh sách phát
    if (e.key === 'Shift') {
      e.preventDefault();
      playlistMenu.classList.toggle('show');
      playlistToggle.classList.toggle('active');
      cardWrap.classList.toggle('playlist-open');
      console.log('Toggle playlist');
      return;
    }

    // Ctrl + mũi tên trái/phải để chuyển bài
    if (e.ctrlKey && e.key === 'ArrowLeft') {
      console.log('Emit: prev');
      eventBus.emit('prev');
      return;
    }
    
    if (e.ctrlKey && e.key === 'ArrowRight') {
      console.log('Emit: next');
      eventBus.emit('next');
      return;
    }

    switch(e.key) {
      case ' ': // Space - Phát/Tạm dừng
        console.log('Emit: play');
        eventBus.emit('play');
        break;
        
      case 'ArrowLeft': // Mũi tên trái - Lùi 5 giây
        if (!e.ctrlKey) {
          console.log('Emit: seek -5');
          eventBus.emit('seek', -5);
        }
        break;
        
      case 'ArrowRight': // Mũi tên phải - Tiến 5 giây
        if (!e.ctrlKey) {
          console.log('Emit: seek +5');
          eventBus.emit('seek', 5);
        }
        break;
        
      case 'ArrowUp': // Mũi tên lên - Tăng âm lượng
        console.log('Emit: volume up');
        eventBus.emit('volume', 'up');
        break;
        
      case 'ArrowDown': // Mũi tên xuống - Giảm âm lượng
        console.log('Emit: volume down');
        eventBus.emit('volume', 'down');
        break;
    }
  });
}

// Event Bus
const eventBus = {
  events: {},
  on(event, fn) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn);
  },
  emit() {
    let e = this.events[[].shift.call(arguments)];
    if (!e || e.length < 1) return;
    e.forEach(fn => {
      fn.apply(this, arguments);
    });
  }
};