jQuery(document).ready(function($) {
	// set beginning section and show it
	var currentSection = 0;
	showSection(currentSection);

	// if the next button is clicked, go forward one section
	$('#ra-button-next').click(function(e){
		changeSection(1);
	});

	// if the back button is clicked, go back one section
	$('#ra-button-back').click(function(){
		changeSection(-1);
	});

	function showSection(s) {
		// get all the sections and show the one passed through var s
		var sections = $('#ra-form section');
		$(sections[s]).show();

		// now we have to do a little button clean up.
		if (s == 0) {
			// no need for back button here, so hide it
			$('#ra-button-back').hide();
		} else {
			// make sure the back button is visible on step 2 and 3
			$('#ra-button-back').show();
		}
		if (s == (sections.length - 1)) {
			// on the last section, we need to change the button wording to submit
			$('#ra-button-next').html('Submit');
		} else {
			// make sure it says continue on all the other sections
			$('#ra-button-next').html('Continue');
		}
	}

	function changeSection(s) {
		// This function will figure out which section to display
		var sections = $('#ra-form section');
		// Exit the function if any field in the current tab is invalid, since the user needs to fix errors first
		if (s == 1 && !validateForm()) {
			// show error message
			$('#ra-results').html('Looks like there\'s an error...');
			if (currentSection == 1) {
				// if we're on step two, add the email format to the error message
				$('#ra-results').append('<br>Email Format: hello@gmail.com');
			}
			if (currentSection == 2) {
				// if we're on step three, add the phone format to the error message
				$('#ra-results').append('<br>Phone Format: (123) 456-7890');
			}
			// make sure to stop changing of the sections
			return false;
		} else {
			// reset the error message if there are no errors
			$('#ra-results').html('');
		}

		// Hide the current section
		$(sections[currentSection]).hide();

		// Increase or decrease the current section by 1:
		currentSection = currentSection + s;

		// if you have reached the end of the form...
		if (currentSection >= sections.length) {
			//...the form gets submitted
			submitForm();
			return false;
		}

		// Otherwise, display the correct section
		showSection(currentSection);
	}

	function validateForm() {
		// This function deals with validation of the form fields
		var sections, inputs, i, valid = true;
		sections = $('#ra-form section');
		inputs = $(sections[currentSection]).find('input');
		
		// A loop that checks every input field in the current section
		for (i = 0; i < inputs.length; i++) {
			// If a field is empty...
			if ($(inputs[i]).val() == '') {
				// add an "invalid" class to the field
				$(inputs[i]).addClass('invalid');
				// and set the current valid status to false
				valid = false;
			} else {
				// make sure to remove the class if it's cleared
				$(inputs[i]).removeClass('invalid');
			}
		}

		// validate the email address
		if (currentSection == 1) {
			valid = isValidEmail($(inputs[0]).val());
			if (!valid)
				$(inputs[0]).addClass('invalid');
		}

		// validate the phone number
		if (currentSection == 2) {
			valid = isValidPhone($(inputs[0]).val());
			if (!valid)
				$(inputs[0]).addClass('invalid');
		}

		// If the valid status is true, return valid
		return valid; // return the valid status
	}

	// regex testing for email
	function isValidEmail(email) {
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}

	// regex testing for phone
	function isValidPhone(phone) {
		var regex = /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/;
		return regex.test(phone);
	}

	// here we submit the form via ajax
	function submitForm() {
		var inputs = [];
		$('#ra-form input').each(function(index){
			inputs[index] = $(this).val();
		});

		// set up message area and data
		var results = $('#ra-results'), data = {
			'action': 'submitform',
			'firstName': inputs[0],
			'lastName': inputs[1],
			'emailAddress': inputs[2],
			'phoneNumber': inputs[3]
		};
		$.ajax({ 
			url : jra_submitform_params.ajaxurl, // AJAX handler
			data : data,
			type : 'POST',
			beforeSend : function ( xhr ) {
				results.text('Submitting...'); // change the message text to let the user know we're processing the data
			},
			success : function( data ){
				if( data ) {
					// success! hide the form and display the message
					$('#ra-form button').hide(); 
					results.html(data);
				} else {
					// failure... let the user know so they can try again.
					results.html('There was a problem.');
				}
			}
		});
	}
});