/**
 * Theme Fixer Utility
 * Automatically detects and fixes theme inconsistencies
 * 
 * Usage:
 * - Import and call fixTheme() when needed
 * - Can be called on page load, theme change, or error recovery
 */

/**
 * Detects theme inconsistencies and returns issues found
 */
export function detectThemeIssues() {
  const issues = [];
  
  try {
    // Check localStorage theme
    const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
    
    // Check :root theme class
    const rootHasDark = document.documentElement.classList.contains('dark-theme');
    const rootHasLight = document.documentElement.classList.contains('light-theme');
    
    // Check admin-dashboard theme class
    const adminDashboard = document.querySelector('.admin-dashboard');
    const dashboardHasDark = adminDashboard?.classList.contains('dark-theme');
    const dashboardHasLight = adminDashboard?.classList.contains('light-theme');
    
    // Check CSS variables
    const computedStyle = window.getComputedStyle(document.documentElement);
    const adminBg = computedStyle.getPropertyValue('--admin-bg').trim();
    const adminBgSecondary = computedStyle.getPropertyValue('--admin-bg-secondary').trim();
    
    // Issue 1: Root and dashboard theme mismatch
    if (savedTheme === 'dark' && (!rootHasDark || !dashboardHasDark)) {
      issues.push({
        type: 'theme_class_mismatch',
        severity: 'high',
        message: 'Dark theme class not applied correctly',
        expected: 'dark-theme',
        actual: {
          root: rootHasDark ? 'dark-theme' : rootHasLight ? 'light-theme' : 'none',
          dashboard: dashboardHasDark ? 'dark-theme' : dashboardHasLight ? 'light-theme' : 'none'
        }
      });
    }
    
    if (savedTheme === 'light' && (!rootHasLight || !dashboardHasLight)) {
      issues.push({
        type: 'theme_class_mismatch',
        severity: 'high',
        message: 'Light theme class not applied correctly',
        expected: 'light-theme',
        actual: {
          root: rootHasDark ? 'dark-theme' : rootHasLight ? 'light-theme' : 'none',
          dashboard: dashboardHasDark ? 'dark-theme' : dashboardHasLight ? 'light-theme' : 'none'
        }
      });
    }
    
    // Issue 2: Both themes active (conflict)
    if ((rootHasDark && rootHasLight) || (dashboardHasDark && dashboardHasLight)) {
      issues.push({
        type: 'theme_conflict',
        severity: 'critical',
        message: 'Both dark and light theme classes are active',
        root: { dark: rootHasDark, light: rootHasLight },
        dashboard: { dark: dashboardHasDark, light: dashboardHasLight }
      });
    }
    
    // Issue 3: CSS variables not set (fallback to white)
    if (savedTheme === 'dark' && (adminBg === '' || adminBg === '#ffffff' || adminBg === 'rgb(255, 255, 255)')) {
      issues.push({
        type: 'css_variable_missing',
        severity: 'high',
        message: 'Dark theme CSS variables not properly set',
        variable: '--admin-bg',
        value: adminBg || 'empty'
      });
    }
    
    // Issue 4: Admin dashboard element missing
    if (!adminDashboard) {
      issues.push({
        type: 'element_missing',
        severity: 'medium',
        message: 'Admin dashboard element not found',
        selector: '.admin-dashboard'
      });
    }
    
    // Issue 5: Auto theme detection issue
    if (savedTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const expectedTheme = prefersDark ? 'dark' : 'light';
      const actualTheme = rootHasDark ? 'dark' : rootHasLight ? 'light' : 'none';
      
      if (actualTheme !== expectedTheme) {
        issues.push({
          type: 'auto_theme_mismatch',
          severity: 'medium',
          message: 'Auto theme not matching system preference',
          expected: expectedTheme,
          actual: actualTheme,
          systemPreference: prefersDark ? 'dark' : 'light'
        });
      }
    }
    
  } catch (error) {
    issues.push({
      type: 'detection_error',
      severity: 'critical',
      message: 'Error detecting theme issues',
      error: error.message
    });
  }
  
  return {
    hasIssues: issues.length > 0,
    issues,
    timestamp: new Date().toISOString()
  };
}

/**
 * Fixes theme issues automatically
 */
export function fixTheme(options = {}) {
  const {
    force = false,
    silent = false,
    onFix = null
  } = options;
  
  const results = {
    fixed: [],
    errors: [],
    skipped: []
  };
  
  try {
    // Detect issues
    const detection = detectThemeIssues();
    
    if (!detection.hasIssues && !force) {
      if (!silent) {
        console.log('[Theme Fixer] No issues detected. Theme is working correctly.');
      }
      return results;
    }
    
    if (!silent) {
      console.log(`[Theme Fixer] Found ${detection.issues.length} issue(s). Starting fix...`);
    }
    
    // Get saved theme
    const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
    const adminDashboard = document.querySelector('.admin-dashboard');
    
    // Fix 1: Apply theme classes correctly
    if (detection.issues.some(issue => issue.type === 'theme_class_mismatch' || issue.type === 'theme_conflict')) {
      try {
        // Remove all theme classes first
        document.documentElement.classList.remove('dark-theme', 'light-theme');
        if (adminDashboard) {
          adminDashboard.classList.remove('dark-theme', 'light-theme');
        }
        
        // Apply correct theme
        let themeToApply = savedTheme;
        
        if (savedTheme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          themeToApply = prefersDark ? 'dark' : 'light';
        }
        
        if (themeToApply === 'dark') {
          document.documentElement.classList.add('dark-theme');
          document.documentElement.classList.remove('light-theme');
          if (adminDashboard) {
            adminDashboard.classList.add('dark-theme');
            adminDashboard.classList.remove('light-theme');
          }
        } else {
          document.documentElement.classList.add('light-theme');
          document.documentElement.classList.remove('dark-theme');
          if (adminDashboard) {
            adminDashboard.classList.add('light-theme');
            adminDashboard.classList.remove('dark-theme');
          }
        }
        
        results.fixed.push({
          type: 'theme_classes',
          message: `Applied ${themeToApply} theme classes to root and admin-dashboard`
        });
        
        if (onFix) onFix('theme_classes', themeToApply);
      } catch (error) {
        results.errors.push({
          type: 'theme_classes',
          error: error.message
        });
      }
    }
    
    // Fix 2: Ensure CSS variables are set
    if (detection.issues.some(issue => issue.type === 'css_variable_missing')) {
      try {
        const themeToApply = savedTheme === 'auto' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : savedTheme;
        
        // Force re-apply theme to trigger CSS variable updates
        if (adminDashboard) {
          // Trigger a reflow to ensure CSS variables are recalculated
          void adminDashboard.offsetHeight;
          
          // Re-apply theme class to ensure CSS variables are set
          if (themeToApply === 'dark') {
            adminDashboard.classList.add('dark-theme');
          } else {
            adminDashboard.classList.add('light-theme');
          }
        }
        
        results.fixed.push({
          type: 'css_variables',
          message: 'CSS variables refreshed'
        });
        
        if (onFix) onFix('css_variables', themeToApply);
      } catch (error) {
        results.errors.push({
          type: 'css_variables',
          error: error.message
        });
      }
    }
    
    // Fix 3: Handle missing admin-dashboard element
    if (detection.issues.some(issue => issue.type === 'element_missing')) {
      results.skipped.push({
        type: 'element_missing',
        message: 'Admin dashboard element not found. This may be normal if called before DOM is ready.'
      });
    }
    
    // Fix 4: Auto theme detection
    if (detection.issues.some(issue => issue.type === 'auto_theme_mismatch')) {
      try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const themeToApply = prefersDark ? 'dark' : 'light';
        
        document.documentElement.classList.remove('dark-theme', 'light-theme');
        if (adminDashboard) {
          adminDashboard.classList.remove('dark-theme', 'light-theme');
        }
        
        if (themeToApply === 'dark') {
          document.documentElement.classList.add('dark-theme');
          if (adminDashboard) {
            adminDashboard.classList.add('dark-theme');
          }
        } else {
          document.documentElement.classList.add('light-theme');
          if (adminDashboard) {
            adminDashboard.classList.add('light-theme');
          }
        }
        
        results.fixed.push({
          type: 'auto_theme',
          message: `Auto theme corrected to ${themeToApply} based on system preference`
        });
        
        if (onFix) onFix('auto_theme', themeToApply);
      } catch (error) {
        results.errors.push({
          type: 'auto_theme',
          error: error.message
        });
      }
    }
    
    if (!silent) {
      console.log('[Theme Fixer] Fix complete:', {
        fixed: results.fixed.length,
        errors: results.errors.length,
        skipped: results.skipped.length
      });
      
      if (results.fixed.length > 0) {
        console.log('[Theme Fixer] Fixed issues:', results.fixed);
      }
      
      if (results.errors.length > 0) {
        console.error('[Theme Fixer] Errors:', results.errors);
      }
    }
    
  } catch (error) {
    results.errors.push({
      type: 'general',
      error: error.message
    });
    
    if (!silent) {
      console.error('[Theme Fixer] Critical error:', error);
    }
  }
  
  return results;
}

/**
 * Auto-fix theme on page load with retry mechanism
 */
export function autoFixThemeOnLoad(maxRetries = 5, retryDelay = 500) {
  let retries = 0;
  
  const attemptFix = () => {
    const adminDashboard = document.querySelector('.admin-dashboard');
    
    if (adminDashboard || retries >= maxRetries) {
      if (adminDashboard) {
        fixTheme({ silent: false });
      } else if (retries < maxRetries) {
        console.warn(`[Theme Fixer] Admin dashboard not found. Retrying... (${retries + 1}/${maxRetries})`);
        setTimeout(attemptFix, retryDelay);
        retries++;
      } else {
        console.error('[Theme Fixer] Max retries reached. Admin dashboard element not found.');
      }
    }
  };
  
  // Try immediately
  attemptFix();
}

/**
 * Watch for theme changes and auto-fix
 */
export function watchThemeChanges() {
  // Watch for localStorage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'homiebites_theme') {
      console.log('[Theme Fixer] Theme changed in localStorage. Auto-fixing...');
      setTimeout(() => fixTheme({ silent: false }), 100);
    }
  });
  
  // Watch for class changes on admin-dashboard
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList.contains('admin-dashboard')) {
          const hasDark = target.classList.contains('dark-theme');
          const hasLight = target.classList.contains('light-theme');
          const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
          
          // Check for conflicts
          if ((hasDark && hasLight) || 
              (savedTheme === 'dark' && !hasDark) || 
              (savedTheme === 'light' && !hasLight)) {
            console.warn('[Theme Fixer] Detected theme inconsistency. Auto-fixing...');
            setTimeout(() => fixTheme({ silent: false }), 100);
          }
        }
      }
    });
  });
  
  // Start observing
  const adminDashboard = document.querySelector('.admin-dashboard');
  if (adminDashboard) {
    observer.observe(adminDashboard, {
      attributes: true,
      attributeFilter: ['class']
    });
  } else {
    // Retry when DOM is ready
    const checkAndObserve = setInterval(() => {
      const dashboard = document.querySelector('.admin-dashboard');
      if (dashboard) {
        observer.observe(dashboard, {
          attributes: true,
          attributeFilter: ['class']
        });
        clearInterval(checkAndObserve);
      }
    }, 100);
  }
  
  return observer;
}

/**
 * Manual theme fix function for use in console or error handlers
 */
export function manualThemeFix() {
  console.log('[Theme Fixer] Manual fix triggered');
  const results = fixTheme({ silent: false });
  
  if (results.fixed.length > 0) {
    console.log('✅ Theme fixed successfully!');
  } else if (results.errors.length > 0) {
    console.error('❌ Errors occurred during fix:', results.errors);
  } else {
    console.log('ℹ️ No issues found or already fixed.');
  }
  
  return results;
}

// Make it available globally for console access
if (typeof window !== 'undefined') {
  window.fixTheme = manualThemeFix;
  window.detectThemeIssues = detectThemeIssues;
}
