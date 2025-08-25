export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('ru-RU');
};

export const getCategoryStatusText = (isActive: boolean): string => {
  return isActive ? 'Активна' : 'Неактивна';
};

export const getCategoryStatusVariant = (isActive: boolean): 'default' | 'secondary' => {
  return isActive ? 'default' : 'secondary';
};

export const calculateInactiveCategories = (total: number, active: number): number => {
  return total - active;
};

export const calculateActivePercentage = (total: number, active: number): number => {
  return total > 0 ? Math.round((active / total) * 100) : 0;
};

export const prepareFormData = (data: {
  translations: { EN: string; RU: string; UA: string };
  isActive: boolean;
  order?: number;
}): FormData => {
  const formData = new FormData();
  formData.append('translations.EN', data.translations.EN);
  formData.append('translations.RU', data.translations.RU);
  formData.append('translations.UA', data.translations.UA);
  formData.append('isActive', data.isActive.toString());
  if (data.order !== undefined) {
    formData.append('order', data.order.toString());
  }
  return formData;
};
