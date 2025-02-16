import { useState } from "react";
import { ActivityFeed } from "../../lib/ActivityFeed";

export const ActivityFeedComponent = () => {
  const [feed] = useState(() => new ActivityFeed());
  const [activities, setActivities] = useState<string[]>([]);

  const addActivity = () => {
    const activity = `Activity ${Math.floor(Math.random() * 100)}`;
    feed.addActivity(activity);
    setActivities(feed.showActivities());
  };

  const deleteActivity = (index: number) => {
    feed.deleteActivity(index);
    setActivities(feed.showActivities());
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
      <button
        onClick={addActivity}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Add Activity
      </button>
      <ul className="space-y-2">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-50 p-2 rounded"
          >
            <span>{activity}</span>
            <button
              onClick={() => deleteActivity(index)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
