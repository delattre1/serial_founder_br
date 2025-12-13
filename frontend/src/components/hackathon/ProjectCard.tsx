import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';
import { VoteButton } from './VoteButton';

export interface Project {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  project_url: string;
  screenshot_url?: string;
  github_url?: string;
  user_id: string;
  username?: string;
  social_handle?: string;
  vote_count: number;
  has_voted?: boolean;
  is_solo: boolean;
  team_members?: string;
}

interface ProjectCardProps {
  project: Project;
  showVoting?: boolean;
  onVote?: (projectId: string) => void;
  onUnvote?: (projectId: string) => void;
}

export function ProjectCard({ project, showVoting = false, onVote, onUnvote }: ProjectCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const handleMouseEnter = () => {
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
    setIframeLoaded(false);
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  const placeholderScreenshot = `https://placehold.co/800x450/000000/a3e635?text=${encodeURIComponent(project.name)}`;

  return (
    <div className="brutal-border bg-black hover-shift group">
      {/* Preview area */}
      <div
        className="relative aspect-video overflow-hidden bg-neutral-900"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Screenshot (always rendered as base) */}
        <img
          src={project.screenshot_url || placeholderScreenshot}
          alt={project.name}
          className="w-full h-full object-cover"
        />

        {/* Live iframe preview on hover */}
        {showPreview && !iframeError && (
          <div className="absolute inset-0 bg-neutral-900">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
              </div>
            )}
            <iframe
              src={project.project_url}
              className={`w-full h-full border-0 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
              sandbox="allow-scripts allow-same-origin"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`Preview of ${project.name}`}
            />
          </div>
        )}

        {/* Hover overlay with link */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-lime-400 text-black px-4 py-2 font-brutal-mono text-sm flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            ACESSAR
          </a>
        </div>
      </div>

      {/* Project info */}
      <Link to={`/hackathon/project/${project.slug}`} className="block p-6">
        <h3 className="font-brutal-display text-xl text-white mb-2 group-hover:text-lime-400 transition-colors">
          {project.name.toUpperCase()}
        </h3>
        <p className="font-brutal-mono text-sm text-neutral-400 line-clamp-2 mb-4">
          {project.short_description}
        </p>
      </Link>

      {/* Footer with votes and author */}
      <div className="px-6 pb-6 flex items-center justify-between">
        {showVoting ? (
          <VoteButton
            projectId={project.id}
            voteCount={project.vote_count}
            hasVoted={project.has_voted || false}
            onVote={onVote}
            onUnvote={onUnvote}
          />
        ) : (
          <div className="flex items-center gap-2 text-neutral-500 font-brutal-mono text-sm">
            <span>▲ {project.vote_count}</span>
          </div>
        )}

        <div className="font-brutal-mono text-xs text-neutral-600">
          {project.social_handle ? `@${project.social_handle}` : ''}
        </div>
      </div>
    </div>
  );
}
