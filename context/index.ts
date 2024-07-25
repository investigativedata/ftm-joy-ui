import { createContext } from "react";
import { TEntity } from "~/types";

interface IContext {
  urlPrefix?: string;
  getEntityUrl?: (e: TEntity, defaultPrefix?: string) => string;
  entityId?: string;
}

const Context = createContext<IContext>({});
export default Context;
