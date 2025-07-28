"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface SimpleChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  type?: 'bar' | 'pie';
}

export function SimpleChart({ title, description, data, type = 'bar' }: SimpleChartProps) {
  // Handle invalid or empty data
  const validData = data.filter(d => d.value != null && isFinite(d.value));
  const maxValue = validData.length > 0 ? Math.max(...validData.map(d => d.value)) : 0;

  if (type === 'pie') {
    const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
    let cumulativePercentage = 0;

    // Handle case where total is 0 or invalid
    if (total === 0 || !isFinite(total)) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500">No data available</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {data.map((item, index) => {
                  const value = item.value || 0;
                  const percentage = (value / total) * 100;
                  const strokeDasharray = `${percentage * 2.51} ${251 - percentage * 2.51}`;
                  const strokeDashoffset = -cumulativePercentage * 2.51;
                  cumulativePercentage += percentage;

                  // Only render if values are valid
                  if (!isFinite(strokeDashoffset) || !isFinite(percentage)) {
                    return null;
                  }

                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset.toString()}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle case where there's no valid data
  if (validData.length === 0 || maxValue === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {validData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((item.value / maxValue) * 100, 100)}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}