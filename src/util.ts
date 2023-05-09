import defaultModel from "../data/defaultModel.json";
import type { Entity, TEntity } from "../types/entity";
import { Model } from "../types/model";
import type { Schema } from "../types/schema";

const model = new Model(defaultModel);

export function getProxy(raw: TEntity): Entity {
  return model.getEntity(raw);
}

export function getCaption(raw: TEntity): string {
  const proxy = getProxy(raw);
  return proxy.getCaption();
}

export function getSchema(
  schemaName: string | null | undefined | Schema
): Schema {
  return model.getSchema(schemaName);
}
