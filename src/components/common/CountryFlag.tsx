import "semantic-ui-flag/flag.css";

export default function CountryFlag({ iso }: { iso?: string }) {
  return iso ? <i className={`${iso.toLowerCase()} flag`}></i> : null;
}
