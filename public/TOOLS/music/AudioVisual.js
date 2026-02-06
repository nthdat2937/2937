class AudioVisual {
  constructor (options) {
    this.canvas = document.querySelector('#music-canvas')
    this.ctx = this.canvas.getContext('2d')

    this.ac = new AudioContext()
    this.analyser = this.ac.createAnalyser()
    this.analyser.fftSize = 128
    
    // Tạo GainNode để điều chỉnh âm lượng
    this.gainNode = this.ac.createGain()
    this.gainNode.gain.value = parseFloat(localStorage.getItem('musicVolume') || '1')
    
    // Kết nối: source -> analyser -> gainNode -> destination
    this.analyser.connect(this.gainNode)
    this.gainNode.connect(this.ac.destination)

    this.sourceDuration = 0
    this.startTime = 0
    this.loading = false
    this.started = false
    this.songInfo = null

    // Thiết lập mặc định cho hiệu ứng âm thanh
    this.opt = {
      centerX: 0.5,
      centerY: 0.7,
      lineWidth: 6,
      lineSpacing: 2,
      lineColor: '#ffffff',
      lineColorO: 1,
      shadowColor: '#231018',
      shadowColorO: 1,
      shadowBlur: 2,
      isRound: true
    }

    this.resizeCavnas()
    window.addEventListener('resize', this.resizeCavnas.bind(this))
  }

  colorToRGB (color) {
    if (color.length !== 7 && !color.startsWith('#')) return [0, 0, 0]
    let rgb = []
    color = color.replace('#', '')
    for (let i = 0; i < 3; i++) {
      rgb.push(parseInt(color.substring(i * 2, i * 2 + 2), 16))
    }
    return rgb
  }

  async loadData () {
    const { songInfo } = this
    
    this.loading = true

    eventBus.emit('init', songInfo)
    eventBus.emit('change', {
      state: "loading",
      duration: "00.00",
      currentTime: "00.00",
    })

    try {
      // Sử dụng XMLHttpRequest để tải file nhạc
      const xhr = new XMLHttpRequest();
      xhr.open('GET', songInfo.url, true);
      xhr.responseType = 'arraybuffer';
      
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 0) { // Status 0 cho local file
          this.processAudioBuffer(xhr.response);
        } else {
          throw new Error('Không thể tải file nhạc');
        }
      };
      
      xhr.onerror = (error) => {
        console.error('Lỗi khi tải file nhạc:', error);
        this.loadingError();
      };
      
      xhr.send();
    } catch (error) {
      console.error('Lỗi khi tải file nhạc:', error);
      this.loadingError();
    }
  }
  
  loadingError() {
    this.loading = false;
    eventBus.emit('change', {
      state: "error",
      duration: "T_T",
      currentTime: "T_T",
    });
    alert("Không thể tải file nhạc, vui lòng kiểm tra đường dẫn file và đảm bảo file nhạc tồn tại");
    
    // Thử phương pháp khác sử dụng thẻ audio
    this.tryAudioElementFallback();
  }
  
  tryAudioElementFallback() {
    const { songInfo } = this;
    
    try {
      // Tạo một Audio element
      const audio = document.getElementById('audio-fallback') || document.createElement('audio');
      audio.src = songInfo.url;
      audio.controls = false;
      
      audio.oncanplaythrough = () => {
        console.log('Đã tải file nhạc bằng Audio element');
        // Kết nối với AudioContext
        if (!this.mediaSource) {
          this.mediaSource = this.ac.createMediaElementSource(audio);
          this.mediaSource.connect(this.analyser);
        }
        
        audio.play().then(() => {
          this.loading = false;
          this.started = true;
          this.startTime = this.ac.currentTime;
          this.refreshUI();
          
          // Thêm một element tượng trưng để xử lý onended
          this.source = {
            buffer: {
              duration: audio.duration
            },
            onended: () => {
              this.onended && this.onended();
            }
          };
          
          // Thêm sự kiện ended cho audio
          audio.onended = () => {
            this.source.onended();
          };
        }).catch(error => {
          console.error('Không thể phát nhạc:', error);
          alert("Không thể phát nhạc. Trình duyệt có thể không cho phép tự động phát nhạc, vui lòng nhấn play.");
        });
      };
      
      audio.onerror = () => {
        console.error('Không thể tải file nhạc bằng Audio element');
        alert("Không thể tải file nhạc. Vui lòng kiểm tra đường dẫn file và đảm bảo file nhạc tồn tại");
      };
      
      if (!document.getElementById('audio-fallback')) {
        audio.id = 'audio-fallback';
        audio.style.display = 'none';
        document.body.appendChild(audio);
      }
      
      audio.load();
    } catch (error) {
      console.error('Lỗi khi sử dụng Audio element:', error);
    }
  }
  
  processAudioBuffer(arrayBuffer) {
    try {
      const { ac, analyser } = this;
      this.source = ac.createBufferSource();
      
      ac.decodeAudioData(arrayBuffer, buffer => {
        if (!this.source) return;
        this.source.buffer = buffer;
        this.source.connect(analyser);
        this.source.start(0);
        this.source.onended = () => {
          this.onended && this.onended();
        };
        this.loading = false;
        this.started = true;
        this.startTime = ac.currentTime;
        this.refreshUI();
      }, error => {
        console.error('Lỗi khi giải mã audio:', error);
        this.loadingError();
      });
    } catch (error) {
      console.error('Lỗi khi xử lý audio buffer:', error);
      this.loadingError();
    }
  }

  stop () {
    let { source, started } = this
    if (source && started) {
      source.onended = null
      if (source.stop) {
        source.stop()
      }
    }
    
    // Nếu đang dùng Audio element
    const audioElement = document.getElementById('audio-fallback');
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    
    this.source = null
    this.started = false
  }

  play (music, isReload = true) {
    if (!isReload && this.loading) return console.log("loading...")
    this.songInfo = music
    this.stop()
    this.loadData(music)
  }

  togglePlay () {
    const { ac } = this
    const audioElement = document.getElementById('audio-fallback');
    
    if (ac.state === 'running') {
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
      }
      ac.suspend().then(() => {
        // Emit event để cập nhật UI
        eventBus.emit('change', {
          state: 'suspended',
          duration: this.source?.buffer?.duration || audioElement?.duration || 0,
          currentTime: audioElement?.currentTime || (ac.currentTime - this.startTime) || 0
        });
      });
      return;
    }
    if (ac.state === 'suspended') {
      if (audioElement && audioElement.paused) {
        audioElement.play();
      }
      ac.resume().then(() => {
        // Emit event để cập nhật UI
        eventBus.emit('change', {
          state: 'running',
          duration: this.source?.buffer?.duration || audioElement?.duration || 0,
          currentTime: audioElement?.currentTime || (ac.currentTime - this.startTime) || 0
        });
      });
      return;
    }
  }

  resizeCavnas () {
    const { canvas } = this
    this.cw = canvas.width = canvas.clientWidth
    this.ch = canvas.height = canvas.clientHeight
  }

  draw () {
    const { ctx, cw, ch, analyser } = this
    const { lineColor, lineColorO, shadowColor, shadowColorO, shadowBlur, lineWidth, lineSpacing, isRound } = this.opt

    let bufferLen = analyser.frequencyBinCount
    let buffer = new Uint8Array(bufferLen)
    analyser.getByteFrequencyData(buffer)

    let cx = this.cw * this.opt.centerX
    let cy = this.ch * this.opt.centerY
    let sp = (lineWidth + lineSpacing) / 2
    
    // Kiểm tra nếu kích thước màn hình nhỏ, giảm số lượng đường vẽ
    const isMobile = window.innerWidth <= 768
    const maxLines = isMobile ? Math.min(bufferLen, 32) : bufferLen
    const mobileLineWidth = isMobile ? lineWidth * 0.8 : lineWidth
    const mobileSpacing = isMobile ? lineSpacing * 0.8 : lineSpacing
    
    ctx.clearRect(0, 0, cw, ch)
    ctx.beginPath()
    ctx.lineWidth = mobileLineWidth
    ctx.shadowBlur = isMobile ? 10 : 15
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
    if (isRound) {
      ctx.lineCap = "round"
    } else {
      ctx.lineCap = "butt"
    }
  
    for (let i = 0; i < maxLines; i++) {
      let h = buffer[i] + 1
      let xl = cx - i * (mobileLineWidth + mobileSpacing) - sp
      let xr = cx + i * (mobileLineWidth + mobileSpacing) + sp
      let y1 = cy - h / 2
      let y2 = cy + h / 2
      ctx.moveTo(xl, y1)
      ctx.lineTo(xl, y2)
      ctx.moveTo(xr, y1)
      ctx.lineTo(xr, y2)
    }

    ctx.stroke()
    
    ctx.beginPath()
    ctx.lineWidth = mobileLineWidth - 2
    ctx.shadowBlur = isMobile ? 15 : 25
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.shadowColor = 'rgba(255, 255, 255, 1)'
    
    for (let i = 0; i < maxLines; i++) {
      let h = buffer[i] + 1
      let xl = cx - i * (mobileLineWidth + mobileSpacing) - sp
      let xr = cx + i * (mobileLineWidth + mobileSpacing) + sp
      let y1 = cy - h / 2
      let y2 = cy + h / 2
      ctx.moveTo(xl, y1)
      ctx.lineTo(xl, y2)
      ctx.moveTo(xr, y1)
      ctx.lineTo(xr, y2)
    }
    
    ctx.stroke()
    ctx.closePath()
  }

  refreshUI () {
    const { ac: { state, currentTime }, source, loading, started, startTime } = this
    this.draw()
    try {
      if (state === 'running' && !loading && started) {
        // Nếu đang sử dụng Audio element
        const audioElement = document.getElementById('audio-fallback');
        if (audioElement && !audioElement.paused && this.mediaSource) {
          // Đảm bảo thời gian hiện tại được làm tròn đến 2 chữ số thập phân
          const preciseCurrentTime = parseFloat(audioElement.currentTime.toFixed(2));
          
          eventBus.emit('change', {
            state,
            duration: audioElement.duration,
            currentTime: preciseCurrentTime,
          });
        } else if (source && source.buffer) {
          // Đảm bảo thời gian hiện tại được làm tròn đến 2 chữ số thập phân
          const preciseCurrentTime = parseFloat((currentTime - startTime).toFixed(2));
          
          eventBus.emit('change', {
            state,
            duration: source.buffer.duration,
            currentTime: preciseCurrentTime,
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật UI:', error);
    }
    requestAnimationFrame(this.refreshUI.bind(this))
  }

  // Thêm phương thức seek để tua nhạc
  seek(seconds) {
    const audioElement = document.getElementById('audio-fallback');
    
    if (audioElement && this.mediaSource) {
      // Sử dụng Audio element - đơn giản hơn nhiều
      const newTime = Math.max(0, Math.min(audioElement.currentTime + seconds, audioElement.duration));
      audioElement.currentTime = newTime;
    } else if (this.source && this.source.buffer && this.started) {
      // Với AudioBufferSourceNode, cần xử lý cẩn thận
      const currentTime = this.ac.currentTime - this.startTime;
      const duration = this.source.buffer.duration;
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
      
      // Lưu trạng thái
      const wasPlaying = this.ac.state === 'running';
      const oldBuffer = this.source.buffer;
      
      // Dừng source cũ
      try {
        this.source.onended = null; // Xóa event handler cũ
        this.source.stop();
      } catch(e) {
        console.log('Source đã dừng rồi');
      }
      
      // Tạo source mới
      this.source = this.ac.createBufferSource();
      this.source.buffer = oldBuffer;
      this.source.connect(this.analyser);
      
      // Set lại thời gian bắt đầu
      this.startTime = this.ac.currentTime - newTime;
      
      // Đăng ký lại event onended
      this.source.onended = () => {
        if (this.onended) this.onended();
      };
      
      // Start từ vị trí mới
      try {
        this.source.start(0, newTime);
        
        // Nếu đang pause thì suspend lại
        if (!wasPlaying) {
          this.ac.suspend();
        }
      } catch(e) {
        console.error('Lỗi khi start source:', e);
      }
    }
  }
  
  // Thêm phương thức điều chỉnh âm lượng
  changeVolume(direction) {
    const volumeSlider = document.getElementById('volumeSlider');
    if (!volumeSlider) return;
    
    const currentVolume = parseInt(volumeSlider.value);
    let newVolume;
    
    if (direction === 'up') {
      newVolume = Math.min(100, currentVolume + 10); // Tăng 10%
    } else {
      newVolume = Math.max(0, currentVolume - 10); // Giảm 10%
    }
    
    volumeSlider.value = newVolume;
    
    // Cập nhật âm lượng thực tế
    this.gainNode.gain.value = newVolume / 100;
    localStorage.setItem('musicVolume', (newVolume / 100).toString());
    
    // Cập nhật icon
    const volumeIcon = document.getElementById('volumeIconMaterial');
    if (volumeIcon) {
      if (newVolume === 0) {
        volumeIcon.textContent = 'volume_off';
      } else if (newVolume < 50) {
        volumeIcon.textContent = 'volume_down';
      } else {
        volumeIcon.textContent = 'volume_up';
      }
    }
    
    // Cập nhật cho audio element nếu đang dùng
    const audioElement = document.getElementById('audio-fallback');
    if (audioElement) {
      audioElement.volume = newVolume / 100;
    }
  }
}