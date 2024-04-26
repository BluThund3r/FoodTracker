import { Food } from "@prisma/client";

export type SortCriteria =
  | "name"
  | "calories"
  | "protein"
  | "carbs"
  | "fat"
  | "sugar";
export type SortOrder = "asc" | "desc";

export function isSortCriteria(criteria: string): criteria is SortCriteria {
  return ["name", "calories", "protein", "carbs", "fat", "sugar"].includes(
    criteria
  );
}

export function isSortOrder(order: string): order is SortOrder {
  return ["asc", "desc"].includes(order);
}
