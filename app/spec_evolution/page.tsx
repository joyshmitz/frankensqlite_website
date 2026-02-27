import type { Metadata } from "next";
import ViewerLoader from "@/components/spec-evolution/viewer-loader";

export const metadata: Metadata = {
  title: "Spec Evolution Lab",
  description:
    "Explore the evolution of the FrankenSQLite specification document from inception: every commit, every change, every category visualized.",
};

export default function SpecEvolutionPage() {
  return <ViewerLoader />;
}
