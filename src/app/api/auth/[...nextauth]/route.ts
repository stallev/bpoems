import { handlers } from '@/shared/api/auth/auth';

console.log('Handlers object:', handlers);
console.log('GET handler:', handlers?.GET);
console.log('POST handler:', handlers?.POST);

if (!handlers) {
  throw new Error('Handlers object is undefined');
}

if (!handlers.GET || !handlers.POST) {
  throw new Error(
    `NextAuth handlers are not properly initialized. GET: ${!!handlers.GET}, POST: ${!!handlers.POST}`
  );
}

export const GET = handlers.GET;
export const POST = handlers.POST;
