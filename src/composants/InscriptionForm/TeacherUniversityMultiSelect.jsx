import React from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";

const TeacherUniversityMultiSelect = ({
  universities,
  selected,
  onChange
}) => {
  const { t } = useTranslation();

  const handleSelect = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(
      (option) => option.value // 🔥 this is the university _id
    );

    onChange(selectedIds);
  };

  return (
    <Form.Group className="mt-3">
      <Form.Label>{t('auth.universities')} *</Form.Label>
      <Form.Select
        multiple
        value={selected}
        onChange={handleSelect}
      >
        {universities.map((uni) => (
          <option key={uni.id} value={uni.id}>
            {uni.name}
          </option>
        ))}
      </Form.Select>
      <Form.Text>
        {t('auth.multiSelectHelp')}
      </Form.Text>
    </Form.Group>
  );
};

export default TeacherUniversityMultiSelect;
