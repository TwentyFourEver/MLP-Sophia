export type CharacterId =
  | 'narrator'
  | 'twilight'
  | 'spike'
  | 'pinkie'
  | 'applejack'
  | 'rarity'
  | 'fluttershy'
  | 'rainbow';

export type EmotionId =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'doubtful';

export type PortraitMotionId =
  | 'slide'
  | 'bounce'
  | 'stretch'
  | 'wobble'
  | 'soft'
  | 'dash'
  | 'droop'
  | 'pop'
  | 'spin'
  | 'flutter'
  | 'swagger'
  | 'peek'
  | 'shake'
  | 'celebrate';

export type SceneId = 'ponyville' | 'hall' | 'festival';
export type SoundEffectId = 'advance' | 'choice' | 'sparkle' | 'surprise' | 'finale';

export interface StoryChoice {
  id: string;
  label: string;
  next: string;
}

interface BaseStoryNode {
  id: string;
  background?: SceneId;
}

export interface SceneNode extends BaseStoryNode {
  type: 'scene';
  title: string;
  subtitle: string;
  next: string;
}

export interface DialogueNode extends BaseStoryNode {
  type: 'dialogue';
  speaker: CharacterId;
  text: string;
  emotion?: EmotionId;
  motion?: PortraitMotionId;
  next: string;
  sfx?: SoundEffectId;
}

export interface ChoiceNode extends BaseStoryNode {
  type: 'choice';
  prompt: string;
  choices: StoryChoice[];
}

export interface EndingNode extends BaseStoryNode {
  type: 'ending';
  title: string;
  text: string;
}

export type StoryNode = SceneNode | DialogueNode | ChoiceNode | EndingNode;

export interface CharacterDefinition {
  id: Exclude<CharacterId, 'narrator'>;
  name: string;
  accent: string;
  portraits: Partial<Record<EmotionId, string>> & { neutral: string };
  portraitClass?: string;
}
