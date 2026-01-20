/**
 * Re-applies light-theme class on :root and .admin-dashboard after load.
 * Runs multiple times with a delay to handle hydration / late DOM.
 *
 * @param {number} maxRuns - Max number of runs (default 5)
 * @param {number} delayMs - Delay between runs in ms (default 200)
 */
export function autoFixThemeOnLoad(maxRuns = 5, delayMs = 200) {
  if (typeof window === 'undefined') return;

  let run = 0;

  const apply = () => {
    run += 1;
    const root = document.documentElement;
    const adminDashboard = document.querySelector('.admin-dashboard');

    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
    if (adminDashboard) {
      adminDashboard.classList.add('light-theme');
      adminDashboard.classList.remove('dark-theme');
    }

    if (run < maxRuns) {
      setTimeout(apply, delayMs);
    }
  };

  apply();
}
