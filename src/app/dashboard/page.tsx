import { onAuthentication } from '@/actions/user'
import { redirect } from 'next/navigation'


const page =  async () => {

    const auth = await onAuthentication()

    if(auth.status === 200 || auth.status === 201) {
        return redirect(`/dashboard/${auth.user?.workspace[0].id}?redirect=true`)

     }

     if (auth.status === 403 || auth.status === 500 || auth.status === 404) {
        return redirect("/auth/sign-in")
     }

  
}

export default page
