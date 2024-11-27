import Link from "next/link";

export default function Home() {
  const lessonList = [
    "first-threejs-project",
    "transform",
    "animation",
    "camera",
    "camera-cursor",
    "camera-orbit-controls",
    "resizing",
    "vector-class",
    "vector-class-basis",
    "vector-class-basis-second",
    "vector-class-basis-applyMatrix",
    "vector-class-basis-rotate",
    "textures",
    "uv-textures",
    "textures-options",
    "material",
    "3d-text",
    "geometry",
    "light",
    "shadow",
    "haunted-house",
    "galaxy-generator",
    "galaxy-generator-extend",
  ];

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
        {lessonList.map((title, i) => {
          return (
            <li key={i}>
              <Link href={`/lessons/${title}`}>lessons/{title}</Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
