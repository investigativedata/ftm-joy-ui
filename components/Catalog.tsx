import type { INKCatalog } from "../types";

import Dataset from "./Dataset";

type ComponentProps = { catalog: INKCatalog };

export default function Catalog({ catalog }: ComponentProps) {
  return (
    <section>
      {catalog.datasets.map((d) => (
        <Dataset key={d.name} dataset={d} />
      ))}
    </section>
  );
}
