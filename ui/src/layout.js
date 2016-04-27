import React from 'react';

export default function Layout({ children }) {
	return (
		<div className='panel-collection'>
			<h1>Panel Prototyping</h1>
			{children}
		</div>
	)
}
