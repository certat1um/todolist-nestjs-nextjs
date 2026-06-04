"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategories";

export function CategoryFilter() {
  const { categories, selectedCategory, changeCategory } = useCategories();

  return (
    <div className="space-y-2">
      <Label htmlFor="filter">Filter by Category</Label>
      <Select value={selectedCategory} onValueChange={changeCategory}>
        <SelectTrigger id="filter">
          <SelectValue>
            {categories.find((cat) => cat.id === selectedCategory)?.type ??
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
