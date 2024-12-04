'use client'
import { getFolderInfo } from '@/actions/workspace'
import { useQueryData } from '@/hooks/use-QueryData'
import { FolderProps } from '@/types/index.type'
import React from 'react'


const FolderInfo = ({folderId}: {folderId: string}) => {
    const {data} = useQueryData(["folder-info"], () => getFolderInfo(folderId))
    const {data: folder} = data as FolderProps
  return (
    <div className='flex items-center'>
        <h2 className="text-[#bdbdbd] text-2xl ">
            {folder?.name}
        </h2>
      
    </div>

  )
}

export default FolderInfo
