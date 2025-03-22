import AssignmentList from "../AssignmentList";

const Week6Assignment = () => {
  const assignments = [
    {
      title: "File System Directory Tree",
      path: "/week6-assignments/file-system-directory",
    },
    {
      title: "React Dom tree",
      path: "/week6-assignments/react-dom-tree",
    },
  ];

  return (
    <AssignmentList title="Week 6 Assignments" assignments={assignments} />
  );
};

export default Week6Assignment;
