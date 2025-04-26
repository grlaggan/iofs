export default class FormValidate {
  selectors = {
    form: "[data-js-form]",
    formErrors: "[data-js-form-input-errors]",
  };

  errorMessages = {
    valueMissing: () => "Пожалуйста, заполните это поле",
    patternMismatch: ({ title }) => title || "Данные не соответствуют формату",
    tooShort: () => "Слишком короткое значение",
    tooLong: () => "Слишком длинное значение",
    customError: () => "Пароли не совпадают.",
  };

  manageErrors(formValidateElement, errorMessages) {
    const fieldErrorsElement = formValidateElement.parentElement.querySelector(
      this.selectors.formErrors
    );

    fieldErrorsElement.innerHTML = errorMessages
      .map((message) => `<span class="field__error">${message}</span>`)
      .join("");
  }

  validateForm(formValidateElement) {
    const errors = formValidateElement.validity;
    const errorMessages = [];

    Object.entries(this.errorMessages).forEach(
      ([errorType, getErrorMessage]) => {
        if (errors[errorType]) {
          errorMessages.push(getErrorMessage(formValidateElement));
        }
      }
    );

    this.manageErrors(formValidateElement, errorMessages);

    const isValid = errorMessages.length === 0;

    return isValid;
  }

  onBlur(event) {
    const isFormField = event.target.closest(this.selectors.form);
    const isRequired = event.target.required;

    if (isFormField && isRequired) {
      this.validateForm(event.target);
    }
  }

  onSubmit(event) {
    const isFormElement = event.target.matches(this.selectors.form);

    if (!isFormElement) {
      return;
    }

    const requiredElements = [...event.target.elements].filter(
      (element) => element.required
    );

    let isValidForm = true;

    requiredElements.forEach((element) => {
      const isFieldValid = this.validateForm(element);

      if (!isFieldValid) {
        isValidForm = false;
      }

      if (
        document.querySelector("#password1")?.value !==
        document.querySelector("#password2")?.value
      ) {
        document
          .querySelector("#password1")
          .setCustomValidity("Пароли не совпадают.");
      }
    });

    return isValidForm;
  }
}
