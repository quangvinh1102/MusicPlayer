const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);




const player = $('.player')
const playlist = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn =$('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {

    currentIndex: 0, 
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    
    songs: [
        {
            name: 'Unity',
            singer: 'TheFatRat',
            path: './app/songs/Unity-TheFatRat-3578590.mp3',
            image: './app/images/Unity.jpg'
        },
        {
            name: 'FlyAway',
            singer: 'TheFatRat',
            path: './app/songs/FlyAway-TheFatRatAnjulie-5043089.mp3',
            image: './app/images/FlyAwaly.jpg'
        },
        {
            name: 'SummerTime',
            singer: 'K391',
            path: './app/songs/Summertime-K391-3549537.mp3',
            image: './app/images/summertime.jpg'
        },
        {
            name: '135',
            singer: 'Alan Walker',
            path: './app/songs/135-AlanWalker-4444663.mp3',
            image: './app/images/135.jpg'
        },
        {
            name: 'Sign',
            singer: 'Deamn',
            path: './app/songs/Sign-Deamn-4755357.mp3',
            image: './app/images/Sign.jpg'
        },
        // {
        //     name: 'Ten bai hat',
        //     singer: 'Ten ca si',
        //     path: 'link nhac cua bai hat',
        //     image: 'link anh cua bai hat'
        // },
    ],
    

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // X??? l?? quay CD v?? d???ng CD
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // x??? l?? ph??ng to / thu nh??? CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;


            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // x??? l?? khi click v??o n??t play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }else{
                audio.play()
            }
        }

        //khi b??i h??t ch???y
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //khi b??i h??t d???ng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }
        // X??? l?? khi tua b??i h??t
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
        }
        // X??? l?? khi b???m next b??i h??t
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // X??? l?? prev b??i h??t
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        // X??? l?? khi click v??o ramdom btn
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }
        // X??? l?? khi click v??o n??t l???p l???i b??i h??t
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            
        }
        // X??? l?? next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        // L???ng nghe h??nh vi click v??o list nh???c
        playlist.onclick = function(e) {
            const songNote = e.target.closest('.song:not(.active)')
            if (songNote || e.target.closest('.option')
            ){
                if (songNote) {
                    _this.currentIndex = Number(songNote.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // if(e.target.closest('.option'))
            }
        }
        
    },
    loadCurrentSong: function() {
        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    // scrollToActiveSong: function () {
    //     setTimeout(function () {
    //       if ((app.currentIndex === 0, 1)) {
    //         $(".song.active").scrollIntoView({
    //           behavior: "smooth",
    //           block: "end",
    //         });
    //       } else {
    //         $(".song.active").scrollIntoView({
    //           behavior: "smooth",
    //           block: "center",
    //         });
    //       }
    //     }, 300);
    //   },
    
    repeatSong: function() {
        _this.isRepeat = !_this.isRepeat

    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 500)
    },
    start: function() {
        //G??n c???u h??nh t??? config v??o ???ng d???ng
        
        // ?????nh ngh??a c??c thu???c t??nh cho Object
        this.defineProperties();
        // L???ng nghe v?? x??? l?? c??c s??? ki???n trong DOM (DOM event)
        this.handleEvents();
        // T???i th??ng tin b??i h??t ?????u ti??n khi truy c???p v??o web
        this.loadCurrentSong();
        // l???y ra c??c ph???n t??? trong
        this.render();
        // Hi???n th??? tr???ng th??i ban ?????u c???a btn repeat v?? btn random 

    }

}


// dark mode
const toggle = document.getElementById('toggle');

toggle.addEventListener('click', function() {
	document.body.classList.toggle('dark');
});

app.start();