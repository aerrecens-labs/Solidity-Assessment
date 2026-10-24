import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
    symbol?: string;
    theme?: 'light' | 'dark';
    autosize?: boolean;
    interval?: string;
}

function TradingViewWidget({ symbol = "BINANCE:BTCUSDT", theme = "dark", autosize = true, interval = "D" }: TradingViewWidgetProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            if (!container.current) return;

            // Re-create the widget container structure to valid "nuke and pave" re-rendering
            // This ensures the element that the script looks for (.tradingview-widget-container__widget) exists.
            container.current.innerHTML = `
        <div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div>
      `;

            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = JSON.stringify({
                "autosize": autosize,
                "symbol": symbol,
                "interval": interval,
                "timezone": "Etc/UTC",
                "theme": theme,
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "hide_top_toolbar": true,
                "allow_symbol_change": false,
                "support_host": "https://www.tradingview.com",
                "hide_side_toolbar": false,
                "withdateranges": true,
                "save_image": false,
                "disabled_features": [
                    "header_widget",
                    "left_toolbar",
                    "timeframes_toolbar",
                    "edit_buttons_in_legend",
                    "context_menus",
                    "control_bar",
                    "border_around_the_chart",
                    "legend_context_menu",
                    "display_market_status",
                    "symbol_info",
                    "volume_force_overlay"
                ],
                "overrides": {
                    "paneProperties.legendProperties.showLegend": false,
                    "paneProperties.legendProperties.showStudyArguments": false,
                    "paneProperties.legendProperties.showStudyTitles": false,
                    "paneProperties.legendProperties.showStudyValues": false,
                    "paneProperties.legendProperties.showSeriesTitle": false,
                    "paneProperties.legendProperties.showSeriesOHLC": false,
                    "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
                    "mainSeriesProperties.candleStyle.wickDownColor": "#7f323f"
                },
                "hide_legend": true,
                "studies": [],
                "show_popup_button": true,
                "popup_width": "1000",
                "popup_height": "650"
            });

            script.onerror = () => {
                console.error("TradingView script failed to load.");
                if (container.current) {
                    container.current.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748b;font-size:12px;">Chart Unavailable</div>`;
                }
            };

            container.current.appendChild(script);

            return () => {
                if (container.current) {
                    container.current.innerHTML = '';
                }
            };
        },
        [symbol, theme, autosize, interval]
    );

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }} />
    );
}

export default memo(TradingViewWidget);
