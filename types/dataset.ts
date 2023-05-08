interface ICountryStats {
  readonly code: string;
  readonly count: number;
  readonly label: string;
}

interface ISchemataStats {
  readonly name: string;
  readonly count: number;
  readonly label: string;
  readonly plural: string;
}

export interface IThingsStats {
  readonly total: number;
  readonly countries: ICountryStats[];
  readonly schemata: ISchemataStats[];
}

interface IResource {
  readonly url: string;
  readonly name: string;
  readonly path: string;
  readonly sha1: string;
  readonly timestamp: string;
  readonly dataset: string;
  readonly mime_type: string;
  readonly mime_type_label: string;
  readonly size: number;
  readonly title: string;
}

export interface IDatasetPublisher {
  readonly name: string;
  readonly url?: string;
  readonly description?: string;
  readonly official: boolean;
  readonly country?: string;
  readonly country_label?: string;
}

interface INKDatasetBase {
  readonly name: string;
  readonly title: string;
  readonly summary?: string;
  readonly url?: string;
  readonly category?: string;
  readonly frequency?: string;
}

export interface INKDataset extends INKDatasetBase {
  readonly updated_at: string;
  readonly version: string;
  readonly children: Array<string>;
  readonly publisher?: IDatasetPublisher;
  readonly resources: Array<IResource>;
  readonly url?: string;
  readonly entities_url?: string;
  readonly things?: IThingsStats;
}

export interface INKCatalog {
  readonly updated_at?: string;
  readonly datasets: Array<INKDataset>;
}
