       const display = document.getElementById("display");
        const buttons = document.querySelectorAll(".btn");

        let expression = "";

        function updateDisplay() {
            display.textContent = expression || "0";
        }

        function isOperator(char) {
            return ["+", "-", "*", "/"].includes(char);
        }

        function calculate() {
            try {
                let result = Function(
                    `"use strict"; return (${expression})`
                )();

                if (!Number.isFinite(result)) {
                    throw new Error();
                }

                expression = result.toString();
                updateDisplay();

            } catch {
                display.textContent = "Error";
                expression = "";
            }
        }

        function handleInput(value) {

            // Clear
            if (value === "C") {
                expression = "";
                updateDisplay();
                return;
            }

            // Backspace
            if (value === "⌫") {
                expression = expression.slice(0, -1);
                updateDisplay();
                return;
            }

            // Equals
            if (value === "=") {
                if (!expression) return;
                calculate();
                return;
            }

            // Percent
            if (value === "%") {
                if (!expression) return;

                try {
                    let result = Function(
                        `"use strict"; return (${expression})`
                    )();

                    expression = (result / 100).toString();
                    updateDisplay();

                } catch {
                    display.textContent = "Error";
                    expression = "";
                }

                return;
            }

            // Toggle Sign
            if (value === "±") {

                if (!expression) return;

                try {
                    let result = Function(
                        `"use strict"; return (${expression})`
                    )();

                    expression = (-result).toString();
                    updateDisplay();

                } catch {
                    display.textContent = "Error";
                    expression = "";
                }

                return;
            }

            // Decimal validation
            if (value === ".") {

                const lastNumber =
                    expression.split(/[+\-*/]/).pop();

                if (lastNumber.includes(".")) {
                    return;
                }

                if (
                    expression === "" ||
                    isOperator(expression.slice(-1))
                ) {
                    expression += "0";
                }
            }

            // Operator validation
            if (isOperator(value)) {

                if (expression === "") {

                    if (value === "-") {
                        expression = "-";
                    }

                    updateDisplay();
                    return;
                }

                if (
                    isOperator(expression.slice(-1))
                ) {
                    expression =
                        expression.slice(0, -1) + value;
                } else {
                    expression += value;
                }

                updateDisplay();
                return;
            }

            // Numbers
            expression += value;
            updateDisplay();
        }

        // Button Clicks
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                handleInput(button.dataset.value);
            });
        });

        // Keyboard Support
        document.addEventListener("keydown", (e) => {

            if (e.key >= "0" && e.key <= "9") {
                handleInput(e.key);
            }

            if (
                ["+", "-", "*", "/"].includes(e.key)
            ) {
                handleInput(e.key);
            }

            if (e.key === ".") {
                handleInput(".");
            }

            if (e.key === "%") {
                handleInput("%");
            }

            if (e.key === "Enter" || e.key === "=") {
                e.preventDefault();
                handleInput("=");
            }

            if (e.key === "Backspace") {
                handleInput("⌫");
            }

            if (e.key === "Escape" || e.key === "c") {
                handleInput("C");
            }
        });

        updateDisplay();