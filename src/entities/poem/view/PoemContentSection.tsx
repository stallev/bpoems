import { RichTextContentType } from '@/shared/model/SimpleTypes';
import { PoemContentRenderer } from '@/shared/ui/PoemContentRenderer';
import { UIConstants } from '../constants/ui';

const PoemContentSection = ({
  content,
  tags,
}: {
  content: RichTextContentType | null;
  tags: Array<{ id: string; name: string }>;
}) => {
  return (
    <section className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
      <PoemContentRenderer content={content} />

      {tags.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            {UIConstants.TAGS_LABEL}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PoemContentSection;
