import { PrismaAdapter } from '@auth/prisma-adapter';
import * as bcrypt from 'bcrypt';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
// import nodemailer from 'nodemailer';
import { UserRole } from '@/entities/user/model/types';
import { prisma } from '@/shared/api/database/prisma';

const requiredEnvVars = [
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET',
  'AUTH_SECRET',
  // 'SMTP_HOST',
  // 'SMTP_PORT',
  // 'SMTP_USER',
  // 'SMTP_PASS',
  // 'SMTP_FROM',
];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // profile: (profile) => { ... } // Можно кастомизировать, если нужно изменить маппинг данных профиля
    }),
    Credentials({
      async authorize(credentials) {
        // Логика авторизации по email/паролю
        if (!credentials?.email || !credentials?.password) {
          return null; // Недостаточно данных
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. Найти пользователя в БД по email
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        // 2. Если пользователь не найден или у него нет пароля (например, зарегистрирован через OAuth)
        if (!user || !user.password) {
          // Возвращаем null, чтобы вызвать ошибку 'CredentialsSignIn'
          // (или можно бросить специфичную ошибку, если нужно показать пользователю конкретное сообщение)
          return null;
        }

        // 3. Сравнить предоставленный пароль с хэшем в БД
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // 4. Если пароль верен, возвращаем объект пользователя
        if (isPasswordValid) {
          // Важно: Не возвращать поле password обратно клиенту!
          // const { password: _, ...userWithoutPassword } = user;
          // return userWithoutPassword;
          // Или просто вернуть нужные поля:
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || ('SUBSCRIBER' as UserRole), // Предполагаем, что роль - строка
            // image: user.image, // если нужно
          };
        } else {
          // Неверный пароль
          return null;
        }
      },
    }),
    // Другие провайдеры (Apple, Facebook) будут добавлены позже
  ],
  // Настройка кастомных страниц
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/register',
    error: '/auth/error',
  },
  // 4. Коллбэки (Callbacks)
  callbacks: {
    // Коллбэк jwt вызывается при каждом запросе JWT (если он активен) и при входе
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || ('SUBSCRIBER' as UserRole);
      }

      if (trigger === 'update' || !user) {
        const refreshedUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (refreshedUser && refreshedUser.role !== token.role) {
          token.role = refreshedUser.role as UserRole;
        }
      }

      return token;
    },
    // Коллбэк session вызывается всякий раз, когда клиент вызывает `useSession()` или `getSession()`
    async session({ session, token }) {
      // Объект `user` доступен только если используется стратегия сессий БД, поэтому используем `token`
      if (token && session.user) {
        // Передаем id и role из токена в объект сессии, доступный на клиенте
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole; // Теперь типы совпадают
        // session.user.image = token.picture as string | null; // если нужно
      }
      return session;
    },
    // Коллбэк signIn вызывается перед входом пользователя
    async signIn({ account }) {
      const allowedProviders = ['google', 'credentials'];
      if (account && !allowedProviders.includes(account.provider)) {
        return false;
      }
      return true;
    },
    // Коллбэк redirect (опционально) - можно кастомизировать редиректы
    // async redirect({ url, baseUrl }) { ... }
  },
  // 5. События (Events)
  events: {
    // Событие createUser вызывается, когда новый пользователь создается через Credentials или OAuth
    async createUser({ user }) {
      // Убедиться, что новому пользователю присвоена роль SUBSCRIBER (как указано в техническом PRD)
      // Хотя дефолт в Prisma schema уже SUBSCRIBER, это дополнительная гарантия
      if (user.id && (!user.role || user.role !== 'SUBSCRIBER')) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: 'SUBSCRIBER' },
          });
        } catch (error) {
          console.error('Failed to set default role for new user:', error);
          // Решить, как обрабатывать ошибку (например, логировать, бросить исключение)
        }
      }
    },
    // Событие linkAccount вызывается, когда аккаунт OAuth связывается с существующим пользователем
    async linkAccount() {
      // В данном случае, если пользователь уже существует и связывается с Google,
      // его роль не должна меняться. Но если нужно, логика может быть добавлена.
      // console.log("Account linked:", user, account);
    },
    // Другие события: signIn, signOut, updateUser, etc.
  },
  // Конфигурация email для password reset
  // email: {
  //   async sendVerificationRequest({ identifier: email, url, provider }) {
  //     const transporter = nodemailer.createTransport({
  //       host: process.env.SMTP_HOST,
  //       port: parseInt(process.env.SMTP_PORT!),
  //       auth: {
  //         user: process.env.SMTP_USER,
  //         pass: process.env.SMTP_PASS,
  //       },
  //     });

  //     await transporter.sendMail({
  //       from: process.env.SMTP_FROM,
  //       to: email,
  //       subject: 'Сброс пароля для Christian Poetry Platform',
  //       html: `
  //         <p>Здравствуйте,</p>
  //         <p>Вы запросили сброс пароля. Пожалуйста, перейдите по ссылке ниже, чтобы установить новый пароль:</p>
  //         <p><a href="${url}">Сбросить пароль</a></p>
  //         <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
  //         <p>С уважением,<br>Команда Christian Poetry Platform</p>
  //       `,
  //     });
  //   },
  // },
  // 6. Другие опции (по необходимости)
  // secret: process.env.AUTH_SECRET, // Обычно берется из AUTH_SECRET автоматически
  // debug: process.env.NODE_ENV === "development", // Включить отладку в dev режиме
  // pages: { signIn: '/auth/signin', ... }, // Кастомные страницы ошибок/входа
  // cookies: { ... }, // Кастомизация cookies (обычно не требуется)
} satisfies NextAuthConfig;

// Экспортируем тип для удобства использования в других частях приложения
// Типы теперь импортируются из types.ts

// Инициализация NextAuth с конфигурацией (этот экспорт будет использоваться в route handler)
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Функция для создания токена сброса пароля
// export async function createPasswordResetToken(email: string) {
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     throw new Error('User not found');
//   }

//   const token = randomUUID();
//   const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 час

//   await prisma.verificationToken.create({
//     data: {
//       identifier: email,
//       token,
//       expires,
//     },
//   });

//   return token;
// }
