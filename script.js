// Variables with DOM elements
let newClientsInput = document.getElementById("newClients");
let oldClientsInput = document.getElementById("oldClients");
let progressBarCircle = document.getElementById("progress-bar");
let submitBtn = document.getElementById("submit");
let percentText = document.getElementById("percent-text");
let inputFields = document.querySelectorAll("input");
let errorMsgField = document.getElementById("error-message");

// Local variables for algorithm
let currentValue = 0;
let stopValue = 0;

// Function to reset UI values if percentage is 0
let resetData = () => {
  percentText.innerHTML = `Percent Capacity - ${0}%`;
  progressBarCircle.style.background = "#f9fafb";
};

// Function validating the inputs - Apologies, it's a bit long and ugly because I am trying to extract data to customize the potential error message.
// I'm using newC and oldC var names to reduce visual clutter. I'm sure there's a better way to execute this and will be happy to get some feedback on it.

const validateInput = () => {
  let regexPattern = /^\d+$/;
  let newC = newClientsInput.value;
  let oldC = oldClientsInput.value;

  switch (true) {
    case newC == "" || oldC == "":
      return {
        isValid: false,
        message: "Input fields cannot be empty.",
        affectedInputs: {
          newClients: newC == "" ? true : false,
          oldClients: oldC == "" ? true : false,
        },
      };

    case !regexPattern.test(newC) || !regexPattern.test(oldC):
      return {
        isValid: false,
        message: "Input fields must contain only valid positive integers.",
        affectedInputs: {
          newClients: regexPattern.test(newC) ? false : true,
          oldClients: regexPattern.test(oldC) ? false : true,
        },
      };

    case Number(newC) > Number(oldC):
      return {
        isValid: false,
        message: "Total clients amount can not be less than the new clients.",
        affectedInputs: {
          newClients: true,
          oldClients: true,
        },
      };

    default:
      return { isValid: true, message: "Inputs are valid" };
  }
};

//Main function updating the circular progress bar and the percentage text inside
const updateProgressBar = () => {
  stopValue = Number(
    (
      (Number(newClientsInput.value) / Number(oldClientsInput.value)) *
      100
    ).toFixed(2)
  );

  let progression = setInterval(() => {
    if (isNaN(stopValue) || stopValue == 0) {
      resetData();
      clearInterval([progression]);
      return;
    }

    currentValue++;

    percentText.innerHTML = `Percent Capacity - ${currentValue}%`;
    progressBarCircle.style.background = `conic-gradient(
        #489fd7 ${currentValue}%,
        #f9fafb 0 ${currentValue}%
        )`;

    if (currentValue >= stopValue) {
      clearInterval([progression]);
      currentValue = 0;
      stopValue = 0;
    }
  });
};

// Event listeners for both the "Submit" button and input fields

let triggerValidation = () => {
  clearErrors();
  let result = validateInput();
  if (result.isValid) {
    updateProgressBar();
  } else {
    displayErrors(result);
  }
};

["input", "keyup", "click"].forEach((event) => {
  if (event === "click") {
    submitBtn.addEventListener(event, () => {
      triggerValidation();
    });
    return;
  }
  if (event === "keyup") {
    newClientsInput.addEventListener(event, (ev) => {
      if (ev.key === "Enter") {
        triggerValidation();
      }
    });
    oldClientsInput.addEventListener(event, (ev) => {
      if (ev.key === "Enter") {
        triggerValidation();
      }
    });
    return;
  }
  newClientsInput.addEventListener(event, () => {
    triggerValidation();
  });

  oldClientsInput.addEventListener(event, () => {
    triggerValidation();
  });
});

//Error handling functions for the UI
displayErrors = (result) => {
  inputFields.forEach((inputElement) => {
    errorMsgField.innerHTML = result.message;
    let hasError = result.affectedInputs[inputElement.id];
    if (hasError) {
      inputElement.classList.add("input-error");
    }
  });
};

clearErrors = () => {
  inputFields.forEach((inputElement) => {
    inputElement.classList.remove("input-error");
    errorMsgField.innerHTML = "";
  });
};
