import { TrendingDown, Users, MapPin } from 'lucide-react';

interface StatsCardProps {
  totalReports: number;
  activeUsers: number;
  locations: number;
}

export const StatsCard = ({ totalReports, activeUsers, locations }: StatsCardProps) => {
  const stats = [
    {
      label: 'Price Reports',
      value: totalReports.toLocaleString(),
      icon: TrendingDown,
      color: 'blue',
    },
    {
      label: 'Active Users',
      value: activeUsers.toLocaleString(),
      icon: Users,
      color: 'green',
    },
    {
      label: 'Locations',
      value: locations.toLocaleString(),
      icon: MapPin,
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'bg-blue-50 text-blue-600',
          green: 'bg-green-50 text-green-600',
          purple: 'bg-purple-50 text-purple-600',
        }[stat.color];

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className={`w-10 h-10 rounded-lg ${colorClasses} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};
