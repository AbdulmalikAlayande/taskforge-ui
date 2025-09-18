import React from "react";
import { ProjectResponse } from "@src/lib/response-types";

type ProjectListViewProps = {
	project: ProjectResponse;
};

const ProjectListView = ({ project }: ProjectListViewProps) => {
	return (
		<div>
			<h2>Project List View</h2>
			<p>{project.name}</p>
			<p>{project.description}</p>
		</div>
	);
};

export default ProjectListView;
