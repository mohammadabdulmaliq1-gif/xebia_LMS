import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contentService } from "../services/api";

export function useGetContents(submoduleId) {
  return useQuery({
    queryKey: ["contents", submoduleId],
    queryFn: () => contentService.getContents(submoduleId),
    enabled: !!submoduleId,
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => contentService.createContent(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contents", data.submoduleId] });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => contentService.updateContent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contents", data.submoduleId] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, submoduleId }) => contentService.deleteContent(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contents", variables.submoduleId] });
    },
  });
}

export function useReorderContents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submoduleId, orderedIds }) => contentService.reorderContents(submoduleId, orderedIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contents", variables.submoduleId] });
    },
  });
}
