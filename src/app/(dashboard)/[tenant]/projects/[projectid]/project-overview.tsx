import React from "react";
import { ProjectResponse } from "@src/lib/response-types";

type ProjectOverviewProps = {
	project: ProjectResponse;
};

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
	return (
		<div>
			<h2>Project Overview</h2>
			<p>{project.name}</p>
			<p>{project.description}</p>
		</div>
	);
};

export default ProjectOverview;
