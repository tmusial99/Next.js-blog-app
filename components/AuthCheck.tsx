import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import Navigate from './Navigate';

// Component's children only shown to logged-in users
interface Iprops{
    redirectAfterLogin?:boolean,
    children?,
    fallback?
}
export default function AuthCheck(props:Iprops) {
  const { username } = useContext(UserContext);
  const { redirectAfterLogin } = props;

  return username ? props.children : props.fallback || <Navigate to='/enter' redirectAfterLogin={redirectAfterLogin}/>
}