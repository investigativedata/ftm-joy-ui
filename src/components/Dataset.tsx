import LaunchIcon from "@mui/icons-material/Launch";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import type { IDatasetPublisher, INKDataset, ICoverage } from "../types";
import CountryFlag from "./common/CountryFlag";
import DateDisplay from "./common/Date";
import Link from "./common/Link";

const Coverage = ({ coverage }: { coverage: ICoverage }) => (
  <>
    <div>
      <Typography level="body-sm">Entities:</Typography>
      <Typography fontWeight="lg">{coverage.entities}</Typography>
    </div>
    {coverage.countries.length > 0 && (
      <div>
        <Typography level="body-sm">Countries:</Typography>
        <Typography fontWeight="lg">{coverage.countries.length}</Typography>
      </div>
    )}
  </>
);

type DatasetProps = {
  dataset: INKDataset;
  detail?: boolean;
};

export default function Dataset({ dataset, detail = false }: DatasetProps) {
  return (
    <Card variant="outlined" sx={{ width: "100%", marginBottom: "1rem" }}>
      {dataset.updated_at && (
        <Typography level="body-md">
          Last updated: <DateDisplay value={dataset.updated_at} full />
        </Typography>
      )}
      <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
        {dataset.title}
      </Typography>
      {detail && (
        <Button
          href={dataset.entities_url}
          component="a"
          aria-label={`api url for ${dataset.title}`}
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
          endDecorator={<LaunchIcon />}
        >
          Api
        </Button>
      )}
      <Typography level="body-lg">{dataset.summary}</Typography>
      <Box sx={{ display: "flex", columnGap: "1rem" }}>
        {dataset.coverage && <Coverage coverage={dataset.coverage} />}
        {dataset.publisher && (
          <div>
            <Typography level="body-sm">Publisher:</Typography>
            {dataset.publisher.url ? (
              <Link href={dataset.publisher.url}>{dataset.publisher.name}</Link>
            ) : (
              <Typography>{dataset.publisher.name}</Typography>
            )}
          </div>
        )}
        {detail && (
          <Link href={`${dataset.name}`}>
            <Button
              startDecorator={<SearchIcon />}
              variant="solid"
              size="sm"
              color="primary"
              aria-label={`Explore ${dataset.title}`}
              sx={{ ml: "auto", fontWeight: 600 }}
            >
              Explore
            </Button>
          </Link>
        )}
      </Box>
    </Card>
  );
}

const TRow = ({ label, value }: { label: string; value: any }) =>
  !!value ? (
    <tr>
      <th style={{ backgroundColor: "inherit" }}>{label}</th>
      <td>{value}</td>
    </tr>
  ) : null;

type MetaComponentProps = {
  dataset: INKDataset;
  full?: boolean;
};

export function DatasetMeta({ dataset, full = false }: MetaComponentProps) {
  return (
    <Card variant="soft">
      {full && (
        <>
          <code>{dataset.name}</code>
          <Typography color="primary" level="h2" fontSize="md" sx={{ mb: 0.5 }}>
            {dataset.title}
          </Typography>
          <Typography color="neutral" level="body-md">
            {dataset.summary}
          </Typography>
        </>
      )}
      <Table aria-label="dataset metadata">
        <tbody>
          <TRow
            label="Last updated"
            value={
              dataset.updated_at && (
                <DateDisplay value={dataset.updated_at} full />
              )
            }
          />
          <TRow label="Frequency" value={dataset.frequency || "unknown"} />
          <TRow label="Category" value={dataset.category || "Other"} />
          <TRow label="Publisher" value={dataset.publisher?.name} />
        </tbody>
      </Table>
    </Card>
  );
}

export function PublisherMeta({ publisher }: { publisher: IDatasetPublisher }) {
  return (
    <Card variant="soft">
      <Typography level="h3" fontSize="sm" sx={{ mb: 0.5 }}>
        Publisher
      </Typography>
      <CountryFlag iso={publisher.country} />
      {publisher.country_label}
      <Typography color="primary" level="h2" fontSize="md" sx={{ mb: 0.5 }}>
        {publisher.name}
      </Typography>
      <Typography color="neutral" level="body-md">
        {publisher.description}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <div>
          <Typography level="body-sm" fontWeight="lg">
            Official
          </Typography>
          <Typography>{publisher.official ? "yes" : "no"}</Typography>
        </div>
        {publisher.url && (
          <Button
            component="a"
            href={publisher.url}
            variant="outlined"
            size="sm"
            color="primary"
            aria-label="Publisher website"
            sx={{ ml: "auto", fontWeight: 500 }}
            endDecorator={<LaunchIcon />}
          >
            Website
          </Button>
        )}
      </Box>
    </Card>
  );
}

export function DatasetHeader({ dataset }: DatasetProps) {
  return (
    <Stack>
      <Typography level="h2" color="primary" sx={{ pb: 2 }}>
        {dataset.title}
      </Typography>
      <Typography>{dataset.summary}</Typography>
      <Button
        href={dataset.entities_url}
        component="a"
        aria-label={`api url for ${dataset.title}`}
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
        endDecorator={<LaunchIcon />}
      >
        Api
      </Button>
    </Stack>
  );
}
