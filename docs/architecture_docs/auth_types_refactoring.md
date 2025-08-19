# Рефакторинг типов аутентификации

## Проблема

В коде существовало дублирование типов форм аутентификации:

1. **`src/features/auth/model/types.ts`**:
   ```typescript
   export type FormMode = 'login' | 'register';
   ```

2. **`src/features/auth/constants/AuthConstants.ts`**:
   ```typescript
   export const AuthFormTypes = {
     LOGIN: 'login',
     REGISTER: 'register',
   };
   ```

Это приводило к:
- Дублированию кода
- Возможным ошибкам при изменении типов
- Нарушению принципа DRY (Don't Repeat Yourself)

## Решение

### 1. Единый источник истины

Создан единый источник истины в `src/features/auth/model/types.ts`:

```typescript
// Определяем литеральные типы для форм
export const FORM_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
} as const;

export type FormMode = (typeof FORM_MODES)[keyof typeof FORM_MODES];
```

### 2. Реэкспорт для обратной совместимости

В `src/features/auth/constants/AuthConstants.ts` добавлен реэкспорт:

```typescript
import { FORM_MODES } from '../model/types';

// Реэкспортируем типы форм из model/types.ts для обратной совместимости
export const AuthFormTypes = FORM_MODES;
```

### 3. Обновление использования

Все места использования обновлены для использования `FORM_MODES`:

```typescript
// Было
const mode: FormMode = 'login';

// Стало
const mode: FormMode = FORM_MODES.LOGIN;
```

## Преимущества

### ✅ **Устранение дублирования**
- Единый источник истины для типов форм
- Автоматическая синхронизация типов

### ✅ **Типобезопасность**
- TypeScript автоматически проверяет корректность значений
- Невозможно использовать несуществующие значения

### ✅ **Обратная совместимость**
- Существующий код продолжает работать
- `AuthFormTypes` остается доступным

### ✅ **Улучшенная разработка**
- IDE автодополнение для значений форм
- Рефакторинг безопасен

## Структура после рефакторинга

```
src/features/auth/
├── model/
│   └── types.ts          # ✅ Единый источник истины
├── constants/
│   └── AuthConstants.ts  # ✅ Реэкспорт для совместимости
├── lib/
│   ├── useAuthForm.ts    # ✅ Использует FORM_MODES
│   └── useFieldHighlight.ts
└── ui/
    ├── AuthFormContainer.tsx  # ✅ Использует FORM_MODES
    ├── LoginForm.tsx
    └── RegisterForm.tsx
```

## Использование

### В компонентах
```typescript
import { FORM_MODES, type FormMode } from '../model/types';

const handleModeChange = (newMode: FormMode) => {
  setMode(newMode);
};

// Использование
handleModeChange(FORM_MODES.LOGIN);
handleModeChange(FORM_MODES.REGISTER);
```

### В хуках
```typescript
import { FORM_MODES, type AuthFormState } from '../model/types';

const [state, setState] = useState<AuthFormState>({
  mode: FORM_MODES.LOGIN, // ✅ Типобезопасно
  // ...
});
```

### Для обратной совместимости
```typescript
import { AuthFormTypes } from '../constants/AuthConstants';

// Продолжает работать
if (mode === AuthFormTypes.LOGIN) {
  // ...
}
```

## Заключение

Рефакторинг устранил дублирование кода и улучшил типобезопасность, сохранив при этом обратную совместимость. Теперь все типы форм аутентификации управляются из единого места, что упрощает поддержку и развитие кода.
