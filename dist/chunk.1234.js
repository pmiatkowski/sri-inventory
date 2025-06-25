(function() {
  'use strict';

  // Function to handle the click event
  function handleClick(event) {
    event.preventDefault();
    const target = event.target;
    if (target.tagName === 'A' && target.classList.contains('external-link')) {
      window.open(target.href, '_blank');
    }
  }

  // Attach the click event listener to the document
  document.addEventListener('click', handleClick);
})();