import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": false,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": true,
          "hotlist": false,
          "interval": "240",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "TVC:GOLD",
          "theme": "light",
          "timezone": "Asia/Dhaka",
          "backgroundColor": "rgba(255, 255, 255, 1)",
          "gridColor": "rgba(255, 255, 255, 0.06)",
          "watchlist": [
            "TVC:XAUBTC",
            "OANDA:XAUEUR",
            "OANDA:XAUGBP",
            "OANDA:XAUJPY",
            "OANDA:XAUAUD"
          ],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [
            "STD;MA%Ribbon"
          ],
          "autosize": true
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);