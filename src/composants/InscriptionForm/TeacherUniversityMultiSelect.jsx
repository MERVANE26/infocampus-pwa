import React from "react";
import { Form } from "react-bootstrap";

const TeacherUniversityMultiSelect = ({
  universities,
  selected,
  onChange
}) => {

  const handleSelect = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(
      (option) => option.value // 🔥 this is the university _id
    );

    onChange(selectedIds);
  };

  return (
    <Form.Group className="mt-3">
      <Form.Label>Universités *</Form.Label>
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
        Maintenez CTRL (ou CMD sur Mac) pour sélectionner plusieurs universités.
      </Form.Text>
    </Form.Group>
  );
};

export default TeacherUniversityMultiSelect;
