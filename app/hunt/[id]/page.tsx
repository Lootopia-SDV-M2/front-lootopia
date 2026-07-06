import { notFound } from "next/navigation";
import { HuntDetailClient } from "@/components/hunt";
import { getHuntById } from "@/lib/data/mock-hunts";
import type { Metadata } from "next";

interface HuntPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: HuntPageProps): Promise<Metadata> {
  const { id } = await params;
  const hunt = getHuntById(id);

  if (!hunt) {
    return {
      title: "Chasse introuvable | Lootopia",
    };
  }

  return {
    title: `${hunt.title} | Lootopia`,
    description: hunt.description,
  };
}

export default async function HuntPage({ params }: HuntPageProps) {
  const { id } = await params;
  const hunt = getHuntById(id);

  if (!hunt) {
    notFound();
  }

  return <HuntDetailClient huntId={id} />;
}
