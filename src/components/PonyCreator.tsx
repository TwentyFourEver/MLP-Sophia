import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { DEFAULT_PONY, MANE_STYLES, PONY_PRESETS, parsePony, type PonyAppearance } from '../pony';
import { PonyAvatar } from './PonyAvatar';
import '../pony.css';

const parts = [
  { id: 'coat', label: 'Piel', icon: '♡' },
  { id: 'eyes', label: 'Ojos', icon: '◉' },
  { id: 'mane', label: 'Pelo', icon: '❧' },
] as const;
type ColorPart = typeof parts[number]['id'];
const palettes: Record<ColorPart, { name: string; color: string }[]> = {
  coat: [
    { name: 'Lavanda', color: '#d6b4ed' }, { name: 'Rosa', color: '#f3b6d4' },
    { name: 'Cielo', color: '#a7dfef' }, { name: 'Menta', color: '#b5e5cd' },
    { name: 'Vainilla', color: '#fff2a8' }, { name: 'Durazno', color: '#f5c59f' },
    { name: 'Perla', color: '#f0e9f3' }, { name: 'Cacao', color: '#a08077' },
  ],
  eyes: [
    { name: 'Violeta', color: '#7955b5' }, { name: 'Turquesa', color: '#159b9b' },
    { name: 'Azul', color: '#497fce' }, { name: 'Verde', color: '#589e7b' },
    { name: 'Ámbar', color: '#b98835' }, { name: 'Rosa', color: '#aa5687' },
    { name: 'Avellana', color: '#8b6042' }, { name: 'Gris', color: '#718394' },
  ],
  mane: [
    { name: 'Ciruela', color: '#61519c' }, { name: 'Rosa', color: '#f2a5c9' },
    { name: 'Azul', color: '#446caa' }, { name: 'Menta', color: '#60b8a6' },
    { name: 'Miel', color: '#e6b85c' }, { name: 'Frambuesa', color: '#b66777' },
    { name: 'Nieve', color: '#e6e3f0' }, { name: 'Medianoche', color: '#36384f' },
  ],
};

function ManeIcon({ style }: { style: PonyAppearance['maneStyle'] }) {
  const paths: Record<PonyAppearance['maneStyle'], string> = {
    flowing: 'M15 31C6 18 13 5 29 6c19-5 27 12 21 24-4 9 5 11 6 5 4 12-14 14-13 2V23C34 11 19 13 16 29c-2 8 5 11 6 6 4 9-12 13-13 3',
    swept: 'M13 31C6 14 17 4 33 6c14 0 22 12 17 24l-6-9-8-8c-3 12-12 15-21 16l7-8Z',
    short: 'M13 31C7 17 16 5 30 6c15-1 25 11 20 25l-8-7-2 6-9-8-4 6-5-4Z',
    curly: 'M12 31c-5-9 1-17 9-17 1-8 12-12 18-6 8-2 15 6 11 13 7 4 5 15-3 16-2 9-14 10-18 3-7 5-14-1-12-7-2-15-12-16 5-9-8-15-16-10-8 0-14 9-10 16-7 5-17 1-14-7Z',
    braided: 'M13 29C8 14 18 5 33 6c14 1 21 12 16 24l-8-10-8-7c-3 9-9 13-17 15m28 3c8 4 7 11 1 13-7 2-11-6-5-10 2-5 7-6 11-3 5 4 1 11-4 12-6 2-11-4-9-8',
    mohawk: 'M11 30l7-13 3 6 6-17 5 13 7-14 3 18 8-8-1 16-8-6-4 8-8-7-6 7-5-8-5 6Z',
    bob: 'M11 31C7 13 17 5 31 6c16-1 25 11 20 27l-8 7-3-12c-3 6-12 9-22 6l-1 7c-6-1-9-5-6-10Z',
    straight: 'M10 42V22C10 0 50 0 50 22v20H40V22H20v20ZM16 24v13m29-13v13M20 17h20',
    ponytail: 'M13 30C8 16 19 9 31 11c12-6 19 4 18 14L36 17C30 27 19 28 13 30ZM38 12C42-2 59 4 54 20c-4 9-2 16 2 20-15-1-18-11-13-20M38 12l7 5',
    pigtails: 'M15 27C11 7 45 4 46 25L32 16 15 27ZM15 20C2 17 3 35 8 43l8-5-3-9M46 20c13-3 12 15 7 23l-8-5 3-9',
    bun: 'M20 12C9 0 45-3 39 12M14 31C8 10 45 3 49 28L34 17C29 24 21 28 14 31ZM24 8c-4-6 11-7 9 0M18 21l15-7',
    pixie: 'M11 30C7 15 23 6 38 9l12 9-11-1 11 12-15-7 1 7-11-8-14 9ZM16 20l13-6',
    layered: 'M12 28C6 11 30 2 43 11l8 16-9-5 10 15-12-3 8 11-15-6-3-14-10 10 1-9-13 9 4-7ZM18 21l15-9',
    spacebuns: 'M18 18C1 21 2 0 15 3c8 0 13 9 7 14M39 17C30 5 47-4 54 7c6 10-4 16-13 12M12 31C10 9 46 9 49 31L32 21 12 31ZM11 10c-1 5 7 6 7 1m24 0c-1 5 7 6 7 1',
    afro: 'M10 35C0 34 0 23 6 19 1 10 10 4 17 6 19-3 29-2 33 3 40-3 49 1 49 8 59 7 62 20 55 24 61 31 53 40 46 36L40 24C31 18 20 21 17 34ZM11 15l3-2m11-4 3 1m16 4 3 2',
    pompadour: 'M12 31C4 22 10 17 15 15 4 5 20 0 36 3c23 2 23 21 12 26l-9-10C30 23 21 26 12 31ZM19 11C30 4 44 8 46 15',
    spiral: 'M13 28C6 12 19 2 35 7c15-2 24 13 15 23L37 18 13 28ZM15 24C-2 29 4 46 17 42c11-3 6-17-1-12-4 3-1 7 2 5m28-10c17 5 11 22-2 18-11-3-6-17 1-12 4 3 1 7-2 5',
    fan: 'M11 31 5 19 17 19 10 5 25 13 30 1 36 13 51 5 44 20 56 20 49 32 32 23ZM18 22l-3-9m12 7 3-12m9 14 7-9',
    star: 'M10 31 15 19 4 12 22 13 28 1 35 12 52 7 45 21 56 31 39 29 32 40 25 27ZM20 20l8-8 6 7 10-3',
  };
  return <svg viewBox="0 0 60 48" fill="none" aria-hidden="true">
    <path d="M17 22C17 8 42 7 44 23v6c0 18-27 18-27 0Z" fill="currentColor" opacity=".1" />
    <path d={paths[style]} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export function PonyCreator({ onCancel, onComplete }: {
  onCancel: () => void; onComplete: (pony: PonyAppearance) => void;
}) {
  const [pony, setPony] = useState<PonyAppearance>({ ...DEFAULT_PONY });
  const [part, setPart] = useState<ColorPart>('coat');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const currentPart = parts.find(({ id }) => id === part)!;
  const patch = (values: Partial<PonyAppearance>) => setPony((current) => ({ ...current, ...values }));

  useEffect(() => { headingRef.current?.focus(); }, []);
  const surprise = () => {
    const pick = (key: ColorPart) => palettes[key][Math.floor(Math.random() * palettes[key].length)].color;
    patch({ coat: pick('coat'), eyes: pick('eyes'), mane: pick('mane'), maneStyle: MANE_STYLES[Math.floor(Math.random() * MANE_STYLES.length)].id });
  };

  return <main className="pony-creator">
    <header className="creator-topbar">
      <button className="text-button creator-back" onClick={onCancel}><span aria-hidden="true">←</span> Volver al menú</button>
      <span className="creator-brand">✦ EQUESTRIA TALES</span>
      <span className="creator-step"><b>01</b> Tu poni <span aria-hidden="true">—</span> <span>02 Aventura</span></span>
    </header>
    <div className="creator-heading">
      <p className="eyebrow">TU HISTORIA EMPIEZA CONTIGO</p>
      <h1 ref={headingRef} tabIndex={-1}>Crea tu poni</h1>
      <p>Un poquito de color. Un toque de magia. Mucho de ti.</p>
    </div>
    <div className="creator-layout">
      <section className="creator-preview" aria-label="Vista previa de tu poni" style={{ '--pony-glow': pony.coat } as CSSProperties}>
        <div className="creator-orbit" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span><span>✧</span></div>
        <div className="creator-pedestal" aria-hidden="true" />
        <PonyAvatar pony={{ ...pony, name: pony.name.trim() || 'tu personaje' }} />
        <div className="creator-preview-caption"><span>HECHO DE TU PROPIA MAGIA</span><strong>{pony.name.trim() || 'Tu poni'}</strong></div>
        <button className="creator-random" onClick={surprise}><span aria-hidden="true">⤨</span> Sorpréndeme</button>
      </section>

      <form className="creator-panel" onSubmit={(event) => { event.preventDefault(); if (pony.name.trim()) onComplete(parsePony(pony)); }}>
        <div className="creator-panel-title"><span className="creator-panel-symbol" aria-hidden="true">✧</span><div className="creator-mini-preview" aria-hidden="true"><PonyAvatar pony={pony} portrait /></div><div><h2>Dale tu toque</h2><p>Cada detalle cuenta una historia.</p></div></div>
        <label className="creator-name" htmlFor="pony-name">¿Cómo te llamas?<span><input id="pony-name" value={pony.name} onChange={(event) => patch({ name: event.target.value })} maxLength={24} required autoComplete="off" spellCheck={false} placeholder="El nombre de tu poni" /><span aria-hidden="true">✦</span></span></label>

        <fieldset className="creator-colors">
          <legend>Tus colores</legend>
          <div className="creator-parts" aria-label="Parte que quieres colorear">{parts.map(({ id, label, icon }) =>
            <button type="button" key={id} aria-pressed={part === id} onClick={() => setPart(id)}><span aria-hidden="true">{icon}</span>{label}<i style={{ background: pony[id] }} /></button>,
          )}</div>
          <div className="creator-palette" aria-label={`Colores de ${currentPart.label.toLowerCase()}`}>
            {palettes[part].map(({ color, name }) => <button type="button" key={color} aria-label={`${currentPart.label}: ${name}`} title={name} aria-pressed={pony[part] === color} style={{ '--swatch': color } as CSSProperties} onClick={() => patch({ [part]: color })}><span aria-hidden="true">{pony[part] === color ? '✓' : ''}</span></button>)}
          </div>
          <label className="creator-custom-color"><span>O elige tu propio color</span><span className="creator-color-input"><input type="color" aria-label={`Color personalizado de ${currentPart.label.toLowerCase()}`} value={pony[part]} onChange={(event) => patch({ [part]: event.target.value })} /><output>{pony[part].toUpperCase()}</output><span aria-hidden="true">⌄</span></span></label>
        </fieldset>

        <fieldset className="creator-hairstyles"><legend>Un pelo con personalidad</legend><div className="creator-hairstyle-list" tabIndex={0} aria-label="Tipos de peinado">{MANE_STYLES.map(({ id, label }) => <button type="button" key={id} onClick={() => patch({ maneStyle: id })} aria-pressed={pony.maneStyle === id}><ManeIcon style={id} /><span>{label}</span></button>)}</div></fieldset>

        <fieldset className="creator-presets"><legend>Un poco de inspiración</legend><div>{PONY_PRESETS.map(({ label, ...appearance }) => <button key={label} type="button" onClick={() => patch(appearance)} title={`Inspiración: ${label}`} aria-label={`Inspiración: ${label}`}><span style={{ background: `linear-gradient(125deg, ${appearance.coat} 0 45%, ${appearance.mane} 45% 80%, ${appearance.eyes} 80%)` }} /><span>{label}</span></button>)}</div></fieldset>

        <div className="creator-submit"><button type="submit" className="primary-button" disabled={!pony.name.trim()}>Comenzar aventura <span aria-hidden="true">✦</span></button><p>Tu poni se guardará junto con tu partida.</p></div>
      </form>
    </div>
    <footer className="creator-footer"><span>La amistad empieza siendo tú.</span><button className="text-button" onClick={() => setPony({ ...DEFAULT_PONY })}>Restablecer diseño <span aria-hidden="true">↺</span></button></footer>
  </main>;
}
