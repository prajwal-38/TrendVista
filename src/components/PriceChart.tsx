
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PricePoint } from '@/services/marketData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

interface PriceChartProps {
  data: PricePoint[];
  title?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, title = "Price History" }) => {
  const [timeRange, setTimeRange] = useState('all');
  
  const getFilteredData = () => {
    if (timeRange === 'all' || data.length === 0) return data;
    
    const now = Date.now();
    let timeOffset: number;
    
    switch (timeRange) {
      case '1d':
        timeOffset = 24 * 60 * 60 * 1000; // 1 day in ms
        break;
      case '1w':
        timeOffset = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
        break;
      case '1m':
        timeOffset = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
        break;
      default:
        return data;
    }
    
    const cutoffTime = now - timeOffset;
    return data.filter(point => point.time >= cutoffTime);
  };
  
  // Format timestamp for tooltip
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatYAxis = (value: number) => {
    return `${(value * 100).toFixed(0)}¢`;
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border shadow-lg p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">{formatTime(label)}</p>
          <p className="text-sm font-medium">
            Price: <span className="text-primary">{(payload[0].value * 100).toFixed(1)}¢</span>
          </p>
          {payload[0].payload.volume && (
            <p className="text-sm">
              Volume: <span className="text-muted-foreground">${payload[0].payload.volume.toLocaleString()}</span>
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  const filteredData = getFilteredData();

  const avgPrice = filteredData.length > 0 
    ? filteredData.reduce((sum, point) => sum + point.price, 0) / filteredData.length 
    : 0.5;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Tabs defaultValue="all" value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3772FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3772FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="time" 
                type="number"
                scale="time"
                domain={['auto', 'auto']}
                tickFormatter={(time) => new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#666"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 1]} 
                tickFormatter={formatYAxis} 
                stroke="#666"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={avgPrice} 
                stroke="#666" 
                strokeDasharray="3 3" 
                label={{ 
                  value: `Avg: ${(avgPrice * 100).toFixed(0)}¢`, 
                  position: 'right',
                  fill: '#666',
                  fontSize: 10
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#3772FF" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                activeDot={{ r: 6, fill: "#3772FF", stroke: "#fff" }}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={2500}
                animationEasing="ease"
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
