"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const verifyAccessToWorkspace = async (workspaceId: string) => {
    const user = await currentUser()
    console.log(workspaceId)

    if(!user) {
        return {
            status: 401,
            message: "Unauthorized"
        }
    }

    try {
        const isUserInWorkspace = await client.workSpace.findFirst({
            where: {
                id: workspaceId,
                OR: [
                    { User: { clerkid: user.id } },
                    {
                        members: {
                            some: {
                                User: { clerkid: user.id }
                            }
                        }
                    }
                ]
            }
        })

        return {
            status: 200, 
            message: isUserInWorkspace ? "Authorized" : "Forbidden",
            data: {workspace: isUserInWorkspace}
        }

        

    } catch (error) {
        console.log(error)

        return {
            status: 500,
            message: "Internal Server Error",
            data: {workspace: null}
        }
    }
}

export const getWorkspaceFolders = async (workspaceId: string) => {

   try {
    const isFolder = await client.folder.findMany({

        where: {
            workSpaceId: workspaceId
        },
        include: {
           _count: {
            select: {
                videos: true
            }
           }
        }

    })

    if(isFolder && isFolder.length > 0) return {
        status: 200,
        message: "Folders Found",
        data: {folders: isFolder}
    }

    return {
        status: 404,
        message: "No Folders Found",
        data: {folders: []}
    }

   
    
   } catch (error) {
    console.log(error)
    return {
        status: 403,
        message: "Internal Server Error",
        data: {folders: null}
    }
   }
  
}

export const getAllUserVideos = async (workspaceId: string) => {

    try {
        const user = await currentUser()
        if(!user) return {
            status: 404,
            message: "User Not Found",
            data: {videos: null}
        }  
        
        const videos = await client.video.findMany({
            where: {
                OR: [
                    {workSpaceId: workspaceId},
                    {folderId:  workspaceId }
                ]
            },
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                source: true,
                processing: true,
                Folder: {
                    select: {
                        id: true,
                        name: true
                    }   
                },
                User: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        image: true 
                    }
                },

                
                
            },
            orderBy: {
                createdAt: "asc"
            }
            
        })

        if(videos && videos.length > 0) return {
            status: 200,
            message: "Videos Found",
            data: { videos}
        }

        return {
            status: 404,
            message: "No Videos Found",
            data: {videos: []}
        }

        
    } catch (error) {
        console.log(error)
        return {
            status: 403,
            message: "Internal Server Error",
            data: {videos: null}
        }
    }

}

export const getWorkSpaces = async () => {
    try {
      const user = await currentUser()
  
      if (!user) return { status: 404 }
  
      const workspaces = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
          workspace: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          members: {
            select: {
              WorkSpace: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      })
  
      if (workspaces) {
        return { status: 200, data: workspaces }
      }
    } catch (error) {
        console.log(error)
      return { status: 400 }

    }
  }

