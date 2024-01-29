export interface PlayerState {
  playing: boolean;
  waiting: boolean;
}
export interface PlayerType {
  isFullscreen: boolean;
  proportion: string;
  resolution: Player.Resolution;
  speed: number;
  playerState: PlayerState;
}
