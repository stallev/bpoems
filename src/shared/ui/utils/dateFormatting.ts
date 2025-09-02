import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const simpleFormatDate = (date: Date) => {
  return format(date, 'dd MMMM yyyy', { locale: ru });
};
