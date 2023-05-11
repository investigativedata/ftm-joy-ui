import defaultModel from "../data/defaultModel.json";
import { Model } from "../model/model";
import type { Entity, TEntity, TSchema } from "../types";

const model = new Model(defaultModel);

export function getProxy(raw: TEntity): Entity {
  return model.getEntity(raw);
}

export function getSchema(
  schemaName: string | null | undefined | TSchema
): TSchema {
  return model.getSchema(schemaName);
}
