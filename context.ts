import { createContext } from "react";

interface IContext {
  urlPrefix?: string;
  dataset?: string;
}

const Context = createContext<IContext>({});
export default Context;
