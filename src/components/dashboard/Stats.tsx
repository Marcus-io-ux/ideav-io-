interface StatsProps {
  totalIdeas: number;
  favoritesCount: number;
  currentStreak: number;
}

export const Stats = ({ totalIdeas, favoritesCount, currentStreak }: StatsProps) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-3">Quick Stats</h3>
      <div className="flex justify-between items-center space-x-4">
        <div>
          <p className="text-xl font-bold">{totalIdeas}</p>
          <p className="text-sm text-gray-500">Total Ideas</p>
        </div>
        <div>
          <p className="text-xl font-bold">{favoritesCount}</p>
          <p className="text-sm text-gray-500">Favorites</p>
        </div>
        <div>
          <p className="text-xl font-bold">{currentStreak}</p>
          <p className="text-sm text-gray-500">Day Streak</p>
        </div>
      </div>
    </div>
  );
};