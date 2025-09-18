import React from "react";
import { ProjectResponse } from "@src/lib/response-types";

type ProjectDashboardProps = {
	project: ProjectResponse;
};

const ProjectDashboard = ({ project }: ProjectDashboardProps) => {
	return (
		<div>
			<h2>Project Dashboard</h2>
			<h1>{project.name}</h1>
			<p>{project.description}</p>
		</div>
	);
};

export default ProjectDashboard;
