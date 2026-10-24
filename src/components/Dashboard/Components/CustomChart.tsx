import React, { useEffect, useRef, useState } from 'react';
import {
    createChart,
    ColorType,
    IChartApi,
    CrosshairMode,
    ISeriesApi,
    LineStyle,
    UTCTimestamp,
    // v5 Imports:
    CandlestickSeries,
    HistogramSeries
} from 'lightweight-charts';

// --- Types ---
export interface Candle {
    time: number; // Unix timestamp in milliseconds
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface ChartProps {
    data: Candle[];
    lastPrice: number;
}

export function TradingChart({ data, lastPrice }: ChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    // Note: In v5, generic type arguments for ISeriesApi might differ slightly, 
    // but 'any' or specific generic usage fixes strict typing issues for refs.
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);


    const [legend, setLegend] = useState<Candle | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1. Create Chart Instance
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#0B0E11' },
                textColor: '#64748b',
                fontFamily: "'Roboto', sans-serif",
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    width: 1,
                    color: 'rgba(255, 255, 255, 0.2)',
                    style: LineStyle.Dashed,
                    labelBackgroundColor: '#1e293b',
                },
                horzLine: {
                    width: 1,
                    color: 'rgba(255, 255, 255, 0.2)',
                    style: LineStyle.Dashed,
                    labelBackgroundColor: '#1e293b',
                },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
        });

        chartRef.current = chart;

        // 2. Add Volume Series (Histogram) - v5 Syntax
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: { type: 'volume' },
            priceScaleId: '', // Overlay mode
        });

        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.85, bottom: 0 },
        });

        // 3. Add Candlestick Series (Main) - v5 Syntax
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10B981',
            downColor: '#EF4444',
            borderVisible: false,
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });
        candleSeriesRef.current = candleSeries;

        // 4. Format Data
        const formattedData = data.map(d => ({
            time: (d.time / 1000) as UTCTimestamp,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        }));

        const volumeData = data.map(d => ({
            time: (d.time / 1000) as UTCTimestamp,
            value: d.volume,
            color: d.close >= d.open ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
        }));

        candleSeries.setData(formattedData);
        volumeSeries.setData(volumeData);

        // 5. Add "Live Price" Line
        candleSeries.createPriceLine({
            price: lastPrice,
            color: '#3b82f6',
            lineWidth: 1,
            lineStyle: LineStyle.Dotted,
            axisLabelVisible: true,
            title: 'CURRENT',
        });

        // 6. Crosshair Handler
        chart.subscribeCrosshairMove((param) => {
            if (param.time) {
                // In v5, getting data is slightly different, but .get(series) usually works if series matches
                const data = param.seriesData.get(candleSeries) as any;
                if (data) setLegend(data);
            } else {
                setLegend(data[data.length - 1]);
            }
        });

        setLegend(data[data.length - 1]);

        // 7. Handle Resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, lastPrice]);

    return (
        <div className="flex flex-col h-full bg-[#0B0E11] rounded-xl border border-white/5 overflow-hidden shadow-2xl">



            {/* Chart Area */}
            <div className="flex-1 relative w-full h-full group">

                {/* Floating Legend */}
                <div className="absolute top-3 left-4 z-20 pointer-events-none font-mono text-xs">
                    <div className="flex items-center gap-4 bg-[#0B0E11]/80 backdrop-blur-sm p-2 rounded-lg border border-white/5 shadow-lg">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Symbol</span>
                            <span className="font-bold text-white text-sm">BTC/USD</span>
                        </div>
                        {legend && (
                            <>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500">Open</span>
                                    <span className={legend.close >= legend.open ? 'text-emerald-400' : 'text-red-400'}>
                                        {legend.open?.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500">High</span>
                                    <span className="text-slate-200">{legend.high?.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500">Low</span>
                                    <span className="text-slate-200">{legend.low?.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500">Close</span>
                                    <span className={legend.close >= legend.open ? 'text-emerald-400' : 'text-red-400'}>
                                        {legend.close?.toFixed(2)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div ref={chartContainerRef} className="w-full h-full" />

                {/* Live Tag */}
                <div className="absolute top-3 right-16 flex items-center gap-2 pointer-events-none">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 tracking-wider">LIVE</span>
                </div>

            </div>
        </div>
    );
}

export default TradingChart;