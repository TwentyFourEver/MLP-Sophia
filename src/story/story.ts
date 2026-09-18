import type { ChoiceNode, StoryNode } from './types';

export const INITIAL_NODE_ID = 'arrival-scene';

export const story: Record<string, StoryNode> = {
  'arrival-scene': {
    id: 'arrival-scene',
    type: 'scene',
    title: 'Una tarde en Ponyville',
    subtitle: 'Donde una nueva amistad está a punto de comenzar…',
    background: 'ponyville',
    next: 'arrival-narrator',
  },
  'arrival-narrator': {
    id: 'arrival-narrator',
    type: 'dialogue',
    speaker: 'narrator',
    text: 'El camino de piedra se abre ante ti. Las flores se mecen como si conocieran tu nombre y, bajo un arco dorado, una poni violeta revisa una lista por tercera vez.',
    next: 'twilight-welcome',
  },
  'twilight-welcome': {
    id: 'twilight-welcome',
    type: 'dialogue',
    speaker: 'twilight',
    emotion: 'happy',
    motion: 'bounce',
    text: '¡Sophia! Llegaste exactamente a tiempo. Bueno… tres minutos antes. Que, para ser tu primer día en Ponyville, es una señal estadísticamente excelente.',
    next: 'spike-list',
  },
  'spike-list': {
    id: 'spike-list',
    type: 'dialogue',
    speaker: 'spike',
    emotion: 'happy',
    motion: 'pop',
    text: 'Y también evita que Twilight vuelva a reorganizar la lista de bienvenida. Ya iba por colores, tamaños y nivel de importancia mágica.',
    next: 'twilight-explain',
  },
  'twilight-explain': {
    id: 'twilight-explain',
    type: 'dialogue',
    speaker: 'twilight',
    text: 'Cada nueva poni recibe una Estrella de Bienvenida. Brilla cuando Ponyville descubre la clase de amistad que esa poni trae consigo.',
    next: 'spike-star',
  },
  'spike-star': {
    id: 'spike-star',
    type: 'dialogue',
    speaker: 'spike',
    emotion: 'doubtful',
    motion: 'shake',
    text: 'Normalmente hace “tin”, lanza chispitas y todos comen pastel. Es una ceremonia bastante segura. Normalmente.',
    next: 'twilight-magic',
  },
  'twilight-magic': {
    id: 'twilight-magic',
    type: 'dialogue',
    speaker: 'twilight',
    emotion: 'sad',
    motion: 'droop',
    text: 'Pero tu estrella no ha encendido ni una sola punta. Eso no significa nada malo. Solo significa… algo que todavía no entiendo. Y eso sí me preocupa un poquito.',
    sfx: 'sparkle',
    next: 'arrival-narrator-two',
  },
  'arrival-narrator-two': {
    id: 'arrival-narrator-two',
    type: 'dialogue',
    speaker: 'narrator',
    text: 'La pequeña estrella de cristal emite un suspiro de luz y vuelve a apagarse. Desde el castillo llega un estruendo de confeti.',
    next: 'twilight-invite',
  },
  'twilight-invite': {
    id: 'twilight-invite',
    type: 'dialogue',
    speaker: 'twilight',
    emotion: 'happy',
    motion: 'bounce',
    text: 'Ven. Mis amigas están preparando la celebración. Tal vez la estrella solo necesite conocerte a través de ellas.',
    next: 'hall-scene',
  },
  'hall-scene': {
    id: 'hall-scene',
    type: 'scene',
    title: 'El salón de los preparativos',
    subtitle: 'Cintas, linternas y una cantidad sospechosa de confeti',
    background: 'hall',
    next: 'pinkie-entrance',
  },
  'pinkie-entrance': {
    id: 'pinkie-entrance',
    type: 'dialogue',
    speaker: 'pinkie',
    emotion: 'happy',
    motion: 'celebrate',
    text: '¡¡¡SORPRESAAAA!!! ¡Bienvenida, Sophia! Preparé globos, pastel, serpentinas, un pastel dentro de otro pastel y una canción con diecisiete rimas para “Sophia”.',
    sfx: 'surprise',
    next: 'pinkie-question',
  },
  'pinkie-question': {
    id: 'pinkie-question',
    type: 'dialogue',
    speaker: 'pinkie',
    emotion: 'happy',
    motion: 'stretch',
    text: '¿Empezamos con el cañón de confeti, con el megaabrazo de bienvenida o con los dos al mismo tiempo? Ah, espera… ¡también puedo hacer tres cosas al mismo tiempo!',
    next: 'pinkie-choice',
  },
  'pinkie-choice': {
    id: 'pinkie-choice',
    type: 'choice',
    prompt: '¿Qué le responde Sophia?',
    choices: [
      {
        id: 'party',
        label: '¡Una bienvenida Pinkie suena perfecta!',
        next: 'pinkie-party-reaction',
      },
      {
        id: 'quiet',
        label: '¿Podemos empezar con algo más tranquilo?',
        next: 'pinkie-quiet-reaction',
      },
    ],
  },
  'pinkie-party-reaction': {
    id: 'pinkie-party-reaction',
    type: 'dialogue',
    speaker: 'pinkie',
    emotion: 'happy',
    motion: 'celebrate',
    text: '¡Sabía que eras de las valientes! Activando nivel de bienvenida: “lluvia rosada con probabilidad de pastel”. ¡Tres, dos, uno!',
    sfx: 'surprise',
    next: 'pinkie-rejoin',
  },
  'pinkie-quiet-reaction': {
    id: 'pinkie-quiet-reaction',
    type: 'dialogue',
    speaker: 'pinkie',
    emotion: 'doubtful',
    motion: 'soft',
    text: 'Oh. Claro. Creo que me emocioné un poquito de más. Puedo ser tranquila. Mira: mi confeti está saliendo… de uno en uno. ¿Mejor?',
    next: 'pinkie-rejoin',
  },
  'pinkie-rejoin': {
    id: 'pinkie-rejoin',
    type: 'dialogue',
    speaker: 'pinkie',
    emotion: 'happy',
    motion: 'bounce',
    text: 'Lo importante es que tu bienvenida se sienta como tú. Eso hace que una fiesta pase de “bonita” a “Pinkie-perfecta”.',
    next: 'twilight-observe-one',
  },
  'twilight-observe-one': {
    id: 'twilight-observe-one',
    type: 'dialogue',
    speaker: 'twilight',
    emotion: 'happy',
    motion: 'pop',
    text: 'La estrella respondió. Una punta acaba de encenderse. Parece que escucharte a ti misma cuenta más que seguir un plan… tomaré nota de eso.',
    sfx: 'sparkle',
    next: 'applejack-debate',
  },
  'applejack-debate': {
    id: 'applejack-debate',
    type: 'dialogue',
    speaker: 'applejack',
    emotion: 'doubtful',
    motion: 'swagger',
    text: 'Sophia, llegas justo a tiempo para desempatar. Yo digo que el arco necesita soportes firmes. Una ráfaga y todo ese brillo termina en la granja.',
    next: 'rarity-debate',
  },
  'rarity-debate': {
    id: 'rarity-debate',
    type: 'dialogue',
    speaker: 'rarity',
    emotion: 'doubtful',
    motion: 'spin',
    text: 'Y yo digo, querida, que una bienvenida sin esplendor es simplemente… una reunión con muebles. Necesitamos caída, luz y un toque inolvidable.',
    next: 'applejack-push',
  },
  'applejack-push': {
    id: 'applejack-push',
    type: 'dialogue',
    speaker: 'applejack',
    emotion: 'doubtful',
    motion: 'shake',
    text: 'No sirve de mucho que sea inolvidable si se viene abajo antes de que lleguen los invitados.',
    next: 'rarity-push',
  },
  'rarity-push': {
    id: 'rarity-push',
    type: 'dialogue',
    speaker: 'rarity',
    emotion: 'doubtful',
    motion: 'shake',
    text: 'Ni sirve que dure cien años si nadie quiere mirarlo durante cinco segundos. Sophia, ¿qué sensación debería dar la entrada?',
    next: 'decor-choice',
  },
  'decor-choice': {
    id: 'decor-choice',
    type: 'choice',
    prompt: '¿Qué estilo elige Sophia?',
    choices: [
      {
        id: 'sturdy',
        label: 'Que sea firme y acogedora.',
        next: 'applejack-choice-reaction',
      },
      {
        id: 'sparkly',
        label: 'Que brille como un sueño.',
        next: 'rarity-choice-reaction',
      },
    ],
  },
  'applejack-choice-reaction': {
    id: 'applejack-choice-reaction',
    type: 'dialogue',
    speaker: 'applejack',
    emotion: 'happy',
    motion: 'swagger',
    text: 'Eso es hablar con sentido común. Lo haremos fuerte, cálido y con espacio suficiente para que Rarity cuelgue… una cantidad razonable de listones.',
    next: 'decor-rejoin',
  },
  'rarity-choice-reaction': {
    id: 'rarity-choice-reaction',
    type: 'dialogue',
    speaker: 'rarity',
    emotion: 'happy',
    motion: 'spin',
    text: '¡Lo sabía! Un sueño con luz propia. Y si Applejack refuerza la base, mi sueño también sobrevivirá a las ráfagas. Oh, esto será fabuloso.',
    next: 'decor-rejoin',
  },
  'decor-rejoin': {
    id: 'decor-rejoin',
    type: 'dialogue',
    speaker: 'rarity',
    emotion: 'happy',
    motion: 'spin',
    text: 'Ya lo veo: madera trenzada, tela violeta y una estrella de cristal al centro. Elegante y resistente. Nuestras mejores ideas no tenían que competir.',
    next: 'applejack-agree',
  },
  'applejack-agree': {
    id: 'applejack-agree',
    type: 'dialogue',
    speaker: 'applejack',
    emotion: 'happy',
    motion: 'swagger',
    text: 'Exactamente. A veces solo hace falta alguien nuevo para recordarnos que dos buenas ideas pueden tirar del mismo carro.',
    next: 'spike-two-points',
  },
  'spike-two-points': {
    id: 'spike-two-points',
    type: 'dialogue',
    speaker: 'spike',
    emotion: 'happy',
    motion: 'pop',
    text: '¡Dos puntas encendidas! Y sin explosiones mágicas. Creo que estamos batiendo un récord.',
    next: 'twilight-rule',
  },
  'twilight-rule': {
    id: 'twilight-rule',
    type: 'dialogue',
    speaker: 'twilight',
    emotion: 'happy',
    motion: 'bounce',
    text: 'Entonces no hay una respuesta “correcta”. La estrella brilla cuando Sophia ayuda a que nos entendamos. Eso sí es una regla que me gusta.',
    next: 'festival-scene',
  },
  'festival-scene': {
    id: 'festival-scene',
    type: 'scene',
    title: 'La plaza de la celebración',
    subtitle: 'El cielo se vuelve violeta y las primeras linternas despiertan',
    background: 'festival',
    next: 'fluttershy-worry',
  },
  'fluttershy-worry': {
    id: 'fluttershy-worry',
    type: 'dialogue',
    speaker: 'fluttershy',
    emotion: 'sad',
    motion: 'peek',
    text: 'Oh, Sophia… las luciérnagas iban a formar un corazón alrededor de la estrella, pero el ensayo de vuelo las asustó. No es culpa de Rainbow. Bueno… no completamente.',
    next: 'rainbow-defense',
  },
  'rainbow-defense': {
    id: 'rainbow-defense',
    type: 'dialogue',
    speaker: 'rainbow',
    emotion: 'sad',
    motion: 'droop',
    text: 'Mi giro salió un poquito más rápido de lo que calculé. No quería asustarlas. Pero puedo reunirlas antes de que digas “la mejor voladora de Equestria”.',
    next: 'fluttershy-caution',
  },
  'fluttershy-caution': {
    id: 'fluttershy-caution',
    type: 'dialogue',
    speaker: 'fluttershy',
    emotion: 'doubtful',
    motion: 'flutter',
    text: 'Si vuelas tras ellas, se esconderán todavía más. Podemos hablarles suavemente y esperar a que vuelvan a confiar.',
    next: 'rainbow-counter',
  },
  'rainbow-counter': {
    id: 'rainbow-counter',
    type: 'dialogue',
    speaker: 'rainbow',
    emotion: 'doubtful',
    motion: 'dash',
    text: 'O puedo volar delante, despacio, y hacerles un camino de colores. Eso también puede ser suave. Suave… a velocidad moderadamente increíble.',
    next: 'firefly-choice',
  },
  'firefly-choice': {
    id: 'firefly-choice',
    type: 'choice',
    prompt: '¿Cómo ayuda Sophia a las luciérnagas?',
    choices: [
      {
        id: 'patient',
        label: 'Calmarlas con paciencia.',
        next: 'fluttershy-choice-reaction',
      },
      {
        id: 'bold',
        label: 'Guiarlas con una carrera brillante.',
        next: 'rainbow-choice-reaction',
      },
    ],
  },
  'fluttershy-choice-reaction': {
    id: 'fluttershy-choice-reaction',
    type: 'dialogue',
    speaker: 'fluttershy',
    emotion: 'happy',
    motion: 'flutter',
    text: 'Ven, siéntate conmigo. Cuando alguien te ofrece calma de verdad, hasta la criatura más pequeña puede encontrar valor para salir.',
    next: 'firefly-rejoin',
  },
  'rainbow-choice-reaction': {
    id: 'rainbow-choice-reaction',
    type: 'dialogue',
    speaker: 'rainbow',
    emotion: 'happy',
    motion: 'dash',
    text: '¡Sabía que tenías espíritu! Tú marca el ritmo desde abajo y yo haré un arco lento. Lento para mí, claro. Para cualquier otra poni será legendario.',
    next: 'firefly-rejoin',
  },
  'firefly-rejoin': {
    id: 'firefly-rejoin',
    type: 'dialogue',
    speaker: 'fluttershy',
    emotion: 'happy',
    motion: 'flutter',
    text: 'Mira… ya regresan. No eligieron entre valentía y ternura; necesitaron un poquito de las dos.',
    sfx: 'sparkle',
    next: 'rainbow-soften',
  },
  'rainbow-soften': {
    id: 'rainbow-soften',
    type: 'dialogue',
    speaker: 'rainbow',
    emotion: 'happy',
    motion: 'bounce',
    text: 'Sí. Y Sophia logró que funcionara sin presumir ni una sola vez. Eso requiere bastante talento. Créeme, soy experta en presumir.',
    next: 'star-flicker',
  },
  'star-flicker': {
    id: 'star-flicker',
    type: 'dialogue',
    speaker: 'narrator',
    text: 'Las luciérnagas rodean el pedestal. Cuatro puntas de la estrella brillan, pero la quinta parpadea como si esperara algo.',
    sfx: 'sparkle',
    next: 'twilight-final-worry',
  },
  'twilight-final-worry': {
    id: 'twilight-final-worry',
    type: 'dialogue',
    speaker: 'twilight',
    emotion: 'doubtful',
    motion: 'shake',
    text: 'Falta una última chispa. Sophia ha escuchado, elegido y unido nuestras ideas. ¿Qué podría estar esperando la estrella?',
    next: 'spike-realization',
  },
  'spike-realization': {
    id: 'spike-realization',
    type: 'dialogue',
    speaker: 'spike',
    emotion: 'happy',
    motion: 'celebrate',
    text: '¡Tal vez espera que dejemos de examinarla! Sophia no es una respuesta para completar en tu lista. Es nuestra nueva amiga.',
    sfx: 'surprise',
    next: 'applejack-truth',
  },
  'applejack-truth': {
    id: 'applejack-truth',
    type: 'dialogue',
    speaker: 'applejack',
    emotion: 'happy',
    motion: 'swagger',
    text: 'Spike tiene razón. Una amistad no empieza cuando descubres para qué sirve alguien. Empieza cuando le haces un lugar a tu lado.',
    next: 'rarity-gift',
  },
  'rarity-gift': {
    id: 'rarity-gift',
    type: 'dialogue',
    speaker: 'rarity',
    emotion: 'happy',
    motion: 'spin',
    text: 'Y el lugar de Sophia aquí ya estaba reservado. Aunque, naturalmente, ahora tiene un lazo precioso encima.',
    next: 'pinkie-promise',
  },
  'pinkie-promise': {
    id: 'pinkie-promise',
    type: 'dialogue',
    speaker: 'pinkie',
    emotion: 'happy',
    motion: 'celebrate',
    text: 'Prometo fiestas enormes, fiestas diminutas y fiestas medianas cuidadosamente calibradas. Lo que necesites, cuando lo necesites.',
    next: 'fluttershy-home',
  },
  'fluttershy-home': {
    id: 'fluttershy-home',
    type: 'dialogue',
    speaker: 'fluttershy',
    emotion: 'happy',
    motion: 'flutter',
    text: 'Espero que Ponyville se sienta muy pronto como un hogar. Y si alguna vez necesitas silencio… mis animalitos y yo conocemos lugares hermosos.',
    next: 'rainbow-loyal',
  },
  'rainbow-loyal': {
    id: 'rainbow-loyal',
    type: 'dialogue',
    speaker: 'rainbow',
    emotion: 'happy',
    motion: 'dash',
    text: 'Y si necesitas aventura, velocidad o alguien que se quede contigo cuando las cosas se pongan difíciles… puedes contar conmigo.',
    next: 'twilight-proud',
  },
  'twilight-proud': {
    id: 'twilight-proud',
    type: 'dialogue',
    speaker: 'twilight',
    emotion: 'happy',
    motion: 'bounce',
    text: 'La estrella no buscaba etiquetar tu amistad, Sophia. Esperaba que nosotras dejáramos de buscar una definición y simplemente te diéramos la bienvenida.',
    next: 'final-narrator',
  },
  'final-narrator': {
    id: 'final-narrator',
    type: 'dialogue',
    speaker: 'narrator',
    text: 'La quinta punta se enciende. Una ola de luz rosada cruza la plaza, las luciérnagas dibujan un corazón y todas las voces se unen bajo el cielo violeta.',
    sfx: 'finale',
    next: 'echo-scene',
  },
  'echo-scene': {
    id: 'echo-scene',
    type: 'scene',
    title: 'Capítulo I · El eco bajo la luz',
    subtitle: 'La celebración ha terminado, pero la Estrella todavía tiene algo que decir',
    background: 'festival',
    next: 'echo-narrator',
  },
  'echo-narrator': {
    id: 'echo-narrator', type: 'dialogue', speaker: 'narrator',
    text: 'Cuando el último farol se apaga, la luz de la Estrella se recoge en silencio. Durante un instante, la plaza parece contener la respiración.',
    next: 'echo-crack',
  },
  'echo-crack': {
    id: 'echo-crack', type: 'dialogue', speaker: 'narrator',
    text: 'Entonces una línea violeta atraviesa el cristal. No es una grieta que rompa la estrella: es una sombra que parece moverse bajo su superficie.',
    sfx: 'sparkle', next: 'echo-twilight',
  },
  'echo-twilight': {
    id: 'echo-twilight', type: 'dialogue', speaker: 'twilight', emotion: 'doubtful', motion: 'shake',
    text: 'Eso no estaba en ninguna de mis notas. Ni en las notas de las notas. La Estrella está completa… ¿por qué se comporta como si recordara algo?',
    next: 'echo-spike',
  },
  'echo-spike': {
    id: 'echo-spike', type: 'dialogue', speaker: 'spike', emotion: 'doubtful', motion: 'peek',
    text: '¿Es una sombra normal de estrella o una sombra de “deberíamos tener una linterna y un plan de evacuación”?',
    next: 'echo-message',
  },
  'echo-message': {
    id: 'echo-message', type: 'dialogue', speaker: 'narrator',
    text: 'Cinco puntos de luz se alzan desde el pedestal. Forman una constelación desconocida y, entre ellos, aparece una frase: «Lo que no se escucha, se aleja».',
    sfx: 'surprise', next: 'echo-pinkie',
  },
  'echo-pinkie': {
    id: 'echo-pinkie', type: 'dialogue', speaker: 'pinkie', emotion: 'sad', motion: 'soft',
    text: 'Eso suena un poquito triste para ser un mensaje mágico. También suena como algo que querría un chocolate caliente. O siete.',
    next: 'echo-choice',
  },
  'echo-choice': {
    id: 'echo-choice', type: 'choice', prompt: '¿Qué propone Sophia antes de que el grupo se separe?',
    choices: [
      { id: 'listen', label: 'Escuchemos el mensaje con calma antes de actuar.', next: 'echo-listen-reaction' },
      { id: 'search', label: 'Sigamos la constelación antes de que desaparezca.', next: 'echo-search-reaction' },
    ],
  },
  'echo-listen-reaction': {
    id: 'echo-listen-reaction', type: 'dialogue', speaker: 'fluttershy', emotion: 'happy', motion: 'soft',
    text: 'Me gusta esa idea. A veces las cosas pequeñas parecen calladas, pero solo necesitan que alguien les dé tiempo.',
    next: 'echo-rejoin',
  },
  'echo-search-reaction': {
    id: 'echo-search-reaction', type: 'dialogue', speaker: 'rainbow', emotion: 'happy', motion: 'dash',
    text: '¡Eso es! Si una constelación misteriosa deja miguitas mágicas, yo puedo seguirlas. Despacio. Bueno… relativamente despacio.',
    next: 'echo-rejoin',
  },
  'echo-rejoin': {
    id: 'echo-rejoin', type: 'dialogue', speaker: 'twilight', emotion: 'happy', motion: 'bounce',
    text: 'Las dos cosas importan. Mañana investigaremos, pero esta noche haremos una promesa: no dejaremos que un misterio nos haga olvidar que estamos juntas.',
    next: 'echo-dream',
  },
  'echo-dream': {
    id: 'echo-dream', type: 'dialogue', speaker: 'narrator',
    text: 'Al dormir, Sophia ve la constelación sobre un bosque de árboles negros. Una voz, suave y lejana, susurra: «Encuentra las historias que nadie terminó de contar».',
    sfx: 'sparkle', next: 'orchard-scene',
  },

  'orchard-scene': {
    id: 'orchard-scene', type: 'scene', title: 'Capítulo II · La cosecha que escucha',
    subtitle: 'Una mañana en Sweet Apple Acres', background: 'ponyville', next: 'orchard-narrator',
  },
  'orchard-narrator': {
    id: 'orchard-narrator', type: 'dialogue', speaker: 'narrator',
    text: 'A la mañana siguiente, Ponyville despierta con un viento extraño. En Sweet Apple Acres, las manzanas maduras caen antes de tiempo y ruedan hacia el mismo sendero del bosque.',
    next: 'orchard-applejack',
  },
  'orchard-applejack': {
    id: 'orchard-applejack', type: 'dialogue', speaker: 'applejack', emotion: 'doubtful', motion: 'swagger',
    text: 'No me gusta nada que estas manzanas se escapen solitas. Una cosecha tiene su ritmo, y este viento viene a querer mandarnos.',
    next: 'orchard-rarity',
  },
  'orchard-rarity': {
    id: 'orchard-rarity', type: 'dialogue', speaker: 'rarity', emotion: 'sad', motion: 'soft',
    text: 'Y el carro para la feria está atascado. Las cintas son lo de menos, querida; sin él no podremos llevar ni las manzanas ni las linternas al pueblo.',
    next: 'orchard-twilight',
  },
  'orchard-twilight': {
    id: 'orchard-twilight', type: 'dialogue', speaker: 'twilight', emotion: 'doubtful', motion: 'wobble',
    text: 'La Estrella volvió a señalar este sitio. Quizá el mensaje no se refiere a una historia antigua; quizá alguien de aquí necesita ser escuchado ahora.',
    next: 'orchard-choice',
  },
  'orchard-choice': {
    id: 'orchard-choice', type: 'choice', prompt: '¿Por dónde empieza Sophia?',
    choices: [
      { id: 'work', label: 'Ayudar a Applejack a salvar la cosecha.', next: 'orchard-work-reaction' },
      { id: 'ask', label: 'Averiguar por qué el viento empuja las manzanas.', next: 'orchard-ask-reaction' },
    ],
  },
  'orchard-work-reaction': {
    id: 'orchard-work-reaction', type: 'dialogue', speaker: 'applejack', emotion: 'happy', motion: 'swagger',
    text: 'Eso es una respuesta que se pone botas y empieza. Tú junta las que ruedan al arroyo; yo enderezo el carro antes de que se nos vaya media granja.',
    next: 'orchard-discovery',
  },
  'orchard-ask-reaction': {
    id: 'orchard-ask-reaction', type: 'dialogue', speaker: 'rarity', emotion: 'happy', motion: 'spin',
    text: 'Excelente. Un misterio siempre mejora con una observadora atenta. He visto hojas pegadas en la rueda: vienen del sendero viejo.',
    next: 'orchard-discovery',
  },
  'orchard-discovery': {
    id: 'orchard-discovery', type: 'dialogue', speaker: 'narrator',
    text: 'Detrás del granero, el viento gira en un remolino pequeño. Dentro flota un lazo descolorido y una campanita sin badajo.',
    next: 'orchard-memory',
  },
  'orchard-memory': {
    id: 'orchard-memory', type: 'dialogue', speaker: 'applejack', emotion: 'sad', motion: 'droop',
    text: 'Ese lazo era de mi abuela. Decía que, cuando una persona se guarda una preocupación para no molestar, hasta el viento se pone terco.',
    next: 'orchard-truth',
  },
  'orchard-truth': {
    id: 'orchard-truth', type: 'dialogue', speaker: 'applejack', emotion: 'doubtful', motion: 'soft',
    text: 'La verdad es que tenía miedo de no acabar a tiempo para la feria. Quise cargar con todo yo sola, y ni siquiera les pregunté si podían ayudar.',
    next: 'orchard-support',
  },
  'orchard-support': {
    id: 'orchard-support', type: 'dialogue', speaker: 'rarity', emotion: 'happy', motion: 'spin',
    text: 'Applejack, querida, pedir ayuda no vuelve menos fuerte a nadie. Y resulta que mis cintas hacen unas cuerdas de carga bastante aceptables.',
    next: 'orchard-friends',
  },
  'orchard-friends': {
    id: 'orchard-friends', type: 'dialogue', speaker: 'twilight', emotion: 'happy', motion: 'pop',
    text: 'Mira la Estrella: una de las sombras se volvió dorada. Primera pista: las historias continúan cuando dejamos que otras ponis carguen una parte.',
    sfx: 'sparkle', next: 'orchard-farewell',
  },
  'orchard-farewell': {
    id: 'orchard-farewell', type: 'dialogue', speaker: 'applejack', emotion: 'happy', motion: 'swagger',
    text: 'Gracias, Sophia. Hoy terminamos la cosecha juntas. Mañana, cuando toque seguir ese sendero, yo llevaré provisiones. Y preguntaré antes de decidir que puedo con todo.',
    next: 'quiet-scene',
  },

  'quiet-scene': {
    id: 'quiet-scene', type: 'scene', title: 'Capítulo III · El claro de las luciérnagas',
    subtitle: 'La ternura y el valor no tienen por qué caminar separados', background: 'festival', next: 'quiet-narrator',
  },
  'quiet-narrator': {
    id: 'quiet-narrator', type: 'dialogue', speaker: 'narrator',
    text: 'Al caer la tarde, una ruta de luces diminutas conduce a Sophia, Fluttershy y Rainbow Dash hasta el borde del bosque. Las luciérnagas no avanzan: parecen esperar una invitación.',
    next: 'quiet-fluttershy',
  },
  'quiet-fluttershy': {
    id: 'quiet-fluttershy', type: 'dialogue', speaker: 'fluttershy', emotion: 'doubtful', motion: 'peek',
    text: 'Hay una criatura escondida en el claro. No la veo, pero puedo oír cómo cambia la hierba cuando tiene miedo. Debemos ir muy despacio.',
    next: 'quiet-rainbow',
  },
  'quiet-rainbow': {
    id: 'quiet-rainbow', type: 'dialogue', speaker: 'rainbow', emotion: 'doubtful', motion: 'dash',
    text: 'Y el sendero desaparece cada vez que se apagan las luces. Si no nos movemos pronto, acabaremos dando vueltas hasta el desayuno.',
    next: 'quiet-choice',
  },
  'quiet-choice': {
    id: 'quiet-choice', type: 'choice', prompt: '¿Cómo se acerca Sophia al claro?',
    choices: [
      { id: 'gentle', label: 'Con una canción tranquila y paciencia.', next: 'quiet-gentle-reaction' },
      { id: 'brave', label: 'Con una señal brillante que muestre el camino.', next: 'quiet-brave-reaction' },
    ],
  },
  'quiet-gentle-reaction': {
    id: 'quiet-gentle-reaction', type: 'dialogue', speaker: 'fluttershy', emotion: 'happy', motion: 'flutter',
    text: 'Sí… no tiene que salir todavía. Puede saber primero que no vamos a perseguirla. Gracias por darle esa opción.',
    next: 'quiet-creature',
  },
  'quiet-brave-reaction': {
    id: 'quiet-brave-reaction', type: 'dialogue', speaker: 'rainbow', emotion: 'happy', motion: 'dash',
    text: '¡Una señal, no una carrera! Puedo hacer eso. Un arco de colores lento, visible y sin ningún giro espectacular. Me estoy conteniendo muchísimo.',
    next: 'quiet-creature',
  },
  'quiet-creature': {
    id: 'quiet-creature', type: 'dialogue', speaker: 'narrator',
    text: 'Del helecho sale un pequeño cervatillo de cristal. Tiene una pata atrapada entre raíces y una luz gris palpita dentro de su pecho.',
    next: 'quiet-rainbow-regret',
  },
  'quiet-rainbow-regret': {
    id: 'quiet-rainbow-regret', type: 'dialogue', speaker: 'rainbow', emotion: 'sad', motion: 'droop',
    text: 'Puedo sacarlo rápido. Pero si tiro con fuerza, podría lastimarlo. Odio cuando “rápido” no es la respuesta correcta.',
    next: 'quiet-fluttershy-plan',
  },
  'quiet-fluttershy-plan': {
    id: 'quiet-fluttershy-plan', type: 'dialogue', speaker: 'fluttershy', emotion: 'happy', motion: 'flutter',
    text: 'No es que tu idea sea mala. Solo necesita mi cuidado y tu fuerza al mismo tiempo. Sophia puede decirnos cuándo está listo.',
    next: 'quiet-rescue',
  },
  'quiet-rescue': {
    id: 'quiet-rescue', type: 'dialogue', speaker: 'narrator',
    text: 'Entre los tres aflojan las raíces. El cervatillo se pone en pie, toca la Estrella con el hocico y deja una gota de luz celeste en el aire.',
    sfx: 'sparkle', next: 'quiet-memory',
  },
  'quiet-memory': {
    id: 'quiet-memory', type: 'dialogue', speaker: 'twilight', emotion: 'happy', motion: 'bounce',
    text: 'Segunda pista: valor no es hacer todo deprisa; ternura no es quedarse quieta. Las dos cosas pueden proteger a alguien.',
    next: 'quiet-map',
  },
  'quiet-map': {
    id: 'quiet-map', type: 'dialogue', speaker: 'narrator',
    text: 'La gota celeste se une a la luz dorada de la Estrella. Entre ambas trazan un sendero que termina en una torre dibujada sobre una colina.',
    next: 'library-scene',
  },

  'library-scene': {
    id: 'library-scene', type: 'scene', title: 'Capítulo IV · El archivo que olvidó',
    subtitle: 'Las respuestas a veces se esconden entre páginas que nadie abre', background: 'hall', next: 'library-spike',
  },
  'library-spike': {
    id: 'library-spike', type: 'dialogue', speaker: 'spike', emotion: 'happy', motion: 'pop',
    text: 'Encontré una referencia a la torre: el Observatorio de los Vínculos. No aparece en los mapas modernos porque… bueno, porque Twilight ordenó los mapas modernos antes de encontrarlo.',
    next: 'library-twilight',
  },
  'library-twilight': {
    id: 'library-twilight', type: 'dialogue', speaker: 'twilight', emotion: 'sad', motion: 'droop',
    text: 'Fue fundado para guardar cartas que no llegaron a destino. Promesas, disculpas, despedidas… historias que quedaron suspendidas entre dos ponis.',
    next: 'library-rarity',
  },
  'library-rarity': {
    id: 'library-rarity', type: 'dialogue', speaker: 'rarity', emotion: 'doubtful', motion: 'spin',
    text: '¿Un archivo entero de palabras que no se dijeron? Eso explica la sombra. También explica por qué ese lugar necesita una limpieza y quizá cortinas nuevas.',
    next: 'library-choice',
  },
  'library-choice': {
    id: 'library-choice', type: 'choice', prompt: '¿Qué busca Sophia primero?',
    choices: [
      { id: 'letters', label: 'Las cartas sobre la Estrella de Bienvenida.', next: 'library-letters-reaction' },
      { id: 'keeper', label: 'El nombre de quien cuidaba el Observatorio.', next: 'library-keeper-reaction' },
    ],
  },
  'library-letters-reaction': {
    id: 'library-letters-reaction', type: 'dialogue', speaker: 'spike', emotion: 'happy', motion: 'pop',
    text: '¡Bingo! Una caja marcada con cinco estrellas. Está llena de sobres que dicen “Para cuando estés lista para escuchar”. Qué específico y qué misterioso.',
    next: 'library-reveal',
  },
  'library-keeper-reaction': {
    id: 'library-keeper-reaction', type: 'dialogue', speaker: 'twilight', emotion: 'happy', motion: 'bounce',
    text: 'La última guardiana se llamaba Lumen. Dedicó su vida a reconciliar amistades, hasta que el Observatorio se apagó sin explicación.',
    next: 'library-reveal',
  },
  'library-reveal': {
    id: 'library-reveal', type: 'dialogue', speaker: 'narrator',
    text: 'Un libro cae abierto. En la página hay un dibujo de una estrella idéntica a la de Sophia y una nota: «No elige a la más brillante. Llama a quien sabe hacer espacio».',
    sfx: 'surprise', next: 'library-twilight-fear',
  },
  'library-twilight-fear': {
    id: 'library-twilight-fear', type: 'dialogue', speaker: 'twilight', emotion: 'sad', motion: 'soft',
    text: 'No quiero que esto se convierta en una carga para ti, Sophia. Llegaste buscando un hogar, no una misión imposible escrita por una bibliotecaria de hace cien años.',
    next: 'library-spike-truth',
  },
  'library-spike-truth': {
    id: 'library-spike-truth', type: 'dialogue', speaker: 'spike', emotion: 'happy', motion: 'pop',
    text: 'Entonces no la tratemos como misión. Vamos porque queremos saber qué pasó, y porque nadie debería quedarse sola dentro de una historia que se apagó.',
    next: 'library-group',
  },
  'library-group': {
    id: 'library-group', type: 'dialogue', speaker: 'twilight', emotion: 'happy', motion: 'bounce',
    text: 'Tienes razón. Iremos juntas, con mapas, provisiones y permiso explícito para volver si algo deja de sentirse bien.',
    next: 'library-departure',
  },
  'library-departure': {
    id: 'library-departure', type: 'dialogue', speaker: 'narrator',
    text: 'La Estrella proyecta tres luces: dorada, celeste y violeta. El sendero de la torre se vuelve nítido. A la mañana siguiente, la aventura sale de Ponyville.',
    sfx: 'sparkle', next: 'journey-scene',
  },

  'journey-scene': {
    id: 'journey-scene', type: 'scene', title: 'Capítulo V · El camino de las historias perdidas',
    subtitle: 'A veces, para encontrar un lugar, hay que atreverse a dejarlo por un rato', background: 'ponyville', next: 'journey-narrator',
  },
  'journey-narrator': {
    id: 'journey-narrator', type: 'dialogue', speaker: 'narrator',
    text: 'El grupo sigue la colina al amanecer. A cada paso, el sendero cambia: una rama señala una dirección, una piedra muestra una palabra, una brisa repite nombres desconocidos.',
    next: 'journey-pinkie',
  },
  'journey-pinkie': {
    id: 'journey-pinkie', type: 'dialogue', speaker: 'pinkie', emotion: 'doubtful', motion: 'soft',
    text: 'Normalmente me gusta conocer muchos nombres nuevos. Pero estos suenan como si alguien los hubiera guardado en un cajón demasiado tiempo.',
    next: 'journey-bridge',
  },
  'journey-bridge': {
    id: 'journey-bridge', type: 'dialogue', speaker: 'narrator',
    text: 'Un puente de piedra corta el paso. En el centro hay dos placas: «La verdad que duele» y «La verdad que cuida». El camino no se abre.',
    next: 'journey-choice',
  },
  'journey-choice': {
    id: 'journey-choice', type: 'choice', prompt: '¿Qué dice Sophia para cruzar?',
    choices: [
      { id: 'honest', label: 'Decir lo que piensa, aunque sea difícil.', next: 'journey-honest-reaction' },
      { id: 'kind', label: 'Buscar una verdad que también sea amable.', next: 'journey-kind-reaction' },
    ],
  },
  'journey-honest-reaction': {
    id: 'journey-honest-reaction', type: 'dialogue', speaker: 'applejack', emotion: 'happy', motion: 'swagger',
    text: 'La honestidad no siempre se siente bonita al principio, pero es mejor que construir un puente sobre algo que fingimos no ver.',
    next: 'journey-rejoin',
  },
  'journey-kind-reaction': {
    id: 'journey-kind-reaction', type: 'dialogue', speaker: 'rarity', emotion: 'happy', motion: 'spin',
    text: 'Exactamente. La verdad no necesita llevar espinas para ser verdadera. Puede ser clara y, al mismo tiempo, dejar espacio para que alguien respire.',
    next: 'journey-rejoin',
  },
  'journey-rejoin': {
    id: 'journey-rejoin', type: 'dialogue', speaker: 'narrator',
    text: 'Sophia junta ambas ideas: «Seré sincera, pero no usaré la sinceridad para herir». El puente se ilumina y deja pasar al grupo.',
    sfx: 'sparkle', next: 'journey-letter',
  },
  'journey-letter': {
    id: 'journey-letter', type: 'dialogue', speaker: 'narrator',
    text: 'Al otro lado espera un sobre sin destinatario. La letra tiembla: «Querida amiga: tuve miedo de decirte que necesitaba quedarme. Pensé que escucharías una despedida».',
    next: 'journey-fluttershy',
  },
  'journey-fluttershy': {
    id: 'journey-fluttershy', type: 'dialogue', speaker: 'fluttershy', emotion: 'sad', motion: 'soft',
    text: 'Quizá Lumen no desapareció por una maldición. Quizá se cansó de guardar palabras de otras ponis y nunca dejó que alguien guardara las suyas.',
    next: 'journey-rainbow',
  },
  'journey-rainbow': {
    id: 'journey-rainbow', type: 'dialogue', speaker: 'rainbow', emotion: 'sad', motion: 'droop',
    text: 'Entonces la encontramos y le demostramos que no está sola. Aunque haya pasado mucho tiempo. Especialmente si ha pasado mucho tiempo.',
    next: 'journey-tower',
  },
  'journey-tower': {
    id: 'journey-tower', type: 'dialogue', speaker: 'narrator',
    text: 'Entre la niebla aparece la torre: alta, silenciosa y rodeada de estrellas apagadas. La puerta no tiene cerradura; tiene seis espacios con forma de pezuña.',
    next: 'observatory-scene',
  },

  'observatory-scene': {
    id: 'observatory-scene', type: 'scene', title: 'Capítulo VI · El Observatorio de los Vínculos',
    subtitle: 'Ninguna amistad debería tener que brillar sola', background: 'hall', next: 'observatory-door',
  },
  'observatory-door': {
    id: 'observatory-door', type: 'dialogue', speaker: 'narrator',
    text: 'Las seis amigas apoyan sus pezuñas en la puerta. Sophia coloca la Estrella en el último hueco. La torre despierta con un suspiro de polvo y luz.',
    sfx: 'surprise', next: 'observatory-archive',
  },
  'observatory-archive': {
    id: 'observatory-archive', type: 'dialogue', speaker: 'narrator',
    text: 'Dentro flotan cientos de cartas, cada una con una pequeña chispa. Pero en el centro, una figura de luz violeta sostiene una carta que nunca abrió.',
    next: 'observatory-lumen',
  },
  'observatory-lumen': {
    id: 'observatory-lumen', type: 'dialogue', speaker: 'narrator',
    text: '«¿Quién viene a buscar una historia que ya terminó?», pregunta la figura. Su voz es la misma que Sophia oyó en el sueño.',
    next: 'observatory-twilight',
  },
  'observatory-twilight': {
    id: 'observatory-twilight', type: 'dialogue', speaker: 'twilight', emotion: 'sad', motion: 'soft',
    text: 'Lumen… ninguna historia termina solo porque una de las ponis dejó de hablar. Vinimos a escuchar la tuya, si quieres contarla.',
    next: 'observatory-lumen-truth',
  },
  'observatory-lumen-truth': {
    id: 'observatory-lumen-truth', type: 'dialogue', speaker: 'narrator',
    text: 'La figura mira la carta. «Ayudé a muchas amistades, pero cuando necesité irme, no supe cómo pedir que me esperaran. Dejé esta carta cerrada para no descubrir si todavía tenía un lugar».',
    next: 'observatory-choice',
  },
  'observatory-choice': {
    id: 'observatory-choice', type: 'choice', prompt: '¿Qué le ofrece Sophia a Lumen?',
    choices: [
      { id: 'read', label: 'Abrir la carta juntas, aunque dé miedo.', next: 'observatory-read-reaction' },
      { id: 'new', label: 'Escribir primero una nueva respuesta para ella.', next: 'observatory-new-reaction' },
    ],
  },
  'observatory-read-reaction': {
    id: 'observatory-read-reaction', type: 'dialogue', speaker: 'spike', emotion: 'happy', motion: 'soft',
    text: 'No tienes que leerla sola. A veces ser valiente es permitir que alguien se siente a tu lado mientras descubres qué dice el pasado.',
    next: 'observatory-letter-open',
  },
  'observatory-new-reaction': {
    id: 'observatory-new-reaction', type: 'dialogue', speaker: 'pinkie', emotion: 'happy', motion: 'soft',
    text: 'Podemos hacer ambas cosas. Las cartas viejas importan, pero una amistad también merece palabras nuevas. Tengo papel, plumitas y una caligrafía sorprendentemente elegante.',
    next: 'observatory-letter-open',
  },
  'observatory-letter-open': {
    id: 'observatory-letter-open', type: 'dialogue', speaker: 'narrator',
    text: 'La carta se abre. No contiene reproches, sino una invitación: «No sabíamos cómo encontrarte. Pero seguimos dejando una luz encendida por si querías volver».',
    sfx: 'sparkle', next: 'observatory-shadow',
  },
  'observatory-shadow': {
    id: 'observatory-shadow', type: 'dialogue', speaker: 'narrator',
    text: 'La sombra de la Estrella intenta apagar la torre una última vez. Se alimenta de todo lo que quedó sin decir, de cada miedo que se hizo silencio.',
    next: 'observatory-sophia',
  },
  'observatory-sophia': {
    id: 'observatory-sophia', type: 'dialogue', speaker: 'narrator',
    text: 'Pero Sophia recuerda: una cosecha compartida, un cervatillo rescatado, una verdad dicha con cuidado, una carta abierta juntas. La Estrella responde a esos recuerdos.',
    next: 'observatory-friends',
  },
  'observatory-friends': {
    id: 'observatory-friends', type: 'dialogue', speaker: 'twilight', emotion: 'happy', motion: 'bounce',
    text: 'No viniste a resolver nuestra historia, Sophia. Nos recordaste cómo seguir escribiéndola: escuchando, pidiendo ayuda y haciendo espacio.',
    next: 'observatory-finale',
  },
  'observatory-finale': {
    id: 'observatory-finale', type: 'dialogue', speaker: 'narrator',
    text: 'La sombra se disuelve. Las cartas abandonan sus estantes y vuelan hacia el cielo, donde se vuelven una nueva constelación sobre Ponyville.',
    sfx: 'finale', next: 'home-scene',
  },

  'home-scene': {
    id: 'home-scene', type: 'scene', title: 'Epilogo · Una luz encendida',
    subtitle: 'El camino a casa se ve diferente cuando sabes que alguien te espera', background: 'festival', next: 'home-narrator',
  },
  'home-narrator': {
    id: 'home-narrator', type: 'dialogue', speaker: 'narrator',
    text: 'De regreso en Ponyville, la plaza se llena de faroles. Esta vez no celebran la llegada de Sophia: celebran todas las historias que aún pueden continuar.',
    next: 'home-pinkie',
  },
  'home-pinkie': {
    id: 'home-pinkie', type: 'dialogue', speaker: 'pinkie', emotion: 'happy', motion: 'celebrate',
    text: '¡Fiesta de las luces encendidas! Hay pastel para los reencuentros, pastel para las conversaciones difíciles y un pastel muy pequeño para los silencios cómodos.',
    next: 'home-fluttershy',
  },
  'home-fluttershy': {
    id: 'home-fluttershy', type: 'dialogue', speaker: 'fluttershy', emotion: 'happy', motion: 'flutter',
    text: 'El cervatillo de cristal dejó una luciérnaga en mi jardín. Creo que es su forma de decir que recuerda que lo ayudamos.',
    next: 'home-rainbow',
  },
  'home-rainbow': {
    id: 'home-rainbow', type: 'dialogue', speaker: 'rainbow', emotion: 'happy', motion: 'dash',
    text: 'Y yo hice una ruta de vuelo hasta el Observatorio. Por si alguna otra historia necesita un equipo de rescate. Con cascos. Y bocadillos.',
    next: 'home-applejack',
  },
  'home-applejack': {
    id: 'home-applejack', type: 'dialogue', speaker: 'applejack', emotion: 'happy', motion: 'swagger',
    text: 'La feria fue un éxito. Y resulta que pedir ayuda deja más tiempo para disfrutarla. Eso sí que es una lección que pienso recordar.',
    next: 'home-rarity',
  },
  'home-rarity': {
    id: 'home-rarity', type: 'dialogue', speaker: 'rarity', emotion: 'happy', motion: 'spin',
    text: 'Hice un lazo para tu Estrella, Sophia. No para atarla a un destino, por supuesto. Solo para recordarte que una luz puede ser preciosa y libre.',
    next: 'home-twilight',
  },
  'home-twilight': {
    id: 'home-twilight', type: 'dialogue', speaker: 'twilight', emotion: 'happy', motion: 'bounce',
    text: 'La Estrella no te eligió porque tuviera una respuesta sobre ti. Brilló porque ayudaste a que cada una de nosotras se sintiera vista.',
    next: 'ending',
  },
  ending: {
    id: 'ending',
    type: 'ending',
    title: 'Sophia y la Estrella de la Amistad',
    text: 'Tu magia no estaba en una sola respuesta. Estaba en escuchar con atención, decir la verdad con cuidado y dejar una luz encendida para quien aún busca el camino a casa.',
    background: 'festival',
  },
};

export function validateStory(
  nodes: Record<string, StoryNode> = story,
  initialNodeId: string = INITIAL_NODE_ID,
) {
  const errors: string[] = [];
  const references = new Set<string>();

  for (const [key, node] of Object.entries(nodes)) {
    if (node.id !== key) {
      errors.push(`El nodo ${node.id} no coincide con su clave.`);
    }

    if (node.type === 'choice') {
      if (node.choices.length < 2) errors.push(`La elección ${node.id} necesita dos opciones.`);
      node.choices.forEach((choice) => references.add(choice.next));
    } else if (node.type !== 'ending') {
      references.add(node.next);
    }
  }

  for (const reference of references) {
    if (!nodes[reference]) errors.push(`Destino inexistente: ${reference}.`);
  }

  const visited = new Set<string>();
  const pending = [initialNodeId];
  while (pending.length) {
    const id = pending.pop()!;
    if (visited.has(id) || !nodes[id]) continue;
    visited.add(id);
    const node = nodes[id];
    if (node.type === 'choice') {
      pending.push(...node.choices.map((choice) => choice.next));
    } else if (node.type !== 'ending') {
      pending.push(node.next);
    }
  }

  for (const id of Object.keys(nodes)) {
    if (!visited.has(id)) errors.push(`Nodo inalcanzable: ${id}.`);
  }

  return errors;
}

export function isChoiceNode(node: StoryNode): node is ChoiceNode {
  return node.type === 'choice';
}
