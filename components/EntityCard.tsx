import { styled } from "@mui/joy/styles";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import EntityProperty, { EntityCountry, EntityDescription } from "./Property";
import { EntityLink } from "./Entity";
import type { TEntity } from "../types";
import { getSchema, getProxy } from "../src/util";

const excludeProps = ["country", "name"];

function EntityCard({ entity: proxy }: { entity: TEntity }) {
  const entity = getProxy(proxy);
  const schema = getSchema(entity.schema);
  return (
    <Card variant="outlined">
      <EntityCountry entity={entity} />
      <Typography color="primary" level="h2" fontSize="md" sx={{ mb: 0.5 }}>
        <EntityLink entity={entity} icon />
      </Typography>
      <Typography color="neutral" level="body2">
        <EntityDescription entity={entity} ellipsis={100} />
      </Typography>
      <Stack direction="row" spacing={2}>
        {schema.featured
          .filter((p) => excludeProps.indexOf(p) < 0)
          .map(
            (p) =>
              entity.hasProperty(p) && (
                <div key={p}>
                  <Typography level="body3">{schema.getProperty(p)?.label}</Typography>
                  <EntityProperty entity={entity} prop={p} />
                </div>
              )
          )}
      </Stack>
    </Card>
  );
}

export default styled(EntityCard)();
