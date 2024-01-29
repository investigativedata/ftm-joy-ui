import React from "react";

export default function Link({ children, href }: React.ComponentProps<"a">) {
  return <a href={href}>{children}</a>;
}
