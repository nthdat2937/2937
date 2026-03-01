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
    
    // Tracking bài hát hiện tại để tránh chồng nhạc
    this.currentSongUrl = null
    
    // Màu động cho visualizer
    this.dynamicColor = { r: 255, g: 255, b: 255 }

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
    
    // Khởi tạo particles
    this.particles = []
    this.maxParticles = 30 // Giới hạn số lượng particles
    
    // Khởi tạo wave points
    this.wavePoints = []
    this.waveOffset = 0

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
    
    // Đánh dấu URL bài hát hiện tại
    const currentUrl = songInfo.url
    this.currentSongUrl = currentUrl
    
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
        // Kiểm tra xem đây có còn là bài hát hiện tại không
        if (this.currentSongUrl !== currentUrl) {
          console.log('Bài hát đã thay đổi, bỏ qua request cũ');
          return;
        }
        
        if (xhr.status === 200 || xhr.status === 0) { // Status 0 cho local file
          this.processAudioBuffer(xhr.response, currentUrl);
        } else {
          throw new Error('Không thể tải file nhạc');
        }
      };
      
      xhr.onerror = (error) => {
        // Chỉ xử lý lỗi nếu đây vẫn là bài hát hiện tại
        if (this.currentSongUrl === currentUrl) {
          console.error('Lỗi khi tải file nhạc:', error);
          this.loadingError();
        }
      };
      
      xhr.send();
    } catch (error) {
      if (this.currentSongUrl === currentUrl) {
        console.error('Lỗi khi tải file nhạc:', error);
        this.loadingError();
      }
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
  
  processAudioBuffer(arrayBuffer, currentUrl) {
    try {
      const { ac, analyser } = this;
      
      // Kiểm tra lại trước khi decode
      if (this.currentSongUrl !== currentUrl) {
        console.log('Bài hát đã thay đổi trong lúc decode, bỏ qua');
        return;
      }
      
      this.source = ac.createBufferSource();
      
      ac.decodeAudioData(arrayBuffer, buffer => {
        // Kiểm tra lại sau khi decode xong
        if (this.currentSongUrl !== currentUrl) {
          console.log('Bài hát đã thay đổi sau khi decode, bỏ qua');
          return;
        }
        
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
        if (this.currentSongUrl === currentUrl) {
          console.error('Lỗi khi giải mã audio:', error);
          this.loadingError();
        }
      });
    } catch (error) {
      if (this.currentSongUrl === currentUrl) {
        console.error('Lỗi khi xử lý audio buffer:', error);
        this.loadingError();
      }
    }
  }

  stop () {
    console.log('Đang dừng nhạc...');
    
    let { source, started } = this
    
    // Dừng BufferSource nếu có
    if (source && started) {
      source.onended = null
      try {
        if (source.stop) {
          source.stop()
        }
        if (source.disconnect) {
          source.disconnect()
        }
      } catch (e) {
        console.log('Source đã dừng rồi');
      }
    }
    
    // Dừng Audio element nếu có
    const audioElement = document.getElementById('audio-fallback');
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      // KHÔNG xóa src để tránh trigger error event
    }
    
    // Dừng mediaSource nếu có
    if (this.mediaSource) {
      try {
        this.mediaSource.disconnect();
      } catch (e) {
        console.log('MediaSource đã disconnect rồi');
      }
    }
    
    this.started = false
    this.loading = false
    
    console.log('Đã dừng nhạc');
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
    const { lineWidth, lineSpacing, isRound } = this.opt

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
    
    // Giới hạn chiều cao tối đa của thanh (35% chiều cao canvas)
    const maxHeight = ch * 0.35
    
    // Sử dụng màu động từ ảnh bìa
    const { r, g, b } = this.dynamicColor
    
    ctx.clearRect(0, 0, cw, ch)
    
    // Tính trung bình âm lượng để điều khiển các hiệu ứng
    let avgVolume = 0
    for (let i = 0; i < Math.min(10, buffer.length); i++) {
      avgVolume += buffer[i]
    }
    avgVolume = avgVolume / Math.min(10, buffer.length) / 255
    
    // === VẼ VÒNG TRÒN PHẢN ỨNG THEO NHẠC ===
    this.drawReactiveCircles(ctx, cx, cy, avgVolume, r, g, b)
    
    // === VẼ GỢN SÓNG Ở PHÍA DƯỚI ===
    this.drawWaves(ctx, cy, avgVolume, r, g, b)
    
    // === VẼ THANH ÂM THANH VỚI GRADIENT ===
    if (isRound) {
      ctx.lineCap = "round"
    } else {
      ctx.lineCap = "butt"
    }
  
    for (let i = 0; i < maxLines; i++) {
      // Giới hạn chiều cao và scale xuống
      let rawHeight = buffer[i] + 1
      let h = Math.min(rawHeight * 0.8, maxHeight)
      let xl = cx - i * (mobileLineWidth + mobileSpacing) - sp
      let xr = cx + i * (mobileLineWidth + mobileSpacing) + sp
      let y1 = cy - h / 2
      let y2 = cy + h / 2
      
      // Tạo gradient từ trên xuống dưới cho mỗi thanh
      const gradient = ctx.createLinearGradient(xl, y1, xl, y2)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`)
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.95)`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.3)`)
      
      // Vẽ thanh bên trái
      ctx.beginPath()
      ctx.lineWidth = mobileLineWidth
      ctx.shadowBlur = isMobile ? 10 : 15
      ctx.strokeStyle = gradient
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`
      ctx.moveTo(xl, y1)
      ctx.lineTo(xl, y2)
      ctx.stroke()
      
      // Vẽ thanh bên phải
      ctx.beginPath()
      ctx.moveTo(xr, y1)
      ctx.lineTo(xr, y2)
      ctx.stroke()
      
      // Lớp trong sáng hơn
      const innerGradient = ctx.createLinearGradient(xl, y1, xl, y2)
      innerGradient.addColorStop(0, `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, 0.4)`)
      innerGradient.addColorStop(0.5, `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, 1)`)
      innerGradient.addColorStop(1, `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, 0.4)`)
      
      ctx.beginPath()
      ctx.lineWidth = Math.max(1, mobileLineWidth - 2)
      ctx.shadowBlur = isMobile ? 15 : 20
      ctx.strokeStyle = innerGradient
      ctx.shadowColor = `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, 0.8)`
      ctx.moveTo(xl, y1)
      ctx.lineTo(xl, y2)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(xr, y1)
      ctx.lineTo(xr, y2)
      ctx.stroke()
    }
    
    // === VẼ VÀ CẬP NHẬT PARTICLES ===
    this.updateParticles(ctx, cx, cy, buffer, maxLines, mobileLineWidth, mobileSpacing, sp, avgVolume, r, g, b)
  }
  
  // Vẽ vòng tròn phản ứng theo nhạc
  drawReactiveCircles(ctx, cx, cy, avgVolume, r, g, b) {
    const baseRadius = 80
    const maxRadius = 180
    const numCircles = 3
    
    for (let i = 0; i < numCircles; i++) {
      const radius = baseRadius + (maxRadius - baseRadius) * avgVolume * (i + 1) / numCircles
      const alpha = 0.15 - (i * 0.04)
      
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.lineWidth = 2
      ctx.shadowBlur = 10
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`
      ctx.stroke()
    }
  }
  
  // Vẽ gợn sóng ở phía dưới
  drawWaves(ctx, cy, avgVolume, r, g, b) {
    const waveY = cy + 150
    const waveAmplitude = 15 + avgVolume * 30
    const waveFrequency = 0.02
    const numWaves = 2
    
    this.waveOffset += 0.05
    
    for (let w = 0; w < numWaves; w++) {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.2 - w * 0.08})`
      ctx.lineWidth = 2
      ctx.shadowBlur = 8
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`
      
      for (let x = 0; x < this.cw; x += 5) {
        const y = waveY + Math.sin(x * waveFrequency + this.waveOffset + w * 0.5) * waveAmplitude
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
    }
  }
  
  // Cập nhật và vẽ particles
  updateParticles(ctx, cx, cy, buffer, maxLines, lineWidth, spacing, sp, avgVolume, r, g, b) {
    // Tạo particles mới dựa trên âm lượng (giới hạn số lượng)
    if (Math.random() < avgVolume * 0.3 && this.particles.length < this.maxParticles) {
      const index = Math.floor(Math.random() * maxLines)
      const side = Math.random() > 0.5 ? 1 : -1
      const x = cx + side * index * (lineWidth + spacing) + sp * side
      const y = cy + (Math.random() - 0.5) * 100
      
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        life: 1.0,
        size: Math.random() * 3 + 2
      })
    }
    
    // Cập nhật và vẽ particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      
      // Cập nhật vị trí
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.1 // Gravity
      p.life -= 0.02
      
      // Xóa particle nếu hết life
      if (p.life <= 0) {
        this.particles.splice(i, 1)
        continue
      }
      
      // Vẽ particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.life * 0.6})`
      ctx.shadowBlur = 8
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${p.life})`
      ctx.fill()
    }
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
  
  // Cập nhật màu cho visualizer
  setColor(color) {
    this.dynamicColor = color;
    console.log('Cập nhật màu visualizer:', `rgb(${color.r}, ${color.g}, ${color.b})`);
  }
}
