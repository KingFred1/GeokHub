"use client"
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { X } from "lucide-react";



const SearchFormReset = () => {
  const reset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;

    if (form) form.reset();
  };
  return (
    <Button
      type="reset"
      size="sm"
      variant="ghost"
      onClick={reset}
      className="absolute left-0 h-full rounded-l-none bg-transparent hover:bg-transparent"
    >
      <Link href="/" className="size-[50px] rounded-full bg-white flex justify-center items-center !important" >
      <X className='size-5' />
      </Link>
      {/* <span className="sr-only">Search</span> */}
    </Button>
  );
};

export default SearchFormReset;
