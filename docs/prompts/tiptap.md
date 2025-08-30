# Detailed Prompt for CursorAI: Migration from react-quilljs to Tiptap in Christian Poetry Platform

## Prompt

### Context
You are an advanced AI assistant integrated into CursorAI, designed to assist with web development tasks for the Christian Poetry Platform, a Next.js 15.4.4-based project using TypeScript, Prisma ORM v6.13.0, Tailwind CSS v4, and shadcn/ui components. The project follows the Feature-Sliced Design (FSD) architecture as outlined in `arc_general_doc.md` and adheres to the technical requirements in `tech_prd.md` and form component specifications in `form_requirements.md`. The current implementation uses "react-quilljs": "2.0.5" for the Rich Text Editor in the `poem-creation` feature, but the plan is to migrate to Tiptap for improved flexibility and maintainability.

The project file structure is detailed in `current_project_files_tree.md`, and relevant code files (e.g., `PoemForm.tsx`, `quillUtils.ts`, `useQuillUtils.ts`, `schemas.ts`) are provided. The goal is to update the `poem-creation` feature to use Tiptap, ensuring compatibility with existing form logic, server actions, and data structures (e.g., `PoemContentBlock` with HTML content). Unit and integration tests are not required for this task.

### Task Description
Migrate the `poem-creation` feature from using "react-quilljs": "2.0.5" to Tiptap, updating the UI component (`PoemForm.tsx`), hooks (`usePoemForm.ts`, `useQuillUtils.ts`), utilities (`quillUtils.ts`), and schemas (`schemas.ts`) to handle Tiptap's JSON-based content structure. Ensure the form supports creating and editing poems with formatted text (bold, italic, underline) and multiple paragraphs, maintaining the current workflow (e.g., `defaultValues.content` to editor, `formData` submission via server actions).

#### Specific Requirements
1. **Dependency Update**:
   - Replace "react-quilljs": "2.0.5" with Tiptap dependencies (e.g., `@tiptap/react`, `@tiptap/starter-kit`) in `package.json`.
   - Ensure compatibility with Next.js 15.4.4 and TypeScript.

2. **File Structure Compliance**:
   - Adhere to FSD architecture: Update files within `src/features/poem-creation/` (ui, model, lib, server-actions).
   - Maintain public API exports in `index.ts` files.
   - Use constants from `src/shared/constants/` (e.g., `LocaleMessages`) as per `form_requirements.md`.

3. **Component and Logic Update**:
   - Replace the Quill editor in `PoemForm.tsx` with a Tiptap editor.
   - Update `usePoemForm.ts` and `useQuillUtils.ts` to handle Tiptap's `editor.getJSON()` and `editor.commands.setContent()` instead of Quill Delta.
   - Refactor `quillUtils.ts` to convert between `PoemContentBlock` (HTML-based) and Tiptap JSON, using `DOMParser` or Tiptap's built-in utilities.
   - Ensure `schemas.ts` validates Tiptap JSON structure (`type: "doc"`, `content` array with `paragraph` and `text` nodes).

4. **Data Flow**:
   - Input: Accept `defaultValues.content` as an array of `PoemContentBlock` (HTML) and convert it to Tiptap JSON for the editor.
   - Output: Convert Tiptap JSON back to `PoemContentBlock` array for `formData` submission in `updatePoem.ts` and `createPoem.ts`.
   - Preserve existing server action logic (e.g., `revalidatePath`, status handling).

5. **Styling and Accessibility**:
   - Use Tailwind CSS v4 and shadcn/ui components for styling.
   - Maintain ARIA attributes and accessibility features as per `form_requirements.md`.

6. **Documentation**:
   - Update `docs/specs/poem_specs/poem_form_structure.md` to reflect Tiptap usage.
   - Add notes in `arc_general_doc.md` about the migration under the `poem-creation` feature section.

7. **No Testing**:
   - Skip unit and integration tests as per the user's preference.

### Input Data
- Current `PoemContentBlock` structure (e.g., `{ order, textType, content }` with HTML).
- Example `defaultValues.content` from logs:
  ```json
  [
    {
      "order": 0,
      "content": "<em><strong>Создайте новое стихотворение</strong></em>, <u>выбрав категорию</u> и используя редактор для форматирования текста.",
      "textType": "paragraph"
    },
    {
      "order": 1,
      "content": "Создайте новое стихотворение, выбрав категорию и используя редактор для форматирования текста.",
      "textType": "paragraph"
    }
  ]
  ```
- Existing code files: `PoemForm.tsx`, `usePoemForm.ts`, `useQuillUtils.ts`, `quillUtils.ts`, `schemas.ts`, `updatePoem.ts`.

### Expected Output
- Updated `package.json` with Tiptap dependencies.
- Refactored files in `src/features/poem-creation/`:
  - `ui/PoemForm.tsx`: Tiptap editor integration.
  - `lib/hooks/usePoemForm.ts`: Updated hook for Tiptap.
  - `lib/hooks/useQuillUtils.ts`: Renamed or refactored to `useTiptapUtils.ts` for Tiptap compatibility.
  - `lib/utils/quillUtils.ts`: Renamed to `tiptapUtils.ts` with conversion logic.
  - `model/schemas.ts`: Updated Zod schema for Tiptap JSON.
- Updated `updatePoem.ts` and `createPoem.ts` to handle Tiptap JSON in `formData`.
- Updated documentation files.

### Constraints
- No external dependencies beyond Tiptap ecosystem and existing stack.
- Preserve existing FSD layer hierarchy and import rules.
- Avoid breaking changes to server actions or Prisma schema.

### Example Workflow
1. **User Opens Edit Form**: `defaultValues.content` (HTML blocks) is passed to `usePoemForm`, converted to Tiptap JSON, and set in the editor.
2. **User Edits Content**: Tiptap updates its internal state.
3. **Form Submission**: Tiptap JSON is converted back to `PoemContentBlock` array, submitted via `formData`, and processed by `updatePoem`.

### Reflection and Guidance
- **Reflection**: The migration from Quill to Tiptap aligns with the project's scalability goals in `arc_general_doc.md`, as Tiptap offers better extensibility (e.g., custom nodes, collaboration). However, the lack of tests may increase risk—consider adding smoke tests post-migration if issues arise.
- **Guidance**: Start by installing Tiptap and integrating it in `PoemForm.tsx`. Use Tiptap's `@tiptap/starter-kit` for basic formatting (bold, italic, underline). Leverage `DOMParser` in `tiptapUtils.ts` to map HTML to Tiptap nodes, ensuring bidirectional conversion. Validate the schema update with sample data to avoid runtime errors.

### Additional Notes
- Refer to Tiptap documentation (https://tiptap.dev/) for API details (e.g., `useEditor`, `getJSON`, `setContent`).
- Ensure `startTransition` is used for non-blocking UI updates during submission.
- If challenges arise (e.g., complex HTML parsing), propose a simplified Tiptap JSON structure and update the Prisma schema accordingly.

Please generate the updated code and documentation based on this prompt, adhering to the project's FSD architecture and technical stack.

---

## Reflection as Prompt Engineer
This prompt is designed to be highly specific, providing CursorAI with clear context (project stack, FSD structure, existing files) and actionable tasks (migration steps, file updates). I included the file tree and relevant documents to ensure compliance with project standards (e.g., `form_requirements.md`, `tech_prd.md`). The reflection highlights potential risks (no tests) and offers guidance, aligning with my role as a mentor. Constraints and examples guide CursorAI toward a practical solution, while the lack of testing requirement is explicitly noted to avoid unnecessary output. The prompt is concise yet comprehensive, balancing detail with flexibility for AI interpretation.