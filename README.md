# Sophia y la Estrella de la Amistad

Una novela visual personal y larga ambientada en Ponyville. Sophia vive la historia en primera persona, conversa con Twilight, Spike y sus amigas, y emprende una aventura de seis capítulos para descubrir el secreto de la Estrella de la Amistad. Sus nueve decisiones cambian las reacciones y expresiones de sus amigas sin dejar a nadie fuera del final principal.

## Ejecutar el juego

Necesitas Node.js y npm. Desde esta carpeta:

```bash
npm install
npm run dev
```

Abre la dirección local que aparece en la terminal. El juego no necesita conexión a internet después de instalar sus dependencias.

## Otros comandos

```bash
npm test
npm run build
npm run preview
```

- `npm test` valida las rutas del guion y los recursos.
- `npm run build` crea la versión optimizada en `dist/`.
- `npm run preview` permite revisar esa versión optimizada.

## Interfaz y opciones de juego

- Menú principal renovado con acceso a continuar, nueva partida, cargar, configuración y ayuda.
- Al iniciar una partida puedes crear tu poni: nombre, colores independientes de piel, ojos y pelo, 19 peinados y cuatro combinaciones de inspiración. Incluye estilos cotidianos como lacio largo, coleta alta, dos coletas, moño, pixie y capas, además de moños dobles, afro, copete retro, espirales, abanico y estelar. La vista previa usa la plantilla original, conserva el brillo de los ojos y combina la crin con la cola.
- El nombre se usa en los diálogos y el historial. Tu retrato aparece durante la partida y puedes ver el poni completo al pausar. La apariencia se conserva en el autoguardado y en cada espacio manual o rápido; las partidas anteriores reciben el diseño de Sophia por defecto.
- Pantallas de carga al iniciar, entrar o salir de la partida y cambiar de escenario. Precargan y decodifican las imágenes, muestran progreso y permiten reintentar si falla un recurso.
- Ventanas centradas para pausa, configuración, historial y partidas. Conservan el foco del teclado y detienen la lectura mientras están abiertas.
- Autoguardado, tres espacios manuales y un espacio de guardado rápido. Las partidas se conservan en el almacenamiento local de este navegador, incluida la ruta de conversaciones y elecciones.
- Lectura automática con pausa ajustable y salto rápido solo para diálogos ya leídos. Las decisiones detienen ambos modos; nunca se elige una respuesta automáticamente.
- Historial, ocultar interfaz, pantalla completa cuando el navegador la admite, volumen independiente de música y efectos, sonido de escritura, cuatro velocidades de texto, tamaño y opacidad del diálogo.
- Estela del cursor y estrellas al hacer clic con ratón. Las animaciones están activadas por defecto. Se pueden desactivar con «Reducir movimiento» o vincular opcionalmente a la preferencia del dispositivo con «Seguir el ajuste del sistema».
- Los retratos y la caja de diálogo comparten un contenedor. La altura disponible se calcula con `ResizeObserver`, de modo que el personaje permanezca anclado al borde del diálogo al redimensionar la pantalla. Se reserva el espacio del párrafo completo durante la escritura.

## Controles

- Clic, toque, Enter o Espacio: completar el texto y avanzar.
- Teclas 1 y 2: elegir una respuesta.
- Esc: abrir la pausa o cerrar la ventana actual.
- A: activar o detener la lectura automática.
- S: activar o detener el salto de texto ya leído.
- H: abrir el historial.
- Tab / Mayús + Tab: recorrer los controles del juego y de sus ventanas.
- Tras ocultar la interfaz, un clic o Esc vuelve a mostrarla sin avanzar.

## Pruebas de interfaz

```bash
npm run test:ui
```

Las pruebas de Playwright usan Microsoft Edge instalado y un servidor local en el puerto 5174 (se inicia automáticamente si está libre). Comprueban guardado y carga, pausa de lectura, historial, transiciones, teclado y la posición del diálogo y los retratos en escritorio, móvil, horizontal y pantalla ancha. `npm test` comprueba además las rutas del guion y la compatibilidad de las partidas anteriores.

Este es un fangame personal y no oficial. No incluye música, voces ni logotipos oficiales.
