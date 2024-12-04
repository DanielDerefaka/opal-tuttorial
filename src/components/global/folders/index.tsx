import FolderDuotone from '@/components/icons/folder-duotone'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import Folder from './folder'

const Folders = ({workspaceId}: {workspaceId: string}) => {

    // get folders

  return (
    <div className='flex flex-col gap-4'>
        <div className='flex  items-center justify-between'>
            <div className='flex items-center gap-4'>
                <FolderDuotone/>
                <h2 className='text-[#bdbdbd] text-xl' > Folders</h2>
            </div>
            <div className='flex items-center gap-2'>
                <p className='text-[#bdbdbd] text-sm'>See all</p>
                <ArrowRight color='#bdbdbd'/>    
            </div>
        </div>

        <section className={cn('flex items-cennter gap-4 overflow-x-auto w-full')}>

            <Folder name="Folder"/> 

        </section>
      
    </div>
  )
}

export default Folders
