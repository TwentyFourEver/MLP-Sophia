import type { SoundEffectId } from '../story/types';
import { assetPath } from '../assets';

const NOTE = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

type MusicTrackId = 'menu' | 'game';

const MUSIC_TRACKS: Record<MusicTrackId, string> = {
  menu: assetPath('menu-music.webm'),
  game: assetPath('background-game.webm'),
};

const MUSIC_MAX_VOLUME = 0.4;
const EFFECTS_GAIN_MAX = 0.375;
const UI_CLICK_SOUND = assetPath('ui-click.webm');
const UI_CLICK_MAX_VOLUME = 0.475;
const UI_HOVER_SOUND = assetPath('hover-sound-effect.webm');
const UI_HOVER_MAX_VOLUME = 0.32;
const TEXT_WORD_SOUND = assetPath('text-word.webm');
const TEXT_WORD_MAX_VOLUME = 0.34;

const clampVolume = (volume: number) => Math.min(1, Math.max(0, volume));

class MagicalAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private effects: GainNode | null = null;
  private musicElement: HTMLAudioElement | null = null;
  private uiClickElement: HTMLAudioElement | null = null;
  private uiHoverElement: HTMLAudioElement | null = null;
  private textWordElement: HTMLAudioElement | null = null;
  private musicTrack: MusicTrackId | null = null;
  private musicTransition = 0;
  private fadeFrame: number | null = null;
  private unlockArmed = false;
  private muted = false;
  private musicVolume = 0.7;
  private effectsVolume = 0.8;

  async start() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.effects = this.context.createGain();

      this.master.gain.value = this.muted ? 0 : 0.58;
      this.effects.gain.value = EFFECTS_GAIN_MAX * this.effectsVolume;
      this.effects.connect(this.master);
      this.master.connect(this.context.destination);
    }

    if (this.context.state === 'suspended') await this.context.resume();
    await this.playMusic();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.musicElement) this.musicElement.muted = muted;
    if (!muted) void this.playMusic();
    if (!this.context || !this.master) return;
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(muted ? 0 : 0.58, this.context.currentTime, 0.04);
  }

  isMuted() {
    return this.muted;
  }

  setMusicVolume(volume: number) {
    this.musicVolume = clampVolume(volume);
    if (this.fadeFrame !== null) {
      window.cancelAnimationFrame(this.fadeFrame);
      this.fadeFrame = null;
    }
    if (this.musicElement) this.musicElement.volume = this.getMusicOutputVolume();
  }

  setEffectsVolume(volume: number) {
    this.effectsVolume = clampVolume(volume);
    if (this.uiClickElement) this.uiClickElement.volume = this.getUiClickOutputVolume();
    if (this.uiHoverElement) this.uiHoverElement.volume = this.getUiHoverOutputVolume();
    if (this.textWordElement) this.textWordElement.volume = this.getTextWordOutputVolume();
    if (!this.context || !this.effects) return;
    this.effects.gain.cancelScheduledValues(this.context.currentTime);
    this.effects.gain.setTargetAtTime(
      EFFECTS_GAIN_MAX * this.effectsVolume,
      this.context.currentTime,
      0.04,
    );
  }

  playUiClick() {
    if (this.muted) return;
    const click = this.getUiClickElement();
    if (!click) return;
    click.volume = this.getUiClickOutputVolume();
    click.currentTime = 0;
    void click.play().catch(() => undefined);
  }

  playUiHover() {
    if (this.muted || this.effectsVolume === 0) return;
    const template = this.getUiHoverElement();
    if (!template) return;
    const hover = template.cloneNode(true) as HTMLAudioElement;
    hover.volume = this.getUiHoverOutputVolume();
    hover.addEventListener('ended', () => hover.remove(), { once: true });
    void hover.play().catch(() => undefined);
  }

  playTextWord() {
    if (this.muted || this.effectsVolume === 0) return;
    const template = this.getTextWordElement();
    if (!template) return;
    const sound = template.cloneNode(true) as HTMLAudioElement;
    sound.volume = this.getTextWordOutputVolume();
    void sound.play().catch(() => undefined);
  }

  setMusicTrack(track: MusicTrackId) {
    this.getUiClickElement();
    this.getUiHoverElement();
    this.getTextWordElement();
    const music = this.getMusicElement();
    if (!music) return;

    if (this.musicTrack === track) {
      void this.playMusic();
      return;
    }

    this.musicTrack = track;
    const transition = ++this.musicTransition;
    const loadTrack = () => {
      if (transition !== this.musicTransition) return;
      music.pause();
      music.src = MUSIC_TRACKS[track];
      music.currentTime = 0;
      music.volume = 0;
      music.muted = this.muted;
      music.load();
      void this.playMusic();
      this.fadeMusicTo(this.getMusicOutputVolume(), 720, transition);
    };

    if (!music.paused && music.volume > 0.01) {
      this.fadeMusicTo(0, 360, transition, loadTrack);
    } else {
      loadTrack();
    }
  }

  playEffect(effect: SoundEffectId) {
    if (!this.context || !this.effects || this.muted) return;
    const now = this.context.currentTime;
    const effects = this.effects;

    switch (effect) {
      case 'advance':
        this.tone(NOTE(76), now, 0.08, 0.055, 'sine', effects);
        break;
      case 'choice':
        this.tone(NOTE(72), now, 0.13, 0.08, 'triangle', effects);
        this.tone(NOTE(79), now + 0.07, 0.18, 0.07, 'sine', effects);
        break;
      case 'sparkle':
        [79, 84, 88, 91].forEach((note, index) => {
          this.tone(NOTE(note), now + index * 0.055, 0.35, 0.08, 'sine', effects);
        });
        break;
      case 'surprise':
        this.tone(NOTE(55), now, 0.12, 0.08, 'square', effects);
        this.tone(NOTE(67), now + 0.08, 0.18, 0.065, 'triangle', effects);
        break;
      case 'finale':
        [60, 64, 67, 72, 76, 79, 84].forEach((note, index) => {
          this.tone(NOTE(note), now + index * 0.11, 0.75, 0.085, 'sine', effects);
        });
        break;
    }
  }

  private getMusicElement() {
    if (this.musicElement || typeof Audio === 'undefined') return this.musicElement;
    const music = new Audio();
    music.loop = true;
    music.preload = 'auto';
    music.volume = this.getMusicOutputVolume();
    music.muted = this.muted;
    this.musicElement = music;
    return music;
  }

  private getUiClickElement() {
    if (this.uiClickElement || typeof Audio === 'undefined') return this.uiClickElement;
    const click = new Audio(UI_CLICK_SOUND);
    click.preload = 'auto';
    click.volume = this.getUiClickOutputVolume();
    click.load();
    this.uiClickElement = click;
    return click;
  }

  private getTextWordElement() {
    if (this.textWordElement || typeof Audio === 'undefined') return this.textWordElement;
    const textWord = new Audio(TEXT_WORD_SOUND);
    textWord.preload = 'auto';
    textWord.volume = this.getTextWordOutputVolume();
    textWord.load();
    this.textWordElement = textWord;
    return textWord;
  }

  private getUiHoverElement() {
    if (this.uiHoverElement || typeof Audio === 'undefined') return this.uiHoverElement;
    const hover = new Audio(UI_HOVER_SOUND);
    hover.preload = 'auto';
    hover.volume = this.getUiHoverOutputVolume();
    hover.load();
    this.uiHoverElement = hover;
    return hover;
  }

  private getMusicOutputVolume() {
    return MUSIC_MAX_VOLUME * this.musicVolume;
  }

  private getUiClickOutputVolume() {
    return UI_CLICK_MAX_VOLUME * this.effectsVolume;
  }

  private getUiHoverOutputVolume() {
    return UI_HOVER_MAX_VOLUME * this.effectsVolume;
  }

  private getTextWordOutputVolume() {
    return TEXT_WORD_MAX_VOLUME * this.effectsVolume;
  }

  private async playMusic() {
    const music = this.musicElement;
    if (!music?.src) return;

    try {
      await music.play();
      this.disarmMusicUnlock();
    } catch {
      this.armMusicUnlock();
    }
  }

  private readonly unlockMusic = () => {
    this.disarmMusicUnlock();
    void this.start().catch(() => undefined);
  };

  private armMusicUnlock() {
    if (this.unlockArmed || typeof window === 'undefined') return;
    this.unlockArmed = true;
    window.addEventListener('pointerdown', this.unlockMusic, { capture: true, once: true });
    window.addEventListener('keydown', this.unlockMusic, { capture: true, once: true });
  }

  private disarmMusicUnlock() {
    if (!this.unlockArmed || typeof window === 'undefined') return;
    this.unlockArmed = false;
    window.removeEventListener('pointerdown', this.unlockMusic, true);
    window.removeEventListener('keydown', this.unlockMusic, true);
  }

  private fadeMusicTo(
    targetVolume: number,
    duration: number,
    transition: number,
    onComplete?: () => void,
  ) {
    const music = this.musicElement;
    if (!music) return;
    if (this.fadeFrame !== null) window.cancelAnimationFrame(this.fadeFrame);

    const initialVolume = music.volume;
    const startedAt = performance.now();
    const updateVolume = (now: number) => {
      if (transition !== this.musicTransition) return;
      // The first frame timestamp can precede performance.now() when scheduled mid-frame.
      const progress = Math.max(0, Math.min(1, (now - startedAt) / duration));
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      music.volume = clampVolume(initialVolume + (targetVolume - initialVolume) * easedProgress);

      if (progress < 1) {
        this.fadeFrame = window.requestAnimationFrame(updateVolume);
        return;
      }

      this.fadeFrame = null;
      onComplete?.();
    };

    this.fadeFrame = window.requestAnimationFrame(updateVolume);
  }

  private tone(
    frequency: number,
    start: number,
    duration: number,
    volume: number,
    waveform: OscillatorType,
    destination: AudioNode,
  ) {
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.08, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }
}

export const audioEngine = new MagicalAudioEngine();
