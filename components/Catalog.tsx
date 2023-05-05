import type { INKCatalog } from "~/lib/ftm/types";

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
