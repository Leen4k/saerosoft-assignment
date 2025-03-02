import React from "react";
import AssignmentList from "../AssignmentList";

const Week4Assignment = () => {
  const assignments = [
    {
      title: "File Integrity",
      path: "/week4-assignments/file-integrity",
    },
    {
      title: "Url Shortener",
      path: "/week4-assignments/url-shortener",
    },
  ];

  return (
    <AssignmentList title="Week 4 Assignments" assignments={assignments} />
  );
};

export default Week4Assignment;
