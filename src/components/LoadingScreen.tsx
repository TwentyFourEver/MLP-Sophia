import { useEffect, useState } from 'react';

const loadedImages = new Map<string, Promise<void>>();
function loadImage(source: string) {
  const cached = loadedImages.get(source);
  if (cached) return cached;
  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => finish(new Error(source)), 15000);
    const finish = (error?: Error) => {
      clearTimeout(timer);
      image.onload = image.onerror = null;
      if (error) { loadedImages.delete(source); reject(error); } else resolve();
    };
    image.onload = () => { void image.decode().then(() => finish(), () => finish(new Error(source))); };
    image.onerror = () => finish(new Error(source));
    image.src = source;
  });
  loadedImages.set(source, promise);
  return promise;
}

export function LoadingScreen({ assets, title = 'Preparando la magia', onReady }: {
  assets: string[]; title?: string; onReady: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const assetKey = JSON.stringify(assets);
  useEffect(() => {
    let cancelled = false;
    let completed = 0;
    setProgress(0);
    setFailed(false);
    const sources = [...new Set<string>(JSON.parse(assetKey))];
    const minimum = new Promise<void>((resolve) => window.setTimeout(resolve, 600));
    void Promise.all([minimum, ...sources.map(async (source) => {
      await loadImage(source);
      completed++;
      if (!cancelled) setProgress(Math.round(completed / sources.length * 100));
    })]).then(() => { if (!cancelled) onReady(); }, () => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [assetKey, attempt, onReady]);
  return (
    <div className="loading-screen loading-overlay" role="status" aria-live="polite" aria-busy={!failed}>
      <div className="loading-constellation" aria-hidden="true"><span>✧</span><b>✦</b><span>✧</span></div>
      <span className="eyebrow">SOPHIA · UNA HISTORIA DE AMISTAD</span>
      <h1>{failed ? 'La magia necesita otro intento' : title}</h1>
      <p>{failed ? 'No se pudieron cargar algunas imágenes.' : 'Un nuevo recuerdo está a punto de brillar…'}</p>
      <div className="loading-track" role="progressbar" aria-label="Carga de imágenes" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <span style={{ width: `${progress}%` }} />
      </div>
      {failed ? <button className="primary-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button> : <span className="loading-value">{progress}%</span>}
      <small className="loading-tip">✦ Puedes volver a leer tus conversaciones desde el historial.</small>
    </div>
  );
}
