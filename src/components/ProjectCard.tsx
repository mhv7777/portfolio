import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { title, thumbnail } = project;
  const displayTitle = typeof index === 'number'
    ? `${String(index + 1).padStart(2, '0')} | ${title}`
    : title;

  return (
    <div className="project-card border-none bg-transparent">
      <h2 className="project-title project-title--small">
        {displayTitle}
      </h2>

      <Link to={{ pathname: `/projects/${project.id}`, state: { project } }} aria-label={title}>
        <div className="project-thumb" aria-hidden={false}>
          {thumbnail ? (
            <div className="bg" style={{ backgroundImage: `url(${thumbnail})` }} />
          ) : null}
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;