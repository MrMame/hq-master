
export interface MovableItem {
  id: number;
  title: string;
  x: number;
  y: number;
  isMinimised:boolean;
  toggleMinimise: () => void;
  showTop:boolean;
}
