interface StatsProps {
  totalIdeas: number;
  favoritesCount: number;
}

export const Stats = ({ totalIdeas, favoritesCount }: StatsProps) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-3">Quick Stats</h3>
      <div className="flex justify-center items-center space-x-12">
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