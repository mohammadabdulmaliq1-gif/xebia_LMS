import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moduleService } from "../services/api";

export function useGetModules(courseId) {
  return useQuery({
    queryKey: ["modules", courseId],
    queryFn: () => moduleService.getModules(courseId),
    enabled: !!courseId,
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => moduleService.createModule(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modules", data.courseId] });
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => moduleService.updateModule(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modules", data.courseId] });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, courseId }) => moduleService.deleteModule(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["modules", variables.courseId] });
    },
  });
}

export function useReorderModules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, orderedIds }) => moduleService.reorderModules(courseId, orderedIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["modules", variables.courseId] });
    },
  });
}
