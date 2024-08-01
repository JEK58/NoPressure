import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="mb-2 p-2 text-xs  text-slate-200">
      <div className="mb-2 flex items-center justify-center gap-2">
        <a
          href="https://github.com/JEK58/NoPressure"
          className="flex items-center decoration-dotted hover:underline"
        >
          <FaGithub className="mr-1" />
          Made with ❤️ by Stephan Schöpe
        </a>
        <span>|</span>
        <Link href="/imprint" className="decoration-dotted hover:underline">
          Imprint & Privacy
        </Link>
      </div>
    </footer>
  );
}
