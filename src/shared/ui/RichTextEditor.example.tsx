'use client';

import { useState } from 'react';
import type { TiptapJson } from '@/features/poem-creation/model/types';
import { RichTextEditor } from './RichTextEditor';

/**
 * Example component demonstrating RichTextEditor usage
 */
export const RichTextEditorExample = () => {
  const [content, setContent] = useState<TiptapJson>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Начните писать ваше стихотворение здесь...',
          },
        ],
      },
    ],
  });

  const handleContentChange = (newContent: TiptapJson) => {
    setContent(newContent);
    console.log('Content changed:', newContent);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">RichTextEditor Example</h1>
        <p className="text-muted-foreground">
          Пример использования улучшенного компонента RichTextEditor с панелью инструментов
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Редактор стихотворений</h2>
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          placeholder="Начните писать ваше стихотворение..."
          minHeight="300px"
          className="border rounded-lg p-4"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">JSON Content</h2>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-64">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Возможности редактора</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Заголовки (H1, H2, H3)</li>
          <li>Жирный текст (Ctrl+B)</li>
          <li>Курсив (Ctrl+I)</li>
          <li>Подчеркнутый текст</li>
          <li>Зачеркнутый текст</li>
          <li>Маркированные списки</li>
          <li>Нумерованные списки</li>
          <li>Адаптивный дизайн</li>
          <li>Поддержка темной/светлой темы</li>
          <li>Обработка ошибок</li>
        </ul>
      </div>
    </div>
  );
};
