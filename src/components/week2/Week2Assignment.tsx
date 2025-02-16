import React from "react";
import AssignmentList from "../AssignmentList";

const Week2Assignment = () => {
  const assignments = [
    {
      title: "Undo Redo Text Editor",
      path: "/week2-assignments/undo-redo-text-editor",
    },
    {
      title: "Browser Navigation History",
      path: "/week2-assignments/browser-navigation-history",
    },
    {
      title: "Nested Modal Stack",
      path: "/week2-assignments/nested-modal-stack",
    },
  ];

  return (
    <AssignmentList title="Week 2 Assignments" assignments={assignments} />
  );
};

export default Week2Assignment;
