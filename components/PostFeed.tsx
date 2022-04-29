import Link from 'next/link';

export default function PostFeed({ posts, admin }) {
  return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = Math.round( (wordCount / 100 + 1) );

  const toPolishString = () => {
    let polishWords;
    let polishRead;

    switch(true){
      case wordCount === 1:
        polishWords = 'słowo'
        break;
      case wordCount>1 && wordCount<5:
        polishWords = 'słowa'
        break;
      case wordCount>4:
        polishWords = 'słów'
        break;
      
      
    }

    switch(true){
      case minutesToRead === 1:
        polishRead = 'minuta'
        break;
      case minutesToRead>1 && minutesToRead<5:
        polishRead = 'minuty'
        break;
      case minutesToRead>4:
        polishRead = 'minut'
        break;
    }
    
    return `${wordCount} ${polishWords}, ${minutesToRead} ${polishRead} czytania.`
  }

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>@{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {toPolishString()}
        </span>
        <span className="push-left">💗 {post.heartCount || 0}</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edytuj</button>
            </h3>
          </Link>

          {post.published ? <p className="text-success">Opublikowany</p> : <p className="text-danger">Nieopublikowany</p>}
        </>
      )}
    </div>
  );
}