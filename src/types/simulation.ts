export interface Aircraft {
  id: string;
  x: number;
  y: number;
  speed: 'S' | 'M' | 'F';
  altitude: 1 | 2 | 3 | 4;
  destination: 'A' | 'B' | 'C' | 'D' | 'e' | 'f';
  label: string;
  direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  path: number[];
}

export interface Airport {
  id: 'e' | 'f';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SimulationSettings {
  interval: number;
  batchSize: number;
  totalAircraft: number;
  totalTime: number;
  speedFactor: number;
}

export interface Accident {
  aircraft: Aircraft;
  reason: string;
}

export interface Success {
  aircraft: Aircraft;
  reason: string;
}