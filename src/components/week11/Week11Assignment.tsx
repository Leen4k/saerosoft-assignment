import AssignmentList from "../AssignmentList";

const Week11Assignment = () => {
  const assignments = [
    {
      title: "network optimization",
      path: "/week11-assignments/network-optimization",
    },
    {
      title: "task scheduler",
      path: "/week11-assignments/task-scheduler",
    },
  ];

  return (
    <AssignmentList title="Week 11 Assignments" assignments={assignments} />
  );
};

export default Week11Assignment;
