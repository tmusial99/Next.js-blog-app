import moment from 'moment';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();
  const momentDate = moment(createdAt);
  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Napisane przez {' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        dnia {momentDate.format("D.MM.YYYY HH:mm")}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}