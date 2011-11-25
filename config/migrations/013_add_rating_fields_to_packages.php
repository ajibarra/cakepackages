<?php
class M4ed01f47a92c4db5bb92693675f6eb26 extends CakeMigration {

/**
 * Migration description
 *
 * @var string
 * @access public
 */
	public $description = '';

/**
 * Actions to be performed
 *
 * @var array $migration
 * @access public
 */
	public $migration = array(
		'up' => array(
			'create_field' => array(
				'packages' => array(
					'rating' => array('type' => 'float', 'null' => true, 'default' => NULL),
					'rating_count' => array('type' => 'integer', 'null' => true, 'default' => NULL),
					'rating_sum' => array('type' => 'integer', 'null' => true, 'default' => NULL),
				),
			),
		),
		'down' => array(
			'drop_field' => array(
				'packages' => array('rating', 'rating_count', 'rating_sum',),
			),
		),
	);

/**
 * Before migration callback
 *
 * @param string $direction, up or down direction of migration process
 * @return boolean Should process continue
 * @access public
 */
	public function before($direction) {
		return true;
	}

/**
 * After migration callback
 *
 * @param string $direction, up or down direction of migration process
 * @return boolean Should process continue
 * @access public
 */
	public function after($direction) {
		return true;
	}
}
?>