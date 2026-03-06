// Utility helpers for formatting user profile values into localized display strings.
// When user data stores codes (e.g., l1, gl, soirs), these helpers map them to
// human-readable labels using i18next translations.

export function formatUserField(field, value, t) {
  if (!value) return '';

  switch (field) {
    case 'niveau':
      return t(`auth.level.${value}`, { defaultValue: value });
    case 'filiere':
      return t(`auth.field.${value}`, { defaultValue: value });
    case 'groupe':
      return t(`auth.groupOptions.${value}`, { defaultValue: value });
    case 'campusId':
      return t(`auth.campusName.${value}`, { defaultValue: value });
    case 'teacherUniversityIds':
      if (Array.isArray(value)) {
        return value
          .map((id) => t(`auth.campusName.${id}`, { defaultValue: id }))
          .filter(Boolean)
          .join(', ');
      }
      return t(`auth.campusName.${value}`, { defaultValue: value });
    default:
      return value;
  }
}
