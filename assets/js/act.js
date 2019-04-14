function acts() {
  var element = document.getElementById('acts');

  for (i=0; i < element.childElementCount; i++) {
    act = element.children[i];
    act.addEventListener('click', showAct, false);
  }
}

function showAct(event) {
  var act = event.currentTarget;
  if (act.classList.contains('show')) {
    act.classList.remove('show');
  }
  else {
    act.classList.add('show');
  }
}

document.addEventListener('DOMContentLoaded', acts, false);