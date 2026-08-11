import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/api";

export function useGetCourses(filters = {}) {
  return useQuery({
    queryKey: ["courses", filters],
    queryFn: () => courseService.getCourses(filters),
  });
}

export function useGetCourseBySlug(slug) {
  return useQuery({
    queryKey: ["courses", "slug", slug],
    queryFn: () => courseService.getCourseBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Courses count changed
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => courseService.updateCourse(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", "slug", data.slug] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Courses count changed
    },
  });
}
