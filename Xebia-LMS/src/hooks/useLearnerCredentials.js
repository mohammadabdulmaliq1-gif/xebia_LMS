import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { learnerCredentialService } from "../services/api";

export function useGetLearnerCredentials() {
  return useQuery({
    queryKey: ["learnerCredentials"],
    queryFn: () => learnerCredentialService.getLearnerCredentials(),
  });
}

export function useCreateLearnerCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => learnerCredentialService.createLearnerCredential(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learnerCredentials"] });
    },
  });
}

export function useDeleteLearnerCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => learnerCredentialService.deleteLearnerCredential(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learnerCredentials"] });
    },
  });
}
