import { sceneNames, type SavedGame } from '../gameState';
import type { MenuId } from './GameMenus';

export const MENU_GROUP_ARTWORK = '/assets/menu/ponies-group.png';
export function TitleScreen({ savedGame, onContinue, onNewGame, onMenu }: {
  savedGame: SavedGame | null; onContinue: () => void; onNewGame: () => void; onMenu: (menu: MenuId) => void;
}) {
  return <main className="title-screen main-menu">
    <div className="title-screen__background main-menu__background" />
    <div className="title-screen__shade main-menu__shade" />
    <div className="menu-topline"><span>✦ EQUESTRIA TALES</span><span>UNA NOVELA VISUAL</span></div>
    <div className="main-menu__layout">
      <section className="main-menu__panel" aria-labelledby="game-title">
        <div className="main-menu__brand">
          <p className="eyebrow">Un pequeño viaje. Una gran amistad.</p>
          <h1 id="game-title"><span>Sophia</span><small>y la Estrella de la Amistad</small></h1>
          <div className="brand-divider" aria-hidden="true"><span />✦<span /></div>
          <p>Hay una luz en Ponyville que solo tú puedes despertar.</p>
        </div>
        <nav className="main-menu__actions" aria-label="Menú principal">
          <button className={`menu-action ${savedGame ? 'menu-action--featured' : ''}`} onClick={onContinue} disabled={!savedGame}>
            <span className="menu-action__symbol" aria-hidden="true">▷</span><span><strong>Continuar</strong><small>{savedGame ? sceneNames[savedGame.background] : 'Tu aventura está por comenzar'}</small></span><span className="menu-action__arrow" aria-hidden="true">›</span>
          </button>
          <button className={`menu-action ${!savedGame ? 'menu-action--featured' : ''}`} onClick={onNewGame}>
            <span className="menu-action__symbol" aria-hidden="true">✦</span><span><strong>Nueva partida</strong><small>Crea tu poni y escribe tu propia historia</small></span><span className="menu-action__arrow" aria-hidden="true">›</span>
          </button>
          <div className="menu-secondary-actions">
            <button onClick={() => onMenu('load')}><span aria-hidden="true">▱</span>Cargar partida</button>
            <button onClick={() => onMenu('settings')}><span aria-hidden="true">⚙</span>Configuración</button>
          </div>
          <button className="menu-help text-button" onClick={() => onMenu('help')}>Cómo jugar <span aria-hidden="true">↗</span></button>
        </nav>
        <p className="menu-save-note"><span aria-hidden="true">◆</span> Tu progreso se guarda automáticamente</p>
      </section>
      <aside className="menu-artwork" aria-label="Tus nuevas amigas en Ponyville">
        <div className="menu-artwork__orbit" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span><span>✧</span></div>
        <img className="menu-artwork__image" src={MENU_GROUP_ARTWORK} alt="Twilight Sparkle, Pinkie Pie, Rainbow Dash, Rarity, Fluttershy, Applejack y Spike juntos" />
        <div className="menu-artwork__caption"><span>TE ESTÁBAMOS ESPERANDO</span><p>La magia empieza contigo.</p></div>
      </aside>
    </div>
  </main>;
}
