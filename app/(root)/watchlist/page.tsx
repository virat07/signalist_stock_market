import { Star } from "lucide-react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import SearchCommand from "@/components/SearchCommand";
import { WatchlistTable } from "@/components/WatchlistTable";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import TradingViewWidget from "@/components/TradingViewWidget";
import { TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants";
import AlertNotification from "@/components/AlertNotification";
import { Button } from "@/components/ui/button";

const Watchlist = async () => {
  const watchlist = await getWatchlistWithData();
  const initialStocks = await searchStocks();
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  // Empty state
  if (watchlist.length === 0) {
    return (
      <section className="flex watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Start building your watchlist by searching for stocks and clicking
            the star icon to add them.
          </p>
        </div>
        <SearchCommand initialStocks={initialStocks} />
      </section>
    );
  }

  return (
    <section className="watchlist">
      <div className="flex flex-col gap-6">
        <div className="grid w-full gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-2 items-center">
          <div className="md:col-span-1 xl:col-span-2 flex items-center justify-between">
            <h2 className="watchlist-title">Watchlist</h2>
            <SearchCommand initialStocks={initialStocks} label="Add Stock" />
          </div>
          <div className="md:col-span-1 xl:col-span-1 flex items-center justify-between">
            <h2 className="watchlist-title">Alerts</h2>
            <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 font-semibold" disabled>
              Create Alert
            </Button>
          </div>
        </div>

        <div className="flex ">
          <section className="grid w-full gap-8 home-section grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <div className="md:col-span-1 xl:col-span-2">
              <WatchlistTable watchlist={watchlist} />
            </div>
            <div className="md:col-span-1 xl:col-span-1">
              <AlertNotification />
            </div>
          </section>
        </div>
        <div className="h-full md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </div>
    </section>
  );
};

export default Watchlist;
