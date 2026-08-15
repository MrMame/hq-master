
export interface MovableItem {
  id: number;
  x: number;
  y: number;
  isMinimised:boolean;
  toggleMinimise: () => void;
  showTop:boolean;
}
