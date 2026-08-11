import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/api";

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });
}

export function useGetCategoryBySlug(slug) {
  return useQuery({
    queryKey: ["categories", "slug", slug],
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "slug", data.slug] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
