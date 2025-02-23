import React from "react";
import AssignmentList from "../AssignmentList";

const Week3Assignment = () => {
  const assignments = [
    {
      title: "Ai Chat",
      path: "/week3-assignments/ai-chat",
    },
    {
      title: "Download",
      path: "/week3-assignments/download",
    },
  ];

  return (
    <AssignmentList title="Week 3 Assignments" assignments={assignments} />
  );
};

export default Week3Assignment;
