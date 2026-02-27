import React from 'react';
import { FaChalkboardTeacher, FaBook, FaBriefcase, FaUserTie } from 'react-icons/fa';
import { Form } from 'react-bootstrap';
import styles from './TeacherFields.module.css';
import TeacherUniversityMultiSelect from './TeacherUniversityMultiSelect';

const TeacherFields = ({ formData, onChange, onToggleAdmin ,universities}) => {

    
    return (
        <div className={styles.teacherFields}>
            <h2 className={styles.sectionTitle}>
                <FaChalkboardTeacher /> Enseignant
            </h2>

            <TeacherUniversityMultiSelect
                universities={universities}
                selected={formData.universities}
                onChange={(values) =>
                    onChange({
                        target: {
                            id: "teacher.universities",
                            value: values
                        }
                    })
                }
            />


            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaBook /> Matières <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    id="teacher.subjects"
                    value={formData.subjects}
                    onChange={onChange}
                    placeholder="Programmation, Réseaux..."
                    required
                    className={styles.input}
                />
            </Form.Group>

            <Form.Group className={styles.formGroup}>
                <Form.Label>
                    <FaBriefcase /> Statut <span className={styles.required}>*</span>
                </Form.Label>
                <Form.Select
                    id="teacher.status"
                    value={formData.status}
                    onChange={onChange}
                    required
                    className={styles.select}
                >
                    <option value="permanent">Permanent</option>
                    <option value="vacataire">Vacataire</option>
                    <option value="doctorant">Doctorant/Étudiant</option>
                </Form.Select>
            </Form.Group>

            {/* Option administratif */}
            <div className={styles.checkboxGroup}>
                <Form.Check
                    type="checkbox"
                    id="teacher.hasAdminRole"
                    checked={formData.hasAdminRole}
                    onChange={onToggleAdmin}
                    label="J'ai aussi un rôle administratif"
                />
            </div>

            {formData.hasAdminRole && (
                <div className={styles.adminFields}>
                    <h3 className={styles.subSectionTitle}>
                        <FaUserTie /> Rôle administratif
                    </h3>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label>Service</Form.Label>
                        <Form.Control
                            type="text"
                            id="teacher.adminRole.service"
                            value={formData.adminRole.service}
                            onChange={onChange}
                            placeholder="Ex: Scolarité"
                            className={styles.input}
                        />
                    </Form.Group>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label>Fonction</Form.Label>
                        <Form.Control
                            type="text"
                            id="teacher.adminRole.function"
                            value={formData.adminRole.function}
                            onChange={onChange}
                            placeholder="Ex: Chef"
                            className={styles.input}
                        />
                    </Form.Group>
                </div>
            )}
        </div>
    );
};

export default TeacherFields;