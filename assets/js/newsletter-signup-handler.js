
function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function validation(form) {
  var elements = form.elements;

  for (i=0; i < elements.length; i++) {
    if (elements[i].type == "email") {
      if(!validEmail(elements[i].value)) {
        document.getElementById('email-invalid')
          .style.display = 'block';
        return false;
      }
    }

    if (elements[i].type == "name" &&
        elements[i].value == "") {
      document.getElementById('empty-fields')
          .style.display = 'block';
      return false;
    }
  }

  return true;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prepareNewsletterForm(form) {
  for (i=0; i < form.elements.length; i++) {
    if (form.elements[i].name == "name") {
      var nameFields = form.elements[i].value.split(" ");

      if (nameFields[0]) {
        nameFields[0] = capitalizeFirstLetter(nameFields[0]);
        document.getElementById("MERGE1").value = nameFields[0];
      }

      if (nameFields[1]) {
        nameFields[1] = capitalizeFirstLetter(nameFields[1]);
        document.getElementById("MERGE2").value = nameFields[1];
      }
    }
  }
}

function getFormData(form) {
  var elements = form.elements; // all form elements
  var fields = Object.keys(elements).map(function(k) {
  if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k){
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append 
                                              // the current checked value to 
                                              // the end of it, along with 
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space 
                                  // from the  string to make the output 
                                  // prettier in the spreadsheet
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });
  console.log(data);
  return data;
}

function handleFormSubmit(event) {
  event.preventDefault();
  prepareNewsletterForm(event.currentTarget);
  var data = getFormData(event.currentTarget);
  if (validation(event.currentTarget)) {
    var url = event.target.action;  //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type',
      'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        console.log( xhr.status, xhr.statusText )
        console.log(xhr.responseText);
        document.getElementById('newsletter')
          .setAttribute('class', 'submitted');
        document.getElementById('thanks').style.display = 'block';
        return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
  }
}
function loaded() {
  console.log('Newsletter signup handler loaded successfully');
  // bind to the submit event of our form
  var newsletterForm = document.getElementById('newsletter');
  newsletterForm.addEventListener("submit",
    handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);
