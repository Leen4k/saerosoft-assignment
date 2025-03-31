import AssignmentList from "../AssignmentList";

const Week8Assignment = () => {
  const assignments = [
    {
      title: "tree insertion and deletion",
      path: "/week8-assignments/tree-insertion-deletion",
    },
  ];

  return (
    <AssignmentList title="Week 8 Assignments" assignments={assignments} />
  );
};

export default Week8Assignment;
