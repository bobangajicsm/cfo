import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';

import './app.css';
import Navbar from '~/components/navbar/navbar';
import ThemeLoadingScreen from './components/theme-loading-screen';

const getThemeConfig = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    primary: {
      main: '#6c72ff', // --accent--primary-1
      light: '#9a91fb', // --secondary--color-2
      dark: '#4a3aff',
    },
    secondary: {
      main: '#57c3ff', // --secondary--color-3
      light: '#8fc3ff', // --system--blue-200
      dark: '#086cd9', // --system--blue-400
    },
    background: {
      default: mode === 'dark' ? '#080f25' : '#ffffff', // --neutral--800 : --neutral--100
      paper: mode === 'dark' ? '#101935' : '#d9e1fa', // --secondary--color-1 : --neutral--200
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#212c4d', // --neutral--100 : --neutral--700
      secondary: mode === 'dark' ? '#aeb9e1' : '#7e89ac', // --neutral--400 : --neutral--500
    },
    divider: mode === 'dark' ? '#343b4f' : '#d1dbf9', // --secondary--color-4 : --neutral--300
    error: {
      main: '#ff5a65', // --system--300
      light: '#ffbec2', // --system--red-200
      dark: '#dc2b2b', // --system--red-400
    },
    warning: {
      main: '#ff9e2c', // --system--orange-300
      light: '#ffd19b', // --system--orange-200
      dark: '#d5691b', // --system--orange-400
    },
    info: {
      main: '#1d88fe', // --system--blue-300
      light: '#8fc3ff', // --system--blue-200
      dark: '#086cd9', // --system--blue-400
    },
    success: {
      main: '#14ca74', // --system--green-300
      light: '#7fdca4', // --system--green-200
      dark: '#11845b', // --system--green-400
    },
  },
  typography: {
    fontFamily: '"Mona Sans", ui-sans-serif, system-ui, sans-serif',
    fontSize: 12,
    htmlFontSize: 10,
    h1: {
      fontSize: '4.8rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '3.6rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '2.8rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '2.4rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.6rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.4rem',
    },
    body2: {
      fontSize: '1.2rem',
    },
    button: {
      fontSize: '1.4rem',
      textTransform: 'none' as const,
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
      defaultProps: {
        elevation: 0,
      },
      root: {
        MuiPopoverPaper: {
          MuiMenuPaper: {
            styleOverrides: {
              background: 'red',
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          color: 'var(--text-color-secondary)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'rgba(var(--bg-color-secondary-alpha), 0.82)',
          backdropFilter: 'blur(5px)',
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: '30px',
          borderRadius: '2px',
          backgroundColor: 'var(--mui-elements-bg-color)',
          color: 'var(--mui-elements-color)',
          lineHeight: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          boxShadow: '0px 20px 40px rgba(20, 20, 43, 0.24)',
        },
      },
    },
  },
});

const darkTheme = createTheme(getThemeConfig('dark'));
const lightTheme = createTheme(getThemeConfig('light'));

function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = true;

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      const hasDarkClass = document.body.classList.contains('dark');
      setIsDarkMode(
        hasDarkClass || (!document.body.classList.contains('light') && prefersDarkMode)
      );
    };

    // Initial check
    updateTheme();

    // Watch for class changes (e.g., from theme toggle)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateTheme();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [prefersDarkMode]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}

function ClientThemeWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }

  return <DynamicThemeProvider>{children}</DynamicThemeProvider>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.style.visibility = 'hidden';

                const applyTheme = () => {
                  try {
                    const saved = localStorage.getItem('theme');
                    const theme = saved === 'light' || saved === 'dark' 
                      ? saved 
                      : 'dark';

                    document.body.classList.remove('light', 'dark');
                    document.body.classList.add(theme);

                    document.documentElement.style.visibility = '';
                  } catch (e) {}
                };

                applyTheme();
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', applyTheme);
                }
                window.addEventListener('load', applyTheme);
              })();
            `,
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap"
        />
      </head>

      <body className="dark">
        <ThemeLoadingScreen />

        <ClientThemeWrapper>{children}</ClientThemeWrapper>
        <ScrollRestoration />
        <Scripts />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', () => {
                const loader = document.getElementById('theme-loader');
                if (loader) {
                  loader.classList.add('loaded');
                  setTimeout(() => loader.remove(), 400);
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Outlet />
      <Navbar />
    </>
  );
}
