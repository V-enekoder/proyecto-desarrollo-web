import * as z from "zod";

export function PaginationSchema<T>(itemSchema: z.ZodType<T>) {
  return z.object({
    data: z.array(itemSchema),
    meta: z.object({
      totalItems: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number(),
      currentPage: z.number(),
    }),
    links: z.object({
      first: z.string().optional(),
      previous: z.string().optional(),
      current: z.string(),
      next: z.string().optional(),
      last: z.string().optional(),
    }),
  });
}
