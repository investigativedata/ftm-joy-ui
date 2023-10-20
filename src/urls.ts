import { ParsedUrlQuery } from "querystring";
import slugify from "slugify";

import type { TEntity, INKDataset } from "../types";

export interface IEntityUrlParams extends ParsedUrlQuery {
  readonly slug: string[];
}

export function getEntityUrlParams(entity: TEntity): IEntityUrlParams {
  return {
    slug: [entity.id, slugify(entity.caption).slice(0, 255)],
  };
}

export function getEntityUrl(entity: TEntity, prefix?: string): string {
  const { slug } = getEntityUrlParams(entity);
  return `${prefix || "/entities"}/${slug.join("/")}`;
}

export interface IDatasetUrlParams extends ParsedUrlQuery {
  readonly slug: string;
}

export function getDatasetUrlParams(dataset: INKDataset): IDatasetUrlParams {
  return { slug: dataset.name };
}

export function getDatasetUrl(dataset: INKDataset, prefix?: string): string {
  const { slug } = getDatasetUrlParams(dataset);
  return `${prefix || "/datasets"}/${slug}`;
}
