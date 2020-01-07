# Randy Anderson Form

This is my submission to the a Take Home Test from a potential employer. The task was to build a multi-step form that collects data and processes it via AJAX within WordPress.

To be honest, I would normally find a working solution in already written plugins to save time and money, so in this case I would have used Gravity Forms to create a multi-step form that submits via AJAX and collects the user's info.

However, anyone could do that and style the form to look like the design provided, so I hand-built the solution found in this plugin in order for my style of code to be reviewed.

Also, I would normally not include my SASS working files in a build-out like I have, but I'm sure that you would like to review how I wrote those styles as well.

## Installation

Upload the zip file to the directory using the WP Admin interface or unzip the contents into the wp-content/plugins directory manually. Activate the plugin, and you're good to go!

## Usage

Create a page and use the shortcode [ra-form] to add the form to your page.

The data collected will be added to a new WordPress CPT named "entries" which can be viewed in the WP Admin interface.
