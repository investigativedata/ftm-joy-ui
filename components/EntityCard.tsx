import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/joy/styles";

import { getProxy, getSchema } from "../src/util";
import type { TEntity } from "../types";
import { EntityLink, EntitySchema } from "./Entity";
import EntityProperty, { EntityCountry, EntityDescription } from "./Property";

const excludeProps = ["country", "name", "summary", "description", "notes"];

function EntityCard({ entity: proxy }: { entity: TEntity }) {
  const entity = getProxy(proxy);
  const schema = getSchema(entity.schema);
  const country =
    entity.hasProperty("country") || entity.hasProperty("jurisdiction");
  return (
    <Card variant="outlined">
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Chip variant="soft" color="neutral" size="sm">
          <EntitySchema entity={entity} iconColor="gray" iconSize={10} />
        </Chip>
        {country && (
          <Chip variant="soft" color="neutral" size="sm">
            <EntityCountry entity={entity} />
          </Chip>
        )}
      </Stack>
      <Typography color="primary" level="h2" fontSize="md" sx={{ mb: 0.5 }}>
        <EntityLink entity={entity} />
      </Typography>
      <Typography color="neutral" level="body-md">
        <EntityDescription entity={entity} ellipsis={100} />
      </Typography>
      <Stack direction="row" spacing={2}>
        {schema.featured
          .filter((p) => excludeProps.indexOf(p) < 0)
          .map(
            (p) =>
              entity.hasProperty(p) && (
                <div key={p}>
                  <Typography level="body-md">
                    {schema.getProperty(p)?.label}
                  </Typography>
                  <EntityProperty entity={entity} prop={p} icon />
                </div>
              )
          )}
      </Stack>
    </Card>
  );
}

export default styled(EntityCard)();
