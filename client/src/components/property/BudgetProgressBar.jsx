export default function BudgetProgressBar({ prix, budget }) {
  if (!budget || budget <= 0) return null;
  const ratio = prix / budget;
  const pct = Math.min(ratio * 100, 120);

  const couleur =
    ratio <= 0.80 ? '#22c55e' :
    ratio <= 1.00 ? '#f97316' :
                    '#ef4444';

  const label =
    ratio <= 0.80 ? `${Math.round(ratio * 100)}% de ton budget` :
    ratio <= 1.00 ? `Presque ton budget max` :
                    `+${Math.round((ratio - 1) * 100)}% au-dessus`;

  const bgColor =
    ratio <= 0.80 ? 'bg-green-500' :
    ratio <= 1.00 ? 'bg-orange-500' :
                    'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium" style={{ color: couleur }}>{label}</span>
        <span className="text-xs font-semibold text-gray-700">
          {prix.toLocaleString()} HTG
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${bgColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
