import Link from "next/link";

export default function Home() {
  return (
    <div>
      <ol>
        <li>
          <Link
            href="https://cautious-muscari-7d9.notion.site/Three-js-8a9f54923dfa4b079a12a619ac4a9fbd?pvs=4"
            target="_blank"
            rel="noopener noreferrer"
          >
            study-log
          </Link>
        </li>
        <li>
          <Link href="/lessons/first-threejs-project">
            lessons/first-threejs-project
          </Link>
        </li>
        <li>
          <Link href="/lessons/transform">lessons/transform</Link>
        </li>
        <li>
          <Link href="/lessons/animation">lessons/animation</Link>
        </li>
        <li>
          <Link href="/lessons/camera">lessons/camera</Link>
        </li>
        <li>
          <Link href="/lessons/camera-cursor">lessons/camera-cursor</Link>
        </li>
        <li>
          <Link href="/lessons/camera-orbit-controls">
            lessons/camera-orbit-controls
          </Link>
        </li>
        <li>
          <Link href="/lessons/resize">lessons/resize</Link>
        </li>
        <li>
          <Link href="/lessons/vector-class">lessons/vector-class</Link>
        </li>
        <li>
          <Link href="/lessons/vector-class-basis">lessons/vector-class-basis</Link>
        </li>
      </ol>
    </div>
  );
}
