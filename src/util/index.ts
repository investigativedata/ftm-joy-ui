import defaultModel from "../data/defaultModel.json";
import { Model } from "../model/model";
import type { Entity, TEntity, TSchema, IEntityDatum } from "../types";

export * from "./ordering";
export * from "./reduce";
export * from "./urls";

const model = new Model(defaultModel);

export function getProxy(raw: TEntity): Entity {
  return model.getEntity(raw);
}

export function getSchema(
  schemaName: string | null | undefined | TSchema
): TSchema {
  return model.getSchema(schemaName);
}

type EntityDict = {
  [id: string]: Entity;
};

export function createEntityDict(
  entities: IEntityDatum[],
  lookups?: string[]
): EntityDict {
  const data: EntityDict = {};
  for (const entity of entities.map(getProxy)) {
    if (lookups) {
      const keys = lookups.map((l) => entity.getFirst(l)).filter((k) => !!k);
      if (keys.length > 0) {
        data[keys.join("-")] = entity;
      }
    } else {
      data[entity.id] = entity;
    }
  }
  return data;
}
