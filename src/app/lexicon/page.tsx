import { getLexicon } from "@/lib/lexicon";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";

export const metadata = {
  title: "Eng Lexicon — Daniel Chung",
  description:
    "A growing glossary of design engineering concepts, explained simply.",
};

export default async function LexiconPage() {
  const lexicon = await getLexicon();

  if (!lexicon) {
    return (
      <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px]">
        <Link href="/">
          <IconButton icon={ArrowLeft} />
        </Link>
        <p className="mt-[60px] text-body-regular text-content-tertiary">
          Lexicon not found.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px]">
      <Link href="/">
        <IconButton icon={ArrowLeft} />
      </Link>

      <div className="mt-[60px]">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: lexicon.html }}
        />
      </div>
    </main>
  );
}
