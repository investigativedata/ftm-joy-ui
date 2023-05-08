"use client";

import type { INKDataset, IThingsStats } from "~/lib/ftm/types";
import { usePathname } from "next/navigation";

import Link from "@mui/joy/Link";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import LaunchIcon from "@mui/icons-material/Launch";
import SearchIcon from "@mui/icons-material/Search";

import DateDisplay from "./common/Date";

const ThingsStats = ({ things }: { things: IThingsStats }) => (
  <>
    <div>
      <Typography level="body3">Entities:</Typography>
      <Typography fontWeight="lg">{things.total}</Typography>
    </div>
    {things.countries.length > 0 ? (
      <div>
        <Typography level="body3">Countries:</Typography>
        <Typography fontWeight="lg">{things.countries.length}</Typography>
      </div>
    ) : null}
  </>
);

type ComponentProps = {
  dataset: INKDataset;
  detail?: boolean;
};

export default function Dataset({ dataset, detail = false }: ComponentProps) {
  const basePath = usePathname();
  return (
    <Card variant="outlined" sx={{ width: "100%", marginBottom: "1rem" }}>
      <Typography level="body2">
        Last updated: <DateDisplay value={dataset.updated_at} full />
      </Typography>
      <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
        {dataset.title}
      </Typography>
      {detail ? (
        <Button
          aria-label={`api url for ${dataset.title}`}
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
          endDecorator={<LaunchIcon />}
        >
          Api
        </Button>
      ) : null}
      <Typography level="body1">{dataset.summary}</Typography>
      <Box sx={{ display: "flex", columnGap: "1rem" }}>
        {dataset.things ? <ThingsStats things={dataset.things} /> : null}
        {dataset.publisher ? (
          <div>
            <Typography level="body3">Publisher:</Typography>
            {dataset.publisher.url ? (
              <Link href={dataset.publisher.url}>{dataset.publisher.name}</Link>
            ) : (
              <Typography>{dataset.publisher.name}</Typography>
            )}
          </div>
        ) : null}
        {detail ? (
          <Button
            href={basePath + "/" + dataset.name}
            component="a"
            startDecorator={<SearchIcon />}
            variant="solid"
            size="sm"
            color="primary"
            aria-label={`Explore ${dataset.title}`}
            sx={{ ml: "auto", fontWeight: 600 }}
          >
            Explore
          </Button>
        ) : null}
      </Box>
    </Card>
  );
}
