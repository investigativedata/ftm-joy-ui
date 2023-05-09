import NextLink from "next/link";

import { styled } from "@mui/joy/styles";

const Link = styled(NextLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.plainColor,
  "&:hover": {
    color: theme.palette.primary[300],
  },
}));

export default Link;
