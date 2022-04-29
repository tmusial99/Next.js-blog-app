import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, collectionGroup, doc, getDoc, getDocs } from 'firebase/firestore';
import Metatags from '../../components/Metatags';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton'
import Link from 'next/link';


export async function getStaticProps({ params }) {
  const { username, slug } = params;

  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc( collection(userDoc.ref, 'posts'), slug );
    const postDoc = await getDoc(postRef);

    post = postToJSON(postDoc);
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await getDocs( collectionGroup(firestore, 'posts') );

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <>
      <Metatags
        title={`Next.js Blog - ${post.title}`}
      />
      <main className={styles.container}>

        <section>
          <PostContent post={post} />
        </section>

        <aside className="card">
          <p>
            <strong>{post.heartCount || 0} 💗</strong>
          </p>
          <AuthCheck
            fallback={
              <Link href="/enter">
                <button>💗 Zaloguj się</button>
              </Link>
            }
          >
            <HeartButton postRef={postRef} />
          </AuthCheck>

        </aside>
      </main>
    </>
    
  );
}