import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemeProvider defaultTheme="system" enableSystem attribute="class">
      {children}
    </NextThemeProvider>
  );
};
