import { LucideIcon } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  url: string;
  theme: 'blue' | 'gradient';
  tooltip?: string;
}

export const ResourceCard = ({
  title,
  description,
  icon: Icon,
  url,
  theme,
  tooltip,
}: ResourceCardProps) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const themeClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150',
    gradient:
      'bg-gradient-to-br from-blue-50 via-purple-50 to-red-50 border-purple-200 hover:shadow-lg',
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left rounded-2xl shadow-sm p-6 border transition-all duration-300 ${themeClasses[theme]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={theme === 'blue' ? 'text-blue-600' : 'bg-gradient-to-br from-blue-600 to-red-600 text-transparent bg-clip-text'}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          {description && (
            <p className="text-sm font-semibold text-gray-800 mb-2">{description}</p>
          )}
          {tooltip && (
            <p className="text-xs text-gray-600 italic">{tooltip}</p>
          )}
        </div>
      </div>
    </button>
  );
};
