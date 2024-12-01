import { MutationFunction, MutationKey, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (mutationKey: MutationKey, mutationFn: MutationFunction<any, any>, queryKey?: string, onSuccess?: () => void) => {


    const client = useQueryClient()
    const {mutate, isPending} = useMutation({
        mutationKey,
        mutationFn,
        onSuccess: ( data) => {
            if(onSuccess) onSuccess()
            return toast(data.status === 200 ? 'Sucess' : 'Error', {
                description: data.status === 200 ? data.data : null,
              
            })
        },

        onSettled: async() => {

            return await client.invalidateQueries({queryKey: queryKey ? [queryKey] : undefined})



        }

    })


    return {mutate, isPending}


}   