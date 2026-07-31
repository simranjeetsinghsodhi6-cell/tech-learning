document.documentElement.classList.add('js-enabled');

const startLink = document.querySelector('a[href="#paths"]');
if (startLink) {
  startLink.addEventListener('click', () => {
    console.info('Tech Learning: learning paths opened.');
  });
}
