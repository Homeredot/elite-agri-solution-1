import { Card } from "./Card";

export const StatCard = ({
  label,
  value,
  helper
}: {
  label: string;
  value: string | number;
  helper?: string;
}) => {
  return (
    <Card className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {helper ? <small className="stat-helper">{helper}</small> : null}
    </Card>
  );
};
