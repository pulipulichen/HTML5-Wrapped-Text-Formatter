/* global FormPersistence */

$(() => {
  let form = document.getElementById('submitToGoogleTransForm');
  FormPersistence.persist(form);
})
  