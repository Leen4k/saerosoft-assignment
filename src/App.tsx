import { BrowserHistoryComponent } from "./components/week1/BrowserHistoryComponent";
import { ImageCarouselComponent } from "./components/week1/ImageCarouselComponent";
import { LRUCacheComponent } from "./components/week1/LRUCacheComponent";
import { ActivityFeedComponent } from "./components/week1/ActivityFeedComponent";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Week1Assignments from "./components/week1/Week1Assignments";
import "./App.css";
import Week2Assignment from "./components/week2/Week2Assignment";
import NestedModalStack from "./components/week2/NestedModalStack";
import UndoRedoTextEditor from "./components/week2/UndoRedoTextEditor";
import BrowserNavigationHistory from "./components/week2/BrowserNavigationHistory";
import Week3Assignment from "./components/week3/Week3Assignment";
import AiChat from "./components/week3/AiChatQueue";
import Download from "./components/week3/Downloadqueue";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-gray-800 p-4 ">
          <ul className="flex space-x-4 justify-center text-white nav-container">
            <li>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/week1-assignments" className="hover:text-gray-300">
                Week 1 Assignments
              </Link>
            </li>
            <li>
              <Link to="/week2-assignments" className="hover:text-gray-300">
                Week 2 Assignments
              </Link>
            </li>
            <li>
              <Link to="/week3-assignments" className="hover:text-gray-300">
                Week 3 Assignments
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/week1-assignments" element={<Week1Assignments />} />
            <Route
              path="/week1-assignments/browser-history"
              element={<BrowserHistoryComponent />}
            />
            <Route
              path="/week1-assignments/image-carousel"
              element={<ImageCarouselComponent />}
            />
            <Route
              path="/week1-assignments/lru-cache"
              element={<LRUCacheComponent />}
            />
            <Route
              path="/week1-assignments/activity-feed"
              element={<ActivityFeedComponent />}
            />
            {/* week 2 */}
            <Route path="/week2-assignments" element={<Week2Assignment />} />
            <Route
              path="/week2-assignments/undo-redo-text-editor"
              element={<UndoRedoTextEditor />}
            />
            <Route
              path="/week2-assignments/browser-navigation-history"
              element={<BrowserNavigationHistory />}
            />
            <Route
              path="/week2-assignments/nested-modal-stack"
              element={<NestedModalStack />}
            />
            {/* week 3 */}
            <Route path="/week3-assignments" element={<Week3Assignment />} />
            <Route path="/week3-assignments/ai-chat" element={<AiChat />} />
            <Route path="/week3-assignments/download" element={<Download />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
