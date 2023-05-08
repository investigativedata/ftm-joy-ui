import queryString from "query-string";
import type { INKDataset, INKCatalog, IEntityDatum } from "../types";
import type { IApiQuery, IEntitiesResult, IAggregationResult } from "./types";
import { API_ENDPOINT, BUILD_API_KEY } from "config";

export async function getCatalog(): Promise<INKCatalog> {
  return await api("catalog");
}

export async function getDataset(dataset: string): Promise<INKDataset> {
  return await api(dataset);
}

export async function getEntity(
  dataset: string,
  id: string
): Promise<IEntityDatum> {
  return await api(`${dataset}/entities/${id}`);
}

export async function getEntities(
  dataset: string,
  query: IApiQuery = {}
): Promise<IEntitiesResult> {
  return await api(`${dataset}/entities`, query);
}

export async function searchEntities(
  dataset: string,
  query: IApiQuery = {}
): Promise<IEntitiesResult> {
  return await api(`${dataset}/search`, query);
}

export async function getAggregations(
  dataset: string,
  query: IApiQuery = {}
): Promise<IAggregationResult> {
  return await api(`${dataset}/aggregate`, query);
}

async function api(path: string, query: IApiQuery = {}): Promise<any> {
  query.api_key = BUILD_API_KEY; // this var is only accessible on server
  const url = `${API_ENDPOINT}/${path}?${queryString.stringify(query, {
    skipNull: true,
    skipEmptyString: true,
  })}`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  if (res.status >= 400 && res.status < 600) {
    const { error } = await res.json();
    console.log(error);
    throw { code: res.status, error };
  }
}
