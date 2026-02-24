import React, { useRef, useEffect } from 'react';
import styles from './CodeInput.module.css';

const CodeInput = ({ value = ['', '', '', '', '', ''], onChange, onComplete }) => {
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];

    useEffect(() => {
        // Focus sur le premier input au montage
        inputRefs[0].current?.focus();
    }, []);

    const handleChange = (index, e) => {
        const newValue = e.target.value;
        
        // Ne garder que le dernier caractère
        const lastChar = newValue.slice(-1);
        
        if (lastChar.match(/[0-9]/)) {
            // Mettre à jour la valeur
            const newCode = [...value];
            newCode[index] = lastChar;
            onChange(newCode);
            
            // Passer au champ suivant
            if (index < 5) {
                inputRefs[index + 1].current?.focus();
            }
            
            // Vérifier si le code est complet
            if (index === 5 && newCode.every(v => v !== '')) {
                onComplete?.();
            }
        } else if (newValue === '') {
            // Effacer la valeur
            const newCode = [...value];
            newCode[index] = '';
            onChange(newCode);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (value[index] === '' && index > 0) {
                // Revenir au champ précédent
                const newCode = [...value];
                newCode[index - 1] = '';
                onChange(newCode);
                inputRefs[index - 1].current?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs[index - 1].current?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedCode = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (pastedCode.length > 0) {
            const newCode = [...value];
            for (let i = 0; i < pastedCode.length; i++) {
                newCode[i] = pastedCode[i];
            }
            onChange(newCode);
            
            // Focus sur le dernier champ rempli ou le suivant
            const focusIndex = Math.min(pastedCode.length, 5);
            inputRefs[focusIndex].current?.focus();
            
            // Vérifier si complet
            if (pastedCode.length === 6) {
                onComplete?.();
            }
        }
    };

    return (
        <div className={styles.codeContainer}>
            {value.map((digit, index) => (
                <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    className={styles.codeInput}
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                />
            ))}
        </div>
    );
};

export default CodeInput;