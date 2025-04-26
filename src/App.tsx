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
import Week4Assignment from "./components/week4/Week4Assignment";
import FileIntegrityCheck from "./components/week4/FileIntegrityCheck";
import UrlShortener from "./components/week4/UrlShortener";
import FileTree from "./components/week6/FileTree";
import ReactDomTree from "./components/week6/ReactDomTree";
import Week6Assignment from "./components/week6/Week6Assignment";
import TreeInsertionAndDeletion from "./components/week8/TreeInsertionAndDeletion";
import Week8Assignment from "./components/week8/Week8Assignment";
import Week9Assignment from "./components/week9/Week9Assignment";
import DictionaryImplementationWithTrie from "./components/week9/DictionaryImplementationWithTrie";
import Week11Assignment from "./components/week11/Week11Assignment";
import NetworkOptimization from "./components/week11/NetworkOptimization";
import TaskScheduler from "./components/week11/TaskScheduler";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-gray-800 p-4 ">
          <ul className="grid grid-cols-4 justify-center text-white">
            {/* <li>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
            </li> */}
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
            <li>
              <Link to="/week4-assignments" className="hover:text-gray-300">
                Week 4 Assignments
              </Link>
            </li>
            <li>
              <Link to="/week6-assignments" className="hover:text-gray-300">
                Week 6 Assignments
              </Link>
            </li>
            <li>
              <Link to="/week8-assignments" className="hover:text-gray-300">
                Week 8 Assignments
              </Link>
            </li>
            <li>
              <Link to="/week9-assignments" className="hover:text-gray-300">
                Week 9 Assignments
              </Link>
            </li>
            <li>
              <Link to="/week11-assignments" className="hover:text-gray-300">
                Week 11 Assignments
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

            {/* week4 */}
            <Route path="/week4-assignments" element={<Week4Assignment />} />
            <Route
              path="/week4-assignments/file-integrity"
              element={<FileIntegrityCheck />}
            />
            <Route
              path="/week4-assignments/url-shortener"
              element={<UrlShortener />}
            />
            {/* week 5 */}
            {/* week 6 */}
            <Route path="/week6-assignments" element={<Week6Assignment />} />
            <Route
              path="/week6-assignments/file-system-directory"
              element={<FileTree />}
            />
            <Route
              path="/week6-assignments/react-dom-tree"
              element={<ReactDomTree />}
            />
            {/* week 7 */}
            {/* week 8 */}
            <Route path="/week8-assignments" element={<Week8Assignment />} />
            <Route
              path="/week8-assignments/tree-insertion-deletion"
              element={<TreeInsertionAndDeletion />}
            />
            {/* week 9 */}
            <Route path="/week9-assignments" element={<Week9Assignment />} />
            <Route
              path="/week9-assignments/dictionary-implementation-with-trie"
              element={<DictionaryImplementationWithTrie />}
            />
            {/* week 11 */}
            <Route path="/week11-assignments" element={<Week11Assignment />} />
            <Route
              path="/week11-assignments/network-optimization"
              element={<NetworkOptimization />}
            />
            <Route
              path="/week11-assignments/task-scheduler"
              element={<TaskScheduler />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
