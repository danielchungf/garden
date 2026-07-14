import type { Metadata } from "next";
import World from "@/components/world/World";

export const metadata: Metadata = {
  title: "World — Daniel Chung",
  description: "A small floating island you can walk around.",
};

export default function WorldPage() {
  return <World />;
}
