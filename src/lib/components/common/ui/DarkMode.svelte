<script lang='ts'>
    import { onMount } from 'svelte';
  
    let darkMode = false;
  
    onMount(() => {
      // Get theme from local storage
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        darkMode = storedTheme === 'dark';
      } else {
        // Or set based on system preference
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
  
      // Apply the theme
      document.body.classList = darkMode ? 'dark' : 'light';
    });
  
    function toggleDarkMode() {
      darkMode = !darkMode;
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      document.body.classList = darkMode ? 'dark' : 'light';
    }
  </script>
  
  <button on:click={toggleDarkMode}>
    Toggle Dark Mode
  </button>