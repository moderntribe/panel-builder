<?php


namespace ModularContent;


class ViewFinder {
	protected $directories = array();

	public function __construct( $directory = '' ) {
		if ( $directory ) {
			$this->add_directory($directory);
		}
	}

	public function add_directory( $directory ) {
		$this->directories[] = $directory;
	}

	public function remove_directory( $directory ) {
		$index = array_search($directory, $this->directories);
		if ( $index !== FALSE ) {
			unset($this->directories[$index]);
		}
	}

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