import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { submoduleService } from "../services/api";

export function useGetSubmodules(moduleId) {
  return useQuery({
    queryKey: ["submodules", moduleId],
    queryFn: () => submoduleService.getSubmodules(moduleId),
    enabled: !!moduleId,
  });
}

export function useGetSubmoduleBySlug(courseSlug, submoduleSlug) {
  return useQuery({
    queryKey: ["submodules", "slug", courseSlug, submoduleSlug],
    queryFn: () => submoduleService.getSubmoduleBySlug(courseSlug, submoduleSlug),
    enabled: !!courseSlug && !!submoduleSlug,
  });
}

export function useCreateSubmodule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => submoduleService.createSubmodule(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submodules", data.moduleId] });
    },
  });
}

export function useUpdateSubmodule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => submoduleService.updateSubmodule(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submodules", data.moduleId] });
      queryClient.invalidateQueries({ queryKey: ["submodules", "slug"] });
    },
  });
}

export function useDeleteSubmodule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, moduleId }) => submoduleService.deleteSubmodule(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["submodules", variables.moduleId] });
    },
  });
}

export function useReorderSubmodules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, orderedIds }) => submoduleService.reorderSubmodules(moduleId, orderedIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["submodules", variables.moduleId] });
    },
  });
}
