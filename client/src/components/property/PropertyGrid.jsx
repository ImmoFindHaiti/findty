import PropertyCard from './PropertyCard';

export default function PropertyGrid({ biens, favoritedIds, onToggleFav }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {biens?.map(bien => (
        <PropertyCard
          key={bien.id}
          bien={bien}
          isFavorited={favoritedIds?.has(bien.annonce?.id) || false}
          onToggleFav={onToggleFav}
        />
      ))}
    </div>
  );
}
