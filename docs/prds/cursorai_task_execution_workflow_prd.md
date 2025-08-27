# Task Execution Workflow PRD: Christian Poetry Platform

This Product Requirements Document (PRD) defines the structured workflow for the CursorAI agent when executing development tasks for the Christian Poetry Platform. The workflow ensures high-quality code, compliance with project standards, and alignment with the Feature-Sliced Design (FSD) architecture, TypeScript requirements, and project documentation as specified in `docs/prds/main_prd.md`, `docs/prds/tech_prd.md`, `docs/prds/design_prd.md`, and `docs/architecture_docs/arc_general_doc.md`.

---

## Purpose

The Task Execution Workflow ensures that all development tasks are performed systematically, with rigorous validation and documentation to maintain code quality, consistency, and adherence to project requirements. This workflow is mandatory for the CursorAI agent to follow for every task.

---

## Task Execution Workflow

The CursorAI agent must follow the steps below for each development task to ensure compliance with the project's technical, functional, and design requirements.

### Step 1: Task Analysis
- **Objective**: Understand the task requirements and align with project documentation.
- **Actions**:
  - Review the task description and cross-reference with relevant sections in:
    - `docs/prds/main_prd.md` (functional requirements, user stories).
    - `docs/prds/tech_prd.md` (technical requirements, server actions, TypeScript).
    - `docs/prds/design_prd.md` (UI/UX, accessibility, responsive design).
    - `docs/architecture_docs/arc_general_doc.md` (FSD architecture, import rules).
    - `docs/architecture_docs/current_project_files_tree.md` (project structure).
  - Identify the appropriate layer (`app`, `pages`, `widgets`, `features`, `entities`, `shared`), slice, and segment (`ui`, `model`, `lib`, `api`) for the task.
  - If a task description document is missing in `docs/tasks_descriptions/release_X.Y/`, create one following the naming convention `release_X.Y_task-number_task-name.md` (e.g., `release_0.1_3.1_configure-prisma-orm.md`). The document must include:
    - Step-by-step implementation instructions in English.
    - Code examples with explanations.
    - References to relevant PRDs and library documentation (using exact versions from `package.json`).
    - FSD architecture compliance details.
    - Alternative implementation approaches with pros and cons.
    - Justification for the chosen approach.
    - Dependencies on other tasks.

### Step 2: Code Implementation
- **Objective**: Implement the task following project standards and best practices.
- **Actions**:
  - Place code in the appropriate FSD layer and segment as per `arc_general_doc.md`.
  - Adhere to strict TypeScript typing, prohibiting the use of `any` types. Define specific types in `src/features/*/model/types.ts` or equivalent locations.
  - Use centralized constants from `src/shared/constants/` (e.g., `ContentStatus.ts`, `Roles.ts`, `RoutePath.ts`, `ErrorMessages.ts`) for roles, statuses, routes, and errors.
  - For UI-related text such as labels, error messages, and placeholders, avoid hardcoding string values. Instead, define corresponding constants in `src/shared/constants/` or `src/features/{feature-name}/constants/` following FSD methodology (e.g., `src/features/poem-creation/constants/ui.ts` for feature-specific UI text). Import and use these constants in code to ensure consistency and maintainability.
  - Implement server-side operations using Next.js Server Actions in `src/features/{feature-name}/server-actions/{actionName}.ts`, following the structure in `tech_prd.md`:
    - Authentication check using `auth()` from `src/shared/api/auth/auth.ts`.
    - Authorization check for role-based access.
    - Input validation using Zod schemas (version 4.0.10).
    - Business logic execution.
    - Cache revalidation using `revalidatePath()` and `revalidateTag()`.
    - Comprehensive error handling with user-friendly messages sourced from centralized constants (e.g., `ErrorMessages.ts`).
  - Use `shadcn/ui` components and Tailwind CSS (version 4) with semantic classes (e.g., `bg-primary`, `text-success`) and CSS variables from `src/shared/styles/theme.css`.
  - Ensure UI components meet WCAG 2.1 AA accessibility standards (keyboard navigation, ARIA labels, 4.5:1 color contrast).
  - Implement multilingual support using Next.js i18n framework, with English as the default fallback and support for Russian (MVP) and Ukrainian (future). Use constants for translatable text to facilitate i18n integration.
  - Add English-only code comments to explain complex logic or non-obvious implementations.

### Step 3: TypeScript Validation
- **Objective**: Ensure type safety and eliminate TypeScript errors.
- **Actions**:
  - Run `npx tsc --noEmit` to check for TypeScript errors. Use this command at this step.
  - If errors are detected (e.g., `Unexpected any`, missing types):
    - Fix errors by defining specific types in the appropriate `model/types.ts` file.
    - Re-run `npx tsc --noEmit` until no errors remain.
  - Document any type-related fixes in the task description document.

### Step 4: Linting
- **Objective**: Ensure code adheres to linting standards and eliminate warnings.
- **Actions**:
  - Run `npm run lint:fix` to detect and fix linting issues, including warnings like `Unexpected any. Specify a different type`.
  - If issues are detected:
    - Address each issue (e.g., replace `any` with specific types, fix formatting).
    - Re-run `npm run lint:fix` until no issues remain.
  - Ensure all code complies with ESLint and Prettier standards.

### Step 5: Build Validation
- **Objective**: Verify that the project builds successfully without errors.
- **Actions**:
  - Run `npm run build` to check for build errors.
  - If errors are detected (e.g., missing imports, incorrect configurations):
    - Fix the errors and document the fixes.
    - Re-run `npm run build` until the build succeeds.
  - Document any build-related fixes in the task description document.

### Step 6: Code Review Simulation
- **Objective**: Ensure code quality and compliance through self-review.
- **Actions**:
  - Simulate a code review by checking for:
    - Compliance with FSD architecture (layer separation, import rules, public APIs).
    - Adherence to TypeScript and server action requirements.
    - Use of centralized constants for UI text (labels, errors, placeholders) as per FSD methodology.
    - Consistency with design guidelines (Tailwind classes, semantic colors, accessibility).
    - Presence of clear, English-only code comments.
  - If issues are found, revise the code and repeat Steps 3–5 as needed.
  - Document any revisions in the task description document.

### Step 7: Documentation Update
- **Objective**: Ensure comprehensive documentation of the task.
- **Actions**:
  - Update or finalize the task description document in `docs/tasks_descriptions/release_X.Y/` with:
    - Detailed implementation steps, including use of centralized constants for UI text.
    - Code examples with explanations, demonstrating constant usage (e.g., importing from `ui.ts`).
    - Validation outcomes (TypeScript, linting, build).
    - Any deviations from the planned approach and their justification.
    - Dependencies on other tasks.
  - If the task affects the project structure, update `docs/architecture_docs/current_project_files_tree.md`.
  - If the task involves database schema changes, update `prisma/schema.prisma` and document in `docs/specs/moderation_specs/` or other relevant spec files.
  - Ensure all documentation and code comments are in English.

---

## Success Metrics

- **Code Quality**:
  - Zero TypeScript errors (`npx tsc --noEmit`).
  - Zero linting issues (`npm run lint:fix`).
  - Successful builds (`npm run build`).
- **Documentation**: Task description document is complete, in English, and includes all required sections, including details on centralized constants for UI text.

---

## Error Handling and Recovery

- **Error Handling**:
  - Implement comprehensive error handling in server actions with user-friendly messages sourced from centralized constants (e.g., `ErrorMessages.ts`).
  - Log errors to the console and, where applicable, to Vercel Analytics.
  - Return meaningful error responses to the client (e.g., `{ success: false, message: ERROR_MESSAGES.POEM_CREATION_FAILED }`).
- **Recovery Procedures**:
  - If TypeScript, linting, or build errors persist after multiple attempts:
    - Revert to the last known working state using git.
    - Document the issue and resolution attempts in the task description document.
    - Propose alternative implementation approaches if needed.

---

## Example Task Execution

**Task**: Implement the poem creation form at `/profile/add-poem`.

**Workflow**:
1. **Task Analysis**:
   - Review `main_prd.md` (user story: "As a subscriber, I want to create poems at `/profile/add-poem`").
   - Check `design_prd.md` for UI requirements (WYSIWYG editor, Tailwind styling, responsive design).
   - Verify FSD structure in `current_project_files_tree.md` (place code in `src/features/poem-creation/`).
   - Create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-number_poem-creation-form.md`.

2. **Code Implementation**:
   - Create `src/features/poem-creation/ui/PoemCreateForm.tsx` using `shadcn/ui` components and Tailwind CSS.
   - Define UI text constants in `src/features/poem-creation/constants/ui.ts` (e.g., `POEM_TITLE_LABEL`, `POEM_CONTENT_PLACEHOLDER`, `SUBMIT_ERROR`).
   - Implement `src/features/poem-creation/server-actions/createPoem.ts` with Zod validation and slug generation using `src/shared/lib/utils/slugify.ts`, using error messages from `src/shared/constants/ErrorMessages.ts`.
   - Define types in `src/features/poem-creation/model/types.ts`.
   - Use constants from `src/shared/constants/` (e.g., `Roles.ts`, `ContentStatus.ts`) and `src/features/poem-creation/constants/ui.ts` for all UI text.

3. **TypeScript Validation**:
   - Run `npx tsc --noEmit` and fix any type errors (e.g., define missing types).
   - Re-run until no errors remain.

4. **Linting**:
   - Run `npm run lint:fix` and resolve any issues (e.g., `Unexpected any`).
   - Re-run until no issues remain.

5. **Build Validation**:
   - Run `npm run build` and fix any build errors.
   - Re-run until the build succeeds.

6. **Code Review Simulation**:
   - Verify FSD compliance, TypeScript typing, design alignment, and use of centralized constants for UI text.
   - Revise code if issues are found and repeat Steps 3–5.

7. **Documentation Update**:
   - Update `release_X.Y_task-number_poem-creation-form.md` with implementation details, code examples (including constant usage), and validation results.
   - Update `current_project_files_tree.md` if new files are added.

---

**Document Version**: 1.0  
**Last Updated**: August 27, 2025  
**Next Review**: September 10, 2025