import React from 'react'
import { Button } from './button'
import { Input } from './input'


export default function QuantityInput({ value = 0, onChange, required = false }) {
  return (
    <div className='w-[170px]'>
      <label htmlFor="Quantity" className="sr-only"> Quantity </label>

      <div className="flex gap-2 items-center rounded-sm p-2">
        <Button
          className='leading-none text-xl'
          disabled={
            required ? value <= 1 : value <= 0
          }
          onClick={() => onChange(value - 1)}
        >
          -
        </Button>

        <Input
          type='text'
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className='border-none text-center'
        />

        <Button
          className='leading-none text-xl'
          onClick={() => onChange(value + 1)}
        >
          +
        </Button>
      </div>
    </div>
  )
}
