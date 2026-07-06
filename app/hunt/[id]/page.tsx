import { HuntDetailClient } from "@/components/hunt";
import type { Metadata } from "next";

interface HuntPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: HuntPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chasse #${id} | Lootopia`,
  };
}

export default async function HuntPage({ params }: HuntPageProps) {
  const { id } = await params;
  return <HuntDetailClient huntId={id} />;
}
