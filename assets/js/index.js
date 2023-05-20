const calculateButton = document.querySelector('.calculator__button');
const dayField = document.querySelector('#day');
const monthField = document.querySelector('#month');
const yearField = document.querySelector('#year');
const fields = [dayField, monthField, yearField];

const init = () => {
    calculateButton.addEventListener('click', handleCalculate);

    fields.forEach((field) => {
        field.addEventListener('input', handleInput);
    });
};

const handleCalculate = () => {
    const isComplete = checkIfFieldsAreComplete();
    const isValid = validateFields();

    if (isComplete && isValid) {
        console.log('calculate');
    }
};

const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');

    showError(e.target.id, false);
};

const checkIfFieldsAreComplete = () => {
    const isComplete = [];

    fields.forEach((field) => {
        if (!field.value) {
            showError(field.id);
        }

        isComplete.push(field.value);
    });

    return isComplete.every((field) => field);
};

const validateFields = () => {
    const result = [];

    const validate = (field, limit, error) => {
        if (field.value) {
            const withinLimit = parseFloat(field.value) <= limit;

            if (!withinLimit) {
                updateErrorText(field.id, error);
                showError(field.id);
            }

            result.push(withinLimit);
        }
    };

    validate(dayField, 31, 'Must be a valid day');
    validate(monthField, 12, 'Must be a valid month');
    validate(yearField, moment().year(), 'Must be in the past');

    const validFields = result.every((field) => field);

    if (validFields) {
        return validateDate();
    }

    return false;
};

const validateDate = () => {
    const day = dayField.value.padStart(2, '0');
    const month = monthField.value.padStart(2, '0');
    const year = yearField.value;

    const validDate = moment(`${year}-${month}-${day}`).isValid();

    if (!validDate) {
        updateErrorText(dayField.id, 'Must be a valid date');
        [monthField.id, yearField.id].forEach((field) =>
            updateErrorText(field, ''),
        );

        fields.forEach((field) => showError(field.id));
    } else {
        fields.forEach((field) => showError(field.id, false));
    }

    return validDate;
};

const updateErrorText = (id, error) => {
    const currentInput = document.getElementById(id);
    const errorElement = currentInput
        .closest('.calculator__input-wrapper')
        .querySelector('.calculator__error');

    errorElement.textContent = error;
};

const showError = (id, show = true) => {
    const currentInput = document.getElementById(id);
    const inputWrapper = currentInput.closest('.calculator__input-wrapper');

    if (show) {
        inputWrapper.classList.add('invalid');
    } else {
        inputWrapper.classList.remove('invalid');
    }
};

init();
