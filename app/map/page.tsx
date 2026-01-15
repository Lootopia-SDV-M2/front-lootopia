import DynamicMap from "@/components/map/DynamicMap";

export const metadata = {
  title: "Carte | Lootopia",
  description:
    "Explorez la carte et découvrez les chasses au trésor près de chez vous",
};

export default function MapPage() {
  return (
    <div className="fixed inset-0 pb-20 pt-16 md:pb-4 md:pt-20">
      <div className="h-full w-full px-4 pb-4">
        <DynamicMap className="shadow-2xl" />
      </div>
    </div>
  );
}
