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
      title: "Exit Sign",
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
  av.onended = playNext;

  // Đăng ký sự kiện
  eventBus.on('play', () => {
    av.source ? av.togglePlay() : av.play(PLAY_LIST[i], false);
  });
  eventBus.on('prev', playPrev);
  eventBus.on('next', playNext);

  // Phát bài trước
  function playPrev() {
    i -= 1;
    if (i < 0) i = PLAY_LIST.length - 1;
    av.play(PLAY_LIST[i]);
  }

  // Phát bài tiếp theo
  function playNext() {
    i += 1;
    if (i >= PLAY_LIST.length) i = 0;
    av.play(PLAY_LIST[i]);
  }
  
  // Dự phòng sử dụng HTML5 Audio
  const audioFallback = document.createElement('audio');
  audioFallback.id = 'audio-fallback';
  document.body.appendChild(audioFallback);
  
  audioFallback.addEventListener('error', function(e) {
    console.error('Lỗi phát nhạc:', e);
    alert('Không thể phát file nhạc. Vui lòng đảm bảo các file nhạc đã được đặt vào thư mục nhac/.');
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