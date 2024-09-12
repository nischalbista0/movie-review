import React from 'react'

export const CastBody = ({ name }) => {
  return (
    <div className="rounded-md sm:rounded-lg bg-[#305973] w-fit px-2 py-1 sm:px-2 sm:py-2">
      <h1 className="text-[8px] sm:text-xs md:text-sm text-white">{name}</h1>
    </div>
  )
}
