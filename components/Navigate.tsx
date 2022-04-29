import { useRouter, withRouter } from "next/router"
import { useEffect } from "react";

interface IProps{
    to: string,
    redirectAfterLogin?: boolean
}
export default function Navigate({to, redirectAfterLogin}:IProps) {
    const router = useRouter();
    const url = redirectAfterLogin ? router.asPath : null;
    useEffect(() => {
        if(router.isReady){
            if(url){
                router.push({
                    pathname: to,
                    query: { urlAfterLogin: url}
                }, to)
            }
            else{
                router.push(to)
            }
        }
    },[router])
    return <></>
}