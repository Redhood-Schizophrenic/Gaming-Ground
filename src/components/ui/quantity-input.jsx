import React from 'react'
import { Button } from './button'
import { Input } from './input'


export default function QuantityInput({ value = 0, onChange, required = false, props = null }) {
  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || 0;
    onChange(props || props === 0 ? { value: newValue, props } : newValue);
  };

  const handleDecrement = () => {
    onChange(props || props === 0 ? { value: value - 1, props } : value - 1);
  };

  const handleIncrement = () => {
    onChange(props || props === 0 ? { value: value + 1, props } : value + 1);
  };

  return (
    <div className='w-[140px]'>
      <label htmlFor="Quantity" className="sr-only"> Quantity </label>

      <div className="flex gap-2 items-center rounded-lg overflow-hidden border">
        <Button
          variant='outline'
          className='leading-none text-xl rounded-l-lg'
          disabled={
            required ? value <= 1 : value <= 0
          }
          onClick={handleDecrement}
        >
          -
        </Button>

        <Input
          type='text'
          value={value}
          onChange={handleInputChange}
          className='border-none text-center focus:outline-none'
        />

        <Button
          variant='outline'
          className='leading-none text-xl rounded-r-lg'
          onClick={handleIncrement}
        >
          +
        </Button>
      </div>
    </div>
  );
}
