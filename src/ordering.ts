import type { Property } from "../model/property";

interface WeightsType {
  [name: string]: number;
}

const WEIGHTS = {
  name: -10000,
  alias: -9999,
  weakAlias: -9998,
  birthDate: -8000,
  birthPlace: -7990,
  deathDate: -7980,
  gender: -7980,
  incorporationDate: -7700,
  dissolutionDate: -7690,
  legalForm: -7600,

  nationality: -5900,
  jurisdiction: -5890,
  country: -5880,

  position: 900,
  education: 1000,
  religion: 1010,
  ethnicity: 1020,
  status: 2000,
  address: 4000,
  publisher: 18000,
  sourceUrl: 19000,
  createdAt: 20000,
  modifiedAt: 20001,
} as WeightsType;

function getPropWeight(prop: Property): number {
  return WEIGHTS[prop.name] || 0;
}

export function compareDisplayProps(a: Property, b: Property): number {
  const weights = getPropWeight(a) - getPropWeight(b);
  return weights;
}

export function sortPropertiesForDisplay(props: Property[]) {
  return props.sort(compareDisplayProps);
}
