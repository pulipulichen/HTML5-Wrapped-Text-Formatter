window.alert('okok')
function googleTranslateElementInit() {
  window.alert('okok2')
  try {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
  } catch (e) {
    window.alert(e)
  }
}
$.getScript('http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit')
