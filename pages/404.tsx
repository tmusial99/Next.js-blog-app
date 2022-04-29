import Link from 'next/link';

export default function Custom404() {
  return (
    <main>
      <img
        src="https://i.pinimg.com/originals/fd/7e/e5/fd7ee52e87cfc86b89371f0749e817d9.gif"
      ></img>
      <h1>Nie znaleziono strony.</h1>
      <Link href="/">
        <button className="btn-blue">Strona główna</button>
      </Link>
    </main>
  );
}