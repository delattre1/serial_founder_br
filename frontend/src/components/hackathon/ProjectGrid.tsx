import { ProjectCard, Project } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  showVoting?: boolean;
  onVote?: (projectId: string) => void;
  onUnvote?: (projectId: string) => void;
  emptyMessage?: string;
}

export function ProjectGrid({
  projects,
  showVoting = false,
  onVote,
  onUnvote,
  emptyMessage = 'Nenhum projeto ainda. Seja o primeiro!',
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="brutal-border bg-black p-12 text-center">
        <div className="font-brutal-mono text-neutral-500 text-lg">{emptyMessage}</div>
        <div className="font-brutal-mono text-lime-400 text-sm mt-2">
          // AGUARDANDO SUBMISSIONS
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          showVoting={showVoting}
          onVote={onVote}
          onUnvote={onUnvote}
        />
      ))}
    </div>
  );
}
