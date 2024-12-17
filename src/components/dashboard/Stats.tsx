interface StatsProps {
  totalIdeas: number;
  favoritesCount: number;
}

export const Stats = ({ totalIdeas, favoritesCount }: StatsProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4">
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