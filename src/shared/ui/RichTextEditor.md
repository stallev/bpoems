# RichTextEditor Component

Улучшенный компонент RichTextEditor для создания и редактирования стихотворений с использованием Tiptap.

## Особенности

- **Панель инструментов**: Полнофункциональная панель с кнопками форматирования
- **Поддержка расширений**: StarterKit + Underline расширение
- **Адаптивный дизайн**: Поддержка темной/светлой темы
- **TypeScript**: Полная типизация
- **Доступность**: ARIA атрибуты и поддержка клавиатуры
- **Обработка ошибок**: Визуальная индикация ошибок

## Установленные расширения

- **StarterKit**: Базовые возможности (заголовки, жирный, курсив, списки и т.д.)
- **Underline**: Поддержка подчеркнутого текста

## Использование

```tsx
import { RichTextEditor } from '@/shared/ui/RichTextEditor';
import type { TiptapJson } from '@/features/poem-creation/model/types';

const MyComponent = () => {
  const [content, setContent] = useState<TiptapJson>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Начните писать...',
          },
        ],
      },
    ],
  });

  return (
    <RichTextEditor
      content={content}
      onChange={setContent}
      placeholder="Начните писать ваше стихотворение..."
      minHeight="200px"
      error={false}
      disabled={false}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `TiptapJson \| string` | `undefined` | Начальное содержимое редактора |
| `onChange` | `(content: TiptapJson) => void` | - | Callback при изменении содержимого |
| `placeholder` | `string` | `'Начните писать...'` | Placeholder текст |
| `className` | `string` | `undefined` | Дополнительные CSS классы |
| `minHeight` | `string` | `'200px'` | Минимальная высота редактора |
| `disabled` | `boolean` | `false` | Отключить редактор |
| `error` | `boolean` | `false` | Показать стили ошибки |

## Поддерживаемые форматы

### Заголовки
- H1, H2, H3

### Текстовое форматирование
- **Жирный** (Ctrl+B)
- *Курсив* (Ctrl+I)
- <u>Подчеркнутый</u>
- ~~Зачеркнутый~~

### Списки
- Маркированные списки
- Нумерованные списки

## Интеграция с PoemForm

Компонент интегрирован в `PoemForm` и заменяет старую реализацию Tiptap:

```tsx
// В PoemForm.tsx
<RichTextEditor
  content={
    defaultValues?.content ? getTiptapValue(defaultValues.content) : undefined
  }
  onChange={handleContentChange}
  placeholder={POEM_FORM_LABELS.RU.CONTENT_PLACEHOLDER}
  minHeight="200px"
  error={!!form.formState.errors.content}
  className="min-h-[200px]"
/>
```

## Стилизация

Компонент использует:
- Tailwind CSS для стилизации
- CSS переменные для темной/светлой темы
- shadcn/ui компоненты (Toggle)
- Lucide React иконки

## Обработка ошибок

При `error={true}` редактор показывает красную рамку и фокус:

```tsx
<RichTextEditor
  error={!!form.formState.errors.content}
  // ... другие props
/>
```

## Отключение редактора

```tsx
<RichTextEditor
  disabled={true}
  // ... другие props
/>
```

## Пример с обработкой ошибок

```tsx
const [hasError, setHasError] = useState(false);

<RichTextEditor
  content={content}
  onChange={(newContent) => {
    setContent(newContent);
    setHasError(false); // Сброс ошибки при изменении
  }}
  error={hasError}
  placeholder="Введите текст..."
/>
```

## Совместимость

- Next.js 15.4.6+
- React 19+
- TypeScript 5+
- Tiptap 2.4.0+
- Tailwind CSS 4+

## Миграция с старой версии

1. Замените импорты Tiptap на новый компонент
2. Обновите обработчики событий
3. Используйте новые props для настройки

```tsx
// Старый код
const editor = useEditor({
  extensions: [StarterKit, Underline],
  // ...
});

// Новый код
<RichTextEditor
  content={content}
  onChange={handleChange}
  // ...
/>
```
