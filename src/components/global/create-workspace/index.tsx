import { getWorkSpaces } from '@/actions/workspace'
import { useQueryData } from '@/hooks/use-QueryData'
import React from 'react'
import Modal from '../modal'
import { Button } from '@/components/ui/button'
import FolderPlusDuotine from '@/components/icons/folder-plus-duotone'
import WorkspaceForm from '@/components/forms/workspace-form'

const CreateWorkspace = () => {

    const {data} = useQueryData(['user-workspaces'], () => getWorkSpaces() )

    const {data:plan} = data as{
        status: number
        data: {
           subscription: {
            plan: 'PRO' | 'FREE'
          } | null
        }
    }

    if(plan?.subscription?.plan === 'FREE'){
        return <div> 
           <Button disabled className='bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-2 px-4 rounded-xl'><FolderPlusDuotine/> Upgrade to PRO</Button>
        </div>
    }

    if(plan?.subscription?.plan === 'PRO'){
        return (
            <div>
                <Modal trigger={<Button className='bg-[#1D1D1D] text-[#707070] flex items-center gap-2  py-6  px-4 rounded-xl'><FolderPlusDuotine/> Create a Workspace</Button>} title='Create Workspace' description='Create a new workspace to get started, it helps you collaborate with your team members'>

                <WorkspaceForm/> 
                </Modal>
            </div>
        )
    }


}

export default CreateWorkspace
