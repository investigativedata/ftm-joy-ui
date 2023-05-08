type DateProps = {
  value: string;
  yearOnly?: boolean;
  full?: boolean;
  isoFormat?: boolean;
};

export const renderDate = ({
  value,
  yearOnly,
  full,
  isoFormat,
}: DateProps): string => {
  if (value.toString().length == 4) return value.toString();
  if (isoFormat) return new Date(value).toISOString();
  return full
    ? new Date(value).toLocaleString()
    : new Date(value).toISOString().slice(0, yearOnly ? 4 : 10);
};

export default function DateDisplay(props: DateProps) {
  return (
    <time dateTime={renderDate({ value: props.value, isoFormat: true })}>
      {renderDate(props)}
    </time>
  );
}
