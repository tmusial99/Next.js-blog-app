import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';

// Top navbar
export default function Navbar() {
  const {user, username} = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <a className="btn btn-logo">BLOG</a>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <SignOutButton/>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Napisz posta</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                {user?.photoURL ? <img className='profileImg' src={user?.photoURL}/> : <img src='/defaultProfilePicture.jpg'/>}
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <a className='btn btn-blue'>Zaloguj się</a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Wyloguj się</button>;
}