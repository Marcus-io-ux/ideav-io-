interface StatsProps {
  totalIdeas: number;
  favoritesCount: number;
}

export const Stats = ({ totalIdeas, favoritesCount }: StatsProps) => {
  return (
    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
      <div className="flex items-center space-x-8">
        <div>
          <p className="text-xl font-bold">{totalIdeas}</p>
          <p className="text-sm text-gray-500">Total Ideas</p>
        </div>
        <div>
          <p className="text-xl font-bold">{favoritesCount}</p>
          <p className="text-sm text-gray-500">Favorites</p>
        </div>
      </div>
    </div>
  );
};