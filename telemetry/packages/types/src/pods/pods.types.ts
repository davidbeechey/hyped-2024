export type BaseMeasurement = {
  name: string;
  key: string;
  unit: string;
  type: string;
};

export type Limits = {
  warning?: {
    low: number;
    high: number;
  };
  critical: {
    low: number;
    high: number;
  };
};

export type RangeMeasurement = BaseMeasurement & {
  format: 'float' | 'integer';
  limits: Limits;
};

export type EnumMeasurement = BaseMeasurement & {
  format: 'enum';
  enumerations: {
    value: number;
    string: string;
  }[];
};

export type Measurement = RangeMeasurement | EnumMeasurement;

// Could replace with stricter type in future
type IpAddress = string;

type Id = string;

export type Pi = {
  id: Id;
  ip: IpAddress;
  name: string;
};

export type PiWithVersion = Pi & {
  binary?: string;
  config?: string;
};

export type Pod = {
  name: string;
  id: string;
  measurements: Record<string, Measurement>;
  pis: Record<Id, Pi>;
};

export type Pods = Record<Id, Pod>;
