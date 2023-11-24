export interface PlayerState {
  isPlaying: boolean;
}
export interface PlayerType {
  isFullscreen: boolean;
  proportion: string;
  resolution: Player.Resolution;
  speed: number;
  playerState: PlayerState;
}
