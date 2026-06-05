"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { useCategories } from "@/src/entities/category/hooks";

export function CategoryFilter() {
  const { categories, selectedCategoryId, changeCategory } = useCategories();

  return (
    <div className="space-y-2">
      <Label htmlFor="filter">Filter by Category</Label>
      <Select value={selectedCategoryId} onValueChange={changeCategory}>
        <SelectTrigger id="filter">
          <SelectValue>
            {categories.find((cat) => cat.id === selectedCategoryId)?.type ??
              "Select category"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
