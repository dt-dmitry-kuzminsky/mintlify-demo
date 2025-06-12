window.addEventListener('DOMContentLoaded', () => {
  // Find the HTML element with the ID 'js-test-output'.
  const testContainer = document.getElementById('js-test-output');
  
  // Check if the element actually exists on the page.
  if (testContainer) {
      // If it exists, change its text to show a success message.
      testContainer.textContent = '✅ Success! The JavaScript file is loaded and running.';
  
      // Apply some CSS styles to make it visually obvious.
      testContainer.style.padding = '20px';
      testContainer.style.marginTop = '1em';
      testContainer.style.border = '2px solid #0077c2';
      testContainer.style.borderRadius = '8px';
      testContainer.style.backgroundColor = '#eef7ff';
      testContainer.style.color = '#004a7c';
      testContainer.style.fontFamily = 'sans-serif';
      testContainer.style.fontWeight = 'bold';
  } else {
      // If the element couldn't be found, log an error in the browser's developer console.
      console.error("Error: The target element with id 'js-test-output' was not found on the page.");
  }
} 