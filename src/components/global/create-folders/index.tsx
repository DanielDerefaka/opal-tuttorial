import FolderPlusDuotine from '@/components/icons/folder-plus-duotone'
import { Button } from '@/components/ui/button'
import { useCreateFolders } from '@/hooks/useCreateFolder'
import React from 'react'

const CreateFolders = ({workspaceId}: {workspaceId: string}) => {

    const {onCreateNewFolder} = useCreateFolders(workspaceId)

    // WIP ADD FOLDER 
  return (
    <div>

        <Button onClick={onCreateNewFolder} className='bg-[#1d1d1d] text-[#707070] flex items-center  py-6  px-4 gap-2 rounded-xl'>
            <FolderPlusDuotine/>
            Create a Folder
        </Button>
 
    </div>
  )
}

export default CreateFolders
