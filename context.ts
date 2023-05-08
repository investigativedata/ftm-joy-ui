import { createContext } from "react";

import { INKDataset } from "./types";

interface IContext {
  urlPrefix?: string;
  dataset?: string;
}

const Context = createContext<IContext>({});
export default Context;
