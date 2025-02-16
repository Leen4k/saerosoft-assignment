import React from "react";
import AssignmentList from "../AssignmentList";

const Week1Assignments = () => {
  const assignments = [
    { title: "Browser History", path: "/week1-assignments/browser-history" },
    { title: "Image Carousel", path: "/week1-assignments/image-carousel" },
    { title: "LRU Cache", path: "/week1-assignments/lru-cache" },
    { title: "Activity Feed", path: "/week1-assignments/activity-feed" },
  ];

  return (
    <AssignmentList title="Week 1 Assignments" assignments={assignments} />
  );
};

export default Week1Assignments;
