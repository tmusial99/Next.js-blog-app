import { useRouter } from "next/router";
import { useContext, useState } from "react";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import { collection, doc, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import styles from '../../styles/Admin.module.css';
import Metatags from "../../components/Metatags";

export default function AdminPostsPage({ }) {
  return (
    <main>
      <AuthCheck redirectAfterLogin={true}>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = collection(firestore, 'users');
  const document = doc(ref, auth.currentUser.uid);
  const ref2 = collection(document, 'posts');
  const q = query(ref2, orderBy('createdAt'));

  const [querySnapshot] = useCollection(q);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <Metatags title="Next.js Blog - Zarządzaj postami"/>
      <h1>Zarządzaj postami</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(firestore, `users/${uid}/posts/${slug}`);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);
    toast.success('Post utworzony!')

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);

  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tytuł posta..."
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Dodaj nowy post
      </button>
    </form>
  );
}