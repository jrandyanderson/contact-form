<?php
/**
 * Plugin Name: Randy Anderson Form
 * Plugin URI: http://www.github.com/
 * Description: Plugin created by Randy Anderson for Health Coach Institute Take Home Test
 * Version: 1.0
 * Author: Randy Anderson
 * Author URI: http://www.crema.media/
 */

// Load our script and styles
add_action( 'wp_enqueue_scripts', 'enqueue_jra_stuff');
function enqueue_jra_stuff() {
	wp_register_style('ra-styles', plugins_url('/style.css',__FILE__ ));
	wp_enqueue_style( 'ra-styles' );
	wp_register_script( 'ra-scripts', plugins_url('/js/ra-script.js',__FILE__ ), array( 'jquery' ), '1.0.0', true);
	wp_localize_script( 'ra-scripts', 'jra_submitform_params', array(
        'ajaxurl' => site_url() . '/wp-admin/admin-ajax.php', // WordPress AJAX
    ) );
	wp_enqueue_script( 'ra-scripts' );
}

// Create a shortcode that will create our form
add_shortcode( 'ra-form', 'ra_form_shortcode' );
function ra_form_shortcode() {
   $jra_form_code = '<form id="ra-form" method="POST">
	<h2>Multi-step Form</h2>
	<section>
		<input type="text" id="ra-first-name" name="ra-first-name" placeholder="First Name" required>
		<input type="text" id="ra-last-name" name="ra-last-name" placeholder="Last Name" required>
	</section>
	<section>
		<div class="progress">
			<p>Step 2 of 3</p>
			<div class="progress-bar">
				<div class="progress-status step-2"></div>
			</div>
		</div>
		<input type="email" id="ra-email-address" name="ra-email-address" placeholder="Email Address" required>
	</section>
	<section>
		<div class="progress">
			<p>Step 3 of 3</p>
			<div class="progress-bar">
				<div class="progress-status step-3"></div>
			</div>
		</div>
		<input type="tel" id="ra-phone-number" name="ra-phone-number" placeholder="Phone Number" required>
	</section>
		<button type="button" id="ra-button-next">Submit</button>
		<button type="button" id="ra-button-back">Back</button>
		<p id="ra-results"></p>
</form>';
   return $jra_form_code;
}

// create a ajax handler to create a new entry post type when the form is submitted
add_action('wp_ajax_submitform', 'jra_submitform_ajax_handler');
function jra_submitform_ajax_handler(){
	// entry title will be first name + last name
	$postTitle = $_POST['firstName'] . ' ' . $_POST['lastName'];
	// slug is just the title lowercased and with a hyphen
	$postSlug = str_replace(' ', '-', $postTitle);
	// create entry
	$postID = wp_insert_post( 
		array(
			'comment_status'	=>	'closed',
			'ping_status'		=>	'closed',
			'post_author'		=>	1,
			'post_name'			=>	$postSlug,
			'post_title'		=>	$postTitle,
			'post_status'		=>	'publish',
			'post_type'			=>	'entries'
		)
	);
	// now add the contact info in as custom fields
	add_post_meta($postID, 'jra_entries_firstname', $_POST['firstName']);
	add_post_meta($postID, 'jra_entries_lastname', $_POST['lastName']);
	add_post_meta($postID, 'jra_entries_emailaddress', $_POST['emailAddress']);
	add_post_meta($postID, 'jra_entries_phonenumber', $_POST['phoneNumber']);
	// sucess! 
    echo 'Thank you, ' . $_POST['firstName'] . '! We\'ll be in touch!';
    // exit script
    die;
}


// Hooking up our function to theme setup
add_action( 'init', 'create_entries_posttype' );
// Our custom post type function
function create_entries_posttype() {
    register_post_type( 'entries',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'Entries' ),
                'singular_name' => __( 'Entry' )
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => 'entries'),
            'supports' => array( 'title', 'editor', 'custom-fields' )
        )
    );
}

?>