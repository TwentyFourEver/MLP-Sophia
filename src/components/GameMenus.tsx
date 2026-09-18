import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { backgrounds, characters } from '../story/characters';
import { story } from '../story/story';
import { defaultSettings, sceneNames, type GameSettings, type SavedGame, type TextSpeedId } from '../gameState';
import { ponyText } from '../pony';

export type MenuId = 'pause' | 'settings' | 'save' | 'load' | 'quickload' | 'history' | 'help' | 'new';
export function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current!;
    dialog.showModal();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeRef.current(); }
      if (event.key === 'Tab') {
        const controls = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]')].filter((element) => element.getClientRects().length);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    dialog.addEventListener('keydown', onKey);
    return () => { dialog.removeEventListener('keydown', onKey); dialog.close(); previous?.focus(); };
  }, []);
  return createPortal(
    <dialog className="game-modal" ref={dialogRef} aria-labelledby="modal-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <header className="modal-heading">
        <div><span className="eyebrow">✦ TU RINCÓN EN PONYVILLE</span><h2 id="modal-title">{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        <button autoFocus className="modal-close" onClick={onClose} aria-label="Cerrar ventana">×</button>
      </header>
      <div className="modal-body">{children}</div>
      <footer className="modal-footer"><span>Los recuerdos se quedan contigo.</span><button className="text-button" onClick={onClose}>Volver <kbd>Esc</kbd></button></footer>
    </dialog>, document.body,
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: () => void }) {
  return <div className="setting-row"><div><strong>{label}</strong><small>{hint}</small></div><button className="switch" role="switch" aria-label={label} aria-checked={checked} onClick={onChange}><span />{checked ? 'Sí' : 'No'}</button></div>;
}
function Slider({ label, hint, value, min, max, step = 1, suffix = '%', onChange }: { label: string; hint: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return <label className="setting-row setting-row--slider"><span><strong>{label}</strong><small>{hint}</small></span><span className="setting-range"><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /><output>{value}{suffix}</output></span></label>;
}
export function SettingsPanel({ settings, onChange, onFullscreen, fullscreenAvailable, fullscreen }: { settings: GameSettings; onChange: (settings: GameSettings) => void; onFullscreen: () => void; fullscreenAvailable: boolean; fullscreen: boolean }) {
  const [tab, setTab] = useState('Lectura');
  const patch = (update: Partial<GameSettings>) => onChange({ ...settings, ...update });
  return <>
    <div className="settings-tabs" aria-label="Categorías de configuración">
      {['Lectura', 'Sonido', 'Pantalla'].map((name) => <button key={name} aria-pressed={tab === name} onClick={() => setTab(name)}>{name}</button>)}
    </div>
    <section className="settings-content" aria-label={tab}>
      {tab === 'Lectura' && <>
        <div className="setting-row setting-row--stack"><div><strong>Velocidad del texto</strong><small>Elige cómo aparece cada diálogo.</small></div><div className="segmented-control">
          {(['slow', 'normal', 'fast', 'instant'] as TextSpeedId[]).map((speed, index) => <button key={speed} aria-pressed={settings.textSpeed === speed} onClick={() => patch({ textSpeed: speed })}>{['Lenta', 'Normal', 'Rápida', 'Instantánea'][index]}</button>)}
        </div></div>
        <Slider label="Pausa de lectura automática" hint="Espera adicional después de mostrar el texto completo." min={1} max={8} value={settings.autoDelay} suffix=" s" onChange={(autoDelay) => patch({ autoDelay })} />
        <Slider label="Tamaño del texto" hint="Se aplica a los diálogos de la historia." min={85} max={125} step={5} value={settings.textSize} onChange={(textSize) => patch({ textSize })} />
        <div className="reading-preview" style={{ fontSize: `${settings.textSize}%` }}><strong>Twilight Sparkle</strong><p>¡Sophia! Cada amistad tiene su propia forma de brillar.</p></div>
        <p className="setting-note">El salto rápido avanza únicamente por diálogos ya leídos y se detiene ante cada decisión.</p>
      </>}
      {tab === 'Sonido' && <>
        <Toggle label="Sonido del juego" hint="Activa la música y los efectos." checked={!settings.muted} onChange={() => patch({ muted: !settings.muted })} />
        <Slider label="Volumen de la música" hint="Melodías del menú y de la aventura." min={0} max={100} value={Math.round(settings.musicVolume * 100)} onChange={(value) => patch({ musicVolume: value / 100 })} />
        <Slider label="Volumen de los sonidos" hint="Botones, palabras y efectos mágicos." min={0} max={100} value={Math.round(settings.effectsVolume * 100)} onChange={(value) => patch({ effectsVolume: value / 100 })} />
        <Toggle label="Sonido al escribir" hint="Un pequeño sonido mientras aparece el diálogo." checked={settings.textSound} onChange={() => patch({ textSound: !settings.textSound })} />
      </>}
      {tab === 'Pantalla' && <>
        <Slider label="Opacidad del diálogo" hint="Ajusta el fondo de la caja de texto." min={45} max={100} value={settings.panelOpacity} onChange={(panelOpacity) => patch({ panelOpacity })} />
        <Toggle label="Cursor mágico" hint="Estela luminosa y estrellas al hacer clic con el ratón." checked={settings.cursorEffects} onChange={() => patch({ cursorEffects: !settings.cursorEffects })} />
        <Toggle label="Reducir movimiento" hint="Desactiva las animaciones y partículas del juego." checked={settings.reducedMotion} onChange={() => patch({ reducedMotion: !settings.reducedMotion })} />
        <Toggle label="Seguir el ajuste del sistema" hint="Reduce el movimiento cuando lo pida Windows o tu dispositivo. Desactívalo para ver las animaciones del juego." checked={settings.followSystemMotion} onChange={() => patch({ followSystemMotion: !settings.followSystemMotion })} />
        <div className="setting-row"><div><strong>Pantalla completa</strong><small>{fullscreenAvailable ? 'Sumérgete en la historia.' : 'No disponible en este navegador.'}</small></div><button className="secondary-button" disabled={!fullscreenAvailable} onClick={onFullscreen}>{fullscreen ? 'Salir' : 'Activar'}</button></div>
      </>}
    </section>
    <button className="text-button reset-settings" onClick={() => onChange({ ...defaultSettings })}>Restablecer ajustes</button>
  </>;
}

export function SaveSlots({ mode, slots, autosave, onSave, onLoad }: { mode: 'save' | 'load'; slots: (SavedGame | null)[]; autosave: SavedGame | null; onSave: (index: number) => void; onLoad: (save: SavedGame) => void }) {
  const [confirm, setConfirm] = useState<number | null>(null);
  const [loading, setLoading] = useState<SavedGame | null>(null);
  const cards = mode === 'load' ? [autosave, ...slots] : slots.slice(1);
  return <>
    <p className="setting-note">{mode === 'save' ? 'Guarda este momento en uno de tus tres espacios.' : 'Elige el recuerdo desde el que quieres continuar.'} Las partidas se guardan en este navegador.</p>
    <div className="save-grid">{cards.map((save, index) => {
      const slot = mode === 'load' ? index - 1 : index + 1;
      const label = slot === -1 ? 'Autoguardado' : slot === 0 ? 'Guardado rápido' : `Partida ${slot}`;
      return <button key={slot} className="save-card" disabled={mode === 'load' && !save} onClick={() => {
        if (mode === 'load' && save) setLoading(save);
        else if (save) setConfirm(slot);
        else onSave(slot);
      }}>
        {save ? <img src={backgrounds[save.background]} alt="" /> : <span className="save-card__empty" aria-hidden="true">✧</span>}
        <span className="save-card__copy"><strong>{label}</strong>{save && <span className="save-pony-name">{save.pony.name}</span>}<span>{save ? sceneNames[save.background] : 'Un recuerdo por escribir'}</span><small>{save?.savedAt ? new Date(save.savedAt).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : save ? 'Partida disponible' : mode === 'save' ? 'Guardar aquí' : 'Espacio vacío'}</small></span>
      </button>;
    })}</div>
    {confirm !== null && <div className="inline-confirm" role="alert"><p>¿Reemplazar la partida {confirm} con este momento?</p><button className="secondary-button" onClick={() => { onSave(confirm); setConfirm(null); }}>Reemplazar</button><button className="text-button" onClick={() => setConfirm(null)}>Cancelar</button></div>}
    {loading && <div className="inline-confirm" role="alert"><p>¿Continuar desde este recuerdo? Se reemplazará el progreso automático actual.</p><button className="secondary-button" onClick={() => onLoad(loading)}>Cargar partida</button><button className="text-button" onClick={() => setLoading(null)}>Cancelar</button></div>}
  </>;
}
export function HistoryPanel({ save }: { save: SavedGame | null }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, []);
  const entries = save ? [...save.history, ...(story[save.nodeId].type === 'dialogue' ? [{ nodeId: save.nodeId }] : [])] : [];
  return <div className="history-list">{entries.length ? entries.map((entry, index) => {
    const node = story[entry.nodeId];
    if (node.type !== 'dialogue' && node.type !== 'choice') return null;
    const character = node.type === 'dialogue' && node.speaker !== 'narrator' ? characters[node.speaker] : null;
    return <article key={index} className={node.type === 'choice' ? 'history-choice' : ''}><strong style={{ color: character?.accent }}>{node.type === 'choice' ? 'Tu elección' : character?.name ?? 'Narración'}</strong><p>{ponyText(node.type === 'dialogue' ? node.text : entry.choice ?? '', save!.pony.name)}</p></article>;
  }) : <p className="empty-state">Tus conversaciones aparecerán aquí al comenzar la aventura.</p>}<div ref={endRef} /></div>;
}
export function HelpPanel() {
  return <><p className="setting-note">Lee, explora y decide cómo brilla tu amistad. Tu progreso se guarda al avanzar.</p><dl className="help-list">
    {[[ 'Clic · Enter · Espacio', 'Completar el texto o avanzar.' ], ['1 / 2', 'Elegir una respuesta.'], ['Esc', 'Abrir el menú de pausa o cerrar una ventana.'], ['A', 'Activar o detener la lectura automática.'], ['S', 'Saltar diálogos ya leídos. Se detiene ante texto nuevo.'], ['H', 'Abrir el historial de conversaciones.'], ['Tab', 'Navegar por los controles con el teclado.']].map(([key, text]) => <div key={key}><dt><kbd>{key}</kbd></dt><dd>{text}</dd></div>)}
    </dl><p className="setting-note">Ocultar interfaz permite contemplar la escena. Un clic o Esc vuelve a mostrarla. La lectura automática se pausa al abrir un menú o cambiar de pestaña.</p></>;
}
