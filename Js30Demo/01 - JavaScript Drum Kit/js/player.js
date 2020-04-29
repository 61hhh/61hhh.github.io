<link rel="stylesheet" class="aplayer-secondary-style-marker" href="\assets\css\APlayer.min.css"><script src="\assets\js\APlayer.min.js" class="aplayer-secondary-script-marker"></script><script class="meting-secondary-script-marker" src="\assets\js\Meting.min.js"></script>(function () {
  function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if(!audio) return false;

    audio.currentTime = 0;
    audio.play();

    key.classList.add('playing');
  }

  const keys = document.querySelectorAll('.key');

  keys.forEach( key => {
    return key.addEventListener('transitionend', removeTransition);
  });

  function removeTransition(e) {
    if(e.propertyName !== 'transform') return false;

    this.classList.remove('playing');
  }

  window.addEventListener('keydown', playSound);
}());