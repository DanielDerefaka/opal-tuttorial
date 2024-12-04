import { createFolder } from '@/actions/workspace'
import { useMutationData } from './use-mutationdata'

export const useCreateFolders = (workspaceId: string) => {
  const { mutate } = useMutationData(
    ['create-folder'],
    () => createFolder(workspaceId),
    'workspace-folders'
  )

  const onCreateNewFolder = () =>
    mutate({ name: 'Untitled', id: 'optimitsitc--id' })
  return { onCreateNewFolder }
}