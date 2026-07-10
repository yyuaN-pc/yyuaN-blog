export interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  duration?: number;
}

export type PlayMode = 'loop' | 'repeat-one' | 'shuffle';

export type MusicSource = 'default' | 'tool';

export interface MusicPlayerState {
  playlist: Track[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playMode: PlayMode;
  source: MusicSource | null;
}
