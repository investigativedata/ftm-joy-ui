import queryString from "query-string";

import type { IEntityDatum, INKCatalog, INKDataset } from "../types";
import type { IAggregationResult, IApiQuery, IEntitiesResult } from "./types";

type ApiError = {
  detail: string[];
};

export default class Api {
  private endpoint: string;
  private api_key?: string;

  constructor(endpoint: string, api_key?: string) {
    this.endpoint = endpoint;
    this.api_key = api_key;
  }

  async getCatalog(): Promise<INKCatalog> {
    return await this.api("catalog");
  }

  async getDataset(dataset: string): Promise<INKDataset> {
    return await this.api(`catalog/${dataset}`);
  }

  async getEntity(id: string): Promise<IEntityDatum> {
    return await this.api(`entities/${id}`, { nested: true });
  }

  async getEntities(query: IApiQuery = {}): Promise<IEntitiesResult> {
    return await this.api(`entities`, query);
  }

  async getEntitiesAll(q: IApiQuery = {}): Promise<IEntityDatum[]> {
    // chain requests to paginate and get all results
    let entities: IEntityDatum[] = [];
    const res = await this.getEntities(q);
    entities = [...entities, ...res.entities];
    let { next_url, query } = res;
    while (!!next_url) {
      query = { ...query, page: query.page || 1 + 1 };
      const res = await this.getEntities(query);
      entities = [...entities, ...res.entities];
      next_url = res.next_url;
      query = res.query;
    }
    return entities;
  }

  async getAggregations(query: IApiQuery = {}): Promise<IAggregationResult> {
    return await this.api("aggregate", query);
  }

  async search(q: string, query: IApiQuery = {}): Promise<IEntitiesResult> {
    return await this.api("search", { ...query, q });
  }

  onNotFound(error: ApiError): any {
    const errorMsg = error.detail.join("; ");
    console.log("404 NOT FOUND", errorMsg);
    throw new Error(errorMsg);
  }

  onError(status: number, error: ApiError): any {
    const errorMsg = error.detail.join("; ");
    console.log(status, errorMsg);
    throw new Error(errorMsg);
  }

  async api(path: string, query: IApiQuery = {}): Promise<any> {
    query.api_key = this.api_key; // this var is only accessible on server
    const url = `${this.endpoint}/${path}?${queryString.stringify(query, {
      skipNull: true,
      skipEmptyString: true,
    })}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    if (res.status >= 400 && res.status < 600) {
      const error = await res.json();
      if (res.status === 404) {
        this.onNotFound(error);
      } else {
        this.onError(res.status, error);
      }
    }
  }
}
