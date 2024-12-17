interface StatsProps {
  totalIdeas: number;
  favoritesCount: number;
}

export const Stats = ({ totalIdeas, favoritesCount }: StatsProps) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm flex gap-4">
      <div>
        <p className="text-lg font-semibold">{totalIdeas}</p>
        <p className="text-xs text-gray-500">Total Ideas</p>
      </div>
      <div>
        <p className="text-lg font-semibold">{favoritesCount}</p>
        <p className="text-xs text-gray-500">Favorites</p>
      </div>
    </div>
  );
};