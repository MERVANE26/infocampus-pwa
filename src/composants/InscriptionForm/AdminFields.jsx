import React from 'react';
import { FaUserTie, FaUniversity, FaBuilding, FaBriefcase, FaBook } from 'react-icons/fa';
import { Form } from 'react-bootstrap';
import styles from './AdminFields.module.css';

const AdminFields = ({ formData, onChange, onToggleTeacher }) => {
    return (
        <div className={styles.adminFields}>
            <h2 className={styles.sectionTitle}>
                <FaUserTie /> Administration
            </h2>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaUniversity /> Université <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Select
                    id="admin.university"
                    value={formData.university}
                    onChange={onChange}
                    required
                    className={styles.select}
                >
                    <option value="">Choisissez</option>
                    <option value="iug">Institut Universitaire du Golfe (IUG)</option>
                    <option value="uy1">Université de Yaoundé I</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaBuilding /> Service <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    id="admin.service"
                    value={formData.service}
                    onChange={onChange}
                    placeholder="Ex: Scolarité"
                    required
                    className={styles.input}
                />
            </Form.Group>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaBriefcase /> Fonction <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    id="admin.function"
                    value={formData.function}
                    onChange={onChange}
                    placeholder="Ex: Chef de service"
                    required
                    className={styles.input}
                />
            </Form.Group>

            {/* Option enseignant */}
            <div className={styles.checkboxGroup}>
                <Form.Check
                    type="checkbox"
                    id="admin.hasTeacherRole"
                    checked={formData.hasTeacherRole}
                    onChange={onToggleTeacher}
                    label="Je suis aussi enseignant"
                />
            </div>

            {formData.hasTeacherRole && (
                <div className={styles.teacherFields}>
                    <h3 className={styles.subSectionTitle}>
                        <FaBook /> Matières enseignées
                    </h3>
                    
                    <Form.Group className={styles.formGroup}>
                        <Form.Control
                            type="text"
                            id="admin.teacherRole.subjects"
                            value={formData.teacherRole.subjects}
                            onChange={onChange}
                            placeholder="Programmation, Réseaux..."
                            className={styles.input}
                        />
                    </Form.Group>
                </div>
            )}
        </div>
    );
};

export default AdminFields;