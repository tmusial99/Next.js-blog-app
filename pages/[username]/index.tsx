import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import Metatags from '../../components/Metatags';

export async function getServerSideProps(context) {
  const { username } = context.params;

  const userDoc = await getUserWithUsername(username);

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = query(
      collection(userDoc.ref, 'posts'), 
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON)
  }
  else{
    return {
      notFound: true
    }
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <Metatags title={`Next.js Blog - @${user.username}`}/>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={undefined} />
    </main>
  );
}