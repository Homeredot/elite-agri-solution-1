export const getPagination = (input: unknown) => {
  const page = Math.max(Number(input && typeof input === "object" && "page" in input ? (input as Record<string, unknown>).page : 1) || 1, 1);
  const pageSize = Math.min(
    Math.max(
      Number(
        input && typeof input === "object" && "pageSize" in input
          ? (input as Record<string, unknown>).pageSize
          : 10
      ) || 10,
      1
    ),
    100
  );

  return {
    page,
    pageSize,
    limit: pageSize,
    offset: (page - 1) * pageSize
  };
};
