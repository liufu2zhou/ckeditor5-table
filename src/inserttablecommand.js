/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module table/tablecommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Position from '@ckeditor/ckeditor5-engine/src/model/position';

export default class InsertTableCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const doc = model.document;

		const validParent = _getValidParent( doc.selection.getFirstPosition() );

		this.isEnabled = model.schema.checkChild( validParent, 'table' );
	}

	/**
	 * Executes the command.
	 *
	 * @protected
	 * @param {Object} [options] Options for the executed command.
	 * @param {String} [options.rows=2] Number of rows to create in inserted table.
	 * @param {String} [options.columns=2] Number of columns to create in inserted table.
	 *
	 * @fires execute
	 */
	execute( options = {} ) {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const rows = parseInt( options.rows ) || 2;
		const columns = parseInt( options.columns ) || 2;

		const firstPosition = selection.getFirstPosition();
		const insertTablePosition = Position.createAfter( firstPosition.parent || firstPosition );

		model.change( writer => {
			const table = writer.createElement( 'table' );

			writer.insert( table, insertTablePosition );

			for ( let r = 0; r < rows; r++ ) {
				const row = writer.createElement( 'tableRow' );

				writer.insert( row, table, 'end' );

				for ( let c = 0; c < columns; c++ ) {
					const cell = writer.createElement( 'tableCell' );
					writer.insert( cell, row, 'end' );
				}
			}
		} );
	}
}

function _getValidParent( firstPosition ) {
	const parent = firstPosition.parent;
	return parent === parent.root ? parent : parent.parent;
}