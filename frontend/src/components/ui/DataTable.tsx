import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
};

export const DataTable = <T extends Record<string, any> & { id?: number | string }>({
  columns,
  rows
}: {
  columns: Column<T>[];
  rows: T[];
}) => {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={row.id ?? index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="empty-cell">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
