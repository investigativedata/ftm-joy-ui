import type { Entity, IEntityDatum } from "./types";

export function reduceEntity(entity: Entity): IEntityDatum {
  const { caption, ...rest } = entity.toJSON();
  const properties = { name: [caption] };
  return { ...rest, caption, properties };
}

const sum = (t: number, c: number) => t + c;

type Getter = (e: Entity, ...args: string[]) => string[];

const propGetter = (e: Entity, prop: string): string[] =>
  e.getStringProperty(prop) || [];

const values = (
  entities: Entity[],
  getter: Getter = propGetter,
  ...args: string[]
): string[] => entities.map((e) => getter(e, ...args)).flat();

const uniq = (
  entities: Entity[],
  getter: Getter,
  ...args: string[]
): string[] => Array.from(new Set(values(entities, getter, ...args)));

const filter = (entities: Entity[], prop: string, value: string): Entity[] =>
  entities.filter((e) => (e.getProperty(prop) || []).indexOf(value) > -1);

export const getPropSum = (
  entities: Entity[],
  getter: Getter,
  ...args: string[]
): number =>
  values(entities, getter, ...args)
    .map(parseFloat)
    .reduce(sum, 0);

export const getPropMax = (entities: Entity[], prop: string): string => {
  const values = entities
    .map((e) => (e.getProperty(prop) || []).map((a) => a.toString()))
    .flat()
    .sort();
  return values[values.length - 1];
};

export const getPropMin = (entities: Entity[], prop: string): string => {
  const values = entities
    .map((e) => (e.getProperty(prop) || []).map((a) => a.toString()))
    .flat()
    .sort();
  return values[0];
};

type Agg = {
  [key: string]: number;
};

export const getPropSumAgg = (
  entities: Entity[],
  prop: string,
  group: string,
  amountProp?: string
): Agg => {
  const data: Agg = {};
  for (const key of uniq(entities, propGetter, prop)) {
    data[key] = getPropSum(
      filter(entities, group, key),
      propGetter,
      amountProp || "amount"
    );
  }
  return data;
};

export const getYearSumAgg = (
  entities: Entity[],
  getter: Getter = propGetter,
  amountProp?: string
): Agg => {
  const data: Agg = {};
  for (const date of uniq(entities, propGetter, "date")) {
    const year = date.substring(0, 4);
    data[year] =
      (data[year] || 0) +
      getPropSum(
        filter(entities, "date", date),
        getter,
        amountProp || "amount"
      );
  }
  return data;
};
