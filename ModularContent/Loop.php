<?php


namespace ModularContent;
use ArrayIterator;


class Loop {
	protected $panel = NULL;
	protected $collection = NULL;
	protected $panels = array();
	protected $vars = array();
	protected $settings = array();

	/** @var ArrayIterator */
	protected $iterator = NULL;

	public function reset( PanelCollection $collection ) {
		$this->panel = NULL;
		$this->collection = $collection;
		$this->panels = $collection->panels();
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
			$this->iterator = new ArrayIterator($this->panels);
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
		}
		if ( empty($panel) ) {
			$this->panel = NULL;
			$this->vars = array();
			$this->settings = array();
		} else {
			$this->panel = $panel;
			$this->vars = $panel->get_template_vars();
			$this->settings = $panel->get_settings();
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
		if ( isset($this->vars[$name]) ) {
			return $this->vars[$name];
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


} 