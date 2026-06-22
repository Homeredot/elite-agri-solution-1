import { BadgeCheck, CircleX, Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";

export const ReviewsPage = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["reviews"],
    queryFn: () => api.get<{ data: any[] }>("/reviews")
  });

  const mutation = useMutation({
    mutationFn: (input: { id: number; status: string }) =>
      api.patch(`/reviews/${input.id}`, { status: input.status, isFeatured: input.status === "approved" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
    }
  });

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <Star size={20} />
            </span>
            Approve, reject, or clean up customer feedback and featured review highlights
          </h2>
        </div>
      </div>

      <Card>
        <DataTable
          rows={query.data?.data ?? []}
          columns={[
            { key: "product", title: "Product", render: (row) => row.product_name },
            { key: "customer", title: "Customer", render: (row) => row.customer_name },
            { key: "rating", title: "Rating", render: (row) => row.rating },
            { key: "review", title: "Review", render: (row) => row.review_text || row.title || "n/a" },
            { key: "status", title: "Status", render: (row) => row.status },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => mutation.mutate({ id: row.id, status: "approved" })}>
                    <BadgeCheck size={16} />
                    Approve
                  </Button>
                  <Button variant="secondary" onClick={() => mutation.mutate({ id: row.id, status: "rejected" })}>
                    <CircleX size={16} />
                    Reject
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};
