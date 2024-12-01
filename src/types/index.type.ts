export type WorkspaceProps = {
    data: {
        subscription: {
            plan: "FREE" | "PRO" 
        }
        workspace: {
            id: string,
            name: string,
            type: "PERSONAL" | "PUBLIC"
        }[],
        members: {
            WorkSpace : {
            id: string,
            name: string,
            type: "PERSONAL" | "PUBLIC"
           },
            
        }[]
    }
}


export type NotificationProps = {
    status: string
    data: {
        _count: {
            notifications: number
        }
    }
}