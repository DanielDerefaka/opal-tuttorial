"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  const user = await currentUser();
  console.log(workspaceId);

  if (!user) {
    return {
      status: 401,
      message: "Unauthorized",
    };
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
                User: { clerkid: user.id },
              },
            },
          },
        ],
      },
    });

    return {
      status: 200,
      message: isUserInWorkspace ? "Authorized" : "Forbidden",
      data: { workspace: isUserInWorkspace },
    };
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      message: "Internal Server Error",
      data: { workspace: null },
    };
  }
};

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })
    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders }
    }
    return { status: 404, data: [] }
  } catch (error) {
    console.log(error)
    return { status: 403, data: [] }
  }
}

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const videos = await client.video.findMany({
      where: {
        OR: [{ workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (videos && videos.length > 0) {
      return { status: 200, data: videos }
    }

    return { status: 404 }
  } catch (error) {
    return { status: 400 }
  }
}


export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

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
    });

    if (workspaces) {
      return { status: 200, data: workspaces };
    }
  } catch (error) {
    console.log(error);
    return { status: 400 };
  }
};

export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const authorized = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    if (authorized?.subscription?.plan === 'PRO') {
      const workspace = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: 'PUBLIC',
            },
          },
        },
      })
      if (workspace) {
        return { status: 201, data: 'Workspace Created' }
      }
    }
    return {
      status: 401,
      data: 'You are not authorized to create a workspace.',
    }
  } catch (error) {
    return { status: 400 }
  }
}



export const renameFolder = async (folderId: string, name: string) => {

  try {
    const folder = await client.folder.update({
      where: {
        id: folderId
      },
      data: {
        name
      }
    })

      if(folder) return {status: 200, data: "Folder Renamed"} 

      if(!folder) return {status: 404, data: "Folder Not Found"}

  } catch (error) {
    console.log(error)
    return {status: 500, data: "Internal Server Error"}
  }

}

export const createFolder = async (workspaceId: string) => {

  try {

    const isNewFolder = await client.workSpace.update({
      where: {
        id: workspaceId
      },
      data: {
        folders: {
          create: {
            name: "Untitled"
          }
        }
      }
    })

    if(isNewFolder) return {status: 200, message: "Folder Created"}

    if(!isNewFolder) return {status: 404, message: "Folder Not Created"}

  } catch (error) {
    console.log(error)
    return {status: 500, data: "Internal Server Error"}
  }

}

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })
    if (folder)
      return {
        status: 200,
        data: folder,
      }
    return {
      status: 400,
      data: null,
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      data: null,
    }
  }
}

export const moveVideoLocation = async (
  videoId: string,
  workSpaceId: string,
  folderId: string
) => {
  try {
    const location = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId,
      },
    })
    if (location) return { status: 200, data: 'folder changed successfully' }
    return { status: 404, data: 'workspace/folder not found' }
  } catch (error) {
    console.log(error)
    return { status: 500, data: 'Oops! something went wrong' }
  }
}
