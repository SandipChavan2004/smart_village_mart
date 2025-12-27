interface AnalyticsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    trendLabel?: string;
    prefix?: string;
    suffix?: string;
}

export default function AnalyticsCard({
    title,
    value,
    icon,
    trend,
    trendLabel,
    prefix = '',
    suffix = ''
}: AnalyticsCardProps) {
    const isPositiveTrend = trend !== undefined && trend >= 0;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </h3>

                    {trend !== undefined && (
                        <div className="flex items-center mt-2 space-x-1">
                            {isPositiveTrend ? (
                                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className={`text-sm font-medium ${isPositiveTrend ? 'text-emerald-600' : 'text-red-600'}`}>
                                {Math.abs(trend).toFixed(1)}%
                            </span>
                            {trendLabel && (
                                <span className="text-sm text-gray-500">{trendLabel}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="ml-4 p-3 bg-emerald-50 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );
}
