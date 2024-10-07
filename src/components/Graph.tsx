import { FC, useState, useEffect, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import url from "@/lib/url";


import axios from 'axios';
import BuyDialog from "./BuyDialog";
import { Link } from "react-router-dom";

export const fetchStockData = async (ticker: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/stock_data/${ticker}`, {
        headers : {
            Authorization: `${token}`,
        }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

interface InteractiveStockChartProps {
  ticker: string;
}

const chartConfig = {
  priceData: {
    label: "Price Data",
  },
  high: {
    label: "High",
    color: "hsl(var(--chart-3))",
  },
  close: {
    label: "Close",
    color: "hsl(var(--chart-2))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const InteractiveStockChart: FC<InteractiveStockChartProps> = ({
  ticker,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchStockData(ticker);
        setChartData(data);
      } catch (err) {
        setError("Failed to fetch stock data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ticker]);

  const formattedData = useMemo(
    () =>
      chartData
        .map((item) => ({
          ...item,
          dateTime: new Date(item.date).getTime(),
        }))
        .filter((item) => !isNaN(item.dateTime))
        .sort((a, b) => a.dateTime - b.dateTime),
    [chartData]
  );

  const minValue = useMemo(
    () =>
      Math.min(...formattedData.map((item) => Math.min(item.open, item.close))),
    [formattedData]
  );
  const maxValue = useMemo(
    () =>
      Math.max(...formattedData.map((item) => Math.max(item.open, item.close))),
    [formattedData]
  );

  const percentageChange = useMemo(() => {
    if (formattedData.length === 0) return 0;

    const currentDate = new Date().getTime();
    const thirtyDaysAgo = currentDate - 30 * 24 * 60 * 60 * 1000;

    const recentData = formattedData.filter(
      (item) => item.dateTime >= thirtyDaysAgo
    );

    if (recentData.length === 0) return 0;

    const firstValue = recentData[0].close;
    const lastValue = recentData[recentData.length - 1].close;

    return ((lastValue - firstValue) / firstValue) * 100;
  }, [formattedData]);

  const isTrendingUp = percentageChange > 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 justify-between items-center px-10 sm:py-6'>
          <CardTitle>
            <Link to={`/info/${ticker}`} className="underline">
            {ticker}
            </Link>
            </CardTitle>
          <BuyDialog stock={ticker} />
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <div className='aspect-auto h-[400px] w-full'>
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[400px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={formattedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value:any) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  domain={[minValue * 0.9, maxValue * 1.1]}
                  tickFormatter={(value:any) => `$${value.toFixed(2)}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className='w-[150px]'
                      labelFormatter={(value:any) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Line
                  type='monotone'
                  dataKey='high'
                  stroke={chartConfig.high.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='close'
                  stroke={chartConfig.close.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='low'
                  stroke={chartConfig.low.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='font-medium leading-none'>
          {isTrendingUp ? (
            <>
              Trending up by{" "}
              <span className='text-[#2DB78A]'>
                {percentageChange.toFixed(2)}%{" "}
              </span>{" "}
              this month{" "}
              {/* <TrendingUp className='inline text-[#2DB78A] h-4 w-4' /> */}
            </>
          ) : (
            <>
              Trending down by{" "}
              <span className='text-[#E2366F]'>
                {percentageChange.toFixed(2)}%{" "}
              </span>{" "}
              this month{" "}
              {/* <TrendingDown className='inline text-[#E2366F] h-4 w-4' /> */}
            </>
          )}
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing stock data for the last 3 months
        </div>
      </CardFooter>
    </Card>
  );
};