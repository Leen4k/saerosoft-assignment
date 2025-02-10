import { BrowserHistoryComponent } from "./components/BrowserHistoryComponent";
import { ImageCarouselComponent } from "./components/ImageCarouselComponent";
import { LRUCacheComponent } from "./components/LRUCacheComponent";
import { ActivityFeedComponent } from "./components/ActivityFeedComponent";

const App = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center mb-8">Assignment Demo</h1>
      <BrowserHistoryComponent />
      <ImageCarouselComponent />
      <LRUCacheComponent />
      <ActivityFeedComponent />
    </div>
  );
};

export default App;
