import { createTheme } from "@mui/material";

const PrimaryTheme = () => {
  const theme = createTheme({
    typography: {
      h1: {
        fontFamily: '"Abril Fatface", cursive',
      },
    },
  });
};

export { PrimaryTheme };
