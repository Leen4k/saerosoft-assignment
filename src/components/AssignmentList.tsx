import React from "react";
import { Link } from "react-router-dom";

interface Assignment {
  title: string;
  path: string;
}

interface AssignmentListProps {
  title: string;
  assignments: Assignment[];
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  title,
  assignments,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <ul className="space-y-2">
        {assignments.map((assignment) => (
          <li key={assignment.path}>
            <Link to={assignment.path} className="hover:text-blue-500">
              {assignment.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;
