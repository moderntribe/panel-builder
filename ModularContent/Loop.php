<?php


namespace ModularContent;
use ArrayIterator;

/**
 * Class Loop
 *
 * @package ModularContent
 *
 * An iterator over a collection of panels
 */
class Loop {
	/** @var Panel */
	protected $panel = NULL;
	protected $collection = NULL;
	/** @var Panel[] */
	protected $panels = array();
	protected $vars = array();
	protected $vars_for_api = array();
	protected $settings = array();
	protected $panel_tree = array();
	protected $current_index = 0;
	protected $nest_indices = [];

	/** @var ArrayIterator */
	protected $iterator = NULL;

	public function __construct( $collection = NULL ) {
		if ( !empty($collection) ) {
			$this->reset($collection);
		}
	}

	public function render() {
		$rendered = '';
		while ( $this->have_panels() ) {
			$this->the_panel();
			$panel = $this->get_the_panel();
			$rendered .= $panel->render();
		}
		return $this->wrap($rendered);
	}

	public function reset( PanelCollection $collection ) {
		$this->panel = NULL;
		$this->collection = $collection;
		$this->panels = $collection->panels();
		$this->panel_tree = $collection->build_tree();
		$this->iterator = NULL;
	}

	public function rewind() {
		$this->panel = NULL;
		$this->iterator = NULL;
	}

	/**
	 * @return bool
	 */
	public function have_panels() {
		if ( empty($this->collection) ) {
			return FALSE;
		}
		if ( !isset($this->iterator) ) {
			return !empty($this->panels); // we haven't started yet
		}
		if ( !$this->iterator->valid() ) {
			return FALSE; // we're already past the end of the array
		}
		// does the iterator have more items past the current one
		return $this->iterator->count() > ($this->iterator->key()+1);
	}

	public function the_panel() {
		if ( !isset($this->iterator) ) {
			$this->get_iterator(); // get a new iterator. it starts out on the first item
		} else {
			$this->iterator->next(); // go to the next item in the existing iterator
		}
		if ( $this->iterator->valid() ) {
			$this->set_the_panel($this->iterator->current());
		} else {
			$this->set_the_panel(NULL);
		}
	}

	/**
	 * Get the iterator of the panels array
	 *
	 * @return ArrayIterator
	 */
	protected function get_iterator() {
		if ( !isset($this->iterator) ) {
			$this->iterator = new ArrayIterator($this->panel_tree);
		}
		return $this->iterator;
	}

	/**
	 * Set the current panel
	 *
	 * @param Panel $panel The current panel. Omit to reset to the
	 * current panel in the loop (e.g., if you've jumped to another
	 * panel and want to restore the state of the loop)
	 *
	 * @return void
	 */
	public function set_the_panel( Panel $panel = NULL ) {
		if ( empty($panel) && isset($this->iterator) && $this->iterator->valid() ) {
			$panel = $this->iterator->current();
		} elseif ( ! empty( $panel ) && isset( $this->iterator ) ) {
			$this->update_nest_indices( $panel );
		}

		if ( empty($panel) ) {
			$this->panel        = null;
			$this->vars         = array();
			$this->vars_for_api = array();
			$this->settings     = array();
		} else {
			$this->panel        = $panel;
			$this->vars         = $panel->get_template_vars();
			$this->vars_for_api = $panel->get_api_vars();
			$this->settings     = $panel->get_settings();
		}
	}

	/**
	 * Updates the nest indices array based on the current panel and depth.
	 *
	 * @param $panel
	 */
	private function update_nest_indices( Panel $panel ) {
		$current_depth = $panel->get_depth();

		// If our top-level iterator increases, we reset all of our nest indices back to the top level.
		if ( $this->iterator->key() !== $this->current_index ) {
			$this->current_index = $this->iterator->key();
			$this->nest_indices  = [ array_shift( $this->nest_indices ) ];
		}

		while ( ! empty( $this->nest_indices ) && $current_depth < max( array_keys( $this->nest_indices ) ) ) {
			array_pop( $this->nest_indices );
		}

		if ( ! array_key_exists( $current_depth, $this->nest_indices ) ) {
			$this->nest_indices[ $current_depth ] = 0;
			return;
		}

		$this->nest_indices[ $current_depth ] ++;
	}

	/**
	 * Returns the current nest index for the active panel.
	 *
	 * @return integer
	 */
	public function get_nest_index() {
		$depth = $this->panel->get_depth();
		if ( isset( $this->nest_indices[ $depth ] ) ) {
			return (integer) $this->nest_indices[ $depth ];
		} else {
			return 0;
		}
	}

	/**
	 * @return Panel
	 */
	public function get_the_panel() {
		return $this->panel;
	}

	/**
	 * @param string $name
	 * @return mixed
	 */
	public function get_var( $name ) {
		return $this->generic_get_var( $name, $this->vars );
	}

	/**
	 * @param string $name
	 *
	 * @return mixed
	 */
	public function get_var_for_api( $name ) {
		return $this->generic_get_var( $name, $this->vars_for_api );
	}

	/**
	 * @param $name
	 * @param $where
	 *
	 * @return string
	 */
	private function generic_get_var( $name, $where ) {
		if ( isset( $where[ $name ] ) ) {
			return $where[ $name ];
		}

		$parts = explode( '.', $name );
		if ( isset( $where[ $parts[0] ] ) ) {
			$component = $where[ $parts[0] ];
			for ( $i = 1; $i < count( $parts ); $i ++ ) {
				if ( ! is_array( $component ) || ! isset( $component[ $parts[ $i ] ] ) ) {
					return '';
				}
				$component = $component[ $parts[ $i ] ];
			}

			return $component;
		}

		return '';
	}

	/**
	 * @param string $name
	 * @return mixed
	 */
	public function get_setting( $name ) {
		if ( isset($this->settings[$name]) ) {
			return $this->settings[$name];
		}
		return '';
	}

	/**
	 * @return array
	 */
	public function vars() {
		return $this->vars;
	}

	/**
	 * @return array
	 */
	public function vars_for_api() {
		return $this->vars_for_api;
	}



	/**
	 * @param string $panels
	 * @return string
	 */
	protected function wrap( $panels ) {
		$template = $this->get_wrapper_template_path();
		if ( !$template ) {
			return $panels;
		}
		ob_start();
		include($template);
		return ob_get_clean();
	}

	protected function get_wrapper_template_path() {
		$viewfinder    = new ViewFinder( Plugin::plugin_path( 'public-views' ) );
		$template_file = $viewfinder->locate_theme_file( 'collection-wrapper.php' );

		$template_file = apply_filters( 'panels_collection_wrapper_template', $template_file, $viewfinder );

		return $template_file;
	}

	public function is_preview() {
		return filter_input( INPUT_GET, 'preview_panels', FILTER_VALIDATE_BOOLEAN );
	}

} 
