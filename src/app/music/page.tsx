import { getAllMusic } from "@/lib/music";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { MusicList } from "./MusicList";

export const metadata = {
  title: "Music — Daniel Chung",
  description: "Monthly recaps of my top Spotify tracks.",
};

export default function MusicPage() {
  const months = getAllMusic();

  return (
    <main className="max-w-[660px] mx-auto px-5 py-[60px] md:py-[80px]">
      <Link href="/">
        <IconButton icon={ArrowLeft} />
      </Link>

      <div className="mt-[60px]">
        <h1 className="text-hero text-content-primary">Music</h1>
        <p className="mt-3 text-body-regular text-content-tertiary">
          A monthly recap of my top listened tracks on Spotify, generated from the Spotify Web API at the end of each month.
        </p>
      </div>

      <div className="mt-14">
        <MusicList months={months} />
      </div>
    </main>
  );
}
