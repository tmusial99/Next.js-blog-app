import { firestore, auth } from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, DocumentData, DocumentReference, increment, writeBatch } from 'firebase/firestore';

// Allows user to heart or like a post
interface IHeart{
    postRef : DocumentReference
}
export default function Heart({ postRef } : IHeart) {
  // Listen to heart document for currently logged in user
 
    const heartRef = auth.currentUser?.uid ? doc(firestore, `${postRef.path}/hearts/${auth.currentUser.uid}`) : null;
    const [heartDoc] = useDocument(heartRef);
    let isHeartDocExists = heartDoc?.exists();
  
    // Create a user-to-post relationship
    const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(firestore);

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
    const removeHeart = async () => {
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
    };

    return isHeartDocExists ? (
        <button onClick={removeHeart}>💔 Nie lubię tego!</button>
    ) : (
        <button onClick={addHeart}>💗 Lubię to!</button>
    );
}