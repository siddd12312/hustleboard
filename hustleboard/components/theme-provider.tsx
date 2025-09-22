'use client'

import * as React from 'react'

import {
ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
}
from 'next-themes'



export function ThemeProvider({
children, ...theRest }
: ThemeProviderProps) {
return   <NextThemesProvider {
...theRest}
>
    {
children}
</NextThemesProvider>

}
