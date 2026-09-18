import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate, stagger, type AnimationParams } from 'animejs';
import { audioEngine } from './audio/audioEngine';
import { backgrounds, characters, getPortrait, preloadableAssets } from './story/characters';
import { INITIAL_NODE_ID, story, validateStory } from './story/story';
import type {
  CharacterId,
  EmotionId,
  PortraitMotionId,
  SceneId,
  StoryChoice,
  StoryNode,
} from './story/types';

import { LoadingScreen } from './components/LoadingScreen';
import { CursorEffects } from './components/CursorEffects';
import { TitleScreen, MENU_GROUP_ARTWORK } from './components/TitleScreen';
import { PonyCreator } from './components/PonyCreator';
import { PonyAvatar } from './components/PonyAvatar';
import { PONY_BASE, personalizeNode, type PonyAppearance } from './pony';
import { Modal, SettingsPanel, SaveSlots, HistoryPanel, HelpPanel, type MenuId } from './components/GameMenus';
import { canSkip, parseSave, readSettings, readSlots, readSeen, readStorage, writeStorage, sceneNames,
  SAVE_KEY, SETTINGS_KEY, SLOTS_KEY, READ_KEY, TEXT_SPEED_DELAYS, type GameSettings, type SavedGame } from './gameState';

const storyErrors = validateStory();
if (storyErrors.length) {
  throw new Error(`La historia contiene errores:\n${storyErrors.join('\n')}`);
}

const WORD_CHARACTER = /[\p{L}\p{N}]/u;
const MotionContext = createContext(false);

type DialogueStoryNode = Extract<StoryNode, { type: 'dialogue' }>;
type PlayableCharacterId = Exclude<CharacterId, 'narrator'>;

const portraitMotions: Record<PortraitMotionId, AnimationParams> = {
  slide: {
    opacity: [0, 1],
    translateX: [76, 0],
    scale: [0.97, 1],
    duration: 720,
    ease: 'outExpo',
  },
  bounce: {
    opacity: [0, 1],
    translateY: [72, -16, 6, 0],
    scaleX: [0.9, 1.05, 0.98, 1],
    scaleY: [1.1, 0.95, 1.02, 1],
    duration: 900,
    ease: 'outQuad',
  },
  stretch: {
    opacity: [0, 1],
    translateY: [44, -10, 4, 0],
    scaleX: [0.72, 1.08, 0.96, 1],
    scaleY: [1.28, 0.92, 1.04, 1],
    duration: 920,
    ease: 'outQuad',
  },
  wobble: {
    opacity: [0, 1],
    translateX: [46, 0],
    rotate: ['8deg', '-5deg', '3deg', '0deg'],
    duration: 880,
    ease: 'outQuad',
  },
  soft: {
    opacity: [0, 1],
    translateX: [28, 0],
    translateY: [12, 0],
    scale: [0.98, 1],
    duration: 920,
    ease: 'outSine',
  },
  dash: {
    opacity: [0, 1],
    translateX: [190, 0],
    skewX: ['-9deg', '0deg'],
    scaleX: [1.06, 1],
    duration: 620,
    ease: 'outExpo',
  },
  droop: {
    opacity: [0, 1],
    translateY: [-36, 0],
    rotate: ['-2deg', '0deg'],
    scale: [0.98, 1],
    duration: 820,
    ease: 'outQuad',
  },
  pop: {
    opacity: [0, 1],
    translateY: [30, -8, 3, 0],
    scale: [0.58, 1.1, 0.96, 1],
    duration: 820,
    ease: 'outQuad',
  },
  spin: {
    opacity: [0, 1],
    translateX: [72, -8, 3, 0],
    rotate: ['-15deg', '6deg', '-2deg', '0deg'],
    scale: [0.88, 1.04, 0.98, 1],
    duration: 940,
    ease: 'outQuad',
  },
  flutter: {
    opacity: [0, 1],
    translateX: [34, -9, 4, 0],
    translateY: [48, -14, 6, 0],
    rotate: ['4deg', '-2deg', '1deg', '0deg'],
    duration: 1040,
    ease: 'outQuad',
  },
  swagger: {
    opacity: [0, 1],
    translateX: [104, -12, 5, 0],
    rotate: ['-4deg', '2deg', '-1deg', '0deg'],
    scale: [0.94, 1.02, 1],
    duration: 820,
    ease: 'outExpo',
  },
  peek: {
    opacity: [0, 1],
    translateX: [112, -7, 2, 0],
    scaleX: [0.8, 1.03, 0.99, 1],
    duration: 920,
    ease: 'outBack(1.8)',
  },
  shake: {
    opacity: [0, 1],
    translateX: [52, -10, 8, -5, 3, 0],
    rotate: ['4deg', '-3deg', '2deg', '-1deg', '0deg'],
    duration: 760,
    ease: 'outQuad',
  },
  celebrate: {
    opacity: [0, 1],
    translateY: [96, -34, 14, -7, 0],
    rotate: ['-5deg', '4deg', '-2deg', '1deg', '0deg'],
    scale: [0.76, 1.1, 0.95, 1.03, 1],
    duration: 1080,
    ease: 'outQuad',
  },
};

function getPortraitMotion(node: DialogueStoryNode): PortraitMotionId {
  if (node.motion) return node.motion;

  const emotion = node.emotion ?? 'neutral';
  if (emotion === 'sad' && node.speaker === 'fluttershy') return 'peek';
  if (emotion === 'sad') return 'droop';
  if (emotion === 'doubtful') return 'wobble';
  if (emotion !== 'happy') return 'slide';

  if (node.speaker === 'pinkie') return 'celebrate';
  if (node.speaker === 'rarity') return 'spin';
  if (node.speaker === 'fluttershy') return 'flutter';
  if (node.speaker === 'rainbow') return 'dash';
  if (node.speaker === 'applejack') return 'swagger';
  if (node.speaker === 'spike') return 'pop';
  return 'bounce';
}

function playPortraitEntrance(
  element: HTMLElement,
  motion: PortraitMotionId,
) {
  return animate(element, portraitMotions[motion]);
}

const portraitSpeakingMotions: Record<PlayableCharacterId, AnimationParams> = {
  twilight: {
    translateY: [0, -4, 0],
    scale: [1, 1.008, 1],
    duration: 560,
    loop: true,
    ease: 'inOutSine',
  },
  spike: {
    translateY: [0, -7, 0],
    rotate: ['0deg', '1.8deg', '-1.2deg', '0deg'],
    duration: 520,
    loop: true,
    ease: 'inOutSine',
  },
  pinkie: {
    translateY: [0, -8, 0],
    scaleX: [1, 1.025, 1],
    scaleY: [1, 0.985, 1],
    duration: 460,
    loop: true,
    ease: 'inOutSine',
  },
  applejack: {
    translateY: [0, -3, 0],
    rotate: ['0deg', '-0.8deg', '0deg'],
    duration: 620,
    loop: true,
    ease: 'inOutSine',
  },
  rarity: {
    translateY: [0, -3, 0],
    rotate: ['0deg', '1deg', '0deg'],
    duration: 680,
    loop: true,
    ease: 'inOutSine',
  },
  fluttershy: {
    translateY: [0, -3, 0],
    translateX: [0, -1.5, 0],
    rotate: ['0deg', '-0.6deg', '0deg'],
    duration: 780,
    loop: true,
    ease: 'inOutSine',
  },
  rainbow: {
    translateX: [0, -5, 0],
    translateY: [0, -4, 0],
    rotate: ['0deg', '0.8deg', '0deg'],
    duration: 430,
    loop: true,
    ease: 'inOutSine',
  },
};

const portraitIdleMotions: Record<PlayableCharacterId, AnimationParams> = {
  twilight: { translateY: [0, -3], duration: 2100, loop: true, alternate: true, ease: 'inOutSine' },
  spike: {
    translateY: [0, -5],
    rotate: ['0deg', '0.8deg'],
    duration: 1700,
    loop: true,
    alternate: true,
    ease: 'inOutSine',
  },
  pinkie: {
    translateY: [0, -5],
    rotate: ['0deg', '0.6deg'],
    duration: 1450,
    loop: true,
    alternate: true,
    ease: 'inOutSine',
  },
  applejack: {
    translateY: [0, -2],
    rotate: ['0deg', '-0.35deg'],
    duration: 2300,
    loop: true,
    alternate: true,
    ease: 'inOutSine',
  },
  rarity: {
    translateX: [0, -2],
    rotate: ['0deg', '0.65deg'],
    duration: 2400,
    loop: true,
    alternate: true,
    ease: 'inOutSine',
  },
  fluttershy: {
    translateY: [0, -4],
    rotate: ['0deg', '-0.4deg'],
    duration: 2600,
    loop: true,
    alternate: true,
    ease: 'inOutSine',
  },
  rainbow: {
    translateY: [0, -7],
    translateX: [0, -2],
    duration: 1300,
    loop: true,
    alternate: true,
    ease: 'inOutSine',
  },
};

function playPortraitLoop(
  element: HTMLImageElement,
  speaker: PlayableCharacterId,
  isTyping: boolean,
) {
  return animate(element, isTyping ? portraitSpeakingMotions[speaker] : portraitIdleMotions[speaker]);
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Z" />
      <path d="m16 9 5 5m0-5-5 5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Z" />
      <path d="M15 9.2a4 4 0 0 1 0 5.6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}

function StarMark() {
  return (
    <div className="star-mark" aria-hidden="true">
      <span className="star-mark__halo" />
      <svg viewBox="0 0 120 120">
        <defs>
          <linearGradient id="star-fill" x1="16" y1="12" x2="98" y2="108">
            <stop stopColor="#fff9c8" />
            <stop offset=".38" stopColor="#ff8ed8" />
            <stop offset="1" stopColor="#8066ff" />
          </linearGradient>
        </defs>
        <path
          d="m60 8 13.5 28.3 31.1 4.1-22.8 21.7 5.7 30.8L60 78 32.5 92.9l5.7-30.8-22.8-21.7 31.1-4.1L60 8Z"
          fill="url(#star-fill)"
          stroke="#fff"
          strokeWidth="4"
        />
        <path d="M60 25v36M42 45h36" stroke="#fff" strokeLinecap="round" strokeWidth="5" opacity=".72" />
      </svg>
    </div>
  );
}

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => (
        <span
          className="sparkle"
          key={index}
          style={
            {
              '--x': `${(index * 37) % 100}%`,
              '--y': `${(index * 61) % 92}%`,
              '--delay': `${(index % 8) * -0.7}s`,
              '--size': `${4 + (index % 4) * 2}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function MagicBurst({ accent }: { accent: string }) {
  const reducedMotion = useContext(MotionContext);
  const burstRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = burstRef.current?.querySelectorAll<HTMLSpanElement>('.magic-burst__particle');
    if (!particles || reducedMotion) return;

    const bursts = Array.from(particles, (particle, index) => {
      const angle = (Math.PI * 2 * index) / particles.length;
      const distance = 82 + (index % 4) * 24;
      return animate(particle, {
        opacity: [0, 1, 0],
        translateX: [0, Math.cos(angle) * distance],
        translateY: [0, Math.sin(angle) * distance],
        rotate: ['0deg', `${120 + index * 21}deg`],
        scale: [0.2, 1.45, 0.35],
        delay: index * 18,
        duration: 980 + (index % 3) * 110,
        ease: 'outQuad',
      });
    });

    return () => bursts.forEach((burst) => burst.revert());
  }, [reducedMotion]);

  return (
    <div
      className="magic-burst"
      ref={burstRef}
      style={{ '--burst-color': accent } as React.CSSProperties}
      aria-hidden="true"
    >
      {Array.from({ length: 18 }, (_, index) => (
        <span className="magic-burst__particle" key={index}>✦</span>
      ))}
    </div>
  );
}

function EndingScreen({ node, onRestart }: { node: Extract<StoryNode, { type: 'ending' }>; onRestart: () => void }) {
  const reducedMotion = useContext(MotionContext);
  const endingRef = useRef<HTMLDivElement>(null);
  const cast = Object.values(characters);

  useEffect(() => {
    const ending = endingRef.current;
    if (!ending || reducedMotion) return;
    const intro = animate(ending, {
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.96, 1],
      duration: 1100,
      ease: 'outElastic(1, .7)',
    });
    const castIntro = animate(ending.querySelectorAll('.ending-avatar'), {
      opacity: [0, 1],
      translateY: [28, -7, 0],
      scale: [0.4, 1.12, 1],
      delay: stagger(90, { start: 260, from: 'center' }),
      duration: 760,
      ease: 'outQuad',
    });
    const star = ending.querySelector<HTMLElement>('.star-mark');
    const starIntro = star
      ? animate(star, {
          rotate: ['-18deg', '8deg', '0deg'],
          scale: [0.45, 1.16, 1],
          duration: 1050,
          ease: 'outElastic(1, .55)',
        })
      : null;
    return () => {
      intro.revert();
      castIntro.revert();
      starIntro?.revert();
    };
  }, [reducedMotion]);

  return (
    <section className="ending-card" ref={endingRef} aria-labelledby="ending-title">
      <StarMark />
      <p className="eyebrow">Una nueva constelación ha despertado</p>
      <h2 id="ending-title">{node.title}</h2>
      <p>{node.text}</p>
      <div className="ending-cast" aria-label="Tus nuevas amistades">
        {cast.map((character) => (
          <div className={`ending-avatar ending-avatar--${character.id}`} key={character.id} title={character.name}>
            <img src={character.portraits.neutral} alt={character.name} />
          </div>
        ))}
      </div>
      <button className="primary-button" type="button" onClick={onRestart}>
        Volver al menú <span aria-hidden="true">↻</span>
      </button>
    </section>
  );
}

function DialoguePanel({
  node,
  displayedText,
  isTyping,
  onAdvance,
}: {
  node: Extract<StoryNode, { type: 'dialogue' }>;
  displayedText: string;
  isTyping: boolean;
  onAdvance: () => void;
}) {
  const speaker = node.speaker === 'narrator' ? null : characters[node.speaker];
  const reducedMotion = useContext(MotionContext);
  const panelRef = useRef<HTMLButtonElement>(null);
  const speakerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || reducedMotion) return;

    const panelIntro = animate(panel.closest<HTMLElement>('.story-frame') ?? panel, {
      opacity: [0, 1],
      translateY: [30, -4, 0],
      scaleX: [0.97, 1.01, 1],
      duration: 640,
      ease: 'outExpo',
    });
    const speakerIntro = speakerRef.current
      ? animate(speakerRef.current, {
          opacity: [0, 1],
          translateY: [16, -5, 0],
          scale: [0.65, 1.12, 1],
          delay: 100,
          duration: 620,
          ease: 'outQuad',
        })
      : null;

    return () => {
      panelIntro.revert();
      speakerIntro?.revert();
    };
  }, [node.id, reducedMotion]);

  return (
    <button
      ref={panelRef}
      className={`dialogue-panel ${speaker ? '' : 'dialogue-panel--narrator'}`}
      style={{ '--speaker-accent': speaker?.accent ?? '#f7d9ff' } as React.CSSProperties}
      type="button"
      onClick={onAdvance}
      aria-label={isTyping ? 'Mostrar todo el texto' : 'Continuar'}
    >
      {speaker && <span className="speaker-name" ref={speakerRef}>{speaker.name}</span>}
      <span className="dialogue-copy"><span className="dialogue-text dialogue-measure" aria-hidden="true">{node.text}<span className="typing-caret" /></span><span className="dialogue-text dialogue-visible" aria-hidden="true">
        {displayedText}
        {isTyping && <span className="typing-caret" aria-hidden="true" />}
      </span></span><span className="sr-only" aria-live="polite">{node.text}</span>
      {!isTyping && <span className="continue-gem" aria-hidden="true">◆</span>}
    </button>
  );
}

function ChoicePanel({
  prompt,
  choices,
  onChoose,
}: {
  prompt: string;
  choices: StoryChoice[];
  onChoose: (choice: StoryChoice) => void;
}) {
  const reducedMotion = useContext(MotionContext);
  const panelRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || reducedMotion) return;
    const buttons = panel.querySelectorAll('.choice-button');
    const panelIntro = animate(panel, {
      opacity: [0, 1],
      translateY: [34, 0],
      scale: [0.96, 1],
      duration: 700,
      ease: 'outExpo',
    });
    const intro = animate(buttons, {
      opacity: [0, 1],
      translateX: [42, -5, 0],
      scale: [0.92, 1.035, 1],
      delay: stagger(120, { start: 170 }),
      duration: 720,
      ease: 'outQuad',
    });
    const promptIntro = promptRef.current
      ? animate(promptRef.current, {
          opacity: [0, 1],
          translateY: [-14, 0],
          scale: [0.9, 1],
          delay: 80,
          duration: 620,
          ease: 'outBack(1.6)',
        })
      : null;
    return () => {
      panelIntro.revert();
      intro.revert();
      promptIntro?.revert();
    };
  }, [choices, reducedMotion]);

  return (
    <section className="choice-panel" ref={panelRef} aria-labelledby="choice-prompt">
      <p id="choice-prompt" ref={promptRef}>{prompt}</p>
      <div className="choice-list">
        {choices.map((choice, index) => (
          <button className="choice-button" type="button" key={choice.id} onClick={() => onChoose(choice)}>
            <span className="choice-number">{index + 1}</span>
            <span>{choice.label}</span>
            <span className="choice-star" aria-hidden="true">✦</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SceneCard({ node, onAdvance }: { node: Extract<StoryNode, { type: 'scene' }>; onAdvance: () => void }) {
  const reducedMotion = useContext(MotionContext);
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;
    const intro = animate(card, {
      opacity: [0, 1],
      translateY: [18, 0],
      scale: [0.97, 1],
      duration: 900,
      ease: 'outExpo',
    });
    const star = card.querySelector<HTMLElement>('.scene-card__star');
    const starIntro = star
      ? animate(star, {
          rotate: ['-30deg', '16deg', '0deg'],
          scale: [0.3, 1.4, 1],
          duration: 980,
          ease: 'outElastic(1, .55)',
        })
      : null;
    return () => {
      intro.revert();
      starIntro?.revert();
    };
  }, [node.id, reducedMotion]);

  return (
    <button className="scene-card" type="button" onClick={onAdvance} ref={cardRef}>
      <span className="scene-card__star" aria-hidden="true">✦</span>
      <span className="scene-card__title">{node.title}</span>
      <span className="scene-card__subtitle">{node.subtitle}</span>
      <span className="scene-card__continue">Continuar</span>
    </button>
  );
}

function Game({ initialSave, settings, paused, reducedMotion, onExit, onSave, onMenu, onMutedChange, onQuickSave, onQuickLoad, hasQuickSave }: {
  initialSave: SavedGame; settings: GameSettings; paused: boolean; reducedMotion: boolean;
  onExit: () => void; onSave: (save: SavedGame) => void; onMenu: (menu: MenuId) => void;
  onMutedChange: (muted: boolean) => void; onQuickSave: () => void; onQuickLoad: () => void; hasQuickSave: boolean;
}) {
  const [cursor, setCursor] = useState(initialSave);
  const [pending, setPending] = useState<SavedGame | null>(null);
  const [typed, setTyped] = useState({ id: '', count: 0 });
  const typedRef = useRef(typed);
  const seenRef = useRef(readSeen());
  const [, refreshSeen] = useState(0);
  const [auto, setAuto] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const portraitEntranceRef = useRef<HTMLDivElement>(null);
  const portraitImageRef = useRef<HTMLImageElement>(null);
  const storyFrameRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const currentNode = useMemo(() => personalizeNode(story[cursor.nodeId], cursor.pony.name), [cursor.nodeId, cursor.pony.name]);
  const blocked = paused || !!pending || hidden || !visible;
  const count = typed.id === currentNode.id ? typed.count : 0;
  const isTyping = currentNode.type === 'dialogue' && count < currentNode.text.length;
  const displayedText = currentNode.type === 'dialogue' ? currentNode.text.slice(0, count) : '';
  const emotion: EmotionId = currentNode.type === 'dialogue' ? (currentNode.emotion ?? 'neutral') : 'neutral';
  const speakerId: CharacterId | null = currentNode.type === 'dialogue' ? currentNode.speaker : null;
  const portrait = speakerId ? getPortrait(speakerId, emotion) : null;
  const character = speakerId && speakerId !== 'narrator' ? characters[speakerId] : null;
  const portraitMotion = currentNode.type === 'dialogue' ? getPortraitMotion(currentNode) : 'slide';

  useEffect(() => {
    const frame = storyFrameRef.current;
    const layer = frame?.parentElement;
    const toolbar = layer?.querySelector<HTMLElement>('.quick-menu');
    if (!frame || !layer || !toolbar) return;
    const resize = () => {
      const available = layer.clientHeight - frame.offsetHeight - toolbar.offsetHeight - 12;
      frame.style.setProperty('--portrait-space', `${Math.max(0, available + 18)}px`);
    };
    const observer = new ResizeObserver(resize);
    [frame, layer, toolbar].forEach((element) => observer.observe(element));
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => { onSave(cursor); }, [cursor, onSave]);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background || reducedMotion) return;
    const transition = animate(background, { opacity: [0, 1], scale: [1.025, 1], duration: 800, ease: 'outQuad' });
    return () => { transition.cancel(); };
  }, [cursor.background, reducedMotion]);
  useEffect(() => {
    if (blocked || currentNode.type !== 'dialogue') return;
    let index = typedRef.current.id === currentNode.id ? typedRef.current.count : 0;
    const update = (next: number) => {
      typedRef.current = { id: currentNode.id, count: next };
      setTyped(typedRef.current);
    };
    if (settings.textSpeed === 'instant') { update(currentNode.text.length); return; }
    if (index >= currentNode.text.length) return;
    const typeNext = () => {
      index++;
      update(index);
      const char = currentNode.text[index - 1];
      const previous = currentNode.text[index - 2] ?? '';
      if (settings.textSound && !skipping && WORD_CHARACTER.test(char) && !WORD_CHARACTER.test(previous)) audioEngine.playTextWord();
      if (index >= currentNode.text.length) { typingTimerRef.current = null; return; }
      const base = TEXT_SPEED_DELAYS[settings.textSpeed];
      const delay = /[.!?…]/.test(char) ? base * 5 : /[,;:]/.test(char) ? base * 2.75 : base;
      typingTimerRef.current = window.setTimeout(typeNext, delay);
    };
    typingTimerRef.current = window.setTimeout(typeNext, TEXT_SPEED_DELAYS[settings.textSpeed]);
    return () => { if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current); typingTimerRef.current = null; };
  }, [blocked, currentNode, settings.textSpeed, settings.textSound, skipping]);
  useEffect(() => {
    if (currentNode.type === 'dialogue' && !isTyping && !seenRef.current.has(currentNode.id)) {
      seenRef.current.add(currentNode.id);
      writeStorage(READ_KEY, [...seenRef.current]);
      refreshSeen((value) => value + 1);
    }
  }, [currentNode, isTyping]);
  useEffect(() => {
    if (currentNode.type === 'dialogue' && currentNode.sfx) audioEngine.playEffect(currentNode.sfx);
    if (currentNode.type === 'ending') audioEngine.playEffect('finale');
  }, [currentNode]);
  useEffect(() => {
    const element = portraitEntranceRef.current;
    if (!element || !portrait || reducedMotion) return;
    const entrance = playPortraitEntrance(element, portraitMotion);
    return () => { entrance.revert(); };
  }, [currentNode.id, portrait, portraitMotion, reducedMotion]);
  useEffect(() => {
    const element = portraitImageRef.current;
    if (!element || !character || reducedMotion || blocked) return;
    const loop = playPortraitLoop(element, character.id, isTyping);
    return () => { loop.revert(); };
  }, [character, currentNode.id, isTyping, reducedMotion, blocked]);

  const goTo = useCallback((nextId: string, choice?: StoryChoice) => {
    const next = story[nextId];
    const entry = currentNode.type === 'dialogue' ? { nodeId: currentNode.id } : choice ? { nodeId: currentNode.id, choice: choice.label } : null;
    const save: SavedGame = { nodeId: nextId, background: next.background ?? cursor.background,
      pony: cursor.pony,
      history: entry ? [...cursor.history, entry].slice(-150) : cursor.history };
    if (!canSkip(nextId, seenRef.current)) setSkipping(false);
    if (next.type === 'choice' || next.type === 'ending') setAuto(false);
    if (save.background !== cursor.background) setPending(save);
    else setCursor(save);
  }, [currentNode, cursor]);
  const advance = useCallback(() => {
    if (blocked || currentNode.type === 'choice' || currentNode.type === 'ending') return;
    if (currentNode.type === 'dialogue' && isTyping) {
      if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
      typedRef.current = { id: currentNode.id, count: currentNode.text.length };
      setTyped(typedRef.current);
      return;
    }
    audioEngine.playEffect('advance');
    goTo(currentNode.next);
  }, [blocked, currentNode, goTo, isTyping]);
  const manualAdvance = useCallback(() => { setSkipping(false); setAuto(false); advance(); }, [advance]);
  const choose = useCallback((choice: StoryChoice) => {
    if (blocked) return;
    audioEngine.playEffect('choice');
    goTo(choice.next, choice);
  }, [blocked, goTo]);
  const toggleAuto = useCallback(() => { setAuto((value) => !value); setSkipping(false); }, []);
  const toggleSkip = useCallback(() => {
    if (canSkip(currentNode.id, seenRef.current)) { setSkipping((value) => !value); setAuto(false); }
  }, [currentNode.id]);
  useEffect(() => {
    if (blocked || currentNode.type === 'choice' || currentNode.type === 'ending') return;
    if (currentNode.type === 'dialogue' && skipping && canSkip(currentNode.id, seenRef.current)) {
      const timer = window.setTimeout(() => goTo(currentNode.next), 160);
      return () => clearTimeout(timer);
    }
    if (!auto || (currentNode.type === 'dialogue' && isTyping)) return;
    const delay = currentNode.type === 'scene' ? 1400 : settings.autoDelay * 1000;
    const timer = window.setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [auto, skipping, blocked, currentNode, isTyping, advance, goTo, settings.autoDelay]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || paused || pending) return;
      if (hidden) { if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') { event.preventDefault(); setHidden(false); } return; }
      if (event.key === 'Escape') { event.preventDefault(); onMenu('pause'); return; }
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, select, textarea, [contenteditable="true"]')) return;
      const key = event.key.toLowerCase();
      if (key === 'h') { event.preventDefault(); onMenu('history'); return; }
      if (key === 'a' && currentNode.type === 'dialogue') { event.preventDefault(); toggleAuto(); return; }
      if (key === 's') { event.preventDefault(); toggleSkip(); return; }
      if (currentNode.type === 'choice' && /^[1-9]$/.test(event.key)) {
        const choice = currentNode.choices[Number(event.key) - 1];
        if (choice) { event.preventDefault(); choose(choice); }
        return;
      }
      if ((event.key === 'Enter' || event.key === ' ') && target?.tagName !== 'BUTTON') { event.preventDefault(); manualAdvance(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [choose, currentNode, hidden, manualAdvance, onMenu, paused, pending, toggleAuto, toggleSkip]);
  const finishSceneLoad = useCallback(() => { if (pending) { setCursor(pending); setPending(null); } }, [pending]);

  return <main className={`game-shell ${hidden ? 'game-shell--hidden' : ''}`} style={{ '--text-scale': settings.textSize / 100, '--dialogue-opacity': settings.panelOpacity / 100 } as React.CSSProperties}>
    <div className="scene-background" ref={backgroundRef} key={cursor.background} style={{ backgroundImage: `url(${backgrounds[cursor.background]})` }} />
    <div className="scene-overlay" />
    {!reducedMotion && <Sparkles />}
    {!reducedMotion && currentNode.type === 'dialogue' && currentNode.sfx && <MagicBurst key={currentNode.id} accent={character?.accent ?? '#fff0a8'} />}
    <header className="game-controls" inert={hidden || !!pending}>
      <div className="game-badge player-badge"><span className="player-badge__portrait" aria-hidden="true"><PonyAvatar pony={cursor.pony} portrait /></span><span><strong className="player-badge__name">{cursor.pony.name}</strong><small>{sceneNames[cursor.background]}</small></span></div>
      <div className="control-actions">
        <button className="icon-button" onClick={() => onMutedChange(!settings.muted)} aria-label={settings.muted ? 'Activar sonido' : 'Silenciar'}><VolumeIcon muted={settings.muted} /></button>
        <button className="icon-button" onClick={() => onMenu('settings')} aria-label="Configuración">⚙</button>
        <button className="icon-button" onClick={() => onMenu('pause')} aria-label="Pausar juego">Ⅱ</button>
      </div>
    </header>
    <div className="story-layer" inert={hidden || !!pending}>
      <div className={`story-frame ${currentNode.type === 'scene' || currentNode.type === 'ending' ? 'story-frame--center' : ''}`} ref={storyFrameRef}>
        {portrait && character && <div className={`portrait-stage portrait-stage--${character.id}`} aria-hidden="true">
          <div className="portrait-glow" style={{ '--portrait-color': character.accent } as React.CSSProperties} />
          <div className="portrait-entrance" ref={portraitEntranceRef}><img ref={portraitImageRef} className={`portrait-image ${character.portraitClass ?? ''}`} src={portrait} alt="" key={`${currentNode.id}-${emotion}`} /></div>
        </div>}
        <div className="story-content">
          {currentNode.type === 'scene' && <SceneCard node={currentNode} onAdvance={manualAdvance} />}
          {currentNode.type === 'dialogue' && <DialoguePanel node={currentNode} displayedText={displayedText} isTyping={isTyping} onAdvance={manualAdvance} />}
          {currentNode.type === 'choice' && <ChoicePanel prompt={currentNode.prompt} choices={currentNode.choices} onChoose={choose} />}
          {currentNode.type === 'ending' && <EndingScreen node={currentNode} onRestart={onExit} />}
        </div>
      </div>
      <nav className="quick-menu" aria-label="Controles de la novela visual">
        <button onClick={() => onMenu('history')} title="Historial (H)">Historial</button>
        <button aria-pressed={auto} disabled={currentNode.type === 'choice' || currentNode.type === 'ending'} onClick={toggleAuto} title="Lectura automática (A)">Auto <span aria-hidden="true">▷</span></button>
        <button aria-pressed={skipping} disabled={!canSkip(currentNode.id, seenRef.current)} onClick={toggleSkip} title="Saltar solo texto ya leído (S)">Saltar <span aria-hidden="true">»</span></button>
        <span className="quick-menu__divider" />
        <button onClick={() => onMenu('save')}>Guardar</button><button onClick={() => onMenu('load')}>Cargar</button>
        <button onClick={onQuickSave} title="Guardar en el espacio rápido">G. rápida</button><button onClick={onQuickLoad} disabled={!hasQuickSave} title="Cargar el guardado rápido">C. rápida</button>
        <span className="quick-menu__divider" /><button onClick={() => setHidden(true)}>Ocultar interfaz</button>
      </nav>
    </div>
    {hidden && <button className="restore-interface" onClick={() => setHidden(false)} aria-label="Mostrar interfaz"><span>Mostrar interfaz · Clic o Esc</span></button>}
    {pending && <LoadingScreen assets={[backgrounds[pending.background]]} title={sceneNames[pending.background]} onReady={finishSceneLoad} />}
  </main>;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [savedGame, setSavedGame] = useState<SavedGame | null>(() => parseSave(readStorage(SAVE_KEY)));
  const [activeGame, setActiveGame] = useState<SavedGame | null>(null);
  const [creatingPony, setCreatingPony] = useState(false);
  const [session, setSession] = useState(0);
  const [settings, setSettings] = useState<GameSettings>(readSettings);
  const [slots, setSlots] = useState(readSlots);
  const [menu, setMenu] = useState<MenuId | null>(null);
  const [notice, setNotice] = useState('');
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);
  const [transition, setTransition] = useState<{ save: SavedGame | null; title: string; assets: string[] } | null>(null);
  const reducedMotion = settings.reducedMotion || (settings.followSystemMotion && systemReduced);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useLayoutEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);
  useEffect(() => {
    audioEngine.setMusicVolume(settings.musicVolume);
    audioEngine.setEffectsVolume(settings.effectsVolume);
    audioEngine.setMuted(settings.muted);
    if (!writeStorage(SETTINGS_KEY, settings)) setNotice('No se pudieron conservar los ajustes en este navegador.');
  }, [settings]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      if (button && !button.disabled) audioEngine.playUiClick();
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, []);
  useEffect(() => {
    const hover = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null;
      if (!button || button.disabled || !button.closest('.main-menu, .game-controls, .quick-menu, .game-modal, .pony-creator')) return;
      if (event.relatedTarget instanceof Node && button.contains(event.relatedTarget)) return;
      audioEngine.playUiHover();
    };
    document.addEventListener('pointerover', hover, true);
    return () => document.removeEventListener('pointerover', hover, true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    audioEngine.setMusicTrack(activeGame ? 'game' : 'menu');
  }, [activeGame, ready]);
  useEffect(() => {
    const update = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  const saveProgress = useCallback((save: SavedGame) => {
    const stamped = { ...save, savedAt: Date.now() };
    setSavedGame(stamped);
    if (!writeStorage(SAVE_KEY, stamped)) setNotice('No se pudo guardar el progreso. Comprueba el almacenamiento del navegador.');
  }, []);
  const setMuted = useCallback((muted: boolean) => setSettings((current) => ({ ...current, muted })), []);
  const initialReady = useCallback(() => setReady(true), []);
  const finishTransition = useCallback(() => {
    if (!transition) return;
    setActiveGame(transition.save);
    setSession((value) => value + 1);
    setTransition(null);
  }, [transition]);
  const launchGame = (save: SavedGame) => {
    void audioEngine.start().catch(() => undefined);
    setMenu(null);
    setCreatingPony(false);
    setTransition({ save, title: 'Abriendo tu historia', assets: [PONY_BASE, backgrounds[save.background], ...preloadableAssets] });
  };
  const newGame = () => { setMenu(null); setCreatingPony(true); };
  const startWithPony = (pony: PonyAppearance) => launchGame({ nodeId: INITIAL_NODE_ID, background: 'ponyville', history: [], pony });
  const exitGame = () => {
    setMenu(null);
    setTransition({ save: null, title: 'De vuelta a Ponyville', assets: [MENU_GROUP_ARTWORK, backgrounds.ponyville] });
  };
  const saveSlot = (index: number) => {
    if (!savedGame || !activeGame) return;
    const next = [...slots];
    next[index] = { ...savedGame, savedAt: Date.now() };
    if (!writeStorage(SLOTS_KEY, next)) { setNotice('No se pudo guardar la partida. No se ha reemplazado el espacio.'); return; }
    setSlots(next);
    setNotice(index === 0 ? '✦ Guardado rápido completado' : `✦ Partida ${index} guardada`);
  };
  const toggleFullscreen = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { setNotice('Este navegador no permite activar la pantalla completa aquí.'); }
  };
  const titles: Record<MenuId, string> = { pause: 'Un pequeño descanso', settings: 'Configuración', save: 'Guardar un recuerdo', load: 'Cargar partida', quickload: 'Volver al guardado rápido', history: 'Nuestra historia', help: 'Cómo jugar', new: 'Una nueva aventura' };

  return <MotionContext.Provider value={reducedMotion}>
    <div className="app-view" inert={!!transition}>
      {!ready ? <LoadingScreen assets={[...preloadableAssets, MENU_GROUP_ARTWORK, PONY_BASE]} onReady={initialReady} /> : creatingPony ?
        <PonyCreator onCancel={() => setCreatingPony(false)} onComplete={startWithPony} /> : activeGame ?
        <Game key={session} initialSave={activeGame} settings={settings} reducedMotion={reducedMotion} paused={!!menu || !!transition}
          onExit={exitGame} onSave={saveProgress} onMenu={setMenu} onMutedChange={setMuted}
          onQuickSave={() => saveSlot(0)} onQuickLoad={() => setMenu('quickload')} hasQuickSave={!!slots[0]} /> :
        <TitleScreen savedGame={savedGame} onContinue={() => { if (savedGame) launchGame(savedGame); }} onNewGame={() => savedGame ? setMenu('new') : newGame()} onMenu={setMenu} />}
    </div>
    {transition && <LoadingScreen assets={transition.assets} title={transition.title} onReady={finishTransition} />}
    <CursorEffects enabled={settings.cursorEffects && !reducedMotion && !menu} />
    {menu && <Modal title={titles[menu]} subtitle={activeGame ? 'Tu aventura te espera. Tómate tu tiempo.' : 'Cada aventura se disfruta a tu manera.'} onClose={() => setMenu(null)}>
      <CursorEffects enabled={settings.cursorEffects && !reducedMotion} />
      {menu === 'settings' && <SettingsPanel settings={settings} onChange={setSettings} fullscreen={fullscreen} fullscreenAvailable={!!document.fullscreenEnabled} onFullscreen={() => void toggleFullscreen()} />}
      {(menu === 'save' || menu === 'load') && <SaveSlots key={menu} mode={menu} slots={slots} autosave={savedGame} onSave={saveSlot} onLoad={launchGame} />}
      {menu === 'history' && <HistoryPanel save={savedGame} />}
      {menu === 'help' && <HelpPanel />}
      {menu === 'quickload' && slots[0] && <div className="new-game-prompt"><p>Volverás a tu guardado rápido en «{sceneNames[slots[0].background]}». Se reemplazará el progreso automático actual.</p><button className="primary-button" onClick={() => launchGame(slots[0]!)}>Cargar guardado rápido</button></div>}
      {menu === 'new' && <div className="new-game-prompt"><span aria-hidden="true">✦</span><p>Primero crearás tu poni. Cuando comiences la aventura, se reemplazará el guardado automático; tus partidas manuales seguirán disponibles.</p><button className="primary-button" onClick={newGame}>Crear mi poni</button></div>}
      {menu === 'pause' && <>{savedGame && <div className="pause-pony"><PonyAvatar pony={savedGame.pony} /><div><strong>{savedGame.pony.name}</strong><p>Tu propia magia en Ponyville.</p></div></div>}<nav className="pause-actions" aria-label="Menú de pausa">
        <button className="primary-button" onClick={() => setMenu(null)}>Seguir la aventura <span aria-hidden="true">▷</span></button>
        <button className="secondary-button" onClick={() => setMenu('save')}>Guardar partida</button><button className="secondary-button" onClick={() => setMenu('load')}>Cargar partida</button>
        <button className="secondary-button" onClick={() => setMenu('settings')}>Configuración</button><button className="secondary-button" onClick={() => setMenu('help')}>Cómo jugar</button>
        <button className="text-button" onClick={exitGame}>Volver al menú principal</button><p className="setting-note">Tu progreso actual se guarda automáticamente.</p>
      </nav></>}
      {notice && <p className="modal-notice" role="status">{notice}</p>}
    </Modal>}
    {notice && !menu && <div className="game-toast" role="status">{notice}</div>}
  </MotionContext.Provider>;
}
