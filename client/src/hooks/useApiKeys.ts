import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export type ApiKey = {
  id: number;
  key: string;
  name: string;
  active: boolean;
};

export const useApiKeys = () => {
  const { toast } = useToast();
  
  // Fetch API keys
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({ 
    queryKey: ['/api/keys'],
    staleTime: 60000, // 1 minute
  });
  
  const apiKeys = data?.data?.apiKeys || [];
  
  // Create API key mutation
  const createMutation = useMutation({
    mutationFn: async (formData: { name: string }) => {
      // Generate a random API key
      const key = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      const response = await apiRequest('POST', '/api/keys', {
        name: formData.name,
        key,
        active: true
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "API key created successfully",
      });
      // Invalidate the API keys query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/keys'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create API key: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  return {
    apiKeys,
    isLoading,
    isError,
    error,
    createApiKey: createMutation.mutate,
    isCreating: createMutation.isPending
  };
};
