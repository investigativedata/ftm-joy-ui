import type { INKCatalog } from "../types";

import Dataset from "./Dataset";

type ComponentProps = { catalog: INKCatalog; detail?: boolean };

export default function Catalog({ catalog, detail = false }: ComponentProps) {
  return (
    <section>
      {catalog.datasets.map((d) => (
        <Dataset key={d.name} dataset={d} detail={detail} />
      ))}
    </section>
  );
}
