import React, { useState, FormEvent } from 'react';

interface CardRequestFormState {
    cardType: 'МИР' | 'UnionPay' | 'Visa' | 'MasterCard';
    cardCategory: 'Debit' | 'Credit';
    cardBalance: number;
    cardCurrency: 'RUB' | 'EUR' | 'USD' | 'CNY';
}

const CardRequestForm: React.FC = () => {
    const [formState, setFormState] = useState<CardRequestFormState>({
        cardType: 'МИР', // Default value
        cardCategory: 'Debit',
        cardBalance: 0,
        cardCurrency: 'RUB',
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
        if (!formState.cardType || !formState.cardCategory || formState.cardBalance <= 0 || !formState.cardCurrency) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const response = await fetch('/api/card-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        <form onSubmit={handleSubmit}>
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
                <label htmlFor="cardCurrency">Валюта карты:</label>
                <select 
                    id="cardCurrency" 
                    name="cardCurrency" 
                    value={formState.cardCurrency} 
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
