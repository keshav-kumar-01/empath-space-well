
declare module 'canvas-confetti' {
  type Options = {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  };

  type ConfettiFunction = (options?: Options) => Promise<null>;

  const confetti: ConfettiFunction & {
    create: (canvas: HTMLCanvasElement, options?: {resize?: boolean}) => ConfettiFunction;
    reset: () => void;
  };

  export default confetti;
}
