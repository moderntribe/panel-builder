<?php


namespace ModularContent;

/**
 * Class ViewFinder
 *
 * @package ModularContent
 *
 * Locates templates in the specified directories.
 */
class ViewFinder {
	protected $directories = array();

	/**
	 * @param string $directory The absolute path to a directory containing template files
	 */
	public function __construct( $directory = '' ) {
		if ( $directory ) {
			$this->add_directory($directory);
		}
	}

	/**
	 * Add a directory to the list of possible template paths
	 *
	 * @param string $directory The absolute path to a directory containing template files
	 */
	public function add_directory( $directory ) {
		$this->directories[] = $directory;
	}

	/**
	 * Remove a directory from the list of possible template paths
	 *
	 * @param string $directory
	 *
	 * @return void
	 */
	public function remove_directory( $directory ) {
		$index = array_search($directory, $this->directories);
		if ( $index !== FALSE ) {
			unset($this->directories[$index]);
		}
	}

	/**
	 * Get the path to a template file.
	 *
	 * Search starts in the current theme's 'modular-content' directory,
	 * the searches in order through the directories configured for this
	 * ViewFinder instance.
	 *
	 * @param string $basename
	 *
	 * @return string|bool The absolute path to the preferred template file,
	 *                     or FALSE if no templates was found
	 */
	public function locate_theme_file( $basename ) {
		$file = locate_template('modular-content'.DIRECTORY_SEPARATOR.$basename);
		if ( $file ) {
			return $file;
		}
		foreach ( $this->directories as $d ) {
			if ( file_exists($d.DIRECTORY_SEPARATOR.$basename) ) {
				return $d.DIRECTORY_SEPARATOR.$basename;
			}
		}
		return FALSE;
	}
} 