<?php
/**
 * Plain PHP: Motion Forge is a stylesheet, so a template only has to print the class names.
 * Tested on PHP 8.3 with Motion Forge 5.1.0. Run it with:  php -S localhost:8000 index.php
 */
$title = 'Hello from PHP';
$cards = array( 'One', 'Two', 'Three' );
?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Motion Forge with PHP</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge@5.1.0/dist/motion.min.css">
</head>
<body>
	<h1 class="sds-aurora-text"><?php echo htmlspecialchars( $title ); ?></h1>

	<?php foreach ( $cards as $label ) : ?>
		<div class="sds-card-stack-pop"><?php echo htmlspecialchars( $label ); ?></div>
	<?php endforeach; ?>

	<button class="sds-btn-amp">Deploy</button>
</body>
</html>
