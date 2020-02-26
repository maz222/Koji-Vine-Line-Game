class SoundController {
	constructor() {
		this.data = {
			sounds:[],
			music:null,
		};
        userStartAudio();
	}
	toggleMute() {
        if(sessionStorage.getItem('isMuted')=='true') {
            sessionStorage.setItem('isMuted','false');
        }
        else {
            sessionStorage.setItem('isMuted','true');
        }
        console.log(sessionStorage.getItem('isMuted'));
		if(sessionStorage.getItem('isMuted')=='true') {
			this.mute();
		}
		else {
            this.playMusic()
		}
	}
	playSound(soundIndex) {
        console.log(this.data.sounds);
		if(sessionStorage.getItem('isMuted')!='true' && this.data.sounds[soundIndex] != null) {
			this.data.sounds[soundIndex].play();
		}
	}
	playMusic() {
		if(sessionStorage.getItem('isMuted')!='true' && this.data.music != null) {
            this.data.music.setVolume(0.25);
			this.data.music.loop();
            //this.data.music.play();
		}
	}
	mute() {
		for(var i in this.data.sounds) {
			if(this.data.sounds[i] != null && this.data.sounds[i]._playing) {
				this.data.sounds[i].stop();
			}
		}
		if(this.data.music != null && this.data.music._playing) {
			this.data.music.stop();
		}
	}
    muteMusic() {

    }
    dispose() {
        for(var i in this.data.sounds) {
            if(this.data.sounds[i] != null) {
                this.data.sounds[i].dispose();
                this.data.sounds[i] = null;
            }
        }
        if(this.data.music != null) {
            this.data.music.dispose();
            this.data.music = null;
        }
    }
}