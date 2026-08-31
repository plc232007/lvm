import type { PropsRenderer } from '@/components/activity/registry';

const EMBED: Record<'youtube', (id: string) => string> = {
  youtube: (id) => `https://www.youtube-nocookie.com/embed/${id}`,
};

export function VideoRenderer({ atividade }: PropsRenderer<'video'>) {
  const { provedor, videoId } = atividade.config;

  return (
    <div className="moldura-video">
      <iframe
        src={EMBED[provedor](videoId)}
        title={atividade.title}
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
