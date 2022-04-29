import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import ImageUploader from '../../components/ImageUploader';
import Metatags from '../../components/Metatags';

export default function AdminPostEdit(props) {
  return (
    <>
      <AuthCheck redirectAfterLogin={true}>
          <PostManager />
      </AuthCheck>
    </>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;
  
  const postRef = doc(firestore, `users/${auth.currentUser.uid}/posts/${slug}`);
  const [post] = useDocumentData(postRef);
  
  return (
    <>
      <main className={styles.container}>
      {post && (
        <>
          <Metatags title={`Next.js Blog - Edycja - ${post.title}`}/>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
          <h3>Narzędzia</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edycja' : 'Podgląd'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Widok na żywo</button>
            </Link>
          </aside>
        </>
      )}
      </main>
    </>
    
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState: {errors, isDirty, isValid} } = useForm({ defaultValues, mode: 'onChange' });

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post zaktualizowany pomyślnie!')
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader/>
        <textarea {...register('content', {
             maxLength: { value: 20000, message: 'Treść jest za długa.' },
             minLength: { value: 10, message: 'Treść jest za krótka.' },
             required: { value: true, message: 'Treść jest wymagana.'}
          })}>
        </textarea>
        {errors.content && <p className="text-danger">{errors.content.message}</p>}
        <fieldset>
          {/* @ts-ignore */}
          <input className={styles.checkbox} type="checkbox" {...register('published')}/>
          <label>Opublikowane</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Zapisz zmiany
        </button>
      </div>
    </form>
  );
}