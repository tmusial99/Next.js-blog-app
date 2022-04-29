import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';
import NextNProgress from "nextjs-progressbar";
import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useRouter, withRouter } from 'next/router';
import Loader from '../components/Loader';

function Enter(props) {
  const { user, username } = useContext(UserContext);
  const router = useRouter()
  const urlAfterLogin = router.query.urlAfterLogin;
  
  useEffect(() => {
    if(username && urlAfterLogin) router.push(urlAfterLogin.toString());
    else if(username){
      router.back()
    } 
  }, [username])

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <>
      <main>
        {user ? ( !username ? <UsernameForm/> : <Loader show center={true}/> ) : <SignInButton/>}
      </main>
    </> 
  );
}
export default Enter

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    try{
      await signInWithPopup(auth, googleAuthProvider);
      toast.success('Pomyślnie zalogowano.');
    }
    catch(ex){
      console.dir(ex);
    }
  };

  return (
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google.png'} width="30px" />Zaloguj za pomocą konta Google
      </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(firestore, `users/${user.uid}`);
    const usernameDoc = doc(firestore, `usernames/${formValue}`)

    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore);
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (formValue) => {
      if (formValue.length >= 3) {
        const ref = doc(firestore, `usernames/${formValue}`);
        const docSnap = await getDoc(ref);
        console.log('Firestore read executed!');
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Nazwa użytownika:</h3>
        <form onSubmit={onSubmit}>
          <input name="username" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Wybierz
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Sprawdzam...</p>;
  } else if (isValid) {
    return <p className="text-success">Nazwa "{username}" jest dostępna!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">Nazwa zajęta!</p>;
  } else {
    return <p></p>;
  }
}