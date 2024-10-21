import { useState } from "react";
import "./App.css";

interface FeedItemConfig {
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  size: number;
}

interface FeedItem {
  id: string;
  title: string;
  config: FeedItemConfig;
}

const Controls = ({
  config,
  setConfig,
}: {
  config: FeedItemConfig;
  setConfig: (config: FeedItemConfig) => void;
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold text-black">Controls</h3>
      <div className="flex items-center gap-2">
        <label htmlFor="color" className="font-medium text-black">Color:</label>
        <input
          id="color"
          type="color"
          value={config.color}
          onChange={(e) => setConfig({ ...config, color: e.target.value })}
          className="h-8 w-8 cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="shape" className="font-medium text-black">Shape:</label>
        <select
          id="shape"
          value={config.shape}
          onChange={(e) => setConfig({ ...config, shape: e.target.value as FeedItemConfig['shape'] })}
          className="p-1 border rounded"
        >
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="size" className="font-medium text-black">Size:</label>
        <input
          id="size"
          type="range"
          min="10"
          max="100"
          value={config.size}
          onChange={(e) => setConfig({ ...config, size: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
};
const FeedItemDisplay = ({ config }: { config: FeedItemConfig }) => {
  const shapeStyles = {
    circle: "rounded-full",
    square: "rounded-none",
    triangle: "clip-path-triangle",
  };

  const triangleStyle = config.shape === 'triangle' ? {
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  } : {};

  return (
    <div
      className={`${shapeStyles[config.shape]} transition-all duration-300`}
      style={{
        backgroundColor: config.color,
        width: `${config.size}px`,
        height: `${config.size}px`,
        ...triangleStyle,
      }}
    />
  );
};
const CreateFeedItem = ({
  createFeedItem,
}: {
  createFeedItem: (title: string, config: FeedItemConfig) => void;
}) => {
  const [config, setConfig] = useState<FeedItemConfig>({
    color: "#ff0000",
    shape: "circle",
    size: 50,
  });
  const [title, setTitle] = useState("");

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Create Feed Item</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 font-medium text-black">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <Controls config={config} setConfig={setConfig} />
      <div className="mt-4 flex justify-center">
        <FeedItemDisplay config={config} />
      </div>
      <button
        onClick={() => createFeedItem(title, config)}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Create Feed Item
      </button>
    </div>
  );
};

const DisplayFeedItem = ({ item }: { item: FeedItem }) => {
  const [favorited, setFavorited] = useState(false);
  const toggleLike = () => setFavorited(!favorited);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mb-4">
      <h3 className="text-xl font-semibold mb-2 text-black">{item.title}</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-black">Created by: Anonymous</span>
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 py-1 px-3 rounded-full transition-colors ${
            favorited ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          {favorited ? "Liked" : "Like"}
        </button>
      </div>
      <div className="flex justify-center">
        <FeedItemDisplay config={item.config} />
      </div>
    </div>
  );
};

const Feed = ({ feedItems }: { feedItems: FeedItem[] }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-black">Feed</h2>
      {feedItems.map((item) => (
        <DisplayFeedItem key={item.id} item={item} />
      ))}
    </div>
  );
};
function App() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  const createFeedItem = (title: string, config: FeedItemConfig) => {
    setFeedItems([...feedItems, { id: Date.now().toString(), title, config }]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-black">Social Art</h1>
      <div className="flex flex-row gap-8 h-[calc(100vh-8rem)]">
        <div className="flex-1 flex justify-center">
          <CreateFeedItem createFeedItem={createFeedItem} />
        </div>
        <div className="flex-1 flex justify-center overflow-y-auto">
          <Feed feedItems={feedItems} />
        </div>
      </div>
    </div>
  );
}

export default App;
