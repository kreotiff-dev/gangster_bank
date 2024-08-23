import React, { useState, FormEvent } from 'react';
import styles from '../styles/Modal.module.css';
const apiUrl = process.env.REACT_APP_API_URL;

interface CardRequestFormState {
    cardType: 'МИР' | 'UnionPay' | 'Visa' | 'MasterCard';
    cardCategory: 'Debit' | 'Credit';
    cardBalance: number;
    currency: 'RUB' | 'EUR' | 'USD' | 'CNY';
}

const CardRequestForm: React.FC = () => {
    const [formState, setFormState] = useState<CardRequestFormState>({
        cardType: 'МИР', // Default value
        cardCategory: 'Debit',
        cardBalance: 0,
        currency: 'RUB',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: name === 'cardBalance' ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validation (all fields must be filled)
        if (!formState.cardType || !formState.cardCategory || formState.cardBalance <= 0 || !formState.currency) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/cards/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formState),
            });

            if (response.ok) {
                alert('Заявка отправлена успешно!');
            } else {
                alert('Ошибка при отправке заявки');
            }
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            alert('Ошибка при отправке заявки');
        }
    };

    return (
        <form className={styles.formCardRequest} onSubmit={handleSubmit}>
            <div>
                <label htmlFor="cardType">Тип карты:</label>
                <select 
                    id="cardType" 
                    name="cardType" 
                    value={formState.cardType} 
                    onChange={handleInputChange} 
                    required
                >
                    <option value="МИР">МИР</option>
                    <option value="UnionPay">UnionPay</option>
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                </select>
            </div>

            <div>
                <label>Категория карты:</label>
                <label>
                    <input 
                        type="radio" 
                        name="cardCategory" 
                        value="Debit" 
                        checked={formState.cardCategory === 'Debit'} 
                        onChange={handleInputChange} 
                        required 
                    />
                    Дебетовая
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="cardCategory" 
                        value="Credit" 
                        checked={formState.cardCategory === 'Credit'} 
                        onChange={handleInputChange} 
                        required
                    />
                    Кредитная
                </label>
            </div>

            <div>
                <label htmlFor="cardBalance">Баланс карты:</label>
                <input 
                    type="number" 
                    id="cardBalance" 
                    name="cardBalance" 
                    value={formState.cardBalance} 
                    onChange={handleInputChange} 
                    required 
                />
            </div>

            <div>
                <label htmlFor="currency">Валюта карты:</label>
                <select 
                    id="currency" 
                    name="currency" 
                    value={formState.currency} 
                    onChange={handleInputChange} 
                    required
                >
                    <option value="RUB">Рубли</option>
                    <option value="EUR">Евро</option>
                    <option value="USD">Доллары</option>
                    <option value="CNY">Юань</option>
                </select>
            </div>

            <button type="submit">Заказать карту</button>
        </form>
    );
};

export default CardRequestForm;
