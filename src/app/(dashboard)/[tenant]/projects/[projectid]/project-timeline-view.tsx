import React from "react";
import { ProjectResponse } from "@src/lib/response-types";

type ProjectTimelineViewProps = {
	project: ProjectResponse;
};

const ProjectTimelineView = ({ project }: ProjectTimelineViewProps) => {
	return (
		<div>
			<h2>Project Timeline View</h2>
			<p>{project.name}</p>
			<p>{project.description}</p>
		</div>
	);
};

ProjectTimelineView.propTypes = {};

export default ProjectTimelineView;
