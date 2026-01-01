import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, InputGroup } from "react-bootstrap";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { useSounds } from "./SoundProvider";

interface IMonopolyAmountInputProps {
  amount: number | null;
  setAmount: (amount: number | null) => void;
  id?: string;
  autoFocus?: boolean;
  showQuickButtons?: boolean;
}

// Common Monopoly denominations for quick selection
const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

const MonopolyAmountInput: React.FC<IMonopolyAmountInputProps> = ({
  amount,
  setAmount,
  id,
  autoFocus = false,
  showQuickButtons = true
}) => {
  const [inputValue, setInputValue] = useState("");
  const numberInputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSounds();

  useEffect(() => {
    if (autoFocus && numberInputRef.current !== null) {
      numberInputRef.current.focus();
    }
  }, [numberInputRef]);

  // When the external amount changes, update the internal
  useEffect(() => {
    setInputValue(amount === 0 || amount === null ? "" : `${amount}`);
  }, [amount]);

  // When the internal amount changes, update the external
  useEffect(() => {
    setAmount(inputValue === "" ? null : parseFloat(inputValue));
  }, [inputValue]);

  const multiply = (multiplier: number) => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      setInputValue(`${multiplier * value}`);
    }

    // Refocus the number input. Since useState is async, we need to wait for the value to be updated
    setTimeout(() => {
      if (numberInputRef.current !== null) {
        numberInputRef.current.focus();
        numberInputRef.current.setSelectionRange(-1, -1);
      }
    }, 50);
  };

  const setQuickAmount = (value: number) => {
    setInputValue(`${value}`);
    playSound('click');
    
    // Refocus the number input
    setTimeout(() => {
      if (numberInputRef.current !== null) {
        numberInputRef.current.focus();
        numberInputRef.current.setSelectionRange(-1, -1);
      }
    }, 50);
  };

  return (
    <div className="monopoly-amount-input">
      <InputGroup style={{ display: "grid", gridTemplateColumns: showQuickButtons ? "2fr 7fr 2fr" : "1fr" }}>
        {showQuickButtons && (
          <InputGroup.Prepend>
            <Button block variant="warning" onClick={() => multiply(1000000)}>
              M
            </Button>
          </InputGroup.Prepend>
        )}

        <NumberFormat
          allowNegative={false}
          thousandSeparator={true}
          prefix="$"
          id={id}
          value={inputValue}
          onValueChange={({ value }: NumberFormatValues) => setInputValue(value)}
          className="form-control text-center w-100"
          autoComplete="off"
          getInputRef={numberInputRef}
          inputMode="decimal"
          placeholder="0"
        />

        {showQuickButtons && (
          <InputGroup.Append>
            <Button block variant="primary" onClick={() => multiply(1000)}>
              K
            </Button>
          </InputGroup.Append>
        )}
      </InputGroup>

      {showQuickButtons && (
        <div className="quick-amounts mt-2">
          <small className="text-muted d-block mb-1">Valores rápidos:</small>
          <ButtonGroup size="sm" className="w-100">
            {QUICK_AMOUNTS.map((value) => (
              <Button
                key={value}
                variant="outline-monopoly"
                className="quick-amount-btn"
                onClick={() => setQuickAmount(value)}
              >
                ${value.toLocaleString()}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      )}
    </div>
  );
};

export default MonopolyAmountInput;
