import { createWorkspace } from '@/actions/workspace'

import useZodForm from './useZodform'
import { workspaceSchema } from '@/components/forms/workspace-form/schema'
import { useMutationData } from './use-mutationdata'

export const useCreateWorkspace = () => {
  const { mutate, isPending } = useMutationData(
    ['create-workspace'],
    (data: { name: string }) => createWorkspace(data.name),
    'user-workspaces'
  )

  const { errors, onFormSubmit, register } = useZodForm(workspaceSchema, mutate)
  return { errors, onFormSubmit, register, isPending }
}