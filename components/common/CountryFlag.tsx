import "semantic-ui-flag/flag.css";

export default function CountryFlag({ iso }: { iso: string }) {
  return <i className={`${iso.toLowerCase()} flag`}></i>;
}
