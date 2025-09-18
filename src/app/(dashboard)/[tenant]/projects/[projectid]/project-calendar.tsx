import React from "react";
import { ProjectResponse } from "@src/lib/response-types";

type ProjectCalendarProps = {
	project: ProjectResponse;
};

const ProjectCalendar = ({ project }: ProjectCalendarProps) => {
	return (
		<div>
			<h2>Project Calendar</h2>
			<p>{project.name}</p>
			<p>{project.description}</p>
		</div>
	);
};

export default ProjectCalendar;
