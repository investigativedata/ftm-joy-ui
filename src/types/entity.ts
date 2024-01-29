import type { Entity, IEntityDatum } from "../model/entity";

export type TEntity = Entity | IEntityDatum;
export type { Entity, IEntityDatum };

export interface IEntityComponent {
  entity: TEntity;
}
