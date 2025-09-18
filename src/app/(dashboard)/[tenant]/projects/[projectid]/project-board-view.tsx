import React from "react";
import { ProjectResponse } from "@src/lib/response-types";

type ProjectBoardViewProps = {
	project: ProjectResponse;
};

const ProjectBoardView = ({ project }: ProjectBoardViewProps) => {
	return (
		<div>
			<h2>Project Board View</h2>
			<p>{project.name}</p>
			<p>{project.description}</p>
		</div>
	);
};

export default ProjectBoardView;
