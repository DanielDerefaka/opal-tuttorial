"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthentication = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 403, message: "unauthenticated" };
    }

    const userexist = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    });

    if (userexist) {
      return { status: 200, message: "authenticated", user: userexist   };
    }

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
            create: {

            }
        },
        subscription : {
            create: {}
        },
        workspace: {
            create: {
                name: `${user.firstName}'s Workspace`,
                type: "PERSONAL"
            }
        },

     
      },
      include: {
        workspace: {
            where: {
                User: {
                    clerkid: user.id
                }
            }
        },
        subscription: {
            select: {
                plan: true,
            }
        }
      },
    });

    if (newUser) {
      return { status: 201, message: "authenticated", user: newUser };
    }   

    return { status: 403, message: "unauthenticated" }; 
  } catch (error) {
    console.log(error);
    return { status: 500, message: "internal server error" };
};

}

export const getNotifications = async () => {

  try {
      const user = await currentUser()
      if(!user) return {
          status: 404,
          message: "User Not Found",
          data: {notifications: null}
      }

      const notifications = await client.user.findUnique({
          where: {
              clerkid: user.id
          },
          select: {
            notification: true,
            _count: {
              select: {
                notification: true
              }
            }
          }
          
      })

      if(notifications && notifications?.notification.length > 0) return {
        status: 200,
        message: "Notifications Found",
        data: {notifications: notifications}
      }

      return {
        status: 404,
        message: "Notifications Not Found",
        data: {notifications: null}
      }


  } catch (error) {
    console.log(error)
    return {
      status: 400,
      message: "Internal Server Error",
      data: {notifications: null}
    }
      
  }

}

export const searchUsers = async (query: string) => {

  try {
    const user = await currentUser()
    if(!user) return {
      status: 404,
      message: "User Not Found"
    }

    const users = await client.user.findMany({
      where: {
        OR: [{
          firstname: {
            contains: query,
            mode: "insensitive"
          },
          email: {
            contains: query,
            mode: "insensitive"
          }, 
          lastname: {
            contains: query,
            mode: "insensitive"
          }
        }],
        NOT: {
          clerkid: user.id
        } 
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true
          }
        },
        firstname: true,
        lastname: true,
        email: true,
        image: true,
      }
    })

    if(users && users.length > 0) return {
      status: 200,
      message: "Users Found",
      data: users
    }
    
    return {
      status: 404,
      message: "Users Not Found",
      data: undefined
    }
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      message: "Internal Server Error",
      data: undefined
    } 
    
  }

}