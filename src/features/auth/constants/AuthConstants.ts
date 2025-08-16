export const AuthFormTypes = {
  LOGIN: 'login',
  REGISTER: 'register',
};

export const AuthFormPlaceholders = {
  LOGIN: {
    EMAIL: 'Введите email',
    PASSWORD: 'Введите пароль',
  },
  REGISTER: {
    NAME: 'Введите имя',
    EMAIL: 'Введите email',
    PASSWORD: 'Введите пароль',
    CONFIRM_PASSWORD: 'Подтвердите пароль',
  },
};

export const AuthFormLabels = {
  LOGIN: {
    EMAIL: 'Email',
    PASSWORD: 'Пароль',
  },
  REGISTER: {
    NAME: 'Имя (опционально)',
    EMAIL: 'Email',
    PASSWORD: 'Пароль',
    CONFIRM_PASSWORD: 'Подтвердите пароль',
  },
};

export const AuthFormTitles = {
  LOGIN: 'Вход',
  REGISTER: 'Регистрация',
};

export const AuthFormButtons = {
  LOGIN: {
    SUBMIT: 'Войти',
    LOADING: 'Загрузка...',
  },
  REGISTER: {
    SUBMIT: 'Зарегистрироваться',
    LOADING: 'Загрузка...',
  },
  GOOGLE: 'Войти через Google',
};

export const AuthFormLinks = {
  LOGIN: {
    QUESTION: 'Нет аккаунта?',
    ACTION: 'Зарегистрироваться',
  },
  REGISTER: {
    QUESTION: 'Уже зарегистрированы?',
    ACTION: 'Войти',
  },
};

export const AuthProviders = {
  CREDENTIALS: 'credentials',
  GOOGLE: 'google',
};
