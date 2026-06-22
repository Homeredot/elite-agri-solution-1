import { FolderTree, Plus, SquarePen, Tags } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { Button } from "./Button";
import { Card } from "./Card";
import { DataTable } from "./DataTable";
import { Modal } from "./Modal";
import { DynamicForm, type FieldConfig } from "../forms/DynamicForm";
import { camelizeKeys } from "../../utils/object";
import { useAdminNotice } from "./AdminNoticeProvider";

type CrudSectionProps<T extends Record<string, any> & { id?: number | string }> = {
  title: string;
  queryKey: string[];
  endpoint: string;
  fields: FieldConfig[];
  columns: {
    key: string;
    title: string;
    render: (row: T, openEdit: (row: T) => void) => ReactNode;
  }[];
  defaultValues?: Record<string, unknown>;
  transformSubmit?: (values: Record<string, unknown>) => Record<string, unknown>;
  loadEditValues?: (row: T) => Promise<Record<string, unknown>>;
};

export const CrudSection = <T extends Record<string, any> & { id?: number | string }>({
  title,
  queryKey,
  endpoint,
  fields,
  columns,
  defaultValues,
  transformSubmit,
  loadEditValues
}: CrudSectionProps<T>) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const queryClient = useQueryClient();
  const { confirm, notify } = useAdminNotice();

  const query = useQuery({
    queryKey,
    queryFn: () => api.get<{ data: T[] }>(endpoint)
  });

  const mutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const payload = transformSubmit ? transformSubmit(values) : values;
      if (editing?.id) {
        return api.put(`${endpoint}/${editing.id}`, payload);
      }
      return api.post(endpoint, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      setOpen(false);
      setEditing(null);
      notify({
        tone: "success",
        title: editing?.id ? `${title} updated` : `${title} created`,
        message: editing?.id
          ? `Your changes to ${title.toLowerCase()} were saved successfully.`
          : `A new ${title.toLowerCase()} entry is now available.`
      });
    },
    onError: (error) => {
      notify({
        tone: "error",
        title: `Failed to save ${title.toLowerCase()}`,
        message: error instanceof Error ? error.message : "Please try again."
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => api.delete(`${endpoint}/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      notify({
        tone: "success",
        title: `${title} deleted`,
        message: `${title} was removed successfully.`
      });
    },
    onError: (error) => {
      notify({
        tone: "error",
        title: `Failed to delete ${title.toLowerCase()}`,
        message: error instanceof Error ? error.message : "Please try again."
      });
    }
  });

  const normalizeEditValues = (values: Record<string, unknown>) =>
    fields.reduce<Record<string, unknown>>((result, field) => {
      const currentValue = values[field.name];

      result[field.name] =
        field.type === "checkbox"
          ? Boolean(currentValue)
          : field.type === "json" && currentValue && typeof currentValue !== "string"
            ? JSON.stringify(currentValue, null, 2)
            : currentValue;

      return result;
    }, { ...values });

  const openEdit = async (row: T) => {
    const values = loadEditValues ? await loadEditValues(row) : (camelizeKeys(row) as Record<string, unknown>);
    setEditing(normalizeEditValues(values));
    setOpen(true);
  };

  const requestDelete = async (row: T) => {
    if (!row.id) {
      return;
    }

    const confirmed = await confirm({
      title: `Delete ${title}`,
      message: "Are you sure you want to delete this item? This action may not be easy to undo.",
      confirmLabel: "Delete",
      tone: "error"
    });

    if (confirmed) {
      deleteMutation.mutate(row.id);
    }
  };

  const sectionIcon =
    title.toLowerCase().includes("categor")
      ? <FolderTree size={18} />
      : title.toLowerCase().includes("tag")
        ? <Tags size={18} />
        : <SquarePen size={18} />;

  return (
    <Card className="stack-md">
      <div className="section-header">
        <h3 className="section-title">{sectionIcon}{title}</h3>
        <Button onClick={() => setOpen(true)}><Plus size={16} />Add New</Button>
      </div>
      <DataTable
        rows={query.data?.data ?? []}
        columns={[
          ...columns.map((column) => ({
            key: column.key,
            title: column.title,
            render: (row: T) => column.render(row, openEdit)
          })),
          {
            key: "actions",
            title: "Actions",
            render: (row: T) => (
              <div className="row-actions">
                <Button variant="ghost" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                {row.id ? (
                  <Button variant="danger" onClick={() => void requestDelete(row)}>
                    Delete
                  </Button>
                ) : null}
              </div>
            )
          }
        ]}
      />
      <Modal
        open={open}
        title={editing ? `Edit ${title}` : `Create ${title}`}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <DynamicForm
          fields={fields}
          defaultValues={editing ?? defaultValues}
          onSubmit={async (values) => mutation.mutate(values)}
          submitLabel={editing ? "Update" : "Create"}
        />
      </Modal>
    </Card>
  );
};
